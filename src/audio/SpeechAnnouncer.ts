/**
 * English Voice Speech Announcer (Web Speech API)
 * Provides arcade speech feedback in natural English for Level 6 practice.
 */

export class SpeechAnnouncer {
  private isEnabled: boolean = true;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoice();
  }

  private initVoice() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer modern English voices (Samantha, Daniel, Google US English, Natural)
      const enVoice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google'))) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) {
        this.voice = enVoice;
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public speak(phrase: string, rate: number = 1.12, pitch: number = 1.05) {
    if (!this.isEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Don't queue up back-to-back
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech is blocked
    }
  }

  public announceCombo(combo: number) {
    switch (combo) {
      case 5:
        this.speak('Rhythm active!');
        break;
      case 10:
        this.speak('Combo ten, you are on fire!');
        break;
      case 20:
        this.speak('Bass drop! Twenty hits in a row!');
        break;
      case 35:
        this.speak('Overdrive mode! Flawless speed!');
        break;
      case 50:
        this.speak('Code deity! Fifty combo milestone!');
        break;
    }
  }

  public announceVictory() {
    this.speak('Level cleared! Code compiled with zero errors!');
  }

  public announceBeatBroken() {
    this.speak('Beat interrupted! Press backspace!');
  }
}

export const speechAnnouncer = new SpeechAnnouncer();
