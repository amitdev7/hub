import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category');
    const collectionId = searchParams.get('collection');
    const visibility = searchParams.get('visibility');

    let query = `
      SELECT f.*, c.name as collection_name
      FROM files f
      LEFT JOIN collections c ON f.collection_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (!user) {
      query += ` AND f.visibility = 'public'`;
    } else if (visibility) {
      query += ` AND f.visibility = ?`;
      params.push(visibility);
    }

    if (category && category !== 'All') {
      query += ` AND f.category = ?`;
      params.push(category);
    }

    if (collectionId) {
      query += ` AND f.collection_id = ?`;
      params.push(collectionId);
    }

    if (search) {
      query += ` AND (f.filename LIKE ? OR f.description LIKE ?)`;
      const pattern = `%${search}%`;
      params.push(pattern, pattern);
    }

    query += ` ORDER BY f.created_at DESC`;

    const rows = db.prepare(query).all(...params) as any[];

    const files = rows.map((row) => ({
      id: row.id,
      filename: row.filename,
      storedFilename: row.stored_filename,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      category: row.category,
      description: row.description,
      collectionId: row.collection_id,
      collectionName: row.collection_name,
      visibility: row.visibility,
      downloadCount: row.download_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ files });
  } catch (error: any) {
    console.error('GET /api/files error:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
