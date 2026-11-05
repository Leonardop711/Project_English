import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface VirtualCyberKeyboardProps {
  onKeyClick: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

export const VirtualCyberKeyboard: React.FC<VirtualCyberKeyboardProps> = ({
  onKeyClick,
  onBackspace,
  onEnter,
}) => {
  const quickMacros = [
    'console.log',
    'const',
    'let',
    'if',
    'else',
    'for',
    'async',
    'await',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '"',
    ';',
    '=',
    '>',
    '<',
    '+',
  ];

  return (
    <div
      className="neo-box"
      style={{
        padding: '12px',
        marginTop: '16px',
        background: 'rgba(7, 10, 18, 0.85)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            letterSpacing: '1px',
          }}
        >
          // TECLADO SINTETIZADOR & ATAJOS CYBER
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)' }}>
          PULSA TECLAS FÍSICAS O CLIC AQUÍ
        </span>
      </div>

      {/* Cyber Quick Macro Keys */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          justifyContent: 'center',
          marginBottom: '8px',
        }}
      >
        {quickMacros.map((macro) => (
          <button
            key={macro}
            onClick={() => {
              // Feed each character sequentially to maintain musical flow
              for (const ch of macro) {
                onKeyClick(ch);
              }
            }}
            style={{
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: 'var(--neon-cyan)',
              padding: '4px 10px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = 'var(--neon-cyan)';
              e.currentTarget.style.color = '#000';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
              e.currentTarget.style.color = 'var(--neon-cyan)';
            }}
          >
            {macro}
          </button>
        ))}

        {/* Space key */}
        <button
          onClick={() => onKeyClick(' ')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'var(--text-primary)',
            padding: '4px 20px',
            borderRadius: '2px',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          ESPACIO
        </button>

        {/* Backspace */}
        <button
          onClick={onBackspace}
          aria-label="Borrar carácter"
          style={{
            background: 'rgba(255, 0, 85, 0.15)',
            border: '1px solid var(--neon-magenta)',
            color: 'var(--neon-magenta)',
            padding: '4px 12px',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-hud)',
          }}
        >
          <Delete size={14} /> BORRAR
        </button>

        {/* Enter */}
        <button
          onClick={onEnter}
          aria-label="Ejecutar salto de línea"
          style={{
            background: 'rgba(0, 255, 102, 0.15)',
            border: '1px solid var(--neon-green)',
            color: 'var(--neon-green)',
            padding: '4px 14px',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-hud)',
          }}
        >
          <CornerDownLeft size={14} /> ENTER
        </button>
      </div>
    </div>
  );
};
