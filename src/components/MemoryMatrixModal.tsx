import React, { useState, useMemo } from 'react';
import {
  Brain,
  Search,
  Plus,
  Pin,
  Trash2,
  RotateCcw,
  Download,
  X,
  Sparkles,
  ShieldAlert,
  UserCheck,
  Sliders,
  Bell,
  BookOpen,
  Cpu,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { MemoryItem, MemoryCategory, MemoryImportance, MemoryMatrixStats } from '../types';
import { ToolManager } from '../ai/ToolManager';

interface MemoryMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onMemoriesUpdated: () => void;
}

export const MemoryMatrixModal: React.FC<MemoryMatrixModalProps> = ({
  isOpen,
  onClose,
  memories,
  onMemoriesUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [isAddingNode, setIsAddingNode] = useState(false);

  // New Node Form State
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('knowledge');
  const [newImportance, setNewImportance] = useState<MemoryImportance>('high');
  const [newPinned, setNewPinned] = useState(false);

  const stats: MemoryMatrixStats = useMemo(() => {
    return ToolManager.getMemoryStats();
  }, [memories]);

  // Filtered Memories
  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      const matchSearch =
        mem.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || mem.category === selectedCategory;
      const matchImportance = selectedImportance === 'all' || mem.importance === selectedImportance;

      return matchSearch && matchCategory && matchImportance;
    });
  }, [memories, searchQuery, selectedCategory, selectedImportance]);

  if (!isOpen) return null;

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    ToolManager.addMemory({
      key: newKey.trim(),
      value: newValue.trim(),
      category: newCategory,
      importance: newImportance,
      pinned: newPinned,
      synapseStrength: 100,
      tags: [newCategory, newImportance],
    });

    setNewKey('');
    setNewValue('');
    setIsAddingNode(false);
    onMemoriesUpdated();
  };

  const handleTogglePin = (id: string) => {
    ToolManager.togglePin(id);
    onMemoriesUpdated();
  };

  const handleDelete = (id: string) => {
    ToolManager.deleteMemory(id);
    onMemoriesUpdated();
  };

  const handleResetSeeds = () => {
    if (confirm('Reset Neural Memory Matrix to default Max Level seeds?')) {
      ToolManager.resetToSeedMemories();
      onMemoriesUpdated();
    }
  };

  const handleClearAll = () => {
    if (confirm('⚠️ WARNING: Clear entire MYRAA Neural Memory Matrix? This cannot be undone.')) {
      ToolManager.clearAllMemories();
      onMemoriesUpdated();
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MYRAA_NEURAL_MEMORY_MATRIX_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'identity':
        return <UserCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'preference':
        return <Sliders className="w-3.5 h-3.5 text-orange-400" />;
      case 'reminder':
        return <Bell className="w-3.5 h-3.5 text-yellow-400" />;
      case 'knowledge':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      case 'system':
        return <Cpu className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0a0c14] border border-red-800/40 rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.15)] flex flex-col max-h-[90vh] overflow-hidden text-gray-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/40 bg-gradient-to-r from-red-950/40 via-gray-950 to-red-950/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/40 text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-extrabold tracking-wider text-red-400 uppercase">
                  NEURAL MEMORY MATRIX
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-950 border border-red-700/50 text-red-300">
                  MAX LEVEL v3.0
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                MYRAA AI Persistent Context & Long-Term Recall Cluster
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>SYNAPSED ({stats.synapseHealth}%)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-900/80 hover:bg-red-950 border border-gray-800 hover:border-red-700 text-gray-400 hover:text-red-300 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Neural Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-950/80 border-b border-red-950/60 text-xs">
          <div className="p-2.5 rounded bg-gray-900/50 border border-red-950 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 uppercase font-bold">TOTAL NODES</span>
            <span className="text-base font-extrabold text-red-400">{stats.totalNodes}</span>
          </div>
          <div className="p-2.5 rounded bg-gray-900/50 border border-red-950 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 uppercase font-bold">CRITICAL MEMORIES</span>
            <span className="text-base font-extrabold text-amber-400">{stats.criticalNodes}</span>
          </div>
          <div className="p-2.5 rounded bg-gray-900/50 border border-red-950 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 uppercase font-bold">CONTEXT TOKENS</span>
            <span className="text-base font-extrabold text-cyan-400">~{stats.tokenCount}</span>
          </div>
          <div className="p-2.5 rounded bg-gray-900/50 border border-red-950 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 uppercase font-bold">NEURAL EFFICIENCY</span>
            <span className="text-base font-extrabold text-emerald-400">100.0%</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 space-y-3 bg-gray-950/40 border-b border-gray-900">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search neural memory nodes by keyword, tag, or value..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-900/90 border border-red-950 focus:border-red-500 rounded text-gray-200 placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddingNode(!isAddingNode)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(255,0,0,0.3)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD MEMORY</span>
              </button>

              <button
                onClick={handleResetSeeds}
                title="Reset to default seeds"
                className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-gray-200 transition-all text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleExportJson}
                title="Export JSON"
                className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-gray-200 transition-all text-xs"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClearAll}
                title="Clear all memories"
                className="p-1.5 rounded bg-gray-900 hover:bg-red-950 border border-gray-800 hover:border-red-800 text-gray-400 hover:text-red-400 transition-all text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-gray-500 font-bold mr-1">CATEGORIES:</span>
            {['all', 'identity', 'preference', 'reminder', 'knowledge', 'system', 'custom'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full font-bold uppercase transition-all border ${
                  selectedCategory === cat
                    ? 'bg-red-950 border-red-500 text-red-300 shadow-[0_0_8px_rgba(255,0,0,0.2)]'
                    : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add Node Form Collapsible */}
        {isAddingNode && (
          <form onSubmit={handleAddNode} className="p-4 bg-red-950/20 border-b border-red-900/40 space-y-3">
            <div className="text-xs font-bold text-red-400 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INJECT NEW NEURAL MEMORY NODE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                  Node Key / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Favorite Language"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-950 border border-red-950 focus:border-red-500 rounded text-gray-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
                  Node Content / Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hindi and Hinglish"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-950 border border-red-950 focus:border-red-500 rounded text-gray-200 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                  className="px-2 py-1 bg-gray-950 border border-red-950 rounded text-gray-200 text-xs focus:outline-none"
                >
                  <option value="identity">Identity</option>
                  <option value="preference">Preference</option>
                  <option value="reminder">Reminder</option>
                  <option value="knowledge">Knowledge</option>
                  <option value="system">System</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Importance</label>
                <select
                  value={newImportance}
                  onChange={(e) => setNewImportance(e.target.value as MemoryImportance)}
                  className="px-2 py-1 bg-gray-950 border border-red-950 rounded text-gray-200 text-xs focus:outline-none"
                >
                  <option value="critical">Critical (Max Priority)</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="newPinned"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded accent-red-600"
                />
                <label htmlFor="newPinned" className="text-xs text-gray-300 font-bold cursor-pointer">
                  Pin Node
                </label>
              </div>

              <div className="flex items-center space-x-2 ml-auto pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingNode(false)}
                  className="px-3 py-1 rounded bg-gray-900 text-gray-400 hover:text-gray-200 text-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                >
                  SAVE NODE
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Memory Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[50vh]">
          {filteredMemories.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <Brain className="w-8 h-8 mx-auto text-gray-700" />
              <p className="text-xs">No matching neural memory nodes found.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedImportance('all');
                }}
                className="text-[11px] text-red-400 hover:underline"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            filteredMemories.map((mem) => {
              const isCritical = mem.importance === 'critical';
              const isHigh = mem.importance === 'high';

              return (
                <div
                  key={mem.id}
                  className={`relative p-3.5 rounded-lg border transition-all ${
                    isCritical
                      ? 'bg-red-950/20 border-red-800/60 shadow-[0_0_15px_rgba(255,0,0,0.08)]'
                      : isHigh
                      ? 'bg-amber-950/10 border-amber-900/40'
                      : 'bg-gray-900/40 border-gray-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Top Badges */}
                      <div className="flex items-center space-x-2 text-[10px]">
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-gray-950 border border-gray-800 font-bold uppercase text-gray-300">
                          {getCategoryIcon(mem.category)}
                          <span>{mem.category}</span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded font-extrabold uppercase border ${
                            isCritical
                              ? 'bg-red-950 border-red-600 text-red-400'
                              : isHigh
                              ? 'bg-amber-950 border-amber-600 text-amber-400'
                              : 'bg-gray-900 border-gray-700 text-gray-400'
                          }`}
                        >
                          {mem.importance}
                        </span>

                        {mem.synapseStrength && (
                          <span className="text-gray-500 font-semibold">
                            Synapse: {mem.synapseStrength}%
                          </span>
                        )}
                      </div>

                      {/* Key & Value */}
                      <div>
                        <div className="font-extrabold text-xs text-gray-200">{mem.key}</div>
                        <div className="text-xs text-red-200/90 font-medium mt-0.5">{mem.value}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleTogglePin(mem.id)}
                        className={`p-1.5 rounded transition-all ${
                          mem.pinned
                            ? 'text-red-400 bg-red-950/60 border border-red-800/60'
                            : 'text-gray-600 hover:text-gray-300'
                        }`}
                        title={mem.pinned ? 'Unpin Memory' : 'Pin Memory'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-950/40 transition-all"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-red-900/30 bg-gray-950 text-[10px] text-gray-400">
          <span>Active Context: Automatic Injection Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 font-bold transition-all"
          >
            CLOSE MATRIX
          </button>
        </div>
      </div>
    </div>
  );
};
