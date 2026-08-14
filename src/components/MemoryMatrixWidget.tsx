import React from 'react';
import { Brain, Cpu, Sparkles, ChevronRight, Pin } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryMatrixWidgetProps {
  memories: MemoryItem[];
  onOpenMatrix: () => void;
}

export const MemoryMatrixWidget: React.FC<MemoryMatrixWidgetProps> = ({
  memories,
  onOpenMatrix,
}) => {
  const pinnedMemories = memories.filter((m) => m.pinned).slice(0, 3);

  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/40 p-3.5 shadow-[0_0_20px_rgba(255,0,0,0.08)] space-y-2.5 font-mono">
      <div className="flex items-center justify-between border-b border-red-950 pb-1.5">
        <div className="flex items-center space-x-1.5 text-red-500 font-extrabold tracking-wider uppercase text-[11px]">
          <Brain className="w-3.5 h-3.5 animate-pulse text-red-400" />
          <span>NEURAL MEMORY MATRIX</span>
        </div>
        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-red-950 border border-red-800 text-red-400">
          MAX LEVEL
        </span>
      </div>

      {/* Quick Pinned Memory Highlights */}
      <div className="space-y-1.5">
        {pinnedMemories.length === 0 ? (
          <div className="text-[10px] text-gray-500 italic py-1">
            No memories pinned yet. Click matrix to manage.
          </div>
        ) : (
          pinnedMemories.map((m) => (
            <div
              key={m.id}
              className="p-2 rounded bg-gray-950/70 border border-red-950 hover:border-red-800/40 transition-all flex items-start justify-between text-[11px]"
            >
              <div className="space-y-0.5 max-w-[85%]">
                <div className="text-gray-400 font-semibold truncate flex items-center space-x-1">
                  <Pin className="w-2.5 h-2.5 text-red-500" />
                  <span>{m.key}</span>
                </div>
                <div className="text-gray-200 font-bold truncate">{m.value}</div>
              </div>
              <span className="text-[9px] text-red-400/80 font-extrabold uppercase bg-red-950/60 px-1 py-0.5 rounded">
                {m.category}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Button to Launch Full Memory Matrix */}
      <button
        onClick={onOpenMatrix}
        className="w-full flex items-center justify-between p-2 rounded bg-gradient-to-r from-red-950/80 to-gray-950 hover:from-red-900/80 hover:to-red-950 border border-red-800/50 hover:border-red-600 text-red-200 transition-all text-[11px] font-bold group shadow-[0_0_12px_rgba(255,0,0,0.1)]"
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          <span>OPEN MAX MEMORY MATRIX ({memories.length})</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
