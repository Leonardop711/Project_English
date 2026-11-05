import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, RotateCcw, Flame, CheckCircle2, X, Terminal } from 'lucide-react';
import { Level, GameStats } from '../types';

interface VictoryModalProps {
  level: Level;
  stats: GameStats;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onClose?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  stats,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onClose,
}) => {
  const isPerfect = stats.errors === 0;
  const timeTaken = stats.startTime && stats.endTime ? Math.max(1, Math.round((stats.endTime - stats.startTime) / 1000)) : 1;
  const cpm = Math.round((stats.keystrokes / timeTaken) * 60);
  const wpm = Math.round(cpm / 5);
  const accuracy = stats.keystrokes > 0 ? Math.round(((stats.keystrokes - stats.errors) / stats.keystrokes) * 100) : 100;

  useEffect(() => {
    confetti({
      particleCount: isPerfect ? 140 : 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: isPerfect ? ['#00ff9d', '#00f0ff', '#ffd700', '#ff0055'] : ['#00f0ff', '#8b5cf6', '#00ff9d'],
    });
  }, [isPerfect]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(5, 7, 13, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        className="neo-box"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          background: 'rgba(10, 14, 25, 0.98)',
          textAlign: 'center',
          position: 'relative',
          border: isPerfect ? '2px solid var(--neon-green)' : '1px solid var(--neon-cyan)',
          boxShadow: isPerfect ? '0 0 30px rgba(0, 255, 163, 0.4)' : '0 0 25px rgba(0, 240, 255, 0.3)',
        }}
      >
        {/* Top Close Button to return and inspect code & terminal */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar y ver terminal"
            title="Cerrar para ver la terminal y tu código"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
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
            <X size={20} />
          </button>
        )}

        {/* Header Icon */}
        <div
          style={{
            display: 'inline-flex',
            padding: '16px',
            borderRadius: '50%',
            background: isPerfect ? 'rgba(0, 255, 163, 0.15)' : 'rgba(0, 240, 255, 0.15)',
            border: `2px solid ${isPerfect ? 'var(--neon-green)' : 'var(--neon-cyan)'}`,
            marginBottom: '14px',
            boxShadow: isPerfect ? '0 0 25px rgba(0, 255, 163, 0.6)' : '0 0 25px rgba(0, 240, 255, 0.5)',
          }}
        >
          {isPerfect ? <Flame size={36} color="var(--neon-green)" /> : <Award size={36} color="var(--neon-cyan)" />}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '1.75rem',
            color: isPerfect ? 'var(--neon-green)' : 'var(--neon-cyan)',
            letterSpacing: '1.5px',
            marginBottom: '4px',
            fontWeight: 700,
          }}
        >
          {isPerfect ? '¡RITMO PERFECTO! // 0 ERRORES' : '¡NIVEL COMPLETADO!'}
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            letterSpacing: '1px',
            marginBottom: '14px',
          }}
        >
          {level.name}
        </div>

        {/* Code Output Result Box */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(0, 255, 163, 0.35)',
            borderRadius: '4px',
            padding: '14px 18px',
            marginBottom: '18px',
            textAlign: 'left',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--neon-green)',
            boxShadow: 'inset 0 0 15px rgba(0, 255, 163, 0.1)',
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="var(--neon-green)" /> Lo que imprimió tu programa en la terminal:
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', fontWeight: 600 }}>{level.expectedOutput}</div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', fontWeight: 600 }}>WPM</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>{wpm}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', fontWeight: 600 }}>PRECISIÓN</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: accuracy >= 95 ? 'var(--neon-green)' : 'var(--neon-yellow)', fontWeight: 700 }}>{accuracy}%</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', fontWeight: 600 }}>MAX COMBO</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: 'var(--neon-yellow)', fontWeight: 700 }}>{stats.maxCombo}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', fontWeight: 600 }}>TIEMPO</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>{timeTaken}s</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={onReplay}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-secondary)',
              padding: '12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={16} /> REPETIR
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: 'var(--neon-cyan)',
                padding: '12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <Terminal size={16} /> VER TERMINAL
            </button>
          )}

          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              style={{
                flex: 2,
                background: 'rgba(0, 255, 163, 0.2)',
                border: '1px solid var(--neon-green)',
                color: 'var(--neon-green)',
                padding: '12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 15px rgba(0, 255, 163, 0.4)',
                transition: 'all 0.15s ease',
              }}
            >
              SIGUIENTE NIVEL <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
