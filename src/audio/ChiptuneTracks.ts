export interface ChiptuneTrack {
  id: string;
  title: string;
  author: string;
  bpm: number;
  description: string;
  lead: string[];
  arp: string[];
  bass: string[];
  drums: string[]; // 'K' = Kick, 'S' = Snare, 'H' = Hi-hat, 'O' = Open hat, '-' = Rest
}

export const NOTE_FREQS: Record<string, number> = {
  '-': 0,
  // Octave 2
  'C2': 65.41, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  // Octave 6
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00,
};

export const CHIPTUNE_TRACKS: ChiptuneTrack[] = [
  {
    id: 'cyber-synthwave',
    title: 'CYBER SYNTHWAVE (120 BPM)',
    author: 'CodeRhythm Core',
    bpm: 120,
    description: 'Bajo analógico profundo, batería ochentosa y acordes en Re menor para máxima concentración.',
    lead: [
      'D5', '-', 'F5', '-', 'A5', '-', 'D6', '-',
      'C6', '-', 'A5', '-', 'F5', 'G5', 'A5', '-',
      'G5', '-', 'Bb5', '-', 'D6', '-', 'G5', '-',
      'F5', 'E5', 'F5', 'G5', 'A5', '-', '-', '-'
    ],
    arp: [
      'D4', 'F4', 'A4', 'F4', 'D4', 'F4', 'A4', 'F4',
      'C4', 'E4', 'G4', 'E4', 'C4', 'E4', 'G4', 'E4',
      'Bb3', 'D4', 'F4', 'D4', 'Bb3', 'D4', 'F4', 'D4',
      'A3', 'C#4', 'E4', 'C#4', 'A3', 'C#4', 'E4', 'C#4'
    ],
    bass: [
      'D2', 'D2', 'D3', 'D2', 'D2', 'D2', 'F2', 'A2',
      'C2', 'C2', 'C3', 'C2', 'C2', 'C2', 'E2', 'G2',
      'Bb2', 'Bb2', 'Bb3', 'Bb2', 'Bb2', 'Bb2', 'D2', 'F2',
      'A2', 'A2', 'A3', 'A2', 'A2', 'C#3', 'E2', 'A2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'S', 'S', 'S'
    ]
  },
  {
    id: 'neon-chiptune',
    title: 'NEON CHIPTUNE 8-BIT (128 BPM)',
    author: 'Capcom NES Style',
    bpm: 128,
    description: 'Sonido retro arcade estilo Mega Man con pulso cuadrado y percusión veloz.',
    lead: [
      'A4', 'A4', 'C5', 'D5', 'E5', '-', 'D5', 'C5',
      'D5', '-', 'E5', 'G5', 'A5', '-', 'G5', 'E5',
      'F5', '-', 'E5', 'D5', 'C5', 'D5', 'E5', '-',
      'D5', 'C5', 'A4', '-', 'A4', '-', '-', '-'
    ],
    arp: [
      'A3', 'C4', 'E4', 'A4', 'A3', 'C4', 'E4', 'A4',
      'D4', 'F4', 'A4', 'D5', 'D4', 'F4', 'A4', 'D5',
      'F3', 'A3', 'C4', 'F4', 'F3', 'A3', 'C4', 'F4',
      'E3', 'G#3', 'B3', 'E4', 'E3', 'G#3', 'B3', 'E4'
    ],
    bass: [
      'A2', 'A2', 'A3', 'A2', 'A2', 'A2', 'C3', 'E2',
      'D3', 'D3', 'D4', 'D3', 'D3', 'D3', 'F3', 'A2',
      'F2', 'F2', 'F3', 'F2', 'F2', 'F2', 'A2', 'C3',
      'E2', 'E2', 'E3', 'E2', 'E2', 'E2', 'G#2', 'B2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'O'
    ]
  },
  {
    id: 'lofi-chill',
    title: 'LO-FI CODE CHILL (90 BPM)',
    author: 'Cyber Study Club',
    bpm: 90,
    description: 'Cadencia relajada de 90 BPM con acordes cálidos y bombo suave para codificar sin prisa.',
    lead: [
      'D4', '-', '-', 'F4', 'A4', '-', 'G4', '-',
      'F4', '-', 'E4', '-', 'D4', '-', '-', '-',
      'C4', '-', '-', 'E4', 'G4', '-', 'F4', '-',
      'E4', '-', 'D4', '-', 'C#4', '-', '-', '-'
    ],
    arp: [
      'F3', 'A3', 'C4', 'E4', 'F3', 'A3', 'C4', 'E4',
      'D3', 'F3', 'A3', 'C4', 'D3', 'F3', 'A3', 'C4',
      'Bb2', 'D3', 'F3', 'A3', 'Bb2', 'D3', 'F3', 'A3',
      'A2', 'C#3', 'E3', 'G3', 'A2', 'C#3', 'E3', 'G3'
    ],
    bass: [
      'D2', '-', '-', 'D2', '-', '-', 'D2', '-',
      'Bb2', '-', '-', 'Bb2', '-', '-', 'Bb2', '-',
      'G2', '-', '-', 'G2', '-', '-', 'G2', '-',
      'A2', '-', '-', 'A2', '-', '-', 'A2', '-'
    ],
    drums: [
      'K', '-', 'H', '-', 'S', '-', 'H', '-',
      'K', '-', 'H', 'K', 'S', '-', 'H', '-',
      'K', '-', 'H', '-', 'S', '-', 'H', '-',
      'K', '-', 'H', '-', 'S', '-', 'H', 'H'
    ]
  },
  {
    id: 'electro-rush',
    title: 'OVERCLOCK ELECTRO (140 BPM)',
    author: 'Neural Overdrive',
    bpm: 140,
    description: 'Ritmo acelerado a 140 BPM con bajos cortantes y percusión agresiva para máxima adrenalina.',
    lead: [
      'D5', 'D5', '-', 'D5', 'F5', 'F5', '-', 'F5',
      'G5', 'G5', 'F5', 'D5', 'C5', '-', 'C5', '-',
      'D5', 'D5', '-', 'D5', 'F5', 'F5', '-', 'F5',
      'A5', 'A5', 'G5', 'F5', 'D5', '-', '-', '-'
    ],
    arp: [
      'D4', 'D4', 'F4', 'D4', 'A4', 'D4', 'F4', 'D4',
      'C4', 'C4', 'E4', 'C4', 'G4', 'C4', 'E4', 'C4',
      'Bb3', 'Bb3', 'D4', 'Bb3', 'F4', 'Bb3', 'D4', 'Bb3',
      'A3', 'A3', 'C#4', 'A3', 'E4', 'A3', 'C#4', 'A3'
    ],
    bass: [
      'D2', 'D2', 'D2', 'D2', 'D2', 'D2', 'D2', 'D2',
      'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2',
      'Bb2', 'Bb2', 'Bb2', 'Bb2', 'Bb2', 'Bb2', 'Bb2', 'Bb2',
      'A2', 'A2', 'A2', 'A2', 'A2', 'A2', 'A2', 'A2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'S',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'K', 'S', 'H', 'K', 'S', 'S', 'S'
    ]
  }
];
