import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Zap, Award, Sparkles, Music } from 'lucide-react';

interface ComboEffectsOverlayProps {
  combo: number;
  isBeatBroken: boolean;
}

interface MilestoneData {
  threshold: number;
  title: string;
  subtitle: string;
  color: string;
  glow: string;
  type: 'groove' | 'fire' | 'drop' | 'overdrive' | 'god';
}

const MILESTONES: Record<number, MilestoneData> = {
  5: {
    threshold: 5,
    title: '¡RITMO ACTIVO!',
    subtitle: '5 NOTAS PERFECTAS // LEAD SYNTH ON',
    color: 'var(--neon-cyan)',
    glow: '0 0 25px rgba(0, 240, 255, 0.7)',
    type: 'groove',
  },
  10: {
    threshold: 10,
    title: '¡EN CANDELA!',
    subtitle: '10X COMBO // ARPEGIO DESBLOQUEADO',
    color: 'var(--neon-yellow)',
    glow: '0 0 30px rgba(255, 215, 0, 0.8)',
    type: 'fire',
  },
  20: {
    threshold: 20,
    title: '¡BASS DROP!',
    subtitle: '20X COMBO // FIEBRE TOTAL',
    color: 'var(--neon-magenta)',
    glow: '0 0 35px rgba(255, 0, 85, 0.85)',
    type: 'drop',
  },
  35: {
    threshold: 35,
    title: '¡DESCONTROL!',
    subtitle: '35X SIN ERRORES // SPEED OVERCLOCK',
    color: '#a855f7',
    glow: '0 0 40px rgba(168, 85, 247, 0.9)',
    type: 'overdrive',
  },
  50: {
    threshold: 50,
    title: '¡DIOS DEL CÓDIGO!',
    subtitle: '50X RITMO LEGENDARIO // 100% PRECISIÓN',
    color: 'var(--neon-green)',
    glow: '0 0 45px rgba(0, 255, 102, 0.95)',
    type: 'god',
  },
};

interface FloatingTick {
  id: number;
  text: string;
  xOffset: number;
}

export const ComboEffectsOverlay: React.FC<ComboEffectsOverlayProps> = ({
  combo,
  isBeatBroken,
}) => {
  const [activeMilestone, setActiveMilestone] = useState<MilestoneData | null>(null);
  const [floatingTicks, setFloatingTicks] = useState<FloatingTick[]>([]);
  const prevComboRef = useRef<number>(combo);
  const tickCounterRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevComboRef.current;
    prevComboRef.current = combo;

    // Keystroke combo tick
    if (combo > prev && combo > 0 && !isBeatBroken) {
      const id = ++tickCounterRef.current;
      const xOffset = (Math.random() - 0.5) * 60;
      const multiplier = combo >= 20 ? 'x4' : combo >= 10 ? 'x2' : combo >= 5 ? 'x1.5' : '';
      const text = multiplier ? `+COMBO ${multiplier}` : `+1 COMBO`;

      setFloatingTicks((curr) => [...curr.slice(-4), { id, text, xOffset }]);

      // Remove after 650ms
      setTimeout(() => {
        setFloatingTicks((curr) => curr.filter((t) => t.id !== id));
      }, 650);

      // Milestone trigger
      const milestone = MILESTONES[combo] || (combo > 50 && combo % 25 === 0 ? {
        threshold: combo,
        title: `¡IMPARABLE ${combo}X!`,
        subtitle: 'RACHA MAESTRA // DON\'T BREAK THE BEAT',
        color: 'var(--neon-green)',
        glow: '0 0 40px rgba(0, 255, 102, 0.9)',
        type: 'god' as const,
      } : null);

      if (milestone) {
        setActiveMilestone(milestone);

        // Confetti explosion
        confetti({
          particleCount: combo >= 20 ? 60 : 35,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#00f0ff', '#ffd700', '#ff0055', '#00ff66', '#a855f7'],
        });

        const timer = setTimeout(() => {
          setActiveMilestone(null);
        }, 1600);

        return () => clearTimeout(timer);
      }
    }
  }, [combo, isBeatBroken]);

  const renderIcon = (type: MilestoneData['type'], color: string) => {
    switch (type) {
      case 'fire':
        return <Flame size={28} color={color} />;
      case 'drop':
        return <Music size={28} color={color} />;
      case 'overdrive':
        return <Zap size={28} color={color} />;
      case 'god':
        return <Award size={30} color={color} />;
      default:
        return <Sparkles size={26} color={color} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 500,
        overflow: 'hidden',
      }}
    >
      {/* Floating Keystroke Ticks */}
      <div
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {floatingTicks.map((tick) => (
          <div
            key={tick.id}
            className="combo-tick-float"
            style={{
              position: 'absolute',
              transform: `translateX(${tick.xOffset}px)`,
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: combo >= 20 ? 'var(--neon-magenta)' : combo >= 10 ? 'var(--neon-yellow)' : 'var(--neon-cyan)',
              textShadow: combo >= 20 ? '0 0 10px #ff0055' : '0 0 8px #00f0ff',
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
            }}
          >
            {tick.text}
          </div>
        ))}
      </div>

      {/* Major Combo Milestone Banner */}
      {activeMilestone && (
        <div
          style={{
            position: 'absolute',
            top: '22%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 600,
          }}
        >
          {/* Shockwave expanding circle */}
          <div
            className="combo-shockwave"
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: `3px solid ${activeMilestone.color}`,
              boxShadow: activeMilestone.glow,
            }}
          />

          {/* Core Animated Badge */}
          <div
            className="combo-banner-in"
            style={{
              background: 'rgba(6, 10, 20, 0.94)',
              border: `2px solid ${activeMilestone.color}`,
              boxShadow: activeMilestone.glow,
              borderRadius: '8px',
              padding: '16px 28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {renderIcon(activeMilestone.type, activeMilestone.color)}
              <span
                style={{
                  fontFamily: 'var(--font-hud)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: activeMilestone.color,
                  letterSpacing: '2px',
                  textShadow: activeMilestone.glow,
                }}
              >
                {activeMilestone.title}
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                letterSpacing: '1px',
                fontWeight: 600,
              }}
            >
              {activeMilestone.subtitle}
            </div>

            {/* Dynamic Beat Streak Counter */}
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: activeMilestone.color,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              ⚡ {combo} HITS EN CADENA
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
