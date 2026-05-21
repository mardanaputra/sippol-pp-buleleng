import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil semua data Satlinmas
export async function GET() {
    try {
        const records = await prisma.satlinmas.findMany({
            orderBy: {
                tanggal_pendataan: 'desc',
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error("Error fetching Satlinmas:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data Satlinmas." },
            { status: 500 }
        );
    }
}

// POST: Membuat data Satlinmas baru
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            kecamatan,
            desa,
            anggota_pria,
            anggota_wanita,
            nama_kades,
            nama_kasi,
            kontak_perangkat,
            jumlah_pos_kamling,
            status_pakaian_dinas,
            ket_pakaian_dinas,
            jumlah_senter,
            jumlah_pentungan,
            jumlah_ht,
            anggaran_honor,
            status_sk_satlinmas,
            peraturan_desa,
            status_struktur,
            pelatihan_anggota,
            status_kta,
            petugas_pendata,
        } = body;

        // Validasi input minimal
        if (!kecamatan || !desa || !petugas_pendata) {
            return NextResponse.json(
                { error: "Kecamatan, Desa, dan Petugas Pendata wajib diisi." },
                { status: 400 }
            );
        }

        const newRecord = await prisma.satlinmas.create({
            data: {
                kecamatan,
                desa,
                anggota_pria: parseInt(anggota_pria) || 0,
                anggota_wanita: parseInt(anggota_wanita) || 0,
                nama_kades: nama_kades || "",
                nama_kasi: nama_kasi || "",
                kontak_perangkat: kontak_perangkat || "",
                jumlah_pos_kamling: parseInt(jumlah_pos_kamling) || 0,
                status_pakaian_dinas: status_pakaian_dinas || "Tidak Ada",
                ket_pakaian_dinas: ket_pakaian_dinas || "",
                jumlah_senter: parseInt(jumlah_senter) || 0,
                jumlah_pentungan: parseInt(jumlah_pentungan) || 0,
                jumlah_ht: parseInt(jumlah_ht) || 0,
                anggaran_honor: parseFloat(anggaran_honor) || 0.0,
                status_sk_satlinmas: status_sk_satlinmas || "Tidak Ada",
                peraturan_desa: peraturan_desa || "",
                status_struktur: status_struktur || "Tidak Ada",
                pelatihan_anggota: pelatihan_anggota || "",
                status_kta: status_kta || "Tidak Ada",
                petugas_pendata,
                tanggal_pendataan: new Date(),
            },
        });

        return NextResponse.json(
            { success: true, message: "Data Satlinmas berhasil ditambahkan.", data: newRecord },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating Satlinmas:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menyimpan data Satlinmas." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui data Satlinmas yang sudah ada
export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id,
            kecamatan,
            desa,
            anggota_pria,
            anggota_wanita,
            nama_kades,
            nama_kasi,
            kontak_perangkat,
            jumlah_pos_kamling,
            status_pakaian_dinas,
            ket_pakaian_dinas,
            jumlah_senter,
            jumlah_pentungan,
            jumlah_ht,
            anggaran_honor,
            status_sk_satlinmas,
            peraturan_desa,
            status_struktur,
            pelatihan_anggota,
            status_kta,
            petugas_pendata,
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "ID data wajib disertakan untuk melakukan update." },
                { status: 400 }
            );
        }

        const updatedRecord = await prisma.satlinmas.update({
            where: { id: parseInt(id) },
            data: {
                kecamatan,
                desa,
                anggota_pria: anggota_pria !== undefined ? parseInt(anggota_pria) : undefined,
                anggota_wanita: anggota_wanita !== undefined ? parseInt(anggota_wanita) : undefined,
                nama_kades,
                nama_kasi,
                kontak_perangkat,
                jumlah_pos_kamling: jumlah_pos_kamling !== undefined ? parseInt(jumlah_pos_kamling) : undefined,
                status_pakaian_dinas,
                ket_pakaian_dinas,
                jumlah_senter: jumlah_senter !== undefined ? parseInt(jumlah_senter) : undefined,
                jumlah_pentungan: jumlah_pentungan !== undefined ? parseInt(jumlah_pentungan) : undefined,
                jumlah_ht: jumlah_ht !== undefined ? parseInt(jumlah_ht) : undefined,
                anggaran_honor: anggaran_honor !== undefined ? parseFloat(anggaran_honor) : undefined,
                status_sk_satlinmas,
                peraturan_desa,
                status_struktur,
                pelatihan_anggota,
                status_kta,
                petugas_pendata,
            },
        });

        return NextResponse.json(
            { success: true, message: "Data Satlinmas berhasil diperbarui.", data: updatedRecord }
        );
    } catch (error) {
        console.error("Error updating Satlinmas:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat memperbarui data Satlinmas." },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus data Satlinmas
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

        await prisma.satlinmas.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { success: true, message: "Data Satlinmas berhasil dihapus." }
        );
    } catch (error) {
        console.error("Error deleting Satlinmas:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus data Satlinmas." },
            { status: 500 }
        );
    }
}
