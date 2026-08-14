import React, { useState, useEffect } from 'react';
import { Cloud, Wifi, Minus, Square, X, Terminal, Power, Brain, Smartphone, Heart } from 'lucide-react';
import { AssistantState } from '../types';

interface HUDProps {
  state: AssistantState;
  uptimeSeconds: number;
  memoryCount: number;
  onToggleTextDrawer: () => void;
  onOpenMemoryMatrix: () => void;
  onOpenPhoneControl: () => void;
  onOpenGirlfriendMode: () => void;
  onOpenAndroidExport: () => void;
  onResetSession: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  state,
  uptimeSeconds,
  memoryCount,
  onToggleTextDrawer,
  onOpenMemoryMatrix,
  onOpenPhoneControl,
  onOpenGirlfriendMode,
  onOpenAndroidExport,
  onResetSession,
}) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-4 py-2.5 bg-[#08090d]/90 backdrop-blur-md border-b border-red-900/40 text-xs font-mono select-none z-30">
      {/* Left Title: MYRAA AI ASSISTANT v2.5.0 */}
      <div className="flex items-center space-x-2">
        <span className="font-extrabold text-sm tracking-wider text-red-500 uppercase drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]">
          MYRAA AI ASSISTANT
        </span>
        <span className="text-[11px] text-red-500/80 font-bold">
          v2.5.0
        </span>
      </div>

      {/* Center: • LIVE SESSION Pill */}
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-600/40 text-red-400 font-bold text-[11px] tracking-widest shadow-[0_0_10px_rgba(255,0,0,0.2)]">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span>LIVE SESSION</span>
      </div>

      {/* Right Tools & Window Controls */}
      <div className="flex items-center space-x-3 text-gray-400 text-xs">
        {/* Girlfriend Companion Mode Trigger */}
        <button
          onClick={onOpenGirlfriendMode}
          className="px-2.5 py-1 bg-gradient-to-r from-pink-950/80 via-rose-950/70 to-pink-900/80 hover:from-pink-900 hover:to-rose-900 border border-pink-600/80 hover:border-pink-400 rounded text-[11px] text-pink-200 font-black transition-all flex items-center space-x-1.5 shadow-[0_0_12px_rgba(255,0,128,0.4)] animate-pulse"
          title="Open Girlfriend Companion Hub"
        >
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500/50" />
          <span className="hidden lg:inline">GIRLFRIEND MODE</span>
        </button>

        {/* Android App Export Hub Trigger */}
        <button
          onClick={onOpenAndroidExport}
          className="px-2.5 py-1 bg-gradient-to-r from-red-900 via-rose-950 to-red-950 hover:from-red-800 hover:to-rose-900 border border-red-500 rounded text-[11px] text-white font-black transition-all flex items-center space-x-1.5 shadow-[0_0_12px_rgba(255,0,0,0.5)] animate-pulse"
          title="Open Android Studio Project Hub"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-300" />
          <span className="hidden xl:inline">ANDROID APP STUDIO</span>
        </button>

        {/* Phone Control Trigger */}
        <button
          onClick={onOpenPhoneControl}
          className="px-2.5 py-1 bg-gradient-to-r from-red-950/60 to-gray-900 hover:from-red-900/80 hover:to-red-950 border border-red-700/60 hover:border-red-500 rounded text-[11px] text-red-300 font-bold transition-all flex items-center space-x-1.5 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
          title="Open Phone Control Hub"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="hidden lg:inline">PHONE CONTROL</span>
        </button>

        {/* Memory Matrix Trigger */}
        <button
          onClick={onOpenMemoryMatrix}
          className="px-2.5 py-1 bg-gradient-to-r from-red-950/60 to-gray-900 hover:from-red-900/80 hover:to-red-950 border border-red-700/60 hover:border-red-500 rounded text-[11px] text-red-300 font-bold transition-all flex items-center space-x-1.5 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
          title="Open Max Level Neural Memory Matrix"
        >
          <Brain className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="hidden md:inline">NEURAL MEMORY ({memoryCount})</span>
        </button>


        {/* Text Drawer Trigger */}
        <button
          onClick={onToggleTextDrawer}
          className="px-2.5 py-1 bg-red-950/30 hover:bg-red-900/50 border border-red-800/40 hover:border-red-500 rounded text-[11px] text-red-300 transition-all flex items-center space-x-1"
          title="Open Text HUD Drawer"
        >
          <Terminal className="w-3 h-3 text-red-400" />
          <span className="hidden sm:inline">TEXT HUD</span>
        </button>

        {/* Reset Session */}
        <button
          onClick={onResetSession}
          className="p-1 hover:text-red-400 transition-colors"
          title="Reset Session"
        >
          <Power className="w-3.5 h-3.5" />
        </button>

        <span className="text-gray-700">|</span>

        {/* Cloud & Wifi Status Icons */}
        <Cloud className="w-3.5 h-3.5 text-gray-400" />
        <Wifi className="w-3.5 h-3.5 text-gray-400" />

        {/* Live Clock */}
        <span className="text-gray-200 font-semibold">{timeString || '14:42:10'}</span>

        <span className="text-gray-700">|</span>

        {/* Window Controls */}
        <div className="flex items-center space-x-2 text-gray-400">
          <button className="hover:text-gray-200 transition-colors"><Minus className="w-3 h-3" /></button>
          <button className="hover:text-gray-200 transition-colors"><Square className="w-2.5 h-2.5" /></button>
          <button className="hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </header>
  );
};


