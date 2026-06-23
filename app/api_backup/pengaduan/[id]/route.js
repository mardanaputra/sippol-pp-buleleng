import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
    try {
        const { id } = await params; // id represents the id_tiket
        if (!id) {
            return NextResponse.json(
                { error: "ID Tiket tidak valid." },
                { status: 400 }
            );
        }

        const report = await prisma.pengaduan.findUnique({
            where: {
                id_tiket: id
            },
            include: {
                disposisi: true
            }
        });

        if (!report) {
            return NextResponse.json(
                { error: "Tiket pengaduan tidak ditemukan." },
                { status: 404 }
            );
        }

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error retrieving complaint status:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data status pengaduan." },
            { status: 500 }
        );
    }
}
