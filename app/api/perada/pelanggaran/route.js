import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil seluruh Katalog Pelanggaran
export async function GET(req) {
    try {
        const pelanggaran = await prisma.katalogPelanggaran.findMany({
            include: {
                regulasi: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(pelanggaran);
    } catch (error) {
        console.error("Error fetching katalog pelanggaran:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data Katalog Pelanggaran." },
            { status: 500 }
        );
    }
}

// POST: Menambahkan Katalog Pelanggaran baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            kode_regulasi,
            pasal,
            jenis_pelanggaran,
            sanksi_maksimal,
            denda_maksimal,
        } = body;

        // Validasi
        if (!kode_regulasi || !pasal || !jenis_pelanggaran) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Kode Regulasi, Pasal, Jenis Pelanggaran)." },
                { status: 400 }
            );
        }

        const newPelanggaran = await prisma.katalogPelanggaran.create({
            data: {
                kode_regulasi,
                pasal,
                jenis_pelanggaran,
                sanksi_maksimal: sanksi_maksimal || "Denda",
                denda_maksimal: parseFloat(denda_maksimal) || 0,
            },
        });

        return NextResponse.json(
            { success: true, message: "Katalog pelanggaran berhasil disimpan.", data: newPelanggaran },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating katalog pelanggaran:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan katalog pelanggaran." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui data katalog pelanggaran
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            kode_regulasi,
            pasal,
            jenis_pelanggaran,
            sanksi_maksimal,
            denda_maksimal,
        } = body;

        if (!id || !kode_regulasi || !pasal || !jenis_pelanggaran) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong." },
                { status: 400 }
            );
        }

        const updatedPelanggaran = await prisma.katalogPelanggaran.update({
            where: { id: parseInt(id) },
            data: {
                kode_regulasi,
                pasal,
                jenis_pelanggaran,
                sanksi_maksimal: sanksi_maksimal || "Denda",
                denda_maksimal: parseFloat(denda_maksimal) || 0,
            },
        });

        return NextResponse.json(
            { success: true, message: "Katalog pelanggaran berhasil diperbarui.", data: updatedPelanggaran }
        );
    } catch (error) {
        console.error("Error updating katalog pelanggaran:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui katalog pelanggaran." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data katalog pelanggaran
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

        await prisma.katalogPelanggaran.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Katalog pelanggaran berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting katalog pelanggaran:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus katalog pelanggaran." },
            { status: 500 }
        );
    }
}
