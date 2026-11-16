'use client';

import React, { useEffect } from 'react';
import {
  Calendar,
  CloudSun,
  Clock,
  TrendingUp,
  Battery,
  StickyNote,
  X,
} from 'lucide-react';
import { playSound } from './useSound';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.notification-center-drawer')) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = now.getDate();
  const monthName = now.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="notification-center-drawer fixed top-7 right-0 bottom-0 w-88 p-4 bg-white/70 dark:bg-[#1c1c24]/80 backdrop-blur-3xl border-l border-black/10 dark:border-white/10 shadow-2xl z-50 text-[#1d1d1f] dark:text-white select-none overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Widgets</span>
        <button
          onClick={() => {
            onClose();
            playSound.tink();
          }}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition text-black/50 dark:text-white/50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar & Weather Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Calendar Widget */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-xs flex flex-col justify-between aspect-square">
          <div className="text-[11px] font-bold text-red-500 uppercase tracking-wider">{dayName}</div>
          <div className="text-4xl font-light">{dayNumber}</div>
          <div className="text-[10px] text-black/50 dark:text-white/50">{monthName} 2026 · No Events Today</div>
        </div>

        {/* Weather Widget */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md flex flex-col justify-between aspect-square">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Cupertino</span>
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-3xl font-light">72°</div>
            <div className="text-[10px] text-white/80">Sunny · H:76° L:58°</div>
          </div>
          <div className="text-[10px] text-white/70">Air Quality: 32 (Good)</div>
        </div>
      </div>

      {/* Stocks Widget */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Markets</span>
          </span>
          <span className="text-[10px] text-emerald-500 font-mono">+1.42%</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {[
            { symbol: 'AAPL', name: 'Apple Inc.', price: '242.10', change: '+1.85%' },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '148.60', change: '+3.12%' },
            { symbol: 'MSFT', name: 'Microsoft', price: '428.30', change: '+0.64%' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '182.40', change: '+1.10%' },
          ].map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <span className="font-bold mr-1">{stock.symbol}</span>
                <span className="text-[10px] text-black/40 dark:text-white/40">{stock.name}</span>
              </div>
              <div className="text-right font-mono">
                <div className="font-semibold">${stock.price}</div>
                <div className="text-[10px] text-emerald-500">{stock.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* World Clock Widget */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 shadow-xs space-y-2">
        <div className="text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>World Clock</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="text-[10px] text-black/40 dark:text-white/40">Cupertino</div>
            <div className="font-mono font-bold text-sm">7:30 PM</div>
          </div>
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="text-[10px] text-black/40 dark:text-white/40">Tokyo</div>
            <div className="font-mono font-bold text-sm">12:30 PM</div>
          </div>
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="text-[10px] text-black/40 dark:text-white/40">London</div>
            <div className="font-mono font-bold text-sm">3:30 AM</div>
          </div>
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
            <div className="text-[10px] text-black/40 dark:text-white/40">New York</div>
            <div className="font-mono font-bold text-sm">10:30 PM</div>
          </div>
        </div>
      </div>

      {/* Sticky Quick Note */}
      <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-xs space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <StickyNote className="w-3.5 h-3.5" />
          <span>Quick Note</span>
        </div>
        <p className="text-xs leading-relaxed">
          StorageHub command center active with full macOS Web suite: CleanShot X, The Unarchiver, and ClipMind AI.
        </p>
      </div>
    </div>
  );
}
