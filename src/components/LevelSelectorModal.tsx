import React, { useState } from 'react';
import { X, Lock, CheckCircle, Play, Terminal, Zap, Cpu } from 'lucide-react';
import { Level, Language } from '../types';

interface LevelSelectorModalProps {
  levels: Level[];
  currentLevelId: number;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  levels,
  currentLevelId,
  currentLanguage,
  onSelectLanguage,
  onSelectLevel,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<Language>(currentLanguage);

  const filteredLevels = levels.filter((lvl) => lvl.language === selectedTab);

  const tabs: { id: Language; label: string; icon: React.ReactNode }[] = [
    { id: 'python', label: 'PYTHON', icon: <Terminal size={14} /> },
    { id: 'javascript', label: 'JAVASCRIPT', icon: <Zap size={14} /> },
    { id: 'c', label: 'C LANG', icon: <Cpu size={14} /> },
  ];

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
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          background: 'rgba(10, 14, 25, 0.98)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.25rem',
                color: 'var(--neon-cyan)',
                letterSpacing: '1px',
                fontWeight: 700,
              }}
            >
              SELECTOR DE NIVELES
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', marginTop: '2px' }}>
              CODERHYTHM: DON'T BREAK THE BEAT
            </div>
          </div>
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

        {/* Language Tabs (Lucide SVG Icons) */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  onSelectLanguage(tab.id);
                }}
                style={{
                  flex: 1,
                  background: isActive ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                  border: isActive ? '1px solid var(--neon-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 10px rgba(0, 240, 255, 0.25)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Levels List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredLevels.map((lvl) => {
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
                  padding: '14px 18px',
                  background: isCurrent
                    ? 'rgba(0, 240, 255, 0.15)'
                    : isUnlocked
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: isCurrent
                    ? '1px solid var(--neon-cyan)'
                    : isUnlocked
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.45,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {isUnlocked ? (
                    isCurrent ? (
                      <Play size={18} color="var(--neon-cyan)" />
                    ) : (
                      <CheckCircle size={18} color="var(--neon-green)" />
                    )
                  ) : (
                    <Lock size={18} color="var(--text-muted)" />
                  )}

                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-hud)',
                        fontSize: '0.9rem',
                        color: isCurrent ? 'var(--neon-cyan)' : '#fff',
                        letterSpacing: '1px',
                        fontWeight: 700,
                      }}
                    >
                      {lvl.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {lvl.category} • <span style={{ color: 'var(--neon-yellow)' }}>{lvl.baseBpm} BPM</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-hud)',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    background: isCurrent ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.08)',
                    color: isCurrent ? '#000' : 'var(--text-secondary)',
                    fontWeight: 700,
                  }}
                >
                  {isCurrent ? 'ACTIVO' : isUnlocked ? 'JUGAR' : 'BLOQUEADO'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
