import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = db.prepare(`
      SELECT a.*, r.title as resource_title
      FROM activity_logs a
      LEFT JOIN resources r ON a.resource_id = r.id
      ORDER BY a.timestamp DESC
      LIMIT 100
    `).all() as any[];

    const logs = rows.map((r) => ({
      id: r.id,
      resourceId: r.resource_id,
      resourceTitle: r.resource_title,
      action: r.action,
      details: r.details,
      timestamp: r.timestamp,
    }));

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    db.prepare('DELETE FROM activity_logs').run();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
