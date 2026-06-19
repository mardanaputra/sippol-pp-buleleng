'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar({ activePage = 'home' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // If we're not on the main/home page, activeSection is simply the activePage
    if (activePage !== 'home') {
      setActiveSection(activePage);
      return;
    }

    const handleScroll = () => {
      // Check if scrolled to the absolute bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection('pustaka');
        return;
      }

      // Check current scroll position
      const scrollPosition = window.scrollY + 120; // offset for navbar height + buffer

      const petaEl = document.getElementById('peta');
      const pustakaEl = document.getElementById('pustaka');
      const tentangEl = document.getElementById('tentang');

      let currentSection = 'home';

      if (pustakaEl && scrollPosition >= pustakaEl.offsetTop) {
        currentSection = 'pustaka';
      } else if (petaEl && scrollPosition >= petaEl.offsetTop) {
        currentSection = 'peta';
      } else if (tentangEl && scrollPosition >= tentangEl.offsetTop) {
        currentSection = 'tentang';
      }

      setActiveSection(currentSection);
    };

    // Run once on mount to capture initial scroll or hash
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activePage]);

  // Konfigurasi Branding dinamis berdasarkan halaman aktif
  let subtitle = "SATPOL PP KAB. BULELENG";

  if (activePage === 'pengaduan') {
    subtitle = "LAYANAN PENGADUAN WARGA";
  } else if (activePage === 'status') {
    subtitle = "STATUS PENANGANAN LAPORAN";
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md px-6 py-3.5 shadow-sm border-b border-coffee-light/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo Branding */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="p-1 bg-white group-hover:bg-slate-50 rounded-xl border border-coffee-light/25 transition-colors w-10 h-10 flex items-center justify-center">
            <img
              src="/logo-satpolpp.png"
              alt="Logo Satpol PP"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-black text-base md:text-lg tracking-wider text-coffee-dark leading-none">
              LAPORBULELENG
            </h1>
            <p className="text-[9px] text-coffee-medium font-black uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-sans">
          <Link
            href="/"
            className={`text-xs font-extrabold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-coffee-medium after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:origin-left ${activeSection === 'home'
              ? "text-coffee-dark after:scale-x-100 after:opacity-100"
              : "text-slate-600 hover:text-coffee-dark after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-50"
              }`}
          >
            Beranda
          </Link>
          <Link
            href="/#tentang"
            className={`text-xs font-extrabold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-coffee-medium after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:origin-left ${activeSection === 'tentang'
              ? "text-coffee-dark after:scale-x-100 after:opacity-100"
              : "text-slate-600 hover:text-coffee-dark after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-50"
              }`}
          >
            Tentang
          </Link>
          <Link
            href="/#peta"
            className={`text-xs font-extrabold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-coffee-medium after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:origin-left ${activeSection === 'peta'
              ? "text-coffee-dark after:scale-x-100 after:opacity-100"
              : "text-slate-600 hover:text-coffee-dark after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-50"
              }`}
          >
            Peta
          </Link>
          <Link
            href="/#pustaka"
            className={`text-xs font-extrabold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-coffee-medium after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:origin-left ${activeSection === 'pustaka'
              ? "text-coffee-dark after:scale-x-100 after:opacity-100"
              : "text-slate-600 hover:text-coffee-dark after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-50"
              }`}
          >
            Pustaka
          </Link>
          <Link
            href="/pengaduan"
            className={`text-xs font-extrabold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-coffee-medium after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:origin-left ${activeSection === 'pengaduan'
              ? "text-coffee-dark after:scale-x-100 after:opacity-100"
              : "text-slate-600 hover:text-coffee-dark after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-50"
              }`}
          >
            Aduan Warga
          </Link>
          <Link
            href="/status"
            className={`text-xs font-extrabold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-coffee-medium after:rounded-full after:transition-all after:duration-300 after:ease-in-out after:origin-left ${activeSection === 'status'
              ? "text-coffee-dark after:scale-x-100 after:opacity-100"
              : "text-slate-600 hover:text-coffee-dark after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-50"
              }`}
          >
            Lacak Status
          </Link>
        </nav>

        {/* Right Action Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex px-5 py-2.5 bg-coffee-dark hover:bg-coffee-medium text-white text-xs font-black rounded-lg shadow-sm transition-all duration-200 items-center gap-1.5 cursor-pointer active:scale-[0.97]"
          >
            Login Admin
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 bg-slate-50 hover:bg-coffee-cream/20 rounded-lg text-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.95] border border-slate-200/50"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 mt-3 pt-3 pb-2 space-y-2 flex flex-col font-sans animate-fadeIn">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ease-in-out ${activeSection === 'home'
              ? "text-coffee-dark bg-coffee-cream/10 font-black"
              : "text-slate-600 hover:text-coffee-dark hover:bg-slate-50"
              }`}
          >
            Beranda
          </Link>
          <Link
            href="/#tentang"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ease-in-out ${activeSection === 'tentang'
              ? "text-coffee-dark bg-coffee-cream/10 font-black"
              : "text-slate-600 hover:text-coffee-dark hover:bg-slate-50"
              }`}
          >
            Tentang
          </Link>
          <Link
            href="/#peta"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ease-in-out ${activeSection === 'peta'
              ? "text-coffee-dark bg-coffee-cream/10 font-black"
              : "text-slate-600 hover:text-coffee-dark hover:bg-slate-50"
              }`}
          >
            Peta
          </Link>
          <Link
            href="/#pustaka"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ease-in-out ${activeSection === 'pustaka'
              ? "text-coffee-dark bg-coffee-cream/10 font-black"
              : "text-slate-600 hover:text-coffee-dark hover:bg-slate-50"
              }`}
          >
            Pustaka
          </Link>
          <Link
            href="/pengaduan"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ease-in-out ${activeSection === 'pengaduan'
              ? "text-coffee-dark bg-coffee-cream/10 font-black"
              : "text-slate-600 hover:text-coffee-dark hover:bg-slate-50"
              }`}
          >
            Aduan Warga
          </Link>
          <Link
            href="/status"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ease-in-out ${activeSection === 'status'
              ? "text-coffee-dark bg-coffee-cream/10 font-black"
              : "text-slate-600 hover:text-coffee-dark hover:bg-slate-50"
              }`}
          >
            Lacak Status
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setIsMenuOpen(false)}
            className="sm:hidden mx-3 py-2.5 bg-coffee-dark hover:bg-coffee-medium text-white text-center text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97]"
          >
            Login Admin
          </Link>
        </div>
      )}
    </header>
  );
}
