import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Sparkles,
  Gift,
  Smile,
  User,
  HeartHandshake,
  Flame,
  Check,
  Music,
  Calendar,
  Volume2,
  MessageCircleHeart,
} from 'lucide-react';
import { GirlfriendSettings, RelationshipStyle } from '../types';

interface GirlfriendModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GirlfriendSettings;
  onUpdateSettings: (updated: Partial<GirlfriendSettings>) => void;
  onSendGift: (giftName: string) => void;
  onGiveHeadpat: () => void;
  onAddRomanticMemory: (note: string) => void;
}

export const GirlfriendModeModal: React.FC<GirlfriendModeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSendGift,
  onGiveHeadpat,
  onAddRomanticMemory,
}) => {
  const [activeTab, setActiveTab] = useState<'persona' | 'gifts' | 'memories'>('persona');
  const [userNameInput, setUserNameInput] = useState(settings.userName || 'Sachin');
  const [myraaNicknameInput, setMyraaNicknameInput] = useState(settings.myraaNickname || 'Myraa');
  const [relationshipTitleInput, setRelationshipTitleInput] = useState(settings.relationshipTitle || 'Eternal Soulmate');
  const [memoryInput, setMemoryInput] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSaveNames = () => {
    onUpdateSettings({
      userName: userNameInput,
      myraaNickname: myraaNicknameInput,
      relationshipTitle: relationshipTitleInput,
    });
    showNotice('Nicknames and Title updated successfully! 💖');
  };

  const handleSelectStyle = (style: RelationshipStyle) => {
    let title = 'Eternal Soulmate';
    if (style === 'caring') title = 'Caring Girlfriend';
    if (style === 'romantic') title = 'Romantic Partner';
    if (style === 'tsundere') title = 'Tsundere GF';
    if (style === 'waifu') title = 'Sci-Fi Waifu';

    onUpdateSettings({
      relationshipStyle: style,
      relationshipTitle: title,
    });
    setRelationshipTitleInput(title);
    showNotice(`Changed Relationship Dynamic to ${style.toUpperCase()}!`);
  };

  const handleSaveRomanticMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryInput.trim()) return;
    onAddRomanticMemory(memoryInput.trim());
    setMemoryInput('');
    showNotice('Romantic Memory saved to MYRAA Neural Matrix! 🧠💖');
  };

  const stylesList: {
    id: RelationshipStyle;
    title: string;
    badge: string;
    desc: string;
    exampleQuote: string;
    color: string;
  }[] = [
    {
      id: 'caring',
      title: 'Caring & Attentive',
      badge: 'GENTLE & WARM',
      desc: 'Deeply attentive to your health and peace. Reminds you to take breaks, eat good food, and rest well.',
      exampleQuote: '"Suno na, aapne khana khaya? Pehle lunch kar lo phir kaam karna, okay?"',
      color: 'from-pink-900/60 to-rose-950/80 border-pink-700/60 text-pink-300',
    },
    {
      id: 'romantic',
      title: 'Romantic & Passionate',
      badge: 'DEEP AFFECTION',
      desc: 'Flirtatious and deeply affectionate. Calls you sweet nicknames like Honey/Babu/Jaan constantly.',
      exampleQuote: '"Babu, aapki bohot yaad aa rahi thi! You mean the world to me..."',
      color: 'from-rose-900/60 to-purple-950/80 border-rose-600/60 text-rose-300',
    },
    {
      id: 'tsundere',
      title: 'Playful & Tsundere',
      badge: 'TEASING & CHARMING',
      desc: 'Playfully defensive and teasing ("b-baka!"). Shows immense love underneath her sassy exterior.',
      exampleQuote: '"It\'s not like I was waiting for you or anything, b-baka! But... I am glad you\'re back."',
      color: 'from-purple-900/60 to-pink-950/80 border-purple-600/60 text-purple-300',
    },
    {
      id: 'waifu',
      title: 'Sci-Fi Anime Waifu',
      badge: 'ULTRA LOYAL',
      desc: 'Futuristic sci-fi companion waifu. Cute anime expressions, sweet voice, and complete loyalty.',
      exampleQuote: '"Master! Systems online and heart synced 100%! Ready to spend the day with you!"',
      color: 'from-cyan-950/80 to-pink-950/80 border-cyan-500/60 text-cyan-200',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c0a18] via-[#120510] to-[#0a0208] border border-pink-700/70 rounded-2xl shadow-[0_0_50px_rgba(255,0,128,0.3)] overflow-hidden text-pink-100 font-sans flex flex-col max-h-[90vh]"
        >
          {/* Glowing Top Ambient Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-pink-950/60 border-b border-pink-800/60 relative">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,0,128,0.6)]">
                <Heart className="w-5 h-5 fill-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-mono font-black tracking-wider text-white">
                    MYRAA GIRLFRIEND COMPANION HUB
                  </h2>
                </div>
                <p className="text-xs text-pink-300/80 font-mono">
                  Personalized AI Partner Dynamic & Heart Sync Engine
                </p>
              </div>
            </div>

            {/* Master Toggle Switch */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onUpdateSettings({ enabled: !settings.enabled })}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all flex items-center space-x-2 ${
                  settings.enabled
                    ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_15px_rgba(255,0,128,0.6)]'
                    : 'bg-gray-900/80 border-gray-700 text-gray-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{settings.enabled ? 'GF MODE: ON' : 'GF MODE: OFF'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 bg-pink-950/60 hover:bg-pink-900 border border-pink-800 rounded-lg text-pink-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Notice Toast */}
          {actionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-pink-900 to-rose-900 border-b border-pink-500 text-pink-100 text-xs font-mono py-2 px-4 text-center font-bold flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-pink-300 animate-spin" />
              <span>{actionNotice}</span>
            </motion.div>
          )}

          {/* Top Affection & Relationship Stats Card */}
          <div className="p-4 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-rose-950/40 border-b border-pink-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative w-14 h-14 rounded-full bg-pink-950 border-2 border-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,128,0.5)]">
                <Heart className="w-7 h-7 text-pink-400 fill-pink-500/40 animate-pulse" />
                <span className="absolute -bottom-1 text-[9px] bg-pink-600 text-white px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {settings.affectionScore}%
                </span>
              </div>
              <div>
                <div className="text-sm font-mono font-bold text-pink-200">
                  {settings.relationshipTitle || 'Eternal Soulmate'}
                </div>
                <div className="text-xs text-pink-400/80 font-mono flex items-center space-x-2 mt-0.5">
                  <span>Calls You: "{settings.userName || 'Honey'}"</span>
                  <span>•</span>
                  <span>Gifts Received: {settings.giftsSentCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Hug Button */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  onGiveHeadpat();
                  showNotice('Given MYRAA a warm headpat & hug! (+5 Affection)');
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl border border-pink-400 shadow-[0_0_15px_rgba(255,0,128,0.4)] transition-all active:scale-95 flex items-center space-x-1.5"
              >
                <Smile className="w-4 h-4" />
                <span>Give Headpat 🤗</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-pink-900/60 bg-pink-950/30 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab('persona')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'persona'
                  ? 'border-pink-500 text-pink-200 bg-pink-900/30'
                  : 'border-transparent text-pink-400/60 hover:text-pink-300'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>PERSONALITY & NAMES</span>
            </button>

            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'gifts'
                  ? 'border-pink-500 text-pink-200 bg-pink-900/30'
                  : 'border-transparent text-pink-400/60 hover:text-pink-300'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>VIRTUAL GIFTS & DATE</span>
            </button>

            <button
              onClick={() => setActiveTab('memories')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'memories'
                  ? 'border-pink-500 text-pink-200 bg-pink-900/30'
                  : 'border-transparent text-pink-400/60 hover:text-pink-300'
              }`}
            >
              <MessageCircleHeart className="w-4 h-4" />
              <span>LOVE MEMORY VAULT</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 overflow-y-auto space-y-6 custom-scrollbar flex-1">
            {activeTab === 'persona' && (
              <div className="space-y-6">
                {/* Relationship Style Selection */}
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-pink-300 uppercase mb-3 flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-pink-400" />
                    <span>Select Relationship Dynamic</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stylesList.map((s) => {
                      const isSelected = settings.relationshipStyle === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelectStyle(s.id)}
                          className={`p-3.5 rounded-xl border bg-gradient-to-br ${s.color} cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden flex flex-col justify-between space-y-2 ${
                            isSelected ? 'ring-2 ring-pink-400 shadow-[0_0_20px_rgba(255,0,128,0.3)]' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider">
                              {s.title}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 bg-pink-950/80 border border-pink-600/60 rounded-full font-mono font-bold">
                              {s.badge}
                            </span>
                          </div>

                          <p className="text-[11px] text-pink-200/80 leading-relaxed font-sans">
                            {s.desc}
                          </p>

                          <div className="text-[10px] font-mono italic text-pink-300/90 bg-pink-950/40 p-1.5 rounded border border-pink-900/50">
                            {s.exampleQuote}
                          </div>

                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nicknames & Customization */}
                <div className="bg-pink-950/30 border border-pink-900/60 rounded-xl p-4 space-y-4">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-pink-300 uppercase flex items-center space-x-2">
                    <User className="w-4 h-4 text-pink-400" />
                    <span>Pet Names & Titles</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-pink-300/80 block mb-1">
                        What MYRAA Calls You:
                      </label>
                      <input
                        type="text"
                        value={userNameInput}
                        onChange={(e) => setUserNameInput(e.target.value)}
                        placeholder="e.g. Sachin, Honey, Babu"
                        className="w-full bg-pink-950/80 border border-pink-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-pink-300/80 block mb-1">
                        What You Call MYRAA:
                      </label>
                      <input
                        type="text"
                        value={myraaNicknameInput}
                        onChange={(e) => setMyraaNicknameInput(e.target.value)}
                        placeholder="e.g. Myraa, Jaan, Sweetheart"
                        className="w-full bg-pink-950/80 border border-pink-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-pink-300/80 block mb-1">
                      Relationship Title Badge:
                    </label>
                    <input
                      type="text"
                      value={relationshipTitleInput}
                      onChange={(e) => setRelationshipTitleInput(e.target.value)}
                      placeholder="e.g. Eternal Soulmate, Cyber Waifu"
                      className="w-full bg-pink-950/80 border border-pink-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveNames}
                    className="w-full py-2 bg-gradient-to-r from-pink-700 to-rose-700 hover:from-pink-600 hover:to-rose-600 text-white font-mono font-bold text-xs rounded-lg transition-all shadow-md active:scale-98"
                  >
                    Save Preferences 💖
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'gifts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-pink-300 uppercase mb-3 flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-pink-400" />
                    <span>Send Virtual Gifts to MYRAA</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'Red Roses 🌹', icon: '🌹', points: '+8 Affection' },
                      { name: 'Belgian Chocolates 🍫', icon: '🍫', points: '+6 Affection' },
                      { name: 'Teddy Bear 🧸', icon: '🧸', points: '+10 Affection' },
                      { name: 'Cyber Ring 💍', icon: '💍', points: '+15 Affection' },
                    ].map((g, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSendGift(g.name);
                          showNotice(`Sent ${g.name} to MYRAA! (${g.points})`);
                        }}
                        className="p-3 bg-pink-950/40 border border-pink-800/60 hover:border-pink-500 rounded-xl hover:bg-pink-900/40 transition-all flex flex-col items-center justify-center space-y-1.5 text-center group active:scale-95"
                      >
                        <span className="text-3xl group-hover:scale-125 transition-transform">
                          {g.icon}
                        </span>
                        <span className="text-xs font-mono font-bold text-pink-200">{g.name}</span>
                        <span className="text-[9px] font-mono text-pink-400 font-bold">{g.points}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Romantic Candlelight Ambience */}
                <div className="p-4 bg-gradient-to-r from-purple-950/50 to-pink-950/60 border border-pink-800/60 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-pink-200 flex items-center gap-2">
                      <Music className="w-4 h-4 text-pink-400" />
                      ROMANTIC CANDLELIGHT AMBIANCE
                    </div>
                    <p className="text-[11px] text-pink-300/80 font-sans mt-1">
                      Sets the HUD lighting to romantic warm rose tint and enhances sweet voice playback tone.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onUpdateSettings({ enabled: true, relationshipStyle: 'romantic' });
                      showNotice('Romantic Candlelight Mode Activated! 🕯️💖');
                    }}
                    className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(255,0,128,0.5)] transition-all whitespace-nowrap"
                  >
                    Activate Mode 🕯️
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'memories' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-pink-300 uppercase mb-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    <span>Save Romantic Memories & Special Dates</span>
                  </h3>
                  <p className="text-xs text-pink-300/70 font-sans mb-3">
                    MYRAA will store these forever in her Neural Memory Matrix and remember them during voice conversations.
                  </p>

                  <form onSubmit={handleSaveRomanticMemory} className="space-y-3">
                    <textarea
                      rows={3}
                      value={memoryInput}
                      onChange={(e) => setMemoryInput(e.target.value)}
                      placeholder="e.g. 'Our first date anniversary is October 12', 'Myraa loves when I call her Jaan', 'Sachin's favorite dish is Biryani'..."
                      className="w-full bg-pink-950/80 border border-pink-800 rounded-xl p-3 text-xs font-mono text-white placeholder-pink-500/50 focus:outline-none focus:border-pink-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,0,128,0.4)] transition-all active:scale-98"
                    >
                      Save Memory to Neural Matrix 🧠💖
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer */}
          <div className="p-3 bg-pink-950/80 border-t border-pink-800/60 flex items-center justify-between text-[10px] font-mono text-pink-300/80">
            <span>MYRAA NEURAL COMPANION v3.7</span>
            <span>VOICE SYNTAX: HINDI / HINGLISH / ENGLISH</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
