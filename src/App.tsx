import React, { useState } from 'react';
import { useMyraaState } from './state/StateManager';
import { HUD } from './components/HUD';
import { MyraaCore } from './components/MyraaCore';
import { MicrophoneButton } from './components/MicrophoneButton';
import { LeftPanels } from './components/LeftPanels';
import { RightPanels } from './components/RightPanels';
import { TextFallbackDrawer } from './components/TextFallbackDrawer';
import { MemoryMatrixModal } from './components/MemoryMatrixModal';
import { PhoneControlModal } from './components/PhoneControlModal';
import { GirlfriendModeModal } from './components/GirlfriendModeModal';
import { AndroidExportModal } from './components/AndroidExportModal';
import { ToolManager } from './ai/ToolManager';

export default function App() {
  const {
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
  } = useMyraaState();

  const [isTextDrawerOpen, setIsTextDrawerOpen] = useState(false);
  const [isMemoryMatrixOpen, setIsMemoryMatrixOpen] = useState(false);
  const [isPhoneControlOpen, setIsPhoneControlOpen] = useState(false);
  const [isGirlfriendModeOpen, setIsGirlfriendModeOpen] = useState(false);
  const [isAndroidExportOpen, setIsAndroidExportOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'core' | 'left' | 'right'>('core');

  const handleQuickTool = async (toolName: string, args: any) => {
    const res = await ToolManager.execute(toolName, args);
    refreshMemories();
    sendTextMessage(`[User triggered ${toolName}]`);
  };

  return (
    <div className="min-h-screen bg-[#04050a] text-gray-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200 overflow-x-hidden relative">
      {/* Sci-Fi Ambient Red/Pink Grid Background Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#3a080d0f_1px,transparent_1px),linear-gradient(to_bottom,#3a080d0f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Ambient Red/Pink Glow in Background */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${
          girlfriendSettings.enabled ? 'bg-pink-950/25' : 'bg-red-950/20'
        } blur-[140px] rounded-full pointer-events-none transition-all duration-700`}
      />

      {/* Top HUD Header */}
      <HUD
        state={assistantState}
        uptimeSeconds={systemStatus.uptimeSeconds}
        memoryCount={memories.length}
        onToggleTextDrawer={() => setIsTextDrawerOpen(!isTextDrawerOpen)}
        onOpenMemoryMatrix={() => setIsMemoryMatrixOpen(true)}
        onOpenPhoneControl={() => setIsPhoneControlOpen(true)}
        onOpenGirlfriendMode={() => setIsGirlfriendModeOpen(true)}
        onOpenAndroidExport={() => setIsAndroidExportOpen(true)}
        onResetSession={stopSession}
      />

      {/* Mobile Tab Selector */}
      <div className="flex sm:hidden border-b border-red-900/30 bg-[#090b12] text-xs font-mono font-bold z-20">
        <button
          onClick={() => setMobileTab('core')}
          className={`flex-1 py-2 text-center ${
            mobileTab === 'core' ? 'text-red-400 border-b-2 border-red-500 bg-red-950/30' : 'text-gray-400'
          }`}
        >
          CORE
        </button>
        <button
          onClick={() => setMobileTab('left')}
          className={`flex-1 py-2 text-center ${
            mobileTab === 'left' ? 'text-red-400 border-b-2 border-red-500 bg-red-950/30' : 'text-gray-400'
          }`}
        >
          SYSTEM
        </button>
        <button
          onClick={() => setMobileTab('right')}
          className={`flex-1 py-2 text-center ${
            mobileTab === 'right' ? 'text-red-400 border-b-2 border-red-500 bg-red-950/30' : 'text-gray-400'
          }`}
        >
          STATUS & TOOLS
        </button>
      </div>

      {/* Main Grid Container Layout */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center z-10 my-auto">
        {/* LEFT COLUMN: System Status, Girlfriend Widget, Voice Input, Session Info, Activity Log */}
        <div className={`lg:col-span-3 ${mobileTab === 'left' ? 'block' : 'hidden lg:block'}`}>
          <LeftPanels
            state={assistantState}
            audioMetrics={audioMetrics}
            systemStatus={systemStatus}
            messages={messages}
            memories={memories}
            girlfriendSettings={girlfriendSettings}
            onOpenMemoryMatrix={() => setIsMemoryMatrixOpen(true)}
            onOpenGirlfriendMode={() => setIsGirlfriendModeOpen(true)}
            onSendGift={sendVirtualGift}
            onGiveHeadpat={giveHeadpat}
          />
        </div>

        {/* CENTER COLUMN: Concentric AI Core, Anime Girl Avatar & Floating Microphone Dock */}
        <div className={`lg:col-span-6 flex flex-col items-center justify-center space-y-2 ${mobileTab === 'core' ? 'block' : 'hidden lg:flex'}`}>
          {/* Central Concentric Circular Red Core with Anime Avatar */}
          <MyraaCore
            state={assistantState}
            inputLevel={audioMetrics.inputLevel}
            outputLevel={audioMetrics.outputLevel}
            isGirlfriendMode={girlfriendSettings.enabled}
            girlfriendTitle={girlfriendSettings.relationshipTitle}
          />

          {/* Floating Bottom Voice Control Capsule Dock Bar */}
          <MicrophoneButton
            state={assistantState}
            audioLevel={assistantState === 'speaking' ? audioMetrics.outputLevel : audioMetrics.inputLevel}
            onStart={startSession}
            onStop={stopSession}
            onInterrupt={handleInterruption}
          />
        </div>

        {/* RIGHT COLUMN: AI Status, Quick Tools, Current Task, Audio Output Equalizer */}
        <div className={`lg:col-span-3 ${mobileTab === 'right' ? 'block' : 'hidden lg:block'}`}>
          <RightPanels
            state={assistantState}
            languageMode={languageMode}
            setLanguageMode={setLanguageMode}
            audioMetrics={audioMetrics}
            onQuickToolExecute={handleQuickTool}
            onOpenPhoneControl={() => setIsPhoneControlOpen(true)}
          />
        </div>
      </main>

      {/* Bottom Text Command Input Drawer */}
      <TextFallbackDrawer
        isOpen={isTextDrawerOpen}
        onClose={() => setIsTextDrawerOpen(false)}
        onSendText={sendTextMessage}
      />

      {/* Max Level Neural Memory Matrix Modal */}
      <MemoryMatrixModal
        isOpen={isMemoryMatrixOpen}
        onClose={() => setIsMemoryMatrixOpen(false)}
        memories={memories}
        onMemoriesUpdated={refreshMemories}
      />

      {/* Smartphone Remote Control Hub Modal */}
      <PhoneControlModal
        isOpen={isPhoneControlOpen}
        onClose={() => setIsPhoneControlOpen(false)}
      />

      {/* Girlfriend Companion Mode Modal */}
      <GirlfriendModeModal
        isOpen={isGirlfriendModeOpen}
        onClose={() => setIsGirlfriendModeOpen(false)}
        settings={girlfriendSettings}
        onUpdateSettings={updateGirlfriendSettings}
        onSendGift={sendVirtualGift}
        onGiveHeadpat={giveHeadpat}
        onAddRomanticMemory={addRomanticMemory}
      />

      {/* Android App Studio Export Modal */}
      <AndroidExportModal
        isOpen={isAndroidExportOpen}
        onClose={() => setIsAndroidExportOpen(false)}
      />
    </div>
  );
}



