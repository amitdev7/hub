'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Laptop, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

const ACCENT_COLORS = [
  { id: 'indigo', name: 'Stripe Indigo', class: 'bg-[#635BFF]', ring: 'ring-[#635BFF]' },
  { id: 'blue', name: 'macOS Ocean', class: 'bg-[#007AFF]', ring: 'ring-[#007AFF]' },
  { id: 'emerald', name: 'Mint Emerald', class: 'bg-[#10B981]', ring: 'ring-[#10B981]' },
  { id: 'violet', name: 'Electric Violet', class: 'bg-[#8B5CF6]', ring: 'ring-[#8B5CF6]' },
  { id: 'pink', name: 'Rose Sunset', class: 'bg-[#EC4899]', ring: 'ring-[#EC4899]' },
  { id: 'amber', name: 'Warm Amber', class: 'bg-[#F59E0B]', ring: 'ring-[#F59E0B]' },
];

export default function AppearancePage() {
  const { success } = useToast();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [accent, setAccent] = useState('indigo');
  const [trafficLights, setTrafficLights] = useState(true);
  const [dockEnabled, setDockEnabled] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');

    const storedAccent = localStorage.getItem('storagehub_accent') || 'indigo';
    setAccent(storedAccent);
  }, []);

  const setTheme = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('storagehub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('storagehub_theme', 'light');
    }
    success(`Switched to ${theme} theme`);
  };

  const handleSelectAccent = (id: string) => {
    setAccent(id);
    localStorage.setItem('storagehub_accent', id);
    success(`Accent color updated to ${id}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl">
      <div className="border-b border-slate-200/60 dark:border-white/10 pb-5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span>Appearance & Design System</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize the Apple macOS × Stripe dashboard visual identity, themes, and micro-interactions.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Interface Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              currentTheme === 'light'
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/30'
                : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Apple Light</span>
              </div>
              {currentTheme === 'light' && (
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              )}
            </div>
            <div className="h-20 rounded-xl bg-slate-100 border border-slate-200 p-2 flex gap-2">
              <div className="w-12 h-full bg-white rounded-lg border border-slate-200" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-16 bg-white rounded" />
                <div className="h-6 w-full bg-white rounded border border-slate-200" />
              </div>
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              currentTheme === 'dark'
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/30'
                : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Space Dark</span>
              </div>
              {currentTheme === 'dark' && (
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <div className="h-20 rounded-xl bg-[#090a0f] border border-white/10 p-2 flex gap-2">
              <div className="w-12 h-full bg-[#161822] rounded-lg border border-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-16 bg-[#161822] rounded" />
                <div className="h-6 w-full bg-[#161822] rounded border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Colors */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Brand Accent Color
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectAccent(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                accent === c.id
                  ? 'border-indigo-500 bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${c.class}`} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* macOS UI Elements Toggle */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          macOS Window Controls
        </label>
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 border border-slate-200/80 dark:border-white/10 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Traffic Light Controls (Red / Yellow / Green)
              </div>
              <div className="text-slate-400 text-[11px]">
                Enables Apple macOS window frame controls on the title bar.
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                macOS Desktop Quick Launcher Dock
              </div>
              <div className="text-slate-400 text-[11px]">
                Floating bottom magnification dock for rapid navigation and file upload shortcuts.
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
