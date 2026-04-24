export interface DeductionItem {
  id: string;
  name: string;
  nominal: number;
  angsuranKe?: number; // Opsional, hanya untuk angsuran
}

export interface SlipPotongan {
  id: string;
  nip: string;
  namaGuru: string;
  bulan: string;
  tahun: number;
  
  // Informasi Gaji Atas
  gajiKotor: number;
  angsuranBankJateng: number;
  angsuranBankJatengKe?: number;
  gajiMasukRekening: number;
  
  // Rincian Potongan Disetor ke Bendahara
  potongan: DeductionItem[];
}

export const mockSlipPotongan: SlipPotongan[] = [
  {
    id: 'SLIP-2026-03-001',
    nip: '123456789', // NIP dummy sesuai login
    namaGuru: 'Sri Juwariyah, M.Pd.',
    bulan: 'Maret',
    tahun: 2026,
    gajiKotor: 6795000,
    angsuranBankJateng: 1000000,
    angsuranBankJatengKe: 5,
    gajiMasukRekening: 5795000,
    potongan: [
      { id: 'p1', name: 'Wajib Kop. Narasoma', nominal: 0 },
      { id: 'p2', name: 'Angs. Kop. Narasoma', nominal: 1100000, angsuranKe: 8 },
      { id: 'p3', name: 'Wajib Kop. Bahtera', nominal: 100000 },
      { id: 'p4', name: 'Angs. Kop. Bahtera', nominal: 0 },
      { id: 'p5', name: 'KORPRI Kecamatan', nominal: 10000 },
      { id: 'p6', name: 'Danpen PGRI', nominal: 32250 },
      { id: 'p7', name: 'Dansos Dinas', nominal: 30000 },
      { id: 'p8', name: 'Pralenan', nominal: 0 },
      { id: 'p9', name: 'Iuran Dharma Wanita', nominal: 15000 },
      { id: 'p10', name: 'Iuran Keluarga / Sosial (Dansos 5)', nominal: 25000 },
      { id: 'p11', name: 'PKPRI Pralenan Pensiun', nominal: 65000 },
      { id: 'p12', name: 'PKPRI THR', nominal: 0 },
      { id: 'p13', name: 'Infaq/Kegiatan Rohani', nominal: 100000 },
      { id: 'p14', name: 'BAZNAS', nominal: 290000 },
      { id: 'p15', name: 'Beras Rojolele "SRINUK"', nominal: 150000 },
      { id: 'p16', name: 'DPLK', nominal: 0 },
      { id: 'p17', name: 'Taspen Life', nominal: 0 },
      { id: 'p18', name: 'Espema Peduli', nominal: 75000 },
    ]
  },
  {
    id: 'SLIP-2026-03-002',
    nip: '987654321', // NIP dummy lainnya
    namaGuru: 'Heru Munadi, M.Pd.',
    bulan: 'Maret',
    tahun: 2026,
    gajiKotor: 7581500,
    angsuranBankJateng: 1000000,
    angsuranBankJatengKe: 12,
    gajiMasukRekening: 6581500,
    potongan: [
      { id: 'p1', name: 'Wajib Kop. Narasoma', nominal: 0 },
      { id: 'p2', name: 'Angs. Kop. Narasoma', nominal: 1180000, angsuranKe: 2 },
      { id: 'p3', name: 'Wajib Kop. Bahtera', nominal: 100000 },
      { id: 'p4', name: 'Angs. Kop. Bahtera', nominal: 0 },
      { id: 'p5', name: 'KORPRI Kecamatan', nominal: 10000 },
      { id: 'p6', name: 'Danpen PGRI', nominal: 32250 },
      { id: 'p7', name: 'Dansos Dinas', nominal: 0 },
      { id: 'p8', name: 'Pralenan', nominal: 0 },
      { id: 'p9', name: 'Iuran Dharma Wanita', nominal: 15000 },
      { id: 'p10', name: 'Iuran Keluarga / Sosial (Dansos 5)', nominal: 25000 },
      { id: 'p11', name: 'PKPRI Pralenan Pensiun', nominal: 65000 },
      { id: 'p12', name: 'PKPRI THR', nominal: 0 },
      { id: 'p13', name: 'Infaq/Kegiatan Rohani', nominal: 50000 },
      { id: 'p14', name: 'BAZNAS', nominal: 0 },
      { id: 'p15', name: 'Beras Rojolele "SRINUK"', nominal: 150000 },
      { id: 'p16', name: 'DPLK', nominal: 0 },
      { id: 'p17', name: 'Taspen Life', nominal: 100000 },
      { id: 'p18', name: 'Espema Peduli', nominal: 75000 },
    ]
  }
];

export const getSlipByNip = (nip: string) => {
  // Fallback to the first slip if nip is not found exactly, just for demonstration
  const slip = mockSlipPotongan.find(s => s.nip === nip);
  return slip || mockSlipPotongan[0];
};

export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};
