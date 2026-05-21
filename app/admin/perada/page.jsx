'use client';

import React, { useState, useEffect } from 'react';
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
  Package
} from 'lucide-react';

export default function PeradaAdmin() {
  const [activeTab, setActiveTab] = useState('regulasi'); // 'regulasi', 'pelanggaran', 'penegakan'
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    jenis_tindakan: 'Tipiring', // 'Tipiring', 'Yustisial'
    status_sidang: 'Penyelidikan / Pemanggilan', // Penyelidikan / Pemanggilan, Proses Sidang Tipiring, Kasus Selesai (Clear)
    tanggal_sidang: '',
    lokasi_sidang: 'Kantor Pengadilan Negeri Singaraja',
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
      alert("Hanya file berformat PDF yang diperbolehkan.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran dokumen PDF tidak boleh melebihi 3MB.");
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
      alert("Ukuran gambar tidak boleh melebihi 2MB.");
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
      alert("Ukuran dokumen tidak boleh melebihi 5MB.");
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
      jenis_tindakan: 'Tipiring',
      status_sidang: 'Penyelidikan / Pemanggilan',
      tanggal_sidang: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // H+7
      lokasi_sidang: 'Kantor Pengadilan Negeri Singaraja',
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
      jenis_tindakan: 'Tipiring',
      status_sidang: 'Penyelidikan / Pemanggilan',
      tanggal_sidang: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      lokasi_sidang: 'Kantor Pengadilan Negeri Singaraja',
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
        alert(data.message);
        setIsRegulasiModalOpen(false);
        fetchRegulasi();
      } else {
        alert(data.error || "Gagal menyimpan Master Regulasi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi database.");
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
        alert(data.message);
        setIsPelanggaranModalOpen(false);
        fetchPelanggaran();
      } else {
        alert(data.error || "Gagal menyimpan Katalog Pelanggaran.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi database.");
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
        alert(data.message);
        setIsPenegakanModalOpen(false);
        fetchPenegakan();
        if (activeTab === 'penegakan') {
          fetchDelegatedReports();
        }
      } else {
        alert(data.error || "Gagal menyimpan Log Penegakan Perda.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi database.");
    }
  };

  // Delete Handlers
  const handleDeleteRegulasi = async (id, kode) => {
    if (!confirm(`Hapus Master Regulasi: ${kode}?\nPERINGATAN: Menghapus regulasi ini juga akan menghapus katalog pelanggaran yang terkait.`)) return;
    try {
      const res = await fetch(`/api/perada/regulasi?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Master Regulasi berhasil dihapus.");
        fetchRegulasi();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePelanggaran = async (id, pasal) => {
    if (!confirm(`Hapus katalog pelanggaran ${pasal} ini secara permanen?`)) return;
    try {
      const res = await fetch(`/api/perada/pelanggaran?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Katalog Pelanggaran berhasil dihapus.");
        fetchPelanggaran();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePenegakan = async (id, no_kej) => {
    if (!confirm(`Hapus log penegakan dengan nomor kejadian: ${no_kej}?\nTindakan ini bersifat permanen.`)) return;
    try {
      const res = await fetch(`/api/perada/penegakan?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Log Penegakan berhasil dihapus.");
        fetchPenegakan();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPdfViewer = (reg) => {
    if (!reg.berkas_pdf) {
      alert("Tidak ada berkas PDF lembaran daerah yang diunggah.");
      return;
    }
    setSelectedPdfContent(reg.berkas_pdf);
    setSelectedPdfTitle(`${reg.jenis_peraturan} No. ${reg.nomor_peraturan} Tahun ${reg.tahun_peraturan}`);
    setIsPdfViewerOpen(true);
  };

  const openScanDokumen = (item) => {
    if (!item.scan_dokumen) {
      alert("Tidak ada berkas scan BAP & Putusan yang diunggah.");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* Decorative Blur Backgrounds */}
      <div className="bg-indigo-500/5 w-[35rem] h-[35rem] rounded-full blur-[140px] absolute -top-48 -left-48 pointer-events-none z-0" />
      <div className="bg-amber-500/5 w-[35rem] h-[35rem] rounded-full blur-[140px] absolute -bottom-48 -right-48 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/80 backdrop-blur border border-slate-800/80 p-5 md:p-6 rounded-2xl shadow-xl gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-slate-400 hover:text-slate-100 transition-all cursor-pointer shadow-inner"
              title="Kembali ke Dashboard Utama"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded">
                  PORTAL BIDANG PERADA
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent flex items-center gap-2">
                PENEGAKAN PERDA & SIDANG YUSTISIAL
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Seksi Penegakan Perundang-undangan Daerah & Perda/Perbup - Kabupaten Buleleng
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              if (activeTab === 'regulasi') openCreateRegulasi();
              else if (activeTab === 'pelanggaran') openCreatePelanggaran();
              else if (activeTab === 'penegakan') openCreatePenegakan();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-indigo-900/20 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            {activeTab === 'regulasi' ? 'Registrasi Regulasi' : activeTab === 'pelanggaran' ? 'Tambah Pasal Katalog' : 'Catat Penegakan/Sidang'}
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 p-1 rounded-xl backdrop-blur">
          <button
            onClick={() => { setActiveTab('regulasi'); setSearchQuery(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'regulasi' 
                ? 'bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border border-indigo-500/30 text-indigo-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Kamus Hukum (Perda/Perbup)
          </button>
          <button
            onClick={() => { setActiveTab('pelanggaran'); setSearchQuery(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pelanggaran' 
                ? 'bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border border-indigo-500/30 text-indigo-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Katalog Pasal & Denda
          </button>
          <button
            onClick={() => { setActiveTab('penegakan'); setSearchQuery(''); }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
              activeTab === 'penegakan' 
                ? 'bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border border-indigo-500/30 text-indigo-400' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gavel className="w-4 h-4" /> Penegakan Perda & Sidang
            {delegatedReports.length > 0 && (
              <span className="absolute top-2 right-2 md:right-4 w-5 h-5 rounded-full bg-red-650 text-white text-[9px] font-black flex items-center justify-center animate-bounce shadow">
                {delegatedReports.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar Utilities */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Cari data ${activeTab === 'regulasi' ? 'regulasi Perda/Perbup' : activeTab === 'pelanggaran' ? 'pasal/pelanggaran' : 'pelanggar/sidang'} berdasarkan judul, kode, atau pasal...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-semibold text-slate-350 focus:outline-none focus:border-indigo-500 placeholder:text-slate-650"
          />
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="text-center py-16 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <div className="text-sm font-semibold text-slate-450">Memuat data dari SQLite dev.db...</div>
          </div>
        )}

        {/* TAB 1: MASTER PERDA & PERBUP */}
        {!loading && activeTab === 'regulasi' && (
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Total Regulasi Terdaftar</p>
                  <p className="text-2xl font-black text-slate-100">{regulasiList.length}</p>
                </div>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Peraturan Daerah (Perda)</p>
                  <p className="text-2xl font-black text-indigo-400">
                    {regulasiList.filter(r => r.jenis_peraturan === 'Perda').length} Regulasi
                  </p>
                </div>
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg">
                  <Scale className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Perbup / Perkada</p>
                  <p className="text-2xl font-black text-amber-400">
                    {regulasiList.filter(r => r.jenis_peraturan?.includes('Perbup')).length} Regulasi
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* List Kamus Hukum */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              {filteredRegulasi.length === 0 ? (
                <div className="text-center p-12 text-slate-400 space-y-2">
                  <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="font-bold">Belum ada regulasi terdaftar</p>
                  <p className="text-xs text-slate-500">Silakan klik tombol "Registrasi Regulasi" di atas untuk mendaftarkan!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <th className="py-4 px-6">Kode / Jenis</th>
                        <th className="py-4 px-6">Nomor / Tahun</th>
                        <th className="py-4 px-6">Judul / Tentang Regulasi Resmi</th>
                        <th className="py-4 px-6">Dokumen Asli</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredRegulasi.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-900/30 transition-all duration-150">
                          <td className="py-4 px-6 space-y-1">
                            <div className="font-mono font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded inline-block">
                              {reg.kode_regulasi}
                            </div>
                            <div>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                reg.jenis_peraturan === 'Perda' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                              }`}>
                                {reg.jenis_peraturan}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-200">
                            No. {reg.nomor_peraturan} Tahun {reg.tahun_peraturan}
                          </td>
                          <td className="py-4 px-6 max-w-[320px] text-slate-350 leading-relaxed font-semibold italic">
                            "{reg.judul_tentang}"
                          </td>
                          <td className="py-4 px-6">
                            {reg.berkas_pdf ? (
                              <button
                                onClick={() => openPdfViewer(reg)}
                                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                                title="Buka berkas lembaran daerah"
                              >
                                <Eye className="w-3.5 h-3.5" /> Buka PDF
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-bold italic">Tanpa Berkas</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditRegulasi(reg)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-300 hover:text-slate-100 rounded-lg transition"
                                title="Edit Regulasi"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRegulasi(reg.id, reg.kode_regulasi)}
                                className="p-1.5 bg-slate-800 hover:bg-red-950 border border-slate-750 text-slate-300 hover:text-red-400 rounded-lg transition"
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
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Pasal Terkatalog</p>
                  <p className="text-2xl font-black text-slate-100">{pelanggaranList.length} Ketentuan</p>
                </div>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Denda Maksimal Tertinggi</p>
                  <p className="text-2xl font-black text-rose-400">
                    Rp {pelanggaranList.length > 0 ? Math.max(...pelanggaranList.map(p => p.denda_maksimal || 0)).toLocaleString('id-ID') : '0'}
                  </p>
                </div>
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                  <Gavel className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* List Katalog Pelanggaran */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              {filteredPelanggaran.length === 0 ? (
                <div className="text-center p-12 text-slate-400 space-y-2">
                  <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="font-bold">Belum ada pasal katalog terdaftar</p>
                  <p className="text-xs text-slate-500">Silakan klik "+ Tambah Pasal Katalog" di atas untuk mendaftarkan!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <th className="py-4 px-6">Pasal Acuan</th>
                        <th className="py-4 px-6">Kode Regulasi</th>
                        <th className="py-4 px-6">Uraian / Jenis Pelanggaran Aturan</th>
                        <th className="py-4 px-6">Sanksi Maksimal</th>
                        <th className="py-4 px-6">Batas Maksimal Denda</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredPelanggaran.map((pel) => (
                        <tr key={pel.id} className="hover:bg-slate-900/30 transition-all duration-150">
                          <td className="py-4 px-6 font-mono font-black text-indigo-400">
                            {pel.pasal}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-350">
                            {pel.kode_regulasi}
                          </td>
                          <td className="py-4 px-6 max-w-[300px] text-slate-300 font-semibold leading-relaxed">
                            {pel.jenis_pelanggaran}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              pel.sanksi_maksimal === 'Kurungan' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                              pel.sanksi_maksimal === 'Pencabutan Izin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                              'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            }`}>
                              {pel.sanksi_maksimal || 'Denda'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-rose-400 font-extrabold text-sm">
                            {pel.sanksi_maksimal === 'Denda' || !pel.sanksi_maksimal ? `Rp ${pel.denda_maksimal.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditPelanggaran(pel)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-300 hover:text-slate-100 rounded-lg transition"
                                title="Edit Ketentuan"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePelanggaran(pel.id, pel.pasal)}
                                className="p-1.5 bg-slate-800 hover:bg-red-950 border border-slate-750 text-slate-300 hover:text-red-400 rounded-lg transition"
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
              <div className="bg-gradient-to-r from-indigo-950/15 to-violet-950/15 border border-indigo-900/35 p-5 rounded-2xl backdrop-blur flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0 animate-pulse">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-sm font-black text-slate-200">DELEGASI DISPOSISI BIDANG PERADA ({delegatedReports.length})</h3>
                    <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                      Laporan pengaduan masyarakat yang dialihkan khusus ke seksi **Penegakan Perda & Perbup**. 
                      Tindak lanjuti untuk menyalin GPS, mengagendakan sidang Tipiring, atau menjatuhkan sanksi hukum secara resmi.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {delegatedReports.map((report) => (
                      <div key={report.id_tiket} className="bg-slate-950/50 p-3 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
                        <div className="truncate space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/15">{report.id_tiket}</span>
                          <p className="text-[11px] font-bold text-slate-200 truncate">{report.kategori_masalah}</p>
                          <p className="text-[9px] text-slate-500 truncate">Pelapor: {report.nama_pelapor}</p>
                        </div>
                        <button
                          onClick={() => handleFollowupComplaint(report)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Proses Hukum
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grid Penegakan Perda / Sidang */}
            {filteredPenegakan.length === 0 ? (
              <div className="text-center p-16 bg-slate-900/40 border border-slate-850 rounded-2xl text-slate-400 space-y-2">
                <Gavel className="w-12 h-12 text-slate-700 mx-auto animate-bounce" />
                <p className="font-bold">Belum ada log penegakan hukum/sidang</p>
                <p className="text-xs text-slate-500">Silakan klik "+ Catat Penegakan/Sidang" untuk meregistrasikan kasus yustisial!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPenegakan.map((item) => {
                  const tindDate = new Date(item.tanggal_tindakan).toLocaleDateString('id-ID', {
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
                      className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition duration-300 shadow-xl flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        
                        {/* Top Bar Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            item.jenis_tindakan === 'Yustisial' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            Sidang {item.jenis_tindakan}
                          </span>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.status_sidang === 'Kasus Selesai (Clear)' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold' :
                            item.status_sidang === 'Proses Sidang Tipiring' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse font-bold'
                          }`}>
                            {item.status_sidang}
                          </span>
                        </div>

                        {/* Title & Case Number */}
                        <div className="flex justify-between items-center bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
                          <div className="space-y-0.5">
                            <span className="text-[8px] uppercase font-black text-slate-500">Nomor Registrasi Perkara</span>
                            <p className="text-xs font-mono font-bold text-slate-200">{item.no_kejadian}</p>
                          </div>
                          
                          <button
                            onClick={() => openVerdictSummonModal(item)}
                            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center justify-center gap-1 text-[10px] font-bold shadow cursor-pointer"
                            title="Cetak lembar panggilan/putusan sidang"
                          >
                            <Gavel className="w-3.5 h-3.5" /> Surat Sidang
                          </button>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-3 text-xs">
                          
                          {/* Nama Pelanggar */}
                          <div className="bg-slate-955/40 p-2.5 rounded-lg border border-slate-900 text-[11px] font-semibold text-slate-400 space-y-1.5">
                            <div>
                              <p className="text-[8px] uppercase font-bold text-slate-500">Terdakwa / Pelanggar Aturan</p>
                              <p className="text-slate-200 mt-0.5 font-bold">{item.nama_pelanggar}</p>
                              {item.nik_pelanggar && (
                                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                  NIK/KTP: <span className="text-indigo-400 font-bold">{item.nik_pelanggar}</span>
                                </p>
                              )}
                              {item.alamat_pelanggar && (
                                <p className="text-[10px] text-slate-455 mt-1 flex items-start gap-1 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-slate-550 shrink-0 mt-0.5" />
                                  <span>Alamat: {item.alamat_pelanggar}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Detail Pasal */}
                          <div className="flex items-start gap-2.5">
                            <Scale className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Landasan Regulasi & Pasal</p>
                              <p className="font-bold text-slate-200">{item.kode_regulasi} - {item.pasal_dilanggar}</p>
                            </div>
                          </div>

                          {/* Lokasi & Tanggal Kejadian */}
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Lokasi Penindakan Lapangan</p>
                              <p className="font-bold text-slate-200">{item.lokasi_kejadian}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5 font-semibold">Tindakan: {tindDate}</p>
                            </div>
                          </div>

                          {/* Kronologi Singkat */}
                          {item.kronologi_singkat && (
                            <div className="bg-slate-955/25 p-2.5 rounded-lg border border-slate-900 text-[11px] font-semibold text-slate-400 space-y-1">
                              <p className="text-[8px] uppercase font-bold text-slate-500">Kronologi Singkat / Temuan TKP</p>
                              <p className="text-slate-300 text-xs font-normal whitespace-pre-line leading-relaxed">{item.kronologi_singkat}</p>
                            </div>
                          )}

                          {/* Barang Bukti */}
                          {item.barang_bukti && (
                            <div className="flex items-start gap-2.5 bg-slate-950/20 p-2.5 rounded-xl border border-slate-900/60 font-semibold text-slate-400">
                              <Package className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="text-[9px] uppercase font-bold text-amber-500">Daftar Barang Bukti Disita</p>
                                <p className="text-slate-200 text-[11px] font-medium whitespace-pre-line leading-relaxed">{item.barang_bukti}</p>
                              </div>
                            </div>
                          )}

                          {/* Jadwal Sidang */}
                          <div className="flex items-start gap-2.5 bg-slate-950/20 p-2.5 rounded-xl border border-slate-900/60 font-semibold text-slate-400 font-medium">
                            <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="text-[9px] uppercase font-bold text-indigo-400">Jadwal Sidang Pengadilan</p>
                              <p className="text-slate-200 text-[11px] font-bold">
                                {item.tanggal_sidang ? new Date(item.tanggal_sidang).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Belum Ditentukan'}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.lokasi_sidang || '-'}</p>
                            </div>
                          </div>

                          {/* Sanksi Denda */}
                          {item.status_sidang !== 'Penyelidikan / Pemanggilan' && (
                            <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-900 text-[11px] font-semibold text-slate-400 flex justify-between items-center font-medium">
                              <div>
                                <p className="text-[8px] uppercase font-bold text-slate-500">Denda Yang Dijatuhkan</p>
                                <p className="text-rose-400 text-sm font-extrabold mt-0.5">Rp {item.denda_dijatuhkan?.toLocaleString('id-ID') || '0'}</p>
                                {item.no_bukti_setor && (
                                  <p className="text-[9px] text-slate-500 mt-1 font-mono">
                                    No. Bukti Setor: <span className="text-indigo-400 font-bold">{item.no_bukti_setor}</span>
                                  </p>
                                )}
                              </div>
                              
                              {item.status_sidang === 'Kasus Selesai (Clear)' && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-[4px] text-[9px] font-black uppercase tracking-wider">
                                  LUNAS KAS DAERAH
                                </span>
                              )}
                            </div>
                          )}

                          {/* Uraian Catatan Kasus */}
                          {item.catatan && (
                            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/25 p-3 rounded-lg border border-slate-900/60 font-medium whitespace-pre-line">
                              <p className="text-[8px] uppercase font-bold text-slate-500 mb-1">Catatan / Keterangan Tambahan</p>
                              {item.catatan}
                            </div>
                          )}

                          {/* Bukti Setor Kas Negara */}
                          {item.bukti_setor_kas ? (
                            <div 
                              className="relative h-36 rounded-xl overflow-hidden border border-slate-800 group cursor-zoom-in"
                              onClick={() => openZoom(item.bukti_setor_kas)}
                            >
                              <img 
                                src={item.bukti_setor_kas} 
                                alt="Bukti Setor Kas Daerah" 
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-slate-955/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Bukti Setor Kas Daerah
                                </span>
                              </div>
                            </div>
                          ) : item.status_sidang === 'Kasus Selesai (Clear)' ? (
                            <div className="h-20 bg-slate-950/40 border border-dashed border-red-500/25 rounded-xl flex flex-col items-center justify-center text-rose-450 text-xs">
                              <AlertTriangle className="w-5 h-5 text-rose-500 mb-1" />
                              Lunas, namun bukti setor kas belum diunggah!
                            </div>
                          ) : null}

                          {/* Scan BAP & Putusan */}
                          {item.scan_dokumen && (
                            <button
                              type="button"
                              onClick={() => openScanDokumen(item)}
                              className="w-full py-2.5 bg-indigo-950/40 hover:bg-indigo-900/45 border border-indigo-900/50 hover:border-indigo-800 text-indigo-400 hover:text-indigo-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                            >
                              <FileText className="w-4 h-4" /> Lihat Scan BAP & Putusan
                            </button>
                          )}

                          {/* Referensi Tiket Aduan */}
                          {item.id_tiket && (
                            <div className="pt-1 text-[10px] font-mono">
                              <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded">
                                Tindak Lanjut Tiket: {item.id_tiket}
                              </span>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 border-t border-slate-800/60 pt-3 flex justify-end gap-2">
                        <button
                          onClick={() => openEditPenegakan(item)}
                          className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-750 text-slate-300 hover:text-slate-100 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Kasus
                        </button>
                        <button
                          onClick={() => handleDeletePenegakan(item.id, item.no_kejadian)}
                          className="px-3 py-1.5 bg-slate-800/80 hover:bg-red-950/80 border border-slate-750 text-slate-400 hover:text-red-400 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus Kasus
                        </button>
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
      {/* MODAL 1: REGISTRASI / EDIT MASTER PERDA & PERBUP */}
      {isRegulasiModalOpen && (
        <div className="fixed inset-0 bg-slate-955/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 md:p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                {regulasiFormMode === 'create' ? 'Registrasi Regulasi Baru' : 'Perbarui Regulasi Hukum'}
              </h3>
              <button
                onClick={() => setIsRegulasiModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegulasiSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Jenis Peraturan (Radio Buttons) */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Jenis Regulasi / Peraturan</label>
                  <div className="flex gap-4 bg-slate-950/45 p-2 rounded-xl border border-slate-850">
                    {[
                      { value: 'Perda', label: 'Perda (Peraturan Daerah)' },
                      { value: 'Perbup/Perkada', label: 'Perbup/Perkada (Peraturan Bupati)' }
                    ].map((opt) => (
                      <label 
                        key={opt.value} 
                        className={`flex-1 py-2 px-3 text-center rounded-lg border text-xs font-bold cursor-pointer transition select-none flex items-center justify-center gap-2 ${
                          regulasiForm.jenis_peraturan === opt.value 
                            ? 'bg-indigo-650/15 border-indigo-500 text-indigo-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="jenis_peraturan"
                          value={opt.value}
                          checked={regulasiForm.jenis_peraturan === opt.value}
                          onChange={(e) => setRegulasiForm({ ...regulasiForm, jenis_peraturan: e.target.value })}
                          className="accent-indigo-500"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nomor Peraturan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Nomor Regulasi (Contoh: Nomor 3)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nomor 6, Nomor 12/A, dll"
                    value={regulasiForm.nomor_peraturan}
                    onChange={(e) => setRegulasiForm({ ...regulasiForm, nomor_peraturan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.nomor_peraturan && <p className="text-[9px] text-red-505 font-bold">{formErrors.nomor_peraturan}</p>}
                </div>

                {/* Tahun Peraturan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Tahun Disahkan (Contoh: 2024)</label>
                  <input
                    type="number"
                    required
                    value={regulasiForm.tahun_peraturan}
                    onChange={(e) => setRegulasiForm({ ...regulasiForm, tahun_peraturan: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Judul Tentang Peraturan */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Judul / Tentang Regulasi Resmi</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Tulis judul lengkap peraturan (Contoh: Tentang Ketertiban Umum dan Ketentraman Masyarakat serta Perlindungan Masyarakat)"
                    value={regulasiForm.judul_tentang}
                    onChange={(e) => setRegulasiForm({ ...regulasiForm, judul_tentang: e.target.value })}
                    className="w-full bg-slate-955 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                  {formErrors.judul_tentang && <p className="text-[9px] text-red-505 font-bold">{formErrors.judul_tentang}</p>}
                </div>

                {/* Berkas Dokumen PDF */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Unggah Berkas Dokumen Lembaran Daerah (Format: PDF - Maks 3MB)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700/80 cursor-pointer"
                  />
                  {regulasiForm.berkas_pdf && (
                    <div className="bg-emerald-950/20 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-emerald-400 text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500" /> Berkas lembaran PDF terunggah & terenkripsi dalam database SQLite
                      </span>
                      <button
                        type="button"
                        onClick={() => setRegulasiForm({ ...regulasiForm, berkas_pdf: null })}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold underline"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-850 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRegulasiModalOpen(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-955/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 md:p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                {pelanggaranFormMode === 'create' ? 'Tambah Pasal Pelanggaran Baru' : 'Edit Ketentuan Pelanggaran'}
              </h3>
              <button
                onClick={() => setIsPelanggaranModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePelanggaranSubmit} className="space-y-4">
              
              <div className="space-y-4">
                
                {/* Kode Regulasi Acuan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Hubungkan ke Regulasi Acuan (Perda/Perbup)</label>
                  <select
                    value={pelanggaranForm.kode_regulasi}
                    onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, kode_regulasi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>-- Pilih Regulasi --</option>
                    {regulasiList.map((reg) => (
                      <option key={reg.id} value={reg.kode_regulasi}>
                        {reg.kode_regulasi} - {reg.jenis_peraturan} No. {reg.nomor_peraturan} ({reg.tahun_peraturan})
                      </option>
                    ))}
                  </select>
                  {formErrors.kode_regulasi && <p className="text-[9px] text-red-500 font-bold">{formErrors.kode_regulasi}</p>}
                </div>

                {/* Pasal (Contoh: Pasal 5 Ayat 1) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Rincian Pasal & Ayat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pasal 5 Ayat (1), Pasal 12 Huruf b, dll"
                    value={pelanggaranForm.pasal}
                    onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, pasal: e.target.value })}
                    className="w-full bg-slate-955 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.pasal && <p className="text-[9px] text-red-500 font-bold">{formErrors.pasal}</p>}
                </div>

                {/* Deskripsi Jenis Pelanggaran */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Deskripsi / Jenis Pelanggaran Aturan</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Tulis rincian perbuatan yang dilarang (Contoh: Menaruh barang dagangan di atas trotoar yang mengganggu hak pejalan kaki)"
                    value={pelanggaranForm.jenis_pelanggaran}
                    onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, jenis_pelanggaran: e.target.value })}
                    className="w-full bg-slate-955 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                  {formErrors.jenis_pelanggaran && <p className="text-[9px] text-red-500 font-bold">{formErrors.jenis_pelanggaran}</p>}
                </div>

                {/* Sanksi Maksimal Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Sanksi Maksimal</label>
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
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Denda">Denda (Uang Rupiah)</option>
                    <option value="Kurungan">Kurungan (Pidana Penjara)</option>
                    <option value="Pencabutan Izin">Pencabutan Izin Usaha</option>
                  </select>
                </div>

                {/* Batas Sanksi Denda Maksimal */}
                {(pelanggaranForm.sanksi_maksimal === 'Denda' || !pelanggaranForm.sanksi_maksimal) && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Batas Maksimal Denda (Rupiah)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Contoh: 5000000"
                      value={pelanggaranForm.denda_maksimal}
                      onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, denda_maksimal: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-850 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPelanggaranModalOpen(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-955/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 md:p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-indigo-400" />
                {penegakanFormMode === 'create' ? 'Catat Tindakan Penegakan Perda' : 'Edit Log Kasus Sidang'}
              </h3>
              <button
                onClick={() => setIsPenegakanModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePenegakanSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Nomor Berkas Registrasi */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Nomor Berkas Registrasi</label>
                  <input
                    type="text"
                    disabled
                    value={penegakanFormMode === 'create' ? "BAP/PERADA/YYYY/XXX (Otomatis)" : (penegakanForm.no_kejadian || "BAP/PERADA/YYYY/XXX")}
                    className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-455 cursor-not-allowed"
                  />
                </div>

                {/* 2. Nomor Tiket Aduan */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Nomor Tiket Aduan (Opsional)</label>
                  <select
                    value={penegakanForm.id_tiket}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, id_tiket: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
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
                  <label className="text-[10px] uppercase font-bold text-slate-400">Tanggal Penindakan (Operasional)</label>
                  <input
                    type="datetime-local"
                    required
                    value={penegakanForm.tanggal_tindakan}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, tanggal_tindakan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* 4. Nama Pelanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Nama Lengkap Pelanggar</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / CV Maju Bersama"
                    value={penegakanForm.nama_pelanggar}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, nama_pelanggar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.nama_pelanggar && <p className="text-[9px] text-red-500 font-bold">{formErrors.nama_pelanggar}</p>}
                </div>

                {/* 5. NIK Pelanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Nomor KTP / NIK Pelanggar (16 Digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Contoh: 510801xxxxxxxxxx (16 digit)"
                    value={penegakanForm.nik_pelanggar}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // numbers only
                      setPenegakanForm({ ...penegakanForm, nik_pelanggar: val });
                    }}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.nik_pelanggar && <p className="text-[9px] text-red-500 font-bold">{formErrors.nik_pelanggar}</p>}
                </div>

                {/* 6. Alamat Pelanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Alamat Tempat Tinggal / Usaha Pelanggar</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Diponegoro No. 45, Singaraja"
                    value={penegakanForm.alamat_pelanggar}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, alamat_pelanggar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* 6.1 Lokasi Kejadian (TKP) */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Tempat Kejadian Perkara (TKP) / Lokasi Penindakan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Trotoar depan Ruko Jalan Ngurah Rai, Singaraja"
                    value={penegakanForm.lokasi_kejadian}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, lokasi_kejadian: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  {formErrors.lokasi_kejadian && <p className="text-[9px] text-red-500 font-bold">{formErrors.lokasi_kejadian}</p>}
                </div>

                {/* 7. Pilih Regulasi Yang Dilanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Pilih Perda / Perbup Terlanggar</label>
                  <select
                    value={penegakanForm.kode_regulasi}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, kode_regulasi: e.target.value, pasal_dilanggar: '' })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>-- Pilih Regulasi --</option>
                    {regulasiList.map((reg) => (
                      <option key={reg.id} value={reg.kode_regulasi}>
                        {reg.kode_regulasi} - {reg.jenis_peraturan} No. {reg.nomor_peraturan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7.1 Pilih Pasal Terlanggar */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Pilih Ketentuan Pasal Pelanggaran</label>
                  <select
                    value={penegakanForm.pasal_dilanggar}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, pasal_dilanggar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Pilih Pasal/Ketentuan --</option>
                    {pelanggaranList
                      .filter(p => p.kode_regulasi === penegakanForm.kode_regulasi)
                      .map((pel) => (
                        <option key={pel.id} value={pel.pasal}>
                          {pel.pasal} - Max: Rp {pel.denda_maksimal?.toLocaleString('id-ID')} ({pel.sanksi_maksimal})
                        </option>
                      ))}
                    {/* Fallback */}
                    <option value="Pasal 5 Ayat 1">Pasal 5 Ayat 1 (Zonasi Usaha)</option>
                    <option value="Pasal 12 Huruf a">Pasal 12 Huruf a (Ketertiban Umum)</option>
                  </select>
                  {formErrors.pasal_dilanggar && <p className="text-[9px] text-red-500 font-bold">{formErrors.pasal_dilanggar}</p>}
                </div>

                {/* 8. Kronologi Singkat */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Kronologi Singkat Temuan TKP</label>
                  <textarea
                    rows="2"
                    placeholder="Contoh: Petugas menemukan lapak PKL liar berjualan di atas trotoar menghalangi pejalan kaki..."
                    value={penegakanForm.kronologi_singkat}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, kronologi_singkat: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                </div>

                {/* 9. Daftar Barang Bukti */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Daftar Barang Bukti Disita</label>
                  <textarea
                    rows="2"
                    placeholder="Contoh: 1 buah rombong kayu, 3 buah kursi plastik warna biru..."
                    value={penegakanForm.barang_bukti}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, barang_bukti: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                </div>

                {/* Jenis Tindakan (Radio) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Jenis Tindakan Hukum</label>
                  <div className="flex gap-2">
                    {['Tipiring', 'Yustisial'].map((tind) => (
                      <label 
                        key={tind} 
                        className={`flex-1 py-2 text-center rounded-xl border text-xs font-bold cursor-pointer transition select-none flex items-center justify-center gap-1.5 ${
                          penegakanForm.jenis_tindakan === tind 
                            ? 'bg-indigo-650/15 border-indigo-500 text-indigo-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-450 hover:text-slate-350'
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

                {/* 10. Status Proses Hukum */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Status Proses Hukum (Visual Spec)</label>
                  <select
                    value={penegakanForm.status_sidang}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, status_sidang: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Penyelidikan / Pemanggilan">Penyelidikan / Pemanggilan</option>
                    <option value="Proses Sidang Tipiring">Proses Sidang Tipiring</option>
                    <option value="Kasus Selesai (Clear)">Kasus Selesai (Clear)</option>
                  </select>
                </div>

                {/* 11. Nilai Denda Putusan Hakim */}
                {penegakanForm.status_sidang !== 'Penyelidikan / Pemanggilan' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Nilai Denda Putusan Hakim (Rp)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={penegakanForm.denda_dijatuhkan}
                      onChange={(e) => setPenegakanForm({ ...penegakanForm, denda_dijatuhkan: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* 12. Nomor Bukti Setor Kas Daerah */}
                {penegakanForm.status_sidang === 'Kasus Selesai (Clear)' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Nomor Bukti Setor Kas Daerah</label>
                    <input
                      type="text"
                      placeholder="Contoh: TRX-188288-DKD"
                      value={penegakanForm.no_bukti_setor}
                      onChange={(e) => setPenegakanForm({ ...penegakanForm, no_bukti_setor: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-605 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* 13. Dokumen Scan BAP & Putusan */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Dokumen Scan BAP & Putusan Resmi (Format: PDF/Gambar - Maks 5MB)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleScanDokumenUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700/80 cursor-pointer"
                    />
                    {penegakanForm.scan_dokumen && (
                      <div className="bg-emerald-950/20 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-emerald-400 text-xs w-full">
                        <span className="font-bold flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-500" /> Berkas scan terunggah secara Base64
                        </span>
                        <button
                          type="button"
                          onClick={() => setPenegakanForm({ ...penegakanForm, scan_dokumen: null })}
                          className="text-[10px] text-red-400 hover:text-red-300 font-bold underline"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bukti Slip Setor Kas Negara Legacy (Optional) */}
                {penegakanForm.status_sidang === 'Kasus Selesai (Clear)' && (
                  <div className="space-y-2 col-span-2 border-t border-slate-800/50 pt-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Bukti Slip Setor Kas Negara (Format Gambar - Kamera HP - Maks 2MB)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBuktiSetorUpload}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700/80 cursor-pointer"
                      />
                      {penegakanForm.bukti_setor_kas && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-800">
                          <img src={penegakanForm.bukti_setor_kas} alt="Preview Bukti Setor" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPenegakanForm({ ...penegakanForm, bukti_setor_kas: null })}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-slate-955/80 hover:bg-slate-900 border border-slate-800 text-red-400 hover:text-red-300 rounded-md transition"
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
                  <label className="text-[10px] uppercase font-bold text-slate-400">Catatan Sidang / Keterangan Tambahan</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Uraian tuntutan, denda kumulatif, data penyidik PNS, atau detail putusan sidang pengadilan..."
                    value={penegakanForm.catatan}
                    onChange={(e) => setPenegakanForm({ ...penegakanForm, catatan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 placeholder:text-slate-655 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                  {formErrors.catatan && <p className="text-[9px] text-red-500 font-bold">{formErrors.catatan}</p>}
                </div>

                {/* Selesaikan Aduan Warga Checkbox */}
                {penegakanForm.id_tiket && (
                  <div className="bg-indigo-950/15 border border-indigo-900/35 p-3 rounded-xl flex items-center gap-3 col-span-2">
                    <input
                      type="checkbox"
                      id="selesaikan_aduan"
                      checked={penegakanForm.selesaikan_aduan}
                      onChange={(e) => setPenegakanForm({ ...penegakanForm, selesaikan_aduan: e.target.checked })}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="selesaikan_aduan" className="text-xs font-bold text-slate-200 select-none cursor-pointer">
                      Tandai Aduan Warga ({penegakanForm.id_tiket}) sebagai "Selesai" (Prisma $transaction)
                    </label>
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-850 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPenegakanModalOpen(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-350 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-55 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 rounded-xl transition-all cursor-pointer z-10"
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
        <div className="fixed inset-0 bg-slate-955/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl p-5 md:p-6 space-y-4 flex flex-col justify-between">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Pratinjau Dokumen Hukum: {selectedPdfTitle}
              </h3>
              <button
                onClick={() => setIsPdfViewerOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Premium PDF document frame */}
            <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden relative flex flex-col justify-between p-6 md:p-12 text-slate-350 font-serif leading-relaxed text-sm shadow-inner overflow-y-auto">
              
              {/* Header Lembaran Daerah */}
              <div className="text-center space-y-2 font-bold font-sans text-slate-100 border-b-2 border-slate-100 pb-4 shrink-0">
                <p className="text-sm tracking-widest">LEMBARAN DAERAH KABUPATEN BULELENG</p>
                <p className="text-[10px] tracking-widest text-slate-400">SALINAN REGULASI RESMI NEGARA REPUBLIK INDONESIA</p>
                <p className="text-xs uppercase font-extrabold text-indigo-400 mt-1">{selectedPdfTitle}</p>
              </div>

              {/* Body Lembaran Daerah */}
              <div className="my-6 space-y-4 text-xs md:text-sm font-serif text-slate-300 max-w-2xl mx-auto leading-loose">
                {selectedPdfTitle.includes("Scan BAP") ? (
                  <div className="space-y-4 py-8">
                    <p className="text-center font-bold tracking-wide text-lg text-slate-100 underline">BERITA ACARA PENINDAKAN & PUTUSAN PENGADILAN</p>
                    <div className="text-center font-extrabold text-[11px] tracking-widest font-sans uppercase text-emerald-450 border border-emerald-500/25 p-3 rounded-xl bg-emerald-500/5 my-4">
                      DOKUMEN SCAN FISIK ASLI TERSIMPAN SECARA ELEKTRONIK DALAM BASE64
                    </div>
                    <p className="text-justify font-semibold leading-relaxed text-slate-300">
                      Telah berhasil dilampirkan dokumen resmi hasil pemindaian (scan) lembar Berita Acara Pemeriksaan (BAP) dan lembar Putusan Hakim Pengadilan Negeri Singaraja terkait pelanggaran bersangkutan.
                    </p>
                    <p className="text-justify leading-relaxed text-slate-400 text-xs">
                      Catatan Keamanan: Dokumen ini telah diverifikasi oleh Pejabat Penyidik Pegawai Negeri Sipil (PPNS) Satuan Polisi Pamong Praja Kabupaten Buleleng. Anda dapat mengunduh berkas lengkap dengan mengklik tombol "Unduh Berkas Lembaran" di bawah ini.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-center font-bold tracking-wide mt-4">DENGAN RAHMAT TUHAN YANG MAHA ESA</p>
                    <p className="text-center font-extrabold">BUPATI BULELENG,</p>
                    
                    <div className="space-y-1.5 pt-4">
                      <p><span className="font-bold">Menimbang:</span> Bahwa demi menjaga ketertiban umum dan kelancaran perlindungan pejalan kaki serta kelestarian lingkungan hidup di Kabupaten Buleleng, perlu dilakukan penegakan aturan hukum yang konsisten, berkeadilan, dan transparan.</p>
                      <p><span className="font-bold">Mengingat:</span> 1. Undang-Undang Nomor 69 Tahun 1958 tentang Pembentukan Daerah-daerah Tingkat II dalam Wilayah Daerah-daerah Tingkat I Bali, Nusa Tenggara Barat dan Nusa Tenggara Timur.</p>
                      <p className="pl-16">2. Peraturan Daerah Kabupaten Buleleng Nomor 3 Tahun 2026 tentang Penyelenggaraan Ketertiban Umum, Ketentraman Masyarakat, serta Perlindungan Masyarakat.</p>
                    </div>

                    <p className="text-center font-bold tracking-wide pt-8">MEMUTUSKAN:</p>
                    <p className="text-center font-bold">MENETAPKAN DOKUMEN UNDANG-UNDANG REGULASI DAERAH RESMI KABUPATEN BULELENG</p>

                    <p className="text-center font-extrabold pt-6">PASAL KETENTUAN HUKUM:</p>
                    <p className="italic text-slate-400 text-center">"Seluruh warga negara, badan usaha, serta pihak ketiga yang berdomisili atau berkegiatan di wilayah hukum Kabupaten Buleleng wajib mematuhi zonasi, perizinan reklame, serta norma kesusilaan dan ketertiban sosial yang sah."</p>

                    <div className="pt-12 text-right font-sans text-xs text-slate-400 space-y-1">
                      <p>Disahkan di Singaraja</p>
                      <p className="font-bold text-slate-300">Sekretaris Daerah Kabupaten Buleleng</p>
                      <p className="text-[10px]">Telah Terdaftar Secara Elektronik</p>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom watermark / digital seal */}
              <div className="border-t border-slate-850 pt-4 flex justify-between items-center text-[10px] font-sans text-slate-500 shrink-0">
                <p>Digital Cryptographic ID: SHA256-REG-BULELENG</p>
                <p className="font-bold text-indigo-400">SATPOL PP BULELENG SECURE PORTAL</p>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 border-t border-slate-800 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsPdfViewerOpen(false)}
                className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-350 rounded-xl text-xs font-bold transition cursor-pointer text-center"
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
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/20"
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
        <div className="fixed inset-0 bg-slate-955/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[85vh] shadow-2xl p-5 md:p-6 space-y-4 flex flex-col justify-between">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-indigo-400" /> Lembar Panggilan & Putusan Sidang Resmi
              </h3>
              <button
                onClick={() => setIsVerdictModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summons Ticket Container */}
            <div className="flex-1 bg-white text-slate-950 p-8 md:p-12 rounded-xl overflow-y-auto leading-relaxed shadow-inner font-serif text-xs md:text-sm" id="summons-verdict-container">
              
              {/* Kop Surat Keadilan */}
              <div className="text-center space-y-1 border-b-4 border-double border-slate-950 pb-4">
                <p className="font-extrabold text-sm md:text-base font-sans tracking-wide">PEMERINTAH KABUPATEN BULELENG</p>
                <p className="font-extrabold text-base md:text-lg font-sans tracking-wider text-indigo-950">SATUAN POLISI PAMONG PRAJA</p>
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
                <div className="pl-6 bg-slate-50 p-3 rounded border border-slate-300 italic font-sans font-semibold space-y-1.5 text-slate-800">
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
                  <div className="border-2 border-slate-950 p-4 rounded text-center space-y-1.5">
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
            <div className="flex gap-2.5 border-t border-slate-800 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsVerdictModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-350 rounded-xl text-xs font-bold transition cursor-pointer text-center"
              >
                Tutup
              </button>
              <button
                onClick={triggerSummonVerdictPrint}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/20"
              >
                <Gavel className="w-4 h-4" /> Cetak Berkas Summons
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
