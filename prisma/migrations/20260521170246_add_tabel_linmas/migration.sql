-- CreateTable
CREATE TABLE "Satlinmas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "anggota_pria" INTEGER NOT NULL,
    "anggota_wanita" INTEGER NOT NULL,
    "nama_kades" TEXT NOT NULL,
    "nama_kasi" TEXT NOT NULL,
    "kontak_perangkat" TEXT NOT NULL,
    "jumlah_pos_kamling" INTEGER NOT NULL,
    "status_pakaian_dinas" TEXT NOT NULL,
    "ket_pakaian_dinas" TEXT NOT NULL,
    "jumlah_senter" INTEGER NOT NULL,
    "jumlah_pentungan" INTEGER NOT NULL,
    "jumlah_ht" INTEGER NOT NULL,
    "anggaran_honor" REAL NOT NULL,
    "status_sk_satlinmas" TEXT NOT NULL,
    "peraturan_desa" TEXT NOT NULL,
    "status_struktur" TEXT NOT NULL,
    "pelatihan_anggota" TEXT NOT NULL,
    "status_kta" TEXT NOT NULL,
    "petugas_pendata" TEXT NOT NULL,
    "tanggal_pendataan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PenertibanTrantibum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jenis_gangguan" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tanggal_penertiban" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah_orang" INTEGER NOT NULL,
    "tindakan_diambil" TEXT NOT NULL,
    "petugas_lapangan" TEXT NOT NULL,
    "catatan" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "KegiatanLinmas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_tiket" TEXT,
    "nama_kegiatan" TEXT NOT NULL,
    "jenis_kegiatan" TEXT NOT NULL,
    "tanggal_kegiatan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT NOT NULL,
    "petugas" TEXT NOT NULL
);
