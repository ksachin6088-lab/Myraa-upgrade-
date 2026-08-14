import React from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Loader2, Volume2, Activity } from 'lucide-react';
import { AssistantState } from '../types';

interface MicrophoneButtonProps {
  state: AssistantState;
  audioLevel: number;
  onStart: () => void;
  onStop: () => void;
  onInterrupt: () => void;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  state,
  audioLevel,
  onStart,
  onStop,
  onInterrupt,
}) => {
  const isConnected = state !== 'disconnected' && state !== 'error';
  const isConnecting = state === 'connecting';
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';

  const handleClick = () => {
    if (isSpeaking) {
      onInterrupt();
    } else if (isConnected) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-2 z-20">
      {/* Sleek Floating Dock Capsule Bar */}
      <div className="relative flex items-center justify-between px-6 py-2.5 rounded-full bg-[#0a0c13]/90 backdrop-blur-xl border border-red-900/50 shadow-[0_0_30px_rgba(255,0,0,0.25)] select-none">
        {/* Left Side Status: LISTENING / Voice input active */}
        <div className="flex items-center space-x-3 w-1/3">
          <div className="p-1.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-500">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider">
              {isSpeaking ? 'SPEAKING' : isListening ? 'LISTENING' : 'READY'}
            </div>
            <div className="text-[9px] text-gray-500 font-mono hidden sm:block">
              {isSpeaking ? 'Voice output active' : isListening ? 'Voice input active' : 'Tap mic to connect'}
            </div>
          </div>

          {/* Left Audio Waveform Animation */}
          <div className="hidden md:flex items-center space-x-0.5 h-3">
            {[40, 70, 30, 90, 50, 80].map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isConnected ? [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] : '20%',
                }}
                transition={{ repeat: Infinity, duration: 0.6 + i * 0.1 }}
                className="w-0.5 bg-red-500 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Center: Large Circular Glowing Microphone Button */}
        <div className="relative flex items-center justify-center -my-3">
          {isConnected && (
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.6, 0.1, 0.6],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute w-20 h-20 rounded-full bg-red-600/20 border border-red-500/50 pointer-events-none"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            aria-label={
              isSpeaking
                ? 'Interrupt Myraa'
                : isConnected
                ? 'Stop Voice Session'
                : 'Start Voice Session'
            }
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(255,0,0,0.6)] ${
              isSpeaking
                ? 'bg-gradient-to-tr from-red-600 via-orange-600 to-red-500 border-2 border-red-400 text-white'
                : isListening
                ? 'bg-gradient-to-tr from-red-700 via-red-600 to-red-500 border-2 border-red-400 text-white'
                : isConnecting
                ? 'bg-gray-900 border-2 border-cyan-400 text-cyan-400'
                : 'bg-gradient-to-tr from-[#120406] via-[#26080c] to-[#120406] border-2 border-red-600/60 text-red-400 hover:border-red-400'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="w-7 h-7 animate-pulse text-white" />
            ) : isConnected ? (
              <Mic className="w-7 h-7 text-white" />
            ) : (
              <MicOff className="w-7 h-7 opacity-80 text-red-500" />
            )}
          </motion.button>
        </div>

        {/* Right Side Status: SPEAKING LEVEL 72% */}
        <div className="flex items-center justify-end space-x-3 w-1/3 text-right">
          {/* Right Audio Waveform Animation */}
          <div className="hidden md:flex items-center space-x-0.5 h-3">
            {[60, 90, 40, 80, 50, 70].map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isConnected ? [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] : '20%',
                }}
                transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                className="w-0.5 bg-red-500 rounded-full"
              />
            ))}
          </div>

          <div>
            <div className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider">
              SPEAKING LEVEL
            </div>
            <div className="text-[10px] font-bold text-gray-300 font-mono">
              {Math.round(Math.max(0.72, audioLevel) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

