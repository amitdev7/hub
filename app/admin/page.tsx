'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Upload,
  FolderPlus,
  Bookmark,
  FileText,
  FolderKanban,
  Eye,
  Star,
  ExternalLink,
  Clock,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid,
  Columns,
  Sparkles,
} from 'lucide-react';
import { Resource, Collection, FileItem } from '@/lib/types';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceFormModal } from '@/components/ResourceFormModal';
import { FileUploadModal } from '@/components/FileUploadModal';
import { CollectionFormModal } from '@/components/CollectionFormModal';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { formatBytes } from '@/lib/utils';
import { useToast } from '@/components/Toast';

export default function AdminDashboardPage() {
  const { success } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'taskboard'>('taskboard');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [resRes, resFiles, resCols] = await Promise.all([
        fetch('/api/resources').then((r) => r.json()),
        fetch('/api/files').then((r) => r.json()),
        fetch('/api/collections').then((r) => r.json()),
      ]);

      if (resRes.resources) setResources(resRes.resources);
      if (resFiles.files) setFiles(resFiles.files);
      if (resCols.collections) setCollections(resCols.collections);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('storagehub-refresh', fetchData);
    return () => window.removeEventListener('storagehub-refresh', fetchData);
  }, []);

  const totalClicks = resources.reduce((acc, r) => acc + (r.clickCount || 0), 0);
  const totalFileSize = files.reduce((acc, f) => acc + (f.fileSize || 0), 0);
  const favoritesCount = resources.filter((r) => r.isFavorite).length;

  // Kanban buckets for the Taskboard view (Matching the uploaded image!)
  const proposedResources = resources.slice(0, 3);
  const inProgressResources = resources.slice(3, 6);
  const completedResources = resources.slice(6);

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

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate' }),
    });
    success('Resource duplicated');
    fetchData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Tab Bar Header (Matching user screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('taskboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'taskboard'
                ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Taskboard View</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Resource Grid</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingResource(null);
              setResourceModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task / Resource</span>
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/60 dark:border-white/5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Main Heading (Matching screenshot) */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Project overview
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tasks and resources are assigned to collections with priority, status, and destination URLs.
          This is a unified command center to organize digital assets.
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Resources</span>
            <Bookmark className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {resources.length}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Curated Links & Tools</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Persistent Files</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {files.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {formatBytes(totalFileSize)} disk storage used
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Collections</span>
            <FolderKanban className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {collections.length}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            Semester 7 & Projects
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161822]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Engagements</span>
            <Eye className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalClicks}
          </div>
          <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium mt-1">
            Opens & Downloads
          </div>
        </div>
      </div>

      {/* VIEW 1: Taskboard / Kanban Board (Replicating user mockup exactly) */}
      {activeTab === 'taskboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: PROPOSED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Proposed
                </span>
                <span className="text-xs text-slate-400 font-mono">({proposedResources.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">Date Added ↓</span>
            </div>

            <div className="space-y-4">
              {proposedResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  isDraggable={false}
                  onEdit={(r) => {
                    setEditingResource(r);
                    setResourceModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
              {proposedResources.length === 0 && (
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center text-xs text-slate-400">
                  No proposed items
                </div>
              )}
            </div>
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  In Progress
                </span>
                <span className="text-xs text-slate-400 font-mono">({inProgressResources.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">Priority ↓</span>
            </div>

            <div className="space-y-4">
              {inProgressResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  isDraggable={false}
                  onEdit={(r) => {
                    setEditingResource(r);
                    setResourceModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
              {inProgressResources.length === 0 && (
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center text-xs text-slate-400">
                  No active tasks in progress
                </div>
              )}
            </div>
          </div>

          {/* Column 3: COMPLETED / PUBLISHED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Completed / Live
                </span>
                <span className="text-xs text-slate-400 font-mono">({completedResources.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">Date Added ↓</span>
            </div>

            <div className="space-y-4">
              {completedResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  isDraggable={false}
                  onEdit={(r) => {
                    setEditingResource(r);
                    setResourceModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
              {completedResources.length === 0 && (
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center text-xs text-slate-400">
                  No completed tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Grid View */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
              All Active Resources ({resources.length})
            </h2>
            <Link
              href="/admin/resources"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage & Reorder</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                isDraggable={false}
                onEdit={(r) => {
                  setEditingResource(r);
                  setResourceModalOpen(true);
                }}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ResourceFormModal
        open={resourceModalOpen}
        initialResource={editingResource}
        onClose={() => {
          setResourceModalOpen(false);
          setEditingResource(null);
        }}
        onSaved={fetchData}
      />

      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={fetchData}
      />

      <CollectionFormModal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        onSaved={fetchData}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
