'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Share2,
  Filter,
  Maximize2,
  Minimize2,
  Plus,
  Upload,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useToast } from './Toast';

interface MacWindowFrameProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onOpenResourceModal?: () => void;
  onOpenFileUploadModal?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenShareModal?: () => void;
}

export function MacWindowFrame({
  children,
  title,
  subtitle,
  onOpenResourceModal,
  onOpenFileUploadModal,
  onOpenCommandPalette,
  onOpenShareModal,
}: MacWindowFrameProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { info, success } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    success('Signed out successfully');
    router.push('/admin/login');
  };

  // Derive breadcrumb path
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return ['StorageHub', 'Public Portal'];
    return [
      'StorageHub',
      ...parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={`transition-all duration-300 w-full min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-start ambient-bg`}>
      {/* Outer macOS Window Frame */}
      <div
        className={`w-full ${
          isFullscreen ? 'max-w-none h-screen rounded-none' : 'max-w-7xl rounded-2xl md:rounded-[22px]'
        } bg-white/80 dark:bg-[#12141d]/85 backdrop-blur-2xl shadow-mac-window dark:shadow-mac-window-dark border border-slate-200/80 dark:border-white/10 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* macOS Title Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-white/[0.02] select-none shrink-0">
          {/* Left: Traffic Lights & Breadcrumbs */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="traffic-btn traffic-close"
                title="Back / Close"
                aria-label="Back"
              />
              <button
                onClick={() => info('Window minimized to dock')}
                className="traffic-btn traffic-min"
                title="Minimize"
                aria-label="Minimize"
              />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="traffic-btn traffic-max"
                title={isFullscreen ? 'Restore' : 'Maximize'}
                aria-label="Maximize"
              />
            </div>

            {/* Breadcrumb Path */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600" />}
                  <span className={idx === breadcrumbs.length - 1 ? 'font-semibold text-slate-800 dark:text-slate-200' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Center: Global Search Pill */}
          <div className="flex-1 max-w-md mx-2">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200/60 dark:border-white/5 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="truncate">Type something to search...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-white dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions, Theme, User */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-slate-200/60 dark:border-white/5"
                title="Share Public Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-slate-200/60 dark:border-white/5"
              title="Open Public Resource Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visitor Portal</span>
            </Link>

            <ThemeToggle />

            {/* User Profile Pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-white/20"
                />
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Window Body Container */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
