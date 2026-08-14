import React from 'react';

export const CurrentTask: React.FC = () => {
  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2 font-mono">
      <div className="text-red-500 font-extrabold tracking-wider uppercase text-[11px] border-b border-red-950 pb-1.5">
        CURRENT TASK
      </div>

      <div className="flex items-center space-x-3 py-1">
        <div className="w-7 h-7 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center animate-[spin_10s_linear_infinite]">
          <div className="w-2 h-2 rounded-full bg-gray-600" />
        </div>
        <div>
          <div className="font-bold text-gray-300 text-[11px]">None</div>
          <div className="text-[10px] text-gray-500">Waiting for your command...</div>
        </div>
      </div>
    </div>
  );
};
