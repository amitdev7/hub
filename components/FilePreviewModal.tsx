'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Maximize2, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { FileItem } from '@/lib/types';
import { formatBytes } from '@/lib/utils';

interface FilePreviewModalProps {
  file: FileItem | null;
  onClose: () => void;
}

export function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setTextContent(null);
      return;
    }

    const isTextOrCode =
      file.category === 'code' ||
      file.filename.endsWith('.txt') ||
      file.filename.endsWith('.csv') ||
      file.filename.endsWith('.json') ||
      file.filename.endsWith('.md');

    if (isTextOrCode) {
      setLoading(true);
      fetch(`/api/files/${file.id}/preview`)
        .then((res) => res.text())
        .then((text) => setTextContent(text))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setTextContent(null);
    }
  }, [file]);

  if (!file) return null;

  const previewUrl = `/api/files/${file.id}/preview`;
  const downloadUrl = `/api/files/${file.id}/download`;

  const isPdf = file.filename.toLowerCase().endsWith('.pdf') || file.mimeType === 'application/pdf';
  const isImage = file.category === 'image';
  const isVideo = file.mimeType.startsWith('video/');
  const isAudio = file.mimeType.startsWith('audio/');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#12141d] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {file.filename}
              </h3>
              <p className="text-[11px] text-slate-400">
                {formatBytes(file.fileSize)} • {file.mimeType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={downloadUrl}
              download={file.filename}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100/50 dark:bg-black/40 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-xs">Loading preview...</span>
            </div>
          ) : isPdf ? (
            <iframe
              src={previewUrl}
              className="w-full h-[70vh] rounded-xl border border-slate-200 dark:border-white/10 shadow-inner"
              title={file.filename}
            />
          ) : isImage ? (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={previewUrl}
                alt={file.filename}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          ) : isVideo ? (
            <video
              src={previewUrl}
              controls
              className="max-w-full max-h-[70vh] rounded-xl shadow-lg"
            />
          ) : isAudio ? (
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 flex flex-col items-center gap-4">
              <span className="text-sm font-semibold">{file.filename}</span>
              <audio src={previewUrl} controls className="w-80" />
            </div>
          ) : textContent !== null ? (
            <div className="w-full h-full max-h-[70vh] overflow-auto bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap select-text">
              {textContent}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                Preview Not Available
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                Direct in-browser preview is not supported for this file format ({file.category}). You can download the file directly to view it on your device.
              </p>
              <a
                href={downloadUrl}
                download={file.filename}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download File ({formatBytes(file.fileSize)})</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
