import { ToolDeclaration, MemoryItem, MemoryMatrixStats, MemoryCategory, MemoryImportance, PhoneState } from '../types';

export interface ToolExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
}

export class ToolManager {
  private static memories: MemoryItem[] = [];

  private static phoneState: PhoneState = {
    deviceName: 'MYRAA Phone Pro (Sachin)',
    isBridgeConnected: true,
    batteryLevel: 88,
    isCharging: true,
    signalType: '5G',
    signalBars: 5,
    soundProfile: 'ring',
    flashlightOn: false,
    batterySaverOn: false,
    findMyPhoneActive: false,
    storageUsedGb: 184,
    storageTotalGb: 512,
    activeCall: null,
    lastSMS: {
      contactName: 'Nangong Shishu',
      message: 'Master, all security patrols are active near the perimeter.',
      timestamp: Date.now() - 300000,
    },
    lastAppLaunched: 'WhatsApp',
  };

  private static phoneStateListeners: Array<(state: PhoneState) => void> = [];

  static {
    // Load memories from localStorage or initialize with Max Level Neural Matrix Seeds
    try {
      const stored = localStorage.getItem('myraa_longterm_memory_v2');
      if (stored) {
        this.memories = JSON.parse(stored);
      } else {
        this.seedInitialMemories();
      }
    } catch (e) {
      this.seedInitialMemories();
    }
  }

  public static getPhoneState(): PhoneState {
    return { ...this.phoneState };
  }

  public static subscribePhoneState(listener: (state: PhoneState) => void): () => void {
    this.phoneStateListeners.push(listener);
    listener(this.getPhoneState());
    return () => {
      this.phoneStateListeners = this.phoneStateListeners.filter((l) => l !== listener);
    };
  }

  public static notifyPhoneStateChanged() {
    const currentState = this.getPhoneState();
    this.phoneStateListeners.forEach((listener) => listener(currentState));
  }

  public static updatePhoneState(updater: (prev: PhoneState) => PhoneState) {
    this.phoneState = updater(this.phoneState);
    this.notifyPhoneStateChanged();
  }

  private static seedInitialMemories() {
    this.memories = [
      {
        id: 'mem_init_1',
        key: 'User Identity',
        value: 'Master / Creator (Sachin)',
        category: 'identity',
        importance: 'critical',
        synapseStrength: 100,
        pinned: true,
        tags: ['user', 'identity', 'master'],
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        id: 'mem_init_2',
        key: 'Primary Language',
        value: 'Bilingual (Hindi + English / Hinglish)',
        category: 'preference',
        importance: 'critical',
        synapseStrength: 98,
        pinned: true,
        tags: ['language', 'hinglish', 'voice'],
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'mem_init_3',
        key: 'System Identity',
        value: 'MYRAA AI ASSISTANT (Neural Core v2.5.0)',
        category: 'system',
        importance: 'critical',
        synapseStrength: 100,
        pinned: true,
        tags: ['myraa', 'core', 'system'],
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: 'mem_init_4',
        key: 'User Focus Objective',
        value: 'Full-Stack Development & Futuristic AI Voice Systems',
        category: 'knowledge',
        importance: 'high',
        synapseStrength: 94,
        pinned: false,
        tags: ['tech', 'ai', 'goals'],
        createdAt: Date.now() - 86400000 * 1,
      },
      {
        id: 'mem_init_5',
        key: 'Active Reminder',
        value: 'Review MYRAA AI Neural Memory Matrix performance',
        category: 'reminder',
        importance: 'high',
        synapseStrength: 92,
        pinned: true,
        tags: ['reminder', 'myraa', 'testing'],
        createdAt: Date.now() - 3600000 * 2,
      },
    ];
    this.saveMemoriesToDisk();
  }

