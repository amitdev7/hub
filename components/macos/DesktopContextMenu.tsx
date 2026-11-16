'use client';

import React, { useEffect } from 'react';
import {
  FolderPlus,
  Info,
  Image as ImageIcon,
  Layers,
  Camera,
  Archive,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { playSound } from './useSound';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenCleanShot: () => void;
  onOpenUnarchiver: () => void;
  onOpenClipMind: () => void;
  onSwitchToPortal?: () => void;
  onNewFolder?: () => void;
}

export function DesktopContextMenu({
  x,
  y,
  onClose,
  onOpenSettings,
  onOpenCleanShot,
  onOpenUnarchiver,
  onOpenClipMind,
  onSwitchToPortal,
  onNewFolder,
}: DesktopContextMenuProps) {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  // Adjust menu coordinates so it doesn't clip screen edge
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const posX = Math.max(10, Math.min(x, screenW - 240));
  const posY = Math.max(30, Math.min(y, screenH - 300));

  return (
    <div
      style={{ left: posX, top: posY }}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-50 w-56 py-1.5 rounded-2xl bg-white/85 dark:bg-[#202028]/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl text-xs text-[#1d1d1f] dark:text-white select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={() => {
          playSound.tink();
          onClose();
          if (onNewFolder) onNewFolder();
        }}
        className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
      >
        <span>New Folder</span>
      </button>

      <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1" />

      <button
        onClick={() => {
          playSound.tink();
          onClose();
          onOpenCleanShot();
        }}
        className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-blue-500" />
          <span>Capture Screen (CleanShot X)</span>
        </span>
      </button>

      <button
        onClick={() => {
          playSound.tink();
          onClose();
          onOpenUnarchiver();
        }}
        className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Archive className="w-3.5 h-3.5 text-amber-500" />
          <span>The Unarchiver Utility</span>
        </span>
      </button>

      <button
        onClick={() => {
          playSound.tink();
          onClose();
          onOpenClipMind();
        }}
        className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>ClipMind AI Assistant</span>
        </span>
      </button>

      <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1" />

      <button
        onClick={() => {
          playSound.tink();
          onClose();
          onOpenSettings();
        }}
        className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Change Wallpaper...</span>
        </span>
      </button>

      {onSwitchToPortal && (
        <>
          <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1" />
          <button
            onClick={() => {
              playSound.tink();
              onClose();
              onSwitchToPortal();
            }}
            className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white transition flex items-center justify-between text-blue-600 dark:text-blue-400"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Switch to Web Portal</span>
            </span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
}
