'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl mb-6 shadow-xl">
          
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          StorageHub Safe Mode
        </h1>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          {error?.message || 'Application recovered into safe mode.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-indigo-600/20"
        >
          Reload Interface
        </button>
      </body>
    </html>
  );
}
