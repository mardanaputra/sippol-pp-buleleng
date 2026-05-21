'use client';

import React, { useState, useEffect } from 'react';
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
  Scale
} from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
    "Tim segera merapat ke lokasi, tertibkan pelanggaran dan lakukan pembinaan.",
    "Lakukan patroli pengawasan intensif di wilayah tersebut untuk mencegah gangguan terulang.",
    "Koordinasikan dengan aparat desa/kelurahan setempat untuk penanganan terpadu.",
    "Harap segera tindak lanjuti dan laporkan perkembangan lapangan hari ini juga."
  ];

  // Fungsi mengambil data terupdate dari database
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pengaduan');
      const data = await res.json();
      if (res.ok) {
        setReports(data);
      }
    } catch (err) {
      console.error("Gagal memuat data database:", err);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch otomatis saat admin membuka halaman
  useEffect(() => {
    fetchReports();
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

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 p-6 relative overflow-hidden font-sans">
      
      {/* Glow Decorative */}
      <div className="bg-[#e0e5ec] shadow-[16px_16px_32px_#b8bec5,-16px_-16px_32px_#ffffff] w-[40rem] h-[40rem] rounded-full absolute -top-48 -left-48 pointer-events-none opacity-50 z-0" />
      <div className="bg-[#e0e5ec] shadow-[16px_16px_32px_#b8bec5,-16px_-16px_32px_#ffffff] w-[40rem] h-[40rem] rounded-full absolute -bottom-48 -right-48 pointer-events-none opacity-50 z-0" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">

        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#e0e5ec] shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] p-6 rounded-2xl gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] text-blue-800 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-blue-900">
                PANEL DISPOSISI SATPOL PP BULELENG
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Penyaringan Berkas & Pendistribusian Tugas Lapangan Terintegrasi SQLite
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.location.href = '/admin/perada'}
              className="w-full sm:w-auto px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-600 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] cursor-pointer"
            >
              <Scale className="w-4 h-4" /> Kelola Portal Perada
            </button>
            <button
              onClick={() => window.location.href = '/admin/trantib'}
              className="w-full sm:w-auto px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] cursor-pointer"
            >
              <Shield className="w-4 h-4" /> Kelola Portal Trantib
            </button>
            <button
              onClick={() => window.location.href = '/admin/linmas'}
              className="w-full sm:w-auto px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] cursor-pointer"
            >
              <Shield className="w-4 h-4" /> Kelola Portal Linmas
            </button>
            <button
              onClick={fetchReports}
              className="w-full sm:w-auto px-4 py-2 bg-[#e0e5ec] hover:bg-[#d5dae2] shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
          </div>
        </div>

        {/* List Pengaduan */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-16 bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec5,-6px_-6px_12px_#ffffff] rounded-2xl flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <div className="text-sm font-semibold text-slate-500">Menghubungkan ke core database dev.db...</div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center p-16 bg-[#e0e5ec] rounded-2xl shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] text-slate-500 text-sm space-y-2">
              <Clipboard className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-600">Belum ada data pengaduan masuk</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Database SQLite `dev.db` kosong. Silakan isi form di halaman warga (/pengaduan) terlebih dahulu!
              </p>
            </div>
          ) : (
            reports.map((report) => (
              <div 
                key={report.id_tiket} 
                className="bg-[#e0e5ec] rounded-2xl shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] hover:shadow-[6px_6px_12px_#b8bec5,-6px_-6px_12px_#ffffff] p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 relative"
              >
                
                {/* Info Tiket & Pelapor (Kiri) */}
                <div className="border-b md:border-b-0 md:border-r border-[#b8bec5]/30 pb-4 md:pb-0 md:pr-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-blue-800 bg-[#e0e5ec] shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] px-2 py-0.5 rounded border-none">
                        {report.id_tiket}
                      </span>
                      {report.status_laporan === "Pending" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0e5ec] text-amber-600 shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] border-none animate-pulse">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0e5ec] text-emerald-600 shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] border-none">
                          Disposisi
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-700">{report.kategori_masalah}</h3>
                    <p className="text-xs text-slate-400">
                      Pelapor: <span className="font-bold text-slate-600">{report.nama_pelapor}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Kontak: <span className="font-bold text-slate-600">{report.nomor_whatsapp}</span>
                    </p>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium pt-2 border-t border-[#b8bec5]/20">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(report.waktu_kirim).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                {/* Deskripsi Laporan & Lampiran Foto (Tengah) */}
                <div className="flex flex-col justify-between space-y-4 md:px-2">
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Kronologi Kejadian</span>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{report.kronologi}"
                    </p>
                  </div>
                  
                  {/* Foto Bukti (Jika Ada) */}
                  {report.foto_bukti && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Foto Bukti Lampiran
                      </span>
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] relative group cursor-zoom-in" onClick={() => {
                        const imgWindow = window.open();
                        imgWindow.document.write(`<img src="${report.foto_bukti}" style="max-width: 100%; height: auto;" />`);
                      }}>
                        <img src={report.foto_bukti} alt="Lampiran Bukti" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white transition-opacity font-bold">
                          Perbesar
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => openMaps(report.latitude, report.longitude)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e0e5ec] hover:bg-[#d5dae2] text-xs font-bold text-emerald-600 rounded-xl shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] cursor-pointer transition-colors"
                    >
                      <Map className="w-3.5 h-3.5" /> Buka Jalur Google Maps
                    </button>
                  </div>
                </div>

                {/* Status & Aksi Disposisi (Kanan) */}
                <div className="bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-white/10 p-4 rounded-xl flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Status Penanganan</span>
                    
                    {report.status_laporan === "Pending" ? (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          Menunggu Disposisi Tugas
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Laporan tersimpan di database. Silakan verifikasi dan teruskan ke bidang terkait.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Sudah Didisposisikan
                        </div>
                        <p className="text-[10px] text-blue-800 font-bold">
                          {report.bidang_disposisi}
                        </p>
                        {report.disposisi && (
                          <p className="text-[9px] text-slate-400">
                            Oleh: {report.disposisi.nama_admin} | Kedaruratan: <span className={`font-bold ${report.disposisi.kedaruratan === 'Darurat' ? 'text-rose-600' : report.disposisi.kedaruratan === 'Sedang' ? 'text-amber-600' : 'text-emerald-600'}`}>{report.disposisi.kedaruratan}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#b8bec5]/20">
                    <button
                      onClick={() => handleDeleteReport(report.id_tiket)}
                      className="px-3 py-1.5 bg-[#e0e5ec] text-rose-600 shadow-[3px_3px_6px_#b8bec5,-3px_-3px_6px_#ffffff] hover:shadow-[2px_2px_3px_#b8bec5,-2px_-2px_3px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-xs rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Tolak / Hapus Laporan (Spam)"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Spam
                    </button>

                    {report.status_laporan === "Pending" ? (
                      <button
                        onClick={() => handleOpenCreateDisposisi(report)}
                        className="flex-1 py-1.5 bg-blue-700 hover:bg-blue-600 shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-white text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        Disposisikan <ArrowRightCircle className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenViewDisposisi(report)}
                        className="flex-1 py-1.5 bg-[#e0e5ec] hover:bg-[#d5dae2] shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-blue-700 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Lembar Tugas
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* DISPOSISI MODAL OVERLAY */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-slate-800/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Modal Container */}
          <div className="bg-[#e0e5ec] shadow-[12px_12px_24px_#b8bec5,-12px_-12px_24px_#ffffff] rounded-2xl max-w-xl w-full relative z-10 transition-all duration-300 overflow-hidden font-sans">
            
            {/* Modal Header */}
            <div className="bg-[#d5dae2] shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] px-6 py-4 border-b border-[#b8bec5]/20 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-blue-800">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-black tracking-wider uppercase">
                  {modalMode === 'create' ? "Formulir Disposisi Tugas Resmi" : "Lembar Disposisi Tugas Sah"}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDisposisi}>
              
              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* 1. Nomor Urut Tugas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      1. Nomor Urut Tugas
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={modalMode === 'create' ? "No. [Otomatis System]" : `No. ${String(selectedReport.disposisi?.no_urut || '').padStart(4, '0')}`}
                      className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl px-3 py-2 text-xs text-blue-800 font-mono font-bold outline-none"
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
                      className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl px-3 py-2 text-xs text-blue-800 font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                {/* 3. Nama Admin Pemeriksa */}
                <div className="space-y-1">
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
                        className={`w-full bg-[#e0e5ec] ${formErrors.namaAdmin ? 'shadow-[inset_3px_3px_6px_#e5b8b8,inset_-3px_-3px_6px_#ffffff]' : 'shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff]'} rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff]`}
                      >
                        <option value="" disabled>-- Pilih Nama Admin --</option>
                        <option value="Putu Wijaya">Putu Wijaya (Admin Utama)</option>
                        <option value="Made Sentana">Made Sentana (Verifikator)</option>
                        <option value="Ketut Lestari">Ketut Lestari (Staf Penindakan)</option>
                        <option value="Nyoman Sudarma">Nyoman Sudarma (Sekretaris)</option>
                      </select>
                      {formErrors.namaAdmin && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.namaAdmin}
                        </p>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value={selectedReport.disposisi?.nama_admin || ''}
                      className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl px-3 py-2 text-xs text-slate-600 outline-none"
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
                    className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl px-3 py-2 text-xs text-slate-500 outline-none"
                  />
                </div>

                {/* 5. Diteruskan ke Bidang */}
                <div className="space-y-1.5">
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
                            className={`py-2 px-3 text-xs font-bold rounded-xl text-center transition-all cursor-pointer ${
                              disposisiForm.bidangTujuan === bidang.id 
                                ? 'bg-[#e0e5ec] text-blue-800 font-black shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff]' 
                                : 'bg-[#e0e5ec] text-slate-500 shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff]'
                            }`}
                          >
                            {bidang.label}
                          </button>
                        ))}
                      </div>
                      {formErrors.bidangTujuan && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.bidangTujuan}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl text-xs font-bold text-blue-800">
                      {selectedReport.disposisi?.bidang_tujuan}
                    </div>
                  )}
                </div>

                {/* 6. Tingkat Kedaruratan */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    6. Tingkat Kedaruratan
                  </label>
                  
                  {modalMode === 'create' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "Rendah", label: "Rendah", color: "hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-400", active: "bg-emerald-500/20 border-emerald-500 text-emerald-300" },
                        { id: "Sedang", label: "Sedang", color: "hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-400", active: "bg-amber-500/20 border-amber-500 text-amber-300" },
                        { id: "Darurat", label: "Darurat", color: "hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400", active: "bg-rose-500/20 border-rose-500 text-rose-300" },
                        { id: "Rendah", label: "Rendah", color: "hover:text-emerald-600 text-emerald-500", active: "bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-emerald-700 font-black" },
                        { id: "Sedang", label: "Sedang", color: "hover:text-amber-600 text-amber-500", active: "bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-amber-700 font-black" },
                        { id: "Darurat", label: "Darurat", color: "hover:text-rose-600 text-rose-500", active: "bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-rose-700 font-black" },
                      ].map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setDisposisiForm(prev => ({ ...prev, kedaruratan: level.id }))}
                          className={`py-2 px-3 text-xs font-bold rounded-xl text-center transition-all cursor-pointer ${
                            disposisiForm.kedaruratan === level.id ? level.active : `bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] ${level.color}`
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold ${
                      selectedReport.disposisi?.kedaruratan === 'Darurat' 
                        ? 'bg-[#e0e5ec] shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] text-rose-600' 
                        : selectedReport.disposisi?.kedaruratan === 'Sedang'
                        ? 'bg-[#e0e5ec] shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] text-amber-600'
                        : 'bg-[#e0e5ec] shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] text-emerald-600'
                    }`}>
                      {selectedReport.disposisi?.kedaruratan} Urgensi
                    </div>
                  )}
                </div>

                {/* 7. Catatan/Perintah Tambahan */}
                <div className="space-y-2">
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
                        className={`w-full bg-[#e0e5ec] ${formErrors.catatan ? 'shadow-[inset_3px_3px_6px_#e5b8b8,inset_-3px_-3px_6px_#ffffff]' : 'shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff]'} rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] resize-y`}
                      />
                      
                      {/* Quick templates */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-500 font-bold block">Klik Arahan Cepat:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_TEMPLATES.map((tmpl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setDisposisiForm(prev => ({ ...prev, catatan: tmpl }));
                                if (formErrors.catatan) setFormErrors(prev => ({ ...prev, catatan: null }));
                              }}
                              className="text-[9px] bg-[#e0e5ec] hover:bg-[#d5dae2] text-slate-500 hover:text-slate-700 px-2 py-1 rounded shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] hover:shadow-[1px_1px_2px_#b8bec5,-1px_-1px_2px_#ffffff] text-left transition-colors truncate max-w-full cursor-pointer"
                              title={tmpl}
                            >
                              Template {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {formErrors.catatan && (
                        <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {formErrors.catatan}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] border-[#b8bec5]/20 p-4 rounded-xl text-xs text-slate-600 italic leading-relaxed border-l-4 border-l-blue-700">
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
                    className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] rounded-xl px-3 py-2 text-xs text-slate-400 outline-none"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-[#d5dae2] shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] px-6 py-4 border-t border-[#b8bec5]/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#e0e5ec] text-slate-600 shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] hover:text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {modalMode === 'create' ? "Batal" : "Tutup Lembar"}
                </button>
                
                {modalMode === 'create' && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-600 shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
                        Kirim Tugas <ArrowRightCircle className="w-3.5 h-3.5" />
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