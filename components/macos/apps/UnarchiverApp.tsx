'use client';

import React, { useState, useEffect } from 'react';
import {
  Archive,
  FolderArchive,
  FileText,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  FolderOpen,
  Settings,
  Sparkles,
  ArrowRight,
  HardDrive,
  Trash2,
  Download,
  Layers,
  File,
} from 'lucide-react';
import { ArchivePackage, ArchiveFileEntry } from '../types';
import { playSound } from '../useSound';

interface UnarchiverAppProps {
  onExtractionComplete?: (archiveName: string, filesCount: number) => void;
}

export function UnarchiverApp({ onExtractionComplete }: UnarchiverAppProps) {
  const sampleArchives: ArchivePackage[] = [
    {
      id: 'arch-1',
      name: 'macOS-Sequoia-Wallpapers.zip',
      size: '18.4 MB',
      fileCount: 8,
      files: [
        { name: 'Sequoia-Sunrise-4K.jpg', size: 4812300, compressedSize: 4200100, type: 'image/jpeg', modified: '2026-10-12' },
        { name: 'Sequoia-Midnight-4K.jpg', size: 5120400, compressedSize: 4500200, type: 'image/jpeg', modified: '2026-10-12' },
        { name: 'Ventura-Graphic-Day.webp', size: 3100000, compressedSize: 2800000, type: 'image/webp', modified: '2026-09-18' },
        { name: 'Ventura-Graphic-Night.webp', size: 3400000, compressedSize: 3000000, type: 'image/webp', modified: '2026-09-18' },
        { name: 'Solar-Gradient-Aurora.png', size: 2100000, compressedSize: 1800000, type: 'image/png', modified: '2026-08-04' },
        { name: 'Metadata.json', size: 12400, compressedSize: 4200, type: 'application/json', modified: '2026-10-15' },
        { name: 'License-Apple-Inc.txt', size: 4200, compressedSize: 1800, type: 'text/plain', modified: '2026-06-01' },
        { name: 'ColorProfiles.icc', size: 84000, compressedSize: 62000, type: 'application/octet-stream', modified: '2026-07-20' },
      ],
    },
    {
      id: 'arch-2',
      name: 'Developer-Tools-Kit.tar.gz',
      size: '42.1 MB',
      fileCount: 15,
      files: [
        { name: 'node_modules.bundle.js', size: 18400000, compressedSize: 12000000, type: 'application/javascript', modified: '2026-11-01' },
        { name: 'next.config.mjs', size: 4500, compressedSize: 1600, type: 'application/javascript', modified: '2026-11-04' },
        { name: 'package.json', size: 2100, compressedSize: 850, type: 'application/json', modified: '2026-11-10' },
        { name: 'schema.sql', size: 142000, compressedSize: 34000, type: 'text/x-sql', modified: '2026-11-08' },
        { name: 'tailwind.config.ts', size: 3200, compressedSize: 1100, type: 'text/typescript', modified: '2026-11-05' },
        { name: 'storagehub.db.bak', size: 24500000, compressedSize: 15200000, type: 'application/x-sqlite3', modified: '2026-11-12' },
      ],
    },
    {
      id: 'arch-3',
      name: 'StorageHub-Digital-Assets.7z',
      size: '9.8 MB',
      fileCount: 6,
      files: [
        { name: 'brand-identity-guidelines.pdf', size: 6400000, compressedSize: 4800000, type: 'application/pdf', modified: '2026-09-01' },
        { name: 'app-icons-export-1024.zip', size: 2800000, compressedSize: 2200000, type: 'application/zip', modified: '2026-10-20' },
        { name: 'site-manifest.xml', size: 8400, compressedSize: 2400, type: 'text/xml', modified: '2026-11-14' },
      ],
    },
  ];

  const [selectedArchive, setSelectedArchive] = useState<ArchivePackage>(sampleArchives[0]);
  const [activeTab, setActiveTab] = useState<'inspect' | 'extract' | 'settings'>('inspect');
  const [extractProgress, setExtractProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedFileIndex, setExtractedFileIndex] = useState(0);
  const [extractSuccess, setExtractSuccess] = useState(false);

  // Settings
  const [destination, setDestination] = useState<string>('Desktop');
  const [moveToTrash, setMoveToTrash] = useState(false);
  const [openAfterExtract, setOpenAfterExtract] = useState(true);

  const startExtraction = () => {
    playSound.tink();
    setIsExtracting(true);
    setExtractProgress(0);
    setExtractedFileIndex(0);
    setExtractSuccess(false);
    setActiveTab('extract');

    const totalFiles = selectedArchive.files.length;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      const pct = Math.min(100, Math.round((current / totalFiles) * 100));
      setExtractProgress(pct);
      setExtractedFileIndex(current);

      if (current >= totalFiles) {
        clearInterval(interval);
        setIsExtracting(false);
        setExtractSuccess(true);
        playSound.tink();
        if (onExtractionComplete) {
          onExtractionComplete(selectedArchive.name, totalFiles);
        }
      }
    }, 350);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f8] dark:bg-[#1e1e24] text-[#1d1d1f] dark:text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-black/30 border-b border-black/5 dark:border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center p-1 shadow">
            <img src="/app-icons/unarchiver/128.webp" alt="The Unarchiver" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold">The Unarchiver</div>
            <div className="text-[10px] text-black/50 dark:text-white/50">Universal Archive Utility for macOS</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-lg border border-black/5 dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('inspect')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'inspect' ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs' : 'text-black/60 dark:text-white/60'
            }`}
          >
            Archive Contents
          </button>
          <button
            onClick={() => setActiveTab('extract')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'extract' ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs' : 'text-black/60 dark:text-white/60'
            }`}
          >
            Extraction
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'settings' ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs' : 'text-black/60 dark:text-white/60'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Archive Library */}
        <div className="w-64 bg-white/40 dark:bg-white/5 border-r border-black/5 dark:border-white/10 flex flex-col shrink-0">
          <div className="p-3 border-b border-black/5 dark:border-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-2">
              Select Archive
            </div>
            <div className="space-y-1.5">
              {sampleArchives.map((arch) => {
                const isSelected = selectedArchive.id === arch.id;
                return (
                  <div
                    key={arch.id}
                    onClick={() => {
                      setSelectedArchive(arch);
                      setExtractSuccess(false);
                      setExtractProgress(0);
                      playSound.tink();
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-black/80 dark:text-white/90'
                    }`}
                  >
                    <FolderArchive className={`w-5 h-5 shrink-0 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{arch.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-black/40 dark:text-white/40'}`}>
                        {arch.size} · {arch.fileCount} items
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 text-[11px] text-black/50 dark:text-white/50 flex-1">
            <div className="font-semibold text-black/70 dark:text-white/70 mb-1">Supported Formats:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {['ZIP', 'TAR', 'GZ', '7Z', 'RAR', 'BZ2', 'XZ', 'ISO', 'CAB', 'LHA'].map((fmt) => (
                <span
                  key={fmt}
                  className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] font-mono font-medium text-black/60 dark:text-white/60"
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center Content View */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#18181f] overflow-hidden">
          {activeTab === 'inspect' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header stats */}
              <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span>{selectedArchive.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                      Archive Ready
                    </span>
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                    Compressed size: {selectedArchive.size} · Total files: {selectedArchive.files.length}
                  </div>
                </div>

                <button
                  onClick={startExtraction}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition active:scale-95"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Extract All Files</span>
                </button>
              </div>

              {/* Files Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/5 dark:bg-white/5 text-[11px] uppercase tracking-wider text-black/40 dark:text-white/40 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 font-semibold">Name</th>
                      <th className="py-2 px-3 font-semibold">Kind</th>
                      <th className="py-2 px-3 font-semibold">Size</th>
                      <th className="py-2 px-3 font-semibold">Compressed</th>
                      <th className="py-2 px-4 font-semibold text-right">Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {selectedArchive.files.map((file, idx) => {
                      return (
                        <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition">
                          <td className="py-2.5 px-4 font-medium flex items-center gap-2">
                            {file.name.endsWith('.jpg') || file.name.endsWith('.webp') || file.name.endsWith('.png') ? (
                              <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : file.name.endsWith('.json') || file.name.endsWith('.js') || file.name.endsWith('.ts') ? (
                              <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate">{file.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-black/60 dark:text-white/60">{file.type}</td>
                          <td className="py-2.5 px-3 font-mono text-black/70 dark:text-white/70">{formatSize(file.size)}</td>
                          <td className="py-2.5 px-3 font-mono text-black/70 dark:text-white/70">
                            {formatSize(file.compressedSize)}
                          </td>
                          <td className="py-2.5 px-4 text-right text-black/50 dark:text-white/50">{file.modified}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'extract' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-lg mx-auto w-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-inner">
                {extractSuccess ? <CheckCircle2 className="w-9 h-9 text-green-500" /> : <Archive className="w-9 h-9 animate-pulse" />}
              </div>

              <h2 className="text-base font-semibold mb-1">
                {extractSuccess ? 'Extraction Completed' : isExtracting ? 'Extracting Archive...' : 'Ready to Extract'}
              </h2>
              <p className="text-xs text-black/50 dark:text-white/50 mb-6">
                {extractSuccess
                  ? `Successfully unpacked ${selectedArchive.files.length} items to ${destination}.`
                  : isExtracting
                  ? `Processing file ${extractedFileIndex} of ${selectedArchive.files.length}: ${
                      selectedArchive.files[Math.min(extractedFileIndex, selectedArchive.files.length - 1)]?.name || ''
                    }`
                  : `Destination: /Users/guest/${destination}`}
              </p>

              {/* macOS Progress Bar */}
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5 overflow-hidden mb-3 p-0.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${extractProgress}%` }}
                />
              </div>
              <div className="w-full flex items-center justify-between text-xs text-black/50 dark:text-white/50 font-mono mb-8">
                <span>{extractProgress}%</span>
                <span>{isExtracting ? '18.4 MB/s' : extractSuccess ? 'Done' : '0 MB/s'}</span>
              </div>

              {!isExtracting && !extractSuccess && (
                <button
                  onClick={startExtraction}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition active:scale-95"
                >
                  Start Extraction
                </button>
              )}

              {extractSuccess && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('inspect')}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition text-black/80 dark:text-white/90"
                  >
                    View Contents
                  </button>
                  <button
                    onClick={startExtraction}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition"
                  >
                    Extract Again
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 p-6 max-w-md mx-auto w-full space-y-5">
              <div className="text-sm font-semibold border-b border-black/5 dark:border-white/10 pb-2">
                The Unarchiver Preferences
              </div>

              {/* Destination selector */}
              <div>
                <label className="text-xs font-medium block text-black/70 dark:text-white/70 mb-1.5">
                  Extract archives to:
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#202028] outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Desktop">Desktop (/Users/guest/Desktop)</option>
                  <option value="Downloads">Downloads (/Users/guest/Downloads)</option>
                  <option value="StorageHub">StorageHub Drive (/Users/guest/StorageHub)</option>
                  <option value="Same Folder">Same folder as the archive</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={moveToTrash}
                    onChange={(e) => setMoveToTrash(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Move archive file to Trash after extracting</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={openAfterExtract}
                    onChange={(e) => setOpenAfterExtract(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Open extracted folder in Finder upon completion</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Preserve original file modification dates</span>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                The Unarchiver automatically unzips multi-part archives, repairs corrupted CRC headers, and supports non-Latin filenames seamlessly.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
