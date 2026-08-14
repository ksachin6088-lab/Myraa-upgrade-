import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

const server = http.createServer(app);

// Initialize @google/genai SDK safely
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// REST Fallback Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, mode, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message prompt is required." });
    }

    if (!ai) {
      return res.json({
        text: `MYRAA here! I received: "${message}". (Note: GEMINI_API_KEY is not set in environment secrets, please add it in Settings > Secrets).`,
      });
    }

    const systemPrompt = `You are MYRAA, an advanced real-time voice AI assistant inspired by futuristic sci-fi control systems (JARVIS).
    - Mode: ${mode || "casual"}
    - Language: ${language || "auto"}
    - Rules: Be short, natural, witty, helpful. Support Hindi, Hinglish, and English naturally. No robotic phrases like "How may I assist you".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text || "I processed your request." });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI response." });
  }
});

// REST Fallback Speech Route (Text-to-Speech)
app.post("/api/speech", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !ai) {
      return res.status(400).json({ error: "Text or API key missing" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Aoede" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    } else {
      return res.status(500).json({ error: "No audio generated" });
    }
  } catch (err: any) {
    console.error("Error in /api/speech:", err);
    res.status(500).json({ error: err.message || "TTS failed" });
  }
});

// WebSocket Server for Gemini Live Session
const wss = new WebSocketServer({ server, path: "/live" });

wss.on("connection", async (clientWs: WebSocket) => {
  console.log("Client connected to MYRAA Live WebSocket");

  let liveSession: any = null;

  if (ai) {
    try {
      liveSession = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
          },
          systemInstruction: `You are MYRAA, a real-time voice AI assistant inspired by sci-fi HUDs. Speak naturally in Hindi, Hinglish, or English. Be witty, concise, friendly, and smart. Avoid robotic greetings.`,
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (clientWs.readyState !== WebSocket.OPEN) return;

            // Model audio chunk
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              clientWs.send(JSON.stringify({ type: "audio", audio: audioData }));
            }

            // Text output if transcribed
            const textPart = message.serverContent?.modelTurn?.parts?.[0]?.text;
            if (textPart) {
              clientWs.send(JSON.stringify({ type: "text", text: textPart }));
            }

            // Interruption signal
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: "interrupted" }));
            }

            // Function calling / Tool call
            const toolCall = message.toolCall;
            if (toolCall) {
              const call = toolCall.functionCalls?.[0];
              if (call) {
                clientWs.send(
                  JSON.stringify({
                    type: "tool_call",
                    callId: call.id,
                    name: call.name,
                    args: call.args,
                  })
                );
              }
            }
          },
          onerror: (err: any) => {
            console.error("Gemini Live Session Error:", err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: "error", message: "Live AI session error." }));
            }
          },
          onclose: () => {
            console.log("Gemini Live Session Closed");
          },
        },
      });
    } catch (e: any) {
      console.error("Failed to connect Gemini Live session:", e);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: "error", message: "Could not initialize Live session. HTTP fallback ready." }));
      }
    }
  }

  clientWs.on("message", (rawMsg) => {
    try {
      const msg = JSON.parse(rawMsg.toString());

      if (msg.type === "audio" && msg.audio && liveSession) {
        liveSession.sendRealtimeInput({
          audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
        });
      } else if (msg.type === "text" && msg.text && liveSession) {
        liveSession.sendRealtimeInput({
          text: msg.text,
        });
      } else if (msg.type === "tool_response" && liveSession) {
        liveSession.sendToolResponse({
          functionResponses: [
            {
              id: msg.callId,
              name: msg.name,
              response: { output: msg.result },
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error processing client WebSocket message:", err);
    }
  });

  clientWs.on("close", () => {
    console.log("Client disconnected from MYRAA Live WebSocket");
    if (liveSession) {
      try {
        liveSession.close();
      } catch (e) {}
    }
  });
});

// Vite Middleware for Development vs Production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`MYRAA AI Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
