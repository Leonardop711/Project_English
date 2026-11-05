import { ChiptuneTrack, CHIPTUNE_TRACKS, NOTE_FREQS } from './ChiptuneTracks';

export class ChiptunePlayer {
  private ctx: AudioContext | null = null;
  private outputNode: AudioNode | null = null;
  private bgmGain: GainNode | null = null;

  private currentTrack: ChiptuneTrack = CHIPTUNE_TRACKS[0];
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.45; // Default BGM volume (nicely balanced with typing notes)

  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private timerId: number | null = null;
  private combo: number = 0;

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
    if (this.bgmGain && this.ctx && !this.isMuted) {
      this.bgmGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (!this.ctx || !this.bgmGain) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.1;
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
   * Temporary pitch drop and pause when the user makes a typo in the code
   */
  public triggerGlitch() {
    if (!this.ctx || !this.bgmGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    // Momentary drop in BGM volume + detune glitch
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(0.01, now);
    this.bgmGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.volume, now + 0.28);
  }

  /**
   * Rock-solid Web Audio step scheduler with lookahead
   */
  private scheduler = () => {
    if (!this.isPlaying || !this.ctx) return;

    // Schedule any notes that fall within the next 100ms
    const lookahead = 0.1;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      this.playStep(this.currentStep, this.nextStepTime);
      this.advanceStep();
    }

    this.timerId = window.setTimeout(this.scheduler, 25);
  };

  private advanceStep() {
    const secondsPerBeat = 60.0 / this.currentTrack.bpm;
    // 16th note steps = beat / 4
    const stepDuration = secondsPerBeat / 4;
    this.nextStepTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % this.currentTrack.drums.length;
  }

  private playStep(step: number, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    const track = this.currentTrack;
    const secondsPerBeat = 60.0 / track.bpm;
    const stepDuration = secondsPerBeat / 4;

    // 1. Channel 4: 8-Bit Noise Drums (Plays always as rhythm base)
    const drumToken = track.drums[step % track.drums.length];
    if (drumToken && drumToken !== '-') {
      this.playDrum(drumToken, time);
    }

    // 2. Channel 3: 8-Bit Triangle Bass (Plays always for harmonic drive)
    const bassNote = track.bass[step % track.bass.length];
    if (bassNote && bassNote !== '-') {
      this.playBassNote(bassNote, time, stepDuration * 0.95);
    }

    // 3. Channel 1: 8-Bit Square Lead (Unlocks with combo >= 5)
    if (this.combo >= 5) {
      const leadNote = track.lead[step % track.lead.length];
      if (leadNote && leadNote !== '-') {
        this.playLeadNote(leadNote, time, stepDuration * 0.85);
      }
    }

    // 4. Channel 2: 8-Bit Arpeggio Harmony (Unlocks with combo >= 10)
    if (this.combo >= 10) {
      const arpNote = track.arp[step % track.arp.length];
      if (arpNote && arpNote !== '-') {
        this.playArpNote(arpNote, time, stepDuration * 0.5);
      }
    }
  }

  /**
   * Channel 1: Square wave lead
   */
  private playLeadNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    // High combo vibrato / pitch sparkle
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

  /**
   * Channel 2: Fast Square Arpeggio
   */
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

  /**
   * Channel 3: NES Triangle Bass
   */
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

  /**
   * Channel 4: 8-Bit Noise Drums
   */
  private playDrum(token: string, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    if (token === 'K') {
      // 8-Bit Kick: Fast punchy pitch-drop
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
      // 8-Bit Snare: Bandpass filtered noise burst + tone
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
      // 8-Bit Hi-hat: Snappy metallic noise
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
    }
  }
}

export const chiptunePlayer = new ChiptunePlayer();
