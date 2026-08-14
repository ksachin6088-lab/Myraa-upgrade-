import { float32ToInt16PCM, arrayBufferToBase64 } from './PCMEncoder';
import { AudioAnalyzer } from './AudioAnalyzer';

export interface AudioStreamerConfig {
  onAudioData: (base64Pcm16: string) => void;
  onInterruptionTriggered?: () => void;
  onError?: (err: Error) => void;
}

export class AudioStreamer {
  private mediaStream: MediaStream | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private analyzer: AudioAnalyzer;
  private isStreaming: boolean = false;
  private config: AudioStreamerConfig;
  private isAssistantSpeaking: boolean = false;
  private interruptionThreshold: number = 0.12; // RMS sensitivity for user interruption

  constructor(config: AudioStreamerConfig) {
    this.config = config;
    this.analyzer = new AudioAnalyzer();
  }

  public setAssistantSpeaking(speaking: boolean) {
    this.isAssistantSpeaking = speaking;
  }

  public async start(): Promise<boolean> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioCtx = new AudioContextClass({ sampleRate: 16000 });
      if (this.inputAudioCtx.state === 'suspended') {
        await this.inputAudioCtx.resume();
      }

      this.sourceNode = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.inputAudioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyzer.setAnalyser(this.analyserNode);

      // Create processor node (buffer size 2048 (~128ms at 16kHz))
      this.processorNode = this.inputAudioCtx.createScriptProcessor(2048, 1, 1);

      this.processorNode.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!this.isStreaming) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate RMS volume for interruption detection
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);

        // Check for interruption if assistant is speaking and user starts talking loudly
        if (this.isAssistantSpeaking && rms > this.interruptionThreshold) {
          this.config.onInterruptionTriggered?.();
        }

        // Convert Float32Array to 16kHz PCM16 ArrayBuffer
        const pcm16Buffer = float32ToInt16PCM(inputData);
        const base64Pcm = arrayBufferToBase64(pcm16Buffer);

        this.config.onAudioData(base64Pcm);
      };

      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.processorNode);
      this.processorNode.connect(this.inputAudioCtx.destination);

      this.isStreaming = true;
      return true;
    } catch (err: any) {
      this.config.onError?.(err instanceof Error ? err : new Error(String(err)));
      this.stop();
      return false;
    }
  }

  public stop() {
    this.isStreaming = false;
    if (this.processorNode) {
      this.processorNode.onaudioprocess = null;
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioCtx && this.inputAudioCtx.state !== 'closed') {
      this.inputAudioCtx.close();
      this.inputAudioCtx = null;
    }
  }

  public getVolume(): number {
    return this.analyzer.getVolume();
  }

  public getFrequencies(): number[] {
    return this.analyzer.getFrequencies();
  }

  public isActive(): boolean {
    return this.isStreaming;
  }
}
