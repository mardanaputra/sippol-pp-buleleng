'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Footer from '../../components/Footer';

const AdminMap = dynamic(() => import('./AdminMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 relative flex items-center justify-center min-h-[360px] shadow-inner">
      <div className="flex items-center gap-2 font-bold text-xs text-slate-500">
        <svg className="animate-spin h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Memuat Komponen Peta...</span>
      </div>
    </div>
  )
});

const PeradaDonutChart = dynamic(() => import('./PeradaDonutChart'), {
  ssr: false,
  loading: () => (
    <div className="w-44 h-44 rounded-full border-4 border-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-[10px] text-slate-400 font-bold">Memuat Grafik...</span>
    </div>
  )
});

const UrgencyDonutChart = dynamic(() => import('./UrgencyDonutChart'), {
  ssr: false,
  loading: () => (
    <div className="w-36 h-36 rounded-full border-4 border-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-[10px] text-slate-400 font-bold">Memuat...</span>
    </div>
  )
});
import {
  Shield,
  Trash2,
  ArrowRightCircle,
  Map,
  RefreshCw,
  Clipboard,
  FileText,
  Calendar,
  Clock,
  X,
  Check,
  AlertTriangle,
  UserCheck,
  MapPin,
  Image as ImageIcon,
  Scale,
  ChevronDown,
  Moon,
  Search,
  Filter,
  User,
  Info,
  Gavel,
  Coins,
  Radio,
  Download,
  Eye,
  ClipboardList
} from 'lucide-react';

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

