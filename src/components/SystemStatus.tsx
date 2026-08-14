import React from 'react';
import { Cpu, Radio, Brain, Wrench } from 'lucide-react';

export const SystemStatus: React.FC = () => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-3 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase flex items-center space-x-1.5 text-[11px] border-b border-red-950 pb-1.5">
        <span>SYSTEM STATUS</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-red-500" />
            <div>
              <div className="font-bold text-gray-200 text-[11px]">AI CORE</div>
              <div className="text-[10px] text-gray-500">Myraa Neural Engine</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-red-400 font-bold">
            <span>ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <div>
              <div className="font-bold text-gray-200 text-[11px]">VOICE SYSTEM</div>
              <div className="text-[10px] text-gray-500">Realtime Audio Pipeline</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-red-400 font-bold">
            <span>ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-3.5 h-3.5 text-red-500" />
            <div>
              <div className="font-bold text-gray-200 text-[11px]">MEMORY</div>
              <div className="text-[10px] text-gray-500">Context & Session</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-red-400 font-bold">
            <span>ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-3.5 h-3.5 text-red-500" />
            <div>
              <div className="font-bold text-gray-200 text-[11px]">TOOLS</div>
              <div className="text-[10px] text-gray-500">Function Calling</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-bold">
            <span>READY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
