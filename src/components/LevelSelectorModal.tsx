import React from 'react';
import { X, Lock, CheckCircle, Play } from 'lucide-react';
import { Level } from '../types';

interface LevelSelectorModalProps {
  levels: Level[];
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  levels,
  currentLevelId,
  onSelectLevel,
  onClose,
}) => {
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
          maxWidth: '640px',
          width: '100%',
          padding: '24px',
          background: 'rgba(10, 14, 25, 0.96)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
            paddingBottom: '12px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '1.25rem',
              color: 'var(--neon-cyan)',
              letterSpacing: '1.5px',
            }}
          >
            // MATRIZ DE NIVELES SINTÁCTICOS
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar selector de niveles"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {levels.map((lvl) => {
            const isCurrent = lvl.id === currentLevelId;
            const isUnlocked = lvl.unlocked;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(lvl.id);
                    onClose();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isCurrent
                    ? 'rgba(0, 240, 255, 0.15)'
                    : isUnlocked
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(255, 255, 255, 0.01)',
                  border: `1px solid ${
                    isCurrent
                      ? 'var(--neon-cyan)'
                      : isUnlocked
                      ? 'rgba(0, 240, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)'
                  }`,
                  borderRadius: '2px',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.45,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: isCurrent ? 'var(--neon-cyan)' : 'var(--text-secondary)' }}>
                    {isCurrent ? (
                      <Play size={18} fill="var(--neon-cyan)" />
                    ) : isUnlocked ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-hud)',
                        fontSize: '0.9rem',
                        color: isCurrent ? 'var(--neon-cyan)' : 'var(--text-primary)',
                      }}
                    >
                      {lvl.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {lvl.category} • {lvl.difficulty}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--neon-yellow)',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                  }}
                >
                  {lvl.baseBpm} BPM
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
