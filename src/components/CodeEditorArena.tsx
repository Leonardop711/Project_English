import React, { useEffect, useRef } from 'react';
import { Terminal, Sparkles, RefreshCw, Play, CheckCircle2, AlertTriangle, BookOpen, Cpu, ArrowRight, BarChart2, Lightbulb } from 'lucide-react';
import { Level } from '../types';

interface CodeEditorArenaProps {
  currentLevel: Level;
  userInput: string;
  hasGlitch: boolean;
  isBeatBroken: boolean;
  isCompleted?: boolean;
  hasNextLevel?: boolean;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onResetLevel: () => void;
  onNextLevel?: () => void;
  onOpenStats?: () => void;
}

export const CodeEditorArena: React.FC<CodeEditorArenaProps> = ({
  currentLevel,
  userInput,
  hasGlitch,
  isBeatBroken,
  isCompleted = false,
  hasNextLevel = false,
  onKeyPress,
  onBackspace,
  onResetLevel,
  onNextLevel,
  onOpenStats,
}) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const targetCode = currentLevel.code;

  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, [currentLevel]);

  const handleContainerClick = () => {
    hiddenInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      onBackspace();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      onKeyPress('\n');
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      onKeyPress('    '); // 4 spaces
      return;
    }

    const isAltGraph = typeof e.getModifierState === 'function' && e.getModifierState('AltGraph');
    const isCtrlBlocked = e.ctrlKey && !isAltGraph;

    // Single character input - allow Option (altKey) on Mac for symbols like ¡, ¿, ~, etc.
    if (e.key.length === 1 && !isCtrlBlocked && !e.metaKey) {
      e.preventDefault();
      onKeyPress(e.key);
    }
  };

  const isLevelFinished = isCompleted || (userInput.length >= targetCode.length && userInput === targetCode);
  const progressPercent = Math.min(100, Math.round((Math.min(userInput.length, targetCode.length) / targetCode.length) * 100));

  // Render character tokens with syntax-like styling
  const renderCodeTokens = () => {
    const chars: React.ReactNode[] = [];
    const minLength = Math.max(userInput.length, targetCode.length);

    for (let i = 0; i < minLength; i++) {
      const targetChar = targetCode[i] || '';
      const userChar = userInput[i];

      const isCurrent = i === userInput.length;
      const isTyped = i < userInput.length;
      const isCorrect = isTyped && userChar === targetChar;
      const isError = isTyped && userChar !== targetChar;

      let charDisplay = targetChar;
      if (targetChar === '\n') {
        charDisplay = '↵\n';
      } else if (targetChar === ' ' && isCurrent) {
        charDisplay = '·';
      }

      // Syntax-aware token coloring for pending code
      let basePendingColor = 'rgba(255, 255, 255, 0.4)';
      if (/[0-9]/.test(targetChar)) {
        basePendingColor = 'rgba(255, 215, 0, 0.5)';
      } else if (/['"`]/.test(targetChar)) {
        basePendingColor = 'rgba(0, 255, 163, 0.5)';
      } else if (/[(){}[\];:]/.test(targetChar)) {
        basePendingColor = 'rgba(0, 240, 255, 0.5)';
      }

      chars.push(
        <span
          key={i}
          className={`code-token ${
            isError
              ? 'token-incorrect'
              : isCorrect
              ? 'token-correct'
              : isCurrent
              ? 'token-current'
              : 'token-pending'
          }`}
          style={{
            display: targetChar === '\n' ? 'block' : 'inline',
            padding: '1px 0px',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.3rem',
            lineHeight: '1.9',
            transition: 'color 0.1s ease',
            color: isError
              ? '#ff3366'
              : isCorrect
              ? 'var(--neon-green)'
              : isCurrent
              ? '#ffffff'
              : basePendingColor,
            textShadow: isCorrect
              ? '0 0 10px rgba(0, 255, 163, 0.7)'
              : isError
              ? '0 0 12px #ff3366'
              : isCurrent
              ? '0 0 8px #ffffff'
              : 'none',
          }}
        >
          {isCurrent && <span className="cyber-cursor" />}
          {isTyped ? (isError ? userChar : charDisplay) : charDisplay}
        </span>
      );
    }

    return chars;
  };

  const getLanguageTag = () => {
    switch (currentLevel.language) {
      case 'python':
        return { label: 'PYTHON 3.12', color: 'var(--neon-yellow)' };
      case 'javascript':
        return { label: 'JAVASCRIPT V8', color: 'var(--neon-cyan)' };
      case 'c':
        return { label: 'C GCC 14.2', color: 'var(--neon-magenta)' };
      default:
        return { label: 'CODE ENGINE', color: 'var(--neon-cyan)' };
    }
  };

  const tag = getLanguageTag();

  return (
    <div
      onClick={handleContainerClick}
      className={`neo-box ${isBeatBroken || hasGlitch ? 'neo-box-danger glitch-active' : ''}`}
      style={{
        padding: '0px',
        position: 'relative',
        cursor: 'text',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
        overflow: 'hidden',
        border: isBeatBroken
          ? '1px solid #ff3366'
          : '1px solid rgba(0, 240, 255, 0.4)',
        boxShadow: isBeatBroken
          ? '0 0 20px rgba(255, 51, 102, 0.3)'
          : '0 0 20px rgba(0, 240, 255, 0.15)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Invisible input to capture all key events */}
      <input
        ref={hiddenInputRef}
        type="text"
        autoFocus
        tabIndex={0}
        value=""
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            for (const ch of val) {
              onKeyPress(ch);
            }
          }
        }}
        onKeyDown={handleKeyDown}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          top: 0,
          left: 0,
        }}
        aria-label="Editor de código"
      />

      {/* Top IDE Window Header (macOS Terminal Style) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(5, 7, 13, 0.95)',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Terminal Window Dots + Language Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color={tag.color} />
            <span
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.8rem',
                color: tag.color,
                letterSpacing: '1px',
                fontWeight: 700,
              }}
            >
              {tag.label}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '2px 8px',
                borderRadius: '3px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-hud)',
              }}
            >
              {currentLevel.category}
            </span>
          </div>
        </div>

        {/* Status Alerts & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isBeatBroken && (
            <span
              style={{
                fontSize: '0.7rem',
                background: 'rgba(255, 51, 102, 0.2)',
                border: '1px solid #ff3366',
                color: '#ff3366',
                padding: '3px 10px',
                borderRadius: '3px',
                fontFamily: 'var(--font-hud)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                animation: 'pulse 1s infinite',
              }}
            >
              <AlertTriangle size={13} /> ¡BEAT CORTADO! PULSA BACKSPACE
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetLevel();
              hiddenInputRef.current?.focus();
            }}
            title="Reiniciar Nivel"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-hud)',
            }}
          >
            <RefreshCw size={13} /> REINICIAR
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.06)' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: isBeatBroken
              ? '#ff3366'
              : 'linear-gradient(90deg, var(--neon-cyan), var(--neon-green))',
            boxShadow: isBeatBroken ? '0 0 8px #ff3366' : '0 0 8px var(--neon-green)',
            transition: 'width 0.15s ease',
          }}
        />
      </div>

      {/* Main Body with Concept Box and Code Editor */}
      <div style={{ padding: '16px 20px' }}>
        {/* Educational Concept Card */}
        <div
          style={{
            marginBottom: '14px',
            padding: '12px 16px',
            background: 'rgba(0, 0, 0, 0.45)',
            borderLeft: `4px solid ${tag.color}`,
            borderRadius: '4px',
            fontSize: '0.88rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: tag.color, fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-hud)' }}>
            <BookOpen size={14} /> APRENDE EL CONCEPTO
          </div>
          <div style={{ color: '#e2e8f0', lineHeight: '1.45' }}>
            {currentLevel.conceptTip}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <Sparkles size={13} color="var(--neon-yellow)" />
            <strong style={{ color: 'var(--neon-yellow)' }}>Sintaxis Clave:</strong> {currentLevel.syntaxGuide}
          </div>
        </div>

        {/* Code Editor Box with Line Numbers */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(4, 6, 11, 0.96)',
            padding: '18px',
            borderRadius: '4px',
            border: isBeatBroken ? '1px solid #ff3366' : '1px solid rgba(255, 255, 255, 0.08)',
            minHeight: '120px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            boxShadow: isBeatBroken ? 'inset 0 0 15px rgba(255, 51, 102, 0.2)' : 'none',
          }}
        >
          {/* Line Numbers */}
          <div
            style={{
              userSelect: 'none',
              color: 'var(--text-muted)',
              textAlign: 'right',
              paddingRight: '14px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '1.3rem',
              lineHeight: '1.9',
            }}
          >
            {targetCode.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Content */}
          <div style={{ flex: 1 }}>{renderCodeTokens()}</div>
        </div>

        {/* Live Compiler Execution Terminal */}
        <div
          style={{
            marginTop: '14px',
            background: 'rgba(2, 4, 8, 0.95)',
            border: isLevelFinished ? '1px solid var(--neon-green)' : '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '4px',
            padding: '14px 18px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            boxShadow: isLevelFinished ? '0 0 20px rgba(0, 255, 163, 0.25)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-hud)' }}>
              <Play size={13} color={isLevelFinished ? 'var(--neon-green)' : 'var(--neon-cyan)'} />
              TERMINAL // SALIDA DEL COMPILADOR EN VIVO
            </div>
            <div style={{ fontSize: '0.72rem', color: isLevelFinished ? 'var(--neon-green)' : 'var(--text-muted)' }}>
              {isLevelFinished ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--neon-green)', fontWeight: 600 }}>
                  <CheckCircle2 size={13} /> COMPILACIÓN EXITOSA (0 ERRORS)
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Cpu size={13} /> ESPERANDO EJECUCIÓN...
                </span>
              )}
            </div>
          </div>

          {isLevelFinished ? (
            <div>
              {/* Command and Output */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(0, 255, 163, 0.35)',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--neon-cyan)' }}>$</span>
                  <span>
                    {currentLevel.language === 'python'
                      ? 'python3 main.py'
                      : currentLevel.language === 'javascript'
                      ? 'node script.js'
                      : 'gcc program.c -o prog && ./prog'}
                  </span>
                </div>
                <div style={{ color: 'var(--neon-green)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                  {currentLevel.expectedOutput}
                </div>
              </div>

              {/* Educational Explanation Box */}
              <div
                style={{
                  background: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  fontSize: '0.82rem',
                  lineHeight: '1.5',
                  color: '#cbd5e1',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-cyan)', fontWeight: 700, marginBottom: '4px', fontFamily: 'var(--font-hud)', fontSize: '0.75rem' }}>
                  <Lightbulb size={14} color="var(--neon-cyan)" /> ¿QUÉ ACABA DE PASAR EN TU CÓDIGO?
                </div>
                <div>{currentLevel.conceptTip}</div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                {hasNextLevel && onNextLevel && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNextLevel();
                    }}
                    style={{
                      background: 'rgba(0, 255, 163, 0.2)',
                      border: '1px solid var(--neon-green)',
                      color: 'var(--neon-green)',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 0 12px rgba(0, 255, 163, 0.3)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    SIGUIENTE NIVEL <ArrowRight size={14} />
                  </button>
                )}

                {onOpenStats && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStats();
                    }}
                    style={{
                      background: 'rgba(0, 240, 255, 0.12)',
                      border: '1px solid var(--neon-cyan)',
                      color: 'var(--neon-cyan)',
                      padding: '8px 14px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-hud)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <BarChart2 size={14} /> VER ESTADÍSTICAS DEL BEAT
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetLevel();
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--text-secondary)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-hud)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw size={12} /> REPETIR
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
              Escribe el código sin romper el beat para compilarlo en tiempo real aquí.
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: '10px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>
            💡 <strong style={{ color: 'var(--neon-cyan)' }}>Nota por tecla:</strong> Cada letra, símbolo y espacio tiene su propia nota musical afinada.
          </span>
          <span>
            Progreso: {Math.min(userInput.length, targetCode.length)} / {targetCode.length} ({progressPercent}%)
          </span>
        </div>
      </div>
    </div>
  );
};
