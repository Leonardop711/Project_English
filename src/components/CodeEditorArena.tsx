import React, { useEffect, useRef } from 'react';
import { Terminal, Sparkles, RefreshCw, Play, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { Level } from '../types';

interface CodeEditorArenaProps {
  currentLevel: Level;
  userInput: string;
  hasGlitch: boolean;
  isBeatBroken: boolean;
  isCompleted?: boolean;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onResetLevel: () => void;
}

export const CodeEditorArena: React.FC<CodeEditorArenaProps> = ({
  currentLevel,
  userInput,
  hasGlitch,
  isBeatBroken,
  isCompleted = false,
  onKeyPress,
  onBackspace,
  onResetLevel,
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
      onKeyPress('    '); // 4 spaces for indentation (Python standard)
      return;
    }

    // Single character input
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
            color: isError
              ? '#ff3366'
              : isCorrect
              ? 'var(--neon-green)'
              : isCurrent
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.35)',
            textShadow: isCorrect ? '0 0 8px rgba(0, 255, 163, 0.6)' : isError ? '0 0 8px #ff3366' : 'none',
          }}
        >
          {isCurrent && <span className="cyber-cursor" />}
          {isTyped ? (isError ? userChar : charDisplay) : charDisplay}
        </span>
      );
    }

    return chars;
  };

  const isLevelFinished = isCompleted || (userInput.length >= targetCode.length && userInput === targetCode);

  const getLanguageTag = () => {
    switch (currentLevel.language) {
      case 'python':
        return { label: 'PYTHON 3.12', color: 'var(--neon-yellow)' };
      case 'javascript':
        return { label: 'JAVASCRIPT V8', color: 'var(--neon-cyan)' };
      case 'c':
        return { label: 'C GCC 14', color: 'var(--neon-magenta)' };
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
        padding: '20px',
        position: 'relative',
        cursor: 'text',
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Invisible input to capture all key events */}
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
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Terminal size={18} color={tag.color} />
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              color: tag.color,
              letterSpacing: '1px',
            }}
          >
            {tag.label}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '2px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-hud)',
            }}
          >
            {currentLevel.category}
          </span>

          {isBeatBroken && (
            <span
              style={{
                fontSize: '0.7rem',
                background: 'rgba(255, 51, 102, 0.2)',
                border: '1px solid #ff3366',
                color: '#ff3366',
                padding: '2px 8px',
                borderRadius: '2px',
                fontFamily: 'var(--font-hud)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AlertTriangle size={12} /> ¡BEAT CORTADO! BORRA CON BACKSPACE
            </span>
          )}
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

      {/* Educational Concept Box ("Aprende el Concepto") */}
      <div
        style={{
          marginBottom: '14px',
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderLeft: `4px solid ${tag.color}`,
          borderRadius: '3px',
          fontSize: '0.88rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: tag.color, fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-hud)' }}>
          <BookOpen size={14} /> ¿QUÉ HACE ESTE CÓDIGO?
        </div>
        <div style={{ color: '#e0e6ed', lineHeight: '1.4' }}>
          {currentLevel.conceptTip}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <Sparkles size={13} color="var(--neon-yellow)" /> <strong style={{ color: 'var(--neon-yellow)' }}>Sintaxis:</strong> {currentLevel.syntaxGuide}
        </div>
      </div>

      {/* Code Editor Box with Line Numbers */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(5, 7, 13, 0.95)',
          padding: '20px',
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

      {/* Live Compiler Execution Terminal (Interactive Output Box) */}
      <div
        style={{
          marginTop: '14px',
          background: 'rgba(2, 4, 8, 0.95)',
          border: isLevelFinished ? '1px solid var(--neon-green)' : '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '4px',
          padding: '12px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          boxShadow: isLevelFinished ? '0 0 15px rgba(0, 255, 163, 0.3)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.7rem', fontFamily: 'var(--font-hud)' }}>
            <Play size={12} color={isLevelFinished ? 'var(--neon-green)' : 'var(--neon-cyan)'} />
            CONSOLA DE SALIDA EN VIVO // EXECUTION OUTPUT
          </div>
          <div style={{ fontSize: '0.7rem', color: isLevelFinished ? 'var(--neon-green)' : 'var(--text-muted)' }}>
            {isLevelFinished ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-green)' }}>
                <CheckCircle2 size={12} /> CÓDIGO EJECUTADO CON ÉXITO
              </span>
            ) : (
              'EN ESPERA DEL BEAT...'
            )}
          </div>
        </div>

        {isLevelFinished ? (
          <div style={{ color: 'var(--neon-green)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            <span style={{ color: 'var(--text-muted)' }}>$ run {currentLevel.language}_program</span>
            {'\n'}
            {currentLevel.expectedOutput}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Teclea la línea completa sin romper el beat para compilar y ejecutar el resultado aquí.
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
          💡 <strong style={{ color: 'var(--neon-cyan)' }}>Don't Break the Beat:</strong> Si te equivocas, la música se corta hasta corregir.
        </span>
        <span>
          Progreso: {Math.min(userInput.length, targetCode.length)} / {targetCode.length} caracteres
        </span>
      </div>
    </div>
  );
};