  public static getDeclarations(): ToolDeclaration[] {
    return [
      {
        name: 'openWebsite',
        description: 'Opens a requested website or URL in the browser (e.g., YouTube, Google, Wikipedia).',
        parameters: {
          type: 'OBJECT',
          properties: {
            url: { type: 'STRING', description: 'The web URL or domain to open (e.g. https://youtube.com)' },
          },
          required: ['url'],
        },
      },
      {
        name: 'getCurrentTime',
        description: 'Get the current local time.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'getCurrentDate',
        description: 'Get the current date and day of the week.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'searchWeb',
        description: 'Perform a web search query for current information, news, or answers.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'The topic or question to search' },
          },
          required: ['query'],
        },
      },
      {
        name: 'createReminder',
        description: 'Creates a reminder or task for the user.',
        parameters: {
          type: 'OBJECT',
          properties: {
            task: { type: 'STRING', description: 'Task or topic for reminder' },
            time: { type: 'STRING', description: 'Time or schedule description' },
          },
          required: ['task'],
        },
      },
      {
        name: 'getWeather',
        description: 'Get the weather report for a location.',
        parameters: {
          type: 'OBJECT',
          properties: {
            location: { type: 'STRING', description: 'City name or country' },
          },
          required: ['location'],
        },
      },
      {
        name: 'saveMemory',
        description: 'Save user preference, fact, or detail to MYRAA long-term neural memory matrix.',
        parameters: {
          type: 'OBJECT',
          properties: {
            key: { type: 'STRING', description: 'Memory label or title' },
            value: { type: 'STRING', description: 'Information content to remember' },
            category: {
              type: 'STRING',
              description: 'Category: identity, preference, reminder, knowledge, system, or custom',
            },
            importance: { type: 'STRING', description: 'Importance level: critical, high, or normal' },
          },
          required: ['key', 'value'],
        },
      },
      {
        name: 'searchMemory',
        description: 'Search MYRAA long-term memory matrix for facts, preferences, or notes.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Keyword or concept to search in stored memories' },
          },
          required: ['query'],
        },
      },
      {
        name: 'makePhoneCall',
        description: 'Initiate or dial a phone call on the connected smartphone.',
        parameters: {
          type: 'OBJECT',
          properties: {
            contactName: { type: 'STRING', description: 'Name of the contact or business to call' },
            phoneNumber: { type: 'STRING', description: 'Phone number to dial (optional if contact provided)' },
          },
          required: ['contactName'],
        },
      },
      {
        name: 'endPhoneCall',
        description: 'Hang up or end active phone call on connected phone.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'sendSMS',
        description: 'Send a text message / SMS / WhatsApp message via connected phone.',
        parameters: {
          type: 'OBJECT',
          properties: {
            contactName: { type: 'STRING', description: 'Recipient contact name' },
            message: { type: 'STRING', description: 'Message text content' },
          },
          required: ['contactName', 'message'],
        },
      },
      {
        name: 'togglePhoneSetting',
        description: 'Toggle phone hardware/system settings: flashlight, silentMode, findMyPhone, or batterySaver.',
        parameters: {
          type: 'OBJECT',
          properties: {
            setting: {
              type: 'STRING',
              description: 'Setting name: flashlight, silentMode, findMyPhone, batterySaver',
            },
            enable: { type: 'BOOLEAN', description: 'True to enable/turn on, False to disable/turn off' },
          },
          required: ['setting'],
        },
      },
      {
        name: 'launchAppOnPhone',
        description: 'Open or launch an app on the connected mobile device (e.g., WhatsApp, YouTube, Camera, Maps, Spotify).',
        parameters: {
          type: 'OBJECT',
          properties: {
            appName: { type: 'STRING', description: 'App name to launch' },
          },
          required: ['appName'],
        },
      },
      {
        name: 'getPhoneStatus',
        description: 'Check battery level, network connection, signal strength, call status, and settings of connected phone.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
    ];
  }

  public static async execute(name: string, args: Record<string, any>): Promise<ToolExecutionResult> {
    try {
      switch (name) {
        case 'openWebsite': {
          let url = String(args.url || '').trim();
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          const parsed = new URL(url);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return { success: false, error: 'Only HTTP/HTTPS URLs are allowed.' };
          }
          window.open(parsed.href, '_blank', 'noopener,noreferrer');
          return { success: true, result: `Successfully opened ${parsed.hostname}` };
        }

        case 'getCurrentTime': {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          return { success: true, result: `Current time is ${timeStr} (${timeZone})` };
        }

        case 'getCurrentDate': {
          const now = new Date();
          const dateStr = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          return { success: true, result: `Today is ${dateStr}` };
        }

        case 'searchWeb': {
          const query = String(args.query || '');
          return {
            success: true,
            result: `Search results for "${query}": Found official resources and key updates regarding ${query}.`,
          };
        }

        case 'createReminder': {
          const task = String(args.task || '');
          const time = String(args.time || 'Soon');
          const id = 'rem_' + Date.now();
          const memory: MemoryItem = {
            id,
            key: `Reminder: ${task}`,
            value: `Scheduled for: ${time}`,
            category: 'reminder',
            importance: 'high',
            synapseStrength: 95,
            pinned: true,
            createdAt: Date.now(),
          };
          this.memories.push(memory);
          this.saveMemoriesToDisk();
          return { success: true, result: `Created reminder for "${task}" at ${time}` };
        }

        case 'getWeather': {
          const location = String(args.location || 'Local city');
          const temp = Math.floor(22 + Math.random() * 8);
          const condition = ['Sunny and Clear', 'Partly Cloudy', 'Pleasant Breeze', 'Fair Sky'][Math.floor(Math.random() * 4)];
          return {
            success: true,
            result: `Weather in ${location}: ${temp}°C, ${condition}, Humidity 45%, Wind 12 km/h.`,
          };
        }

        case 'saveMemory': {
          const key = String(args.key || 'Fact');
          const value = String(args.value || '');
          const category = (args.category || 'knowledge') as MemoryCategory;
          const importance = (args.importance || 'high') as MemoryImportance;
          
          const id = 'mem_' + Date.now();
          const newMem: MemoryItem = {
            id,
            key,
            value,
            category,
            importance,
            synapseStrength: 98,
            pinned: importance === 'critical',
            createdAt: Date.now(),
          };
          
          this.memories.push(newMem);
          this.saveMemoriesToDisk();
          return { success: true, result: `Saved to Neural Memory Matrix: [${category.toUpperCase()}] ${key} = "${value}"` };
        }

        case 'searchMemory': {
          const query = String(args.query || '').toLowerCase();
          const matches = this.memories.filter(
            (m) => m.key.toLowerCase().includes(query) || m.value.toLowerCase().includes(query)
          );
          if (matches.length === 0) {
            return { success: true, result: `No memory nodes matching "${query}" were found.` };
          }
          const formatted = matches.map((m) => `[${m.category.toUpperCase()}] ${m.key}: ${m.value}`).join(' | ');
          return { success: true, result: `Found ${matches.length} matching memory nodes: ${formatted}` };
        }

        case 'makePhoneCall': {
          const contactName = String(args.contactName || 'Contact');
          const phoneNumber = String(args.phoneNumber || '+91 98765 43210');
          this.updatePhoneState((prev) => ({
            ...prev,
            activeCall: {
              contactName,
              phoneNumber,
              status: 'connected',
              durationSeconds: 0,
            },
          }));
          return { success: true, result: `Calling ${contactName} (${phoneNumber}) on phone...` };
        }

        case 'endPhoneCall': {
          this.updatePhoneState((prev) => ({
            ...prev,
            activeCall: null,
          }));
          return { success: true, result: `Call ended.` };
        }

        case 'sendSMS': {
          const contactName = String(args.contactName || 'Contact');
          const message = String(args.message || '');
          this.updatePhoneState((prev) => ({
            ...prev,
            lastSMS: {
              contactName,
              message,
              timestamp: Date.now(),
            },
          }));
          return { success: true, result: `Message sent to ${contactName}: "${message}"` };
        }

        case 'togglePhoneSetting': {
          const setting = String(args.setting || 'flashlight').toLowerCase();
          const enable = args.enable !== undefined ? Boolean(args.enable) : true;
          let message = '';

          this.updatePhoneState((prev) => {
            if (setting.includes('flashlight')) {
              message = `Phone Flashlight turned ${enable ? 'ON' : 'OFF'}`;
              return { ...prev, flashlightOn: enable };
            } else if (setting.includes('silent') || setting.includes('ring') || setting.includes('sound')) {
              const profile = enable ? 'silent' : 'ring';
              message = `Phone sound profile changed to ${profile.toUpperCase()}`;
              return { ...prev, soundProfile: profile };
            } else if (setting.includes('find') || setting.includes('ringphone')) {
              message = enable ? 'Ringing phone at max volume via Find My Phone!' : 'Find My Phone alarm stopped.';
              return { ...prev, findMyPhoneActive: enable };
            } else if (setting.includes('battery') || setting.includes('saver')) {
              message = `Battery Saver turned ${enable ? 'ON' : 'OFF'}`;
              return { ...prev, batterySaverOn: enable };
            }
            return prev;
          });

          return { success: true, result: message || `Setting ${setting} updated.` };
        }

        case 'launchAppOnPhone': {
          const appName = String(args.appName || 'WhatsApp');
          this.updatePhoneState((prev) => ({
            ...prev,
            lastAppLaunched: appName,
          }));
          return { success: true, result: `Launched ${appName} on phone screen.` };
        }

        case 'getPhoneStatus': {
          const s = this.phoneState;
          const statusStr = `Phone: ${s.deviceName} | Battery: ${s.batteryLevel}% (${s.isCharging ? 'Charging' : 'Discharging'}) | Network: ${s.signalType} (${s.signalBars}/5 bars) | Sound: ${s.soundProfile.toUpperCase()} | Flashlight: ${s.flashlightOn ? 'ON' : 'OFF'} | Find My Phone: ${s.findMyPhoneActive ? 'ACTIVE' : 'IDLE'}`;
          return { success: true, result: statusStr };
        }


        default:
          return { success: false, error: `Tool ${name} is not recognized.` };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Execution error' };
    }
  }

  public static getStoredMemories(): MemoryItem[] {
    return [...this.memories];
  }

  public static addMemory(item: Omit<MemoryItem, 'id' | 'createdAt'>): MemoryItem {
    const newMem: MemoryItem = {
      ...item,
      id: 'mem_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      createdAt: Date.now(),
      synapseStrength: item.synapseStrength ?? 98,
    };
    this.memories.unshift(newMem);
    this.saveMemoriesToDisk();
    return newMem;
  }

  public static updateMemory(id: string, updates: Partial<MemoryItem>): boolean {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.memories[idx] = {
        ...this.memories[idx],
        ...updates,
        lastAccessedAt: Date.now(),
      };
      this.saveMemoriesToDisk();
      return true;
    }
    return false;
  }

  public static togglePin(id: string): boolean {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.memories[idx].pinned = !this.memories[idx].pinned;
      this.saveMemoriesToDisk();
      return this.memories[idx].pinned!;
    }
    return false;
  }

  public static deleteMemory(id: string) {
    this.memories = this.memories.filter((m) => m.id !== id);
    this.saveMemoriesToDisk();
  }

  public static clearAllMemories() {
    this.memories = [];
    this.saveMemoriesToDisk();
  }

  public static resetToSeedMemories() {
    this.seedInitialMemories();
  }

  public static getMemoryStats(): MemoryMatrixStats {
    const totalNodes = this.memories.length;
    const criticalNodes = this.memories.filter((m) => m.importance === 'critical').length;
    
    // Estimate total tokens
    const textContent = this.memories.map((m) => `${m.key} ${m.value}`).join(' ');
    const tokenCount = Math.round(textContent.length / 4) + totalNodes * 12;

    const categories: Record<string, number> = {};
    this.memories.forEach((m) => {
      categories[m.category] = (categories[m.category] || 0) + 1;
    });

    return {
      totalNodes,
      criticalNodes,
      synapseHealth: 99.8,
      tokenCount,
      categories,
    };
  }

  private static saveMemoriesToDisk() {
    try {
      localStorage.setItem('myraa_longterm_memory_v2', JSON.stringify(this.memories));
    } catch (e) {
      // ignore storage error
    }
  }
}
