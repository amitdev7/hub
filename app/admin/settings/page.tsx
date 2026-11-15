'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Database, Shield, Download, Save, HardDrive, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function SettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [siteTitle, setSiteTitle] = useState('StorageHub Command Center');
  const [siteDescription, setSiteDescription] = useState('A unified digital command center for files, curated links, and essential resources.');
  const [ownerName, setOwnerName] = useState('Peter Parker');
  const [ownerBio, setOwnerBio] = useState('Senior Full-Stack Software Engineer & Digital Curator');
  const [ownerAvatar, setOwnerAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.siteTitle) setSiteTitle(data.settings.siteTitle);
          if (data.settings.siteDescription) setSiteDescription(data.settings.siteDescription);
          if (data.settings.ownerName) setOwnerName(data.settings.ownerName);
          if (data.settings.ownerBio) setOwnerBio(data.settings.ownerBio);
          if (data.settings.ownerAvatar) setOwnerAvatar(data.settings.ownerAvatar);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteTitle,
          siteDescription,
          ownerName,
          ownerBio,
          ownerAvatar,
        }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      success('System settings saved successfully!');
    } catch (err: any) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const [resRes, fileRes, colRes] = await Promise.all([
        fetch('/api/resources').then((r) => r.json()),
        fetch('/api/files').then((r) => r.json()),
        fetch('/api/collections').then((r) => r.json()),
      ]);

      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        resources: resRes.resources || [],
        files: fileRes.files || [],
        collections: colRes.collections || [],
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storagehub_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      success('Database backup exported to JSON');
    } catch {
      error('Failed to export backup');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl">
      <div className="border-b border-slate-200/60 dark:border-white/10 pb-5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          <span>System Settings & Profile</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure branding, public profile identity, persistent database exports, and security.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* Branding & Profile */}
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#161822]/80 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <span>Public Profile & Site Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Portal Title
              </label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Administrator / Curator Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Public Description
            </label>
            <textarea
              rows={2}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Curator Bio
              </label>
              <input
                type="text"
                value={ownerBio}
                onChange={(e) => setOwnerBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={ownerAvatar}
                onChange={(e) => setOwnerAvatar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Branding Changes</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Storage Section */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#161822]/80 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-xs text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          <span>Persistent Storage & JSON Data Export</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          StorageHub stores all collections, metadata, and files persistently in local SQLite (`data/storagehub.db`) and disk storage (`uploads/`). You can download a complete JSON backup of all resources, files, and collection relations at any time.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/10 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Download JSON Data Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
