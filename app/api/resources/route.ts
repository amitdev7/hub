import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { isValidUrl } from '@/lib/utils';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const collectionId = searchParams.get('collection');
    const category = searchParams.get('category');
    const favoriteOnly = searchParams.get('favorite') === 'true';
    const type = searchParams.get('type');
    const visibility = searchParams.get('visibility');

    let query = `
      SELECT r.*, 
             c.name as collection_name, c.color as collection_color,
             f.filename as file_name, f.file_size, f.mime_type as file_mime
      FROM resources r
      LEFT JOIN collections c ON r.collection_id = c.id
      LEFT JOIN files f ON r.file_id = f.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Privacy isolation: public visitors can ONLY see public resources
    if (!user) {
      query += ` AND r.visibility = 'public'`;
    } else if (visibility) {
      query += ` AND r.visibility = ?`;
      params.push(visibility);
    }

    if (collectionId) {
      query += ` AND r.collection_id = ?`;
      params.push(collectionId);
    }

    if (category && category !== 'All') {
      query += ` AND r.category = ?`;
      params.push(category);
    }

    if (type && type !== 'All') {
      query += ` AND r.resource_type = ?`;
      params.push(type);
    }

    if (favoriteOnly) {
      query += ` AND r.is_favorite = 1`;
    }

    if (search) {
      query += ` AND (r.title LIKE ? OR r.description LIKE ? OR r.url LIKE ? OR r.tags LIKE ?)`;
      const searchWildcard = `%${search}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    query += ` ORDER BY r.is_pinned DESC, r.display_order ASC, r.created_at DESC`;

    const rows = db.prepare(query).all(...params) as any[];

    const resources = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      icon: row.icon,
      thumbnail: row.thumbnail,
      resourceType: row.resource_type,
      category: row.category,
      collectionId: row.collection_id,
      collectionName: row.collection_name,
      collectionColor: row.collection_color,
      visibility: row.visibility,
      isFavorite: Boolean(row.is_favorite),
      isPinned: Boolean(row.is_pinned),
      displayOrder: row.display_order,
      fileId: row.file_id,
      fileName: row.file_name,
      fileSize: row.file_size,
      fileMime: row.file_mime,
      clickCount: row.click_count,
      tags: JSON.parse(row.tags || '[]'),
      customCss: row.custom_css,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ resources });
  } catch (error: any) {
    console.error('GET /api/resources error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      url,
      description,
      icon,
      thumbnail,
      resourceType = 'link',
      category = 'General',
      collectionId,
      visibility = 'public',
      isFavorite = false,
      isPinned = false,
      tags = [],
      fileId,
      customCss,
    } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Provide http://, https://, mailto:, tel:, or file:///' },
        { status: 400 }
      );
    }

    // Determine max display order
    const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM resources').get() as { maxOrder: number | null };
    const nextOrder = (maxOrderRow?.maxOrder ?? -1) + 1;

    const id = crypto.randomUUID();
    const now = Date.now();

    const stmt = db.prepare(`
      INSERT INTO resources (
        id, title, url, description, icon, thumbnail, resource_type,
        category, collection_id, visibility, is_favorite, is_pinned,
        display_order, file_id, click_count, tags, custom_css, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      title.trim(),
      url.trim(),
      description?.trim() || null,
      icon || null,
      thumbnail || null,
      resourceType,
      category,
      collectionId || null,
      visibility,
      isFavorite ? 1 : 0,
      isPinned ? 1 : 0,
      nextOrder,
      fileId || null,
      0,
      JSON.stringify(tags || []),
      customCss || null,
      now,
      now
    );

    // Record activity log
    db.prepare(`
      INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), id, 'create', `Created resource: "${title}"`, now);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('POST /api/resources error:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
