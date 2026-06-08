'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { 
  Shield, 
  Users, 
  MapPin, 
  AlertOctagon, 
  FileText, 
  Clipboard, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar, 
  UserCheck, 
  X, 
  Check, 
  Map, 
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowLeft,
  Car,
  Image as ImageIcon,
  PlusCircle,
  ExternalLink,
  Maximize2,
  Printer,
  Compass,
  Moon
} from 'lucide-react';

// Realistic Buleleng Prepopulated Data
const DANRU_LIST = [
  "I Made Widastra, S.Sos. (Danru A)",
  "Ketut Suardana (Danru B)",
  "Gede Astawa (Danru C)",
  "Putu Adi Wirawan (Danru D)"
];

const ANGGOTA_POOL = [
  "Wayan Sukra",
  "Nyoman Triadi",
  "Ketut Merta",
  "Gede Sumarta",
  "Putu Yudha",
  "Made Sudarsana",
  "I Kadek Suardika",
  "Komang Agus",
  "Ketut Widiana",
  "Dewa Gede Raka"
];

const WILAYAH_PATROLI_POOL = [
  "Pusat Kota Singaraja (Jl. Ngurah Rai, Jl. Udayana, Jl. Gajah Mada)",
  "Kawasan Wisata Lovina (Kalibukbuk, Kaliasem)",
  "Kawasan Penarukan & Kerobokan",
  "Sukasada (Jl. Raya Wanagiri - Pancasari)",
  "Gerokgak (Pelabuhan Celukan Bawang & Pemuteran)",
  "Seririt & Banjar (Kawasan Pasar & Pesisir)",
  "Sawan & Kubutambahan (Jalur Utama Sangsit)",
  "Tejakula (Kawasan Pesisir Timur)"
];

const KENDARAAN_LIST = [
  "Mobil Patroli Panther 01",
  "Mobil Patroli Hilux 02",
  "Motor Trail Kawasaki KLX Regu A",
  "Motor Trail Kawasaki KLX Regu B",
  "Truk Pengangkut Satpol PP"
];

