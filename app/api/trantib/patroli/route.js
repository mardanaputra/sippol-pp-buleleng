import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil daftar seluruh jadwal regu patroli terurut dari yang terbaru
export async function GET(req) {
    try {
        const patrols = await prisma.reguPatroli.findMany({
            orderBy: {
                tanggal_penugasan: 'desc',
            },
        });
        return NextResponse.json(patrols);
    } catch (error) {
        console.error("Error fetching patrol schedules:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data regu patroli." },
            { status: 500 }
        );
    }
}

// POST: Menyimpan regu patroli baru dengan nomor SPT otomatis
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            tanggal_penugasan,
            shift_kerja,
            komandan_regu,
            anggota_regu, // string atau array
            wilayah_patroli, // string atau array
            kendaraan_dinas,
            surat_tugas,
        } = body;

        // Validasi field wajib
        if (!shift_kerja || !komandan_regu || !anggota_regu || !wilayah_patroli || !kendaraan_dinas) {
            return NextResponse.json(
                { error: "Field wajib tidak boleh kosong (Shift Kerja, Komandan Regu, Anggota Regu, Wilayah/Rute Patroli, Kendaraan Dinas)." },
                { status: 400 }
            );
        }

        // Proses array ke comma-separated string jika berupa array
        const anggotaStr = Array.isArray(anggota_regu) ? anggota_regu.join(', ') : anggota_regu;
        const wilayahStr = Array.isArray(wilayah_patroli) ? wilayah_patroli.join(', ') : wilayah_patroli;

        // Tentukan tanggal penugasan
        const dateObj = tanggal_penugasan ? new Date(tanggal_penugasan) : new Date();
        const currentYear = dateObj.getFullYear();
        const prefix = `SPT/TRANTIB/${currentYear}/`;

        // Ambil nomor urut terbaru untuk tahun ini secara atomic/urutan di DB
        const latestPatroli = await prisma.reguPatroli.findFirst({
            where: {
                no_spt: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                no_spt: 'desc',
            },
        });

        let nextNumber = 1;
        if (latestPatroli) {
            const parts = latestPatroli.no_spt.split('/');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }
        const no_spt = `${prefix}${String(nextNumber).padStart(3, '0')}`;

        const newPatrol = await prisma.reguPatroli.create({
            data: {
                no_spt,
                tanggal_penugasan: dateObj,
                shift_kerja,
                komandan_regu,
                anggota_regu: anggotaStr,
                wilayah_patroli: wilayahStr,
                kendaraan_dinas,
                surat_tugas: surat_tugas || null,
            },
        });

        return NextResponse.json(
            { success: true, message: "Regu patroli berhasil di-plotting.", data: newPatrol },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating patrol schedule:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan regu patroli." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui detail regu patroli yang ada
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            tanggal_penugasan,
            shift_kerja,
            komandan_regu,
            anggota_regu,
            wilayah_patroli,
            kendaraan_dinas,
            surat_tugas,
        } = body;

        if (!id || !shift_kerja || !komandan_regu || !anggota_regu || !wilayah_patroli || !kendaraan_dinas) {
            return NextResponse.json(
                { error: "ID dan field wajib lainnya tidak boleh kosong." },
                { status: 400 }
            );
        }

        const anggotaStr = Array.isArray(anggota_regu) ? anggota_regu.join(', ') : anggota_regu;
        const wilayahStr = Array.isArray(wilayah_patroli) ? wilayah_patroli.join(', ') : wilayah_patroli;

        const updatedPatrol = await prisma.reguPatroli.update({
            where: { id: parseInt(id) },
            data: {
                tanggal_penugasan: tanggal_penugasan ? new Date(tanggal_penugasan) : undefined,
                shift_kerja,
                komandan_regu,
                anggota_regu: anggotaStr,
                wilayah_patroli: wilayahStr,
                kendaraan_dinas,
                surat_tugas: surat_tugas !== undefined ? surat_tugas : undefined,
            },
        });

        return NextResponse.json(
            { success: true, message: "Regu patroli berhasil diperbarui.", data: updatedPatrol }
        );
    } catch (error) {
        console.error("Error updating patrol schedule:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui regu patroli." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus regu patroli berdasarkan ID
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

        await prisma.reguPatroli.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Regu patroli berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting patrol schedule:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus regu patroli." },
            { status: 500 }
        );
    }
}
