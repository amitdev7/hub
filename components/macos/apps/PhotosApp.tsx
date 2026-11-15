'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Heart,
  ZoomIn,
  ZoomOut,
  Trash2,
  Share2,
  Sliders,
  ChevronLeft,
  Calendar,
  Grid,
} from 'lucide-react';
import { playSound } from '../useSound';

interface PhotoItem {
  id: string;
  title: string;
  src: string;
  date: string;
  location: string;
  album: 'Wallpapers' | 'Screenshots' | 'Favorites';
  isFavorite: boolean;
}

export function PhotosApp() {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: 'p-1',
      title: 'Sequoia Mountain Crest',
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      date: 'Today, 2:40 PM',
      location: 'Cupertino, CA',
      album: 'Wallpapers',
      isFavorite: true,
    },
    {
      id: 'p-2',
      title: 'CleanShot X Interface Studio',
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      date: 'Yesterday, 11:20 AM',
      location: 'San Francisco, CA',
      album: 'Screenshots',
      isFavorite: true,
    },
    {
      id: 'p-3',
      title: 'Silicon Architecture',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      date: 'Nov 12, 2026',
      location: 'San Jose, CA',
      album: 'Screenshots',
      isFavorite: false,
    },
    {
      id: 'p-4',
      title: 'Liquid Retina Gradient',
      src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      date: 'Nov 10, 2026',
      location: 'Palo Alto, CA',
      album: 'Wallpapers',
      isFavorite: false,
    },
  ]);

  const [activeAlbum, setActiveAlbum] = useState<string>('Library');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const filteredPhotos = photos.filter((p) => {
    if (activeAlbum === 'Favorites') return p.isFavorite;
    if (activeAlbum === 'Screenshots') return p.album === 'Screenshots';
    if (activeAlbum === 'Wallpapers') return p.album === 'Wallpapers';
    return true;
  });

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSound.tink();
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const deletePhoto = (id: string) => {
    playSound.trash();
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
  };

  return (
    <div className="flex h-full bg-[#f6f6f8] dark:bg-[#181820] text-[#1d1d1f] dark:text-white select-none">
      {/* Sidebar */}
      <div className="w-52 bg-white/40 dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 p-3 space-y-4 shrink-0">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-1 px-2">
            Photos
          </div>
          <div className="space-y-0.5 text-xs">
            {['Library', 'Favorites', 'Screenshots', 'Wallpapers'].map((album) => {
              const isActive = activeAlbum === album;
              return (
                <button
                  key={album}
                  onClick={() => {
                    setActiveAlbum(album);
                    setSelectedPhoto(null);
                    playSound.tink();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70'
                  }`}
                >
                  <span>{album}</span>
                  <span className="text-[10px] opacity-60">
                    {album === 'Library'
                      ? photos.length
                      : album === 'Favorites'
                      ? photos.filter((p) => p.isFavorite).length
                      : photos.filter((p) => p.album === album).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#14141c]">
        {selectedPhoto ? (
          /* Full View */
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Photos</span>
              </button>
              <div className="text-xs font-semibold">{selectedPhoto.title}</div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => toggleFavorite(selectedPhoto.id, e)} className="p-1 hover:text-red-500 transition">
                  <Heart className={`w-4 h-4 ${selectedPhoto.isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                </button>
                <button onClick={() => deletePhoto(selectedPhoto.id)} className="p-1 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center overflow-auto bg-black/90">
              <img src={selectedPhoto.src} alt={selectedPhoto.title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            </div>

            <div className="px-6 py-2 border-t border-black/5 dark:border-white/10 text-xs text-black/50 dark:text-white/50 flex justify-between">
              <span>{selectedPhoto.date}</span>
              <span>{selectedPhoto.location}</span>
            </div>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="text-lg font-bold mb-4">{activeAlbum}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => {
                    setSelectedPhoto(photo);
                    playSound.tink();
                  }}
                  className="group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition duration-200 border border-black/5 dark:border-white/10"
                >
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                    <span className="text-xs font-medium truncate">{photo.title}</span>
                    <button
                      onClick={(e) => toggleFavorite(photo.id, e)}
                      className="p-1 rounded-full bg-black/40 hover:bg-black/60 transition"
                    >
                      <Heart className={`w-3.5 h-3.5 ${photo.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
