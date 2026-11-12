import React from 'react';
import { Delete, CornerDownLeft, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface VirtualCyberKeyboardProps {
  language: Language;
  onKeyClick: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

export const VirtualCyberKeyboard: React.FC<VirtualCyberKeyboardProps> = ({
  language,
  onKeyClick,
  onBackspace,
  onEnter,
}) => {
  const getMacrosForLanguage = (): string[] => {
    switch (language) {
      case 'python':
        return ['print', 'score', 'lives', 'if', 'for', 'in', 'range', 'def', ':', '(', ')', '"', '=', '-', '>', ' '];
      case 'javascript':
        return ['console.log', 'const', 'let', 'if', '=>', '¡', '!', 'health', 'bpm', ';', '{', '}', '(', ')', '"', '===', ' '];
      case 'c':
        return ['printf', 'int', 'float', 'for', 'if', 'bpm', 'volume', ';', '{', '}', '(', ')', '\\n', '+=', ' '];
      default:
        return ['print', 'if', 'for', '(', ')', '{', '}', ';', '"', '='];
    }
  };

  const macros = getMacrosForLanguage();

  return (
    <div
      className="neo-box"
      style={{
        padding: '14px 18px',
        marginTop: '16px',
        background: 'rgba(7, 10, 18, 0.92)',
        border: '1px solid rgba(0, 240, 255, 0.25)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--neon-cyan)" />
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              color: 'var(--neon-cyan)',
              letterSpacing: '1px',
            }}
          >
            MACRO SYNTHESIZER ({language.toUpperCase()})
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
          EVERY KEY HAS ITS OWN UNIQUE NOTE & TIMBRE
        </span>
      </div>

      {/* Cyber Quick Macro Keys */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '10px',
        }}
      >
        {macros.map((macro) => (
          <button
            key={macro}
            onClick={() => {
              for (const ch of macro) {
                onKeyClick(ch);
              }
            }}
            style={{
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: 'var(--neon-cyan)',
              padding: '6px 12px',
              borderRadius: '3px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
              e.currentTarget.style.background = 'rgba(0, 240, 255, 0.25)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
            }}
          >
            {macro === ' ' ? '␣ SPACE' : macro}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={onBackspace}
          style={{
            background: 'rgba(255, 51, 102, 0.15)',
            border: '1px solid #ff3366',
            color: '#ff3366',
            padding: '6px 16px',
            borderRadius: '3px',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.75rem',
            letterSpacing: '1px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Delete size={14} /> DELETE (BACKSPACE)
        </button>

        <button
          onClick={onEnter}
          style={{
            background: 'rgba(0, 255, 163, 0.15)',
            border: '1px solid var(--neon-green)',
            color: 'var(--neon-green)',
            padding: '6px 16px',
            borderRadius: '3px',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.75rem',
            letterSpacing: '1px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <CornerDownLeft size={14} /> LINE BREAK (ENTER)
        </button>
      </div>
    </div>
  );
};
