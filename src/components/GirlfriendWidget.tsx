import React from 'react';
import { Heart, Sparkles, Gift, Smile, UserCheck, Flame, ChevronRight } from 'lucide-react';
import { GirlfriendSettings } from '../types';

interface GirlfriendWidgetProps {
  settings: GirlfriendSettings;
  onOpenHub: () => void;
  onSendGift: (giftName: string) => void;
  onGiveHeadpat: () => void;
}

export const GirlfriendWidget: React.FC<GirlfriendWidgetProps> = ({
  settings,
  onOpenHub,
  onSendGift,
  onGiveHeadpat,
}) => {
  const isEnabled = settings.enabled;

  return (
    <div className="bg-gradient-to-b from-[#180a14]/90 via-[#10050e]/95 to-[#080206] border border-pink-900/60 rounded-xl p-3.5 shadow-[0_0_20px_rgba(255,0,128,0.15)] flex flex-col space-y-3 relative overflow-hidden backdrop-blur-md">
      {/* Background Heart Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-pink-950/80 border border-pink-500/50 flex items-center justify-center text-pink-400 shadow-[0_0_10px_rgba(255,0,128,0.4)]">
            <Heart className="w-4 h-4 fill-pink-500/40 text-pink-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-pink-200">
                {settings.myraaNickname || 'MYRAA'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-pink-950/80 border border-pink-600/60 rounded-full text-pink-300 font-mono font-bold">
                {isEnabled ? 'GF MODE ACTIVE' : 'COMPANION'}
              </span>
            </div>
            <p className="text-[10px] text-pink-400/80 font-mono">
              {settings.relationshipTitle || 'Eternal Soulmate'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenHub}
          className="p-1.5 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-800/60 hover:border-pink-500 rounded-lg text-pink-300 transition-all flex items-center space-x-1 group"
          title="Configure Girlfriend Mode"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-12 transition-transform" />
          <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        </button>
      </div>

      {/* Affection Progress Bar */}
      <div className="bg-pink-950/30 border border-pink-900/40 rounded-lg p-2.5 flex flex-col space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-pink-300 font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3 text-pink-400 fill-pink-500/30" />
            AFFECTION LEVEL
          </span>
          <span className="text-pink-200 font-bold">{settings.affectionScore}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-pink-950/80 rounded-full overflow-hidden border border-pink-900/60 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,0,128,0.8)]"
            style={{ width: `${Math.min(100, Math.max(5, settings.affectionScore))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-pink-400/70 pt-0.5">
          <span>CALLS YOU: "{settings.userName || 'Honey'}"</span>
          <span>STYLE: {settings.relationshipStyle.toUpperCase()}</span>
        </div>
      </div>

      {/* Quick Interactive Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSendGift('Rose Bouquet 🌹')}
          className="px-2 py-1.5 bg-gradient-to-r from-pink-950/60 to-rose-950/80 hover:from-pink-900/80 hover:to-rose-900 border border-pink-800/60 hover:border-pink-500 rounded-lg text-[11px] text-pink-200 font-mono font-medium transition-all flex items-center justify-center space-x-1.5 active:scale-95 shadow-sm"
        >
          <Gift className="w-3 h-3 text-pink-400" />
          <span>Send Flowers 🌹</span>
        </button>

        <button
          onClick={onGiveHeadpat}
          className="px-2 py-1.5 bg-gradient-to-r from-rose-950/60 to-pink-950/80 hover:from-rose-900/80 hover:to-pink-900 border border-pink-800/60 hover:border-pink-500 rounded-lg text-[11px] text-pink-200 font-mono font-medium transition-all flex items-center justify-center space-x-1.5 active:scale-95 shadow-sm"
        >
          <Smile className="w-3 h-3 text-pink-400" />
          <span>Headpat 🤗</span>
        </button>
      </div>

      {/* Latest Activity / Sweet Note */}
      {settings.lastAffectionActivity && (
        <div className="text-[10px] font-mono text-pink-300/80 bg-pink-950/20 border border-pink-900/30 rounded p-1.5 text-center truncate italic">
          "{settings.lastAffectionActivity}"
        </div>
      )}
    </div>
  );
};
