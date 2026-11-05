import { useState, useEffect, useCallback } from 'react';
import { CyberHUD } from './components/CyberHUD';
import { AudioVisualizer } from './components/AudioVisualizer';
import { CodeEditorArena } from './components/CodeEditorArena';
import { VirtualCyberKeyboard } from './components/VirtualCyberKeyboard';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { ChiptuneController } from './components/ChiptuneController';
import { INITIAL_LEVELS } from './data/levels';
import { Level, GameStats } from './types';
import { synthEngine } from './audio/SynthEngine';
import { chiptunePlayer } from './audio/ChiptunePlayer';
import { CHIPTUNE_TRACKS } from './audio/ChiptuneTracks';
import { SYNCED_MELODIES, SyncedMelody, SyncedNote } from './audio/SyncedMelodies';

export function App() {
  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [userInput, setUserInput] = useState<string>('');
  const [hasGlitch, setHasGlitch] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [activeMelody, setActiveMelody] = useState<SyncedMelody>(SYNCED_MELODIES[0]);
  const [lastNote, setLastNote] = useState<SyncedNote | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    keystrokes: 0,
    errors: 0,
    startTime: null,
    endTime: null,
    perfectStreak: true,
    stability: 100,
  });

  const currentLevel = levels.find((l) => l.id === currentLevelId) || levels[0];

  // Reset inputs when switching level
  const resetLevel = useCallback(() => {
    setUserInput('');
    setHasGlitch(false);
    setIsVictoryModalOpen(false);
    setLastNote(null);
    setStats((prev) => ({
      ...prev,
      combo: 0,
      keystrokes: 0,
      errors: 0,
      startTime: null,
      endTime: null,
      stability: 100,
      perfectStreak: true,
    }));
  }, []);

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    const trackIndex = (levelId - 1) % CHIPTUNE_TRACKS.length;
    chiptunePlayer.setTrack(CHIPTUNE_TRACKS[trackIndex].id);
    resetLevel();
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    synthEngine.setMuted(nextMuted);
  };

  // Handle Keystrokes
  const handleKeyPress = (char: string) => {
    if (isVictoryModalOpen) return;

    // Start timer on first keystroke
    const now = Date.now();
    let startTime = stats.startTime;
    if (!startTime) {
      startTime = now;
    }

    const currentIndex = userInput.length;
    const targetCode = currentLevel.code;

    // Check if level is already full
    if (currentIndex >= targetCode.length) return;

    const expectedChar = targetCode[currentIndex];

    if (char === expectedChar) {
      // Correct keystroke: play synchronized note from the 8-bit song!
      const newCombo = stats.combo + 1;
      const multiplier = newCombo >= 20 ? 4 : newCombo >= 10 ? 2 : newCombo >= 5 ? 1.5 : 1;
      const scoreGain = Math.round(10 * multiplier);

      // Play the exact note of Bangarang / active melody
      const playedNote = synthEngine.playSyncedKeySound(currentIndex, newCombo);
      setLastNote(playedNote);

      const nextInput = userInput + char;
      setUserInput(nextInput);

      setStats((prev) => ({
        ...prev,
        score: prev.score + scoreGain,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        keystrokes: prev.keystrokes + 1,
        stability: Math.min(100, prev.stability + 2),
        startTime,
      }));

      // Check level completion
      if (nextInput.length === targetCode.length) {
        // Victory!
        synthEngine.playVictoryFanfare();
        setStats((prev) => ({
          ...prev,
          endTime: Date.now(),
        }));

        // Unlock next level
        setLevels((prevLevels) =>
          prevLevels.map((lvl) =>
            lvl.id === currentLevelId + 1 ? { ...lvl, unlocked: true } : lvl
          )
        );

        setTimeout(() => {
          setIsVictoryModalOpen(true);
        }, 300);
      }
    } else {
      // Mistake: Glitch Distortion Sound & Combo Reset!
      synthEngine.playGlitchDistortion();
      setLastNote(null);
      setHasGlitch(true);
      setTimeout(() => setHasGlitch(false), 250);

      setStats((prev) => ({
        ...prev,
        combo: 0,
        errors: prev.errors + 1,
        keystrokes: prev.keystrokes + 1,
        perfectStreak: false,
        stability: Math.max(0, prev.stability - 15),
        startTime,
      }));
    }
  };

  // Handle Backspace
  const handleBackspace = () => {
    if (userInput.length > 0 && !isVictoryModalOpen) {
      setUserInput((prev) => prev.slice(0, -1));
    }
  };

  const hasNextLevel = levels.some((lvl) => lvl.id === currentLevelId + 1);

  const handleNextLevel = () => {
    if (hasNextLevel) {
      setCurrentLevelId((prev) => prev + 1);
      resetLevel();
    }
  };

  // First interaction audio initialization
  useEffect(() => {
    const handleFirstTouch = () => {
      synthEngine.init();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };

    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('keydown', handleFirstTouch);

    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', padding: '16px 20px 40px' }}>
      {/* CRT Scanline & Ambient Filter Layers */}
      <div className="scanlines-overlay" />
      <div className="cyber-vignette" />

      {/* Main Container */}
      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Cyber HUD Header */}
        <CyberHUD
          currentLevel={currentLevel}
          stats={stats}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenLevelSelector={() => setIsLevelSelectorOpen(true)}
        />

        {/* 8-Bit Chiptune Track Player & APU Synthesizer Control */}
        <ChiptuneController
          combo={stats.combo}
          lastNote={lastNote}
          activeMelody={activeMelody}
          onSelectMelody={(melodyId) => {
            const found = SYNCED_MELODIES.find((m) => m.id === melodyId);
            if (found) {
              setActiveMelody(found);
            }
          }}
        />

        {/* Real-time Oscilloscope & Spectrum Visualizer */}
        <div style={{ marginBottom: '16px' }}>
          <AudioVisualizer combo={stats.combo} hasError={hasGlitch} />
        </div>

        {/* Coding Arena */}
        <CodeEditorArena
          currentLevel={currentLevel}
          userInput={userInput}
          hasGlitch={hasGlitch}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onResetLevel={resetLevel}
        />

        {/* Virtual Keyboard & Quick Macros */}
        <VirtualCyberKeyboard
          onKeyClick={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={() => handleKeyPress('\n')}
        />

        {/* Level Selector Modal */}
        {isLevelSelectorOpen && (
          <LevelSelectorModal
            levels={levels}
            currentLevelId={currentLevelId}
            onSelectLevel={handleSelectLevel}
            onClose={() => setIsLevelSelectorOpen(false)}
          />
        )}

        {/* Victory Screen */}
        {isVictoryModalOpen && (
          <VictoryModal
            level={currentLevel}
            stats={stats}
            hasNextLevel={hasNextLevel}
            onNextLevel={handleNextLevel}
            onReplay={resetLevel}
          />
        )}
      </div>
    </div>
  );
}

export default App;
