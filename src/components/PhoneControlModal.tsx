import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Flashlight,
  Volume2,
  VolumeX,
  Bell,
  BatteryCharging,
  Wifi,
  Radio,
  Send,
  X,
  Zap,
  Camera,
  MapPin,
  Music,
  Youtube,
  Settings,
  ShieldCheck,
  HardDrive,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { PhoneState } from '../types';
import { ToolManager } from '../ai/ToolManager';

interface PhoneControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneControlModal: React.FC<PhoneControlModalProps> = ({ isOpen, onClose }) => {
  const [phoneState, setPhoneState] = useState<PhoneState>(ToolManager.getPhoneState());
  const [activePhoneTab, setActivePhoneTab] = useState<'home' | 'call' | 'sms' | 'settings'>('home');

  // Form Inputs
  const [callContact, setCallContact] = useState('');
  const [callNumber, setCallNumber] = useState('');
  const [smsContact, setSmsContact] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  useEffect(() => {
    const unsubscribe = ToolManager.subscribePhoneState((newState) => {
      setPhoneState(newState);
      if (newState.activeCall) {
        setActivePhoneTab('call');
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleMakeCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callContact.trim() && !callNumber.trim()) return;
    ToolManager.execute('makePhoneCall', {
      contactName: callContact.trim() || 'Contact',
      phoneNumber: callNumber.trim() || '+91 98765 43210',
    });
    setCallContact('');
    setCallNumber('');
  };

  const handleEndCall = () => {
    ToolManager.execute('endPhoneCall', {});
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsContact.trim() || !smsMessage.trim()) return;
    ToolManager.execute('sendSMS', {
      contactName: smsContact.trim(),
      message: smsMessage.trim(),
    });
    setSmsMessage('');
  };

  const handleLaunchApp = (appName: string) => {
    ToolManager.execute('launchAppOnPhone', { appName });
  };

  const handleToggleSetting = (setting: string, currentVal: boolean) => {
    ToolManager.execute('togglePhoneSetting', { setting, enable: !currentVal });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0a0c14] border border-red-800/40 rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.15)] flex flex-col max-h-[92vh] overflow-hidden text-gray-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-red-900/40 bg-gradient-to-r from-red-950/40 via-gray-950 to-red-950/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/40 text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-extrabold tracking-wider text-red-400 uppercase">
                  PHONE REMOTE CONTROL HUB
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-950 border border-emerald-700/50 text-emerald-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>5G TELEMETRY CONNECTED</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Direct Wireless Command Bridge for {phoneState.deviceName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-900/80 hover:bg-red-950 border border-gray-800 hover:border-red-700 text-gray-400 hover:text-red-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Content (Split View: Virtual Phone + Remote Controls) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Virtual Phone Display (5 columns) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-[10px] text-red-400 font-extrabold uppercase mb-2 flex items-center space-x-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>LIVE PHONE DISPLAY SIMULATION</span>
            </div>

            {/* Smartphone Outer Shell */}
            <div className="relative w-[280px] h-[520px] bg-gray-950 border-4 border-gray-800 rounded-[36px] shadow-[0_0_30px_rgba(255,0,0,0.15)] flex flex-col overflow-hidden p-3 border-gray-700/60">
              
              {/* Top Speaker / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-700 mr-2" />
                <div className="w-6 h-1 rounded-full bg-gray-800" />
              </div>

              {/* Flashlight Beam Visual Effect Overlay */}
              {phoneState.flashlightOn && (
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-300/30 via-amber-200/10 to-transparent pointer-events-none z-30 animate-pulse" />
              )}

              {/* Find My Phone Ring Radar Wave Visual Effect Overlay */}
              {phoneState.findMyPhoneActive && (
                <div className="absolute inset-0 bg-cyan-900/20 z-30 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-4 border-cyan-400 animate-ping opacity-75" />
                  <div className="absolute text-cyan-300 font-extrabold text-xs bg-black/80 px-3 py-1 rounded border border-cyan-500">
                    🔔 RINGING ALARM...
                  </div>
                </div>
              )}

              {/* Screen Inner Display */}
              <div className="relative flex-1 bg-[#0d0f18] rounded-[28px] overflow-hidden flex flex-col text-xs pt-5 border border-red-950/40">
                
                {/* Phone Status Bar */}
                <div className="flex items-center justify-between px-3 py-1 bg-black/40 text-[9px] text-gray-400 font-mono">
                  <span>03:33 AM</span>
                  <div className="flex items-center space-x-1.5">
                    <span>{phoneState.signalType}</span>
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{phoneState.batteryLevel}%</span>
                  </div>
                </div>

                {/* Active Screen Tabs Content */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  
                  {/* Phone Header Indicator */}
                  <div className="p-2 rounded bg-red-950/40 border border-red-900/40 text-center">
                    <div className="text-[10px] text-red-400 font-bold">MYRAA MOBILE NODE</div>
                    <div className="text-[9px] text-gray-400">{phoneState.deviceName}</div>
                  </div>

                  {/* Active Call Overlay Screen */}
                  {phoneState.activeCall ? (
                    <div className="p-4 rounded-xl bg-gradient-to-b from-red-950 to-gray-950 border border-red-600 text-center space-y-3 animate-in fade-in">
                      <div className="w-12 h-12 rounded-full bg-red-900/60 border border-red-500 flex items-center justify-center mx-auto text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                        <UserCheck className="w-6 h-6 text-red-300" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-gray-100">
                          {phoneState.activeCall.contactName}
                        </div>
                        <div className="text-[10px] text-red-400 font-mono">
                          {phoneState.activeCall.phoneNumber}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold mt-1">
                          ● Call Connected
                        </div>
                      </div>

                      <button
                        onClick={handleEndCall}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>HANG UP</span>
                      </button>
                    </div>
                  ) : activePhoneTab === 'home' ? (
                    /* App Grid */
                    <div className="space-y-3">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">INSTALLED APPS</div>
                      <div className="grid grid-cols-3 gap-2.5">
                        <button
                          onClick={() => handleLaunchApp('WhatsApp')}
                          className="flex flex-col items-center p-2 rounded-xl bg-gray-900/80 hover:bg-emerald-950 border border-gray-800 hover:border-emerald-600 transition-all group"
                        >
                          <MessageSquare className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-gray-300 font-bold mt-1">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleLaunchApp('Camera')}
                          className="flex flex-col items-center p-2 rounded-xl bg-gray-900/80 hover:bg-red-950 border border-gray-800 hover:border-red-600 transition-all group"
                        >
                          <Camera className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-gray-300 font-bold mt-1">Camera</span>
                        </button>

                        <button
                          onClick={() => handleLaunchApp('Maps')}
                          className="flex flex-col items-center p-2 rounded-xl bg-gray-900/80 hover:bg-red-950 border border-gray-800 hover:border-red-600 transition-all group"
                        >
                          <MapPin className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-gray-300 font-bold mt-1">Maps</span>
                        </button>

                        <button
                          onClick={() => handleLaunchApp('Spotify')}
                          className="flex flex-col items-center p-2 rounded-xl bg-gray-900/80 hover:bg-emerald-950 border border-gray-800 hover:border-emerald-600 transition-all group"
                        >
                          <Music className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-gray-300 font-bold mt-1">Spotify</span>
                        </button>

                        <button
                          onClick={() => handleLaunchApp('YouTube')}
                          className="flex flex-col items-center p-2 rounded-xl bg-gray-900/80 hover:bg-red-950 border border-gray-800 hover:border-red-600 transition-all group"
                        >
                          <Youtube className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-gray-300 font-bold mt-1">YouTube</span>
                        </button>

                        <button
                          onClick={() => handleLaunchApp('Settings')}
                          className="flex flex-col items-center p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 transition-all group"
                        >
                          <Settings className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] text-gray-300 font-bold mt-1">Settings</span>
                        </button>
                      </div>

                      {phoneState.lastAppLaunched && (
                        <div className="p-2 rounded bg-gray-900/60 border border-red-950 text-[10px] text-gray-300">
                          <span>Last Launched: </span>
                          <strong className="text-red-400">{phoneState.lastAppLaunched}</strong>
                        </div>
                      )}

                      {phoneState.lastSMS && (
                        <div className="p-2 rounded bg-gray-900/60 border border-red-950 text-[10px] space-y-0.5">
                          <div className="text-red-400 font-bold">SMS From: {phoneState.lastSMS.contactName}</div>
                          <div className="text-gray-300 italic truncate">"{phoneState.lastSMS.message}"</div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Bottom Virtual Dock Bar */}
                <div className="p-2 bg-black/60 border-t border-red-950/40 flex justify-around">
                  <button
                    onClick={() => setActivePhoneTab('home')}
                    className={`text-[9px] font-bold px-2 py-1 rounded ${
                      activePhoneTab === 'home' ? 'bg-red-950 text-red-400 border border-red-700' : 'text-gray-500'
                    }`}
                  >
                    APPS
                  </button>
                  <button
                    onClick={() => setActivePhoneTab('call')}
                    className={`text-[9px] font-bold px-2 py-1 rounded ${
                      activePhoneTab === 'call' ? 'bg-red-950 text-red-400 border border-red-700' : 'text-gray-500'
                    }`}
                  >
                    CALL
                  </button>
                  <button
                    onClick={() => setActivePhoneTab('sms')}
                    className={`text-[9px] font-bold px-2 py-1 rounded ${
                      activePhoneTab === 'sms' ? 'bg-red-950 text-red-400 border border-red-700' : 'text-gray-500'
                    }`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              {/* Bottom Phone Gesture Bar */}
              <div className="w-24 h-1 bg-gray-700 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* Remote Control Operations Panel (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Telemetry Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-gray-950/80 border border-red-950 flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 uppercase font-bold">BATTERY LEVEL</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <BatteryCharging className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-extrabold text-emerald-400">{phoneState.batteryLevel}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-950/80 border border-red-950 flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 uppercase font-bold">STORAGE USED</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-extrabold text-cyan-400">
                    {phoneState.storageUsedGb}/{phoneState.storageTotalGb} GB
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-950/80 border border-red-950 flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 uppercase font-bold">SOUND PROFILE</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  {phoneState.soundProfile === 'silent' ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-sm font-extrabold text-gray-200 uppercase">
                    {phoneState.soundProfile}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Trigger Call Form */}
            <form onSubmit={handleMakeCall} className="p-4 rounded-lg bg-gray-950/80 border border-red-900/30 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase">
                <PhoneCall className="w-4 h-4" />
                <span>DIAL / CALL CONTACT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sachin, Nangong Shishu"
                    value={callContact}
                    onChange={(e) => setCallContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-900 border border-red-950 focus:border-red-500 rounded text-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={callNumber}
                    onChange={(e) => setCallNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-900 border border-red-950 focus:border-red-500 rounded text-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>START PHONE CALL</span>
              </button>
            </form>

            {/* Quick SMS Message Form */}
            <form onSubmit={handleSendSMS} className="p-4 rounded-lg bg-gray-950/80 border border-red-900/30 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase">
                <MessageSquare className="w-4 h-4" />
                <span>SEND REMOTE TEXT / WHATSAPP MESSAGE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                    Recipient
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sachin"
                    value={smsContact}
                    onChange={(e) => setSmsContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-900 border border-red-950 focus:border-red-500 rounded text-gray-200 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                    Message Content
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. I am active on MYRAA session..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-900 border border-red-950 focus:border-red-500 rounded text-gray-200 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>DISPATCH MESSAGE TO PHONE</span>
              </button>
            </form>

            {/* Hardware Toggles Grid */}
            <div className="p-4 rounded-lg bg-gray-950/80 border border-red-900/30 space-y-3">
              <div className="text-xs font-bold text-red-400 uppercase">HARDWARE REMOTE TOGGLES</div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleToggleSetting('flashlight', phoneState.flashlightOn)}
                  className={`p-2.5 rounded border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    phoneState.flashlightOn
                      ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Flashlight className="w-4 h-4" />
                  <span className="text-[10px]">Torch {phoneState.flashlightOn ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => handleToggleSetting('silentMode', phoneState.soundProfile === 'silent')}
                  className={`p-2.5 rounded border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    phoneState.soundProfile === 'silent'
                      ? 'bg-red-950 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {phoneState.soundProfile === 'silent' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[10px]">{phoneState.soundProfile.toUpperCase()}</span>
                </button>

                <button
                  onClick={() => handleToggleSetting('findMyPhone', phoneState.findMyPhoneActive)}
                  className={`p-2.5 rounded border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    phoneState.findMyPhoneActive
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-[10px]">{phoneState.findMyPhoneActive ? 'RINGING' : 'Find Phone'}</span>
                </button>

                <button
                  onClick={() => handleToggleSetting('batterySaver', phoneState.batterySaverOn)}
                  className={`p-2.5 rounded border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                    phoneState.batterySaverOn
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px]">Saver {phoneState.batterySaverOn ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Voice Command Hint Box */}
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-[11px] text-gray-300 flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 font-bold">Voice Command Ready:</strong> You can speak commands like{' '}
                <em className="text-red-200">"Call Sachin"</em>, <em className="text-red-200">"Turn on phone flashlight"</em>,{' '}
                <em className="text-red-200">"Send message to Mom saying I am ready"</em>, or <em className="text-red-200">"Find my phone"</em> directly to MYRAA during voice mode!
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-red-900/30 bg-gray-950 text-[10px] text-gray-400">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encryption Protocol: AES-256 Quantum Bridge</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 font-bold transition-all"
          >
            CLOSE PHONE HUB
          </button>
        </div>

      </div>
    </div>
  );
};
