'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ShieldAlert, Menu, X } from 'lucide-react';

export default function Navbar({ activePage = 'home' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Konfigurasi Branding dinamis berdasarkan halaman aktif
  let logoIcon = <Shield className="w-6 h-6 fill-[#0B1E43]/10" />;
  let subtitle = "SATPOL PP KAB. BULELENG";

  if (activePage === 'pengaduan') {
    logoIcon = <ShieldAlert className="w-6 h-6 text-[#0B1E43]" />;
    subtitle = "LAYANAN PENGADUAN WARGA";
  } else if (activePage === 'status') {
    logoIcon = <ShieldAlert className="w-6 h-6 text-[#0B1E43]" />;
    subtitle = "STATUS PENANGANAN LAPORAN";
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md px-6 py-3.5 shadow-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo Branding */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="p-2 bg-slate-100 group-hover:bg-slate-200 rounded-xl text-[#0B1E43] border border-slate-200/60 transition-colors">
            {logoIcon}
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg tracking-wider text-[#0B1E43] leading-none">
              LAPORBULELENG
            </h1>
            <p className="text-[9px] text-[#E28A1C] font-black uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-sans">
          <Link 
            href="/" 
            className={`text-xs font-bold transition-colors relative ${
              activePage === 'home' 
                ? "text-[#0B1E43] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[#E28A1C] after:rounded-full" 
                : "text-slate-600 hover:text-[#0B1E43]"
            }`}
          >
            Beranda
          </Link>
          <Link 
            href="/#tentang" 
            className="text-xs font-bold text-slate-600 hover:text-[#0B1E43] transition-colors"
          >
            Tentang
          </Link>
          <Link 
            href="/#berita" 
            className="text-xs font-bold text-slate-600 hover:text-[#0B1E43] transition-colors"
          >
            Berita
          </Link>
          <Link 
            href="/#profil" 
            className="text-xs font-bold text-slate-600 hover:text-[#0B1E43] transition-colors"
          >
            Profil
          </Link>
        </nav>
        
        {/* Right Action Menu */}
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/dashboard" 
            className="hidden sm:inline-flex px-5 py-2.5 bg-[#0B1E43] hover:bg-[#07132B] text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 items-center gap-1.5 cursor-pointer active:scale-[0.97]"
          >
            Login Admin
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.95] border border-slate-200/50"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 mt-3 pt-3 pb-2 space-y-2 flex flex-col font-sans animate-fadeIn">
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg ${
              activePage === 'home' 
                ? "text-[#0B1E43] bg-slate-50" 
                : "text-slate-600 hover:text-[#0B1E43] hover:bg-slate-50"
            }`}
          >
            Beranda
          </Link>
          <Link 
            href="/#tentang" 
            onClick={() => setIsMenuOpen(false)}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0B1E43] hover:bg-slate-50 rounded-lg transition-colors"
          >
            Tentang
          </Link>
          <Link 
            href="/#berita" 
            onClick={() => setIsMenuOpen(false)}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0B1E43] hover:bg-slate-50 rounded-lg transition-colors"
          >
            Berita
          </Link>
          <Link 
            href="/#profil" 
            onClick={() => setIsMenuOpen(false)}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0B1E43] hover:bg-slate-50 rounded-lg transition-colors"
          >
            Profil
          </Link>
          <Link 
            href="/admin/dashboard" 
            onClick={() => setIsMenuOpen(false)}
            className="sm:hidden mx-3 py-2.5 bg-[#0B1E43] hover:bg-[#07132B] text-white text-center text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97]"
          >
            Login Admin
          </Link>
        </div>
      )}
    </header>
  );
}
