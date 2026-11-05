import React, { useEffect, useRef } from 'react';
import { Terminal, Sparkles, RefreshCw } from 'lucide-react';
import { Level } from '../types';

interface CodeEditorArenaProps {
  currentLevel: Level;
  userInput: string;
  hasGlitch: boolean;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onResetLevel: () => void;
}

export const CodeEditorArena: React.FC<CodeEditorArenaProps> = ({
  currentLevel,
  userInput,
  hasGlitch,
  onKeyPress,
  onBackspace,
  onResetLevel,
}) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const targetCode = currentLevel.code;

  // Keep input focused so mobile and desktop keyboard works effortlessly
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
      onKeyPress('  '); // Two spaces for tab
      return;
    }

    // Only handle printable characters (length 1)
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      onKeyPress(e.key);
    }
  };

  // Render character tokens
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
            fontSize: '1.25rem',
            lineHeight: '1.8',
            transition: 'color 0.1s ease',
          }}
        >
          {isCurrent && <span className="cyber-cursor" />}
          {isTyped ? (isError ? userChar : charDisplay) : charDisplay}
        </span>
      );
    }

    return chars;
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`neo-box ${hasGlitch ? 'neo-box-danger glitch-active' : ''}`}
      style={{
        padding: '20px',
        position: 'relative',
        cursor: 'text',
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Invisible input to capture all key events on any device */}
      <input
        ref={hiddenInputRef}
        type="text"
        autoFocus
        tabIndex={0}
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

      {/* Editor Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
          paddingBottom: '10px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="var(--neon-cyan)" />
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              color: 'var(--neon-cyan)',
              letterSpacing: '1px',
            }}
          >
            TERMINAL // COMPILADOR VIRTUAL
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              background: 'rgba(0, 240, 255, 0.1)',
              padding: '2px 8px',
              borderRadius: '2px',
              color: 'var(--neon-cyan)',
            }}
          >
            {currentLevel.category}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <RefreshCw size={14} /> REINICIAR
          </button>
        </div>
      </div>

      {/* Description & Mission Objective */}
      <div
        style={{
          marginBottom: '16px',
          padding: '10px 14px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderLeft: '3px solid var(--neon-cyan)',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <strong style={{ color: 'var(--neon-cyan)' }}>MISIÓN: </strong>
          {currentLevel.description}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--neon-yellow)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} /> {currentLevel.syntaxGuide}
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(5, 7, 13, 0.95)',
          padding: '20px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          minHeight: '140px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {/* Line Numbers */}
        <div
          style={{
            userSelect: 'none',
            color: 'var(--text-muted)',
            textAlign: 'right',
            paddingRight: '12px',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '1.25rem',
            lineHeight: '1.8',
          }}
        >
          {targetCode.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <div style={{ flex: 1 }}>{renderCodeTokens()}</div>
      </div>

      {/* Footer Hint */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          💡 Escribe cada carácter con precisión musical. ¡Cada tecla correcta suena armónicamente!
        </span>
        <span>
          Progreso: {Math.min(userInput.length, targetCode.length)} / {targetCode.length}
        </span>
      </div>
    </div>
  );
};
