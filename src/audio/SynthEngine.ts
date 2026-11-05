/**
 * SynthEngine: High-Performance Cyberpunk Web Audio Synthesizer
 * Generates dynamic reactive electronic music according to code typing accuracy.
 * Features an individual, distinct musical pitch and timbre for EVERY single key on the keyboard!
 */

import { chiptunePlayer } from './ChiptunePlayer';
import { SyncedNote } from './SyncedMelodies';

// Full chromatic/harmonic frequency map (Key of D / Multi-Octave Synth Matrix)
export interface KeySoundProfile {
  note: string;
  freq: number;
  wave: OscillatorType;
  filterFreq: number;
  decay: number; // in seconds
  volume: number;
  type: 'bass' | 'lead' | 'chime' | 'percussion' | 'syntax' | 'kick';
}

export const KEY_SOUND_MAP: Record<string, KeySoundProfile> = {
  // --- VOWELS (Warm, resonant melodic anchors) ---
  'a': { note: 'D4', freq: 293.66, wave: 'triangle', filterFreq: 3200, decay: 0.07, volume: 0.36, type: 'lead' },
  'A': { note: 'D5', freq: 587.33, wave: 'triangle', filterFreq: 4200, decay: 0.08, volume: 0.38, type: 'lead' },
  'e': { note: 'E4', freq: 329.63, wave: 'triangle', filterFreq: 3400, decay: 0.07, volume: 0.36, type: 'lead' },
  'E': { note: 'E5', freq: 659.25, wave: 'triangle', filterFreq: 4400, decay: 0.08, volume: 0.38, type: 'lead' },
  'i': { note: 'F4', freq: 349.23, wave: 'triangle', filterFreq: 3600, decay: 0.07, volume: 0.36, type: 'lead' },
  'I': { note: 'F5', freq: 698.46, wave: 'triangle', filterFreq: 4600, decay: 0.08, volume: 0.38, type: 'lead' },
  'o': { note: 'A4', freq: 440.00, wave: 'triangle', filterFreq: 3800, decay: 0.07, volume: 0.36, type: 'lead' },
  'O': { note: 'A5', freq: 880.00, wave: 'triangle', filterFreq: 4800, decay: 0.08, volume: 0.38, type: 'lead' },
  'u': { note: 'C5', freq: 523.25, wave: 'triangle', filterFreq: 4000, decay: 0.07, volume: 0.36, type: 'lead' },
  'U': { note: 'C6', freq: 1046.50, wave: 'triangle', filterFreq: 5000, decay: 0.08, volume: 0.38, type: 'lead' },

  // --- CONSONANTS (Lower Register: b, c, d, f, g) ---
  'b': { note: 'G3', freq: 196.00, wave: 'sawtooth', filterFreq: 1800, decay: 0.065, volume: 0.34, type: 'lead' },
  'c': { note: 'A3', freq: 220.00, wave: 'sawtooth', filterFreq: 2000, decay: 0.065, volume: 0.34, type: 'lead' },
  'd': { note: 'Bb3', freq: 233.08, wave: 'triangle', filterFreq: 2200, decay: 0.065, volume: 0.35, type: 'lead' },
  'f': { note: 'C4', freq: 261.63, wave: 'triangle', filterFreq: 2400, decay: 0.065, volume: 0.35, type: 'lead' },
  'g': { note: 'F#4', freq: 369.99, wave: 'triangle', filterFreq: 3000, decay: 0.065, volume: 0.36, type: 'lead' },

  // --- CONSONANTS (Mid Register: h, j, k, l, m) ---
  'h': { note: 'G4', freq: 392.00, wave: 'triangle', filterFreq: 3200, decay: 0.065, volume: 0.36, type: 'lead' },
  'j': { note: 'Ab4', freq: 415.30, wave: 'triangle', filterFreq: 3400, decay: 0.065, volume: 0.36, type: 'lead' },
  'k': { note: 'Bb4', freq: 466.16, wave: 'sawtooth', filterFreq: 3500, decay: 0.065, volume: 0.35, type: 'lead' },
  'l': { note: 'B4', freq: 493.88, wave: 'triangle', filterFreq: 3600, decay: 0.065, volume: 0.36, type: 'lead' },
  'm': { note: 'D5', freq: 587.33, wave: 'triangle', filterFreq: 3800, decay: 0.065, volume: 0.36, type: 'lead' },

  // --- CONSONANTS (High Register: n, p, q, r, s) ---
  'n': { note: 'Eb5', freq: 622.25, wave: 'triangle', filterFreq: 4000, decay: 0.065, volume: 0.36, type: 'lead' },
  'p': { note: 'G5', freq: 783.99, wave: 'sawtooth', filterFreq: 4200, decay: 0.065, volume: 0.35, type: 'lead' },
  'q': { note: 'Ab5', freq: 830.61, wave: 'sawtooth', filterFreq: 4400, decay: 0.065, volume: 0.35, type: 'lead' },
  'r': { note: 'Bb5', freq: 932.33, wave: 'triangle', filterFreq: 4600, decay: 0.065, volume: 0.36, type: 'lead' },
  's': { note: 'B5', freq: 987.77, wave: 'triangle', filterFreq: 4800, decay: 0.065, volume: 0.36, type: 'lead' },

  // --- CONSONANTS (Top Register: t, v, w, x, y, z) ---
  't': { note: 'D6', freq: 1174.66, wave: 'sine', filterFreq: 5200, decay: 0.06, volume: 0.35, type: 'lead' },
  'v': { note: 'E6', freq: 1318.51, wave: 'sine', filterFreq: 5400, decay: 0.06, volume: 0.35, type: 'lead' },
  'w': { note: 'F6', freq: 1396.91, wave: 'sine', filterFreq: 5600, decay: 0.06, volume: 0.35, type: 'lead' },
  'x': { note: 'G6', freq: 1567.98, wave: 'sine', filterFreq: 5800, decay: 0.06, volume: 0.34, type: 'lead' },
  'y': { note: 'A6', freq: 1760.00, wave: 'sine', filterFreq: 6000, decay: 0.06, volume: 0.34, type: 'lead' },
  'z': { note: 'B6', freq: 1975.53, wave: 'sine', filterFreq: 6200, decay: 0.06, volume: 0.33, type: 'lead' },

  // --- NUMBERS (Warm, punchy analog synth bass 0 - 9) ---
  '0': { note: 'D2', freq: 73.42, wave: 'sawtooth', filterFreq: 450, decay: 0.08, volume: 0.40, type: 'bass' },
  '1': { note: 'E2', freq: 82.41, wave: 'sawtooth', filterFreq: 500, decay: 0.08, volume: 0.40, type: 'bass' },
  '2': { note: 'F2', freq: 87.31, wave: 'sawtooth', filterFreq: 550, decay: 0.08, volume: 0.40, type: 'bass' },
  '3': { note: 'G2', freq: 98.00, wave: 'sawtooth', filterFreq: 600, decay: 0.08, volume: 0.40, type: 'bass' },
  '4': { note: 'A2', freq: 110.00, wave: 'sawtooth', filterFreq: 650, decay: 0.08, volume: 0.40, type: 'bass' },
  '5': { note: 'Bb2', freq: 116.54, wave: 'sawtooth', filterFreq: 700, decay: 0.08, volume: 0.40, type: 'bass' },
  '6': { note: 'C3', freq: 130.81, wave: 'sawtooth', filterFreq: 750, decay: 0.08, volume: 0.40, type: 'bass' },
  '7': { note: 'D3', freq: 146.83, wave: 'sawtooth', filterFreq: 800, decay: 0.08, volume: 0.40, type: 'bass' },
  '8': { note: 'E3', freq: 164.81, wave: 'sawtooth', filterFreq: 850, decay: 0.08, volume: 0.40, type: 'bass' },
  '9': { note: 'F3', freq: 174.61, wave: 'sawtooth', filterFreq: 900, decay: 0.08, volume: 0.40, type: 'bass' },

  // --- SPECIAL CONTROL KEYS ---
  ' ': { note: 'KICK-D2', freq: 65.41, wave: 'sine', filterFreq: 220, decay: 0.09, volume: 0.46, type: 'kick' },
  '\n': { note: 'ENTER-CHORD', freq: 440.00, wave: 'triangle', filterFreq: 4500, decay: 0.12, volume: 0.42, type: 'chime' },

  // --- SYNTAX, BRACKETS & PUNCTUATION ---
  '(': { note: 'F#5', freq: 739.99, wave: 'sine', filterFreq: 5000, decay: 0.07, volume: 0.38, type: 'syntax' },
  ')': { note: 'A5', freq: 880.00, wave: 'sine', filterFreq: 5200, decay: 0.07, volume: 0.38, type: 'syntax' },
  '{': { note: 'D6', freq: 1174.66, wave: 'triangle', filterFreq: 5500, decay: 0.07, volume: 0.38, type: 'syntax' },
  '}': { note: 'F#6', freq: 1479.98, wave: 'triangle', filterFreq: 6000, decay: 0.07, volume: 0.38, type: 'syntax' },
  '[': { note: 'E5', freq: 659.25, wave: 'triangle', filterFreq: 4500, decay: 0.065, volume: 0.36, type: 'syntax' },
  ']': { note: 'G5', freq: 783.99, wave: 'triangle', filterFreq: 4800, decay: 0.065, volume: 0.36, type: 'syntax' },
  '"': { note: 'E6', freq: 1318.51, wave: 'sine', filterFreq: 6500, decay: 0.08, volume: 0.38, type: 'chime' },
  "'": { note: 'C#6', freq: 1108.73, wave: 'sine', filterFreq: 6200, decay: 0.08, volume: 0.38, type: 'chime' },
  ';': { note: 'SNARE-TICK', freq: 2400.0, wave: 'triangle', filterFreq: 7500, decay: 0.05, volume: 0.34, type: 'percussion' },
  ':': { note: 'C6', freq: 1046.50, wave: 'sine', filterFreq: 5800, decay: 0.06, volume: 0.36, type: 'syntax' },
  '=': { note: 'D5+A5', freq: 587.33, wave: 'triangle', filterFreq: 4800, decay: 0.07, volume: 0.38, type: 'syntax' },
  '+': { note: 'F5', freq: 698.46, wave: 'triangle', filterFreq: 4600, decay: 0.065, volume: 0.36, type: 'syntax' },
  '-': { note: 'Eb4', freq: 311.13, wave: 'triangle', filterFreq: 3200, decay: 0.065, volume: 0.35, type: 'syntax' },
  '*': { note: 'G#5', freq: 830.61, wave: 'sine', filterFreq: 5200, decay: 0.07, volume: 0.36, type: 'syntax' },
  '/': { note: 'Bb5', freq: 932.33, wave: 'triangle', filterFreq: 4800, decay: 0.065, volume: 0.36, type: 'syntax' },
  '<': { note: 'D5', freq: 587.33, wave: 'sawtooth', filterFreq: 3800, decay: 0.065, volume: 0.35, type: 'syntax' },
  '>': { note: 'E5', freq: 659.25, wave: 'sawtooth', filterFreq: 4000, decay: 0.065, volume: 0.35, type: 'syntax' },
  '.': { note: 'A6', freq: 1760.00, wave: 'sine', filterFreq: 7000, decay: 0.045, volume: 0.32, type: 'percussion' },
  ',': { note: 'F6', freq: 1396.91, wave: 'sine', filterFreq: 6500, decay: 0.045, volume: 0.32, type: 'percussion' },
  '!': { note: 'D6', freq: 1174.66, wave: 'sawtooth', filterFreq: 6000, decay: 0.07, volume: 0.38, type: 'syntax' },
  '#': { note: 'G4', freq: 392.00, wave: 'triangle', filterFreq: 3500, decay: 0.065, volume: 0.36, type: 'syntax' },
  '_': { note: 'F2', freq: 87.31, wave: 'triangle', filterFreq: 400, decay: 0.08, volume: 0.38, type: 'bass' },
};

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
    this.masterGain.gain.setValueAtTime(0.44, this.ctx.currentTime);

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
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.44, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play distinct, individual note & sound for each key!
   * Every letter, number, and symbol has a unique frequency and timbre profile.
   */
  public playSyncedKeySound(stepIndex: number, combo: number = 0, char: string = ''): SyncedNote {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) {
      return { note: 'D4', freq: 293.66, type: 'lead' };
    }

    // Keep background beat alive and synced
    chiptunePlayer.setCombo(combo);
    chiptunePlayer.resumeBeat();

    const now = this.ctx.currentTime;
    const comboBonus = Math.min(combo / 30, 0.35);

    // Lookup profile for this exact character
    const profile = KEY_SOUND_MAP[char] || {
      note: 'D4',
      freq: 293.66 + ((stepIndex * 37) % 400),
      wave: 'triangle',
      filterFreq: 3500,
      decay: 0.065,
      volume: 0.35,
      type: 'lead',
    };

    // 1. Transient Mechanical Switch Click (Crisp physical feedback on every key)
    const clickOsc = this.ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(3800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(600, now + 0.009);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.25, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.009);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.011);

    // 2. Specific Timbre by Character Profile
    if (profile.type === 'kick') {
      // Spacebar: Sub Bass Kick Drum drop
      const kickOsc = this.ctx.createOscillator();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(130, now);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.09);

      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(profile.volume + comboBonus * 0.1, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.1);
    } else if (profile.type === 'chime') {
      // Quotes & Enter: Multi-tone bell / crystal shimmer
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(profile.freq, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(profile.freq * 1.5, now); // Fifth harmony

      const gain = this.ctx.createGain();
      const peak = profile.volume + comboBonus * 0.1;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decay);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + profile.decay + 0.01);
      osc2.stop(now + profile.decay + 0.01);
    } else {
      // Letters, Numbers, Syntax: Distinct snappy synth notes
      const osc = this.ctx.createOscillator();
      osc.type = profile.wave;
      osc.frequency.setValueAtTime(profile.freq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(profile.filterFreq, now);
      filter.frequency.exponentialRampToValueAtTime(profile.filterFreq * 0.4, now + profile.decay);

      const gain = this.ctx.createGain();
      const peak = profile.volume + comboBonus * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.003); // Instant attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decay); // Fast decay

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + profile.decay + 0.01);
    }

    return { note: profile.note, freq: profile.freq, type: 'lead' };
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

    chiptunePlayer.setCombo(0);
    chiptunePlayer.triggerTapeStop();

    const now = this.ctx.currentTime;

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

export const synthEngine = new SynthEngine();
