'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  Video,
  Download,
  Eye,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Lock,
} from 'lucide-react';
import { FileItem } from '@/lib/types';
import { formatBytes, formatDate } from '@/lib/utils';
import { useToast } from './Toast';

interface FileCardProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDelete?: (id: string) => void;
  onEdit?: (file: FileItem) => void;
}

export function FileCard({ file, onPreview, onDelete, onEdit }: FileCardProps) {
  const { success } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const getIcon = () => {
    switch (file.category) {
      case 'image':
        return <ImageIcon className="w-6 h-6 text-pink-500" />;
      case 'media':
        return <Video className="w-6 h-6 text-purple-500" />;
      case 'code':
        return <FileCode className="w-6 h-6 text-blue-500" />;
      case 'archive':
        return <FileArchive className="w-6 h-6 text-amber-500" />;
      case 'document':
        if (file.filename.endsWith('.csv') || file.filename.endsWith('.xlsx')) {
          return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
        }
        return <FileText className="w-6 h-6 text-indigo-500" />;
      default:
        return <FileText className="w-6 h-6 text-slate-400" />;
    }
  };

  const handleDownload = () => {
    window.open(`/api/files/${file.id}/download`, '_blank');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/api/files/${file.id}/download`;
    navigator.clipboard.writeText(url);
    success('Download link copied to clipboard!');
  };

  return (
    <div className="group relative bg-white/90 dark:bg-[#161822]/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 shadow-xs hover:shadow-md transition-all duration-200 mac-card flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        <div className="flex items-center gap-1">
          {file.visibility === 'private' && (
            <span className="p-1 rounded text-amber-500" title="Private file">
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}

          {/* Context Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-[#181a26] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 py-1.5 text-xs animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onPreview(file);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDownload();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleCopyLink();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>

                  {onEdit && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(file);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Permanently delete "${file.filename}"?`)) {
                          onDelete(file.id);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete File</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="mb-3 cursor-pointer" onClick={() => onPreview(file)}>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
          {file.filename}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{formatBytes(file.fileSize)}</span>
          <span>•</span>
          <span className="capitalize">{file.category}</span>
          <span>•</span>
          <span>{formatDate(file.createdAt)}</span>
        </div>
        {file.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
            {file.description}
          </p>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {file.downloadCount} {file.downloadCount === 1 ? 'download' : 'downloads'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(file)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
