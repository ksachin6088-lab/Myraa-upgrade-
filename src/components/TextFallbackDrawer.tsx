import React, { useState } from 'react';
import { Send, X, Terminal } from 'lucide-react';

interface TextFallbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendText: (text: string) => void;
}

export const TextFallbackDrawer: React.FC<TextFallbackDrawerProps> = ({
  isOpen,
  onClose,
  onSendText,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendText(inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-gray-950/95 backdrop-blur-xl border-t border-orange-500/30 text-gray-200 font-mono shadow-[0_-10px_40px_rgba(255,50,0,0.2)] animate-in slide-in-from-bottom duration-200">
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-between text-xs text-orange-400 font-bold border-b border-orange-500/20 pb-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>MYRAA COMMAND INPUT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-orange-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a command in English, Hindi, or Hinglish (e.g. MYRAA YouTube kholo)..."
            className="flex-1 bg-gray-900 border border-orange-500/30 focus:border-orange-400 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500 shadow-inner"
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 font-bold text-xs text-white rounded-lg border border-orange-400 shadow-[0_0_15px_rgba(255,80,0,0.4)] transition-all flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">TRANSMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
