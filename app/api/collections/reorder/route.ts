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
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updateStmt = db.prepare('UPDATE collections SET display_order = ? WHERE id = ?');

    const transaction = db.transaction((orderList: { id: string; displayOrder: number }[]) => {
      for (const item of orderList) {
        updateStmt.run(item.displayOrder, item.id);
      }
    });

    transaction(items);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
