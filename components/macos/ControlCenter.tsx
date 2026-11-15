'use client';

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Bluetooth,
  Radio,
  Moon,
  Sun,
  Volume2,
  Sliders,
  Play,
  Pause,
  SkipForward,
  Music,
  Share2,
} from 'lucide-react';
import { playSound } from './useSound';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleDark: (dark: boolean) => void;
}

export function ControlCenter({ isOpen, onClose, isDark, onToggleDark }: ControlCenterProps) {
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [airdropOn, setAirdropOn] = useState(true);
  const [dndOn, setDndOn] = useState(false);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.control-center-panel')) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="control-center-panel fixed top-9 right-3 w-80 p-3 rounded-3xl bg-white/75 dark:bg-[#1e1e28]/85 backdrop-blur-3xl border border-black/10 dark:border-white/10 shadow-2xl z-50 text-[#1d1d1f] dark:text-white select-none space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Top Grid: Connectivity Left + Focus/Dark Right */}
      <div className="grid grid-cols-2 gap-3">
        {/* Connectivity 2x2 Box */}
        <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 space-y-2 shadow-xs">
          {/* Wi-Fi */}
          <div
            onClick={() => {
              setWifiOn(!wifiOn);
              playSound.tink();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                wifiOn ? 'bg-blue-600 text-white shadow' : 'bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">Wi-Fi</div>
              <div className="text-[10px] text-black/40 dark:text-white/40">{wifiOn ? 'Studio 5G' : 'Off'}</div>
            </div>
          </div>

          {/* Bluetooth */}
          <div
            onClick={() => {
              setBluetoothOn(!bluetoothOn);
              playSound.tink();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                bluetoothOn ? 'bg-blue-600 text-white shadow' : 'bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60'
              }`}
            >
              <Bluetooth className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">Bluetooth</div>
              <div className="text-[10px] text-black/40 dark:text-white/40">{bluetoothOn ? 'AirPods Pro' : 'Off'}</div>
            </div>
          </div>

          {/* AirDrop */}
          <div
            onClick={() => {
              setAirdropOn(!airdropOn);
              playSound.tink();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                airdropOn ? 'bg-blue-600 text-white shadow' : 'bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">AirDrop</div>
              <div className="text-[10px] text-black/40 dark:text-white/40">{airdropOn ? 'Contacts' : 'Off'}</div>
            </div>
          </div>
        </div>

        {/* Right Stack: Focus + Dark Mode */}
        <div className="flex flex-col gap-3">
          {/* Focus / DND */}
          <div
            onClick={() => {
              setDndOn(!dndOn);
              playSound.tink();
            }}
            className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-2.5 shadow-xs ${
              dndOn
                ? 'bg-purple-600/15 border-purple-500/30 text-purple-600 dark:text-purple-400'
                : 'bg-white/70 dark:bg-white/[0.04] border-black/5 dark:border-white/5'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                dndOn ? 'bg-purple-600 text-white' : 'bg-black/10 dark:bg-white/10'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Focus</div>
              <div className="text-[10px] opacity-60">{dndOn ? 'On' : 'Off'}</div>
            </div>
          </div>

          {/* Dark Mode Tile */}
          <div
            onClick={() => {
              onToggleDark(!isDark);
              playSound.tink();
            }}
            className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 cursor-pointer flex items-center gap-2.5 shadow-xs"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="text-xs font-semibold">Appearance</div>
              <div className="text-[10px] text-black/40 dark:text-white/40">{isDark ? 'Dark' : 'Light'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders Box: Display + Sound */}
      <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 space-y-3 shadow-xs">
        <div>
          <div className="text-xs font-semibold mb-1 flex items-center justify-between text-black/70 dark:text-white/70">
            <span>Display</span>
            <span className="text-[10px]">{brightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-4 accent-blue-600 rounded-full cursor-pointer"
          />
        </div>

        <div>
          <div className="text-xs font-semibold mb-1 flex items-center justify-between text-black/70 dark:text-white/70">
            <span>Sound</span>
            <span className="text-[10px]">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-4 accent-blue-600 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* Now Playing Widget */}
      <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80"
            alt="Track"
            className="w-10 h-10 rounded-xl object-cover shadow"
          />
          <div>
            <div className="text-xs font-bold">Midnight in Cupertino</div>
            <div className="text-[10px] text-black/50 dark:text-white/50">Apple Silicon Ensemble</div>
          </div>
        </div>

        <button
          onClick={() => {
            setIsPlayingMusic(!isPlayingMusic);
            playSound.tink();
          }}
          className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
        >
          {isPlayingMusic ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
        </button>
      </div>
    </div>
  );
}
