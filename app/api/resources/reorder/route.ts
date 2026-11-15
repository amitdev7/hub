import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await req.json(); // array of { id: string, displayOrder: number }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    const updateStmt = db.prepare('UPDATE resources SET display_order = ? WHERE id = ?');

    const transaction = db.transaction((reordered: { id: string; displayOrder: number }[]) => {
      for (const item of reordered) {
        updateStmt.run(item.displayOrder, item.id);
      }
    });

    transaction(items);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Failed to persist order' }, { status: 500 });
  }
}
