'use client';

import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Plus,
  Trash2,
  CheckSquare,
  Search,
  Pin,
  Share2,
  Bold,
  Italic,
  List,
  Heading,
} from 'lucide-react';
import { NoteItem } from '../types';
import { playSound } from '../useSound';

export function NotesApp() {
  const initialNotes: NoteItem[] = [
    {
      id: 'note-1',
      title: 'Welcome to macOS StorageHub Edition',
      content: `# Welcome to macOS StorageHub Edition

This desktop environment brings together the premier macOS Web simulators into one unified experience:
- **CleanShot X**: Interactive screenshot capture with arrow annotations & floating badge
- **The Unarchiver**: Universal archive inspector and unpacker
- **ClipMind AI**: Smart clipboard manager with AI copilot
- **Finder**: 4-pane file management with StorageHub backend sync
- **Terminal**: Authentic zsh shell with neofetch and interactive commands
- **Apple Notes, Safari, Calculator, Music, Photos, VS Code & DevOS Portfolio**

Enjoy the experience!`,
      folder: 'Notes',
      updatedAt: 'Today at 7:15 PM',
      isPinned: true,
    },
    {
      id: 'note-2',
      title: 'StorageHub Production Architecture',
      content: `# StorageHub Production Architecture

- Database: SQLite with WAL mode & atomic transactions
- Framework: Next.js 16 with React 18/19 & TypeScript
- Styling: Tailwind CSS with Apple macOS frosted glassmorphism
- Security: PBKDF2 with 16-byte random salt, HTTP-only session cookies
- Drag and drop: @dnd-kit/core with coordinate normalization`,
      folder: 'Work',
      updatedAt: 'Yesterday',
      isPinned: true,
    },
    {
      id: 'note-3',
      title: 'Weekly Sprint Tasks',
      content: `# Sprint Checklist

- [x] Integrate CleanShot X annotation canvas
- [x] Add The Unarchiver extraction progress physics
- [x] Embed ClipMind AI smart clipboard copilot
- [ ] Record 4K demonstration video of desktop physics
- [ ] Ship to production cluster`,
      folder: 'Work',
      updatedAt: 'Nov 12',
      isPinned: false,
    },
  ];

  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(initialNotes[0].id);
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('All');

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter((n) => {
    if (activeFolder !== 'All' && n.folder !== activeFolder) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const createNote = () => {
    playSound.tink();
    const id = 'note-' + Date.now();
    const newNote: NoteItem = {
      id,
      title: 'New Note',
      content: '# New Note\n\nStart typing your note here...',
      folder: activeFolder === 'All' ? 'Notes' : activeFolder,
      updatedAt: 'Just now',
      isPinned: false,
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(id);
  };

  const deleteNote = (id: string) => {
    playSound.trash();
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedNoteId === id && remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
    }
  };

  const updateSelectedContent = (text: string) => {
    const firstLine = text.split('\n')[0].replace(/^#+\s*/, '') || 'Untitled Note';
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? {
              ...n,
              title: firstLine,
              content: text,
              updatedAt: 'Just now',
            }
          : n
      )
    );
  };

  return (
    <div className="flex h-full bg-[#fbfbfd] dark:bg-[#1e1e24] text-[#1d1d1f] dark:text-white select-none">
      {/* 1. Folders Column */}
      <div className="w-48 bg-black/[0.03] dark:bg-black/30 border-r border-black/5 dark:border-white/10 p-3 flex flex-col shrink-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-2 px-2">
          iCloud
        </div>
        <div className="space-y-0.5 text-xs">
          {['All', 'Notes', 'Work', 'Personal'].map((f) => {
            const isActive = activeFolder === f;
            return (
              <button
                key={f}
                onClick={() => {
                  setActiveFolder(f);
                  playSound.tink();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>{f}</span>
                </span>
                <span className="text-[10px] text-black/40 dark:text-white/40">
                  {f === 'All' ? notes.length : notes.filter((n) => n.folder === f).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Notes List Column */}
      <div className="w-64 bg-white/60 dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 flex flex-col shrink-0">
        {/* Search & Add */}
        <div className="p-2.5 border-b border-black/5 dark:border-white/10 flex items-center gap-1.5">
          <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/10 text-xs">
            <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search Notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-hidden text-xs"
            />
          </div>
          <button
            onClick={createNote}
            className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition"
            title="Create Note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Notes Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map((note) => {
            const isSelected = note.id === selectedNoteId;
            return (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  playSound.tink();
                }}
                className={`p-2.5 rounded-xl cursor-pointer transition border ${
                  isSelected
                    ? 'bg-amber-500/20 dark:bg-amber-500/20 border-amber-500/40 text-black dark:text-white'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-black/80 dark:text-white/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold truncate flex-1">{note.title}</div>
                  {note.isPinned && <Pin className="w-3 h-3 text-amber-500 shrink-0 ml-1" />}
                </div>
                <div className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">{note.updatedAt}</div>
                <div className="text-[11px] text-black/60 dark:text-white/60 line-clamp-2 mt-1 font-mono">
                  {note.content.slice(0, 80)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Editor Column */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#181820] overflow-hidden">
        {selectedNote ? (
          <>
            {/* Note Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-black/5 dark:border-white/10 text-xs">
              <div className="text-black/40 dark:text-white/40 text-[11px]">{selectedNote.updatedAt}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="p-1 rounded-md hover:bg-red-500/10 text-red-500 transition"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Markdown Textarea */}
            <div className="flex-1 p-6 overflow-y-auto">
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateSelectedContent(e.target.value)}
                className="w-full h-full bg-transparent resize-none outline-hidden text-sm leading-relaxed font-sans placeholder:text-black/30 dark:placeholder:text-white/30"
                placeholder="Type note in markdown..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-black/40 dark:text-white/40">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  );
}
