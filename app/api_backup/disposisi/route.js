import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler GET: Mengambil detail disposisi berdasarkan id_tiket
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id_tiket = searchParams.get('id_tiket');

        if (!id_tiket) {
            // Jika tidak ada parameter id_tiket, ambil semua data disposisi
            const allDispositions = await prisma.disposisi.findMany({
                orderBy: { waktu_dikirim: 'desc' }
            });
            return NextResponse.json(allDispositions);
        }

        const disposisi = await prisma.disposisi.findUnique({
            where: { id_tiket },
        });

        if (!disposisi) {
            return NextResponse.json(
                { message: "Belum ada disposisi untuk tiket ini." },
                { status: 404 }
            );
        }

        return NextResponse.json(disposisi);
    } catch (error) {
        console.error("Error fetching disposisi:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data disposisi dari database." },
            { status: 500 }
        );
    }
}

// Handler POST: Menyimpan data disposisi baru dan memperbarui status laporan
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id_tiket,
            nama_admin,
            waktu_verifikasi,
            bidang_tujuan,
            kedaruratan,
            catatan,
        } = body;

        // Validasi input
        if (!id_tiket || !nama_admin || !bidang_tujuan || !kedaruratan || !catatan) {
            return NextResponse.json(
                { error: "Semua field isian disposisi wajib diisi (Admin, Bidang, Kedaruratan, Catatan)." },
                { status: 400 }
            );
        }

        // Jalankan transaksi Prisma:
        // 1. Simpan data disposisi baru
        // 2. Perbarui status laporan di model Pengaduan menjadi "Disposisi" dan pasang bidang_disposisi
        const result = await prisma.$transaction(async (tx) => {
            const newDisposisi = await tx.disposisi.create({
                data: {
                    id_tiket,
                    nama_admin,
                    waktu_verifikasi: waktu_verifikasi ? new Date(waktu_verifikasi) : new Date(),
                    bidang_tujuan,
                    kedaruratan,
                    catatan,
                    waktu_dikirim: new Date(),
                },
            });

            const updatedReport = await tx.pengaduan.update({
                where: { id_tiket },
                data: {
                    status_laporan: "Disposisi",
                    bidang_disposisi: bidang_tujuan,
                },
            });

            return { newDisposisi, updatedReport };
        });

        return NextResponse.json(
            { 
                success: true, 
                message: "Disposisi laporan berhasil dikirim dan dicatat.", 
                data: result.newDisposisi 
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving disposisi:", error);
        // Tangani duplikasi (jika tiket sudah didisposisi)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Laporan dengan tiket ini sudah pernah didisposisikan sebelumnya." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memproses disposisi." },
            { status: 500 }
        );
    }
}
