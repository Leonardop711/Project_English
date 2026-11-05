# CodeRhythm: Don't Break the Beat - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the project into **CodeRhythm**, a rhythm-based programming game with the slogan **"Don't Break the Beat"**, supporting Python, JavaScript, and C with multiple background beats that cut upon error and resume upon correction, complete with interactive execution output and official logo branding.

**Architecture:** 
- Centralized `types/index.ts` with language tracks (`python`, `javascript`, `c`), educational metadata, and simulated terminal outputs.
- Enhanced Web Audio procedural synth (`SynthEngine.ts`, `ChiptunePlayer.ts`) supporting 4 selectable beats, instant tape-stop/beat-cut mechanics on typo, and harmonized key sound synthesis.
- React components (`CyberHUD.tsx`, `CodeEditorArena.tsx`, `ChiptuneController.tsx`, `App.tsx`) providing language switching, beat selection, real-time beat sync status, and simulated live compiler execution.

**Tech Stack:** React 19, TypeScript, Vite, Web Audio API, Canvas Confetti, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-05-coderhythm-beat-redesign.md`

## Global Constraints
- No external audio network requests; 100% procedural Web Audio synthesis for instantaneous load times and zero network failure.
- Logo located at `public/coderhythm-logo.jpg`.
- Strict typing and clean TypeScript build (`tsc && vite build` must pass with 0 errors).

---

### Task 1: Curriculum & Multi-Language Levels Model

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/data/levels.ts`

- [ ] **Step 1: Update `types/index.ts`**
  Add `Language = 'python' | 'javascript' | 'c'`, expand `Level` with `language: Language`, `expectedOutput: string`, `conceptTip: string`.
- [ ] **Step 2: Populate `levels.ts` with 5 levels per language**
  - Python: 5 progressive levels (print, variables, arithmetic, if/else, for loops).
  - JavaScript: 5 progressive levels (console.log, let/const, booleans, if/else, arrow functions).
  - C: 5 progressive levels (printf, types, +=, if, for loops).
- [ ] **Step 3: Verify TypeScript compilation**
  Run `npm run build` and ensure types align.

---

### Task 2: Audio Engine "Don't Break the Beat" & Multiple Tracks

**Files:**
- Modify: `src/audio/ChiptuneTracks.ts`
- Modify: `src/audio/ChiptunePlayer.ts`
- Modify: `src/audio/SynthEngine.ts`

- [ ] **Step 1: Expand `ChiptuneTracks.ts`**
  Add 4 high-quality procedural beats:
  1. `cyber-synthwave` (120 BPM)
  2. `neon-chiptune` (128 BPM)
  3. `lofi-chill` (90 BPM)
  4. `electro-rush` (140 BPM)
- [ ] **Step 2: Implement True Tape-Stop in `ChiptunePlayer.ts`**
  Add `triggerTapeStop()` with rapid pitch ramp down and gain cutoff over 80ms, pausing sequencer and tracking `isBeatCut = true`.
  Add `resumeBeat()` to restart cleanly when the error is corrected.
- [ ] **Step 3: Connect in `SynthEngine.ts`**
  Tie glitch sound to `triggerTapeStop()` and keystroke recovery to `resumeBeat()`.
- [ ] **Step 4: Verify build**
  Run `npm run build`.

---

### Task 3: Logo, Slogan & Header HUD Redesign

**Files:**
- Modify: `index.html`
- Modify: `src/components/CyberHUD.tsx`

- [ ] **Step 1: Update `index.html` metadata**
  Change title to "CodeRhythm // Don't Break the Beat".
- [ ] **Step 2: Redesign `CyberHUD.tsx`**
  - Render `/coderhythm-logo.jpg` with glowing border.
  - Add slogan "Don't Break the Beat".
  - Add dynamic status badge: `BEAT SYNCED` (green neon) / `BEAT BROKEN` (red neon).
  - Add language switcher tabs (Python, JavaScript, C) with active badge.
- [ ] **Step 3: Verify build**
  Run `npm run build`.

---

### Task 4: Beat Selector & Audio Controller

**Files:**
- Modify: `src/components/ChiptuneController.tsx`

- [ ] **Step 1: Upgrade `ChiptuneController.tsx`**
  Add Track Selector dropdown/chips for the 4 beats (Synthwave, Chiptune, Lo-Fi, Electro), volume control, play/pause button, and BPM display.
- [ ] **Step 2: Verify build**
  Run `npm run build`.

---

### Task 5: Code Arena & Live Execution Output Terminal

**Files:**
- Modify: `src/components/CodeEditorArena.tsx`

- [ ] **Step 1: Add Educational Concept Box**
  Show `currentLevel.conceptTip` prominently before typing begins.
- [ ] **Step 2: Implement Live Execution Terminal**
  Simulate real compiler output (Python stdout, JS console, GCC output) when the code is completed.
- [ ] **Step 3: Wire Beat Status Visuals**
  Highlight editor with danger glitch and "BEAT BROKEN" cue when a mistake happens.
- [ ] **Step 4: Verify build**
  Run `npm run build`.

---

### Task 6: Orchestration, Victory Modal & Dev Server Preview

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/VictoryModal.tsx`

- [ ] **Step 1: Update `App.tsx`**
  Wire active language state, filter levels by language, hook audio tape-stop on errors and resume on correction/start.
- [ ] **Step 2: Update `VictoryModal.tsx`**
  Reflect CodeRhythm branding, display language and level stats (WPM, Accuracy, Max Combo).
- [ ] **Step 3: Run final build and start dev server**
  Execute `npm run build` and launch preview/dev server so the user can see it in action.
