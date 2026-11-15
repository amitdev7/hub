'use client';

import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  FileCode,
  Image as ImageIcon,
  Video,
  Music,
  Download,
  Trash2,
  HardDrive,
  Cloud,
  Clock,
  LayoutGrid,
  List,
  Columns,
  Eye,
  Search,
  ChevronRight,
  ChevronLeft,
  Share2,
  Plus,
  ExternalLink,
  Sparkles,
  Laptop,
} from 'lucide-react';
import { AppID } from '../types';
import { playSound } from '../useSound';

interface FinderAppProps {
  onOpenApp?: (appId: AppID, customData?: any) => void;
  onPreviewFile?: (file: any) => void;
}

interface FinderItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'app';
  extension?: string;
  size?: number | string;
  modified?: string;
  targetApp?: AppID;
  url?: string;
  children?: FinderItem[];
}

export function FinderApp({ onOpenApp, onPreviewFile }: FinderAppProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(['Macintosh HD', 'Users', 'guest', 'Desktop']);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'columns'>('grid');
  const [selectedItem, setSelectedItem] = useState<FinderItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageHubFiles, setStorageHubFiles] = useState<any[]>([]);

  // Fetch real files from StorageHub API
  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setStorageHubFiles(data.files);
        }
      })
      .catch(() => {});
  }, []);

  // System file tree
  const fileSystem: Record<string, FinderItem[]> = {
    Desktop: [
      { id: 'd-1', name: 'CleanShot X', type: 'app', targetApp: 'cleanshot' },
      { id: 'd-2', name: 'The Unarchiver', type: 'app', targetApp: 'unarchiver' },
      { id: 'd-3', name: 'ClipMind AI', type: 'app', targetApp: 'clipmind' },
      { id: 'd-4', name: 'StorageHub Drive', type: 'folder' },
      { id: 'd-5', name: 'Projects & DevOS', type: 'folder' },
      { id: 'd-6', name: 'Welcome-to-macOS.pdf', type: 'file', extension: 'pdf', size: '2.4 MB', modified: '2026-11-15' },
    ],
    Applications: [
      { id: 'a-1', name: 'CleanShot X', type: 'app', targetApp: 'cleanshot' },
      { id: 'a-2', name: 'The Unarchiver', type: 'app', targetApp: 'unarchiver' },
      { id: 'a-3', name: 'ClipMind AI', type: 'app', targetApp: 'clipmind' },
      { id: 'a-4', name: 'Safari', type: 'app', targetApp: 'safari' },
      { id: 'a-5', name: 'Terminal', type: 'app', targetApp: 'terminal' },
      { id: 'a-6', name: 'VS Code', type: 'app', targetApp: 'vscode' },
      { id: 'a-7', name: 'System Settings', type: 'app', targetApp: 'settings' },
      { id: 'a-8', name: 'Calculator', type: 'app', targetApp: 'calculator' },
      { id: 'a-9', name: 'Notes', type: 'app', targetApp: 'notes' },
      { id: 'a-10', name: 'Music', type: 'app', targetApp: 'music' },
      { id: 'a-11', name: 'Photos', type: 'app', targetApp: 'photos' },
      { id: 'a-12', name: 'DevOS Portfolio', type: 'app', targetApp: 'portfolio' },
      { id: 'a-13', name: 'StorageHub Center', type: 'app', targetApp: 'storagehub' },
    ],
    Documents: [
      { id: 'doc-1', name: 'macOS-Architecture-Doc.md', type: 'file', extension: 'md', size: '14 KB', modified: '2026-11-14' },
      { id: 'doc-2', name: 'Product-Specification.pdf', type: 'file', extension: 'pdf', size: '4.8 MB', modified: '2026-11-10' },
      { id: 'doc-3', name: 'StorageHub-Database.sqlite', type: 'file', extension: 'sqlite', size: '128 KB', modified: '2026-11-15' },
    ],
    Downloads: [
      { id: 'dl-1', name: 'macOS-Sequoia-Wallpapers.zip', type: 'file', extension: 'zip', size: '18.4 MB', modified: '2026-11-15' },
      { id: 'dl-2', name: 'CleanShot-Installer.dmg', type: 'file', extension: 'dmg', size: '34.2 MB', modified: '2026-11-12' },
      { id: 'dl-3', name: 'Developer-Icons.tar.gz', type: 'file', extension: 'tar.gz', size: '12.8 MB', modified: '2026-11-09' },
    ],
    'StorageHub Drive': storageHubFiles.length
      ? storageHubFiles.map((f: any) => {
          let modDate = '2026-11-15';
          if (typeof f.createdAt === 'number') {
            try {
              modDate = new Date(f.createdAt).toISOString().slice(0, 10);
            } catch {
              modDate = '2026-11-15';
            }
          } else if (typeof f.createdAt === 'string') {
            modDate = f.createdAt.slice(0, 10);
          }

          const fname = f.filename || f.originalName || f.name || 'Untitled';
          const ext = fname.includes('.') ? fname.split('.').pop() : (f.extension || 'bin');

          return {
            id: 'sh-' + f.id,
            name: fname,
            type: 'file',
            extension: ext,
            size: f.sizeFormatted || `${Math.max(1, Math.round((f.fileSize || f.size || 1024) / 1024))} KB`,
            modified: modDate,
            url: `/api/files/${f.id}/preview`,
          };
        })
      : [
          { id: 'sh-1', name: 'storagehub-quickstart.pdf', type: 'file', extension: 'pdf', size: '1.2 MB', modified: '2026-11-15' },
          { id: 'sh-2', name: 'brand-banner.png', type: 'file', extension: 'png', size: '3.4 MB', modified: '2026-11-14' },
          { id: 'sh-3', name: 'database-dump.sql', type: 'file', extension: 'sql', size: '48 KB', modified: '2026-11-12' },
        ],
    'Projects & DevOS': [
      { id: 'p-1', name: 'StorageHub Command Center', type: 'folder' },
      { id: 'p-2', name: 'macOS Web Simulator', type: 'folder' },
      { id: 'p-3', name: 'CleanShot X Annotation Suite', type: 'folder' },
      { id: 'p-4', name: 'portfolio-presentation.key', type: 'file', extension: 'key', size: '18.9 MB', modified: '2026-11-01' },
    ],
  };

  const activeFolder = currentPath[currentPath.length - 1];
  const items = fileSystem[activeFolder] || fileSystem['Desktop'];

  const filteredItems = searchQuery
    ? items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const navigateTo = (folderName: string) => {
    playSound.tink();
    if (fileSystem[folderName]) {
      setCurrentPath(['Macintosh HD', 'Users', 'guest', folderName]);
    } else {
      setCurrentPath((prev) => [...prev, folderName]);
    }
    setSelectedItem(null);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      playSound.tink();
      setCurrentPath((prev) => prev.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const handleItemDoubleClick = (item: FinderItem) => {
    playSound.tink();
    if (item.type === 'folder') {
      navigateTo(item.name);
    } else if (item.type === 'app' && item.targetApp && onOpenApp) {
      onOpenApp(item.targetApp);
    } else if (item.extension === 'zip' || item.extension === 'tar.gz') {
      if (onOpenApp) onOpenApp('unarchiver', item);
    } else if (onPreviewFile) {
      onPreviewFile(item);
    }
  };

  const getItemIcon = (item: FinderItem) => {
    if (item.type === 'folder') {
      return (
        <div className="w-10 h-10 flex items-center justify-center">
          <Folder className="w-10 h-10 text-sky-500 fill-sky-400/80 drop-shadow-sm" />
        </div>
      );
    }
    if (item.type === 'app') {
      let iconSrc = '/app-icons/finder/128.webp';
      if (item.targetApp === 'cleanshot') iconSrc = '/app-icons/cleanshot/128.webp';
      else if (item.targetApp === 'unarchiver') iconSrc = '/app-icons/unarchiver/128.webp';
      else if (item.targetApp === 'clipmind') iconSrc = '/app-icons/clipmind/128.webp';
      else if (item.targetApp === 'safari') iconSrc = '/app-icons/safari/256.png';
      else if (item.targetApp === 'terminal') iconSrc = '/app-icons/terminal/256.png';
      else if (item.targetApp === 'vscode') iconSrc = '/app-icons/vscode/256.png';
      else if (item.targetApp === 'settings') iconSrc = '/app-icons/system-preferences/256.png';
      else if (item.targetApp === 'notes') iconSrc = '/app-icons/notes/256.png';
      else if (item.targetApp === 'calculator') iconSrc = '/app-icons/calculator/256.png';
      else if (item.targetApp === 'music') iconSrc = '/app-icons/music/256.png';
      else if (item.targetApp === 'photos') iconSrc = '/app-icons/photos/256.png';
      else if (item.targetApp === 'portfolio') iconSrc = '/app-icons/devutils/256.webp';
      return (
        <div className="w-10 h-10 flex items-center justify-center">
          <img src={iconSrc} alt={item.name} className="w-10 h-10 object-contain drop-shadow-md" />
        </div>
      );
    }
    // File icons
    if (item.extension === 'pdf') {
      return (
        <div className="w-9 h-11 bg-red-500/10 border border-red-500/30 rounded flex flex-col items-center justify-center p-1 shadow-xs">
          <FileText className="w-5 h-5 text-red-500" />
          <span className="text-[8px] font-bold text-red-600 uppercase mt-0.5">PDF</span>
        </div>
      );
    }
    if (item.extension === 'zip' || item.extension === 'tar.gz' || item.extension === '7z') {
      return (
        <div className="w-9 h-11 bg-amber-500/10 border border-amber-500/30 rounded flex flex-col items-center justify-center p-1 shadow-xs">
          <img src="/app-icons/unarchiver/128.webp" alt="Archive" className="w-6 h-6 object-contain" />
          <span className="text-[8px] font-bold text-amber-600 uppercase mt-0.5">ZIP</span>
        </div>
      );
    }
    if (item.extension === 'png' || item.extension === 'jpg' || item.extension === 'webp') {
      return (
        <div className="w-9 h-11 bg-emerald-500/10 border border-emerald-500/30 rounded flex flex-col items-center justify-center p-1 shadow-xs">
          <ImageIcon className="w-5 h-5 text-emerald-500" />
          <span className="text-[8px] font-bold text-emerald-600 uppercase mt-0.5">IMG</span>
        </div>
      );
    }
    return (
      <div className="w-9 h-11 bg-blue-500/10 border border-blue-500/30 rounded flex flex-col items-center justify-center p-1 shadow-xs">
        <FileCode className="w-5 h-5 text-blue-500" />
        <span className="text-[8px] font-bold text-blue-600 uppercase mt-0.5">DOC</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f8] dark:bg-[#1e1e24] text-[#1d1d1f] dark:text-white select-none">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/70 dark:bg-black/30 border-b border-black/5 dark:border-white/10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-0.5 rounded-lg border border-black/5 dark:border-white/10">
            <button
              onClick={navigateBack}
              disabled={currentPath.length <= 1}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-semibold px-2 py-1 rounded-md bg-black/5 dark:bg-white/10">
            {activeFolder}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-lg border border-black/5 dark:border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs' : 'text-black/50 dark:text-white/50'}`}
              title="Icon View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs' : 'text-black/50 dark:text-white/50'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('columns')}
              className={`p-1 rounded-md transition ${viewMode === 'columns' ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs' : 'text-black/50 dark:text-white/50'}`}
              title="Column View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Look spacebar preview button */}
          <button
            onClick={() => {
              if (selectedItem && onPreviewFile) onPreviewFile(selectedItem);
            }}
            disabled={!selectedItem}
            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30 transition"
            title="Quick Look (Spacebar)"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Search bar */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-xs">
            <Search className="w-3 h-3 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-28 bg-transparent text-xs outline-hidden placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      {/* Main Area: Sidebar + Contents */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 bg-white/40 dark:bg-white/[0.03] border-r border-black/5 dark:border-white/10 flex flex-col p-3 overflow-y-auto shrink-0 space-y-4">
          {/* Favorites */}
          <div>
            <div className="text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider px-2 mb-1">
              Favorites
            </div>
            <div className="space-y-0.5 text-xs">
              {[
                { name: 'Applications', icon: Laptop, color: 'text-blue-500' },
                { name: 'Desktop', icon: HardDrive, color: 'text-indigo-500' },
                { name: 'Documents', icon: FileText, color: 'text-amber-500' },
                { name: 'Downloads', icon: Download, color: 'text-emerald-500' },
                { name: 'StorageHub Drive', icon: Cloud, color: 'text-purple-500' },
                { name: 'Projects & DevOS', icon: Folder, color: 'text-sky-500' },
              ].map((fav) => {
                const isActive = activeFolder === fav.name;
                return (
                  <button
                    key={fav.name}
                    onClick={() => navigateTo(fav.name)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium shadow-xs'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-black/80 dark:text-white/80'
                    }`}
                  >
                    <fav.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : fav.color}`} />
                    <span className="truncate">{fav.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider px-2 mb-1">
              Tags
            </div>
            <div className="space-y-1 text-xs">
              {[
                { name: 'Red', color: 'bg-red-500' },
                { name: 'Orange', color: 'bg-orange-500' },
                { name: 'Yellow', color: 'bg-yellow-400' },
                { name: 'Green', color: 'bg-green-500' },
                { name: 'Blue', color: 'bg-blue-500' },
                { name: 'Purple', color: 'bg-purple-500' },
              ].map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-black/70 dark:text-white/70"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${tag.color}`} />
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contents Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#17171d] overflow-hidden">
          {viewMode === 'grid' && (
            <div className="flex-1 p-4 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 content-start">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      playSound.tink();
                    }}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center p-2 rounded-xl cursor-pointer text-center transition group ${
                      isSelected
                        ? 'bg-blue-500/20 ring-1 ring-blue-500 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/90 dark:text-white/90'
                    }`}
                  >
                    <div className="mb-2 group-hover:scale-105 transition duration-200">
                      {getItemIcon(item)}
                    </div>
                    <span className="text-xs font-medium line-clamp-2 leading-tight break-all px-1 rounded">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/5 dark:bg-white/5 text-[11px] uppercase tracking-wider text-black/40 dark:text-white/40 sticky top-0">
                  <tr>
                    <th className="py-2 px-4 font-semibold">Name</th>
                    <th className="py-2 px-3 font-semibold">Date Modified</th>
                    <th className="py-2 px-3 font-semibold">Size</th>
                    <th className="py-2 px-4 font-semibold text-right">Kind</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          playSound.tink();
                        }}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="py-2 px-4 font-medium flex items-center gap-2">
                          <div className="scale-75 origin-left shrink-0">{getItemIcon(item)}</div>
                          <span className="truncate">{item.name}</span>
                        </td>
                        <td className="py-2 px-3 text-black/50 dark:text-white/50">{item.modified || '2026-11-15'}</td>
                        <td className="py-2 px-3 font-mono text-black/60 dark:text-white/60">{item.size || '--'}</td>
                        <td className="py-2 px-4 text-right text-black/50 dark:text-white/50 uppercase">
                          {item.type === 'folder' ? 'Folder' : item.type === 'app' ? 'Application' : item.extension || 'Document'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'columns' && (
            <div className="flex-1 flex overflow-x-auto divide-x divide-black/5 dark:divide-white/10">
              {/* Column 1: Items */}
              <div className="w-64 p-2 overflow-y-auto shrink-0 space-y-1">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        playSound.tink();
                      }}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition ${
                        isSelected ? 'bg-blue-600 text-white font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="scale-75 origin-left shrink-0">{getItemIcon(item)}</div>
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.type === 'folder' && <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Column 2: File Preview / Inspector */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
                {selectedItem ? (
                  <div className="max-w-xs space-y-3">
                    <div className="scale-150 mb-4 inline-block">{getItemIcon(selectedItem)}</div>
                    <div className="text-sm font-semibold text-black/90 dark:text-white/90 break-all">{selectedItem.name}</div>
                    <div className="text-xs text-black/50 dark:text-white/50 space-y-1">
                      <div>Kind: {selectedItem.type.toUpperCase()}</div>
                      {selectedItem.size && <div>Size: {selectedItem.size}</div>}
                      <div>Modified: {selectedItem.modified || 'Today'}</div>
                    </div>
                    <button
                      onClick={() => handleItemDoubleClick(selectedItem)}
                      className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
                    >
                      Open
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-black/40 dark:text-white/40">Select an item to view preview</div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Path Bar */}
          <div className="px-4 py-1.5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-black/50 dark:text-white/50 shrink-0">
            <div className="flex items-center gap-1 font-mono">
              {currentPath.map((segment, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span>/</span>}
                  <span>{segment}</span>
                </span>
              ))}
            </div>
            <div>{filteredItems.length} items</div>
          </div>
        </div>
      </div>
    </div>
  );
}
