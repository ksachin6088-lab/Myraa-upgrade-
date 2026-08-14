/**
 * Real-time audio analyzer wrapping Web Audio API AnalyserNode
 */

export class AudioAnalyzer {
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  constructor(analyserNode?: AnalyserNode) {
    if (analyserNode) {
      this.setAnalyser(analyserNode);
    }
  }

  public setAnalyser(analyserNode: AnalyserNode) {
    this.analyser = analyserNode;
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  public getVolume(): number {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const avg = sum / this.dataArray.length;
    return Math.min(1, avg / 128); // Normalized 0 to 1
  }

  public getFrequencies(): number[] {
    if (!this.analyser || !this.dataArray) return new Array(16).fill(0);
    this.analyser.getByteFrequencyData(this.dataArray);
    const result: number[] = [];
    const step = Math.floor(this.dataArray.length / 16);
    for (let i = 0; i < 16; i++) {
      const val = this.dataArray[i * step] || 0;
      result.push(val / 255);
    }
    return result;
  }
}
