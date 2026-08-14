import { base64ToFloat32ArrayPCM } from './PCMEncoder';
import { AudioAnalyzer } from './AudioAnalyzer';

export class AudioPlayer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private nextStartTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isPlaying: boolean = false;
  private analyzer: AudioAnalyzer;
  private onStateChange?: (isPlaying: boolean) => void;

  constructor(onStateChange?: (isPlaying: boolean) => void) {
    this.analyzer = new AudioAnalyzer();
    this.onStateChange = onStateChange;
  }

  private initContext() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.connect(this.audioCtx.destination);
      this.analyzer.setAnalyser(this.analyser);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public async playChunk(base64Audio: string) {
    this.initContext();
    if (!this.audioCtx || !this.analyser) return;

    const float32PCM = base64ToFloat32ArrayPCM(base64Audio);
    if (float32PCM.length === 0) return;

    const buffer = this.audioCtx.createBuffer(1, float32PCM.length, 24000);
    buffer.getChannelData(0).set(float32PCM);

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.analyser);

    const currentTime = this.audioCtx.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }

    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.activeSources.push(source);

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.onStateChange?.(true);
    }

    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) {
        this.activeSources.splice(idx, 1);
      }
      if (this.activeSources.length === 0 && this.audioCtx && this.audioCtx.currentTime >= this.nextStartTime) {
        this.isPlaying = false;
        this.onStateChange?.(false);
      }
    };
  }

  public stop() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // ignore already stopped sources
      }
    }
    this.activeSources = [];
    this.isPlaying = false;
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
    this.onStateChange?.(false);
  }

  public getVolume(): number {
    return this.analyzer.getVolume();
  }

  public getFrequencies(): number[] {
    return this.analyzer.getFrequencies();
  }

  public close() {
    this.stop();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }
    this.audioCtx = null;
  }
}
