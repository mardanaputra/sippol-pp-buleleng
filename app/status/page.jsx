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
  Send,
  Menu,
  X
} from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden font-sans select-none">
      
      {/* Decorative Elegant Soft Gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-coffee-cream/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[30rem] h-[30rem] bg-coffee-light/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Reusable Navbar Component */}
      <Navbar activePage="status" />

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto px-4 pt-28 pb-12 flex-1 relative z-10 transition-all duration-500 space-y-6">
        
        {/* Search Ticket Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-200 pb-4 text-center md:text-left">
            <h2 className="text-lg font-black text-slate-900 flex items-center justify-center md:justify-start gap-2">
              <Search className="w-5 h-5 text-coffee-medium" /> Lacak Status Pengaduan Warga
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
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono tracking-widest text-foreground uppercase border border-slate-300 focus:ring-2 focus:ring-coffee-medium focus:border-coffee-medium shadow-sm"
                  id="ticket-search-input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-coffee-dark hover:bg-coffee-medium text-white rounded-xl px-6 py-3.5 text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
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
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-700" id="search-error-block">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-black">Pencarian Gagal</p>
                <p className="mt-0.5 text-rose-600 font-semibold">{searchError}</p>
                <p className="mt-2 text-[10px] text-coffee-medium font-bold">Pastikan format penulisan nomor tiket Anda benar termasuk tanda hubung (-).</p>
              </div>
            </div>
          )}

          {/* Result Card & Timeline */}
          {complaint && (
            <div className="space-y-6 pt-2 animate-fadeIn animate-duration-500" id="tracking-result-block">
              
              {/* Divider */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Nomor Resi Pengaduan</span>
                    <h3 className="text-sm md:text-base font-mono font-black text-coffee-dark tracking-wide select-text">{complaint.id_tiket}</h3>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
                    complaint.status_laporan === 'Selesai' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                    complaint.status_laporan === 'Disposisi' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                    'bg-orange-50 border border-orange-200 text-orange-700'
                  }`}>
                    Status: {complaint.status_laporan === 'Pending' ? 'Mengantre Verifikasi' : complaint.status_laporan === 'Disposisi' ? 'Dalam Proses / Disposisi' : 'Selesai Ditindaklanjuti'}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-slate-50 rounded-xl p-5 md:p-6 space-y-6 border border-slate-200/80 text-left">
                <h4 className="text-xs font-black uppercase text-coffee-dark tracking-widest">Garis Waktu Progres Penanganan</h4>
                
                <div className="relative pl-6 md:pl-0 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                  
                  {/* Vertical Line on Mobile, Horizontal on Desktop */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 md:hidden z-0" />
                  
                  {/* Step 1: Pending (Diterima) */}
                  <div className="relative flex flex-col items-start space-y-2 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        progressStep >= 0 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}>
                        {progressStep >= 0 && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-xs font-black ${progressStep >= 0 ? 'text-foreground' : 'text-slate-400'}`}>1. Laporan Diterima</span>
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
                        progressStep >= 1 ? 'bg-coffee-medium text-white shadow-sm' : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}>
                        {progressStep >= 1 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Clock3 className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-xs font-black ${progressStep >= 1 ? 'text-foreground' : 'text-slate-400'}`}>2. Diverifikasi & Didisposisi</span>
                    </div>
                    <div className="pl-6 text-[11px] text-slate-500 space-y-1 font-semibold">
                      <p className="text-slate-650">Laporan disetujui admin dan ditugaskan ke bidang operasional.</p>
                      {complaint.disposisi ? (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 mt-1 space-y-0.5">
                          <p className="text-[10px] text-coffee-dark font-black">Disposisi Ke: {complaint.disposisi.bidang_tujuan}</p>
                          <p className="text-[9px] text-slate-500 font-bold">Verifikator: {complaint.disposisi.nama_admin}</p>
                          <p className="text-[9px] italic text-slate-500 font-medium">Catatan: "{complaint.disposisi.catatan}"</p>
                        </div>
                      ) : complaint.status_laporan === 'Disposisi' || complaint.status_laporan === 'Selesai' ? (
                        <p className="text-[10px] text-coffee-dark font-black">Disposisi Ke: {complaint.bidang_disposisi || '-'}</p>
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
                        progressStep >= 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}>
                        {progressStep >= 2 ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Clock3 className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-xs font-black ${progressStep >= 2 ? 'text-foreground' : 'text-slate-400'}`}>3. Selesai Ditangani</span>
                    </div>
                    <div className="pl-6 text-[11px] text-slate-500 space-y-1 font-semibold">
                      <p className="text-slate-650">Kasus telah tuntas ditindaklanjuti di lapangan.</p>
                      {complaint.status_laporan === 'Selesai' && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-wider">
                          CLEAR / LUNAS KAS DAERAH
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Detail Laporan Content */}
              <div className="bg-slate-50 rounded-xl p-5 md:p-6 space-y-4 border border-slate-200/80 text-left">
                <h4 className="text-xs font-black uppercase text-slate-550 tracking-widest border-b border-slate-200 pb-2">Rincian Informasi Pengaduan</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Nama Pelapor</span>
                    <p className="font-black text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {complaint.is_anonim ? 'Anonim (Dirahasiakan)' : complaint.nama_pelapor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Kategori Pengaduan</span>
                    <p className="font-black text-foreground flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-coffee-medium" />
                      {complaint.kategori_masalah}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Waktu Pengiriman</span>
                    <p className="font-black text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(complaint.waktu_kirim)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Koordinat Lokasi (GPS)</span>
                    <p className="font-black text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-coffee-medium" />
                      {complaint.latitude}, {complaint.longitude}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-200 pt-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Deskripsi Kronologi Kejadian</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200 mt-1">
                    {complaint.kronologi}
                  </p>
                </div>

                {/* Foto Bukti Kejadian */}
                {complaint.foto_bukti && (
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Foto Bukti Lampiran</span>
                    <div className="relative max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-sm">
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
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs max-w-md mx-auto text-slate-600 text-left font-semibold shadow-sm">
          <Info className="w-5 h-5 text-coffee-medium shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-550">
            Butuh bantuan lebih lanjut terkait pengaduan Anda? Silakan hubungi pusat koordinasi Satpol PP Buleleng di nomor WhatsApp resmi unit pengaduan yustisial.
          </p>
        </div>

      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

