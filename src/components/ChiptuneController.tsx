import React, { useState, useEffect } from 'react';
import { Play, Pause, Music2, Volume2, Disc } from 'lucide-react';
import { chiptunePlayer } from '../audio/ChiptunePlayer';
import { CHIPTUNE_TRACKS, ChiptuneTrack } from '../audio/ChiptuneTracks';

interface ChiptuneControllerProps {
  lastNote: { note: string; label?: string } | null;
  isBeatBroken: boolean;
}

export const ChiptuneController: React.FC<ChiptuneControllerProps> = ({
  lastNote,
  isBeatBroken,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(chiptunePlayer.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<ChiptuneTrack>(chiptunePlayer.getCurrentTrack());
  const [volume, setVolume] = useState<number>(chiptunePlayer.getVolume());

  useEffect(() => {
    const checkState = () => {
      setIsPlaying(chiptunePlayer.getIsPlaying());
      setCurrentTrack(chiptunePlayer.getCurrentTrack());
    };
    checkState();
    const interval = setInterval(checkState, 300);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    const active = chiptunePlayer.togglePlay();
    setIsPlaying(active);
  };

  const handleSelectTrack = (trackId: string) => {
    chiptunePlayer.setTrack(trackId);
    const found = CHIPTUNE_TRACKS.find((t) => t.id === trackId);
    if (found) {
      setCurrentTrack(found);
      if (!isPlaying) {
        chiptunePlayer.start();
        setIsPlaying(true);
      }
    }
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
        padding: '12px 18px',
        marginBottom: '16px',
        background: 'rgba(8, 12, 22, 0.92)',
        border: isBeatBroken
          ? '1px solid rgba(255, 51, 102, 0.4)'
          : '1px solid rgba(0, 240, 255, 0.4)',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Top Row: Track selector buttons + BPM & Volume */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Play/Pause Button & Active Track Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleTogglePlay}
            style={{
              background: isPlaying ? 'rgba(0, 255, 163, 0.2)' : 'rgba(0, 240, 255, 0.15)',
              border: `1px solid ${isPlaying ? 'var(--neon-green)' : 'var(--neon-cyan)'}`,
              color: isPlaying ? 'var(--neon-green)' : 'var(--neon-cyan)',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.75rem',
              letterSpacing: '1px',
              boxShadow: isPlaying ? '0 0 10px rgba(0, 255, 163, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'PAUSAR BEAT' : 'INICIAR BEAT'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Disc
              size={16}
              color={isBeatBroken ? '#ff3366' : 'var(--neon-cyan)'}
              style={{
                animation: isPlaying && !isBeatBroken ? 'spin 3s linear infinite' : 'none',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '0.75rem',
                color: isBeatBroken ? '#ff3366' : 'var(--neon-cyan)',
                letterSpacing: '1px',
              }}
            >
              {currentTrack.bpm} BPM
            </span>
          </div>
        </div>

        {/* Track Selector Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {CHIPTUNE_TRACKS.map((track) => {
            const isSelected = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                style={{
                  background: isSelected ? 'rgba(0, 255, 163, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                  border: isSelected
                    ? '1px solid var(--neon-green)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSelected ? 'var(--neon-green)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.65rem',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  transition: 'all 0.15s ease',
                }}
              >
                {track.title.split('(')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Volume Slider & Last Note Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {lastNote && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 240, 255, 0.15)',
                padding: '2px 8px',
                borderRadius: '3px',
                border: '1px solid rgba(0, 240, 255, 0.3)',
              }}
            >
              <Music2 size={12} color="var(--neon-cyan)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--neon-cyan)',
                  fontWeight: 700,
                }}
              >
                {lastNote.note}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Volume2 size={14} color="var(--text-secondary)" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: '70px',
                accentColor: 'var(--neon-cyan)',
                cursor: 'pointer',
              }}
              title="Volumen del Beat de Fondo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
