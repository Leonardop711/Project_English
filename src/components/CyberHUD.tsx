import React from 'react';
import { Volume2, VolumeX, Zap, ShieldAlert, Activity, Award } from 'lucide-react';
import { Level, GameStats, Language } from '../types';

interface CyberHUDProps {
  currentLevel: Level;
  stats: GameStats;
  isMuted: boolean;
  isBeatBroken: boolean;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onToggleMute: () => void;
  onOpenLevelSelector: () => void;
}

export const CyberHUD: React.FC<CyberHUDProps> = ({
  currentLevel,
  stats,
  isMuted,
  isBeatBroken,
  currentLanguage,
  onSelectLanguage,
  onToggleMute,
  onOpenLevelSelector,
}) => {
  const accuracy =
    stats.keystrokes > 0
      ? Math.max(0, Math.round(((stats.keystrokes - stats.errors) / stats.keystrokes) * 100))
      : 100;

  const multiplier =
    stats.combo >= 20 ? 4 : stats.combo >= 10 ? 2 : stats.combo >= 5 ? 1.5 : 1;

  const languages: { id: Language; label: string; icon: string }[] = [
    { id: 'python', label: 'PYTHON', icon: '🐍' },
    { id: 'javascript', label: 'JAVASCRIPT', icon: '⚡' },
    { id: 'c', label: 'C LANG', icon: '⚙️' },
  ];

  return (
    <header className="neo-box" style={{ padding: '14px 20px', marginBottom: '16px' }}>
      {/* Top Branding Bar with Logo, Slogan & Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
          marginBottom: '12px',
        }}
      >
        {/* Logo & Slogan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/coderhythm-logo.jpg"
            alt="CodeRhythm Logo"
            style={{
              height: '48px',
              borderRadius: '6px',
              border: isBeatBroken ? '1px solid #ff3366' : '1px solid var(--neon-green)',
              boxShadow: isBeatBroken
                ? '0 0 12px rgba(255, 51, 102, 0.6)'
                : '0 0 12px rgba(0, 255, 163, 0.4)',
              transition: 'all 0.2s ease',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  letterSpacing: '2px',
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(0, 255, 163, 0.6)',
                }}
              >
                Code<span style={{ color: 'var(--neon-green)' }}>Rhythm</span>
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.7rem',
                  letterSpacing: '1px',
                  color: 'var(--neon-cyan)',
                  padding: '1px 6px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  borderRadius: '2px',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                }}
              >
                v2.0
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                letterSpacing: '1.5px',
                marginTop: '2px',
              }}
            >
              DON'T BREAK THE BEAT
            </div>
          </div>
        </div>

        {/* Dynamic Beat Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              letterSpacing: '1px',
              backgroundColor: isBeatBroken ? 'rgba(255, 51, 102, 0.15)' : 'rgba(0, 255, 163, 0.15)',
              border: isBeatBroken ? '1px solid #ff3366' : '1px solid var(--neon-green)',
              color: isBeatBroken ? '#ff3366' : 'var(--neon-green)',
              boxShadow: isBeatBroken
                ? '0 0 10px rgba(255, 51, 102, 0.4)'
                : '0 0 10px rgba(0, 255, 163, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isBeatBroken ? '#ff3366' : 'var(--neon-green)',
                boxShadow: isBeatBroken ? '0 0 8px #ff3366' : '0 0 8px var(--neon-green)',
              }}
            />
            {isBeatBroken ? '⚠ BEAT BROKEN (CORRIGE LA TECLA)' : '● BEAT EN RITMO (IN SYNC)'}
          </div>

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar Sonido' : 'Silenciar'}
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            style={{
              background: 'rgba(5, 7, 13, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '4px',
              padding: '6px 10px',
              color: isMuted ? '#ff3366' : 'var(--neon-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.7rem',
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isMuted ? 'MUTED' : 'AUDIO ON'}
          </button>
        </div>
      </div>

      {/* Language Switcher Bar & Level Information */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Language Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              marginRight: '4px',
            }}
          >
            PISTA:
          </span>
          {languages.map((lang) => {
            const isActive = currentLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang.id)}
                style={{
                  background: isActive ? 'rgba(0, 240, 255, 0.18)' : 'rgba(0, 0, 0, 0.4)',
                  border: isActive ? '1px solid var(--neon-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.75rem',
                  padding: '5px 12px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 8px rgba(0, 240, 255, 0.3)' : 'none',
                }}
              >
                <span>{lang.icon}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Level Title & Selector Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.95rem',
              color: 'var(--neon-yellow)',
              letterSpacing: '1px',
            }}
          >
            {currentLevel.name}
          </span>
          <button
            onClick={onOpenLevelSelector}
            style={{
              background: 'transparent',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              color: 'var(--neon-cyan)',
              fontSize: '0.65rem',
              padding: '3px 8px',
              cursor: 'pointer',
              borderRadius: '2px',
              fontFamily: 'var(--font-hud)',
            }}
          >
            CAMBIAR NIVEL
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
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
                fontSize: '1.25rem',
                fontWeight: 900,
                color: stats.combo >= 20 ? 'var(--neon-yellow)' : stats.combo >= 5 ? 'var(--neon-cyan)' : '#fff',
                textShadow: stats.combo >= 10 ? '0 0 10px rgba(0,240,255,0.8)' : 'none',
              }}
            >
              {stats.combo}
              <span style={{ fontSize: '0.75rem', marginLeft: '4px', color: 'var(--neon-magenta)' }}>
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
                fontSize: '1.25rem',
                fontWeight: 900,
                color: accuracy >= 95 ? 'var(--neon-green)' : accuracy >= 80 ? 'var(--neon-yellow)' : '#ff3366',
              }}
            >
              {accuracy}%
            </div>
          </div>

          {/* Stability */}
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
              <ShieldAlert size={12} color={stats.stability < 30 ? '#ff3366' : 'var(--neon-cyan)'} />
              ESTABILIDAD
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: stats.stability > 60 ? 'var(--neon-cyan)' : stats.stability > 25 ? 'var(--neon-yellow)' : '#ff3366',
              }}
            >
              {stats.stability}%
            </div>
          </div>

          {/* Total Score */}
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
              <Award size={12} color="var(--neon-magenta)" />
              PUNTOS
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--neon-magenta)',
                letterSpacing: '1px',
              }}
            >
              {stats.score.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
