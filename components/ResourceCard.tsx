'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Star,
  ExternalLink,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  CopyCheck,
  FileText,
  Youtube,
  HardDrive,
  Mail,
  Phone,
  Monitor,
  Eye,
  Lock,
} from 'lucide-react';
import { Resource } from '@/lib/types';
import { useToast } from './Toast';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleFavorite?: (id: string, isFav: boolean) => void;
  isDraggable?: boolean;
}

export function ResourceCard({
  resource,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  isDraggable = true,
}: ResourceCardProps) {
  const { success, error } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: resource.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleOpen = () => {
    // Record click
    fetch(`/api/resources/${resource.id}/click`, { method: 'POST' });

    if (resource.resourceType === 'local_ref') {
      window.open(resource.url, '_blank');
      return;
    }
    window.open(resource.url, '_blank');
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(resource.url);
    setCopied(true);
    success('Resource destination copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeIcon = () => {
    switch (resource.resourceType) {
      case 'file':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'gdrive':
        return <HardDrive className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-500" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-teal-500" />;
      case 'local_ref':
        return <Monitor className="w-4 h-4 text-indigo-500" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white/90 dark:bg-[#161822]/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 transition-all duration-200 mac-card flex flex-col justify-between ${
        isDragging ? 'shadow-2xl ring-2 ring-indigo-500' : 'shadow-xs'
      }`}
    >
      {/* Top Header: Drag Handle, Category Tag, Favorite, Menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          {isDraggable && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-slate-300 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors shrink-0"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          )}

          {/* Category Chip */}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 truncate">
            {resource.category || 'General'}
          </span>

          {/* Visibility indicator */}
          {resource.visibility === 'private' ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
              <Lock className="w-2.5 h-2.5" /> Private
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-slate-400">
              <Eye className="w-2.5 h-2.5" /> Public
            </span>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(resource.id, !resource.isFavorite)}
              className={`p-1.5 rounded-lg transition-colors ${
                resource.isFavorite
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-300 dark:text-zinc-600 hover:text-amber-500'
              }`}
              title={resource.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Context Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Options"
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
                      handleOpen();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Resource</span>
                  </button>

                  <button
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleCopy(e);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </button>

                  {onEdit && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(resource);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Resource</span>
                    </button>
                  )}

                  {onDuplicate && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDuplicate(resource.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Delete "${resource.title}"?`)) {
                          onDelete(resource.id);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 cursor-pointer" onClick={handleOpen}>
        {/* Thumbnail if provided */}
        {resource.thumbnail && (
          <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-start gap-2.5 mb-1.5">
          <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-800 shrink-0 mt-0.5">
            {getTypeIcon()}
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {resource.title}
          </h3>
        </div>

        {resource.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {resource.description}
          </p>
        )}

        {/* Local file notice if local_ref */}
        {resource.resourceType === 'local_ref' && (
          <div className="p-2 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400">
            Local Workstation Reference (device-specific)
          </div>
        )}
      </div>

      {/* Card Footer: Tags & Clicks */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap truncate">
          {resource.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
          {resource.tags?.length > 3 && (
            <span className="text-[10px] text-slate-400">+{resource.tags.length - 3}</span>
          )}
        </div>

        {/* Clicks & Quick Open */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400">{resource.clickCount} clicks</span>
          <button
            onClick={handleOpen}
            className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            title="Open"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
