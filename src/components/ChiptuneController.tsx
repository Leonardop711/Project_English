import React, { useState, useEffect } from 'react';
import { Play, Pause, Music2, Sparkles, Volume2, Flame, Zap, Radio, Gamepad2, Activity } from 'lucide-react';
import { chiptunePlayer, SoundProfile } from '../audio/ChiptunePlayer';
import { synthEngine, SOUND_PROFILES } from '../audio/SynthEngine';
import { SYNCED_MELODIES, SyncedMelody } from '../audio/SyncedMelodies';

interface ChiptuneControllerProps {
  combo: number;
  lastNote: { note: string; label?: string } | null;
  activeMelody: SyncedMelody;
  onSelectMelody: (melodyId: string) => void;
}

export const ChiptuneController: React.FC<ChiptuneControllerProps> = ({
  combo,
  lastNote,
  activeMelody,
  onSelectMelody,
}) => {
  const [isDrumPlaying, setIsDrumPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(chiptunePlayer.getVolume());
  const [activeProfile, setActiveProfile] = useState<SoundProfile>(synthEngine.getSoundProfile());
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  // Sync initial state & subscribe to beat pulse
  useEffect(() => {
    setIsDrumPlaying(chiptunePlayer.getIsPlaying());

    const unsubscribe = chiptunePlayer.subscribeBeat((beatNum) => {
      setCurrentBeat(beatNum);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleDrums = () => {
    if (activeMelody.id === 'bangarang') {
      chiptunePlayer.setTrack('bangarang-beat');
    } else if (activeMelody.id === 'blinding-lights') {
      chiptunePlayer.setTrack('blinding-lights-beat');
    }
    const active = chiptunePlayer.togglePlay();
    setIsDrumPlaying(active);
  };

  const handleSelectProfile = (profile: SoundProfile) => {
    setActiveProfile(profile);
    synthEngine.setSoundProfile(profile);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    chiptunePlayer.setVolume(val);
  };

  return (
    <div
      className="neo-box"
      style={{
        padding: '14px 20px',
        marginBottom: '16px',
        background: 'rgba(8, 12, 22, 0.94)',
        border: '1px solid rgba(0, 240, 255, 0.4)',
      }}
    >
      {/* Row 1: Studio Header, Sound Profile Selector & Note Visualizer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Music2 size={18} color="var(--neon-cyan)" />
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              color: 'var(--neon-cyan)',
              letterSpacing: '1px',
            }}
          >
            ESTUDIO SINTÉTICO REACTIVO
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              background: 'rgba(0, 240, 255, 0.15)',
              color: 'var(--neon-cyan)',
              padding: '2px 8px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            SONIDO HI-FI + GUÍA RÍTMICA
          </span>
        </div>

        {/* Live Note Visualizer Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
            NOTA ACTUAL:
          </span>
          <div
            style={{
              background: lastNote?.label ? 'rgba(255, 0, 85, 0.25)' : 'rgba(0, 240, 255, 0.2)',
              border: `1px solid ${lastNote?.label ? 'var(--neon-magenta)' : 'var(--neon-cyan)'}`,
              padding: '3px 12px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: lastNote?.label ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
              fontWeight: 700,
              boxShadow: lastNote ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none',
              transition: 'all 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {lastNote ? (
              <>
                <Sparkles size={12} />
                {lastNote.label ? `${lastNote.label} (${lastNote.note})` : lastNote.note}
              </>
            ) : (
              '♪ TECLEA CÓDIGO PARA TOCAR'
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Sound Profile Tabs (Hi-Fi, Piano Lo-Fi, EDM, 8-Bit) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '12px',
          background: 'rgba(5, 7, 13, 0.6)',
          padding: '8px 12px',
          borderRadius: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
            TIMBRE / SONIDO:
          </span>
          {SOUND_PROFILES.map((p) => {
            const isSelected = activeProfile === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProfile(p.id)}
                style={{
                  background: isSelected ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#05070d' : 'var(--text-primary)',
                  border: `1px solid ${isSelected ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.7rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 240, 255, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                title={p.description}
              >
                {p.id === 'synthwave' && <Zap size={12} />}
                {p.id === 'piano' && <Music2 size={12} />}
                {p.id === 'edm' && <Radio size={12} />}
                {p.id === 'chiptune' && <Gamepad2 size={12} />}
                {p.name}
              </button>
            );
          })}
        </div>

        {/* 4-Beat Visual Metronome / Rhythm Guide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.68rem',
              color: isDrumPlaying ? 'var(--neon-green)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-hud)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Activity size={12} />
            GUÍA DE RITMO ({activeMelody.bpm} BPM):
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2, 3].map((b) => {
              const isActive = isDrumPlaying && currentBeat === b;
              return (
                <div
                  key={b}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-hud)',
                    fontWeight: 700,
                    background: isActive ? 'var(--neon-green)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#05070d' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 0 10px var(--neon-green)' : 'none',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.08s ease',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {b + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Song Selector Pills & Backing Track Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
            CANCIÓN:
          </span>
          {SYNCED_MELODIES.map((mel) => {
            const isSelected = activeMelody.id === mel.id;
            return (
              <button
                key={mel.id}
                onClick={() => {
                  onSelectMelody(mel.id);
                  synthEngine.setMelody(mel.id);
                  if (mel.id === 'bangarang') {
                    chiptunePlayer.setTrack('bangarang-beat');
                  } else if (mel.id === 'blinding-lights') {
                    chiptunePlayer.setTrack('blinding-lights-beat');
                  }
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(90deg, #00f0ff, #00ff66)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#05070d' : 'var(--text-primary)',
                  border: `1px solid ${isSelected ? 'var(--neon-green)' : 'rgba(255, 255, 255, 0.15)'}`,
                  padding: '5px 12px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 255, 102, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {mel.id === 'bangarang' && <Flame size={12} color={isSelected ? '#000' : 'var(--neon-yellow)'} />}
                {mel.name}
              </button>
            );
          })}
        </div>

        {/* Backing Beat Toggle & Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleDrums}
            className={`neo-button ${isDrumPlaying ? 'neo-button-magenta' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
            }}
            title="Activar/pausar batería y bajo rítmico para sentir el compás"
          >
            {isDrumPlaying ? (
              <>
                <Pause size={12} /> PAUSAR BATERÍA
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" /> ACTIVAR GROOVE ({activeMelody.bpm} BPM)
              </>
            )}
          </button>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Volume2 size={14} color="var(--neon-cyan)" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: '65px',
                accentColor: 'var(--neon-cyan)',
                cursor: 'pointer',
              }}
              title={`Volumen Base: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>
      </div>

      {/* Description hint */}
      <div
        style={{
          marginTop: '10px',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          💡 <em>{activeMelody.description}</em>
        </span>
        <span style={{ color: 'var(--neon-cyan)' }}>
          Combo actual: x{combo} {combo >= 10 ? '🔥 ¡OVERDRIVE ARMÓNICO ACTIVO!' : ''}
        </span>
      </div>
    </div>
  );
};
