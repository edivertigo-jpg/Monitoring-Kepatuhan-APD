// ============================================================
// APD MONITOR — RSU SURYA HUSADHA
// Google Apps Script Backend
// Deploy sebagai Web App: Execute as "Me", Access "Anyone"
// ============================================================

const SS_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── SHEET NAMES ────────────────────────────────────────────
const SHEET_LOG      = 'LOG_VERIFIKASI';
const SHEET_MASTER   = 'MASTER_APD';
const SHEET_PANDUAN  = 'PANDUAN_APD';
const SHEET_SUMMARY  = 'SUMMARY';

// ── INIT: buat semua sheet kalau belum ada ─────────────────
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. PANDUAN_APD
  let panduan = ss.getSheetByName(SHEET_PANDUAN);
  if (!panduan) {
    panduan = ss.insertSheet(SHEET_PANDUAN);
    setupPanduan(panduan);
  }

  // 2. MASTER_APD
  let master = ss.getSheetByName(SHEET_MASTER);
  if (!master) {
    master = ss.insertSheet(SHEET_MASTER);
    setupMaster(master);
  }

  // 3. LOG_VERIFIKASI
  let log = ss.getSheetByName(SHEET_LOG);
  if (!log) {
    log = ss.insertSheet(SHEET_LOG);
    setupLog(log);
  }

  // 4. SUMMARY
  let summary = ss.getSheetByName(SHEET_SUMMARY);
  if (!summary) {
    summary = ss.insertSheet(SHEET_SUMMARY);
    setupSummary(summary);
  }

  return 'Semua sheet berhasil dibuat!';
}

