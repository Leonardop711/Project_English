import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, RotateCcw, Flame } from 'lucide-react';
import { Level, GameStats } from '../types';

interface VictoryModalProps {
  level: Level;
  stats: GameStats;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  stats,
  hasNextLevel,
  onNextLevel,
  onReplay,
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
      colors: isPerfect ? ['#00ff66', '#00f0ff', '#ffd700', '#ff0055'] : ['#00f0ff', '#8b5cf6', '#00ff66'],
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
          maxWidth: '540px',
          width: '100%',
          padding: '28px',
          background: 'rgba(10, 14, 25, 0.98)',
          textAlign: 'center',
          border: isPerfect ? '2px solid var(--neon-green)' : '1px solid var(--neon-cyan)',
          boxShadow: isPerfect ? '0 0 30px rgba(0, 255, 163, 0.4)' : '0 0 25px rgba(0, 240, 255, 0.3)',
        }}
      >
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
            letterSpacing: '2px',
            marginBottom: '4px',
          }}
        >
          {isPerfect ? '¡RITMO PERFECTO! // NO ERRORS' : '¡NIVEL COMPLETADO!'}
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}
        >
          DON'T BREAK THE BEAT // {level.name}
        </div>

        {/* Code Output Result Box */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(0, 255, 163, 0.3)',
            borderRadius: '4px',
            padding: '10px 14px',
            marginBottom: '18px',
            textAlign: 'left',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--neon-green)',
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '2px' }}>
            Salida de ejecución en vivo:
          </div>
          <div>{level.expectedOutput}</div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '22px',
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>WPM</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: 'var(--neon-cyan)' }}>{wpm}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>PRECISIÓN</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: accuracy >= 95 ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>{accuracy}%</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>MAX COMBO</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: 'var(--neon-yellow)' }}>{stats.maxCombo}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>TIEMPO</div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', color: '#fff' }}>{timeTaken}s</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onReplay}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-secondary)',
              padding: '12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={16} /> REPETIR
          </button>

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
