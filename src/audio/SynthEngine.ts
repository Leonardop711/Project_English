/**
 * SynthEngine: High-Performance Cyberpunk Web Audio Synthesizer
 * Generates dynamic reactive electronic music according to code typing accuracy.
 */

import { chiptunePlayer } from './ChiptunePlayer';
import { SYNCED_MELODIES, SyncedMelody, SyncedNote } from './SyncedMelodies';

// Cyber Minor Pentatonic & Synthwave Aeolian Scale Frequencies (Key of D)
const CYBER_SCALE = [
  146.83, // D3 (Sub-low)
  174.61, // F3
  196.00, // G3
  220.00, // A3
  261.63, // C4
  293.66, // D4 (Root)
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5 (High Lead)
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00  // A5
];

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isMuted: boolean = false;
  private noteIndex: number = 0;
  private currentMelody: SyncedMelody = SYNCED_MELODIES[0]; // Default: Skrillex - Bangarang (8-Bit)

  constructor() {
    // Initialized on user interaction
  }

  public getMelodies(): SyncedMelody[] {
    return SYNCED_MELODIES;
  }

  public getCurrentMelody(): SyncedMelody {
    return this.currentMelody;
  }

  public setMelody(melodyId: string): SyncedMelody {
    const found = SYNCED_MELODIES.find((m) => m.id === melodyId);
    if (found) {
      this.currentMelody = found;
    }
    return this.currentMelody;
  }

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Visualizer Analyser Node
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.85;

    // Cyber Delay FX
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime); // ~125 BPM 8th note

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.masterGain);

    // Route Master
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Initialize 8-Bit Chiptune Player
    chiptunePlayer.init(this.ctx, this.masterGain);

    // Ambient Cyber Drone
    this.startDrone();
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    chiptunePlayer.setMuted(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Hypnotic root drone (D2: 73.42Hz, A2: 110Hz)
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(73.42, this.ctx.currentTime);

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(110.00, this.ctx.currentTime);
    this.droneOsc2.detune.setValueAtTime(4, this.ctx.currentTime);

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  /**
   * Play exact synchronized note from the active song (e.g. Bangarang 8-Bit)
   */
  public playSyncedKeySound(stepIndex: number, combo: number = 0): SyncedNote {
    if (!this.ctx || this.isMuted) this.init();
    const defaultNote = this.currentMelody.notes[0];
    if (!this.ctx || !this.masterGain) return defaultNote;

    // Synchronize combo with 8-bit chiptune groove
    chiptunePlayer.setCombo(combo);

    const notes = this.currentMelody.notes;
    const noteObj = notes[stepIndex % notes.length];
    const now = this.ctx.currentTime;
    const comboBoost = Math.min(combo / 30, 1);

    if (noteObj.type === 'growl') {
      // 8-BIT SKRILLEX DUBSTEP GROWL / WOBBLE BASS
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(noteObj.freq * 1.4, now);
      osc.frequency.exponentialRampToValueAtTime(noteObj.freq, now + 0.12);

      // Resonant sweep filter for iconic "WUB" vocal formant
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.26);
      filter.Q.setValueAtTime(8, now);

      // Sub-bass triangle anchor
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(noteObj.freq * 0.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.36 + comboBoost * 0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.masterGain);

      if (this.delayNode && combo >= 5) {
        gain.connect(this.delayNode);
      }

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 0.36);
      subOsc.stop(now + 0.36);
    } else if (noteObj.type === 'stutter') {
      // 8-BIT VOCAL / CHIP STUTTER: "BA-BA-BA-BANGARANG!"
      for (let i = 0; i < 3; i++) {
        const subTime = now + i * 0.045;
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(noteObj.freq * (1 + i * 0.04), subTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, subTime);
        gain.gain.exponentialRampToValueAtTime(0.001, subTime + 0.042);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(subTime);
        osc.stop(subTime + 0.044);
      }
    } else {
      // 8-BIT SQUARE WAVE LEAD (Bangarang signature lead riff)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(noteObj.freq, now);

      // Octave sub / chorus when combo builds
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(noteObj.freq * 0.5, now);

      const gainNode = this.ctx.createGain();
      const vol = 0.24 + comboBoost * 0.12;
      gainNode.gain.setValueAtTime(vol, now);
      gainNode.gain.setValueAtTime(vol * 0.8, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (combo > 10 ? 0.32 : 0.22));

      osc1.connect(gainNode);
      if (combo >= 5) {
        osc2.connect(gainNode);
      }
      gainNode.connect(this.masterGain);

      if (this.delayNode && combo >= 5) {
        gainNode.connect(this.delayNode);
      }

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.34);
      osc2.stop(now + 0.34);
    }

    return noteObj;
  }

  /**
   * Play clean harmonious note according to typing progression and token type
   */
  public playKeySound(char: string, combo: number = 0) {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Update combo state in 8-bit chiptune engine
    chiptunePlayer.setCombo(combo);

    const now = this.ctx.currentTime;

    // Pick scale note based on sequential typing flow + character code
    const baseOffset = (this.noteIndex % 8);
    let freq = CYBER_SCALE[baseOffset + 4]; // Central register (C4 - D5)
    this.noteIndex++;

    // Character token sound design:
    // Punctuation / brackets get resonant bass or click
    const isPunctuation = /[(){}[\];=,.<>:]/.test(char);
    const isQuote = /['"`]/.test(char);
    const isSpace = char === ' ' || char === '\n';

    if (isPunctuation) {
      freq = CYBER_SCALE[1] * 2; // Punchy anchor note
    } else if (isQuote) {
      freq = CYBER_SCALE[11]; // Crystal high tone
    } else if (isSpace) {
      freq = CYBER_SCALE[5]; // Root note resolve
    }

    // High combo overdrive modulation
    const comboBoost = Math.min(combo / 30, 1);
    const volume = 0.22 + comboBoost * 0.12;

    // Oscillator 1: Main synth lead (Sawtooth / Square)
    const osc1 = this.ctx.createOscillator();
    osc1.type = combo > 15 ? 'sawtooth' : 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Oscillator 2: Detuned sub or octave up for shimmer
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(combo > 10 ? freq * 2 : freq * 0.5, now);
    osc2.detune.setValueAtTime(combo > 5 ? 7 : 0, now);

    // Resonant Cyber Lowpass Filter with snappy decay
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const baseCutoff = 800 + comboBoost * 2200;
    filter.frequency.setValueAtTime(baseCutoff * 2.5, now);
    filter.frequency.exponentialRampToValueAtTime(baseCutoff, now + 0.18);
    filter.Q.setValueAtTime(4 + comboBoost * 4, now);

    // Amplitude Envelope (Snappy attack, cyber synth decay)
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (combo > 10 ? 0.35 : 0.22));

    // Connect nodes
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Send to delay line if combo is active
    if (this.delayNode && combo >= 5) {
      gainNode.connect(this.delayNode);
    }

    osc1.start(now);
    osc2.start(now);
    const stopTime = now + 0.4;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  /**
   * Play glitch distortion sound on mistake / error
   */
  public playGlitchDistortion() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Trigger glitch pitch-drop on 8-bit chiptune track
    chiptunePlayer.setCombo(0);
    chiptunePlayer.triggerGlitch();

    const now = this.ctx.currentTime;

    // Dissonant low frequency buzzing saw + noise
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    // Dissonant interval (Tritone / Flat 5th crash: 116.54 Hz down to 60 Hz)
    osc.frequency.setValueAtTime(116.54, now);
    osc.frequency.exponentialRampToValueAtTime(45.0, now + 0.28);

    // Harsh glitch bandpass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.Q.setValueAtTime(8, now);

    // Glitch Distortion Shaper
    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(180) as unknown as Float32Array<ArrayBuffer>;
    distortion.oversample = '4x';

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);

    // Reset melodic position
    this.noteIndex = 0;
  }

  /**
   * Play triumphant cyber chords on level completion
   */
  public playVictoryFanfare() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    // Chord progression in D minor / D Maj 9th cyber lift: D4 -> F#4 -> A4 -> C#5 -> E5
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
      if (this.delayNode) gain.connect(this.delayNode);

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
