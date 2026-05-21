-- CreateTable
CREATE TABLE "Disposisi" (
    "no_urut" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_tiket" TEXT NOT NULL,
    "nama_admin" TEXT NOT NULL,
    "waktu_verifikasi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bidang_tujuan" TEXT NOT NULL,
    "kedaruratan" TEXT NOT NULL,
    "catatan" TEXT NOT NULL,
    "waktu_dikirim" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Disposisi_id_tiket_fkey" FOREIGN KEY ("id_tiket") REFERENCES "Pengaduan" ("id_tiket") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Disposisi_id_tiket_key" ON "Disposisi"("id_tiket");
