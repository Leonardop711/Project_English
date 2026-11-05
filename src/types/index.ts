export interface Level {
  id: number;
  name: string;
  category: string;
  difficulty: 'INIT' | 'NOVICE' | 'CYBERPUNK' | 'OVERCLOCK' | 'QUANTUM';
  code: string;
  description: string;
  syntaxGuide: string;
  baseBpm: number;
  unlocked: boolean;
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