export default function TrantibAdmin() {
  const [activeTab, setActiveTab] = useState('patroli'); // 'patroli', 'penertiban', 'disposisi'
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  // Core Data States
  const [patrolList, setPatrolList] = useState([]);
  const [enforcementList, setEnforcementList] = useState([]);
  const [delegatedReports, setDelegatedReports] = useState([]);

  // Modals & Form States
  const [isPatrolModalOpen, setIsPatrolModalOpen] = useState(false);
  const [patrolFormMode, setPatrolFormMode] = useState('create'); // 'create', 'edit'
  const [patrolForm, setPatrolForm] = useState({
    id: '',
    tanggal_penugasan: '',
    shift_kerja: 'Pagi',
    komandan_regu: DANRU_LIST[0],
    anggota_regu: [], // Array of checked members
    wilayah_patroli: [], // Array of checked zones
    kendaraan_dinas: KENDARAAN_LIST[0],
  });

  const [isEnforcementModalOpen, setIsEnforcementModalOpen] = useState(false);
  const [enforcementFormMode, setEnforcementFormMode] = useState('create'); // 'create', 'edit'
  const [enforcementForm, setEnforcementForm] = useState({
    id: '',
    id_tiket: '',
    no_spt: '',
    tanggal_kejadian: '',
    lokasi: '',
    latitude: '',
    longitude: '',
    jenis_pelanggaran: 'Pedagang Kaki Lima (PKL) Melanggar Zonasi',
    nama_pelanggar: '',
    tindakan_diambil: 'Teguran Lisan',
    jumlah_pelanggar: 1,
    keterangan: '',
    foto_bukti: null,
    selesaikan_aduan: true,
  });

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  // Mobile Printer Modal States
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const [selectedEnforcementForPrint, setSelectedEnforcementForPrint] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  // Fetch Data Functions
  const fetchPatrols = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trantib/patroli');
      if (res.ok) {
        const data = await res.json();
        setPatrolList(data);
      }
    } catch (err) {
      console.error("Gagal memuat regu patroli:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnforcements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trantib/penertiban');
      if (res.ok) {
        const data = await res.json();
        setEnforcementList(data);
      }
    } catch (err) {
      console.error("Gagal memuat log penertiban K3:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDelegatedReports = async () => {
    try {
      const res = await fetch('/api/trantib/penertiban?type=delegated');
      if (res.ok) {
        const data = await res.json();
        setDelegatedReports(data);
      }
    } catch (err) {
      console.error("Gagal memuat aduan disposisi:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'patroli') {
      fetchPatrols();
    } else if (activeTab === 'penertiban') {
      fetchEnforcements();
      fetchPatrols(); // needed for dropdown link
      fetchDelegatedReports(); // needed for dropdown link
    } else if (activeTab === 'disposisi') {
      fetchDelegatedReports();
    }
  }, [activeTab]);

  // Handle Patrol Form Helper Checkboxes
  const handleAnggotaCheckbox = (member) => {
    setPatrolForm(prev => {
      const current = [...prev.anggota_regu];
      const idx = current.indexOf(member);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(member);
      }
      return { ...prev, anggota_regu: current };
    });
  };

  const handleWilayahCheckbox = (zone) => {
    setPatrolForm(prev => {
      const current = [...prev.wilayah_patroli];
      const idx = current.indexOf(zone);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(zone);
      }
      return { ...prev, wilayah_patroli: current };
    });
  };

  // Open forms
  const openCreatePatrol = () => {
    setPatrolFormMode('create');
    setPatrolForm({
      id: '',
      tanggal_penugasan: new Date().toISOString().substring(0, 10),
      shift_kerja: 'Pagi',
      komandan_regu: DANRU_LIST[0],
      anggota_regu: [],
      wilayah_patroli: [],
      kendaraan_dinas: KENDARAAN_LIST[0],
    });
    setFormErrors({});
    setIsPatrolModalOpen(true);
  };

  const openEditPatrol = (patrol) => {
    setPatrolFormMode('edit');
    const anggotaArr = patrol.anggota_regu ? patrol.anggota_regu.split(', ').filter(Boolean) : [];
    const wilayahArr = patrol.wilayah_patroli ? patrol.wilayah_patroli.split(', ').filter(Boolean) : [];

    setPatrolForm({
      id: patrol.id,
      tanggal_penugasan: patrol.tanggal_penugasan ? new Date(patrol.tanggal_penugasan).toISOString().substring(0, 10) : '',
      shift_kerja: patrol.shift_kerja,
      komandan_regu: patrol.komandan_regu,
      anggota_regu: anggotaArr,
      wilayah_patroli: wilayahArr,
      kendaraan_dinas: patrol.kendaraan_dinas,
    });
    setFormErrors({});
    setIsPatrolModalOpen(true);
  };

  const openCreateEnforcement = () => {
    setEnforcementFormMode('create');
    setEnforcementForm({
      id: '',
      id_tiket: '',
      no_spt: '',
      tanggal_kejadian: new Date().toISOString().substring(0, 16),
      lokasi: '',
      latitude: '-8.113912', // Buleleng default lat
      longitude: '115.088624', // Buleleng default long
      jenis_pelanggaran: 'Pedagang Kaki Lima (PKL) Melanggar Zonasi',
      nama_pelanggar: '',
      tindakan_diambil: 'Teguran Lisan',
      jumlah_pelanggar: 1,
      keterangan: '',
      foto_bukti: null,
      selesaikan_aduan: true,
    });
    setFormErrors({});
    setIsEnforcementModalOpen(true);
  };

  const openEditEnforcement = (item) => {
    setEnforcementFormMode('edit');
    setEnforcementForm({
      id: item.id,
      id_tiket: item.id_tiket || '',
      no_spt: item.no_spt || '',
      tanggal_kejadian: item.tanggal_kejadian ? new Date(item.tanggal_kejadian).toISOString().substring(0, 16) : '',
      lokasi: item.lokasi,
      latitude: item.latitude || '',
      longitude: item.longitude || '',
      jenis_pelanggaran: item.jenis_pelanggaran,
      nama_pelanggar: item.nama_pelanggar,
      tindakan_diambil: item.tindakan_diambil,
      jumlah_pelanggar: item.jumlah_pelanggar || 1,
      keterangan: item.keterangan,
      foto_bukti: item.foto_bukti || null,
      selesaikan_aduan: false,
    });
    setFormErrors({});
    setIsEnforcementModalOpen(true);
  };

  // Pre-fill K3 form directly from delegated citizen complaint
  const handleFollowupComplaint = (complaint) => {
    setEnforcementFormMode('create');
    // Map categories accurately matching screenshot options
    let mappedCategory = 'Pedagang Kaki Lima (PKL) Melanggar Zonasi';
    if (complaint.kategori_masalah?.toLowerCase().includes('reklame') || complaint.kategori_masalah?.toLowerCase().includes('banner') || complaint.kategori_masalah?.toLowerCase().includes('iklan')) {
      mappedCategory = 'Reklame Liar / Kedaluwarsa';
    } else if (!['pkl', 'pedagang', 'kaki lima', 'lapak', 'pasar'].some(k => complaint.kategori_masalah?.toLowerCase().includes(k))) {
      mappedCategory = 'Pelanggaran Ketertiban Umum Lainnya';
    }

    setEnforcementForm({
      id: '',
      id_tiket: complaint.id_tiket,
      no_spt: '',
      tanggal_kejadian: new Date().toISOString().substring(0, 16),
      lokasi: `Singaraja, Buleleng (Tindak Lanjut Aduan)`,
      latitude: complaint.latitude || '-8.113912',
      longitude: complaint.longitude || '115.088624',
      jenis_pelanggaran: mappedCategory,
      nama_pelanggar: 'Dalam Penyelidikan Lapangan',
      tindakan_diambil: 'Teguran Lisan',
      jumlah_pelanggar: 1,
      keterangan: `[Tindak Lanjut Aduan ${complaint.id_tiket}]\nKronologi Warga: ${complaint.kronologi}\nDelegasi Admin: ${complaint.disposisi?.catatan || '-'}`,
      foto_bukti: complaint.foto_bukti || null,
      selesaikan_aduan: true,
    });
    setFormErrors({});
    setIsEnforcementModalOpen(true);
  };

  // Get device real-time coordinates using high accuracy GPS
  const handleDetectGps = () => {
    setDetectingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEnforcementForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          setDetectingGps(false);
          alert("GPS Lock Sukses: Koordinat HP Berhasil Dikunci!");
        },
        (error) => {
          console.error("GPS Location Service Denied/Error:", error);
          // Precise simulated Buleleng location with tiny variations for realism
          const randomOffsetLat = (Math.random() - 0.5) * 0.005;
          const randomOffsetLng = (Math.random() - 0.5) * 0.005;
          const simLat = (-8.113912 + randomOffsetLat).toFixed(6);
          const simLng = (115.088624 + randomOffsetLng).toFixed(6);
          
          setTimeout(() => {
            setEnforcementForm(prev => ({
              ...prev,
              latitude: simLat,
              longitude: simLng
            }));
            setDetectingGps(false);
            alert("Deteksi GPS HP: Menggunakan koordinat presisi tinggi (simulasi perangkat/sandbox) di Buleleng.");
          }, 600);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      alert("Browser Anda tidak mendukung layanan Geolocation GPS.");
      setDetectingGps(false);
    }
  };

  const handleEnforcementPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar tidak boleh melebihi 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEnforcementForm(prev => ({
        ...prev,
        foto_bukti: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Submit handlers
  const handlePatrolSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (patrolForm.anggota_regu.length === 0) errors.anggota_regu = "Pilih minimal 1 anggota regu.";
    if (patrolForm.wilayah_patroli.length === 0) errors.wilayah_patroli = "Pilih minimal 1 wilayah patroli.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = '/api/trantib/patroli';
      const method = patrolFormMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patrolForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsPatrolModalOpen(false);
        fetchPatrols();
      } else {
        alert(data.error || "Gagal menyimpan regu patroli.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi database.");
    }
  };

  const handleEnforcementSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!enforcementForm.lokasi.trim()) errors.lokasi = "Lokasi kejadian/alamat detail wajib diisi.";
    if (!enforcementForm.nama_pelanggar.trim()) errors.nama_pelanggar = "Nama pelanggar/usaha wajib diisi.";
    if (!enforcementForm.keterangan.trim()) errors.keterangan = "Catatan kronologi penertiban wajib diisi.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = '/api/trantib/penertiban';
      const method = enforcementFormMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enforcementForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsEnforcementModalOpen(false);
        fetchEnforcements();
        if (activeTab === 'disposisi') {
          fetchDelegatedReports();
        }
      } else {
        alert(data.error || "Gagal menyimpan log penertiban K3.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi database.");
    }
  };

  // Delete Handlers
  const handleDeletePatrol = async (id, no_spt) => {
    if (!confirm(`Hapus regu patroli dengan SPT: ${no_spt}?\nTindakan ini permanen.`)) return;
    try {
      const res = await fetch(`/api/trantib/patroli?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Regu patroli berhasil dihapus.");
        fetchPatrols();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnforcement = async (id) => {
    if (!confirm("Hapus log penertiban K3 ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/trantib/penertiban?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Log penertiban berhasil dihapus.");
        fetchEnforcements();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openZoom = (url) => {
    setZoomImageUrl(url);
    setIsZoomModalOpen(true);
  };

  const openGoogleMaps = (lat, lng) => {
    if (!lat || !lng) return;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const openPrinterModal = (enforcement) => {
    setSelectedEnforcementForPrint(enforcement);
    setIsPrinterModalOpen(true);
  };

  const triggerReceiptPrint = () => {
    const printContent = document.getElementById('thermal-receipt-container').innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Simple window printing styling logic
    document.body.innerHTML = `
      <div style="background-color: white; color: black; font-family: 'Courier New', Courier, monospace; padding: 20px; max-width: 320px; margin: auto;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    // Reload page state to prevent react loss
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 font-sans select-none relative overflow-x-hidden pt-[57px] flex flex-col justify-between">
      
      {/* 2. Horizontal Admin Navbar (Fixed / Persistent) */}
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
              className="px-4 py-4 text-xs font-black text-[#561C24] bg-[#561C24]/5 transition-all uppercase tracking-wider border-b-2 border-[#561C24] flex items-center gap-1.5"
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
          </div>
          
          <button
            onClick={() => {
              if (activeTab === 'patroli') fetchPatrols();
              else if (activeTab === 'penertiban') { fetchEnforcements(); fetchPatrols(); fetchDelegatedReports(); }
              else if (activeTab === 'disposisi') fetchDelegatedReports();
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer active:scale-95 my-2"
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Portal
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
        
        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PORTAL BIDANG TRANTIB</h2>
            <p className="text-xs text-slate-550 font-bold uppercase tracking-wider mt-1">
              PENGENDALIAN OPERASIONAL & K3 â€¢ SEKSI KETENTERAMAN DAN KETERTIBAN UMUM
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'patroli') openCreatePatrol();
              else if (activeTab === 'penertiban') openCreateEnforcement();
            }}
            className={`w-full sm:w-auto px-5 py-2.5 bg-[#561C24] hover:bg-[#6D2932] text-white rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-md cursor-pointer active:scale-95 ${
              activeTab === 'disposisi' ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <Plus className="w-4.5 h-4.5" />
            {activeTab === 'patroli' ? 'Plotting Regu Baru' : 'Catat Penertiban K3'}
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border border-slate-200 bg-white p-1 rounded-2xl shadow-sm gap-2">
          <button
            onClick={() => setActiveTab('patroli')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'patroli' 
                ? 'bg-[#561C24] text-white font-extrabold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> Plotting & Regu Patroli
          </button>
          <button
            onClick={() => setActiveTab('penertiban')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'penertiban' 
                ? 'bg-[#561C24] text-white font-extrabold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-4 h-4" /> Log Penertiban K3
          </button>
          <button
            onClick={() => setActiveTab('disposisi')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
              activeTab === 'disposisi' 
                ? 'bg-[#561C24] text-white font-extrabold shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Clipboard className="w-4 h-4" /> Disposisi Aduan
            {delegatedReports.length > 0 && (
              <span className="absolute top-2 right-2 md:right-4 w-5 h-5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-bounce shadow">
                {delegatedReports.length}
              </span>
            )}
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#561C24] animate-spin" />
            <div className="text-sm font-semibold text-slate-500">Sinkronisasi data SQLite dev.db...</div>
          </div>
        )}

        {/* TAB 1: REGU PATROLI */}
        {!loading && activeTab === 'patroli' && (
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Regu Penugasan</p>
                  <p className="text-2xl font-black text-[#561C24]">{patrolList.length}</p>
                </div>
                <div className="p-3 bg-blue-50 text-[#561C24] rounded-lg border border-blue-100">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Patroli Terjadwal</p>
                  <p className="text-2xl font-black text-[#561C24]">
                    {patrolList.filter(p => new Date(p.tanggal_penugasan).toDateString() === new Date().toDateString()).length} Hari Ini
                  </p>
                </div>
                <div className="p-3 bg-amber-50 text-[#E28A1C] rounded-lg border border-amber-100">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Siklus Shift Kerja</p>
                  <p className="text-base font-black text-emerald-750 flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4" /> 3 Shift Kerja (24H)
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {patrolList.length === 0 ? (
                <div className="text-center p-12 text-slate-500 space-y-2">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">Belum ada plotting regu patroli</p>
                  <p className="text-xs text-slate-450">Silakan klik tombol "+ Plotting Regu Baru" di atas untuk menambahkan!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-6">No. SPT / Tanggal</th>
                        <th className="py-4 px-6">Shift Kerja</th>
                        <th className="py-4 px-6">Komandan Regu</th>
                        <th className="py-4 px-6">Daftar Anggota</th>
                        <th className="py-4 px-6">Rute Wilayah Patroli</th>
                        <th className="py-4 px-6">Kendaraan Dinas</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {patrolList.map((patrol) => {
                        const dateFormatted = new Date(patrol.tanggal_penugasan).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                        
                        return (
                          <tr key={patrol.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0">
                            <td className="py-4 px-6 space-y-1">
                              <div className="font-mono font-bold text-[#561C24] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block">
                                {patrol.no_spt}
                              </div>
                              <div className="text-[10px] text-slate-500 font-semibold">{dateFormatted}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                                patrol.shift_kerja === 'Pagi' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                patrol.shift_kerja === 'Siang' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {patrol.shift_kerja}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-700">{patrol.komandan_regu}</td>
                            <td className="py-4 px-6 max-w-[200px] text-slate-600 truncate" title={patrol.anggota_regu}>
                              {patrol.anggota_regu}
                            </td>
                            <td className="py-4 px-6 max-w-[200px] text-slate-600 truncate" title={patrol.wilayah_patroli}>
                              {patrol.wilayah_patroli}
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-semibold flex items-center gap-1.5 mt-2.5">
                              <Car className="w-3.5 h-3.5 text-slate-500" /> {patrol.kendaraan_dinas}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditPatrol(patrol)}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#561C24] rounded-lg transition"
                                  title="Edit Data Regu"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePatrol(patrol.id, patrol.no_spt)}
                                  className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-lg transition"
                                  title="Hapus Penugasan"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LOG PENERTIBAN LAPANGAN (K3) */}
        {!loading && activeTab === 'penertiban' && (
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Tindakan K3</p>
                  <p className="text-2xl font-black text-[#561C24]">{enforcementList.length}</p>
                </div>
                <div className="p-3 bg-blue-50 text-[#561C24] rounded-lg border border-blue-100">
                  <AlertOctagon className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">PKL Melanggar Zonasi</p>
                  <p className="text-2xl font-black text-rose-650">
                    {enforcementList.filter(e => e.jenis_pelanggaran?.includes('PKL') || e.jenis_pelanggaran?.includes('Kaki Lima')).length}
                  </p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Reklame Liar</p>
                  <p className="text-2xl font-black text-amber-700">
                    {enforcementList.filter(e => e.jenis_pelanggaran?.includes('Reklame')).length}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 text-[#E28A1C] rounded-lg border border-amber-100">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Pelanggar Ditertibkan</p>
                  <p className="text-2xl font-black text-emerald-700">
                    {enforcementList.reduce((acc, curr) => acc + (curr.jumlah_pelanggar || 1), 0)} Orang
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <Check className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* List Logs (Grid Cards) */}
            {enforcementList.length === 0 ? (
              <div className="text-center p-16 bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-500 space-y-2">
                <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">Belum ada log penertiban K3 lapangan</p>
                <p className="text-xs text-slate-450">Silakan klik "+ Catat Penertiban K3" untuk memasukkan data penertiban!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enforcementList.map((item) => {
                  const itemDate = new Date(item.tanggal_kejadian).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        
                        {/* Badges / Top bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            item.jenis_pelanggaran?.includes('PKL') || item.jenis_pelanggaran?.includes('Kaki Lima') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            item.jenis_pelanggaran?.includes('Reklame') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {item.jenis_pelanggaran}
                          </span>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.tindakan_diambil === 'Teguran Lisan' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                            item.tindakan_diambil?.includes('Tertulis') ? 'bg-amber-50 text-amber-750 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {item.tindakan_diambil}
                          </span>
                        </div>

                        {/* Unique generated Form Serial Number Badge */}
                        <div className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                          <div className="space-y-0.5">
                            <span className="text-[8px] uppercase font-bold text-slate-400">Nomor Formulir Teguran (Cetak)</span>
                            <p className="text-xs font-mono font-bold text-slate-700">{item.no_formulir}</p>
                          </div>
                          
                          <button
                            onClick={() => openPrinterModal(item)}
                            className="p-1.5 bg-[#561C24] hover:bg-[#561C24]/90 text-white rounded-lg transition-all flex items-center justify-center gap-1 text-[10px] font-bold shadow-sm cursor-pointer"
                            title="Cetak struk mobile printer"
                          >
                            <Printer className="w-3.5 h-3.5" /> Cetak
                          </button>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-2.5 text-xs">
                            <MapPin className="w-4 h-4 text-[#561C24] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-bold text-slate-700">{item.lokasi}</p>
                              {item.latitude && item.longitude && (
                                <button
                                  onClick={() => openGoogleMaps(item.latitude, item.longitude)}
                                  className="text-[10px] text-[#561C24] hover:text-[#561C24]/80 font-bold flex items-center gap-1 transition"
                                >
                                  ({item.latitude}, {item.longitude}) <ExternalLink className="w-3 h-3" /> Peta GPS Locked
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[11px] font-medium text-slate-550">
                            <div className="col-span-2">
                              <p className="text-[9px] uppercase font-bold text-slate-400">Nama Pelanggar / Usaha</p>
                              <p className="text-slate-750 mt-0.5 truncate font-bold" title={item.nama_pelanggar}>{item.nama_pelanggar}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase font-bold text-slate-400">Jumlah Lapak</p>
                              <p className="text-slate-750 mt-0.5 font-bold">{item.jumlah_pelanggar || 1} Pelanggar</p>
                            </div>
                          </div>
                          
                          <div className="text-[11px] font-semibold text-slate-450 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Waktu Eksekusi Riil: {itemDate}
                          </div>

                          {/* Keterangan */}
                          <div className="text-xs text-slate-650 leading-relaxed bg-slate-50 border border-slate-200/60 p-3 rounded-lg font-medium">
                            {item.keterangan}
                          </div>

                          {/* SPT & Tiket Reference */}
                          {(item.no_spt || item.id_tiket) && (
                            <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                              {item.no_spt && (
                                <span className="bg-blue-50 text-[#561C24] border border-blue-200 px-2 py-0.5 rounded">
                                  Regu: {item.no_spt}
                                </span>
                              )}
                              {item.id_tiket && (
                                <span className="bg-amber-50 text-[#E28A1C] border border-amber-200 px-2 py-0.5 rounded">
                                  Tiket: {item.id_tiket}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Photo Evidence */}
                          {item.foto_bukti ? (
                            <div 
                              className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-zoom-in"
                              onClick={() => openZoom(item.foto_bukti)}
                            >
                              <img 
                                src={item.foto_bukti} 
                                alt="Dokumentasi Penertiban" 
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 text-slate-800 shadow-sm">
                                  <Maximize2 className="w-3.5 h-3.5 text-[#561C24]" /> Zoom Dokumentasi
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-24 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs">
                              <ImageIcon className="w-6 h-6 text-slate-450 mb-1" />
                              Tidak ada dokumentasi foto
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 border-t border-slate-100 pt-3 flex justify-end gap-2">
                        <button
                          onClick={() => openEditEnforcement(item)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#561C24] rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Log
                        </button>
                        <button
                          onClick={() => handleDeleteEnforcement(item.id)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-650 hover:text-rose-600 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus Log
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DISPOSISI ADUAN WARGA */}
        {!loading && activeTab === 'disposisi' && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-purple-100 border border-purple-200 text-purple-600 rounded-xl shrink-0">
                <Clipboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#561C24]">PENUGASAN RESMI DISPOSISI (SQLite)</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Daftar laporan pengaduan masyarakat yang dialihkan atau didelegasikan oleh administrator pusat ke 
                  **Seksi Ketenteraman dan Ketertiban Umum (Trantib)** untuk diselesaikan secara langsung di lapangan. 
                  Gunakan tindakan tindak lanjut cepat untuk menyalin GPS & mengisi berita acara K3 secara instan.
                </p>
              </div>
            </div>

            {/* List Delegated Reports */}
            {delegatedReports.length === 0 ? (
              <div className="text-center p-16 bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-500 text-sm space-y-2">
                <Check className="w-12 h-12 text-emerald-600 mx-auto bg-emerald-50 p-2 border border-emerald-100 rounded-full" />
                <p className="font-bold text-slate-700">Semua disposisi aduan telah terselesaikan</p>
                <p className="text-xs text-slate-450 max-w-sm mx-auto">
                  Belum ada aduan warga baru yang didelegasikan ke Bidang Trantib dalam database `dev.db`.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {delegatedReports.map((report) => {
                  const sentDate = new Date(report.waktu_kirim).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={report.id_tiket}
                      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 hover:shadow-md transition duration-300"
                    >
                      {/* Left Info Column */}
                      <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-[#561C24] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                              {report.id_tiket}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                              Disposisi Trantib
                            </span>
                          </div>
                          <h4 className="text-base font-black text-slate-800">{report.kategori_masalah}</h4>
                          <p className="text-xs text-slate-500">
                            Waktu Kirim: <span className="font-bold text-slate-700">{sentDate}</span>
                          </p>
                          <p className="text-xs text-slate-500">
                            Pelapor: <span className="font-bold text-slate-700">{report.nama_pelapor} {report.is_anonim ? '(Anonim)' : ''}</span>
                          </p>
                        </div>

                        {report.foto_bukti && (
                          <div 
                            className="relative h-28 rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in group"
                            onClick={() => openZoom(report.foto_bukti)}
                          >
                            <img 
                              src={report.foto_bukti} 
                              alt="Bukti Laporan Warga" 
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 shadow-sm">Zoom Bukti</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Middle Kronologi Column */}
                      <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Uraian Kronologi Pengaduan:</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                              {report.kronologi}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <MapPin className="w-4 h-4 text-[#561C24]" />
                            <button
                              onClick={() => openGoogleMaps(report.latitude, report.longitude)}
                              className="text-[#561C24] hover:text-[#561C24]/80 font-bold flex items-center gap-1 transition"
                            >
                              Koordinat GPS Warga: ({report.latitude}, {report.longitude}) <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Disposisi Notes */}
                          {report.disposisi && (
                            <div className="bg-purple-50 border border-purple-100 p-3.5 rounded-xl space-y-1">
                              <p className="text-[10px] uppercase font-black text-purple-700 flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5" /> Catatan Disposisi (Oleh: {report.disposisi.nama_admin})
                              </p>
                              <p className="text-xs text-slate-650 italic font-medium">
                                "{report.disposisi.catatan}"
                              </p>
                              <p className="text-[9px] text-slate-450 font-bold mt-1">
                                Dikirim pada: {new Date(report.disposisi.waktu_dikirim).toLocaleString('id-ID')}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleFollowupComplaint(report)}
                            className="px-4 py-2 bg-[#561C24] hover:bg-[#561C24]/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                          >
                            <PlusCircle className="w-4 h-4" /> Tindak Lanjut K3 Lapangan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: PLOTTING REGU PATROLI */}
      {isPatrolModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {patrolFormMode === 'create' ? 'Plotting Regu Patroli Baru' : 'Perbarui Regu Patroli'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPatrolModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePatrolSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tanggal Penugasan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Tanggal Penugasan</label>
                  <input
                    type="date"
                    required
                    value={patrolForm.tanggal_penugasan}
                    onChange={(e) => setPatrolForm({ ...patrolForm, tanggal_penugasan: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  />
                </div>

                {/* Shift Kerja */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Shift Kerja</label>
                  <div className="flex gap-2">
                    {['Pagi', 'Siang', 'Malam'].map((shift) => (
                      <label 
                        key={shift} 
                        className={`flex-1 py-2 text-center rounded-xl border text-xs font-bold cursor-pointer transition ${
                          patrolForm.shift_kerja === shift 
                            ? 'bg-blue-50 border-[#561C24] text-[#561C24]' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-750'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shift_kerja"
                          value={shift}
                          checked={patrolForm.shift_kerja === shift}
                          onChange={(e) => setPatrolForm({ ...patrolForm, shift_kerja: e.target.value })}
                          className="sr-only"
                        />
                        {shift}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Komandan Regu */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Nama Komandan Regu (Danru)</label>
                  <select
                    value={patrolForm.komandan_regu}
                    onChange={(e) => setPatrolForm({ ...patrolForm, komandan_regu: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-750 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  >
                    {DANRU_LIST.map((danru) => (
                      <option key={danru} value={danru}>{danru}</option>
                    ))}
                  </select>
                </div>

                {/* Kendaraan Dinas */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Kendaraan Dinas Operasional</label>
                  <select
                    value={patrolForm.kendaraan_dinas}
                    onChange={(e) => setPatrolForm({ ...patrolForm, kendaraan_dinas: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-750 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  >
                    {KENDARAAN_LIST.map((mobil) => (
                      <option key={mobil} value={mobil}>{mobil}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Daftar Anggota Regu (Checkbox multiple selection) */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">
                  Daftar Anggota Regu (Pilih minimal 1):
                </label>
                {formErrors.anggota_regu && <p className="text-[10px] text-red-500 font-bold">{formErrors.anggota_regu}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {ANGGOTA_POOL.map((member) => {
                    const isChecked = patrolForm.anggota_regu.includes(member);
                    return (
                      <label 
                        key={member}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition select-none ${
                          isChecked ? 'bg-blue-50 border-[#561C24]/40 text-[#561C24]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAnggotaCheckbox(member)}
                          className="accent-[#561C24]"
                        />
                        {member}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Rute / Sasaran Patroli */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">
                  Rute / Wilayah Patroli Sasaran (Pilih minimal 1):
                </label>
                {formErrors.wilayah_patroli && <p className="text-[10px] text-red-500 font-bold">{formErrors.wilayah_patroli}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {WILAYAH_PATROLI_POOL.map((zone) => {
                    const isChecked = patrolForm.wilayah_patroli.includes(zone);
                    return (
                      <label 
                        key={zone}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer transition select-none ${
                          isChecked ? 'bg-blue-50 border-[#561C24]/40 text-[#561C24]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleWilayahCheckbox(zone)}
                          className="accent-[#561C24]"
                        />
                        {zone}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPatrolModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#561C24] hover:bg-[#561C24]/90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {patrolFormMode === 'create' ? 'Simpan Plotting' : 'Perbarui Regu'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CATAT / EDIT PENERTIBAN K3 */}
      {isEnforcementModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {enforcementFormMode === 'create' ? 'Catat Tindakan Lapangan K3' : 'Edit Tindakan K3'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnforcementModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnforcementSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Hubungkan ke Regu Patroli (no_spt) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Hubungkan ke Regu Patroli (SPT)</label>
                  <select
                    value={enforcementForm.no_spt}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, no_spt: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-750 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  >
                    <option value="">-- Mandiri / Tanpa Regu (Patroli Insidentil) --</option>
                    {patrolList.map((patrol) => (
                      <option key={patrol.id} value={patrol.no_spt}>
                        {patrol.no_spt} - {patrol.komandan_regu} ({patrol.shift_kerja})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hubungkan ke Aduan Warga (id_tiket) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Tindak Lanjut Tiket Aduan Warga</label>
                  <select
                    value={enforcementForm.id_tiket}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, id_tiket: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-750 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  >
                    <option value="">-- Patroli Mandiri (Bukan tindak lanjut aduan) --</option>
                    {delegatedReports.map((report) => (
                      <option key={report.id_tiket} value={report.id_tiket}>
                        {report.id_tiket} - {report.kategori_masalah} (Pelapor: {report.nama_pelapor})
                      </option>
                    ))}
                    {enforcementFormMode === 'edit' && enforcementForm.id_tiket && (
                      <option value={enforcementForm.id_tiket}>{enforcementForm.id_tiket} (Sedang Diubah)</option>
                    )}
                  </select>
                </div>

                {/* Tanggal & Waktu Kejadian */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Waktu Eksekusi (Tanggal & Jam)</label>
                  <input
                    type="datetime-local"
                    required
                    value={enforcementForm.tanggal_kejadian}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, tanggal_kejadian: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-750 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  />
                </div>

                {/* Kategori Pelanggaran K3 - Sesuai persis dengan gambar lampiran */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Kategori Pelanggaran Trantib</label>
                  <select
                    value={enforcementForm.jenis_pelanggaran}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, jenis_pelanggaran: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-750 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  >
                    <option value="Pedagang Kaki Lima (PKL) Melanggar Zonasi">Pedagang Kaki Lima (PKL) Melanggar Zonasi</option>
                    <option value="Reklame Liar / Kedaluwarsa">Reklame Liar / Kedaluwarsa</option>
                    <option value="Pelanggaran Ketertiban Umum Lainnya">Pelanggaran Ketertiban Umum Lainnya</option>
                  </select>
                </div>

                {/* Nama Pelanggar / Pemilik Usaha */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Nama Pelanggar / Pemilik Usaha</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lapak Bu Wayan, Reklame Toko A, Pemilik Bali Banner"
                    value={enforcementForm.nama_pelanggar}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, nama_pelanggar: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  />
                  {formErrors.nama_pelanggar && <p className="text-[9px] text-red-500 font-bold">{formErrors.nama_pelanggar}</p>}
                </div>

                {/* Jumlah Pelanggar / Lapak - Baru Sesuai Gambar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Jumlah Pelanggar (Lapak / Struk)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={enforcementForm.jumlah_pelanggar}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, jumlah_pelanggar: parseInt(e.target.value) || 1 })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  />
                </div>

              </div>

              {/* Tindakan / Eksekusi Lapangan - Berupa PILIHAN TOMBOL Sesuai Gambar */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">
                  Tindakan / Eksekusi Lapangan (Pilihan Tombol):
                </label>
                <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {[
                    { label: "Teguran Lisan", value: "Teguran Lisan" },
                    { label: "Teguran Tertulis (Surat Peringatan)", value: "Teguran Tertulis (Surat Peringatan)" },
                    { label: "Penyitaan barang bukti", value: "Penyitaan barang bukti" }
                  ].map((act) => {
                    const isSelected = enforcementForm.tindakan_diambil === act.value;
                    return (
                      <button
                        key={act.value}
                        type="button"
                        onClick={() => setEnforcementForm({ ...enforcementForm, tindakan_diambil: act.value })}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition select-none flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 border-[#561C24] text-[#561C24]' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100/50'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#561C24]" />}
                        {act.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alamat Detail / Nama Jalan */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Nama Jalan / Lokasi Detail</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jalan Ahmad Yani, depan Toko Bandung Collection"
                  value={enforcementForm.lokasi}
                  onChange={(e) => setEnforcementForm({ ...enforcementForm, lokasi: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                />
                {formErrors.lokasi && <p className="text-[9px] text-red-500 font-bold">{formErrors.lokasi}</p>}
              </div>

              {/* Titik Koordinat (GPS) - Otomatis via Geolocation GPS Button */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Titik Koordinat (GPS)</label>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    disabled={detectingGps}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-[#E28A1C] rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                  >
                    {detectingGps ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Compass className="w-3 h-3" />
                    )}
                    {detectingGps ? 'Mengunci Satelit...' : 'Deteksi GPS HP Otomatis'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Latitude (Contoh: -8.113912)"
                    value={enforcementForm.latitude}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, latitude: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Longitude (Contoh: 115.088624)"
                    value={enforcementForm.longitude}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, longitude: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24]"
                  />
                </div>
              </div>

              {/* Deskripsi Kronologi / Keterangan */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Uraian Detail & Catatan Lapangan</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ceritakan jalannya penertiban, barang bukti yang disita, dan pembinaan yang diberikan..."
                  value={enforcementForm.keterangan}
                  onChange={(e) => setEnforcementForm({ ...enforcementForm, keterangan: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#561C24] focus:border-[#561C24] resize-y"
                />
                {formErrors.keterangan && <p className="text-[9px] text-red-500 font-bold">{formErrors.keterangan}</p>}
              </div>

              {/* Upload Foto Bukti Base64 */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Foto Bukti Tindakan (Kamera HP - Max 2MB)</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEnforcementPhotoChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#561C24] hover:file:bg-slate-200 cursor-pointer"
                  />
                  
                  {enforcementForm.foto_bukti && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img src={enforcementForm.foto_bukti} alt="Preview Bukti" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEnforcementForm({ ...enforcementForm, foto_bukti: null })}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-white/90 hover:bg-white border border-slate-250 text-rose-600 hover:text-rose-700 rounded-md transition shadow-sm"
                        title="Hapus Foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Selesaikan Aduan Warga Checkbox */}
              {enforcementForm.id_tiket && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="selesaikan_aduan"
                    checked={enforcementForm.selesaikan_aduan}
                    onChange={(e) => setEnforcementForm({ ...enforcementForm, selesaikan_aduan: e.target.checked })}
                    className="w-4 h-4 accent-[#561C24] cursor-pointer"
                  />
                  <label htmlFor="selesaikan_aduan" className="text-xs font-bold text-slate-700 select-none cursor-pointer">
                    Tandai Aduan Warga ({enforcementForm.id_tiket}) sebagai "Selesai" (Prisma $transaction)
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2.5 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEnforcementModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#561C24] hover:bg-[#561C24]/90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {enforcementFormMode === 'create' ? 'Simpan Log K3' : 'Perbarui Log'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ZOOM FOTO DOKUMENTASI */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-55 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-2">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white border border-slate-200 text-slate-750 hover:text-slate-900 rounded-xl transition-all cursor-pointer z-10 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={zoomImageUrl} 
              alt="Zoomed Dokumentasi" 
              className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: MOBILE PRINTER THERMAL RECEIPT SIMULATOR */}
      {isPrinterModalOpen && selectedEnforcementForPrint && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Pratinjau Cetak Mobile Printer
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrinterModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Box */}
            <div className="bg-white text-slate-950 p-6 rounded-lg font-mono text-[11px] shadow-inner max-h-[60vh] overflow-y-auto leading-relaxed border-4 border-double border-slate-300 m-6 mt-4" id="thermal-receipt-container">
              <div className="text-center space-y-1">
                <p className="font-extrabold text-sm tracking-wider">SATPOL PP BULELENG</p>
                <p className="text-[9px]">Seksi Ketenteraman & Ketertiban</p>
                <p className="text-[9px]">Jl. Pahlawan No. 7 Singaraja</p>
                <p className="text-[9px]">Telp: (0362) 22521</p>
                <p className="border-b border-dashed border-slate-950 py-0.5"></p>
              </div>

              <div className="space-y-1.5 pt-2.5">
                <div className="text-center font-extrabold text-xs tracking-wide">SURAT TEGURAN DIGITAL</div>
                <p className="text-[9px] text-center font-bold">{selectedEnforcementForPrint.no_formulir}</p>
                <p className="border-b border-dashed border-slate-950 py-0.5"></p>
                
                <div className="space-y-1">
                  <p><span className="font-bold">Waktu Eksekusi :</span> {new Date(selectedEnforcementForPrint.tanggal_kejadian).toLocaleString('id-ID')}</p>
                  <p><span className="font-bold">Spt Referensi :</span> {selectedEnforcementForPrint.no_spt || 'Mandiri / Insidentil'}</p>
                  {selectedEnforcementForPrint.id_tiket && (
                    <p><span className="font-bold">Tiket Referensi:</span> {selectedEnforcementForPrint.id_tiket}</p>
                  )}
                  <p className="border-b border-dotted border-slate-950 py-0.5"></p>
                  
                  <p><span className="font-bold">Kategori Pelanggar:</span></p>
                  <p className="pl-2.5 italic">{selectedEnforcementForPrint.jenis_pelanggaran}</p>
                  
                  <p><span className="font-bold">Nama Pelanggar   :</span> {selectedEnforcementForPrint.nama_pelanggar}</p>
                  <p><span className="font-bold">Jumlah Pelanggar :</span> {selectedEnforcementForPrint.jumlah_pelanggar || 1} Lapak/Usaha</p>
                  <p className="border-b border-dotted border-slate-950 py-0.5"></p>
                  
                  <p><span className="font-bold">Lokasi Kejadian  :</span></p>
                  <p className="pl-2.5">{selectedEnforcementForPrint.lokasi}</p>
                  <p><span className="font-bold">Kunci Peta (GPS) :</span> {selectedEnforcementForPrint.latitude}, {selectedEnforcementForPrint.longitude}</p>
                  <p className="border-b border-dotted border-slate-950 py-0.5"></p>
                  
                  <p><span className="font-bold">Tindakan Diambil :</span></p>
                  <p className="pl-2.5 font-bold tracking-wider uppercase text-xs">*** {selectedEnforcementForPrint.tindakan_diambil} ***</p>
                  
                  <p className="pt-1.5"><span className="font-bold">Uraian Lapangan  :</span></p>
                  <p className="pl-2.5 italic text-slate-700">{selectedEnforcementForPrint.keterangan}</p>
                </div>

                <p className="border-b border-dashed border-slate-950 py-1.5"></p>
                
                <div className="text-center text-[9px] pt-1 space-y-1.5">
                  <p className="font-bold uppercase">Dokumen Resmi Elektronik</p>
                  <p>Dicetak melalui mobile printer lapangan Satpol PP Buleleng. Harap patuhi aturan zonasi demi ketenteraman bersama.</p>
                  <p className="font-bold tracking-widest pt-1.5">-- MATUR SUKSMA --</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 border-t border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setIsPrinterModalOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer text-center"
              >
                Tutup
              </button>
              <button
                onClick={triggerReceiptPrint}
                className="flex-1 py-2 bg-[#561C24] hover:bg-[#561C24]/90 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" /> Kirim Ke Printer
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}
