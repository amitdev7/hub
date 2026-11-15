'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Search,
  Folder,
  FileText,
  ExternalLink,
  Plus,
  Upload,
  Moon,
  Sun,
  LayoutDashboard,
  Bookmark,
  Settings,
  Globe,
  Share2,
  X,
} from 'lucide-react';
import { useToast } from './Toast';

interface SearchResult {
  resources: any[];
  files: any[];
  collections: any[];
}

export function CommandPalette({
  open,
  setOpen,
  onOpenResourceModal,
  onOpenFileUploadModal,
  onOpenCollectionModal,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpenResourceModal?: () => void;
  onOpenFileUploadModal?: () => void;
  onOpenCollectionModal?: () => void;
}) {
  const router = useRouter();
  const { success } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ resources: [], files: [], collections: [] });
  const [loading, setLoading] = useState(false);

  // Global keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as any)?.tagName))) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  // Search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ resources: [], files: [], collections: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-[#12141d]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden ring-1 ring-black/5">
        <Command label="Global Command Palette">
          {/* Header Input */}
          <div className="flex items-center px-4 border-b border-slate-100 dark:border-white/10">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search resources, files, collections, or run commands..."
              className="w-full py-4 text-sm bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 ml-2 text-[11px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700">
              ESC
            </kbd>
          </div>

          {/* List Area */}
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-12 text-center text-sm text-slate-400">
              {loading ? 'Searching resources...' : 'No matching resources or commands found.'}
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="text-xs font-semibold text-slate-400 px-3 py-2">
              {onOpenResourceModal && (
                <Command.Item
                  onSelect={() => {
                    setOpen(false);
                    onOpenResourceModal();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-300 transition-colors"
                >
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <span>Create New Resource</span>
                </Command.Item>
              )}

              {onOpenFileUploadModal && (
                <Command.Item
                  onSelect={() => {
                    setOpen(false);
                    onOpenFileUploadModal();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-300 transition-colors"
                >
                  <Upload className="w-4 h-4 text-emerald-500" />
                  <span>Upload Files to Storage</span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  navigator.clipboard.writeText(window.location.origin);
                  success('Public portal link copied to clipboard!');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-300 transition-colors"
              >
                <Share2 className="w-4 h-4 text-violet-500" />
                <span>Copy Public Portal Link</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation Group */}
            <Command.Group heading="Navigation" className="text-xs font-semibold text-slate-400 px-3 py-2">
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  router.push('/admin');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-zinc-800 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Command Center Overview</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  router.push('/admin/resources');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-zinc-800 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>All Links & Resources</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  router.push('/admin/files');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-zinc-800 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>My Files & Documents</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  router.push('/admin/collections');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-zinc-800 transition-colors"
              >
                <Folder className="w-4 h-4 text-slate-500" />
                <span>Collections & Folders</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  router.push('/');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-zinc-800 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>View Public Visitor Portal</span>
              </Command.Item>
            </Command.Group>

            {/* Matching Resources */}
            {results.resources?.length > 0 && (
              <Command.Group heading="Resources & Links" className="text-xs font-semibold text-slate-400 px-3 py-2">
                {results.resources.map((res) => (
                  <Command.Item
                    key={res.id}
                    onSelect={() => {
                      setOpen(false);
                      // Record click
                      fetch(`/api/resources/${res.id}/click`, { method: 'POST' });
                      window.open(res.url, '_blank');
                    }}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate text-left">
                        <div className="truncate font-semibold">{res.title}</div>
                        <div className="text-xs text-slate-400 truncate">{res.url}</div>
                      </div>
                    </div>
                    {res.collectionName && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 shrink-0">
                        {res.collectionName}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Matching Files */}
            {results.files?.length > 0 && (
              <Command.Group heading="Files & Documents" className="text-xs font-semibold text-slate-400 px-3 py-2">
                {results.files.map((file) => (
                  <Command.Item
                    key={file.id}
                    onSelect={() => {
                      setOpen(false);
                      window.open(`/api/files/${file.id}/download`, '_blank');
                    }}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-emerald-50 dark:aria-selected:bg-emerald-950/40 aria-selected:text-emerald-600 dark:aria-selected:text-emerald-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate text-left">
                        <div className="truncate font-semibold">{file.filename}</div>
                        <div className="text-xs text-slate-400">{file.category}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Download</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Matching Collections */}
            {results.collections?.length > 0 && (
              <Command.Group heading="Collections" className="text-xs font-semibold text-slate-400 px-3 py-2">
                {results.collections.map((col) => (
                  <Command.Item
                    key={col.id}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/admin/resources?collection=${col.id}`);
                    }}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{col.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{col.resourceCount} items</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          {/* Footer Keyboard Hints */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to dismiss</span>
            </div>
            <span>StorageHub Command Engine</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
