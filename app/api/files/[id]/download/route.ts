import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getSafeFilePath } from '@/lib/file-storage';
import fs from 'fs';
import crypto from 'crypto';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req);
    const { id } = await params;
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(id) as any;

    if (!file) {
      return new NextResponse('File not found', { status: 404 });
    }

    if (!user && file.visibility !== 'public') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const filePath = getSafeFilePath(file.stored_filename);
    const fileBuffer = fs.readFileSync(filePath);

    // Increment download count
    db.prepare('UPDATE files SET download_count = download_count + 1 WHERE id = ?').run(id);

    // Log activity
    db.prepare(`
      INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), null, 'download', `Downloaded file: "${file.filename}"`, Date.now());

    // Stream response
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.mime_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
        'Content-Length': fileBuffer.length.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return new NextResponse('Internal error downloading file', { status: 500 });
  }
}
