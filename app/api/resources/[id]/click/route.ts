import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = db.prepare('SELECT id, title, url, click_count FROM resources WHERE id = ?').get(id) as any;
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const now = Date.now();
    db.prepare('UPDATE resources SET click_count = click_count + 1 WHERE id = ?').run(id);

    db.prepare(`
      INSERT INTO activity_logs (id, resource_id, action, details, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), id, 'open', `Opened resource: "${resource.title}"`, now);

    return NextResponse.json({ success: true, clickCount: (resource.click_count || 0) + 1 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to record click' }, { status: 500 });
  }
}
