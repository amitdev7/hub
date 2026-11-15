'use client';

import React, { useState, useEffect } from 'react';
import { X, Folder, Palette, Lock, Eye, Loader2 } from 'lucide-react';
import { Collection } from '@/lib/types';
import { useToast } from './Toast';

interface CollectionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialCollection?: Collection | null;
}

const AVAILABLE_ICONS = [
  'Folder',
  'FolderKanban',
  'Code2',
  'Palette',
  'FileText',
  'Sparkles',
  'Workflow',
  'BookOpen',
  'Layers',
  'Terminal',
  'HardDrive',
];

const AVAILABLE_COLORS = [
  { name: 'indigo', class: 'bg-indigo-500' },
  { name: 'violet', class: 'bg-violet-500' },
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'pink', class: 'bg-pink-500' },
  { name: 'amber', class: 'bg-amber-500' },
];

export function CollectionFormModal({
  open,
  onClose,
  onSaved,
  initialCollection,
}: CollectionFormModalProps) {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [color, setColor] = useState('indigo');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (initialCollection) {
      setName(initialCollection.name);
      setSlug(initialCollection.slug);
      setDescription(initialCollection.description || '');
      setIcon(initialCollection.icon || 'Folder');
      setColor(initialCollection.color || 'indigo');
      setIsPublic(Boolean(initialCollection.isPublic));
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setIcon('Folder');
      setColor('indigo');
      setIsPublic(true);
    }
  }, [initialCollection, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Collection name is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        icon,
        color,
        isPublic,
      };

      const endpoint = initialCollection
        ? `/api/collections/${initialCollection.id}`
        : '/api/collections';
      const method = initialCollection ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save collection');
      }

      success(initialCollection ? 'Collection updated' : 'Collection created');
      onSaved();
      onClose();
    } catch (err: any) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#12141d] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="h-14 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Folder className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {initialCollection ? 'Edit Collection' : 'Create Collection'}
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
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Collection Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!initialCollection) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }
              }}
              placeholder="e.g. Semester 7, Dev Tools, Design Assets"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="semester-7"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this collection..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Color accent */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`w-7 h-7 rounded-full ${c.class} transition-all ${
                    color === c.name ? 'ring-3 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Visibility
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border font-medium transition-all ${
                  isPublic
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Public Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border font-medium transition-all ${
                  !isPublic
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private Only</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialCollection ? 'Save Changes' : 'Create Collection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
