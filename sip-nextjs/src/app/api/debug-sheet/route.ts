// DEBUG ONLY — hapus setelah selesai diagnosa
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

function getAuth() {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    token_uri: 'https://oauth2.googleapis.com/token',
  };
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function GET() {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Cek daftar semua sheet yang ada
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'sheets.properties.title',
    });
    const sheetNames = meta.data.sheets?.map((s) => s.properties?.title) ?? [];

    // 2. Baca 5 baris pertama dari POTONGAN_APRIL_2026 (jika ada)
    let previewRows: unknown[] = [];
    if (sheetNames.includes('POTONGAN_APRIL_2026')) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'POTONGAN_APRIL_2026!A1:F6',
      });
      previewRows = res.data.values || [];
    }

    return NextResponse.json({
      success: true,
      spreadsheetId: SPREADSHEET_ID,
      sheets: sheetNames,
      preview_POTONGAN_APRIL_2026: previewRows,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
