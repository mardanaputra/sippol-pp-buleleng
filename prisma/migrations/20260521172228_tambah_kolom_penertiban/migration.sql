/*
  Warnings:

  - Added the required column `no_formulir` to the `PenertibanK3` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PenertibanK3" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no_formulir" TEXT NOT NULL,
    "id_tiket" TEXT,
    "no_spt" TEXT,
    "tanggal_kejadian" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lokasi" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "jenis_pelanggaran" TEXT NOT NULL,
    "nama_pelanggar" TEXT NOT NULL,
    "tindakan_diambil" TEXT NOT NULL,
    "jumlah_pelanggar" INTEGER NOT NULL DEFAULT 1,
    "keterangan" TEXT NOT NULL,
    "foto_bukti" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PenertibanK3_no_spt_fkey" FOREIGN KEY ("no_spt") REFERENCES "ReguPatroli" ("no_spt") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PenertibanK3" ("createdAt", "foto_bukti", "id", "id_tiket", "jenis_pelanggaran", "keterangan", "latitude", "lokasi", "longitude", "nama_pelanggar", "no_spt", "tanggal_kejadian", "tindakan_diambil") SELECT "createdAt", "foto_bukti", "id", "id_tiket", "jenis_pelanggaran", "keterangan", "latitude", "lokasi", "longitude", "nama_pelanggar", "no_spt", "tanggal_kejadian", "tindakan_diambil" FROM "PenertibanK3";
DROP TABLE "PenertibanK3";
ALTER TABLE "new_PenertibanK3" RENAME TO "PenertibanK3";
CREATE UNIQUE INDEX "PenertibanK3_no_formulir_key" ON "PenertibanK3"("no_formulir");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
