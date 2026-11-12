import { ChiptuneTrack, CHIPTUNE_TRACKS, NOTE_FREQS } from './ChiptuneTracks';

export type BeatStatusCallback = (isBroken: boolean) => void;
export type SoundProfile = 'synthwave' | 'piano' | 'edm' | 'chiptune';

export class ChiptunePlayer {
  private ctx: AudioContext | null = null;
  private outputNode: AudioNode | null = null;
  private bgmGain: GainNode | null = null;

  private currentTrack: ChiptuneTrack = CHIPTUNE_TRACKS[0];
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.30; // Default balanced BGM volume so key typing sounds cut through clearly
  private isBeatCut: boolean = false;
  private soundProfile: SoundProfile = 'synthwave'; // Default: Modern Hi-Fi Synthwave

  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private timerId: number | null = null;
  private combo: number = 0;

  // Custom audio playback (MP3/WAV file support)
  private customAudioBuffer: AudioBuffer | null = null;
  private customAudioSource: AudioBufferSourceNode | null = null;
  private customAudioStartTime: number = 0;
  private customAudioPauseOffset: number = 0;
  private customAudioName: string | null = null;
  private isCustomAudioActive: boolean = false;

  // Listeners for UI sync
  private beatStatusListeners: Set<BeatStatusCallback> = new Set();
  private beatListeners: Array<(beatIndex: number, bpm: number) => void> = [];

  // Noise buffer for drums & percussions
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

