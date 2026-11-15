export type ResourceType =
  | 'link'
  | 'file'
  | 'youtube'
  | 'gdrive'
  | 'email'
  | 'phone'
  | 'local_ref';

export type Visibility = 'public' | 'private';

export type FileCategory =
  | 'document'
  | 'image'
  | 'media'
  | 'archive'
  | 'code'
  | 'other';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor';
  createdAt: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  displayOrder: number;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  resourceCount?: number;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  thumbnail?: string;
  resourceType: ResourceType;
  category: string;
  collectionId?: string;
  collectionName?: string;
  collectionColor?: string;
  visibility: Visibility;
  isFavorite: boolean;
  isPinned: boolean;
  displayOrder: number;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  fileMime?: string;
  clickCount: number;
  tags: string[];
  customCss?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FileItem {
  id: string;
  filename: string;
  storedFilename: string;
  fileSize: number;
  mimeType: string;
  category: FileCategory;
  description?: string;
  collectionId?: string;
  collectionName?: string;
  visibility: Visibility;
  downloadCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface ActivityLog {
  id: string;
  resourceId?: string;
  resourceTitle?: string;
  action: 'open' | 'download' | 'create' | 'update' | 'delete';
  details?: string;
  timestamp: number;
}

export interface AppSettings {
  siteTitle: string;
  siteDescription: string;
  ownerName: string;
  ownerBio: string;
  ownerAvatar: string;
  accentColor: string;
  defaultTheme: 'system' | 'light' | 'dark';
  allowPublicDownloads: boolean;
  dockEnabled: boolean;
  trafficLightsEnabled: boolean;
}
