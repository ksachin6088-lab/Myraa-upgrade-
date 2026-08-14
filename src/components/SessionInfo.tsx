import React from 'react';
import { AssistantState, AudioMetrics, SystemStatus } from '../types';

interface SessionInfoProps {
  state: AssistantState;
  audioMetrics: AudioMetrics;
  systemStatus: SystemStatus;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({ state, audioMetrics, systemStatus }) => {
  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase text-[11px] border-b border-red-950 pb-1.5">
        SESSION INFO
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-400">Session ID</span>
          <span className="text-gray-200 font-semibold">MYR-7X9K-LIVE</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Model</span>
          <span className="text-gray-200 font-semibold">{systemStatus.activeModel || 'Gemini 3.1 Flash Live'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Latency</span>
          <span className="text-gray-200 font-semibold">{audioMetrics.latencyMs || 42}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Rate</span>
          <span className="text-gray-200 font-semibold">24kHz</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status</span>
          <span className="text-red-400 font-bold capitalize">
            {state === 'listening' ? 'Listening...' : state === 'speaking' ? 'Speaking...' : state}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Uptime</span>
          <span className="text-gray-200 font-semibold">{formatUptime(systemStatus.uptimeSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
