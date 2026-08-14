import React from 'react';
import { AssistantState, LanguageMode, AudioMetrics } from '../types';
import { AIStatus } from './AIStatus';
import { PhoneControlWidget } from './PhoneControlWidget';
import { QuickTools } from './QuickTools';
import { CurrentTask } from './CurrentTask';
import { AudioVisualizer } from './AudioVisualizer';

interface RightPanelsProps {
  state: AssistantState;
  languageMode: LanguageMode;
  setLanguageMode: (lang: LanguageMode) => void;
  audioMetrics: AudioMetrics;
  onQuickToolExecute: (toolName: string, args: any) => void;
  onOpenPhoneControl: () => void;
}

export const RightPanels: React.FC<RightPanelsProps> = ({
  state,
  languageMode,
  setLanguageMode,
  audioMetrics,
  onQuickToolExecute,
  onOpenPhoneControl,
}) => {
  return (
    <div className="flex flex-col space-y-3.5 w-full text-xs font-mono select-none">
      <AIStatus state={state} languageMode={languageMode} setLanguageMode={setLanguageMode} />
      <PhoneControlWidget onOpenPhoneControl={onOpenPhoneControl} />
      <QuickTools onQuickToolExecute={onQuickToolExecute} />
      <CurrentTask />
      <AudioVisualizer state={state} audioMetrics={audioMetrics} />
    </div>
  );
};

