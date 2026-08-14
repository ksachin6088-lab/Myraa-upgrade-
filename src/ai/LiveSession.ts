import { AssistantState, PersonalityMode, LanguageMode } from '../types';
import { ToolManager } from './ToolManager';

export interface LiveSessionCallbacks {
  onStateChange: (state: AssistantState) => void;
  onAudioReceived: (base64Pcm24: string) => void;
  onTranscriptReceived: (sender: 'user' | 'myraa', text: string, isFinal: boolean) => void;
  onInterrupted: () => void;
  onToolExecuted: (toolName: string, args: any, result: any) => void;
  onError: (error: string) => void;
}

export class LiveSession {
  private ws: WebSocket | null = null;
  private callbacks: LiveSessionCallbacks;
  private isConnected: boolean = false;
  private currentMode: PersonalityMode = 'casual';
  private currentLanguage: LanguageMode = 'auto';

  constructor(callbacks: LiveSessionCallbacks) {
    this.callbacks = callbacks;
  }

  public async connect(mode: PersonalityMode = 'casual', language: LanguageMode = 'auto'): Promise<boolean> {
    this.currentMode = mode;
    this.currentLanguage = language;
    this.callbacks.onStateChange('connecting');

    return new Promise((resolve) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/live`;
        
        this.ws = new WebSocket(wsUrl);

        const connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            console.warn('WebSocket connection timeout, falling back to HTTP REST mode');
            this.callbacks.onStateChange('listening');
            resolve(true); // Graceful fallback
          }
        }, 4000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          this.isConnected = true;
          // Send initial session setup message
          this.ws?.send(
            JSON.stringify({
              type: 'init',
              mode,
              language,
              tools: ToolManager.getDeclarations(),
            })
          );
          this.callbacks.onStateChange('listening');
          resolve(true);
        };

        this.ws.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'audio' && data.audio) {
              this.callbacks.onStateChange('speaking');
              this.callbacks.onAudioReceived(data.audio);
            } else if (data.type === 'text') {
              this.callbacks.onTranscriptReceived('myraa', data.text, data.isFinal ?? true);
            } else if (data.type === 'interrupted') {
              this.callbacks.onInterrupted();
              this.callbacks.onStateChange('listening');
            } else if (data.type === 'tool_call') {
              this.callbacks.onStateChange('thinking');
              const { callId, name, args } = data;
              const toolResult = await ToolManager.execute(name, args);
              this.callbacks.onToolExecuted(name, args, toolResult);

              // Reply back to server with tool response
              if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(
                  JSON.stringify({
                    type: 'tool_response',
                    callId,
                    name,
                    result: toolResult,
                  })
                );
              }
            } else if (data.type === 'error') {
              this.callbacks.onError(data.message || 'Server session error');
            }
          } catch (e: any) {
            console.error('WebSocket message parsing error:', e);
          }
        };

        this.ws.onerror = (err) => {
          console.warn('WebSocket error:', err);
          this.callbacks.onError('Connection error. Operating in fallback voice mode.');
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.callbacks.onStateChange('disconnected');
        };
      } catch (err: any) {
        console.error('Failed to initiate WebSocket session:', err);
        this.callbacks.onStateChange('listening'); // Fallback mode active
        resolve(true);
      }
    });
  }

  public sendAudioChunk(base64Pcm16: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'audio',
          audio: base64Pcm16,
        })
      );
    }
  }

  public async sendTextMessage(text: string): Promise<string | null> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.callbacks.onStateChange('thinking');
      this.ws.send(
        JSON.stringify({
          type: 'text',
          text,
        })
      );
      return null;
    } else {
      // Fallback via Express REST API
      return this.sendRestChat(text);
    }
  }

  private async sendRestChat(text: string): Promise<string | null> {
    try {
      this.callbacks.onStateChange('thinking');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: this.currentMode,
          language: this.currentLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server request failed');

      const reply = data.text || 'I understood your request.';
      this.callbacks.onTranscriptReceived('myraa', reply, true);

      // If tool was executed on server
      if (data.toolCall) {
        const { name, args } = data.toolCall;
        const result = await ToolManager.execute(name, args);
        this.callbacks.onToolExecuted(name, args, result);
      }

      // Fetch speech TTS audio chunk if available
      this.fetchSpeechForText(reply);

      return reply;
    } catch (err: any) {
      this.callbacks.onError(err.message || 'Failed to process request');
      this.callbacks.onStateChange('listening');
      return null;
    }
  }

  private async fetchSpeechForText(text: string) {
    try {
      const res = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          this.callbacks.onStateChange('speaking');
          this.callbacks.onAudioReceived(data.audio);
        }
      }
    } catch (e) {
      // Speech fallback silent error
      this.callbacks.onStateChange('listening');
    }
  }

  public sendInterruptionSignal() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'interrupt' }));
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.callbacks.onStateChange('disconnected');
  }

  public isSessionActive(): boolean {
    return this.isConnected;
  }
}
