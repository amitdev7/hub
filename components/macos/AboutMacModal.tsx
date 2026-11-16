'use client';

import React from 'react';
import { X, HardDrive, Monitor, Cpu } from 'lucide-react';
import { playSound } from './useSound';

interface AboutMacModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutMacModal({ isOpen, onClose }: AboutMacModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[480px] rounded-2xl bg-white/90 dark:bg-[#1f1f28]/95 backdrop-blur-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden text-[#1d1d1f] dark:text-white"
      >
        {/* Header with Traffic light */}
        <div className="h-8 px-3 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-black/[0.02]">
          <button
            onClick={() => {
              onClose();
              playSound.tink();
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] flex items-center justify-center transition active:scale-95"
            title="Close"
          >
            <X className="w-2 h-2 text-black/70 stroke-[3]" />
          </button>
          <span className="text-xs font-semibold">About This Mac</span>
          <div className="w-3" />
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center space-y-4">
          {/* Apple Logo Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-gray-900 to-black text-white flex items-center justify-center text-4xl shadow-xl">
            
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">macOS Sequoia</h1>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">Version 15.3 (Build 24D60)</p>
            <p className="text-xs font-medium text-black/70 dark:text-white/70 mt-1">MacBook Pro 16-inch, Nov 2026</p>
          </div>

          {/* Specs Table */}
          <div className="w-full bg-black/5 dark:bg-white/5 rounded-2xl p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-black/50 dark:text-white/50">Chip:</span>
              <span className="font-semibold">Apple M3 Max (16-core CPU, 40-core GPU)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50 dark:text-white/50">Memory:</span>
              <span className="font-semibold">64 GB Unified Memory</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50 dark:text-white/50">Startup Disk:</span>
              <span className="font-semibold">Macintosh HD (APFS)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50 dark:text-white/50">Serial Number:</span>
              <span className="font-mono font-medium">C02X892JK9L4</span>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="w-full text-left space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-black/50 dark:text-white/50 font-medium">
              <span>Macintosh HD</span>
              <span>1.42 TB available of 2.0 TB</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex shadow-inner">
              <div className="bg-blue-500 h-full w-[20%]" title="Apps (400 GB)" />
              <div className="bg-purple-500 h-full w-[10%]" title="Documents (200 GB)" />
              <div className="bg-amber-500 h-full w-[5%]" title="macOS (100 GB)" />
              <div className="bg-emerald-500 h-full w-[4%]" title="StorageHub (80 GB)" />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-black/40 dark:text-white/40 pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Apps</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Documents</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> macOS</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> StorageHub</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                playSound.tink();
              }}
              className="px-5 py-1.5 rounded-xl text-xs font-semibold bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition text-black dark:text-white"
            >
              System Report...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
