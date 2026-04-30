import { NextResponse } from 'next/server';
import { bulkUpdateStatusBayar } from '@/lib/sheets';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bulan, tahun, nips, metode } = body;

    if (!bulan || !tahun || !nips || !Array.isArray(nips)) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 });
    }

    if (nips.length === 0) {
      return NextResponse.json({ success: true, message: 'Tidak ada data yang diupdate' });
    }

    await bulkUpdateStatusBayar(bulan, tahun, nips, metode);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/pembayaran/bulk]', err);
    return NextResponse.json({ success: false, error: 'Gagal update status pembayaran massal' }, { status: 500 });
  }
}
