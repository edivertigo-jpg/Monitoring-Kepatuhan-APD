# 🏥 APD Monitor — RSU Surya Husadha
## Panduan Setup Google Sheets & Apps Script

---

## LANGKAH 1: Buka Google Sheets

1. Buka folder Google Drive yang sudah disiapkan:
   **https://drive.google.com/drive/folders/1U6ScVRj9OKGPCVx5kE9maabo4n9zg0wH**

2. Buat Spreadsheet baru di folder itu:
   - Klik **"+ Baru"** → **"Google Spreadsheet"**
   - Rename menjadi: `APD Monitor — RSU Surya Husadha`

3. Catat **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

---

## LANGKAH 2: Deploy Apps Script

1. Di Spreadsheet, klik menu **Extensions → Apps Script**

2. Hapus semua isi editor default, lalu **paste seluruh isi `Code.gs`**

3. Klik **💾 Save** (Ctrl+S)

4. Jalankan setup awal:
   - Di bagian atas, pilih fungsi **`initSheets`**
   - Klik tombol **▶ Run**
   - Setujui permintaan akses (klik "Advanced" → "Go to ... (unsafe)" kalau muncul)
   - Tunggu hingga selesai — akan muncul `Semua sheet berhasil dibuat!`

5. Deploy sebagai Web App:
   - Klik **Deploy → New deployment**
   - Pilih type: **Web app**
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
   - Klik **Deploy**
   - **COPY URL** yang muncul (format: `https://script.google.com/macros/s/XXXX/exec`)

---

## LANGKAH 3: Konfigurasi Dashboard

1. Buka file `index.html` di browser

2. Klik tombol **⚙️** di pojok kanan atas

3. Isi:
   - **Web App URL**: paste URL dari langkah 2.5
   - **Spreadsheet ID**: ID dari langkah 1.3
   - **Observer Default**: nama PPI default (opsional)

4. Klik **Test Koneksi** — harus muncul `✅ Koneksi berhasil!`

5. Klik **Simpan**

---

## STRUKTUR SHEET YANG DIBUAT

| Sheet | Isi |
|-------|-----|
| `MASTER_APD` | Master semua tindakan + APD wajib (bisa ditambah dari dashboard) |
| `LOG_VERIFIKASI` | Semua hasil input verifikasi |
| `PANDUAN_APD` | Panduan berdasarkan PMK 27/2017 |
| `SUMMARY` | Catatan summary |

---

## CARA MENAMBAH TINDAKAN BARU

1. Di dashboard, buka tab **Master APD**
2. Klik tombol **➕ Tambah Tindakan**
3. Isi form: unit, nama tindakan, profesi, risiko, APD wajib
4. Klik **Simpan** — otomatis masuk ke Google Sheets

---

## CARA INPUT VERIFIKASI HARIAN

1. Buka tab **Input Verifikasi**
2. Isi: Observer, Ruangan, Nama Petugas, Profesi
3. Pilih Unit → Tindakan
4. Centang APD yang **dipakai petugas** (bukan yang wajib)
5. Klik **Simpan Verifikasi ke Sheets**
6. Status PATUH/TIDAK PATUH langsung muncul

**Logika Kepatuhan:**
- PATUH = semua APD **wajib** terpenuhi
- TIDAK PATUH = ada 1+ APD wajib yang tidak dipakai

---

## EXPORT DATA

- Tab **Laporan** → **Export CSV** untuk download log
- Tombol **Buka di Google Sheets** untuk akses langsung ke Sheets

---

## TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| "Gagal terhubung" | Pastikan Web App di-deploy dengan akses "Anyone" |
| Data tidak muncul | Cek URL di Settings, pastikan tidak ada spasi |
| Sheet tidak ada | Jalankan `initSheets()` dari Apps Script |
| CORS error | Re-deploy Apps Script sebagai versi baru |

---

*Acuan: PMK No.27 Tahun 2017 tentang Pencegahan dan Pengendalian Infeksi di Fasyankes*