const getReportLocation = (report) => {
  const kronologiLower = report.kronologi?.toLowerCase() || '';
  for (const kec of Object.keys(BULELENG_REGENCY)) {
    if (kronologiLower.includes(kec.toLowerCase())) {
      for (const desa of BULELENG_REGENCY[kec]) {
        if (kronologiLower.includes(desa.toLowerCase())) {
          return { kecamatan: kec, desa: desa };
        }
      }
      return { kecamatan: kec, desa: BULELENG_REGENCY[kec][0] };
    }
  }
  const ticketNum = parseInt(report.id_tiket?.replace(/\D/g, '') || '0') || 0;
  const kecs = Object.keys(BULELENG_REGENCY);
  const kec = kecs[ticketNum % kecs.length];
  const desas = BULELENG_REGENCY[kec];
  const desa = desas[ticketNum % desas.length];
  return { kecamatan: kec, desa: desa };
};

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [trantibLogs, setTrantibLogs] = useState([]);
  const [linmasMembers, setLinmasMembers] = useState([]);
  const [peradaEnforcements, setPeradaEnforcements] = useState([]);
  const [satpolKegiatanList, setSatpolKegiatanList] = useState([]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // View States
  const [currentSubTab, setCurrentSubTab] = useState('dashboard'); // 'dashboard' or 'disposisi'

  // Thematic Map States
  const [hoveredKecamatan, setHoveredKecamatan] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [mapTooltip, setMapTooltip] = useState({ show: false, x: 0, y: 0, data: null });

  // Filter States
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterDesa, setFilterDesa] = useState('');
  const [filteredDesasList, setFilteredDesasList] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Modal & Disposisi State
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'view'

  // Form inputs for Disposisi
  const [disposisiForm, setDisposisiForm] = useState({
    namaAdmin: '',
    bidangTujuan: '',
    kedaruratan: 'Sedang',
    catatan: '',
    waktuVerifikasi: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'info' | 'confirm', message: string, onConfirm?: () => void }

  const showAlert = (message, type = 'success') => {
    setNotification({ type, message });
  };

  const showConfirm = (message, onConfirm) => {
    setNotification({ type: 'confirm', message, onConfirm });
  };

  // Template Catatan Cepat
  const QUICK_TEMPLATES = [
    "Tim segera merapat ke lokasi, tertibkan pelanggaran and lakukan pembinaan.",
    "Lakukan patroli pengawasan intensif di wilayah tersebut untuk mencegah gangguan terulang.",
    "Koordinasikan dengan aparat desa/kelurahan setempat untuk penanganan terpadu.",
    "Harap segera tindak lanjuti and laporkan perkembangan lapangan hari ini juga."
  ];

  // Fungsi mengambil seluruh data database terupdate
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Pengaduan
      const res1 = await fetch('/api/pengaduan');
      const data1 = await res1.json();
      if (res1.ok) setReports(data1);

      // 2. Fetch Trantib K3
      const res2 = await fetch('/api/trantib/penertiban');
      const data2 = await res2.json();
      if (res2.ok) setTrantibLogs(data2);

      // 3. Fetch Linmas Satlinmas
      const res3 = await fetch('/api/linmas/satlinmas');
      const data3 = await res3.json();
      if (res3.ok) setLinmasMembers(data3);

      // 4. Fetch Perada Penegakan
      const res4 = await fetch('/api/perada/penegakan');
      const data4 = await res4.json();
      if (res4.ok) setPeradaEnforcements(data4);

      // 5. Fetch Satpol Kegiatan
      const res5 = await fetch('/api/admin/kegiatan');
      const data5 = await res5.json();
      if (res5.ok) setSatpolKegiatanList(data5);

    } catch (err) {
      console.error("Gagal memuat data database:", err);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch otomatis saat admin membuka halaman
  useEffect(() => {
    fetchAllData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'disposisi') {
        setCurrentSubTab('disposisi');
      } else {
        setCurrentSubTab('dashboard');
      }
    }
  }, []);

  // Sync state with back/forward history navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'disposisi') {
        setCurrentSubTab('disposisi');
      } else {
        setCurrentSubTab('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openMaps = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  // Handler Hapus Laporan (Spam)
  const handleDeleteReport = (id_tiket) => {
    showConfirm(
      `Apakah Anda yakin ingin menghapus secara permanen laporan dengan Tiket: ${id_tiket}?\n(Tindakan ini tidak dapat dibatalkan)`,
      async () => {
        try {
          const res = await fetch(`/api/pengaduan?id_tiket=${id_tiket}`, {
            method: 'DELETE',
          });
          const data = await res.json();

          if (res.ok) {
            showAlert(data.message || "Laporan berhasil dihapus.", 'success');
            fetchAllData(); // Refresh data
          } else {
            showAlert(data.error || "Gagal menghapus laporan.", 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert("Terjadi kesalahan jaringan saat menghapus laporan.", 'error');
        }
      }
    );
  };

  // Membuka modal buat disposisi baru
  const handleOpenCreateDisposisi = (report) => {
    setSelectedReport(report);
    setModalMode('create');
    setDisposisiForm({
      namaAdmin: '',
      bidangTujuan: '',
      kedaruratan: 'Sedang',
      catatan: '',
      waktuVerifikasi: new Date().toISOString(),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Membuka modal lihat detail disposisi
  const handleOpenViewDisposisi = (report) => {
    setSelectedReport(report);
    setModalMode('view');
    setIsModalOpen(true);
  };

  // Kirim Form Disposisi ke API
  const handleSubmitDisposisi = async (e) => {
    e.preventDefault();

    // Validasi
    const errors = {};
    if (!disposisiForm.namaAdmin) errors.namaAdmin = "Nama Admin Pemeriksa wajib dipilih.";
    if (!disposisiForm.bidangTujuan) errors.bidangTujuan = "Bidang Tujuan Penugasan wajib dipilih.";
    if (!disposisiForm.catatan.trim()) errors.catatan = "Catatan/Perintah tambahan wajib diisi.";
    else if (disposisiForm.catatan.trim().length < 10) errors.catatan = "Catatan minimal 10 karakter.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/disposisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_tiket: selectedReport.id_tiket,
          nama_admin: disposisiForm.namaAdmin,
          waktu_verifikasi: disposisiForm.waktuVerifikasi,
          bidang_tujuan: disposisiForm.bidangTujuan,
          kedaruratan: disposisiForm.kedaruratan,
          catatan: disposisiForm.catatan,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        showAlert("Disposisi resmi berhasil dikirim!", 'success');
        fetchAllData(); // Refresh data
      } else {
        showAlert(data.error || "Gagal menyimpan disposisi.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan jaringan.", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Logika Filter Laporan
  const handleKecamatanChange = (kec) => {
    setFilterKecamatan(kec);
    setFilterDesa('');
    if (kec && BULELENG_REGENCY[kec]) {
      setFilteredDesasList(BULELENG_REGENCY[kec]);
    } else {
      setFilteredDesasList([]);
    }
  };

  const handleSearchFilter = () => {
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    setFilterKecamatan('');
    setFilterDesa('');
    setFilteredDesasList([]);
    setIsFiltered(false);
  };

  const displayedReports = isFiltered
    ? reports.filter(report => {
      const loc = getReportLocation(report);
      const matchKec = !filterKecamatan || loc.kecamatan.toLowerCase() === filterKecamatan.toLowerCase();
      const matchDesa = !filterDesa || loc.desa.toLowerCase() === filterDesa.toLowerCase();
      return matchKec && matchDesa;
    })
    : reports;

  // --- DATA AGGREGATION FOR PREMIUM CHARTS ---
  // 1. Perada Aggregations
  const totalPerada = peradaEnforcements.length;
  const countSelesai = peradaEnforcements.filter(p => p.status_sidang === 'Kasus Selesai (Clear)').length;
  const countSidang = peradaEnforcements.filter(p => p.status_sidang === 'Proses Sidang Tipiring').length;
  const countPenyelidikan = peradaEnforcements.filter(p => p.status_sidang === 'Penyelidikan / Pemanggilan').length;

  const pctSelesai = totalPerada ? Math.round((countSelesai / totalPerada) * 100) : 0;
  const pctSidang = totalPerada ? Math.round((countSidang / totalPerada) * 100) : 0;
  const pctPenyelidikan = totalPerada ? 100 - pctSelesai - pctSidang : 0; // Ensure exactly 100%

  const totalDenda = peradaEnforcements.reduce((acc, curr) => acc + (curr.denda_dijatuhkan || 0), 0);
  const countTipiring = peradaEnforcements.filter(p => p.jenis_tindakan === 'Tipiring').length;
  const countYustisial = totalPerada - countTipiring;

  // 2. Trantib K3 Aggregations
  const totalTrantib = trantibLogs.length;
  const countPkl = trantibLogs.filter(l => l.jenis_pelanggaran?.includes('PKL') || l.jenis_pelanggaran?.includes('Zonasi')).length;
  const countReklame = trantibLogs.filter(l => l.jenis_pelanggaran?.includes('Reklame') || l.jenis_pelanggaran?.includes('Iklan')).length;
  const countParkir = trantibLogs.filter(l => l.jenis_pelanggaran?.includes('Parkir')).length;
  const countSampah = totalTrantib - countPkl - countReklame - countParkir;

  const actionsLisan = trantibLogs.filter(l => l.tindakan_diambil === 'Teguran Lisan').length;
  const actionsTertulis = trantibLogs.filter(l => l.tindakan_diambil?.includes('Tertulis') || l.tindakan_diambil?.includes('Surat')).length;
  const actionsSita = trantibLogs.filter(l => l.tindakan_diambil?.includes('Penyitaan') || l.tindakan_diambil?.includes('Sita')).length;

  // 3. Linmas Aggregations
  const totalPriaLinmas = linmasMembers.reduce((acc, curr) => acc + (curr.anggota_pria || 0), 0);
  const totalWanitaLinmas = linmasMembers.reduce((acc, curr) => acc + (curr.anggota_wanita || 0), 0);
  const totalLinmas = totalPriaLinmas + totalWanitaLinmas;

  const totalPosKamling = linmasMembers.reduce((acc, curr) => acc + (curr.jumlah_pos_kamling || 0), 0);
  const totalSenter = linmasMembers.reduce((acc, curr) => acc + (curr.jumlah_senter || 0), 0);
  const totalPentungan = linmasMembers.reduce((acc, curr) => acc + (curr.jumlah_pentungan || 0), 0);
  const totalHt = linmasMembers.reduce((acc, curr) => acc + (curr.jumlah_ht || 0), 0);

  // 4. Citizen Complaint Aggregations
  const totalComplaints = reports.length;
  const countLinmasC = reports.filter(r => r.kategori_masalah?.includes('Linmas') || r.bidang_disposisi?.includes('Linmas')).length;
  const countTrantibC = reports.filter(r => r.kategori_masalah?.includes('Trantib') || r.bidang_disposisi?.includes('Trantib') || r.kategori_masalah?.includes('K3')).length;
  const countPeradaC = reports.filter(r => r.kategori_masalah?.includes('Perada') || r.bidang_disposisi?.includes('Perada') || r.kategori_masalah?.includes('Perda')).length;
  const countSdaC = totalComplaints - countLinmasC - countTrantibC - countPeradaC;

  const countDarurat = reports.filter(r => r.disposisi?.kedaruratan === 'Darurat').length;
  const countSedang = reports.filter(r => r.disposisi?.kedaruratan === 'Sedang').length;
  const countRendah = reports.filter(r => r.disposisi?.kedaruratan === 'Rendah').length;

  const pctDarurat = totalComplaints ? Math.round((countDarurat / totalComplaints) * 100) : 0;
  const pctSedang = totalComplaints ? Math.round((countSedang / totalComplaints) * 100) : 0;
  const pctRendah = totalComplaints ? 100 - pctDarurat - pctSedang : 0;


  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 font-sans select-none relative overflow-x-hidden pt-[57px] flex flex-col justify-between">

      {/* 2. Horizontal Admin Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
              title="Kembali ke halaman utama warga"
            >
              Portal Warga
            </Link>

            <button
              onClick={() => {
                setCurrentSubTab('dashboard');
                window.history.pushState(null, '', '/admin/dashboard?tab=dashboard');
              }}
              className={`px-4 py-4 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all outline-none ${currentSubTab === 'dashboard'
                  ? 'text-[#561C24] bg-[#561C24]/5 border-b-2 border-[#561C24] font-black'
                  : 'text-slate-500 hover:text-[#561C24] hover:bg-slate-50 font-bold'
                }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setCurrentSubTab('disposisi');
                window.history.pushState(null, '', '/admin/dashboard?tab=disposisi');
              }}
              className={`px-4 py-4 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all outline-none ${currentSubTab === 'disposisi'
                  ? 'text-[#561C24] bg-[#561C24]/5 border-b-2 border-[#561C24] font-black'
                  : 'text-slate-500 hover:text-[#561C24] hover:bg-slate-50 font-bold'
                }`}
            >
              Disposisi
            </button>

            <Link
              href="/admin/trantib"
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Trantib
            </Link>

            <Link
              href="/admin/perada"
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Perada
            </Link>

            <Link
              href="/admin/linmas"
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Linmas
            </Link>

            <Link
              href="/admin/sda"
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal SDA
            </Link>

            <Link
              href="/admin/kegiatan"
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Kegiatan
            </Link>
          </div>

          <button
            onClick={fetchAllData}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer active:scale-95 my-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Database
          </button>
        </div>
      </nav>

      {/* 1. Header Banner Top Bar (Coffee Gradient Style) */}
      <div className="bg-gradient-to-r from-[#561C24] via-[#6D2932] to-[#80424a] text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Glowing Decorative Backgrounds */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[15%] w-36 h-36 bg-[#C7B7A3]/20 rounded-full blur-xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">

          {/* Sisi Kiri: Logo bulat SIP POLPP & Identitas */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#C7B7A3] p-1 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#561C24] to-[#6D2932] flex items-center justify-center text-white">
                <Shield className="w-8 h-8 text-[#E8D8C4] fill-[#E8D8C4]/15" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider leading-none text-white drop-shadow-md">
                SIP POLPP
              </h1>
              <p className="text-[10px] text-[#E8D8C4] font-bold uppercase tracking-widest mt-1.5">
                Sistem Informasi Pelayanan & Operasional Pol PP Kemendagri
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Night mode & Profil Admin Buleleng */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => showAlert("Fitur Mode Malam akan segera hadir!", 'info')}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/20 active:scale-95 cursor-pointer"
              title="Toggle Night Mode"
              type="button"
            >
              <Moon className="w-5 h-5 fill-white/10" />
            </button>

            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white/60 flex items-center justify-center text-slate-700 font-extrabold shadow-inner shrink-0">
                KB
              </div>
              <div className="text-left text-white leading-none">
                <h4 className="text-xs font-black tracking-wide">Kabupaten Buleleng</h4>
                <span className="text-[8px] bg-[#E8D8C4] text-[#561C24] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  Admin
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8 space-y-6 flex-1">

        {/* Page Title */}
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {currentSubTab === 'dashboard' ? 'Data Dashboard' : 'Data Disposisi'}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
            {currentSubTab === 'dashboard'
              ? 'Sistem Pemantauan Terintegrasi Kabupaten Buleleng'
              : 'Pengelolaan & Penugasan Laporan Pengaduan Resmi'}
          </p>
        </div>

        {/* 3. Data Dashboard Title & Filter Bar Card (Only shown in Disposisi view) */}
        {currentSubTab === 'disposisi' && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 text-left">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Filter className="w-4.5 h-4.5 text-[#561C24]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Filter Bar</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Dropdown Kecamatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kecamatan</label>
                <select
                  value={filterKecamatan}
                  onChange={(e) => handleKecamatanChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/20 cursor-pointer"
                >
                  <option value="">Semua Kecamatan</option>
                  {Object.keys(BULELENG_REGENCY).map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>

              {/* Dropdown Desa / Kelurahan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Desa / Kelurahan</label>
                <select
                  value={filterDesa}
                  onChange={(e) => setFilterDesa(e.target.value)}
                  disabled={!filterKecamatan}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">{filterKecamatan ? 'Semua Desa' : 'Pilih Kecamatan'}</option>
                  {filteredDesasList.map((desa) => (
                    <option key={desa} value={desa}>{desa}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Action Buttons under Filter Dropdowns */}
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={handleSearchFilter}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Search className="w-3.5 h-3.5" /> Search
              </button>

              <button
                onClick={handleResetFilter}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <X className="w-3.5 h-3.5" /> Hapus Pencarian
              </button>
            </div>
          </div>
        )}

        {/* 3.5. Multi-Chart Dashboard Analytics (Only shown in Dashboard view) */}
        {currentSubTab === 'dashboard' && (
          <div className="space-y-6">

            {/* Priority View: Pending Actions (Aduan Menunggu Aksi) */}
            <div className="space-y-0 text-left">
              <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                <div className="flex items-center gap-1.5">
                  Aduan Menunggu Aksi (Pending Actions)
                </div>
              </div>

              <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6">
                {reports.filter(r => r.status_laporan === 'Pending').length === 0 ? (
                  <div className="text-center py-6 text-slate-500 space-y-2 border border-dashed border-slate-200 rounded-xl">
                    <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="font-bold text-slate-600 text-xs">Semua aduan masuk telah terdisposisi dengan baik.</p>
                    <p className="text-[10px] text-slate-400">Tidak ada laporan warga yang berstatus Pending saat ini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {reports.filter(r => r.status_laporan === 'Pending').map((report) => {
                      const loc = getReportLocation(report);
                      return (
                        <div 
                          key={report.id_tiket} 
                          className="bg-white rounded-xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-amber-300 transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden group border-l-4 border-l-amber-500"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                                {report.id_tiket}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>
                                  {new Date(report.waktu_kirim).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                </span>
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-800 leading-snug group-hover:text-[#561C24] transition-colors duration-200 line-clamp-1">
                                {report.kategori_masalah}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                                {report.kronologi}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 w-fit font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-[#6D2932] shrink-0" /> 
                              <span className="truncate max-w-[150px]">{loc.kecamatan}, {loc.desa}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteReport(report.id_tiket)}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 hover:border-rose-200 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Spam</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenCreateDisposisi(report)}
                              className="flex-1 py-2 bg-[#561C24] hover:bg-[#6D2932] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer group/btn"
                            >
                              <span>Disposisi</span>
                              <ArrowRightCircle className="w-4 h-4 text-[#E8D8C4] group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Top Grid: Perada (Pie/Donut Chart) & Trantibum (Bar Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* CHART 1: Penegakan Perda (Perada) - Custom Donut */}
              <div className="space-y-0 text-left">
                <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                  <div className="flex items-center gap-1.5">
                    Kasus Hukum Perada (Prisma Data)
                  </div>
                </div>

                <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 flex flex-col justify-between gap-6 relative min-h-[380px]">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <PeradaDonutChart 
                      selesai={countSelesai} 
                      sidang={countSidang} 
                      penyelidikan={countPenyelidikan} 
                      total={totalPerada} 
                    />

                    {/* Legend & Summary Card */}
                    <div className="w-full space-y-3.5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-1.5">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Kasus Selesai
                          </span>
                          <span className="text-slate-800">{countSelesai} <span className="text-[10px] text-slate-400 font-semibold">({pctSelesai}%)</span></span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-1.5">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Sidang Tipiring
                          </span>
                          <span className="text-slate-800">{countSidang} <span className="text-[10px] text-slate-400 font-semibold">({pctSidang}%)</span></span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-1.5">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Penyelidikan
                          </span>
                          <span className="text-slate-800">{countPenyelidikan} <span className="text-[10px] text-slate-400 font-semibold">({pctPenyelidikan}%)</span></span>
                        </div>
                      </div>

                      {/* Total Fines collected card */}
                      <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-3 shadow-inner flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 text-[#d97706] flex items-center justify-center shrink-0">
                          <Coins className="w-4.5 h-4.5" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Denda Kas Daerah</p>
                          <p className="text-sm font-black text-[#d97706] leading-none mt-1">
                            Rp {totalDenda.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                    <span className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase select-none">
                      Tipiring: {countTipiring} | Yustisial: {countYustisial}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        showAlert("Data Penegakan Perda berhasil diunduh ke perangkat Anda!", 'success');
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('SIP POLPP Buleleng - Data Penegakan Perda Rekap');
                        link.download = 'Grafik_Penegakan_Perda_Buleleng.txt';
                        link.click();
                      }}
                      className="px-3.5 py-1.5 bg-[#212260] hover:bg-[#1b1c50] text-[#ffb800] text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-[#ffb800]/25"
                    >
                      Ekspor Data Log
                    </button>
                  </div>
                </div>
              </div>

              {/* CHART 2: Statistik Ketertiban & K3 (Trantibum) */}
              <div className="space-y-0 text-left">
                <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                  <div className="flex items-center gap-1.5">
                    Penertiban K3 (Trantibum)
                  </div>
                </div>

                <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 flex flex-col justify-between gap-6 relative min-h-[380px]">
                  <div className="space-y-3.5">

                    {/* Horizontal Bar Chart representation */}
                    <div className="space-y-3">
                      {[
                        { label: 'PKL Liar / Melanggar Zonasi', value: countPkl, max: Math.max(countPkl * 1.5, 10), color: 'bg-orange-500' },
                        { label: 'Reklame Liar / Kedaluwarsa', value: countReklame, max: Math.max(countReklame * 1.5, 10), color: 'bg-amber-500' },
                        { label: 'Parkir Liar / Bahu Jalan', value: countParkir, max: Math.max(countParkir * 1.5, 10), color: 'bg-yellow-500' },
                        { label: 'Pelanggaran Sampah & K3', value: countSampah, max: Math.max(countSampah * 1.5, 10), color: 'bg-red-500' },
                      ].map((item, idx) => {
                        const pct = Math.min((item.value / item.max) * 100, 100) || 5;
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-600">{item.label}</span>
                              <span className="text-slate-800">{item.value} <span className="text-[10px] text-slate-400 font-semibold">Kasus</span></span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                              <div className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dynamic Action widgets */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-2 text-center">
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Teguran Lisan</span>
                        <span className="text-base font-black text-blue-700 block mt-1">{actionsLisan}</span>
                      </div>
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2 text-center">
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Surat Peringatan</span>
                        <span className="text-base font-black text-amber-700 block mt-1">{actionsTertulis}</span>
                      </div>
                      <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2 text-center">
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Penyitaan BB</span>
                        <span className="text-base font-black text-rose-700 block mt-1">{actionsSita}</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                    <span className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase select-none">
                      Total Penertiban: {totalTrantib} Tindakan
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        showAlert("Data Penertiban K3 berhasil diunduh ke perangkat Anda!", 'success');
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('SIP POLPP Buleleng - Data Penertiban K3 Rekap');
                        link.download = 'Grafik_Penertiban_K3_Buleleng.txt';
                        link.click();
                      }}
                      className="px-3.5 py-1.5 bg-[#e67e22] hover:bg-[#d35400] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-orange-600/30"
                    >
                      Ekspor Laporan K3
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* THEMATIC MAP: Peta Tematik Tingkat Kerawanan & Perda Buleleng */}
            <div className="space-y-0 text-left animate-fadeIn">
              <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                <div className="flex items-center gap-1.5">
                  Visualisasi Peta Tematik Kerawanan & Perda Kabupaten Buleleng
                </div>
              </div>

              <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 md:p-8 flex flex-col gap-6 relative">

                {/* Visual Header / Subtitle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-tight">Peta Spasial Skala Kecamatan (Kabupaten Buleleng)</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Gunakan kursor (hover) atau klik wilayah kecamatan untuk melihat detail statistik</p>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-3.5 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-[10px] font-bold shadow-inner">
                    <span className="text-slate-500 uppercase tracking-widest text-[9px] font-black mr-1">Legenda:</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" /> Rawan Tinggi</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" /> Rawan Sedang</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" /> Aman</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                  {/* Left: Interactive Spatial Map Container */}
                  <div className="lg:col-span-8">
                    <AdminMap
                      reports={reports}
                      trantibLogs={trantibLogs}
                      selectedKecamatan={selectedKecamatan}
                      setSelectedKecamatan={setSelectedKecamatan}
                      hoveredKecamatan={hoveredKecamatan}
                      setHoveredKecamatan={setHoveredKecamatan}
                      bulelengMapData={BULELENG_MAP_DATA}
                    />
                  </div>

                  {/* Right: Table & Detail Pane */}
                  <div className="lg:col-span-4 space-y-4">

                    {/* Header Panel */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left shadow-sm">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                        <Info className="w-4 h-4 text-slate-500" />
                        <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Detail Statistik Wilayah</h5>
                      </div>

                      {/* Highlight Area */}
                      {selectedKecamatan || hoveredKecamatan ? (() => {
                        const targetId = selectedKecamatan || hoveredKecamatan;
                        const kec = BULELENG_MAP_DATA.find(k => k.id === targetId);
                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Kec. {kec.name}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-lg border font-black uppercase tracking-wider ${kec.rawan === 'Rawan Tinggi' ? 'bg-red-50 border-red-200 text-red-700' : kec.rawan === 'Rawan Sedang' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-blue-50 border-blue-200 text-blue-700'
                                }`}>
                                {kec.rawan}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                              {kec.desc}
                            </p>

                            <div className="bg-[#0B1E43] text-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-300">Jumlah Perda</span>
                              <span className="text-sm font-black text-[#E28A1C]">{kec.perkada} Perda</span>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="text-center py-6 text-slate-400 space-y-2 font-semibold">
                          <Map className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="text-xs">Pilih salah satu kecamatan pada peta untuk detail khusus</p>
                        </div>
                      )}
                    </div>

                    {/* Table View "Data Kabupaten/Kota di Provinsi Bali" khusus untuk kecamatan di Buleleng */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-left">
                      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                        Data Kabupaten/Kota di Provinsi Bali
                      </div>

                      <div className="max-h-[220px] overflow-y-auto">
                        <table className="w-full text-xs font-bold text-slate-600 text-left border-collapse">
                          <thead className="bg-slate-50 text-[9px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 border-r border-slate-200">Wilayah</th>
                              <th className="px-3 py-2 border-r border-slate-200">Status</th>
                              <th className="px-3 py-2 text-right">Jumlah Perda</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {BULELENG_MAP_DATA.map((kec) => {
                              const isHovered = hoveredKecamatan === kec.id;
                              const isSelected = selectedKecamatan === kec.id;
                              return (
                                <tr
                                  key={kec.id}
                                  className={`cursor-pointer hover:bg-slate-50 transition-colors ${isHovered || isSelected ? 'bg-slate-50/80 font-black text-[#0B1E43]' : ''
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
                                  <td className="px-3 py-2 font-extrabold border-r border-slate-100">Kec. {kec.name}</td>
                                  <td className="px-3 py-2 border-r border-slate-100">
                                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${kec.rawan === 'Rawan Tinggi' ? 'bg-red-500' : kec.rawan === 'Rawan Sedang' ? 'bg-orange-500' : 'bg-blue-500'
                                      }`} title={kec.rawan} />
                                  </td>
                                  <td className="px-3 py-2 text-right font-black text-[#0B1E43]">{kec.perkada}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Map Footer Analytics */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-2">
                  <span className="text-[9px] text-slate-400 font-bold tracking-wider italic select-none">
                    * Klik Wilayah atau Table Row untuk mengunci detail informasi di atas.
                  </span>
                  <div className="flex items-center gap-1 bg-[#fffbeb] px-3 py-1.5 rounded-lg border border-[#fef3c7] text-[10px] font-black text-[#d97706]">
                    <span>Total Perda Buleleng:</span>
                    <span>150 Dokumen</span>
                  </div>
                </div>

              </div>
            </div>

            {/* CHART 3: Sebaran Anggota Satlinmas Buleleng (Linmas) - Full Width Card */}
            <div className="space-y-0 text-left">
              <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                <div className="flex items-center gap-1.5">
                  Kekuatan & Perlengkapan Satlinmas Buleleng (Linmas)
                </div>
              </div>

              <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 md:p-8 flex flex-col gap-6 relative">

                {/* Intro summary boxes & Equipment Assets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Personnel Summary Widget */}
                  <div className="space-y-3 border-r border-slate-100 pr-6">
                    <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Status Kekuatan Personel</h5>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <UserCheck className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold block leading-none">Total Aktif</span>
                        <span className="text-lg font-black text-emerald-800 mt-1 inline-block leading-none">
                          {totalLinmas} <span className="text-[10px] text-slate-400 font-bold">Anggota</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 text-[10px] font-bold text-slate-600">
                      <span className="flex-1 text-center bg-blue-50 border border-blue-100 rounded-lg py-1">Pria: {totalPriaLinmas}</span>
                      <span className="flex-1 text-center bg-pink-50 border border-pink-100 rounded-lg py-1">Wanita: {totalWanitaLinmas}</span>
                    </div>
                  </div>

                  {/* Glassmorphic Equipment Assets Widget */}
                  <div className="md:col-span-2 space-y-3 text-left">
                    <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Inventaris & Sarpras Terdata</h5>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm">
                        <div className="text-slate-400 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                          <Map className="w-3.5 h-3.5 text-slate-400" /> Pos Kamling
                        </div>
                        <span className="text-base font-black text-slate-800 leading-none">{totalPosKamling} Unit</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm">
                        <div className="text-slate-400 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                          <Radio className="w-3.5 h-3.5 text-blue-500" /> Handy Talky
                        </div>
                        <span className="text-base font-black text-slate-800 leading-none">{totalHt} Unit</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm">
                        <div className="text-slate-400 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                          <Info className="w-3.5 h-3.5 text-amber-500" /> Senter LED
                        </div>
                        <span className="text-base font-black text-slate-800 leading-none">{totalSenter} Pcs</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm">
                        <div className="text-slate-400 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                          <Clipboard className="w-3.5 h-3.5 text-rose-500" /> Pentungan
                        </div>
                        <span className="text-base font-black text-slate-800 leading-none">{totalPentungan} Pcs</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-400 font-bold italic block leading-none pt-1">
                      * Data teragregasi otomatis berdasarkan registrasi sarana tiap pos satlinmas desa.
                    </p>
                  </div>

                </div>

                {/* Sub-districts List Progress Gauges */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">Peta Sebaran Force Satlinmas per Kecamatan</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                    {[
                      { kecamatan: 'Kec. Buleleng', pria: 120, wanita: 22, total: 142 },
                      { kecamatan: 'Kec. Banjar', pria: 100, wanita: 15, total: 115 },
                      { kecamatan: 'Kec. Seririt', pria: 85, wanita: 13, total: 98 },
                      { kecamatan: 'Kec. Sukasada', pria: 78, wanita: 10, total: 88 },
                      { kecamatan: 'Kec. Sawan', pria: 68, wanita: 8, total: 76 },
                      { kecamatan: 'Kec. Kubutambahan', pria: 58, wanita: 7, total: 65 },
                      { kecamatan: 'Kec. Busungbiu', pria: 49, wanita: 5, total: 54 },
                      { kecamatan: 'Kec. Gerokgak', pria: 42, wanita: 6, total: 48 },
                      { kecamatan: 'Kec. Tejakula', pria: 35, wanita: 5, total: 40 },
                    ].map((item, idx) => {
                      // Check for real database overrides
                      const realRecord = linmasMembers.filter(m => m.kecamatan?.toUpperCase() === item.kecamatan.replace('Kec. ', '').toUpperCase());
                      const totalPria = realRecord.reduce((acc, curr) => acc + (curr.anggota_pria || 0), 0) || item.pria;
                      const totalWanita = realRecord.reduce((acc, curr) => acc + (curr.anggota_wanita || 0), 0) || item.wanita;
                      const totalAnggota = totalPria + totalWanita;

                      const maxTotal = 150;
                      const pct = Math.min((totalAnggota / maxTotal) * 100, 100);

                      return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between gap-2.5">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.kecamatan}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-150 px-2 py-0.5 rounded">
                              {totalAnggota} Personel
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                              <span>Pria: {totalPria}</span>
                              <span>Wanita: {totalWanita}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Sync */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                  <span className="text-[9px] text-slate-400 font-bold tracking-wider italic select-none">
                    Data diambil dari Pendataan Terakhir Anggota Satlinmas Kabupaten Buleleng.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      showAlert("Data Sebaran Satlinmas Buleleng berhasil diunduh!", 'success');
                      const link = document.createElement('a');
                      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('SIP POLPP Buleleng - Data Satlinmas Force Sebaran');
                      link.download = 'Grafik_Satlinmas_Force_Buleleng.txt';
                      link.click();
                    }}
                    className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-600/30"
                  >
                    Download Sebaran
                  </button>
                </div>

              </div>
            </div>

            {/* CHART 4 (NEW): Analisis Kategori & Urgensi Pengaduan Warga */}
            <div className="space-y-0 text-left">
              <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                <div className="flex items-center gap-1.5">
                  Analisis Aspirasi & Pengaduan Warga
                </div>
              </div>

              <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 flex flex-col justify-between gap-6 relative min-h-[380px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                  {/* Left Column: Complaint Category Progress Pillars */}
                  <div className="space-y-3.5">
                    <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Distribusi Kasus per Bidang</h5>

                    <div className="space-y-2.5">
                      {[
                        { name: 'Ketertiban Umum (Trantibum)', count: countTrantibC, pct: Math.min((countTrantibC / totalComplaints) * 100, 100) || 5, color: 'bg-orange-500' },
                        { name: 'Perlindungan Masyarakat (Linmas)', count: countLinmasC, pct: Math.min((countLinmasC / totalComplaints) * 100, 100) || 5, color: 'bg-emerald-500' },
                        { name: 'Penegakan Hukum Perda (Perada)', count: countPeradaC, pct: Math.min((countPeradaC / totalComplaints) * 100, 100) || 5, color: 'bg-blue-600' },
                        { name: 'Sumber Daya Aparatur (SDA)', count: countSdaC, pct: Math.min((countSdaC / totalComplaints) * 100, 100) || 5, color: 'bg-purple-600' },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-600">{item.name}</span>
                            <span className="text-slate-800">{item.count} <span className="text-[10px] text-slate-400 font-semibold">Tiket</span></span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Urgency Circular Gauge */}
                  <div className="flex flex-col items-center border-l border-slate-100 pl-6 text-center space-y-4">
                    <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Rasio Kedaruratan Masuk</h5>

                    <UrgencyDonutChart
                      darurat={countDarurat}
                      sedang={countSedang}
                      rendah={countRendah}
                      total={totalComplaints}
                    />

                    <div className="w-full grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold text-slate-500">
                      <div className="bg-red-50 text-red-700 border border-red-100 py-1.5 rounded-lg">
                        <span className="block text-[8px] text-red-400 uppercase tracking-wider font-extrabold">Darurat</span>
                        {countDarurat} Tiket
                      </div>
                      <div className="bg-amber-50 text-amber-700 border border-amber-100 py-1.5 rounded-lg">
                        <span className="block text-[8px] text-amber-400 uppercase tracking-wider font-extrabold">Sedang</span>
                        {countSedang} Tiket
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 py-1.5 rounded-lg">
                        <span className="block text-[8px] text-emerald-400 uppercase tracking-wider font-extrabold">Rendah</span>
                        {countRendah} Tiket
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Sync */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                  <span className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase select-none">
                    Total Aspirasi Warga: {totalComplaints} Tiket
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      showAlert("Data Analisis Aduan Warga berhasil diunduh!", 'success');
                      const link = document.createElement('a');
                      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('SIP POLPP Buleleng - Data Aspirasi Pengaduan Rekap');
                      link.download = 'Grafik_Aduan_Warga_Buleleng.txt';
                      link.click();
                    }}
                    className="px-3.5 py-1.5 bg-[#8e2de2] hover:bg-[#7b23c9] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-purple-600"
                  >
                    Ekspor Data Analisis
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION: Riwayat Kegiatan & Jurnal Terpadu Satpol PP */}
            <div className="space-y-0 text-left">
              <div className="inline-block bg-[#561C24] text-white px-6 py-2.5 rounded-t-2xl text-xs font-black uppercase tracking-wider shadow-sm select-none border-b-2 border-[#C7B7A3]">
                <div className="flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-[#E8D8C4]" /> Jurnal & Kegiatan Terkini Satpol PP
                </div>
              </div>

              <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 flex flex-col justify-between gap-6 relative min-h-[300px]">
                {satpolKegiatanList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-2 border border-dashed border-slate-200 rounded-xl">
                    <Info className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-600 text-xs">Belum ada log kegiatan terpadu terdata.</p>
                    <p className="text-[10px] text-slate-400">Silakan input kegiatan baru melalui Portal Kegiatan.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Latest 6 activities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {satpolKegiatanList.slice(0, 6).map((k) => {
                        let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                        if (k.bidang === 'Trantibum') badgeColor = "bg-orange-50 border border-orange-200 text-orange-850";
                        else if (k.bidang === 'Perada') badgeColor = "bg-blue-50 border border-blue-200 text-blue-850";
                        else if (k.bidang === 'Linmas') badgeColor = "bg-emerald-50 border border-emerald-200 text-emerald-900";
                        else if (k.bidang === 'SDA') badgeColor = "bg-purple-50 border border-purple-200 text-purple-900";

                        return (
                          <div key={k.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex gap-4 transition-all hover:bg-slate-50 hover:border-slate-300">
                            {k.foto_bukti && (
                              <img
                                src={k.foto_bukti}
                                alt="Foto Jurnal"
                                onClick={() => { setZoomImageUrl(k.foto_bukti); setIsZoomModalOpen(true); }}
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0 cursor-zoom-in hover:scale-102 transition-all"
                              />
                            )}
                            <div className="flex-1 space-y-1.5 text-left">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[9px] font-mono font-black text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                                  {k.no_kegiatan}
                                </span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.2 rounded ${badgeColor}`}>
                                  {k.bidang}
                                </span>
                              </div>
                              <h4 className="text-xs font-black text-slate-800 leading-snug">{k.jenis_kegiatan}</h4>
                              <p className="text-[10px] text-slate-500 font-medium line-clamp-2 italic leading-relaxed">
                                "{k.uraian_kegiatan}"
                              </p>
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold pt-1 border-t border-slate-100/80">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {k.lokasi}</span>
                                <span>{new Date(k.tanggal_kegiatan).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Sync & Export */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                  <span className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase select-none">
                    Total Kegiatan Terlaksana: {satpolKegiatanList.length} Jurnal
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href="/admin/kegiatan"
                      className="px-3.5 py-1.5 bg-[#561C24] hover:bg-[#6D2932] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-[#C7B7A3]/30"
                    >
                      Buka Portal Kegiatan <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (satpolKegiatanList.length === 0) {
                          showAlert("Tidak ada data kegiatan untuk diekspor.", 'info');
                          return;
                        }
                        const headers = ["No. Jurnal", "Tanggal", "Bidang", "Jenis Kegiatan", "Lokasi", "Jumlah Personel", "Uraian Kegiatan"];
                        const rows = satpolKegiatanList.map(k => [
                          k.no_kegiatan,
                          new Date(k.tanggal_kegiatan).toLocaleString('id-ID'),
                          k.bidang,
                          k.jenis_kegiatan,
                          k.lokasi.replace(/"/g, '""'),
                          k.jumlah_personel,
                          k.uraian_kegiatan.replace(/\n/g, ' ').replace(/"/g, '""')
                        ]);

                        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
                          + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `Laporan_Jurnal_Kegiatan_Satpol_${new Date().toISOString().substring(0,10)}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-500/20"
                    >
                      Ekspor Laporan Kegiatan <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 4. Integrasi Data & Logika Tabel Pengaduan (Only shown in Disposisi view) */}
        {currentSubTab === 'disposisi' && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden text-left">

            {/* Header Tab Kontainer */}
            <div className="bg-[#561C24] text-white px-6 py-4 flex items-center gap-2 border-b-2 border-[#C7B7A3]">
              <h3 className="text-xs font-black uppercase tracking-wider">Data Penegakan Perda</h3>
            </div>

            <div className="p-6">

              {/* Filter Notice Banner if active */}
              {isFiltered && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 font-semibold">
                  <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p>
                      Filter Aktif: Kecamatan <strong>{filterKecamatan || 'Semua Kecamatan'}</strong>
                      {filterDesa && <>, Desa <strong>{filterDesa}</strong></>}
                    </p>
                    <p className="text-[10px] text-rose-650/80 mt-0.5">Menampilkan seluruh data pelaporan yang cocok dengan filter penugasan resmi.</p>
                  </div>
                </div>
              )}

              {/* List Table Data */}
              {loading ? (
                <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-[#561C24] animate-spin" />
                  <div className="text-sm font-semibold text-slate-500">Mengkoneksikan core database dev.db...</div>
                </div>
              ) : displayedReports.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2 border border-dashed border-slate-200 rounded-2xl">
                  <Clipboard className="w-12 h-12 text-slate-350 mx-auto" />
                  <p className="font-bold text-slate-600">Tidak ada data laporan ditemukan</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Database SQLite `dev.db` kosong atau filter tidak memiliki kecocokan data. Silakan isi form di halaman warga (/pengaduan) terlebih dahulu!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {displayedReports.map((report) => (
                    <div
                      key={report.id_tiket}
                      className="bg-white hover:bg-slate-50/40 rounded-2xl border border-slate-200/80 p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
                    >

                      {/* Kolom Kiri: Info Tiket & Pelapor */}
                      <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#561C24] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md select-text">
                              {report.id_tiket}
                            </span>
                            {report.status_laporan === "Pending" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 animate-pulse">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                                Disposisi
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-extrabold text-slate-800 leading-tight">{report.kategori_masalah}</h3>

                          <div className="space-y-1 text-xs text-slate-500 font-medium">
                            <p>Pelapor: <span className="font-extrabold text-slate-700">{report.nama_pelapor}</span></p>
                            <p>WhatsApp: <span className="font-extrabold text-slate-700">{report.nomor_whatsapp}</span></p>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold pt-2 border-t border-slate-100/80">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(report.waktu_kirim).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>

                      {/* Kolom Tengah: Deskripsi & Bukti Lampiran */}
                      <div className="flex flex-col justify-between space-y-4 md:px-2">
                        <div className="space-y-2">
                          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Kronologi Kejadian</span>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line select-text font-medium">
                            {report.kronologi}
                          </p>
                        </div>

                        {report.foto_bukti && (
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-[#561C24]" /> Foto Bukti Lampiran
                            </span>
                            <div
                              className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 relative group cursor-zoom-in shadow-sm shrink-0"
                              onClick={() => {
                                const imgWindow = window.open();
                                imgWindow.document.write(`<img src="${report.foto_bukti}" style="max-width: 100%; height: auto;" />`);
                              }}
                            >
                              <img src={report.foto_bukti} alt="Lampiran Bukti" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white transition-opacity font-bold">
                                Perbesar
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            onClick={() => openMaps(report.latitude, report.longitude)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-emerald-700 rounded-lg shadow-sm cursor-pointer transition-colors active:scale-[0.97]"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Buka Google Maps
                          </button>
                        </div>
                      </div>

                      {/* Kolom Kanan: Status & Aksi Disposisi */}
                      <div className="bg-slate-50/55 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between gap-4 shadow-inner">
                        <div className="space-y-2">
                          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Status Penanganan</span>

                          {report.status_laporan === "Pending" ? (
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                Menunggu Disposisi Tugas
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                                Laporan baru masuk. Silakan tinjau kronologi kejadian lalu teruskan ke bidang terkait.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Sudah Didisposisikan
                              </div>
                              <p className="text-[10px] text-red-900 font-bold uppercase tracking-wider mt-0.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded w-fit">
                                {report.bidang_disposisi}
                              </p>
                              {report.disposisi && (
                                <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                                  Oleh: <strong>{report.disposisi.nama_admin}</strong> | Urgensi: <span className={`font-bold ${report.disposisi.kedaruratan === 'Darurat' ? 'text-rose-600' : report.disposisi.kedaruratan === 'Sedang' ? 'text-amber-600' : 'text-emerald-650'}`}>{report.disposisi.kedaruratan}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2.5 border-t border-slate-200">
                          <button
                            onClick={() => handleDeleteReport(report.id_tiket)}
                            className="px-3 py-1.5 bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-xs rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-[0.97]"
                            title="Tolak / Hapus Laporan (Spam)"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Spam
                          </button>

                          {report.status_laporan === "Pending" ? (
                            <button
                              onClick={() => handleOpenCreateDisposisi(report)}
                              className="flex-1 py-1.5 bg-[#561C24] hover:bg-[#6D2932] text-white text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
                            >
                              Disposisikan <ArrowRightCircle className="w-3.5 h-3.5 text-[#E8D8C4]" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenViewDisposisi(report)}
                              className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#561C24] text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-[0.97]"
                            >
                              <FileText className="w-3.5 h-3.5" /> Lembar Tugas
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      <Footer />

      {/* DISPOSISI MODAL OVERLAY */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto select-none transition-all duration-300">

          {/* Modal Container */}
          <div className="bg-white border border-slate-100 rounded-2xl max-w-xl w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] relative z-10 transition-all duration-300 overflow-hidden font-sans text-left">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#561C24] via-[#6D2932] to-[#80424a] text-white px-6 py-5 flex justify-between items-center shrink-0 border-b border-[#C7B7A3]/20 relative">
              {/* Glowing Decorative Backgrounds */}
              <div className="absolute top-[-50px] right-[-50px] w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
              
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <Shield className="w-4 h-4 text-[#E8D8C4] fill-[#E8D8C4]/10" />
                </div>
                <div>
                  <span className="text-sm font-extrabold tracking-wider uppercase text-white block leading-tight">
                    {modalMode === 'create' ? "Formulir Disposisi Tugas Resmi" : "Lembar Disposisi Tugas Sah"}
                  </span>
                  <p className="text-[9px] text-[#E8D8C4] font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 text-white/85 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDisposisi}>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

                {/* 1. Nomor Urut Tugas & Nomor Tiket */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      1. Nomor Urut Tugas
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={modalMode === 'create' ? "No. [Otomatis System]" : `No. ${String(selectedReport.disposisi?.no_urut || '').padStart(4, '0')}`}
                      className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* 2. Nomor Tiket Aduan */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      2. Nomor Tiket Aduan
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedReport.id_tiket}
                      className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono font-bold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* 3. Nama Admin Pemeriksa */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    3. Nama Admin Pemeriksa <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === 'create' ? (
                    <>
                      <select
                        value={disposisiForm.namaAdmin}
                        onChange={(e) => {
                          setDisposisiForm(prev => ({ ...prev, namaAdmin: e.target.value }));
                          if (formErrors.namaAdmin) setFormErrors(prev => ({ ...prev, namaAdmin: null }));
                        }}
                        className={`w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none border transition-all cursor-pointer focus:bg-white focus:border-[#561C24] focus:ring-4 focus:ring-[#561C24]/10 ${
                          formErrors.namaAdmin ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-slate-200'
                        }`}
                      >
                        <option value="" disabled>-- Pilih Nama Admin --</option>
                        <option value="Putu Wijaya">Putu Wijaya (Admin Utama)</option>
                        <option value="Made Sentana">Made Sentana (Verifikator)</option>
                        <option value="Ketut Lestari">Ketut Lestari (Staf Penindakan)</option>
                        <option value="Nyoman Sudarma">Nyoman Sudarma (Sekretaris)</option>
                      </select>
                      {formErrors.namaAdmin && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.namaAdmin}
                        </p>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value={selectedReport.disposisi?.nama_admin || ''}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none cursor-not-allowed font-semibold"
                    />
                  )}
                </div>

                {/* 4. Waktu Verifikasi */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    4. Waktu Verifikasi
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={new Date(modalMode === 'create' ? disposisiForm.waktuVerifikasi : (selectedReport.disposisi?.waktu_verifikasi || new Date())).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 outline-none cursor-not-allowed font-bold"
                  />
                </div>

                {/* 5. Diteruskan ke Bidang */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    5. Diteruskan ke Bidang <span className="text-rose-500">*</span>
                  </label>

                  {modalMode === 'create' ? (
                    <>
                      <div className="flex flex-col gap-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
                        {[
                          { id: "Bidang Linmas", label: "Bidang Perlindungan Masyarakat (Linmas)" },
                          { id: "Bidang Trantib", label: "Bidang Ketertiban Umum & K3 (Trantib)" },
                          { id: "Bidang Perada", label: "Bidang Penegakan Peraturan Daerah (Perada)" },
                          { id: "Bidang SDA", label: "Bidang Pengembangan Sumber Daya Aparatur (SDA)" },
                        ].map((bidang) => (
                          <label
                            key={bidang.id}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                              disposisiForm.bidangTujuan === bidang.id
                                ? 'bg-white border-[#561C24] text-[#561C24] shadow-sm ring-1 ring-[#561C24]/10 font-bold scale-[1.01]'
                                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="bidangTujuan"
                              value={bidang.id}
                              checked={disposisiForm.bidangTujuan === bidang.id}
                              onChange={() => {
                                setDisposisiForm(prev => ({ ...prev, bidangTujuan: bidang.id }));
                                if (formErrors.bidangTujuan) setFormErrors(prev => ({ ...prev, bidangTujuan: null }));
                              }}
                              className="w-4.5 h-4.5 text-[#561C24] border-slate-300 focus:ring-[#561C24] accent-[#561C24] cursor-pointer"
                            />
                            <span className="text-xs">
                              {bidang.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {formErrors.bidangTujuan && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.bidangTujuan}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-[#561C24] w-fit">
                      {selectedReport.disposisi?.bidang_tujuan}
                    </div>
                  )}
                </div>

                {/* 6. Tingkat Kedaruratan */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    6. Tingkat Kedaruratan
                  </label>

                  {modalMode === 'create' ? (
                    <div className="flex gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
                      {[
                        { id: "Rendah", label: "Rendah", colorClass: "text-emerald-700 bg-emerald-50 border-emerald-100", activeClass: "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/10 scale-[1.02] shadow-sm font-bold" },
                        { id: "Sedang", label: "Sedang", colorClass: "text-amber-700 bg-amber-50 border-amber-100", activeClass: "border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/10 scale-[1.02] shadow-sm font-bold" },
                        { id: "Darurat", label: "Darurat", colorClass: "text-rose-700 bg-rose-50 border-rose-100", activeClass: "border-rose-500 bg-rose-50/70 ring-1 ring-rose-500/10 scale-[1.02] shadow-sm font-bold" },
                      ].map((level) => {
                        const isSelected = disposisiForm.kedaruratan === level.id;
                        return (
                          <label
                            key={level.id}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                              isSelected ? level.activeClass : 'bg-white border-slate-200 hover:border-slate-350 bg-white/60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="kedaruratan"
                              value={level.id}
                              checked={isSelected}
                              onChange={() => setDisposisiForm(prev => ({ ...prev, kedaruratan: level.id }))}
                              className="w-4 h-4 text-[#561C24] border-slate-300 focus:ring-[#561C24] accent-[#561C24] cursor-pointer"
                            />
                            <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${level.colorClass}`}>
                              {level.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`w-fit px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                      selectedReport.disposisi?.kedaruratan === 'Darurat'
                        ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-rose-100/50'
                        : selectedReport.disposisi?.kedaruratan === 'Sedang'
                          ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100/50'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100/50'
                    }`}>
                      Urgensi: {selectedReport.disposisi?.kedaruratan}
                    </div>
                  )}
                </div>

                {/* 7. Catatan/Perintah Tambahan */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    7. Catatan / Arahan Tambahan <span className="text-rose-500">*</span>
                  </label>

                  {modalMode === 'create' ? (
                    <>
                      <textarea
                        rows="3"
                        placeholder="Berikan instruksi operasional penanganan berkas pengaduan untuk tim bidang..."
                        value={disposisiForm.catatan}
                        onChange={(e) => {
                          setDisposisiForm(prev => ({ ...prev, catatan: e.target.value }));
                          if (formErrors.catatan) setFormErrors(prev => ({ ...prev, catatan: null }));
                        }}
                        className={`w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none border transition-all resize-y focus:bg-white focus:border-[#561C24] focus:ring-4 focus:ring-[#561C24]/10 ${
                          formErrors.catatan ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-slate-200'
                        }`}
                      />

                      {/* Arahan Cepat */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 font-extrabold block">Klik Arahan Cepat:</span>
                        <div className="flex flex-wrap gap-2">
                          {QUICK_TEMPLATES.map((tmpl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setDisposisiForm(prev => ({ ...prev, catatan: tmpl }));
                                if (formErrors.catatan) setFormErrors(prev => ({ ...prev, catatan: null }));
                              }}
                              className="text-[10px] bg-slate-50 hover:bg-[#561C24]/5 border border-slate-200 hover:border-[#561C24]/30 text-slate-600 hover:text-[#561C24] px-2.5 py-1.5 rounded-lg text-left transition-all truncate max-w-full cursor-pointer font-bold active:scale-[0.97]"
                              title={tmpl}
                            >
                              Template {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formErrors.catatan && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.catatan}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-600 italic leading-relaxed border-l-4 border-l-[#561C24] select-text font-medium">
                      "{selectedReport.disposisi?.catatan}"
                    </div>
                  )}
                </div>

                {/* 8. Waktu Tugas Dikirim */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    8. Waktu Tugas Dikirim
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={modalMode === 'create' ? "Otomatis tercatat saat tugas dikirim" : new Date(selectedReport.disposisi?.waktu_dikirim || new Date()).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-450 outline-none cursor-not-allowed font-bold"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer active:scale-[0.97]"
                >
                  {modalMode === 'create' ? "Batal" : "Tutup Lembar"}
                </button>

                {modalMode === 'create' && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-gradient-to-r from-[#561C24] to-[#6D2932] hover:from-[#6D2932] hover:to-[#80424a] text-white rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-[0.97] shadow-md shadow-[#561C24]/10 hover:shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Mengirim Tugas...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Tugas</span>
                        <ArrowRightCircle className="w-4 h-4 text-[#E8D8C4]" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          </div>

        </div>
      )}

      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-800">
            <img 
              src={zoomImageUrl} 
              alt="Foto Zoom" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl" 
            />
            <button 
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/85 rounded-full text-white shadow-md transition-colors cursor-pointer"
              title="Close Image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM NOTIFICATION MODAL OVERLAY */}
      {notification && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className={`bg-white border border-slate-100 rounded-2xl max-w-sm w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden font-sans p-6 text-center space-y-4 border-t-4 ${
            notification.type === 'success' ? 'border-t-emerald-500' :
            notification.type === 'error' ? 'border-t-rose-500' :
            notification.type === 'info' ? 'border-t-blue-500' :
            'border-t-amber-500'
          }`}>
            <div className="flex justify-center">
              {notification.type === 'success' && (
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Check className="w-7 h-7" />
                </div>
              )}
              {notification.type === 'error' && (
                <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              )}
              {notification.type === 'info' && (
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Info className="w-7 h-7" />
                </div>
              )}
              {notification.type === 'confirm' && (
                <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                {notification.type === 'confirm' ? 'Konfirmasi Tindakan' : 'Informasi Sistem'}
              </h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed whitespace-pre-line">
                {notification.message}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              {notification.type === 'confirm' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setNotification(null)}
                    className="flex-1 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const callback = notification.onConfirm;
                      setNotification(null);
                      if (callback) callback();
                    }}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow"
                  >
                    Hapus
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="w-full py-2 bg-[#561C24] hover:bg-[#6D2932] text-white rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}