import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, CheckCircle2, ArrowRight, RotateCcw, Music } from 'lucide-react';
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

  useEffect(() => {
    // Launch Neo-Tech Cyber Confetti
    confetti({
      particleCount: isPerfect ? 120 : 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: isPerfect ? ['#00f0ff', '#ffd700', '#00ff66', '#ff0055'] : ['#00f0ff', '#8b5cf6'],
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
        backgroundColor: 'rgba(5, 7, 13, 0.85)',
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
          maxWidth: '520px',
          width: '100%',
          padding: '30px',
          background: 'rgba(10, 14, 25, 0.95)',
          textAlign: 'center',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        {/* Header Icon */}
        <div
          style={{
            display: 'inline-flex',
            padding: '16px',
            borderRadius: '50%',
            background: isPerfect ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0, 240, 255, 0.15)',
            border: `2px solid ${isPerfect ? 'var(--neon-yellow)' : 'var(--neon-cyan)'}`,
            marginBottom: '16px',
            boxShadow: isPerfect ? '0 0 25px rgba(255, 215, 0, 0.6)' : '0 0 25px rgba(0, 240, 255, 0.6)',
          }}
        >
          {isPerfect ? <Zap size={36} color="var(--neon-yellow)" /> : <Award size={36} color="var(--neon-cyan)" />}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '1.8rem',
            color: isPerfect ? 'var(--neon-yellow)' : 'var(--neon-cyan)',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}
        >
          {isPerfect ? '¡COMBO PERFECTO!' : '¡NIVEL COMPLETADO!'}
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '0.85rem',
            color: 'var(--neon-cyan)',
            letterSpacing: '1px',
            marginBottom: '8px',
          }}
        >
          {level.name}
        </div>
        <p
          style={{
            color: isPerfect ? 'var(--neon-green)' : 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Music size={16} />
          {isPerfect
            ? 'La melodía sonó con armonía perfecta sin distorsión alguna.'
            : 'Compilación superada. Afina tu código para lograr el combo perfecto.'}
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '26px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
              PRECISIÓN
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-hud)',
                color: isPerfect ? 'var(--neon-green)' : 'var(--neon-cyan)',
                fontWeight: 700,
              }}
            >
              {isPerfect ? '100%' : `${Math.round(((stats.keystrokes - stats.errors) / stats.keystrokes) * 100)}%`}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
              MÁX COMBO
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-hud)',
                color: 'var(--neon-yellow)',
                fontWeight: 700,
              }}
            >
              x{stats.maxCombo}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
              VELOCIDAD
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-hud)',
                color: 'var(--neon-cyan)',
                fontWeight: 700,
              }}
            >
              {cpm} <span style={{ fontSize: '0.7rem' }}>CPM</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onReplay}
            className="neo-button"
            style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
          >
            <RotateCcw size={16} /> REPETIR
          </button>

          {hasNextLevel ? (
            <button onClick={onNextLevel} className="neo-button">
              SIGUIENTE NIVEL <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={onReplay}
              className="neo-button"
              style={{ background: 'var(--neon-green)', color: '#000' }}
            >
              <CheckCircle2 size={16} /> ¡HAS CONQUISTADO EL MAINFRAME!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
