'use client';

import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  Download,
  FolderKanban,
  Star,
  Sparkles,
  Layers,
  FileText,
  Shield,
  Eye,
  Plus,
  Clock,
} from 'lucide-react';
import { playSound } from '../useSound';

export function StorageHubApp() {
  const [resources, setResources] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCol, setSelectedCol] = useState('all');

  useEffect(() => {
    fetch('/api/resources')
      .then((r) => r.json())
      .then((d) => d.resources && setResources(d.resources))
      .catch(() => {});

    fetch('/api/collections')
      .then((r) => r.json())
      .then((d) => d.collections && setCollections(d.collections))
      .catch(() => {});

    fetch('/api/files')
      .then((r) => r.json())
      .then((d) => d.files && setFiles(d.files))
      .catch(() => {});
  }, []);

  const filteredResources = resources.filter((r) => {
    if (selectedCol !== 'all' && r.collectionId !== selectedCol) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.url.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] dark:bg-[#15161e] text-[#1d1d1f] dark:text-white select-none">
      {/* Top StorageHub Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/70 dark:bg-black/30 border-b border-black/5 dark:border-white/10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">StorageHub Command Vault</div>
            <div className="text-[10px] text-black/50 dark:text-white/50">Enterprise Resource &amp; File Platform</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs">
            <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Filter resources & files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-hidden text-xs w-44"
            />
          </div>
          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
          >
            <span>Admin Center</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Collections filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCol('all');
              playSound.tink();
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedCol === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10'
            }`}
          >
            All Items ({resources.length})
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => {
                setSelectedCol(col.id);
                playSound.tink();
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedCol === col.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {res.category || 'Link'}
                  </span>
                  {res.isFavorite ? <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> : null}
                </div>
                <h3 className="text-xs font-bold line-clamp-1">{res.title}</h3>
                <p className="text-[11px] text-black/50 dark:text-white/50 line-clamp-2 mt-1">{res.description || res.url}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/5 dark:border-white/10">
                <span className="text-[10px] text-black/40 dark:text-white/40">{res.clickCount || 0} visits</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => fetch(`/api/resources/${res.id}/click`, { method: 'POST' })}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
