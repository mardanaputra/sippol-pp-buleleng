import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua data penertiban Trantibum
export async function GET() {
    try {
        const records = await prisma.penertibanTrantibum.findMany({
            orderBy: {
                tanggal_ditemukan: 'desc',
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error("Error fetching Trantibum reports:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data penertiban Trantibum." },
            { status: 500 }
        );
    }
}

// POST: Membuat data penertiban Trantibum baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id_tiket,
            tanggal_ditemukan,
            lokasi_ditemukan,
            nama_pelaku,
            alamat_asal,
            jenis_kelamin,
            status_identitas,
            no_ktp,
            kategori_masalah, // comma-separated string or array
            no_rekam_medis,
            keterangan_penanganan,
            selesaikan_aduan, // boolean, jika true maka update status aduan warga ke Selesai
        } = body;

        // Validasi field wajib
        if (!lokasi_ditemukan || !nama_pelaku || !jenis_kelamin || !status_identitas || !kategori_masalah) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Lokasi, Nama Pelaku, Jenis Kelamin, Status KTP, Kategori Masalah)." },
                { status: 400 }
            );
        }

        // Jalankan Prisma transaction jika ada penanganan aduan warga
        const result = await prisma.$transaction(async (tx) => {
            const newRecord = await tx.penertibanTrantibum.create({
                data: {
                    id_tiket: id_tiket || null,
                    tanggal_ditemukan: tanggal_ditemukan ? new Date(tanggal_ditemukan) : new Date(),
                    lokasi_ditemukan,
                    nama_pelaku: nama_pelaku || "Tanpa Nama",
                    alamat_asal: alamat_asal || "",
                    jenis_kelamin,
                    status_identitas,
                    no_ktp: status_identitas === 'Tidak Ada' ? '-' : (no_ktp || '-'),
                    kategori_masalah: Array.isArray(kategori_masalah) ? kategori_masalah.join(', ') : kategori_masalah,
                    no_rekam_medis: no_rekam_medis || "Nihil",
                    keterangan_penanganan: keterangan_penanganan || "",
                },
            });

            if (id_tiket && selesaikan_aduan) {
                // Perbarui status laporan di tabel Pengaduan menjadi Selesai
                await tx.pengaduan.update({
                    where: { id_tiket },
                    data: {
                        status_laporan: "Selesai",
                    },
                });
            }

            return newRecord;
        });

        return NextResponse.json(
            { success: true, message: "Data penertiban berhasil disimpan.", data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating Trantibum entry:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan data penertiban." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data penertiban Trantibum
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Parameter id wajib disertakan." },
                { status: 400 }
            );
        }

        await prisma.penertibanTrantibum.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Data penertiban berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting Trantibum entry:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus data penertiban." },
            { status: 500 }
        );
    }
}

// PUT: Mengupdate data penertiban Trantibum
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            id_tiket,
            tanggal_ditemukan,
            lokasi_ditemukan,
            nama_pelaku,
            alamat_asal,
            jenis_kelamin,
            status_identitas,
            no_ktp,
            kategori_masalah,
            no_rekam_medis,
            keterangan_penanganan,
        } = body;

        if (!id || !lokasi_ditemukan || !nama_pelaku || !jenis_kelamin || !status_identitas || !kategori_masalah) {
            return NextResponse.json(
                { error: "Parameter id dan field wajib lainnya tidak boleh kosong (Lokasi, Nama Pelaku, Jenis Kelamin, Status KTP, Kategori Masalah)." },
                { status: 400 }
            );
        }

        const updatedRecord = await prisma.penertibanTrantibum.update({
            where: { id: parseInt(id) },
            data: {
                id_tiket: id_tiket || null,
                tanggal_ditemukan: tanggal_ditemukan ? new Date(tanggal_ditemukan) : new Date(),
                lokasi_ditemukan,
                nama_pelaku: nama_pelaku || "Tanpa Nama",
                alamat_asal: alamat_asal || "",
                jenis_kelamin,
                status_identitas,
                no_ktp: status_identitas === 'Tidak Ada' ? '-' : (no_ktp || '-'),
                kategori_masalah: Array.isArray(kategori_masalah) ? kategori_masalah.join(', ') : kategori_masalah,
                no_rekam_medis: no_rekam_medis || "Nihil",
                keterangan_penanganan: keterangan_penanganan || "",
            },
        });

        return NextResponse.json(
            { success: true, message: "Data penertiban berhasil diperbarui.", data: updatedRecord }
        );
    } catch (error) {
        console.error("Error updating Trantibum entry:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui data penertiban." },
            { status: 500 }
        );
    }
}
