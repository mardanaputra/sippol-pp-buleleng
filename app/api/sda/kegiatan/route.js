import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua log kegiatan SDA
export async function GET() {
    try {
        const records = await prisma.sdaKegiatan.findMany({
            orderBy: {
                tanggal_pelaksanaan: 'desc',
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error("Error fetching SDA Kegiatan:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data kegiatan SDA." },
            { status: 500 }
        );
    }
}

// POST: Membuat log kegiatan SDA baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            tanggal_pelaksanaan,
            nama_agenda,
            lokasi_sasaran,
            jenis_kegiatan,
            jumlah_peserta,
            narasumber,
            ringkasan_materi,
            dokumen_spt,
            foto_dokumentasi,
        } = body;

        // Validasi input wajib
        if (!tanggal_pelaksanaan || !nama_agenda || !lokasi_sasaran || !jenis_kegiatan || !ringkasan_materi) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Tanggal Pelaksanaan, Nama Agenda, Lokasi Sasaran, Jenis Kegiatan, Ringkasan Materi)." },
                { status: 400 }
            );
        }

        const dateObj = new Date(tanggal_pelaksanaan);
        const currentYear = dateObj.getFullYear();
        const prefix = `LAK-SDA-${currentYear}-`;

        // Ambil nomor urut terbaru untuk LAK-SDA tahun ini
        const latestRecord = await prisma.sdaKegiatan.findFirst({
            where: {
                no_laporan: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                no_laporan: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestRecord) {
            const parts = latestRecord.no_laporan.split('-');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const no_laporan = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        const newRecord = await prisma.sdaKegiatan.create({
            data: {
                no_laporan,
                tanggal_pelaksanaan: dateObj,
                nama_agenda,
                lokasi_sasaran,
                jenis_kegiatan,
                jumlah_peserta: parseInt(jumlah_peserta) || 0,
                narasumber: narasumber || null,
                ringkasan_materi,
                dokumen_spt: dokumen_spt || null,
                foto_dokumentasi: foto_dokumentasi || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Data kegiatan SDA berhasil ditambahkan.", data: newRecord },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating SDA Kegiatan:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan log kegiatan SDA." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui log kegiatan SDA
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            tanggal_pelaksanaan,
            nama_agenda,
            lokasi_sasaran,
            jenis_kegiatan,
            jumlah_peserta,
            narasumber,
            ringkasan_materi,
            dokumen_spt,
            foto_dokumentasi,
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "ID data wajib disertakan untuk melakukan update." },
                { status: 400 }
            );
        }

        const updatedRecord = await prisma.sdaKegiatan.update({
            where: { id: parseInt(id) },
            data: {
                tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : undefined,
                nama_agenda,
                lokasi_sasaran,
                jenis_kegiatan,
                jumlah_peserta: jumlah_peserta !== undefined ? parseInt(jumlah_peserta) : undefined,
                narasumber: narasumber !== undefined ? narasumber : null,
                ringkasan_materi,
                dokumen_spt: dokumen_spt !== undefined ? dokumen_spt : null,
                foto_dokumentasi: foto_dokumentasi !== undefined ? foto_dokumentasi : null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Data kegiatan SDA berhasil diperbarui.", data: updatedRecord }
        );
    } catch (error) {
        console.error("Error updating SDA Kegiatan:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui data kegiatan SDA." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus log kegiatan SDA
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

        await prisma.sdaKegiatan.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Data kegiatan SDA berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting SDA Kegiatan:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus data kegiatan SDA." },
            { status: 500 }
        );
    }
}
