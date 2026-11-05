import React, { useEffect, useRef } from 'react';
import { synthEngine } from '../audio/SynthEngine';

interface GeometryDashBackgroundProps {
  bpm: number;
  combo: number;
  isBeatBroken: boolean;
  hasGlitch: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

interface DeathParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  color: string;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  type: 'diamond' | 'triangle' | 'cube' | 'portal';
  rotation: number;
  vRot: number;
  color: string;
}

export const GeometryDashBackground: React.FC<GeometryDashBackgroundProps> = ({
  bpm,
  combo,
  isBeatBroken,
  hasGlitch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevBrokenRef = useRef<boolean>(isBeatBroken);
  const deathParticlesRef = useRef<DeathParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let floorScroll = 0;
    let bgScroll = 0;
    let cubeRotation = 0;
    let screenShake = 0;

    // Responsive Canvas Resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial floating starfield particles
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.8,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#00f0ff' : '#00ff9d',
    }));

    // Initial background geometric obstacles
    const shapes: GeometricShape[] = [
      { x: window.innerWidth * 0.3, y: window.innerHeight * 0.4, size: 24, type: 'diamond', rotation: 0, vRot: 0.015, color: '#00f0ff' },
      { x: window.innerWidth * 0.7, y: window.innerHeight * 0.25, size: 28, type: 'triangle', rotation: 0, vRot: -0.02, color: '#ffd700' },
      { x: window.innerWidth * 0.85, y: window.innerHeight * 0.65, size: 22, type: 'cube', rotation: 0, vRot: 0.025, color: '#ff0055' },
      { x: window.innerWidth * 1.15, y: window.innerHeight * 0.35, size: 32, type: 'portal', rotation: 0, vRot: 0.03, color: '#8b5cf6' },
    ];

    const analyser = synthEngine.getAnalyser();

    // Spawn Geometry Dash death explosion on crash!
    const triggerDeathExplosion = (x: number, y: number) => {
      screenShake = 14;
      deathParticlesRef.current = [];
      const colors = ['#ff3366', '#ffbd2e', '#ffffff', '#00f0ff'];
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4;
        deathParticlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: Math.random() * 7 + 4,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.3,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      const floorY = height * 0.86;
      const cubeSize = 34;
      const cubeX = width * 0.14;

      // Detect trigger of crash
      if (isBeatBroken && !prevBrokenRef.current) {
        triggerDeathExplosion(cubeX + cubeSize / 2, floorY - cubeSize / 2);
      }
      prevBrokenRef.current = isBeatBroken;

      // Screen shake decay
      if (screenShake > 0.1) {
        screenShake *= 0.88;
      } else {
        screenShake = 0;
      }
      const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake * 2 : 0;
      const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake * 2 : 0;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // --- 1. Dynamic Background Color Triggers (Geometry Dash Theme Shifts) ---
      let bgTop = '#0a0d18';
      let bgBottom = '#04060c';

      if (isBeatBroken || hasGlitch) {
        bgTop = '#220811';
        bgBottom = '#0c0205';
      } else if (combo >= 20) {
        // Fever Gold Overdrive
        bgTop = '#1a1304';
        bgBottom = '#080501';
      } else if (combo >= 10) {
        // Neon Matrix Emerald
        bgTop = '#041612';
        bgBottom = '#010806';
      } else if (combo >= 5) {
        // Cyberpunk Purple
        bgTop = '#140822';
        bgBottom = '#07020d';
      }

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, bgTop);
      bgGrad.addColorStop(0.7, bgBottom);
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-20, -20, width + 40, height + 40);

      // Audio analysis: pulse strength from kick/bass
      let bassIntensity = 0;
      if (analyser && !isBeatBroken) {
        const freqData = new Uint8Array(32);
        analyser.getByteFrequencyData(freqData);
        bassIntensity = (freqData[1] + freqData[2] + freqData[3]) / (3 * 255);
      }

      // Parallax movement speed synced to BPM & combo
      const comboMultiplier = 1 + Math.min(combo / 25, 0.8);
      const moveSpeed = isBeatBroken ? 0 : (bpm / 60) * 3.2 * comboMultiplier;

      floorScroll = (floorScroll + moveSpeed) % 60;
      bgScroll = (bgScroll + moveSpeed * 0.35) % (width + 200);

      // --- 2. Parallax Mountain Silhouettes (Geometry Dash Distant Terrain) ---
      const drawMountains = (offset: number, scale: number, color: string, py: number) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, height);
        const mWidth = 240 * scale;
        const total = Math.ceil(width / mWidth) + 2;
        for (let i = -1; i < total; i++) {
          const startX = i * mWidth - (offset % mWidth);
          ctx.lineTo(startX, py);
          ctx.lineTo(startX + mWidth * 0.5, py - 90 * scale);
          ctx.lineTo(startX + mWidth, py);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      };

      // Background mountain layer (slower, darker)
      drawMountains(bgScroll * 0.4, 1.4, 'rgba(12, 18, 32, 0.65)', floorY - 30);
      // Midground mountain layer
      drawMountains(bgScroll, 0.9, isBeatBroken ? 'rgba(38, 12, 22, 0.7)' : 'rgba(10, 22, 38, 0.8)', floorY);

      // --- 3. Perspective Neon Grid Floor (Classic Geometry Dash Checker/Wireframe) ---
      ctx.fillStyle = isBeatBroken ? '#150508' : '#060a12';
      ctx.fillRect(0, floorY, width, height - floorY);

      // Floor Top Glowing Rail
      ctx.lineWidth = 3;
      ctx.strokeStyle = isBeatBroken
        ? '#ff3366'
        : combo >= 20
        ? '#ffd700'
        : combo >= 10
        ? '#00ff9d'
        : '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(width, floorY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Scrolling Vertical Floor Blocks / Spikes Grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = isBeatBroken ? 'rgba(255, 51, 102, 0.25)' : 'rgba(0, 240, 255, 0.18)';
      for (let x = -floorScroll; x < width + 60; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Little neon corner squares inside floor tiles
        ctx.fillStyle = isBeatBroken ? 'rgba(255, 51, 102, 0.12)' : 'rgba(0, 255, 163, 0.12)';
        ctx.fillRect(x + 10, floorY + 12, 10, 10);
      }

      // Horizontal Floor Depth Lines
      for (let y = floorY + 25; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- 4. Floating Geometry Dash Obstacles (Diamonds, Triangles, Cubes) ---
      shapes.forEach((s) => {
        if (!isBeatBroken) {
          s.x -= moveSpeed * 0.8;
          s.rotation += s.vRot;
          if (s.x < -100) {
            s.x = width + Math.random() * 300;
            s.y = Math.random() * (floorY - 140) + 80;
          }
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        const pulseScale = 1 + bassIntensity * 0.25;
        ctx.scale(pulseScale, pulseScale);

        ctx.strokeStyle = isBeatBroken ? '#ff3366' : s.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.strokeStyle;

        if (s.type === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.7, 0);
          ctx.lineTo(0, s.size);
          ctx.lineTo(-s.size * 0.7, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
          ctx.fill();
        } else if (s.type === 'triangle') {
          // Geometry Dash Spike
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.8, s.size);
          ctx.lineTo(-s.size * 0.8, s.size);
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
          ctx.fill();
        } else if (s.type === 'cube') {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
          ctx.strokeRect(-s.size / 4, -s.size / 4, s.size / 2, s.size / 2);
        } else if (s.type === 'portal') {
          // Gravity/Speed Portal Ring
          ctx.beginPath();
          ctx.ellipse(0, 0, s.size * 0.6, s.size * 1.2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // --- 5. Speed Dust & Glowing Particles ---
      particles.forEach((p) => {
        if (!isBeatBroken) {
          p.x -= moveSpeed * p.speed;
          if (p.x < 0) {
            p.x = width + 20;
            p.y = Math.random() * floorY;
          }
        }

        // Speed streak effect on high combo
        const streakLen = combo >= 10 ? p.speed * 8 * comboMultiplier : 2;
        ctx.fillStyle = isBeatBroken ? 'rgba(255, 51, 102, 0.6)' : p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(p.x, p.y, streakLen, p.size);
      });
      ctx.globalAlpha = 1;

      // --- 6. Geometry Dash Cyber-Cube Avatar ---
      if (!isBeatBroken) {
        // Jump calculation synced to 1/2 beat intervals
        const beatDuration = (60 / bpm) * 1000;
        const now = performance.now();
        const beatPhase = (now % beatDuration) / beatDuration;

        // Parabolic jump curve
        const isJumping = beatPhase < 0.45;
        let jumpY = 0;
        if (isJumping) {
          const t = beatPhase / 0.45;
          jumpY = Math.sin(t * Math.PI) * 55;
          cubeRotation += 0.08; // Flip during jump
        } else {
          // Snap cube rotation to nearest 90 degrees on floor landing
          cubeRotation = Math.round(cubeRotation / (Math.PI / 2)) * (Math.PI / 2);
        }

        const cubePosY = floorY - cubeSize - jumpY;

        ctx.save();
        ctx.translate(cubeX + cubeSize / 2, cubePosY + cubeSize / 2);
        ctx.rotate(cubeRotation);

        // Cube Outer Body
        const cubeColor = combo >= 20 ? '#ffd700' : combo >= 10 ? '#00ff9d' : '#00f0ff';
        ctx.strokeStyle = cubeColor;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = cubeColor;
        ctx.fillStyle = '#060a12';

        ctx.fillRect(-cubeSize / 2, -cubeSize / 2, cubeSize, cubeSize);
        ctx.strokeRect(-cubeSize / 2, -cubeSize / 2, cubeSize, cubeSize);

        // Inner glowing face & eyes (Iconic Geometry Dash Cube Look)
        ctx.fillStyle = cubeColor;
        ctx.fillRect(-cubeSize / 4, -cubeSize / 4, cubeSize / 2, cubeSize / 2);

        // Eyes
        ctx.fillStyle = '#060a12';
        ctx.fillRect(-cubeSize / 6, -cubeSize / 6, 4, 6);
        ctx.fillRect(cubeSize / 6 - 4, -cubeSize / 6, 4, 6);

        // Fever mode fire particles behind cube
        if (combo >= 5) {
          ctx.fillStyle = combo >= 10 ? '#ffd700' : '#00ff9d';
          for (let f = 0; f < 3; f++) {
            const fx = -cubeSize / 2 - Math.random() * 12;
            const fy = (Math.random() - 0.5) * cubeSize;
            ctx.fillRect(fx, fy, 4, 4);
          }
        }

        ctx.restore();
      } else {
        // --- 7. Shattered Death Particles (Cube Death Explosion) ---
        deathParticlesRef.current.forEach((dp) => {
          dp.x += dp.vx;
          dp.y += dp.vy;
          dp.vy += 0.25; // gravity
          dp.rotation += dp.vRot;
          dp.opacity -= 0.015;

          if (dp.opacity > 0) {
            ctx.save();
            ctx.translate(dp.x, dp.y);
            ctx.rotate(dp.rotation);
            ctx.fillStyle = dp.color;
            ctx.globalAlpha = Math.max(0, dp.opacity);
            ctx.fillRect(-dp.size / 2, -dp.size / 2, dp.size, dp.size);
            ctx.restore();
          }
        });
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [bpm, combo, isBeatBroken, hasGlitch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
