import React from 'react';
import { motion } from 'motion/react';
import { AssistantState } from '../types';

interface MyraaAvatarProps {
  state: AssistantState;
  audioLevel: number;
  customAvatarUrl?: string;
  isGirlfriendMode?: boolean;
}

export const MyraaAvatar: React.FC<MyraaAvatarProps> = ({ state, audioLevel, customAvatarUrl, isGirlfriendMode }) => {
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isError = state === 'error';

  // Audio-reactive mouth height when speaking
  const mouthOpenness = isSpeaking ? Math.max(2, Math.min(18, 3 + audioLevel * 25)) : 2;

  // Eye glow tint based on state
  const eyeGlowColor = isError
    ? '#ff1a1a'
    : isGirlfriendMode
    ? '#ff1a75'
    : isThinking
    ? '#a020f0'
    : isSpeaking
    ? '#ff3300'
    : '#e6005c';

  return (
    <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center select-none pointer-events-none">
      {/* Background Holographic Character Aura */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.08, 1] : [1, 1.03, 1],
          opacity: isSpeaking ? 0.75 : 0.45,
        }}
        transition={{ repeat: Infinity, duration: isSpeaking ? 0.5 : 2.5, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${eyeGlowColor} 0%, rgba(255, 60, 0, 0.25) 45%, transparent 70%)`,
        }}
      />

      {/* If a custom image URL is supplied, render image element; otherwise render original vector anime character */}
      {customAvatarUrl ? (
        <motion.img
          src={customAvatarUrl}
          alt="MYRAA AI Assistant"
          className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,50,0,0.6)]"
          animate={{
            y: isSpeaking ? [0, -3, 0] : [0, -1.5, 0],
          }}
          transition={{ repeat: Infinity, duration: isSpeaking ? 0.4 : 3 }}
        />
      ) : (
        <motion.div
          animate={{
            y: isSpeaking ? [0, -4, 0] : [0, -2, 0],
          }}
          transition={{ repeat: Infinity, duration: isSpeaking ? 0.4 : 3.5, ease: 'easeInOut' }}
          className="w-full h-full relative"
        >
          <svg
            viewBox="0 0 300 320"
            className="w-full h-full filter drop-shadow-[0_0_20px_rgba(255,40,0,0.55)]"
          >
            <defs>
              {/* Silver-White Hair Gradient */}
              <linearGradient id="silverHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#e2e8f0" />
                <stop offset="85%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#ff4d4d" /> {/* Subtle Red Highlights at tips */}
              </linearGradient>

              {/* Deep Red Hair Strand Highlights */}
              <linearGradient id="redStrandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff3366" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#990033" stopOpacity="0.9" />
              </linearGradient>

              {/* Skin Tone Gradient */}
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff5f0" />
                <stop offset="100%" stopColor="#fde0d8" />
              </linearGradient>

              {/* Glowing Violet-Red Iris Gradient */}
              <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff66cc" />
                <stop offset="40%" stopColor="#e6005c" />
                <stop offset="80%" stopColor="#990033" />
                <stop offset="100%" stopColor="#330011" />
              </radialGradient>

              {/* Futuristic Black & White Cyber Armor Suit */}
              <linearGradient id="suitWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              <linearGradient id="suitBlackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Holographic Glowing Core Reactor Gradient */}
              <radialGradient id="chestCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ff3300" />
                <stop offset="70%" stopColor="#cc0000" />
                <stop offset="100%" stopColor="#660000" />
              </radialGradient>

              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. BACK HAIR - Long Flowing Silver Locks */}
            <g id="back-hair">
              {/* Left Flowing Hair Mass */}
              <path
                d="M 120 70 C 60 80, 20 150, 25 280 C 40 250, 65 210, 85 180 Z"
                fill="url(#silverHairGrad)"
                opacity="0.95"
              />
              <path
                d="M 30 160 Q 15 220 35 290 Q 50 240 70 190 Z"
                fill="url(#redStrandGrad)"
              />

              {/* Right Flowing Hair Mass */}
              <path
                d="M 180 70 C 240 80, 280 150, 275 280 C 260 250, 235 210, 215 180 Z"
                fill="url(#silverHairGrad)"
                opacity="0.95"
              />
              <path
                d="M 270 160 Q 285 220 265 290 Q 250 240 230 190 Z"
                fill="url(#redStrandGrad)"
              />
            </g>

            {/* 2. BODY & FUTURISTIC CYBER SUIT */}
            <g id="body-and-suit">
              {/* Neck & Shoulders Base */}
              <path
                d="M 125 150 L 120 190 Q 150 198 180 190 L 175 150 Z"
                fill="url(#skinGrad)"
              />

              {/* Cyber Collar Armor */}
              <path
                d="M 115 175 L 100 200 L 122 225 L 150 215 L 178 225 L 200 200 L 185 175 Q 150 188 115 175 Z"
                fill="url(#suitBlackGrad)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Main Chest Armor - Black & White Panels */}
              <path
                d="M 90 220 L 70 310 L 230 310 L 210 220 Q 150 245 90 220 Z"
                fill="url(#suitBlackGrad)"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* White Cyber Inset Side Panels */}
              <path
                d="M 105 225 Q 125 240 142 245 L 135 310 L 80 310 L 95 240 Z"
                fill="url(#suitWhiteGrad)"
                opacity="0.9"
              />
              <path
                d="M 195 225 Q 175 240 158 245 L 165 310 L 220 310 L 205 240 Z"
                fill="url(#suitWhiteGrad)"
                opacity="0.9"
              />

              {/* Luminous Red Accent Trims */}
              <path d="M 100 230 L 85 310" stroke="#ff3300" strokeWidth="2" filter="url(#neonGlow)" />
              <path d="M 200 230 L 215 310" stroke="#ff3300" strokeWidth="2" filter="url(#neonGlow)" />

              {/* Holographic Chest Core Reactor Emblem (Triangular AI Core) */}
              <g transform="translate(150, 265)">
                {/* Outer Ring */}
                <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#ff3300" strokeWidth="2" filter="url(#neonGlow)" />

                {/* Inner Glowing Triangle */}
                <motion.polygon
                  points="0,-10 10,8 -10,8"
                  fill="url(#chestCoreGrad)"
                  filter="url(#neonGlow)"
                  animate={{
                    scale: isSpeaking ? [1, 1.2, 1] : [1, 1.05, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{ repeat: Infinity, duration: isSpeaking ? 0.35 : 1.5 }}
                />

                {/* Core Center Pulse Dot */}
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
              </g>
            </g>

            {/* 3. HEAD & FACE STRUCTURE */}
            <g id="head-and-face">
              {/* Head Silhouette Base */}
              <path
                d="M 100 90 C 100 50, 200 50, 200 90 C 200 135, 175 168, 150 168 C 125 168, 100 135, 100 90 Z"
                fill="url(#skinGrad)"
              />

              {/* Ear Clips / Cybernetic Headset Accessories */}
              <g transform="translate(92, 105)">
                <rect x="-6" y="-12" width="10" height="24" rx="4" fill="#1e293b" stroke="#ff3300" strokeWidth="1.5" />
                <circle cx="-1" cy="0" r="2" fill="#ff3300" filter="url(#neonGlow)" />
              </g>
              <g transform="translate(208, 105)">
                <rect x="-4" y="-12" width="10" height="24" rx="4" fill="#1e293b" stroke="#ff3300" strokeWidth="1.5" />
                <circle cx="1" cy="0" r="2" fill="#ff3300" filter="url(#neonGlow)" />
              </g>

              {/* Eyebrows */}
              <path d="M 115 92 Q 128 88 138 92" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 162 92 Q 172 88 185 92" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Expressive Violet-Red Glowing Eyes */}
              {/* LEFT EYE */}
              <g transform="translate(126, 110)">
                {/* Eye Outer Eyelash Line */}
                <path d="M -16 -6 Q 0 -14 16 -6" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                {/* White Sclera */}
                <ellipse cx="0" cy="0" rx="13" ry="10" fill="#ffffff" />
                {/* Iris */}
                <circle cx="0" cy="0" r="8" fill="url(#irisGrad)" filter="url(#neonGlow)" />
                {/* Pupil */}
                <circle cx="0" cy="0" r="3.5" fill="#1a0008" />
                {/* Highlights */}
                <circle cx="-3" cy="-3" r="2.5" fill="#ffffff" />
                <circle cx="3" cy="3" r="1.2" fill="#ffffff" />
              </g>

              {/* RIGHT EYE */}
              <g transform="translate(174, 110)">
                {/* Eye Outer Eyelash Line */}
                <path d="M -16 -6 Q 0 -14 16 -6" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                {/* White Sclera */}
                <ellipse cx="0" cy="0" rx="13" ry="10" fill="#ffffff" />
                {/* Iris */}
                <circle cx="0" cy="0" r="8" fill="url(#irisGrad)" filter="url(#neonGlow)" />
                {/* Pupil */}
                <circle cx="0" cy="0" r="3.5" fill="#1a0008" />
                {/* Highlights */}
                <circle cx="-3" cy="-3" r="2.5" fill="#ffffff" />
                <circle cx="3" cy="3" r="1.2" fill="#ffffff" />
              </g>

              {/* Delicate Nose Line */}
              <path d="M 150 122 L 148 128" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Anime Blush Cheeks (Always active or extra rosy in Girlfriend Mode) */}
              <ellipse cx="120" cy="128" rx="9" ry="4" fill="#ff3385" opacity={isGirlfriendMode ? "0.7" : "0.3"} filter="url(#neonGlow)" />
              <ellipse cx="180" cy="128" rx="9" ry="4" fill="#ff3385" opacity={isGirlfriendMode ? "0.7" : "0.3"} filter="url(#neonGlow)" />
              {isGirlfriendMode && (
                <>
                  {/* Little Anime Blush Lines */}
                  <path d="M 115 127 L 125 129" stroke="#ff0066" strokeWidth="1" />
                  <path d="M 175 127 L 185 129" stroke="#ff0066" strokeWidth="1" />
                </>
              )}

              {/* Audio-Reactive Lips & Mouth */}
              <g transform="translate(150, 142)">
                {isSpeaking ? (
                  /* Open Speaking Mouth */
                  <motion.path
                    d={`M -8 0 Q 0 ${mouthOpenness} 8 0 Q 0 -2 -8 0 Z`}
                    fill="#e6005c"
                    stroke="#990033"
                    strokeWidth="1"
                  />
                ) : (
                  /* Gentle Intelligent Smile */
                  <path
                    d="M -7 -1 Q 0 4 7 -1"
                    stroke="#e6005c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </g>
            </g>

            {/* 4. FRONT BANGS & SILVER HAIR LOCKS */}
            <g id="front-hair">
              {/* Top Crown Volume */}
              <path
                d="M 100 80 Q 150 35 200 80 Q 180 50 150 48 Q 120 50 100 80 Z"
                fill="url(#silverHairGrad)"
              />

              {/* Center Front Bangs */}
              <path
                d="M 130 60 L 145 92 L 152 75 L 168 95 L 175 62 Q 150 55 130 60 Z"
                fill="url(#silverHairGrad)"
              />

              {/* Left Side Framing Lock */}
              <path
                d="M 100 70 C 85 90, 80 130, 92 180 C 102 140, 112 110, 115 85 Z"
                fill="url(#silverHairGrad)"
              />
              <path
                d="M 88 100 Q 82 145 95 185 Q 102 140 108 110 Z"
                fill="url(#redStrandGrad)"
                opacity="0.85"
              />

              {/* Right Side Framing Lock */}
              <path
                d="M 200 70 C 215 90, 220 130, 208 180 C 198 140, 188 110, 185 85 Z"
                fill="url(#silverHairGrad)"
              />
              <path
                d="M 212 100 Q 218 145 205 185 Q 198 140 192 110 Z"
                fill="url(#redStrandGrad)"
                opacity="0.85"
              />
            </g>
          </svg>
        </motion.div>
      )}
    </div>
  );
};