// ── SETUP PANDUAN APD (Acuan PMK 27/2017) ─────────────────
function setupPanduan(sheet) {
  const headers = [
    'AREA', 'JENIS TINDAKAN', 'SARUNG TANGAN', 'JENIS ST',
    'MASKER', 'JENIS MASKER', 'GAUN/APRON', 'KACA MATA', 'TOPI', 'SEPATU BOOT'
  ];
  const data = [
    // PERAWATAN
    ['Perawatan','Memandikan Pasien','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Menolong BAB','Ya','Pemeriksaan','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Menolong BAK','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Oral Higiene','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Pengambilan Darah Vena','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Pengisapan Lendir / Suction','Ya','Pemeriksaan','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Rawat Luka Mayor / Post Op','Ya','Bedah','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Rawat Luka Minor','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Perawatan Luka Infeksi','Ya','Bedah','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Mengukur TTV / Vital Sign','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Pemasangan Infus','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Injeksi IV Langsung / Penyuntikan','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Pemasangan Kateter / Dawer','Ya','Bedah','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Melap Alat-alat Pasien','Ya','Pemeriksaan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Intubasi','Ya','Bedah','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Pemasangan CVC / CVL','Ya','Pemeriksaan','Ya','Bedah','Ya','Ya','Ya','Tidak'],
    ['Perawatan','Membersihkan Peralatan Habis Pakai','Ya','Pemeriksaan','Ya','Bedah','Ya','Ya','Tidak','Tidak'],
    ['Perawatan','Transportasi Pasien','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Pelayanan Pasien Infeksi Airborne','Ya','Pemeriksaan','Ya','Respiratorik','Ya','Tidak','Tidak','Tidak'],
    ['Perawatan','Pemasangan NGT','Ya','Pemeriksaan','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Injeksi IM','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Injeksi IV via IV Cath','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Nebulisasi','Ya','Pemeriksaan','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak'],
    ['Perawatan','Memberikan Diit Pasien','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    // VK
    ['VK / Persalinan','Pertolongan Persalinan Normal','Ya','Bedah','Ya','Bedah','Ya','Ya','Ya','Tidak'],
    ['VK / Persalinan','Episiotomi / Hecting','Ya','Bedah','Ya','Bedah','Ya','Ya','Ya','Tidak'],
    // LINGKUNGAN
    ['Lingkungan / CS','Pembersihan Lingkungan Rutin','Ya','Rumah Tangga','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Lingkungan / CS','Pembersihan Percikan Cairan Tubuh','Ya','Rumah Tangga','Ya','Bedah','Ya','Ya','Tidak','Tidak'],
    ['Lingkungan / CS','Pengangkutan Sampah ke TPS','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Tidak','Ya'],
    ['Lingkungan / CS','Pembersihan Toilet','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Tidak','Ya'],
    // DAPUR/GIZI
    ['Gizi / Dapur','Serah Terima Bahan Makanan','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Ya','Tidak'],
    ['Gizi / Dapur','Pengolahan & Penyajian Makanan','Ya','Pemeriksaan','Tidak','Tidak','Ya','Tidak','Ya','Tidak'],
    ['Gizi / Dapur','Pencucian Bahan Makanan','Tidak','Tidak','Ya','Bedah','Ya','Tidak','Ya','Tidak'],
    ['Gizi / Dapur','Memotong Bahan Makanan','Ya','Pemeriksaan','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['Gizi / Dapur','Memasak','Tidak','Tidak','Ya','Bedah','Ya','Tidak','Ya','Tidak'],
    ['Gizi / Dapur','Penyajian & Distribusi Makanan','Ya','Pemeriksaan','Ya','Bedah','Ya','Tidak','Ya','Tidak'],
    ['Gizi / Dapur','Mencuci Alat Kotor','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Ya','Ya'],
    // LINEN
    ['Laundry','Pengangkutan Linen Kotor','Ya','Rumah Tangga','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    ['Laundry','Serah Terima Linen Kotor','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Ya','Ya'],
    ['Laundry','Perendaman / Pencucian Linen','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Ya','Ya'],
    ['Laundry','Pengeringan Linen','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Ya','Ya'],
    ['Laundry','Penyetrikaan Linen','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['Laundry','Pelipatan & Penyimpanan Linen','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['Laundry','Distribusi Linen Bersih','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak','Tidak'],
    ['Laundry','Menghitung Linen Kotor Non-Infeksius','Ya','Rumah Tangga','Ya','Bedah','Ya','Tidak','Tidak','Tidak'],
    // CSSD
    ['CSSD','Serah Terima Alat Kotor','Ya','Pemeriksaan','Ya','Bedah','Ya','Tidak','Ya','Ya'],
    ['CSSD','Perendaman Alat','Ya','Pemeriksaan','Ya','Bedah','Ya','Tidak','Ya','Ya'],
    ['CSSD','Pencucian Alat','Ya','Pemeriksaan','Ya','Bedah','Ya','Ya','Ya','Ya'],
    ['CSSD','Pengeringan Alat','Ya','Pemeriksaan','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['CSSD','Pengepakan / Packing Alat','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['CSSD','Sterilisasi Alat','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['CSSD','Penyimpanan Alat Steril','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    ['CSSD','Distribusi Alat Steril','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak'],
    // FARMASI
    ['Farmasi','Peracikan Obat','Ya','Pemeriksaan','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    // REKAM MEDIS
    ['Rekam Medis','Pelayanan Rekam Medis','Tidak','Tidak','Ya','Bedah','Tidak','Tidak','Tidak','Tidak'],
    // RUANG ISOLASI
    ['Ruang Isolasi','Suction (Isolasi)','Ya','Pemeriksaan','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak'],
    ['Ruang Isolasi','Intubasi (Isolasi)','Ya','Bedah','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak'],
    ['Ruang Isolasi','Nebulisasi (Isolasi)','Ya','Pemeriksaan','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak'],
  ];

  styleHeader(sheet, headers, '#1a5276', '#FFFFFF');
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  sheet.setFrozenRows(1);
  autoResizeAll(sheet);
}

// ── SETUP MASTER APD (bisa ditambah tindakan baru) ─────────
function setupMaster(sheet) {
  const headers = [
    'ID', 'UNIT/AREA', 'TINDAKAN', 'KODE PROFESI', 'TINGKAT RISIKO',
    'SARUNG TANGAN WAJIB', 'MASKER WAJIB', 'JENIS MASKER WAJIB',
    'GAUN WAJIB', 'KACA MATA WAJIB', 'TOPI WAJIB', 'SEPATU BOOT WAJIB',
    'SUMBER ACUAN', 'AKTIF'
  ];
  const data = [
    // Perawatan
    ['P001','Perawatan','Memandikan Pasien','Perawat','Rendah','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P002','Perawatan','Menolong BAB','Perawat','Rendah','Ya','Ya','Bedah','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P003','Perawatan','Menolong BAK','Perawat','Rendah','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P004','Perawatan','Oral Higiene','Perawat','Rendah','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P005','Perawatan','Mengukur TTV / Vital Sign','Perawat','Rendah','Tidak','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P006','Perawatan','Memberikan Diit Pasien','Perawat','Rendah','Tidak','Tidak','','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['P007','Perawatan','Transportasi Pasien','Perawat','Rendah','Tidak','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27','Ya'],
    ['P008','Perawatan','Melap Alat-alat Pasien','Perawat','Rendah','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27','Ya'],
    ['P009','Perawatan','Pengambilan Darah Vena','Perawat','Sedang','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27','Ya'],
    ['P010','Perawatan','Pemasangan Infus','Perawat','Sedang','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P011','Perawatan','Injeksi IV Langsung / Penyuntikan','Perawat','Sedang','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P012','Perawatan','Injeksi IM','Perawat','Rendah','Tidak','Tidak','','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['P013','Perawatan','Injeksi IV via IV Cath','Perawat','Rendah','Tidak','Tidak','','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['P014','Perawatan','Pemasangan NGT','Perawat','Sedang','Ya','Ya','Bedah','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['P015','Perawatan','Pemasangan Kateter / Dawer','Perawat','Sedang','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P016','Perawatan','Rawat Luka Minor','Perawat','Sedang','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P017','Perawatan','Rawat Luka Mayor / Post Op','Perawat','Sedang','Ya','Ya','Bedah','Ya','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P018','Perawatan','Perawatan Luka Infeksi','Perawat','Tinggi','Ya','Ya','Bedah','Ya','Tidak','Tidak','Tidak','PMK27','Ya'],
    ['P019','Perawatan','Pengisapan Lendir / Suction','Perawat','Tinggi','Ya','Ya','Bedah','Ya','Tidak','Ya','Tidak','PMK27+RSH','Ya'],
    ['P020','Perawatan','Pemasangan CVC / CVL','Perawat','Tinggi','Ya','Ya','Bedah','Ya','Ya','Ya','Tidak','PMK27+RSH','Ya'],
    ['P021','Perawatan','Intubasi','Perawat','Tinggi','Ya','Ya','Bedah','Ya','Tidak','Tidak','Tidak','PMK27+RSH','Ya'],
    ['P022','Perawatan','Nebulisasi','Perawat','Tinggi','Ya','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['P023','Perawatan','Membersihkan Peralatan Habis Pakai','Perawat','Sedang','Ya','Ya','Bedah','Ya','Ya','Tidak','Tidak','PMK27','Ya'],
    ['P024','Perawatan','Pelayanan Pasien Infeksi Airborne','Perawat','Tinggi','Ya','Ya','N95/Respirator','Ya','Tidak','Tidak','Tidak','PMK27','Ya'],
    // Isolasi
    ['I001','Ruang Isolasi','Suction (Isolasi)','Perawat','Tinggi','Ya','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['I002','Ruang Isolasi','Intubasi (Isolasi)','Perawat','Tinggi','Ya','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['I003','Ruang Isolasi','Nebulisasi (Isolasi)','Perawat','Tinggi','Ya','Ya','N95/Respirator','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    // VK
    ['V001','VK / Persalinan','Pertolongan Persalinan Normal','Bidan','Tinggi','Ya','Ya','Bedah','Ya','Ya','Ya','Tidak','PMK27','Ya'],
    ['V002','VK / Persalinan','Episiotomi / Hecting','Bidan','Tinggi','Ya','Ya','Bedah','Ya','Ya','Ya','Tidak','RSH','Ya'],
    // CSSD
    ['C001','CSSD','Serah Terima Alat Kotor','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Ya','Ya','RSH','Ya'],
    ['C002','CSSD','Perendaman Alat','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Ya','Ya','RSH','Ya'],
    ['C003','CSSD','Pencucian Alat','Penunjang','Tinggi','Ya','Ya','Bedah','Ya','Ya','Ya','Ya','PMK27+RSH','Ya'],
    ['C004','CSSD','Pengeringan Alat','Penunjang','Rendah','Ya','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['C005','CSSD','Pengepakan / Packing Alat','Penunjang','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['C006','CSSD','Sterilisasi Alat','Penunjang','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['C007','CSSD','Penyimpanan Alat Steril','Penunjang','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['C008','CSSD','Distribusi Alat Steril','Penunjang','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    // GIZI
    ['G001','Gizi / Dapur','Serah Terima Bahan Makanan','Penunjang','Rendah','Tidak','Tidak','','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['G002','Gizi / Dapur','Pengolahan & Penyajian Makanan','Penunjang','Rendah','Ya','Tidak','','Ya','Tidak','Ya','Tidak','PMK27+RSH','Ya'],
    ['G003','Gizi / Dapur','Pencucian Bahan Makanan','Penunjang','Rendah','Tidak','Ya','Bedah','Ya','Tidak','Ya','Tidak','RSH','Ya'],
    ['G004','Gizi / Dapur','Memotong Bahan Makanan','Penunjang','Rendah','Ya','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['G005','Gizi / Dapur','Memasak','Penunjang','Rendah','Tidak','Ya','Bedah','Ya','Tidak','Ya','Tidak','RSH','Ya'],
    ['G006','Gizi / Dapur','Penyajian & Distribusi Makanan','Penunjang','Rendah','Ya','Ya','Bedah','Ya','Tidak','Ya','Tidak','RSH','Ya'],
    ['G007','Gizi / Dapur','Mencuci Alat Kotor','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Ya','Ya','PMK27+RSH','Ya'],
    // LAUNDRY
    ['L001','Laundry','Pengangkutan Linen Kotor','Penunjang','Sedang','Ya','Ya','Bedah','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['L002','Laundry','Serah Terima Linen Kotor','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Ya','Ya','PMK27+RSH','Ya'],
    ['L003','Laundry','Perendaman / Pencucian Linen','Penunjang','Tinggi','Ya','Ya','Bedah','Ya','Tidak','Ya','Ya','PMK27+RSH','Ya'],
    ['L004','Laundry','Pengeringan Linen','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Ya','Ya','RSH','Ya'],
    ['L005','Laundry','Penyetrikaan Linen','Penunjang','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['L006','Laundry','Pelipatan & Penyimpanan Linen','Penunjang','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Ya','Tidak','RSH','Ya'],
    ['L007','Laundry','Distribusi Linen Bersih','Penunjang','Rendah','Tidak','Tidak','','Tidak','Tidak','Tidak','Tidak','RSH','Ya'],
    ['L008','Laundry','Menghitung Linen Kotor Non-Infeksius','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Tidak','Tidak','RSH','Ya'],
    // CS
    ['E001','Lingkungan / CS','Pembersihan Lingkungan Rutin','Penunjang','Rendah','Ya','Tidak','','Tidak','Tidak','Tidak','Tidak','PMK27','Ya'],
    ['E002','Lingkungan / CS','Pembersihan Percikan Cairan Tubuh','Penunjang','Tinggi','Ya','Ya','Bedah','Ya','Ya','Tidak','Tidak','PMK27','Ya'],
    ['E003','Lingkungan / CS','Pengangkutan Sampah ke TPS','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Tidak','Ya','PMK27','Ya'],
    ['E004','Lingkungan / CS','Pembersihan Toilet','Penunjang','Sedang','Ya','Ya','Bedah','Ya','Tidak','Tidak','Ya','PMK27','Ya'],
    // FARMASI
    ['F001','Farmasi','Peracikan Obat','Apoteker','Sedang','Ya','Ya','Bedah','Tidak','Tidak','Tidak','Tidak','PMK27','Ya'],
    // RM
    ['R001','Rekam Medis','Pelayanan Rekam Medis','Admin','Rendah','Tidak','Ya','Bedah','Tidak','Tidak','Tidak','Tidak','PMK27','Ya'],
  ];

  styleHeader(sheet, headers, '#1a5276', '#FFFFFF');
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  sheet.setFrozenRows(1);
  autoResizeAll(sheet);
}

// ── SETUP LOG VERIFIKASI ────────────────────────────────────
function setupLog(sheet) {
  const headers = [
    'TIMESTAMP', 'TANGGAL', 'WAKTU', 'BULAN', 'TAHUN',
    'OBSERVER', 'RUANGAN', 'NAMA PETUGAS', 'KODE PROFESI',
    'UNIT/AREA', 'ID TINDAKAN', 'TINDAKAN',
    'SARUNG TANGAN DIPAKAI', 'MASKER DIPAKAI', 'JENIS MASKER DIPAKAI',
    'GAUN DIPAKAI', 'KACA MATA DIPAKAI', 'TOPI DIPAKAI', 'SEPATU BOOT DIPAKAI',
    'STATUS KEPATUHAN', 'APD KURANG', 'KETERANGAN'
  ];
  styleHeader(sheet, headers, '#1a5276', '#FFFFFF');
  sheet.setFrozenRows(1);
  autoResizeAll(sheet);
}

// ── SETUP SUMMARY ───────────────────────────────────────────
function setupSummary(sheet) {
  sheet.getRange('A1').setValue('SUMMARY').setFontSize(16).setFontWeight('bold').setFontColor('#1a5276');
  sheet.getRange('A3').setValue('Data summary diperbarui otomatis setiap ada input verifikasi baru.');
  sheet.getRange('A3').setFontColor('#888888').setFontStyle('italic');
  autoResizeAll(sheet);
}

// ── HELPER STYLES ───────────────────────────────────────────
function styleHeader(sheet, headers, bgColor, fontColor) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(bgColor)
    .setFontColor(fontColor)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}
function autoResizeAll(sheet) {
  sheet.autoResizeColumns(1, sheet.getLastColumn() || 14);
}

// ── WEB APP ENTRY POINTS ────────────────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    if (action === 'getMaster')       result = getMasterData();
    else if (action === 'getLog')     result = getLogData(e.parameter);
    else if (action === 'getSummary') result = getSummaryData();
    else if (action === 'getUnits')   result = getUnits();
    else                              result = { status: 'ok', message: 'APD Monitor API' };
  } catch(err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'saveVerifikasi') result = saveVerifikasi(data);
    else if (data.action === 'addMaster') result = addMasterTindakan(data);
    else if (data.action === 'updateMaster') result = updateMasterTindakan(data);
    else result = { status: 'error', message: 'Unknown action' };
  } catch(err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET MASTER DATA ─────────────────────────────────────────
function getMasterData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_MASTER);
  if (!sheet) return { status: 'error', message: 'Sheet MASTER_APD tidak ditemukan. Jalankan initSheets() dulu.' };

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).filter(r => r[0] !== '' && r[13] === 'Ya').map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
  return { status: 'ok', data: rows };
}

// ── GET UNITS ───────────────────────────────────────────────
function getUnits() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_MASTER);
  if (!sheet) return { status: 'error', message: 'Sheet tidak ditemukan' };

  const data = sheet.getDataRange().getValues().slice(1);
  const units = [...new Set(data.filter(r => r[13] === 'Ya').map(r => r[1]))].sort();
  return { status: 'ok', data: units };
}

// ── SAVE VERIFIKASI ─────────────────────────────────────────
function saveVerifikasi(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName(SHEET_LOG);
  if (!logSheet) return { status: 'error', message: 'Sheet LOG tidak ditemukan' };

  const now = new Date();
  const tgl = Utilities.formatDate(now, 'Asia/Makassar', 'dd/MM/yyyy');
  const wkt = Utilities.formatDate(now, 'Asia/Makassar', 'HH:mm:ss');
  const bln = Utilities.formatDate(now, 'Asia/Makassar', 'MMMM yyyy');
  const thn = Utilities.formatDate(now, 'Asia/Makassar', 'yyyy');

  // Ambil master untuk evaluasi
  const masterSheet = ss.getSheetByName(SHEET_MASTER);
  const masterData = masterSheet.getDataRange().getValues();
  const masterHeaders = masterData[0];
  const masterRow = masterData.slice(1).find(r => r[0] === data.idTindakan);

  let status = 'PATUH';
  let apdKurang = [];

  if (masterRow) {
    const idx = {};
    masterHeaders.forEach((h, i) => idx[h] = i);

    const checks = [
      { field: 'SARUNG TANGAN WAJIB', value: data.sarungtangan, label: 'Sarung Tangan' },
      { field: 'MASKER WAJIB',        value: data.masker,       label: 'Masker' },
      { field: 'GAUN WAJIB',          value: data.gaun,         label: 'Gaun/Apron' },
      { field: 'KACA MATA WAJIB',     value: data.kacamata,     label: 'Kaca Mata' },
      { field: 'TOPI WAJIB',          value: data.topi,         label: 'Topi' },
      { field: 'SEPATU BOOT WAJIB',   value: data.sepatuboot,   label: 'Sepatu Boot' },
    ];

    checks.forEach(c => {
      const wajib = masterRow[idx[c.field]] === 'Ya';
      const dipakai = c.value === 'Ya';
      if (wajib && !dipakai) {
        status = 'TIDAK PATUH';
        apdKurang.push(c.label);
      }
    });

    // Cek jenis masker
    if (masterRow[idx['MASKER WAJIB']] === 'Ya' && data.masker === 'Ya') {
      const jenisMaskerWajib = masterRow[idx['JENIS MASKER WAJIB']];
      const jenisMaskerDipakai = data.jenisMasker || '';
      if (jenisMaskerWajib && jenisMaskerWajib !== 'Tidak' &&
          !jenisMaskerDipakai.toLowerCase().includes(jenisMaskerWajib.toLowerCase())) {
        if (status === 'PATUH') status = 'TIDAK PATUH';
        apdKurang.push('Jenis Masker tidak sesuai (perlu: ' + jenisMaskerWajib + ')');
      }
    }
  }

  const row = [
    now.toISOString(), tgl, wkt, bln, thn,
    data.observer || '', data.ruangan || '',
    data.namaPetugas || '', data.kodeProfesi || '',
    data.unit || '', data.idTindakan || '', data.tindakan || '',
    data.sarungtangan || 'Tidak', data.masker || 'Tidak', data.jenisMasker || '-',
    data.gaun || 'Tidak', data.kacamata || 'Tidak', data.topi || 'Tidak', data.sepatuboot || 'Tidak',
    status, apdKurang.join('; '), data.keterangan || ''
  ];

  logSheet.appendRow(row);

  // Warnai baris berdasarkan status
  const lastRow = logSheet.getLastRow();
  if (status === 'PATUH') {
    logSheet.getRange(lastRow, 20).setBackground('#d4edda').setFontColor('#155724');
  } else {
    logSheet.getRange(lastRow, 20).setBackground('#f8d7da').setFontColor('#721c24');
  }

  return {
    status: 'ok',
    kepatuhan: status,
    apdKurang: apdKurang,
    rowNum: lastRow
  };
}

// ── ADD TINDAKAN BARU KE MASTER ─────────────────────────────
function addMasterTindakan(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_MASTER);
  if (!sheet) return { status: 'error', message: 'Sheet MASTER_APD tidak ditemukan' };

  // Generate ID otomatis
  const lastRow = sheet.getLastRow();
  const existingData = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const prefix = data.unit.substring(0, 1).toUpperCase();
  const nums = existingData.filter(id => String(id).startsWith(prefix)).map(id => parseInt(String(id).slice(1)) || 0);
  const nextNum = nums.length ? Math.max(...nums) + 1 : 1;
  const newId = prefix + String(nextNum).padStart(3, '0');

  const row = [
    newId, data.unit, data.tindakan, data.kodeProfesi || 'Perawat', data.risiko || 'Sedang',
    data.sarungtangan || 'Tidak', data.masker || 'Tidak', data.jenisMasker || '',
    data.gaun || 'Tidak', data.kacamata || 'Tidak', data.topi || 'Tidak', data.sepatuboot || 'Tidak',
    data.sumber || 'RSH', 'Ya'
  ];

  sheet.appendRow(row);
  return { status: 'ok', id: newId, message: 'Tindakan berhasil ditambahkan' };
}

// ── UPDATE MASTER TINDAKAN ──────────────────────────────────
function updateMasterTindakan(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_MASTER);
  if (!sheet) return { status: 'error', message: 'Sheet tidak ditemukan' };

  const allData = sheet.getDataRange().getValues();
  const rowIdx = allData.findIndex((r, i) => i > 0 && r[0] === data.id);
  if (rowIdx === -1) return { status: 'error', message: 'ID tidak ditemukan' };

  const excelRow = rowIdx + 1;
  const updates = [
    data.unit, data.tindakan, data.kodeProfesi, data.risiko,
    data.sarungtangan, data.masker, data.jenisMasker,
    data.gaun, data.kacamata, data.topi, data.sepatuboot,
    data.sumber, data.aktif
  ];
  sheet.getRange(excelRow, 2, 1, updates.length).setValues([updates]);
  return { status: 'ok', message: 'Tindakan berhasil diperbarui' };
}

// ── GET LOG DATA ────────────────────────────────────────────
function getLogData(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_LOG);
  if (!sheet || sheet.getLastRow() < 2) return { status: 'ok', data: [] };

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  let rows = data.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });

  if (params.unit) rows = rows.filter(r => r['UNIT/AREA'] === params.unit);
  if (params.bulan) rows = rows.filter(r => r['BULAN'] === params.bulan);
  if (params.limit) rows = rows.slice(0, parseInt(params.limit));

  return { status: 'ok', data: rows };
}

// ── GET SUMMARY DATA ────────────────────────────────────────
function getSummaryData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_LOG);
  if (!sheet || sheet.getLastRow() < 2) {
    return { status: 'ok', data: { total: 0, patuh: 0, tidakPatuh: 0, rate: 0, byUnit: {}, recent: [] } };
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const hIdx = {};
  headers.forEach((h, i) => hIdx[h] = i);

  const rows = data.slice(1);
  const total = rows.length;
  const patuh = rows.filter(r => r[hIdx['STATUS KEPATUHAN']] === 'PATUH').length;
  const tidakPatuh = total - patuh;
  const rate = total ? Math.round(patuh / total * 100) : 0;

  const byUnit = {};
  rows.forEach(r => {
    const unit = r[hIdx['UNIT/AREA']];
    if (!byUnit[unit]) byUnit[unit] = { total: 0, patuh: 0 };
    byUnit[unit].total++;
    if (r[hIdx['STATUS KEPATUHAN']] === 'PATUH') byUnit[unit].patuh++;
  });

  // Tren 7 hari terakhir
  const trend = {};
  rows.forEach(r => {
    const tgl = r[hIdx['TANGGAL']];
    if (!trend[tgl]) trend[tgl] = { total: 0, patuh: 0 };
    trend[tgl].total++;
    if (r[hIdx['STATUS KEPATUHAN']] === 'PATUH') trend[tgl].patuh++;
  });

  // Recent 20
  const recent = rows.slice(-20).reverse().map(r => ({
    ts: r[hIdx['TANGGAL']] + ' ' + r[hIdx['WAKTU']],
    observer: r[hIdx['OBSERVER']],
    ruangan: r[hIdx['RUANGAN']],
    petugas: r[hIdx['NAMA PETUGAS']],
    profesi: r[hIdx['KODE PROFESI']],
    unit: r[hIdx['UNIT/AREA']],
    tindakan: r[hIdx['TINDAKAN']],
    status: r[hIdx['STATUS KEPATUHAN']],
    apdKurang: r[hIdx['APD KURANG']],
    ket: r[hIdx['KETERANGAN']]
  }));

  return { status: 'ok', data: { total, patuh, tidakPatuh, rate, byUnit, trend, recent } };
}
