import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { deleteStoredFile } from '@/lib/file-storage';
import crypto from 'crypto';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { filename, description, collectionId, visibility } = await req.json();
    const now = Date.now();

    db.prepare(`
      UPDATE files
      SET filename = COALESCE(?, filename),
          description = COALESCE(?, description),
          collection_id = ?,
          visibility = COALESCE(?, visibility),
          updated_at = ?
      WHERE id = ?
    `).run(
      filename?.trim() || null,
      description !== undefined ? description?.trim() : null,
      collectionId !== undefined ? (collectionId || null) : null,
      visibility || null,
      now,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const file = db.prepare('SELECT stored_filename, filename FROM files WHERE id = ?').get(id) as any;
    if (file) {
      deleteStoredFile(file.stored_filename);
      db.prepare('DELETE FROM files WHERE id = ?').run(id);

      db.prepare(`
        INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), null, 'delete', `Deleted file: "${file.filename}"`, Date.now());
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
