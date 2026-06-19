'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import AdminNavbar from '../../components/AdminNavbar';
import {
  Shield,
  Users,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Calendar,
  UserCheck,
  Info,
  Download,
  X,
  Check,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Award,
  Book,
  Camera,
  Moon,
  FolderOpen
} from 'lucide-react';

const PANGKAT_GOLONGAN = [
  "Juru Muda - I/a",
  "Juru Muda Tingkat I - I/b",
  "Juru - I/c",
  "Juru Tingkat I - I/d",
  "Pengatur Muda - II/a",
  "Pengatur Muda Tingkat I - II/b",
  "Pengatur - II/c",
  "Pengatur Tingkat I - II/d",
  "Penata Muda - III/a",
  "Penata Muda Tingkat I - III/b",
  "Penata - III/c",
  "Penata Tingkat I - III/d",
  "Pembina - IV/a",
  "Pembina Tingkat I - IV/b",
  "Pembina Utama Madya - IV/c",
  "Pembina Utama - IV/e"
];

const GOLONGAN_PPPK = [
  "Golongan I",
  "Golongan II",
  "Golongan III",
  "Golongan IV",
  "Golongan V",
  "Golongan VI",
  "Golongan VII",
  "Golongan VIII",
  "Golongan IX",
  "Golongan X",
  "Golongan XI",
  "Golongan XII",
  "Golongan XIII",
  "Golongan XIV",
  "Golongan XV",
  "Golongan XVI",
  "Golongan XVII"
];


const JABATAN_OPTIONS = [
  "Kepala Bidang",
  "Kepala Seksi",
  "Komandan Regu",
  "Anggota Operasional",
  "Staf Administrasi",
  "Fungsional PPNS",
  "Fungsional Pol PP Lainnya"
];

const DIKLAT_COURSES = [
  "Diklat Dasar Satpol PP",
  "Diklat PPNS (Penyidik Pegawai Negeri Sipil)",
  "Sertifikasi Intelijen Dasar",
  "Pelatihan Penanggulangan Bencana"
];

