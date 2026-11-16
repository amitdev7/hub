'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppID, WindowState } from './types';
import { MacTopBar } from './MacTopBar';
import { MacDock } from './MacDock';
import { DesktopIcons } from './DesktopIcons';
import { DesktopContextMenu } from './DesktopContextMenu';
import { ControlCenter } from './ControlCenter';
import { NotificationCenter } from './NotificationCenter';
import { SpotlightSearch } from './SpotlightSearch';
import { AboutMacModal } from './AboutMacModal';
import { LockScreen } from './LockScreen';
import { MacWindow } from './MacWindow';

// Apps
import { CleanShotApp } from './apps/CleanShotApp';
import { UnarchiverApp } from './apps/UnarchiverApp';
import { ClipMindApp } from './apps/ClipMindApp';
import { FinderApp } from './apps/FinderApp';
import { SafariApp } from './apps/SafariApp';
import { TerminalApp } from './apps/TerminalApp';
import { NotesApp } from './apps/NotesApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { MusicApp } from './apps/MusicApp';
import { PhotosApp } from './apps/PhotosApp';
import { VSCodeApp } from './apps/VSCodeApp';
import { DevPortfolioApp } from './apps/DevPortfolioApp';
import { SettingsApp } from './apps/SettingsApp';
import { AppStoreApp } from './apps/AppStoreApp';
import { StorageHubApp } from './apps/StorageHubApp';

import { playSound } from './useSound';
import { Pin, Copy, Share2, X, Check, Eye } from 'lucide-react';

interface MacDesktopProps {
  onSwitchToPortal?: () => void;
}

