package com.myraa.ai.network

import android.util.Base64
import android.util.Log
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.myraa.ai.BuildConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.TimeUnit

sealed class SessionStatus {
    object Disconnected : SessionStatus()
    object Connecting : SessionStatus()
    object Connected : SessionStatus()
    data class Error(val message: String) : SessionStatus()
}

class GeminiLiveClient {

    private val gson = Gson()
    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()

    private var webSocket: WebSocket? = null

    private val _sessionStatus = MutableStateFlow<SessionStatus>(SessionStatus.Disconnected)
    val sessionStatus: StateFlow<SessionStatus> = _sessionStatus

    private val _incomingAudio = MutableSharedFlow<ByteArray>(extraBufferCapacity = 64)
    val incomingAudio: SharedFlow<ByteArray> = _incomingAudio

    private val _incomingText = MutableSharedFlow<String>(extraBufferCapacity = 32)
    val incomingText: SharedFlow<String> = _incomingText

    private val _interruptedEvent = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val interruptedEvent: SharedFlow<Unit> = _interruptedEvent

    fun connectSession(
        apiKey: String = BuildConfig.GEMINI_API_KEY,
        systemInstruction: String = "You are MYRAA, a futuristic voice AI assistant.",
        scope: CoroutineScope
    ) {
        if (_sessionStatus.value is SessionStatus.Connected || _sessionStatus.value is SessionStatus.Connecting) return

        _sessionStatus.value = SessionStatus.Connecting

        val url = if (apiKey.isNotBlank()) {
            "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=$apiKey"
        } else {
            // Fallback proxy URL if configured
            "wss://myraa-ai.example.com/live"
        }

        val request = Request.Builder()
            .url(url)
            .build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(ws: WebSocket, response: Response) {
                Log.d("GeminiLiveClient", "WebSocket Connection Opened")
                _sessionStatus.value = SessionStatus.Connected

                // Send setup handshake JSON
                sendSetupHandshake(ws, systemInstruction)
            }

            override fun onMessage(ws: WebSocket, text: String) {
                scope.launch(Dispatchers.IO) {
                    handleIncomingJson(text)
                }
            }

            override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
                Log.e("GeminiLiveClient", "WebSocket Error: ${t.message}", t)
                _sessionStatus.value = SessionStatus.Error(t.message ?: "Network error")
            }

            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                Log.d("GeminiLiveClient", "WebSocket Closed: $reason")
                _sessionStatus.value = SessionStatus.Disconnected
            }
        })
    }

    private fun sendSetupHandshake(ws: WebSocket, systemPrompt: String) {
        val setupJson = """
        {
          "setup": {
            "model": "models/gemini-2.0-flash-exp",
            "generationConfig": {
              "responseModalities": ["AUDIO"],
              "speechConfig": {
                "voiceConfig": {
                  "prebuiltVoiceConfig": {
                    "voiceName": "Aoede"
                  }
                }
              }
            },
            "systemInstruction": {
              "parts": [
                {
                  "text": ${gson.toJson(systemPrompt)}
                }
              ]
            }
          }
        }
        """.trimIndent()

        ws.send(setupJson)
    }

    fun sendAudioChunk(pcmData: ByteArray) {
        val ws = webSocket ?: return
        if (_sessionStatus.value !is SessionStatus.Connected) return

        val base64Audio = Base64.encodeToString(pcmData, Base64.NO_WRAP)
        val jsonMsg = """
        {
          "realtimeInput": {
            "mediaChunks": [
              {
                "mimeType": "audio/pcm;rate=16000",
                "data": "$base64Audio"
              }
            ]
          }
        }
        """.trimIndent()

        ws.send(jsonMsg)
    }

    fun sendTextMessage(text: String) {
        val ws = webSocket ?: return
        if (_sessionStatus.value !is SessionStatus.Connected) return

        val jsonMsg = """
        {
          "clientContent": {
            "turns": [
              {
                "role": "user",
                "parts": [
                  {
                    "text": ${gson.toJson(text)}
                  }
                ]
              }
            ],
            "turnComplete": true
          }
        }
        """.trimIndent()

        ws.send(jsonMsg)
    }

    private suspend fun handleIncomingJson(jsonStr: String) {
        try {
            val root = gson.fromJson(jsonStr, JsonObject::class.java)

            // 1. Server content audio chunk
            if (root.has("serverContent")) {
                val serverContent = root.getAsJsonObject("serverContent")

                if (serverContent.has("interrupted") && serverContent.get("interrupted").asBoolean) {
                    _interruptedEvent.emit(Unit)
                }

                if (serverContent.has("modelTurn")) {
                    val modelTurn = serverContent.getAsJsonObject("modelTurn")
                    if (modelTurn.has("parts")) {
                        val parts = modelTurn.getAsJsonArray("parts")
                        for (partElem in parts) {
                            val part = partElem.asJsonObject
                            if (part.has("inlineData")) {
                                val inlineData = part.getAsJsonObject("inlineData")
                                val base64Data = inlineData.get("data").asString
                                val rawBytes = Base64.decode(base64Data, Base64.DEFAULT)
                                _incomingAudio.emit(rawBytes)
                            }
                            if (part.has("text")) {
                                val textVal = part.get("text").asString
                                _incomingText.emit(textVal)
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("GeminiLiveClient", "Error parsing incoming JSON", e)
        }
    }

    fun disconnectSession() {
        try {
            webSocket?.close(1000, "User disconnected")
        } catch (e: Exception) {
            Log.e("GeminiLiveClient", "Error closing WebSocket", e)
        } finally {
            webSocket = null
            _sessionStatus.value = SessionStatus.Disconnected
        }
    }
}
