import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { isValidUrl } from '@/lib/utils';
import crypto from 'crypto';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const resource = db
      .prepare(
        `SELECT r.*, c.name as collection_name, c.color as collection_color
         FROM resources r
         LEFT JOIN collections c ON r.collection_id = c.id
         WHERE r.id = ?`
      )
      .get(id) as any;

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    if (!user && resource.visibility !== 'public') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      resource: {
        ...resource,
        isFavorite: Boolean(resource.is_favorite),
        isPinned: Boolean(resource.is_pinned),
        tags: JSON.parse(resource.tags || '[]'),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.action === 'duplicate') {
      const existing = db.prepare('SELECT * FROM resources WHERE id = ?').get(id) as any;
      if (!existing) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
      }

      const newId = crypto.randomUUID();
      const now = Date.now();
      const newTitle = `${existing.title} (Copy)`;

      db.prepare(`
        INSERT INTO resources (
          id, title, url, description, icon, thumbnail, resource_type,
          category, collection_id, visibility, is_favorite, is_pinned,
          display_order, file_id, click_count, tags, custom_css, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newId,
        newTitle,
        existing.url,
        existing.description,
        existing.icon,
        existing.thumbnail,
        existing.resource_type,
        existing.category,
        existing.collection_id,
        existing.visibility,
        0,
        0,
        existing.display_order + 1,
        existing.file_id,
        0,
        existing.tags,
        existing.custom_css,
        now,
        now
      );

      return NextResponse.json({ success: true, id: newId });
    }

    const {
      title,
      url,
      description,
      icon,
      thumbnail,
      resourceType,
      category,
      collectionId,
      visibility,
      isFavorite,
      isPinned,
      tags,
      customCss,
    } = body;

    if (url && !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE resources
      SET title = COALESCE(?, title),
          url = COALESCE(?, url),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          thumbnail = COALESCE(?, thumbnail),
          resource_type = COALESCE(?, resource_type),
          category = COALESCE(?, category),
          collection_id = ?,
          visibility = COALESCE(?, visibility),
          is_favorite = COALESCE(?, is_favorite),
          is_pinned = COALESCE(?, is_pinned),
          tags = COALESCE(?, tags),
          custom_css = COALESCE(?, custom_css),
          updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      title?.trim() || null,
      url?.trim() || null,
      description !== undefined ? description?.trim() : null,
      icon !== undefined ? icon : null,
      thumbnail !== undefined ? thumbnail : null,
      resourceType || null,
      category || null,
      collectionId !== undefined ? (collectionId || null) : null,
      visibility || null,
      isFavorite !== undefined ? (isFavorite ? 1 : 0) : null,
      isPinned !== undefined ? (isPinned ? 1 : 0) : null,
      tags ? JSON.stringify(tags) : null,
      customCss !== undefined ? customCss : null,
      now,
      id
    );

    db.prepare(`
      INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), id, 'update', `Updated resource: "${title || id}"`, now);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PUT /api/resources/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = db.prepare('SELECT title FROM resources WHERE id = ?').get(id) as any;
    db.prepare('DELETE FROM resources WHERE id = ?').run(id);

    const now = Date.now();
    db.prepare(`
      INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), null, 'delete', `Deleted resource: "${existing?.title || id}"`, now);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
