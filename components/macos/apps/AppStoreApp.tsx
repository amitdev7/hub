'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Gamepad2,
  Brush,
  Code,
  Layers,
  Search,
  Download,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react';
import { AppID } from '../types';
import { playSound } from '../useSound';

interface AppStoreAppProps {
  onOpenApp?: (appId: AppID) => void;
}

export function AppStoreApp({ onOpenApp }: AppStoreAppProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Discover');

  const apps = [
    {
      id: 'cleanshot' as AppID,
      title: 'CleanShot X',
      subtitle: 'The Ultimate Screen Capture & Recording Tool',
      icon: '/app-icons/cleanshot/128.webp',
      category: 'Utilities',
      rating: 4.9,
      reviews: '14.2K',
      installed: true,
      badge: 'Editors Choice',
    },
    {
      id: 'clipmind' as AppID,
      title: 'ClipMind AI',
      subtitle: 'Smart AI Clipboard History & Writing Assistant',
      icon: '/app-icons/clipmind/128.webp',
      category: 'Productivity',
      rating: 4.8,
      reviews: '8.9K',
      installed: true,
      badge: 'New AI Pick',
    },
    {
      id: 'unarchiver' as AppID,
      title: 'The Unarchiver',
      subtitle: 'Universal Archive Extractor for ZIP, 7Z, TAR',
      icon: '/app-icons/unarchiver/128.webp',
      category: 'Utilities',
      rating: 4.9,
      reviews: '48.1K',
      installed: true,
      badge: 'Essential',
    },
    {
      id: 'vscode' as AppID,
      title: 'Visual Studio Code',
      subtitle: 'Code Editing Redefined. Lightweight & Extensible',
      icon: '/app-icons/vscode/256.png',
      category: 'Developer Tools',
      rating: 4.9,
      reviews: '120K',
      installed: true,
      badge: 'Developer Choice',
    },
    {
      id: 'storagehub' as AppID,
      title: 'StorageHub Command',
      subtitle: 'Digital Resource Command Center & File Vault',
      icon: '/app-icons/finder/256.png',
      category: 'Productivity',
      rating: 5.0,
      reviews: '2.4K',
      installed: true,
      badge: 'Featured',
    },
    {
      id: 'portfolio' as AppID,
      title: 'DevOS Portfolio',
      subtitle: 'Interactive Developer Projects & Technical Skills',
      icon: '/app-icons/devutils/256.webp',
      category: 'Developer Tools',
      rating: 4.8,
      reviews: '1.2K',
      installed: true,
      badge: 'Showcase',
    },
  ];

  return (
    <div className="flex h-full bg-[#fbfbfd] dark:bg-[#181822] text-[#1d1d1f] dark:text-white select-none">
      {/* Sidebar */}
      <div className="w-52 bg-white/40 dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 p-3 space-y-3 shrink-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-1 px-2">
          App Store
        </div>
        <div className="space-y-0.5 text-xs">
          {['Discover', 'Productivity', 'Utilities', 'Developer Tools', 'Creativity'].map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  playSound.tink();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        {/* Banner Hero */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg flex items-center justify-between">
          <div className="max-w-md">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Featured Suite
            </span>
            <h1 className="text-xl font-bold mt-2">macOS Power Utilities</h1>
            <p className="text-xs text-white/80 mt-1">
              Supercharge your workflow with CleanShot X, ClipMind AI, and The Unarchiver right on the web.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/app-icons/cleanshot/128.webp" alt="CleanShot" className="w-12 h-12 object-contain drop-shadow" />
            <img src="/app-icons/clipmind/128.webp" alt="ClipMind" className="w-12 h-12 object-contain drop-shadow" />
            <img src="/app-icons/unarchiver/128.webp" alt="Unarchiver" className="w-12 h-12 object-contain drop-shadow" />
          </div>
        </div>

        {/* Apps List */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white/50 mb-3">
            {activeCategory} Applications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apps
              .filter((a) => activeCategory === 'Discover' || a.category === activeCategory)
              .map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 shadow-xs flex items-center gap-4 hover:shadow-md transition"
                >
                  <img src={app.icon} alt={app.title} className="w-14 h-14 rounded-xl object-contain drop-shadow-md shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold truncate">{app.title}</h3>
                      {app.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shrink-0">
                          {app.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-black/50 dark:text-white/50 line-clamp-1 mt-0.5">{app.subtitle}</p>
                    <div className="flex items-center gap-2 text-[10px] text-black/40 dark:text-white/40 mt-1">
                      <span>★ {app.rating}</span>
                      <span>·</span>
                      <span>{app.reviews} ratings</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound.tink();
                      if (onOpenApp) onOpenApp(app.id);
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white transition active:scale-95 text-blue-600 dark:text-blue-400"
                  >
                    Open
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
