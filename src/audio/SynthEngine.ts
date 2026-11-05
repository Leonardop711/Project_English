/**
 * SynthEngine: High-Fidelity Cyberpunk & Neo-Tech Audio Engine
 * Generates rich, dynamic, studio-grade electronic synthesizers,
 * warm analog chords, and reactive melodic lines as you code.
 */

import { chiptunePlayer, SoundProfile } from './ChiptunePlayer';
import { SYNCED_MELODIES, SyncedMelody, SyncedNote } from './SyncedMelodies';

export interface SoundProfileInfo {
  id: SoundProfile;
  name: string;
  badge: string;
  description: string;
  iconName: string;
}

export const SOUND_PROFILES: SoundProfileInfo[] = [
  {
    id: 'synthwave',
    name: 'NEO-SYNTHWAVE (HI-FI)',
    badge: 'RECOMENDADO',
    description: 'Sintetizador analógico cálido, supersaw, reverberación espacial y delay estéreo.',
    iconName: 'Zap',
  },
  {
    id: 'piano',
    name: 'CYBER RHODES (LO-FI)',
    badge: 'CHILL',
    description: 'Piano eléctrico aterciopelado con acordes jazz/cyber y campana FM relajante.',
    iconName: 'Music2',
  },
  {
    id: 'edm',
    name: 'MODERN EDM & PLUCK',
    badge: 'ENERGÉTICO',
    description: 'Pluck moderno de festival, sub-bajo contundente y percusión punchy.',
    iconName: 'Radio',
  },
  {
    id: 'chiptune',
    name: 'ARCADE 8-BIT',
    badge: 'RETRO',
    description: 'Onda cuadrada y triangular clásica estilo NES / GameBoy original.',
    iconName: 'Gamepad2',
  },
];

// Harmonic Cyber Minor Chord Progressions (Key of D minor)
// Bar 1: Dm9, Bar 2: Bbmaj7, Bar 3: Cadd9, Bar 4: Am7
const PROGRESSION_CHORDS = [
  [146.83, 220.00, 261.63, 329.63, 349.23], // Dm9: D3, A3, C4, E4, F4
  [116.54, 174.61, 220.00, 261.63, 293.66], // Bbmaj7: Bb2, F3, A3, C4, D4
  [130.81, 196.00, 261.63, 293.66, 329.63], // Cadd9: C3, G3, C4, D4, E4
  [110.00, 164.81, 220.00, 261.63, 329.63], // Am7: A2, E3, A3, C4, E4
];

