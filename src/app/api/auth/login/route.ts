import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const guruPass = process.env.GURU_PASSWORD || 'guru123';

    if (username === 'admin' && password === adminPass) {
      const user = { username: 'Administrator', role: 'admin' as const, email: 'admin@smpn5klaten.sch.id' };
      await createSession(user);
      return NextResponse.json({ success: true, user });
    } 
    
    if (/^\d+$/.test(username) && password === guruPass) {
      const user = { username, role: 'guru' as const, email: `${username}@smpn5klaten.sch.id` };
      await createSession(user);
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: false, error: 'Kredensial tidak valid' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Kesalahan server saat login' }, { status: 500 });
  }
}
