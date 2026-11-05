/**
 * SynthEngine: High-Performance Cyberpunk Web Audio Synthesizer
 * Generates dynamic reactive electronic music according to code typing accuracy.
 */

import { chiptunePlayer } from './ChiptunePlayer';
import { SyncedNote } from './SyncedMelodies';

// Cyber Pentatonic Scale (Key of D Minor - perfectly harmonic at any typing speed)
const PENTATONIC_SCALE = [
  { note: 'D4', freq: 293.66 },
  { note: 'F4', freq: 349.23 },
  { note: 'G4', freq: 392.00 },
  { note: 'A4', freq: 440.00 },
  { note: 'C5', freq: 523.25 },
  { note: 'D5', freq: 587.33 },
  { note: 'F5', freq: 698.46 },
  { note: 'G5', freq: 783.99 },
];

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;

  constructor() {}

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.42, this.ctx.currentTime);

    // Visualizer Analyser Node
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.85;

    // Route Master
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Initialize Chiptune Beat Player
    chiptunePlayer.init(this.ctx, this.masterGain);
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    chiptunePlayer.setMuted(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.42, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ultra-crisp, high-speed responsive typing synthesizer.
   * Engineered with a 3ms transient attack and 55ms rapid decay so fast typing
   * produces clean, distinct, rhythmic notes without any mud or distortion.
   */
  public playSyncedKeySound(stepIndex: number, combo: number = 0, char: string = ''): SyncedNote {
    if (!this.ctx || this.isMuted) this.init();
    const defaultNote: SyncedNote = { note: 'D4', freq: 293.66, type: 'lead' };
    if (!this.ctx || !this.masterGain) return defaultNote;

    // Sync combo and ensure background beat resumes
    chiptunePlayer.setCombo(combo);
    chiptunePlayer.resumeBeat();

    const now = this.ctx.currentTime;

    // 1. Contextual note selection according to character token
    let noteObj = PENTATONIC_SCALE[stepIndex % PENTATONIC_SCALE.length];

    if (char === ' ' || char === '\n') {
      noteObj = { note: 'D3', freq: 146.83 }; // Spacebar: warm, punchy sub-root click
    } else if (/[(){}[\];=,.<>:]/.test(char)) {
      noteObj = { note: 'A5', freq: 880.00 }; // Syntax symbols: crisp high glass tap
    } else if (/['"`]/.test(char)) {
      noteObj = { note: 'D6', freq: 1174.66 }; // String literals: crystal shimmer
    }

    const freq = noteObj.freq;
    const comboBoost = Math.min(combo / 30, 0.35);

    // 2. Transient Mechanical Click Layer (10ms transient for tactile snap)
    const clickOsc = this.ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(3600, now);
    clickOsc.frequency.exponentialRampToValueAtTime(700, now + 0.01);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.28, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.012);

    // 3. Crisp Melodic Tone (55ms rapid decay - hyper-responsive even at 150+ WPM)
    const oscMain = this.ctx.createOscillator();
    oscMain.type = 'triangle';
    oscMain.frequency.setValueAtTime(freq, now);

    const oscAir = this.ctx.createOscillator();
    oscAir.type = 'sine';
    oscAir.frequency.setValueAtTime(freq * 2, now); // 1-octave harmonic overtone for presence

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4800, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.05);

    const toneGain = this.ctx.createGain();
    const peakVolume = 0.36 + comboBoost * 0.12;
    toneGain.gain.setValueAtTime(0.001, now);
    toneGain.gain.linearRampToValueAtTime(peakVolume, now + 0.003); // Ultra-fast 3ms attack
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055); // 55ms clean release

    oscMain.connect(filter);
    oscAir.connect(filter);
    filter.connect(toneGain);
    toneGain.connect(this.masterGain);

    oscMain.start(now);
    oscAir.start(now);
    oscMain.stop(now + 0.06);
    oscAir.stop(now + 0.06);

    return { note: noteObj.note, freq: noteObj.freq, type: 'lead' };
  }

  public playKeySound(char: string, combo: number = 0) {
    return this.playSyncedKeySound(0, combo, char);
  }

  /**
   * Tape-Stop Distortion on mistake / error ("Don't Break the Beat")
   */
  public playGlitchDistortion() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Trigger tape-stop beat cut on mistake: "Don't Break the Beat!"
    chiptunePlayer.setCombo(0);
    chiptunePlayer.triggerTapeStop();

    const now = this.ctx.currentTime;

    // Dissonant low frequency buzzing saw + noise
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(116.54, now);
    osc.frequency.exponentialRampToValueAtTime(45.0, now + 0.22);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.Q.setValueAtTime(8, now);

    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(180) as unknown as Float32Array<ArrayBuffer>;
    distortion.oversample = '4x';

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  /**
   * Play triumphant cyber chords on level completion
   */
  public playVictoryFanfare() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    const chord = [293.66, 369.99, 440.0, 554.37, 659.25, 880.0];
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = now + idx * 0.08;

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, noteTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 1.3);
    });
  }

  private makeDistortionCurve(amount: number = 50): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

// Global Singleton Instance
export const synthEngine = new SynthEngine();
