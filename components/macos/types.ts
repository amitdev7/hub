export type AppID =
  | 'finder'
  | 'safari'
  | 'terminal'
  | 'settings'
  | 'notes'
  | 'calculator'
  | 'music'
  | 'photos'
  | 'vscode'
  | 'cleanshot'
  | 'unarchiver'
  | 'clipmind'
  | 'portfolio'
  | 'storagehub'
  | 'appstore'
  | 'trash';

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  customData?: any;
}

export interface DockAppItem {
  id: AppID;
  title: string;
  icon: string;
  isOpen: boolean;
  isRunning: boolean;
  badge?: number | string;
}

export interface DesktopItem {
  id: string;
  name: string;
  icon: string;
  type: 'folder' | 'drive' | 'file' | 'app';
  targetApp?: AppID;
  targetPath?: string;
  gridRow: number;
  gridCol: number;
}

export interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface ClipItem {
  id: string;
  content: string;
  type: 'text' | 'code' | 'link' | 'image';
  timestamp: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  language?: string;
  charCount?: number;
}

export interface ArchiveFileEntry {
  name: string;
  size: number;
  compressedSize: number;
  type: string;
  modified: string;
}

export interface ArchivePackage {
  id: string;
  name: string;
  size: string;
  fileCount: number;
  files: ArchiveFileEntry[];
}

export interface ScreenshotCapture {
  id: string;
  title: string;
  timestamp: string;
  dataUrl: string;
  width: number;
  height: number;
  pinned?: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface WallpaperOption {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
  isDark: boolean;
  type: 'sonoma' | 'sequoia' | 'ventura' | 'monterey' | 'big-sur' | 'solar' | 'catalina';
}
