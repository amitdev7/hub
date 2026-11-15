'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Plus,
  Search,
  Filter,
  Bookmark,
  Star,
  Lock,
  Eye,
  ArrowUpDown,
  Folder,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Resource, Collection } from '@/lib/types';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceFormModal } from '@/components/ResourceFormModal';
import { useToast } from '@/components/Toast';

export default function ResourcesPage() {
  const { success, error } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchData = async () => {
    try {
      const [resRes, colRes] = await Promise.all([
        fetch('/api/resources').then((r) => r.json()),
        fetch('/api/collections').then((r) => r.json()),
      ]);

      if (resRes.resources) setResources(resRes.resources);
      if (colRes.collections) setCollections(colRes.collections);
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

  // Filtered resources
  const filteredResources = resources.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchUrl = r.url.toLowerCase().includes(q);
      const matchTag = r.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchUrl && !matchTag) return false;
    }

    if (selectedCollection !== 'all' && r.collectionId !== selectedCollection) {
      return false;
    }

    if (selectedCategory !== 'all' && r.category !== selectedCategory) {
      return false;
    }

    if (selectedType !== 'all' && r.resourceType !== selectedType) {
      return false;
    }

    if (selectedVisibility !== 'all' && r.visibility !== selectedVisibility) {
      return false;
    }

    if (favoriteOnly && !r.isFavorite) {
      return false;
    }

    return true;
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = resources.findIndex((r) => r.id === active.id);
    const newIndex = resources.findIndex((r) => r.id === over.id);

    const reordered = arrayMove(resources, oldIndex, newIndex);
    setResources(reordered);

    // Save order to backend
    try {
      const items = reordered.map((item, idx) => ({
        id: item.id,
        displayOrder: idx,
      }));

      await fetch('/api/resources/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      success('Resource order persisted');
    } catch {
      error('Failed to persist order');
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/resources/${id}`, { method: 'DELETE' });
    success('Resource deleted');
    fetchData();
  };

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate' }),
    });
    success('Resource duplicated');
    fetchData();
  };

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: isFav }),
    });
    fetchData();
  };

  // Categories list
  const categories = Array.from(new Set(resources.map((r) => r.category))).filter(Boolean);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>All Links & Resources</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-normal">
              {resources.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Drag cards to customize order. Reordering is instantly saved to persistent storage.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingResource(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources by title, description, URL, or tag..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#161822]/80 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          {/* Visibility filter */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#161822]/80 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public Only</option>
            <option value="private">Private Only</option>
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#161822]/80 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option value="all">All Types</option>
            <option value="link">Web Links</option>
            <option value="file">Files</option>
            <option value="youtube">YouTube</option>
            <option value="gdrive">Google Drive</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="local_ref">Local Path</option>
          </select>

          {/* Favorites filter toggle */}
          <button
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              favoriteOnly
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40'
                : 'bg-white/80 dark:bg-[#161822]/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoriteOnly ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>

        {/* Collection Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedCollection('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              selectedCollection === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Collections ({resources.length})
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCollection === col.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>{col.name}</span>
              <span className="text-[10px] opacity-70">({col.resourceCount || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-xs">Loading resources...</span>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <Bookmark className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            No matching resources found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query or collection filter, or create a new resource card.
          </p>
          <button
            onClick={() => {
              setEditingResource(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white shadow-sm"
          >
            + Create New Resource
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredResources.map((r) => r.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  isDraggable={true}
                  onEdit={(r) => {
                    setEditingResource(r);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
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
