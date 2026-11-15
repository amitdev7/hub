'use client';

import React, { useState, useRef } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { WindowState } from './types';
import { playSound } from './useSound';

interface MacWindowProps {
  win: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (width: number, height: number) => void;
  children: React.ReactNode;
}

export function MacWindow({
  win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onUpdatePosition,
  onUpdateSize,
  children,
}: MacWindowProps) {
  const [isHoveredTraffic, setIsHoveredTraffic] = useState(false);
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number; initX: number; initY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const resizeRef = useRef<{
    isResizing: boolean;
    edge: string;
    startX: number;
    startY: number;
    initW: number;
    initH: number;
    initX: number;
    initY: number;
  }>({
    isResizing: false,
    edge: '',
    startX: 0,
    startY: 0,
    initW: 0,
    initH: 0,
    initX: 0,
    initY: 0,
  });

  // Handle header dragging
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.traffic-btn')) return;
    onFocus();

    if (win.isMaximized) return;

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: win.x,
      initY: win.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const nextX = Math.max(0, Math.min(screenW - 100, dragRef.current.initX + dx));
      const nextY = Math.max(28, Math.min(screenH - 80, dragRef.current.initY + dy));
      onUpdatePosition(nextX, nextY);
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle resizing
  const handleMouseDownResize = (e: React.MouseEvent, edge: string) => {
    e.stopPropagation();
    onFocus();
    if (win.isMaximized) return;

    resizeRef.current = {
      isResizing: true,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      initW: win.width,
      initH: win.height,
      initX: win.x,
      initY: win.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current.isResizing) return;
      const dx = moveEvent.clientX - resizeRef.current.startX;
      const dy = moveEvent.clientY - resizeRef.current.startY;
      const minW = win.minWidth || 360;
      const minH = win.minHeight || 260;

      let newW = resizeRef.current.initW;
      let newH = resizeRef.current.initH;
      let newX = resizeRef.current.initX;
      let newY = resizeRef.current.initY;

      if (edge.includes('r')) newW = Math.max(minW, resizeRef.current.initW + dx);
      if (edge.includes('b')) newH = Math.max(minH, resizeRef.current.initH + dy);
      if (edge.includes('l')) {
        const potentialW = resizeRef.current.initW - dx;
        if (potentialW >= minW) {
          newW = potentialW;
          newX = resizeRef.current.initX + dx;
        }
      }
      if (edge.includes('t')) {
        const potentialH = resizeRef.current.initH - dy;
        if (potentialH >= minH) {
          newH = potentialH;
          newY = resizeRef.current.initY + dy;
        }
      }

      onUpdateSize(newW, newH);
      if (newX !== win.x || newY !== win.y) {
        onUpdatePosition(newX, newY);
      }
    };

    const handleMouseUp = () => {
      resizeRef.current.isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 28,
        width: '100vw',
        height: 'calc(100vh - 28px - 72px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onClick={onFocus}
      className={`rounded-2xl flex flex-col overflow-hidden transition-shadow duration-200 ${
        isActive
          ? 'shadow-2xl ring-1 ring-black/15 dark:ring-white/20'
          : 'shadow-md opacity-95 ring-1 ring-black/5 dark:ring-white/10'
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={onToggleMaximize}
        className={`h-9 px-3 flex items-center justify-between select-none cursor-default backdrop-blur-2xl transition ${
          isActive
            ? 'bg-white/80 dark:bg-[#22222a]/90 text-[#1d1d1f] dark:text-white border-b border-black/10 dark:border-white/10'
            : 'bg-white/60 dark:bg-[#1a1a20]/80 text-black/50 dark:text-white/40 border-b border-black/5 dark:border-white/5'
        }`}
      >
        {/* macOS Traffic Light Buttons */}
        <div
          onMouseEnter={() => setIsHoveredTraffic(true)}
          onMouseLeave={() => setIsHoveredTraffic(false)}
          className="flex items-center gap-2 w-16"
        >
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.tink();
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] flex items-center justify-center transition active:scale-95 group traffic-btn"
            title="Close"
          >
            {isHoveredTraffic && <X className="w-2 h-2 text-black/70 stroke-[3]" />}
          </button>

          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.tink();
              onMinimize();
            }}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffaa00] border border-[#dea123] flex items-center justify-center transition active:scale-95 group traffic-btn"
            title="Minimize"
          >
            {isHoveredTraffic && <Minus className="w-2 h-2 text-black/70 stroke-[3]" />}
          </button>

          {/* Zoom / Maximize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.tink();
              onToggleMaximize();
            }}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1fb835] border border-[#1aab29] flex items-center justify-center transition active:scale-95 group traffic-btn"
            title="Zoom"
          >
            {isHoveredTraffic && (
              win.isMaximized ? (
                <Minimize2 className="w-2 h-2 text-black/70 stroke-[3]" />
              ) : (
                <Maximize2 className="w-2 h-2 text-black/70 stroke-[3]" />
              )
            )}
          </button>
        </div>

        {/* Window Title & Icon */}
        <div className="flex items-center gap-1.5 text-xs font-semibold truncate max-w-xs pointer-events-none">
          {win.icon && <img src={win.icon} alt="" className="w-3.5 h-3.5 object-contain" />}
          <span>{win.title}</span>
        </div>

        {/* Right header spacer */}
        <div className="w-16" />
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-hidden relative bg-white/95 dark:bg-[#181820]/95 backdrop-blur-2xl">
        {children}
      </div>

      {/* Resize handles */}
      {!win.isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'r')}
            className="absolute top-0 right-0 w-1.5 h-full cursor-e-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'b')}
            className="absolute bottom-0 left-0 w-full h-1.5 cursor-s-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'l')}
            className="absolute top-0 left-0 w-1.5 h-full cursor-w-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 't')}
            className="absolute top-0 left-0 w-full h-1.5 cursor-n-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'rb')}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'lb')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'rt')}
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
          />
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'lt')}
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
          />
        </>
      )}
    </div>
  );
}
