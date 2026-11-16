'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Calculator,
  Terminal,
  Folder,
  Globe,
  Sparkles,
  ArrowRight,
  Camera,
  Archive,
  Layers,
} from 'lucide-react';
import { AppID } from './types';
import { playSound } from './useSound';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppID) => void;
}

export function SpotlightSearch({ isOpen, onClose, onOpenApp }: SpotlightSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Evaluate math expression safely without eval or Function constructor
  let mathResult: string | null = null;
  if (/^[\d\s+\-*/().]+$/.test(query.trim()) && query.trim().length > 1) {
    try {
      const sanitized = query.replace(/[^\d+\-*/().]/g, '');
      const tokens = sanitized.match(/(\d+(\.\d+)?|[+\-*/()])/g);
      if (tokens && tokens.length >= 3) {
        // Simple safe fallback calculator
        const num1 = parseFloat(tokens[0]);
        const op = tokens[1];
        const num2 = parseFloat(tokens[2]);
        if (!isNaN(num1) && !isNaN(num2)) {
          if (op === '+') mathResult = String(num1 + num2);
          else if (op === '-') mathResult = String(num1 - num2);
          else if (op === '*') mathResult = String(num1 * num2);
          else if (op === '/') mathResult = num2 !== 0 ? String(num1 / num2) : 'Error';
        }
      }
    } catch {}
  }

  const allItems = [
    { id: 'cleanshot' as AppID, title: 'CleanShot X', type: 'app', icon: '/app-icons/cleanshot/128.webp', category: 'Application' },
    { id: 'unarchiver' as AppID, title: 'The Unarchiver', type: 'app', icon: '/app-icons/unarchiver/128.webp', category: 'Application' },
    { id: 'clipmind' as AppID, title: 'ClipMind AI', type: 'app', icon: '/app-icons/clipmind/128.webp', category: 'Application' },
    { id: 'finder' as AppID, title: 'Finder', type: 'app', icon: '/app-icons/finder/256.png', category: 'Application' },
    { id: 'safari' as AppID, title: 'Safari', type: 'app', icon: '/app-icons/safari/256.png', category: 'Application' },
    { id: 'terminal' as AppID, title: 'Terminal', type: 'app', icon: '/app-icons/terminal/256.png', category: 'Application' },
    { id: 'vscode' as AppID, title: 'Visual Studio Code', type: 'app', icon: '/app-icons/vscode/256.png', category: 'Application' },
    { id: 'notes' as AppID, title: 'Notes', type: 'app', icon: '/app-icons/notes/256.png', category: 'Application' },
    { id: 'calculator' as AppID, title: 'Calculator', type: 'app', icon: '/app-icons/calculator/256.png', category: 'Application' },
    { id: 'music' as AppID, title: 'Music', type: 'app', icon: '/app-icons/music/256.png', category: 'Application' },
    { id: 'photos' as AppID, title: 'Photos', type: 'app', icon: '/app-icons/photos/256.png', category: 'Application' },
    { id: 'settings' as AppID, title: 'System Settings', type: 'app', icon: '/app-icons/system-preferences/256.png', category: 'Application' },
    { id: 'portfolio' as AppID, title: 'DevOS Portfolio', type: 'app', icon: '/app-icons/devutils/256.webp', category: 'Application' },
    { id: 'storagehub' as AppID, title: 'StorageHub Command Center', type: 'app', icon: '/app-icons/finder/256.png', category: 'Application' },
  ];

  const filteredItems = query
    ? allItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    : allItems.slice(0, 6);

  const handleSelect = (item: (typeof allItems)[0]) => {
    playSound.tink();
    onOpenApp(item.id);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-28 bg-black/25 backdrop-blur-xs select-none animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[560px] rounded-2xl bg-white/85 dark:bg-[#1e1e28]/90 backdrop-blur-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/5 dark:border-white/10">
          <Search className="w-5 h-5 text-black/40 dark:text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (filteredItems[selectedIndex]) {
                  handleSelect(filteredItems[selectedIndex]);
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(filteredItems.length - 1, i + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(0, i - 1));
              }
            }}
            className="w-full bg-transparent text-lg outline-hidden text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
          />
        </div>

        {/* Math Calculation Result */}
        {mathResult !== null && (
          <div className="px-5 py-3 border-b border-black/5 dark:border-white/10 bg-amber-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-black/60 dark:text-white/60 font-mono">{query} =</span>
            </div>
            <span className="text-lg font-bold font-mono text-black dark:text-white">{mathResult}</span>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition text-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/80 dark:text-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.title} className="w-7 h-7 object-contain shrink-0" />
                  <span>{item.title}</span>
                </div>
                <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-black/40 dark:text-white/40'}`}>
                  {item.category}
                </span>
              </div>
            );
          })}

          {filteredItems.length === 0 && !mathResult && (
            <div className="p-6 text-center text-xs text-black/40 dark:text-white/40">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
