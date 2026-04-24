// ============================================================
// Tipe data utama Sistem Informasi Potongan (SIP)
// SMPN 5 Klaten
// ============================================================

export interface DeductionItem {
  id: string;
  name: string;
  nominal: number;
  angsuranKe?: number;
}

export interface SlipPotongan {
  id: string;
  nip: string;
  namaGuru: string;
  bulan: string;
  tahun: number;
  // Gaji kotor
  gajiKotor: number;
  // 18 item potongan ke bendahara
  potongan: DeductionItem[];
}

export interface Guru {
  nip: string;
  nama: string;
  jabatan?: string;
  email?: string;
  no_wa?: string;
  aktif: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Daftar 18 ID potongan standar (urutan sesuai slip fisik)
export const POTONGAN_KEYS = [
  { id: 'wajib_narasoma',    name: 'Wajib Kop. Narasoma' },
  { id: 'angs_narasoma',     name: 'Angs. Kop. Narasoma' },
  { id: 'wajib_bahtera',     name: 'Wajib Kop. Bahtera' },
  { id: 'angs_bahtera',      name: 'Angs. Kop. Bahtera' },
  { id: 'korpri',            name: 'KORPRI Kecamatan' },
  { id: 'danpen_pgri',       name: 'Danpen PGRI' },
  { id: 'dansos_dinas',      name: 'Dansos Dinas' },
  { id: 'pralenan',          name: 'Pralenan' },
  { id: 'dharma_wanita',     name: 'Iuran Dharma Wanita' },
  { id: 'dansos5',           name: 'Iuran Keluarga / Sosial (Dansos 5)' },
  { id: 'pkpri_pralenan',    name: 'PKPRI Pralenan Pensiun' },
  { id: 'pkpri_thr',         name: 'PKPRI THR' },
  { id: 'infaq',             name: 'Infaq/Kegiatan Rohani' },
  { id: 'baznas',            name: 'BAZNAS' },
  { id: 'srinuk',            name: 'Beras Rojolele "SRINUK"' },
  { id: 'dplk',              name: 'DPLK' },
  { id: 'taspen_life',       name: 'Taspen Life' },
  { id: 'espema_peduli',     name: 'Espema Peduli' },
] as const;

export type PotonganKey = typeof POTONGAN_KEYS[number]['id'];

export const formatRupiah = (angka: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);

// ── Distribusi per instansi ─────────────────────────────────
export interface DistribusiItem {
  instansi: string;
  kategori: string;
  jumlahGuru: number;
  totalDana: number;
  status: 'SUDAH_DISETOR' | 'BELUM_DISETOR';
  tglSetor?: string;
}

export const INSTANSI_MAP: { instansi: string; kategori: string; ids: PotonganKey[] }[] = [
  { instansi: 'Koperasi Narasoma',    kategori: 'Koperasi Pokok & Angsuran',  ids: ['wajib_narasoma', 'angs_narasoma'] },
  { instansi: 'Koperasi Bahtera',     kategori: 'Koperasi Pokok & Angsuran',  ids: ['wajib_bahtera', 'angs_bahtera'] },
  { instansi: 'KORPRI Kecamatan',     kategori: 'Organisasi',                 ids: ['korpri'] },
  { instansi: 'Danpen PGRI',          kategori: 'Organisasi',                 ids: ['danpen_pgri'] },
  { instansi: 'Dansos Dinas',         kategori: 'Dana Sosial',                ids: ['dansos_dinas'] },
  { instansi: 'Pralenan',             kategori: 'Dana Sosial',                ids: ['pralenan'] },
  { instansi: 'Iuran Dharma Wanita',  kategori: 'Organisasi',                 ids: ['dharma_wanita'] },
  { instansi: 'Dansos 5 / Keluarga',  kategori: 'Dana Sosial',                ids: ['dansos5'] },
  { instansi: 'PKPRI Pralenan',       kategori: 'PKPRI',                      ids: ['pkpri_pralenan'] },
  { instansi: 'PKPRI THR',            kategori: 'PKPRI',                      ids: ['pkpri_thr'] },
  { instansi: 'Infaq/Rohani',         kategori: 'Keagamaan',                  ids: ['infaq'] },
  { instansi: 'BAZNAS',               kategori: 'Zakat & Sodaqoh',            ids: ['baznas'] },
  { instansi: 'Beras Srinuk',         kategori: 'Kebutuhan Pokok (Bulog)',    ids: ['srinuk'] },
  { instansi: 'DPLK',                 kategori: 'Pensiun',                    ids: ['dplk'] },
  { instansi: 'Taspen Life',          kategori: 'Asuransi',                   ids: ['taspen_life'] },
  { instansi: 'Espema Peduli',        kategori: 'Dana Sosial',                ids: ['espema_peduli'] },
];
