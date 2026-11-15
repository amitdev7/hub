'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
  Radio,
  Compass,
  Music,
  Disc,
} from 'lucide-react';
import { playSound } from '../useSound';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

export function MusicApp() {
  const tracks: Track[] = [
    {
      id: 't-1',
      title: 'Midnight in Cupertino',
      artist: 'Apple Silicon Ensemble',
      album: 'Sequoia Soundscapes',
      duration: '3:45',
      cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 't-2',
      title: 'Sonoma Horizon',
      artist: 'Liquid Retina',
      album: 'macOS Ambience',
      duration: '4:12',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 't-3',
      title: 'Infinite Loop 1',
      artist: 'Steve & The Woz',
      album: '1984 Revival',
      duration: '2:58',
      cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 't-4',
      title: 'Glassmorphism Sunset',
      artist: 'Aqua Project',
      album: 'Big Sur Reflections',
      duration: '5:04',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const [activeTrack, setActiveTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(35);
  const [volume, setVolume] = useState<number>(75);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    playSound.tink();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    playSound.tink();
    const idx = tracks.findIndex((t) => t.id === activeTrack.id);
    const nextIdx = (idx + 1) % tracks.length;
    setActiveTrack(tracks[nextIdx]);
    setProgress(0);
  };

  const prevTrack = () => {
    playSound.tink();
    const idx = tracks.findIndex((t) => t.id === activeTrack.id);
    const prevIdx = (idx - 1 + tracks.length) % tracks.length;
    setActiveTrack(tracks[prevIdx]);
    setProgress(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#fbfbfd] dark:bg-[#1a1a24] text-[#1d1d1f] dark:text-white select-none">
      {/* Top Player Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10 backdrop-blur-md shrink-0">
        {/* Playback controls */}
        <div className="flex items-center gap-3">
          <button onClick={prevTrack} className="p-1 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
          </button>
          <button onClick={nextTrack} className="p-1 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Central Track Display & Scrubber */}
        <div className="flex flex-col items-center max-w-sm w-full mx-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold">{activeTrack.title}</span>
            <span className="text-xs text-black/40 dark:text-white/40">·</span>
            <span className="text-xs text-black/60 dark:text-white/60">{activeTrack.artist}</span>
          </div>

          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">1:12</span>
            <div className="flex-1 bg-black/10 dark:bg-white/10 rounded-full h-1 overflow-hidden relative cursor-pointer">
              <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">{activeTrack.duration}</span>
          </div>
        </div>

        {/* Volume & Actions */}
        <div className="flex items-center gap-3 text-black/60 dark:text-white/60">
          <button onClick={() => setIsLiked(!isLiked)} className="hover:text-red-500 transition">
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
          </button>
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 accent-red-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Track Listing */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-black/[0.02] dark:bg-black/20 border-r border-black/5 dark:border-white/10 p-3 space-y-4 shrink-0">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-1 px-2">
              Apple Music
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-500 font-semibold">
                <Compass className="w-4 h-4" />
                <span>Listen Now</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70">
                <Disc className="w-4 h-4" />
                <span>Browse</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70">
                <Radio className="w-4 h-4" />
                <span>Radio</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-1 px-2">
              Library
            </div>
            <div className="space-y-0.5 text-xs text-black/70 dark:text-white/70">
              <div className="px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">Recently Added</div>
              <div className="px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">Artists</div>
              <div className="px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">Albums</div>
              <div className="px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">Songs</div>
            </div>
          </div>
        </div>

        {/* Playlist & Tracks */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Featured Album Hero */}
          <div className="flex items-center gap-6 p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-purple-500/10 to-indigo-500/10 border border-black/5 dark:border-white/10 mb-6">
            <img
              src={activeTrack.cover}
              alt={activeTrack.album}
              className="w-28 h-28 rounded-xl object-cover shadow-lg shrink-0"
            />
            <div>
              <div className="text-xs uppercase font-semibold text-red-500 tracking-wider">Playlist</div>
              <div className="text-xl font-bold mt-0.5">{activeTrack.album}</div>
              <div className="text-xs text-black/50 dark:text-white/50 mt-1">
                Curated by Apple Music · 4 songs, 16 minutes
              </div>
              <button
                onClick={togglePlay}
                className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-red-500 hover:bg-red-600 text-white shadow-md transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play All'}</span>
              </button>
            </div>
          </div>

          {/* Tracks Table */}
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-black/40 dark:text-white/40 border-b border-black/5 dark:border-white/10">
              <tr>
                <th className="pb-2 pl-3">#</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Artist</th>
                <th className="pb-2">Album</th>
                <th className="pb-2 pr-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {tracks.map((track, i) => {
                const isSelected = track.id === activeTrack.id;
                return (
                  <tr
                    key={track.id}
                    onClick={() => {
                      setActiveTrack(track);
                      setIsPlaying(true);
                      playSound.tink();
                    }}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-red-500/10 text-red-500 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <td className="py-2.5 pl-3 w-8">{isSelected && isPlaying ? '▶' : i + 1}</td>
                    <td className="py-2.5 flex items-center gap-2">
                      <img src={track.cover} alt={track.title} className="w-7 h-7 rounded object-cover shrink-0" />
                      <span className="truncate">{track.title}</span>
                    </td>
                    <td className="py-2.5 text-black/60 dark:text-white/60">{track.artist}</td>
                    <td className="py-2.5 text-black/50 dark:text-white/50">{track.album}</td>
                    <td className="py-2.5 pr-3 text-right font-mono text-black/50 dark:text-white/50">{track.duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
