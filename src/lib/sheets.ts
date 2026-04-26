// ============================================================
// Google Sheets API helper
// Digunakan oleh API Routes Next.js (server-side only)
// ============================================================
import { google } from 'googleapis';
import { SlipPotongan, Guru, INSTANSI_MAP } from './types';

// Autentikasi menggunakan Service Account
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

function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';

// ── Sheet: DATA_GURU ────────────────────────────────────────
// Kolom aktual: NO(A) | NAMA(B) | NIP(C) | JABATAN(D) | EMAIL(E) | _(F kosong) | NO_WA(G)
export async function getSemuaGuru(): Promise<Guru[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'DATA_GURU!A2:G',
  });
  const rows = res.data.values || [];
  return rows
    .filter((row) => row[2])  // hanya baris yang punya NIP (kolom C)
    .map((row) => ({
      nip:     row[2] || '',   // NIP ada di kolom C (index 2)
      nama:    row[1] || '',   // NAMA ada di kolom B (index 1)
      jabatan: row[3] || '',   // JABATAN ada di kolom D (index 3)
      email:   row[4] || '',   // EMAIL ada di kolom E (index 4)
      no_wa:   row[6] || '',   // NO_WA ada di kolom G (index 6), kolom F kosong
      aktif:   true,
    }));
}

export async function tambahGuru(guru: Omit<Guru, 'aktif'>): Promise<void> {
  const sheets = getSheetsClient();
  // Urutan kolom: NO | NAMA | NIP | JABATAN | EMAIL
  // NO diisi otomatis (kosong), sisanya sesuai urutan sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'DATA_GURU!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [['', guru.nama, guru.nip, guru.jabatan || '', guru.email || '']],
    },
  });
}

// ── Sheet: POTONGAN_[BULAN]_[TAHUN] ─────────────────────────
// Contoh sheet name: POTONGAN_APRIL_2026
// Kolom bisa dalam urutan apapun — kode membaca berdasarkan nama header baris 1
function getSheetName(bulan: string, tahun: number): string {
  return `POTONGAN_${bulan.toUpperCase()}_${tahun}`;
}

// Parse angka dari Google Sheets — handle format Indonesia (5.796.000,00)
function parseAngka(val: string | undefined): number {
  if (!val || val.trim() === '' || val.trim() === '-') return 0;
  const cleaned = val
    .replace(/[Rp\s]/gi, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return Math.round(parseFloat(cleaned) || 0);
}

// Parse angsuran ke — hanya valid jika nilai kecil (1–9999), bukan nominal uang
function parseAngsuranKe(val: string | undefined): number | undefined {
  if (!val || val.trim() === '' || val.trim() === '-') return undefined;
  const n = parseAngka(val);
  return n > 0 && n < 10000 ? n : undefined;
}

// ── Helpers dinamis ────────────────────────────────────────

/** Slugify header kolom → jadi ID potongan */
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').trim();
}

/** Title-case header kolom untuk tampilan */
function formatHeaderName(header: string): string {
  return header.trim().split(/\s+/).map(
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join(' ');
}

// Header yang BUKAN potongan (skip saat baca kolom)
const GAJI_PATTERNS  = ['gaji kotor', 'gaji_kotor'];
const KE_PATTERNS    = ['ke', 'angsuran ke'];
const SKIP_POSITIONS = new Set([0, 1]); // index 0=NIP, index 1=NAMA

/**
 * Baca semua kolom dari baris header secara dinamis.
 * - Skip 2 kolom pertama (NIP, NAMA)
 * - Kolom bernama "KE" → penanda angsuranKe untuk kolom SESUDAHNYA (ke kanan)
 * - Kolom GAJI KOTOR → dipakai sebagai gajiKotor
 * - Kolom lain → potongan
 * FIX: KE ada di kolom SEBELUM nominal (L→M, Q→R, U→V)
 */
function buildDynamicSlip(
  headerRow: string[],
  row: string[],
  bulan: string,
  tahun: number
): SlipPotongan {
  const norm = (v: string) =>
    (v || '').toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
  const h = headerRow.map(norm);

  let gajiKotor = 0;
  const potongan = [];

  for (let i = 0; i < h.length; i++) {
    if (SKIP_POSITIONS.has(i)) continue;
    const header = h[i];
    if (!header) continue;

    // Skip kolom KE — hanya sebagai metadata
    if (KE_PATTERNS.includes(header)) continue;

    // Kolom gaji kotor
    if (GAJI_PATTERNS.some((g) => header.includes(g))) {
      gajiKotor = parseAngka(row[i]);
      continue;
    }

    // Kolom potongan — cek apakah kolom SEBELUMNYA adalah "KE"
    let angsuranKe: number | undefined = undefined;
    if (i > 0 && KE_PATTERNS.includes(h[i - 1])) {
      angsuranKe = parseAngsuranKe(row[i - 1]);
    }

    potongan.push({
      id:         slugify(headerRow[i]),
      name:       formatHeaderName(headerRow[i]),
      nominal:    parseAngka(row[i]),
      angsuranKe,
    });
  }

  return {
    id:       `${row[0]}-${bulan}-${tahun}`,
    nip:      row[0] || '',
    namaGuru: row[1] || '',
    bulan,
    tahun,
    gajiKotor,
    potongan,
  };
}

export async function getSlipByNip(
  nip: string,
  bulan: string,
  tahun: number
): Promise<SlipPotongan | null> {
  const sheets = getSheetsClient();
  const sheetName = getSheetName(bulan, tahun);
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:BZ`,
    });
    const all = (res.data.values || []) as string[][];
    const headerRow = all[0] || [];
    const rows = all.slice(1);
    const row = rows.find((r) => r[0] === nip);
    if (!row) return null;
    return buildDynamicSlip(headerRow, row, bulan, tahun);
  } catch (err) {
    console.error(`[sheets] getSlipByNip ERROR — sheetName: ${sheetName}`, err);
    return null;
  }
}

export async function getAllSlipsBulan(
  bulan: string,
  tahun: number
): Promise<SlipPotongan[]> {
  const sheets = getSheetsClient();
  const sheetName = getSheetName(bulan, tahun);
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:BZ`,
    });
    const all = (res.data.values || []) as string[][];
    const headerRow = all[0] || [];
    const rows = all.slice(1).filter((r) => r[0]); // skip baris tanpa NIP
    return rows.map((row) => buildDynamicSlip(headerRow, row, bulan, tahun));
  } catch {
    return [];
  }
}

