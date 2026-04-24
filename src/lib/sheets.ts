// ============================================================
// Google Sheets API helper
// Digunakan oleh API Routes Next.js (server-side only)
// ============================================================
import { google } from 'googleapis';
import { SlipPotongan, Guru, POTONGAN_KEYS, INSTANSI_MAP, PotonganKey } from './types';

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
// Kolom: NIP(A) | NAMA(B) | JABATAN(C) | EMAIL(D) | _(E kosong) | NO_WA(F)
export async function getSemuaGuru(): Promise<Guru[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'DATA_GURU!A2:F',
  });
  const rows = res.data.values || [];
  return rows.map((row) => ({
    nip:     row[0] || '',
    nama:    row[1] || '',
    jabatan: row[2] || '',
    email:   row[3] || '',
    no_wa:   row[5] || '',   // kolom F (index 5), kolom E kosong
    aktif:   true,
  }));
}

export async function tambahGuru(guru: Omit<Guru, 'aktif'>): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'DATA_GURU!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[guru.nip, guru.nama, guru.jabatan || '', guru.email || '', 'Ya']],
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

// Alias header untuk tiap potongan (case-insensitive, partial match)
const POTONGAN_HEADERS: Record<string, string[]> = {
  wajib_narasoma: ['wajib kop narasoma', 'wajib narasoma'],
  angs_narasoma:  ['angs kop narasoma', 'angsuran kop narasoma', 'angsuran narasoma'],
  wajib_bahtera:  ['wajib kop bahtera', 'wajib bahtera'],
  angs_bahtera:   ['angs kop bahtera', 'angsuran kop bahtera', 'angsuran bahtera'],
  korpri:         ['korpri kecamatan', 'korpri'],
  danpen_pgri:    ['danpen pgri', 'pgri danpen', 'danpen'],
  dansos_dinas:   ['dansos dinas'],
  pralenan:       ['pralenan'],
  dharma_wanita:  ['dharma wanita', 'dharma wani'],
  dansos5:        ['dansos 5', 'dansos5', 'iuran keluarga'],
  pkpri_pralenan: ['pkpri pralenan', 'pral pkpri'],
  pkpri_thr:      ['pkpri thr', 'thr pkpri', 'thr bahtera'],
  infaq:          ['infaq kegiatan rohani', 'infaq rohani', 'infaq', 'infak'],
  baznas:         ['baznas'],
  srinuk:         ['beras rojolele', 'srinuk'],
  dplk:           ['dplk'],
  taspen_life:    ['taspen life', 'taspen'],
  espema_peduli:  ['espema peduli', 'espema pedu'],
};

type ColMap = {
  gaji: number;
  potongan: Record<string, number>;   // id → kolom nominal
  angsuranKe: Record<string, number>; // id → kolom ke
};

// Bangun peta kolom dari baris header
function buildColMap(headers: string[]): ColMap {
  // Normalisasi: lowercase, hapus titik (PRAL. PKPRI → pral pkpri), dan spasi ganda
  const normalize = (v: string) =>
    (v || '').toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
  const h = headers.map(normalize);

  const gaji = h.findIndex((v) => v.includes('gaji kotor') || v === 'gaji_kotor');

  const potongan: Record<string, number> = {};
  for (const [id, aliases] of Object.entries(POTONGAN_HEADERS)) {
    const idx = h.findIndex((v) => aliases.some((a) => v.includes(a) || a.includes(v)));
    if (idx >= 0) potongan[id] = idx;
  }

  // Kolom "KE" / "ANGSURAN KE" langsung setelah kolom nominal masing-masing potongan
  const angsuranKe: Record<string, number> = {};
  for (const [id, nomCol] of Object.entries(potongan)) {
    const next = nomCol + 1;
    if (next < h.length) {
      const nextH = h[next];
      if (nextH === 'ke' || nextH === 'angsuran ke' || nextH.startsWith('ke ')) {
        angsuranKe[id] = next;
      }
    }
  }

  return { gaji, potongan, angsuranKe };
}

export async function getSlipByNip(
  nip: string,
  bulan: string,
  tahun: number
): Promise<SlipPotongan | null> {
  const sheets = getSheetsClient();
  const sheetName = getSheetName(bulan, tahun);

  let headerRow: string[] = [];
  let rows: string[][] = [];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:BZ`,
    });
    const all = (res.data.values || []) as string[][];
    headerRow = all[0] || [];
    rows = all.slice(1);
  } catch (err) {
    console.error(`[sheets] getSlipByNip ERROR — sheetName: ${sheetName}`, err);
    return null;
  }

  const row = rows.find((r) => r[0] === nip);
  if (!row) return null;

  const colMap = buildColMap(headerRow);

  const potongan = POTONGAN_KEYS.map((p) => ({
    id: p.id,
    name: p.name,
    nominal: colMap.potongan[p.id] !== undefined ? parseAngka(row[colMap.potongan[p.id]]) : 0,
    angsuranKe: colMap.angsuranKe[p.id] !== undefined
      ? parseAngsuranKe(row[colMap.angsuranKe[p.id]])
      : undefined,
  }));

  return {
    id: `${nip}-${bulan}-${tahun}`,
    nip: row[0],
    namaGuru: row[1],
    bulan,
    tahun,
    gajiKotor: colMap.gaji >= 0 ? parseAngka(row[colMap.gaji]) : parseAngka(row[2]),
    potongan,
  };
}

export async function getAllSlipsBulan(
  bulan: string,
  tahun: number
): Promise<SlipPotongan[]> {
  const sheets = getSheetsClient();
  const sheetName = getSheetName(bulan, tahun);

  let headerRow: string[] = [];
  let rows: string[][] = [];
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:BZ`,
    });
    const all = (res.data.values || []) as string[][];
    headerRow = all[0] || [];
    rows = all.slice(1);
  } catch {
    return [];
  }

  const colMap = buildColMap(headerRow);

  return rows.map((row) => {
    const potongan = POTONGAN_KEYS.map((p) => ({
      id: p.id,
      name: p.name,
      nominal: colMap.potongan[p.id] !== undefined ? parseAngka(row[colMap.potongan[p.id]]) : 0,
      angsuranKe: colMap.angsuranKe[p.id] !== undefined
        ? parseAngsuranKe(row[colMap.angsuranKe[p.id]])
        : undefined,
    }));
    return {
      id: `${row[0]}-${bulan}-${tahun}`,
      nip: row[0],
      namaGuru: row[1],
      bulan,
      tahun,
      gajiKotor: colMap.gaji >= 0 ? parseAngka(row[colMap.gaji]) : parseAngka(row[2]),
      potongan,
    };
  });
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

  return INSTANSI_MAP.map(({ instansi, kategori, ids }) => {
    let totalDana = 0;
    let jumlahGuru = 0;
    for (const slip of slips) {
      const kontribusi = slip.potongan
        .filter((p) => (ids as string[]).includes(p.id))
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
