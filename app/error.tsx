'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('StorageHub Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl mb-6 shadow-xl">
        
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        StorageHub System Recovery
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {error?.message || 'A client-side initialization state was interrupted. You can easily reload or return to the public portal.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          Reload Interface
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide border border-white/10 transition-all active:scale-95"
        >
          Return to Portal
        </Link>
      </div>

      <div className="mt-8 text-[11px] text-slate-500 font-mono">
        StorageHub v1.0 • High-Availability Command Center
      </div>
    </div>
  );
}
