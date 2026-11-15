'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Clipboard,
  Search,
  Code,
  FileText,
  Link as LinkIcon,
  Copy,
  Check,
  Star,
  Pin,
  Trash2,
  Bot,
  Languages,
  BookOpen,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';
import { ClipItem } from '../types';
import { playSound } from '../useSound';

export function ClipMindApp() {
  const initialClips: ClipItem[] = [
    {
      id: 'clip-1',
      content:
        'const response = await fetch("/api/resources");\nconst data = await response.json();\nconsole.log("StorageHub resources loaded:", data);',
      type: 'code',
      language: 'typescript',
      timestamp: '2 mins ago',
      isPinned: true,
      isFavorite: true,
      charCount: 122,
    },
    {
      id: 'clip-2',
      content:
        'StorageHub is an enterprise-grade digital resource command center with an Apple macOS aesthetic, Raycast command palette, and Dropbox file management.',
      type: 'text',
      timestamp: '15 mins ago',
      isPinned: true,
      isFavorite: false,
      charCount: 154,
    },
    {
      id: 'clip-3',
      content: 'https://github.com/puruvj/macos-web',
      type: 'link',
      timestamp: '1 hour ago',
      isPinned: false,
      isFavorite: true,
      charCount: 36,
    },
    {
      id: 'clip-4',
      content:
        'Hey team, please review the latest pull request on the window management animation and CleanShot X annotation canvas when you have a moment.',
      type: 'text',
      timestamp: '3 hours ago',
      isPinned: false,
      isFavorite: false,
      charCount: 139,
    },
    {
      id: 'clip-5',
      content:
        'export function calculateFisheyeScale(mouseDistance: number, maxRadius: number = 180): number {\n  if (mouseDistance > maxRadius) return 1.0;\n  return 1.0 + 0.45 * Math.cos((mouseDistance / maxRadius) * (Math.PI / 2));\n}',
      type: 'code',
      language: 'typescript',
      timestamp: 'Yesterday',
      isPinned: false,
      isFavorite: true,
      charCount: 204,
    },
  ];

  const [clips, setClips] = useState<ClipItem[]>(initialClips);
  const [selectedClip, setSelectedClip] = useState<ClipItem>(initialClips[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'code' | 'text' | 'link'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAiAction, setActiveAiAction] = useState<string | null>(null);

  // Filter clips
  const filteredClips = clips.filter((c) => {
    if (activeFilter !== 'all' && c.type !== activeFilter) return false;
    if (searchQuery && !c.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCopy = (clip: ClipItem) => {
    playSound.tink();
    navigator.clipboard.writeText(clip.content).catch(() => {});
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePin = (id: string) => {
    playSound.tink();
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)));
  };

  const toggleFavorite = (id: string) => {
    playSound.tink();
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)));
  };

  const deleteClip = (id: string) => {
    playSound.trash();
    setClips((prev) => prev.filter((c) => c.id !== id));
    if (selectedClip.id === id) {
      setSelectedClip(clips.find((c) => c.id !== id) || initialClips[0]);
    }
  };

  // AI Quick Actions
  const runAiAction = (action: string) => {
    playSound.tink();
    setActiveAiAction(action);
    setIsGenerating(true);
    setAiResponse('');

    let fullText = '';
    if (action === 'summarize') {
      fullText = `Summary:\n• Content focuses on: ${selectedClip.content.slice(0, 50)}...\n• Key takeaways: Efficient execution, production-grade quality, and streamlined data flow.\n• Word count reduced by 72% for fast executive review.`;
    } else if (action === 'explain') {
      fullText = `Code Analysis:\n• Language: ${selectedClip.language || 'JavaScript/TypeScript'}\n• Mechanics: Executes asynchronous operations using Modern ES6+ syntax with error boundaries.\n• Time Complexity: O(1) constant time overhead.\n• Recommendation: Add a try/catch boundary for graceful offline fallback.`;
    } else if (action === 'grammar') {
      fullText = `Polished & Professional Rewrite:\n\n"${selectedClip.content
        .replace(/hey team,/i, 'Hello team,')
        .replace(/when you have a moment/i, 'at your earliest convenience')}"\n\n✓ Tone: Executive, concise, and courteous.\n✓ Readability Score: Grade 9 (Optimal clarity).`;
    } else if (action === 'translate') {
      fullText = `Translations:\n• Spanish: "StorageHub es un centro de comando de recursos digitales de nivel empresarial con estética macOS."\n• French: "StorageHub est un centre de commande de ressources numériques de niveau entreprise."\n• Japanese: "StorageHubは、macOSの美学を備えたエンタープライズグレードのデジタルリソースコマンドセンターです。"`;
    } else if (action === 'reply') {
      fullText = `Suggested Smart Response:\n\n"Thank you for sharing this update! I've reviewed the snippet and it aligns perfectly with our architecture goals. Ready for deployment whenever you are."`;
    } else {
      fullText = `ClipMind AI Analysis for ${selectedClip.type}:\n• Optimal utility detected.\n• Content validated with 0 syntax warnings.\n• Ready to paste or export.`;
    }

    // Stream response
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setAiResponse(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 25);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] dark:bg-[#1a1b22] text-[#1d1d1f] dark:text-white select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/80 dark:bg-black/30 border-b border-black/5 dark:border-white/10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center p-1 shadow">
            <img src="/app-icons/clipmind/128.webp" alt="ClipMind AI" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold flex items-center gap-1.5">
              <span>ClipMind AI</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold">
                Intelligence
              </span>
            </div>
            <div className="text-[10px] text-black/50 dark:text-white/50">Smart Clipboard History &amp; AI Copilot</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-lg border border-black/5 dark:border-white/10 text-xs">
          {(['all', 'code', 'text', 'link'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                activeFilter === filter
                  ? 'bg-white dark:bg-white/20 text-purple-600 dark:text-white shadow-xs'
                  : 'text-black/60 dark:text-white/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: History Left + Inspector Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left History Panel */}
        <div className="w-72 bg-white/50 dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 flex flex-col shrink-0">
          {/* Search Bar */}
          <div className="p-2.5 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10">
              <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0" />
              <input
                type="text"
                placeholder="Search clipboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs outline-hidden placeholder:text-black/40 dark:placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Clips List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredClips.map((clip) => {
              const isSelected = selectedClip.id === clip.id;
              return (
                <div
                  key={clip.id}
                  onClick={() => {
                    setSelectedClip(clip);
                    setAiResponse('');
                    setActiveAiAction(null);
                    playSound.tink();
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition flex flex-col gap-1.5 border ${
                    isSelected
                      ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/40 shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-black/50 dark:text-white/50">
                      {clip.type === 'code' ? (
                        <Code className="w-3 h-3 text-blue-500" />
                      ) : clip.type === 'link' ? (
                        <LinkIcon className="w-3 h-3 text-cyan-500" />
                      ) : (
                        <FileText className="w-3 h-3 text-amber-500" />
                      )}
                      <span className="uppercase">{clip.language || clip.type}</span>
                      <span>·</span>
                      <span>{clip.timestamp}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {clip.isPinned && <Pin className="w-3 h-3 text-amber-500" />}
                      {clip.isFavorite && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                    </div>
                  </div>

                  <div className="text-xs font-mono line-clamp-2 text-black/80 dark:text-white/90 break-all">
                    {clip.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector & AI Workspace */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#15161c] overflow-hidden">
          {/* Clip Header Toolbar */}
          <div className="p-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-black/80 dark:text-white/90">
                {selectedClip.type === 'code' ? 'Code Snippet' : selectedClip.type === 'link' ? 'Web URL' : 'Text Entry'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50">
                {selectedClip.charCount} characters
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => togglePin(selectedClip.id)}
                className={`p-1.5 rounded-lg border transition ${
                  selectedClip.isPinned
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 border-transparent text-black/50 dark:text-white/50'
                }`}
                title="Pin item"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleFavorite(selectedClip.id)}
                className={`p-1.5 rounded-lg border transition ${
                  selectedClip.isFavorite
                    ? 'bg-yellow-400/15 border-yellow-400/30 text-yellow-500'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 border-transparent text-black/50 dark:text-white/50'
                }`}
                title="Favorite"
              >
                <Star className={`w-3.5 h-3.5 ${selectedClip.isFavorite ? 'fill-yellow-500' : ''}`} />
              </button>
              <button
                onClick={() => handleCopy(selectedClip)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white transition active:scale-95 shadow-sm"
              >
                {copiedId === selectedClip.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedClip.id ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => deleteClip(selectedClip.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Raw Content View */}
          <div className="p-4 border-b border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
            <pre className="text-xs font-mono p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10 max-h-40 overflow-y-auto whitespace-pre-wrap break-all text-black/80 dark:text-white/90">
              {selectedClip.content}
            </pre>
          </div>

          {/* AI Quick Actions Bar */}
          <div className="p-3 border-b border-black/5 dark:border-white/10 bg-purple-500/[0.04] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Actions:</span>
            </span>

            <button
              onClick={() => runAiAction('summarize')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/10 hover:bg-purple-500/10 border border-black/5 dark:border-white/10 text-black/80 dark:text-white/90 transition shrink-0"
            >
              🧠 Summarize
            </button>
            <button
              onClick={() => runAiAction('explain')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/10 hover:bg-purple-500/10 border border-black/5 dark:border-white/10 text-black/80 dark:text-white/90 transition shrink-0"
            >
              🔍 Explain Code
            </button>
            <button
              onClick={() => runAiAction('grammar')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/10 hover:bg-purple-500/10 border border-black/5 dark:border-white/10 text-black/80 dark:text-white/90 transition shrink-0"
            >
              ✍️ Polish &amp; Grammar
            </button>
            <button
              onClick={() => runAiAction('translate')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/10 hover:bg-purple-500/10 border border-black/5 dark:border-white/10 text-black/80 dark:text-white/90 transition shrink-0"
            >
              🌐 Translate
            </button>
            <button
              onClick={() => runAiAction('reply')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/10 hover:bg-purple-500/10 border border-black/5 dark:border-white/10 text-black/80 dark:text-white/90 transition shrink-0"
            >
              ⚡ Smart Reply
            </button>
          </div>

          {/* AI Response Output Pane */}
          <div className="flex-1 p-4 overflow-y-auto">
            {aiResponse ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-500/20 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    <span>ClipMind AI Response</span>
                    {isGenerating && <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />}
                  </div>
                  <button
                    onClick={() => {
                      playSound.tink();
                      navigator.clipboard.writeText(aiResponse);
                    }}
                    className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Response</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-black/80 dark:text-white/90 whitespace-pre-wrap leading-relaxed">
                  {aiResponse}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-black/40 dark:text-white/40 p-6">
                <Sparkles className="w-8 h-8 mb-2 text-purple-400 opacity-40 animate-pulse" />
                <div className="text-xs font-medium">Select an AI action above or ask ClipMind AI</div>
                <div className="text-[11px] mt-1 text-black/30 dark:text-white/30">
                  Instant synthesis, translation, code explanations, and tone refactoring
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
