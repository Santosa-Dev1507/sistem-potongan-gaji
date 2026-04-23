// GET /api/guru — daftar semua guru
// POST /api/guru — tambah guru baru
import { NextResponse } from 'next/server';
import { getSemuaGuru, tambahGuru } from '@/lib/sheets';

export async function GET() {
  try {
    const data = await getSemuaGuru();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[GET /api/guru]', err);
    return NextResponse.json({ success: false, error: 'Gagal membaca data guru' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nip, nama, jabatan, email } = body;
    if (!nip || !nama) {
      return NextResponse.json({ success: false, error: 'NIP dan nama wajib diisi' }, { status: 400 });
    }
    await tambahGuru({ nip, nama, jabatan, email });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/guru]', err);
    return NextResponse.json({ success: false, error: 'Gagal menambah guru' }, { status: 500 });
  }
}
