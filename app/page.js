import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Neumorphic Soft UI Floating Geometry Elements */}
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-[#e0e5ec] shadow-[16px_16px_32px_#b8bec5,-16px_-16px_32px_#ffffff] pointer-events-none opacity-60 z-0" />
      <div className="absolute bottom-24 -right-16 w-80 h-80 rounded-full bg-[#e0e5ec] shadow-[inset_16px_16px_32px_#b8bec5,inset_-16px_-16px_32px_#ffffff] pointer-events-none opacity-60 z-0" />
      <div className="absolute top-[40%] right-[10%] w-32 h-32 rounded-3xl bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec5,-10px_-10px_20px_#ffffff] rotate-12 pointer-events-none opacity-50 z-0" />

      {/* Header / Navbar (Molded Soft Plastic Style) */}
      <header className="sticky top-0 z-50 bg-[#e0e5ec] px-6 py-4 shadow-[4px_4px_10px_#b8bec5,-4px_-4px_10px_#ffffff]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#e0e5ec] rounded-xl shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] text-blue-800">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base md:text-lg tracking-wider text-blue-900 leading-none">
                LAPORBULELENG
              </h1>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                SATPOL PP KAB. BULELENG
              </p>
            </div>
          </div>
          
          {/* Right Action Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard" 
              className="px-5 py-2 bg-[#e0e5ec] text-blue-800 text-xs font-bold rounded-full shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Login
            </Link>
            <button className="p-2.5 bg-[#e0e5ec] rounded-full shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] text-slate-650 hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all cursor-pointer">
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-16 relative z-10 space-y-16 flex-1">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex px-4 py-1.5 bg-[#e0e5ec] rounded-full shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-xs font-bold text-blue-800 tracking-wider">
              📍 Kabupaten Buleleng
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-800 uppercase">
                Layanan Publik? <br />
                <span className="text-blue-800">Anda Berhak Lapor</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl">
                Sistem pelaporan gangguan ketertiban umum dan perlindungan masyarakat yang cepat, transparan, dan terintegrasi langsung ke petugas lapangan Kabupaten Buleleng.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/pengaduan"
                className="px-6 py-3.5 bg-[#e28a1c] hover:bg-[#d07b14] active:bg-[#e28a1c] text-white text-sm font-extrabold rounded-2xl shadow-[6px_6px_12px_#b8bec5,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Buat Laporan Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/status"
                className="px-6 py-3.5 bg-[#e0e5ec] text-slate-700 hover:text-slate-800 text-sm font-extrabold rounded-2xl shadow-[6px_6px_12px_#b8bec5,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#ffffff]/20"
              >
                Lacak Status Laporan
              </Link>
            </div>
          </div>

          {/* Right Molded Neumorphic Visual (Floating Elements, Molded Plastic Ring) */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            
            {/* Soft UI Large Molded Outer Sphere */}
            <div className="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] bg-[#e0e5ec] rounded-full shadow-[12px_12px_24px_#b8bec5,-12px_-12px_24px_#ffffff] flex items-center justify-center p-6 relative">
              
              {/* Inner Inset Dark Circle */}
              <div className="w-full h-full bg-[#1b3e83] rounded-full shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4)] flex items-center justify-center p-6 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#0b1a38] mx-auto flex items-center justify-center text-blue-900">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <span className="text-white text-xs font-black tracking-widest uppercase block">
                    [Ilustrasi Warga Melapor]
                  </span>
                  <p className="text-blue-200 text-[10px] max-w-[14rem] mx-auto leading-normal">
                    Aman, Rahasia, & Cepat Ditanggapi Oleh Petugas
                  </p>
                </div>
              </div>

              {/* Molded Ring Accent */}
              <div className="absolute inset-2 border-4 border-[#ffffff]/40 rounded-full pointer-events-none" />

            </div>

          </div>

        </div>

        {/* FOUR PILLARS SECTION */}
        <div className="space-y-10 pt-8 border-t border-slate-300/40">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">
              Empat Pilar Satpol PP Buleleng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Kami mendistribusikan laporan Anda ke empat bidang operasional khusus yang profesional untuk menjamin penanganan yang cepat dan akurat.
            </p>
          </div>

          {/* Pillars Cards Grid - Changed to Full-Width Stacked Sections */}
          <div className="space-y-12">
            
            {/* Card 1: Bidang Linmas */}
            <div className="bg-[#e0e5ec] rounded-3xl p-8 shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#e0e5ec] rounded-full shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                    Pilar Pertama
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Linmas</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Bertugas mengelola administrasi Satuan Perlindungan Masyarakat (Satlinmas) di tingkat desa dan kelurahan se-Kabupaten Buleleng. Bidang ini juga menjadi garda terdepan dalam penertiban gangguan Trantibum yang bersifat masalah sosial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-600 font-bold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-300/30">
                    <li className="flex items-center gap-2">✓ Penanganan Orang Dengan Gangguan Jiwa (ODGJ)</li>
                    <li className="flex items-center gap-2">✓ Penertiban Gepeng (Gelandangan & Pengemis)</li>
                    <li className="flex items-center gap-2">✓ Pembinaan Satlinmas Tingkat Desa</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-20 h-20 rounded-2xl bg-[#e0e5ec] shadow-[5px_5px_10px_#b8bec5,-5px_-5px_10px_#ffffff] flex items-center justify-center text-blue-850">
                    <Shield className="w-10 h-10" />
                  </div>
                  <Link
                    href="/admin/linmas"
                    className="w-full max-w-[240px] py-3.5 bg-[#e0e5ec] text-blue-850 hover:text-blue-900 text-xs font-black rounded-2xl shadow-[5px_5px_10px_#b8bec5,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#ffffff]/10"
                  >
                    Masuk Dashboard Linmas <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Bidang Trantib */}
            <div className="bg-[#e0e5ec] rounded-3xl p-8 shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#e0e5ec] rounded-full shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] text-[10px] font-bold text-orange-750 uppercase tracking-widest">
                    Pilar Kedua
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Trantib</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Fokus pada penanganan operasional patroli berkala di wilayah rawan (seperti pusat kota dan kawasan pariwisata), serta eksekusi langsung di lapangan terhadap gangguan ketenteraman masyarakat.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-600 font-bold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-300/30">
                    <li className="flex items-center gap-2">✓ Penertiban Pedagang Kaki Lima (PKL)</li>
                    <li className="flex items-center gap-2">✓ Penindakan Reklame Liar & Kedaluwarsa</li>
                    <li className="flex items-center gap-2">✓ Plotting & Manajemen Regu Patroli Harian</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-20 h-20 rounded-2xl bg-[#e0e5ec] shadow-[5px_5px_10px_#b8bec5,-5px_-5px_10px_#ffffff] flex items-center justify-center text-orange-600">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <Link
                    href="/admin/trantib"
                    className="w-full max-w-[240px] py-3.5 bg-[#e0e5ec] text-orange-750 hover:text-orange-850 text-xs font-black rounded-2xl shadow-[5px_5px_10px_#b8bec5,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#ffffff]/10"
                  >
                    Masuk Dashboard Trantib <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Bidang Perada */}
            <div className="bg-[#e0e5ec] rounded-3xl p-8 shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#e0e5ec] rounded-full shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] text-[10px] font-bold text-fuchsia-750 uppercase tracking-widest">
                    Pilar Ketiga
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Perada</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Kamus hukum digital Satpol PP Buleleng. Bertanggung jawab atas pendaftaran regulasi resmi, rincian pasal pelanggaran, serta administrasi eksekusi penegakan Peraturan Daerah (Perda) dan BAP Yustisial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-600 font-bold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-300/30">
                    <li className="flex items-center gap-2">✓ Master Data Regulasi (Perda & Perbup)</li>
                    <li className="flex items-center gap-2">✓ Penindakan Yustisial / Sidang Tipiring</li>
                    <li className="flex items-center gap-2">✓ Pelacakan Bukti Setor Kas Daerah (Denda)</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-20 h-20 rounded-2xl bg-[#e0e5ec] shadow-[5px_5px_10px_#b8bec5,-5px_-5px_10px_#ffffff] flex items-center justify-center text-fuchsia-600">
                    <Scale className="w-10 h-10" />
                  </div>
                  <Link
                    href="/admin/perada"
                    className="w-full max-w-[240px] py-3.5 bg-[#e0e5ec] text-fuchsia-750 hover:text-fuchsia-850 text-xs font-black rounded-2xl shadow-[5px_5px_10px_#b8bec5,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#ffffff]/10"
                  >
                    Masuk Dashboard Perada <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Neumorphic Access Floating Buttons (stick figure accessibility representation) */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="w-12 h-12 bg-blue-700 rounded-full shadow-[4px_4px_10px_#b8bec5,-4px_-4px_10px_#ffffff] active:shadow-[inset_4px_4px_8px_#0d1d3d,inset_-4px_-4px_8px_#224fa8] text-white flex items-center justify-center hover:scale-105 transition-all cursor-pointer">
          <Accessibility className="w-6 h-6" />
        </button>
      </div>

      {/* Page Footer */}
      <Footer />

    </div>
  );
}
