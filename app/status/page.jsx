'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Search, 
  Calendar, 
  MapPin, 
  Tag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  Info,
  HelpCircle,
  Clock3,
  CheckCheck,
  Send
} from 'lucide-react';
import Footer from '../components/Footer';

export default function PengaduanTracking() {
  const [ticketId, setTicketId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Reusable ticket fetching function
  const fetchTicket = async (tid) => {
    if (!tid || !tid.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setComplaint(null);

    try {
      const res = await fetch(`/api/pengaduan/${tid.trim().toUpperCase()}`);
      const data = await res.json();

      if (res.ok) {
        setComplaint(data);
      } else {
        setSearchError(data.error || 'Tiket pengaduan tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      setSearchError('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle manual form search submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTicket(ticketId);
  };

  // Automatic search based on URL query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ticketParam = params.get('id_tiket') || params.get('id');
      if (ticketParam) {
        const uppercaseTicket = ticketParam.trim().toUpperCase();
        setTicketId(uppercaseTicket);
        fetchTicket(uppercaseTicket);
      }
    }
  }, []);

  // Helper untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Logika progress step (0: Pending, 1: Disposisi, 2: Selesai)
  const getProgressStep = (status) => {
    if (status === 'Selesai') return 2;
    if (status === 'Disposisi') return 1;
    return 0;
  };

  const progressStep = complaint ? getProgressStep(complaint.status_laporan) : 0;

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 flex flex-col justify-between py-12 px-4 relative overflow-hidden font-sans select-none">
      
      {/* Neumorphic Soft UI Floating Geometry Elements */}
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-[#e0e5ec] shadow-[16px_16px_32px_#b8bec5,-16px_-16px_32px_#ffffff] pointer-events-none opacity-60 z-0" />
      <div className="absolute bottom-24 -right-16 w-80 h-80 rounded-full bg-[#e0e5ec] shadow-[inset_16px_16px_32px_#b8bec5,inset_-16px_-16px_32px_#ffffff] pointer-events-none opacity-60 z-0" />
      <div className="absolute top-[40%] right-[10%] w-32 h-32 rounded-3xl bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec5,-10px_-10px_20px_#ffffff] rotate-12 pointer-events-none opacity-50 z-0" />

      {/* Main Content Area */}
      <div className="max-w-3xl w-full mx-auto relative z-10 space-y-8 flex-1 flex flex-col justify-center">
        
        {/* Header Branding */}
        <div className="text-center space-y-4">
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
            href="/pengaduan" 
            className="px-4 py-2 bg-[#e0e5ec] text-slate-750 hover:text-slate-850 rounded-xl shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer border border-[#ffffff]/25"
            id="nav-to-form-pengaduan"
          >
            <Send className="w-3.5 h-3.5 text-slate-550" /> Buat Laporan Pengaduan
          </Link>
          <Link 
            href="/" 
            className="px-4 py-2 bg-[#e0e5ec] text-slate-700 hover:text-slate-800 rounded-xl shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec5,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer border border-[#ffffff]/25"
            id="nav-to-home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-550" /> Halaman Utama
          </Link>
        </div>

        {/* Search Ticket Card */}
        <div className="bg-[#e0e5ec] rounded-3xl p-6 md:p-8 shadow-[8px_8px_16px_#b8bec5,-8px_-8px_16px_#ffffff] space-y-6 border border-[#ffffff]/10">
          <div className="border-b border-slate-300/60 pb-4 text-center md:text-left">
            <h2 className="text-lg font-black text-slate-800 flex items-center justify-center md:justify-start gap-2">
              <Search className="w-5 h-5 text-blue-800" /> Lacak Status Pengaduan Warga
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Masukkan Nomor Tiket Pengaduan Anda untuk memantau progres penanganan oleh tim Satpol PP Buleleng.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Contoh: TKT-2026-12345"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full bg-[#e0e5ec] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono tracking-widest text-slate-700 uppercase shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border-none focus:ring-2 focus:ring-blue-850/20"
                  id="ticket-search-input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-[#e28a1c] hover:bg-[#d07b14] active:bg-[#e28a1c] text-white rounded-2xl px-6 py-3.5 text-sm font-extrabold shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-none"
                id="ticket-search-button"
              >
                {searchLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Lacak Tiket
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {searchError && (
            <div className="bg-[#e0e5ec] rounded-2xl p-4 flex items-start gap-3 text-xs shadow-[inset_4px_4px_8px_#e5b8b8,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10 text-red-700" id="search-error-block">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-650" />
              <div>
                <p className="font-black">Pencarian Gagal</p>
                <p className="mt-0.5 text-slate-650 font-semibold">{searchError}</p>
                <p className="mt-2 text-[10px] text-blue-800 font-bold">Pastikan format penulisan nomor tiket Anda benar termasuk tanda hubung (-).</p>
              </div>
            </div>
          )}

          {/* Result Card & Timeline */}
          {complaint && (
            <div className="space-y-6 pt-2 animate-fadeIn animate-duration-500" id="tracking-result-block">
              
              {/* Divider */}
              <div className="border-t border-slate-300/50 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Nomor Resi Pengaduan</span>
                    <h3 className="text-sm md:text-base font-mono font-black text-slate-800 tracking-wide">{complaint.id_tiket}</h3>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#e0e5ec] shadow-[inset_2px_2px_5px_#b8bec5,inset_-2px_-2px_5px_#ffffff] ${
                    complaint.status_laporan === 'Selesai' ? 'text-emerald-700' :
                    complaint.status_laporan === 'Disposisi' ? 'text-blue-800' :
                    'text-orange-700'
                  }`}>
                    Status: {complaint.status_laporan === 'Pending' ? 'Mengantre Verifikasi' : complaint.status_laporan === 'Disposisi' ? 'Dalam Proses / Disposisi' : 'Selesai Ditindaklanjuti'}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-[#e0e5ec] rounded-3xl p-5 md:p-6 space-y-6 shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10 text-left">
                <h4 className="text-xs font-black uppercase text-blue-900 tracking-widest">Garis Waktu Progres Penanganan</h4>
                
                <div className="relative pl-6 md:pl-0 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                  
                  {/* Vertical Line on Mobile, Horizontal on Desktop */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#b8bec5] md:hidden z-0" />
                  
                  {/* Step 1: Pending (Diterima) */}
                  <div className="relative flex flex-col items-start space-y-2 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        progressStep >= 0 ? 'bg-emerald-600 text-white shadow-[2px_2px_4px_#b8bec5]' : 'bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff]'
                      }`}>
                        {progressStep >= 0 && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-xs font-black ${progressStep >= 0 ? 'text-slate-800' : 'text-slate-400'}`}>1. Laporan Diterima</span>
                    </div>
                    <div className="pl-6 text-[11px] text-slate-500 space-y-1 font-semibold">
                      <p className="text-slate-650">Laporan warga masuk ke sistem SIPP-OL.</p>
                      <p className="font-mono text-[9px] text-slate-400">{formatDate(complaint.waktu_kirim)}</p>
                    </div>
                  </div>

                  {/* Step 2: Disposisi (Verifikasi) */}
                  <div className="relative flex flex-col items-start space-y-2 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        progressStep >= 1 ? 'bg-blue-800 text-white shadow-[2px_2px_4px_#b8bec5]' : 'bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff]'
                      }`}>
                        {progressStep >= 1 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Clock3 className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-xs font-black ${progressStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>2. Diverifikasi & Didisposisi</span>
                    </div>
                    <div className="pl-6 text-[11px] text-slate-500 space-y-1 font-semibold">
                      <p className="text-slate-650">Laporan disetujui admin dan ditugaskan ke bidang operasional.</p>
                      {complaint.disposisi ? (
                        <div className="bg-[#e0e5ec] p-2.5 rounded-xl shadow-[inset_2px_2px_5px_#b8bec5,inset_-2px_-2px_5px_#ffffff] mt-1 space-y-0.5 border border-[#ffffff]/15">
                          <p className="text-[10px] text-blue-900 font-black">Disposisi Ke: {complaint.disposisi.bidang_tujuan}</p>
                          <p className="text-[9px] text-slate-500 font-bold">Verifikator: {complaint.disposisi.nama_admin}</p>
                          <p className="text-[9px] italic text-slate-500 font-medium">Catatan: "{complaint.disposisi.catatan}"</p>
                        </div>
                      ) : complaint.status_laporan === 'Disposisi' || complaint.status_laporan === 'Selesai' ? (
                        <p className="text-[10px] text-blue-900 font-black">Disposisi Ke: {complaint.bidang_disposisi || '-'}</p>
                      ) : null}
                      {complaint.disposisi?.waktu_verifikasi && (
                        <p className="font-mono text-[9px] text-slate-400">{formatDate(complaint.disposisi.waktu_verifikasi)}</p>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Selesai */}
                  <div className="relative flex flex-col items-start space-y-2 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        progressStep >= 2 ? 'bg-emerald-600 text-white shadow-[2px_2px_4px_#b8bec5]' : 'bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec5,inset_-2px_-2px_4px_#ffffff]'
                      }`}>
                        {progressStep >= 2 ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Clock3 className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-xs font-black ${progressStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>3. Selesai Ditangani</span>
                    </div>
                    <div className="pl-6 text-[11px] text-slate-500 space-y-1 font-semibold">
                      <p className="text-slate-650">Kasus telah tuntas ditindaklanjuti di lapangan.</p>
                      {complaint.status_laporan === 'Selesai' && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#e0e5ec] text-emerald-700 shadow-[inset_1px_1px_3px_#b8bec5,inset_-1px_-1px_3px_#ffffff] rounded-md text-[9px] font-black uppercase tracking-wider">
                          CLEAR / LUNAS KAS DAERAH
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Detail Laporan Content */}
              <div className="bg-[#e0e5ec] rounded-3xl p-5 md:p-6 space-y-4 shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10 text-left">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-slate-300/40 pb-2">Rincian Informasi Pengaduan</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Nama Pelapor</span>
                    <p className="font-black text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {complaint.is_anonim ? 'Anonim (Dirahasiakan)' : complaint.nama_pelapor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Kategori Pengaduan</span>
                    <p className="font-black text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-800" />
                      {complaint.kategori_masalah}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Waktu Pengiriman</span>
                    <p className="font-black text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(complaint.waktu_kirim)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Koordinat Lokasi (GPS)</span>
                    <p className="font-black text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-800" />
                      {complaint.latitude}, {complaint.longitude}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-300/40 pt-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Deskripsi Kronologi Kejadian</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-line bg-[#e0e5ec] p-3 rounded-2xl shadow-[inset_3px_3px_6px_#b8bec5,inset_-3px_-3px_6px_#ffffff] mt-1 border border-[#ffffff]/10">
                    {complaint.kronologi}
                  </p>
                </div>

                {/* Foto Bukti Kejadian */}
                {complaint.foto_bukti && (
                  <div className="space-y-2 border-t border-slate-300/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Foto Bukti Lampiran</span>
                    <div className="relative max-w-sm rounded-2xl overflow-hidden shadow-[4px_4px_8px_#b8bec5,-4px_-4px_8px_#ffffff] border border-[#ffffff]/20">
                      <img 
                        src={complaint.foto_bukti} 
                        alt="Foto Bukti Kejadian Warga" 
                        className="w-full h-auto object-cover max-h-60"
                      />
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Helpful Info Footer */}
        <div className="bg-[#e0e5ec] rounded-2xl p-4 flex items-start gap-3 text-xs max-w-md mx-auto text-slate-550 shadow-[inset_4px_4px_8px_#b8bec5,inset_-4px_-4px_8px_#ffffff] border border-[#ffffff]/10 text-left font-semibold">
          <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-500">
            Butuh bantuan lebih lanjut terkait pengaduan Anda? Silakan hubungi pusat koordinasi Satpol PP Buleleng di nomor WhatsApp resmi unit pengaduan yustisial.
          </p>
        </div>

      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
