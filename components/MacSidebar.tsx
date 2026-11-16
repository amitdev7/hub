'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bookmark,
  FileText,
  FolderKanban,
  Star,
  Clock,
  Palette,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useToast } from './Toast';

export function MacSidebar({
  onOpenResourceModal,
  onOpenCollectionModal,
}: {
  onOpenResourceModal?: () => void;
  onOpenCollectionModal?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { success } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch collections
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections);
      })
      .catch(() => {});

    // Fetch user
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    success('Signed out');
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'All Links', href: '/admin/resources', icon: Bookmark },
    { label: 'My Files', href: '/admin/files', icon: FileText },
    { label: 'Collections', href: '/admin/collections', icon: FolderKanban },
  ];

  const viewItems = [
    { label: 'Favorites', href: '/admin/favorites', icon: Star },
    { label: 'Recently Opened', href: '/admin/recent', icon: Clock },
  ];

  const systemItems = [
    { label: 'Appearance', href: '/admin/appearance', icon: Palette },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Profile Card Header (Exactly like reference image) */}
      <div className="p-4 sm:p-5 border-b border-slate-200/50 dark:border-white/5 flex items-center gap-3.5">
        <div className="relative">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt="Peter Parker"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Welcome back!</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
            {user?.name || 'Peter Parker'}
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Menu Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Collections Section */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Collections</span>
            {onOpenCollectionModal && (
              <button
                onClick={onOpenCollectionModal}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Create Collection"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {collections.slice(0, 6).map((col) => {
              const active = pathname === `/admin/resources` && typeof window !== 'undefined' && window.location.search.includes(col.id);
              return (
                <Link
                  key={col.id}
                  href={`/admin/resources?collection=${col.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="truncate">{col.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-zinc-800 text-slate-500 font-mono">
                    {col.resourceCount || 0}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Views Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Views</div>
          <div className="space-y-0.5">
            {viewItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${active ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System</div>
          <div className="space-y-0.5">
            {systemItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/50 dark:border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/40 dark:hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">StorageHub</span>
        </div>
        {onOpenResourceModal && (
          <button
            onClick={onOpenResourceModal}
            className="px-2.5 py-1 text-xs font-medium bg-indigo-600 text-white rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 lg:w-64 flex-col bg-slate-50/80 dark:bg-black/20 border-r border-slate-200/60 dark:border-white/10 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#12141d] h-full shadow-2xl flex flex-col z-10">
            <div className="p-3 flex justify-end">
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
