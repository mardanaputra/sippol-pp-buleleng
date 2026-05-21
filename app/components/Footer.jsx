import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1b3e83] mt-12 relative z-10 text-white shadow-[0_-12px_24px_rgba(27,62,131,0.15)]">
      
      {/* Molded Orange Accent Line at Top */}
      <div className="w-full h-2 bg-[#e28a1c] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          
          {/* Column 1: SATPOL PP BRANDING */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              {/* White Circular Logo Badge (Perfect match with uploaded reference image) */}
              <div className="w-14 h-14 bg-white rounded-full shadow-[4px_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#1b3e83]">
                <Shield className="w-8 h-8 fill-[#1b3e83]/10" />
              </div>
              <div>
                <h4 className="font-black text-base md:text-lg tracking-wider text-white leading-none">
                  SATPOL PP
                </h4>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mt-1.5">
                  KABUPATEN BULELENG
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-100/90 font-medium leading-relaxed max-w-sm mt-3">
              Pusat layanan informasi dan pengaduan masyarakat terpadu untuk mewujudkan ketertiban umum dan ketenteraman masyarakat di wilayah Buleleng.
            </p>
          </div>

          {/* Column 2: MENU LAYANAN */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-white mb-5 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-[2px] after:bg-[#e28a1c] after:rounded-full">
              MENU LAYANAN
            </h5>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/pengaduan" 
                  className="inline-flex items-center gap-2 text-xs text-blue-200 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e28a1c]" />
                  Form Pengaduan Publik
                </Link>
              </li>
              <li>
                <Link 
                  href="/status" 
                  className="inline-flex items-center gap-2 text-xs text-blue-200 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e28a1c]" />
                  Lacak Status Tiket
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/perada" 
                  className="inline-flex items-center gap-2 text-xs text-blue-200 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e28a1c]" />
                  Regulasi Perda & Perbup
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-xs text-blue-300 font-bold opacity-75">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e28a1c] opacity-60" />
                  Berita & Kegiatan Lapangan
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: KONTAK KAMI */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-white mb-5 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-[2px] after:bg-[#e28a1c] after:rounded-full">
              KONTAK KAMI
            </h5>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="p-2 bg-[#2758ba]/30 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)] text-blue-200 border border-white/10 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-blue-100 font-bold leading-relaxed">
                  Jalan Pahlawan No. 1, Singaraja<br />
                  Kabupaten Buleleng, Bali
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-[#2758ba]/30 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)] text-blue-200 border border-white/10">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-blue-100 font-bold">
                  (0362) 21146
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-[#2758ba]/30 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)] text-blue-200 border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <a 
                  href="mailto:satpolpp@bulelengkab.go.id" 
                  className="text-xs text-blue-100 hover:text-white font-bold transition-all cursor-pointer"
                >
                  satpolpp@bulelengkab.go.id
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator / Divider Line (Neumorphic Inset Line on Dark Blue) */}
        <div className="w-full h-[1.5px] bg-[#0f244f]/40 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),_0_1px_0_rgba(255,255,255,0.1)] my-8" />

        {/* Bottom copyright section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-blue-200/80 font-medium text-center sm:text-left leading-normal">
            &copy; {new Date().getFullYear()} Pemerintah Kabupaten Buleleng - Satuan Polisi Pamong Praja. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-blue-200 hover:text-white font-bold transition-colors cursor-pointer">
              Kebijakan Privasi
            </span>
            <span className="text-[10px] text-blue-200 hover:text-white font-bold transition-colors cursor-pointer">
              Syarat Ketentuan
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
}
