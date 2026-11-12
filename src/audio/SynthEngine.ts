/**
 * SynthEngine: High-Performance Cyberpunk Web Audio Synthesizer
 * Generates dynamic reactive electronic music according to code typing accuracy.
 *
 * Merged feature set:
 *  - Individual, distinct musical pitch and tactile mechanical switch sound for EVERY key (12-commit redesign).
 *  - Hi-Fi sound profiles (Neo-Synthwave / Cyber Rhodes / Modern EDM / Arcade 8-Bit).
 *  - Studio space reverb, stereo tape delay and ambient warm drone.
 *  - Optional synchronized melody mode (Bangarang, Blinding Lights, etc.).
 */

import { chiptunePlayer, SoundProfile } from './ChiptunePlayer';
import { SYNCED_MELODIES, SyncedMelody, SyncedNote } from './SyncedMelodies';

export interface KeySoundProfile {
  note: string;
  freq: number;
  wave: OscillatorType;
  filterFreq: number;
  decay: number; // in seconds
  volume: number;
  type: 'bass' | 'lead' | 'chime' | 'percussion' | 'syntax' | 'kick';
}

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

export const KEY_SOUND_MAP: Record<string, KeySoundProfile> = {
  // --- VOWELS (Warm, resonant melodic anchors) ---
  'a': { note: 'D4', freq: 293.66, wave: 'triangle', filterFreq: 3600, decay: 0.12, volume: 0.78, type: 'lead' },
  'A': { note: 'D5', freq: 587.33, wave: 'triangle', filterFreq: 4600, decay: 0.13, volume: 0.80, type: 'lead' },
  'e': { note: 'E4', freq: 329.63, wave: 'triangle', filterFreq: 3800, decay: 0.12, volume: 0.78, type: 'lead' },
  'E': { note: 'E5', freq: 659.25, wave: 'triangle', filterFreq: 4800, decay: 0.13, volume: 0.80, type: 'lead' },
  'i': { note: 'F4', freq: 349.23, wave: 'triangle', filterFreq: 4000, decay: 0.12, volume: 0.78, type: 'lead' },
  'I': { note: 'F5', freq: 698.46, wave: 'triangle', filterFreq: 5000, decay: 0.13, volume: 0.80, type: 'lead' },
  'o': { note: 'A4', freq: 440.00, wave: 'triangle', filterFreq: 4200, decay: 0.12, volume: 0.78, type: 'lead' },
  'O': { note: 'A5', freq: 880.00, wave: 'triangle', filterFreq: 5200, decay: 0.13, volume: 0.80, type: 'lead' },
  'u': { note: 'C5', freq: 523.25, wave: 'triangle', filterFreq: 4400, decay: 0.12, volume: 0.78, type: 'lead' },
  'U': { note: 'C6', freq: 1046.50, wave: 'triangle', filterFreq: 5400, decay: 0.13, volume: 0.80, type: 'lead' },

  // --- CONSONANTS (Lower Register: b, c, d, f, g) ---
  'b': { note: 'G3', freq: 196.00, wave: 'sawtooth', filterFreq: 2400, decay: 0.11, volume: 0.76, type: 'lead' },
  'c': { note: 'A3', freq: 220.00, wave: 'sawtooth', filterFreq: 2600, decay: 0.11, volume: 0.76, type: 'lead' },
  'd': { note: 'Bb3', freq: 233.08, wave: 'triangle', filterFreq: 2800, decay: 0.11, volume: 0.76, type: 'lead' },
  'f': { note: 'C4', freq: 261.63, wave: 'triangle', filterFreq: 3000, decay: 0.11, volume: 0.76, type: 'lead' },
  'g': { note: 'F#4', freq: 369.99, wave: 'triangle', filterFreq: 3400, decay: 0.11, volume: 0.76, type: 'lead' },

  // --- CONSONANTS (Mid Register: h, j, k, l, m) ---
  'h': { note: 'G4', freq: 392.00, wave: 'triangle', filterFreq: 3600, decay: 0.11, volume: 0.76, type: 'lead' },
  'j': { note: 'Ab4', freq: 415.30, wave: 'triangle', filterFreq: 3800, decay: 0.11, volume: 0.76, type: 'lead' },
  'k': { note: 'Bb4', freq: 466.16, wave: 'sawtooth', filterFreq: 4000, decay: 0.11, volume: 0.76, type: 'lead' },
  'l': { note: 'B4', freq: 493.88, wave: 'triangle', filterFreq: 4200, decay: 0.11, volume: 0.76, type: 'lead' },
  'm': { note: 'D5', freq: 587.33, wave: 'triangle', filterFreq: 4400, decay: 0.11, volume: 0.76, type: 'lead' },

  // --- CONSONANTS (High Register: n, p, q, r, s) ---
  'n': { note: 'Eb5', freq: 622.25, wave: 'triangle', filterFreq: 4600, decay: 0.11, volume: 0.76, type: 'lead' },
  'p': { note: 'G5', freq: 783.99, wave: 'sawtooth', filterFreq: 4800, decay: 0.11, volume: 0.76, type: 'lead' },
  'q': { note: 'Ab5', freq: 830.61, wave: 'sawtooth', filterFreq: 5000, decay: 0.11, volume: 0.76, type: 'lead' },
  'r': { note: 'Bb5', freq: 932.33, wave: 'triangle', filterFreq: 5200, decay: 0.11, volume: 0.76, type: 'lead' },
  's': { note: 'B5', freq: 987.77, wave: 'triangle', filterFreq: 5400, decay: 0.11, volume: 0.76, type: 'lead' },

  // --- CONSONANTS (Top Register: t, v, w, x, y, z) ---
  't': { note: 'D6', freq: 1174.66, wave: 'sine', filterFreq: 5800, decay: 0.10, volume: 0.75, type: 'lead' },
  'v': { note: 'E6', freq: 1318.51, wave: 'sine', filterFreq: 6000, decay: 0.10, volume: 0.75, type: 'lead' },
  'w': { note: 'F6', freq: 1396.91, wave: 'sine', filterFreq: 6200, decay: 0.10, volume: 0.75, type: 'lead' },
  'x': { note: 'G6', freq: 1567.98, wave: 'sine', filterFreq: 6400, decay: 0.10, volume: 0.74, type: 'lead' },
  'y': { note: 'A6', freq: 1760.00, wave: 'sine', filterFreq: 6600, decay: 0.10, volume: 0.74, type: 'lead' },
  'z': { note: 'B6', freq: 1975.53, wave: 'sine', filterFreq: 6800, decay: 0.10, volume: 0.74, type: 'lead' },

  // --- NUMBERS (Punchy analog synth bass 0 - 9) ---
  '0': { note: 'D2', freq: 73.42, wave: 'sawtooth', filterFreq: 650, decay: 0.13, volume: 0.82, type: 'bass' },
  '1': { note: 'E2', freq: 82.41, wave: 'sawtooth', filterFreq: 700, decay: 0.13, volume: 0.82, type: 'bass' },
  '2': { note: 'F2', freq: 87.31, wave: 'sawtooth', filterFreq: 750, decay: 0.13, volume: 0.82, type: 'bass' },
  '3': { note: 'G2', freq: 98.00, wave: 'sawtooth', filterFreq: 800, decay: 0.13, volume: 0.82, type: 'bass' },
  '4': { note: 'A2', freq: 110.00, wave: 'sawtooth', filterFreq: 850, decay: 0.13, volume: 0.82, type: 'bass' },
  '5': { note: 'Bb2', freq: 116.54, wave: 'sawtooth', filterFreq: 900, decay: 0.13, volume: 0.82, type: 'bass' },
  '6': { note: 'C3', freq: 130.81, wave: 'sawtooth', filterFreq: 950, decay: 0.13, volume: 0.82, type: 'bass' },
  '7': { note: 'D3', freq: 146.83, wave: 'sawtooth', filterFreq: 1000, decay: 0.13, volume: 0.82, type: 'bass' },
  '8': { note: 'E3', freq: 164.81, wave: 'sawtooth', filterFreq: 1050, decay: 0.13, volume: 0.82, type: 'bass' },
  '9': { note: 'F3', freq: 174.61, wave: 'sawtooth', filterFreq: 1100, decay: 0.13, volume: 0.82, type: 'bass' },

  // --- SPECIAL CONTROL KEYS ---
  ' ': { note: 'KICK-D2', freq: 65.41, wave: 'sine', filterFreq: 320, decay: 0.14, volume: 0.88, type: 'kick' },
  '\n': { note: 'ENTER-CHORD', freq: 440.00, wave: 'triangle', filterFreq: 5200, decay: 0.18, volume: 0.84, type: 'chime' },

  // --- SYNTAX, BRACKETS & PUNCTUATION ---
  '(': { note: 'F#5', freq: 739.99, wave: 'sine', filterFreq: 5500, decay: 0.11, volume: 0.78, type: 'syntax' },
  ')': { note: 'A5', freq: 880.00, wave: 'sine', filterFreq: 5800, decay: 0.11, volume: 0.78, type: 'syntax' },
  '{': { note: 'D6', freq: 1174.66, wave: 'triangle', filterFreq: 6200, decay: 0.11, volume: 0.78, type: 'syntax' },
  '}': { note: 'F#6', freq: 1479.98, wave: 'triangle', filterFreq: 6600, decay: 0.11, volume: 0.78, type: 'syntax' },
  '[': { note: 'E5', freq: 659.25, wave: 'triangle', filterFreq: 5200, decay: 0.11, volume: 0.76, type: 'syntax' },
  ']': { note: 'G5', freq: 783.99, wave: 'triangle', filterFreq: 5500, decay: 0.11, volume: 0.76, type: 'syntax' },
  '"': { note: 'E6', freq: 1318.51, wave: 'sine', filterFreq: 7000, decay: 0.12, volume: 0.80, type: 'chime' },
  "'": { note: 'C#6', freq: 1108.73, wave: 'sine', filterFreq: 6800, decay: 0.12, volume: 0.80, type: 'chime' },
  ';': { note: 'SNARE-TICK', freq: 2400.0, wave: 'triangle', filterFreq: 8000, decay: 0.08, volume: 0.76, type: 'percussion' },
  ':': { note: 'C6', freq: 1046.50, wave: 'sine', filterFreq: 6400, decay: 0.10, volume: 0.78, type: 'syntax' },
  '=': { note: 'D5+A5', freq: 587.33, wave: 'triangle', filterFreq: 5200, decay: 0.11, volume: 0.78, type: 'syntax' },
  '+': { note: 'F5', freq: 698.46, wave: 'triangle', filterFreq: 5000, decay: 0.11, volume: 0.78, type: 'syntax' },
  '-': { note: 'Eb4', freq: 311.13, wave: 'triangle', filterFreq: 3600, decay: 0.11, volume: 0.76, type: 'syntax' },
  '*': { note: 'G#5', freq: 830.61, wave: 'sine', filterFreq: 5600, decay: 0.11, volume: 0.78, type: 'syntax' },
  '/': { note: 'Bb5', freq: 932.33, wave: 'triangle', filterFreq: 5400, decay: 0.11, volume: 0.76, type: 'syntax' },
  '<': { note: 'D5', freq: 587.33, wave: 'sawtooth', filterFreq: 4400, decay: 0.11, volume: 0.76, type: 'syntax' },
  '>': { note: 'E5', freq: 659.25, wave: 'sawtooth', filterFreq: 4600, decay: 0.11, volume: 0.76, type: 'syntax' },
  '.': { note: 'A6', freq: 1760.00, wave: 'sine', filterFreq: 7500, decay: 0.08, volume: 0.74, type: 'percussion' },
  ',': { note: 'F6', freq: 1396.91, wave: 'sine', filterFreq: 7000, decay: 0.08, volume: 0.74, type: 'percussion' },
  '!': { note: 'D6', freq: 1174.66, wave: 'sawtooth', filterFreq: 6500, decay: 0.12, volume: 0.80, type: 'syntax' },
  '¡': { note: 'D6', freq: 1174.66, wave: 'sawtooth', filterFreq: 6600, decay: 0.12, volume: 0.80, type: 'syntax' },
  '¿': { note: 'C6', freq: 1046.50, wave: 'sawtooth', filterFreq: 6400, decay: 0.12, volume: 0.80, type: 'syntax' },
  '#': { note: 'G4', freq: 392.00, wave: 'triangle', filterFreq: 4000, decay: 0.11, volume: 0.76, type: 'syntax' },
  '_': { note: 'F2', freq: 87.31, wave: 'triangle', filterFreq: 500, decay: 0.13, volume: 0.82, type: 'bass' },
};

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private keyGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private isMuted: boolean = false;
  private clickNoiseBuffer: AudioBuffer | null = null;
  private soundProfile: SoundProfile = 'synthwave';
  private currentMelody: SyncedMelody = SYNCED_MELODIES[0];
  private melodyMode: boolean = false;

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

  public setMelodyMode(enabled: boolean) {
    this.melodyMode = enabled;
  }

  public isMelodyMode(): boolean {
    return this.melodyMode;
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

    // Master bus for background music
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    // Dedicated high-clarity bus for keystrokes
    this.keyGain = this.ctx.createGain();
    this.keyGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

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

    // Route both buses into Analyser -> Speaker
    this.masterGain.connect(this.analyser);
    this.keyGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Create mechanical click noise buffer
    this.createClickNoiseBuffer();

    // Initialize Chiptune Beat Player
    chiptunePlayer.init(this.ctx, this.masterGain);
    chiptunePlayer.setSoundProfile(this.soundProfile);

    // Ambient Warm Drone
    this.startDrone();
  }

  private createClickNoiseBuffer() {
    if (!this.ctx) return;
    const length = Math.floor(this.ctx.sampleRate * 0.02); // 20ms
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.2));
    }
    this.clickNoiseBuffer = buffer;
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

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    chiptunePlayer.setMuted(muted);
    if (this.masterGain && this.keyGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.05);
      this.keyGain.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private connectSends(node: AudioNode, combo: number) {
    if (this.reverbNode && this.soundProfile !== 'chiptune') {
      node.connect(this.reverbNode);
    }
    if (this.delayNode && this.soundProfile !== 'chiptune' && combo >= 5) {
      node.connect(this.delayNode);
    }
  }

  /**
   * Play a distinct, high-definition note & tactile mechanical switch sound for each key.
   * When melody mode is enabled, the active song (Bangarang, Blinding Lights, ...) drives the pitch instead.
   */
  public playSyncedKeySound(stepIndex: number, combo: number = 0, char: string = ''): SyncedNote {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.keyGain) {
      return { note: 'D4', freq: 293.66, type: 'lead' };
    }

    // Keep background beat alive and synced
    chiptunePlayer.setCombo(combo);
    chiptunePlayer.resumeBeat();

    if (this.melodyMode) {
      return this.playMelodyStep(stepIndex, combo);
    }

    const now = this.ctx.currentTime;
    const comboBonus = Math.min(combo / 25, 0.25);

    // Lookup profile for this exact character
    const profile = KEY_SOUND_MAP[char] || {
      note: 'D4',
      freq: 293.66 + ((stepIndex * 37) % 400),
      wave: 'triangle',
      filterFreq: 4000,
      decay: 0.12,
      volume: 0.76,
      type: 'lead',
    };

    // 1. Ultra-Crisp Mechanical Switch "Click" Transient (Cherry MX Blue tactile snap)
    if (this.clickNoiseBuffer) {
      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = this.clickNoiseBuffer;

      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(3600, now);
      clickFilter.Q.setValueAtTime(3.5, now);

      const clickGainNode = this.ctx.createGain();
      clickGainNode.gain.setValueAtTime(0.45, now);
      clickGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGainNode);
      clickGainNode.connect(this.keyGain);

      clickSource.start(now);
      clickSource.stop(now + 0.02);
    }

    // High pitch electrical transient snap
    const snapOsc = this.ctx.createOscillator();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(4800, now);
    snapOsc.frequency.exponentialRampToValueAtTime(700, now + 0.012);

    const snapGain = this.ctx.createGain();
    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    snapOsc.connect(snapGain);
    snapGain.connect(this.keyGain);
    snapOsc.start(now);
    snapOsc.stop(now + 0.014);

    // 2. Specific Timbre & Musical Pitch by Character Profile
    if (profile.type === 'kick') {
      // Spacebar: Sub Bass Kick Drum drop
      const kickOsc = this.ctx.createOscillator();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, now);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(profile.volume + comboBonus * 0.1, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + profile.decay);

      kickOsc.connect(kickGain);
      kickGain.connect(this.keyGain);
      this.connectSends(kickGain, combo);
      kickOsc.start(now);
      kickOsc.stop(now + profile.decay + 0.01);
    } else if (profile.type === 'chime') {
      // Quotes & Enter: Multi-tone bell / crystal shimmer
      const osc1 = this.ctx.createOscillator();
      osc1.type = this.soundProfile === 'chiptune' ? 'square' : 'sine';
      osc1.frequency.setValueAtTime(profile.freq, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = this.soundProfile === 'chiptune' ? 'square' : 'triangle';
      osc2.frequency.setValueAtTime(profile.freq * 1.5, now); // Fifth harmony

      const gain = this.ctx.createGain();
      const peak = profile.volume + comboBonus * 0.1;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decay);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, combo);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + profile.decay + 0.01);
      osc2.stop(now + profile.decay + 0.01);
    } else if (profile.type === 'bass') {
      // Numbers & underscores: warm analog bass with sub oscillator
      const osc = this.ctx.createOscillator();
      osc.type = this.soundProfile === 'chiptune' ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(profile.freq, now);

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(profile.freq * 0.5, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(profile.filterFreq, now);
      filter.frequency.exponentialRampToValueAtTime(profile.filterFreq * 0.5, now + profile.decay);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      const peak = profile.volume + comboBonus * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decay);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, combo);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + profile.decay + 0.01);
      subOsc.stop(now + profile.decay + 0.01);
    } else {
      // Letters, Syntax & Percussion: distinct resonant notes coloured by the active profile
      const osc = this.ctx.createOscillator();
      osc.type = this.soundProfile === 'chiptune' ? profile.wave : this.soundProfile === 'piano' ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(profile.freq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoff = this.soundProfile === 'edm' ? profile.filterFreq * 1.4 : profile.filterFreq;
      filter.frequency.setValueAtTime(cutoff, now);
      filter.frequency.exponentialRampToValueAtTime(cutoff * 0.5, now + profile.decay);
      filter.Q.setValueAtTime(this.soundProfile === 'edm' ? 4 : 2.5, now);

      const gain = this.ctx.createGain();
      const peak = profile.volume + comboBonus * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.003); // Instant crisp attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, combo);

      osc.start(now);
      osc.stop(now + profile.decay + 0.01);
    }

    return { note: profile.note, freq: profile.freq, type: 'lead' };
  }

  public playKeySound(char: string, combo: number = 0) {
    return this.playSyncedKeySound(0, combo, char);
  }

  /**
   * Play the exact synchronized note from the active song, rendered with the selected profile.
   */
  private playMelodyStep(stepIndex: number, combo: number): SyncedNote {
    if (!this.ctx || !this.keyGain) {
      return this.currentMelody.notes[0];
    }

    const notes = this.currentMelody.notes;
    const noteObj = notes[stepIndex % notes.length];
    const now = this.ctx.currentTime;
    const comboBoost = Math.min(combo / 30, 1);

    if (noteObj.type === 'growl') {
      if (this.soundProfile === 'chiptune') {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(noteObj.freq * 1.3, now);
        osc.frequency.exponentialRampToValueAtTime(noteObj.freq, now + 0.1);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.keyGain);
        osc.start(now);
        osc.stop(now + 0.32);
      } else {
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteObj.freq * 1.5, now);
        osc1.frequency.exponentialRampToValueAtTime(noteObj.freq, now + 0.08);

        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(noteObj.freq * 0.5, now);

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
        gain.connect(this.keyGain);
        this.connectSends(gain, combo);

        osc1.start(now);
        subOsc.start(now);
        osc1.stop(now + 0.38);
        subOsc.stop(now + 0.38);
      }
    } else if (noteObj.type === 'stutter') {
      for (let i = 0; i < 3; i++) {
        const subTime = now + i * 0.048;
        const osc = this.ctx.createOscillator();
        osc.type = this.soundProfile === 'piano' ? 'sine' : this.soundProfile === 'chiptune' ? 'square' : 'sawtooth';
        osc.frequency.setValueAtTime(noteObj.freq * (1 + i * 0.03), subTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.26, subTime);
        gain.gain.exponentialRampToValueAtTime(0.001, subTime + 0.045);

        osc.connect(gain);
        gain.connect(this.keyGain);
        this.connectSends(gain, combo);

        osc.start(subTime);
        osc.stop(subTime + 0.047);
      }
    } else {
      this.playInstrumentNote(noteObj.freq, 0.34, combo);
    }

    return noteObj;
  }

  /**
   * Instrument renderer for single notes matching the active Sound Profile.
   */
  private playInstrumentNote(freq: number, duration: number, combo: number) {
    if (!this.ctx || !this.keyGain) return;
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
      const vol = 0.3 + comboBoost * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

      carrier.connect(filter);
      filter.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, combo);

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
      gain.gain.setValueAtTime(0.32 + comboBoost * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, combo);

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
      gain.connect(this.keyGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } else {
      // NEO-SYNTHWAVE (Warm Detuned Supersaw + Moog Filter)
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
      const vol = 0.24 + comboBoost * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

      osc1.connect(filter);
      osc2.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, combo);

      osc1.start(now);
      osc2.start(now);
      subOsc.start(now);
      osc1.stop(now + duration * 1.3);
      osc2.stop(now + duration * 1.3);
      subOsc.stop(now + duration * 1.3);
    }
  }

  /**
   * Tape-Stop Distortion on mistake / error ("Don't Break the Beat")
   */
  public playGlitchDistortion() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.keyGain) return;

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
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(this.keyGain);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  /**
   * Play triumphant cyber chords on level completion
   */
  public playVictoryFanfare() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || !this.keyGain) return;

    const chord = [293.66, 369.99, 440.0, 554.37, 659.25, 880.0];
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.keyGain) return;
      const noteTime = now + idx * 0.08;

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3600, noteTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.keyGain);
      this.connectSends(gain, 10);

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
