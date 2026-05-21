-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PenegakanPerada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no_kejadian" TEXT NOT NULL,
    "id_tiket" TEXT,
    "tanggal_tindakan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_pelanggar" TEXT NOT NULL,
    "nik_pelanggar" TEXT,
    "alamat_pelanggar" TEXT,
    "lokasi_kejadian" TEXT NOT NULL,
    "kode_regulasi" TEXT NOT NULL,
    "pasal_dilanggar" TEXT NOT NULL,
    "jenis_tindakan" TEXT NOT NULL,
    "status_sidang" TEXT NOT NULL DEFAULT 'Penyelidikan / Pemanggilan',
    "tanggal_sidang" DATETIME,
    "lokasi_sidang" TEXT,
    "denda_dijatuhkan" REAL,
    "no_bukti_setor" TEXT,
    "scan_dokumen" TEXT,
    "bukti_setor_kas" TEXT,
    "kronologi_singkat" TEXT,
    "barang_bukti" TEXT,
    "catatan" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PenegakanPerada_kode_regulasi_fkey" FOREIGN KEY ("kode_regulasi") REFERENCES "PerdaPerbup" ("kode_regulasi") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PenegakanPerada" ("bukti_setor_kas", "catatan", "createdAt", "denda_dijatuhkan", "id", "id_tiket", "jenis_tindakan", "kode_regulasi", "lokasi_kejadian", "lokasi_sidang", "nama_pelanggar", "no_kejadian", "pasal_dilanggar", "status_sidang", "tanggal_sidang", "tanggal_tindakan") SELECT "bukti_setor_kas", "catatan", "createdAt", "denda_dijatuhkan", "id", "id_tiket", "jenis_tindakan", "kode_regulasi", "lokasi_kejadian", "lokasi_sidang", "nama_pelanggar", "no_kejadian", "pasal_dilanggar", "status_sidang", "tanggal_sidang", "tanggal_tindakan" FROM "PenegakanPerada";
DROP TABLE "PenegakanPerada";
ALTER TABLE "new_PenegakanPerada" RENAME TO "PenegakanPerada";
CREATE UNIQUE INDEX "PenegakanPerada_no_kejadian_key" ON "PenegakanPerada"("no_kejadian");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
