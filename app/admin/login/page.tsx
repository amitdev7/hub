'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      success(`Welcome back, ${data.user.name || 'Admin'}!`);
      router.push('/admin');
    } catch (err: any) {
      error(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/85 dark:bg-[#12141d]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
      {/* macOS Traffic Lights Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-400">StorageHub v1.0</span>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          Administrator Command Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to curate, organize, and manage digital resources.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Username or Email
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Demo Credentials Tip */}
        <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
          <span>Default: <strong>admin</strong> / <strong>adminpassword123</strong></span>
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('adminpassword123');
            }}
            className="text-[10px] font-semibold underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
          >
            Autofill
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Public portal link */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Back to Public Visitor Portal</span>
        </Link>
      </div>
    </div>
  );
}
