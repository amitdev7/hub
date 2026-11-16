import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getSafeFilePath } from '@/lib/file-storage';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
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

    let contentType = file.mime_type || 'application/octet-stream';
    if (file.filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (file.filename.endsWith('.csv') || file.filename.endsWith('.txt')) {
      contentType = 'text/plain; charset=utf-8';
    } else if (file.filename.endsWith('.json')) {
      contentType = 'application/json';
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.filename)}"`,
        'Content-Length': fileBuffer.length.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    console.error('Preview error:', error);
    return new NextResponse('Preview not available', { status: 500 });
  }
}
