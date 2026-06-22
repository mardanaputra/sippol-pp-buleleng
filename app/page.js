'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
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
  Calendar,
  Layers,
  MapPin,
  Info,
  Map,
  ChevronDown,
  Download
} from 'lucide-react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const BULELENG_REGENCY = {
  "Buleleng": ["Astina", "Banjar Bali", "Banjar Jawa", "Banjar Tegal", "Banyuasri", "Banyuning", "Beratan", "Kaliuntu", "Kampung Baru", "Kampung Bugis", "Kampung Kajanan", "Kampung Singaraja", "Kendran", "Liligundi", "Paket Agung", "Penarukan", "Singaraja", "Tukadmungga", "Pemaron", "Jinengdalem", "Poh Bergong", "Kalibukbuk", "Bakti Seraga"],
  "Sukasada": ["Sukasada", "Gitgit", "Pancasari", "Wanagiri", "Ambengan", "Sambangan", "Pegayaman", "Silangjana", "Panji", "Panji Anom", "Kayu Putih", "Selat", "Padangbulia", "Tegallinggah"],
  "Banjar": ["Banjar", "Banjar Tegeha", "Banyuatis", "Dencarik", "Gesing", "Gobleg", "Kaliasem", "Kayuputih", "Munduk", "Pedawa", "Sidetapa", "Tampekan", "Temukus", "Tigawasa", "Cempaga"],
  "Gerokgak": ["Gerokgak", "Banyupoh", "Celukan Bawang", "Pemuteran", "Pejarakan", "Sanggalangit", "Sumberkima", "Tukadsumaga", "Musi", "Patas", "Tinga-Tinga", "Penyabangan"],
  "Seririt": ["Seririt", "Bestala", "Bubunan", "Gunungsari", "Joanyar", "Kalianget", "Lokapaksa", "Mayong", "Patemon", "Pengastulan", "Ringdikit", "Sulanyah", "Tangguwisia", "Ularan", "Pangkung Paruk", "Rangdu"],
  "Busungbiu": ["Busungbiu", "Bengkel", "Bongancina", "Kekeran", "Kedis", "Pelapuan", "Pucaksari", "Subuk", "Telaga", "Tinggarsari", "Titab", "Umajero", "Kariasa"],
  "Sawan": ["Sawan", "Bebetin", "Bungkulan", "Galungan", "Giri Emas", "Jagaraga", "Kerobokan", "Lemukih", "Menyali", "Sangsit", "Sekumpul", "Sinabun", "Sudaji", "Suwug", "Bontihing"],
  "Kubutambahan": ["Kubutambahan", "Bila", "Bukti", "Depeha", "Bontihing", "Bulian", "Mengening", "Pakisan", "Tajun", "Tembok", "Tamblang", "Tunjung"],
  "Tejakula": ["Tejakula", "Bondalem", "Julah", "Madenan", "Les", "Penuktukan", "Pacung", "Sambirenteng", "Sembiran", "Giri Emas"]
};