// Menyimpan/update slip satu guru di sheet bulan tersebut
export async function upsertSlip(slip: SlipPotongan): Promise<void> {
  const sheets = getSheetsClient();
  const sheetName = getSheetName(slip.bulan, slip.tahun);

  const nominalRow = slip.potongan.map((p) => p.nominal.toString());
  const angsuranRow = slip.potongan.map((p) =>
    p.angsuranKe ? p.angsuranKe.toString() : ''
  );

  const rowValues = [
    slip.nip,
    slip.namaGuru,
    slip.gajiKotor.toString(),
    ...nominalRow,
    ...angsuranRow,
  ];

  // Cari apakah baris dengan NIP ini sudah ada
  let existingRows: string[][] = [];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });
    existingRows = (res.data.values || []) as string[][];
  } catch {
    // Sheet belum ada, append saja
  }

  const rowIndex = existingRows.findIndex((r) => r[0] === slip.nip);

  if (rowIndex >= 1) {
    // Update baris yang sudah ada (rowIndex adalah 0-based, baris 1 adalah header)
    const targetRow = rowIndex + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${targetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowValues] },
    });
  } else {
    // Append baris baru
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowValues] },
    });
  }
}

// ── Distribusi: hitung total per instansi dari semua slip ────────────
export async function kalkulasiDistribusi(
  bulan: string,
  tahun: number
): Promise<{ instansi: string; kategori: string; jumlahGuru: number; totalDana: number }[]> {
  const slips = await getAllSlipsBulan(bulan, tahun);

  return INSTANSI_MAP.map(({ instansi, kategori, patterns }) => {
    let totalDana = 0;
    let jumlahGuru = 0;
    for (const slip of slips) {
      const kontribusi = slip.potongan
        .filter((p) =>
          patterns.some((pat) =>
            p.name.toLowerCase().includes(pat.toLowerCase()) ||
            p.id.includes(pat.toLowerCase().replace(/\s+/g, '_'))
          )
        )
        .reduce((sum, p) => sum + p.nominal, 0);
      if (kontribusi > 0) {
        totalDana += kontribusi;
        jumlahGuru++;
      }
    }
    return { instansi, kategori, jumlahGuru, totalDana };
  });
}

// Baca status distribusi dari sheet STATUS_DISTRIBUSI
export async function getStatusDistribusi(
  bulan: string,
  tahun: number
): Promise<Record<string, { status: 'SUDAH_DISETOR' | 'BELUM_DISETOR'; tglSetor?: string }>> {
  const sheets = getSheetsClient();
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'STATUS_DISTRIBUSI!A2:E',
    });
    const rows = (res.data.values || []) as string[][];
    const result: Record<string, { status: 'SUDAH_DISETOR' | 'BELUM_DISETOR'; tglSetor?: string }> = {};
    for (const row of rows) {
      if (row[0]?.toUpperCase() === bulan.toUpperCase() && row[1] === String(tahun)) {
        const name = row[2];
        const st = (row[3] || 'BELUM_DISETOR') as 'SUDAH_DISETOR' | 'BELUM_DISETOR';
        if (name) result[name] = { status: st, tglSetor: row[4] || undefined };
      }
    }
    return result;
  } catch {
    return {};
  }
}

// Tandai status disetor di sheet STATUS_DISTRIBUSI
export async function updateStatusDistribusi(
  bulan: string,
  tahun: number,
  instansi: string,
  status: 'SUDAH_DISETOR' | 'BELUM_DISETOR'
): Promise<void> {
  const sheets = getSheetsClient();
  const tglSetor = status === 'SUDAH_DISETOR' ? new Date().toISOString().split('T')[0] : '';
  const newRow = [bulan.toUpperCase(), tahun, instansi, status, tglSetor];

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'STATUS_DISTRIBUSI!A2:E',
  });
  const rows = (res.data.values || []) as string[][];
  const idx = rows.findIndex(
    (r) => r[0]?.toUpperCase() === bulan.toUpperCase() && r[1] === String(tahun) && r[2] === instansi
  );

  if (idx >= 0) {
    const sheetRow = idx + 2; // +1 header, +1 0-index
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `STATUS_DISTRIBUSI!A${sheetRow}:E${sheetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newRow] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'STATUS_DISTRIBUSI!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newRow] },
    });
  }
}
