'use client';

import React, { useState, useRef } from 'react';
import { AppID, DockAppItem } from './types';
import { playSound } from './useSound';

interface MacDockProps {
  runningApps: Set<AppID>;
  openApps: Set<AppID>;
  onAppClick: (appId: AppID) => void;
  onEmptyTrash?: () => void;
  trashCount?: number;
}

export function MacDock({
  runningApps,
  openApps,
  onAppClick,
  onEmptyTrash,
  trashCount = 2,
}: MacDockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [bouncingApp, setBouncingApp] = useState<AppID | null>(null);
  const [hoveredAppTitle, setHoveredAppTitle] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  const dockApps: { id: AppID; title: string; icon: string }[] = [
    { id: 'finder', title: 'Finder', icon: '/app-icons/finder/256.png' },
    { id: 'safari', title: 'Safari', icon: '/app-icons/safari/256.png' },
    { id: 'cleanshot', title: 'CleanShot X', icon: '/app-icons/cleanshot/128.webp' },
    { id: 'unarchiver', title: 'The Unarchiver', icon: '/app-icons/unarchiver/128.webp' },
    { id: 'clipmind', title: 'ClipMind AI', icon: '/app-icons/clipmind/128.webp' },
    { id: 'vscode', title: 'Visual Studio Code', icon: '/app-icons/vscode/256.png' },
    { id: 'terminal', title: 'Terminal', icon: '/app-icons/terminal/256.png' },
    { id: 'notes', title: 'Notes', icon: '/app-icons/notes/256.png' },
    { id: 'calculator', title: 'Calculator', icon: '/app-icons/calculator/256.png' },
    { id: 'music', title: 'Music', icon: '/app-icons/music/256.png' },
    { id: 'photos', title: 'Photos', icon: '/app-icons/photos/256.png' },
    { id: 'portfolio', title: 'DevOS Portfolio', icon: '/app-icons/devutils/256.webp' },
    { id: 'storagehub', title: 'StorageHub', icon: '/app-icons/finder/256.png' },
    { id: 'appstore', title: 'App Store', icon: '/app-icons/appstore/256.png' },
    { id: 'settings', title: 'System Settings', icon: '/app-icons/system-preferences/256.png' },
  ];

  // Fisheye magnification scale calculation
  const getScale = (itemRef: HTMLDivElement | null) => {
    if (mouseX === null || !itemRef) return 1;
    const rect = itemRef.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = 150; // Influence radius in px

    if (distance > maxDistance) return 1;
    // Cosine smoothing curve
    const scale = 1 + 0.45 * Math.cos((distance / maxDistance) * (Math.PI / 2));
    return Number(scale.toFixed(3));
  };

  const handleAppLaunch = (appId: AppID) => {
    playSound.pop();
    setBouncingApp(appId);
    setTimeout(() => setBouncingApp(null), 1000);
    onAppClick(appId);
  };

  return (
    <div
      ref={dockRef}
      onMouseMove={(e) => setMouseX(e.clientX)}
      onMouseLeave={() => {
        setMouseX(null);
        setHoveredAppTitle(null);
      }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-2xl bg-white/40 dark:bg-black/35 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-2xl flex items-end gap-2 transition-all select-none"
    >
      {dockApps.map((app) => {
        const isRunning = runningApps.has(app.id) || openApps.has(app.id);
        const isBouncing = bouncingApp === app.id;

        return (
          <DockItem
            key={app.id}
            app={app}
            isRunning={isRunning}
            isBouncing={isBouncing}
            mouseX={mouseX}
            onHover={(title) => setHoveredAppTitle(title)}
            onClick={() => handleAppLaunch(app.id)}
          />
        );
      })}

      {/* Divider */}
      <div className="w-[1px] h-10 bg-black/10 dark:bg-white/15 mx-0.5 self-center" />

      {/* Trash */}
      <div
        onClick={() => {
          if (onEmptyTrash && trashCount > 0) {
            playSound.trash();
            onEmptyTrash();
          } else {
            handleAppLaunch('trash');
          }
        }}
        onMouseEnter={() => setHoveredAppTitle(trashCount > 0 ? `Trash (${trashCount} items)` : 'Trash')}
        onMouseLeave={() => setHoveredAppTitle(null)}
        className="relative group cursor-pointer flex flex-col items-center"
      >
        {hoveredAppTitle && hoveredAppTitle.startsWith('Trash') && (
          <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-black/75 dark:bg-white/90 text-white dark:text-black text-[11px] font-medium shadow-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            {hoveredAppTitle}
          </div>
        )}
        <div className="w-11 h-11 flex items-center justify-center transition-transform hover:-translate-y-2 duration-150">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4b/User-trash.svg"
            alt="Trash"
            className="w-10 h-10 object-contain drop-shadow"
          />
        </div>
      </div>
    </div>
  );
}

function DockItem({
  app,
  isRunning,
  isBouncing,
  mouseX,
  onHover,
  onClick,
}: {
  app: { id: AppID; title: string; icon: string };
  isRunning: boolean;
  isBouncing: boolean;
  mouseX: number | null;
  onHover: (title: string | null) => void;
  onClick: () => void;
}) {
  const itemRef = useRef<HTMLDivElement | null>(null);

  // Fisheye scale
  let scale = 1;
  if (mouseX !== null && itemRef.current) {
    const rect = itemRef.current.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = 140;
    if (distance <= maxDistance) {
      scale = 1 + 0.42 * Math.cos((distance / maxDistance) * (Math.PI / 2));
    }
  }

  return (
    <div
      ref={itemRef}
      onClick={onClick}
      onMouseEnter={() => onHover(app.title)}
      onMouseLeave={() => onHover(null)}
      className="relative flex flex-col items-center cursor-pointer group origin-bottom transition-transform duration-75"
      style={{
        transform: `scale(${scale}) ${isBouncing ? 'translateY(-16px)' : ''}`,
      }}
    >
      {/* Tooltip Label */}
      <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-black/75 dark:bg-white/90 text-white dark:text-black text-[11px] font-medium shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150">
        {app.title}
      </div>

      {/* App Icon */}
      <div className="w-11 h-11 flex items-center justify-center">
        <img src={app.icon} alt={app.title} className="w-11 h-11 object-contain drop-shadow-md" />
      </div>

      {/* Active Dot Indicator */}
      <div className="h-1 mt-0.5 flex items-center justify-center">
        {isRunning && <span className="w-1 h-1 rounded-full bg-black/70 dark:bg-white/80" />}
      </div>
    </div>
  );
}
