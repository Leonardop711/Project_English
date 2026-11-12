export type Language = 'python' | 'javascript' | 'c';

export interface EnglishSpotlight {
  vocab: string;        // Target vocabulary word / technical phrasal verb
  collocation: string;  // Natural technical collocation (e.g., 'declare a variable', 'evaluate an expression')
  grammarTip: string;   // English Level 6 grammar breakdown (Imperatives, Conditionals, Modals, Passive voice)
}

export interface Level {
  id: number;
  language: Language;
  name: string;
  category: string;
  difficulty: 'INIT' | 'NOVICE' | 'CYBERPUNK' | 'OVERCLOCK' | 'QUANTUM';
  code: string;
  description: string;
  syntaxGuide: string;
  conceptTip: string;
  expectedOutput: string;
  baseBpm: number;
  unlocked: boolean;
  englishSpotlight?: EnglishSpotlight;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  keystrokes: number;
  errors: number;
  startTime: number | null;
  endTime: number | null;
  perfectStreak: boolean;
  stability: number; // 0 to 100%
}

export type SoundEffectType = 'note' | 'chord' | 'bass' | 'glitch' | 'levelUp' | 'perfect' | 'click';
