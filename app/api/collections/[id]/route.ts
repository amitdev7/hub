import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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
    const { name, slug, description, icon, color, isPublic } = await req.json();
    const now = Date.now();

    db.prepare(`
      UPDATE collections
      SET name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          color = COALESCE(?, color),
          is_public = COALESCE(?, is_public),
          updated_at = ?
      WHERE id = ?
    `).run(
      name?.trim() || null,
      slug?.trim() || null,
      description !== undefined ? description?.trim() : null,
      icon || null,
      color || null,
      isPublic !== undefined ? (isPublic ? 1 : 0) : null,
      now,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
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
    db.prepare('DELETE FROM collections WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
