import React, { useState } from 'react';
import { MessageSquare, Wrench, Bookmark, Trash2, Globe, Clock, Calendar, Search, Bell } from 'lucide-react';
import { MessageItem, MemoryItem } from '../types';

interface ActivityPanelProps {
  messages: MessageItem[];
  memories: MemoryItem[];
  onDeleteMemory: (id: string) => void;
  onQuickToolExecute: (toolName: string, args: any) => void;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({
  messages,
  memories,
  onDeleteMemory,
  onQuickToolExecute,
}) => {
  const [activeTab, setActiveTab] = useState<'transcripts' | 'memory' | 'tools'>('transcripts');

  return (
    <div className="flex flex-col h-full bg-gray-950/70 backdrop-blur-md rounded-xl border border-orange-500/20 text-gray-200 text-sm font-mono shadow-[0_0_20px_rgba(255,50,0,0.1)] overflow-hidden">
      {/* Panel Navigation Tabs */}
      <div className="flex border-b border-orange-500/20 bg-gray-900/50">
        <button
          onClick={() => setActiveTab('transcripts')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'transcripts'
              ? 'border-orange-500 text-orange-400 bg-orange-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>ACTIVITY</span>
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'memory'
              ? 'border-orange-500 text-orange-400 bg-orange-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>MEMORY ({memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'tools'
              ? 'border-orange-500 text-orange-400 bg-orange-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>TOOLS</span>
        </button>
      </div>

      {/* Tab 1: Live Conversation Transcripts */}
      {activeTab === 'transcripts' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[220px] max-h-[420px]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-orange-500" />
              <span>Voice session active. Speak to MYRAA to view real-time transcripts.</span>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-lg border text-xs leading-relaxed transition-all ${
                  msg.sender === 'user'
                    ? 'bg-orange-950/20 border-orange-500/30 text-orange-200 ml-4'
                    : msg.sender === 'myraa'
                    ? 'bg-gray-900/80 border-gray-800 text-gray-200 mr-2 shadow-[0_0_10px_rgba(255,80,0,0.05)]'
                    : 'bg-gray-900/40 border-gray-800 text-cyan-400/90 text-[11px]'
                }`}
              >
                <div className="flex justify-between items-center mb-1 text-[10px] text-gray-400 uppercase font-semibold">
                  <span className={msg.sender === 'myraa' ? 'text-orange-400 font-bold' : msg.sender === 'user' ? 'text-amber-400' : 'text-cyan-400'}>
                    {msg.sender === 'myraa' ? '⚡ MYRAA' : msg.sender === 'user' ? '👤 USER' : '⚙ SYSTEM'}
                  </span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <div>{msg.text}</div>

                {/* Display Executed Tool Badges */}
                {msg.toolCalls && msg.toolCalls.map((t) => (
                  <div key={t.id} className="mt-2 p-1.5 rounded bg-orange-950/40 border border-orange-500/30 text-[10px] text-orange-300">
                    <span className="font-bold">Tool Call:</span> {t.name}({JSON.stringify(t.args)})
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Long-Term Memory View */}
      {activeTab === 'memory' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[220px] max-h-[420px]">
          {memories.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 text-xs">
              <Bookmark className="w-8 h-8 mb-2 opacity-40 text-orange-500" />
              <span>No stored memories yet. Ask MYRAA "remember that..." or add a reminder.</span>
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="p-2.5 rounded-lg bg-gray-900/80 border border-orange-500/20 flex items-start justify-between text-xs"
              >
                <div className="space-y-1 pr-2">
                  <div className="font-bold text-orange-400 uppercase text-[11px]">{mem.key}</div>
                  <div className="text-gray-300 text-xs">{mem.value}</div>
                  <div className="text-[9px] text-gray-500">
                    Saved: {new Date(mem.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Tools Dashboard */}
      {activeTab === 'tools' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[220px] max-h-[420px]">
          <div className="text-xs text-orange-400 font-bold mb-2">QUICK ACTIONS</div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickToolExecute('getCurrentTime', {})}
              className="p-2 bg-gray-900/80 hover:bg-orange-950/30 border border-gray-800 hover:border-orange-500/40 rounded flex items-center space-x-2 text-xs text-gray-300 transition-all text-left"
            >
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Check Time</span>
            </button>

            <button
              onClick={() => onQuickToolExecute('getCurrentDate', {})}
              className="p-2 bg-gray-900/80 hover:bg-orange-950/30 border border-gray-800 hover:border-orange-500/40 rounded flex items-center space-x-2 text-xs text-gray-300 transition-all text-left"
            >
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Today's Date</span>
            </button>

            <button
              onClick={() => onQuickToolExecute('openWebsite', { url: 'https://youtube.com' })}
              className="p-2 bg-gray-900/80 hover:bg-orange-950/30 border border-gray-800 hover:border-orange-500/40 rounded flex items-center space-x-2 text-xs text-gray-300 transition-all text-left"
            >
              <Globe className="w-4 h-4 text-orange-400" />
              <span>Open YouTube</span>
            </button>

            <button
              onClick={() => onQuickToolExecute('getWeather', { location: 'New Delhi' })}
              className="p-2 bg-gray-900/80 hover:bg-orange-950/30 border border-gray-800 hover:border-orange-500/40 rounded flex items-center space-x-2 text-xs text-gray-300 transition-all text-left"
            >
              <Search className="w-4 h-4 text-orange-400" />
              <span>Get Weather</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
