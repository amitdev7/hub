'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Link as LinkIcon, Lock, Eye, Star, Pin, AlertCircle, Loader2 } from 'lucide-react';
import { Resource, Collection, ResourceType, Visibility } from '@/lib/types';
import { useToast } from './Toast';

interface ResourceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialResource?: Resource | null;
}

export function ResourceFormModal({
  open,
  onClose,
  onSaved,
  initialResource,
}: ResourceFormModalProps) {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [resourceType, setResourceType] = useState<ResourceType>('link');
  const [collectionId, setCollectionId] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialResource) {
      setTitle(initialResource.title);
      setUrl(initialResource.url);
      setDescription(initialResource.description || '');
      setCategory(initialResource.category || 'General');
      setResourceType(initialResource.resourceType || 'link');
      setCollectionId(initialResource.collectionId || '');
      setVisibility(initialResource.visibility || 'public');
      setIsFavorite(Boolean(initialResource.isFavorite));
      setIsPinned(Boolean(initialResource.isPinned));
      setTagsInput(initialResource.tags?.join(', ') || '');
      setThumbnail(initialResource.thumbnail || '');
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setCategory('General');
      setResourceType('link');
      setCollectionId('');
      setVisibility('public');
      setIsFavorite(false);
      setIsPinned(false);
      setTagsInput('');
      setThumbnail('');
    }
  }, [initialResource, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      error('Title and Destination URL are required.');
      return;
    }

    setLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        category,
        resourceType,
        collectionId: collectionId || null,
        visibility,
        isFavorite,
        isPinned,
        tags,
        thumbnail: thumbnail.trim() || null,
      };

      const endpoint = initialResource
        ? `/api/resources/${initialResource.id}`
        : '/api/resources';
      const method = initialResource ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save resource');
      }

      success(initialResource ? 'Resource updated successfully' : 'Resource created successfully');
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
      <div className="relative w-full max-w-xl bg-white dark:bg-[#12141d] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {initialResource ? 'Edit Resource' : 'Add New Resource'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[75vh] space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stripe Dashboard, Internal Spec, Brand Assets"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destination URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..., mailto:..., tel:..., or file:///..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            />
            {url.startsWith('file:///') && (
              <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Local file path: Accessible only on this local device, not shared publicly.
              </p>
            )}
          </div>

          {/* Type & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resource Type
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="link">Website Link</option>
                <option value="file">File Resource</option>
                <option value="youtube">YouTube Video</option>
                <option value="gdrive">Google Drive</option>
                <option value="email">Email (mailto)</option>
                <option value="phone">Phone (tel)</option>
                <option value="local_ref">Local Workstation Path</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Design, Development, Tools"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Collection & Visibility Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">(None / General)</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Visibility
              </label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-medium border transition-all ${
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
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-medium border transition-all ${
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

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context or description of this resource..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Tags & Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Productivity, React, UI UX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Favorite & Pinned Checkboxes */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>Mark as Favorite</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Pin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Pin to Top</span>
              </span>
            </label>
          </div>

          {/* Modal Footer */}
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
              <span>{initialResource ? 'Save Changes' : 'Create Resource'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
