/**
 * ============================================================
 * APD AUDIT - Google Apps Script Backend
 * ============================================================
 * 
 * CARA DEPLOY:
 * 1. Buka Google Sheet Anda
 * 2. Klik menu Extensions > Apps Script
 * 3. Hapus kode yang ada, paste SEMUA kode ini
 * 4. Klik Deploy > New Deployment
 * 5. Pilih Type: Web App
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Klik Deploy, copy URL-nya
 * 9. Paste URL di dashboard: menu Konfigurasi > Apps Script URL
 * ============================================================
 */

const SPREADSHEET_ID = '1_vY-60vETHUz-SYMz63Mb579ERnzA5otLedYasJFMW0';
const AUDIT_SHEET = 'Laporan Audit';
const MASTER_SHEET = 'Master APD';

// ===== HEADERS =====
const AUDIT_HEADERS = [
  'ID', 'Tanggal', 'Waktu', 'Auditor', 'Jabatan Auditor',
  'Nama Nakes', 'Profesi', 'Area', 'Shift', 'Tindakan',
  'ST Pemeriksaan', 'ST Bedah/Steril', 'ST Rumah Tangga',
  'Masker Bedah', 'N95/Respiratorik', 'Goggle', 'Faceshield',
  'Gaun', 'Celemek', 'Apron', 'Topi', 'Sepatu Boots', 'Sepatu Kerja',
  'Status', 'Skor (%)', 'Keterangan', 'Disimpan Pada'
];

const APD_KEYS = [
  'st_periksa', 'st_bedah', 'st_rt', 'masker_bedah', 'n95',
  'goggle', 'faceshield', 'gaun', 'celemek', 'apron',
  'topi', 'boots', 'sepatu_kerja'
];

// ===== CORS HANDLER =====
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
}

