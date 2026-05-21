'use client';

import React, { useState, useRef } from 'react';
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
  HelpCircle
} from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Blur Gradients */}
      <div className="bg-indigo-500/10 w-[30rem] h-[30rem] rounded-full blur-[120px] absolute -top-24 -right-24 pointer-events-none z-0" />
      <div className="bg-emerald-500/10 w-[30rem] h-[30rem] rounded-full blur-[120px] absolute -bottom-24 -left-24 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-2xl w-full relative z-10 transition-all duration-500">
        
        {/* Header Branding */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner text-indigo-400">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
              SIPP-OL PP BULELENG
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium">
              Sistem Informasi Pelayanan & Pengaduan Online Satpol PP Kab. Buleleng
            </p>
          </div>
        </div>

        {/* Conditional Screen View */}
        {!isSubmitted ? (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                Formulir Pengaduan Masyarakat
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Silakan isi data laporan Anda di bawah ini dengan lengkap dan jujur. Informasi Anda dilindungi hukum.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Box Anonimitas */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-300">
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
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-indigo-400 select-none">
                      Kirim Sebagai Anonim (Nama disembunyikan)
                    </span>
                  </label>
                </div>
              </div>

              {/* Nama Pelapor */}
              {!formData.isAnonim && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Nama Pelapor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap sesuai KTP"
                    value={formData.namaPelapor}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, namaPelapor: e.target.value }));
                      if (errors.namaPelapor) setErrors(prev => ({ ...prev, namaPelapor: null }));
                    }}
                    className={`w-full bg-slate-950/70 border ${errors.namaPelapor ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                  />
                  {errors.namaPelapor && (
                    <p className="text-rose-400 text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.namaPelapor}
                    </p>
                  )}
                </div>
              )}

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.nomorWhatsapp}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, nomorWhatsapp: e.target.value }));
                    if (errors.nomorWhatsapp) setErrors(prev => ({ ...prev, nomorWhatsapp: null }));
                  }}
                  className={`w-full bg-slate-950/70 border ${errors.nomorWhatsapp ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                />
                {errors.nomorWhatsapp ? (
                  <p className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.nomorWhatsapp}
                  </p>
                ) : (
                  <p className="text-slate-500 text-[10px]">
                    Nomor WhatsApp dibutuhkan agar petugas dapat berkoordinasi dan memvalidasi laporan Anda.
                  </p>
                )}
              </div>

              {/* Kategori Masalah */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Kategori Laporan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.kategoriMasalah}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, kategoriMasalah: e.target.value }));
                    if (errors.kategoriMasalah) setErrors(prev => ({ ...prev, kategoriMasalah: null }));
                  }}
                  className={`w-full bg-slate-950/70 border ${errors.kategoriMasalah ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 text-slate-300 cursor-pointer`}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">-- Pilih Kategori Masalah --</option>
                  <option value="Bidang Ketertiban Umum" className="bg-slate-900 text-slate-200">Ketertiban Umum (PKL Liar, Reklame Ilegal, Kebisingan, dsb.)</option>
                  <option value="Bidang Penegakan Perda" className="bg-slate-900 text-slate-200">Pelanggaran Perda (Izin Usaha, Konstruksi Liar, Limbah, dsb.)</option>
                  <option value="Bidang Linmas" className="bg-slate-900 text-slate-200">Perlindungan Masyarakat (Linmas, Bencana, Gangguan Warga, dsb.)</option>
                  <option value="Bidang Peningkatan SDM" className="bg-slate-900 text-slate-200">SDM & Sarana (Pengembangan Kapasitas, Aduan Petugas, dsb.)</option>
                  <option value="Lainnya" className="bg-slate-900 text-slate-200">Masalah Lainnya</option>
                </select>
                {errors.kategoriMasalah && (
                  <p className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.kategoriMasalah}
                  </p>
                )}
              </div>

              {/* Kronologi */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Kronologi Kejadian <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Deskripsikan secara detail: Apa kejadiannya? Siapa pelakunya (jika tahu)? Kapan terjadi? Bagaimana kronologi lengkapnya?"
                  value={formData.kronologi}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, kronologi: e.target.value }));
                    if (errors.kronologi) setErrors(prev => ({ ...prev, kronologi: null }));
                  }}
                  className={`w-full bg-slate-950/70 border ${errors.kronologi ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 resize-y`}
                />
                {errors.kronologi ? (
                  <p className="text-rose-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.kronologi}
                  </p>
                ) : (
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Min. 20 karakter untuk deskripsi detail.</span>
                    <span>{formData.kronologi.length} karakter</span>
                  </div>
                )}
              </div>

              {/* Lokasi Kejadian (Latitude, Longitude) */}
              <div className="space-y-3 bg-slate-950/30 p-4 rounded-xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/50 pb-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokasi Geografis (GPS) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="px-3 py-1 bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <MapPin className={`w-3.5 h-3.5 ${locationLoading ? 'animate-bounce' : ''}`} />
                    {locationLoading ? "Mendapatkan Koordinat..." : "Dapatkan Lokasi Saya"}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 mb-1 block">Latitude</label>
                    <input
                      type="text"
                      placeholder="Contoh: -8.114712"
                      value={formData.latitude}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, latitude: e.target.value }));
                        if (errors.lokasi) setErrors(prev => ({ ...prev, lokasi: null }));
                      }}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 mb-1 block">Longitude</label>
                    <input
                      type="text"
                      placeholder="Contoh: 115.090124"
                      value={formData.longitude}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, longitude: e.target.value }));
                        if (errors.lokasi) setErrors(prev => ({ ...prev, lokasi: null }));
                      }}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                
                {errors.lokasi && (
                  <p className="text-rose-400 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.lokasi}
                  </p>
                )}
              </div>

              {/* Upload Foto Bukti */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" /> Foto Bukti Kejadian <span className="text-slate-500">(Opsional)</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
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
                      className="flex flex-col items-center justify-center p-6 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 border-dashed rounded-xl cursor-pointer hover:border-indigo-500/50 transition-all text-center group"
                    >
                      <Camera className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" />
                      <span className="text-xs font-bold text-slate-300">Pilih Foto</span>
                      <span className="text-[10px] text-slate-500 mt-1">PNG, JPG (Maks. 2MB)</span>
                    </label>
                  </div>
                  
                  {/* Image Preview Box */}
                  <div className="h-28 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
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
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600/90 text-white rounded-lg hover:bg-rose-500 transition-colors shadow"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-600 italic">Belum ada foto terpilih</span>
                    )}
                  </div>
                </div>
                
                {errors.foto && (
                  <p className="text-rose-400 text-[11px] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.foto}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg shadow-indigo-950/50 hover:shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99] z-10"
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
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-fade-in relative overflow-hidden">
            
            {/* Glowing success top gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
            
            <div className="inline-flex p-4 bg-emerald-600/10 border border-emerald-500/30 rounded-full text-emerald-400 mx-auto">
              <Check className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-100">
                PENGADUAN BERHASIL TERKIRIM!
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
                Terima kasih atas kepedulian Anda. Laporan telah tercatat secara resmi di basis data Satpol PP Kabupaten Buleleng.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 max-w-sm mx-auto space-y-2 relative shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                NOMOR TIKET PENGADUAN
              </span>
              <div className="text-2xl font-mono font-black text-indigo-400 tracking-wider">
                {ticketNumber}
              </div>
              
              <button
                onClick={handleCopyTicket}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 rounded border border-slate-800/80 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Nomor Tiket</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950/30 border border-slate-800/50 p-4 rounded-xl text-left max-w-md mx-auto flex gap-3 items-start">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Informasi Penting</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Harap catat atau salin nomor tiket di atas. Nomor tiket ini berfungsi sebagai bukti pelaporan sah yang dapat digunakan untuk melacak status penanganan berkas pengaduan Anda.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Buat Pengaduan Lainnya
              </button>
              <a
                href="/admin/dashboard"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
              >
                Ke Dashboard Admin
              </a>
            </div>

          </div>
        )}

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-600 mt-8 relative z-10 font-medium">
          &copy; 2026 Satuan Polisi Pamong Praja Kabupaten Buleleng. All Rights Reserved.
        </p>

      </div>
    </div>
  );
}