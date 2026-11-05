import { ChiptuneTrack, CHIPTUNE_TRACKS, NOTE_FREQS } from './ChiptuneTracks';

export type SoundProfile = 'synthwave' | 'piano' | 'edm' | 'chiptune';

export class ChiptunePlayer {
  private ctx: AudioContext | null = null;
  private outputNode: AudioNode | null = null;
  private bgmGain: GainNode | null = null;

  private currentTrack: ChiptuneTrack = CHIPTUNE_TRACKS[0];
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.5; // Default BGM volume
  private soundProfile: SoundProfile = 'synthwave'; // Default: Modern Hi-Fi Synthwave

  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private timerId: number | null = null;
  private combo: number = 0;

  // Noise buffer for drums
  private noiseBuffer: AudioBuffer | null = null;

  // Beat listeners (quarter notes: 0, 1, 2, 3)
  private beatListeners: Array<(beatIndex: number, bpm: number) => void> = [];

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

  public subscribeBeat(listener: (beatIndex: number, bpm: number) => void) {
    this.beatListeners.push(listener);
    return () => {
      this.beatListeners = this.beatListeners.filter((l) => l !== listener);
    };
  }

  public setSoundProfile(profile: SoundProfile) {
    this.soundProfile = profile;
  }

  public getSoundProfile(): SoundProfile {
    return this.soundProfile;
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
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(0.01, now);
    this.bgmGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.volume, now + 0.28);
  }

  /**
   * Web Audio step scheduler with lookahead
   */
  private scheduler = () => {
    if (!this.isPlaying || !this.ctx) return;

    const lookahead = 0.1;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      this.playStep(this.currentStep, this.nextStepTime);
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
    if (!this.ctx || !this.bgmGain) return;

    const track = this.currentTrack;
    const secondsPerBeat = 60.0 / track.bpm;
    const stepDuration = secondsPerBeat / 4;

    // Trigger visual beat indicator on quarter notes (steps 0, 4, 8, 12...)
    if (step % 4 === 0) {
      const beatNum = Math.floor(step / 4) % 4;
      const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
      window.setTimeout(() => {
        if (this.isPlaying) {
          this.beatListeners.forEach((l) => l(beatNum, track.bpm));
        }
      }, delayMs);
    }

    // 1. Drum Channel
    const drumToken = track.drums[step % track.drums.length];
    if (drumToken && drumToken !== '-') {
      this.playDrum(drumToken, time);
    }

    // 2. Bassline Channel
    const bassNote = track.bass[step % track.bass.length];
    if (bassNote && bassNote !== '-') {
      this.playBassNote(bassNote, time, stepDuration * 0.95);
    }

    // 3. Lead Channel (Unlocks with combo >= 5)
    if (this.combo >= 5) {
      const leadNote = track.lead[step % track.lead.length];
      if (leadNote && leadNote !== '-') {
        this.playLeadNote(leadNote, time, stepDuration * 0.85);
      }
    }

    // 4. Arpeggio Channel (Unlocks with combo >= 10)
    if (this.combo >= 10) {
      const arpNote = track.arp[step % track.arp.length];
      if (arpNote && arpNote !== '-') {
        this.playArpNote(arpNote, time, stepDuration * 0.5);
      }
    }
  }

  /**
   * Channel 1: Lead Melody
   */
  private playLeadNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const isHiFi = this.soundProfile !== 'chiptune';

    const osc = this.ctx.createOscillator();
    osc.type = isHiFi ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    const leadVol = this.combo >= 20 ? 0.22 : 0.16;
    gain.gain.setValueAtTime(leadVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    if (isHiFi) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, time);
      filter.frequency.exponentialRampToValueAtTime(1000, time + duration);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.bgmGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * Channel 2: Arpeggio
   */
  private playArpNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    osc.type = this.soundProfile === 'piano' ? 'sine' : this.soundProfile !== 'chiptune' ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * Channel 3: Bassline (Warm Moog Bass in Hi-Fi, Triangle in 8-Bit)
   */
  private playBassNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    if (this.soundProfile !== 'chiptune') {
      // Modern Warm Synthwave Bass
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 0.5, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);
      filter.Q.setValueAtTime(3, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      subOsc.start(time);
      osc.stop(time + duration);
      subOsc.stop(time + duration);
    } else {
      // Classic 8-Bit Triangle Bass
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
    }
  }

  /**
   * Channel 4: Drum Hits (Modern Punchy EDM/Synthwave in Hi-Fi, Noise in 8-Bit)
   */
  private playDrum(token: string, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    const isHiFi = this.soundProfile !== 'chiptune';

    if (token === 'K') {
      // Kick Drum
      const osc = this.ctx.createOscillator();
      osc.type = isHiFi ? 'sine' : 'square';
      // Punch pitch sweep: 150Hz -> 42Hz
      osc.frequency.setValueAtTime(isHiFi ? 150 : 130, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.08);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isHiFi ? 0.42 : 0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.13);
    } else if (token === 'S') {
      // Snare Drum (Noise + Body Punch)
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = isHiFi ? 'bandpass' : 'bandpass';
      filter.frequency.setValueAtTime(isHiFi ? 1800 : 1400, time);
      filter.Q.setValueAtTime(isHiFi ? 1.8 : 3, time);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(isHiFi ? 0.28 : 0.25, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + (isHiFi ? 0.18 : 0.12));

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.2);

      // Hi-Fi body snap tone
      if (isHiFi) {
        const bodyOsc = this.ctx.createOscillator();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(190, time);
        bodyOsc.frequency.exponentialRampToValueAtTime(80, time + 0.06);

        const bodyGain = this.ctx.createGain();
        bodyGain.gain.setValueAtTime(0.2, time);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(this.bgmGain);

        bodyOsc.start(time);
        bodyOsc.stop(time + 0.09);
      }
    } else if (token === 'H') {
      // Hi-Hat (Crisp Metallic Sizzle)
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(isHiFi ? 8200 : 7500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isHiFi ? 0.12 : 0.1, time);
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
