import React, { useState, useEffect } from 'react';
import { Play, Pause, Music2, Volume2, Disc, Upload, Radio, Zap, Gamepad2, Activity, Flame } from 'lucide-react';
import { chiptunePlayer, SoundProfile } from '../audio/ChiptunePlayer';
import { CHIPTUNE_TRACKS, ChiptuneTrack } from '../audio/ChiptuneTracks';
import { synthEngine, SOUND_PROFILES } from '../audio/SynthEngine';
import { SYNCED_MELODIES } from '../audio/SyncedMelodies';

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
  const [activeProfile, setActiveProfile] = useState<SoundProfile>(synthEngine.getSoundProfile());
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [activeMelodyId, setActiveMelodyId] = useState<string>(synthEngine.getCurrentMelody().id);
  const [melodyMode, setMelodyMode] = useState<boolean>(synthEngine.isMelodyMode());

  useEffect(() => {
    const checkState = () => {
      setIsPlaying(chiptunePlayer.getIsPlaying());
      setCurrentTrack(chiptunePlayer.getCurrentTrack());
      setIsCustomActive(chiptunePlayer.isCustomActive());
      setCustomAudioName(chiptunePlayer.getCustomAudioName());
    };
    checkState();
    const interval = setInterval(checkState, 300);
    const unsubscribeBeat = chiptunePlayer.subscribeBeat((beatNum) => {
      setCurrentBeat(beatNum);
    });
    return () => {
      clearInterval(interval);
      unsubscribeBeat();
    };
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

  const handleSelectProfile = (profile: SoundProfile) => {
    setActiveProfile(profile);
    synthEngine.setSoundProfile(profile);
  };

  const handleSelectMelody = (melodyId: string) => {
    synthEngine.setMelody(melodyId);
    setActiveMelodyId(melodyId);
    if (melodyId === 'bangarang') {
      handleSelectTrack('bangarang-beat');
    } else if (melodyId === 'blinding-lights') {
      handleSelectTrack('blinding-lights-beat');
    }
  };

  const handleToggleMelodyMode = () => {
    const next = !melodyMode;
    synthEngine.setMelodyMode(next);
    setMelodyMode(next);
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
      case 'chiptune':
        return '👾 8-BIT';
      default:
        return '🎵 BEAT';
    }
  };

  const profileIcon = (profile: SoundProfile) => {
    switch (profile) {
      case 'synthwave':
        return <Zap size={12} />;
      case 'piano':
        return <Music2 size={12} />;
      case 'edm':
        return <Radio size={12} />;
      case 'chiptune':
        return <Gamepad2 size={12} />;
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
      {/* Row 1: Play/Pause, BPM, Track Selector & MP3 Upload */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
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
            {isPlaying ? 'PAUSE BEAT' : 'PLAY BEAT'}
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
                title={`${track.title} — ${track.description}`}
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
            title="Upload any MP3/WAV audio track from your computer (Skrillex, Cumbias, Lo-Fi, etc.)"
          >
            <Upload size={13} color={isCustomActive ? '#c084fc' : 'var(--text-secondary)'} />
            <span>{isCustomActive && customAudioName ? `MP3: ${customAudioName.slice(0, 14)}...` : 'UPLOAD MP3'}</span>
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
                KEY: {lastNote.label ? `${lastNote.label} (${lastNote.note})` : lastNote.note}
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

      {/* Row 2: Sound Profile Tabs & 4-Beat Visual Metronome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '12px',
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
                {profileIcon(p.id)}
                {p.name}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.68rem',
              color: isPlaying ? 'var(--neon-green)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-hud)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Activity size={12} />
            GUÍA DE RITMO:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2, 3].map((b) => {
              const isActive = isPlaying && !isBeatBroken && currentBeat === b;
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

      {/* Row 3: Melody Mode Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)' }}>
            MELODÍA:
          </span>
          {SYNCED_MELODIES.map((mel) => {
            const isSelected = melodyMode && activeMelodyId === mel.id;
            return (
              <button
                key={mel.id}
                onClick={() => {
                  if (!melodyMode) {
                    synthEngine.setMelodyMode(true);
                    setMelodyMode(true);
                  }
                  handleSelectMelody(mel.id);
                }}
                title={mel.description}
                style={{
                  background: isSelected
                    ? 'linear-gradient(90deg, #00f0ff, #00ff66)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#05070d' : 'var(--text-primary)',
                  border: `1px solid ${isSelected ? 'var(--neon-green)' : 'rgba(255, 255, 255, 0.15)'}`,
                  padding: '5px 12px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '0.72rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
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

        <button
          onClick={handleToggleMelodyMode}
          style={{
            background: melodyMode ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 0, 0, 0.35)',
            border: `1px solid ${melodyMode ? 'var(--neon-magenta)' : 'rgba(255, 255, 255, 0.12)'}`,
            color: melodyMode ? 'var(--neon-magenta)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.72rem',
            padding: '5px 12px',
            borderRadius: '3px',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            fontWeight: 700,
            transition: 'all 0.15s ease',
          }}
          title="Cuando está activo, las teclas tocan la canción seleccionada. Desactivado: cada tecla tiene su propia nota."
        >
          {melodyMode ? '🎵 MODO MELODÍA: ON' : '🎹 MODO TECLA LIBRE'}
        </button>
      </div>
    </div>
  );
};
