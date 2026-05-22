'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Info
} from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [trantibLogs, setTrantibLogs] = useState([]);
  const [linmasMembers, setLinmasMembers] = useState([]);
  const [peradaEnforcements, setPeradaEnforcements] = useState([]);
  const [loading, setLoading] = useState(true);

  // View States
  const [currentSubTab, setCurrentSubTab] = useState('dashboard'); // 'dashboard' or 'disposisi'

  // Filter States
  const [filterProvinsi, setFilterProvinsi] = useState('BALI');
  const [filterKabupaten, setFilterKabupaten] = useState('BULELENG');
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
  const handleDeleteReport = async (id_tiket) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus secara permanen laporan dengan Tiket: ${id_tiket}?\n(Tindakan ini tidak dapat dibatalkan)`)) return;
    
    try {
      const res = await fetch(`/api/pengaduan?id_tiket=${id_tiket}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message || "Laporan berhasil dihapus.");
        fetchReports(); // Refresh data
      } else {
        alert(data.error || "Gagal menghapus laporan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan saat menghapus laporan.");
    }
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
        alert("Disposisi resmi berhasil dikirim!");
        setIsModalOpen(false);
        fetchReports(); // Refresh data
      } else {
        alert(data.error || "Gagal menyimpan disposisi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // Logika Filter Laporan
  const handleSearchFilter = () => {
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    setFilterProvinsi('BALI');
    setFilterKabupaten('BULELENG');
    setIsFiltered(false);
  };

  const displayedReports = isFiltered 
    ? reports.filter(() => filterProvinsi === 'BALI' && filterKabupaten === 'BULELENG') 
    : reports;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12 select-none relative overflow-x-hidden">
      
      {/* 1. Header Banner Top Bar (Kemendagri Gradient Style) */}
      <div className="bg-gradient-to-r from-[#212260] via-[#522a98] via-[#8e2de2] to-[#ec008c] text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Glowing Decorative Backgrounds */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[15%] w-36 h-36 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          
          {/* Sisi Kiri: Logo bulat SIP POLPP & Identitas */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#ffb800] p-1 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white">
                <Shield className="w-8 h-8 text-[#ffb800] fill-[#ffb800]/10" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider leading-none text-white drop-shadow-md">
                SIP POLPP
              </h1>
              <p className="text-[10px] text-yellow-350 font-bold uppercase tracking-widest mt-1.5">
                Sistem Informasi Pelayanan & Operasional Pol PP Kemendagri
              </p>
            </div>
          </div>
          
          {/* Sisi Kanan: Night mode & Profil Admin Buleleng */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => alert("Fitur Mode Malam akan segera hadir!")}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/20 active:scale-95 cursor-pointer"
              title="Toggle Night Mode"
            >
              <Moon className="w-5 h-5 fill-white/10" />
            </button>
            
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white/60 flex items-center justify-center text-slate-700 font-extrabold shadow-inner shrink-0">
                KB
              </div>
              <div className="text-left text-white leading-none">
                <h4 className="text-xs font-black tracking-wide">Kabupaten Buleleng</h4>
                <span className="text-[8px] bg-yellow-450 text-[#0B1E43] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  Admin
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* 2. Horizontal Admin Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#212260] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
              title="Kembali ke halaman utama warga"
            >
              Portal Warga
            </Link>
            
            <button 
              onClick={() => {
                setCurrentSubTab('dashboard');
                window.history.pushState(null, '', '/admin/dashboard?tab=dashboard');
              }}
              className={`px-4 py-4 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all outline-none ${
                currentSubTab === 'dashboard'
                  ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600 font-black'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-bold'
              }`}
            >
              Dashboard
            </button>
            
            <button 
              onClick={() => {
                setCurrentSubTab('disposisi');
                window.history.pushState(null, '', '/admin/dashboard?tab=disposisi');
              }}
              className={`px-4 py-4 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all outline-none ${
                currentSubTab === 'disposisi'
                  ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600 font-black'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-bold'
              }`}
            >
              Disposisi
            </button>
            
            <Link 
              href="/admin/trantib" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Trantib
            </Link>

            <Link 
              href="/admin/perada" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Perada
            </Link>

            <Link 
              href="/admin/linmas" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Linmas
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

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
        
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
              <Filter className="w-4.5 h-4.5 text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Filter Bar</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dropdown Provinsi */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Provinsi</label>
                <select
                  value={filterProvinsi}
                  onChange={(e) => setFilterProvinsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 cursor-pointer"
                >
                  <option value="BALI">BALI</option>
                  <option value="JAWA TIMUR">JAWA TIMUR</option>
                  <option value="JAWA BARAT">JAWA BARAT</option>
                  <option value="DKI JAKARTA">DKI JAKARTA</option>
                </select>
              </div>

              {/* Dropdown Kabupaten / Kota */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kabupaten / Kota</label>
                <select
                  value={filterKabupaten}
                  onChange={(e) => setFilterKabupaten(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 cursor-pointer"
                >
                  <option value="BULELENG">BULELENG</option>
                  <option value="BADUNG">BADUNG</option>
                  <option value="GIANYAR">GIANYAR</option>
                  <option value="DENPASAR">DENPASAR</option>
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
            
            {/* Top Grid: Perada (Pie Chart) & Trantibum (Bar Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* CHART 1: Penegakan Perda (Perada) */}
              <div className="space-y-0 text-left">
                <div className="inline-block bg-[#3498db] text-white px-6 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider shadow-sm select-none">
                  Data Penegakan Perda (Perada)
                </div>
                
                <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 flex flex-col justify-between gap-6 relative min-h-[350px]">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    {/* SVG Pie Chart */}
                    <div className="relative w-40 h-40 flex items-center justify-center filter drop-shadow-sm shrink-0 transition-transform hover:scale-105 duration-300">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="4.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600 transition-all duration-1000 ease-out"
                          strokeDasharray="100, 100"
                          strokeWidth="7"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col leading-none select-none">
                        <span className="text-xl font-black text-slate-800">100%</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">Buleleng</span>
                      </div>
                    </div>

                    {/* Stats Table */}
                    <div className="w-full space-y-4">
                      <div className="border border-slate-150 rounded-xl overflow-hidden shadow-inner bg-slate-50 p-3">
                        <h4 className="text-[9px] font-black text-slate-450 uppercase tracking-widest mb-2">Kasus Perda Aktif</h4>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-extrabold text-slate-600">Kabupaten Buleleng</span>
                          <span className="text-xl font-black text-blue-700">{displayedReports.length} <span className="text-xs font-bold text-slate-400">Kasus</span></span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      
                      <div className="text-[9px] text-slate-400 font-bold tracking-wide italic leading-normal">
                        Menampilkan seluruh laporan penegakan perda yang masuk ke sistem pusat SIP POLPP Buleleng.
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider select-none">
                      Last Sync: 2026-05-22
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        alert("Grafik Data Penegakan Perda berhasil diunduh ke perangkat Anda!");
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('SIP POLPP Buleleng - Data Penegakan Perda Rekap');
                        link.download = 'Grafik_Penegakan_Perda_Buleleng.txt';
                        link.click();
                      }}
                      className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-600/30"
                    >
                      Download Grafik
                    </button>
                  </div>
                </div>
              </div>

              {/* CHART 2: Statistik Ketertiban & K3 (Trantibum) */}
              <div className="space-y-0 text-left">
                <div className="inline-block bg-[#e67e22] text-white px-6 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider shadow-sm select-none">
                  Data Penertiban K3 (Trantibum)
                </div>
                
                <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 flex flex-col justify-between gap-6 relative min-h-[350px]">
                  <div className="space-y-4">
                    {/* Horizontal Bar Chart representation */}
                    <div className="space-y-3">
                      {[
                        { label: 'PKL Liar / Trotoar', value: trantibLogs.filter(l => l.jenis_pelanggaran?.includes('PKL') || l.jenis_pelanggaran?.includes('Trotoar')).length || 12, max: 20, color: 'bg-orange-500' },
                        { label: 'Reklame / Iklan Ilegal', value: trantibLogs.filter(l => l.jenis_pelanggaran?.includes('Reklame') || l.jenis_pelanggaran?.includes('Iklan')).length || 8, max: 20, color: 'bg-amber-500' },
                        { label: 'Parkir Sembarangan', value: trantibLogs.filter(l => l.jenis_pelanggaran?.includes('Parkir')).length || 5, max: 20, color: 'bg-yellow-500' },
                        { label: 'Sampah Liar / K3', value: trantibLogs.filter(l => l.jenis_pelanggaran?.includes('Sampah') || l.jenis_pelanggaran?.includes('K3')).length || 3, max: 20, color: 'bg-red-500' },
                      ].map((item, idx) => {
                        const pct = Math.min((item.value / item.max) * 100, 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-650">{item.label}</span>
                              <span className="text-slate-800">{item.value} <span className="text-[10px] text-slate-400 font-semibold">Kasus</span></span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-150">
                              <div className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider select-none">
                      Total Penertiban K3: {trantibLogs.length || 28} Kasus
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        alert("Data Penertiban K3 berhasil diunduh ke perangkat Anda!");
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('SIP POLPP Buleleng - Data Penertiban K3 Rekap');
                        link.download = 'Grafik_Penertiban_K3_Buleleng.txt';
                        link.click();
                      }}
                      className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-600/30"
                    >
                      Download Grafik
                    </button>
                  </div>
                </div>
              </div>
              
            </div>

            {/* CHART 3: Sebaran Anggota Satlinmas Buleleng (Linmas) - Full Width Card */}
            <div className="space-y-0 text-left">
              <div className="inline-block bg-[#2ecc71] text-white px-6 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider shadow-sm select-none">
                Data Kekuatan Personel Satlinmas (Linmas)
              </div>
              
              <div className="bg-white rounded-r-2xl rounded-b-2xl rounded-tl-none border border-slate-200 shadow-md p-6 md:p-8 flex flex-col gap-6 relative">
                
                {/* Intro summary boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#eefcf2] border border-[#a3e4b8] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] text-slate-500 font-black uppercase tracking-wider leading-none">Total Personel</h5>
                      <span className="text-xl font-black text-emerald-800 leading-none mt-1 inline-block">
                        {linmasMembers.reduce((acc, curr) => acc + (curr.anggota_pria || 0) + (curr.anggota_wanita || 0), 0) || 780} <span className="text-[10px] text-slate-400 font-bold">Anggota</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] text-slate-500 font-black uppercase tracking-wider leading-none">Anggota Pria</h5>
                      <span className="text-xl font-black text-blue-800 leading-none mt-1 inline-block">
                        {linmasMembers.reduce((acc, curr) => acc + (curr.anggota_pria || 0), 0) || 665} <span className="text-[10px] text-slate-400 font-bold">Pria</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] text-slate-500 font-black uppercase tracking-wider leading-none">Anggota Wanita</h5>
                      <span className="text-xl font-black text-pink-850 leading-none mt-1 inline-block">
                        {linmasMembers.reduce((acc, curr) => acc + (curr.anggota_wanita || 0), 0) || 115} <span className="text-[10px] text-slate-400 font-bold">Wanita</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-districts List Progress Gauges */}
                <div className="border border-slate-150 rounded-2xl p-6 bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">Peta Sebaran Force Satlinmas per Kecamatan</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.kecamatan}</span>
                            <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-150 px-2 py-0.5 rounded">
                              {totalAnggota} Aktif
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-150">
                              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-450 font-bold">
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
                <div className="flex justify-between items-center border-t border-slate-150 pt-4">
                  <span className="text-[9px] text-slate-400 font-bold tracking-wider italic select-none">
                    Data diambil dari Pendataan Terakhir Anggota Satlinmas Kabupaten Buleleng.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Data Sebaran Satlinmas Buleleng berhasil diunduh!");
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

          </div>
        )}

        {/* 4. Integrasi Data & Logika Tabel Pengaduan (Only shown in Disposisi view) */}
        {currentSubTab === 'disposisi' && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden text-left">
            
            {/* Header Tab Kontainer */}
            <div className="bg-[#1d4ed8] text-white px-6 py-4 flex items-center gap-2 border-b border-blue-800">
              <Scale className="w-5 h-5 text-[#ffb800]" />
              <h3 className="text-xs font-black uppercase tracking-wider">Data Penegakan Perda</h3>
            </div>

            <div className="p-6">
              
              {/* Filter Notice Banner if active */}
              {isFiltered && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2.5 font-semibold">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p>Filter Aktif: Provinsi <strong>BALI</strong>, Kabupaten / Kota <strong>BULELENG</strong></p>
                    <p className="text-[10px] text-blue-600/80 mt-0.5">Menampilkan seluruh data pelaporan yang cocok dengan filter penugasan resmi.</p>
                  </div>
                </div>
              )}

              {/* List Table Data */}
              {loading ? (
                <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
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
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 hover:border-slate-300 transition-all hover:bg-slate-50/70"
                    >
                      
                      {/* Kolom Kiri: Info Tiket & Pelapor */}
                      <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded select-text">
                              {report.id_tiket}
                            </span>
                            {report.status_laporan === "Pending" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-700">
                                Disposisi
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-base font-extrabold text-slate-800 leading-tight">{report.kategori_masalah}</h3>
                          
                          <div className="space-y-1 text-xs text-slate-500 font-medium">
                            <p>Pelapor: <span className="font-extrabold text-slate-700">{report.nama_pelapor}</span></p>
                            <p>WhatsApp: <span className="font-extrabold text-slate-750">{report.nomor_whatsapp}</span></p>
                          </div>
                        </div>
                        
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold pt-2 border-t border-slate-100/80">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(report.waktu_kirim).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>

                      {/* Kolom Tengah: Deskripsi & Bukti Lampiran */}
                      <div className="flex flex-col justify-between space-y-4 md:px-2">
                        <div className="space-y-2">
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Kronologi Kejadian</span>
                          <p className="text-xs text-slate-650 italic leading-relaxed whitespace-pre-line select-text font-medium">
                            "{report.kronologi}"
                          </p>
                        </div>
                        
                        {report.foto_bukti && (
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Foto Bukti Lampiran
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-emerald-600 rounded-lg shadow-sm cursor-pointer transition-colors active:scale-[0.97]"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Buka Google Maps
                          </button>
                        </div>
                      </div>

                      {/* Kolom Kanan: Status & Aksi Disposisi */}
                      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between gap-4 shadow-sm">
                        <div className="space-y-2">
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Status Penanganan</span>
                          
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
                              <p className="text-[10px] text-blue-900 font-black uppercase tracking-wider mt-0.5 bg-blue-50 border border-blue-150 px-2 py-0.5 rounded w-fit">
                                {report.bidang_disposisi}
                              </p>
                              {report.disposisi && (
                                <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                                  Oleh: <strong>{report.disposisi.nama_admin}</strong> | Urgensi: <span className={`font-bold ${report.disposisi.kedaruratan === 'Darurat' ? 'text-rose-600' : report.disposisi.kedaruratan === 'Sedang' ? 'text-amber-600' : 'text-emerald-600'}`}>{report.disposisi.kedaruratan}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2.5 border-t border-slate-100">
                          <button
                            onClick={() => handleDeleteReport(report.id_tiket)}
                            className="px-3 py-1.5 bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 text-xs rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-[0.97]"
                            title="Tolak / Hapus Laporan (Spam)"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Spam
                          </button>

                          {report.status_laporan === "Pending" ? (
                            <button
                              onClick={() => handleOpenCreateDisposisi(report)}
                              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
                            >
                              Disposisikan <ArrowRightCircle className="w-3.5 h-3.5 text-[#ffb800]" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenViewDisposisi(report)}
                              className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-blue-750 text-xs rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-[0.97]"
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

      {/* DISPOSISI MODAL OVERLAY */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-none">
          
          {/* Modal Container */}
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl relative z-10 transition-all duration-300 overflow-hidden font-sans text-left">
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-[#0B1E43]">
                <Shield className="w-5 h-5 text-[#E28A1C]" />
                <span className="text-sm font-black tracking-wider uppercase">
                  {modalMode === 'create' ? "Formulir Disposisi Tugas Resmi" : "Lembar Disposisi Tugas Sah"}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer active:scale-[0.95]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDisposisi}>
              
              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* 1. Nomor Urut Tugas & Nomor Tiket */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      1. Nomor Urut Tugas
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={modalMode === 'create' ? "No. [Otomatis System]" : `No. ${String(selectedReport.disposisi?.no_urut || '').padStart(4, '0')}`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0B1E43] font-mono font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* 2. Nomor Tiket Aduan */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      2. Nomor Tiket Aduan
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedReport.id_tiket}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0B1E43] font-mono font-bold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* 3. Nama Admin Pemeriksa */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                        className={`w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none border cursor-pointer ${
                          formErrors.namaAdmin ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:bg-white focus:ring-1 focus:ring-[#0B1E43]'
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-not-allowed font-semibold"
                    />
                  )}
                </div>

                {/* 4. Waktu Verifikasi */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    4. Waktu Verifikasi
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={new Date(modalMode === 'create' ? disposisiForm.waktuVerifikasi : (selectedReport.disposisi?.waktu_verifikasi || new Date())).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-550 outline-none cursor-not-allowed font-semibold"
                  />
                </div>

                {/* 5. Diteruskan ke Bidang */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    5. Diteruskan ke Bidang <span className="text-rose-500">*</span>
                  </label>
                  
                  {modalMode === 'create' ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "Bidang Linmas", label: "Bidang Linmas" },
                          { id: "Bidang Trantib", label: "Bidang Trantib" },
                          { id: "Bidang Perada", label: "Bidang Perada" },
                          { id: "Bidang SDA", label: "Bidang SDA" },
                        ].map((bidang) => (
                          <button
                            key={bidang.id}
                            type="button"
                            onClick={() => {
                              setDisposisiForm(prev => ({ ...prev, bidangTujuan: bidang.id }));
                              if (formErrors.bidangTujuan) setFormErrors(prev => ({ ...prev, bidangTujuan: null }));
                            }}
                            className={`py-2 px-3 text-xs font-bold rounded-lg text-center transition-all cursor-pointer border ${
                              disposisiForm.bidangTujuan === bidang.id 
                                ? 'bg-blue-50 text-blue-700 font-extrabold border-blue-500 shadow-inner' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {bidang.label}
                          </button>
                        ))}
                      </div>
                      {formErrors.bidangTujuan && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.bidangTujuan}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-black text-blue-750">
                      {selectedReport.disposisi?.bidang_tujuan}
                    </div>
                  )}
                </div>

                {/* 6. Tingkat Kedaruratan */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    6. Tingkat Kedaruratan
                  </label>
                  
                  {modalMode === 'create' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "Rendah", label: "Rendah", color: "hover:text-emerald-600 border-slate-200 text-emerald-500", active: "bg-emerald-50 border-emerald-500 text-emerald-700 font-black shadow-inner" },
                        { id: "Sedang", label: "Sedang", color: "hover:text-amber-600 border-slate-200 text-amber-500", active: "bg-amber-50 border-amber-500 text-amber-705 font-black shadow-inner" },
                        { id: "Darurat", label: "Darurat", color: "hover:text-rose-600 border-slate-200 text-rose-500", active: "bg-rose-50 border-rose-500 text-rose-700 font-black shadow-inner" },
                      ].map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setDisposisiForm(prev => ({ ...prev, kedaruratan: level.id }))}
                          className={`py-2 px-3 text-xs font-bold rounded-lg text-center transition-all cursor-pointer border ${
                            disposisiForm.kedaruratan === level.id ? level.active : `bg-white ${level.color}`
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold ${
                      selectedReport.disposisi?.kedaruratan === 'Darurat' 
                        ? 'bg-rose-50 border border-rose-200 text-rose-705' 
                        : selectedReport.disposisi?.kedaruratan === 'Sedang'
                        ? 'bg-amber-50 border border-amber-200 text-amber-705'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-705'
                    }`}>
                      Urgensi: {selectedReport.disposisi?.kedaruratan}
                    </div>
                  )}
                </div>

                {/* 7. Catatan/Perintah Tambahan */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
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
                        className={`w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none border resize-y ${
                          formErrors.catatan ? 'border-rose-300 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-650'
                        }`}
                      />
                      
                      {/* Arahan Cepat */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 font-bold block">Klik Arahan Cepat:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_TEMPLATES.map((tmpl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setDisposisiForm(prev => ({ ...prev, catatan: tmpl }));
                                if (formErrors.catatan) setFormErrors(prev => ({ ...prev, catatan: null }));
                              }}
                              className="text-[9px] bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 px-2 py-1 rounded border border-slate-200 text-left transition-colors truncate max-w-full cursor-pointer font-bold"
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
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-650 italic leading-relaxed border-l-4 border-l-blue-600 select-text font-medium">
                      "{selectedReport.disposisi?.catatan}"
                    </div>
                  )}
                </div>

                {/* 8. Waktu Tugas Dikirim */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    8. Waktu Tugas Dikirim
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={modalMode === 'create' ? "Otomatis tercatat saat tugas dikirim" : new Date(selectedReport.disposisi?.waktu_dikirim || new Date()).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 outline-none cursor-not-allowed font-semibold"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-[0.97]"
                >
                  {modalMode === 'create' ? "Batal" : "Tutup Lembar"}
                </button>
                
                {modalMode === 'create' && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-650 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-[0.97]"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim Tugas...
                      </>
                    ) : (
                      <>
                        Kirim Tugas <ArrowRightCircle className="w-3.5 h-3.5 text-[#ffb800]" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          </div>
          
        </div>
      )}

    </div>
  );
}