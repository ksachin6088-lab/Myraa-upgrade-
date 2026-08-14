import React from 'react';
import { MessageItem } from '../types';

interface ActivityLogProps {
  messages: MessageItem[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ messages }) => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase text-[11px] border-b border-red-950 pb-1.5">
        ACTIVITY LOG
      </div>

      <div className="space-y-1.5 text-[10px] max-h-[140px] overflow-y-auto pr-1">
        <div className="flex space-x-2 text-gray-400">
          <span className="text-red-500/80">14:41:55</span>
          <span>Myraa session started</span>
        </div>
        <div className="flex space-x-2 text-gray-400">
          <span className="text-red-500/80">14:41:56</span>
          <span>Connecting to Gemini Live</span>
        </div>
        <div className="flex space-x-2 text-gray-400">
          <span className="text-red-500/80">14:41:57</span>
          <span>Connection established</span>
        </div>
        <div className="flex space-x-2 text-gray-400">
          <span className="text-red-500/80">14:41:58</span>
          <span>Listening for voice...</span>
        </div>

        {/* User Messages */}
        {messages.slice(-3).map((m) => (
          <div key={m.id} className="flex space-x-2 text-gray-300">
            <span className="text-red-400">
              {new Date(m.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="truncate">
              {m.sender === 'user' ? `User: ${m.text}` : `Myraa: ${m.text}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
