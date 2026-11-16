'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Share2,
  Plus,
  X,
  Star,
  ExternalLink,
  BookOpen,
  Search,
  Lock,
} from 'lucide-react';
import { playSound } from '../useSound';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export function SafariApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'Apple',
      url: 'https://www.apple.com',
      favicon: '🍎',
    },
    {
      id: 'tab-2',
      title: 'StorageHub Command Center',
      url: '/admin',
      favicon: '📦',
    },
    {
      id: 'tab-3',
      title: 'GitHub — puruvj/macos-web',
      url: 'https://github.com/puruvj/macos-web',
      favicon: '🐙',
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [urlInput, setUrlInput] = useState<string>('https://www.apple.com');
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.apple.com');
  const [showStartPage, setShowStartPage] = useState<boolean>(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleNavigate = (url: string) => {
    playSound.tink();
    let formatted = url.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://') && !formatted.startsWith('/')) {
      if (formatted.includes('.') && !formatted.includes(' ')) {
        formatted = 'https://' + formatted;
      } else {
        formatted = `https://duckduckgo.com/?q=${encodeURIComponent(formatted)}`;
      }
    }
    setUrlInput(formatted);
    setCurrentUrl(formatted);
    setShowStartPage(false);

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: formatted, title: formatted.replace('https://', '').replace('www.', '').split('/')[0] }
          : t
      )
    );
  };

  const addTab = () => {
    playSound.tink();
    const id = 'tab-' + Date.now();
    const newTab: Tab = {
      id,
      title: 'Start Page',
      url: '',
      favicon: '🧭',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
    setUrlInput('');
    setShowStartPage(true);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound.tink();
    if (tabs.length === 1) {
      setShowStartPage(true);
      return;
    }
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
      setUrlInput(remaining[0].url);
      setCurrentUrl(remaining[0].url);
    }
  };

  const favorites = [
    { name: 'Apple', url: 'https://www.apple.com', icon: '🍎', color: 'bg-black text-white' },
    { name: 'StorageHub', url: '/admin', icon: '📦', color: 'bg-blue-600 text-white' },
    { name: 'GitHub', url: 'https://github.com', icon: '🐙', color: 'bg-gray-900 text-white' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'Y', color: 'bg-amber-600 text-white' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org', icon: 'W', color: 'bg-gray-100 text-gray-800' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆', color: 'bg-orange-500 text-white' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f4f4f7] dark:bg-[#1a1a22] text-[#1d1d1f] dark:text-white select-none">
      {/* Safari Window Header Bar */}
      <div className="px-3 pt-2 bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10 backdrop-blur-md">
        {/* Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setUrlInput(tab.url);
                  setCurrentUrl(tab.url);
                  setShowStartPage(!tab.url);
                  playSound.tink();
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer text-xs font-medium max-w-[200px] transition border ${
                  isActive
                    ? 'bg-white dark:bg-white/15 border-black/10 dark:border-white/10 shadow-xs text-black dark:text-white'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-black/60 dark:text-white/60'
                }`}
              >
                <span>{tab.favicon || '🌐'}</span>
                <span className="truncate flex-1">{tab.title || 'Start Page'}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/20 p-0.5 rounded transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          <button
            onClick={addTab}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition text-black/60 dark:text-white/60 ml-1"
            title="New Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation & Address Bar */}
        <div className="flex items-center gap-2 pb-2">
          {/* Back / Forward */}
          <div className="flex items-center gap-0.5 text-black/60 dark:text-white/60">
            <button className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Central Omnibox */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavigate(urlInput);
            }}
            className="flex-1 max-w-xl mx-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-inner"
          >
            <Lock className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter website name"
              className="w-full bg-transparent text-xs outline-hidden text-center focus:text-left selection:bg-blue-500"
            />
            <button
              type="button"
              onClick={() => handleNavigate(urlInput)}
              className="p-0.5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Share & Sidebar */}
          <div className="flex items-center gap-1 text-black/60 dark:text-white/60">
            <button
              onClick={() => setShowStartPage(!showStartPage)}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
              title="Toggle Start Page"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Browser Viewport */}
      <div className="flex-1 bg-white dark:bg-[#121218] overflow-hidden flex flex-col relative">
        {showStartPage || !currentUrl ? (
          /* Apple Safari Start Page */
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
            {/* Favorites Grid */}
            <div>
              <div className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-4">
                Favorites
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.name}
                    onClick={() => handleNavigate(fav.url)}
                    className="flex flex-col items-center p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${fav.color} flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-105 transition duration-200 mb-2`}
                    >
                      {fav.icon}
                    </div>
                    <span className="text-xs font-medium text-black/80 dark:text-white/80">{fav.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Report */}
            <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-black/90 dark:text-white/90">Privacy Report</div>
                <div className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                  In the last 30 days, Safari Intelligent Tracking Prevention prevented 48 trackers from profiling you.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Web Frame */
          <div className="flex-1 flex flex-col h-full bg-white relative">
            <iframe
              src={currentUrl}
              className="w-full h-full border-none"
              title="Safari Viewport"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}
      </div>
    </div>
  );
}
