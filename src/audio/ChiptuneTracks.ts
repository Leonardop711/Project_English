export interface ChiptuneTrack {
  id: string;
  title: string;
  author: string;
  genre: 'cumbia' | 'dubstep' | 'phonk' | 'lofi' | 'synthwave' | 'chiptune';
  bpm: number;
  description: string;
  lead: string[];
  arp: string[];
  bass: string[];
  drums: string[]; // 'K' = Kick, 'S' = Snare, 'H' = Hi-hat, 'O' = Open hat, 'G' = Güiro short, 'W' = Güiro long, 'C' = Conga slap, 'B' = Cowbell 808, '-' = Rest
}

export const NOTE_FREQS: Record<string, number> = {
  '-': 0,
  // Octave 1
  'B1': 61.74,
  // Octave 2
  'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Ab2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
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
  },
  {
    id: 'bangarang-beat',
    title: 'BANGARANG DRUM & BASS GROOVE',
    author: 'SKRILLEX GROOVE',
    genre: 'dubstep',
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
    id: 'blinding-lights-beat',
    title: 'SYNTHWAVE 80S DRUM GROOVE',
    author: 'RETRO 80S',
    genre: 'synthwave',
    bpm: 171,
    description: 'Batería Synthwave clásica a 171 BPM con caja con reverb y bajo Moog.',
    lead: [
      '-', '-', '-', '-', '-', '-', '-', '-',
      '-', '-', '-', '-', '-', '-', '-', '-'
    ],
    arp: [
      'F4', '-', 'F4', '-', 'Eb4', '-', 'Eb4', '-',
      'Bb4', '-', 'Bb4', '-', 'C5', '-', 'C5', '-'
    ],
    bass: [
      'F2', 'F2', 'F2', 'F2', 'Eb2', 'Eb2', 'Eb2', 'Eb2',
      'Bb2', 'Bb2', 'Bb2', 'Bb2', 'C3', 'C3', 'C3', 'C3'
    ],
    drums: [
      'K', 'H', 'H', 'H', 'S', 'H', 'H', 'H',
      'K', 'H', 'K', 'H', 'S', 'H', 'H', 'H'
    ]
  },
  {
    id: 'cyber-genesis',
    title: '8-BIT CYBER GENESIS',
    author: 'CYBER-APU',
    genre: 'chiptune',
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
    genre: 'chiptune',
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
    genre: 'chiptune',
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
    genre: 'chiptune',
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
