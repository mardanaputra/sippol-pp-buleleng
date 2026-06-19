'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import AdminNavbar from '../../components/AdminNavbar';
import {
  Shield,
  Scale,
  Gavel,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  Check,
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowLeft,
  ExternalLink,
  PlusCircle,
  Download,
  Search,
  Image as ImageIcon,
  Calendar,
  UserCheck,
  MapPin,
  Package,
  Moon,
  Info
} from 'lucide-react';

export default function PeradaAdmin() {
  const [activeTab, setActiveTab] = useState('regulasi'); // 'regulasi', 'pelanggaran', 'penegakan'
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null); // { type, message, onConfirm }

  const showAlert = (message, type = 'success') => {
    setNotification({ type, message });
  };

  const showConfirm = (message, onConfirm) => {
    setNotification({ type: 'confirm', message, onConfirm });
  };

  // Core Data States
  const [regulasiList, setRegulasiList] = useState([]);
  const [pelanggaranList, setPelanggaranList] = useState([]);
  const [penegakanList, setPenegakanList] = useState([]);
  const [delegatedReports, setDelegatedReports] = useState([]);

  // Modals & Form States
  const [isRegulasiModalOpen, setIsRegulasiModalOpen] = useState(false);
  const [regulasiFormMode, setRegulasiFormMode] = useState('create'); // 'create', 'edit'
  const [regulasiForm, setRegulasiForm] = useState({
    id: '',
    jenis_peraturan: 'Perda',
    nomor_peraturan: '',
    tahun_peraturan: new Date().getFullYear(),
    judul_tentang: '',
    berkas_pdf: null,
  });

  const [isPelanggaranModalOpen, setIsPelanggaranModalOpen] = useState(false);
  const [pelanggaranFormMode, setPelanggaranFormMode] = useState('create');
  const [pelanggaranForm, setPelanggaranForm] = useState({
    id: '',
    kode_regulasi: '',
    pasal: '',
    jenis_pelanggaran: '',
    sanksi_maksimal: 'Denda',
    denda_maksimal: 5000000,
  });

  const [isPenegakanModalOpen, setIsPenegakanModalOpen] = useState(false);
  const [penegakanFormMode, setPenegakanFormMode] = useState('create');
  const [penegakanForm, setPenegakanForm] = useState({
    id: '',
    id_tiket: '',
    tanggal_tindakan: new Date().toISOString().substring(0, 16),
    nama_pelanggar: '',
    nik_pelanggar: '',
    alamat_pelanggar: '',
    lokasi_kejadian: '',
    kode_regulasi: '',
    pasal_dilanggar: '',
    jenis_tindakan: 'Surat Peringatan',
    status_sidang: 'SP-1 (Peringatan Pertama)',
    tanggal_sidang: '',
    lokasi_sidang: '',
    denda_dijatuhkan: 0,
    bukti_setor_kas: null,
    no_bukti_setor: '',
    scan_dokumen: null,
    kronologi_singkat: '',
    barang_bukti: '',
    catatan: '',
    selesaikan_aduan: true,
  });

  // Zoom & Viewer Modals
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [selectedPdfContent, setSelectedPdfContent] = useState('');
  const [selectedPdfTitle, setSelectedPdfTitle] = useState('');

  const [isVerdictModalOpen, setIsVerdictModalOpen] = useState(false);
  const [selectedVerdictForPrint, setSelectedVerdictForPrint] = useState(null);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  const [selectedPenegakanDetails, setSelectedPenegakanDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenPenegakanDetails = (item) => {
    setSelectedPenegakanDetails(item);
    setIsDetailsModalOpen(true);
  };

  const [formErrors, setFormErrors] = useState({});

  // Fetch Data Functions
  const fetchRegulasi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/perada/regulasi');
      if (res.ok) {
        const data = await res.json();
        setRegulasiList(data);
      }
    } catch (err) {
      console.error("Gagal memuat Master Perda/Perbup:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPelanggaran = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/perada/pelanggaran');
      if (res.ok) {
        const data = await res.json();
        setPelanggaranList(data);
      }
    } catch (err) {
      console.error("Gagal memuat Katalog Pelanggaran:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPenegakan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/perada/penegakan');
      if (res.ok) {
        const data = await res.json();
        setPenegakanList(data);
      }
    } catch (err) {
      console.error("Gagal memuat Log Penegakan Perda:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDelegatedReports = async () => {
    try {
      const res = await fetch('/api/perada/penegakan?type=delegated');
      if (res.ok) {
        const data = await res.json();
        setDelegatedReports(data);
      }
    } catch (err) {
      console.error("Gagal memuat aduan disposisi Perada:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'regulasi') {
      fetchRegulasi();
    } else if (activeTab === 'pelanggaran') {
      fetchPelanggaran();
      fetchRegulasi(); // needed for mapping dropdown
    } else if (activeTab === 'penegakan') {
      fetchPenegakan();
      fetchRegulasi(); // needed for mapping dropdown
      fetchPelanggaran(); // needed for mapping dropdown
      fetchDelegatedReports(); // needed for complaint followups
    }
  }, [activeTab]);

  // File to Base64 Helpers
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      showAlert("Hanya file berformat PDF yang diperbolehkan.", 'error');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showAlert("Ukuran dokumen PDF tidak boleh melebihi 3MB.", 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setRegulasiForm(prev => ({
        ...prev,
        berkas_pdf: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleBuktiSetorUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showAlert("Ukuran gambar tidak boleh melebihi 2MB.", 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPenegakanForm(prev => ({
        ...prev,
        bukti_setor_kas: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleScanDokumenUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert("Ukuran dokumen tidak boleh melebihi 5MB.", 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPenegakanForm(prev => ({
        ...prev,
        scan_dokumen: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Open Form Handlers
  const openCreateRegulasi = () => {
    setRegulasiFormMode('create');
    setRegulasiForm({
      id: '',
      jenis_peraturan: 'Perda',
      nomor_peraturan: '',
      tahun_peraturan: new Date().getFullYear(),
      judul_tentang: '',
      berkas_pdf: null,
    });
    setFormErrors({});
    setIsRegulasiModalOpen(true);
  };

  const openEditRegulasi = (reg) => {
    setRegulasiFormMode('edit');
    setRegulasiForm({
      id: reg.id,
      jenis_peraturan: reg.jenis_peraturan,
      nomor_peraturan: reg.nomor_peraturan,
      tahun_peraturan: reg.tahun_peraturan,
      judul_tentang: reg.judul_tentang,
      berkas_pdf: reg.berkas_pdf,
    });
    setFormErrors({});
    setIsRegulasiModalOpen(true);
  };

  const openCreatePelanggaran = () => {
    setPelanggaranFormMode('create');
    setPelanggaranForm({
      id: '',
      kode_regulasi: regulasiList[0]?.kode_regulasi || '',
      pasal: '',
      jenis_pelanggaran: '',
      sanksi_maksimal: 'Denda',
      denda_maksimal: 5000000,
    });
    setFormErrors({});
    setIsPelanggaranModalOpen(true);
  };

  const openEditPelanggaran = (pel) => {
    setPelanggaranFormMode('edit');
    setPelanggaranForm({
      id: pel.id,
      kode_regulasi: pel.kode_regulasi,
      pasal: pel.pasal,
      jenis_pelanggaran: pel.jenis_pelanggaran,
      sanksi_maksimal: pel.sanksi_maksimal || 'Denda',
      denda_maksimal: pel.denda_maksimal,
    });
    setFormErrors({});
    setIsPelanggaranModalOpen(true);
  };

  const openCreatePenegakan = () => {
    setPenegakanFormMode('create');
    setPenegakanForm({
      id: '',
      id_tiket: '',
      tanggal_tindakan: new Date().toISOString().substring(0, 16),
      nama_pelanggar: '',
      nik_pelanggar: '',
      alamat_pelanggar: '',
      lokasi_kejadian: 'Singaraja, Buleleng',
      kode_regulasi: regulasiList[0]?.kode_regulasi || '',
      pasal_dilanggar: '',
      jenis_tindakan: 'Surat Peringatan',
      status_sidang: 'SP-1 (Peringatan Pertama)',
      tanggal_sidang: '',
      lokasi_sidang: '',
      denda_dijatuhkan: 0,
      bukti_setor_kas: null,
      no_bukti_setor: '',
      scan_dokumen: null,
      kronologi_singkat: '',
      barang_bukti: '',
      catatan: '',
      selesaikan_aduan: true,
    });
    setFormErrors({});
    setIsPenegakanModalOpen(true);
  };

  const openEditPenegakan = (item) => {
    setPenegakanFormMode('edit');
    setPenegakanForm({
      id: item.id,
      id_tiket: item.id_tiket || '',
      tanggal_tindakan: item.tanggal_tindakan ? new Date(item.tanggal_tindakan).toISOString().substring(0, 16) : '',
      nama_pelanggar: item.nama_pelanggar,
      nik_pelanggar: item.nik_pelanggar || '',
      alamat_pelanggar: item.alamat_pelanggar || '',
      lokasi_kejadian: item.lokasi_kejadian,
      kode_regulasi: item.kode_regulasi,
      pasal_dilanggar: item.pasal_dilanggar,
      jenis_tindakan: item.jenis_tindakan,
      status_sidang: item.status_sidang,
      tanggal_sidang: item.tanggal_sidang ? new Date(item.tanggal_sidang).toISOString().substring(0, 10) : '',
      lokasi_sidang: item.lokasi_sidang || '',
      denda_dijatuhkan: item.denda_dijatuhkan || 0,
      bukti_setor_kas: item.bukti_setor_kas || null,
      no_bukti_setor: item.no_bukti_setor || '',
      scan_dokumen: item.scan_dokumen || null,
      kronologi_singkat: item.kronologi_singkat || '',
      barang_bukti: item.barang_bukti || '',
      catatan: item.catatan,
      selesaikan_aduan: false,
    });
    setFormErrors({});
    setIsPenegakanModalOpen(true);
  };

  const handleFollowupComplaint = (complaint) => {
    setPenegakanFormMode('create');
    setPenegakanForm({
      id: '',
      id_tiket: complaint.id_tiket,
      tanggal_tindakan: new Date().toISOString().substring(0, 16),
      nama_pelanggar: 'Dalam Penyelidikan Hukum',
      nik_pelanggar: '',
      alamat_pelanggar: '',
      lokasi_kejadian: `Singaraja, Buleleng (Tindak Lanjut Aduan)`,
      kode_regulasi: regulasiList[0]?.kode_regulasi || '',
      pasal_dilanggar: '',
      jenis_tindakan: 'Surat Peringatan',
      status_sidang: 'SP-1 (Peringatan Pertama)',
      tanggal_sidang: '',
      lokasi_sidang: '',
      denda_dijatuhkan: 0,
      bukti_setor_kas: null,
      no_bukti_setor: '',
      scan_dokumen: null,
      kronologi_singkat: `Tindak lanjut aduan masyarakat.\nKronologi Warga: ${complaint.kronologi}`,
      barang_bukti: '',
      catatan: `[Tindak Lanjut Aduan ${complaint.id_tiket}]\nDelegasi Admin: ${complaint.disposisi?.catatan || '-'}`,
      selesaikan_aduan: true,
    });
    setFormErrors({});
    setIsPenegakanModalOpen(true);
  };

  // Submit Handlers
  const handleRegulasiSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!regulasiForm.nomor_peraturan.trim()) errors.nomor_peraturan = "Nomor Peraturan wajib diisi.";
    if (!regulasiForm.judul_tentang.trim()) errors.judul_tentang = "Judul/Tentang regulasi wajib diisi.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = '/api/perada/regulasi';
      const method = regulasiFormMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regulasiForm),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert(data.message, 'success');
        setIsRegulasiModalOpen(false);
        fetchRegulasi();
      } else {
        showAlert(data.error || "Gagal menyimpan Master Regulasi.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan koneksi database.", 'error');
    }
  };

  const handlePelanggaranSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!pelanggaranForm.kode_regulasi) errors.kode_regulasi = "Pilih Master Regulasi acuan.";
    if (!pelanggaranForm.pasal.trim()) errors.pasal = "Pasal pelanggaran wajib diisi.";
    if (!pelanggaranForm.jenis_pelanggaran.trim()) errors.jenis_pelanggaran = "Kategori jenis pelanggaran wajib diisi.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = '/api/perada/pelanggaran';
      const method = pelanggaranFormMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pelanggaranForm),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert(data.message, 'success');
        setIsPelanggaranModalOpen(false);
        fetchPelanggaran();
      } else {
        showAlert(data.error || "Gagal menyimpan Katalog Pelanggaran.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan koneksi database.", 'error');
    }
  };

  const handlePenegakanSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!penegakanForm.nama_pelanggar.trim()) errors.nama_pelanggar = "Nama pelanggar/usaha wajib diisi.";
    if (!penegakanForm.lokasi_kejadian.trim()) errors.lokasi_kejadian = "Lokasi detail kejadian wajib diisi.";
    if (!penegakanForm.pasal_dilanggar) errors.pasal_dilanggar = "Pilih pasal/regulasi yang dilanggar.";
    if (penegakanForm.nik_pelanggar && !/^\d{16}$/.test(penegakanForm.nik_pelanggar)) {
      errors.nik_pelanggar = "Nomor KTP / NIK Pelanggar harus berupa 16 digit angka.";
    }
    if (!penegakanForm.catatan.trim()) errors.catatan = "Uraian catatan/tuntutan sidang wajib diisi.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = '/api/perada/penegakan';
      const method = penegakanFormMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(penegakanForm),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert(data.message, 'success');
        setIsPenegakanModalOpen(false);
        fetchPenegakan();
        if (activeTab === 'penegakan') {
          fetchDelegatedReports();
        }
      } else {
        showAlert(data.error || "Gagal menyimpan Log Penegakan Perda.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan koneksi database.", 'error');
    }
  };

  // Delete Handlers
  const handleDeleteRegulasi = (id, kode) => {
    showConfirm(`Hapus Master Regulasi: ${kode}?\nPERINGATAN: Menghapus regulasi ini juga akan menghapus katalog pelanggaran yang terkait.`, async () => {
      try {
        const res = await fetch(`/api/perada/regulasi?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showAlert("Master Regulasi berhasil dihapus.", 'success');
          fetchRegulasi();
        } else {
          const data = await res.json();
          showAlert(data.error || "Gagal menghapus.", 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert("Terjadi kesalahan jaringan.", 'error');
      }
    });
  };

  const handleDeletePelanggaran = (id, pasal) => {
    showConfirm(`Hapus katalog pelanggaran ${pasal} ini secara permanen?`, async () => {
      try {
        const res = await fetch(`/api/perada/pelanggaran?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showAlert("Katalog Pelanggaran berhasil dihapus.", 'success');
          fetchPelanggaran();
        } else {
          const data = await res.json();
          showAlert(data.error || "Gagal menghapus.", 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert("Terjadi kesalahan jaringan.", 'error');
      }
    });
  };

  const handleDeletePenegakan = (id, no_kej) => {
    showConfirm(`Hapus log penegakan dengan nomor kejadian: ${no_kej}?\nTindakan ini bersifat permanen.`, async () => {
      try {
        const res = await fetch(`/api/perada/penegakan?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showAlert("Log Penegakan berhasil dihapus.", 'success');
          fetchPenegakan();
        } else {
          const data = await res.json();
          showAlert(data.error || "Gagal menghapus.", 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert("Terjadi kesalahan jaringan.", 'error');
      }
    });
  };

  const openPdfViewer = (reg) => {
    if (!reg.berkas_pdf) {
      showAlert("Tidak ada berkas PDF lembaran daerah yang diunggah.", 'info');
      return;
    }
    setSelectedPdfContent(reg.berkas_pdf);
    setSelectedPdfTitle(`${reg.jenis_peraturan} No. ${reg.nomor_peraturan} Tahun ${reg.tahun_peraturan}`);
    setIsPdfViewerOpen(true);
  };

  const openScanDokumen = (item) => {
    if (!item.scan_dokumen) {
      showAlert("Tidak ada berkas scan BAP & Putusan yang diunggah.", 'info');
      return;
    }
    if (item.scan_dokumen.startsWith("data:application/pdf")) {
      setSelectedPdfContent(item.scan_dokumen);
      setSelectedPdfTitle(`Scan BAP - ${item.no_kejadian}`);
      setIsPdfViewerOpen(true);
    } else {
      setZoomImageUrl(item.scan_dokumen);
      setIsZoomModalOpen(true);
    }
  };

  const openVerdictSummonModal = (item) => {
    setSelectedVerdictForPrint(item);
    setIsVerdictModalOpen(true);
  };

  const triggerSummonVerdictPrint = () => {
    const printContent = document.getElementById('summons-verdict-container').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <div style="background-color: white; color: black; font-family: 'Times New Roman', Times, serif; padding: 40px; max-width: 800px; margin: auto; line-height: 1.5;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const openZoom = (url) => {
    setZoomImageUrl(url);
    setIsZoomModalOpen(true);
  };

  // Filter List Helper
  const filteredRegulasi = regulasiList.filter(reg =>
    reg.kode_regulasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.judul_tentang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.nomor_peraturan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPelanggaran = pelanggaranList.filter(pel =>
    pel.kode_regulasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pel.pasal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pel.jenis_pelanggaran.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPenegakan = penegakanList.filter(pen =>
    pen.no_kejadian.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pen.nama_pelanggar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pen.pasal_dilanggar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 font-sans select-none relative overflow-x-hidden pt-[72px] flex flex-col justify-between">

      {/* 2. Horizontal Admin Navbar (Fixed / Persistent) */}
      <AdminNavbar
        activePortal="perada"
        onRefresh={() => {
          if (activeTab === 'regulasi') fetchRegulasi();
          else if (activeTab === 'pelanggaran') { fetchPelanggaran(); fetchRegulasi(); }
          else if (activeTab === 'penegakan') { fetchPenegakan(); fetchRegulasi(); fetchPelanggaran(); fetchDelegatedReports(); }
        }}
        loading={loading}
      />



      {/* Main Grid Content */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8 space-y-6 flex-1">

        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PORTAL BIDANG PERADA</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              PENEGAKAN PERDA & SEKSI PENEGAKAN PERUNDANG-UNDANGAN DAERAH
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'regulasi') openCreateRegulasi();
              else if (activeTab === 'pelanggaran') openCreatePelanggaran();
              else if (activeTab === 'penegakan') openCreatePenegakan();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#561C24] hover:bg-[#6D2932] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs font-bold shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            {activeTab === 'regulasi' ? 'Registrasi Regulasi' : activeTab === 'pelanggaran' ? 'Tambah Pasal Katalog' : 'Catat Penegakan/Sidang'}
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border border-slate-200 bg-white p-1.5 rounded-2xl shadow-sm gap-2">
          <button
            onClick={() => { setActiveTab('regulasi'); setSearchQuery(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'regulasi'
              ? 'bg-[#561C24] text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" /> Kamus Hukum (Perda/Perbup)
          </button>
          <button
            onClick={() => { setActiveTab('pelanggaran'); setSearchQuery(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'pelanggaran'
              ? 'bg-[#561C24] text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <FileText className="w-4 h-4 shrink-0" /> Katalog Pasal & Denda
          </button>
          <button
            onClick={() => { setActiveTab('penegakan'); setSearchQuery(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative ${activeTab === 'penegakan'
              ? 'bg-[#561C24] text-white font-extrabold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Gavel className="w-4 h-4 shrink-0" /> Penegakan Perda & Sidang
            {delegatedReports.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce shadow">
                {delegatedReports.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar Utilities */}
        <div className="relative bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <Search className="w-4.5 h-4.5 text-slate-450 absolute left-4.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Cari data ${activeTab === 'regulasi' ? 'regulasi Perda' : activeTab === 'pelanggaran' ? 'pasal/pelanggaran' : 'pelanggar/sidang'} berdasarkan judul, kode, atau pasal...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1E43]/20"
          />
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-16 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#0B1E43] animate-spin" />
            <div className="text-sm font-semibold text-slate-500">Memuat data dari database daerah Buleleng...</div>
          </div>
        )}

        {/* TAB 1: MASTER PERDA & PERBUP */}
        {!loading && activeTab === 'regulasi' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between transition hover:shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">Total Regulasi Terdaftar</p>
                  <p className="text-3xl font-black text-[#0B1E43] mt-1">{regulasiList.length}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 text-[#0B1E43] rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between transition hover:shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">Peraturan Daerah (Perda)</p>
                  <p className="text-3xl font-black text-[#0B1E43] mt-1">
                    {regulasiList.filter(r => r.jenis_peraturan === 'Perda').length}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 text-[#0B1E43] rounded-xl">
                  <Scale className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between transition hover:shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">Perbup / Perkada</p>
                  <p className="text-3xl font-black text-[#E28A1C] mt-1">
                    {regulasiList.filter(r => r.jenis_peraturan?.includes('Perbup')).length}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 text-[#E28A1C] rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* List Kamus Hukum */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {filteredRegulasi.length === 0 ? (
                <div className="text-center p-12 text-slate-500 space-y-3">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">Belum ada regulasi terdaftar</p>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto">Silakan klik tombol "Registrasi Regulasi" di atas untuk mendaftarkan peraturan baru!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-6">Kode / Jenis</th>
                        <th className="py-4 px-6">Nomor / Tahun</th>
                        <th className="py-4 px-6">Judul / Tentang Regulasi Resmi</th>
                        <th className="py-4 px-6">Dokumen Asli</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredRegulasi.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="py-4 px-6 space-y-1">
                            <div className="font-mono font-bold text-[#0B1E43] bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded text-[10px] inline-block">
                              {reg.kode_regulasi}
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${reg.jenis_peraturan === 'Perda'
                                ? 'bg-[#0B1E43]/5 text-[#0B1E43] border-[#0B1E43]/10'
                                : 'bg-[#E28A1C]/5 text-[#E28A1C] border-[#E28A1C]/10'
                                }`}>
                                {reg.jenis_peraturan}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-800">
                            No. {reg.nomor_peraturan} Tahun {reg.tahun_peraturan}
                          </td>
                          <td className="py-4 px-6 max-w-[320px] text-slate-650 leading-relaxed font-semibold italic">
                            "{reg.judul_tentang}"
                          </td>
                          <td className="py-4 px-6">
                            {reg.berkas_pdf ? (
                              <button
                                onClick={() => openPdfViewer(reg)}
                                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition duration-200 cursor-pointer shadow-sm"
                                title="Buka berkas lembaran daerah"
                              >
                                <Eye className="w-3.5 h-3.5" /> Buka PDF
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold italic block">Tanpa Berkas</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditRegulasi(reg)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition duration-200 cursor-pointer"
                                title="Edit Regulasi"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRegulasi(reg.id, reg.kode_regulasi)}
                                className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition duration-200 cursor-pointer"
                                title="Hapus Regulasi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: KATALOG PASAL & DENDA */}
        {!loading && activeTab === 'pelanggaran' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between transition hover:shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">Pasal Terkatalog</p>
                  <p className="text-3xl font-black text-[#0B1E43] mt-1">{pelanggaranList.length} Ketentuan</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 text-[#0B1E43] rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between transition hover:shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">Denda Maksimal Tertinggi</p>
                  <p className="text-3xl font-black text-rose-600 mt-1">
                    Rp {pelanggaranList.length > 0 ? Math.max(...pelanggaranList.map(p => p.denda_maksimal || 0)).toLocaleString('id-ID') : '0'}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 text-rose-600 rounded-xl">
                  <Gavel className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* List Katalog Pelanggaran */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {filteredPelanggaran.length === 0 ? (
                <div className="text-center p-12 text-slate-500 space-y-3">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">Belum ada pasal katalog terdaftar</p>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto">Silakan klik "+ Tambah Pasal Katalog" di atas untuk mendaftarkan pasal baru!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-6">Pasal Acuan</th>
                        <th className="py-4 px-6">Kode Regulasi</th>
                        <th className="py-4 px-6">Uraian / Jenis Pelanggaran Aturan</th>
                        <th className="py-4 px-6">Sanksi Maksimal</th>
                        <th className="py-4 px-6">Batas Maksimal Denda</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredPelanggaran.map((pel) => (
                        <tr key={pel.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="py-4 px-6 font-mono font-bold text-[#0B1E43]">
                            {pel.pasal}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-700">
                            {pel.kode_regulasi}
                          </td>
                          <td className="py-4 px-6 max-w-[300px] text-slate-650 font-semibold leading-relaxed">
                            {pel.jenis_pelanggaran}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pel.sanksi_maksimal === 'Kurungan' ? 'bg-amber-55/60 text-amber-700 border-amber-200' :
                              pel.sanksi_maksimal === 'Pencabutan Izin' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                              {pel.sanksi_maksimal || 'Denda'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-rose-600 font-extrabold text-sm">
                            {pel.sanksi_maksimal === 'Denda' || !pel.sanksi_maksimal ? `Rp ${pel.denda_maksimal.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditPelanggaran(pel)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200 rounded-lg transition duration-200 cursor-pointer"
                                title="Edit Ketentuan"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePelanggaran(pel.id, pel.pasal)}
                                className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-650 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition duration-200 cursor-pointer"
                                title="Hapus Ketentuan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: PENEGAKAN PERDA & SIDANG */}
        {!loading && activeTab === 'penegakan' && (
          <div className="space-y-6">

            {/* Disposisi List Banner */}
            {delegatedReports.length > 0 && (
              <div className="bg-blue-50/60 border-l-4 border-l-[#0B1E43] border-y border-r border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-fadeIn">
                <div className="p-3 bg-[#0B1E43]/10 border border-[#0B1E43]/20 text-[#0B1E43] rounded-xl shrink-0 animate-pulse">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0B1E43]">DELEGASI DISPOSISI BIDANG PERADA ({delegatedReports.length})</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Laporan pengaduan masyarakat yang dialihkan khusus ke seksi **Penegakan Perda & Perbup**.
                      Tindak lanjuti untuk menyalin GPS, mengagendakan sidang Tipiring, atau menjatuhkan sanksi hukum secara resmi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {delegatedReports.map((report) => (
                      <div key={report.id_tiket} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
                        <div className="truncate space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-[#0B1E43] bg-[#0B1E43]/10 px-2 py-0.5 rounded border border-[#0B1E43]/15">{report.id_tiket}</span>
                          <p className="text-[11px] font-bold text-slate-800 truncate mt-1">{report.kategori_masalah}</p>
                          <p className="text-[9px] text-slate-450 truncate">Pelapor: {report.nama_pelapor}</p>
                        </div>
                        <button
                          onClick={() => handleFollowupComplaint(report)}
                          className="px-3 py-1.5 bg-[#0B1E43] hover:bg-[#07132b] text-white rounded-lg text-[10px] font-bold transition duration-200 flex items-center gap-1 shrink-0 cursor-pointer shadow-sm active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Proses Hukum
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Table Penegakan Perda / Sidang */}
            {filteredPenegakan.length === 0 ? (
              <div className="text-center p-16 bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3">
                <Gavel className="w-12 h-12 text-slate-350 mx-auto" />
                <p className="font-bold text-slate-700">Belum ada log penegakan hukum/sidang</p>
                <p className="text-xs text-slate-450 max-w-sm mx-auto">Silakan klik "+ Catat Penegakan/Sidang" untuk meregistrasikan kasus yustisial baru!</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-250 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-4 px-4">No. Berkas</th>
                        <th className="py-4 px-4">Terdakwa / Pelanggar</th>
                        <th className="py-4 px-4">Regulasi & Pasal</th>
                        <th className="py-4 px-4">Tanggal & Lokasi</th>
                        <th className="py-4 px-4">Status Sidang</th>
                        <th className="py-4 px-4 text-right">Denda Putusan</th>
                        <th className="py-4 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredPenegakan.map((item) => {
                        const tindDate = new Date(item.tanggal_tindakan).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-[#561C24]">
                              {item.no_kejadian}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-extrabold text-slate-800">{item.nama_pelanggar}</div>
                              {item.nik_pelanggar && (
                                <div className="text-[10px] text-slate-450 font-mono mt-0.5">NIK: {item.nik_pelanggar}</div>
                              )}
                            </td>
                            <td className="py-4 px-4 font-semibold">
                              <div className="font-bold text-slate-700">{item.kode_regulasi}</div>
                              <div className="text-[10px] text-slate-500">{item.pasal_dilanggar}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="truncate max-w-[180px] font-bold" title={item.lokasi_kejadian}>{item.lokasi_kejadian}</div>
                              <div className="text-[10px] text-slate-450 mt-0.5">{tindDate}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col gap-1">
                                <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${item.jenis_tindakan === 'Yustisial'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : item.jenis_tindakan === 'Surat Peringatan'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                  }`}>
                                  {item.jenis_tindakan}
                                </span>
                                <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-bold border ${item.status_sidang === 'Kasus Selesai (Clear)' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  item.status_sidang === 'SP-3 (Peringatan Ketiga)' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                    item.status_sidang === 'SP-2 (Peringatan Kedua)' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                      item.status_sidang === 'SP-1 (Peringatan Pertama)' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                  {item.status_sidang}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-extrabold text-rose-600">
                              {item.denda_dijatuhkan ? `Rp ${item.denda_dijatuhkan.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenPenegakanDetails(item)}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200 rounded-lg transition duration-200 cursor-pointer"
                                  title="Lihat Detail Berkas"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditPenegakan(item)}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200 rounded-lg transition duration-200 cursor-pointer"
                                  title="Edit Kasus"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePenegakan(item.id, item.no_kejadian)}
                                  className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-250 text-slate-650 hover:text-rose-600 rounded-lg transition duration-200 cursor-pointer"
                                  title="Hapus Kasus"
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
              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: REGISTRASI / EDIT MASTER PERDA & PERBUP */}
      {isRegulasiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {regulasiFormMode === 'create' ? 'Registrasi Regulasi Baru' : 'Perbarui Regulasi Hukum'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegulasiModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegulasiSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Jenis Peraturan (Radio Buttons) */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Jenis Regulasi / Peraturan</label>
                  <div className="flex gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {[
                      { value: 'Perda', label: 'Perda (Peraturan Daerah)' },
                      { value: 'Perbup/Perkada', label: 'Perbup/Perkada (Peraturan Bupati)' }
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex-1 py-2 px-3 text-center rounded-lg border text-xs font-bold cursor-pointer transition select-none flex items-center justify-center gap-2 ${regulasiForm.jenis_peraturan === opt.value
                          ? 'bg-blue-50 border-[#0B1E43] text-[#0B1E43]'
                          : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="jenis_peraturan"
                          value={opt.value}
                          checked={regulasiForm.jenis_peraturan === opt.value}
                          onChange={(e) => setRegulasiForm({ ...regulasiForm, jenis_peraturan: e.target.value })}
                          className="accent-[#0B1E43]"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nomor Peraturan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Nomor Regulasi (Contoh: Nomor 3)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nomor 6, Nomor 12/A, dll"
                    value={regulasiForm.nomor_peraturan}
                    onChange={(e) => setRegulasiForm({ ...regulasiForm, nomor_peraturan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                  {formErrors.nomor_peraturan && <p className="text-[9px] text-red-500 font-bold">{formErrors.nomor_peraturan}</p>}
                </div>

                {/* Tahun Peraturan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Tahun Disahkan (Contoh: 2024)</label>
                  <input
                    type="number"
                    required
                    value={regulasiForm.tahun_peraturan}
                    onChange={(e) => setRegulasiForm({ ...regulasiForm, tahun_peraturan: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                </div>

                {/* Judul Tentang Peraturan */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Judul / Tentang Regulasi Resmi</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Tulis judul lengkap peraturan (Contoh: Tentang Ketertiban Umum dan Ketentraman Masyarakat serta Perlindungan Masyarakat)"
                    value={regulasiForm.judul_tentang}
                    onChange={(e) => setRegulasiForm({ ...regulasiForm, judul_tentang: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43] resize-y"
                  />
                  {formErrors.judul_tentang && <p className="text-[9px] text-red-500 font-bold">{formErrors.judul_tentang}</p>}
                </div>

                {/* Berkas Dokumen PDF */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Unggah Berkas Dokumen Lembaran Daerah (Format: PDF - Maks 3MB)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                  />
                  {regulasiForm.berkas_pdf && (
                    <div className="bg-emerald-50 border border-emerald-250 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-emerald-800 text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" /> Berkas lembaran PDF terunggah & terenkripsi dalam database SQLite
                      </span>
                      <button
                        type="button"
                        onClick={() => setRegulasiForm({ ...regulasiForm, berkas_pdf: null })}
                        className="text-[10px] text-red-500 hover:text-red-650 font-bold underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRegulasiModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1E43] hover:bg-[#07132b] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm active:scale-95"
                >
                  {regulasiFormMode === 'create' ? 'Simpan Regulasi' : 'Perbarui Regulasi'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TAMBAH / EDIT KATALOG PASAL & DENDA */}
      {isPelanggaranModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {pelanggaranFormMode === 'create' ? 'Tambah Pasal Pelanggaran Baru' : 'Edit Ketentuan Pelanggaran'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPelanggaranModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePelanggaranSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">

              <div className="space-y-4">

                {/* Kode Regulasi Acuan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Hubungkan ke Regulasi Acuan (Perda/Perbup)</label>
                  <select
                    value={pelanggaranForm.kode_regulasi}
                    onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, kode_regulasi: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  >
                    <option value="" disabled>-- Pilih Regulasi --</option>
                    {regulasiList.map((reg) => (
                      <option key={reg.id} value={reg.kode_regulasi}>
                        {reg.kode_regulasi} - {reg.jenis_peraturan} No. {reg.nomor_peraturan} ({reg.tahun_peraturan})
                      </option>
                    ))}
                  </select>
                  {formErrors.kode_regulasi && <p className="text-[9px] text-red-550 font-bold">{formErrors.kode_regulasi}</p>}
                </div>

                {/* Pasal (Contoh: Pasal 5 Ayat 1) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Rincian Pasal & Ayat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pasal 5 Ayat (1), Pasal 12 Huruf b, dll"
                    value={pelanggaranForm.pasal}
                    onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, pasal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                  {formErrors.pasal && <p className="text-[9px] text-red-500 font-bold">{formErrors.pasal}</p>}
                </div>

                {/* Deskripsi Jenis Pelanggaran */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wide">Deskripsi / Jenis Pelanggaran Aturan</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Tulis rincian perbuatan yang dilarang (Contoh: Menaruh barang dagangan di atas trotoar yang mengganggu hak pejalan kaki)"
                    value={pelanggaranForm.jenis_pelanggaran}
                    onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, jenis_pelanggaran: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43] resize-y"
                  />
                  {formErrors.jenis_pelanggaran && <p className="text-[9px] text-red-500 font-bold">{formErrors.jenis_pelanggaran}</p>}
                </div>

                {/* Sanksi Maksimal Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Sanksi Maksimal</label>
                  <select
                    value={pelanggaranForm.sanksi_maksimal || 'Denda'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPelanggaranForm(prev => ({
                        ...prev,
                        sanksi_maksimal: val,
                        denda_maksimal: val === 'Denda' ? prev.denda_maksimal : 0
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  >
                    <option value="Denda">Denda (Uang Rupiah)</option>
                    <option value="Kurungan">Kurungan (Pidana Penjara)</option>
                    <option value="Pencabutan Izin">Pencabutan Izin Usaha</option>
                  </select>
                </div>

                {/* Batas Sanksi Denda Maksimal */}
                {(pelanggaranForm.sanksi_maksimal === 'Denda' || !pelanggaranForm.sanksi_maksimal) && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Batas Maksimal Denda (Rupiah)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Contoh: 5000000"
                      value={pelanggaranForm.denda_maksimal}
                      onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, denda_maksimal: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                    />
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPelanggaranModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1E43] hover:bg-[#07132b] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm active:scale-95"
                >
                  {pelanggaranFormMode === 'create' ? 'Tambah Pasal' : 'Perbarui Ketentuan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CATAT / EDIT LOG PENEGAKAN PERDA & SIDANG */}
      {isPenegakanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {penegakanFormMode === 'create' ? 'Catat Tindakan Penegakan Perda' : 'Edit Log Kasus Sidang'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPenegakanModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePenegakanSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* 1. Nomor Berkas Registrasi */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wide">Nomor Berkas Registrasi</label>
                  <input
                    type="text"
                    disabled
                    value={penegakanFormMode === 'create' ? "BAP/PERADA/YYYY/XXX (Otomatis)" : (penegakanForm.no_kejadian || "BAP/PERADA/YYYY/XXX")}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>

                {/* 2. Nomor Tiket Aduan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Nomor Tiket Aduan (Opsional)</label>
                  <select
                    value={penegakanForm.id_tiket}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, id_tiket: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  >
                    <option value="">-- Tindakan Mandiri / Pengawasan Lapangan --</option>
                    {delegatedReports.map((report) => (
                      <option key={report.id_tiket} value={report.id_tiket}>
                        {report.id_tiket} - {report.kategori_masalah} (Disposisi)
                      </option>
                    ))}
                    {penegakanFormMode === 'edit' && penegakanForm.id_tiket && (
                      <option value={penegakanForm.id_tiket}>{penegakanForm.id_tiket} (Sedang Diubah)</option>
                    )}
                  </select>
                </div>

                {/* 3. Tanggal Penindakan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Tanggal Penindakan (Operasional)</label>
                  <input
                    type="datetime-local"
                    required
                    value={penegakanForm.tanggal_tindakan}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, tanggal_tindakan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                </div>

                {/* 4. Nama Pelanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Nama Lengkap Pelanggar</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / CV Maju Bersama"
                    value={penegakanForm.nama_pelanggar}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, nama_pelanggar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                  {formErrors.nama_pelanggar && <p className="text-[9px] text-red-500 font-bold">{formErrors.nama_pelanggar}</p>}
                </div>

                {/* 5. NIK Pelanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Nomor KTP / NIK Pelanggar (16 Digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Contoh: 510801xxxxxxxxxx (16 digit)"
                    value={penegakanForm.nik_pelanggar}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // numbers only
                      setPenegakanForm({ ...penegakanForm, nik_pelanggar: val });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                  {formErrors.nik_pelanggar && <p className="text-[9px] text-red-500 font-bold">{formErrors.nik_pelanggar}</p>}
                </div>

                {/* 6. Alamat Pelanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Alamat Tempat Tinggal / Usaha Pelanggar</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Diponegoro No. 45, Singaraja"
                    value={penegakanForm.alamat_pelanggar}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, alamat_pelanggar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                </div>

                {/* 6.1 Lokasi Kejadian (TKP) */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Tempat Kejadian Perkara (TKP) / Lokasi Penindakan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Trotoar depan Ruko Jalan Ngurah Rai, Singaraja"
                    value={penegakanForm.lokasi_kejadian}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, lokasi_kejadian: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43]"
                  />
                  {formErrors.lokasi_kejadian && <p className="text-[9px] text-red-500 font-bold">{formErrors.lokasi_kejadian}</p>}
                </div>
                {/* 7. Pilih Regulasi Yang Dilanggar (Checkbox List) */}
                <div className="space-y-1.5 col-span-2 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Pilih Perda / Perbup Terlanggar (Bisa pilih lebih dari satu) <span className="text-rose-500">*</span></label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-[160px] overflow-y-auto space-y-2">
                    {regulasiList.map((reg) => {
                      const isChecked = penegakanForm.kode_regulasi.split(',').map(s => s.trim()).includes(reg.kode_regulasi);
                      return (
                        <label key={reg.id} className="flex items-start gap-2.5 px-2 py-1.5 bg-white rounded-lg border border-slate-150 hover:border-slate-300 transition-colors cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let currentSelected = penegakanForm.kode_regulasi ? penegakanForm.kode_regulasi.split(',').map(s => s.trim()).filter(Boolean) : [];
                              if (e.target.checked) {
                                if (!currentSelected.includes(reg.kode_regulasi)) {
                                  currentSelected.push(reg.kode_regulasi);
                                }
                              } else {
                                currentSelected = currentSelected.filter(code => code !== reg.kode_regulasi);
                              }
                              setPenegakanForm({ ...penegakanForm, kode_regulasi: currentSelected.join(', '), pasal_dilanggar: '' });
                            }}
                            className="w-4 h-4 text-[#561C24] border-slate-350 rounded focus:ring-[#561C24] cursor-pointer mt-0.5"
                          />
                          <div className="text-xs">
                            <span className="font-mono font-bold text-[#561C24] mr-1.5">{reg.kode_regulasi}</span>
                            <span className="font-semibold text-slate-600">{reg.jenis_peraturan} No. {reg.nomor_peraturan} ({reg.tahun_peraturan}) - {reg.judul_tentang}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 7.1 Pilih Pasal Terlanggar */}
                <div className="space-y-1 col-span-2 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Pilih Ketentuan Pasal Pelanggaran <span className="text-rose-500">*</span></label>
                  <select
                    value={penegakanForm.pasal_dilanggar}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, pasal_dilanggar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/20 focus:border-[#561C24]"
                  >
                    <option value="">-- Pilih Pasal/Ketentuan --</option>
                    {pelanggaranList
                      .filter(p => penegakanForm.kode_regulasi.split(',').map(s => s.trim()).includes(p.kode_regulasi))
                      .map((pel) => (
                        <option key={pel.id} value={`${pel.pasal} (${pel.kode_regulasi})`}>
                          {pel.kode_regulasi} - {pel.pasal} (Max Denda: Rp {pel.denda_maksimal?.toLocaleString('id-ID')})
                        </option>
                      ))}
                    {/* Fallback */}
                    <option value="Pasal 5 Ayat 1">Pasal 5 Ayat 1 (Zonasi Usaha)</option>
                    <option value="Pasal 12 Huruf a">Pasal 12 Huruf a (Ketertiban Umum)</option>
                  </select>
                  {formErrors.pasal_dilanggar && <p className="text-[9px] text-red-500 font-bold mt-1">{formErrors.pasal_dilanggar}</p>}
                </div>

                {/* 8. Kronologi Singkat */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Kronologi Singkat Temuan TKP</label>
                  <textarea
                    rows="2"
                    placeholder="Contoh: Petugas menemukan lapak PKL liar berjualan di atas trotoar menghalangi pejalan kaki..."
                    value={penegakanForm.kronologi_singkat}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, kronologi_singkat: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43] resize-y"
                  />
                </div>

                {/* 9. Daftar Barang Bukti */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Daftar Barang Bukti Disita</label>
                  <textarea
                    rows="2"
                    placeholder="Contoh: 1 buah rombong kayu, 3 buah kursi plastik warna biru..."
                    value={penegakanForm.barang_bukti}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, barang_bukti: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43] resize-y"
                  />
                </div>

                {/* Jenis Tindakan (Radio) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Jenis Tindakan Penegakan</label>
                  <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    {['Surat Peringatan', 'Teguran Lisan', 'Penyitaan Barang'].map((tind) => (
                      <label
                        key={tind}
                        className={`flex-1 py-2 text-center rounded-lg border text-xs font-bold cursor-pointer transition select-none flex items-center justify-center gap-1.5 ${penegakanForm.jenis_tindakan === tind
                          ? 'bg-blue-50 border-[#561C24] text-[#561C24]'
                          : 'bg-white border-slate-250 text-slate-550 hover:bg-slate-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="jenis_tindakan"
                          value={tind}
                          checked={penegakanForm.jenis_tindakan === tind}
                          onChange={(e) => setPenegakanForm({ ...penegakanForm, jenis_tindakan: e.target.value })}
                          className="sr-only"
                        />
                        {tind}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 10. Status Proses Penegakan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Status Proses Penegakan / Surat Peringatan</label>
                  <select
                    value={penegakanForm.status_sidang}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, status_sidang: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#561C24]/20 focus:border-[#561C24]"
                  >
                    <option value="SP-1 (Peringatan Pertama)">SP-1 (Surat Peringatan Pertama)</option>
                    <option value="SP-2 (Peringatan Kedua)">SP-2 (Surat Peringatan Kedua)</option>
                    <option value="SP-3 (Peringatan Ketiga)">SP-3 (Surat Peringatan Ketiga)</option>
                    <option value="Kasus Selesai (Clear)">Kasus Selesai / Telah Dipatuhi</option>
                  </select>
                </div>

                {/* 13. Dokumen Scan SP & Surat Resmi */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Dokumen Scan BAP & Putusan Resmi (Format: PDF/Gambar - Maks 5MB)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleScanDokumenUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                    />
                    {penegakanForm.scan_dokumen && (
                      <div className="bg-emerald-50 border border-emerald-250 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-emerald-800 text-xs w-full">
                        <span className="font-bold flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" /> Berkas scan terunggah secara Base64
                        </span>
                        <button
                          type="button"
                          onClick={() => setPenegakanForm({ ...penegakanForm, scan_dokumen: null })}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bukti Slip Setor Kas Negara Legacy (Optional) */}
                {penegakanForm.status_sidang === 'Kasus Selesai (Clear)' && (
                  <div className="space-y-2 col-span-2 border-t border-slate-100 pt-3">
                    <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide block">Bukti Slip Setor Kas Negara (Format Gambar - Kamera HP - Maks 2MB)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBuktiSetorUpload}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                      />
                      {penegakanForm.bukti_setor_kas && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                          <img src={penegakanForm.bukti_setor_kas} alt="Preview Bukti Setor" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPenegakanForm({ ...penegakanForm, bukti_setor_kas: null })}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 hover:bg-black/80 text-white rounded transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Deskripsi Catatan Sidang Tambahan */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wide">Catatan Sidang / Keterangan Tambahan</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Uraian tuntutan, denda kumulatif, data penyidik PNS, atau detail putusan sidang pengadilan..."
                    value={penegakanForm.catatan}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, catatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B1E43]/20 focus:border-[#0B1E43] resize-y"
                  />
                  {formErrors.catatan && <p className="text-[9px] text-red-500 font-bold">{formErrors.catatan}</p>}
                </div>

                {/* Selesaikan Aduan Warga Checkbox */}
                {penegakanForm.id_tiket && (
                  <div className="bg-blue-50 border border-blue-150 p-3 rounded-xl flex items-center gap-3 col-span-2">
                    <input
                      type="checkbox"
                      id="selesaikan_aduan"
                      checked={penegakanForm.selesaikan_aduan}
                      onChange={(e) => setPenegakanForm({ ...penegakanForm, selesaikan_aduan: e.target.checked })}
                      className="w-4 h-4 accent-[#0B1E43] cursor-pointer"
                    />
                    <label htmlFor="selesaikan_aduan" className="text-xs font-bold text-slate-700 select-none cursor-pointer">
                      Tandai Aduan Warga ({penegakanForm.id_tiket}) sebagai "Selesai" (Prisma $transaction)
                    </label>
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPenegakanModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1E43] hover:bg-[#07132b] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm active:scale-95"
                >
                  {penegakanFormMode === 'create' ? 'Simpan Log Perkara' : 'Perbarui Log'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ZOOM BERKAS / GAMBAR BUKTI SETOR */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl transition-all cursor-pointer z-10 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImageUrl}
              alt="Zoomed Slip Setor"
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: PREMIUM PDF VIEW SIMULATOR */}
      {isPdfViewerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">

            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Pratinjau Dokumen Hukum: {selectedPdfTitle}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfViewerOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Premium PDF document frame */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative flex flex-col justify-between p-6 md:p-12 text-slate-850 font-serif leading-relaxed text-sm shadow-inner overflow-y-auto m-6 mt-2">

              {/* Header Lembaran Daerah */}
              <div className="text-center space-y-2 font-bold font-sans text-slate-900 border-b-2 border-slate-350 pb-4 shrink-0">
                <p className="text-sm tracking-widest">LEMBARAN DAERAH KABUPATEN BULELENG</p>
                <p className="text-[10px] tracking-widest text-slate-500">SALINAN REGULASI RESMI NEGARA REPUBLIK INDONESIA</p>
                <p className="text-xs uppercase font-extrabold text-[#0B1E43] mt-1">{selectedPdfTitle}</p>
              </div>

              {/* Body Lembaran Daerah */}
              <div className="my-6 space-y-4 text-xs md:text-sm font-serif text-slate-800 max-w-2xl mx-auto leading-loose">
                {selectedPdfTitle.includes("Scan BAP") ? (
                  <div className="space-y-4 py-8">
                    <p className="text-center font-bold tracking-wide text-lg text-slate-900 underline">BERITA ACARA PENINDAKAN & PUTUSAN PENGADILAN</p>
                    <div className="text-center font-extrabold text-[11px] tracking-widest font-sans uppercase text-emerald-800 border border-emerald-250 p-3 rounded-xl bg-emerald-50 my-4">
                      DOKUMEN SCAN FISIK ASLI TERSIMPAN SECARA ELEKTRONIK DALAM BASE64
                    </div>
                    <p className="text-justify font-semibold leading-relaxed text-slate-750">
                      Telah berhasil dilampirkan dokumen resmi hasil pemindaian (scan) lembar Berita Acara Pemeriksaan (BAP) dan lembar Putusan Hakim Pengadilan Negeri Singaraja terkait pelanggaran bersangkutan.
                    </p>
                    <p className="text-justify leading-relaxed text-slate-500 text-xs">
                      Catatan Keamanan: Dokumen ini telah diverifikasi oleh Pejabat Penyidik Pegawai Negeri Sipil (PPNS) Satuan Polisi Pamong Praja Kabupaten Buleleng. Anda dapat mengunduh berkas lengkap dengan mengklik tombol "Unduh Berkas Lembaran" di bawah ini.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-center font-bold tracking-wide mt-4">DENGAN RAHMAT TUHAN YANG MAHA ESA</p>
                    <p className="text-center font-extrabold text-slate-900">BUPATI BULELENG,</p>

                    <div className="space-y-1.5 pt-4 text-slate-750">
                      <p><span className="font-bold">Menimbang:</span> Bahwa demi menjaga ketertiban umum dan kelancaran perlindungan pejalan kaki serta kelestarian lingkungan hidup di Kabupaten Buleleng, perlu dilakukan penegakan aturan hukum yang konsisten, berkeadilan, dan transparan.</p>
                      <p><span className="font-bold">Mengingat:</span> 1. Undang-Undang Nomor 69 Tahun 1958 tentang Pembentukan Daerah-daerah Tingkat II dalam Wilayah Daerah-daerah Tingkat I Bali, Nusa Tenggara Barat dan Nusa Tenggara Timur.</p>
                      <p className="pl-16">2. Peraturan Daerah Kabupaten Buleleng Nomor 3 Tahun 2026 tentang Penyelenggaraan Ketertiban Umum, Ketentraman Masyarakat, serta Perlindungan Masyarakat.</p>
                    </div>

                    <p className="text-center font-bold tracking-wide pt-8">MEMUTUSKAN:</p>
                    <p className="text-center font-bold">MENETAPKAN DOKUMEN UNDANG-UNDANG REGULASI DAERAH RESMI KABUPATEN BULELENG</p>

                    <p className="text-center font-extrabold pt-6">PASAL KETENTUAN HUKUM:</p>
                    <p className="italic text-slate-500 text-center">"Seluruh warga negara, badan usaha, serta pihak ketiga yang berdomisili atau berkegiatan di wilayah hukum Kabupaten Buleleng wajib mematuhi zonasi, perizinan reklame, serta norma kesusilaan dan ketertiban sosial yang sah."</p>

                    <div className="pt-12 text-right font-sans text-xs text-slate-500 space-y-1">
                      <p>Disahkan di Singaraja</p>
                      <p className="font-bold text-slate-800">Sekretaris Daerah Kabupaten Buleleng</p>
                      <p className="text-[10px]">Telah Terdaftar Secara Elektronik</p>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom watermark / digital seal */}
              <div className="border-t border-slate-250 pt-4 flex justify-between items-center text-[10px] font-sans text-slate-400 shrink-0">
                <p>Digital Cryptographic ID: SHA256-REG-BULELENG</p>
                <p className="font-bold text-[#0B1E43]">SATPOL PP BULELENG SECURE PORTAL</p>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 border-t border-slate-200 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsPdfViewerOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer text-center border border-slate-200"
              >
                Tutup Dokumen
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedPdfContent;
                  link.download = `${selectedPdfTitle.replace(/\s+/g, "_")}_LD_Buleleng.pdf`;
                  link.click();
                }}
                className="flex-1 py-2.5 bg-[#0B1E43] hover:bg-[#07132b] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> Unduh Berkas Lembaran
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: COURT SUMMONS / VERDICT SUMMON TICKET PRINTER */}
      {isVerdictModalOpen && selectedVerdictForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">

            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Lembar Panggilan & Putusan Sidang Resmi
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsVerdictModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summons Ticket Container */}
            <div className="flex-1 bg-white text-slate-950 p-8 md:p-12 rounded-xl overflow-y-auto leading-relaxed shadow-inner border border-slate-200 font-serif text-xs md:text-sm m-6 mt-2" id="summons-verdict-container">

              {/* Kop Surat Keadilan */}
              <div className="text-center space-y-1 border-b-4 border-double border-slate-950 pb-4">
                <p className="font-extrabold text-sm md:text-base font-sans tracking-wide">PEMERINTAH KABUPATEN BULELENG</p>
                <p className="font-extrabold text-base md:text-lg font-sans tracking-wider text-slate-900">SATUAN POLISI PAMONG PRAJA</p>
                <p className="text-[10px] font-sans">Jl. Pahlawan No. 7 Singaraja, Kode Pos 81111 | Telp: (0362) 22521</p>
                <p className="text-[9px] font-sans font-bold italic">Seksi Penegakan Perundang-undangan Daerah & Bidang Perada</p>
              </div>

              {/* Body Dokumen Resmi Hukum */}
              <div className="space-y-4 pt-6">

                <div className="text-center font-extrabold underline text-sm tracking-wide">
                  SURAT PANGGILAN SIDANG / BERITA ACARA PENINDAKAN
                </div>
                <p className="text-[10px] text-center font-mono font-bold tracking-widest mt-0.5">NOMOR PERKARA: {selectedVerdictForPrint.no_kejadian}</p>

                <p className="text-justify indent-8 pt-2">
                  Berdasarkan hasil temuan tindakan penegakan hukum di lapangan yang dipimpin oleh Penyidik Pegawai Negeri Sipil (PPNS) Satuan Polisi Pamong Praja Kabupaten Buleleng, dengan ini secara resmi memanggil / menerbitkan amar tuntutan kepada:
                </p>

                {/* Data Terdakwa */}
                <div className="pl-6 space-y-1.5 font-bold">
                  <div className="grid grid-cols-3">
                    <span>1. Nama Pelanggar / Terdakwa</span>
                    <span className="col-span-2">: {selectedVerdictForPrint.nama_pelanggar}</span>
                  </div>
                  {selectedVerdictForPrint.nik_pelanggar && (
                    <div className="grid grid-cols-3">
                      <span>2. NIK Pelanggar (No. KTP)</span>
                      <span className="col-span-2">: {selectedVerdictForPrint.nik_pelanggar}</span>
                    </div>
                  )}
                  {selectedVerdictForPrint.alamat_pelanggar && (
                    <div className="grid grid-cols-3">
                      <span>3. Alamat / Tempat Usaha</span>
                      <span className="col-span-2">: {selectedVerdictForPrint.alamat_pelanggar}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3">
                    <span>4. Lokasi Kejadian (TKP)</span>
                    <span className="col-span-2">: {selectedVerdictForPrint.lokasi_kejadian}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span>5. Tanggal & Waktu Tindakan</span>
                    <span className="col-span-2">: {new Date(selectedVerdictForPrint.tanggal_tindakan).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span>6. Jenis Acara Tindakan</span>
                    <span className="col-span-2">: Sidang Tindak Pidana Ringan ( {selectedVerdictForPrint.jenis_tindakan} )</span>
                  </div>
                </div>

                <p className="text-justify indent-8">
                  Bahwa Terdakwa diduga kuat telah melakukan pelanggaran terhadap ketentuan hukum Kabupaten Buleleng, yaitu:
                </p>

                {/* Dasar Hukum */}
                <div className="pl-6 bg-slate-50 p-3 rounded border border-slate-350 italic font-sans font-semibold space-y-1.5 text-slate-800">
                  <p>• Dasar Peraturan: {selectedVerdictForPrint.kode_regulasi}</p>
                  <p>• Ketentuan Hukum: {selectedVerdictForPrint.pasal_dilanggar}</p>
                  {selectedVerdictForPrint.kronologi_singkat && (
                    <p>• Temuan Lapangan: "{selectedVerdictForPrint.kronologi_singkat}"</p>
                  )}
                  {selectedVerdictForPrint.barang_bukti && (
                    <p>• Barang Bukti Disita: {selectedVerdictForPrint.barang_bukti}</p>
                  )}
                  {selectedVerdictForPrint.catatan && (
                    <p>• Keterangan / Catatan Sidang: "{selectedVerdictForPrint.catatan}"</p>
                  )}
                </div>

                {/* Detail Jadwal atau Denda */}
                {selectedVerdictForPrint.status_sidang === 'Penyelidikan / Pemanggilan' ? (
                  <div className="border-2 border-slate-950 p-4 rounded text-center space-y-1.5">
                    <p className="font-extrabold text-xs uppercase tracking-widest text-indigo-900 font-sans">** TAHAP PENYELIDIKAN & PEMANGGILAN **</p>
                    {selectedVerdictForPrint.tanggal_sidang ? (
                      <>
                        <p><span className="font-bold">Hari / Tanggal Sidang :</span> {new Date(selectedVerdictForPrint.tanggal_sidang).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="font-bold">Lokasi Sidang  :</span> {selectedVerdictForPrint.lokasi_sidang || '-'}</p>
                      </>
                    ) : (
                      <p className="font-bold text-slate-700">Dalam proses penyelidikan lapangan / penjadwalan sidang yustisial.</p>
                    )}
                    <p className="text-[10px] text-slate-550 italic">Harap membawa kartu identitas diri (KTP/SIM) dan dokumen penindakan ini jika dipanggil menghadap PPNS.</p>
                  </div>
                ) : selectedVerdictForPrint.status_sidang === 'Proses Sidang Tipiring' ? (
                  <div className="border-2 border-slate-950 p-4 rounded text-center space-y-1.5">
                    <p className="font-extrabold text-xs uppercase tracking-widest text-blue-900 font-sans">** SEDANG DALAM PROSES SIDANG TIPIRING **</p>
                    <p><span className="font-bold">Jadwal Sidang :</span> {selectedVerdictForPrint.tanggal_sidang ? new Date(selectedVerdictForPrint.tanggal_sidang).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                    <p><span className="font-bold">Lokasi Sidang :</span> {selectedVerdictForPrint.lokasi_sidang || '-'}</p>
                    {selectedVerdictForPrint.denda_dijatuhkan && (
                      <p><span className="font-bold">Tuntutan Sanksi Denda :</span> Rp {selectedVerdictForPrint.denda_dijatuhkan?.toLocaleString('id-ID')}</p>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-slate-955 p-4 rounded text-center space-y-1.5">
                    <p className="font-extrabold text-xs uppercase tracking-widest text-emerald-800 font-sans">** KEPUTUSAN HAKIM & AMAR PUTUSAN SIDANG (INKRACHT) **</p>
                    <p><span className="font-bold">Status Perkara :</span> KASUS SELESAI / CLEAR (LUNAS KAS DAERAH)</p>
                    <p><span className="font-bold">Sanksi Denda  :</span> Rp {selectedVerdictForPrint.denda_dijatuhkan?.toLocaleString('id-ID') || '0'}</p>
                    {selectedVerdictForPrint.no_bukti_setor && (
                      <p><span className="font-bold">Nomor Bukti Setor Kas :</span> <span className="font-mono text-emerald-800 font-extrabold">{selectedVerdictForPrint.no_bukti_setor}</span></p>
                    )}
                  </div>
                )}

                {/* Tanda Tangan */}
                <div className="pt-8 grid grid-cols-2 text-center text-xs font-sans">
                  <div>
                    <p>Penyidik PNS (PPNS)</p>
                    <p>Satpol PP Buleleng</p>
                    <p className="h-16"></p>
                    <p className="font-bold underline">I GEDE ASTARA, S.H.</p>
                    <p className="text-[9px]">NIP. 19780512 200501 1 004</p>
                  </div>
                  <div>
                    <p>Terdakwa / Pelanggar Aturan</p>
                    <p>Kabupaten Buleleng</p>
                    <p className="h-16"></p>
                    <p className="font-bold underline">({selectedVerdictForPrint.nama_pelanggar.substring(0, 20)})</p>
                    <p className="text-[9px]">Tanda Tangan & Nama Terang</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 border-t border-slate-200 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsVerdictModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer text-center border border-slate-200"
              >
                Tutup
              </button>
              <button
                onClick={triggerSummonVerdictPrint}
                className="flex-1 py-2.5 bg-[#561C24] hover:bg-[#6D2932] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <Gavel className="w-4 h-4 text-[#E8D8C4]" /> Cetak Berkas Summons
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 7: VIEW DETAILS OF PENEGAKAN PERADA */}
      {isDetailsModalOpen && selectedPenegakanDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-left">

            <div className="bg-[#561C24] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Detail Berkas Perkara Perada
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              <div className="space-y-4 text-xs md:text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">No. Registrasi Perkara</p>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{selectedPenegakanDetails.no_kejadian}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-455 tracking-wider">Jenis Penindakan / Sidang</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedPenegakanDetails.jenis_tindakan} ({selectedPenegakanDetails.status_sidang})</p>
                  </div>
                </div>

                <div className="border border-slate-150 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Informasi Terdakwa / Pelanggar
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-450 font-semibold">Nama Pelanggar:</span>
                      <span className="font-extrabold text-slate-850">{selectedPenegakanDetails.nama_pelanggar}</span>
                    </div>
                    {selectedPenegakanDetails.nik_pelanggar && (
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-450 font-semibold">NIK / No. KTP:</span>
                        <span className="font-mono font-bold text-slate-800">{selectedPenegakanDetails.nik_pelanggar}</span>
                      </div>
                    )}
                    {selectedPenegakanDetails.alamat_pelanggar && (
                      <div className="flex justify-between">
                        <span className="text-slate-450 font-semibold">Alamat Domisili:</span>
                        <span className="font-semibold text-slate-700 text-right max-w-[280px]">{selectedPenegakanDetails.alamat_pelanggar}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-150 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Detail Pelanggaran & Tindakan
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-450 font-semibold">Regulasi Dilanggar:</span>
                      <span className="font-bold text-slate-800">{selectedPenegakanDetails.kode_regulasi}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-455 font-semibold">Pasal Terlanggar:</span>
                      <span className="font-bold text-slate-800">{selectedPenegakanDetails.pasal_dilanggar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-semibold">Lokasi Kejadian (TKP):</span>
                      <span className="font-bold text-slate-850 text-right max-w-[280px]">{selectedPenegakanDetails.lokasi_kejadian}</span>
                    </div>
                  </div>
                </div>

                {selectedPenegakanDetails.kronologi_singkat && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                    <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-sans">Kronologi Kejadian</p>
                    <p className="text-slate-650 text-xs mt-1 leading-relaxed whitespace-pre-line font-medium italic">"{selectedPenegakanDetails.kronologi_singkat}"</p>
                  </div>
                )}

                {selectedPenegakanDetails.barang_bukti && (
                  <div className="bg-amber-50/20 p-4 rounded-xl border border-amber-200/55 flex items-start gap-2.5">
                    <Package className="w-4 h-4 text-[#561C24] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Daftar Barang Bukti Disita</p>
                      <p className="text-slate-700 text-xs mt-1 font-semibold whitespace-pre-line leading-relaxed">{selectedPenegakanDetails.barang_bukti}</p>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-sans">Tanggal Sidang</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                      {selectedPenegakanDetails.tanggal_sidang ? new Date(selectedPenegakanDetails.tanggal_sidang).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Belum Ditentukan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-sans">Lokasi Pengadilan</p>
                    <p className="text-xs font-semibold text-slate-750 mt-0.5">{selectedPenegakanDetails.lokasi_sidang || '-'}</p>
                  </div>
                </div>

                {selectedPenegakanDetails.status_sidang !== 'Penyelidikan / Pemanggilan' && (
                  <div className="bg-[#561C24]/5 p-4 rounded-xl border border-[#561C24]/20 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#561C24] tracking-wider">Denda Putusan Hakim</p>
                      <p className="text-rose-700 text-sm font-extrabold mt-0.5">Rp {selectedPenegakanDetails.denda_dijatuhkan?.toLocaleString('id-ID') || '0'}</p>
                      {selectedPenegakanDetails.no_bukti_setor && (
                        <p className="text-[9px] text-slate-500 mt-1 font-mono">No. Bukti Setor: {selectedPenegakanDetails.no_bukti_setor}</p>
                      )}
                    </div>
                    {selectedPenegakanDetails.status_sidang === 'Kasus Selesai (Clear)' && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-black uppercase tracking-wider">
                        LUNAS KAS DAERAH
                      </span>
                    )}
                  </div>
                )}

                {selectedPenegakanDetails.catatan && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line">
                    <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-1 font-sans">Catatan Tambahan</p>
                    {selectedPenegakanDetails.catatan}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedPenegakanDetails.bukti_setor_kas && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        openZoom(selectedPenegakanDetails.bukti_setor_kas);
                      }}
                      className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs text-slate-700 cursor-pointer active:scale-95"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-500" /> Lihat Slip Denda
                    </button>
                  )}
                  {selectedPenegakanDetails.scan_dokumen && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        openScanDokumen(selectedPenegakanDetails);
                      }}
                      className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs text-slate-700 cursor-pointer active:scale-95"
                    >
                      <FileText className="w-4 h-4 text-[#561C24]" /> Buka Scan BAP & Putusan
                    </button>
                  )}
                </div>

              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-150 px-6 py-4 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  openVerdictSummonModal(selectedPenegakanDetails);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Gavel className="w-3.5 h-3.5 text-amber-600" /> Cetak Panggilan/Putusan
              </button>

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-[#561C24] hover:bg-[#6D2932] text-white rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
              >
                Tutup Detail
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CUSTOM NOTIFICATION MODAL OVERLAY */}
      {notification && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className={`bg-white border border-slate-100 rounded-2xl max-w-sm w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden font-sans p-6 text-center space-y-4 border-t-4 ${notification.type === 'success' ? 'border-t-emerald-500' :
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

      <Footer />

    </div>
  );
}