export function MacDesktop({ onSwitchToPortal }: MacDesktopProps) {
  // Appearance & Wallpaper
  const [wallpaper, setWallpaper] = useState<string>('/wallpapers/ventura-1.webp');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [accentColor, setAccentColor] = useState<string>('#007AFF');

  // Overlays
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [aboutMacOpen, setAboutMacOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  // Floating CleanShot Thumbnail
  const [floatingScreenshot, setFloatingScreenshot] = useState<{
    id: string;
    url: string;
    title: string;
  } | null>(null);

  // Marquee Selection Box
  const [marquee, setMarquee] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isActive: boolean;
  }>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
  });

  // Windows State
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'win-finder',
      appId: 'finder',
      title: 'Finder',
      icon: '/app-icons/finder/256.png',
      x: 120,
      y: 70,
      width: 780,
      height: 480,
      minWidth: 500,
      minHeight: 340,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
    },
    {
      id: 'win-cleanshot',
      appId: 'cleanshot',
      title: 'CleanShot X',
      icon: '/app-icons/cleanshot/128.webp',
      x: 240,
      y: 110,
      width: 820,
      height: 520,
      minWidth: 580,
      minHeight: 380,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
    },
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-cleanshot');
  const zIndexCounter = useRef<number>(20);

  // Sync dark class on root document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Space -> Spotlight
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
      }
      // Ctrl+Cmd+Q -> Lock
      if (e.ctrlKey && (e.metaKey || e.altKey) && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        setIsLocked(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute running & open apps
  const runningApps = new Set<AppID>(windows.map((w) => w.appId));
  const openApps = new Set<AppID>(windows.filter((w) => !w.isMinimized).map((w) => w.appId));

  // Focus Window
  const handleFocusWindow = (id: string) => {
    zIndexCounter.current += 1;
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zIndexCounter.current, isMinimized: false } : w))
    );
  };

  // Close Window
  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  // Minimize Window
  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  // Toggle Maximize
  const handleToggleMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Update Position
  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  };

  // Update Size
  const handleUpdateSize = (id: string, width: number, height: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
  };

  // Open App from Dock / Finder / Desktop
  const handleOpenApp = (appId: AppID, customData?: any) => {
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      handleFocusWindow(existing.id);
      return;
    }

    // Default sizing per app
    let width = 760;
    let height = 480;
    let title = appId.toUpperCase();
    let icon = '/app-icons/finder/256.png';

    switch (appId) {
      case 'cleanshot':
        width = 820;
        height = 540;
        title = 'CleanShot X';
        icon = '/app-icons/cleanshot/128.webp';
        break;
      case 'unarchiver':
        width = 720;
        height = 460;
        title = 'The Unarchiver';
        icon = '/app-icons/unarchiver/128.webp';
        break;
      case 'clipmind':
        width = 800;
        height = 500;
        title = 'ClipMind AI';
        icon = '/app-icons/clipmind/128.webp';
        break;
      case 'finder':
        width = 780;
        height = 480;
        title = 'Finder';
        icon = '/app-icons/finder/256.png';
        break;
      case 'safari':
        width = 860;
        height = 540;
        title = 'Safari';
        icon = '/app-icons/safari/256.png';
        break;
      case 'terminal':
        width = 680;
        height = 420;
        title = 'Terminal';
        icon = '/app-icons/terminal/256.png';
        break;
      case 'notes':
        width = 740;
        height = 460;
        title = 'Notes';
        icon = '/app-icons/notes/256.png';
        break;
      case 'calculator':
        width = 280;
        height = 380;
        title = 'Calculator';
        icon = '/app-icons/calculator/256.png';
        break;
      case 'music':
        width = 820;
        height = 500;
        title = 'Music';
        icon = '/app-icons/music/256.png';
        break;
      case 'photos':
        width = 800;
        height = 520;
        title = 'Photos';
        icon = '/app-icons/photos/256.png';
        break;
      case 'vscode':
        width = 900;
        height = 580;
        title = 'Visual Studio Code';
        icon = '/app-icons/vscode/256.png';
        break;
      case 'portfolio':
        width = 840;
        height = 540;
        title = 'DevOS Portfolio';
        icon = '/app-icons/devutils/256.webp';
        break;
      case 'storagehub':
        width = 860;
        height = 540;
        title = 'StorageHub';
        icon = '/app-icons/finder/256.png';
        break;
      case 'settings':
        width = 720;
        height = 480;
        title = 'System Settings';
        icon = '/app-icons/system-preferences/256.png';
        break;
      case 'appstore':
        width = 840;
        height = 520;
        title = 'App Store';
        icon = '/app-icons/appstore/256.png';
        break;
    }

    zIndexCounter.current += 1;
    const offset = (windows.length % 6) * 28;
    const newWin: WindowState = {
      id: 'win-' + appId + '-' + Date.now(),
      appId,
      title,
      icon,
      x: Math.max(40, 100 + offset),
      y: Math.max(40, 60 + offset),
      width,
      height,
      minWidth: appId === 'calculator' ? 240 : 420,
      minHeight: appId === 'calculator' ? 320 : 280,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter.current,
      customData,
    };

    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId(newWin.id);
  };

  // Right Click Desktop Context Menu
  const handleContextMenuDesktop = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound.tink();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Marquee Selection Box
  const handleMouseDownDesktop = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.mac-window') || (e.target as HTMLElement).closest('.mac-dock')) return;
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
    setMarquee({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isActive: true,
    });
  };

  const handleMouseMoveDesktop = (e: React.MouseEvent) => {
    if (!marquee.isActive) return;
    setMarquee((prev) => ({
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
    }));
  };

  const handleMouseUpDesktop = () => {
    if (marquee.isActive) {
      setMarquee((prev) => ({ ...prev, isActive: false }));
    }
  };

  // CleanShot Desktop Capture Callback
  const handleDesktopCapture = (mode: 'fullscreen' | 'area') => {
    playSound.shutter();
    const id = 'snap-' + Date.now();
    const snap = {
      id,
      url:
        mode === 'fullscreen'
          ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      title: `CleanShot_${Date.now().toString().slice(-4)}.png`,
    };
    setFloatingScreenshot(snap);
  };

  // Active App for Menu Bar
  const activeWindow = windows.find((w) => w.id === activeWindowId);
  const activeAppId = activeWindow?.appId || null;

  return (
    <div
      onContextMenu={handleContextMenuDesktop}
      onMouseDown={handleMouseDownDesktop}
      onMouseMove={handleMouseMoveDesktop}
      onMouseUp={handleMouseUpDesktop}
      className="relative w-screen h-screen overflow-hidden select-none bg-cover bg-center transition-all duration-300 font-sans"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Top Menu Bar */}
      <MacTopBar
        activeAppId={activeAppId}
        onOpenApp={handleOpenApp}
        onOpenAboutMac={() => setAboutMacOpen(true)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onToggleControlCenter={() => setControlCenterOpen(!controlCenterOpen)}
        onToggleNotificationCenter={() => setNotificationCenterOpen(!notificationCenterOpen)}
        onLockScreen={() => setIsLocked(true)}
        onSwitchToPortal={onSwitchToPortal}
      />

      {/* Desktop Icons */}
      <DesktopIcons onOpenApp={handleOpenApp} />

      {/* Marquee Drag Selection Box */}
      {marquee.isActive && (
        <div
          style={{
            left: Math.min(marquee.startX, marquee.currentX),
            top: Math.min(marquee.startY, marquee.currentY),
            width: Math.abs(marquee.currentX - marquee.startX),
            height: Math.abs(marquee.currentY - marquee.startY),
          }}
          className="fixed pointer-events-none bg-blue-500/20 border border-blue-500/50 rounded-sm z-30"
        />
      )}

      {/* Multi-Window Layer */}
      {windows.map((win) => {
        const isActive = win.id === activeWindowId;
        return (
          <MacWindow
            key={win.id}
            win={win}
            isActive={isActive}
            onFocus={() => handleFocusWindow(win.id)}
            onClose={() => handleCloseWindow(win.id)}
            onMinimize={() => handleMinimizeWindow(win.id)}
            onToggleMaximize={() => handleToggleMaximize(win.id)}
            onUpdatePosition={(x, y) => handleUpdatePosition(win.id, x, y)}
            onUpdateSize={(w, h) => handleUpdateSize(win.id, w, h)}
          >
            {/* Render Application inside window */}
            {win.appId === 'cleanshot' && (
              <CleanShotApp
                onCaptureDesktop={handleDesktopCapture}
                onSaveToStorageHub={(file) => {
                  fetch('/api/files/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(file),
                  }).catch(() => {});
                }}
              />
            )}
            {win.appId === 'unarchiver' && (
              <UnarchiverApp
                onExtractionComplete={(name, count) => {
                  handleOpenApp('finder');
                }}
              />
            )}
            {win.appId === 'clipmind' && <ClipMindApp />}
            {win.appId === 'finder' && (
              <FinderApp
                onOpenApp={handleOpenApp}
                onPreviewFile={(f) => {
                  handleOpenApp('photos');
                }}
              />
            )}
            {win.appId === 'safari' && <SafariApp />}
            {win.appId === 'terminal' && <TerminalApp onOpenApp={handleOpenApp} />}
            {win.appId === 'notes' && <NotesApp />}
            {win.appId === 'calculator' && <CalculatorApp />}
            {win.appId === 'music' && <MusicApp />}
            {win.appId === 'photos' && <PhotosApp />}
            {win.appId === 'vscode' && <VSCodeApp />}
            {win.appId === 'portfolio' && <DevPortfolioApp />}
            {win.appId === 'settings' && (
              <SettingsApp
                currentWallpaper={wallpaper}
                onSelectWallpaper={(src) => setWallpaper(src)}
                isDark={isDark}
                onToggleDark={(dark) => setIsDark(dark)}
                accentColor={accentColor}
                onSelectAccentColor={(color) => setAccentColor(color)}
              />
            )}
            {win.appId === 'appstore' && <AppStoreApp onOpenApp={handleOpenApp} />}
            {win.appId === 'storagehub' && <StorageHubApp />}
          </MacWindow>
        );
      })}

      {/* Floating CleanShot Thumbnail in Bottom Right */}
      {floatingScreenshot && (
        <div className="fixed bottom-24 right-6 z-50 p-2 rounded-2xl bg-white/90 dark:bg-[#1f1f28]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <img
            src={floatingScreenshot.url}
            alt="Captured"
            className="w-16 h-12 rounded-lg object-cover border border-black/10 dark:border-white/10"
          />
          <div className="text-xs">
            <div className="font-semibold text-black dark:text-white truncate max-w-[120px]">
              {floatingScreenshot.title}
            </div>
            <div className="text-[10px] text-black/50 dark:text-white/50">CleanShot X Overlay</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                handleOpenApp('cleanshot');
                setFloatingScreenshot(null);
              }}
              className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
              title="Annotate"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFloatingScreenshot(null)}
              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-black/50 dark:text-white/50 transition"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Dock */}
      <MacDock
        runningApps={runningApps}
        openApps={openApps}
        onAppClick={handleOpenApp}
        trashCount={3}
        onEmptyTrash={() => {}}
      />

      {/* Desktop Context Menu */}
      {contextMenu.isOpen && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
          onOpenSettings={() => handleOpenApp('settings')}
          onOpenCleanShot={() => handleOpenApp('cleanshot')}
          onOpenUnarchiver={() => handleOpenApp('unarchiver')}
          onOpenClipMind={() => handleOpenApp('clipmind')}
          onSwitchToPortal={onSwitchToPortal}
          onNewFolder={() => handleOpenApp('finder')}
        />
      )}

      {/* Control Center Overlay */}
      <ControlCenter
        isOpen={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
        isDark={isDark}
        onToggleDark={(dark) => setIsDark(dark)}
      />

      {/* Notification Center Overlay */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* Spotlight Search Overlay */}
      <SpotlightSearch
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onOpenApp={handleOpenApp}
      />

      {/* About This Mac Modal */}
      <AboutMacModal
        isOpen={aboutMacOpen}
        onClose={() => setAboutMacOpen(false)}
      />

      {/* Lock Screen */}
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        wallpaperSrc={wallpaper}
      />
    </div>
  );
}

export default MacDesktop;
