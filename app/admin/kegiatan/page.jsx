'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar, 
  Info, 
  Download, 
  X, 
  Check, 
  RefreshCw,
  Search,
  Filter,
  Camera,
  Moon,
  FileText,
  Building,
  Users,
  MapPin,
  ClipboardList
} from 'lucide-react';

const BIDANG_OPTIONS = [
  "Trantibum",
  "Perada",
  "Linmas",
  "SDA"
];

const JENIS_KEGIATAN_DEFAULT = [
  "Patroli Wilayah",
  "Sosialisasi Perda / Regulasi",
  "Penertiban K3 Lapangan",
  "Sidang Tipiring / Yustisial",
  "Rapat Koordinasi",
  "Bimbingan Teknis Linmas",
  "Pengamanan Event",
  "Kegiatan Lainnya"
];

export default function PortalKegiatan() {
  const [loading, setLoading] = useState(false);
  const [kegiatanList, setKegiatanList] = useState([]);

  // Modal / Detail States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBidang, setFilterBidang] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form State
  const [form, setForm] = useState({
    id: '',
    tanggal_kegiatan: '',
    bidang: 'Trantibum',
    jenis_kegiatan: 'Patroli Wilayah',
    lokasi: '',
    jumlah_personel: 1,
    uraian_kegiatan: '',
    foto_bukti: null,
  });

  // Fetch all kegiatan logs
  const fetchKegiatan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kegiatan');
      if (res.ok) {
        const data = await res.json();
        setKegiatanList(data);
      }
    } catch (err) {
      console.error("Gagal memuat log kegiatan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  // Image to Base64 Converter
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Hanya file gambar yang diperbolehkan.");
      e.target.value = null;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar melebihi batas 2MB.");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({
        ...prev,
        foto_bukti: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Open Add/Edit Modal
  const handleOpenModal = (mode, record = null) => {
    setFormMode(mode);
    setSelectedKegiatan(record);
    if (mode === 'create') {
      setForm({
        id: '',
        tanggal_kegiatan: new Date().toISOString().substring(0, 16),
        bidang: 'Trantibum',
        jenis_kegiatan: 'Patroli Wilayah',
        lokasi: '',
        jumlah_personel: 1,
        uraian_kegiatan: '',
        foto_bukti: null,
      });
    } else if (record) {
      setForm({
        id: record.id,
        tanggal_kegiatan: record.tanggal_kegiatan ? new Date(record.tanggal_kegiatan).toISOString().substring(0, 16) : '',
        bidang: record.bidang || 'Trantibum',
        jenis_kegiatan: record.jenis_kegiatan || 'Patroli Wilayah',
        lokasi: record.lokasi || '',
        jumlah_personel: record.jumlah_personel || 1,
        uraian_kegiatan: record.uraian_kegiatan || '',
        foto_bukti: record.foto_bukti || null,
      });
    }
    setIsModalOpen(true);
  };

  // Submit Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tanggal_kegiatan || !form.bidang || !form.jenis_kegiatan || !form.lokasi || !form.uraian_kegiatan) {
      alert("Harap lengkapi semua field wajib (Tanggal, Bidang, Jenis Kegiatan, Lokasi, Uraian).");
      return;
    }

    try {
      const method = formMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/kegiatan', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Log kegiatan berhasil disimpan!");
        setIsModalOpen(false);
        fetchKegiatan();
      } else {
        alert(data.error || "Gagal menyimpan log kegiatan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus log kegiatan ini?")) return;
    try {
      const res = await fetch(`/api/admin/kegiatan?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Log kegiatan berhasil dihapus.");
        fetchKegiatan();
      } else {
        alert("Gagal menghapus log kegiatan.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered List
  const filteredList = kegiatanList.filter(k => {
    const matchQuery = 
      k.no_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.jenis_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.uraian_kegiatan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchBidang = !filterBidang || k.bidang === filterBidang;

    let matchDate = true;
    if (startDate) {
      matchDate = matchDate && new Date(k.tanggal_kegiatan) >= new Date(startDate);
    }
    if (endDate) {
      // Add end-of-day buffer
      const boundEnd = new Date(endDate);
      boundEnd.setHours(23, 59, 59, 999);
      matchDate = matchDate && new Date(k.tanggal_kegiatan) <= boundEnd;
    }

    return matchQuery && matchBidang && matchDate;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredList.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = ["No. Jurnal", "Tanggal", "Bidang", "Jenis Kegiatan", "Lokasi", "Jumlah Personel", "Uraian Kegiatan"];
    const rows = filteredList.map(k => [
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
    link.setAttribute("download", `Rekap_Kegiatan_Satpol_PP_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON Function
  const exportToJSON = () => {
    if (filteredList.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredList, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `Rekap_Kegiatan_Satpol_PP_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 font-sans select-none relative overflow-x-hidden pt-[57px] flex flex-col justify-between">
      
      {/* Horizontal Navbar */}
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
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/dashboard?tab=disposisi" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#561C24] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Disposisi
            </Link>
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
              className="px-4 py-4 text-xs font-black text-[#561C24] bg-[#561C24]/5 border-b-2 border-[#561C24] transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Kegiatan
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#561C24] via-[#6D2932] to-[#80424a] text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[15%] w-36 h-36 bg-[#C7B7A3]/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => alert("Fitur Mode Malam akan segera hadir!")}
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
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PORTAL LOG KEGIATAN TERPADU</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Pencatatan Aktivitas Lapangan & Jurnal Operasional Seluruh Bidang Satpol PP Buleleng
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-left">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all col-span-2 md:col-span-1">
            <div className="text-[10px] text-slate-450 font-bold uppercase tracking-widest leading-none">Total Kegiatan</div>
            <div className="text-2xl font-black text-slate-800 mt-2 flex items-baseline gap-1">
              {kegiatanList.length} <span className="text-[10px] text-slate-450 font-bold">Log</span>
            </div>
          </div>
          <div className="bg-white border border-[#e67e22]/20 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] text-[#e67e22] font-bold uppercase tracking-widest leading-none">Trantibum</div>
            <div className="text-2xl font-black text-slate-800 mt-2 flex items-baseline gap-1">
              {kegiatanList.filter(k => k.bidang === 'Trantibum').length} <span className="text-[10px] text-slate-450 font-bold">Log</span>
            </div>
          </div>
          <div className="bg-white border border-blue-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] text-blue-650 font-bold uppercase tracking-widest leading-none">Perada</div>
            <div className="text-2xl font-black text-slate-800 mt-2 flex items-baseline gap-1">
              {kegiatanList.filter(k => k.bidang === 'Perada').length} <span className="text-[10px] text-slate-450 font-bold">Log</span>
            </div>
          </div>
          <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] text-emerald-750 font-bold uppercase tracking-widest leading-none">Linmas</div>
            <div className="text-2xl font-black text-slate-800 mt-2 flex items-baseline gap-1">
              {kegiatanList.filter(k => k.bidang === 'Linmas').length} <span className="text-[10px] text-slate-450 font-bold">Log</span>
            </div>
          </div>
          <div className="bg-white border border-purple-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="text-[10px] text-purple-750 font-bold uppercase tracking-widest leading-none">SDA</div>
            <div className="text-2xl font-black text-slate-800 mt-2 flex items-baseline gap-1">
              {kegiatanList.filter(k => k.bidang === 'SDA').length} <span className="text-[10px] text-slate-450 font-bold">Log</span>
            </div>
          </div>
        </div>

        {/* Database List & Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Log & Kegiatan Aktif</h3>
              <p className="text-[11px] text-slate-500">Gunakan filter untuk menyaring riwayat kegiatan lapangan dan mengunduh berkas laporan</p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 ml-auto">
              <button
                onClick={exportToCSV}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Unduh rekapitulasi data format CSV"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor CSV
              </button>
              <button
                onClick={exportToJSON}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Unduh rekapitulasi data format JSON"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor JSON
              </button>
              <button
                onClick={() => handleOpenModal('create')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" /> Input Kegiatan Baru
              </button>
            </div>
          </div>

          {/* Search, Bidang and Date filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="relative md:col-span-5 text-left">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Cari kata kunci, nomor log, jenis, lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10"
              />
            </div>
            
            <div className="md:col-span-3 text-left">
              <select
                value={filterBidang}
                onChange={(e) => setFilterBidang(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 cursor-pointer"
              >
                <option value="">Semua Bidang</option>
                {BIDANG_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-2 text-left">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 outline-none focus:bg-white cursor-pointer"
                title="Mulai Tanggal"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 outline-none focus:bg-white cursor-pointer"
                title="Sampai Tanggal"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 text-left">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-650 font-extrabold uppercase border-b border-slate-200 select-none">
                  <th className="px-4 py-3 text-center">No Jurnal</th>
                  <th className="px-4 py-3">Tanggal & Waktu</th>
                  <th className="px-4 py-3">Bidang</th>
                  <th className="px-4 py-3">Agenda / Kegiatan</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3 text-center">Personel</th>
                  <th className="px-4 py-3 text-center">Foto</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {loading && filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400">Memuat log kegiatan...</td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400">Tidak ada log kegiatan terdata.</td>
                  </tr>
                ) : (
                  filteredList.map((k) => {
                    let badgeColor = "bg-slate-100 text-slate-750";
                    if (k.bidang === 'Trantibum') badgeColor = "bg-orange-50 border border-orange-200 text-orange-850";
                    else if (k.bidang === 'Perada') badgeColor = "bg-blue-50 border border-blue-200 text-blue-850";
                    else if (k.bidang === 'Linmas') badgeColor = "bg-emerald-50 border border-emerald-250 text-emerald-900";
                    else if (k.bidang === 'SDA') badgeColor = "bg-purple-50 border border-purple-200 text-purple-900";

                    return (
                      <tr key={k.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-center font-bold text-slate-900 whitespace-nowrap">{k.no_kegiatan}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(k.tanggal_kegiatan).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${badgeColor}`}>
                            {k.bidang}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-extrabold text-slate-800">{k.jenis_kegiatan}</td>
                        <td className="px-4 py-3 truncate max-w-[180px]">{k.lokasi}</td>
                        <td className="px-4 py-3 text-center">{k.jumlah_personel} orang</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {k.foto_bukti ? (
                            <img
                              src={k.foto_bukti}
                              alt="Foto Bukti"
                              onClick={() => { setZoomImageUrl(k.foto_bukti); setIsZoomModalOpen(true); }}
                              className="w-10 h-7 object-cover rounded border border-slate-200 hover:scale-105 cursor-zoom-in transition-all mx-auto"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold italic">Nihil</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenModal('view', k)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-all cursor-pointer"
                              title="Lihat Detail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenModal('edit', k)}
                              className="p-1 hover:bg-slate-200 rounded text-blue-600 transition-all cursor-pointer"
                              title="Edit Data"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(k.id)}
                              className="p-1 hover:bg-red-50 rounded text-red-650 transition-all cursor-pointer"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== MODAL 1: INPUT/EDIT/VIEW LOG KEGIATAN ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl shadow-2xl relative text-left overflow-hidden flex flex-col my-8">
            {/* Header */}
            <div className="bg-[#561C24] text-white p-5 flex items-center justify-between border-b border-[#3d1015]">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#E8D8C4]" />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    {formMode === 'create' ? 'Input Log Kegiatan Baru' : formMode === 'edit' ? 'Edit Log Kegiatan' : 'Detail Jurnal Kegiatan'}
                  </h3>
                  {form.no_kegiatan && <p className="text-[10px] text-slate-300 font-bold font-mono mt-0.5">{form.no_kegiatan}</p>}
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-200 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tanggal Kegiatan */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Tanggal & Waktu <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    disabled={formMode === 'view'}
                    value={form.tanggal_kegiatan}
                    onChange={(e) => setForm(prev => ({ ...prev, tanggal_kegiatan: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Bidang Satpol */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Bidang Satpol <span className="text-red-500">*</span></label>
                  <select
                    disabled={formMode === 'view'}
                    value={form.bidang}
                    onChange={(e) => setForm(prev => ({ ...prev, bidang: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    required
                  >
                    {BIDANG_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Jenis Kegiatan */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Jenis Kegiatan <span className="text-red-500">*</span></label>
                  {formMode === 'view' ? (
                    <input
                      type="text"
                      disabled
                      value={form.jenis_kegiatan}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                    />
                  ) : (
                    <select
                      value={form.jenis_kegiatan}
                      onChange={(e) => setForm(prev => ({ ...prev, jenis_kegiatan: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 cursor-pointer"
                      required
                    >
                      {JENIS_KEGIATAN_DEFAULT.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Jumlah Personel */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Personel Terlibat <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    disabled={formMode === 'view'}
                    min="1"
                    value={form.jumlah_personel}
                    onChange={(e) => setForm(prev => ({ ...prev, jumlah_personel: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Lokasi Sasaran / Alamat <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    disabled={formMode === 'view'}
                    value={form.lokasi}
                    onChange={(e) => setForm(prev => ({ ...prev, lokasi: e.target.value }))}
                    placeholder="Contoh: Taman Kota Singaraja, Samping Timur Pos Satpol"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Uraian Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Uraian / Ringkasan Pelaksanaan <span className="text-red-500">*</span></label>
                <textarea
                  disabled={formMode === 'view'}
                  rows="4"
                  value={form.uraian_kegiatan}
                  onChange={(e) => setForm(prev => ({ ...prev, uraian_kegiatan: e.target.value }))}
                  placeholder="Deskripsikan dengan detail jalannya kegiatan, personel yang terlibat, sarana yang digunakan, serta temuan/tindak lanjut..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/10 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                  required
                />
              </div>

              {/* Upload Foto */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">Foto Dokumentasi Kegiatan</label>
                {formMode !== 'view' && (
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer">
                      <Camera className="w-4 h-4 text-slate-500" /> Pilih Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">Format JPG/PNG, Maksimal 2MB.</span>
                  </div>
                )}
                
                {form.foto_bukti && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={form.foto_bukti}
                      alt="Foto Bukti Dokumentasi"
                      className="w-40 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                    {formMode !== 'view' && (
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, foto_bukti: null }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-all cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer active:scale-95 ml-auto"
                >
                  Tutup
                </button>
                {formMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    Simpan Jurnal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ZOOM IMAGE MODAL ==================== */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-800">
            <img 
              src={zoomImageUrl} 
              alt="Foto Bukti Zoom" 
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

      <Footer />
    </div>
  );
}
