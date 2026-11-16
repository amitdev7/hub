import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query) {
      return NextResponse.json({ resources: [], files: [], collections: [] });
    }

    const pattern = `%${query}%`;

    // 1. Resources search
    let resQuery = `
      SELECT r.*, c.name as collection_name
      FROM resources r
      LEFT JOIN collections c ON r.collection_id = c.id
      WHERE (r.title LIKE ? OR r.description LIKE ? OR r.url LIKE ? OR r.tags LIKE ?)
    `;
    const resParams: any[] = [pattern, pattern, pattern, pattern];
    if (!user) {
      resQuery += ` AND r.visibility = 'public'`;
    }
    resQuery += ` LIMIT 15`;
    const resources = db.prepare(resQuery).all(...resParams) as any[];

    // 2. Files search
    let fileQuery = `
      SELECT f.*, c.name as collection_name
      FROM files f
      LEFT JOIN collections c ON f.collection_id = c.id
      WHERE (f.filename LIKE ? OR f.description LIKE ?)
    `;
    const fileParams: any[] = [pattern, pattern];
    if (!user) {
      fileQuery += ` AND f.visibility = 'public'`;
    }
    fileQuery += ` LIMIT 10`;
    const files = db.prepare(fileQuery).all(...fileParams) as any[];

    // 3. Collections search
    let colQuery = `
      SELECT c.*, COUNT(r.id) as resourceCount
      FROM collections c
      LEFT JOIN resources r ON c.id = r.collection_id
      WHERE (c.name LIKE ? OR c.description LIKE ?)
    `;
    const colParams: any[] = [pattern, pattern];
    if (!user) {
      colQuery += ` AND c.is_public = 1`;
    }
    colQuery += ` GROUP BY c.id LIMIT 6`;
    const collections = db.prepare(colQuery).all(...colParams) as any[];

    return NextResponse.json({
      resources: resources.map((r) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        description: r.description,
        icon: r.icon,
        resourceType: r.resource_type,
        category: r.category,
        collectionName: r.collection_name,
        visibility: r.visibility,
        isFavorite: Boolean(r.is_favorite),
        tags: JSON.parse(r.tags || '[]'),
      })),
      files: files.map((f) => ({
        id: f.id,
        filename: f.filename,
        fileSize: f.file_size,
        mimeType: f.mime_type,
        category: f.category,
        collectionName: f.collection_name,
      })),
      collections: collections.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        color: c.color,
        resourceCount: c.resourceCount,
      })),
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
