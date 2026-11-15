'use client';

import React, { useState } from 'react';
import { HardDrive, Cloud, Folder, FileText, Camera } from 'lucide-react';
import { AppID } from './types';
import { playSound } from './useSound';

interface DesktopIconsProps {
  onOpenApp: (appId: AppID, customData?: any) => void;
}

interface DesktopFile {
  id: string;
  name: string;
  type: 'drive' | 'folder' | 'app';
  targetApp?: AppID;
  customData?: any;
  icon: string | React.ReactNode;
}

export function DesktopIcons({ onOpenApp }: DesktopIconsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const desktopFiles: DesktopFile[] = [
    {
      id: 'dt-mac-hd',
      name: 'Macintosh HD',
      type: 'drive',
      targetApp: 'finder',
      customData: { folder: 'Macintosh HD' },
      icon: (
        <div className="w-12 h-12 flex items-center justify-center">
          <HardDrive className="w-11 h-11 text-slate-200 fill-slate-300 drop-shadow-md" />
        </div>
      ),
    },
    {
      id: 'dt-storagehub',
      name: 'StorageHub Drive',
      type: 'drive',
      targetApp: 'storagehub',
      icon: (
        <div className="w-12 h-12 flex items-center justify-center">
          <Cloud className="w-11 h-11 text-blue-400 fill-blue-300 drop-shadow-md" />
        </div>
      ),
    },
    {
      id: 'dt-cleanshot',
      name: 'CleanShot X',
      type: 'app',
      targetApp: 'cleanshot',
      icon: (
        <img
          src="/app-icons/cleanshot/128.webp"
          alt="CleanShot X"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
      ),
    },
    {
      id: 'dt-clipmind',
      name: 'ClipMind AI',
      type: 'app',
      targetApp: 'clipmind',
      icon: (
        <img
          src="/app-icons/clipmind/128.webp"
          alt="ClipMind AI"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
      ),
    },
    {
      id: 'dt-projects',
      name: 'Projects & DevOS',
      type: 'folder',
      targetApp: 'portfolio',
      icon: (
        <div className="w-12 h-12 flex items-center justify-center">
          <Folder className="w-11 h-11 text-sky-500 fill-sky-400 drop-shadow-md" />
        </div>
      ),
    },
    {
      id: 'dt-notes',
      name: 'Welcome-Notes',
      type: 'app',
      targetApp: 'notes',
      icon: (
        <img
          src="/app-icons/notes/256.png"
          alt="Notes"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
      ),
    },
  ];

  return (
    <div
      onClick={() => setSelectedId(null)}
      className="absolute top-10 right-4 flex flex-col gap-5 p-2 select-none z-10"
    >
      {desktopFiles.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(item.id);
              playSound.tink();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              playSound.tink();
              if (item.targetApp) {
                onOpenApp(item.targetApp, item.customData);
              }
            }}
            className={`flex flex-col items-center w-20 p-1.5 rounded-xl cursor-pointer text-center group transition ${
              isSelected ? 'bg-blue-600/30 ring-1 ring-blue-500/60' : 'hover:bg-white/10'
            }`}
          >
            <div className="group-hover:scale-105 transition duration-150">{item.icon}</div>
            <span
              className={`text-xs font-semibold text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.9)] px-1.5 py-0.5 rounded mt-1 line-clamp-2 leading-tight break-all ${
                isSelected ? 'bg-blue-600' : ''
              }`}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
