-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KatalogPelanggaran" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kode_regulasi" TEXT NOT NULL,
    "pasal" TEXT NOT NULL,
    "jenis_pelanggaran" TEXT NOT NULL,
    "sanksi_maksimal" TEXT NOT NULL DEFAULT 'Denda',
    "denda_maksimal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KatalogPelanggaran_kode_regulasi_fkey" FOREIGN KEY ("kode_regulasi") REFERENCES "PerdaPerbup" ("kode_regulasi") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_KatalogPelanggaran" ("createdAt", "denda_maksimal", "id", "jenis_pelanggaran", "kode_regulasi", "pasal") SELECT "createdAt", "denda_maksimal", "id", "jenis_pelanggaran", "kode_regulasi", "pasal" FROM "KatalogPelanggaran";
DROP TABLE "KatalogPelanggaran";
ALTER TABLE "new_KatalogPelanggaran" RENAME TO "KatalogPelanggaran";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