const BULELENG_MAP_DATA = [
  {
    id: 'gerokgak',
    name: 'Gerokgak',
    rawan: 'Aman',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    perkada: 12,
    path: "M 25,175 C 45,160 75,150 115,140 C 125,125 140,120 155,125 C 165,135 185,140 205,145 L 225,150 L 245,150 L 255,165 L 230,215 L 180,215 L 120,205 L 60,195 Z",
    cx: 140,
    cy: 175,
    desc: 'Tingkat ketertiban stabil, regulasi perikanan & pesisir terkelola dengan baik.'
  },
  {
    id: 'seririt',
    name: 'Seririt',
    rawan: 'Rawan Sedang',
    color: '#f97316',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-600',
    perkada: 18,
    path: "M 225,150 L 245,150 L 255,165 L 250,210 L 290,212 L 310,195 L 315,160 L 295,145 Z",
    cx: 270,
    cy: 175,
    desc: 'Keramaian pasar tinggi, memerlukan pengawasan zonasi PKL berkala.'
  },
  {
    id: 'busungbiu',
    name: 'Busungbiu',
    rawan: 'Aman',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    perkada: 8,
    path: "M 180,215 L 230,215 L 250,210 L 260,250 L 245,285 L 220,295 L 175,275 Z",
    cx: 215,
    cy: 250,
    desc: 'Kawasan perkebunan aman, dominasi koordinasi Linmas tingkat desa.'
  },
  {
    id: 'banjar',
    name: 'Banjar',
    rawan: 'Rawan Sedang',
    color: '#f97316',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-600',
    perkada: 15,
    path: "M 295,145 L 365,150 L 375,195 L 360,235 L 335,255 L 290,250 L 290,212 L 310,195 L 315,160 Z",
    cx: 330,
    cy: 195,
    desc: 'Fokus pengamanan pariwisata pemandian air panas & kepatuhan reklame.'
  },
  {
    id: 'sukasada',
    name: 'Sukasada',
    rawan: 'Rawan Tinggi',
    color: '#ef4444',
    bgClass: 'bg-red-500',
    textClass: 'text-rose-600',
    perkada: 24,
    path: "M 335,255 L 360,235 L 375,195 L 435,205 L 465,220 L 460,275 L 415,285 Z",
    cx: 405,
    cy: 240,
    desc: 'Kerawanan jalur utama Bedugul-Singaraja, pengamanan bencana & tata ruang.'
  },
  {
    id: 'buleleng',
    name: 'Buleleng',
    rawan: 'Rawan Tinggi',
    color: '#ef4444',
    bgClass: 'bg-red-500',
    textClass: 'text-rose-600',
    perkada: 32,
    path: "M 365,150 L 445,160 L 455,205 L 435,205 L 375,195 Z",
    cx: 410,
    cy: 175,
    desc: 'Pusat pemerintahan & ekonomi, intensitas aduan PKL & ketertiban umum tertinggi.'
  },
  {
    id: 'sawan',
    name: 'Sawan',
    rawan: 'Aman',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    perkada: 14,
    path: "M 445,160 L 520,172 L 530,215 L 465,220 L 455,205 Z",
    cx: 485,
    cy: 185,
    desc: 'Aktivitas pertanian dominan, situasi ketertiban kondusif.'
  },
  {
    id: 'kubutambahan',
    name: 'Kubutambahan',
    rawan: 'Rawan Sedang',
    color: '#f97316',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-600',
    perkada: 16,
    path: "M 520,172 L 610,182 L 600,230 L 530,215 Z",
    cx: 565,
    cy: 198,
    desc: 'Pengawasan jalur perlintasan timur, penertiban baliho tanpa izin.'
  },
  {
    id: 'tejakula',
    name: 'Tejakula',
    rawan: 'Aman',
    color: '#3b82f6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    perkada: 11,
    path: "M 610,182 C 670,187 730,193 830,202 L 840,212 L 780,252 L 700,248 L 600,230 Z",
    cx: 710,
    cy: 215,
    desc: 'Pesisir timur kondusif, pengawasan berkala pos Satlinmas pantai.'
  }
];

const PublicMap = dynamic(() => import('./admin/dashboard/AdminMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 relative flex items-center justify-center min-h-[360px] shadow-inner">
      <div className="flex items-center gap-2 font-bold text-xs text-slate-500">
        <svg className="animate-spin h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Memuat Peta Spasial...</span>
      </div>
    </div>
  )
});


