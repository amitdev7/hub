import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    let query = `
      SELECT c.*, COUNT(r.id) as resourceCount
      FROM collections c
      LEFT JOIN resources r ON c.id = r.collection_id ${!user ? "AND r.visibility = 'public'" : ''}
      WHERE 1=1
    `;

    if (!user) {
      query += ' AND c.is_public = 1';
    }

    query += ' GROUP BY c.id ORDER BY c.display_order ASC, c.name ASC';

    const rows = db.prepare(query).all() as any[];

    const collections = rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon || 'Folder',
      color: row.color || 'indigo',
      displayOrder: row.display_order,
      isPublic: Boolean(row.is_public),
      resourceCount: row.resourceCount || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error('GET /api/collections error:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug, description, icon, color, isPublic = true } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const collectionSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'collection';

    // Verify slug uniqueness
    const existing = db.prepare('SELECT id FROM collections WHERE slug = ?').get(collectionSlug);
    const finalSlug = existing ? `${collectionSlug}-${Date.now().toString(36)}` : collectionSlug;

    const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM collections').get() as { maxOrder: number | null };
    const nextOrder = (maxOrderRow?.maxOrder ?? -1) + 1;

    const id = crypto.randomUUID();
    const now = Date.now();

    db.prepare(`
      INSERT INTO collections (id, name, slug, description, icon, color, display_order, is_public, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      finalSlug,
      description?.trim() || null,
      icon || 'Folder',
      color || 'indigo',
      nextOrder,
      isPublic ? 1 : 0,
      now,
      now
    );

    return NextResponse.json({ success: true, id, slug: finalSlug });
  } catch (error: any) {
    console.error('POST /api/collections error:', error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
