import React from 'react';
import { MicrophoneButton } from './MicrophoneButton';
import { AssistantState } from '../types';

interface VoiceControlProps {
  state: AssistantState;
  audioLevel: number;
  onToggleSession: () => void;
  onInterrupt: () => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = (props) => {
  return <MicrophoneButton {...props} />;
};
