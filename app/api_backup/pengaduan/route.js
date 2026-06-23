import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler GET: Mengambil semua data pengaduan untuk admin dashboard
export async function GET() {
    try {
        const reports = await prisma.pengaduan.findMany({
            include: {
                disposisi: true,
            },
            orderBy: {
                waktu_kirim: 'desc',
            },
        });
        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching reports from database:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data pengaduan dari database." },
            { status: 500 }
        );
    }
}

// Handler POST: Menyimpan data pengaduan baru dari warga
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id_tiket,
            nama_pelapor,
            is_anonim,
            nomor_whatsapp,
            kategori_masalah,
            kronologi,
            latitude,
            longitude,
            foto_bukti,
        } = body;

        // Validasi input wajib
        if (!id_tiket || !nama_pelapor || !nomor_whatsapp || !kategori_masalah || !kronologi || !latitude || !longitude) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Tiket, Nama, WhatsApp, Kategori, Kronologi, Lokasi)." },
                { status: 400 }
            );
        }

        // Simpan ke database menggunakan Prisma
        const newReport = await prisma.pengaduan.create({
            data: {
                id_tiket,
                nama_pelapor,
                is_anonim: Boolean(is_anonim),
                nomor_whatsapp,
                kategori_masalah,
                kronologi,
                latitude: String(latitude),
                longitude: String(longitude),
                foto_bukti: foto_bukti || null,
                status_laporan: "Pending", // Default status
            },
        });

        return NextResponse.json(
            { success: true, message: "Laporan berhasil disimpan.", data: newReport },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving report to database:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server saat menyimpan laporan." },
            { status: 500 }
        );
    }
}

// Handler DELETE: Menghapus laporan dari database (untuk filter spam)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id_tiket = searchParams.get('id_tiket');

        if (!id_tiket) {
            return NextResponse.json(
                { error: "Parameter id_tiket wajib disertakan." },
                { status: 400 }
            );
        }

        await prisma.pengaduan.delete({
            where: { id_tiket },
        });

        return NextResponse.json(
            { success: true, message: `Laporan ${id_tiket} berhasil dihapus.` }
        );
    } catch (error) {
        console.error("Error deleting report:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus laporan." },
            { status: 500 }
        );
    }
}
