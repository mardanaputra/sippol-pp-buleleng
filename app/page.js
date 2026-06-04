'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Send, 
  Search, 
  Shield, 
  Scale, 
  ArrowRight,
  Menu,
  Accessibility,
  EyeOff,
  Clock,
  ExternalLink,
  Target,
  Eye,
  Users,
  X,
  Calendar
} from 'lucide-react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  const [isProfilVisible, setIsProfilVisible] = useState(false);
  const profilRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsProfilVisible(true);
          observer.unobserve(entry.target); // Reveal only once
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (profilRef.current) {
      observer.observe(profilRef.current);
    }

    return () => {
      if (profilRef.current) {
        observer.unobserve(profilRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 flex flex-col justify-between relative overflow-x-hidden font-sans select-none scroll-smooth">
      
      {/* Decorative Elegant Soft Gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-coffee-cream/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] bg-coffee-light/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Reusable Navbar Component */}
      <Navbar activePage="home" />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-28 pb-12 md:pt-32 md:pb-16 relative z-10 space-y-16 flex-1">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center px-4 py-1.5 bg-[#561C24]/5 text-[#561C24] border border-[#C7B7A3]/30 rounded-lg text-xs font-bold tracking-wider">
              <span className="mr-1.5">📍</span> Kabupaten Buleleng
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 uppercase">
                Layanan Publik? <br />
                <span className="text-[#561C24]">Anda Berhak Lapor</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl">
                Sistem pelaporan gangguan ketertiban umum dan perlindungan masyarakat yang cepat, transparan, dan terintegrasi langsung ke petugas lapangan Kabupaten Buleleng.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/pengaduan"
                className="px-6 py-3.5 bg-[#561C24] hover:bg-[#6D2932] text-white text-sm font-extrabold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Buat Laporan Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/status"
                className="px-6 py-3.5 bg-white text-[#561C24] hover:bg-slate-50 text-sm font-extrabold rounded-xl shadow-sm border border-slate-205 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Lacak Status Laporan
              </Link>
            </div>
          </div>

          {/* Right Premium Visual Badge */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            <div className="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] bg-white rounded-full shadow-lg border border-slate-205/50 flex items-center justify-center p-5 relative">
              {/* Outer Golden/Amber Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#E28A1C]/30 animate-[spin_100s_linear_infinite]" />
              
              {/* Inner Rich Deep Navy Circle */}
              <div className="w-full h-full bg-[#0B1E43] rounded-full flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                {/* Subtle decorative glow in navy circle */}
                <div className="absolute w-32 h-32 -top-10 -right-10 bg-white/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-[#E8D8C4] border border-white/20">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[#E8D8C4] text-[10px] font-black tracking-widest uppercase block">
                      LAYANAN INTEGRASI ADUAN
                    </span>
                    <h3 className="text-white text-lg font-black mt-1 leading-tight">
                      SIPP-OL PP
                    </h3>
                  </div>
                  <p className="text-slate-350 text-[10px] max-w-[14rem] mx-auto leading-relaxed">
                    Aman, Rahasia, & Cepat Ditanggapi Langsung Oleh Petugas Lapangan Satpol PP
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOUR PILLARS SECTION */}
        <div className="space-y-10 pt-8 border-t border-slate-205">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Empat Pilar Satpol PP Buleleng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Kami mendistribusikan laporan Anda ke empat bidang operasional khusus yang profesional untuk menjamin penanganan yang cepat dan akurat.
            </p>
          </div>

          {/* Pillars Cards Grid */}
          <div className="space-y-8">
            
            {/* Card 1: Bidang Linmas */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-205/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#561C24]/5 border border-blue-200/60 text-[10px] font-black text-blue-900 rounded-lg uppercase tracking-wider">
                    Pilar Pertama
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Linmas</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Bertugas mengelola administrasi Satuan Perlindungan Masyarakat (Satlinmas) di tingkat desa dan kelurahan se-Kabupaten Buleleng. Bidang ini juga menjadi garda terdepan dalam penertiban gangguan Trantibum yang bersifat masalah sosial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">✓ Penanganan Orang Dengan Gangguan Jiwa (ODGJ)</li>
                    <li className="flex items-center gap-2">✓ Penertiban Gepeng (Gelandangan & Pengemis)</li>
                    <li className="flex items-center gap-2">✓ Pembinaan Satlinmas Tingkat Desa</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#561C24] border border-slate-205/50">
                    <Shield className="w-8 h-8" />
                  </div>
                  <Link
                    href="/admin/linmas"
                    className="w-full max-w-[240px] py-3 bg-[#561C24] hover:bg-[#6D2932] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    Masuk Dashboard Linmas <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Bidang Trantib */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-205/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800 rounded-lg uppercase tracking-wider">
                    Pilar Kedua
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Trantib</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Fokus pada penanganan operasional patroli berkala di wilayah rawan (seperti pusat kota dan kawasan pariwisata), serta eksekusi langsung di lapangan terhadap gangguan ketenteraman masyarakat.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">✓ Penertiban Pedagang Kaki Lima (PKL)</li>
                    <li className="flex items-center gap-2">✓ Penindakan Reklame Liar & Kedaluwarsa</li>
                    <li className="flex items-center gap-2">✓ Plotting & Manajemen Regu Patroli Harian</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#E8D8C4] border border-slate-205/50">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <Link
                    href="/admin/trantib"
                    className="w-full max-w-[240px] py-3 bg-[#561C24] hover:bg-[#6D2932] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    Masuk Dashboard Trantib <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Bidang Perada */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-205/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-fuchsia-50 border border-fuchsia-200/60 text-[10px] font-black text-fuchsia-850 rounded-lg uppercase tracking-wider">
                    Pilar Ketiga
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Perada</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Kamus hukum digital Satpol PP Buleleng. Bertanggung jawab atas pendaftaran regulasi resmi, rincian pasal pelanggaran, serta administrasi eksekusi penegakan Peraturan Daerah (Perda) dan BAP Yustisial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">✓ Master Data Regulasi (Perda & Perbup)</li>
                    <li className="flex items-center gap-2">✓ Penindakan Yustisial / Sidang Tipiring</li>
                    <li className="flex items-center gap-2">✓ Pelacakan Bukti Setor Kas Daerah (Denda)</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#561C24] border border-[#C7B7A3]/30">
                    <Scale className="w-8 h-8" />
                  </div>
                  <Link
                    href="/admin/perada"
                    className="w-full max-w-[240px] py-3 bg-[#561C24] hover:bg-[#6D2932] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    Masuk Dashboard Perada <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* TENTANG KAMI SECTION */}
        <div id="tentang" className="space-y-10 pt-12 border-t border-slate-205 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800 rounded-lg uppercase tracking-wider">
              Mengenal Lebih Dekat
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Tentang Satpol PP Buleleng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Satuan Polisi Pamong Praja Kabupaten Buleleng berdedikasi tinggi menjaga ketertiban umum, menegakkan peraturan daerah, serta memberikan perlindungan maksimal bagi seluruh lapisan masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-205/80 space-y-4 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#561C24]/5 flex items-center justify-center text-[#561C24] border border-blue-100">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-[#561C24]">Visi Kami</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Terwujudnya ketenteraman dan ketertiban umum serta perlindungan masyarakat yang prima berbasis kearifan lokal guna mendukung pembangunan Kabupaten Buleleng yang maju, mandiri, dan sejahtera.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-205/80 space-y-4 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#E8D8C4] border border-amber-100">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-[#561C24]">Misi Kami</h4>
              <ul className="text-xs text-slate-600 space-y-2.5 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#E8D8C4] mt-0.5 font-bold">1.</span>
                  <span>Meningkatkan efektivitas penegakan Peraturan Daerah dan Peraturan Kepala Daerah secara humanis namun tegas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#E8D8C4] mt-0.5 font-bold">2.</span>
                  <span>Mewujudkan situasi wilayah yang kondusif, aman, tertib, dan tenteram bagi kelancaran aktivitas perekonomian dan sosial warga.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#E8D8C4] mt-0.5 font-bold">3.</span>
                  <span>Mengoptimalkan peran Satlinmas dalam kesiapsiagaan penanggulangan bencana, ketenteraman pemilu, dan perlindungan masyarakat desa.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Dasar Hukum Box */}
          <div className="bg-gradient-to-r from-[#561C24] to-[#6D2932] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3 text-left">
                <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-[9px] font-black text-blue-250 rounded-lg uppercase tracking-wider">
                  Landasan Konstitusional
                </span>
                <h4 className="text-lg md:text-xl font-black tracking-tight text-white">
                  Dasar Hukum & Kewenangan Operasional
                </h4>
                <p className="text-xs text-slate-350 leading-relaxed font-medium">
                  Eksistensi Satuan Polisi Pamong Praja Kabupaten Buleleng berlandaskan Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah serta Peraturan Pemerintah Nomor 16 Tahun 2018 tentang Satpol PP, yang memberikan wewenang yustisial dan non-yustisial penuh untuk menegakkan ketertiban umum di daerah.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="px-6 py-4 bg-white/10 rounded-xl border border-white/20 text-center max-w-[240px] backdrop-blur-sm">
                  <Scale className="w-8 h-8 text-[#E8D8C4] mx-auto mb-2" />
                  <span className="text-[10px] text-slate-350 font-bold block">Perda Penyelenggaraan Trantib</span>
                  <span className="text-xs text-white font-black block mt-0.5">Perda No. 6 Tahun 2014</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BERITA & KEGIATAN TERKINI */}
        <div id="berita" className="space-y-10 pt-12 border-t border-slate-205 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#561C24]/5 border border-blue-200/60 text-[10px] font-black text-blue-900 rounded-lg uppercase tracking-wider">
              Kabar dari Lapangan
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Berita & Kegiatan Satpol PP
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Ikuti rilis berita resmi mengenai operasi penertiban, kegiatan sosialisasi hukum daerah, serta pelatihan pembinaan linmas di wilayah Kabupaten Buleleng.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Berita 1 */}
            <article className="bg-white rounded-2xl overflow-hidden border border-slate-205/80 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between text-left group">
              <div className="space-y-4">
                <div className="h-48 bg-[#0B1E43] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#561C24] to-[#6D2932] opacity-90" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  <ShieldAlert className="w-16 h-16 text-[#E8D8C4] opacity-80 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#561C24] text-[#E8D8C4] border border-[#C7B7A3]/30 text-[9px] font-black rounded-lg uppercase tracking-wider z-10">
                    Trantibum
                  </span>
                </div>
                
                <div className="px-5 pb-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-bold">
                    <Calendar className="w-3.5 h-3.5" /> 22 Mei 2026
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#561C24] transition-colors">
                    Patroli Gabungan Penertiban PKL di Kawasan Taman Kota Singaraja berjalan Humanis
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    Petugas Satpol PP Kabupaten Buleleng melaksanakan penertiban berkala bagi pedagang kaki lima yang berjualan di luar area relokasi resmi. Pendekatan persuasif dikedepankan demi kenyamanan bersama.
                  </p>
                </div>
              </div>
              
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-[#561C24] font-black uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                  Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Oleh: Humas PP</span>
              </div>
            </article>

            {/* Berita 2 */}
            <article className="bg-white rounded-2xl overflow-hidden border border-slate-205/80 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between text-left group">
              <div className="space-y-4">
                <div className="h-48 bg-[#561C24] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#561C24] to-[#6D2932] opacity-90" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  <Scale className="w-16 h-16 text-[#E8D8C4] opacity-80 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#6D2932] text-[#E8D8C4] border border-[#C7B7A3]/30 text-[9px] font-black rounded-lg uppercase tracking-wider z-10">
                    Penegakan Perda
                  </span>
                </div>
                
                <div className="px-5 pb-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-bold">
                    <Calendar className="w-3.5 h-3.5" /> 20 Mei 2026
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#561C24] transition-colors">
                    Sosialisasi Kepatuhan Peraturan Daerah Terkait Izin Usaha kepada Pelaku Usaha Baru
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    Bidang Perada memberikan edukasi langsung mengenai tata ruang dan perizinan usaha mikro dan menengah di daerah pesisir Buleleng guna memastikan kepatuhan hukum sejak dini.
                  </p>
                </div>
              </div>
              
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-[#561C24] font-black uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                  Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Oleh: Humas PP</span>
              </div>
            </article>

            {/* Berita 3 */}
            <article className="bg-white rounded-2xl overflow-hidden border border-slate-205/80 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between text-left group">
              <div className="space-y-4">
                <div className="h-48 bg-[#0B1E43] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#561C24] to-[#6D2932] opacity-90" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  <Shield className="w-16 h-16 text-[#E8D8C4] opacity-80 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#6D2932] text-[#E8D8C4] border border-[#C7B7A3]/30 text-[9px] font-black rounded-lg uppercase tracking-wider z-10">
                    Linmas
                  </span>
                </div>
                
                <div className="px-5 pb-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-bold">
                    <Calendar className="w-3.5 h-3.5" /> 18 Mei 2026
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#561C24] transition-colors">
                    Pembinaan dan Peningkatan Kapasitas Anggota Linmas Desa se-Kecamatan Banjar
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    Guna mengoptimalkan kesiapan mitigasi bencana dan menjaga ketenteraman warga di pedesaan, Satpol PP Buleleng menyelenggarakan pembekalan materi fisik dan organisasi linmas secara menyeluruh.
                  </p>
                </div>
              </div>
              
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-[#561C24] font-black uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                  Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Oleh: Humas PP</span>
              </div>
            </article>
          </div>
        </div>

        {/* PROFIL SATUAN & STRUKTUR ORGANISASI */}
        <div 
          ref={profilRef}
          id="profil" 
          className={`space-y-10 pt-12 border-t border-slate-205 scroll-mt-24 transition-all duration-1000 ease-out transform ${
            isProfilVisible 
              ? "opacity-100 translate-y-0 blur-none" 
              : "opacity-0 translate-y-12 blur-sm"
          }`}
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800 rounded-lg uppercase tracking-wider">
              Struktur Kepemimpinan
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Profil & Komando Struktur
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Dipimpin oleh jajaran perwira berpengalaman untuk mengoordinasikan bidang ketertiban umum, penegakan regulasi daerah, serta perlindungan masyarakat.
            </p>
          </div>

          {/* Leaders Grid */}
          <div className="space-y-8">
            
            {/* Kepala Satuan - Primary Officer */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-205/80 max-w-2xl mx-auto hover:shadow-md transition-all duration-350">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-20 h-20 rounded-full bg-slate-100 text-[#561C24] border border-slate-205 flex items-center justify-center shadow-inner shrink-0 relative">
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E28A1C] border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                    ★
                  </div>
                  <Users className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 bg-[#561C24]/5 border border-[#C7B7A3]/30 text-[#561C24] text-[9px] font-black rounded-md uppercase tracking-wider">
                    Kepala Satuan Pol PP Buleleng
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Drs. I Gede Sandhiyasa, M.Si.
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Bertanggung jawab memimpin seluruh perencanaan, pelaksanaan, serta koordinasi operasional ketenteraman masyarakat dan penegakan Perda di wilayah Kabupaten Buleleng.
                  </p>
                </div>
              </div>
            </div>

            {/* Cabinet Members (Kabid) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {/* Kabid Trantib */}
              <div className="bg-white rounded-2xl p-5 border border-slate-205/80 text-left space-y-3 hover:shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#561C24] flex items-center justify-center border border-slate-150">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] text-[#E8D8C4] font-black uppercase tracking-wider">Kabid Trantibum</h5>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">I Putu Suwardika, SH</h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-2 leading-relaxed">
                    Mengelola tim patroli harian, operasi lapangan, penertiban PKL, serta menjaga ketenteraman masyarakat perkotaan secara berkala.
                  </p>
                </div>
              </div>

              {/* Kabid Linmas */}
              <div className="bg-white rounded-2xl p-5 border border-slate-205/80 text-left space-y-3 hover:shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#561C24] flex items-center justify-center border border-slate-150">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] text-[#E8D8C4] font-black uppercase tracking-wider">Kabid Linmas</h5>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">I Ketut Yudistira, S.Sos</h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-2 leading-relaxed">
                    Bertanggung jawab atas administrasi, sertifikasi, pembinaan fisik, serta pengerahan kesiapsiagaan Satlinmas tingkat desa/kelurahan.
                  </p>
                </div>
              </div>

              {/* Kabid Perada */}
              <div className="bg-white rounded-2xl p-5 border border-slate-205/80 text-left space-y-3 hover:shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#561C24] flex items-center justify-center border border-slate-150">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] text-[#E8D8C4] font-black uppercase tracking-wider">Kabid Perada</h5>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">Luh Gede Astuti, SH</h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-2 leading-relaxed">
                    Mengatur register regulasi resmi, BAP pelanggaran yustisial, pendataan denda kas daerah, serta mengoordinasikan sidang tindak pidana ringan (Tipiring).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Accessibility Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="w-12 h-12 bg-[#561C24] hover:bg-[#6D2932] rounded-full shadow-md text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-700/50">
          <Accessibility className="w-5 h-5" />
        </button>
      </div>

      {/* Page Footer */}
      <Footer />

    </div>
  );
}
