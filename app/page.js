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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Decorative Elegant Soft Gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header / Navbar (Modern Crisp Style) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-[#0B1E43] border border-slate-200/60">
              <Shield className="w-6 h-6 fill-[#0B1E43]/10" />
            </div>
            <div>
              <h1 className="font-extrabold text-base md:text-lg tracking-wider text-[#0B1E43] leading-none">
                LAPORBULELENG
              </h1>
              <p className="text-[9px] text-[#E28A1C] font-black uppercase tracking-widest mt-1">
                SATPOL PP KAB. BULELENG
              </p>
            </div>
          </div>
          
          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/dashboard" 
              className="px-5 py-2.5 bg-[#0B1E43] hover:bg-[#07132B] text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
            >
              Login Admin
            </Link>
            <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.95] border border-slate-200/50">
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
            <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-900 border border-blue-200/50 rounded-lg text-xs font-bold tracking-wider">
              <span className="mr-1.5">📍</span> Kabupaten Buleleng
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 uppercase">
                Layanan Publik? <br />
                <span className="text-[#0B1E43]">Anda Berhak Lapor</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl">
                Sistem pelaporan gangguan ketertiban umum dan perlindungan masyarakat yang cepat, transparan, dan terintegrasi langsung ke petugas lapangan Kabupaten Buleleng.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/pengaduan"
                className="px-6 py-3.5 bg-[#E28A1C] hover:bg-[#C9720C] text-white text-sm font-extrabold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Buat Laporan Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/status"
                className="px-6 py-3.5 bg-white text-[#0B1E43] hover:bg-slate-50 text-sm font-extrabold rounded-xl shadow-sm border border-slate-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Lacak Status Laporan
              </Link>
            </div>
          </div>

          {/* Right Premium Visual Badge */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            <div className="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] bg-white rounded-full shadow-lg border border-slate-200/50 flex items-center justify-center p-5 relative">
              {/* Outer Golden/Amber Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#E28A1C]/30 animate-[spin_100s_linear_infinite]" />
              
              {/* Inner Rich Deep Navy Circle */}
              <div className="w-full h-full bg-[#0B1E43] rounded-full flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                {/* Subtle decorative glow in navy circle */}
                <div className="absolute w-32 h-32 -top-10 -right-10 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-[#E28A1C] border border-white/20">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[#E28A1C] text-[10px] font-black tracking-widest uppercase block">
                      LAYANAN INTEGRASI ADUAN
                    </span>
                    <h3 className="text-white text-lg font-black mt-1 leading-tight">
                      SIPP-OL PP
                    </h3>
                  </div>
                  <p className="text-slate-300 text-[10px] max-w-[14rem] mx-auto leading-relaxed">
                    Aman, Rahasia, & Cepat Ditanggapi Langsung Oleh Petugas Lapangan Satpol PP
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOUR PILLARS SECTION */}
        <div className="space-y-10 pt-8 border-t border-slate-200">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-[#0B1E43] tracking-tight">
              Empat Pilar Satpol PP Buleleng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Kami mendistribusikan laporan Anda ke empat bidang operasional khusus yang profesional untuk menjamin penanganan yang cepat dan akurat.
            </p>
          </div>

          {/* Pillars Cards Grid */}
          <div className="space-y-8">
            
            {/* Card 1: Bidang Linmas */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200/60 text-[10px] font-black text-blue-900 rounded-lg uppercase tracking-wider">
                    Pilar Pertama
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Linmas</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Bertugas mengelola administrasi Satuan Perlindungan Masyarakat (Satlinmas) di tingkat desa dan kelurahan se-Kabupaten Buleleng. Bidang ini juga menjadi garda terdepan dalam penertiban gangguan Trantibum yang bersifat masalah sosial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <li className="flex items-center gap-2">✓ Penanganan Orang Dengan Gangguan Jiwa (ODGJ)</li>
                    <li className="flex items-center gap-2">✓ Penertiban Gepeng (Gelandangan & Pengemis)</li>
                    <li className="flex items-center gap-2">✓ Pembinaan Satlinmas Tingkat Desa</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#0B1E43] border border-slate-200/50">
                    <Shield className="w-8 h-8" />
                  </div>
                  <Link
                    href="/admin/linmas"
                    className="w-full max-w-[240px] py-3 bg-[#0B1E43] hover:bg-[#07132B] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    Masuk Dashboard Linmas <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Bidang Trantib */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800 rounded-lg uppercase tracking-wider">
                    Pilar Kedua
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Trantib</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Fokus pada penanganan operasional patroli berkala di wilayah rawan (seperti pusat kota dan kawasan pariwisata), serta eksekusi langsung di lapangan terhadap gangguan ketenteraman masyarakat.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <li className="flex items-center gap-2">✓ Penertiban Pedagang Kaki Lima (PKL)</li>
                    <li className="flex items-center gap-2">✓ Penindakan Reklame Liar & Kedaluwarsa</li>
                    <li className="flex items-center gap-2">✓ Plotting & Manajemen Regu Patroli Harian</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#E28A1C] border border-slate-200/50">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <Link
                    href="/admin/trantib"
                    className="w-full max-w-[240px] py-3 bg-[#0B1E43] hover:bg-[#07132B] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    Masuk Dashboard Trantib <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Bidang Perada */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 bg-fuchsia-50 border border-fuchsia-200/60 text-[10px] font-black text-fuchsia-850 rounded-lg uppercase tracking-wider">
                    Pilar Ketiga
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">Bidang Perada</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Kamus hukum digital Satpol PP Buleleng. Bertanggung jawab atas pendaftaran regulasi resmi, rincian pasal pelanggaran, serta administrasi eksekusi penegakan Peraturan Daerah (Perda) dan BAP Yustisial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <li className="flex items-center gap-2">✓ Master Data Regulasi (Perda & Perbup)</li>
                    <li className="flex items-center gap-2">✓ Penindakan Yustisial / Sidang Tipiring</li>
                    <li className="flex items-center gap-2">✓ Pelacakan Bukti Setor Kas Daerah (Denda)</li>
                  </ul>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-fuchsia-600 border border-slate-200/50">
                    <Scale className="w-8 h-8" />
                  </div>
                  <Link
                    href="/admin/perada"
                    className="w-full max-w-[240px] py-3 bg-[#0B1E43] hover:bg-[#07132B] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    Masuk Dashboard Perada <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Accessibility Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="w-12 h-12 bg-[#0B1E43] hover:bg-[#07132B] rounded-full shadow-md text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-700/50">
          <Accessibility className="w-5 h-5" />
        </button>
      </div>

      {/* Page Footer */}
      <Footer />

    </div>
  );
}
