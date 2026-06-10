import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua data kegiatan Satpol PP (bisa difilter berdasarkan bidang)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const bidang = searchParams.get('bidang');

        const filter = bidang ? { bidang } : {};

        const list = await prisma.satpolKegiatan.findMany({
            where: filter,
            orderBy: {
                tanggal_kegiatan: 'desc',
            },
        });

        return NextResponse.json(list);
    } catch (error) {
        console.error("Error fetching Satpol kegiatan logs:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data log kegiatan Satpol PP." },
            { status: 500 }
        );
    }
}

// POST: Menambahkan log kegiatan baru dengan auto-generate nomor kegiatan
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            tanggal_kegiatan,
            bidang,
            jenis_kegiatan,
            lokasi,
            jumlah_personel,
            uraian_kegiatan,
            foto_bukti,
        } = body;

        // Validasi field wajib
        if (!tanggal_kegiatan || !bidang || !jenis_kegiatan || !lokasi || !uraian_kegiatan) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Tanggal, Bidang, Jenis Kegiatan, Lokasi, Uraian)." },
                { status: 400 }
            );
        }

        const dateObj = new Date(tanggal_kegiatan);
        const year = dateObj.getFullYear() || new Date().getFullYear();
        const bidangCode = bidang.toUpperCase().replace(/\s+/g, '');
        const prefix = `ACT/${bidangCode}/${year}/`;

        // Ambil data terbaru untuk generate nomor urut
        const latestAct = await prisma.satpolKegiatan.findFirst({
            where: {
                no_kegiatan: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                no_kegiatan: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestAct) {
            const parts = latestAct.no_kegiatan.split('/');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const no_kegiatan = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        const newKegiatan = await prisma.satpolKegiatan.create({
            data: {
                no_kegiatan,
                tanggal_kegiatan: dateObj,
                bidang,
                jenis_kegiatan,
                lokasi,
                jumlah_personel: parseInt(jumlah_personel) || 1,
                uraian_kegiatan,
                foto_bukti: foto_bukti || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Log kegiatan berhasil disimpan.", data: newKegiatan },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating Satpol kegiatan:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan log kegiatan." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui log kegiatan
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            tanggal_kegiatan,
            bidang,
            jenis_kegiatan,
            lokasi,
            jumlah_personel,
            uraian_kegiatan,
            foto_bukti,
        } = body;

        if (!id || !tanggal_kegiatan || !bidang || !jenis_kegiatan || !lokasi || !uraian_kegiatan) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong." },
                { status: 400 }
            );
        }

        const existingAct = await prisma.satpolKegiatan.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingAct) {
            return NextResponse.json(
                { error: "Log kegiatan tidak ditemukan." },
                { status: 404 }
            );
        }

        // Jika bidang atau tahun berubah, regenerasi no_kegiatan
        let newNoKegiatan = existingAct.no_kegiatan;
        const dateObj = new Date(tanggal_kegiatan);
        const year = dateObj.getFullYear() || new Date().getFullYear();
        const existingYear = new Date(existingAct.tanggal_kegiatan).getFullYear();

        if (existingAct.bidang !== bidang || existingYear !== year) {
            const bidangCode = bidang.toUpperCase().replace(/\s+/g, '');
            const prefix = `ACT/${bidangCode}/${year}/`;

            const latestAct = await prisma.satpolKegiatan.findFirst({
                where: {
                    no_kegiatan: {
                        startsWith: prefix,
                    },
                },
                orderBy: {
                    no_kegiatan: 'desc',
                },
            });

            let nextNumber = 1;
            if (latestAct) {
                const parts = latestAct.no_kegiatan.split('/');
                const lastNum = parseInt(parts[parts.length - 1], 10);
                if (!isNaN(lastNum)) {
                    nextNumber = lastNum + 1;
                }
            }
            newNoKegiatan = `${prefix}${String(nextNumber).padStart(3, '0')}`;
        }

        const updatedKegiatan = await prisma.satpolKegiatan.update({
            where: { id: parseInt(id) },
            data: {
                no_kegiatan: newNoKegiatan,
                tanggal_kegiatan: dateObj,
                bidang,
                jenis_kegiatan,
                lokasi,
                jumlah_personel: parseInt(jumlah_personel) || 1,
                uraian_kegiatan,
                foto_bukti: foto_bukti || existingAct.foto_bukti,
            },
        });

        return NextResponse.json(
            { success: true, message: "Log kegiatan berhasil diperbarui.", data: updatedKegiatan }
        );
    } catch (error) {
        console.error("Error updating Satpol kegiatan:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui log kegiatan." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus log kegiatan
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

        await prisma.satpolKegiatan.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Log kegiatan berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting Satpol kegiatan:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus log kegiatan." },
            { status: 500 }
        );
    }
}
