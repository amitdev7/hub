'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trash2, ExternalLink, Download, Plus, RefreshCw, Eye } from 'lucide-react';
import { ActivityLog } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/Toast';

export default function RecentActivityPage() {
  const { success, error } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/activity');
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm('Clear all recent activity history? This action cannot be undone.')) {
      return;
    }
    try {
      await fetch('/api/activity', { method: 'DELETE' });
      success('Activity history cleared');
      setLogs([]);
    } catch {
      error('Failed to clear history');
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'open':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Eye className="w-3 h-3" /> Opened
          </span>
        );
      case 'download':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Download className="w-3 h-3" /> Downloaded
          </span>
        );
      case 'create':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Plus className="w-3 h-3" /> Created
          </span>
        );
      case 'delete':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-3 h-3" /> Deleted
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-500" />
            <span>Recently Opened & Activity Audit</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-normal">
              {logs.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit history tracking resources clicked, files downloaded, and administrative updates.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <Clock className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            No recent activity recorded
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Opening links or downloading files will automatically populate your activity feed here.
          </p>
        </div>
      ) : (
        <div className="bg-white/90 dark:bg-[#161822]/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  {getActionBadge(log.action)}
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {log.details || log.action}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                  {formatRelativeTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
