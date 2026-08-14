import React from 'react';
import { Globe, Search, CloudSun, Bell, FileText, ChevronRight } from 'lucide-react';

interface QuickToolsProps {
  onQuickToolExecute: (toolName: string, args: any) => void;
}

export const QuickTools: React.FC<QuickToolsProps> = ({ onQuickToolExecute }) => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase text-[11px] border-b border-red-950 pb-1.5">
        QUICK TOOLS
      </div>

      <div className="space-y-1.5">
        <button
          onClick={() => onQuickToolExecute('openWebsite', { url: 'https://youtube.com' })}
          className="w-full flex items-center justify-between p-2 rounded bg-gray-950/60 hover:bg-red-950/30 border border-red-950 hover:border-red-800/50 text-gray-300 hover:text-red-200 transition-all text-[11px]"
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>Open Website</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>

        <button
          onClick={() => onQuickToolExecute('searchWeb', { query: 'Latest AI news' })}
          className="w-full flex items-center justify-between p-2 rounded bg-gray-950/60 hover:bg-red-950/30 border border-red-950 hover:border-red-800/50 text-gray-300 hover:text-red-200 transition-all text-[11px]"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-red-500" />
            <span>Search Web</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>

        <button
          onClick={() => onQuickToolExecute('getWeather', { location: 'New Delhi' })}
          className="w-full flex items-center justify-between p-2 rounded bg-gray-950/60 hover:bg-red-950/30 border border-red-950 hover:border-red-800/50 text-gray-300 hover:text-red-200 transition-all text-[11px]"
        >
          <div className="flex items-center space-x-2">
            <CloudSun className="w-3.5 h-3.5 text-red-500" />
            <span>Get Weather</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>

        <button
          onClick={() => onQuickToolExecute('addReminder', { text: 'Check MYRAA updates' })}
          className="w-full flex items-center justify-between p-2 rounded bg-gray-950/60 hover:bg-red-950/30 border border-red-950 hover:border-red-800/50 text-gray-300 hover:text-red-200 transition-all text-[11px]"
        >
          <div className="flex items-center space-x-2">
            <Bell className="w-3.5 h-3.5 text-red-500" />
            <span>Set Reminder</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>

        <button
          onClick={() => onQuickToolExecute('addNote', { note: 'Voice session active' })}
          className="w-full flex items-center justify-between p-2 rounded bg-gray-950/60 hover:bg-red-950/30 border border-red-950 hover:border-red-800/50 text-gray-300 hover:text-red-200 transition-all text-[11px]"
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-red-500" />
            <span>Take Notes</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