export default function Home() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isPillarsVisible, setIsPillarsVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isPustakaVisible, setIsPustakaVisible] = useState(false);
  const [isTentangVisible, setIsTentangVisible] = useState(false);

  const pillarsRef = useRef(null);
  const mapSectionRef = useRef(null);
  const pustakaRef = useRef(null);
  const tentangRef = useRef(null);

  // Map and log states
  const [reports, setReports] = useState([]);
  const [trantibLogs, setTrantibLogs] = useState([]);
  const [linmasMembers, setLinmasMembers] = useState([]);
  const [peradaEnforcements, setPeradaEnforcements] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [hoveredKecamatan, setHoveredKecamatan] = useState(null);

  // JDIH Pustaka States
  const [pustakaList, setPustakaList] = useState([]);
  const [pustakaSearch, setPustakaSearch] = useState('');
  const [pustakaFilter, setPustakaFilter] = useState('');

  // Fetch stats per Kecamatan
  const getKecStats = (kecName) => {
    if (!kecName) return { reklame: 0, pkl: 0, satlinmas: 0, perada: 0 };
    const nameLower = kecName.toLowerCase();

    const reklame = trantibLogs.filter(l => {
      const isKecMatch = `${l.lokasi} ${l.keterangan}`.toLowerCase().includes(nameLower);
      const isReklame = l.jenis_pelanggaran?.includes('Reklame') || l.jenis_pelanggaran?.includes('Iklan') || l.jenis_pelanggaran?.includes('Baliho');
      return isKecMatch && isReklame;
    }).length;

    const pkl = trantibLogs.filter(l => {
      const isKecMatch = `${l.lokasi} ${l.keterangan}`.toLowerCase().includes(nameLower);
      const isPkl = l.jenis_pelanggaran?.includes('PKL') || l.jenis_pelanggaran?.includes('Zonasi') || l.jenis_pelanggaran?.includes('Kaki Lima') || l.jenis_pelanggaran?.includes('Pedagang');
      return isKecMatch && isPkl;
    }).length;

    const satlinmas = linmasMembers
      .filter(m => m.kecamatan?.toLowerCase() === nameLower)
      .reduce((acc, curr) => acc + (curr.anggota_pria || 0) + (curr.anggota_wanita || 0), 0);

    const perada = peradaEnforcements.filter(p => {
      const text = `${p.lokasi_kejadian} ${p.alamat_pelanggar} ${p.kronologi_singkat}`.toLowerCase();
      return text.includes(nameLower);
    }).length;

    return { reklame, pkl, satlinmas, perada };
  };

  // Base64 PDF Download Helper
  const downloadBase64Pdf = (base64String, filename) => {
    if (!base64String) return;
    const link = document.createElement('a');
    const hasPrefix = base64String.startsWith('data:application/pdf;base64,');
    link.href = hasPrefix ? base64String : `data:application/pdf;base64,${base64String}`;
    link.download = filename || 'dokumen-arsip-sda.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Reveal hero section immediately on mount
    setIsHeroVisible(true);

    // Fetch data for the spatial map & JDIH Pustaka
    const fetchMapAndPustakaData = async () => {
      try {
        const [res1, res2, res3, res4, res5] = await Promise.all([
          fetch('/api/pengaduan'),
          fetch('/api/trantib/penertiban'),
          fetch('/api/linmas/satlinmas'),
          fetch('/api/perada/penegakan'),
          fetch('/api/sda/pustaka')
        ]);
        if (res1.ok) setReports(await res1.json());
        if (res2.ok) setTrantibLogs(await res2.json());
        if (res3.ok) setLinmasMembers(await res3.json());
        if (res4.ok) setPeradaEnforcements(await res4.json());
        if (res5.ok) setPustakaList(await res5.json());
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };
    fetchMapAndPustakaData();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === pillarsRef.current) {
              setIsPillarsVisible(true);
            } else if (entry.target === mapSectionRef.current) {
              setIsMapVisible(true);
            } else if (entry.target === pustakaRef.current) {
              setIsPustakaVisible(true);
            } else if (entry.target === tentangRef.current) {
              setIsTentangVisible(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (pillarsRef.current) observer.observe(pillarsRef.current);
    if (mapSectionRef.current) observer.observe(mapSectionRef.current);
    if (pustakaRef.current) observer.observe(pustakaRef.current);
    if (tentangRef.current) observer.observe(tentangRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Filter JDIH Pustaka list based on search term and category selection
  const filteredPustaka = pustakaList.filter((doc) => {
    const matchesSearch =
      !pustakaSearch ||
      doc.judul_dokumen?.toLowerCase().includes(pustakaSearch.toLowerCase()) ||
      doc.no_arsip?.toLowerCase().includes(pustakaSearch.toLowerCase()) ||
      doc.nomor_tahun_aturan?.toLowerCase().includes(pustakaSearch.toLowerCase()) ||
      doc.instansi_penerbit?.toLowerCase().includes(pustakaSearch.toLowerCase()) ||
      doc.tags?.toLowerCase().includes(pustakaSearch.toLowerCase());

    let matchesCategory = true;
    if (pustakaFilter) {
      if (pustakaFilter === 'UU') {
        matchesCategory = doc.jenis_aturan?.includes('Undang-Undang') || doc.jenis_aturan?.includes('Pusat') || doc.jenis_aturan?.includes('UU');
      } else if (pustakaFilter === 'Permendagri') {
        matchesCategory = doc.jenis_aturan?.includes('Permendagri') || doc.jenis_aturan?.includes('Menteri');
      } else if (pustakaFilter === 'Perda') {
        matchesCategory = doc.jenis_aturan?.includes('Perda') || doc.jenis_aturan?.includes('Daerah');
      } else if (pustakaFilter === 'Perbup') {
        matchesCategory = doc.jenis_aturan?.includes('Perbup') || doc.jenis_aturan?.includes('Bupati') || doc.jenis_aturan?.includes('Perkada');
      } else if (pustakaFilter === 'SK') {
        matchesCategory = doc.jenis_aturan?.includes('Surat Keputusan') || doc.jenis_aturan?.includes('SK') || doc.jenis_aturan?.includes('SOP');
      } else {
        matchesCategory = doc.jenis_aturan?.toLowerCase().includes(pustakaFilter.toLowerCase());
      }
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden font-sans select-none scroll-smooth">

      {/* Decorative Elegant Soft Gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-coffee-cream/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] bg-coffee-light/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Reusable Navbar Component */}
      <Navbar activePage="home" />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-28 pb-12 md:pt-32 md:pb-16 relative z-10 space-y-16 flex-1">

        {/* HERO SECTION */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-all duration-1000 ease-out transform ${isHeroVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
          }`}>

          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center px-4 py-1.5 bg-[#561C24]/5 text-[#561C24] border border-[#C7B7A3]/30 rounded-lg text-xs font-bold tracking-wider">
              <span className="mr-1.5"></span> Kabupaten Buleleng
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

              {/* Inner Rich Deep Red Circle */}
              <div className="w-full h-full bg-[#561C24] rounded-full flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                {/* Subtle decorative glow in red circle */}
                <div className="absolute w-32 h-32 -top-10 -right-10 bg-white/5 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="w-32 h-32 md:w-36 md:h-36 mx-auto flex items-center justify-center relative">
                    <img
                      src="/logo-satpolpp.png"
                      alt="Logo Satpol PP"
                      className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
                    />
                  </div>
                  <div>
                    <span className="text-[#E8D8C4] text-[10px] font-black tracking-widest uppercase block">
                      LAYANAN INTEGRASI ADUAN
                    </span>
                    <h3 className="text-white text-lg font-black mt-1 leading-tight">
                      SIPPOL PP
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* TENTANG KAMI SECTION */}
        <div
          ref={tentangRef}
          id="tentang"
          className={`space-y-10 pt-12 border-t border-slate-205 scroll-mt-24 transition-all duration-1000 ease-out transform ${isTentangVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
            }`}
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800 rounded-lg uppercase tracking-wider">
              Mengenal Lebih Dekat
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Tentang Satpol PP Buleleng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Satuan Polisi Pamong Praja Kabupaten Buleleng berdedikasi tinggi menjaga ketertiban umum, menegakkan peraturan daerah, serta memberikan pelindungan maksimal bagi seluruh lapisan masyarakat.
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
        </div>

        {/* FOUR PILLARS SECTION */}
        <div
          ref={pillarsRef}
          className={`space-y-10 pt-8 border-t border-slate-205 transition-all duration-1000 ease-out transform ${isPillarsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
            }`}
        >

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
                <div className="lg:col-span-10 space-y-4">
                  <span className="inline-block px-3 py-1 bg-[#561C24]/5 border border-blue-200/60 text-[10px] font-black text-blue-900 rounded-lg uppercase tracking-wider">
                    Pilar Pertama
                  </span>
                  <h4 className="text-xl font-extrabold text-foreground">Bidang Linmas</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Bertugas mengelola administrasi Satuan Perlindungan Masyarakat (Satlinmas) di tingkat desa dan kelurahan se-Kabupaten Buleleng. Bidang ini juga menjadi garda terdepan dalam penertiban gangguan Trantibum yang bersifat masalah sosial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">Penanganan Orang Dengan Gangguan Jiwa (ODGJ)</li>
                    <li className="flex items-center gap-2">Penertiban Gepeng (Gelandangan & Pengemis)</li>
                    <li className="flex items-center gap-2">Pembinaan Satlinmas Tingkat Desa</li>
                  </ul>
                </div>
                <div className="lg:col-span-2 flex items-center justify-center">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#561C24] border border-slate-205/50">
                    <Shield className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Bidang Trantib */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-205/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-10 space-y-4">
                  <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800 rounded-lg uppercase tracking-wider">
                    Pilar Kedua
                  </span>
                  <h4 className="text-xl font-extrabold text-foreground">Bidang Trantib</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Fokus pada penanganan operasional patroli berkala di wilayah rawan (seperti pusat kota dan kawasan pariwisata), serta eksekusi langsung di lapangan terhadap gangguan ketenteraman masyarakat.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">Penertiban Pedagang Kaki Lima (PKL)</li>
                    <li className="flex items-center gap-2">Penindakan Reklame Liar & Kedaluwarsa</li>
                    <li className="flex items-center gap-2">Plotting & Manajemen Regu Patroli Harian</li>
                  </ul>
                </div>
                <div className="lg:col-span-2 flex items-center justify-center">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#E8D8C4] border border-slate-205/50">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Bidang Perada */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-205/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-10 space-y-4">
                  <span className="inline-block px-3 py-1 bg-fuchsia-50 border border-fuchsia-200/60 text-[10px] font-black text-fuchsia-850 rounded-lg uppercase tracking-wider">
                    Pilar Ketiga
                  </span>
                  <h4 className="text-xl font-extrabold text-foreground">Bidang Perada</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Kamus hukum digital Satpol PP Buleleng. Bertanggung jawab atas pendaftaran regulasi resmi, rincian pasal pelanggaran, serta administrasi eksekusi penegakan Peraturan Daerah (Perda) dan BAP Yustisial.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">Master Data Regulasi (Perda & Perbup)</li>
                    <li className="flex items-center gap-2">Penindakan Yustisial / Sidang Tipiring</li>
                    <li className="flex items-center gap-2">Pelacakan Bukti Setor Kas Daerah (Denda)</li>
                  </ul>
                </div>
                <div className="lg:col-span-2 flex items-center justify-center">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#561C24] border border-[#C7B7A3]/30">
                    <Scale className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Bidang SDA */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-205/80 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-10 space-y-4">
                  <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200/60 text-[10px] font-black text-emerald-800 rounded-lg uppercase tracking-wider">
                    Pilar Keempat
                  </span>
                  <h4 className="text-xl font-extrabold text-foreground">Bidang SDA</h4>
                  <p className="text-sm text-slate-550 leading-relaxed font-medium">
                    Bertanggung jawab atas pembinaan kapasitas personel, peningkatan kedisiplinan, pelatihan taktis anggota Satpol PP dan Satlinmas, serta pengelolaan sarana dan prasarana penunjang tugas operasional di lapangan.
                  </p>
                  <ul className="text-[11px] sm:text-xs text-slate-500 font-semibold grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-205">
                    <li className="flex items-center gap-2">Pembinaan & Peningkatan Disiplin Anggota</li>
                    <li className="flex items-center gap-2">Pengelolaan Sarana Prasarana Operasional</li>
                    <li className="flex items-center gap-2">Pelatihan Taktis & Kesiapsiagaan Personel</li>
                  </ul>
                </div>
                <div className="lg:col-span-2 flex items-center justify-center">
                  {/* Molded Icon Frame */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-[#561C24] border border-[#C7B7A3]/30">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SPATIAL MAP SECTION */}
        <div
          ref={mapSectionRef}
          id="peta"
          className={`space-y-10 pt-12 border-t border-slate-205 scroll-mt-24 transition-all duration-1000 ease-out transform ${isMapVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#561C24]/5 border border-[#C7B7A3]/30 text-[10px] font-black text-[#561C24] rounded-lg uppercase tracking-wider">
              Peta Spasial Kerawanan & Pos
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Peta Informasi Ketertiban Buleleng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Wilayah rawan gangguan ketertiban umum serta plotting sebaran pos anggota Satlinmas di setiap Kecamatan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Map wrapper */}
            <div className="lg:col-span-8 space-y-3 relative">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Map className="w-3.5 h-3.5 text-slate-400" /> Peta Kabupaten Buleleng
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                  Peta Aktif
                </span>
              </div>
              <PublicMap
                reports={reports}
                trantibLogs={trantibLogs}
                linmasMembers={linmasMembers}
                peradaEnforcements={peradaEnforcements}
                selectedKecamatan={selectedKecamatan}
                setSelectedKecamatan={setSelectedKecamatan}
                hoveredKecamatan={hoveredKecamatan}
                setHoveredKecamatan={setHoveredKecamatan}
                bulelengMapData={BULELENG_MAP_DATA}
              />
            </div>

            {/* Sidebar Details Panel & Table */}
            <div className="lg:col-span-4 space-y-4">
              {/* Detail Wilayah */}
              <div className="bg-white border border-slate-205/80 rounded-2xl p-4 text-left shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                  <Info className="w-4 h-4 text-slate-500" />
                  <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                    Detail Statistik Wilayah
                  </h5>
                </div>

                {selectedKecamatan || hoveredKecamatan ? (() => {
                  const targetId = selectedKecamatan || hoveredKecamatan;
                  const kec = BULELENG_MAP_DATA.find(k => k.id === targetId);
                  const stats = getKecStats(kec?.name);
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-foreground uppercase tracking-tight">Kec. {kec?.name}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-lg border font-black uppercase tracking-wider ${kec?.rawan === 'Rawan Tinggi'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : kec?.rawan === 'Rawan Sedang'
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                          }`}>
                          {kec?.rawan}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                        {kec?.desc}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-left pt-1">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-sm">
                          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">Reklame/Baliho</div>
                          <div className="text-xs font-black text-foreground mt-1">{stats.reklame} Kasus</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-sm">
                          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">Penertiban PKL</div>
                          <div className="text-xs font-black text-foreground mt-1">{stats.pkl} Kasus</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-sm">
                          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">Satlinmas</div>
                          <div className="text-xs font-black text-blue-600 mt-1">{stats.satlinmas} Anggota</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-sm">
                          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">Penegakan Perda</div>
                          <div className="text-xs font-black text-[#561C24] mt-1">{stats.perada} Kasus</div>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="py-8 text-center text-slate-450 font-bold text-xs">
                    Klik atau arahkan kursor ke peta untuk melihat rincian statistik wilayah.
                  </div>
                )}
              </div>

              {/* Tabel Kecamatan */}
              <div className="bg-white border border-slate-205/80 rounded-2xl p-4 text-left shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                    Daftar Wilayah Kecamatan
                  </h5>
                </div>
                <div className="overflow-x-auto max-h-[220px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9px] font-black text-slate-450 uppercase tracking-wider">
                        <th className="pb-2">Kecamatan</th>
                        <th className="pb-2 text-center" title="Reklame/Baliho">Rek</th>
                        <th className="pb-2 text-center" title="PKL">PKL</th>
                        <th className="pb-2 text-center" title="Satlinmas">Lnm</th>
                        <th className="pb-2 text-right">Perda</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {BULELENG_MAP_DATA.map((kec) => {
                        const isHovered = hoveredKecamatan === kec.id;
                        const isSelected = selectedKecamatan === kec.id;
                        const stats = getKecStats(kec.name);
                        return (
                          <tr
                            key={kec.id}
                            className={`cursor-pointer hover:bg-slate-50/50 transition-colors ${isHovered || isSelected ? 'bg-slate-50/80 font-black text-[#561C24]' : ''
                              }`}
                            onMouseEnter={() => setHoveredKecamatan(kec.id)}
                            onMouseLeave={() => setHoveredKecamatan(null)}
                            onClick={() => {
                              if (selectedKecamatan === kec.id) {
                                setSelectedKecamatan(null);
                              } else {
                                setSelectedKecamatan(kec.id);
                              }
                            }}
                          >
                            <td className="px-2 py-2 font-extrabold border-r border-slate-100 text-[10px] truncate max-w-[80px]">Kec. {kec.name}</td>
                            <td className="px-1 py-2 border-r border-slate-100 text-center text-slate-600">{stats.reklame}</td>
                            <td className="px-1 py-2 border-r border-slate-100 text-center text-slate-600">{stats.pkl}</td>
                            <td className="px-1 py-2 border-r border-slate-100 text-center text-blue-600 font-extrabold">{stats.satlinmas}</td>
                            <td className="px-2 py-2 text-right font-black text-[#561C24]">{stats.perada}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PUSTAKA EDUKASI HUKUM SECTION (JDIH / BANK DATA) */}
        <div
          ref={pustakaRef}
          id="pustaka"
          className={`space-y-8 pt-12 border-t border-slate-205 scroll-mt-24 transition-all duration-1000 ease-out transform ${isPustakaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#561C24]/5 border border-[#C7B7A3]/30 text-[10px] font-black text-[#561C24] rounded-lg uppercase tracking-wider">
              Edukasi Hukum
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#561C24] tracking-tight">
              Pustaka Edukasi Hukum
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Akses publik regulasi resmi, Perda/Perkada Kabupaten Buleleng, Permendagri, dan standar operasional pelayanan Satpol PP secara langsung dan terbuka.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white border border-slate-205/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Cari regulasi, nomor, instansi, atau topik hukum..."
                value={pustakaSearch}
                onChange={(e) => setPustakaSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/30"
              />
            </div>
            <select
              value={pustakaFilter}
              onChange={(e) => setPustakaFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/30 cursor-pointer"
            >
              <option value="">Semua Jenis Aturan</option>
              <option value="UU">Undang-Undang / Peraturan Pemerintah</option>
              <option value="Permendagri">Permendagri / Peraturan Menteri</option>
              <option value="Perda">Perda / Perbup / Perkada</option>
              <option value="SK">Surat Keputusan (SK) / SOP</option>
            </select>
          </div>

          {/* Document list grid */}
          {filteredPustaka.length === 0 ? (
            <div className="bg-white border border-slate-205/80 rounded-2xl py-12 text-center text-slate-500 font-bold text-xs shadow-sm">
              Tidak ada dokumen pustaka edukasi hukum yang cocok dengan kriteria pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPustaka.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-205/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider rounded border border-slate-200 max-w-[180px] truncate">
                        {doc.jenis_aturan.split('/')[0].trim()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${doc.status_dokumen === 'Berlaku'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {doc.status_dokumen}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-foreground leading-snug line-clamp-2">
                      {doc.judul_dokumen}
                    </h4>

                    <div className="text-[10px] text-slate-500 font-semibold space-y-1">
                      <div>Nomor/Tahun: <span className="text-slate-700 font-bold">{doc.nomor_tahun_aturan}</span></div>
                      <div>Penerbit: <span className="text-slate-700 font-bold">{doc.instansi_penerbit}</span></div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold line-clamp-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      {doc.ringkasan_aturan}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                      Diunggah: {new Date(doc.waktu_upload).toLocaleDateString('id-ID')}
                    </span>
                    <button
                      onClick={() => downloadBase64Pdf(doc.berkas_pdf, `${doc.no_arsip}.pdf`)}
                      disabled={!doc.berkas_pdf}
                      className="px-3.5 py-1.5 bg-[#561C24] hover:bg-[#6D2932] disabled:bg-slate-200 disabled:text-slate-400 text-white text-[10px] font-extrabold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border-none"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

