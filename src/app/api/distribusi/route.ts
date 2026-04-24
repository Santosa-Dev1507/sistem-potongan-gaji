// GET  /api/distribusi?bulan=APRIL&tahun=2026
// PATCH /api/distribusi  body: { bulan, tahun, instansi, status }
import { NextResponse } from 'next/server';
import {
  kalkulasiDistribusi,
  getStatusDistribusi,
  updateStatusDistribusi,
} from '@/lib/sheets';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bulan = searchParams.get('bulan') || '';
  const tahun = parseInt(searchParams.get('tahun') || '0');

  if (!bulan || !tahun) {
    return NextResponse.json(
      { success: false, error: 'Parameter bulan dan tahun wajib diisi' },
      { status: 400 }
    );
  }

  try {
    const [kalkulasi, statusMap] = await Promise.all([
      kalkulasiDistribusi(bulan, tahun),
      getStatusDistribusi(bulan, tahun),
    ]);

    const data = kalkulasi.map((item) => ({
      ...item,
      status: statusMap[item.instansi]?.status ?? 'BELUM_DISETOR',
      tglSetor: statusMap[item.instansi]?.tglSetor,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[GET /api/distribusi]', err);
    return NextResponse.json(
      { success: false, error: 'Gagal menghitung distribusi' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bulan, tahun, instansi, status } = body;

    if (!bulan || !tahun || !instansi || !status) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    await updateStatusDistribusi(bulan, tahun, instansi, status);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/distribusi]', err);
    return NextResponse.json(
      { success: false, error: 'Gagal update status' },
      { status: 500 }
    );
  }
}