  /**
   * Subscribe to quarter-note pulses (0, 1, 2, 3) for the visual metronome.
   */
  public subscribeBeat(listener: (beatIndex: number, bpm: number) => void): () => void {
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

  private notifyBeatStatus() {
    this.beatStatusListeners.forEach((cb) => cb(this.isBeatCut));
  }

  public getTracks(): ChiptuneTrack[] {
    return CHIPTUNE_TRACKS;
  }

  public getCurrentTrack(): ChiptuneTrack {
    return this.currentTrack;
  }

  public isCustomActive(): boolean {
    return this.isCustomAudioActive;
  }

  public getCustomAudioName(): string | null {
    return this.customAudioName;
  }

  public setTrack(trackId: string) {
    this.isCustomAudioActive = false;
    this.stopCustomSource();

    const found = CHIPTUNE_TRACKS.find((t) => t.id === trackId);
    if (found) {
      this.currentTrack = found;
      this.currentStep = 0;
      if (this.ctx) {
        this.nextStepTime = this.ctx.currentTime + 0.05;
      }
    }
  }

  public async loadCustomAudio(file: File): Promise<string> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      if (!this.bgmGain) {
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.customAudioBuffer = audioBuffer;
    this.customAudioName = file.name.replace(/\.[^/.]+$/, '');
    this.isCustomAudioActive = true;
    this.customAudioPauseOffset = 0;

    if (this.isPlaying) {
      this.stop();
      this.start();
    }

    return this.customAudioName;
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

    this.bgmGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);

    if (this.isCustomAudioActive && this.customAudioBuffer) {
      this.playCustomSource(this.customAudioPauseOffset);
    } else {
      this.currentStep = 0;
      this.nextStepTime = this.ctx.currentTime + 0.1;
      this.scheduler();
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopCustomSource();
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

  private playCustomSource(offsetSeconds = 0) {
    if (!this.ctx || !this.bgmGain || !this.customAudioBuffer) return;
    this.stopCustomSource();

    const source = this.ctx.createBufferSource();
    source.buffer = this.customAudioBuffer;
    source.loop = true;
    source.connect(this.bgmGain);

    const safeOffset = offsetSeconds % this.customAudioBuffer.duration;
    source.start(0, safeOffset);
    this.customAudioStartTime = this.ctx.currentTime - safeOffset;
    this.customAudioSource = source;
  }

  private stopCustomSource() {
    if (this.customAudioSource) {
      try {
        this.customAudioSource.stop();
        this.customAudioSource.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.customAudioSource = null;
    }
  }

  /**
   * "Don't Break the Beat" Mechanic:
   * Instantly cuts gain and plays tape-stop needle scratch.
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

    if (this.isCustomAudioActive && this.customAudioSource) {
      if (this.customAudioBuffer) {
        this.customAudioPauseOffset = (now - this.customAudioStartTime) % this.customAudioBuffer.duration;
      }
      this.stopCustomSource();
    }

    // 2. Play Tape-Stop / Vinyl Scratch effect
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.22); // Rapid pitch drop

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
   * Resume the beat when error is fixed with Backspace
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

      if (this.isCustomAudioActive && this.customAudioBuffer) {
        this.playCustomSource(this.customAudioPauseOffset);
      } else {
        // Play snappy kick pickup
        this.playDrum('K', now);
      }
    }
  }

  public triggerGlitch() {
    this.triggerTapeStop();
  }

  /**
   * Step scheduler for procedural multi-track synths
   */
  private scheduler = () => {
    if (!this.isPlaying || !this.ctx || this.isCustomAudioActive) return;

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

    // Visual metronome pulse on quarter notes (steps 0, 4, 8, 12...)
    if (step % 4 === 0 && this.beatListeners.length > 0) {
      const beatNum = Math.floor(step / 4) % 4;
      const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
      window.setTimeout(() => {
        if (this.isPlaying && !this.isBeatCut) {
          this.beatListeners.forEach((l) => l(beatNum, track.bpm));
        }
      }, delayMs);
    }

    // 1. Channel 4: Percussion & Drums (Güiro, Cowbell, Congas, Kick, Snare, Hihat)
    const drumToken = track.drums[step % track.drums.length];
    if (drumToken && drumToken !== '-') {
      this.playDrum(drumToken, time);
    }

    // 2. Channel 3: Bass
    const bassNote = track.bass[step % track.bass.length];
    if (bassNote && bassNote !== '-') {
      this.playBassNote(bassNote, time, stepDuration * 0.95);
    }

    // 3. Channel 1: Lead Melody (unlocked on combo >= 5)
    if (this.combo >= 5) {
      const leadNote = track.lead[step % track.lead.length];
      if (leadNote && leadNote !== '-') {
        this.playLeadNote(leadNote, time, stepDuration * 0.85);
      }
    }

    // 4. Channel 2: Arpeggio (unlocked on combo >= 10)
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

    // Cumbia: Tropical Accordion / Organ with chorus vibrato
    if (this.currentTrack.genre === 'cumbia') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.frequency.setValueAtTime(freq * 1.007, time); // detuned chorus

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, time);

      const gain = this.ctx.createGain();
      const vol = this.combo >= 20 ? 0.22 : 0.17;
      gain.gain.setValueAtTime(vol, time);
      gain.gain.setValueAtTime(vol, time + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration);
      osc2.stop(time + duration);
      return;
    }

    // Phonk: 808 Cowbell Lead
    if (this.currentTrack.genre === 'phonk') {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.15, time);
      filter.Q.setValueAtTime(4, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
      return;
    }

    // Dubstep: Complextro lead screech
    if (this.currentTrack.genre === 'dubstep') {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.6, time);
      filter.Q.setValueAtTime(6, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
      return;
    }

    // Default lead: profile-aware timbre (synthwave / piano / edm / chiptune)
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';

    let leadVol = this.combo >= 20 ? 0.22 : 0.16;

    switch (this.soundProfile) {
      case 'chiptune':
        osc.type = 'square';
        filter.frequency.setValueAtTime(6000, time);
        break;
      case 'piano':
        osc.type = 'sine';
        filter.frequency.setValueAtTime(3200, time);
        leadVol *= 1.15;
        break;
      case 'edm':
        osc.type = 'sawtooth';
        filter.frequency.setValueAtTime(4500, time);
        filter.frequency.exponentialRampToValueAtTime(1200, time + duration);
        filter.Q.setValueAtTime(4, time);
        break;
      default:
        osc.type = 'sawtooth';
        filter.frequency.setValueAtTime(2800, time);
        filter.frequency.exponentialRampToValueAtTime(1000, time + duration);
        filter.Q.setValueAtTime(2.5, time);
        break;
    }

    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(leadVol, time);
    gain.gain.setValueAtTime(leadVol, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playArpNote(note: string, time: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const profileWave: Record<SoundProfile, OscillatorType> = {
      synthwave: 'sawtooth',
      piano: 'sine',
      edm: 'sawtooth',
      chiptune: 'square',
    };
    const isProfileTrack = this.currentTrack.genre === 'synthwave' || this.currentTrack.genre === 'chiptune';
    osc.type = this.currentTrack.genre === 'lofi'
      ? 'sine'
      : isProfileTrack
        ? profileWave[this.soundProfile]
        : 'square';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    const arpVol = 0.1;
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

    // SKRILLEX DUBSTEP: Heavy Wobble Growl Bass ("wub-wub")
    if (this.currentTrack.genre === 'dubstep') {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      // Wobble sweep filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(8, time);
      filter.frequency.setValueAtTime(3200, time);
      filter.frequency.exponentialRampToValueAtTime(160, time + duration * 0.75);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      // Chest-thumping sub-bass layer (40-60 Hz)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(Math.max(42, freq * 0.5), time);
      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.38, time);
      subGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      subOsc.connect(subGain);
      subGain.connect(this.bgmGain);

      osc.start(time);
      subOsc.start(time);
      osc.stop(time + duration);
      subOsc.stop(time + duration);
      return;
    }

    // CUMBIA: Bouncing round Latin Bass
    if (this.currentTrack.genre === 'cumbia') {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.38, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
      return;
    }

    // Default bass: profile-aware (warm Moog for synthwave, FM-ish sine for piano, punchy EDM, triangle 8-bit)
    if (this.soundProfile === 'chiptune') {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const gain = this.ctx.createGain();
      const bassVol = 0.28;
      gain.gain.setValueAtTime(bassVol, time);
      gain.gain.setValueAtTime(bassVol, time + duration * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
      return;
    }

    const osc = this.ctx.createOscillator();
    osc.type = this.soundProfile === 'piano' ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.soundProfile === 'edm' ? 620 : 450, time);
    filter.Q.setValueAtTime(this.soundProfile === 'edm' ? 1.5 : 3, time);

    const gain = this.ctx.createGain();
    const bassVol = this.soundProfile === 'edm' ? 0.3 : 0.24;
    gain.gain.setValueAtTime(bassVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration);
    subOsc.stop(time + duration);
  }

  private playDrum(token: string, time: number) {
    if (!this.ctx || !this.bgmGain) return;

    const isHiFi = this.soundProfile !== 'chiptune';

    if (token === 'K') {
      // Kick drum (punchy sine in Hi-Fi, square 8-bit in Arcade mode)
      const osc = this.ctx.createOscillator();
      osc.type = isHiFi ? 'sine' : 'square';
      osc.frequency.setValueAtTime(isHiFi ? 150 : 140, time);
      osc.frequency.exponentialRampToValueAtTime(isHiFi ? 42 : 35, time + 0.08);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isHiFi ? 0.42 : 0.38, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (isHiFi ? 0.12 : 0.09));

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + (isHiFi ? 0.13 : 0.1));
    } else if (token === 'S') {
      // Snare drum
      if (!this.noiseBuffer) return;

      const isPunchy = this.currentTrack.genre === 'dubstep' || isHiFi;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isPunchy ? 1800 : 1400, time);
      filter.Q.setValueAtTime(isPunchy ? 4 : 3, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isPunchy ? 0.38 : 0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (isPunchy ? 0.16 : 0.12));

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.18);

      // Hi-Fi body snap tone
      if (isHiFi && this.currentTrack.genre !== 'dubstep') {
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
      // Closed Hi-hat
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
    } else if (token === 'G') {
      // Güiro Short scrape ("chi")
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4200, time);
      filter.Q.setValueAtTime(5, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.26, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.04);
    } else if (token === 'W') {
      // Güiro Long scrape ("chá")
      if (!this.noiseBuffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, time);
      filter.frequency.exponentialRampToValueAtTime(5200, time + 0.07);
      filter.Q.setValueAtTime(4, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + 0.09);
    } else if (token === 'C') {
      // Conga / Timbal slap
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, time);
      osc.frequency.exponentialRampToValueAtTime(170, time + 0.07);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.34, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.09);
    } else if (token === 'B') {
      // 808 Metallic Cowbell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(540, time);
      osc2.frequency.setValueAtTime(800, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(840, time);
      filter.Q.setValueAtTime(3.5, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.1);
      osc2.stop(time + 0.1);
    } else if (token === 'O') {
      // Open hi-hat
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