// ===== GET Handler =====
function doGet(e) {
  try {
    const action = e.parameter.action || '';
    let result;
    
    if (action === 'ping') {
      result = { ok: true, message: 'APD Audit Apps Script aktif ✓' };
    } else if (action === 'getAudits') {
      result = getAudits(e.parameter);
    } else if (action === 'getMaster') {
      result = getMaster();
    } else if (action === 'getSummary') {
      result = getSummary();
    } else {
      result = { ok: true, message: 'APD Audit API Ready', version: '2.0' };
    }
    
    return jsonResponse(result);
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ===== POST Handler =====
function doPost(e) {
  try {
    let body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    
    const action = body.action || e.parameter.action || '';
    let result;
    
    if (action === 'addAudit') {
      result = addAudit(body.data);
    } else if (action === 'updateMaster') {
      result = updateMaster(body.data);
    } else if (action === 'deleteAudit') {
      result = deleteAuditById(body.id);
    } else {
      result = { ok: false, error: 'Unknown action: ' + action };
    }
    
    return jsonResponse(result);
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ===== ADD AUDIT =====
function addAudit(rows) {
  if (!rows || !Array.isArray(rows)) {
    rows = rows ? [rows] : [];
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(AUDIT_SHEET);
  
  // Create sheet if not exists
  if (!sheet) {
    sheet = ss.insertSheet(AUDIT_SHEET);
    // Add headers with formatting
    const headerRow = sheet.getRange(1, 1, 1, AUDIT_HEADERS.length);
    headerRow.setValues([AUDIT_HEADERS]);
    headerRow.setBackground('#0f4c81');
    headerRow.setFontColor('#ffffff');
    headerRow.setFontWeight('bold');
    headerRow.setFontSize(11);
    sheet.setFrozenRows(1);
    
    // Set column widths
    sheet.setColumnWidth(1, 50);   // ID
    sheet.setColumnWidth(2, 100);  // Tanggal
    sheet.setColumnWidth(3, 70);   // Waktu
    sheet.setColumnWidth(4, 150);  // Auditor
    sheet.setColumnWidth(10, 200); // Tindakan
  }
  
  const addedCount = rows.length;
  const data = rows.map(row => [
    row.id || Date.now(),
    row.tanggal || '',
    row.waktu || '',
    row.auditor || '',
    row.jabatan || '',
    row.nakes || '',
    row.profesi || '',
    row.area || '',
    row.shift || '',
    row.tindakan || '',
    // APD values
    ...APD_KEYS.map(k => {
      const v = row.apd ? row.apd[k] : null;
      return v === 'Y' ? 'Ya' : v === 'N' ? 'Tidak' : 'N/A';
    }),
    row.status || '',
    row.skor != null ? row.skor : '',
    row.ket || '',
    row.savedAt || new Date().toISOString()
  ]);
  
  sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length)
    .setValues(data);
  
  // Color rows by status
  const lastRow = sheet.getLastRow();
  data.forEach((row, i) => {
    const status = row[23]; // Status column
    const rowNum = lastRow - data.length + i + 1;
    const range = sheet.getRange(rowNum, 24, 1, 1);
    if (status === 'Patuh') {
      range.setBackground('#d1fae5');
      range.setFontColor('#065f46');
    } else if (status === 'Tidak Patuh') {
      range.setBackground('#fee2e2');
      range.setFontColor('#991b1b');
    } else if (status === 'Patuh Sebagian') {
      range.setBackground('#fef3c7');
      range.setFontColor('#92400e');
    }
  });
  
  // Auto-resize
  sheet.autoResizeColumns(1, 10);
  
  return { ok: true, added: addedCount, message: `${addedCount} data berhasil ditambahkan` };
}

// ===== GET AUDITS =====
function getAudits(params) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(AUDIT_SHEET);
  if (!sheet || sheet.getLastRow() <= 1) return { ok: true, data: [] };
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
  
  // Filter
  let filtered = rows;
  if (params.area) filtered = filtered.filter(r => r['Area'] === params.area);
  if (params.dari) filtered = filtered.filter(r => r['Tanggal'] >= params.dari);
  if (params.sampai) filtered = filtered.filter(r => r['Tanggal'] <= params.sampai);
  if (params.status) filtered = filtered.filter(r => r['Status'] === params.status);
  
  return { ok: true, data: filtered, total: filtered.length };
}

// ===== GET MASTER =====
function getMaster() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(MASTER_SHEET) || ss.getSheets()[0];
  if (!sheet) return { ok: true, data: [] };
  
  const data = sheet.getDataRange().getValues();
  return { ok: true, data, total: data.length };
}

// ===== GET SUMMARY =====
function getSummary() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(AUDIT_SHEET);
  if (!sheet || sheet.getLastRow() <= 1) {
    return { ok: true, total: 0, patuh: 0, tidak: 0, partial: 0, pct: 0 };
  }
  
  const data = sheet.getRange(2, 1, sheet.getLastRow()-1, 25).getValues();
  const total = data.length;
  const patuh = data.filter(r => r[23] === 'Patuh').length;
  const tidak = data.filter(r => r[23] === 'Tidak Patuh').length;
  const partial = data.filter(r => r[23] === 'Patuh Sebagian').length;
  
  return {
    ok: true, total, patuh, tidak, partial,
    pct: total ? Math.round(patuh/total*100) : 0
  };
}

// ===== UPDATE MASTER =====
function updateMaster(data) {
  // Store master data locally in Script Properties
  PropertiesService.getScriptProperties()
    .setProperty('master_data', JSON.stringify(data));
  return { ok: true, message: 'Master data updated' };
}

// ===== DELETE AUDIT =====
function deleteAuditById(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(AUDIT_SHEET);
  if (!sheet) return { ok: false, error: 'Sheet not found' };
  
  const data = sheet.getDataRange().getValues();
  for (let i = data.length-1; i >= 1; i--) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i+1);
      return { ok: true, message: 'Row deleted' };
    }
  }
  return { ok: false, error: 'Row not found' };
}

// ===== HELPER =====
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
