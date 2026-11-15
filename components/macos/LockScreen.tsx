'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Fingerprint, Lock, Shield } from 'lucide-react';
import { playSound } from './useSound';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  wallpaperSrc: string;
}

export function LockScreen({ isLocked, onUnlock, wallpaperSrc }: LockScreenProps) {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLocked) return null;

  const handleAttemptUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Any password or blank enter unlocks, or test shake
    if (password === 'wrong') {
      playSound.basso();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    playSound.pop();
    setPassword('');
    onUnlock();
  };

  return (
    <div
      onClick={() => handleAttemptUnlock()}
      className="fixed inset-0 z-100 flex flex-col items-center justify-between py-16 select-none bg-cover bg-center overflow-hidden animate-in fade-in duration-300"
      style={{ backgroundImage: `url(${wallpaperSrc})` }}
    >
      {/* Blurred Tint Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Top Typography Clock */}
      <div className="relative z-10 text-center text-white drop-shadow-lg space-y-1">
        <div className="text-7xl font-extralight tracking-tight font-sans">{timeStr || '19:40'}</div>
        <div className="text-lg font-medium opacity-90">{dateStr || 'Monday, November 15'}</div>
      </div>

      {/* Center User Avatar & Password Field */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 flex flex-col items-center max-w-xs w-full transition-transform ${
          isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
      >
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-2xl ring-4 ring-white/20 mb-3">
          PP
        </div>
        <div className="text-base font-semibold text-white drop-shadow mb-4">Peter Parker</div>

        {/* Password input */}
        <form onSubmit={handleAttemptUnlock} className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-xs text-white placeholder:text-white/60 outline-hidden px-2 text-center"
          />
          <button
            type="submit"
            className="w-6 h-6 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition active:scale-95 shrink-0"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <button
          onClick={() => handleAttemptUnlock()}
          className="mt-4 flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition drop-shadow"
        >
          <Fingerprint className="w-4 h-4" />
          <span>Click to Unlock</span>
        </button>
      </div>

      {/* Bottom hint */}
      <div className="relative z-10 text-[11px] text-white/60 text-center drop-shadow">
        Touch ID or press Enter to unlock
      </div>
    </div>
  );
}
