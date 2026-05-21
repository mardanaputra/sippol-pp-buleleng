-- CreateTable
CREATE TABLE "Pengaduan" (
    "id_tiket" TEXT NOT NULL PRIMARY KEY,
    "nama_pelapor" TEXT NOT NULL,
    "is_anonim" BOOLEAN NOT NULL DEFAULT false,
    "nomor_whatsapp" TEXT NOT NULL,
    "kategori_masalah" TEXT NOT NULL,
    "kronologi" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "foto_bukti" TEXT,
    "status_laporan" TEXT NOT NULL DEFAULT 'Pending',
    "bidang_disposisi" TEXT,
    "waktu_kirim" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
