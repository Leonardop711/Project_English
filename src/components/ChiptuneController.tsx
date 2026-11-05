import React, { useState, useEffect } from 'react';
import { Play, Pause, Music2, Volume2, Disc, Upload, Radio } from 'lucide-react';
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
  const [isCustomActive, setIsCustomActive] = useState<boolean>(chiptunePlayer.isCustomActive());
  const [customAudioName, setCustomAudioName] = useState<string | null>(chiptunePlayer.getCustomAudioName());

  useEffect(() => {
    const checkState = () => {
      setIsPlaying(chiptunePlayer.getIsPlaying());
      setCurrentTrack(chiptunePlayer.getCurrentTrack());
      setIsCustomActive(chiptunePlayer.isCustomActive());
      setCustomAudioName(chiptunePlayer.getCustomAudioName());
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
      setIsCustomActive(false);
      if (!isPlaying) {
        chiptunePlayer.start();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const name = await chiptunePlayer.loadCustomAudio(file);
        setCustomAudioName(name);
        setIsCustomActive(true);
        setIsPlaying(true);
      } catch (err) {
        console.error('Error cargando archivo de audio:', err);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    chiptunePlayer.setVolume(val);
  };

  const getGenreEmoji = (genre: ChiptuneTrack['genre']) => {
    switch (genre) {
      case 'cumbia':
        return '🌴 CUMBIA';
      case 'dubstep':
        return '⚡ SKRILLEX';
      case 'phonk':
        return '🏎️ PHONK';
      case 'lofi':
        return '☕ LO-FI';
      case 'synthwave':
        return '🌆 SYNTH';
      default:
        return '🎵 BEAT';
    }
  };

  return (
    <div
      className="neo-box"
      style={{
        padding: '14px 20px',
        marginBottom: '16px',
        background: 'rgba(8, 12, 22, 0.95)',
        border: isBeatBroken
          ? '1px solid rgba(255, 51, 102, 0.5)'
          : '1px solid rgba(0, 240, 255, 0.35)',
        boxShadow: isBeatBroken
          ? '0 0 15px rgba(255, 51, 102, 0.2)'
          : '0 0 15px rgba(0, 240, 255, 0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Play/Pause Button & BPM Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleTogglePlay}
            style={{
              background: isPlaying ? 'rgba(0, 255, 163, 0.2)' : 'rgba(0, 240, 255, 0.15)',
              border: `1px solid ${isPlaying ? 'var(--neon-green)' : 'var(--neon-cyan)'}`,
              color: isPlaying ? 'var(--neon-green)' : 'var(--neon-cyan)',
              padding: '7px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.8rem',
              letterSpacing: '1px',
              fontWeight: 700,
              boxShadow: isPlaying ? '0 0 12px rgba(0, 255, 163, 0.35)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'PAUSAR BEAT' : 'INICIAR BEAT'}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
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
                fontWeight: 700,
              }}
            >
              {isCustomActive ? 'CUSTOM MP3' : `${currentTrack.bpm} BPM`}
            </span>
          </div>
        </div>

        {/* Track Selector & MP3 Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Radio size={13} color="var(--neon-cyan)" /> BEATS:
          </span>

          {CHIPTUNE_TRACKS.map((track) => {
            const isSelected = !isCustomActive && track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                title={track.description}
                style={{
                  background: isSelected ? 'rgba(0, 255, 163, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                  border: isSelected
                    ? '1px solid var(--neon-green)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isSelected ? 'var(--neon-green)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.72rem',
                  padding: '6px 12px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  fontWeight: isSelected ? 700 : 500,
                  boxShadow: isSelected ? '0 0 10px rgba(0, 255, 163, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {getGenreEmoji(track.genre)}
              </button>
            );
          })}

          {/* Custom MP3 File Selector */}
          <label
            style={{
              background: isCustomActive ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0, 0, 0, 0.4)',
              border: isCustomActive
                ? '1px solid #a855f7'
                : '1px dashed rgba(255, 255, 255, 0.25)',
              color: isCustomActive ? '#c084fc' : 'var(--text-secondary)',
              fontFamily: 'var(--font-hud)',
              fontSize: '0.72rem',
              padding: '6px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isCustomActive ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none',
              transition: 'all 0.15s ease',
            }}
            title="Sube cualquier canción MP3/WAV desde tu computadora (Skrillex, Cumbias, etc.)"
          >
            <Upload size={13} color={isCustomActive ? '#c084fc' : 'var(--text-secondary)'} />
            <span>{isCustomActive && customAudioName ? `MP3: ${customAudioName.slice(0, 14)}...` : 'SUBIR MP3'}</span>
            <input
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Live Note & Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {lastNote && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 240, 255, 0.15)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                boxShadow: '0 0 8px rgba(0, 240, 255, 0.2)',
              }}
            >
              <Music2 size={13} color="var(--neon-cyan)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--neon-cyan)',
                  fontWeight: 700,
                }}
              >
                NOTA: {lastNote.note}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Volume2 size={14} color="var(--text-secondary)" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: '75px',
                accentColor: 'var(--neon-cyan)',
                cursor: 'pointer',
              }}
              title="Volumen del Beat de Fondo"
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: '28px' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
