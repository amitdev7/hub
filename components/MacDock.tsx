'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bookmark,
  FileText,
  FolderKanban,
  Star,
  Clock,
  Settings,
  Plus,
  Upload,
  Search,
  Globe,
} from 'lucide-react';

interface MacDockProps {
  onOpenResourceModal?: () => void;
  onOpenFileUploadModal?: () => void;
  onOpenCommandPalette?: () => void;
}

export function MacDock({
  onOpenResourceModal,
  onOpenFileUploadModal,
  onOpenCommandPalette,
}: MacDockProps) {
  const pathname = usePathname();

  const dockItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
    { label: 'All Links', href: '/admin/resources', icon: Bookmark, color: 'from-violet-500 to-purple-600' },
    { label: 'Files', href: '/admin/files', icon: FileText, color: 'from-emerald-500 to-teal-600' },
    { label: 'Collections', href: '/admin/collections', icon: FolderKanban, color: 'from-amber-500 to-orange-600' },
    { label: 'Favorites', href: '/admin/favorites', icon: Star, color: 'from-yellow-400 to-amber-500' },
    { label: 'Recent', href: '/admin/recent', icon: Clock, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl transition-all duration-300 hover:scale-105">
      {/* Primary Links */}
      {dockItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            title={item.label}
            className={`group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg flex flex-col items-center`}
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md ring-1 ring-white/30`}
            >
              <item.icon className="w-5 h-5 drop-shadow-xs" />
            </div>

            {/* Active Indicator Dot */}
            {active && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-slate-800 dark:bg-white" />
            )}

            {/* Hover Tooltip */}
            <span className="absolute -top-8 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Subtle Divider */}
      <div className="w-[1px] h-7 bg-slate-300 dark:bg-white/20 mx-1" />

      {/* Action Buttons */}
      {onOpenResourceModal && (
        <button
          onClick={onOpenResourceModal}
          title="New Resource"
          className="group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md ring-1 ring-white/30">
            <Plus className="w-5 h-5 drop-shadow-xs" />
          </div>
          <span className="absolute -top-8 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs whitespace-nowrap">
            Add Resource
          </span>
        </button>
      )}

      {onOpenFileUploadModal && (
        <button
          onClick={onOpenFileUploadModal}
          title="Upload File"
          className="group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md ring-1 ring-white/30">
            <Upload className="w-5 h-5 drop-shadow-xs" />
          </div>
          <span className="absolute -top-8 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs whitespace-nowrap">
            Upload Files
          </span>
        </button>
      )}

      {onOpenCommandPalette && (
        <button
          onClick={onOpenCommandPalette}
          title="Command Palette (⌘K)"
          className="group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-white shadow-md ring-1 ring-white/30">
            <Search className="w-5 h-5 drop-shadow-xs" />
          </div>
          <span className="absolute -top-8 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs whitespace-nowrap">
            Command (⌘K)
          </span>
        </button>
      )}

      <Link
        href="/"
        target="_blank"
        title="Public Portal"
        className="group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg flex flex-col items-center"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-md ring-1 ring-white/30">
          <Globe className="w-5 h-5 drop-shadow-xs" />
        </div>
        <span className="absolute -top-8 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs whitespace-nowrap">
          Visitor Portal
        </span>
      </Link>
    </div>
  );
}
