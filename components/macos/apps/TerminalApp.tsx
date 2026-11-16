'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, Sparkles, Folder, Play, Check } from 'lucide-react';
import { AppID } from '../types';
import { playSound } from '../useSound';

interface TerminalAppProps {
  onOpenApp?: (appId: AppID) => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export function TerminalApp({ onOpenApp }: TerminalAppProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'neofetch',
      output: renderNeofetch(),
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  function renderNeofetch() {
    return (
      <div className="flex flex-col sm:flex-row gap-6 my-2 font-mono text-xs select-text">
        <div className="text-emerald-400 font-bold leading-none select-none text-[11px]">
          <pre>{`
                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' lGEMINIc
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  .XNMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.
          `}</pre>
        </div>
        <div className="space-y-1 text-white/90">
          <div className="font-bold text-white">guest@MacBook-Pro</div>
          <div className="text-white/40">--------------------</div>
          <div><span className="text-blue-400 font-semibold">OS:</span> macOS Sequoia 15.3 (24D60) arm64</div>
          <div><span className="text-blue-400 font-semibold">Host:</span> MacBookPro18,2 (MacBook Pro 16-inch, 2026)</div>
          <div><span className="text-blue-400 font-semibold">Kernel:</span> Darwin 24.3.0 Darwin Kernel Version</div>
          <div><span className="text-blue-400 font-semibold">Uptime:</span> 14 days, 6 hours, 42 mins</div>
          <div><span className="text-blue-400 font-semibold">Shell:</span> zsh 5.9 (x86_64-apple-darwin24.0)</div>
          <div><span className="text-blue-400 font-semibold">Resolution:</span> 3456x2234 @ 120Hz Liquid Retina XDR</div>
          <div><span className="text-blue-400 font-semibold">DE:</span> Aqua (macOS Web Engine)</div>
          <div><span className="text-blue-400 font-semibold">CPU:</span> Apple M3 Max (16 cores: 12 performance / 4 efficiency)</div>
          <div><span className="text-blue-400 font-semibold">GPU:</span> Apple M3 Max 40-core GPU</div>
          <div><span className="text-blue-400 font-semibold">Memory:</span> 18432MiB / 65536MiB (28%)</div>
          <div className="flex gap-1.5 pt-2">
            {['bg-black', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-white'].map((c, i) => (
              <span key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleCommand = (cmd: string) => {
    const raw = cmd.trim();
    if (!raw) return;

    playSound.tink();
    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Save history
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    let output: React.ReactNode = null;

    switch (command) {
      case 'help':
      case '?':
        output = (
          <div className="space-y-1 text-white/80 text-xs font-mono">
            <div className="text-emerald-400 font-semibold">Available Commands:</div>
            <div>• <span className="text-cyan-400">neofetch</span>: Display system hardware &amp; OS summary</div>
            <div>• <span className="text-cyan-400">ls</span>: List files and directory structure</div>
            <div>• <span className="text-cyan-400">cat &lt;file&gt;</span>: View file content</div>
            <div>• <span className="text-cyan-400">clear</span>: Clear terminal console</div>
            <div>• <span className="text-cyan-400">date</span>: Display system date and time</div>
            <div>• <span className="text-cyan-400">whoami</span>: Print current logged-in username</div>
            <div>• <span className="text-cyan-400">uname -a</span>: Print kernel and platform information</div>
            <div>• <span className="text-cyan-400">echo &lt;text&gt;</span>: Print arbitrary text</div>
            <div>• <span className="text-cyan-400">curl &lt;url&gt;</span>: Fetch content from web endpoint</div>
            <div>• <span className="text-cyan-400">open &lt;app&gt;</span>: Launch app (cleanshot, unarchiver, clipmind, safari, notes, calc)</div>
            <div>• <span className="text-cyan-400">matrix</span>: Run digital rain effect</div>
            <div>• <span className="text-cyan-400">cowsay &lt;text&gt;</span>: ASCII cow says text</div>
          </div>
        );
        break;

      case 'neofetch':
      case 'macfetch':
        output = renderNeofetch();
        break;

      case 'clear':
        setLogs([]);
        return;

      case 'ls':
        output = (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs font-mono text-white/90">
            <span className="text-blue-400 font-semibold">Applications/</span>
            <span className="text-blue-400 font-semibold">Desktop/</span>
            <span className="text-blue-400 font-semibold">Documents/</span>
            <span className="text-blue-400 font-semibold">Downloads/</span>
            <span className="text-purple-400 font-semibold">StorageHub/</span>
            <span className="text-emerald-400 font-semibold">CleanShot.app</span>
            <span className="text-emerald-400 font-semibold">Unarchiver.app</span>
            <span className="text-emerald-400 font-semibold">ClipMind.app</span>
            <span className="text-amber-400">README.md</span>
            <span className="text-amber-400">storagehub.db</span>
          </div>
        );
        break;

      case 'whoami':
        output = <div className="text-xs font-mono text-emerald-400">guest</div>;
        break;

      case 'date':
        output = <div className="text-xs font-mono text-white/90">{new Date().toString()}</div>;
        break;

      case 'uname':
        output = (
          <div className="text-xs font-mono text-white/90">
            Darwin MacBook-Pro.local 24.3.0 Darwin Kernel Version 24.3.0: Apple Silicon arm64
          </div>
        );
        break;

      case 'echo':
        output = <div className="text-xs font-mono text-white/90">{args.join(' ')}</div>;
        break;

      case 'cat':
        if (args[0] === 'README.md') {
          output = (
            <div className="text-xs font-mono text-white/80 whitespace-pre-wrap leading-relaxed">
              # StorageHub — macOS Web Simulator Edition{'\n'}
              Enterprise-grade digital resource command center with full 1:1 macOS Big Sur/Sequoia interface,{'\n'}
              CleanShot X screen capture, The Unarchiver archive utility, and ClipMind AI clipboard assistant.
            </div>
          );
        } else {
          output = <div className="text-xs font-mono text-red-400">cat: {args[0] || 'file'}: No such file or directory</div>;
        }
        break;

      case 'matrix':
        output = (
          <div className="text-xs font-mono text-green-400 animate-pulse leading-none py-1">
            01000001 01110000 01110000 01101100 01100101 00100000 01001101 01100001 01100011 01001111 01010011{'\n'}
            Wake up, Neo... The Matrix has you. Follow the white rabbit.
          </div>
        );
        break;

      case 'cowsay':
        const say = args.join(' ') || 'macOS Web Simulator is awesome!';
        output = (
          <pre className="text-xs font-mono text-amber-300 leading-tight">
{`
  < ${say} >
   -------------------------
          \\   ^__^
           \\  (oo)\\_______
              (__)\\       )\\/\\
                  ||----w |
                  ||     ||
`}
          </pre>
        );
        break;

      case 'open':
        const app = args[0]?.toLowerCase() as AppID;
        if (app && onOpenApp) {
          onOpenApp(app);
          output = <div className="text-xs font-mono text-emerald-400">Opened {app} successfully.</div>;
        } else {
          output = <div className="text-xs font-mono text-yellow-400">Usage: open [cleanshot|unarchiver|clipmind|safari|notes|calculator|music]</div>;
        }
        break;

      default:
        output = (
          <div className="text-xs font-mono text-red-400">
            zsh: command not found: {command}. Type <span className="text-white underline">help</span> for a list of commands.
          </div>
        );
        break;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: 'cmd-' + Date.now(),
        command: raw,
        output,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInputVal(history[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-[#181822]/95 text-white font-mono p-4 overflow-y-auto select-text cursor-text"
    >
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-semibold">guest@MacBook-Pro</span>
              <span className="text-white/40">:</span>
              <span className="text-cyan-400 font-semibold">~</span>
              <span className="text-white/60">%</span>
              <span className="text-white font-medium">{log.command}</span>
            </div>
            <div>{log.output}</div>
          </div>
        ))}
      </div>

      {/* Live Input Line */}
      <div className="flex items-center gap-2 text-xs mt-3 shrink-0">
        <span className="text-emerald-400 font-semibold">guest@MacBook-Pro</span>
        <span className="text-white/40">:</span>
        <span className="text-cyan-400 font-semibold">~</span>
        <span className="text-white/60">%</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-white outline-hidden font-mono text-xs caret-white"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
