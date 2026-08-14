import React from 'react';
import { motion } from 'motion/react';
import { AssistantState } from '../types';
import { MyraaAvatar } from './MyraaAvatar';
import { VoiceVisualizer } from './VoiceVisualizer';

interface MyraaCoreProps {
  state: AssistantState;
  inputLevel: number;
  outputLevel: number;
  isGirlfriendMode?: boolean;
  girlfriendTitle?: string;
}

export const MyraaCore: React.FC<MyraaCoreProps> = ({
  state,
  inputLevel,
  outputLevel,
  isGirlfriendMode,
  girlfriendTitle = 'GF COMPANION MODE',
}) => {
  const activeLevel = state === 'speaking' ? outputLevel : inputLevel;

  return (
    <div className="relative flex items-center justify-center w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] lg:w-[500px] lg:h-[500px] my-auto select-none">
      {/* 1. Deep Red/Pink Radial Background Glow */}
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: state === 'disconnected' ? 0.3 : 0.7 + activeLevel * 0.3,
        }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
        style={{
          background: isGirlfriendMode
            ? 'radial-gradient(circle, rgba(255, 0, 102, 0.5) 0%, rgba(200, 0, 80, 0.3) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 0, 0, 0.4) 0%, rgba(200, 0, 0, 0.2) 45%, transparent 70%)',
        }}
      />

      {/* 2. Floating Ambient Particles / Hearts */}
      {[
        { top: '10%', left: '15%', size: 'w-2 h-2' },
        { top: '25%', left: '85%', size: 'w-2.5 h-2.5' },
        { top: '75%', left: '12%', size: 'w-1.5 h-1.5' },
        { top: '80%', left: '88%', size: 'w-2 h-2' },
        { top: '40%', left: '5%', size: 'w-2.5 h-2.5' },
        { top: '50%', left: '94%', size: 'w-1.5 h-1.5' },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -12, 0],
            opacity: [0.4, 1, 0.4],
            scale: isGirlfriendMode ? [1, 1.2, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 2 + idx * 0.5 }}
          className={`absolute ${p.size} rounded-full ${
            isGirlfriendMode
              ? 'bg-pink-500 shadow-[0_0_10px_rgba(255,0,128,1)]'
              : 'bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.9)]'
          } pointer-events-none`}
          style={{ top: p.top, left: p.left }}
        >
          {isGirlfriendMode && idx % 2 === 0 && (
            <span className="text-[10px] absolute -top-2 -left-1 text-pink-400 font-bold">♥</span>
          )}
        </motion.div>
      ))}

      {/* 3. Outer Radial Tick Ring */}
      <div
        className={`absolute inset-0 rounded-full border ${
          isGirlfriendMode ? 'border-pink-800/60 shadow-[0_0_40px_rgba(255,0,128,0.3)]' : 'border-red-900/40 shadow-[0_0_40px_rgba(255,0,0,0.25)]'
        } flex items-center justify-center`}
      >
        {Array.from({ length: 48 }).map((_, angleIdx) => {
          const angle = angleIdx * 7.5;
          const isMajor = angle % 45 === 0;
          return (
            <div
              key={angleIdx}
              className={`absolute origin-center ${
                isMajor
                  ? isGirlfriendMode
                    ? 'w-2.5 h-0.5 bg-pink-500'
                    : 'w-2.5 h-0.5 bg-red-500'
                  : isGirlfriendMode
                  ? 'w-1 h-0.5 bg-pink-800/60'
                  : 'w-1 h-0.5 bg-red-800/60'
              }`}
              style={{
                transform: `rotate(${angle}deg) translate(242px)`,
              }}
            />
          );
        })}
      </div>

      {/* 4. Rotating Outer Segment Arc 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
        className={`absolute inset-4 rounded-full border-2 border-transparent ${
          isGirlfriendMode
            ? 'border-t-pink-500 border-r-pink-400/80 opacity-90'
            : 'border-t-red-500 border-r-red-600/60 opacity-90'
        }`}
      />

      {/* 5. Counter-Rotating Dashed Ring 2 */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 32, ease: 'linear' }}
        className={`absolute inset-10 rounded-full border border-dashed ${
          isGirlfriendMode
            ? 'border-pink-600/60 border-b-pink-300'
            : 'border-red-700/50 border-b-red-400'
        }`}
      />

      {/* 6. Inner Glowing Crimson/Pink Reticle Ring */}
      <div
        className={`absolute inset-16 rounded-full border ${
          isGirlfriendMode
            ? 'border-pink-500/50 shadow-[inset_0_0_30px_rgba(255,0,128,0.4)]'
            : 'border-red-600/40 shadow-[inset_0_0_30px_rgba(255,0,0,0.3)]'
        } flex items-center justify-center`}
      >
        {/* Core Center Ring */}
        <div
          className={`absolute inset-12 rounded-full border-2 ${
            isGirlfriendMode ? 'border-pink-500/70' : 'border-red-500/60'
          } bg-radial ${
            isGirlfriendMode
              ? 'from-pink-950/50 via-[#0a0106]/90 to-[#040102]'
              : 'from-red-950/40 via-[#0a0204]/90 to-[#040102]'
          } backdrop-blur-md flex flex-col items-center justify-between p-4 shadow-[0_0_60px_rgba(255,0,0,0.4)] overflow-hidden`}
        >
          {/* Top Logo / Title Inside Core */}
          <div className="flex flex-col items-center mt-3.5 z-10">
            <span
              className={`text-xl sm:text-2xl font-mono tracking-[0.25em] font-black text-white ${
                isGirlfriendMode
                  ? 'drop-shadow-[0_0_12px_rgba(255,0,128,0.9)]'
                  : 'drop-shadow-[0_0_12px_rgba(255,0,0,0.9)]'
              } uppercase flex items-center gap-1.5`}
            >
              MYRAA
              {isGirlfriendMode && <span className="text-pink-400 animate-pulse text-lg">💖</span>}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-mono tracking-[0.25em] ${
                isGirlfriendMode
                  ? 'text-pink-300/90 font-black'
                  : 'text-red-400/90 font-bold'
              } uppercase mt-0.5`}
            >
              {isGirlfriendMode ? girlfriendTitle : 'AI ASSISTANT'}
            </span>
          </div>

          {/* Realtime Audio Canvas Spectrum Visualizer */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <VoiceVisualizer state={state} inputLevel={inputLevel} outputLevel={outputLevel} />
          </div>

          {/* Anime Avatar - Placed Exactly at Bottom Center of the Red/Pink Core */}
          <div className="z-20 -mb-4 sm:-mb-6">
            <MyraaAvatar state={state} audioLevel={activeLevel} isGirlfriendMode={isGirlfriendMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

