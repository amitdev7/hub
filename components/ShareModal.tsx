'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { X, Copy, Check, Share2, Globe, QrCode } from 'lucide-react';
import { useToast } from './Toast';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  customUrl?: string;
}

export function ShareModal({ open, onClose, title = 'Public Resource Portal', customUrl }: ShareModalProps) {
  const { success } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = customUrl || window.location.origin;
      setShareUrl(url);

      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 180,
          margin: 1,
          color: {
            dark: '#1e1b4b',
            light: '#ffffff',
          },
        });
      }
    }
  }, [open, customUrl]);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    success('Public portal link copied!');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#12141d] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Share {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Scan the QR code on mobile or copy the public link below to access all published resources.
        </p>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-200 mb-5">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* Copy Link Input Bar */}
        <div className="w-full flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs px-2.5 font-mono text-slate-700 dark:text-slate-300 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <button
          onClick={() => window.open(shareUrl, '_blank')}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Open Public Portal in New Tab</span>
        </button>
      </div>
    </div>
  );
}
