/*
  Warnings:

  - You are about to drop the column `catatan` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_gangguan` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_orang` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - You are about to drop the column `lokasi` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - You are about to drop the column `petugas_lapangan` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_penertiban` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - You are about to drop the column `tindakan_diambil` on the `PenertibanTrantibum` table. All the data in the column will be lost.
  - Added the required column `alamat_asal` to the `PenertibanTrantibum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenis_kelamin` to the `PenertibanTrantibum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kategori_masalah` to the `PenertibanTrantibum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keterangan_penanganan` to the `PenertibanTrantibum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lokasi_ditemukan` to the `PenertibanTrantibum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_identitas` to the `PenertibanTrantibum` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PenertibanTrantibum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_tiket" TEXT,
    "tanggal_ditemukan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lokasi_ditemukan" TEXT NOT NULL,
    "nama_pelaku" TEXT NOT NULL DEFAULT 'Tanpa Nama',
    "alamat_asal" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "status_identitas" TEXT NOT NULL,
    "no_ktp" TEXT NOT NULL DEFAULT '-',
    "kategori_masalah" TEXT NOT NULL,
    "no_rekam_medis" TEXT NOT NULL DEFAULT 'Nihil',
    "keterangan_penanganan" TEXT NOT NULL
);
INSERT INTO "new_PenertibanTrantibum" ("id") SELECT "id" FROM "PenertibanTrantibum";
DROP TABLE "PenertibanTrantibum";
ALTER TABLE "new_PenertibanTrantibum" RENAME TO "PenertibanTrantibum";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
