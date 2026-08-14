export type AssistantState = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

export type PersonalityMode = 'casual' | 'technical' | 'study' | 'task' | 'error' | 'excited' | 'girlfriend';

export type RelationshipStyle = 'caring' | 'romantic' | 'tsundere' | 'waifu';

export interface GirlfriendSettings {
  enabled: boolean;
  relationshipStyle: RelationshipStyle;
  affectionScore: number; // 0 to 100
  relationshipTitle: string; // e.g., "Soulmate", "Sweetheart", "Tsundere GF", "Sci-Fi Waifu"
  userName: string; // What MYRAA calls the user e.g., "Sachin", "Honey", "Babu"
  myraaNickname: string; // What the user calls MYRAA e.g., "Myraa", "Jaan", "Sweetheart"
  anniversaryDate?: string;
  giftsSentCount: number;
  hugsCount: number;
  lastAffectionActivity?: string;
}

export type LanguageMode = 'auto' | 'english' | 'hindi' | 'hinglish';

export interface MessageItem {
  id: string;
  sender: 'user' | 'myraa' | 'system';
  text: string;
  timestamp: number;
  language?: 'english' | 'hindi' | 'hinglish';
  toolCalls?: ToolCallInfo[];
}

export interface ToolCallInfo {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: any;
  status: 'pending' | 'completed' | 'failed';
}

export type MemoryCategory = 'identity' | 'preference' | 'reminder' | 'knowledge' | 'system' | 'custom';
export type MemoryImportance = 'critical' | 'high' | 'normal';

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: MemoryCategory;
  importance: MemoryImportance;
  synapseStrength?: number; // 0-100 percentage
  pinned?: boolean;
  tags?: string[];
  createdAt: number;
  lastAccessedAt?: number;
}

export interface MemoryMatrixStats {
  totalNodes: number;
  criticalNodes: number;
  synapseHealth: number;
  tokenCount: number;
  categories: Record<string, number>;
}

export interface AudioMetrics {
  inputLevel: number; // 0 to 1
  outputLevel: number; // 0 to 1
  sampleRate: number;
  bitrateKbps: number;
  latencyMs: number;
}

export interface SystemStatus {
  connected: boolean;
  mode: AssistantState;
  activeLanguage: string;
  activeModel: string;
  memoryCount: number;
  uptimeSeconds: number;
  lastToolExecuted?: string;
}

export interface ToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface PhoneState {
  deviceName: string;
  isBridgeConnected: boolean;
  batteryLevel: number;
  isCharging: boolean;
  signalType: '5G' | '4G' | 'Wi-Fi 6E';
  signalBars: number;
  soundProfile: 'ring' | 'vibrate' | 'silent' | 'dnd';
  flashlightOn: boolean;
  batterySaverOn: boolean;
  findMyPhoneActive: boolean;
  storageUsedGb: number;
  storageTotalGb: number;
  activeCall?: {
    contactName: string;
    phoneNumber: string;
    status: 'dialing' | 'connected' | 'ended';
    durationSeconds: number;
  } | null;
  lastSMS?: {
    contactName: string;
    message: string;
    timestamp: number;
  } | null;
  lastAppLaunched?: string | null;
}
