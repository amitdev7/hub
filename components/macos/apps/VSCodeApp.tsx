'use client';

import React, { useState } from 'react';
import {
  FileCode,
  Folder,
  Play,
  Settings,
  Search,
  GitBranch,
  Bug,
  Boxes,
  ChevronRight,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { playSound } from '../useSound';

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export function VSCodeApp() {
  const files: Record<string, CodeFile> = {
    'App.tsx': {
      name: 'App.tsx',
      language: 'typescript',
      content: `import React, { useState } from 'react';
import { MacDesktop } from './components/macos/MacDesktop';
import { CleanShotX } from './components/macos/apps/CleanShotApp';
import { Unarchiver } from './components/macos/apps/UnarchiverApp';
import { ClipMindAI } from './components/macos/apps/ClipMindApp';

export default function StorageHubOS() {
  const [activeTheme, setActiveTheme] = useState('dark');

  return (
    <main className="w-screen h-screen overflow-hidden select-none">
      <MacDesktop
        theme={activeTheme}
        dockMagnification={1.45}
        activeApps={['Finder', 'CleanShotX', 'ClipMindAI', 'Terminal']}
      />
    </main>
  );
}`,
    },
    'CleanShot.ts': {
      name: 'CleanShot.ts',
      language: 'typescript',
      content: `// CleanShot X Screen Capture Engine
export interface CaptureOptions {
  mode: 'fullscreen' | 'area' | 'window';
  soundEnabled: boolean;
  shutterDelayMs: number;
}

export async function captureRegion(rect: { x: number; y: number; width: number; height: number }) {
  console.log('Capturing region with CleanShot X...', rect);
  return {
    success: true,
    timestamp: Date.now(),
    dimensions: rect,
  };
}`,
    },
    'StorageHub.sqlite': {
      name: 'StorageHub.sqlite',
      language: 'sql',
      content: `-- StorageHub SQLite WAL Database Schema
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'Development',
  is_favorite INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL
);`,
    },
    'styles.css': {
      name: 'styles.css',
      language: 'css',
      content: `/* macOS Frosted Glass Surface */
.mac-acrylic-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
}

.dark .mac-acrylic-glass {
  background: rgba(24, 24, 32, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
}`,
    },
  };

  const [activeFileName, setActiveFileName] = useState<string>('App.tsx');
  const [openFiles, setOpenFiles] = useState<string[]>(['App.tsx', 'CleanShot.ts', 'StorageHub.sqlite']);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const activeFile = files[activeFileName] || files['App.tsx'];

  const runCode = () => {
    playSound.tink();
    setIsRunning(true);
    setTerminalOutput(`> Executing ${activeFileName} with Node.js v22.11.0...\n`);

    setTimeout(() => {
      setTerminalOutput(
        (prev) =>
          prev +
          `\n[V8 Engine] Compiling TypeScript AST...\n[Build] 0 errors, 0 warnings.\n[StorageHub] System verified and running at http://localhost:3000\nDone in 142ms.`
      );
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#cccccc] font-sans select-none overflow-hidden">
      {/* Activity Bar Left */}
      <div className="w-12 bg-[#333333]/70 border-r border-white/5 flex flex-col items-center py-3 gap-5 shrink-0 text-[#858585]">
        <button className="text-white hover:text-white transition">
          <FileCode className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition">
          <Search className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition">
          <GitBranch className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition">
          <Bug className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition">
          <Boxes className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button className="hover:text-white transition">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Explorer Sidebar */}
      <div className="w-52 bg-[#252526] border-r border-white/5 flex flex-col shrink-0 text-xs">
        <div className="px-4 py-2 font-semibold uppercase text-[11px] tracking-wider text-[#8e8e8e] border-b border-white/5">
          Explorer: StorageHub
        </div>

        <div className="p-2 space-y-1">
          <div className="flex items-center gap-1 font-semibold text-white/80 px-1 py-0.5">
            <ChevronDown className="w-3.5 h-3.5" />
            <Folder className="w-3.5 h-3.5 text-blue-400" />
            <span>src</span>
          </div>

          <div className="pl-4 space-y-0.5">
            {Object.keys(files).map((name) => {
              const isSelected = activeFileName === name;
              return (
                <div
                  key={name}
                  onClick={() => {
                    setActiveFileName(name);
                    if (!openFiles.includes(name)) setOpenFiles([...openFiles, name]);
                    playSound.tink();
                  }}
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition ${
                    isSelected ? 'bg-[#37373d] text-white font-medium' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${name.endsWith('.tsx') ? 'text-blue-400' : name.endsWith('.ts') ? 'text-sky-400' : name.endsWith('.sqlite') ? 'text-amber-400' : 'text-purple-400'}`} />
                  <span className="truncate">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor & Execution Pane */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
        {/* Editor Tabs */}
        <div className="flex items-center justify-between bg-[#252526] border-b border-white/5 overflow-x-auto shrink-0">
          <div className="flex items-center">
            {openFiles.map((name) => {
              const isSelected = activeFileName === name;
              return (
                <div
                  key={name}
                  onClick={() => {
                    setActiveFileName(name);
                    playSound.tink();
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs border-r border-white/5 cursor-pointer transition ${
                    isSelected ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#252526]'
                  }`}
                >
                  <FileCode className="w-3 h-3 text-blue-400" />
                  <span>{name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (openFiles.length > 1) {
                        const remaining = openFiles.filter((f) => f !== name);
                        setOpenFiles(remaining);
                        if (activeFileName === name) setActiveFileName(remaining[0]);
                      }
                    }}
                    className="hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 mr-3 px-3 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Run</span>
          </button>
        </div>

        {/* Code Editor View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Line Numbers */}
          <div className="w-12 py-3 bg-[#1e1e1e] text-right pr-3 select-none text-[#858585] text-xs font-mono shrink-0 leading-6 border-r border-white/5">
            {activeFile.content.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <div className="flex-1 p-3 overflow-auto font-mono text-xs leading-6 text-[#d4d4d4] whitespace-pre bg-[#1e1e1e]">
            {activeFile.content}
          </div>
        </div>

        {/* Console / Output Drawer */}
        {terminalOutput && (
          <div className="h-32 bg-[#181818] border-t border-white/10 p-3 font-mono text-xs text-emerald-400 overflow-y-auto">
            <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-bold mb-1">
              <span>Terminal Output</span>
              <button onClick={() => setTerminalOutput('')} className="hover:text-white">Clear</button>
            </div>
            <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
