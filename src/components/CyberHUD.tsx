import React from 'react';
import { Volume2, VolumeX, Zap, ShieldAlert, Activity, Award } from 'lucide-react';
import { Level, GameStats } from '../types';

interface CyberHUDProps {
  currentLevel: Level;
  stats: GameStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLevelSelector: () => void;
}

export const CyberHUD: React.FC<CyberHUDProps> = ({
  currentLevel,
  stats,
  isMuted,
  onToggleMute,
  onOpenLevelSelector,
}) => {
  const accuracy =
    stats.keystrokes > 0
      ? Math.max(0, Math.round(((stats.keystrokes - stats.errors) / stats.keystrokes) * 100))
      : 100;

  const multiplier =
    stats.combo >= 20 ? 4 : stats.combo >= 10 ? 2 : stats.combo >= 5 ? 1.5 : 1;

  return (
    <header className="neo-box" style={{ padding: '12px 20px', marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Title & Level selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--neon-green)',
                  boxShadow: '0 0 8px var(--neon-green)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  color: 'var(--text-secondary)',
                }}
              >
                NEO-TECH SYNTH KERNEL v2.5
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.25rem',
                color: 'var(--neon-cyan)',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {currentLevel.name}
              <button
                onClick={onOpenLevelSelector}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  color: 'var(--neon-cyan)',
                  fontSize: '0.65rem',
                  padding: '2px 8px',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-hud)',
                }}
              >
                CAMBIAR NIVEL
              </button>
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          {/* Combo Multiplier */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-hud)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                justifyContent: 'center',
              }}
            >
              <Zap size={12} color={stats.combo > 10 ? 'var(--neon-yellow)' : 'var(--neon-cyan)'} />
              COMBO
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: stats.combo >= 20 ? 'var(--neon-yellow)' : stats.combo >= 5 ? 'var(--neon-cyan)' : '#fff',
                textShadow: stats.combo >= 10 ? '0 0 10px rgba(0,240,255,0.8)' : 'none',
              }}
            >
              {stats.combo}
              <span style={{ fontSize: '0.8rem', marginLeft: '4px', color: 'var(--neon-magenta)' }}>
                x{multiplier}
              </span>
            </div>
          </div>

          {/* Accuracy */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-hud)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                justifyContent: 'center',
              }}
            >
              <Activity size={12} color="var(--neon-green)" />
              PRECISIÓN
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: accuracy >= 95 ? 'var(--neon-green)' : accuracy >= 80 ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
              }}
            >
              {accuracy}%
            </div>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-hud)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                justifyContent: 'center',
              }}
            >
              <Award size={12} color="var(--neon-cyan)" />
              PUNTOS
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {stats.score.toString().padStart(5, '0')}
            </div>
          </div>

          {/* Stability Bar */}
          <div style={{ minWidth: '100px' }}>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-hud)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '4px',
              }}
            >
              <ShieldAlert size={12} color="var(--neon-cyan)" />
              ESTABILIDAD SÓNICA
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 240, 255, 0.3)',
              }}
            >
              <div
                style={{
                  width: `${stats.stability}%`,
                  height: '100%',
                  background:
                    stats.stability > 60
                      ? 'linear-gradient(90deg, #00f0ff, #00ff66)'
                      : stats.stability > 30
                      ? '#ffd700'
                      : '#ff0055',
                  transition: 'width 0.2s ease',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
                }}
              />
            </div>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={onToggleMute}
            aria-label="Silenciar sonido"
            style={{
              background: isMuted ? 'rgba(255, 0, 85, 0.15)' : 'rgba(0, 240, 255, 0.15)',
              border: `1px solid ${isMuted ? 'var(--neon-magenta)' : 'var(--neon-cyan)'}`,
              color: isMuted ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
