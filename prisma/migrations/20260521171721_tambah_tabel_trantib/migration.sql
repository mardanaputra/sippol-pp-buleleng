-- CreateTable
CREATE TABLE "ReguPatroli" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no_spt" TEXT NOT NULL,
    "tanggal_penugasan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shift_kerja" TEXT NOT NULL,
    "komandan_regu" TEXT NOT NULL,
    "anggota_regu" TEXT NOT NULL,
    "wilayah_patroli" TEXT NOT NULL,
    "kendaraan_dinas" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PenertibanK3" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_tiket" TEXT,
    "no_spt" TEXT,
    "tanggal_kejadian" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lokasi" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "jenis_pelanggaran" TEXT NOT NULL,
    "nama_pelanggar" TEXT NOT NULL,
    "tindakan_diambil" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "foto_bukti" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PenertibanK3_no_spt_fkey" FOREIGN KEY ("no_spt") REFERENCES "ReguPatroli" ("no_spt") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReguPatroli_no_spt_key" ON "ReguPatroli"("no_spt");
