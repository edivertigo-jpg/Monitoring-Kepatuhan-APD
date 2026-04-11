// ============================================================
// MASTER DATA APD - RSU SURYA HUSADHA
// Sumber: STANDAR_APD.xlsx + Tabel Identifikasi 2025
// Acuan regulasi: Permenkes No.27 Tahun 2017 (PMK 27/2017)
// ============================================================

const APD_TYPES = {
  topi:         { id: 'topi',         label: 'Topi Pelindung',        icon: '🪖', short: 'Topi' },
  masker_bedah: { id: 'masker_bedah', label: 'Masker Bedah',          icon: '😷', short: 'Msk.Bedah' },
  masker_n95:   { id: 'masker_n95',   label: 'Masker N95/Respirator', icon: '😮‍💨', short: 'N95' },
  goggle:       { id: 'goggle',       label: 'Goggle/Kacamata',       icon: '🥽', short: 'Goggle' },
  faceshield:   { id: 'faceshield',   label: 'Face Shield',           icon: '🛡️', short: 'F.Shield' },
  gaun:         { id: 'gaun',         label: 'Gaun Pelindung',        icon: '🥼', short: 'Gaun' },
  apron:        { id: 'apron',        label: 'Apron',                 icon: '🧥', short: 'Apron' },
  st_bersih:    { id: 'st_bersih',    label: 'Sarung Tangan Bersih',  icon: '🧤', short: 'ST Bersih' },
  st_steril:    { id: 'st_steril',    label: 'Sarung Tangan Steril',  icon: '🫴', short: 'ST Steril' },
  st_rt:        { id: 'st_rt',        label: 'Sarung Tangan RT',      icon: '🧤', short: 'ST RT' },
  sepatu_boots: { id: 'sepatu_boots', label: 'Sepatu Boots',          icon: '🥾', short: 'Boots' },
  sepatu_kerja: { id: 'sepatu_kerja', label: 'Sepatu Kerja Tertutup', icon: '👟', short: 'Sp.Kerja' },
};

