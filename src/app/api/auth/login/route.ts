import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { getSemuaGuru } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const guruPass  = process.env.GURU_PASSWORD  || 'guru123';

    // ── Admin login ─────────────────────────────────────────
    if (username === 'admin' && password === adminPass) {
      const user = { username: 'admin', role: 'admin' as const, email: 'admin@smpn5klaten.sch.id', namaGuru: 'Administrator' };
      await createSession(user);
      return NextResponse.json({ success: true, user });
    }

    // ── Guru login — validasi NIP ke Google Sheets ──────────
    if (/^\d+$/.test(username) && password === guruPass) {
      // Cek apakah NIP ada di DATA_GURU
      let namaGuru = '';
      try {
        const semuaGuru = await getSemuaGuru();
        const guru = semuaGuru.find((g) => g.nip === username);
        if (!guru) {
          return NextResponse.json(
            { success: false, error: 'NIP tidak terdaftar. Hubungi Administrator.' },
            { status: 401 }
          );
        }
        namaGuru = guru.nama;
      } catch {
        // Jika Sheets tidak bisa diakses, tetap izinkan login (failopen)
        // tapi catat agar admin tahu
        console.warn('[login] Tidak bisa verifikasi NIP ke Sheets — akses diizinkan sementara');
      }

      const user = {
        username,
        role: 'guru' as const,
        email: `${username}@smpn5klaten.sch.id`,
        namaGuru,
      };
      await createSession(user);
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: false, error: 'Kredensial tidak valid' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Kesalahan server saat login' }, { status: 500 });
  }
}
