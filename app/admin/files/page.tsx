'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  HardDrive,
  LayoutGrid,
  List,
  Filter,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  Video,
  Loader2,
} from 'lucide-react';
import { FileItem } from '@/lib/types';
import { FileCard } from '@/components/FileCard';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { FileUploadModal } from '@/components/FileUploadModal';
import { formatBytes, formatDate } from '@/lib/utils';
import { useToast } from '@/components/Toast';

export default function FilesPage() {
  const { success, error } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    window.addEventListener('storagehub-refresh', fetchFiles);
    return () => window.removeEventListener('storagehub-refresh', fetchFiles);
  }, []);

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0);
  const totalDownloads = files.reduce((acc, f) => acc + (f.downloadCount || 0), 0);

  const filteredFiles = files.filter((f) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = f.filename.toLowerCase().includes(q);
      const matchDesc = f.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    if (selectedCategory !== 'all' && f.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/files/${id}`, { method: 'DELETE' });
      success('File deleted from storage');
      fetchFiles();
    } catch {
      error('Failed to delete file');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>My Files & Documents</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-normal">
              {files.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Persistent disk storage with in-browser previews for PDF, images, video, and code.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Stored Files</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{files.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Disk Footprint</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatBytes(totalBytes)}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Downloads</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalDownloads}</div>
          </div>
        </div>
      </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files by name or description..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#161822]/80 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#161822]/80 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option value="all">All Formats</option>
            <option value="document">Documents & PDF</option>
            <option value="image">Images</option>
            <option value="media">Audio & Video</option>
            <option value="code">Code & Data</option>
            <option value="archive">Archives & ZIP</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Files List / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs">Loading files...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            No files found in storage
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Upload PDFs, spreadsheets, images, or documents to manage and preview them here.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white shadow-sm"
          >
            + Upload Files Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onPreview={setPreviewFile}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white/90 dark:bg-[#161822]/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] text-slate-400 font-semibold">
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3 px-4 hidden md:table-cell">Size</th>
                <th className="py-3 px-4 hidden lg:table-cell">Uploaded</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredFiles.map((f) => (
                <tr
                  key={f.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                    {f.filename}
                  </td>
                  <td className="py-3 px-4 capitalize hidden sm:table-cell text-slate-500">
                    {f.category}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-slate-500">
                    {formatBytes(f.fileSize)}
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell text-slate-400">
                    {formatDate(f.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                    {f.downloadCount}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => setPreviewFile(f)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={`/api/files/${f.id}/download`}
                      download={f.filename}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 inline-block"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${f.filename}"?`)) handleDelete(f.id);
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={fetchFiles}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
