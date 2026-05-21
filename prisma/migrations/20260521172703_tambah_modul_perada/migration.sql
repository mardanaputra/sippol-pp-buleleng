-- CreateTable
CREATE TABLE "PerdaPerbup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kode_regulasi" TEXT NOT NULL,
    "jenis_peraturan" TEXT NOT NULL,
    "nomor_peraturan" TEXT NOT NULL,
    "tahun_peraturan" INTEGER NOT NULL,
    "judul_tentang" TEXT NOT NULL,
    "berkas_pdf" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KatalogPelanggaran" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kode_regulasi" TEXT NOT NULL,
    "pasal" TEXT NOT NULL,
    "jenis_pelanggaran" TEXT NOT NULL,
    "denda_maksimal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KatalogPelanggaran_kode_regulasi_fkey" FOREIGN KEY ("kode_regulasi") REFERENCES "PerdaPerbup" ("kode_regulasi") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PenegakanPerada" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no_kejadian" TEXT NOT NULL,
    "id_tiket" TEXT,
    "tanggal_tindakan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_pelanggar" TEXT NOT NULL,
    "lokasi_kejadian" TEXT NOT NULL,
    "kode_regulasi" TEXT NOT NULL,
    "pasal_dilanggar" TEXT NOT NULL,
    "jenis_tindakan" TEXT NOT NULL,
    "status_sidang" TEXT NOT NULL,
    "tanggal_sidang" DATETIME,
    "lokasi_sidang" TEXT,
    "denda_dijatuhkan" REAL,
    "bukti_setor_kas" TEXT,
    "catatan" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PenegakanPerada_kode_regulasi_fkey" FOREIGN KEY ("kode_regulasi") REFERENCES "PerdaPerbup" ("kode_regulasi") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PerdaPerbup_kode_regulasi_key" ON "PerdaPerbup"("kode_regulasi");

-- CreateIndex
CREATE UNIQUE INDEX "PenegakanPerada_no_kejadian_key" ON "PenegakanPerada"("no_kejadian");
