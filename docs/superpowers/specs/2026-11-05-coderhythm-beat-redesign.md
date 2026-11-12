# CodeRhythm: Don't Break the Beat - Technical Specification

**Date:** 2026-11-05
**Status:** Approved by User

## 1. Overview & Vision
CodeRhythm is a rhythm-based educational programming game where players learn real-world coding syntax (Python, JavaScript, C) while maintaining a continuous musical groove. 

The core slogan is **"Don't Break the Beat"**:
* A background electronic beat runs as the player types.
* Accurate, rhythmic typing elevates the combo multiplier and layers additional harmonic arpeggios.
* Any typo immediately triggers a **Tape-Stop / Vinyl Scratch effect**, cutting off the background beat and glitching the screen until corrected.
* Completing a level simulates real-time compilation/execution in an interactive output terminal.

## 2. Audio Engine (`SynthEngine` & `ChiptunePlayer`)
- **Multiple Selectable Background Beats**:
  1. *Cyber Synthwave (120 BPM)*: Analog fat bass, 80s gated reverb snare, neon synth leads.
  2. *Neon Chiptune (128 BPM)*: Authentic 8-bit pulse waves, triangle bass, retro arpeggios.
  3. *Lo-Fi Code Chill (90 BPM)*: Warm lowpass filter, vinyl crackle, gentle chords for study focus.
  4. *Overclock Electro / D&B (140 BPM)*: High-velocity tempo, syncopated breakbeats.
- **Beat-Cutting ("Don't Break the Beat")**:
  - `triggerTapeStop()`: Instantly ramps down pitch and gain over 80ms, freezing the sequencer.
  - Beat remains interrupted while user input contains an error.
  - Fixing the error restarts the beat seamlessly with a drum fill.
- **Typing Note Synthesis**:
  - Each correct keystroke plays a musical note locked to the active beat's scale (D minor pentatonic / synthwave aeolian).

## 3. Curriculum & Language Selector
Supports 3 distinct programming tracks:
- **Python**: Beginner friendly, indentation-focused (`print`, variables, arithmetic, `if:`, `for in range:`).
- **JavaScript**: Web standard (`console.log`, `let`/`const`, booleans, `if {}`, arrow functions).
- **C**: Systems programming (`printf`, `int`/`float`, `+=`, `if {}`, `for (int i=0; ...)`).

Each level includes:
- Code to type.
- Human-friendly concept explanation ("💡 ¿Qué hace este código?").
- Live simulated terminal output executed on level completion.

## 4. UI & Branding
- **Logo CodeRhythm**: Displayed at top center/left with glowing neon borders.
- **Slogan & Status**: "Don't Break the Beat" with dynamic badge:
  - `BEAT SYNCED` (Emerald glow)
  - `BEAT BROKEN` (Crimson glitch)
- **Language Switcher Tabs**: Python, JavaScript, C.
- **Beat Selector Dropdown / Controls**: Quick toggle between tracks and volume control.
- **Interactive Output Terminal**: Visual proof that the code ran.
