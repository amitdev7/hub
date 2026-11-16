import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  try {
    await destroySession();
    const response = NextResponse.json({ success: true });
    response.cookies.delete('storagehub_session');
    return response;
  } catch (err: any) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('storagehub_session');
    return response;
  }
}
