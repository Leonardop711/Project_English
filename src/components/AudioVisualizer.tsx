import React, { useEffect, useRef } from 'react';
import { synthEngine } from '../audio/SynthEngine';

interface AudioVisualizerProps {
  combo: number;
  hasError: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ combo, hasError }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const analyser = synthEngine.getAnalyser();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;

      // Dark fade trail for neo-tech phosphor persistence
      ctx.fillStyle = 'rgba(5, 7, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Grid background lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Draw frequency spectrum bars
        const barWidth = (width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * (height * 0.75);

          // Color shifts based on combo & error state
          if (hasError) {
            ctx.fillStyle = `rgba(255, 0, 85, ${0.4 + (dataArray[i] / 255) * 0.6})`;
          } else if (combo > 15) {
            // Overdrive gold/cyan
            ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + (dataArray[i] / 255) * 0.6})`;
          } else {
            ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + (dataArray[i] / 255) * 0.7})`;
          }

          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          x += barWidth + 1;
        }

        // Overlay Oscilloscope Time-Domain Waveform
        const timeData = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(timeData);

        ctx.lineWidth = combo > 10 ? 3 : 2;
        ctx.strokeStyle = hasError
          ? '#ff0055'
          : combo > 10
          ? '#ffd700'
          : '#00f0ff';
        ctx.shadowBlur = combo > 10 ? 15 : 8;
        ctx.shadowColor = hasError ? '#ff0055' : '#00f0ff';

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let posX = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const posY = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(posX, posY);
          } else {
            ctx.lineTo(posX, posY);
          }
          posX += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
      } else {
        // Idle pulsing sweep line before audio initialization
        const time = Date.now() * 0.003;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.03 + time) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [combo, hasError]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '80px', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={80}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '4px',
          background: 'rgba(5, 7, 13, 0.85)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '12px',
          fontSize: '0.65rem',
          fontFamily: 'var(--font-hud)',
          color: hasError ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
          letterSpacing: '1px',
        }}
      >
        {hasError ? 'HARMONIC DISTORTION // GLITCH DETECTED' : combo > 10 ? 'QUANTUM HARMONIC SYNC 100%' : 'AUDIO SPECTRUM // 44.1kHz'}
      </div>
    </div>
  );
};
