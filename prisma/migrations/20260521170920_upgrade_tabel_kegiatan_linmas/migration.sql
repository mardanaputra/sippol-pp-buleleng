/*
  Warnings:

  - You are about to drop the column `keterangan` on the `KegiatanLinmas` table. All the data in the column will be lost.
  - You are about to drop the column `nama_kegiatan` on the `KegiatanLinmas` table. All the data in the column will be lost.
  - You are about to drop the column `petugas` on the `KegiatanLinmas` table. All the data in the column will be lost.
  - Added the required column `desa` to the `KegiatanLinmas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kecamatan` to the `KegiatanLinmas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uraian_kegiatan` to the `KegiatanLinmas` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KegiatanLinmas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_tiket" TEXT,
    "tanggal_kegiatan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "jenis_kegiatan" TEXT NOT NULL,
    "uraian_kegiatan" TEXT NOT NULL,
    "jumlah_personel" INTEGER NOT NULL DEFAULT 1,
    "foto_kegiatan" TEXT
);
INSERT INTO "new_KegiatanLinmas" ("id", "id_tiket", "jenis_kegiatan", "tanggal_kegiatan") SELECT "id", "id_tiket", "jenis_kegiatan", "tanggal_kegiatan" FROM "KegiatanLinmas";
DROP TABLE "KegiatanLinmas";
ALTER TABLE "new_KegiatanLinmas" RENAME TO "KegiatanLinmas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