// Risiko: 1=Rendah, 2=Sedang, 3=Tinggi (berdasarkan PMK 27/2017)
const MASTER_APD = [
  // ─── UNIT PERAWATAN UMUM ──────────────────────────────────
  {
    id: 'p001', unit: 'Perawatan', tindakan: 'Memandikan Pasien',
    risiko: 1,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p002', unit: 'Perawatan', tindakan: 'Menolong BAB',
    risiko: 1,
    apd: ['st_bersih', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p003', unit: 'Perawatan', tindakan: 'Menolong BAK',
    risiko: 1,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p004', unit: 'Perawatan', tindakan: 'Oral Higiene',
    risiko: 1,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p005', unit: 'Perawatan', tindakan: 'Mengukur TTV / Vital Sign',
    risiko: 1,
    apd: ['sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p006', unit: 'Perawatan', tindakan: 'Memberikan Diit Pasien',
    risiko: 1,
    apd: ['sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'p007', unit: 'Perawatan', tindakan: 'Transportasi Pasien',
    risiko: 1,
    apd: ['sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'p008', unit: 'Perawatan', tindakan: 'Melap Alat-alat Pasien',
    risiko: 1,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'p009', unit: 'Perawatan', tindakan: 'Pengambilan Darah Vena',
    risiko: 2,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'p010', unit: 'Perawatan', tindakan: 'Pemasangan Infus',
    risiko: 2,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p011', unit: 'Perawatan', tindakan: 'Injeksi IV Langsung',
    risiko: 2,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p012', unit: 'Perawatan', tindakan: 'Injeksi IM',
    risiko: 1,
    apd: ['sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'p013', unit: 'Perawatan', tindakan: 'Injeksi IV via IV Cath',
    risiko: 1,
    apd: ['sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'p014', unit: 'Perawatan', tindakan: 'Pemasangan NGT',
    risiko: 2,
    apd: ['st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'p015', unit: 'Perawatan', tindakan: 'Pemasangan Kateter / Dawer',
    risiko: 2,
    apd: ['st_steril', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p016', unit: 'Perawatan', tindakan: 'Rawat Luka Minor',
    risiko: 2,
    apd: ['masker_bedah', 'st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p017', unit: 'Perawatan', tindakan: 'Rawat Luka Mayor / Post Op',
    risiko: 2,
    apd: ['masker_bedah', 'gaun', 'st_steril', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p018', unit: 'Perawatan', tindakan: 'Perawatan Luka Infeksi',
    risiko: 3,
    apd: ['masker_bedah', 'gaun', 'st_steril', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'p019', unit: 'Perawatan', tindakan: 'Pengisapan Lendir / Suction',
    risiko: 3,
    apd: ['topi', 'masker_bedah', 'apron', 'st_bersih', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p020', unit: 'Perawatan', tindakan: 'Pasang CVC / CVL',
    risiko: 3,
    apd: ['topi', 'masker_bedah', 'goggle', 'gaun', 'st_steril', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p021', unit: 'Perawatan', tindakan: 'Intubasi',
    risiko: 3,
    apd: ['masker_bedah', 'gaun', 'st_steril', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'p022', unit: 'Perawatan', tindakan: 'Nebulisasi',
    risiko: 3,
    apd: ['masker_n95', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'p023', unit: 'Perawatan', tindakan: 'Membersihkan Peralatan Habis Pakai',
    risiko: 2,
    apd: ['st_bersih', 'masker_bedah', 'gaun', 'goggle', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'p024', unit: 'Perawatan', tindakan: 'Pelayanan Pasien Infeksi Airborne',
    risiko: 3,
    apd: ['st_bersih', 'masker_n95', 'gaun', 'sepatu_kerja'],
    sumber: 'PMK27'
  },

  // ─── RUANG ISOLASI ────────────────────────────────────────
  {
    id: 'i001', unit: 'Ruang Isolasi', tindakan: 'Suction (Isolasi)',
    risiko: 3,
    apd: ['masker_n95', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'i002', unit: 'Ruang Isolasi', tindakan: 'Intubasi (Isolasi)',
    risiko: 3,
    apd: ['masker_n95', 'st_steril', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'i003', unit: 'Ruang Isolasi', tindakan: 'Nebulisasi (Isolasi)',
    risiko: 3,
    apd: ['masker_n95', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },

  // ─── VK / PERSALINAN ──────────────────────────────────────
  {
    id: 'v001', unit: 'VK / Persalinan', tindakan: 'Pertolongan Persalinan Normal',
    risiko: 3,
    apd: ['topi', 'masker_bedah', 'goggle', 'gaun', 'st_steril', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'v002', unit: 'VK / Persalinan', tindakan: 'Episiotomi / Hecting',
    risiko: 3,
    apd: ['topi', 'masker_bedah', 'faceshield', 'gaun', 'st_steril', 'sepatu_kerja'],
    sumber: 'RSH'
  },

  // ─── UNIT CSSD ────────────────────────────────────────────
  {
    id: 'c001', unit: 'CSSD', tindakan: 'Serah Terima Alat Kotor',
    risiko: 2,
    apd: ['topi', 'masker_bedah', 'apron', 'st_bersih', 'sepatu_boots'],
    sumber: 'RSH'
  },
  {
    id: 'c002', unit: 'CSSD', tindakan: 'Perendaman Alat',
    risiko: 2,
    apd: ['topi', 'masker_bedah', 'apron', 'st_bersih', 'sepatu_boots'],
    sumber: 'RSH'
  },
  {
    id: 'c003', unit: 'CSSD', tindakan: 'Pencucian Alat',
    risiko: 3,
    apd: ['topi', 'masker_bedah', 'goggle', 'apron', 'st_bersih', 'sepatu_boots'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'c004', unit: 'CSSD', tindakan: 'Pengeringan Alat',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'c005', unit: 'CSSD', tindakan: 'Pengepakan / Packing Alat',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'c006', unit: 'CSSD', tindakan: 'Sterilisasi Alat',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'c007', unit: 'CSSD', tindakan: 'Penyimpanan Alat Steril',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'c008', unit: 'CSSD', tindakan: 'Distribusi Alat Steril',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },

  // ─── UNIT GIZI / DAPUR ────────────────────────────────────
  {
    id: 'g001', unit: 'Gizi / Dapur', tindakan: 'Serah Terima Bahan Makanan',
    risiko: 1,
    apd: ['topi', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'g002', unit: 'Gizi / Dapur', tindakan: 'Pengolahan & Penyajian Makanan',
    risiko: 1,
    apd: ['topi', 'apron', 'sepatu_kerja'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'g003', unit: 'Gizi / Dapur', tindakan: 'Pencucian Bahan Makanan',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'apron', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'g004', unit: 'Gizi / Dapur', tindakan: 'Memotong Bahan Makanan',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'g005', unit: 'Gizi / Dapur', tindakan: 'Memasak',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'apron', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'g006', unit: 'Gizi / Dapur', tindakan: 'Penyajian & Distribusi Makanan',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'apron', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'g007', unit: 'Gizi / Dapur', tindakan: 'Mencuci Alat Kotor',
    risiko: 2,
    apd: ['topi', 'masker_bedah', 'apron', 'sepatu_boots'],
    sumber: 'PMK27+RSH'
  },

  // ─── UNIT LAUNDRY ─────────────────────────────────────────
  {
    id: 'l001', unit: 'Laundry', tindakan: 'Pengangkutan Linen Kotor/Infeksius dari Ruangan',
    risiko: 2,
    apd: ['masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'l002', unit: 'Laundry', tindakan: 'Serah Terima Linen Kotor di Laundry',
    risiko: 2,
    apd: ['topi', 'masker_bedah', 'apron', 'st_bersih', 'sepatu_boots'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'l003', unit: 'Laundry', tindakan: 'Perendaman / Pencucian Linen',
    risiko: 3,
    apd: ['topi', 'masker_bedah', 'apron', 'st_rt', 'sepatu_boots'],
    sumber: 'PMK27+RSH'
  },
  {
    id: 'l004', unit: 'Laundry', tindakan: 'Pengeringan Linen',
    risiko: 2,
    apd: ['topi', 'masker_bedah', 'apron', 'sepatu_boots'],
    sumber: 'RSH'
  },
  {
    id: 'l005', unit: 'Laundry', tindakan: 'Penyetrikaan Linen',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'l006', unit: 'Laundry', tindakan: 'Pelipatan & Penyimpanan Linen Bersih',
    risiko: 1,
    apd: ['topi', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'l007', unit: 'Laundry', tindakan: 'Distribusi Linen Bersih',
    risiko: 1,
    apd: ['sepatu_kerja'],
    sumber: 'RSH'
  },
  {
    id: 'l008', unit: 'Laundry', tindakan: 'Menghitung Linen Kotor Non-Infeksius di Ruangan',
    risiko: 2,
    apd: ['masker_bedah', 'apron', 'st_bersih', 'sepatu_kerja'],
    sumber: 'RSH'
  },

  // ─── UNIT LINGKUNGAN / CS ─────────────────────────────────
  {
    id: 'e001', unit: 'Lingkungan / CS', tindakan: 'Pembersihan Lingkungan Rutin',
    risiko: 1,
    apd: ['st_rt', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'e002', unit: 'Lingkungan / CS', tindakan: 'Pembersihan Percikan Cairan Tubuh',
    risiko: 3,
    apd: ['st_rt', 'masker_bedah', 'gaun', 'goggle', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
  {
    id: 'e003', unit: 'Lingkungan / CS', tindakan: 'Pengangkutan Sampah ke TPS',
    risiko: 2,
    apd: ['st_rt', 'masker_bedah', 'gaun', 'sepatu_boots'],
    sumber: 'PMK27'
  },
  {
    id: 'e004', unit: 'Lingkungan / CS', tindakan: 'Pembersihan Toilet',
    risiko: 2,
    apd: ['st_rt', 'masker_bedah', 'gaun', 'sepatu_boots'],
    sumber: 'PMK27'
  },

  // ─── FARMASI ──────────────────────────────────────────────
  {
    id: 'f001', unit: 'Farmasi', tindakan: 'Peracikan Obat',
    risiko: 2,
    apd: ['st_bersih', 'masker_bedah', 'sepatu_kerja'],
    sumber: 'PMK27'
  },

  // ─── REKAM MEDIS ──────────────────────────────────────────
  {
    id: 'r001', unit: 'Rekam Medis', tindakan: 'Pelayanan Rekam Medis',
    risiko: 1,
    apd: ['masker_bedah', 'sepatu_kerja'],
    sumber: 'PMK27'
  },
];

const RISK_LABEL = { 1: 'Rendah', 2: 'Sedang', 3: 'Tinggi' };
const RISK_COLOR = { 1: '#639922', 2: '#BA7517', 3: '#E24B4A' };
const RISK_BG    = { 1: '#EAF3DE', 2: '#FAEEDA', 3: '#FCEBEB' };

const UNITS = [...new Set(MASTER_APD.map(d => d.unit))];
