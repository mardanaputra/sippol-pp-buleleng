import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#561C24] mt-12 relative z-10 text-white shadow-inner border-t border-[#3d1015]">
      
      {/* Molded Orange Accent Line at Top */}
      <div className="w-full h-1.5 bg-[#C7B7A3] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          
          {/* Column 1: SATPOL PP BRANDING */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              {/* White Circular Logo Badge */}
              <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-[#561C24] border border-slate-100/50">
                <Shield className="w-8 h-8 fill-[#561C24]/10" />
              </div>
              <div>
                <h4 className="font-black text-base md:text-lg tracking-wider text-white leading-none">
                  SATPOL PP
                </h4>
                <p className="text-[10px] text-[#E8D8C4]/80 font-bold uppercase tracking-widest mt-1.5">
                  KABUPATEN BULELENG
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-200/90 font-medium leading-relaxed max-w-sm mt-3">
              Pusat layanan informasi dan pengaduan masyarakat terpadu untuk mewujudkan ketertiban umum dan ketenteraman masyarakat di wilayah Buleleng.
            </p>
          </div>

          {/* Column 2: MENU LAYANAN */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-white mb-5 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-[2px] after:bg-[#C7B7A3] after:rounded-full">
              MENU LAYANAN
            </h5>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/pengaduan" 
                  className="inline-flex items-center gap-2 text-xs text-slate-350 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3]" />
                  Form Pengaduan Publik
                </Link>
              </li>
              <li>
                <Link 
                  href="/status" 
                  className="inline-flex items-center gap-2 text-xs text-slate-355 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3]" />
                  Lacak Status Tiket
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/perada" 
                  className="inline-flex items-center gap-2 text-xs text-slate-355 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3]" />
                  Regulasi Perda & Perbup
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: KONTAK KAMI */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-white mb-5 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-[2px] after:bg-[#C7B7A3] after:rounded-full">
              KONTAK KAMI
            </h5>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="p-2 bg-slate-800/40 rounded-xl text-slate-200 border border-white/10 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-slate-200 font-bold leading-relaxed">
                  Jalan Pahlawan No. 1, Singaraja<br />
                  Kabupaten Buleleng, Bali
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-slate-800/40 rounded-xl text-slate-200 border border-white/10">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-slate-200 font-bold">
                  (0362) 21146
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-slate-800/40 rounded-xl text-slate-200 border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <a 
                  href="mailto:satpolpp@bulelengkab.go.id" 
                  className="text-xs text-slate-200 hover:text-white font-bold transition-all cursor-pointer"
                >
                  satpolpp@bulelengkab.go.id
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator / Divider Line (Flat Elegant Border) */}
        <div className="w-full h-[1px] bg-slate-800 my-8" />

        {/* Bottom copyright section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-medium text-center sm:text-left leading-normal">
            &copy; {new Date().getFullYear()} Pemerintah Kabupaten Buleleng - Satuan Polisi Pamong Praja. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-slate-355 hover:text-white font-bold transition-colors cursor-pointer">
              Kebijakan Privasi
            </span>
            <span className="text-[10px] text-slate-355 hover:text-white font-bold transition-colors cursor-pointer">
              Syarat Ketentuan
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
}
