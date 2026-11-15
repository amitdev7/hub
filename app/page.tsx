'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  Download,
  Eye,
  FileText,
  Share2,
  FolderKanban,
  Sparkles,
  Lock,
  Star,
  CheckCircle2,
  Bookmark,
  Shield,
  Layers,
  Youtube,
  HardDrive,
  Mail,
  Phone,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import { Resource, Collection, FileItem } from '@/lib/types';
import { formatBytes } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ShareModal } from '@/components/ShareModal';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { ToastProvider } from '@/components/Toast';
import { MacDesktop } from '@/components/macos/MacDesktop';

export default function PublicPortalPage() {
  const [viewMode, setViewMode] = useState<'macos' | 'portal'>('macos');

  if (viewMode === 'macos') {
    return <MacDesktop onSwitchToPortal={() => setViewMode('portal')} />;
  }

  return (
    <ToastProvider>
      <PublicPortalContent onSwitchToMacOs={() => setViewMode('macos')} />
    </ToastProvider>
  );
}

function PublicPortalContent({ onSwitchToMacOs }: { onSwitchToMacOs: () => void }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [settings, setSettings] = useState<any>({
    siteTitle: 'StorageHub',
    siteDescription: 'A premium curated launcher of digital resources, tools, and files.',
    ownerName: 'Peter Parker',
    ownerBio: 'Software Engineer & Digital Curator',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  });

  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  useEffect(() => {
    // 1. Fetch public resources
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => {
        if (data.resources) setResources(data.resources);
      })
      .catch(() => {});

    // 2. Fetch public collections
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections);
      })
      .catch(() => {});

    // 3. Fetch public files
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) setFiles(data.files);
      })
      .catch(() => {});

    // 4. Fetch settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleOpenResource = (res: Resource) => {
    fetch(`/api/resources/${res.id}/click`, { method: 'POST' });
    window.open(res.url, '_blank');
  };

  const categories = Array.from(new Set(resources.map((r) => r.category))).filter(Boolean);

  const filteredResources = resources.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchTag = r.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    if (selectedCollection !== 'all' && r.collectionId !== selectedCollection) {
      return false;
    }

    if (selectedCategory !== 'all' && r.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen ambient-bg flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Visitor Navbar */}
      <nav className="sticky top-0 z-40 h-16 px-4 sm:px-8 bg-white/70 dark:bg-[#090a0f]/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {settings.siteTitle || 'StorageHub'}
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              Public Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchToMacOs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <span></span>
            <span>macOS Desktop Simulator</span>
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/5 transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Portal</span>
          </button>

          <ThemeToggle />

          <Link
            href="/admin"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs"
          >
            Admin Sign In
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Profile Identity Card */}
        <div className="relative rounded-3xl bg-white/80 dark:bg-[#12141d]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-mac-window dark:shadow-mac-window-dark overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
            <img
              src={settings.ownerAvatar}
              alt={settings.ownerName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-zinc-800 shadow-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {settings.ownerName}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified Launcher
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-3">
                {settings.ownerBio}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                {settings.siteDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search and Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search published links, resources, files, and tags..."
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#12141d]/85 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#12141d]/85 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Collection Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCollection('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                selectedCollection === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
              }`}
            >
              All Resources ({resources.length})
            </button>
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelectedCollection(col.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCollection === col.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{col.name}</span>
                <span className="text-[10px] opacity-70">({col.resourceCount || 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Curated Digital Resources ({filteredResources.length})
            </h2>
          </div>

          {filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
              <Bookmark className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                No matching resources found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching with another keyword or selecting All Collections above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleOpenResource(res)}
                  className="group relative bg-white/90 dark:bg-[#12141d]/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-xs hover:shadow-xl transition-all duration-200 mac-card flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top strip */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 truncate">
                        {res.category || 'General'}
                      </span>

                      {res.isFavorite && (
                        <Star className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                      )}
                    </div>

                    {/* Thumbnail if present */}
                    {res.thumbnail && (
                      <div className="w-full h-32 mb-3 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800">
                        <img
                          src={res.thumbnail}
                          alt={res.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5 flex items-center justify-between">
                      <span>{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 ml-2" />
                    </h3>

                    {res.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1 flex-wrap">
                      {res.tags?.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-slate-400 font-medium">Click to open →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Public Files & Documents Download Hub */}
        {files.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Public Documents & Deliverables ({files.length})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct in-browser previews and one-click downloads.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white/80 dark:bg-[#12141d]/85 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 shadow-xs hover:shadow-md transition-all mac-card flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {file.filename}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {formatBytes(file.fileSize)} • {file.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <a
                      href={`/api/files/${file.id}/download`}
                      download={file.filename}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-16 px-4 sm:px-8 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs text-slate-400 bg-white/50 dark:bg-[#090a0f]/50 backdrop-blur-md">
        <span>© 2026 {settings.ownerName}. Built with Apple macOS × Stripe design philosophy.</span>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold">
            Admin Dashboard
          </Link>
        </div>
      </footer>

      {/* Modals */}
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={settings.siteTitle}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