export default function SdaAdmin() {
  const [activeTab, setActiveTab] = useState('personel');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type, message, onConfirm }

  const showAlert = (message, type = 'success') => {
    setNotification({ type, message });
  };

  const showConfirm = (message, onConfirm) => {
    setNotification({ type: 'confirm', message, onConfirm });
  };

  // Core Data States
  const [personelList, setPersonelList] = useState([]);
  const [kegiatanList, setKegiatanList] = useState([]);
  const [pustakaList, setPustakaList] = useState([]);

  // Modal / Detail States
  const [isPersonelModalOpen, setIsPersonelModalOpen] = useState(false);
  const [personelFormMode, setPersonelFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedPersonel, setSelectedPersonel] = useState(null);

  const [isKegiatanModalOpen, setIsKegiatanModalOpen] = useState(false);
  const [kegiatanFormMode, setKegiatanFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  const [isPustakaModalOpen, setIsPustakaModalOpen] = useState(false);
  const [pustakaFormMode, setPustakaFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedPustaka, setSelectedPustaka] = useState(null);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(''); // Context-dependent filter

  // Forms States
  const [personelForm, setPersonelForm] = useState({
    id: '',
    nip_kontrak: '',
    nama_lengkap: '',
    status_kepegawaian: 'PNS',
    pangkat_golongan: 'Penata - III/c',
    jabatan: 'Anggota Operasional',
    penempatan_bidang: 'SDA',
    rekam_pelatihan: [],
    nomor_sertifikat: '',
    status_keaktifan: 'Aktif',
  });

  const [kegiatanForm, setKegiatanForm] = useState({
    id: '',
    tanggal_pelaksanaan: '',
    nama_agenda: '',
    lokasi_sasaran: '',
    jenis_kegiatan: 'Penyuluhan ke Sekolah / Lembaga',
    jumlah_peserta: 0,
    narasumber: '',
    ringkasan_materi: '',
    dokumen_spt: null,
    foto_dokumentasi: null,
  });

  const [pustakaForm, setPustakaForm] = useState({
    id: '',
    judul_dokumen: '',
    jenis_aturan: 'Perda / Perbup / Perkada',
    nomor_tahun_aturan: '',
    instansi_penerbit: '',
    status_dokumen: 'Berlaku',
    ringkasan_aturan: '',
    tags: '',
    berkas_pdf: null,
    pengunggah: 'Staf Bidang SDA',
  });

  // Fetch functions
  const fetchPersonel = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sda/personel');
      if (res.ok) {
        const data = await res.json();
        setPersonelList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKegiatan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sda/kegiatan');
      if (res.ok) {
        const data = await res.json();
        setKegiatanList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPustaka = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sda/pustaka');
      if (res.ok) {
        const data = await res.json();
        setPustakaList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run on Tab change or mount
  useEffect(() => {
    fetchPersonel();
    fetchKegiatan();
    fetchPustaka();
  }, [activeTab]);

  // Download PDF from Base64
  const downloadBase64Pdf = (base64String, filename) => {
    if (!base64String) {
      showAlert("Berkas PDF tidak tersedia.", 'info');
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = base64String;
      link.download = filename || 'dokumen-arsip-sda.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal mengunduh PDF:", err);
      showAlert("Terjadi kesalahan saat mengunduh file.", 'error');
    }
  };

  // File to Base64 converters
  const handlePdfFileChange = (e, formSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showAlert("Hanya file dokumen PDF yang diperbolehkan.", 'error');
      e.target.value = null;
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showAlert("Ukuran file melebihi batas 3MB.", 'error');
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      formSetter(prev => ({
        ...prev,
        berkas_pdf: reader.result,
        dokumen_spt: reader.result // handles both fields depending on the active form
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e, formSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showAlert("Hanya file gambar yang diperbolehkan.", 'error');
      e.target.value = null;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showAlert("Ukuran file gambar melebihi batas 2MB.", 'error');
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      formSetter(prev => ({
        ...prev,
        foto_dokumentasi: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // -------------------- TAB 1: PERSONEL SUBMITS --------------------
  const handleOpenPersonelModal = (mode, record = null) => {
    setPersonelFormMode(mode);
    setSelectedPersonel(record);
    if (mode === 'create') {
      setPersonelForm({
        id: '',
        nip_kontrak: '',
        nama_lengkap: '',
        status_kepegawaian: 'PNS',
        pangkat_golongan: 'Penata - III/c',
        jabatan: 'Anggota Operasional',
        penempatan_bidang: 'SDA',
        rekam_pelatihan: [],
        nomor_sertifikat: '',
        status_keaktifan: 'Aktif',
      });
    } else if (record) {
      const activeDiklat = record.rekam_pelatihan
        ? record.rekam_pelatihan.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      setPersonelForm({
        ...record,
        rekam_pelatihan: activeDiklat,
      });
    }
    setIsPersonelModalOpen(true);
  };

  const handlePersonelSubmit = async (e) => {
    e.preventDefault();
    if (!personelForm.nip_kontrak || !personelForm.nama_lengkap) {
      showAlert("NIP/Nomor Kontrak dan Nama Lengkap wajib diisi.", 'error');
      return;
    }

    try {
      const method = personelFormMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch('/api/sda/personel', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personelForm),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert(data.message || "Data personel berhasil disimpan.", 'success');
        setIsPersonelModalOpen(false);
        fetchPersonel();
      } else {
        showAlert(data.error || "Gagal menyimpan data.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan jaringan.", 'error');
    }
  };

  const handleDeletePersonel = (id) => {
    showConfirm("Apakah Anda yakin ingin menghapus data personel ini?\n(Tindakan ini tidak dapat dibatalkan)", async () => {
      try {
        const res = await fetch(`/api/sda/personel?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          showAlert("Data personel berhasil dihapus.", 'success');
          fetchPersonel();
        } else {
          showAlert("Gagal menghapus data.", 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert("Terjadi kesalahan jaringan.", 'error');
      }
    });
  };

  // -------------------- TAB 2: KEGIATAN SUBMITS --------------------
  const handleOpenKegiatanModal = (mode, record = null) => {
    setKegiatanFormMode(mode);
    setSelectedKegiatan(record);
    if (mode === 'create') {
      setKegiatanForm({
        id: '',
        tanggal_pelaksanaan: new Date().toISOString().substring(0, 10),
        nama_agenda: '',
        lokasi_sasaran: '',
        jenis_kegiatan: 'Penyuluhan ke Sekolah / Lembaga',
        jumlah_peserta: 0,
        narasumber: '',
        ringkasan_materi: '',
        dokumen_spt: null,
        foto_dokumentasi: null,
      });
    } else if (record) {
      setKegiatanForm({
        ...record,
        tanggal_pelaksanaan: record.tanggal_pelaksanaan ? new Date(record.tanggal_pelaksanaan).toISOString().substring(0, 10) : '',
      });
    }
    setIsKegiatanModalOpen(true);
  };

  const handleKegiatanSubmit = async (e) => {
    e.preventDefault();
    if (!kegiatanForm.tanggal_pelaksanaan || !kegiatanForm.nama_agenda || !kegiatanForm.lokasi_sasaran || !kegiatanForm.ringkasan_materi) {
      showAlert("Harap isi semua field wajib (Tanggal, Agenda, Sasaran, Ringkasan Materi).", 'error');
      return;
    }

    try {
      const method = kegiatanFormMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch('/api/sda/kegiatan', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kegiatanForm),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert(data.message || "Log kegiatan SDA berhasil disimpan.", 'success');
        setIsKegiatanModalOpen(false);
        fetchKegiatan();
      } else {
        showAlert(data.error || "Gagal menyimpan log.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan jaringan.", 'error');
    }
  };

  const handleDeleteKegiatan = (id) => {
    showConfirm("Apakah Anda yakin ingin menghapus log kegiatan ini?\n(Tindakan ini tidak dapat dibatalkan)", async () => {
      try {
        const res = await fetch(`/api/sda/kegiatan?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          showAlert("Log kegiatan berhasil dihapus.", 'success');
          fetchKegiatan();
        } else {
          showAlert("Gagal menghapus log.", 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert("Terjadi kesalahan jaringan.", 'error');
      }
    });
  };

  // -------------------- TAB 3: PUSTAKA SUBMITS --------------------
  const handleOpenPustakaModal = (mode, record = null) => {
    setPustakaFormMode(mode);
    setSelectedPustaka(record);
    if (mode === 'create') {
      setPustakaForm({
        id: '',
        judul_dokumen: '',
        jenis_aturan: 'Perda / Perbup / Perkada',
        nomor_tahun_aturan: '',
        instansi_penerbit: '',
        status_dokumen: 'Berlaku',
        ringkasan_aturan: '',
        tags: '',
        berkas_pdf: null,
        pengunggah: 'Staf Bidang SDA',
      });
    } else if (record) {
      setPustakaForm({
        ...record,
      });
    }
    setIsPustakaModalOpen(true);
  };

  const handlePustakaSubmit = async (e) => {
    e.preventDefault();
    if (!pustakaForm.judul_dokumen || !pustakaForm.jenis_aturan || !pustakaForm.nomor_tahun_aturan || !pustakaForm.instansi_penerbit || !pustakaForm.ringkasan_aturan) {
      showAlert("Harap lengkapi seluruh field wajib.", 'error');
      return;
    }
    if (pustakaFormMode === 'create' && !pustakaForm.berkas_pdf) {
      showAlert("Berkas PDF aturan wajib diunggah.", 'error');
      return;
    }

    try {
      const method = pustakaFormMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch('/api/sda/pustaka', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pustakaForm),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert(data.message || "Dokumen aturan berhasil diarsipkan.", 'success');
        setIsPustakaModalOpen(false);
        fetchPustaka();
      } else {
        showAlert(data.error || "Gagal menyimpan berkas.", 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan jaringan.", 'error');
    }
  };

  const handleDeletePustaka = (id) => {
    showConfirm("Hapus berkas aturan hukum ini dari arsip digital?\n(Tindakan ini tidak dapat dibatalkan)", async () => {
      try {
        const res = await fetch(`/api/sda/pustaka?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          showAlert("Dokumen berhasil dihapus dari arsip.", 'success');
          fetchPustaka();
        } else {
          showAlert("Gagal menghapus dokumen.", 'error');
        }
      } catch (err) {
        console.error(err);
        showAlert("Terjadi kesalahan jaringan.", 'error');
      }
    });
  };

  // -------------------- SEARCH & FILTER LOGIC --------------------
  const filteredPersonel = personelList.filter(p => {
    const matchQuery = p.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nip_kontrak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id_personel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = !filterType || p.status_kepegawaian === filterType || p.penempatan_bidang === filterType || p.status_keaktifan === filterType;
    return matchQuery && matchFilter;
  });

  const filteredKegiatan = kegiatanList.filter(k => {
    const matchQuery = k.nama_agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.lokasi_sasaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.no_laporan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = !filterType || k.jenis_kegiatan === filterType;
    return matchQuery && matchFilter;
  });

  const filteredPustaka = pustakaList.filter(d => {
    const matchQuery = d.judul_dokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nomor_tahun_aturan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.no_arsip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tags && d.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchFilter = !filterType || d.jenis_aturan === filterType || d.status_dokumen === filterType;
    return matchQuery && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 font-sans select-none relative overflow-x-hidden pt-[72px] flex flex-col justify-between">

      {/* Horizontal Navbar */}
      <AdminNavbar
        activePortal="sda"
      />

      {/* Main Grid Content */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8 space-y-6 flex-1">

        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">MANAJEMEN INTERNAL BIDANG SDA</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Sumber Daya Aparatur, Administrasi, Log Jurnal & Edukasi Hukum
            </p>
          </div>
        </div>

        {/* Dynamic Division Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1.5">
          <button
            onClick={() => { setActiveTab('personel'); setSearchQuery(''); setFilterType(''); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'personel'
                ? 'bg-[#561C24] text-white shadow-sm'
                : 'text-slate-600 bg-transparent hover:bg-slate-50 hover:text-[#561C24]'
              }`}
          >
            <Users className="w-4 h-4" /> Manajemen Aparatur ({personelList.length})
          </button>
          <button
            onClick={() => { setActiveTab('kegiatan'); setSearchQuery(''); setFilterType(''); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'kegiatan'
                ? 'bg-[#561C24] text-white shadow-sm'
                : 'text-slate-600 bg-transparent hover:bg-slate-50 hover:text-[#561C24]'
              }`}
          >
            <FileText className="w-4 h-4" /> Log Jurnal Kegiatan ({kegiatanList.length})
          </button>
          <button
            onClick={() => { setActiveTab('pustaka'); setSearchQuery(''); setFilterType(''); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'pustaka'
                ? 'bg-[#561C24] text-white shadow-sm'
                : 'text-slate-600 bg-transparent hover:bg-slate-50 hover:text-[#561C24]'
              }`}
          >
            <BookOpen className="w-4 h-4" /> Pustaka Edukasi Hukum ({pustakaList.length})
          </button>
        </div>

        {/* -------------------- TAB 1: MANAJEMEN APARATUR -------------------- */}
        {activeTab === 'personel' && (
          <div className="space-y-6">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Personel SDA</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {personelList.length} <span className="text-xs font-normal text-slate-500">Anggota</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status Kepegawaian</div>
                <div className="text-2xl font-bold text-purple-800 mt-1 flex items-baseline gap-1.5">
                  {personelList.filter(p => p.status_kepegawaian === 'PNS' || p.status_kepegawaian.startsWith('PPPK') || p.status_kepegawaian.startsWith('ASN')).length} <span className="text-xs font-normal text-slate-500">ASN</span>
                  <span className="text-slate-300">|</span>
                  {personelList.filter(p => p.status_kepegawaian.startsWith('Kontrak')).length} <span className="text-xs font-normal text-slate-500">Kontrak</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Keaktifan</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1 flex items-baseline gap-1.5">
                  {personelList.filter(p => p.status_keaktifan === 'Aktif').length} <span className="text-xs font-normal text-slate-500">Aktif</span>
                  <span className="text-slate-300">|</span>
                  {personelList.filter(p => p.status_keaktifan !== 'Aktif').length} <span className="text-xs font-normal text-slate-500">Lainnya</span>
                </div>
              </div>
            </div>

            {/* List & Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Database Profil & Kompetensi Aparatur</h3>
                  <p className="text-[11px] text-slate-500">Manajemen kredensial, diklat kedinasan, dan status kepegawaian Satpol PP</p>
                </div>
                <button
                  onClick={() => handleOpenPersonelModal('create')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
                >
                  <Plus className="w-4 h-4" /> Tambah Personel
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari NIP, nama lengkap, atau ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 cursor-pointer"
                  >
                    <option value="">Semua Status Kepegawaian</option>
                    <option value="PNS">PNS</option>
                    <option value="PPPK Penuh Waktu">PPPK Penuh Waktu</option>
                    <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
                    <option value="Kontrak (Non-ASN)">Kontrak (Non-ASN)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b border-slate-200 select-none">
                      <th className="px-4 py-3 text-center">ID</th>
                      <th className="px-4 py-3">Nama Lengkap</th>
                      <th className="px-4 py-3">NIP / No. Kontrak</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Pangkat / Gol</th>
                      <th className="px-4 py-3">Jabatan</th>
                      <th className="px-4 py-3">Penempatan</th>
                      <th className="px-4 py-3 text-center">Keaktifan</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {loading && filteredPersonel.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8 text-slate-400">Memuat data...</td>
                      </tr>
                    ) : filteredPersonel.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8 text-slate-400">Tidak ada data personel yang cocok.</td>
                      </tr>
                    ) : (
                      filteredPersonel.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5 text-center font-bold text-[#212260] whitespace-nowrap">{p.id_personel}</td>
                          <td className="px-4 py-3.5 font-bold text-slate-800">{p.nama_lengkap}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{p.nip_kontrak}</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status_kepegawaian === 'PNS' || p.status_kepegawaian.startsWith('PPPK') || p.status_kepegawaian.startsWith('ASN')
                                ? 'bg-purple-100 text-purple-750'
                                : 'bg-orange-100 text-orange-750'
                              }`}>
                              {p.status_kepegawaian}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">{p.pangkat_golongan}</td>
                          <td className="px-4 py-3.5">{p.jabatan}</td>
                          <td className="px-4 py-3.5">{p.penempatan_bidang}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status_keaktifan === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {p.status_keaktifan}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenPersonelModal('view', p)}
                                className="p-1.5 hover:bg-slate-200 rounded text-slate-650 transition-colors cursor-pointer"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenPersonelModal('edit', p)}
                                className="p-1.5 hover:bg-slate-200 rounded text-blue-600 transition-colors cursor-pointer"
                                title="Edit Data"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePersonel(p.id)}
                                className="p-1.5 hover:bg-red-50 rounded text-red-650 transition-colors cursor-pointer"
                                title="Hapus Data"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 2: LOG JURNAL KEGIATAN -------------------- */}
        {activeTab === 'kegiatan' && (
          <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Log Jurnal</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {kegiatanList.length} <span className="text-xs font-normal text-slate-500">Laporan</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sosialisasi & Penyuluhan</div>
                <div className="text-2xl font-bold text-[#ad1457] mt-1 flex items-baseline gap-1.5">
                  {kegiatanList.filter(k => k.jenis_kegiatan.includes('Penyuluhan') || k.jenis_kegiatan.includes('Sosialisasi')).length}{' '}
                  <span className="text-xs font-normal text-slate-500">Aktivitas</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Peserta Terlayani</div>
                <div className="text-2xl font-bold text-indigo-700 mt-1 flex items-baseline gap-1.5">
                  {kegiatanList.reduce((acc, curr) => acc + curr.jumlah_peserta, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">Masyarakat</span>
                </div>
              </div>
            </div>

            {/* List & Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Log Jurnal Kegiatan Bidang SDA</h3>
                  <p className="text-[11px] text-slate-500">Rekapitulasi agenda penyuluhan, bimbingan teknis, dan sosialisasi non-tindakan</p>
                </div>
                <button
                  onClick={() => handleOpenKegiatanModal('create')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
                >
                  <Plus className="w-4 h-4" /> Log Jurnal Baru
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari agenda kegiatan, nomor, lokasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 cursor-pointer"
                  >
                    <option value="">Semua Kategori</option>
                    <option value="Penyuluhan ke Sekolah / Lembaga">Penyuluhan ke Sekolah</option>
                    <option value="Sosialisasi Perda kepada Masyarakat">Sosialisasi Perda</option>
                    <option value="Bimbingan Teknis (Bintek) Internal Aparat">Bimtek Internal</option>
                    <option value="Kegiatan Lainnya">Kegiatan Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b border-slate-200 select-none">
                      <th className="px-4 py-3 text-center">No Laporan</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Agenda / Kegiatan</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Lokasi / Sasaran</th>
                      <th className="px-4 py-3 text-center">Peserta</th>
                      <th className="px-4 py-3">Narasumber</th>
                      <th className="px-4 py-3 text-center">Dokumen</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {loading && filteredKegiatan.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8 text-slate-400">Memuat data...</td>
                      </tr>
                    ) : filteredKegiatan.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8 text-slate-400">Tidak ada log kegiatan yang cocok.</td>
                      </tr>
                    ) : (
                      filteredKegiatan.map((k) => (
                        <tr key={k.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5 text-center font-bold text-[#ad1457] whitespace-nowrap">{k.no_laporan}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{k.tanggal_pelaksanaan ? new Date(k.tanggal_pelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                          <td className="px-4 py-3.5 font-bold text-slate-800">{k.nama_agenda}</td>
                          <td className="px-4 py-3.5">{k.jenis_kegiatan}</td>
                          <td className="px-4 py-3.5">{k.lokasi_sasaran}</td>
                          <td className="px-4 py-3.5 text-center font-semibold text-slate-800">{k.jumlah_peserta} orang</td>
                          <td className="px-4 py-3.5">{k.narasumber || '-'}</td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {k.dokumen_spt && (
                                <button
                                  onClick={() => downloadBase64Pdf(k.dokumen_spt, `SPT-${k.no_laporan}.pdf`)}
                                  className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-800 rounded font-black flex items-center gap-0.5 text-[9px] cursor-pointer"
                                  title="Unduh SPT (PDF)"
                                >
                                  <Download className="w-2.5 h-2.5" /> SPT
                                </button>
                              )}
                              {k.foto_dokumentasi && (
                                <button
                                  onClick={() => { setZoomImageUrl(k.foto_dokumentasi); setIsZoomModalOpen(true); }}
                                  className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded font-black flex items-center gap-0.5 text-[9px] cursor-pointer"
                                  title="Lihat Foto"
                                >
                                  <Camera className="w-2.5 h-2.5" /> FOTO
                                </button>
                              )}
                              {!k.dokumen_spt && !k.foto_dokumentasi && <span className="text-slate-400">-</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenKegiatanModal('view', k)}
                                className="p-1.5 hover:bg-slate-200 rounded text-slate-650 transition-colors cursor-pointer"
                                title="Detail Laporan"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenKegiatanModal('edit', k)}
                                className="p-1.5 hover:bg-slate-200 rounded text-blue-600 transition-colors cursor-pointer"
                                title="Edit Laporan"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteKegiatan(k.id)}
                                className="p-1.5 hover:bg-red-50 rounded text-red-650 transition-colors cursor-pointer"
                                title="Hapus Laporan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 3: PUSTAKA EDUKASI HUKUM -------------------- */}
        {activeTab === 'pustaka' && (
          <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Arsip Regulasi</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {pustakaList.length} <span className="text-xs font-normal text-slate-500">Berkas Hukum</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status Dokumen</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1 flex items-baseline gap-1.5">
                  {pustakaList.filter(d => d.status_dokumen === 'Berlaku').length} <span className="text-xs font-normal text-slate-500">Berlaku</span>
                  <span className="text-slate-300">|</span>
                  {pustakaList.filter(d => d.status_dokumen !== 'Berlaku').length} <span className="text-xs font-normal text-slate-500">Dicabut</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tipe Dokumen Terbanyak</div>
                <div className="text-base font-black text-slate-800 mt-2 truncate">
                  Perda / Perbup / Perkada
                </div>
              </div>
            </div>

            {/* List & Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Galeri Pengetahuan & Pustaka Edukasi Hukum</h3>
                  <p className="text-[11px] text-slate-500">Pusat arsip regulasi, perbup, dan SOP operasional non-penindakan bagi petugas</p>
                </div>
                <button
                  onClick={() => handleOpenPustakaModal('create')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
                >
                  <Plus className="w-4 h-4" /> Arsipkan Aturan
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari judul aturan, nomor/tahun, instansi, kata kunci..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 cursor-pointer"
                  >
                    <option value="">Semua Tingkatan Aturan</option>
                    <option value="Undang-Undang / Peraturan Pemerintah (Pusat)">Undang-Undang / PP</option>
                    <option value="Permendagri / Peraturan Menteri">Permendagri / Permen</option>
                    <option value="Perda / Perbup / Perkada">Perda / Perbup / Perkada</option>
                    <option value="Surat Keputusan (SK) Kasat / SOP Kerja">SK Kasat / SOP Kerja</option>
                  </select>
                </div>
              </div>

              {/* Documents Card Grid */}
              {loading && filteredPustaka.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Memuat data pustaka...</div>
              ) : filteredPustaka.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Belum ada dokumen aturan yang diarsipkan.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                  {filteredPustaka.map((doc) => (
                    <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">

                      {/* Document Meta */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${doc.status_dokumen === 'Berlaku'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                            }`}>
                            {doc.status_dokumen}
                          </span>
                          <span className="text-[9px] text-[#ad1457] font-bold">{doc.no_arsip}</span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-950 transition-colors" title={doc.judul_dokumen}>
                            {doc.judul_dokumen}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                            {doc.jenis_aturan} • {doc.nomor_tahun_aturan}
                          </p>
                        </div>

                        <div className="text-[10px] bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 line-clamp-3 italic shadow-inner">
                          "{doc.ringkasan_aturan}"
                        </div>

                        {doc.tags && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {doc.tags.split(',').map((tag, idx) => (
                              <span key={idx} className="bg-slate-200/70 border border-slate-300/40 text-slate-650 px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer actions */}
                      <div className="border-t border-slate-200/70 pt-3 mt-4 flex items-center justify-between">
                        <div className="text-[9px] text-slate-400">
                          Oleh: {doc.pengunggah}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenPustakaModal('view', doc)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-all cursor-pointer"
                            title="Detail Pustaka"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenPustakaModal('edit', doc)}
                            className="p-1.5 hover:bg-slate-200 rounded text-blue-600 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadBase64Pdf(doc.berkas_pdf, `${doc.no_arsip}.pdf`)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-700 transition-all cursor-pointer"
                            title="Unduh PDF Resmi"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePustaka(doc.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-550 transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* -------------------- MODALS: APARATUR FORM & VIEW -------------------- */}
      {isPersonelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#561C24] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {personelFormMode === 'create' ? 'Tambah Personel SDA Baru' : personelFormMode === 'edit' ? 'Edit Profil Personel' : 'Detail Profil Aparatur'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPersonelModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePersonelSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              {personelFormMode !== 'create' && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-250 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">ID Anggota</span>
                    <span className="text-xs font-black text-[#212260]">{personelForm.id_personel}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Ditambahkan Pada</span>
                    <span className="text-xs font-bold text-slate-700">{personelForm.createdAt ? new Date(personelForm.createdAt).toLocaleString('id-ID') : '-'}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    disabled={personelFormMode === 'view'}
                    value={personelForm.nama_lengkap}
                    onChange={(e) => setPersonelForm({ ...personelForm, nama_lengkap: e.target.value })}
                    placeholder="Contoh: I Gede Suardika, S.H."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">NIP / No. Kontrak</label>
                  <input
                    type="text"
                    disabled={personelFormMode === 'view'}
                    value={personelForm.nip_kontrak}
                    onChange={(e) => setPersonelForm({ ...personelForm, nip_kontrak: e.target.value })}
                    placeholder="Masukkan NIP atau Nomor Kontrak kerja..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Status Kepegawaian</label>
                  <select
                    disabled={personelFormMode === 'view'}
                    value={personelForm.status_kepegawaian}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPersonelForm({
                        ...personelForm,
                        status_kepegawaian: val,
                        pangkat_golongan: val === 'Kontrak (Non-ASN)'
                          ? 'Non-ASN'
                          : val.startsWith('PPPK')
                            ? 'Golongan IX'
                            : 'Penata - III/c'
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 cursor-pointer"
                  >
                    {personelForm.status_kepegawaian === 'ASN (PNS/PPPK)' && (
                      <option value="ASN (PNS/PPPK)">ASN (PNS/PPPK) [Lama]</option>
                    )}
                    {personelForm.status_kepegawaian === 'PPPK' && (
                      <option value="PPPK">PPPK [Lama]</option>
                    )}
                    <option value="PNS">PNS</option>
                    <option value="PPPK Penuh Waktu">PPPK Penuh Waktu</option>
                    <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
                    <option value="Kontrak (Non-ASN)">Kontrak (Non-ASN)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Pangkat / Golongan</label>
                  <select
                    disabled={personelFormMode === 'view' || personelForm.status_kepegawaian === 'Kontrak (Non-ASN)'}
                    value={personelForm.pangkat_golongan}
                    onChange={(e) => setPersonelForm({ ...personelForm, pangkat_golongan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 cursor-pointer"
                  >
                    {personelForm.status_kepegawaian === 'Kontrak (Non-ASN)' ? (
                      <option value="Non-ASN">Non-ASN</option>
                    ) : personelForm.status_kepegawaian.startsWith('PPPK') || personelForm.status_kepegawaian === 'PPPK' ? (
                      <>
                        {personelForm.pangkat_golongan && !GOLONGAN_PPPK.includes(personelForm.pangkat_golongan) && (
                          <option value={personelForm.pangkat_golongan}>{personelForm.pangkat_golongan}</option>
                        )}
                        {GOLONGAN_PPPK.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </>
                    ) : (
                      <>
                        {personelForm.pangkat_golongan && !PANGKAT_GOLONGAN.includes(personelForm.pangkat_golongan) && (
                          <option value={personelForm.pangkat_golongan}>{personelForm.pangkat_golongan}</option>
                        )}
                        {PANGKAT_GOLONGAN.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Jabatan di Satpol PP</label>
                  <select
                    disabled={personelFormMode === 'view'}
                    value={personelForm.jabatan}
                    onChange={(e) => setPersonelForm({ ...personelForm, jabatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 cursor-pointer"
                  >
                    {JABATAN_OPTIONS.map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Penempatan Bidang</label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Linmas', 'Trantib', 'Perada', 'SDA'].map(bidang => (
                      <label key={bidang} className="flex items-center gap-1 text-xs cursor-pointer select-none font-semibold">
                        <input
                          type="radio"
                          disabled={personelFormMode === 'view'}
                          checked={personelForm.penempatan_bidang === bidang}
                          onChange={() => setPersonelForm({ ...personelForm, penempatan_bidang: bidang })}
                          className="text-[#212260]"
                        />
                        {bidang}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Rekam Pelatihan / Diklat yang Diselesaikan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DIKLAT_COURSES.map(diklat => {
                    const isChecked = personelForm.rekam_pelatihan.includes(diklat);
                    return (
                      <label key={diklat} className="flex items-start gap-2 text-xs cursor-pointer select-none font-semibold">
                        <input
                          type="checkbox"
                          disabled={personelFormMode === 'view'}
                          checked={isChecked}
                          onChange={(e) => {
                            const newDiklat = e.target.checked
                              ? [...personelForm.rekam_pelatihan, diklat]
                              : personelForm.rekam_pelatihan.filter(d => d !== diklat);
                            setPersonelForm({ ...personelForm, rekam_pelatihan: newDiklat });
                          }}
                          className="rounded text-[#212260] mt-0.5 shrink-0"
                        />
                        <span className="leading-tight text-slate-650">{diklat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Nomor Sertifikat Diklat (Opsional)</label>
                  <input
                    type="text"
                    disabled={personelFormMode === 'view'}
                    value={personelForm.nomor_sertifikat || ''}
                    onChange={(e) => setPersonelForm({ ...personelForm, nomor_sertifikat: e.target.value })}
                    placeholder="Masukkan nomor sertifikat diklat..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Status Keaktifan</label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Aktif', 'Cuti', 'Pendidikan', 'Pensiun/Resign'].map(st => (
                      <label key={st} className="flex items-center gap-1 text-xs cursor-pointer select-none font-semibold">
                        <input
                          type="radio"
                          disabled={personelFormMode === 'view'}
                          checked={personelForm.status_keaktifan === st}
                          onChange={() => setPersonelForm({ ...personelForm, status_keaktifan: st })}
                          className="text-[#212260]"
                        />
                        {st}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-200 pt-4 flex gap-2.5 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPersonelModalOpen(false)}
                  className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {personelFormMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {personelFormMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
                  >
                    Simpan Data
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODALS: KEGIATAN FORM & VIEW -------------------- */}
      {isKegiatanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#561C24] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {kegiatanFormMode === 'create' ? 'Buat Jurnal Kegiatan Baru' : kegiatanFormMode === 'edit' ? 'Edit Jurnal Kegiatan' : 'Detail Jurnal Kegiatan SDA'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsKegiatanModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleKegiatanSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              {kegiatanFormMode !== 'create' && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-250 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">No. Laporan</span>
                    <span className="text-xs font-black text-[#ad1457]">{kegiatanForm.no_laporan}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Waktu Input</span>
                    <span className="text-xs font-bold text-slate-700">{kegiatanForm.createdAt ? new Date(kegiatanForm.createdAt).toLocaleString('id-ID') : '-'}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    disabled={kegiatanFormMode === 'view'}
                    value={kegiatanForm.tanggal_pelaksanaan}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, tanggal_pelaksanaan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Nama Agenda / Kegiatan</label>
                  <input
                    type="text"
                    disabled={kegiatanFormMode === 'view'}
                    value={kegiatanForm.nama_agenda}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, nama_agenda: e.target.value })}
                    placeholder="Contoh: Satpol PP Goes to School"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Lokasi / Target Sasaran</label>
                  <input
                    type="text"
                    disabled={kegiatanFormMode === 'view'}
                    value={kegiatanForm.lokasi_sasaran}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, lokasi_sasaran: e.target.value })}
                    placeholder="Contoh: SMK Negeri 3 Singaraja"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Jenis Kegiatan SDA</label>
                  <select
                    disabled={kegiatanFormMode === 'view'}
                    value={kegiatanForm.jenis_kegiatan}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, jenis_kegiatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 cursor-pointer"
                  >
                    <option value="Penyuluhan ke Sekolah / Lembaga">Penyuluhan ke Sekolah / Lembaga</option>
                    <option value="Sosialisasi Perda kepada Masyarakat">Sosialisasi Perda kepada Masyarakat</option>
                    <option value="Bimbingan Teknis (Bintek) Internal Aparat">Bimbingan Teknis (Bintek) Internal Aparat</option>
                    <option value="Kegiatan Lainnya">Kegiatan Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Jumlah Peserta Hadir (Estimasi)</label>
                  <input
                    type="number"
                    disabled={kegiatanFormMode === 'view'}
                    value={kegiatanForm.jumlah_peserta}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, jumlah_peserta: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Narasumber / Pemateri (Opsional)</label>
                  <input
                    type="text"
                    disabled={kegiatanFormMode === 'view'}
                    value={kegiatanForm.narasumber || ''}
                    onChange={(e) => setKegiatanForm({ ...kegiatanForm, narasumber: e.target.value })}
                    placeholder="Nama pejabat / pemateri..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Ringkasan Materi & Hasil Kegiatan</label>
                <textarea
                  disabled={kegiatanFormMode === 'view'}
                  value={kegiatanForm.ringkasan_materi}
                  onChange={(e) => setKegiatanForm({ ...kegiatanForm, ringkasan_materi: e.target.value })}
                  rows="3"
                  placeholder="Deskripsikan secara singkat materi yang disampaikan dan tanggapan dari sasaran penyuluhan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Dokumen Surat Perintah (PDF)</label>
                  {kegiatanFormMode === 'view' ? (
                    kegiatanForm.dokumen_spt ? (
                      <button
                        type="button"
                        onClick={() => downloadBase64Pdf(kegiatanForm.dokumen_spt, `SPT-${kegiatanForm.no_laporan}.pdf`)}
                        className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Unduh PDF SPT
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-semibold">Tidak ada berkas PDF diunggah</span>
                    )
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handlePdfFileChange(e, setKegiatanForm)}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#ad1457]/10 file:text-[#ad1457] file:cursor-pointer"
                      />
                      {kegiatanForm.dokumen_spt && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold">
                          <Check className="w-3.5 h-3.5" /> Berkas PDF terunggah
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Foto Dokumentasi Kegiatan</label>
                  {kegiatanFormMode === 'view' ? (
                    kegiatanForm.foto_dokumentasi ? (
                      <div className="relative w-36 h-24 border border-slate-200 rounded-xl overflow-hidden shadow-inner group">
                        <img
                          src={kegiatanForm.foto_dokumentasi}
                          alt="Dokumentasi"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => { setZoomImageUrl(kegiatanForm.foto_dokumentasi); setIsZoomModalOpen(true); }}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-semibold">Tidak ada foto dokumentasi</span>
                    )
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e, setKegiatanForm)}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#ad1457]/10 file:text-[#ad1457] file:cursor-pointer"
                      />
                      {kegiatanForm.foto_dokumentasi && (
                        <div className="flex items-center gap-2">
                          <img src={kegiatanForm.foto_dokumentasi} alt="Preview" className="w-14 h-10 object-cover rounded border border-slate-200 shadow-sm" />
                          <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-0.5"><Check className="w-3 h-3" /> Foto siap</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-slate-200 pt-4 flex gap-2.5 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsKegiatanModalOpen(false)}
                  className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {kegiatanFormMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {kegiatanFormMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
                  >
                    Simpan Laporan
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODALS: PUSTAKA FORM & VIEW -------------------- */}
      {isPustakaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#561C24] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {pustakaFormMode === 'create' ? 'Arsip Dokumen Hukum Baru' : pustakaFormMode === 'edit' ? 'Edit Dokumen Arsip' : 'Detail Arsip Pustaka Hukum'}
                </h3>
                <p className="text-[10px] text-rose-200/80 font-bold uppercase tracking-widest mt-0.5">SIP POLPP BULELENG</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPustakaModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePustakaSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              {pustakaFormMode !== 'create' && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-250 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">No. Arsip</span>
                    <span className="text-xs font-black text-[#6a1b9a]">{pustakaForm.no_arsip}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Arsip Diunggah</span>
                    <span className="text-xs font-bold text-slate-700">{pustakaForm.waktu_upload ? new Date(pustakaForm.waktu_upload).toLocaleString('id-ID') : '-'}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Judul Resmi Dokumen Aturan / Hukum</label>
                <textarea
                  disabled={pustakaFormMode === 'view'}
                  value={pustakaForm.judul_dokumen}
                  onChange={(e) => setPustakaForm({ ...pustakaForm, judul_dokumen: e.target.value })}
                  rows="2"
                  placeholder="Contoh: Peraturan Bupati Buleleng Nomor 45 Tahun 2022 tentang Kedudukan, Susunan Organisasi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Jenis / Tingkatan Aturan</label>
                  <select
                    disabled={pustakaFormMode === 'view'}
                    value={pustakaForm.jenis_aturan}
                    onChange={(e) => setPustakaForm({ ...pustakaForm, jenis_aturan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 cursor-pointer"
                  >
                    <option value="Undang-Undang / Peraturan Pemerintah (Pusat)">Undang-Undang / Peraturan Pemerintah (Pusat)</option>
                    <option value="Permendagri / Peraturan Menteri">Permendagri / Peraturan Menteri</option>
                    <option value="Perda / Perbup / Perkada">Perda / Perbup / Perkada</option>
                    <option value="Surat Keputusan (SK) Kasat / SOP Kerja">Surat Keputusan (SK) Kasat / SOP Kerja</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Nomor & Tahun Aturan</label>
                  <input
                    type="text"
                    disabled={pustakaFormMode === 'view'}
                    value={pustakaForm.nomor_tahun_aturan}
                    onChange={(e) => setPustakaForm({ ...pustakaForm, nomor_tahun_aturan: e.target.value })}
                    placeholder="Contoh: No. 45 Tahun 2022"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Instansi Penerbit</label>
                  <input
                    type="text"
                    disabled={pustakaFormMode === 'view'}
                    value={pustakaForm.instansi_penerbit}
                    onChange={(e) => setPustakaForm({ ...pustakaForm, instansi_penerbit: e.target.value })}
                    placeholder="Contoh: Bupati Buleleng atau Mendagri"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Status Validitas Dokumen</label>
                  <div className="flex gap-4">
                    {['Berlaku', 'Dicabut / Tidak Berlaku'].map(val => (
                      <label key={val} className="flex items-center gap-1.5 text-xs cursor-pointer select-none font-semibold">
                        <input
                          type="radio"
                          disabled={pustakaFormMode === 'view'}
                          checked={pustakaForm.status_dokumen === val}
                          onChange={() => setPustakaForm({ ...pustakaForm, status_dokumen: val })}
                          className="text-[#6a1b9a]"
                        />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Ringkasan / Intisari Aturan (Bahasa Lapangan)</label>
                <textarea
                  disabled={pustakaFormMode === 'view'}
                  value={pustakaForm.ringkasan_aturan}
                  onChange={(e) => setPustakaForm({ ...pustakaForm, ringkasan_aturan: e.target.value })}
                  rows="3"
                  placeholder="Jelaskan secara ringkas poin-poin utama regulasi agar personil di lapangan mudah memahaminya..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Kata Kunci Pencarian (Tags, pisahkan dengan koma)</label>
                  <input
                    type="text"
                    disabled={pustakaFormMode === 'view'}
                    value={pustakaForm.tags || ''}
                    onChange={(e) => setPustakaForm({ ...pustakaForm, tags: e.target.value })}
                    placeholder="Contoh: tupoksi, sop patroli, seragam"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-150 disabled:opacity-65"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Pengunggah Data (Otomatis)</label>
                  <input
                    type="text"
                    disabled
                    value={pustakaForm.pengunggah}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Upload Berkas Digital Aturan (PDF)</label>
                {pustakaFormMode === 'view' ? (
                  pustakaForm.berkas_pdf ? (
                    <button
                      type="button"
                      onClick={() => downloadBase64Pdf(pustakaForm.berkas_pdf, `Arsip-${pustakaForm.no_arsip}.pdf`)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download PDF Dokumen Asli
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic font-semibold">Tidak ada berkas PDF diunggah</span>
                  )
                ) : (
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handlePdfFileChange(e, setPustakaForm)}
                      className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#6a1b9a]/10 file:text-[#6a1b9a] file:cursor-pointer"
                    />
                    {pustakaForm.berkas_pdf && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold">
                        <Check className="w-3.5 h-3.5" /> Berkas PDF terunggah dan siap diarsipkan
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="border-t border-slate-200 pt-4 flex gap-2.5 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPustakaModalOpen(false)}
                  className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {pustakaFormMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {pustakaFormMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
                  >
                    Arsip Dokumen
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: FOTO ZOOM VIEWER -------------------- */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full border border-slate-350 relative flex flex-col items-center">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-900/80 rounded-full transition-colors cursor-pointer text-white z-10"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-h-[80vh] overflow-auto p-4 flex items-center justify-center bg-slate-950">
              <img
                src={zoomImageUrl}
                alt="Foto Dokumentasi Zoomed"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="py-3 px-6 bg-slate-50 text-slate-650 text-xs font-bold text-center w-full border-t border-slate-200">
              Bukti Foto Dokumentasi Kegiatan Lapangan SDA
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
