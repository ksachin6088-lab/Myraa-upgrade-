import React from 'react';
import { Activity, Radio, Cpu, Volume2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { AssistantState, PersonalityMode, LanguageMode, AudioMetrics, SystemStatus } from '../types';

interface StatusPanelProps {
  state: AssistantState;
  personalityMode: PersonalityMode;
  setPersonalityMode: (m: PersonalityMode) => void;
  languageMode: LanguageMode;
  setLanguageMode: (l: LanguageMode) => void;
  audioMetrics: AudioMetrics;
  systemStatus: SystemStatus;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  state,
  personalityMode,
  setPersonalityMode,
  languageMode,
  setLanguageMode,
  audioMetrics,
  systemStatus,
}) => {
  const modes: PersonalityMode[] = ['casual', 'technical', 'study', 'task', 'excited'];

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-950/70 backdrop-blur-md rounded-xl border border-orange-500/20 text-gray-200 text-sm font-mono shadow-[0_0_20px_rgba(255,50,0,0.1)]">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
        <div className="flex items-center space-x-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
          <Cpu className="w-4 h-4" />
          <span>SYSTEM TELEMETRY</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
          v2.4
        </span>
      </div>

      {/* Connection Health & Model Status */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">STATE:</span>
          <span className={`font-semibold uppercase px-2 py-0.5 rounded text-[11px] ${
            state === 'speaking'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
              : state === 'listening'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : state === 'thinking'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'bg-gray-800 text-gray-400'
          }`}>
            {state}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">MODEL:</span>
          <span className="text-gray-300 font-bold">{systemStatus.activeModel}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">AUDIO ENGINE:</span>
          <span className="text-orange-400">PCM 16k IN / 24k OUT</span>
        </div>
      </div>

      {/* Audio Level Meters */}
      <div className="space-y-2 pt-2 border-t border-gray-800">
        <div className="text-xs text-orange-400 font-bold flex items-center space-x-1">
          <Volume2 className="w-3.5 h-3.5" />
          <span>AUDIO SIGNAL METER</span>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>MIC IN (16kHz):</span>
            <span>{Math.round(audioMetrics.inputLevel * 100)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden border border-gray-800">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-1.5 transition-all duration-75"
              style={{ width: `${Math.min(100, audioMetrics.inputLevel * 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>MYRAA OUT (24kHz):</span>
            <span>{Math.round(audioMetrics.outputLevel * 100)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden border border-gray-800">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-400 h-1.5 transition-all duration-75"
              style={{ width: `${Math.min(100, audioMetrics.outputLevel * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Personality Mode Selector */}
      <div className="pt-2 border-t border-gray-800 space-y-2">
        <div className="text-xs text-orange-400 font-bold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PERSONALITY MODE</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setPersonalityMode(m)}
              className={`px-2 py-1 text-[11px] rounded capitalize transition-all border ${
                personalityMode === m
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 font-bold'
                  : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector */}
      <div className="pt-2 border-t border-gray-800 space-y-2">
        <div className="text-xs text-orange-400 font-bold">LANGUAGE RESPONSE</div>
        <div className="flex space-x-1">
          {(['auto', 'english', 'hindi', 'hinglish'] as LanguageMode[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguageMode(lang)}
              className={`flex-1 py-1 text-[10px] rounded uppercase transition-all border ${
                languageMode === lang
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 font-bold'
                  : 'bg-gray-900/60 text-gray-400 border-gray-800'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Security & System Info Footer */}
      <div className="pt-2 border-t border-gray-800 text-[10px] text-gray-500 flex items-center justify-between">
        <span className="flex items-center space-x-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>ENCRYPTED LINK</span>
        </span>
        <span>LATENCY: {audioMetrics.latencyMs}ms</span>
      </div>
    </div>
  );
};
