'use client';

import React, { useState, useEffect } from 'react';
import { Star, Bookmark, Plus } from 'lucide-react';
import { Resource } from '@/lib/types';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceFormModal } from '@/components/ResourceFormModal';
import { useToast } from '@/components/Toast';

export default function FavoritesPage() {
  const { success } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/resources?favorite=true');
      const data = await res.json();
      if (data.resources) setResources(data.resources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('storagehub-refresh', fetchData);
    return () => window.removeEventListener('storagehub-refresh', fetchData);
  }, []);

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: isFav }),
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/resources/${id}`, { method: 'DELETE' });
    success('Resource deleted');
    fetchData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span>Starred Favorites</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-normal">
              {resources.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your most important links, tools, and bookmarks marked for quick daily access.
          </p>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <Star className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            No favorites marked yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Click the star icon on any resource card in the Command Center or All Links to pin it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              isDraggable={false}
              onEdit={(r) => {
                setEditingResource(r);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      <ResourceFormModal
        open={modalOpen}
        initialResource={editingResource}
        onClose={() => {
          setModalOpen(false);
          setEditingResource(null);
        }}
        onSaved={fetchData}
      />
    </div>
  );
}
