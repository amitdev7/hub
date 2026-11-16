import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/file-storage';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const collectionId = formData.get('collectionId') as string | null;
    const visibility = (formData.get('visibility') as string) || 'public';
    const createResource = formData.get('createResource') !== 'false';

    if (!files || files.length === 0) {
      // Also check if single 'file' was passed
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedResults: any[] = [];
    const now = Date.now();

    const insertFileStmt = db.prepare(`
      INSERT INTO files (
        id, filename, stored_filename, file_size, mime_type, category,
        description, collection_id, visibility, download_count, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertResourceStmt = db.prepare(`
      INSERT INTO resources (
        id, title, url, description, icon, thumbnail, resource_type,
        category, collection_id, visibility, is_favorite, is_pinned,
        display_order, file_id, click_count, tags, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const file of files) {
      // Maximum file size check (100MB per file)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 100MB limit.` },
          { status: 400 }
        );
      }

      const saved = await saveUploadedFile(file);
      const fileId = crypto.randomUUID();

      insertFileStmt.run(
        fileId,
        saved.filename,
        saved.storedFilename,
        saved.fileSize,
        saved.mimeType,
        saved.category,
        `Uploaded file: ${saved.filename}`,
        collectionId || null,
        visibility,
        0,
        now,
        now
      );

      // Optionally auto-create a Resource Launcher Card for this file
      if (createResource) {
        const resourceId = crypto.randomUUID();
        const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM resources').get() as { maxOrder: number | null };
        const nextOrder = (maxOrderRow?.maxOrder ?? -1) + 1;

        insertResourceStmt.run(
          resourceId,
          saved.filename,
          `/api/files/${fileId}/download`,
          `Uploaded ${saved.category} document (${Math.round(saved.fileSize / 1024)} KB)`,
          saved.category === 'image' ? 'Image' : saved.category === 'document' ? 'FileText' : 'File',
          saved.category === 'image' ? `/api/files/${fileId}/preview` : null,
          'file',
          saved.category.charAt(0).toUpperCase() + saved.category.slice(1),
          collectionId || null,
          visibility,
          0,
          0,
          nextOrder,
          fileId,
          0,
          JSON.stringify([saved.category, 'Upload']),
          now,
          now
        );
      }

      // Log activity
      db.prepare(`
        INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), null, 'create', `Uploaded file: "${saved.filename}"`, now);

      uploadedResults.push({
        id: fileId,
        filename: saved.filename,
        fileSize: saved.fileSize,
        category: saved.category,
        mimeType: saved.mimeType,
      });
    }

    return NextResponse.json({
      success: true,
      count: uploadedResults.length,
      files: uploadedResults,
    });
  } catch (error: any) {
    console.error('POST /api/files/upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
