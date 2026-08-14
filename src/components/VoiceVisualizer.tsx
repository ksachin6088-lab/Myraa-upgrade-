import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../types';

interface VoiceVisualizerProps {
  state: AssistantState;
  inputLevel: number;
  outputLevel: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ state, inputLevel, outputLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.38;

      phase += 0.04;
      const activeLevel = state === 'speaking' ? outputLevel : inputLevel;
      const currentAmp = Math.max(0.08, activeLevel * 0.8 + (state === 'listening' ? 0.15 : 0.05));

      // Color scheme based on state
      let mainColor = 'rgba(255, 60, 0, ';
      let secondaryColor = 'rgba(255, 170, 0, ';
      if (state === 'thinking') {
        mainColor = 'rgba(0, 240, 255, ';
        secondaryColor = 'rgba(0, 150, 255, ';
      } else if (state === 'error') {
        mainColor = 'rgba(255, 0, 60, ';
        secondaryColor = 'rgba(255, 50, 50, ';
      }

      // Draw Circular Audio Waveform
      const points = 64;
      ctx.beginPath();

      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wave = Math.sin(angle * 6 + phase) * Math.cos(angle * 4 + phase) * 18 * currentAmp;
        const r = baseRadius + wave;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.strokeStyle = mainColor + '0.85)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = mainColor + '1)';
      ctx.stroke();

      // Draw Outer Radial Frequency Bars
      const bars = 32;
      ctx.lineWidth = 2;
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const noise = Math.sin(i * 3 + phase * 2) * 0.5 + 0.5;
        const barHeight = (10 + noise * 25) * currentAmp;

        const innerR = baseRadius + 12;
        const outerR = innerR + barHeight;

        const x1 = centerX + Math.cos(angle) * innerR;
        const y1 = centerY + Math.sin(angle) * innerR;
        const x2 = centerX + Math.cos(angle) * outerR;
        const y2 = centerY + Math.sin(angle) * outerR;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = secondaryColor + (0.3 + currentAmp * 0.7) + ')';
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [state, inputLevel, outputLevel]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={360}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
