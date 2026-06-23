import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil seluruh master data Perda & Perbup
export async function GET(req) {
    try {
        const regulasi = await prisma.perdaPerbup.findMany({
            include: {
                pelanggaran: true,
                penegakan: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(regulasi);
    } catch (error) {
        console.error("Error fetching regulasi Perda/Perbup:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data Master Perda & Perbup." },
            { status: 500 }
        );
    }
}

// POST: Menambahkan Master Data Perda/Perbup baru dengan Auto-generation Kode Regulasi
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            jenis_peraturan,
            nomor_peraturan,
            tahun_peraturan,
            judul_tentang,
            berkas_pdf,
        } = body;

        // Validasi field wajib
        if (!jenis_peraturan || !nomor_peraturan || !tahun_peraturan || !judul_tentang) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Jenis Peraturan, Nomor, Tahun, Judul)." },
                { status: 400 }
            );
        }

        const year = parseInt(tahun_peraturan) || new Date().getFullYear();
        const isPerda = jenis_peraturan === 'Perda';
        const typeStr = isPerda ? 'PERDA' : 'PERBUP';
        const prefix = `REG-${typeStr}-${year}-`;

        // Ambil data terbaru untuk jenis dan tahun yang sama
        const latestReg = await prisma.perdaPerbup.findFirst({
            where: {
                kode_regulasi: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                kode_regulasi: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestReg) {
            const parts = latestReg.kode_regulasi.split('-');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const kode_regulasi = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        const newRegulasi = await prisma.perdaPerbup.create({
            data: {
                kode_regulasi,
                jenis_peraturan,
                nomor_peraturan: String(nomor_peraturan),
                tahun_peraturan: year,
                judul_tentang,
                berkas_pdf: berkas_pdf || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Master data regulasi berhasil disimpan.", data: newRegulasi },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating regulasi Perda/Perbup:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan master regulasi." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui data regulasi
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            jenis_peraturan,
            nomor_peraturan,
            tahun_peraturan,
            judul_tentang,
            berkas_pdf,
        } = body;

        if (!id || !jenis_peraturan || !nomor_peraturan || !tahun_peraturan || !judul_tentang) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong." },
                { status: 400 }
            );
        }

        const existingReg = await prisma.perdaPerbup.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingReg) {
            return NextResponse.json(
                { error: "Regulasi tidak ditemukan." },
                { status: 404 }
            );
        }

        // Jika jenis atau tahun berubah, update kode_regulasi juga
        let newKodeRegulasi = existingReg.kode_regulasi;
        const year = parseInt(tahun_peraturan) || new Date().getFullYear();
        
        if (existingReg.jenis_peraturan !== jenis_peraturan || existingReg.tahun_peraturan !== year) {
            const isPerda = jenis_peraturan === 'Perda';
            const typeStr = isPerda ? 'PERDA' : 'PERBUP';
            const prefix = `REG-${typeStr}-${year}-`;

            const latestReg = await prisma.perdaPerbup.findFirst({
                where: {
                    kode_regulasi: {
                        startsWith: prefix,
                    },
                },
                orderBy: {
                    kode_regulasi: 'desc',
                },
            });

            let nextNumber = 1;
            if (latestReg) {
                const parts = latestReg.kode_regulasi.split('-');
                const lastNum = parseInt(parts[parts.length - 1], 10);
                if (!isNaN(lastNum)) {
                    nextNumber = lastNum + 1;
                }
            }
            newKodeRegulasi = `${prefix}${String(nextNumber).padStart(3, '0')}`;
        }

        const updatedRegulasi = await prisma.perdaPerbup.update({
            where: { id: parseInt(id) },
            data: {
                kode_regulasi: newKodeRegulasi,
                jenis_peraturan,
                nomor_peraturan: String(nomor_peraturan),
                tahun_peraturan: year,
                judul_tentang,
                berkas_pdf: berkas_pdf || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Regulasi berhasil diperbarui.", data: updatedRegulasi }
        );
    } catch (error) {
        console.error("Error updating regulasi:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui data regulasi." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data regulasi
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

        await prisma.perdaPerbup.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Master data regulasi berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting regulasi:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus data regulasi." },
            { status: 500 }
        );
    }
}
