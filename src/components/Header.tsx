import React from 'react';
import { HUD } from './HUD';
import { AssistantState } from '../types';

interface HeaderProps {
  state: AssistantState;
  uptimeSeconds: number;
  onToggleTextDrawer: () => void;
  onResetSession: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return <HUD {...props} />;
};
