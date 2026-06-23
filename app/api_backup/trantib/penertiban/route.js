import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil log penertiban K3, atau aduan warga yang didelegasikan ke Trantib
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // "delegated" atau "all"

        if (type === 'delegated') {
            // Ambil aduan warga yang didelegasikan ke Bidang Trantib
            const delegatedReports = await prisma.pengaduan.findMany({
                where: {
                    status_laporan: "Disposisi",
                    bidang_disposisi: {
                        in: ["Bidang Trantib", "Bidang Trantibum"]
                    }
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

        // Ambil semua log penertiban K3 terurut tanggal_kejadian terbaru
        const logPenertiban = await prisma.penertibanK3.findMany({
            include: {
                patroli: true,
            },
            orderBy: {
                tanggal_kejadian: 'desc',
            },
        });
        return NextResponse.json(logPenertiban);
    } catch (error) {
        console.error("Error fetching K3 enforcement logs:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data penertiban K3." },
            { status: 500 }
        );
    }
}

// POST: Membuat log penertiban K3 baru dengan transaksi atomik untuk penyelesaian aduan
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id_tiket,
            no_spt,
            tanggal_kejadian,
            lokasi,
            latitude,
            longitude,
            jenis_pelanggaran,
            nama_pelanggar,
            tindakan_diambil,
            jumlah_pelanggar,
            keterangan,
            foto_bukti,
            selesaikan_aduan, // boolean: jika true, ubah status pengaduan menjadi "Selesai"
        } = body;

        // Validasi field wajib
        if (!lokasi || !jenis_pelanggaran || !nama_pelanggar || !tindakan_diambil || !keterangan) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Lokasi, Jenis Pelanggaran, Nama Pelanggar, Tindakan Diambil, Keterangan)." },
                { status: 400 }
            );
        }

        const dateObj = tanggal_kejadian ? new Date(tanggal_kejadian) : new Date();
        const currentYear = dateObj.getFullYear();
        const prefix = `FORM-TEGURAN/TRANTIB/${currentYear}/`;

        // Ambil nomor urut terbaru untuk FORM-TEGURAN tahun ini secara atomic/urutan di DB
        const latestFormulir = await prisma.penertibanK3.findFirst({
            where: {
                no_formulir: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                no_formulir: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestFormulir) {
            const parts = latestFormulir.no_formulir.split('/');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const no_formulir = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        // Jalankan secara transaksi atomik
        const result = await prisma.$transaction(async (tx) => {
            const newEnforcement = await tx.penertibanK3.create({
                data: {
                    no_formulir,
                    id_tiket: id_tiket || null,
                    no_spt: no_spt || null,
                    tanggal_kejadian: dateObj,
                    lokasi,
                    latitude: latitude || null,
                    longitude: longitude || null,
                    jenis_pelanggaran,
                    nama_pelanggar,
                    tindakan_diambil,
                    jumlah_pelanggar: parseInt(jumlah_pelanggar) || 1,
                    keterangan,
                    foto_bukti: foto_bukti || null,
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

            return newEnforcement;
        });

        return NextResponse.json(
            { success: true, message: "Log penertiban K3 berhasil disimpan.", data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating K3 enforcement log:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan log penertiban K3." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui log penertiban K3
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            id_tiket,
            no_spt,
            tanggal_kejadian,
            lokasi,
            latitude,
            longitude,
            jenis_pelanggaran,
            nama_pelanggar,
            tindakan_diambil,
            jumlah_pelanggar,
            keterangan,
            foto_bukti,
        } = body;

        if (!id || !lokasi || !jenis_pelanggaran || !nama_pelanggar || !tindakan_diambil || !keterangan) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong." },
                { status: 400 }
            );
        }

        const updatedEnforcement = await prisma.penertibanK3.update({
            where: { id: parseInt(id) },
            data: {
                id_tiket: id_tiket || null,
                no_spt: no_spt || null,
                tanggal_kejadian: tanggal_kejadian ? new Date(tanggal_kejadian) : undefined,
                lokasi,
                latitude: latitude || null,
                longitude: longitude || null,
                jenis_pelanggaran,
                nama_pelanggar,
                tindakan_diambil,
                jumlah_pelanggar: parseInt(jumlah_pelanggar) || 1,
                keterangan,
                foto_bukti: foto_bukti || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Log penertiban K3 berhasil diperbarui.", data: updatedEnforcement }
        );
    } catch (error) {
        console.error("Error updating K3 enforcement log:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui log penertiban K3." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus log penertiban K3 berdasarkan ID
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

        await prisma.penertibanK3.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Log penertiban K3 berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting K3 enforcement log:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus log penertiban K3." },
            { status: 500 }
        );
    }
}
