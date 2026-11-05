export interface ChiptuneTrack {
  id: string;
  title: string;
  author: string;
  genre: 'cumbia' | 'dubstep' | 'phonk' | 'lofi' | 'synthwave';
  bpm: number;
  description: string;
  lead: string[];
  arp: string[];
  bass: string[];
  drums: string[]; // 'K' = Kick, 'S' = Snare, 'H' = Hi-hat, 'O' = Open hat, 'G' = Güiro short, 'W' = Güiro long, 'C' = Conga slap, 'B' = Cowbell 808, '-' = Rest
}

export const NOTE_FREQS: Record<string, number> = {
  '-': 0,
  // Octave 2
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'Ab2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  // Octave 6
  'C6': 1046.50, 'Db6': 1108.73, 'D6': 1174.66, 'Eb6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00,
};

export const CHIPTUNE_TRACKS: ChiptuneTrack[] = [
  {
    id: 'cumbia-sonidera',
    title: 'CUMBIA SONIDERA (94 BPM)',
    author: 'Sonido Cybernético 2026',
    genre: 'cumbia',
    bpm: 94,
    description: 'Ritmo tropical sonidero con güiro rascado ("chiti-chiti-chá"), congas en contratiempo, bajo saltarín y melodía de acordeón.',
    lead: [
      'G4', '-', 'C5', 'D5', 'Eb5', '-', 'D5', 'C5',
      'D5', '-', 'Eb5', 'D5', 'C5', '-', 'G4', '-',
      'F4', '-', 'Bb4', 'C5', 'D5', '-', 'C5', 'Bb4',
      'C5', '-', 'D5', 'C5', 'G4', '-', '-', '-'
    ],
    arp: [
      'C4', 'Eb4', 'G4', 'Eb4', 'C4', 'Eb4', 'G4', 'Eb4',
      'G3', 'B3', 'D4', 'B3', 'G3', 'B3', 'D4', 'B3',
      'Bb3', 'D4', 'F4', 'D4', 'Bb3', 'D4', 'F4', 'D4',
      'C4', 'Eb4', 'G4', 'Eb4', 'C4', 'Eb4', 'G4', 'Eb4'
    ],
    bass: [
      'C2', '-', 'G2', 'C3', '-', 'C2', 'G2', '-',
      'G2', '-', 'D2', 'G3', '-', 'G2', 'D2', '-',
      'Bb2', '-', 'F2', 'Bb3', '-', 'Bb2', 'F2', '-',
      'C2', '-', 'G2', 'C3', '-', 'C2', 'G2', '-'
    ],
    drums: [
      'K', 'G', 'W', 'C', 'G', 'G', 'W', 'C',
      'K', 'G', 'W', 'C', 'G', 'G', 'W', 'C',
      'K', 'G', 'W', 'C', 'G', 'G', 'W', 'C',
      'K', 'G', 'W', 'C', 'G', 'W', 'C', 'C'
    ]
  },
  {
    id: 'skrillex-brostep',
    title: 'SKRILLEX BROSTEP DROP (140 BPM)',
    author: 'Bangarang / OWSLA Style',
    genre: 'dubstep',
    bpm: 140,
    description: 'Ritmo half-time demencial a 140 BPM: bombo pesado en el tiempo 1, tarolazo demoledor en el 3, bajo wobble agresivo y sub-graves.',
    lead: [
      'D5', '-', 'D5', 'F5', '-', 'G5', 'F5', 'D5',
      'A5', '-', 'Ab5', 'G5', 'F5', 'D5', 'C5', '-',
      'D5', 'D5', '-', 'F5', 'G5', '-', 'A5', '-',
      'D6', '-', 'C6', 'A5', 'F5', 'G5', 'D5', '-'
    ],
    arp: [
      'D4', 'A4', 'F4', 'D5', 'D4', 'A4', 'F4', 'D5',
      'C4', 'G4', 'E4', 'C5', 'C4', 'G4', 'E4', 'C5',
      'Bb3', 'F4', 'D4', 'Bb4', 'Bb3', 'F4', 'D4', 'Bb4',
      'A3', 'E4', 'C#4', 'A4', 'A3', 'E4', 'C#4', 'A4'
    ],
    bass: [
      'D2', 'D2', '-', 'D2', 'F2', '-', 'D2', '-',
      'G2', 'F2', 'D2', '-', 'C2', 'C#2', 'D2', '-',
      'D2', '-', 'D2', 'D2', 'Ab2', 'G2', 'F2', '-',
      'D2', 'D2', '-', 'D2', 'F2', 'G2', 'Ab2', 'A2'
    ],
    drums: [
      'K', '-', 'H', '-', 'H', '-', 'K', '-',
      'S', '-', 'H', '-', 'H', 'H', 'K', '-',
      'K', '-', 'H', '-', 'H', '-', 'H', 'K',
      'S', '-', 'H', 'H', 'K', 'S', 'S', 'S'
    ]
  },
  {
    id: 'phonk-drift',
    title: 'PHONK DRIFT 808 (130 BPM)',
    author: 'Memphis Drift Club',
    genre: 'phonk',
    bpm: 130,
    description: 'Melodía oscura de cencerro 808 (cowbell), redobles veloces de hi-hats y bajo 808 saturado para tipear a fondo.',
    lead: [
      'F5', 'Ab5', 'C6', 'Bb5', 'Ab5', 'F5', '-', 'Ab5',
      'G5', 'F5', 'Eb5', 'F5', 'Ab5', 'G5', 'F5', '-',
      'F5', 'Ab5', 'C6', 'Db6', 'C6', 'Bb5', 'Ab5', 'F5',
      'Ab5', 'G5', 'F5', 'Eb5', 'F5', '-', '-', '-'
    ],
    arp: [
      'F4', 'Ab4', 'C5', 'Ab4', 'Eb4', 'G4', 'Bb4', 'G4',
      'Db4', 'F4', 'Ab4', 'F4', 'C4', 'E4', 'G4', 'E4',
      'F4', 'Ab4', 'C5', 'Ab4', 'Eb4', 'G4', 'Bb4', 'G4',
      'Db4', 'F4', 'Ab4', 'F4', 'C4', 'E4', 'G4', 'E4'
    ],
    bass: [
      'F2', 'F2', '-', 'F2', 'F2', '-', 'Ab2', '-',
      'G2', 'G2', '-', 'G2', 'Eb2', '-', 'F2', '-',
      'F2', 'F2', '-', 'F2', 'F2', '-', 'Bb2', '-',
      'Ab2', 'G2', 'F2', '-', 'Eb2', '-', 'C2', '-'
    ],
    drums: [
      'K', 'H', 'B', 'H', 'S', 'H', 'B', 'H',
      'K', 'H', 'B', 'H', 'S', 'H', 'H', 'H',
      'K', 'H', 'B', 'H', 'S', 'H', 'K', 'K',
      'K', 'H', 'B', 'H', 'S', 'S', 'H', 'H'
    ]
  },
  {
    id: 'lofi-jazz',
    title: 'LO-FI JAZZ HOP (84 BPM)',
    author: 'Chill Study Café',
    genre: 'lofi',
    bpm: 84,
    description: 'Cadencia pausada a 84 BPM con acordes cálidos de piano Rhodes (séptimas de jazz), bombo acústico y percusión relajada.',
    lead: [
      'F4', '-', 'A4', 'C5', 'E5', '-', 'D5', '-',
      'C5', '-', 'Bb4', '-', 'A4', 'G4', 'F4', '-',
      'E4', '-', 'G4', 'Bb4', 'D5', '-', 'C5', '-',
      'Bb4', '-', 'A4', '-', 'G4', '-', '-', '-'
    ],
    arp: [
      'D4', 'F4', 'A4', 'C5', 'D4', 'F4', 'A4', 'C5',
      'G3', 'Bb3', 'D4', 'F4', 'G3', 'Bb3', 'D4', 'F4',
      'C4', 'E4', 'G4', 'Bb4', 'C4', 'E4', 'G4', 'Bb4',
      'A3', 'C#4', 'E4', 'G4', 'A3', 'C#4', 'E4', 'G4'
    ],
    bass: [
      'D2', '-', '-', 'D2', '-', '-', 'F2', '-',
      'G2', '-', '-', 'G2', '-', '-', 'Bb2', '-',
      'C2', '-', '-', 'C2', '-', '-', 'E2', '-',
      'A2', '-', '-', 'A2', '-', '-', 'C#3', '-'
    ],
    drums: [
      'K', '-', 'H', '-', 'S', '-', 'H', '-',
      'K', '-', 'H', 'K', 'S', '-', 'H', '-',
      'K', '-', 'H', '-', 'S', '-', 'H', '-',
      'K', '-', 'H', '-', 'S', '-', 'H', 'H'
    ]
  },
  {
    id: 'cyber-synthwave',
    title: 'CYBER SYNTHWAVE (120 BPM)',
    author: 'CodeRhythm Core',
    genre: 'synthwave',
    bpm: 120,
    description: 'Bajo analógico continuo, batería ochentosa y arpegios brillantes en Re menor para ritmo constante.',
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
  }
];
