import React, { useState, useEffect } from 'react';
import { Smartphone, BatteryCharging, Wifi, Flashlight, Volume2, VolumeX, PhoneCall, Bell, ChevronRight, Zap } from 'lucide-react';
import { PhoneState } from '../types';
import { ToolManager } from '../ai/ToolManager';

interface PhoneControlWidgetProps {
  onOpenPhoneControl: () => void;
}

export const PhoneControlWidget: React.FC<PhoneControlWidgetProps> = ({ onOpenPhoneControl }) => {
  const [phoneState, setPhoneState] = useState<PhoneState>(ToolManager.getPhoneState());

  useEffect(() => {
    const unsubscribe = ToolManager.subscribePhoneState((newState) => {
      setPhoneState(newState);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleFlashlight = () => {
    ToolManager.execute('togglePhoneSetting', { setting: 'flashlight', enable: !phoneState.flashlightOn });
  };

  const handleToggleSilent = () => {
    const isSilent = phoneState.soundProfile === 'silent';
    ToolManager.execute('togglePhoneSetting', { setting: 'silentMode', enable: !isSilent });
  };

  const handleToggleFindPhone = () => {
    ToolManager.execute('togglePhoneSetting', { setting: 'findMyPhone', enable: !phoneState.findMyPhoneActive });
  };

  return (
    <div className="bg-[#0b0d14]/90 backdrop-blur-md rounded-lg border border-red-900/30 p-3.5 shadow-[0_0_15px_rgba(255,0,0,0.05)] space-y-2.5 font-mono">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-red-950 pb-1.5">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="text-red-500 font-extrabold tracking-wider uppercase text-[11px]">
            PHONE CONTROL
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>5G BRIDGE</span>
        </div>
      </div>

      {/* Main Phone Overview Info */}
      <div className="space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center text-gray-300">
          <span className="font-bold text-gray-200 truncate">{phoneState.deviceName}</span>
          <span className="text-gray-400">{phoneState.signalType} (Full Bars)</span>
        </div>

        {/* Battery & Charging */}
        <div className="flex items-center justify-between p-1.5 rounded bg-gray-950/80 border border-red-950">
          <div className="flex items-center space-x-1.5 text-gray-300">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>Battery: <strong className="text-emerald-400">{phoneState.batteryLevel}%</strong></span>
          </div>
          <span className="text-gray-400">{phoneState.isCharging ? 'Charging' : 'Discharging'}</span>
        </div>

        {/* Active Call Alert (If any) */}
        {phoneState.activeCall && (
          <div className="p-2 rounded bg-red-950/80 border border-red-600 animate-pulse flex items-center justify-between text-red-200 font-bold">
            <div className="flex items-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span>IN CALL: {phoneState.activeCall.contactName}</span>
            </div>
            <button
              onClick={() => ToolManager.execute('endPhoneCall', {})}
              className="text-[9px] bg-red-600 px-2 py-0.5 rounded text-white hover:bg-red-500 uppercase"
            >
              Hang Up
            </button>
          </div>
        )}
      </div>

      {/* Quick Action Toggle Icons */}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={handleToggleFlashlight}
          className={`p-2 rounded border flex flex-col items-center justify-center transition-all ${
            phoneState.flashlightOn
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'bg-gray-950/60 border-red-950 text-gray-400 hover:text-gray-200 hover:border-red-800/40'
          }`}
        >
          <Flashlight className="w-3.5 h-3.5 mb-1" />
          <span className="text-[9px] font-bold">Torch {phoneState.flashlightOn ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={handleToggleSilent}
          className={`p-2 rounded border flex flex-col items-center justify-center transition-all ${
            phoneState.soundProfile === 'silent'
              ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
              : 'bg-gray-950/60 border-red-950 text-gray-400 hover:text-gray-200 hover:border-red-800/40'
          }`}
        >
          {phoneState.soundProfile === 'silent' ? (
            <VolumeX className="w-3.5 h-3.5 mb-1 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 mb-1 text-emerald-400" />
          )}
          <span className="text-[9px] font-bold">{phoneState.soundProfile.toUpperCase()}</span>
        </button>

        <button
          onClick={handleToggleFindPhone}
          className={`p-2 rounded border flex flex-col items-center justify-center transition-all ${
            phoneState.findMyPhoneActive
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-gray-950/60 border-red-950 text-gray-400 hover:text-gray-200 hover:border-red-800/40'
          }`}
        >
          <Bell className="w-3.5 h-3.5 mb-1" />
          <span className="text-[9px] font-bold">{phoneState.findMyPhoneActive ? 'RINGING' : 'Find Phone'}</span>
        </button>
      </div>

      {/* Button to Open Full Phone Control Hub */}
      <button
        onClick={onOpenPhoneControl}
        className="w-full flex items-center justify-between p-2 rounded bg-gradient-to-r from-red-950/80 to-gray-950 hover:from-red-900/80 hover:to-red-950 border border-red-800/50 hover:border-red-600 text-red-200 transition-all text-[11px] font-bold group shadow-[0_0_10px_rgba(255,0,0,0.1)]"
      >
        <div className="flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          <span>LAUNCH PHONE HUB</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
