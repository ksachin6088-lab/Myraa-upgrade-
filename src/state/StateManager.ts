import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AssistantState,
  PersonalityMode,
  LanguageMode,
  MessageItem,
  AudioMetrics,
  SystemStatus,
  MemoryItem,
  GirlfriendSettings,
} from '../types';
import { AudioStreamer } from '../audio/AudioStreamer';
import { AudioPlayer } from '../audio/AudioPlayer';
import { LiveSession } from '../ai/LiveSession';
import { ConversationManager } from '../ai/ConversationManager';
import { ToolManager } from '../ai/ToolManager';

const DEFAULT_GF_SETTINGS: GirlfriendSettings = {
  enabled: true,
  relationshipStyle: 'caring',
  affectionScore: 92,
  relationshipTitle: 'Eternal Soulmate',
  userName: 'Sachin',
  myraaNickname: 'Myraa',
  giftsSentCount: 3,
  hugsCount: 12,
  lastAffectionActivity: 'MYRAA smiled when you gave her headpats',
};

export function useMyraaState() {
  const [assistantState, setAssistantState] = useState<AssistantState>('disconnected');
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>('girlfriend');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('auto');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [girlfriendSettings, setGirlfriendSettings] = useState<GirlfriendSettings>(() => {
    try {
      const saved = localStorage.getItem('myraa_gf_settings');
      return saved ? JSON.parse(saved) : DEFAULT_GF_SETTINGS;
    } catch {
      return DEFAULT_GF_SETTINGS;
    }
  });

  const [audioMetrics, setAudioMetrics] = useState<AudioMetrics>({
    inputLevel: 0,
    outputLevel: 0,
    sampleRate: 16000,
    bitrateKbps: 256,
    latencyMs: 42,
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    connected: false,
    mode: 'disconnected',
    activeLanguage: 'Auto (Hi/En)',
    activeModel: 'gemini-3.1-flash-live',
    memoryCount: 0,
    uptimeSeconds: 0,
  });

  // Save GF Settings to local storage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('myraa_gf_settings', JSON.stringify(girlfriendSettings));
    } catch (e) {
      console.warn('Failed to persist GF settings');
    }
  }, [girlfriendSettings]);

  const conversationManagerRef = useRef<ConversationManager | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const liveSessionRef = useRef<LiveSession | null>(null);
  const uptimeTimerRef = useRef<any>(null);

  // Initialize modules
  useEffect(() => {
    conversationManagerRef.current = new ConversationManager((updatedMsgs) => {
      setMessages(updatedMsgs);
    });

    audioPlayerRef.current = new AudioPlayer((isPlaying) => {
      if (isPlaying) {
        setAssistantState('speaking');
      } else {
        setAssistantState((prev) => (prev === 'speaking' ? 'listening' : prev));
      }
    });

    setMemories(ToolManager.getStoredMemories());

    // System uptime counter
    const startTime = Date.now();
    uptimeTimerRef.current = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
        memoryCount: ToolManager.getStoredMemories().length,
      }));
    }, 1000);

    return () => {
      if (uptimeTimerRef.current) clearInterval(uptimeTimerRef.current);
      audioStreamerRef.current?.stop();
      audioPlayerRef.current?.close();
      liveSessionRef.current?.disconnect();
    };
  }, []);

  // Sync state changes with SystemStatus
  useEffect(() => {
    setSystemStatus((prev) => ({
      ...prev,
      connected: assistantState !== 'disconnected' && assistantState !== 'error',
      mode: assistantState,
      activeLanguage: languageMode === 'auto' ? 'Auto (Hi/En)' : languageMode,
    }));
  }, [assistantState, languageMode]);

  // Audio meters animation loop
  useEffect(() => {
    let animId: number;
    const updateMeters = () => {
      const inputVol = audioStreamerRef.current?.getVolume() || 0;
      const outputVol = audioPlayerRef.current?.getVolume() || 0;
      setAudioMetrics((prev) => ({
        ...prev,
        inputLevel: inputVol,
        outputLevel: outputVol,
      }));
      animId = requestAnimationFrame(updateMeters);
    };
    animId = requestAnimationFrame(updateMeters);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Interruption handler
  const handleInterruption = useCallback(() => {
    audioPlayerRef.current?.stop();
    liveSessionRef.current?.sendInterruptionSignal();
    setAssistantState('listening');
  }, []);

  // Start voice session
  const startSession = useCallback(async () => {
    if (assistantState !== 'disconnected' && assistantState !== 'error') {
      return;
    }

    setAssistantState('connecting');

    // Setup LiveSession
    const liveSession = new LiveSession({
      onStateChange: (state) => setAssistantState(state),
      onAudioReceived: (base64Audio) => {
        audioPlayerRef.current?.playChunk(base64Audio);
      },
      onTranscriptReceived: (sender, text) => {
        if (sender === 'myraa') {
          conversationManagerRef.current?.updateLastAssistantMessage(text);
        } else {
          conversationManagerRef.current?.addMessage('user', text);
        }
      },
      onInterrupted: () => handleInterruption(),
      onToolExecuted: (toolName, args, result) => {
        setSystemStatus((prev) => ({ ...prev, lastToolExecuted: toolName }));
        setMemories(ToolManager.getStoredMemories());
        conversationManagerRef.current?.addMessage('system', `Executed tool: ${toolName}`, [
          { id: 'tool_' + Date.now(), name: toolName, args, result, status: 'completed' },
        ]);
      },
      onError: (errText) => {
        conversationManagerRef.current?.addMessage('system', `System notice: ${errText}`);
      },
    });

    liveSessionRef.current = liveSession;
    await liveSession.connect(personalityMode, languageMode);

    // Setup AudioStreamer (Microphone)
    const streamer = new AudioStreamer({
      onAudioData: (base64Chunk) => {
        liveSessionRef.current?.sendAudioChunk(base64Chunk);
      },
      onInterruptionTriggered: () => handleInterruption(),
      onError: (err) => {
        conversationManagerRef.current?.addMessage('system', `Microphone notice: ${err.message}`);
      },
    });

    audioStreamerRef.current = streamer;
    const micStarted = await streamer.start();

    if (!micStarted) {
      conversationManagerRef.current?.addMessage(
        'system',
        'Microphone access was denied or unavailable. Voice input is paused. You can still send text commands below.'
      );
    } else {
      conversationManagerRef.current?.addMessage(
        'system',
        'MYRAA voice link active. Speak anytime or interrupt when MYRAA is speaking.'
      );
    }
  }, [assistantState, personalityMode, languageMode, handleInterruption]);

  // Stop voice session
  const stopSession = useCallback(() => {
    audioStreamerRef.current?.stop();
    audioPlayerRef.current?.stop();
    liveSessionRef.current?.disconnect();
    setAssistantState('disconnected');
    conversationManagerRef.current?.addMessage('system', 'MYRAA voice session ended.');
  }, []);

  // Send text message
  const sendTextMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      conversationManagerRef.current?.addMessage('user', text);

      if (!liveSessionRef.current || !liveSessionRef.current.isSessionActive()) {
        // Auto connect or REST fallback
        const session = new LiveSession({
          onStateChange: (state) => setAssistantState(state),
          onAudioReceived: (base64) => audioPlayerRef.current?.playChunk(base64),
          onTranscriptReceived: (sender, msg) => {
            if (sender === 'myraa') {
              conversationManagerRef.current?.updateLastAssistantMessage(msg);
            }
          },
          onInterrupted: () => handleInterruption(),
          onToolExecuted: (name, args, result) => {
            setSystemStatus((prev) => ({ ...prev, lastToolExecuted: name }));
            setMemories(ToolManager.getStoredMemories());
          },
          onError: (err) => conversationManagerRef.current?.addMessage('system', err),
        });
        liveSessionRef.current = session;
      }

      await liveSessionRef.current.sendTextMessage(text);
    },
    [handleInterruption]
  );

  const deleteMemory = useCallback((id: string) => {
    ToolManager.deleteMemory(id);
    setMemories(ToolManager.getStoredMemories());
  }, []);

  const refreshMemories = useCallback(() => {
    setMemories(ToolManager.getStoredMemories());
  }, []);

  const updateGirlfriendSettings = useCallback((updated: Partial<GirlfriendSettings>) => {
    setGirlfriendSettings((prev) => ({ ...prev, ...updated }));
  }, []);

  const sendVirtualGift = useCallback((giftName: string) => {
    setGirlfriendSettings((prev) => {
      const newScore = Math.min(100, prev.affectionScore + 8);
      const newGiftsCount = (prev.giftsSentCount || 0) + 1;
      return {
        ...prev,
        affectionScore: newScore,
        giftsSentCount: newGiftsCount,
        lastAffectionActivity: `Sent MYRAA a gift: ${giftName} (+8 Affection)`,
      };
    });
  }, []);

  const giveHeadpat = useCallback(() => {
    setGirlfriendSettings((prev) => {
      const newScore = Math.min(100, prev.affectionScore + 5);
      const newHugsCount = (prev.hugsCount || 0) + 1;
      return {
        ...prev,
        affectionScore: newScore,
        hugsCount: newHugsCount,
        lastAffectionActivity: `Gave MYRAA a gentle headpat (+5 Affection)`,
      };
    });
  }, []);

  const addRomanticMemory = useCallback((note: string) => {
    ToolManager.addMemory({
      key: `Romantic Note / Memory`,
      value: note,
      category: 'preference',
      importance: 'high',
      synapseStrength: 99,
      pinned: true,
      tags: ['romantic', 'girlfriend', 'memory'],
    });
    setMemories(ToolManager.getStoredMemories());
    setGirlfriendSettings((prev) => ({
      ...prev,
      lastAffectionActivity: `Saved special romantic memory to Neural Matrix`,
    }));
  }, []);

  return {
    assistantState,
    personalityMode,
    setPersonalityMode,
    languageMode,
    setLanguageMode,
    messages,
    memories,
    girlfriendSettings,
    updateGirlfriendSettings,
    sendVirtualGift,
    giveHeadpat,
    addRomanticMemory,
    audioMetrics,
    systemStatus,
    startSession,
    stopSession,
    sendTextMessage,
    handleInterruption,
    deleteMemory,
    refreshMemories,
    audioStreamer: audioStreamerRef.current,
    audioPlayer: audioPlayerRef.current,
  };
}
