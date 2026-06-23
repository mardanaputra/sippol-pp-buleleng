import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil log penegakan Perda & Sidang, atau aduan warga yang didelegasikan ke Perada
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // "delegated" atau "all"

        if (type === 'delegated') {
            // Ambil aduan warga yang didelegasikan ke Bidang Perada
            const delegatedReports = await prisma.pengaduan.findMany({
                where: {
                    status_laporan: "Disposisi",
                    bidang_disposisi: "Bidang Perada",
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

        // Ambil semua log penegakan Perada terurut tanggal_tindakan terbaru
        const logPenegakan = await prisma.penegakanPerada.findMany({
            orderBy: {
                tanggal_tindakan: 'desc',
            },
        });
        return NextResponse.json(logPenegakan);
    } catch (error) {
        console.error("Error fetching Perada enforcement logs:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data penegakan Perda & Sidang." },
            { status: 500 }
        );
    }
}

// POST: Membuat log penegakan Perda baru dengan auto-numbering & transaksi atomik
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id_tiket,
            tanggal_tindakan,
            nama_pelanggar,
            nik_pelanggar,
            alamat_pelanggar,
            lokasi_kejadian,
            kode_regulasi,
            pasal_dilanggar,
            jenis_tindakan,
            status_sidang,
            tanggal_sidang,
            lokasi_sidang,
            denda_dijatuhkan,
            no_bukti_setor,
            scan_dokumen,
            kronologi_singkat,
            barang_bukti,
            catatan,
            selesaikan_aduan, // boolean: jika true, ubah status pengaduan menjadi "Selesai"
        } = body;

        // Validasi
        if (!nama_pelanggar || !lokasi_kejadian || !kode_regulasi || !pasal_dilanggar || !jenis_tindakan || !status_sidang || !catatan) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Nama Pelanggar, Lokasi Kejadian, Regulasi, Pasal, Jenis Tindakan, Status Sidang, Catatan)." },
                { status: 400 }
            );
        }

        const dateObj = tanggal_tindakan ? new Date(tanggal_tindakan) : new Date();
        const currentYear = dateObj.getFullYear();
        const prefix = `BAP/PERADA/${currentYear}/`;

        // Ambil nomor urut terbaru untuk kejadian Perada tahun ini
        const latestKejadian = await prisma.penegakanPerada.findFirst({
            where: {
                no_kejadian: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                no_kejadian: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestKejadian) {
            const parts = latestKejadian.no_kejadian.split('/');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const no_kejadian = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        // Jalankan secara transaksi atomik
        const result = await prisma.$transaction(async (tx) => {
            const newEnforcement = await tx.penegakanPerada.create({
                data: {
                    no_kejadian,
                    id_tiket: id_tiket || null,
                    tanggal_tindakan: dateObj,
                    nama_pelanggar,
                    nik_pelanggar: nik_pelanggar || null,
                    alamat_pelanggar: alamat_pelanggar || null,
                    lokasi_kejadian,
                    kode_regulasi,
                    pasal_dilanggar,
                    jenis_tindakan,
                    status_sidang: status_sidang || "Penyelidikan / Pemanggilan",
                    tanggal_sidang: tanggal_sidang ? new Date(tanggal_sidang) : null,
                    lokasi_sidang: lokasi_sidang || null,
                    denda_dijatuhkan: denda_dijatuhkan !== undefined ? parseFloat(denda_dijatuhkan) : null,
                    no_bukti_setor: no_bukti_setor || null,
                    scan_dokumen: scan_dokumen || null,
                    kronologi_singkat: kronologi_singkat || null,
                    barang_bukti: barang_bukti || null,
                    catatan,
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
            { success: true, message: "Log penegakan Perda & Sidang berhasil disimpan.", data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating Perada enforcement log:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan log penegakan Perda." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui log penegakan Perda
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            id_tiket,
            tanggal_tindakan,
            nama_pelanggar,
            nik_pelanggar,
            alamat_pelanggar,
            lokasi_kejadian,
            kode_regulasi,
            pasal_dilanggar,
            jenis_tindakan,
            status_sidang,
            tanggal_sidang,
            lokasi_sidang,
            denda_dijatuhkan,
            no_bukti_setor,
            scan_dokumen,
            kronologi_singkat,
            barang_bukti,
            catatan,
        } = body;

        if (!id || !nama_pelanggar || !lokasi_kejadian || !kode_regulasi || !pasal_dilanggar || !jenis_tindakan || !status_sidang || !catatan) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong." },
                { status: 400 }
            );
        }

        const updatedEnforcement = await prisma.penegakanPerada.update({
            where: { id: parseInt(id) },
            data: {
                id_tiket: id_tiket || null,
                tanggal_tindakan: tanggal_tindakan ? new Date(tanggal_tindakan) : undefined,
                nama_pelanggar,
                nik_pelanggar: nik_pelanggar || null,
                alamat_pelanggar: alamat_pelanggar || null,
                lokasi_kejadian,
                kode_regulasi,
                pasal_dilanggar,
                jenis_tindakan,
                status_sidang,
                tanggal_sidang: tanggal_sidang ? new Date(tanggal_sidang) : null,
                lokasi_sidang: lokasi_sidang || null,
                denda_dijatuhkan: denda_dijatuhkan !== undefined ? parseFloat(denda_dijatuhkan) : null,
                no_bukti_setor: no_bukti_setor || null,
                scan_dokumen: scan_dokumen || null,
                kronologi_singkat: kronologi_singkat || null,
                barang_bukti: barang_bukti || null,
                catatan,
            },
        });

        return NextResponse.json(
            { success: true, message: "Log penegakan Perda & Sidang berhasil diperbarui.", data: updatedEnforcement }
        );
    } catch (error) {
        console.error("Error updating Perada enforcement log:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui log penegakan Perda." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus log penegakan Perda
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

        await prisma.penegakanPerada.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Log penegakan Perda & Sidang berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting Perada enforcement log:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus log penegakan Perda." },
            { status: 500 }
        );
    }
}
