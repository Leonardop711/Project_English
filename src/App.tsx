import { useState, useEffect, useCallback } from 'react';
import { CyberHUD } from './components/CyberHUD';
import { AudioVisualizer } from './components/AudioVisualizer';
import { CodeEditorArena } from './components/CodeEditorArena';
import { VirtualCyberKeyboard } from './components/VirtualCyberKeyboard';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { ChiptuneController } from './components/ChiptuneController';
import { INITIAL_LEVELS } from './data/levels';
import { Level, GameStats, Language } from './types';
import { synthEngine } from './audio/SynthEngine';
import { chiptunePlayer } from './audio/ChiptunePlayer';

export function App() {
  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('python');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [userInput, setUserInput] = useState<string>('');
  const [hasGlitch, setHasGlitch] = useState<boolean>(false);
  const [isBeatBroken, setIsBeatBroken] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [lastNote, setLastNote] = useState<{ note: string; label?: string } | null>(null);

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

  // Subscribe to beat status changes
  useEffect(() => {
    return chiptunePlayer.subscribeBeatStatus((isBroken) => {
      setIsBeatBroken(isBroken);
    });
  }, []);

  // Reset inputs when switching level
  const resetLevel = useCallback(() => {
    setUserInput('');
    setHasGlitch(false);
    setIsVictoryModalOpen(false);
    setLastNote(null);
    chiptunePlayer.resumeBeat();
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
    const targetLevel = levels.find((l) => l.id === levelId);
    if (targetLevel) {
      setCurrentLanguage(targetLevel.language);
      setCurrentLevelId(levelId);
      resetLevel();
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    const firstLevelForLang = levels.find((l) => l.language === lang);
    if (firstLevelForLang) {
      setCurrentLevelId(firstLevelForLang.id);
      resetLevel();
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    synthEngine.setMuted(nextMuted);
  };

  // Helper: check if there is an error in current typed string
  const checkHasError = (input: string, target: string) => {
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== target[i]) return true;
    }
    return false;
  };

  // Handle Keystrokes
  const handleKeyPress = (char: string) => {
    if (isVictoryModalOpen) return;

    // Start timer & ensure synth is initialized
    const now = Date.now();
    let startTime = stats.startTime;
    if (!startTime) {
      startTime = now;
      synthEngine.init();
      if (!chiptunePlayer.getIsPlaying()) {
        chiptunePlayer.start();
      }
    }

    const targetCode = currentLevel.code;

    // If already typed full length and correct, do nothing
    if (userInput.length >= targetCode.length && !checkHasError(userInput, targetCode)) {
      return;
    }

    // If an error already exists, require Backspace to fix it
    if (checkHasError(userInput, targetCode)) {
      synthEngine.playGlitchDistortion();
      setHasGlitch(true);
      setTimeout(() => setHasGlitch(false), 200);
      return;
    }

    const currentIndex = userInput.length;
    const expectedChar = targetCode[currentIndex];

    if (char === expectedChar) {
      // Correct keystroke!
      const newCombo = stats.combo + 1;
      const multiplier = newCombo >= 20 ? 4 : newCombo >= 10 ? 2 : newCombo >= 5 ? 1.5 : 1;
      const scoreGain = Math.round(10 * multiplier);

      // Play synchronized harmonic note
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
      if (nextInput === targetCode) {
        synthEngine.playVictoryFanfare();
        setStats((prev) => ({
          ...prev,
          endTime: Date.now(),
        }));

        // Unlock next level in current language track
        setLevels((prevLevels) =>
          prevLevels.map((lvl) =>
            lvl.id === currentLevelId + 1 ? { ...lvl, unlocked: true } : lvl
          )
        );

        setTimeout(() => {
          setIsVictoryModalOpen(true);
        }, 500);
      }
    } else {
      // Typo! "Don't Break the Beat"
      synthEngine.playGlitchDistortion();
      setLastNote(null);
      setHasGlitch(true);
      setTimeout(() => setHasGlitch(false), 250);

      // Append incorrect character so user sees the mistake highlighted
      setUserInput(userInput + char);

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
      const nextInput = userInput.slice(0, -1);
      setUserInput(nextInput);

      // If the error was eliminated, resume the beat!
      if (!checkHasError(nextInput, currentLevel.code)) {
        chiptunePlayer.resumeBeat();
      }
    }
  };

  // Find next level in current language
  const levelsInLanguage = levels.filter((l) => l.language === currentLanguage);
  const currentIdxInLang = levelsInLanguage.findIndex((l) => l.id === currentLevelId);
  const hasNextLevel = currentIdxInLang >= 0 && currentIdxInLang < levelsInLanguage.length - 1;

  const handleNextLevel = () => {
    if (hasNextLevel) {
      const nextLvl = levelsInLanguage[currentIdxInLang + 1];
      setCurrentLevelId(nextLvl.id);
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
        {/* Cyber HUD Header with Logo & Slogan */}
        <CyberHUD
          currentLevel={currentLevel}
          stats={stats}
          isMuted={isMuted}
          isBeatBroken={isBeatBroken}
          currentLanguage={currentLanguage}
          onSelectLanguage={handleSelectLanguage}
          onToggleMute={handleToggleMute}
          onOpenLevelSelector={() => setIsLevelSelectorOpen(true)}
        />

        {/* Chiptune Beat Controller & Beat Switcher */}
        <ChiptuneController
          lastNote={lastNote}
          isBeatBroken={isBeatBroken}
        />

        {/* Real-time Oscilloscope & Spectrum Visualizer */}
        <div style={{ marginBottom: '16px' }}>
          <AudioVisualizer combo={stats.combo} hasError={hasGlitch || isBeatBroken} />
        </div>

        {/* Coding Arena with Live Execution Output */}
        <CodeEditorArena
          currentLevel={currentLevel}
          userInput={userInput}
          hasGlitch={hasGlitch}
          isBeatBroken={isBeatBroken}
          isCompleted={userInput === currentLevel.code}
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
            currentLanguage={currentLanguage}
            onSelectLanguage={handleSelectLanguage}
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
