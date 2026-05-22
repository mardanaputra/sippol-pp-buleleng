'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Info, 
  DollarSign, 
  Smartphone, 
  ChevronRight, 
  X, 
  Check, 
  Map, 
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowLeft,
  Moon
} from 'lucide-react';

const BULELENG_REGENCY = {
  "Buleleng": ["Astina", "Banjar Bali", "Banjar Jawa", "Banjar Tegal", "Banyuasri", "Banyuning", "Beratan", "Kaliuntu", "Kampung Baru", "Kampung Bugis", "Kampung Kajanan", "Kampung Singaraja", "Kendran", "Liligundi", "Paket Agung", "Penarukan", "Singaraja", "Tukadmungga", "Pemaron", "Jinengdalem", "Poh Bergong", "Kalibukbuk", "Bakti Seraga"],
  "Sukasada": ["Sukasada", "Gitgit", "Pancasari", "Wanagiri", "Ambengan", "Sambangan", "Pegayaman", "Silangjana", "Panji", "Panji Anom", "Kayu Putih", "Selat", "Padangbulia", "Tegallinggah"],
  "Banjar": ["Banjar", "Banjar Tegeha", "Banyuatis", "Dencarik", "Gesing", "Gobleg", "Kaliasem", "Kayuputih", "Munduk", "Pedawa", "Sidetapa", "Tampekan", "Temukus", "Tigawasa", "Cempaga"],
  "Gerokgak": ["Gerokgak", "Banyupoh", "Celukan Bawang", "Pemuteran", "Pejarakan", "Sanggalangit", "Sumberkima", "Tukadsumaga", "Musi", "Patas", "Tinga-Tinga", "Penyabangan"],
  "Seririt": ["Seririt", "Bestala", "Bubunan", "Gunungsari", "Joanyar", "Kalianget", "Lokapaksa", "Mayong", "Patemon", "Pengastulan", "Ringdikit", "Sulanyah", "Tangguwisia", "Ularan", "Pangkung Paruk", "Rangdu"],
  "Busungbiu": ["Busungbiu", "Bengkel", "Bongancina", "Kekeran", "Kedis", "Pelapuan", "Pucaksari", "Subuk", "Telaga", "Tinggarsari", "Titab", "Umajero", "Kariasa"],
  "Sawan": ["Sawan", "Bebetin", "Bungkulan", "Galungan", "Giri Emas", "Jagaraga", "Kerobokan", "Lemukih", "Menyali", "Sangsit", "Sekumpul", "Sinabun", "Sudaji", "Suwug", "Bontihing"],
  "Kubutambahan": ["Kubutambahan", "Bila", "Bukti", "Depeha", "Bontihing", "Bulian", "Mengening", "Pakisan", "Tajun", "Tembok", "Tamblang", "Tunjung"],
  "Tejakula": ["Tejakula", "Bondalem", "Julah", "Madenan", "Les", "Penuktukan", "Pacung", "Sambirenteng", "Sembiran", "Giri Emas"]
};