const MELODIC_SCALE = [
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00, // A5
];

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private isMuted: boolean = false;
  private noteIndex: number = 0;
  private soundProfile: SoundProfile = 'synthwave';
  private currentMelody: SyncedMelody = SYNCED_MELODIES[0]; // Default: Skrillex - Bangarang

  constructor() {}

  public getSoundProfiles(): SoundProfileInfo[] {
    return SOUND_PROFILES;
  }

  public getSoundProfile(): SoundProfile {
    return this.soundProfile;
  }

  public setSoundProfile(profile: SoundProfile) {
    this.soundProfile = profile;
    chiptunePlayer.setSoundProfile(profile);
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

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.38, this.ctx.currentTime);

    // Visualizer Analyser Node
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.85;

    // Stereo Tape Delay FX
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);

    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.32, this.ctx.currentTime);

    const delayDamp = this.ctx.createBiquadFilter();
    delayDamp.type = 'lowpass';
    delayDamp.frequency.setValueAtTime(3200, this.ctx.currentTime);

    this.delayNode.connect(delayDamp);
    delayDamp.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.masterGain);

    // Studio Space Convolution Reverb
    this.reverbNode = this.createReverbBuffer(this.ctx);
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.32, this.ctx.currentTime);

    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    // Route Master
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Initialize Rhythm / Groove Engine
    chiptunePlayer.init(this.ctx, this.masterGain);
    chiptunePlayer.setSoundProfile(this.soundProfile);

    // Ambient Warm Drone
    this.startDrone();
  }

  /**
   * Generates a lush, studio-quality algorithmic reverb impulse
   */
  private createReverbBuffer(ctx: AudioContext): ConvolverNode {
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const duration = 1.6;
    const decay = 2.2;
    const length = Math.floor(rate * duration);
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const factor = Math.pow(1 - i / length, decay);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }
    convolver.buffer = impulse;
    return convolver;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    chiptunePlayer.setMuted(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.38, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(190, this.ctx.currentTime);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(110.00, this.ctx.currentTime); // A2
    this.droneOsc2.detune.setValueAtTime(3, this.ctx.currentTime);

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  /**
   * Play exact synchronized note from the active song (e.g. Bangarang, Blinding Lights, etc.)
   * rendered with the user's selected Sound Profile.
   */
  public playSyncedKeySound(stepIndex: number, combo: number = 0): SyncedNote {
    if (!this.ctx || this.isMuted) this.init();
    const defaultNote = this.currentMelody.notes[0];
    if (!this.ctx || !this.masterGain) return defaultNote;

    chiptunePlayer.setCombo(combo);

    const notes = this.currentMelody.notes;
    const noteObj = notes[stepIndex % notes.length];
    const now = this.ctx.currentTime;
    const comboBoost = Math.min(combo / 30, 1);

    if (noteObj.type === 'growl') {
      // DUBSTEP GROWL / WOBBLE BASS (Skrillex Bangarang drop)
      if (this.soundProfile === 'chiptune') {
        // 8-bit growl
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(noteObj.freq * 1.3, now);
        osc.frequency.exponentialRampToValueAtTime(noteObj.freq, now + 0.1);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.32);
      } else {
        // Modern Analog Studio Dubstep Growl
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteObj.freq * 1.5, now);
        osc1.frequency.exponentialRampToValueAtTime(noteObj.freq, now + 0.08);

        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(noteObj.freq * 0.5, now);

        // Vocal Formant Bandpass filter sweep for the signature "WUB"
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(380, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 0.09);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.32);
        filter.Q.setValueAtTime(6.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.42 + comboBoost * 0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        osc1.connect(filter);
        filter.connect(gain);
        subOsc.connect(gain);

        gain.connect(this.masterGain);
        if (this.reverbNode) gain.connect(this.reverbNode);
        if (this.delayNode && combo >= 5) gain.connect(this.delayNode);

        osc1.start(now);
        subOsc.start(now);
        osc1.stop(now + 0.38);
        subOsc.stop(now + 0.38);
      }
    } else if (noteObj.type === 'stutter') {
      // VOCAL / CHOP STUTTER: "BA-BA-BAN-GA-RANG!"
      for (let i = 0; i < 3; i++) {
        const subTime = now + i * 0.048;
        const osc = this.ctx.createOscillator();
        osc.type = this.soundProfile === 'piano' ? 'sine' : this.soundProfile === 'chiptune' ? 'square' : 'sawtooth';
        osc.frequency.setValueAtTime(noteObj.freq * (1 + i * 0.03), subTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.26, subTime);
        gain.gain.exponentialRampToValueAtTime(0.001, subTime + 0.045);

        osc.connect(gain);
        gain.connect(this.masterGain);
        if (this.reverbNode && this.soundProfile !== 'chiptune') gain.connect(this.reverbNode);

        osc.start(subTime);
        osc.stop(subTime + 0.047);
      }
    } else {
      // MELODIC LEAD NOTE
      this.playInstrumentNote(noteObj.freq, 0.34, combo);
    }

    return noteObj;
  }

  /**
   * Play clean harmonious note according to typing progression and token type
   */
  public playKeySound(char: string, combo: number = 0) {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    chiptunePlayer.setCombo(combo);

    const isPunctuation = /[(){}[\];=,.<>:]/.test(char);
    const isSpace = char === ' ' || char === '\n';

    // Cycle through chord progression
    const chordIndex = Math.floor(this.noteIndex / 8) % PROGRESSION_CHORDS.length;
    const currentChord = PROGRESSION_CHORDS[chordIndex];
    this.noteIndex++;

    if (isPunctuation || isSpace) {
      // Play rich chord pad for structure & syntax milestones
      this.playChord(currentChord, isSpace ? 0.35 : 0.45);
    } else {
      // Play melodic note over the chord
      const scaleOffset = this.noteIndex % MELODIC_SCALE.length;
      const freq = MELODIC_SCALE[scaleOffset];
      this.playInstrumentNote(freq, 0.28, combo);
    }
  }

  /**
   * Instrument renderer for single notes matching active Sound Profile
   */
  private playInstrumentNote(freq: number, duration: number, combo: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const comboBoost = Math.min(combo / 30, 1);

    if (this.soundProfile === 'piano') {
      // FM CYBER ELECTRIC PIANO (Rhodes / DX7 bell tines + velvet tone)
      const carrier = this.ctx.createOscillator();
      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, now);

      const modulator = this.ctx.createOscillator();
      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(freq * 2, now); // 2:1 harmonic ratio

      const modGain = this.ctx.createGain();
      modGain.gain.setValueAtTime(freq * 1.4, now);
      modGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);

      const gain = this.ctx.createGain();
      const vol = 0.28 + comboBoost * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

      carrier.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      if (this.reverbNode) gain.connect(this.reverbNode);

      carrier.start(now);
      modulator.start(now);
      carrier.stop(now + duration * 1.6);
      modulator.stop(now + duration * 1.6);
    } else if (this.soundProfile === 'edm') {
      // MODERN EDM & FUTURE PLUCK
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq * 0.5, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.14);
      filter.Q.setValueAtTime(4, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3 + comboBoost * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      if (this.reverbNode) gain.connect(this.reverbNode);
      if (this.delayNode && combo >= 5) gain.connect(this.delayNode);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + duration + 0.05);
      subOsc.stop(now + duration + 0.05);
    } else if (this.soundProfile === 'chiptune') {
      // RETRO 8-BIT SQUARE
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } else {
      // NEO-SYNTHWAVE (Warm Detuned Supersaw + Space Reverb + Moog Filter)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(+8, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq, now);
      osc2.detune.setValueAtTime(-8, now);

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 0.5, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoff = 2800 + comboBoost * 1800;
      filter.frequency.setValueAtTime(cutoff * 1.5, now);
      filter.frequency.exponentialRampToValueAtTime(cutoff * 0.5, now + 0.22);
      filter.Q.setValueAtTime(3.5, now);

      const gain = this.ctx.createGain();
      const vol = 0.22 + comboBoost * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

      osc1.connect(filter);
      osc2.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);

      gain.connect(this.masterGain);
      if (this.reverbNode) gain.connect(this.reverbNode);
      if (this.delayNode && combo >= 5) gain.connect(this.delayNode);

      osc1.start(now);
      osc2.start(now);
      subOsc.start(now);
      osc1.stop(now + duration * 1.3);
      osc2.stop(now + duration * 1.3);
      subOsc.stop(now + duration * 1.3);
    }
  }

  /**
   * Play rich harmonic chords for syntax milestone cues
   */
  private playChord(freqs: number[], duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = now + idx * 0.015;

      const osc = this.ctx.createOscillator();
      osc.type = this.soundProfile === 'piano' ? 'sine' : this.soundProfile === 'chiptune' ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, noteTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      if (this.reverbNode && this.soundProfile !== 'chiptune') gain.connect(this.reverbNode);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
    });
  }

  /**
   * Realistic Cyberpunk Glitch & Tape-Stop Sound
   */
  public playGlitchDistortion() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    chiptunePlayer.setCombo(0);
    chiptunePlayer.triggerGlitch();

    const now = this.ctx.currentTime;

    // Pitch drop tape stop
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35.0, now + 0.28);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);
    filter.Q.setValueAtTime(8, now);

    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(160) as unknown as Float32Array<ArrayBuffer>;
    distortion.oversample = '4x';

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);

    this.noteIndex = 0;
  }

  /**
   * Triumphant Cyberpunk Chords on Victory
   */
  public playVictoryFanfare() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.masterGain) return;

    const chord = [293.66, 369.99, 440.0, 554.37, 659.25, 880.0]; // Dmaj9
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = now + idx * 0.08;

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3400, noteTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      if (this.reverbNode) gain.connect(this.reverbNode);
      if (this.delayNode) gain.connect(this.delayNode);

      osc.start(noteTime);
      osc.stop(noteTime + 1.5);
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
