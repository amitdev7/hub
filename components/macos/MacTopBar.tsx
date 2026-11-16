'use client';

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Search,
  Sliders,
  Sparkles,
  Volume2,
  Lock,
  Power,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { AppID } from './types';
import { playSound } from './useSound';

interface MacTopBarProps {
  activeAppId: AppID | null;
  onOpenApp: (appId: AppID) => void;
  onOpenAboutMac: () => void;
  onOpenSpotlight: () => void;
  onToggleControlCenter: () => void;
  onToggleNotificationCenter: () => void;
  onLockScreen: () => void;
  onSwitchToPortal?: () => void;
}

export function MacTopBar({
  activeAppId,
  onOpenApp,
  onOpenAboutMac,
  onOpenSpotlight,
  onToggleControlCenter,
  onToggleNotificationCenter,
  onLockScreen,
  onSwitchToPortal,
}: MacTopBarProps) {
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      };
      setCurrentTime(now.toLocaleString('en-US', options).replace(/,/g, ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close apple menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.apple-menu-container')) {
        setAppleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAppName = (appId: AppID | null) => {
    switch (appId) {
      case 'cleanshot':
        return 'CleanShot X';
      case 'unarchiver':
        return 'The Unarchiver';
      case 'clipmind':
        return 'ClipMind AI';
      case 'safari':
        return 'Safari';
      case 'terminal':
        return 'Terminal';
      case 'notes':
        return 'Notes';
      case 'calculator':
        return 'Calculator';
      case 'music':
        return 'Music';
      case 'photos':
        return 'Photos';
      case 'vscode':
        return 'Code';
      case 'settings':
        return 'System Settings';
      case 'portfolio':
        return 'DevOS';
      case 'storagehub':
        return 'StorageHub';
      case 'appstore':
        return 'App Store';
      default:
        return 'Finder';
    }
  };

  const currentAppName = getAppName(activeAppId);

  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-white/40 dark:bg-black/35 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 text-xs text-[#1d1d1f] dark:text-white flex items-center justify-between px-3 z-50 select-none shadow-xs">
      {/* Left Menu Items */}
      <div className="flex items-center gap-4">
        {/* Apple Logo Dropdown */}
        <div className="relative apple-menu-container">
          <button
            onClick={() => {
              setAppleMenuOpen(!appleMenuOpen);
              playSound.tink();
            }}
            className={`px-2 py-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/15 transition flex items-center justify-center ${
              appleMenuOpen ? 'bg-black/15 dark:bg-white/20' : ''
            }`}
          >
            <span className="text-sm leading-none"></span>
          </button>

          {appleMenuOpen && (
            <div className="absolute top-8 left-0 w-60 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1f1f28]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl z-50 text-xs">
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onOpenAboutMac();
                  playSound.tink();
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
              >
                <span>About This Mac</span>
              </button>

              <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onOpenApp('settings');
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition"
              >
                System Settings...
              </button>
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onOpenApp('appstore');
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition"
              >
                App Store...
              </button>

              <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1" />

              {onSwitchToPortal && (
                <button
                  onClick={() => {
                    setAppleMenuOpen(false);
                    onSwitchToPortal();
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between text-blue-600 dark:text-blue-400"
                >
                  <span>Switch to Web Portal View</span>
                  <Layers className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onLockScreen();
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
              >
                <span>Lock Screen</span>
                <span className="text-[10px] opacity-50">⌃⌘Q</span>
              </button>
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  playSound.startup();
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition"
              >
                Restart...
              </button>
              <button
                onClick={() => {
                  setAppleMenuOpen(false);
                  onLockScreen();
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition"
              >
                Shut Down...
              </button>
            </div>
          )}
        </div>

        {/* Current Active App Name */}
        <span className="font-bold cursor-default tracking-tight">{currentAppName}</span>

        {/* Dynamic App Menus */}
        <div className="hidden sm:flex items-center gap-3 font-normal opacity-90 cursor-default">
          <span className="hover:opacity-100 transition">File</span>
          <span className="hover:opacity-100 transition">Edit</span>
          <span className="hover:opacity-100 transition">View</span>
          <span className="hover:opacity-100 transition">Go</span>
          <span className="hover:opacity-100 transition">Window</span>
          <span className="hover:opacity-100 transition">Help</span>
        </div>
      </div>

      {/* Right Status Tray */}
      <div className="flex items-center gap-3">
        {/* Battery */}
        <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 cursor-default">
          <span className="text-[11px] font-mono">100%</span>
          <Battery className="w-4 h-4" />
        </div>

        {/* Wi-Fi */}
        <button className="opacity-90 hover:opacity-100 transition" title="Wi-Fi: Connected">
          <Wifi className="w-3.5 h-3.5" />
        </button>

        {/* Spotlight Search Icon */}
        <button
          onClick={() => {
            onOpenSpotlight();
            playSound.tink();
          }}
          className="opacity-90 hover:opacity-100 transition p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
          title="Spotlight Search (⌘Space)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={() => {
            onToggleControlCenter();
            playSound.tink();
          }}
          className="opacity-90 hover:opacity-100 transition p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
          title="Control Center"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Date & Time (triggers Notification Center) */}
        <button
          onClick={() => {
            onToggleNotificationCenter();
            playSound.tink();
          }}
          className="font-medium text-xs px-2 py-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
          title="Notification Center"
        >
          {currentTime || 'Mon Nov 15 7:30 PM'}
        </button>
      </div>
    </div>
  );
}
