import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { categorizeFile, sanitizeFilename } from './utils';
import { FileCategory } from './types';

const isVercel = Boolean(process.env.VERCEL);
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // ignore read-only fs in edge cases
}

export interface SavedFileResult {
  filename: string;
  storedFilename: string;
  fileSize: number;
  mimeType: string;
  category: FileCategory;
  absolutePath: string;
}

/**
 * Save an uploaded file buffer securely to the uploads directory.
 */
export async function saveUploadedFile(file: File): Promise<SavedFileResult> {
  const originalName = sanitizeFilename(file.name || 'unnamed-file');
  const fileId = crypto.randomUUID();
  const storedFilename = `${fileId}-${originalName}`;
  const absolutePath = path.join(UPLOADS_DIR, storedFilename);

  // Security check: ensure path is strictly within UPLOADS_DIR
  if (!absolutePath.startsWith(UPLOADS_DIR)) {
    throw new Error('Invalid file destination detected.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  fs.writeFileSync(absolutePath, buffer);

  const mimeType = file.type || 'application/octet-stream';
  const category = categorizeFile(mimeType, originalName);

  return {
    filename: originalName,
    storedFilename,
    fileSize: buffer.length,
    mimeType,
    category,
    absolutePath,
  };
}

/**
 * Resolve and validate the absolute path for a stored file.
 * Throws if file attempts directory traversal or does not exist.
 */
export function getSafeFilePath(storedFilename: string): string {
  // Disallow any path separators in storedFilename
  const sanitized = path.basename(storedFilename);
  const resolved = path.join(UPLOADS_DIR, sanitized);

  if (!resolved.startsWith(UPLOADS_DIR)) {
    throw new Error('Security Violation: Unauthorized path traversal.');
  }

  if (!fs.existsSync(resolved)) {
    throw new Error('File not found on disk.');
  }

  return resolved;
}

/**
 * Safely delete a file from disk.
 */
export function deleteStoredFile(storedFilename: string): boolean {
  try {
    const filePath = getSafeFilePath(storedFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (err) {
    console.error('Failed to delete file from disk:', err);
  }
  return false;
}
