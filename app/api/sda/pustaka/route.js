import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua data Pustaka SDA
export async function GET() {
    try {
        const records = await prisma.sdaPustaka.findMany({
            orderBy: {
                waktu_upload: 'desc',
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error("Error fetching SDA Pustaka:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data Pustaka Hukum SDA." },
            { status: 500 }
        );
    }
}

// POST: Membuat data Pustaka SDA baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            judul_dokumen,
            jenis_aturan,
            nomor_tahun_aturan,
            instansi_penerbit,
            status_dokumen,
            ringkasan_aturan,
            tags,
            berkas_pdf,
            pengunggah,
        } = body;

        // Validasi input wajib
        if (!judul_dokumen || !jenis_aturan || !nomor_tahun_aturan || !instansi_penerbit || !status_dokumen || !ringkasan_aturan || !berkas_pdf) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Judul Dokumen, Jenis Aturan, Nomor/Tahun Aturan, Instansi Penerbit, Status Dokumen, Ringkasan, Berkas PDF)." },
                { status: 400 }
            );
        }

        const currentYear = new Date().getFullYear();
        const prefix = `PSTK-SDA-${currentYear}-`;

        // Ambil nomor urut terbaru untuk PSTK-SDA tahun ini
        const latestRecord = await prisma.sdaPustaka.findFirst({
            where: {
                no_arsip: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                no_arsip: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestRecord) {
            const parts = latestRecord.no_arsip.split('-');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const no_arsip = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        const newRecord = await prisma.sdaPustaka.create({
            data: {
                no_arsip,
                judul_dokumen,
                jenis_aturan,
                nomor_tahun_aturan,
                instansi_penerbit,
                status_dokumen,
                ringkasan_aturan,
                tags: tags || null,
                berkas_pdf,
                pengunggah: pengunggah || "Staf Bidang SDA",
            },
        });

        return NextResponse.json(
            { success: true, message: "Dokumen pustaka SDA berhasil diarsipkan.", data: newRecord },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating SDA Pustaka:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan dokumen Pustaka SDA." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui data Pustaka SDA
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            judul_dokumen,
            jenis_aturan,
            nomor_tahun_aturan,
            instansi_penerbit,
            status_dokumen,
            ringkasan_aturan,
            tags,
            berkas_pdf,
            pengunggah,
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "ID data wajib disertakan untuk melakukan update." },
                { status: 400 }
            );
        }

        const updatedRecord = await prisma.sdaPustaka.update({
            where: { id: parseInt(id) },
            data: {
                judul_dokumen,
                jenis_aturan,
                nomor_tahun_aturan,
                instansi_penerbit,
                status_dokumen,
                ringkasan_aturan,
                tags: tags !== undefined ? tags : null,
                berkas_pdf: berkas_pdf !== undefined ? berkas_pdf : undefined, // only update if provided
                pengunggah: pengunggah || "Staf Bidang SDA",
            },
        });

        return NextResponse.json(
            { success: true, message: "Dokumen pustaka SDA berhasil diperbarui.", data: updatedRecord }
        );
    } catch (error) {
        console.error("Error updating SDA Pustaka:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui dokumen Pustaka SDA." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data Pustaka SDA
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

        await prisma.sdaPustaka.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Dokumen pustaka SDA berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting SDA Pustaka:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus dokumen Pustaka SDA." },
            { status: 500 }
        );
    }
}
