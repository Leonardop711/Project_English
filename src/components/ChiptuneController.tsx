import React, { useState, useEffect } from 'react';
import { Play, Pause, Music2, Sparkles, Volume2, Flame } from 'lucide-react';
import { chiptunePlayer } from '../audio/ChiptunePlayer';
import { synthEngine } from '../audio/SynthEngine';
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

  useEffect(() => {
    setIsDrumPlaying(chiptunePlayer.getIsPlaying());
  }, []);

  const handleToggleDrums = () => {
    // When activating drums for Bangarang, ensure the Bangarang 110 BPM groove is queued
    if (activeMelody.id === 'bangarang') {
      chiptunePlayer.setTrack('bangarang-beat');
    }
    const active = chiptunePlayer.togglePlay();
    setIsDrumPlaying(active);
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
        background: 'rgba(8, 12, 22, 0.92)',
        border: '1px solid rgba(0, 240, 255, 0.4)',
      }}
    >
      {/* Top Row: Melodic Synchronizer Header + Live Note Display */}
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
          <Music2 size={18} color="var(--neon-yellow)" />
          <span
            style={{
              fontFamily: 'var(--font-hud)',
              fontSize: '0.85rem',
              color: 'var(--neon-yellow)',
              letterSpacing: '1px',
            }}
          >
            MELODÍA 8-BIT SINCRONIZADA AL TECLEO
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              background: 'rgba(255, 215, 0, 0.15)',
              color: 'var(--neon-yellow)',
              padding: '2px 8px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            MODO RITMO NOTA-POR-TECLA
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
              '♪ TECLEA PARA TOCAR'
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Song Selector Pills */}
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
            PISTA:
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

        {/* Right Side: Backing Drum Beat Toggle & Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleDrums}
            className={`neo-button ${isDrumPlaying ? 'neo-button-magenta' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
            }}
            title="Activar/pausar batería retro 8-bit de acompañamiento"
          >
            {isDrumPlaying ? (
              <>
                <Pause size={12} /> PAUSAR BATERÍA 8-BIT
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" /> GROOVE BATERÍA (110 BPM)
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
              title={`Volumen Batería 8-Bit: ${Math.round(volume * 100)}%`}
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
          ⚡ <em>{activeMelody.description}</em>
        </span>
        <span style={{ color: 'var(--neon-cyan)' }}>
          Combo actual: x{combo} {combo >= 10 ? '🔥 ¡SUB-BASS OVERDRIVE!' : ''}
        </span>
      </div>
    </div>
  );
};
