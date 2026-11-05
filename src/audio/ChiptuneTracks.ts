export interface ChiptuneTrack {
  id: string;
  title: string;
  author: string;
  bpm: number;
  description: string;
  // 16 or 32 steps per pattern
  lead: string[];
  arp: string[];
  bass: string[];
  drums: string[]; // 'K' = Kick, 'S' = Snare, 'H' = Hi-hat, '-' = Rest
}

export const NOTE_FREQS: Record<string, number> = {
  '-': 0,
  // Octave 2
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  // Octave 3
  'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  // Octave 6
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00,
};

export const CHIPTUNE_TRACKS: ChiptuneTrack[] = [
  {
    id: 'bangarang-beat',
    title: 'BANGARANG 8-BIT DRUM GROOVE',
    author: 'SKRILLEX 8-BIT APU',
    bpm: 110,
    description: 'Base rítmica Moombahton / Dubstep a 110 BPM para acompañar tu tecleo de Bangarang.',
    lead: [
      '-', '-', '-', '-', '-', '-', '-', '-',
      '-', '-', '-', '-', '-', '-', '-', '-'
    ],
    arp: [
      'D4', '-', 'D4', '-', 'D4', '-', 'D4', '-',
      'D4', '-', 'D4', '-', 'F4', '-', 'A4', '-'
    ],
    bass: [
      'D2', '-', '-', '-', 'D2', '-', '-', '-',
      'D2', '-', '-', 'D2', '-', '-', 'F2', 'A2'
    ],
    drums: [
      'K', '-', 'H', '-', 'S', '-', 'H', '-',
      'K', '-', 'H', 'K', 'S', '-', 'H', 'H'
    ]
  },
  {
    id: 'cyber-genesis',
    title: '8-BIT CYBER GENESIS',
    author: 'CYBER-APU',
    bpm: 125,
    description: 'Himno chiptune retro en Re menor con arpegios veloces y bajo triangular.',
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
      'D3', 'D3', 'D3', 'D3', 'D3', 'D3', 'F3', 'A2',
      'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'E3', 'G2',
      'Bb2', 'Bb2', 'Bb2', 'Bb2', 'Bb2', 'Bb2', 'D3', 'F2',
      'A2', 'A2', 'A2', 'A2', 'A2', 'C#3', 'E3', 'A2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'S', 'S', 'S'
    ]
  },
  {
    id: 'megaman-rush',
    title: 'NEO MEGAMAN RUSH',
    author: 'PIXEL-8',
    bpm: 138,
    description: 'Chiptune de acción heroica a 138 BPM estilo NES Capcom clásico.',
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
      'A2', '-', 'A2', 'A2', '-', 'A2', 'C3', 'E3',
      'D3', '-', 'D3', 'D3', '-', 'D3', 'F3', 'A2',
      'F2', '-', 'F2', 'F2', '-', 'F2', 'A2', 'C3',
      'E2', '-', 'E2', 'E2', 'E2', 'E2', 'G#2', 'B2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'K',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'S', 'K', 'S', 'S', 'K'
    ]
  },
  {
    id: 'hacker-dungeon',
    title: 'QUANTUM CHIP HAZARD',
    author: 'CYBER-CORE',
    bpm: 120,
    description: 'Atmósfera 8-bit oscura y misteriosa para hackear subredes.',
    lead: [
      'E5', '-', '-', 'G5', 'F#5', '-', 'E5', '-',
      'B4', '-', 'D5', '-', 'E5', '-', '-', '-',
      'C5', '-', '-', 'E5', 'D5', '-', 'C5', '-',
      'A4', '-', 'C5', '-', 'B4', '-', '-', '-'
    ],
    arp: [
      'E4', 'G4', 'B4', 'G4', 'E4', 'G4', 'B4', 'G4',
      'D4', 'F#4', 'A4', 'F#4', 'D4', 'F#4', 'A4', 'F#4',
      'C4', 'E4', 'G4', 'E4', 'C4', 'E4', 'G4', 'E4',
      'B3', 'D#4', 'F#4', 'D#4', 'B3', 'D#4', 'F#4', 'D#4'
    ],
    bass: [
      'E2', 'E2', '-', 'E2', 'E2', '-', 'G2', 'B2',
      'D2', 'D2', '-', 'D2', 'D2', '-', 'F#2', 'A2',
      'C2', 'C2', '-', 'C2', 'C2', '-', 'E2', 'G2',
      'B1', 'B1', '-', 'B1', 'B1', 'B1', 'D#2', 'F#2'
    ],
    drums: [
      'K', '-', 'S', 'H', 'K', '-', 'S', 'H',
      'K', 'H', 'S', '-', 'K', 'H', 'S', 'H',
      'K', '-', 'S', 'H', 'K', '-', 'S', 'H',
      'K', 'H', 'S', 'K', 'S', 'S', 'K', 'H'
    ]
  },
  {
    id: 'overclock-boss',
    title: 'OVERCLOCK 8-BIT CLIMAX',
    author: 'RETRO-TITAN',
    bpm: 148,
    description: 'Tempo frenético a 148 BPM para teclear a máxima adrenalina.',
    lead: [
      'F5', 'F5', 'Ab5', 'C6', 'Bb5', '-', 'Ab5', 'G5',
      'Ab5', '-', 'Bb5', 'C6', 'Db6', '-', 'C6', 'Bb5',
      'C6', 'C6', 'Eb6', 'F6', 'Eb6', '-', 'Db6', 'C6',
      'Bb5', '-', 'Ab5', 'G5', 'F5', '-', '-', '-'
    ],
    arp: [
      'F4', 'Ab4', 'C5', 'Ab4', 'F4', 'Ab4', 'C5', 'Ab4',
      'Db4', 'F4', 'Ab4', 'F4', 'Db4', 'F4', 'Ab4', 'F4',
      'Eb4', 'G4', 'Bb4', 'G4', 'Eb4', 'G4', 'Bb4', 'G4',
      'C4', 'E4', 'G4', 'E4', 'C4', 'E4', 'G4', 'E4'
    ],
    bass: [
      'F2', 'F2', 'F2', 'F2', 'F2', 'F2', 'Ab2', 'C3',
      'Db2', 'Db2', 'Db2', 'Db2', 'Db2', 'Db2', 'F2', 'Ab2',
      'Eb2', 'Eb2', 'Eb2', 'Eb2', 'Eb2', 'Eb2', 'G2', 'Bb2',
      'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'E2', 'G2'
    ],
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'S',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'K', 'S', 'S', 'K', 'S', 'K', 'S'
    ]
  }
];
