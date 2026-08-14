import React from 'react';
import { AssistantState, AudioMetrics } from '../types';

interface AudioVisualizerProps {
  state: AssistantState;
  audioMetrics: AudioMetrics;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state, audioMetrics }) => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2 font-mono">
      <div className="flex items-center justify-between h-14 bg-gray-950/80 rounded p-2 border border-red-950">
        {Array.from({ length: 32 }).map((_, i) => {
          const h = Math.max(15, Math.floor(Math.sin(i * 0.4 + Date.now() * 0.005) * 40 + 50));
          const activeHeight = state === 'speaking' ? `${Math.min(100, h * audioMetrics.outputLevel * 1.5)}%` : `${Math.min(35, h * 0.3)}%`;
          return (
            <div
              key={i}
              className="w-1 bg-red-950/60 rounded-full overflow-hidden flex items-end h-full"
            >
              <div
                className="w-full bg-gradient-to-t from-red-800 to-red-500 rounded-full transition-all duration-75"
                style={{ height: activeHeight }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px]">
        <span className="text-red-500 font-extrabold">AUDIO OUTPUT</span>
        <span className="text-gray-400">24kHz</span>
      </div>
    </div>
  );
};
