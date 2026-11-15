'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Folder, Lock, Eye } from 'lucide-react';
import { Collection } from '@/lib/types';
import { formatBytes } from '@/lib/utils';
import { useToast } from './Toast';

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
  defaultCollectionId?: string;
}

export function FileUploadModal({
  open,
  onClose,
  onUploaded,
  defaultCollectionId,
}: FileUploadModalProps) {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [collectionId, setCollectionId] = useState(defaultCollectionId || '');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [createResource, setCreateResource] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (defaultCollectionId) setCollectionId(defaultCollectionId);
  }, [defaultCollectionId]);

  if (!open) return null;

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      error('Please select at least one file to upload.');
      return;
    }

    setUploading(true);
    setProgress(20);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      if (collectionId) formData.append('collectionId', collectionId);
      formData.append('visibility', visibility);
      formData.append('createResource', createResource ? 'true' : 'false');

      setProgress(50);
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(90);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100);
      success(`Successfully uploaded ${files.length} ${files.length === 1 ? 'file' : 'files'}!`);
      setFiles([]);
      onUploaded();
      onClose();
    } catch (err: any) {
      error(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#12141d] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Upload Files to StorageHub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                : 'border-slate-300 dark:border-white/15 hover:border-indigo-400 dark:hover:border-indigo-500/50 bg-slate-50/50 dark:bg-white/[0.02]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Click to browse or drag & drop files here
            </p>
            <p className="text-[11px] text-slate-400">
              Supports PDF, DOCX, XLSX, TXT, CSV, PNG, JPG, MP4, Code, ZIP (up to 100MB per file)
            </p>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Selected Files ({files.length})
              </div>
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      ({formatBytes(f.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Collection & Visibility Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assign to Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">(None / General Storage)</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Access Visibility
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border font-medium transition-all ${
                    visibility === 'public'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-500'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border font-medium transition-all ${
                    visibility === 'private'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-500'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </button>
              </div>
            </div>
          </div>

          {/* Auto-create resource card option */}
          <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={createResource}
              onChange={(e) => setCreateResource(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Create launcher card in All Links & Command Center
            </span>
          </label>

          {/* Progress bar */}
          {uploading && (
            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload {files.length > 0 ? `(${files.length})` : ''}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
