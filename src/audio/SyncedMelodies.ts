export interface SyncedNote {
  note: string;       // Note name e.g. 'D4', 'Ab4', 'D3'
  freq: number;       // Exact frequency in Hz
  type: 'lead' | 'growl' | 'stutter' | 'sub';
  label?: string;     // Vocal / sound label e.g. "BAN-", "GA-", "RANG!"
}

export interface SyncedMelody {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  description: string;
  notes: SyncedNote[];
}

export const NOTE_MAP: Record<string, number> = {
  // Octave 2 & 3
  'C2': 65.41, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00,
  'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  // Octave 6
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00,
};

// 1. Skrillex - Bangarang (Iconic 8-Bit Dubstep / Chiptune Riff & Drop)
const BANGARANG_NOTES: SyncedNote[] = [
  // Intro Riff 1
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },
  { note: 'G4', freq: NOTE_MAP['G4'], type: 'lead' },
  { note: 'Ab4', freq: NOTE_MAP['Ab4'], type: 'lead' },
  { note: 'G4', freq: NOTE_MAP['G4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },

  // Intro Riff 2
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },
  { note: 'G4', freq: NOTE_MAP['G4'], type: 'lead' },
  { note: 'Ab4', freq: NOTE_MAP['Ab4'], type: 'lead' },
  { note: 'A4', freq: NOTE_MAP['A4'], type: 'lead' },
  { note: 'Ab4', freq: NOTE_MAP['Ab4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },

  // Vocal Stutter Build: "Ba-ba-ba-bangarang!"
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'stutter', label: 'BA-' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'stutter', label: 'BA-' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'stutter', label: 'BAN-' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'stutter', label: 'GA-' },
  { note: 'D5', freq: NOTE_MAP['D5'], type: 'lead', label: 'RANG!' },

  // THE 8-BIT DROP: Heavy Dubstep Growl + Square Lead Attack
  { note: 'D3', freq: NOTE_MAP['D3'], type: 'growl', label: 'WUB' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },
  { note: 'G4', freq: NOTE_MAP['G4'], type: 'lead' },
  { note: 'Ab4', freq: NOTE_MAP['Ab4'], type: 'lead' },
  { note: 'G4', freq: NOTE_MAP['G4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },
  { note: 'D3', freq: NOTE_MAP['D3'], type: 'growl', label: 'GROWL' },

  // High Drop Response
  { note: 'D5', freq: NOTE_MAP['D5'], type: 'lead' },
  { note: 'C5', freq: NOTE_MAP['C5'], type: 'lead' },
  { note: 'A4', freq: NOTE_MAP['A4'], type: 'lead' },
  { note: 'Ab4', freq: NOTE_MAP['Ab4'], type: 'lead' },
  { note: 'G4', freq: NOTE_MAP['G4'], type: 'lead' },
  { note: 'F4', freq: NOTE_MAP['F4'], type: 'lead' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'C4', freq: NOTE_MAP['C4'], type: 'lead' },

  // Sub bass finish
  { note: 'D3', freq: NOTE_MAP['D3'], type: 'growl', label: 'WUB-WUB' },
  { note: 'D4', freq: NOTE_MAP['D4'], type: 'lead' },
  { note: 'D5', freq: NOTE_MAP['D5'], type: 'lead', label: 'BANGARANG!' },
];

// 2. Daft Punk - Harder, Better, Faster, Stronger (8-Bit Electro Funk)
const DAFT_PUNK_NOTES: SyncedNote[] = [
  { note: 'F#4', freq: NOTE_MAP['F#4'], type: 'lead', label: 'Work it' },
  { note: 'F#4', freq: NOTE_MAP['F#4'], type: 'lead', label: 'Make it' },
  { note: 'A4', freq: NOTE_MAP['A4'], type: 'lead', label: 'Do it' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead', label: 'Makes us' },
  { note: 'C#5', freq: NOTE_MAP['C#5'], type: 'lead', label: 'Harder' },
  { note: 'C#5', freq: NOTE_MAP['C#5'], type: 'lead', label: 'Better' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead', label: 'Faster' },
  { note: 'A4', freq: NOTE_MAP['A4'], type: 'lead', label: 'Stronger' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'A4', freq: NOTE_MAP['A4'], type: 'lead' },
  { note: 'F#4', freq: NOTE_MAP['F#4'], type: 'lead' },
  { note: 'E4', freq: NOTE_MAP['E4'], type: 'lead' },
  { note: 'F#4', freq: NOTE_MAP['F#4'], type: 'sub' },
];

// 3. Darude - Sandstorm (8-Bit Retro Trance)
const SANDSTORM_NOTES: SyncedNote[] = [
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'D5', freq: NOTE_MAP['D5'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'E5', freq: NOTE_MAP['E5'], type: 'lead' },
  { note: 'B4', freq: NOTE_MAP['B4'], type: 'lead' },
  { note: 'D5', freq: NOTE_MAP['D5'], type: 'lead' },
];

export const SYNCED_MELODIES: SyncedMelody[] = [
  {
    id: 'bangarang',
    name: 'BANGARANG (8-BIT)',
    artist: 'SKRILLEX',
    bpm: 110,
    description: 'El legendario riff y drop dubstep de Skrillex recreado nota por nota en chip 8-bit.',
    notes: BANGARANG_NOTES,
  },
  {
    id: 'daft-punk',
    name: 'HARDER, BETTER, FASTER (8-BIT)',
    artist: 'DAFT PUNK',
    bpm: 124,
    description: 'Electro funk robótico sincronizado a cada pulsación de tu código.',
    notes: DAFT_PUNK_NOTES,
  },
  {
    id: 'sandstorm',
    name: 'SANDSTORM (8-BIT)',
    artist: 'DARUDE',
    bpm: 136,
    description: 'Arpegio trance arcade a máxima velocidad para tecleo continuo.',
    notes: SANDSTORM_NOTES,
  },
];
