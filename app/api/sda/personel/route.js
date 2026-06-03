import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua data Personel SDA
export async function GET() {
    try {
        const records = await prisma.sdaPersonel.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error("Error fetching SDA Personel:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data Personel SDA." },
            { status: 500 }
        );
    }
}

// POST: Membuat data Personel SDA baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            nip_kontrak,
            nama_lengkap,
            status_kepegawaian,
            pangkat_golongan,
            jabatan,
            penempatan_bidang,
            rekam_pelatihan,
            nomor_sertifikat,
            status_keaktifan,
        } = body;

        // Validasi input minimal
        if (!nip_kontrak || !nama_lengkap || !status_kepegawaian || !jabatan || !penempatan_bidang || !status_keaktifan) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (NIP/Kontrak, Nama Lengkap, Status Kepegawaian, Jabatan, Penempatan Bidang, Status Keaktifan)." },
                { status: 400 }
            );
        }

        const currentYear = new Date().getFullYear();
        const prefix = `SDA-PERS-${currentYear}-`;

        // Ambil nomor urut terbaru untuk ID Personel tahun ini
        const latestRecord = await prisma.sdaPersonel.findFirst({
            where: {
                id_personel: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                id_personel: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestRecord) {
            const parts = latestRecord.id_personel.split('-');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const id_personel = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        const newRecord = await prisma.sdaPersonel.create({
            data: {
                id_personel,
                nip_kontrak,
                nama_lengkap,
                status_kepegawaian,
                pangkat_golongan: status_kepegawaian === 'Kontrak (Non-ASN)' ? 'Non-ASN' : (pangkat_golongan || 'Non-ASN'),
                jabatan,
                penempatan_bidang,
                rekam_pelatihan: Array.isArray(rekam_pelatihan) ? rekam_pelatihan.join(', ') : (rekam_pelatihan || ""),
                nomor_sertifikat: nomor_sertifikat || null,
                status_keaktifan,
            },
        });

        return NextResponse.json(
            { success: true, message: "Data Personel SDA berhasil ditambahkan.", data: newRecord },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating SDA Personel:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan data Personel SDA." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui data Personel SDA
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            nip_kontrak,
            nama_lengkap,
            status_kepegawaian,
            pangkat_golongan,
            jabatan,
            penempatan_bidang,
            rekam_pelatihan,
            nomor_sertifikat,
            status_keaktifan,
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "ID data wajib disertakan untuk melakukan update." },
                { status: 400 }
            );
        }

        const updatedRecord = await prisma.sdaPersonel.update({
            where: { id: parseInt(id) },
            data: {
                nip_kontrak,
                nama_lengkap,
                status_kepegawaian,
                pangkat_golongan: status_kepegawaian === 'Kontrak (Non-ASN)' ? 'Non-ASN' : pangkat_golongan,
                jabatan,
                penempatan_bidang,
                rekam_pelatihan: Array.isArray(rekam_pelatihan) ? rekam_pelatihan.join(', ') : rekam_pelatihan,
                nomor_sertifikat: nomor_sertifikat !== undefined ? nomor_sertifikat : null,
                status_keaktifan,
            },
        });

        return NextResponse.json(
            { success: true, message: "Data Personel SDA berhasil diperbarui.", data: updatedRecord }
        );
    } catch (error) {
        console.error("Error updating SDA Personel:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui data Personel SDA." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data Personel SDA
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

        await prisma.sdaPersonel.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Data Personel SDA berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting SDA Personel:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus data Personel SDA." },
            { status: 500 }
        );
    }
}
