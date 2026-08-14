import React from 'react';
import { Mic } from 'lucide-react';
import { AssistantState, AudioMetrics } from '../types';

interface VoiceInputProps {
  state: AssistantState;
  audioMetrics: AudioMetrics;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ state, audioMetrics }) => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2.5 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase text-[11px] border-b border-red-950 pb-1.5">
        VOICE INPUT
      </div>

      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded bg-red-950/40 border border-red-800/30 text-red-400">
          <Mic className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-gray-200 text-[11px]">Microphone</div>
          <div className="text-[10px] text-gray-500">Realtek(R) Audio</div>
        </div>
      </div>

      {/* Dynamic Animated Waveform Progress Meter */}
      <div className="flex items-center space-x-2 pt-1">
        <div className="flex-1 flex items-center space-x-0.5 h-4 bg-gray-950 rounded overflow-hidden p-0.5 border border-red-950">
          {Array.from({ length: 24 }).map((_, i) => {
            const activeBars = Math.round(audioMetrics.inputLevel * 24);
            const isActive = i < activeBars || (state === 'listening' && i < 18);
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all duration-75 ${
                  isActive
                    ? i > 18
                      ? 'bg-red-400 h-full'
                      : i > 12
                      ? 'bg-red-500 h-[85%]'
                      : 'bg-red-600 h-[70%]'
                    : 'bg-red-950/40 h-[30%]'
                }`}
              />
            );
          })}
        </div>
        <span className="text-[11px] font-bold text-red-400">
          {Math.round(Math.max(0.75, audioMetrics.inputLevel) * 100)}%
        </span>
      </div>
    </div>
  );
};
