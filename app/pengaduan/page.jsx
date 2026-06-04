'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Map,
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
  ArrowLeft,
  Menu,
  X,
  Shield
} from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-background text-slate-800 flex flex-col justify-between relative overflow-x-hidden font-sans select-none">
      
      {/* Decorative Elegant Soft Gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-coffee-cream/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] bg-coffee-light/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Reusable Navbar Component */}
      <Navbar activePage="pengaduan" />

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 pt-28 pb-12 flex-1 relative z-10 transition-all duration-500 space-y-6">
        
        {/* Conditional Screen View */}
        {!isSubmitted ? (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-coffee-light/20 space-y-6">
            
            <div className="border-b border-slate-200/85 pb-5">
              <h2 className="text-xl font-black text-coffee-dark flex items-center gap-2.5">
                <div className="p-2 bg-coffee-cream/25 rounded-xl border border-coffee-light/35 text-coffee-medium">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                Formulir Pengaduan Warga
              </h2>
              <p className="text-xs text-slate-500 mt-2.5 font-semibold leading-relaxed">
                Silakan isi data laporan Anda di bawah ini dengan lengkap dan jujur. Setiap aduan dijamin kerahasiaannya dan dilindungi oleh Undang-Undang.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Box Anonimitas */}
              <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                formData.isAnonim 
                  ? 'bg-coffee-cream/10 border-coffee-light/30 shadow-sm' 
                  : 'bg-slate-50/60 border-slate-200'
              }`}>
                <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                  formData.isAnonim ? 'bg-coffee-cream/25 text-coffee-dark' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-2.5 flex-1">
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Mode Kerahasiaan Laporan</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      Ingin mengirim pengaduan secara rahasia tanpa mengungkapkan identitas asli Anda?
                    </p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer gap-2.5 group">
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
                      className="w-4.5 h-4.5 rounded text-coffee-dark border-slate-300 focus:ring-coffee-medium cursor-pointer transition-all"
                    />
                    <span className="text-xs font-black text-coffee-dark select-none group-hover:text-coffee-medium transition-colors">
                      Report as Anonymous (Laporkan sebagai Anonim)
                    </span>
                  </label>
                </div>
              </div>

              {/* Nama Pelapor */}
              {!formData.isAnonim && (
                <div className="space-y-2 text-left">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
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
                    className={`w-full bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 text-slate-800 placeholder-slate-400/70 border ${
                      errors.namaPelapor 
                        ? 'border-rose-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-500' 
                        : 'border-slate-300 focus:ring-2 focus:ring-coffee-cream/30 focus:border-coffee-medium'
                    }`}
                  />
                  {errors.namaPelapor && (
                    <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.namaPelapor}
                    </p>
                  )}
                </div>
              )}

              {/* WhatsApp */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
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
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 text-slate-800 placeholder-slate-400/70 border ${
                    errors.nomorWhatsapp 
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-2 focus:ring-coffee-cream/30 focus:border-coffee-medium'
                  }`}
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

              {/* Kategori Masalah (Dropdown Selection) */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Kategori Laporan <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.kategoriMasalah}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, kategoriMasalah: e.target.value }));
                    if (errors.kategoriMasalah) setErrors(prev => ({ ...prev, kategoriMasalah: null }));
                  }}
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 text-slate-800 border cursor-pointer ${
                    errors.kategoriMasalah 
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-2 focus:ring-coffee-cream/30 focus:border-coffee-medium'
                  }`}
                >
                  <option value="">-- Pilih Kategori Laporan --</option>
                  <option value="Parkir Liar">Parkir Liar</option>
                  <option value="Limbah">Limbah Lingkungan</option>
                  <option value="PKL Liar">Pedagang Kaki Lima (PKL) Liar</option>
                  <option value="Reklame Ilegal">Reklame / Baliho Ilegal</option>
                  <option value="Bencana">Bencana Alam / Gangguan Jalan</option>
                  <option value="Lainnya">Masalah Lainnya</option>
                </select>

                {errors.kategoriMasalah && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.kategoriMasalah}
                  </p>
                )}
              </div>

              {/* Kronologi */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
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
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 text-slate-800 placeholder-slate-400/70 resize-y border ${
                    errors.kronologi 
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-2 focus:ring-coffee-cream/30 focus:border-coffee-medium'
                  }`}
                />
                {errors.kronologi ? (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.kronologi}
                  </p>
                ) : (
                  <div className="flex justify-between text-[10px] text-slate-550 font-semibold">
                    <span>Min. 20 karakter untuk deskripsi detail.</span>
                    <span>{formData.kronologi.length} karakter</span>
                  </div>
                )}
              </div>

              {/* Lokasi Kejadian (Latitude, Longitude) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-250/65 pb-2.5">
                  <div className="space-y-0.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" /> Lokasi Geografis (GPS) <span className="text-rose-600">*</span>
                    </label>
                    <p className="text-[10px] text-slate-500 font-semibold">Petugas memerlukan koordinat presisi untuk peninjauan lapangan.</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-all disabled:opacity-50 cursor-pointer active:scale-[0.97]"
                  >
                    <Map className={`w-3.5 h-3.5 text-coffee-medium ${locationLoading ? 'animate-spin' : ''}`} />
                    {locationLoading ? "Mencari Lokasi..." : "Dapatkan Lokasi Saat Ini"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block">Latitude</span>
                    <input
                      type="text"
                      placeholder="Contoh: -8.114712"
                      value={formData.latitude}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, latitude: e.target.value }));
                        if (errors.lokasi) setErrors(prev => ({ ...prev, lokasi: null }));
                      }}
                      className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none border border-slate-300 text-slate-800 font-mono font-bold transition-all focus:ring-2 focus:ring-coffee-cream/30 focus:border-coffee-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block">Longitude</span>
                    <input
                      type="text"
                      placeholder="Contoh: 115.090124"
                      value={formData.longitude}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, longitude: e.target.value }));
                        if (errors.lokasi) setErrors(prev => ({ ...prev, lokasi: null }));
                      }}
                      className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none border border-slate-300 text-slate-800 font-mono font-bold transition-all focus:ring-2 focus:ring-coffee-cream/30 focus:border-coffee-medium"
                    />
                  </div>
                </div>

                {formData.latitude && formData.longitude && (
                  <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-250/80 rounded-xl p-3 text-[10px] font-bold text-emerald-800 shadow-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-pulse" />
                      Koordinat GPS Terkunci
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`;
                        window.open(url, '_blank');
                      }}
                      className="text-coffee-medium hover:underline cursor-pointer"
                    >
                      Buka Google Maps →
                    </button>
                  </div>
                )}

                {errors.lokasi && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.lokasi}
                  </p>
                )}
              </div>

              {/* Upload Foto Bukti Premium */}
              <div className="space-y-3 text-left">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-slate-500" /> Foto Bukti Kejadian <span className="text-slate-400 font-semibold">(Opsional)</span>
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
                      className="flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-50 rounded-2xl cursor-pointer border-2 border-dashed border-slate-350 hover:border-coffee-medium/60 hover:shadow-sm transition-all duration-300 text-center group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-coffee-cream/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className="p-2 bg-slate-50 rounded-xl shadow-sm border border-slate-150 group-hover:scale-105 transition-transform duration-300 mb-2 text-slate-400 group-hover:text-coffee-medium group-hover:border-coffee-cream/30">
                        <Camera className="w-5 h-5 transition-colors" />
                      </div>
                      <span className="text-xs font-black text-coffee-dark">Pilih Foto Terbaik</span>
                      <span className="text-[9px] text-slate-500 mt-1 font-semibold">Format JPG, PNG (Maksimal 2MB)</span>
                    </label>
                  </div>
                  
                  {/* Image Preview Box */}
                  <div className="h-28 bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-inner group">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Preview Laporan" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1.5 bg-white/95 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg shadow-md border border-slate-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-slate-400 italic font-bold uppercase tracking-wider block">PREVIEW GAMBAR</span>
                        <span className="text-[10px] text-slate-400 font-semibold block">Belum ada foto terpilih</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {errors.foto && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.foto}
                  </p>
                )}
              </div>

              {/* Submit Button Premium */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-5 py-4 bg-gradient-to-r from-coffee-dark to-coffee-medium hover:from-coffee-medium hover:to-coffee-dark text-white text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98] select-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses & Menyimpan Laporan...
                  </>
                ) : (
                  <>
                    Kirim Pengaduan Resmi <Send className="w-4 h-4 text-white" />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* SUCCESS SCREEN STATE */
          <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200/80 text-center space-y-6 relative overflow-hidden">
            
            <div className="inline-flex p-4 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 mx-auto">
              <Check className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-coffee-dark">
                PENGADUAN BERHASIL TERKIRIM!
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-md mx-auto">
                Terima kasih atas kepedulian Anda. Laporan telah tercatat secara resmi di basis data Satpol PP Kabupaten Buleleng.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="bg-slate-50 rounded-xl p-5 max-w-sm mx-auto space-y-2 border border-slate-200 shadow-inner">
              <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">
                NOMOR TIKET PENGADUAN
              </span>
              <div className="text-2xl font-mono font-black text-coffee-dark tracking-wider select-text">
                {ticketNumber}
              </div>
              
              <button
                onClick={handleCopyTicket}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs text-slate-700 font-extrabold rounded-lg shadow-sm border border-slate-200 transition-all cursor-pointer hover:bg-slate-50 active:scale-[0.97]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-black">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Nomor Tiket</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left max-w-md mx-auto flex gap-3 items-start border border-slate-200/80">
              <Info className="w-5 h-5 text-coffee-medium shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800">Informasi Penting</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Harap catat atau salin nomor tiket di atas. Nomor tiket ini berfungsi sebagai bukti pelaporan sah yang dapat digunakan untuk melacak status penanganan berkas pengaduan Anda.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-all cursor-pointer active:scale-[0.97]"
              >
                Buat Pengaduan Lainnya
              </button>
              <Link
                href={`/status?id_tiket=${ticketNumber}`}
                className="px-5 py-3 bg-coffee-dark hover:bg-coffee-medium text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                Lacak Status Laporan
              </Link>
            </div>

          </div>
        )}

      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}