'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Crop,
  Download,
  Copy,
  Trash2,
  Share2,
  Video,
  Clock,
  Pin,
  Check,
  RotateCcw,
  Square,
  Type,
  ArrowUpRight,
  Eye,
  Sparkles,
  Layers,
  Sliders,
  Maximize,
  Play,
  Square as StopIcon,
} from 'lucide-react';
import { ScreenshotCapture } from '../types';
import { playSound } from '../useSound';

interface CleanShotAppProps {
  onCaptureDesktop?: (mode: 'fullscreen' | 'area') => void;
  onSaveToStorageHub?: (file: { name: string; dataUrl: string; size: number }) => void;
}

export function CleanShotApp({ onCaptureDesktop, onSaveToStorageHub }: CleanShotAppProps) {
  const [captures, setCaptures] = useState<ScreenshotCapture[]>(() => {
    // Generate initial sample high-res screenshots
    return [
      {
        id: 'cs-1',
        title: 'CleanShot X — Quick Annotation.png',
        timestamp: 'Just now',
        width: 1920,
        height: 1080,
        pinned: true,
        dataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'cs-2',
        title: 'macOS Sequoia Architecture.png',
        timestamp: '10 mins ago',
        width: 1440,
        height: 900,
        pinned: false,
        dataUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      },
    ];
  });

  const [activeCapture, setActiveCapture] = useState<ScreenshotCapture | null>(captures[0] || null);
  const [activeTool, setActiveTool] = useState<'arrow' | 'rect' | 'text' | 'highlight' | 'blur' | 'crop'>('arrow');
  const [activeColor, setActiveColor] = useState<string>('#FF3B30'); // CleanShot orange-red
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Canvas ref for annotations
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Load active image onto canvas
  useEffect(() => {
    if (!activeCapture || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeCapture.dataUrl;
    img.onload = () => {
      canvas.width = img.width || 800;
      canvas.height = img.height || 500;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [activeCapture]);

  // Handle capture actions
  const triggerCapture = (mode: 'fullscreen' | 'area' | 'window') => {
    playSound.shutter();

    // Create a new simulated capture snapshot
    const id = 'cs-' + Date.now();
    const newCap: ScreenshotCapture = {
      id,
      title: `CleanShot_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.png`,
      timestamp: 'Just now',
      width: 1440,
      height: 900,
      pinned: true,
      dataUrl:
        mode === 'fullscreen'
          ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    };

    setCaptures((prev) => [newCap, ...prev]);
    setActiveCapture(newCap);

    if (onCaptureDesktop) {
      onCaptureDesktop(mode === 'area' ? 'area' : 'fullscreen');
    }
  };

  const handleCopy = (cap: ScreenshotCapture) => {
    playSound.tink();
    navigator.clipboard.writeText(cap.dataUrl).catch(() => {});
    setCopiedId(cap.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (cap: ScreenshotCapture) => {
    playSound.tink();
    const a = document.createElement('a');
    a.href = cap.dataUrl;
    a.download = cap.title;
    a.click();
  };

  const handleSaveToStorage = (cap: ScreenshotCapture) => {
    playSound.tink();
    if (onSaveToStorageHub) {
      onSaveToStorageHub({
        name: cap.title,
        dataUrl: cap.dataUrl,
        size: 1024 * 750,
      });
    }
    setSavedId(cap.id);
    setTimeout(() => setSavedId(null), 2500);
  };

  // Canvas drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    startPosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
    isDrawingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const endX = (e.clientX - rect.left) * scaleX;
    const endY = (e.clientY - rect.top) * scaleY;
    const startX = startPosRef.current.x;
    const startY = startPosRef.current.y;

    ctx.strokeStyle = activeColor;
    ctx.fillStyle = activeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'arrow') {
      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead
      const headlen = 22;
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    } else if (activeTool === 'rect') {
      ctx.beginPath();
      ctx.roundRect(startX, startY, endX - startX, endY - startY, 8);
      ctx.stroke();
    } else if (activeTool === 'highlight') {
      ctx.save();
      ctx.fillStyle = activeColor + '40'; // 25% opacity
      ctx.fillRect(startX, startY, endX - startX, endY - startY);
      ctx.restore();
    } else if (activeTool === 'text') {
      ctx.font = `bold ${strokeWidth * 6}px -apple-system, sans-serif`;
      ctx.fillText('CleanShot X Annotation', startX, startY);
    } else if (activeTool === 'blur') {
      // Simulated blur overlay
      ctx.save();
      ctx.fillStyle = 'rgba(100, 100, 100, 0.85)';
      ctx.fillRect(startX, startY, endX - startX, endY - startY);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText('••••••••••••', startX + 8, startY + (endY - startY) / 2 + 4);
      ctx.restore();
    }

    isDrawingRef.current = false;
    playSound.tink();
  };

  const colors = [
    { name: 'Red', hex: '#FF3B30' },
    { name: 'Orange', hex: '#FF9500' },
    { name: 'Green', hex: '#34C759' },
    { name: 'Blue', hex: '#007AFF' },
    { name: 'Purple', hex: '#AF52DE' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-white select-none">
      {/* Top CleanShot X Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#282830] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center p-1 shadow">
            <img src="/app-icons/cleanshot/128.webp" alt="CleanShot X" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wide">CleanShot X</div>
            <div className="text-[10px] text-white/50">Pro Screen Capture &amp; Recording</div>
          </div>
        </div>

        {/* Capture Quick Buttons */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => triggerCapture('area')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition active:scale-95"
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Capture Area</span>
          </button>
          <button
            onClick={() => triggerCapture('fullscreen')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 text-white/90 transition active:scale-95"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
          <button
            onClick={() => triggerCapture('window')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 text-white/90 transition active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Window</span>
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-1" />
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              playSound.tink();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition active:scale-95 ${
              isRecording ? 'bg-red-600 text-white animate-pulse' : 'hover:bg-white/10 text-white/90'
            }`}
          >
            {isRecording ? <StopIcon className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-red-400" />}
            <span>{isRecording ? `00:${recordSeconds.toString().padStart(2, '0')}` : 'Record'}</span>
          </button>
        </div>

        {/* Global Export actions */}
        {activeCapture && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCopy(activeCapture)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition text-white/90"
              title="Copy to Clipboard"
            >
              {copiedId === activeCapture.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === activeCapture.id ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={() => handleSaveToStorage(activeCapture)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-emerald-600/80 hover:bg-emerald-600 transition text-white"
              title="Save to StorageHub Files"
            >
              {savedId === activeCapture.id ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{savedId === activeCapture.id ? 'Saved!' : 'Save'}</span>
            </button>
            <button
              onClick={() => handleDownload(activeCapture)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/90"
              title="Download PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Gallery Sidebar */}
        <div className="w-56 bg-[#212128] border-r border-white/10 flex flex-col shrink-0">
          <div className="px-3 py-2 text-[11px] font-semibold text-white/50 tracking-wider uppercase flex items-center justify-between">
            <span>Recent Captures</span>
            <span className="text-white/40">{captures.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1.5">
            {captures.map((cap) => {
              const isSelected = activeCapture?.id === cap.id;
              return (
                <div
                  key={cap.id}
                  onClick={() => {
                    setActiveCapture(cap);
                    playSound.tink();
                  }}
                  className={`p-2 rounded-xl cursor-pointer transition flex items-center gap-2.5 group ${
                    isSelected ? 'bg-blue-600/30 border border-blue-500/50' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="w-12 h-9 rounded-md overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center">
                    <img src={cap.dataUrl} alt={cap.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate text-white/90">{cap.title}</div>
                    <div className="text-[10px] text-white/40">{cap.timestamp}</div>
                  </div>
                  {cap.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="p-2 border-t border-white/10 bg-[#1c1c22]">
            <button
              onClick={() => {
                playSound.trash();
                setCaptures([]);
                setActiveCapture(null);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Center / Right Canvas Editor */}
        <div className="flex-1 flex flex-col bg-[#16161c] overflow-hidden relative">
          {/* Annotation Sub-bar */}
          <div className="px-4 py-2 bg-[#1f1f26] border-b border-white/10 flex items-center justify-between shrink-0">
            {/* Tools */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTool('arrow')}
                className={`p-1.5 rounded-lg transition ${activeTool === 'arrow' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'}`}
                title="Arrow Tool"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('rect')}
                className={`p-1.5 rounded-lg transition ${activeTool === 'rect' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'}`}
                title="Rectangle Tool"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('text')}
                className={`p-1.5 rounded-lg transition ${activeTool === 'text' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'}`}
                title="Text Callout"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('highlight')}
                className={`p-1.5 rounded-lg transition ${activeTool === 'highlight' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'}`}
                title="Highlighter"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool('blur')}
                className={`p-1.5 rounded-lg transition ${activeTool === 'blur' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'}`}
                title="Pixelate / Blur Tool"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Color Palette */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1.5 rounded-xl border border-white/10">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setActiveColor(c.hex)}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    activeColor === c.hex ? 'scale-125 border-white ring-2 ring-blue-500' : 'border-white/30 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Stroke Width Slider */}
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>Size</span>
              <input
                type="range"
                min="2"
                max="12"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
              <span className="w-4 text-right">{strokeWidth}</span>
            </div>
          </div>

          {/* Interactive Canvas Canvas View */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[radial-gradient(#252530_1px,transparent_1px)] [background-size:16px_16px]">
            {activeCapture ? (
              <div className="relative max-w-full max-h-full rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-black">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  className="max-w-full max-h-[65vh] object-contain cursor-crosshair block"
                />
              </div>
            ) : (
              <div className="text-center text-white/40">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <div className="text-sm font-medium">No screenshot selected</div>
                <div className="text-xs mt-1">Click "Capture Area" or "Fullscreen" to take a snap</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
