import React from 'react';
import { Activity, Smile } from 'lucide-react';
import { AssistantState, LanguageMode } from '../types';

interface AIStatusProps {
  state: AssistantState;
  languageMode: LanguageMode;
  setLanguageMode: (lang: LanguageMode) => void;
}

export const AIStatus: React.FC<AIStatusProps> = ({
  state,
  languageMode,
  setLanguageMode,
}) => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2.5 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase text-[11px] border-b border-red-950 pb-1.5">
        AI STATUS
      </div>

      <div className="space-y-2 text-[11px]">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">State</span>
          <div className="flex items-center space-x-1.5 text-red-500 font-bold uppercase">
            <span>{state === 'listening' ? 'LISTENING' : state === 'speaking' ? 'SPEAKING' : state}</span>
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Response Time</span>
          <span className="text-gray-200 font-semibold">420ms</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Confidence</span>
          <span className="text-gray-200 font-semibold">98.6%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Emotion</span>
          <div className="flex items-center space-x-1 text-gray-200 font-semibold">
            <span>Calm</span>
            <Smile className="w-3.5 h-3.5 text-orange-400" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Language</span>
          <select
            value={languageMode}
            onChange={(e) => setLanguageMode(e.target.value as LanguageMode)}
            className="bg-gray-950 text-gray-200 border border-red-900/40 rounded px-2 py-0.5 text-[10px] focus:outline-none focus:border-red-500"
          >
            <option value="auto">Hindi (Auto)</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>
      </div>
    </div>
  );
};
