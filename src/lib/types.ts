// ============================================================
// Tipe data utama Sistem Informasi Potongan (SIP)
// SMPN 5 Klaten
// ============================================================

export interface DeductionItem {
  id: string;
  name: string;
  nominal: number;
  angsuranKe?: number;
  // Perbandingan dengan bulan lalu
  selisih?: number;
  isBaru?: boolean;
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

// patterns: kata kunci (lowercase) yang dicocokkan ke nama kolom header sheet secara parsial
export const INSTANSI_MAP: { instansi: string; kategori: string; patterns: string[] }[] = [
  { instansi: 'Koperasi Narasoma',   kategori: 'Koperasi Pokok & Angsuran', patterns: ['narasoma'] },
  { instansi: 'Koperasi Bahtera',    kategori: 'Koperasi Pokok & Angsuran', patterns: ['bahtera'] },
  { instansi: 'KORPRI Kecamatan',    kategori: 'Organisasi',                patterns: ['korpri'] },
  { instansi: 'Danpen PGRI',         kategori: 'Organisasi',                patterns: ['pgri', 'danpen'] },
  { instansi: 'Dansos Dinas',        kategori: 'Dana Sosial',               patterns: ['dansos dinas'] },
  { instansi: 'Pralenan',            kategori: 'Dana Sosial',               patterns: ['pralenan'] },
  { instansi: 'Dharma Wanita',       kategori: 'Organisasi',                patterns: ['dharma wanita', 'dharma wani'] },
  { instansi: 'Dansos 5 / Keluarga', kategori: 'Dana Sosial',               patterns: ['dansos 5', 'dansos5', 'iuran keluarga'] },
  { instansi: 'PKPRI Pralenan',      kategori: 'PKPRI',                     patterns: ['pkpri pralenan', 'pral pkpri'] },
  { instansi: 'PKPRI THR',           kategori: 'PKPRI',                     patterns: ['pkpri thr', 'thr pkpri', 'thr bahtera'] },
  { instansi: 'Infaq/Rohani',        kategori: 'Keagamaan',                 patterns: ['infaq', 'infak', 'rohani'] },
  { instansi: 'BAZNAS',              kategori: 'Zakat & Sodaqoh',           patterns: ['baznas'] },
  { instansi: 'Beras Srinuk',        kategori: 'Kebutuhan Pokok (Bulog)',   patterns: ['srinuk', 'beras'] },
  { instansi: 'DPLK',                kategori: 'Pensiun',                   patterns: ['dplk'] },
  { instansi: 'Taspen Life',         kategori: 'Asuransi',                  patterns: ['taspen life', 'taspen'] },
  { instansi: 'Espema Peduli',       kategori: 'Dana Sosial',               patterns: ['espema peduli', 'espema'] },
];
