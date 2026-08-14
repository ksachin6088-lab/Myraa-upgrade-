import React from 'react';
import { AssistantState, AudioMetrics, SystemStatus as SystemStatusType, MessageItem, MemoryItem, GirlfriendSettings } from '../types';
import { SystemStatus } from './SystemStatus';
import { GirlfriendWidget } from './GirlfriendWidget';
import { VoiceInput } from './VoiceInput';
import { SessionInfo } from './SessionInfo';
import { MemoryMatrixWidget } from './MemoryMatrixWidget';
import { ActivityLog } from './ActivityLog';

interface LeftPanelsProps {
  state: AssistantState;
  audioMetrics: AudioMetrics;
  systemStatus: SystemStatusType;
  messages: MessageItem[];
  memories: MemoryItem[];
  girlfriendSettings: GirlfriendSettings;
  onOpenMemoryMatrix: () => void;
  onOpenGirlfriendMode: () => void;
  onSendGift: (giftName: string) => void;
  onGiveHeadpat: () => void;
}

export const LeftPanels: React.FC<LeftPanelsProps> = ({
  state,
  audioMetrics,
  systemStatus,
  messages,
  memories,
  girlfriendSettings,
  onOpenMemoryMatrix,
  onOpenGirlfriendMode,
  onSendGift,
  onGiveHeadpat,
}) => {
  return (
    <div className="flex flex-col space-y-3.5 w-full text-xs font-mono select-none">
      <SystemStatus />
      <GirlfriendWidget
        settings={girlfriendSettings}
        onOpenHub={onOpenGirlfriendMode}
        onSendGift={onSendGift}
        onGiveHeadpat={onGiveHeadpat}
      />
      <MemoryMatrixWidget memories={memories} onOpenMatrix={onOpenMemoryMatrix} />
      <VoiceInput state={state} audioMetrics={audioMetrics} />
      <SessionInfo state={state} audioMetrics={audioMetrics} systemStatus={systemStatus} />
      <ActivityLog messages={messages} />
    </div>
  );
};

