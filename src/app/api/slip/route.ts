// GET /api/slip?nip=xxx&bulan=April&tahun=2026
// POST /api/slip — upsert slip (admin input)
import { NextResponse } from 'next/server';
import { getSlipByNip, getAllSlipsBulan, upsertSlip } from '@/lib/sheets';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nip = searchParams.get('nip');
  const bulan = searchParams.get('bulan') || 'April';
  const tahun = parseInt(searchParams.get('tahun') || '2026', 10);

  try {
    if (nip) {
      // Slip satu guru
      const data = await getSlipByNip(nip, bulan, tahun);
      if (!data) {
        return NextResponse.json({ success: false, error: 'Data slip tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data });
    } else {
      // Semua slip bulan ini (untuk admin)
      const data = await getAllSlipsBulan(bulan, tahun);
      return NextResponse.json({ success: true, data });
    }
  } catch (err) {
    console.error('[GET /api/slip]', err);
    return NextResponse.json({ success: false, error: 'Gagal membaca data slip' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const slip = await request.json();
    await upsertSlip(slip);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/slip]', err);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan slip' }, { status: 500 });
  }
}
