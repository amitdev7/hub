'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/Toast';
import { MacWindowFrame } from '@/components/MacWindowFrame';
import { MacSidebar } from '@/components/MacSidebar';
import { MacDock } from '@/components/MacDock';
import { CommandPalette } from '@/components/CommandPalette';
import { ResourceFormModal } from '@/components/ResourceFormModal';
import { FileUploadModal } from '@/components/FileUploadModal';
import { CollectionFormModal } from '@/components/CollectionFormModal';
import { ShareModal } from '@/components/ShareModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const [cmdOpen, setCmdOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // If login page, render clean standalone frame
  if (isLoginPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen ambient-bg flex items-center justify-center p-4">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <MacWindowFrame
        onOpenResourceModal={() => setResourceModalOpen(true)}
        onOpenFileUploadModal={() => setUploadModalOpen(true)}
        onOpenCommandPalette={() => setCmdOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
      >
        <MacSidebar
          onOpenResourceModal={() => setResourceModalOpen(true)}
          onOpenCollectionModal={() => setCollectionModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto min-h-0 bg-white/40 dark:bg-black/10">
          {children}
        </main>
      </MacWindowFrame>

      {/* macOS Bottom Dock */}
      <MacDock
        onOpenResourceModal={() => setResourceModalOpen(true)}
        onOpenFileUploadModal={() => setUploadModalOpen(true)}
        onOpenCommandPalette={() => setCmdOpen(true)}
      />

      {/* Global Modals */}
      <CommandPalette
        open={cmdOpen}
        setOpen={setCmdOpen}
        onOpenResourceModal={() => setResourceModalOpen(true)}
        onOpenFileUploadModal={() => setUploadModalOpen(true)}
        onOpenCollectionModal={() => setCollectionModalOpen(true)}
      />

      <ResourceFormModal
        open={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        onSaved={() => {
          // Trigger route refresh
          window.dispatchEvent(new Event('storagehub-refresh'));
        }}
      />

      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={() => {
          window.dispatchEvent(new Event('storagehub-refresh'));
        }}
      />

      <CollectionFormModal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        onSaved={() => {
          window.dispatchEvent(new Event('storagehub-refresh'));
        }}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </ToastProvider>
  );
}
