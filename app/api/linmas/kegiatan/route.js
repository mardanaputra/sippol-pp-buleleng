import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua data Kegiatan Linmas, atau mengambil aduan warga yang didisposisikan ke Linmas
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // "delegated" atau "all"

        if (type === 'delegated') {
            // Ambil semua aduan warga yang didelegasikan ke Bidang Linmas
            const delegatedReports = await prisma.pengaduan.findMany({
                where: {
                    status_laporan: "Disposisi",
                    bidang_disposisi: "Bidang Linmas",
                },
                include: {
                    disposisi: true,
                },
                orderBy: {
                    waktu_kirim: 'desc',
                },
            });
            return NextResponse.json(delegatedReports);
        }

        // Default: ambil semua log kegiatan linmas terurut tanggal_kegiatan terbaru
        const activities = await prisma.kegiatanLinmas.findMany({
            orderBy: {
                tanggal_kegiatan: 'desc',
            },
        });
        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching Linmas activities:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data kegiatan Linmas." },
            { status: 500 }
        );
    }
}

// POST: Membuat data Kegiatan Linmas baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id_tiket,
            tanggal_kegiatan,
            kecamatan,
            desa,
            latitude,
            longitude,
            jenis_kegiatan,
            uraian_kegiatan,
            jumlah_personel,
            foto_kegiatan,
            selesaikan_aduan, // boolean: jika true, ubah status pengaduan menjadi "Selesai"
        } = body;

        // Validasi field wajib
        if (!kecamatan || !desa || !jenis_kegiatan || !uraian_kegiatan) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Kecamatan, Desa, Jenis Kegiatan, Uraian Pelaksanaan)." },
                { status: 400 }
            );
        }

        // Gunakan transaksi jika ada penyelesaian aduan warga
        const result = await prisma.$transaction(async (tx) => {
            const newActivity = await tx.kegiatanLinmas.create({
                data: {
                    id_tiket: id_tiket || null,
                    tanggal_kegiatan: tanggal_kegiatan ? new Date(tanggal_kegiatan) : new Date(),
                    kecamatan,
                    desa,
                    latitude: latitude || null,
                    longitude: longitude || null,
                    jenis_kegiatan,
                    uraian_kegiatan,
                    jumlah_personel: parseInt(jumlah_personel) || 1,
                    foto_kegiatan: foto_kegiatan || null,
                },
            });

            if (id_tiket && selesaikan_aduan) {
                // Perbarui status laporan di Pengaduan menjadi "Selesai"
                await tx.pengaduan.update({
                    where: { id_tiket },
                    data: {
                        status_laporan: "Selesai",
                    },
                });
            }

            return newActivity;
        });

        return NextResponse.json(
            { success: true, message: "Kegiatan Linmas berhasil disimpan.", data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating Linmas activity:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan kegiatan." },
            { status: 500 }
        );
    }
}

// PUT: Mengupdate data Kegiatan Linmas
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            id_tiket,
            tanggal_kegiatan,
            kecamatan,
            desa,
            latitude,
            longitude,
            jenis_kegiatan,
            uraian_kegiatan,
            jumlah_personel,
            foto_kegiatan,
        } = body;

        if (!id || !kecamatan || !desa || !jenis_kegiatan || !uraian_kegiatan) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong (Kecamatan, Desa, Jenis Kegiatan, Uraian Pelaksanaan)." },
                { status: 400 }
            );
        }

        const updatedActivity = await prisma.kegiatanLinmas.update({
            where: { id: parseInt(id) },
            data: {
                id_tiket: id_tiket || null,
                tanggal_kegiatan: tanggal_kegiatan ? new Date(tanggal_kegiatan) : new Date(),
                kecamatan,
                desa,
                latitude: latitude || null,
                longitude: longitude || null,
                jenis_kegiatan,
                uraian_kegiatan,
                jumlah_personel: parseInt(jumlah_personel) || 1,
                foto_kegiatan: foto_kegiatan || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Kegiatan Linmas berhasil diperbarui.", data: updatedActivity }
        );
    } catch (error) {
        console.error("Error updating Linmas activity:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui kegiatan." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data Kegiatan Linmas
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

        await prisma.kegiatanLinmas.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Kegiatan Linmas berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting Linmas activity:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus kegiatan." },
            { status: 500 }
        );
    }
}
