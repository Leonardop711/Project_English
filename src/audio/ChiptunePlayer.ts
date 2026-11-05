import { ChiptuneTrack, CHIPTUNE_TRACKS, NOTE_FREQS } from './ChiptuneTracks';

export type BeatStatusCallback = (isBroken: boolean) => void;

export class ChiptunePlayer {
  private ctx: AudioContext | null = null;
  private outputNode: AudioNode | null = null;
  private bgmGain: GainNode | null = null;

  private currentTrack: ChiptuneTrack = CHIPTUNE_TRACKS[0];
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.45; // Default BGM volume
  private isBeatCut: boolean = false;

  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private timerId: number | null = null;
  private combo: number = 0;

  // Listeners for UI sync
  private beatStatusListeners: Set<BeatStatusCallback> = new Set();

  // Noise buffer for 8-bit drums
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {}

  public init(ctx: AudioContext, destination: AudioNode) {
    this.ctx = ctx;
    this.outputNode = destination;

    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.bgmGain.connect(this.outputNode);
    }

    this.createNoiseBuffer();
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  public subscribeBeatStatus(cb: BeatStatusCallback): () => void {
    this.beatStatusListeners.add(cb);
    cb(this.isBeatCut);
    return () => this.beatStatusListeners.delete(cb);
  }

  private notifyBeatStatus() {
    this.beatStatusListeners.forEach((cb) => cb(this.isBeatCut));
  }

  public getTracks(): ChiptuneTrack[] {
    return CHIPTUNE_TRACKS;
  }

  public getCurrentTrack(): ChiptuneTrack {
    return this.currentTrack;
  }

  public setTrack(trackId: string) {
    const found = CHIPTUNE_TRACKS.find((t) => t.id === trackId);
    if (found) {
      this.currentTrack = found;
      this.currentStep = 0;
      if (this.ctx) {
        this.nextStepTime = this.ctx.currentTime + 0.05;
      }
    }
  }

  public setCombo(combo: number) {
    this.combo = combo;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx && !this.isMuted && !this.isBeatCut) {
      this.bgmGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      const target = muted || this.isBeatCut ? 0 : this.volume;
      this.bgmGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public isBeatBroken(): boolean {
    return this.isBeatCut;
  }

  public start() {
    if (!this.ctx || !this.bgmGain) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isBeatCut = false;
    this.notifyBeatStatus();
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.1;
    this.bgmGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  /**
   * "Don't Break the Beat" Mechanic:
   * Instantly decelerates pitch and kills gain on typo with a tape-stop sound.
   */
  public triggerTapeStop() {
    if (!this.ctx || !this.bgmGain) return;
    this.isBeatCut = true;
    this.notifyBeatStatus();

    const now = this.ctx.currentTime;

    // 1. Cut the BGM gain immediately
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    // 2. Play Tape-Stop / Vinyl Scratch effect
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.22); // Rapid deceleration

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.22);

    const tapeGain = this.ctx.createGain();
    tapeGain.gain.setValueAtTime(0.35, now);
    tapeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(tapeGain);
    if (this.outputNode) {
      tapeGain.connect(this.outputNode);
    }

    osc.start(now);
    osc.stop(now + 0.24);
  }

  /**
   * Resume the beat when error is corrected or player continues typing cleanly
   */
  public resumeBeat() {
    if (!this.ctx || !this.bgmGain) return;

    if (!this.isPlaying) {
      this.start();
      return;
    }

    if (this.isBeatCut) {
      this.isBeatCut = false;
      this.notifyBeatStatus();

      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(0.001, now);
      this.bgmGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.volume, now + 0.05);

      // Play snappy kick pickup
      this.playDrum('K', now);
    }
  }

  public triggerGlitch() {
    this.triggerTapeStop();
  }

  /**
   * Rock-solid Web Audio step scheduler with lookahead
   */
  private scheduler = () => {
    if (!this.isPlaying || !this.ctx) return;

    // If beat is broken, don't play sound steps, but advance timer so we resume seamlessly
    const lookahead = 0.1;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      if (!this.isBeatCut) {
        this.playStep(this.currentStep, this.nextStepTime);
      }
      this.advanceStep();
    }

    this.timerId = window.setTimeout(this.scheduler, 25);
  };

  private advanceStep() {
    const secondsPerBeat = 60.0 / this.currentTrack.bpm;
    const stepDuration = secondsPerBeat / 4;
    this.nextStepTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % this.currentTrack.drums.length;
  }

  private playStep(step: number, time: number) {
    if (!this.ctx || !this.bgmGain || this.isBeatCut) return;

    const track = this.currentTrack;
    const secondsPerBeat = 60.0 / track.bpm;
    const stepDuration = secondsPerBeat / 4;

    // 1. Channel 4: Drums
    const drumToken = track.drums[step % track.drums.length];
    if (drumToken && drumToken !== '-') {
      this.playDrum(drumToken, time);
    }

    // 2. Channel 3: Bass
    const bassNote = track.bass[step % track.bass.length];
    if (bassNote && bassNote !== '-') {
      this.playBassNote(bassNote, time, stepDuration * 0.95);
    }

    // 3. Channel 1: Square Lead (combo >= 5)
    if (this.combo >= 5) {
      const leadNote = track.lead[step % track.lead.length];
      if (leadNote && leadNote !== '-') {
        this.playLeadNote(leadNote, time, stepDuration * 0.85);
      }
    }

    // 4. Channel 2: Arpeggio (combo >= 10)
    if (this.combo >= 10) {
      const arpNote = track.arp[step % track.arp.length];
      if (arpNote && arpNote !== '-') {
        this.playArpNote(arpNote, time, stepDuration * 0.5);
      }
    }
  }

  private playLeadNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    if (this.combo >= 20) {
      osc.frequency.setValueAtTime(freq * 1.005, time + duration * 0.5);
    }

    const gain = this.ctx.createGain();
    const leadVol = this.combo >= 20 ? 0.22 : 0.16;
    gain.gain.setValueAtTime(leadVol, time);
    gain.gain.setValueAtTime(leadVol, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playArpNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    const arpVol = 0.09;
    gain.gain.setValueAtTime(arpVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playBassNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    const bassVol = 0.25;
    gain.gain.setValueAtTime(bassVol, time);
    gain.gain.setValueAtTime(bassVol, time + duration * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playDrum(token: string, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    if (token === 'K') {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.08);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.1);
    } else if (token === 'S') {
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.Q.setValueAtTime(3, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.13);
    } else if (token === 'H') {
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.05);
    } else if (token === 'O') {
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.2);
    }
  }
}

export const chiptunePlayer = new ChiptunePlayer();
