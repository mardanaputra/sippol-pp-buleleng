'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Camera, 
  Copy, 
  Check, 
  Info, 
  User, 
  Phone, 
  FileText, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import Footer from '../components/Footer';

export default function PengaduanWarga() {
  const [formData, setFormData] = useState({
    namaPelapor: '',
    isAnonim: false,
    nomorWhatsapp: '',
    kategoriMasalah: '',
    kronologi: '',
    latitude: '',
    longitude: '',
    fotoBukti: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);

  // Fungsi mengambil koordinat GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung layanan lokasi/GPS.");
      return;
    }

    setLocationLoading(true);
    setErrors(prev => ({ ...prev, lokasi: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6).toString(),
          longitude: position.coords.longitude.toFixed(6).toString(),
        }));
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        setLocationLoading(false);
        setErrors(prev => ({ 
          ...prev, 
          lokasi: "Gagal mendapatkan lokasi. Pastikan izin GPS diizinkan oleh browser." 
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fungsi penanganan konversi foto ke Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, foto: "Ukuran file foto melebihi batas 2 MB." }));
      return;
    }

    setErrors(prev => ({ ...prev, foto: null }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, fotoBukti: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Hapus foto bukti
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, fotoBukti: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Salin tiket ke clipboard
  const handleCopyTicket = async () => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tiket:", err);
    }
  };

  // Validasi Form sebelum kirim
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.isAnonim && !formData.namaPelapor.trim()) {
      newErrors.namaPelapor = "Nama pelapor wajib diisi (atau pilih opsi Anonim).";
    }
    
    if (!formData.nomorWhatsapp.trim()) {
      newErrors.nomorWhatsapp = "Nomor WhatsApp wajib diisi untuk koordinasi.";
    } else if (!/^[0-9+]{9,15}$/.test(formData.nomorWhatsapp.trim())) {
      newErrors.nomorWhatsapp = "Format nomor WhatsApp tidak valid (Gunakan angka, 9-15 karakter).";
    }

    if (!formData.kategoriMasalah) {
      newErrors.kategoriMasalah = "Pilihlah salah satu kategori masalah.";
    }

    if (!formData.kronologi.trim()) {
      newErrors.kronologi = "Kronologi kejadian wajib dijelaskan.";
    } else if (formData.kronologi.trim().length < 20) {
      newErrors.kronologi = "Harap jelaskan kronologi dengan lebih detail (minimal 20 karakter).";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.lokasi = "Koordinat lokasi kejadian wajib diisi. Silakan tekan tombol dapatkan GPS.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Kirim Pengaduan
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Generasi nomor tiket acak berbasis waktu
    const nomorAcak = Math.floor(10000 + Math.random() * 90000);
    const generatedTicket = `TKT-2026-${nomorAcak}`;

    try {
      const res = await fetch('/api/pengaduan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_tiket: generatedTicket,
          nama_pelapor: formData.isAnonim ? 'Anonim' : formData.namaPelapor,
          is_anonim: formData.isAnonim,
          nomor_whatsapp: formData.nomorWhatsapp,
          kategori_masalah: formData.kategoriMasalah,
          kronologi: formData.kronologi,
          latitude: formData.latitude,
          longitude: formData.longitude,
          foto_bukti: formData.fotoBukti,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTicketNumber(generatedTicket);
        setIsSubmitted(true);
        // Reset form
        setFormData({
          namaPelapor: '',
          isAnonim: false,
          nomorWhatsapp: '',
          kategoriMasalah: '',
          kronologi: '',
          latitude: '',
          longitude: '',
          fotoBukti: null,
        });
        setImagePreview(null);
      } else {
        alert(data.error || 'Gagal menyimpan laporan ke database.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan saat menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form untuk pengaduan baru
  const handleReset = () => {
    setIsSubmitted(false);
    setTicketNumber('');
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans select-none">
      
      {/* Neumorphic Soft UI Floating Geometry Elements */}
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-[#e0e5ec] shadow-[16px_16px_32px_#b8bec5,-16px_-16px_32px_#ffffff] pointer-events-none opacity-60 z-0" />
      <div className="absolute bottom-24 -right-16 w-80 h-80 rounded-full bg-[#e0e5ec] shadow-[inset_16px_16px_32px_#b8bec5,inset_-16px_-16px_32px_#ffffff] pointer-events-none opacity-60 z-0" />
      <div className="absolute top-[40%] right-[5%] w-32 h-32 rounded-3xl bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec5,-10px_-10px_20px_#ffffff] rotate-12 pointer-events-none opacity-50 z-0" />

      {/* Main Container */}
      <div className="max-w-2xl w-full relative z-10 transition-all duration-500 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center mb-6 space-y-4">
          <div className="inline-flex p-4 bg-[#e0e5ec] rounded-2xl shadow-[6px_6px_12px_#b8bec5,-6px_-6px_12px_#ffffff] text-blue-800">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-wider text-blue-900 leading-none">
              SIPP-OL PP BULELENG
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">
              Sistem Informasi Pelayanan & Pengaduan Online Satpol PP Kab. Buleleng
            </p>
          </div>
        </div>

        {/* Navigation Bar / Quick Links */}
        <div className="flex justify-center items-center gap-4 text-xs font-bold relative z-10">
          <Link 
            href="/" 
            className="px-4 py-2 bg-[#e0e5ec] text-slate-700 hover:text-slate-800 rounded-xl shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer border border-[#ffffff]/25"
            id="nav-to-home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-550" /> Halaman Utama
          </Link>
          <Link 
            href="/status" 
            className="px-4 py-2 bg-[#e0e5ec] text-slate-750 hover:text-slate-850 rounded-xl shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer border border-[#ffffff]/25"
            id="nav-to-status"
          >
            Lacak Status Laporan
          </Link>
        </div>

        {/* Conditional Screen View */}
        {!isSubmitted ? (
          <div className="bg-[#e0e5ec] rounded-3xl p-6 md:p-8 shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] space-y-6 border border-[#ffffff]/10">
            
            <div className="border-b border-slate-300/60 pb-4">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                Formulir Pengaduan Masyarakat
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Silakan isi data laporan Anda di bawah ini dengan lengkap dan jujur. Informasi Anda dilindungi hukum.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Box Anonimitas */}
              <div className="bg-[#e0e5ec] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] flex items-start gap-3 border border-[#ffffff]/10">
                <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-655">
                    Ingin mengirim laporan secara rahasia/tanpa nama asli?
                  </p>
                  <label className="inline-flex items-center cursor-pointer gap-2">
                    <input 
                      type="checkbox"
                      checked={formData.isAnonim}
                      onChange={(e) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          isAnonim: e.target.checked,
                          namaPelapor: e.target.checked ? '' : prev.namaPelapor
                        }));
                        if (errors.namaPelapor) setErrors(prev => ({ ...prev, namaPelapor: null }));
                      }}
                      className="w-4 h-4 rounded text-blue-800 bg-[#e0e5ec] border-slate-350 focus:ring-blue-700 cursor-pointer"
                    />
                    <span className="text-xs font-black text-blue-800 select-none">
                      Kirim Sebagai Anonim (Nama disembunyikan)
                    </span>
                  </label>
                </div>
              </div>

              {/* Nama Pelapor */}
              {!formData.isAnonim && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Nama Pelapor <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap sesuai KTP"
                    value={formData.namaPelapor}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, namaPelapor: e.target.value }));
                      if (errors.namaPelapor) setErrors(prev => ({ ...prev, namaPelapor: null }));
                    }}
                    className={`w-full bg-[#e0e5ec] rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 placeholder-slate-400/80 border-none focus:ring-2 focus:ring-blue-850/20 ${errors.namaPelapor ? 'shadow-[inset_5px_5px_10px_#e5b8b8,inset_-5px_-5px_10px_#ffffff]' : 'shadow-[inset_5px_5px_10px_#b8bec5,inset_-5px_-5px_10px_#ffffff]'}`}
                  />
                  {errors.namaPelapor && (
                    <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.namaPelapor}
                    </p>
                  )}
                </div>
              )}

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> Nomor WhatsApp Aktif <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.nomorWhatsapp}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, nomorWhatsapp: e.target.value }));
                    if (errors.nomorWhatsapp) setErrors(prev => ({ ...prev, nomorWhatsapp: null }));
                  }}
                  className={`w-full bg-[#e0e5ec] rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 placeholder-slate-400/80 border-none focus:ring-2 focus:ring-blue-850/20 ${errors.nomorWhatsapp ? 'shadow-[inset_5px_5px_10px_#e5b8b8,inset_-5px_-5px_10px_#ffffff]' : 'shadow-[inset_5px_5px_10px_#b8bec5,inset_-5px_-5px_10px_#ffffff]'}`}
                />
                {errors.nomorWhatsapp ? (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.nomorWhatsapp}
                  </p>
                ) : (
                  <p className="text-slate-500 text-[10px] font-semibold">
                    Nomor WhatsApp dibutuhkan agar petugas dapat berkoordinasi dan memvalidasi laporan Anda.
                  </p>
                )}
              </div>

              {/* Kategori Masalah */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Kategori Laporan <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.kategoriMasalah}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, kategoriMasalah: e.target.value }));
                    if (errors.kategoriMasalah) setErrors(prev => ({ ...prev, kategoriMasalah: null }));
                  }}
                  className={`w-full bg-[#e0e5ec] rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 border-none focus:ring-2 focus:ring-blue-850/20 cursor-pointer ${errors.kategoriMasalah ? 'shadow-[inset_5px_5px_10px_#e5b8b8,inset_-5px_-5px_10px_#ffffff]' : 'shadow-[inset_5px_5px_10px_#b8bec5,inset_-5px_-5px_10px_#ffffff]'}`}
                >
                  <option value="" disabled className="bg-[#e0e5ec] text-slate-400">-- Pilih Kategori Masalah --</option>
                  <option value="Bidang Ketertiban Umum" className="bg-[#e0e5ec] text-slate-700">Ketertiban Umum (PKL Liar, Reklame Ilegal, Kebisingan, dsb.)</option>
                  <option value="Bidang Penegakan Perda" className="bg-[#e0e5ec] text-slate-700">Pelanggaran Perda (Izin Usaha, Konstruksi Liar, Limbah, dsb.)</option>
                  <option value="Bidang Linmas" className="bg-[#e0e5ec] text-slate-700">Perlindungan Masyarakat (Linmas, Bencana, Gangguan Warga, dsb.)</option>
                  <option value="Bidang Peningkatan SDM" className="bg-[#e0e5ec] text-slate-700">SDM & Sarana (Pengembangan Kapasitas, Aduan Petugas, dsb.)</option>
                  <option value="Lainnya" className="bg-[#e0e5ec] text-slate-700">Masalah Lainnya</option>
                </select>
                {errors.kategoriMasalah && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.kategoriMasalah}
                  </p>
                )}
              </div>

              {/* Kronologi */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Kronologi Kejadian <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Deskripsikan secara detail: Apa kejadiannya? Siapa pelakunya (jika tahu)? Kapan terjadi? Bagaimana kronologi lengkapnya?"
                  value={formData.kronologi}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, kronologi: e.target.value }));
                    if (errors.kronologi) setErrors(prev => ({ ...prev, kronologi: null }));
                  }}
                  className={`w-full bg-[#e0e5ec] rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-slate-700 placeholder-slate-400/80 border-none focus:ring-2 focus:ring-blue-850/20 resize-y ${errors.kronologi ? 'shadow-[inset_5px_5px_10px_#e5b8b8,inset_-5px_-5px_10px_#ffffff]' : 'shadow-[inset_5px_5px_10px_#b8bec5,inset_-5px_-5px_10px_#ffffff]'}`}
                />
                {errors.kronologi ? (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.kronologi}
                  </p>
                ) : (
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Min. 20 karakter untuk deskripsi detail.</span>
                    <span>{formData.kronologi.length} karakter</span>
                  </div>
                )}
              </div>

              {/* Lokasi Kejadian (Latitude, Longitude) */}
              <div className="space-y-3 bg-[#e0e5ec] p-4 rounded-2xl shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-300/40 pb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-550" /> Lokasi Geografis (GPS) <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="px-3 py-1.5 bg-[#e0e5ec] text-blue-800 hover:text-blue-900 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-[3px_3px_6px_#b8bec5,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b8bec5,-1px_-1px_3px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all disabled:opacity-50 cursor-pointer border border-[#ffffff]/15"
                  >
                    <MapPin className={`w-3.5 h-3.5 ${locationLoading ? 'animate-bounce' : ''}`} />
                    {locationLoading ? "Mendapatkan Koordinat..." : "Dapatkan Lokasi Saya"}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Latitude</label>
                    <input
                      type="text"
                      placeholder="Contoh: -8.114712"
                      value={formData.latitude}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, latitude: e.target.value }));
                        if (errors.lokasi) setErrors(prev => ({ ...prev, lokasi: null }));
                      }}
                      className="w-full bg-[#e0e5ec] rounded-xl px-3 py-2 text-xs outline-none shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] border-none text-slate-700 focus:ring-1 focus:ring-blue-850/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Longitude</label>
                    <input
                      type="text"
                      placeholder="Contoh: 115.090124"
                      value={formData.longitude}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, longitude: e.target.value }));
                        if (errors.lokasi) setErrors(prev => ({ ...prev, lokasi: null }));
                      }}
                      className="w-full bg-[#e0e5ec] rounded-xl px-3 py-2 text-xs outline-none shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] border-none text-slate-700 focus:ring-1 focus:ring-blue-850/20"
                    />
                  </div>
                </div>
                
                {errors.lokasi && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.lokasi}
                  </p>
                )}
              </div>

              {/* Upload Foto Bukti */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-500" /> Foto Bukti Kejadian <span className="text-slate-400">(Opsional)</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* File Input Box */}
                  <div className="relative">
                    <input
                      type="file"
                      id="fotoBukti"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="fotoBukti"
                      className="flex flex-col items-center justify-center p-6 bg-[#e0e5ec] rounded-2xl cursor-pointer shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] hover:text-blue-800 transition-all text-center border border-[#ffffff]/20 group"
                    >
                      <Camera className="w-6 h-6 text-slate-500 group-hover:text-blue-800 mb-2 transition-colors" />
                      <span className="text-xs font-black text-slate-750">Pilih Foto</span>
                      <span className="text-[10px] text-slate-500 mt-1 font-semibold">PNG, JPG (Maks. 2MB)</span>
                    </label>
                  </div>
                  
                  {/* Image Preview Box */}
                  <div className="h-28 bg-[#e0e5ec] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Preview Laporan" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-[#e0e5ec] text-red-650 hover:text-red-700 rounded-lg shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] hover:shadow-[1px_1px_2px_#b8bec5,-1px_-1px_2px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all cursor-pointer border border-[#ffffff]/10"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic font-semibold">Belum ada foto terpilih</span>
                    )}
                  </div>
                </div>
                
                {errors.foto && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.foto}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 bg-[#e28a1c] hover:bg-[#d07b14] active:bg-[#e28a1c] text-white text-sm font-extrabold rounded-2xl shadow-[6px_6px_12px_#b8bec5,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 z-10 border-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses Laporan...
                  </>
                ) : (
                  <>
                    Kirim Pengaduan Sekarang <Send className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* SUCCESS SCREEN STATE */
          <div className="bg-[#e0e5ec] rounded-3xl p-8 shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] text-center space-y-6 relative overflow-hidden border border-[#ffffff]/10">
            
            <div className="inline-flex p-4 bg-[#e0e5ec] rounded-full shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] text-emerald-600 mx-auto">
              <Check className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-800">
                PENGADUAN BERHASIL TERKIRIM!
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-md mx-auto">
                Terima kasih atas kepedulian Anda. Laporan telah tercatat secara resmi di basis data Satpol PP Kabupaten Buleleng.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="bg-[#e0e5ec] rounded-2xl p-5 max-w-sm mx-auto space-y-2 relative shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                NOMOR TIKET PENGADUAN
              </span>
              <div className="text-2xl font-mono font-black text-blue-900 tracking-wider">
                {ticketNumber}
              </div>
              
              <button
                onClick={handleCopyTicket}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e0e5ec] text-xs text-slate-700 font-extrabold rounded-lg shadow-[3px_3px_6px_#b8bec5,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b8bec5,-1px_-1px_3px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all cursor-pointer border border-[#ffffff]/10"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-650" />
                    <span className="text-emerald-655 font-black">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Nomor Tiket</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#e0e5ec] p-4 rounded-2xl text-left max-w-md mx-auto flex gap-3 items-start shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10">
              <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800">Informasi Penting</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Harap catat atau salin nomor tiket di atas. Nomor tiket ini berfungsi sebagai bukti pelaporan sah yang dapat digunakan untuk melacak status penanganan berkas pengaduan Anda.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-350/40 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-3 bg-[#e0e5ec] text-slate-700 hover:text-slate-850 font-bold rounded-xl text-xs shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all cursor-pointer border border-[#ffffff]/25 animate-none"
              >
                Buat Pengaduan Lainnya
              </button>
              <Link
                href={`/status?id_tiket=${ticketNumber}`}
                className="px-5 py-3 bg-[#e28a1c] hover:bg-[#d07b14] text-white rounded-xl text-xs font-extrabold shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                Lacak Status Laporan
              </Link>
              <a
                href="/admin/dashboard"
                className="px-5 py-3 bg-[#e0e5ec] text-blue-800 hover:text-blue-900 rounded-xl text-xs font-extrabold shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center justify-center gap-1.5 border border-[#ffffff]/25"
              >
                Ke Dashboard Admin
              </a>
            </div>

          </div>
        )}

      </div>
      {/* Page Footer */}
      <Footer />
    </div>
  );
}