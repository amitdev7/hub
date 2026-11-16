'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Lock,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Collection } from '@/lib/types';
import { CollectionFormModal } from '@/components/CollectionFormModal';
import { useToast } from '@/components/Toast';

export default function CollectionsPage() {
  const { success, error } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    window.addEventListener('storagehub-refresh', fetchCollections);
    return () => window.removeEventListener('storagehub-refresh', fetchCollections);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? Resources will remain unassigned.`)) {
      return;
    }

    try {
      await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      success('Collection deleted');
      fetchCollections();
    } catch {
      error('Failed to delete collection');
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'violet':
        return 'from-violet-500 to-purple-600';
      case 'blue':
        return 'from-blue-500 to-indigo-600';
      case 'emerald':
        return 'from-emerald-500 to-teal-600';
      case 'pink':
        return 'from-pink-500 to-rose-600';
      case 'amber':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-indigo-500 to-blue-600';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-500" />
            <span>Collections & Folders</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-normal">
              {collections.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize digital resources into grouped collections with dedicated public landing views.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCollection(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {collections.map((col) => (
          <div
            key={col.id}
            className="group relative bg-white/90 dark:bg-[#161822]/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-xs hover:shadow-md transition-all duration-200 mac-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getColorClass(
                    col.color
                  )} flex items-center justify-center text-white shadow-md ring-1 ring-white/20`}
                >
                  <FolderKanban className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1">
                  {col.isPublic ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                      <Eye className="w-2.5 h-2.5" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                      <Lock className="w-2.5 h-2.5" /> Private
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setEditingCollection(col);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {col.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {col.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {col.resourceCount || 0} items
              </span>
              <Link
                href={`/admin/resources?collection=${col.id}`}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View Resources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <CollectionFormModal
        open={modalOpen}
        initialCollection={editingCollection}
        onClose={() => {
          setModalOpen(false);
          setEditingCollection(null);
        }}
        onSaved={fetchCollections}
      />
    </div>
  );
}
