'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  Image as ImageIcon,
  Monitor,
  Volume2,
  Battery,
  Shield,
  Info,
  Check,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { WallpaperOption } from '../types';
import { playSound } from '../useSound';

interface SettingsAppProps {
  currentWallpaper: string;
  onSelectWallpaper: (src: string) => void;
  isDark: boolean;
  onToggleDark: (dark: boolean) => void;
  accentColor: string;
  onSelectAccentColor: (color: string) => void;
}

export function SettingsApp({
  currentWallpaper,
  onSelectWallpaper,
  isDark,
  onToggleDark,
  accentColor,
  onSelectAccentColor,
}: SettingsAppProps) {
  const [activeSection, setActiveSection] = useState<'appearance' | 'wallpapers' | 'displays' | 'sound' | 'about'>('appearance');
  const [soundVolume, setSoundVolume] = useState<number>(80);
  const [brightness, setBrightness] = useState<number>(90);

  const wallpapers: WallpaperOption[] = [
    {
      id: 'w-ventura-1',
      name: 'macOS Ventura Light',
      src: '/wallpapers/ventura-1.webp',
      thumbnail: '/wallpapers/ventura-1.webp',
      isDark: false,
      type: 'ventura',
    },
    {
      id: 'w-ventura-2',
      name: 'macOS Ventura Dark',
      src: '/wallpapers/ventura-2.webp',
      thumbnail: '/wallpapers/ventura-2.webp',
      isDark: true,
      type: 'ventura',
    },
    {
      id: 'w-monterey-1',
      name: 'macOS Monterey Graphic',
      src: '/wallpapers/monterey-1.jpg',
      thumbnail: '/wallpapers/monterey-1.jpg',
      isDark: false,
      type: 'monterey',
    },
    {
      id: 'w-bigsur-1',
      name: 'macOS Big Sur Graphic 1',
      src: '/wallpapers/big-sur-graphic-1.jpg',
      thumbnail: '/wallpapers/big-sur-graphic-1.jpg',
      isDark: false,
      type: 'big-sur',
    },
    {
      id: 'w-bigsur-2',
      name: 'macOS Big Sur Graphic 2',
      src: '/wallpapers/big-sur-graphic-2.jpg',
      thumbnail: '/wallpapers/big-sur-graphic-2.jpg',
      isDark: true,
      type: 'big-sur',
    },
    {
      id: 'w-catalina-1',
      name: 'macOS Catalina Daylight',
      src: '/wallpapers/catalina-1.jpg',
      thumbnail: '/wallpapers/catalina-1.jpg',
      isDark: false,
      type: 'catalina',
    },
    {
      id: 'w-solar-1',
      name: 'Solar Gradient Aurora',
      src: '/wallpapers/solar-grad-1.jpg',
      thumbnail: '/wallpapers/solar-grad-1.jpg',
      isDark: false,
      type: 'solar',
    },
    {
      id: 'w-solar-10',
      name: 'Solar Gradient Twilight',
      src: '/wallpapers/solar-grad-10.jpg',
      thumbnail: '/wallpapers/solar-grad-10.jpg',
      isDark: true,
      type: 'solar',
    },
  ];

  const accents = [
    { name: 'Blue', color: '#007AFF', bg: 'bg-[#007AFF]' },
    { name: 'Purple', color: '#AF52DE', bg: 'bg-[#AF52DE]' },
    { name: 'Pink', color: '#FF2D55', bg: 'bg-[#FF2D55]' },
    { name: 'Red', color: '#FF3B30', bg: 'bg-[#FF3B30]' },
    { name: 'Orange', color: '#FF9500', bg: 'bg-[#FF9500]' },
    { name: 'Yellow', color: '#FFCC00', bg: 'bg-[#FFCC00]' },
    { name: 'Green', color: '#34C759', bg: 'bg-[#34C759]' },
    { name: 'Graphite', color: '#8E8E93', bg: 'bg-[#8E8E93]' },
  ];

  return (
    <div className="flex h-full bg-[#f6f6f8] dark:bg-[#181820] text-[#1d1d1f] dark:text-white select-none">
      {/* Settings Navigation Sidebar */}
      <div className="w-56 bg-white/40 dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 p-3 space-y-1 shrink-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-2 px-2">
          System Settings
        </div>

        {[
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'wallpapers', label: 'Wallpaper', icon: ImageIcon },
          { id: 'displays', label: 'Displays', icon: Monitor },
          { id: 'sound', label: 'Sound', icon: Volume2 },
          { id: 'about', label: 'About', icon: Info },
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as any);
                playSound.tink();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                isActive
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto max-w-2xl">
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold">Appearance</h2>

            {/* Light / Dark Mode Toggle */}
            <div>
              <label className="text-xs font-semibold block mb-2 text-black/60 dark:text-white/60">Theme Mode</label>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div
                  onClick={() => onToggleDark(false)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center gap-2 ${
                    !isDark
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Sun className="w-6 h-6 text-amber-500" />
                  <span className="text-xs font-semibold">Light</span>
                </div>
                <div
                  onClick={() => onToggleDark(true)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center gap-2 ${
                    isDark
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Moon className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs font-semibold">Dark</span>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <label className="text-xs font-semibold block mb-2 text-black/60 dark:text-white/60">Accent Color</label>
              <div className="flex items-center gap-2.5">
                {accents.map((acc) => {
                  const isSelected = accentColor === acc.color;
                  return (
                    <button
                      key={acc.name}
                      onClick={() => {
                        onSelectAccentColor(acc.color);
                        playSound.tink();
                      }}
                      className={`w-6 h-6 rounded-full ${acc.bg} transition-all flex items-center justify-center ${
                        isSelected ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110 opacity-80'
                      }`}
                      title={acc.name}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'wallpapers' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold">Wallpaper Gallery</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Official Apple Dynamic macOS Wallpapers</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {wallpapers.map((wp) => {
                const isSelected = currentWallpaper === wp.src;
                return (
                  <div
                    key={wp.id}
                    onClick={() => {
                      onSelectWallpaper(wp.src);
                      playSound.tink();
                    }}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer aspect-16/10 border transition-all ${
                      isSelected
                        ? 'ring-3 ring-blue-500 border-transparent shadow-lg scale-102'
                        : 'border-black/10 dark:border-white/10 hover:border-blue-500/50'
                    }`}
                  >
                    <img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-2.5 text-white">
                      <span className="text-[11px] font-medium truncate">{wp.name}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'displays' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold">Displays</h2>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <Laptop className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-xs font-bold">Built-in Liquid Retina XDR Display</div>
                  <div className="text-[11px] text-black/50 dark:text-white/50">3456 x 2234 @ 120Hz ProMotion</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Display Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'sound' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold">Sound &amp; Audio Effects</h2>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Output Volume</span>
                  <span>{soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs">Play sound on startup</span>
                <button
                  onClick={() => playSound.startup()}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 transition"
                >
                  Test Chime
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gray-900 to-black text-white flex items-center justify-center text-3xl shadow-lg">
                🍏
              </div>
              <div>
                <h2 className="text-lg font-bold">macOS Sequoia</h2>
                <p className="text-xs text-black/50 dark:text-white/50">Version 15.3 (Build 24D60)</p>
                <p className="text-xs text-black/70 dark:text-white/70 mt-1">MacBook Pro 16-inch, Nov 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                <div className="text-black/40 dark:text-white/40 mb-1">Chip</div>
                <div className="font-semibold">Apple M3 Max (16-core CPU)</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                <div className="text-black/40 dark:text-white/40 mb-1">Memory</div>
                <div className="font-semibold">64 GB Unified Memory</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                <div className="text-black/40 dark:text-white/40 mb-1">Graphics</div>
                <div className="font-semibold">Apple 40-Core GPU</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                <div className="text-black/40 dark:text-white/40 mb-1">Storage</div>
                <div className="font-semibold">2 TB Apple High-Speed SSD</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