export default function LinmasAdmin() {
  const [activeTab, setActiveTab] = useState('satlinmas');
  const [loading, setLoading] = useState(false);

  // Core Data States
  const [satlinmasList, setSatlinmasList] = useState([]);
  const [trantibumList, setTrantibumList] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [delegatedReports, setDelegatedReports] = useState([]);

  // Modal / Drawer States
  const [isSatlinmasModalOpen, setIsSatlinmasModalOpen] = useState(false);
  const [satlinmasFormMode, setSatlinmasFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedSatlinmas, setSelectedSatlinmas] = useState(null);

  const [isTrantibumModalOpen, setIsTrantibumModalOpen] = useState(false);
  const [selectedTrantibum, setSelectedTrantibum] = useState(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedReportForActivity, setSelectedReportForActivity] = useState(null);

  // Dynamic dropdown helper for villages
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [filteredVillages, setFilteredVillages] = useState([]);

  // Form Satlinmas (21 Fields mapped to backend model schema)
  const [satlinmasForm, setSatlinmasForm] = useState({
    id: '',
    kecamatan: '',
    desa: '',
    anggota_pria: 0,
    anggota_wanita: 0,
    nama_kades: '',
    nama_kasi: '',
    kontak_perangkat: '',
    jumlah_pos_kamling: 0,
    status_pakaian_dinas: 'Ada',
    ket_pakaian_dinas: '',
    jumlah_senter: 0,
    jumlah_pentungan: 0,
    jumlah_ht: 0,
    anggaran_honor: 0,
    status_sk_satlinmas: 'Ada',
    peraturan_desa: '',
    status_struktur: 'Ada',
    pelatihan_anggota: 'Pernah',
    status_kta: 'Ada (Digital)',
    petugas_pendata: '',
  });

  // Form Trantibum (11 Specific Fields according to spec)
  const [trantibumForm, setTrantibumForm] = useState({
    id_tiket: '',
    tanggal_ditemukan: '',
    lokasi_ditemukan: '',
    nama_pelaku: 'Tanpa Nama',
    alamat_asal: '',
    jenis_kelamin: 'Laki-laki',
    status_identitas: 'Ada',
    no_ktp: '',
    kategori_masalah: [], // Array for multiple checkboxes
    no_rekam_medis: 'Nihil',
    keterangan_penanganan: '',
    selesaikan_aduan: false
  });
  const [trantibumFormMode, setTrantibumFormMode] = useState('create'); // 'create', 'edit', 'view'

  // Form Kegiatan Linmas (8 Field Lengkap)
  const [activityForm, setActivityForm] = useState({
    id: '',
    id_tiket: '',
    tanggal_kegiatan: '',
    kecamatan: '',
    desa: '',
    latitude: '',
    longitude: '',
    jenis_kegiatan: 'Patroli Wilayah',
    uraian_kegiatan: '',
    jumlah_personel: 1,
    foto_kegiatan: null,
    selesaikan_aduan: false,
  });
  const [activityFormMode, setActivityFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedKecamatanActivity, setSelectedKecamatanActivity] = useState('');
  const [filteredVillagesActivity, setFilteredVillagesActivity] = useState([]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  const [formErrors, setFormErrors] = useState({});

  // Fetch all databases logs
  const fetchSatlinmas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/linmas/satlinmas');
      if (res.ok) {
        const data = await res.json();
        setSatlinmasList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrantibum = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/linmas/penertiban');
      if (res.ok) {
        const data = await res.json();
        setTrantibumList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/linmas/kegiatan');
      if (res.ok) {
        const data = await res.json();
        setActivitiesList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDelegatedReports = async () => {
    try {
      const res = await fetch('/api/linmas/kegiatan?type=delegated');
      if (res.ok) {
        const data = await res.json();
        setDelegatedReports(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run on Mount & Tab Change
  useEffect(() => {
    fetchSatlinmas();
    fetchTrantibum();
    fetchActivities();
    fetchDelegatedReports();
  }, [activeTab]);

  // Handle Kecamatan and Village sync
  const handleKecamatanChange = (kec) => {
    setSelectedKecamatan(kec);
    setFilteredVillages(BULELENG_REGENCY[kec] || []);
    setSatlinmasForm(prev => ({
      ...prev,
      kecamatan: kec,
      desa: BULELENG_REGENCY[kec]?.[0] || ''
    }));
  };

  // Submit Satlinmas (21 Fields CRUD)
  const handleSatlinmasSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Validasi basic
    if (!satlinmasForm.kecamatan || !satlinmasForm.desa || !satlinmasForm.petugas_pendata) {
      setFormErrors({
        kecamatan: !satlinmasForm.kecamatan ? 'Kecamatan wajib dipilih' : null,
        desa: !satlinmasForm.desa ? 'Desa wajib dipilih' : null,
        petugas_pendata: !satlinmasForm.petugas_pendata ? 'Petugas pendata wajib diisi' : null,
      });
      return;
    }

    try {
      const method = satlinmasFormMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch('/api/linmas/satlinmas', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(satlinmasForm),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Data berhasil disimpan!");
        setIsSatlinmasModalOpen(false);
        fetchSatlinmas();
      } else {
        alert(data.error || "Gagal menyimpan data.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Delete Satlinmas
  const handleDeleteSatlinmas = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data Satlinmas desa ini?")) return;
    try {
      const res = await fetch(`/api/linmas/satlinmas?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Data Satlinmas berhasil dihapus.");
        fetchSatlinmas();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Penertiban Trantibum (POST or PUT, supporting the 11 fields)
  const handleTrantibumSubmit = async (e) => {
    e.preventDefault();
    if (!trantibumForm.lokasi_ditemukan || !trantibumForm.nama_pelaku || !trantibumForm.jenis_kelamin || !trantibumForm.status_identitas) {
      alert("Harap lengkapi semua field wajib (Lokasi, Nama Pelaku, Jenis Kelamin, dan Status KTP).");
      return;
    }
    if (!trantibumForm.kategori_masalah || trantibumForm.kategori_masalah.length === 0) {
      alert("Pilih minimal satu Kategori Masalah Sosial.");
      return;
    }
    if (trantibumForm.status_identitas === 'Ada' && trantibumForm.no_ktp.length !== 16) {
      alert("Nomor NIK KTP harus terdiri dari 16 digit angka.");
      return;
    }

    try {
      const method = trantibumFormMode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch('/api/linmas/penertiban', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...trantibumForm,
          no_ktp: trantibumForm.status_identitas === 'Tidak Ada' ? '-' : trantibumForm.no_ktp,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Data penertiban berhasil disimpan.");
        setIsTrantibumModalOpen(false);
        fetchTrantibum();
        fetchDelegatedReports(); // refresh lists in case an aduan was completed
      } else {
        alert(data.error || "Gagal menyimpan data penertiban.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Delete Trantibum log
  const handleDeleteTrantibum = async (id) => {
    if (!confirm("Hapus log penertiban PMKS ini secara permanen dari sistem?")) return;
    try {
      const res = await fetch(`/api/linmas/penertiban?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Log berhasil dihapus.");
        fetchTrantibum();
      } else {
        alert(data.error || "Gagal menghapus log.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Trantibum Modal for CRUD operations
  const handleOpenTrantibumModal = (mode = 'create', record = null) => {
    setTrantibumFormMode(mode);
    
    if (mode === 'create') {
      setTrantibumForm({
        id_tiket: '',
        tanggal_ditemukan: new Date().toISOString().substring(0, 16),
        lokasi_ditemukan: '',
        nama_pelaku: 'Tanpa Nama',
        alamat_asal: '',
        jenis_kelamin: 'Laki-laki',
        status_identitas: 'Ada',
        no_ktp: '',
        kategori_masalah: [],
        no_rekam_medis: 'Nihil',
        keterangan_penanganan: '',
        selesaikan_aduan: false
      });
    } else if (record) {
      // Split comma separated list back to array for checkboxes
      const cats = record.kategori_masalah
        ? record.kategori_masalah.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      setTrantibumForm({
        id: record.id,
        id_tiket: record.id_tiket || '',
        tanggal_ditemukan: record.tanggal_ditemukan ? new Date(record.tanggal_ditemukan).toISOString().substring(0, 16) : '',
        lokasi_ditemukan: record.lokasi_ditemukan || '',
        nama_pelaku: record.nama_pelaku || 'Tanpa Nama',
        alamat_asal: record.alamat_asal || '',
        jenis_kelamin: record.jenis_kelamin || 'Laki-laki',
        status_identitas: record.status_identitas || 'Ada',
        no_ktp: record.no_ktp || '',
        kategori_masalah: cats,
        no_rekam_medis: record.no_rekam_medis || 'Nihil',
        keterangan_penanganan: record.keterangan_penanganan || '',
        selesaikan_aduan: false
      });
    }
    setIsTrantibumModalOpen(true);
  };

  // Trigger Trantibum creation with citizen report auto-filled
  const handleOpenTrantibumFromReport = (report) => {
    handleOpenTrantibumModal('create');
    
    // Attempt to map category to checkboxes
    const cats = [];
    const lowerCategory = report.kategori_masalah.toLowerCase();
    if (lowerCategory.includes('odgj')) cats.push('ODGJ');
    else if (lowerCategory.includes('odmk') || lowerCategory.includes('linglung')) cats.push('ODMK/Linglung');
    else if (lowerCategory.includes('pengamen') || lowerCategory.includes('badut')) cats.push('Pengamen (inc. Badut)');
    else if (lowerCategory.includes('gelandangan') || lowerCategory.includes('gepeng')) cats.push('Gelandangan');
    else if (lowerCategory.includes('pengemis')) cats.push('Pengemis');
    else if (lowerCategory.includes('terlantar')) cats.push('Orang Terlantar');
    else if (lowerCategory.includes('punk')) cats.push('Anak Punk');

    setTrantibumForm({
      id_tiket: report.id_tiket,
      tanggal_ditemukan: new Date().toISOString().substring(0, 16),
      lokasi_ditemukan: report.disposisi?.catatan || report.kronologi || '',
      nama_pelaku: 'Tanpa Nama',
      alamat_asal: '',
      jenis_kelamin: 'Laki-laki',
      status_identitas: 'Ada',
      no_ktp: '',
      kategori_masalah: cats,
      no_rekam_medis: 'Nihil',
      keterangan_penanganan: `Operasi penertiban PMKS dilaksanakan menindaklanjuti laporan aduan masyarakat nomor tiket #${report.id_tiket}. Pelaku berhasil diamankan dan diberikan pembinaan.`,
      selesaikan_aduan: true
    });
  };

  // Open Kegiatan Modal for Delegated Citizen Report
  const handleOpenDelegatedActivity = (report) => {
    setSelectedReportForActivity(report);
    setActivityFormMode('create');
    
    // Auto-fill from citizen report
    const reportKec = Object.keys(BULELENG_REGENCY).find(kec => 
      report.kronologi?.toLowerCase().includes(kec.toLowerCase()) || 
      report.disposisi?.catatan?.toLowerCase().includes(kec.toLowerCase())
    ) || Object.keys(BULELENG_REGENCY)[0];
    
    const reportDesa = BULELENG_REGENCY[reportKec].find(desa => 
      report.kronologi?.toLowerCase().includes(desa.toLowerCase()) || 
      report.disposisi?.catatan?.toLowerCase().includes(desa.toLowerCase())
    ) || BULELENG_REGENCY[reportKec][0];

    setSelectedKecamatanActivity(reportKec);
    setFilteredVillagesActivity(BULELENG_REGENCY[reportKec]);

    setActivityForm({
      id_tiket: report.id_tiket,
      tanggal_kegiatan: new Date().toISOString().substring(0, 16),
      kecamatan: reportKec,
      desa: reportDesa,
      latitude: report.latitude || '',
      longitude: report.longitude || '',
      jenis_kegiatan: 'Penertiban Masalah Sosial (ODGJ, Gepeng, dll)',
      uraian_kegiatan: `Menindaklanjuti aduan warga nomor tiket #${report.id_tiket} terkait ${report.kategori_masalah}. Tim Linmas meluncur ke lokasi sasaran untuk melakukan tindakan penanganan dan penertiban.`,
      jumlah_personel: 3,
      foto_kegiatan: null,
      selesaikan_aduan: true,
    });
    setIsActivityModalOpen(true);
  };

  const handleOpenActivityModal = (mode = 'create', record = null) => {
    setActivityFormMode(mode);
    setSelectedReportForActivity(null);
    const defaultKec = Object.keys(BULELENG_REGENCY)[0];

    if (mode === 'create') {
      setSelectedKecamatanActivity(defaultKec);
      setFilteredVillagesActivity(BULELENG_REGENCY[defaultKec]);
      setActivityForm({
        id_tiket: '',
        tanggal_kegiatan: new Date().toISOString().substring(0, 16),
        kecamatan: defaultKec,
        desa: BULELENG_REGENCY[defaultKec][0],
        latitude: '',
        longitude: '',
        jenis_kegiatan: 'Patroli Wilayah',
        uraian_kegiatan: '',
        jumlah_personel: 2,
        foto_kegiatan: null,
        selesaikan_aduan: false,
      });
    } else if (record) {
      const activeKec = record.kecamatan || defaultKec;
      setSelectedKecamatanActivity(activeKec);
      setFilteredVillagesActivity(BULELENG_REGENCY[activeKec] || BULELENG_REGENCY[defaultKec]);
      setActivityForm({
        id: record.id,
        id_tiket: record.id_tiket || '',
        tanggal_kegiatan: record.tanggal_kegiatan ? new Date(record.tanggal_kegiatan).toISOString().substring(0, 16) : '',
        kecamatan: activeKec,
        desa: record.desa || '',
        latitude: record.latitude || '',
        longitude: record.longitude || '',
        jenis_kegiatan: record.jenis_kegiatan || 'Patroli Wilayah',
        uraian_kegiatan: record.uraian_kegiatan || '',
        jumlah_personel: record.jumlah_personel || 1,
        foto_kegiatan: record.foto_kegiatan || null,
        selesaikan_aduan: false,
      });

      if (record.id_tiket) {
        const report = delegatedReports.find(r => r.id_tiket === record.id_tiket);
        if (report) {
          setSelectedReportForActivity(report);
        }
      }
    }
    setIsActivityModalOpen(true);
  };

  const handleKecamatanActivityChange = (kec) => {
    setSelectedKecamatanActivity(kec);
    setFilteredVillagesActivity(BULELENG_REGENCY[kec] || []);
    setActivityForm(prev => ({
      ...prev,
      kecamatan: kec,
      desa: BULELENG_REGENCY[kec]?.[0] || ''
    }));
  };

  const handleActivityPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar tidak boleh melebihi 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setActivityForm(prev => ({
        ...prev,
        foto_kegiatan: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Kegiatan Linmas
  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    if (!activityForm.kecamatan || !activityForm.desa || !activityForm.jenis_kegiatan || !activityForm.uraian_kegiatan) {
      alert("Harap lengkapi semua field wajib (Kecamatan, Desa, Jenis Kegiatan, dan Uraian Pelaksanaan & Tindak Lanjut).");
      return;
    }

    try {
      const method = activityFormMode === 'edit' ? 'PUT' : 'POST';
      const payload = {
        ...activityForm,
        id_tiket: selectedReportForActivity ? selectedReportForActivity.id_tiket : (activityForm.id_tiket || null),
      };

      const res = await fetch('/api/linmas/kegiatan', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Kegiatan/Tindak Lanjut berhasil disimpan!");
        setIsActivityModalOpen(false);
        setSelectedReportForActivity(null);
        fetchActivities();
        fetchDelegatedReports();
      } else {
        alert(data.error || "Gagal menyimpan kegiatan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server.");
    }
  };

  // Delete Activity
  const handleDeleteActivity = async (id) => {
    if (!confirm("Hapus riwayat kegiatan ini?")) return;
    try {
      const res = await fetch(`/api/linmas/kegiatan?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Kegiatan berhasil dihapus.");
        fetchActivities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Satlinmas Modal for view/edit/create
  const handleOpenSatlinmasModal = (mode, record = null) => {
    setSatlinmasFormMode(mode);
    setSelectedSatlinmas(record);

    if (mode === 'create') {
      const defaultKec = Object.keys(BULELENG_REGENCY)[0];
      setSelectedKecamatan(defaultKec);
      setFilteredVillages(BULELENG_REGENCY[defaultKec]);
      setSatlinmasForm({
        id: '',
        kecamatan: defaultKec,
        desa: BULELENG_REGENCY[defaultKec][0],
        anggota_pria: 0,
        anggota_wanita: 0,
        nama_kades: '',
        nama_kasi: '',
        kontak_perangkat: '',
        jumlah_pos_kamling: 0,
        status_pakaian_dinas: 'Ada',
        ket_pakaian_dinas: '',
        jumlah_senter: 0,
        jumlah_pentungan: 0,
        jumlah_ht: 0,
        anggaran_honor: 0,
        status_sk_satlinmas: 'Ada',
        peraturan_desa: '',
        status_struktur: 'Ada',
        pelatihan_anggota: 'Pernah',
        status_kta: 'Ada (Digital)',
        petugas_pendata: '',
      });
    } else {
      setSelectedKecamatan(record.kecamatan);
      setFilteredVillages(BULELENG_REGENCY[record.kecamatan] || []);
      setSatlinmasForm({
        ...record,
      });
    }
    setIsSatlinmasModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12 select-none relative overflow-x-hidden">
      
      {/* 1. Header Banner Top Bar (Kemendagri Gradient Style) */}
      <div className="bg-gradient-to-r from-[#212260] via-[#522a98] via-[#8e2de2] to-[#ec008c] text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Glowing Decorative Backgrounds */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[15%] w-36 h-36 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          
          {/* Sisi Kiri: Logo bulat SIP POLPP & Identitas */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#ffb800] p-1 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white">
                <Shield className="w-8 h-8 text-[#ffb800] fill-[#ffb800]/10" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider leading-none text-white drop-shadow-md">
                SIP POLPP
              </h1>
              <p className="text-[10px] text-yellow-350 font-bold uppercase tracking-widest mt-1.5">
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
                <span className="text-[8px] bg-yellow-450 text-[#0B1E43] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  Admin
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* 2. Horizontal Admin Navbar (Sticky / Persistent) */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-[#212260] hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
              title="Kembali ke halaman utama warga"
            >
              Portal Warga
            </Link>
            
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Dashboard
            </Link>
            
            <Link 
              href="/admin/dashboard?tab=disposisi" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Disposisi
            </Link>
            
            <Link 
              href="/admin/trantib" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Trantib
            </Link>

            <Link 
              href="/admin/perada" 
              className="px-4 py-4 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              Portal Perada
            </Link>

            <Link 
              href="/admin/linmas" 
              className="px-4 py-4 text-xs font-black text-blue-600 bg-blue-50/50 transition-all uppercase tracking-wider border-b-2 border-blue-600 flex items-center gap-1.5"
            >
              Portal Linmas
            </Link>
          </div>
          
          <button
            onClick={() => {
              fetchSatlinmas();
              fetchTrantibum();
              fetchActivities();
              fetchDelegatedReports();
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer active:scale-95 my-2"
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Portal
          </button>
        </div>
      </nav>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
        
        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PORTAL BIDANG LINMAS</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              ADMINISTRASI SATLINMAS & PEMBINAAN DESA • KABUPATEN BULELENG
            </p>
          </div>
        </div>

        {/* Dynamic Division Tabs Navigation */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1.5">
          <button
            onClick={() => setActiveTab('satlinmas')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'satlinmas'
                ? 'bg-[#0B1E43] text-white shadow-sm'
                : 'text-slate-600 bg-transparent hover:bg-slate-50 hover:text-[#0B1E43]'
            }`}
          >
            <Users className="w-4 h-4" /> Administrasi Satlinmas ({satlinmasList.length})
          </button>
          <button
            onClick={() => setActiveTab('trantibum')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'trantibum'
                ? 'bg-[#0B1E43] text-white shadow-sm'
                : 'text-slate-600 bg-transparent hover:bg-slate-50 hover:text-[#0B1E43]'
            }`}
          >
            <AlertOctagon className="w-4 h-4" /> Penertiban Trantibum ({trantibumList.length})
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-[#0B1E43] text-white shadow-sm'
                : 'text-slate-600 bg-transparent hover:bg-slate-50 hover:text-[#0B1E43]'
            }`}
          >
            <FileText className="w-4 h-4" /> Kegiatan & Aduan Warga ({activitiesList.length})
          </button>
        </div>

        {/* -------------------- TAB 1: SATLINMAS -------------------- */}
        {activeTab === 'satlinmas' && (
          <div className="space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Desa Terdata</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {satlinmasList.length} <span className="text-xs font-normal text-slate-500">Desa/Kelurahan</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Anggota Aktif</div>
                <div className="text-2xl font-bold text-[#0B1E43] mt-1 flex items-baseline gap-1.5">
                  {satlinmasList.reduce((acc, curr) => acc + curr.anggota_pria + curr.anggota_wanita, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    ({satlinmasList.reduce((acc, curr) => acc + curr.anggota_pria, 0)} L | {satlinmasList.reduce((acc, curr) => acc + curr.anggota_wanita, 0)} P)
                  </span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Pos Kamling</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1 flex items-baseline gap-1.5">
                  {satlinmasList.reduce((acc, curr) => acc + curr.jumlah_pos_kamling, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">Titik Aktif</span>
                </div>
              </div>
            </div>

            {/* List & Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Daftar Administrasi Satlinmas</h3>
                  <p className="text-[11px] text-slate-500">Tabel manajemen logistik dan perlengkapan Satlinmas per desa</p>
                </div>
                <button
                  onClick={() => handleOpenSatlinmasModal('create')}
                  className="px-4 py-2 bg-blue-700 hover:bg-[#0B1E43] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Tambah Data Desa
                </button>
              </div>

              {/* Table List of Satlinmas */}
              {satlinmasList.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl text-slate-400 space-y-2 text-xs">
                  <Users className="w-10 h-10 mx-auto text-slate-650" />
                  <p className="font-bold text-slate-600">Belum ada rekaman Satlinmas masuk</p>
                  <p className="text-[10px]">Silakan klik tombol "Tambah Data Desa" untuk memulai administrasi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-250 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-3">Kecamatan</th>
                        <th className="p-3">Desa / Kelurahan</th>
                        <th className="p-3">Total Anggota</th>
                        <th className="p-3">Peralatan (HT/Senter/Pentung)</th>
                        <th className="p-3">SK & Perdes</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {satlinmasList.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-700">{record.kecamatan}</td>
                          <td className="p-3 font-bold text-blue-900">{record.desa}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">
                              {record.anggota_pria + record.anggota_wanita} Orang
                            </div>
                            <div className="text-[10px] text-slate-500">
                              L: {record.anggota_pria} | P: {record.anggota_wanita}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-600 font-medium">
                              {record.jumlah_ht} HT / {record.jumlah_senter} Senter / {record.jumlah_pentungan} Ptg
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                record.status_sk_satlinmas === 'Ada' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                SK: {record.status_sk_satlinmas}
                              </span>
                              <span className="text-[10px] text-slate-500 max-w-[120px] truncate animate-none" title={record.peraturan_desa}>
                                {record.peraturan_desa || 'Tidak ada Perdes'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenSatlinmasModal('view', record)}
                                className="p-1.5 bg-slate-50 hover:bg-blue-50 text-blue-800 rounded-lg border border-slate-200 hover:border-blue-200 cursor-pointer transition-all"
                                title="Lihat Detail (21 Field)"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenSatlinmasModal('edit', record)}
                                className="p-1.5 bg-slate-50 hover:bg-amber-50 text-amber-600 rounded-lg border border-slate-200 hover:border-amber-200 cursor-pointer transition-all"
                                title="Edit Data"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSatlinmas(record.id)}
                                className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 hover:border-rose-200 cursor-pointer transition-all"
                                title="Hapus Data"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

        {/* -------------------- TAB 2: TRANTIBUM -------------------- */}
        {activeTab === 'trantibum' && (
          <div className="space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Operasi Penertiban</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1">
                  {trantibumList.length} <span className="text-xs font-normal text-slate-500">Kasus</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gepeng & Pengemis</div>
                <div className="text-2xl font-bold text-rose-600 mt-1 flex items-baseline gap-1">
                  {trantibumList.filter(x => x.kategori_masalah?.includes('Gelandangan') || x.kategori_masalah?.includes('Pengemis')).length}{' '}
                  <span className="text-xs font-normal text-slate-500">Kasus</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ODGJ & ODMK Tertibkan</div>
                <div className="text-2xl font-bold text-amber-600 mt-1 flex items-baseline gap-1">
                  {trantibumList.filter(x => x.kategori_masalah?.includes('ODGJ') || x.kategori_masalah?.includes('ODMK/Linglung')).length}{' '}
                  <span className="text-xs font-normal text-slate-500">Kasus</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Anak Punk & Terlantar</div>
                <div className="text-2xl font-bold text-blue-800 mt-1 flex items-baseline gap-1">
                  {trantibumList.filter(x => x.kategori_masalah?.includes('Anak Punk') || x.kategori_masalah?.includes('Orang Terlantar')).length}{' '}
                  <span className="text-xs font-normal text-slate-500">Kasus</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Riwayat Penertiban PMKS & Trantibum</h3>
                  <p className="text-[11px] text-slate-500">Daftar tindakan penertiban Penyandang Masalah Kesejahteraan Sosial (PMKS) Bidang Linmas</p>
                </div>
                <button
                  onClick={() => handleOpenTrantibumModal('create')}
                  className="px-4 py-2 bg-blue-700 hover:bg-[#0B1E43] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Catat Penertiban (Trantibum)
                </button>
              </div>

              {trantibumList.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  Belum ada riwayat operasi penertiban PMKS dicatat.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trantibumList.map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-white border border-slate-200 hover:border-blue-200 rounded-xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-all group"
                    >
                      <div className="space-y-3">
                        {/* Header card: Nama & Kategori */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-800">{log.nama_pelaku || "Tanpa Nama"}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                log.jenis_kelamin === 'Laki-laki' 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                  : 'bg-pink-50 text-pink-700 border-pink-200'
                              }`}>
                                {log.jenis_kelamin}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#E28A1C]" /> {log.alamat_asal || 'Alamat asal tidak diketahui'}
                            </div>
                          </div>

                          {/* Ticket link if associated */}
                          {log.id_tiket && (
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[9px] font-bold rounded-lg uppercase tracking-wider" title={`Terkoneksi Tiket #${log.id_tiket}`}>
                              Tiket: #{log.id_tiket}
                            </span>
                          )}
                        </div>

                        {/* Category badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {log.kategori_masalah ? log.kategori_masalah.split(',').map((cat, idx) => {
                            const c = cat.trim();
                            let colorClass = "bg-slate-50 text-slate-650 border-slate-200";
                            if (c === "ODGJ") colorClass = "bg-rose-50 text-rose-700 border-rose-200";
                            else if (c === "ODMK/Linglung") colorClass = "bg-amber-50 text-amber-700 border-amber-200";
                            else if (c.includes("Pengamen")) colorClass = "bg-purple-50 text-purple-700 border-purple-200";
                            else if (c === "Gelandangan") colorClass = "bg-sky-50 text-sky-700 border-sky-200";
                            else if (c === "Pengemis") colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                            else if (c === "Orang Terlantar") colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                            else if (c === "Anak Punk") colorClass = "bg-yellow-50 text-yellow-750 border-yellow-250";
                            
                            return (
                              <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colorClass}`}>
                                {c}
                              </span>
                            );
                          }) : null}
                        </div>

                        <hr className="border-slate-100" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Identitas & KTP</span>
                            <span className="font-bold text-slate-800">
                              {log.status_identitas === 'Ada' ? `NIK: ${log.no_ktp}` : 'Tanpa KTP (Identitas N/A)'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Nomor Rekam Medis</span>
                            <span className={`font-bold ${log.no_rekam_medis !== 'Nihil' ? 'text-rose-600' : 'text-slate-500'}`}>
                              {log.no_rekam_medis || 'Nihil'}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Waktu & Tempat Penemuan</span>
                            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(log.tanggal_ditemukan).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                            <span className="font-medium text-slate-500 block mt-0.5 text-[10px]">
                              {log.lokasi_ditemukan}
                            </span>
                          </div>
                        </div>

                        {/* Penanganan callout box */}
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                          <span className="text-[9px] text-emerald-700 font-bold block uppercase tracking-wider">Tindakan Penanganan Akhir</span>
                          <p className="text-slate-600 italic">
                            "{log.keterangan_penanganan || 'Belum ada catatan tindakan akhir.'}"
                          </p>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="border-t border-slate-100 pt-3 mt-1 flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenTrantibumModal('view', log)}
                          className="p-1.5 bg-slate-50 hover:bg-blue-50 text-blue-800 border border-slate-200 hover:border-blue-200 rounded-lg cursor-pointer transition-all"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenTrantibumModal('edit', log)}
                          className="p-1.5 bg-slate-50 hover:bg-amber-50 text-amber-600 border border-slate-200 hover:border-amber-200 rounded-lg cursor-pointer transition-all"
                          title="Edit Penertiban"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrantibum(log.id)}
                          className="p-1.5 bg-slate-900 hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-slate-800 rounded-lg cursor-pointer transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- TAB 3: ACTIVITIES & CITIZEN DELEGATION -------------------- */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            
            {/* Split Screen: Left = Citizen Reports Delegated to Linmas, Right = logged activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Delegated Citizen Reports */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Aduan Warga yang Didisposisikan</h3>
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-250 text-[10px] font-bold rounded-full animate-pulse">
                      {delegatedReports.length} Tertunda
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Pengaduan masyarakat yang diteruskan Admin Dashboard ke Bidang Linmas</p>
                </div>

                {delegatedReports.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs space-y-1">
                    <Check className="w-10 h-10 mx-auto text-emerald-600" />
                    <p className="font-bold text-slate-600">Selesai Semua! Tidak ada tunggakan disposisi.</p>
                    <p className="text-[10px]">Semua aduan masyarakat yang didelegasikan ke Linmas sudah ditindaklanjuti.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
                    {delegatedReports.map((report) => (
                      <div 
                        key={report.id_tiket} 
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 space-y-3 transition-colors relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[9px] text-[#0B1E43] font-bold uppercase tracking-wider">
                              TIKET: #{report.id_tiket}
                            </div>
                            <h4 className="text-xs font-bold text-slate-800">{report.kategori_masalah}</h4>
                          </div>
                          <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-250 px-1.5 py-0.5 rounded font-bold">
                            {report.disposisi?.kedaruratan}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <p className="italic text-slate-850">
                            "{report.kronologi}"
                          </p>
                          <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
                            <span className="text-slate-500">
                              Pelapor: <strong className="text-slate-700">{report.nama_pelapor}</strong>
                            </span>
                            <span className="text-slate-500">
                              Verifikasi Admin: <strong className="text-slate-700">{report.disposisi?.nama_admin}</strong>
                            </span>
                          </div>
                          {report.disposisi?.catatan && (
                            <div className="p-2 bg-white border border-slate-200 text-[11px] text-slate-600 rounded-lg">
                              <strong>Instruksi Disposisi:</strong> {report.disposisi.catatan}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-200 pt-2.5">
                          <button
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
                              window.open(url, '_blank');
                            }}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-955 font-bold cursor-pointer transition-all"
                          >
                            <Map className="w-3.5 h-3.5" /> Google Maps
                          </button>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenTrantibumFromReport(report)}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-[#E28A1C] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                              title="Catat Penertiban PMKS/Trantibum atas aduan ini"
                            >
                              <Shield className="w-3 h-3" /> Catat Penertiban
                            </button>
                            <button
                              onClick={() => handleOpenDelegatedActivity(report)}
                              className="px-2.5 py-1.5 bg-blue-700 hover:bg-[#0B1E43] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Catat Kegiatan Pembinaan/Sosialisasi umum"
                            >
                              <UserCheck className="w-3 h-3" /> Tindak Lanjut
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Internal Kegiatan Logs */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Log Kegiatan Bidang Linmas</h3>
                    <p className="text-[11px] text-slate-500">Riwayat penyuluhan, pembinaan, dan tindak lanjut aduan</p>
                  </div>
                  
                  {/* Create Kegiatan manually (not from a report) */}
                  <button
                    onClick={() => handleOpenActivityModal('create')}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#0B1E43] border border-slate-200 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" /> Catat Kegiatan Internal
                  </button>
                </div>

                {activitiesList.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Belum ada log kegiatan Bidang Linmas terdata.
                  </div>
                ) : (
                  <div className="space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
                    {activitiesList.map((act) => (
                      <div 
                        key={act.id} 
                        className="bg-slate-50 border border-slate-200 hover:border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 transition-all group"
                      >
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-indigo-755 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">
                              LOG-{act.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              act.jenis_kegiatan === 'Patroli Wilayah'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : act.jenis_kegiatan === 'Penertiban Masalah Sosial (ODGJ, Gepeng, dll)'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : act.jenis_kegiatan === 'Pembinaan Satlinmas Desa/Kelurahan'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {act.jenis_kegiatan}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-455" />
                              {new Date(act.tanggal_kegiatan).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900">
                              <MapPin className="w-3.5 h-3.5 text-[#E28A1C]" />
                              <span>{act.kecamatan}, {act.desa}</span>
                              {act.latitude && act.longitude && (
                                <button
                                  onClick={() => {
                                    const url = `https://www.google.com/maps?q=${act.latitude},${act.longitude}`;
                                    window.open(url, '_blank');
                                  }}
                                  className="p-1 bg-white hover:bg-slate-100 text-emerald-700 border border-slate-200 rounded cursor-pointer transition-colors"
                                  title="Buka Google Maps"
                                >
                                  <Map className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {act.uraian_kegiatan}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1.5">
                              <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md flex items-center gap-1">
                                Personel: <strong className="text-indigo-700 font-bold">{act.jumlah_personel} Orang</strong>
                              </span>
                              {act.id_tiket && (
                                <span className="text-[9px] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-blue-800 font-bold">
                                  Aduan Tiket: #{act.id_tiket}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Photo Thumbnail on Right, and actions */}
                        <div className="flex flex-row sm:flex-col justify-between items-end gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 min-w-[120px]">
                          <div>
                            {act.foto_kegiatan ? (
                              <img 
                                src={act.foto_kegiatan} 
                                alt="Dokumentasi Kegiatan" 
                                onClick={() => {
                                  setZoomImageUrl(act.foto_kegiatan);
                                  setIsZoomModalOpen(true);
                                }}
                                className="h-16 w-24 rounded-lg object-cover border border-slate-200 hover:border-blue-500 cursor-zoom-in transition-all shadow-sm"
                              />
                            ) : (
                              <div className="text-[10px] text-slate-500 italic py-2">
                                Tanpa Foto Dok.
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-1.5 mt-auto pt-2">
                            <button
                              onClick={() => handleOpenActivityModal('edit', act)}
                              className="p-1.5 bg-white hover:bg-slate-100 text-amber-600 border border-slate-200 rounded-lg cursor-pointer transition-all"
                              title="Edit Kegiatan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="p-1.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg cursor-pointer transition-all"
                              title="Hapus Kegiatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================== 1. MODAL DETAIL & FORM SATLINMAS (21 FIELDS) ==================== */}
      {isSatlinmasModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative my-8">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/80 rounded-t-2xl">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Formulir 21 Field Administrasi</span>
                <h3 className="text-sm font-bold text-slate-200">
                  {satlinmasFormMode === 'view' 
                    ? `Detail Satlinmas Desa ${satlinmasForm.desa}` 
                    : satlinmasFormMode === 'edit' 
                    ? `Edit Administrasi Satlinmas` 
                    : 'Tambah Administrasi Satlinmas Baru'}
                </h3>
              </div>
              <button 
                onClick={() => setIsSatlinmasModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSatlinmasSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin text-xs">
              
              {/* SECTION A: GEOGRAFI & STAF KEPEMIMPINAN */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-800 pb-1">
                  A. Geografi & Kepala Staf Satlinmas
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Kecamatan <span className="text-rose-500">*</span></label>
                    <select
                      value={satlinmasForm.kecamatan}
                      onChange={(e) => handleKecamatanChange(e.target.value)}
                      disabled={satlinmasFormMode === 'view'}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      {Object.keys(BULELENG_REGENCY).map(kec => (
                        <option key={kec} value={kec}>{kec}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Desa / Kelurahan <span className="text-rose-500">*</span></label>
                    <select
                      value={satlinmasForm.desa}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, desa: e.target.value }))}
                      disabled={satlinmasFormMode === 'view'}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      {filteredVillages.map(desa => (
                        <option key={desa} value={desa}>{desa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Nama Kepala Desa / Lurah</label>
                    <input
                      type="text"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.nama_kades}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, nama_kades: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Nama Kasi Trantib / Pem.</label>
                    <input
                      type="text"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.nama_kasi}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, nama_kasi: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Kontak WA Kasi / Kades</label>
                    <input
                      type="text"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.kontak_perangkat}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, kontak_perangkat: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: KEKUATAN PERSONIL & HONOR */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-800 pb-1">
                  B. Kekuatan Anggota Linmas & Anggaran Honorarium
                </span>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Anggota Pria</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.anggota_pria}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, anggota_pria: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Anggota Wanita</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.anggota_wanita}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, anggota_wanita: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Pos Kamling (Unit)</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.jumlah_pos_kamling}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, jumlah_pos_kamling: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Anggaran Honor (Rp)</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.anggaran_honor}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, anggaran_honor: parseFloat(e.target.value) || 0.0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: LOGISTIK, PRASARANA & PERALATAN */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-800 pb-1">
                  C. Inventaris Peralatan & Pakaian Dinas
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Pakaian Dinas Lapangan</label>
                    <select
                      value={satlinmasForm.status_pakaian_dinas}
                      disabled={satlinmasFormMode === 'view'}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, status_pakaian_dinas: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      <option value="Ada">Lengkap / Ada</option>
                      <option value="Tidak Ada">Tidak Ada / Kurang</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Keterangan Pakaian Dinas</label>
                    <input
                      type="text"
                      disabled={satlinmasFormMode === 'view'}
                      placeholder="Contoh: 15 stel lengkap warna hijau abu"
                      value={satlinmasForm.ket_pakaian_dinas}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, ket_pakaian_dinas: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Jumlah Senter (Pcs)</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.jumlah_senter}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, jumlah_senter: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Jumlah Pentungan (Pcs)</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.jumlah_pentungan}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, jumlah_pentungan: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Handy Talky (HT) (Unit)</label>
                    <input
                      type="number"
                      disabled={satlinmasFormMode === 'view'}
                      value={satlinmasForm.jumlah_ht}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, jumlah_ht: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: REGULASI, SK & KEANGGOTAAN */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-800 pb-1">
                  D. Aspek Hukum, Legalitas & KTA
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Status SK Satlinmas</label>
                    <select
                      value={satlinmasForm.status_sk_satlinmas}
                      disabled={satlinmasFormMode === 'view'}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, status_sk_satlinmas: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      <option value="Ada">Ada / Diterbitkan Kades</option>
                      <option value="Tidak Ada">Tidak Ada / Kadaluarsa</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Peraturan Desa (Perdes) Linmas</label>
                    <input
                      type="text"
                      disabled={satlinmasFormMode === 'view'}
                      placeholder="Contoh: No. 3 Tahun 2024 tentang Linmas"
                      value={satlinmasForm.peraturan_desa}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, peraturan_desa: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Struktur Organisasi</label>
                    <select
                      value={satlinmasForm.status_struktur}
                      disabled={satlinmasFormMode === 'view'}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, status_struktur: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      <option value="Ada">Bagan Struktur Ada</option>
                      <option value="Tidak">Belum Tersusun</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Pelatihan Anggota</label>
                    <select
                      value={satlinmasForm.pelatihan_anggota}
                      disabled={satlinmasFormMode === 'view'}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, pelatihan_anggota: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      <option value="Pernah">Pernah Dibina Satpol PP</option>
                      <option value="Belum Pernah">Belum Pernah</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">Kartu Tanda Anggota (KTA)</label>
                    <select
                      value={satlinmasForm.status_kta}
                      disabled={satlinmasFormMode === 'view'}
                      onChange={(e) => setSatlinmasForm(prev => ({ ...prev, status_kta: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    >
                      <option value="Ada (Digital)">Ada (Digital)</option>
                      <option value="Ada (Manual)">Ada (Fisik Manual)</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION E: PETUGAS PENDATA */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-800 pb-1">
                  E. Kredibilitas Data
                </span>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block">Nama Resmi Petugas Pendata <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    disabled={satlinmasFormMode === 'view'}
                    placeholder="Contoh: Kadek Dwi Antara, S.H. (Fungsional Linmas)"
                    value={satlinmasForm.petugas_pendata}
                    onChange={(e) => setSatlinmasForm(prev => ({ ...prev, petugas_pendata: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600"
                    required
                  />
                  {formErrors.petugas_pendata && (
                    <span className="text-[10px] text-rose-500">{formErrors.petugas_pendata}</span>
                  )}
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="border-t border-slate-800 pt-4 flex justify-end gap-2 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setIsSatlinmasModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  {satlinmasFormMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {satlinmasFormMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-xl transition-colors cursor-pointer"
                  >
                    {satlinmasFormMode === 'edit' ? 'Simpan Perubahan' : 'Tambah Rekaman Desa'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 2. MODAL KEGIATAN & TINDAK LANJUT ADUAN (8 FIELDS LENGKAP) ==================== */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-850 w-full max-w-2xl rounded-2xl shadow-2xl relative my-8 overflow-hidden transition-all">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-850 bg-slate-950/80 rounded-t-2xl">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  Pencatatan Kegiatan Bidang Linmas (8 Field)
                </span>
                <h3 className="text-sm font-black text-slate-200">
                  {activityFormMode === 'edit'
                    ? 'Edit Catatan Kegiatan Linmas'
                    : selectedReportForActivity 
                    ? 'Buat Tindak Lanjut Laporan Aduan' 
                    : 'Catat Kegiatan Lapangan Baru'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsActivityModalOpen(false);
                  setSelectedReportForActivity(null);
                }}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActivitySubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin text-xs">
              
              {/* Linked Ticket Callout */}
              {selectedReportForActivity && (
                <div className="bg-indigo-950/30 border border-indigo-500/20 p-3.5 rounded-xl space-y-1 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider">Aduan Warga Terdelegasi</span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-black uppercase border border-indigo-500/30">
                      Tiket: #{selectedReportForActivity.id_tiket}
                    </span>
                  </div>
                  <div className="font-bold text-slate-200 text-[11px]">{selectedReportForActivity.kategori_masalah}</div>
                  <p className="text-[10px] text-slate-400 italic line-clamp-2">"{selectedReportForActivity.kronologi}"</p>
                </div>
              )}

              {/* SECTION A: INTEGRASI TIKET & WAKTU */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  A. Integrasi Aduan & Waktu Kegiatan
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Nomor Tiket Aduan</label>
                    <select
                      disabled={!!selectedReportForActivity || !!activityForm.id}
                      value={activityForm.id_tiket}
                      onChange={(e) => {
                        const ticketId = e.target.value;
                        if (!ticketId) {
                          setActivityForm(prev => ({
                            ...prev,
                            id_tiket: '',
                            selesaikan_aduan: false
                          }));
                          return;
                        }
                        const report = delegatedReports.find(r => r.id_tiket === ticketId);
                        if (report) {
                          setActivityForm(prev => ({
                            ...prev,
                            id_tiket: ticketId,
                            selesaikan_aduan: true,
                            latitude: report.latitude || '',
                            longitude: report.longitude || '',
                            jenis_kegiatan: 'Penertiban Masalah Sosial (ODGJ, Gepeng, dll)',
                            uraian_kegiatan: `Menindaklanjuti aduan warga nomor tiket #${ticketId} terkait ${report.kategori_masalah}. Tim Linmas meluncur ke lokasi untuk penertiban.`
                          }));
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 font-semibold disabled:opacity-60"
                    >
                      <option value="">Kegiatan Mandiri / Rutin (Tanpa Tiket)</option>
                      {delegatedReports.map(r => (
                        <option key={r.id_tiket} value={r.id_tiket}>
                          [#{r.id_tiket}] {r.nama_pelapor} - {r.kategori_masalah}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Tanggal & Waktu Kegiatan <span className="text-rose-500">*</span></label>
                    <input
                      type="datetime-local"
                      value={activityForm.tanggal_kegiatan}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, tanggal_kegiatan: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-600 font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: SASARAN & GPS */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  B. Lokasi / Wilayah Sasaran & Titik Lokasi (Tilok)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Kecamatan <span className="text-rose-500">*</span></label>
                    <select
                      value={activityForm.kecamatan}
                      onChange={(e) => handleKecamatanActivityChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 font-semibold"
                      required
                    >
                      {Object.keys(BULELENG_REGENCY).map(kec => (
                        <option key={kec} value={kec}>{kec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Desa / Kelurahan <span className="text-rose-500">*</span></label>
                    <select
                      value={activityForm.desa}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, desa: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 font-semibold"
                      required
                    >
                      {filteredVillagesActivity.map(desa => (
                        <option key={desa} value={desa}>{desa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* GPS Coordinates */}
                <div className="bg-slate-950/40 border border-slate-855 p-3 rounded-xl space-y-3 shadow-inner">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Titik Koordinat Geospasial (Peta)</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              setActivityForm(prev => ({
                                ...prev,
                                latitude: pos.coords.latitude.toString(),
                                longitude: pos.coords.longitude.toString()
                              }));
                            },
                            (err) => {
                              alert("Gagal mendapatkan GPS: " + err.message);
                            }
                          );
                        } else {
                          alert("Browser Anda tidak mendukung Geolocation API.");
                        }
                      }}
                      className="px-2 py-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded text-[9px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" /> Tangkap GPS Lapangan
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-semibold block">Latitude</label>
                      <input
                        type="text"
                        placeholder="Contoh: -8.1153"
                        value={activityForm.latitude || ''}
                        onChange={(e) => setActivityForm(prev => ({ ...prev, latitude: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-semibold block">Longitude</label>
                      <input
                        type="text"
                        placeholder="Contoh: 115.0901"
                        value={activityForm.longitude || ''}
                        onChange={(e) => setActivityForm(prev => ({ ...prev, longitude: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C: KLASIFIKASI & PERSONEL */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-855 pb-1">
                  C. Jenis Kegiatan & Kekuatan Personil
                </span>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Jenis Kegiatan <span className="text-rose-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Patroli Wilayah',
                      'Penertiban Masalah Sosial (ODGJ, Gepeng, dll)',
                      'Pembinaan Satlinmas Desa/Kelurahan',
                      'Pendampingan Tugas Lainnya'
                    ].map(jenis => (
                      <button
                        key={jenis}
                        type="button"
                        onClick={() => setActivityForm(prev => ({ ...prev, jenis_kegiatan: jenis }))}
                        className={`py-2 px-3 text-left text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                          activityForm.jenis_kegiatan === jenis
                            ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800'
                        }`}
                      >
                        {jenis}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Jumlah Personel Internal Linmas <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    min={1}
                    value={activityForm.jumlah_personel}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, jumlah_personel: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 font-bold outline-none focus:border-indigo-600"
                    required
                  />
                  <span className="text-[9px] text-slate-500">Jumlah pegawai/petugas internal yang turun ke lapangan</span>
                </div>
              </div>

              {/* SECTION D: URAIAN & DOKUMENTASI */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  D. Uraian Pelaksanaan & Dokumentasi Foto
                </span>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Uraian Pelaksanaan & Tindak Lanjut <span className="text-rose-500">*</span></label>
                  <textarea
                    placeholder="Contoh: Tim Linmas melaksanakan pembinaan fisik kesamaptaan di Kantor Desa..."
                    value={activityForm.uraian_kegiatan}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, uraian_kegiatan: e.target.value }))}
                    rows="3.5"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-250 outline-none focus:border-indigo-600 font-medium leading-relaxed"
                    required
                  />
                </div>

                {/* Photo Upload with Preview */}
                <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dokumentasi Kegiatan (Unggah Foto)</label>
                    <span className="text-[9px] text-slate-500">Maks. 2MB (Base64)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {activityForm.foto_kegiatan ? (
                        <div className="relative group">
                          <img 
                            src={activityForm.foto_kegiatan} 
                            alt="Preview Dokumentasi" 
                            className="h-20 w-28 rounded-lg object-cover border border-slate-800 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setActivityForm(prev => ({ ...prev, foto_kegiatan: null }))}
                            className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full cursor-pointer shadow-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-28 rounded-lg border border-dashed border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-600 gap-1 text-[9px] font-bold">
                          <Eye className="w-5 h-5" /> Preview Foto
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        id="foto_kegiatan_input"
                        onChange={handleActivityPhotoChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="foto_kegiatan_input"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-xl text-[11px] font-bold cursor-pointer transition-colors shadow-inner"
                      >
                        Pilih Berkas Gambar
                      </label>
                      <p className="text-[9px] text-slate-500 mt-1">Unggah bukti visual sebagai dokumentasi penyelesaian laporan.</p>
                    </div>
                  </div>
                </div>

                {selectedReportForActivity && (
                  <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl shadow-inner">
                    <input
                      type="checkbox"
                      id="activity_selesaikan_aduan_cb"
                      checked={activityForm.selesaikan_aduan}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, selesaikan_aduan: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded bg-slate-950 border-slate-850 cursor-pointer focus:ring-emerald-500"
                    />
                    <label htmlFor="activity_selesaikan_aduan_cb" className="text-[11px] text-slate-300 font-black cursor-pointer uppercase tracking-wider flex items-center gap-1.5 select-none">
                      <Check className="w-4 h-4 text-emerald-400" /> Selesaikan aduan warga ini di database (Status: Selesai)
                    </label>
                  </div>
                )}
              </div>

              {/* Actions Bottom */}
              <div className="border-t border-slate-850 pt-4 flex justify-end gap-2 bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setIsActivityModalOpen(false);
                    setSelectedReportForActivity(null);
                  }}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-855 rounded-xl border border-slate-800 font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-black text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> {activityFormMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Riwayat'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================== 4. DYNAMIC ZOOM IMAGE MODAL ==================== */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button 
              onClick={() => {
                setIsZoomModalOpen(false);
                setZoomImageUrl('');
              }}
              className="absolute -top-12 right-0 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-350 hover:text-slate-100 border border-slate-800 rounded-xl cursor-pointer transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={zoomImageUrl} 
              alt="Zoom Dokumentasi" 
              className="max-h-[80vh] max-w-full rounded-2xl border border-slate-850 shadow-2xl object-contain bg-slate-950"
            />
          </div>
        </div>
      )}

      {/* ==================== 3. PREMIUM MODAL DRAWER FOR TRANTIBUM (11 FIELDS) ==================== */}
      {isTrantibumModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-850 w-full max-w-2xl rounded-2xl shadow-2xl relative my-8 overflow-hidden transition-all">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-850 bg-slate-950/80 rounded-t-2xl">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  Administrasi Penertiban PMKS & Trantibum
                </span>
                <h3 className="text-sm font-black text-slate-200">
                  {trantibumFormMode === 'view' 
                    ? `Detail Penertiban: ${trantibumForm.nama_pelaku}` 
                    : trantibumFormMode === 'edit' 
                    ? `Edit Catatan Penertiban PMKS` 
                    : 'Catat Operasi Penertiban Baru'}
                </h3>
              </div>
              <button 
                onClick={() => setIsTrantibumModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTrantibumSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin text-xs">
              
              {/* Connected Ticket Summary Callout */}
              {trantibumForm.id_tiket && (
                <div className="bg-indigo-950/30 border border-indigo-500/25 p-3 rounded-xl space-y-1.5 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider">Aduan Warga Terhubung</span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-black uppercase tracking-wider border border-indigo-500/30">
                      Tiket: #{trantibumForm.id_tiket}
                    </span>
                  </div>
                  {(() => {
                    const report = delegatedReports.find(r => r.id_tiket === trantibumForm.id_tiket);
                    if (report) {
                      return (
                        <div className="space-y-1 text-slate-300">
                          <div className="font-bold text-[11px] text-slate-200">{report.kategori_masalah}</div>
                          <p className="text-[10px] text-slate-400 italic line-clamp-2">"{report.kronologi}"</p>
                          <div className="text-[9px] text-slate-500 flex justify-between pt-0.5">
                            <span>Pelapor: <strong className="text-slate-400">{report.nama_pelapor}</strong></span>
                            <span>Disposisi: <strong className="text-slate-400">{report.disposisi?.nama_admin}</strong></span>
                          </div>
                        </div>
                      );
                    }
                    return <span className="text-[10px] text-slate-400 italic font-medium">Terhubung ke tiket aduan warga, silakan lanjutkan pengisian.</span>;
                  })()}
                </div>
              )}

              {/* SECTION A: IDENTITAS PELAKU */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  A. Identitas Pelaku (By Name & By Gender)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Nama Pelaku <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      disabled={trantibumFormMode === 'view'}
                      placeholder="Masukkan Nama Lengkap Pelaku (Default: Tanpa Nama)"
                      value={trantibumForm.nama_pelaku}
                      onChange={(e) => setTrantibumForm(prev => ({ ...prev, nama_pelaku: e.target.value || 'Tanpa Nama' }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 font-semibold transition-all disabled:opacity-60"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Jenis Kelamin <span className="text-rose-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Laki-laki', 'Perempuan'].map(gender => (
                        <button
                          key={gender}
                          type="button"
                          disabled={trantibumFormMode === 'view'}
                          onClick={() => setTrantibumForm(prev => ({ ...prev, jenis_kelamin: gender }))}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                            trantibumForm.jenis_kelamin === gender
                              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-md'
                              : 'bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800 disabled:opacity-60 disabled:cursor-not-allowed'
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Alamat Asal Pelaku</label>
                  <input
                    type="text"
                    disabled={trantibumFormMode === 'view'}
                    placeholder="Contoh: Banjar Dinas Kelod, Desa Banjar, Kecamatan Banjar"
                    value={trantibumForm.alamat_asal}
                    onChange={(e) => setTrantibumForm(prev => ({ ...prev, alamat_asal: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* SECTION B: LEGALITAS & KTP */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  B. Aspek Hukum & Legalitas Identitas (KTP)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Status Kepemilikan KTP <span className="text-rose-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Ada', 'Tidak Ada'].map(status => (
                        <button
                          key={status}
                          type="button"
                          disabled={trantibumFormMode === 'view'}
                          onClick={() => setTrantibumForm(prev => ({ 
                            ...prev, 
                            status_identitas: status,
                            no_ktp: status === 'Tidak Ada' ? '-' : (prev.no_ktp === '-' ? '' : prev.no_ktp)
                          }))}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                            trantibumForm.status_identitas === status
                              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-md'
                              : 'bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800 disabled:opacity-60 disabled:cursor-not-allowed'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Nomor KTP (16 Digit NIK)</label>
                    <input
                      type="text"
                      maxLength={16}
                      disabled={trantibumForm.status_identitas === 'Tidak Ada' || trantibumFormMode === 'view'}
                      placeholder={trantibumForm.status_identitas === 'Tidak Ada' ? '-' : 'Masukkan 16 digit NIK'}
                      value={trantibumForm.status_identitas === 'Tidak Ada' ? '-' : trantibumForm.no_ktp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // keep numbers only
                        setTrantibumForm(prev => ({ ...prev, no_ktp: val }));
                      }}
                      className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-slate-200 outline-none transition-all ${
                        trantibumForm.status_identitas === 'Tidak Ada' 
                          ? 'border-slate-900 opacity-60 text-slate-500 cursor-not-allowed' 
                          : trantibumForm.no_ktp.length === 16 
                          ? 'border-emerald-500/50 focus:border-emerald-500 font-bold' 
                          : 'border-slate-850 focus:border-indigo-600'
                      }`}
                    />
                    {trantibumForm.status_identitas === 'Ada' && trantibumForm.no_ktp.length > 0 && trantibumForm.no_ktp.length !== 16 && (
                      <span className="text-[10px] text-amber-500 flex items-center gap-1 mt-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> NIK harus 16 digit angka (Saat ini: {trantibumForm.no_ktp.length})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION C: KLASIFIKASI MASALAH & MEDICAL */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  C. Klasifikasi Masalah Sosial & Rekam Medis (ODGJ)
                </span>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                    Kategori Masalah Sosial (Bisa Pilih Lebih Dari Satu) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['ODGJ', 'ODMK/Linglung', 'Pengamen (inc. Badut)', 'Gelandangan', 'Pengemis', 'Orang Terlantar', 'Anak Punk'].map(cat => {
                      const isSelected = trantibumForm.kategori_masalah?.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={trantibumFormMode === 'view'}
                          onClick={() => {
                            setTrantibumForm(prev => {
                              const current = prev.kategori_masalah || [];
                              if (current.includes(cat)) {
                                return { ...prev, kategori_masalah: current.filter(x => x !== cat) };
                              } else {
                                return { ...prev, kategori_masalah: [...current, cat] };
                              }
                            });
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                              : 'bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800 disabled:opacity-60 disabled:cursor-not-allowed'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Nomor Rekam Medis (Khusus ODGJ)</label>
                    <span className="text-[9px] text-slate-500 font-medium">Isi "Nihil" jika tidak ada</span>
                  </div>
                  <input
                    type="text"
                    disabled={trantibumFormMode === 'view'}
                    placeholder="Contoh: RM-2026-0045 (Default: Nihil)"
                    value={trantibumForm.no_rekam_medis}
                    onChange={(e) => setTrantibumForm(prev => ({ ...prev, no_rekam_medis: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 transition-all font-semibold disabled:opacity-60"
                  />
                  {trantibumForm.kategori_masalah?.includes('ODGJ') && trantibumForm.no_rekam_medis === 'Nihil' && (
                    <span className="text-[10px] text-amber-500/90 font-medium flex items-center gap-1 mt-1">
                      <Info className="w-3.5 h-3.5" /> ODGJ terdeteksi: Isi rekam medis jika memiliki riwayat rujukan RSUD/Klinik.
                    </span>
                  )}
                </div>
              </div>

              {/* SECTION D: LOKASI & PENANGANAN */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  D. Lokasi Operasi & Tindakan Penanganan Akhir
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Koneksi Tiket Aduan Warga</label>
                    <select
                      disabled={trantibumFormMode === 'view' || !!trantibumForm.id}
                      value={trantibumForm.id_tiket}
                      onChange={(e) => {
                        const ticketId = e.target.value;
                        if (!ticketId) {
                          setTrantibumForm(prev => ({
                            ...prev,
                            id_tiket: '',
                            selesaikan_aduan: false
                          }));
                          return;
                        }
                        const report = delegatedReports.find(r => r.id_tiket === ticketId);
                        if (report) {
                          // Auto pre-fill
                          let cats = [];
                          const lowerCategory = report.kategori_masalah.toLowerCase();
                          if (lowerCategory.includes('odgj')) cats.push('ODGJ');
                          else if (lowerCategory.includes('odmk') || lowerCategory.includes('linglung')) cats.push('ODMK/Linglung');
                          else if (lowerCategory.includes('pengamen') || lowerCategory.includes('badut')) cats.push('Pengamen (inc. Badut)');
                          else if (lowerCategory.includes('gelandangan') || lowerCategory.includes('gepeng')) cats.push('Gelandangan');
                          else if (lowerCategory.includes('pengemis')) cats.push('Pengemis');
                          else if (lowerCategory.includes('terlantar')) cats.push('Orang Terlantar');
                          else if (lowerCategory.includes('punk')) cats.push('Anak Punk');

                          setTrantibumForm(prev => ({
                            ...prev,
                            id_tiket: ticketId,
                            selesaikan_aduan: true,
                            kategori_masalah: cats,
                            lokasi_ditemukan: report.disposisi?.catatan || report.kronologi || '',
                            keterangan_penanganan: `Dilakukan operasi penertiban atas laporan aduan warga #${ticketId}. Pelaku diberikan pembinaan.`
                          }));
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 transition-all font-semibold disabled:opacity-60"
                    >
                      <option value="">Laporan Patroli Mandiri (Tanpa Tiket)</option>
                      {delegatedReports.map(report => (
                        <option key={report.id_tiket} value={report.id_tiket}>
                          [#{report.id_tiket}] {report.nama_pelapor} - {report.kategori_masalah}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Tanggal & Waktu Ditemukan <span className="text-rose-500">*</span></label>
                    <input
                      type="datetime-local"
                      disabled={trantibumFormMode === 'view'}
                      value={trantibumForm.tanggal_ditemukan}
                      onChange={(e) => setTrantibumForm(prev => ({ ...prev, tanggal_ditemukan: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-600 transition-all font-semibold disabled:opacity-60"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Lokasi Detail Ditemukan <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    disabled={trantibumFormMode === 'view'}
                    placeholder="Contoh: Perempatan TL Ahmad Yani - Jl. Dewi Sartika Singaraja"
                    value={trantibumForm.lokasi_ditemukan}
                    onChange={(e) => setTrantibumForm(prev => ({ ...prev, lokasi_ditemukan: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 transition-all font-semibold disabled:opacity-60"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Keterangan Tindakan Penanganan Akhir <span className="text-rose-500">*</span></label>
                  <textarea
                    disabled={trantibumFormMode === 'view'}
                    placeholder="Deskripsikan secara detail tindakan konkret (pembinaan tertulis, rujukan ke Dinsos, evakuasi ke UGD RSUD Buleleng, dll.)..."
                    value={trantibumForm.keterangan_penanganan}
                    onChange={(e) => setTrantibumForm(prev => ({ ...prev, keterangan_penanganan: e.target.value }))}
                    rows="3"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-600 transition-all disabled:opacity-60"
                    required
                  />
                </div>

                {trantibumForm.id_tiket && trantibumFormMode !== 'view' && (
                  <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl transition-all shadow-inner">
                    <input
                      type="checkbox"
                      id="trantibum_selesaikan_aduan_cb"
                      checked={trantibumForm.selesaikan_aduan}
                      onChange={(e) => setTrantibumForm(prev => ({ ...prev, selesaikan_aduan: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded bg-slate-950 border-slate-850 cursor-pointer focus:ring-emerald-500"
                    />
                    <label htmlFor="trantibum_selesaikan_aduan_cb" className="text-[11px] text-slate-300 font-black cursor-pointer uppercase tracking-wider flex items-center gap-1.5 select-none">
                      <Check className="w-4 h-4 text-emerald-400" /> Selesaikan aduan warga ini di database (Ubah Status ke Selesai)
                    </label>
                  </div>
                )}
              </div>

              {/* Actions Bottom */}
              <div className="border-t border-slate-850 pt-4 flex justify-end gap-2 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setIsTrantibumModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 font-bold transition-all cursor-pointer"
                >
                  {trantibumFormMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {trantibumFormMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-black text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> {trantibumFormMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Catatan Penertiban'}
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
