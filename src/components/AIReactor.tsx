import React from 'react';
import { MyraaCore } from './MyraaCore';
import { AssistantState } from '../types';

interface AIReactorProps {
  state: AssistantState;
  inputLevel: number;
  outputLevel: number;
}

export const AIReactor: React.FC<AIReactorProps> = (props) => {
  return <MyraaCore {...props} />;
};
