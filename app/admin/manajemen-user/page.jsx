'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import AdminNavbar from '../../components/AdminNavbar';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  User,
  Key,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
  UserCheck
} from 'lucide-react';

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Role Protection States
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  // Activity Logs States
  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Password Requirements Checks
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasMixedCase && hasNumber && hasSymbol;

  // Matching check
  const passwordsMatch = password === passwordConfirmation;
  const showMatchError = passwordConfirmation.length > 0 && !passwordsMatch;

  // Disable submit check
  const isSubmitDisabled = 
    !name.trim() || 
    !username.trim() || 
    !email.trim() || 
    !password || 
    !isPasswordStrong || 
    !passwordsMatch || 
    submitLoading;

  // Fetch users list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/users', {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.users || []);
      } else {
        setError(data.message || 'Gagal memuat daftar user.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Terjadi kesalahan koneksi saat mengambil daftar user.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity logs list
  const fetchActivityLogs = async () => {
    setLogsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/activity-logs', {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActivityLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/admin/login';
      return;
    }

    let roleFound = null;
    try {
      const storedUser = JSON.parse(localStorage.getItem('adminUser'));
      if (storedUser && storedUser.role) {
        roleFound = storedUser.role;
        setUserRole(roleFound);
        if (roleFound === 'super_admin') {
          fetchUsers();
          fetchActivityLogs();
        } else {
          setCheckingRole(false);
        }
      }
    } catch (e) {
      console.error(e);
    }

    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/me', {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          setUserRole(data.user.role);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          if (data.user.role === 'super_admin' && roleFound !== 'super_admin') {
            fetchUsers();
            fetchActivityLogs();
          }
        } else {
          window.location.href = '/admin/login';
        }
      } catch (err) {
        console.error('Error checking user role:', err);
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSubmitDisabled) return;

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password,
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Akun admin baru berhasil didaftarkan.');
        // Reset form
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        // Re-fetch users and logs
        fetchUsers();
        fetchActivityLogs();
      } else {
        setError(data.message || 'Gagal mendaftarkan akun admin baru.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Gagal terhubung ke server.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun admin ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Akun admin berhasil dihapus.');
        fetchUsers();
        fetchActivityLogs();
      } else {
        setError(data.message || 'Gagal menghapus akun admin.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!confirm(`Apakah Anda yakin ingin mengubah hak akses pengguna ini menjadi ${newRole === 'super_admin' ? 'Super Admin' : 'Admin'}?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          role: newRole
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(`Berhasil mengubah hak akses user menjadi ${newRole}.`);
        fetchUsers();
        fetchActivityLogs();
      } else {
        setError(data.message || 'Gagal mengubah role admin.');
      }
    } catch (err) {
      console.error('Update role error:', err);
      setError('Terjadi kesalahan saat mengubah role.');
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'LOGIN':
        return <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 tracking-wider">LOGIN</span>;
      case 'TAMBAH_USER':
        return <span className="px-2 py-0.5 rounded text-[8px] font-black bg-sky-100 text-sky-800 border border-sky-200 tracking-wider">TAMBAH USER</span>;
      case 'HAPUS_USER':
        return <span className="px-2 py-0.5 rounded text-[8px] font-black bg-rose-100 text-rose-800 border border-rose-200 tracking-wider">HAPUS USER</span>;
      case 'UBAH_ROLE':
        return <span className="px-2 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-800 border border-amber-200 tracking-wider">UBAH ROLE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-800 border border-slate-200 tracking-wider">{action}</span>;
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-sans gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#561C24]" />
        <span className="text-xs font-bold uppercase tracking-wider">Memverifikasi Otorisasi...</span>
      </div>
    );
  }

  if (userRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans select-none relative overflow-x-hidden pt-[72px] flex flex-col justify-between">
        <AdminNavbar activePortal="manajemen-user" />
        <div className="flex-1 flex items-center justify-center px-6 my-10">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">403 - Akses Ditolak</h2>
            <p className="text-sm font-bold text-slate-500">
              Anda Tidak Memiliki Akses ke Halaman Ini.
            </p>
            <p className="text-xs text-slate-400">
              Hanya akun dengan hak akses Super Admin yang diperbolehkan masuk ke halaman manajemen user.
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-block mt-2 px-6 py-2.5 bg-[#561C24] hover:bg-[#6D2932] text-white text-xs font-black uppercase rounded-xl tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans select-none relative overflow-x-hidden pt-[72px] flex flex-col justify-between">
      
      {/* Horizontal Navbar */}
      <AdminNavbar activePortal="manajemen-user" />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8 space-y-6 flex-1">
        
        {/* Header Title */}
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-[#561C24]" /> MANAJEMEN USER & OTORISASI ADMIN
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
            Tambah Akun Admin Baru dan Atur Otorisasi Akses Internal SIPPOL-PP Kab. Buleleng
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-rose-50 border border-rose-250 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-800 shadow-sm animate-shake text-left">
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Gagal memproses request:</span>
              <p className="font-bold mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-800 shadow-sm text-left">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Operasi sukses:</span>
              <p className="font-bold mt-0.5">{success}</p>
            </div>
          </div>
        )}

        {/* Dual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left Column: Form Tambah Admin */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="text-left space-y-4">
              <h3 className="text-sm font-black text-[#561C24] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <UserPlus className="w-4 h-4" /> Tambah Akun Admin Baru
              </h3>
              
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap admin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#561C24] focus:ring-2 focus:ring-[#561C24]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Masukkan username unik"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#561C24] focus:ring-2 focus:ring-[#561C24]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="contoh: admin.baru@sippol.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#561C24] focus:ring-2 focus:ring-[#561C24]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#561C24] focus:ring-2 focus:ring-[#561C24]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Live Password Indicator Box */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5">
                  <span className="text-[9px] font-extrabold text-[#561C24] uppercase tracking-wider block">
                    Syarat Password Kominfo:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold text-slate-500">
                    <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle className="w-3 h-3 shrink-0" /> Min. 8 Karakter
                    </span>
                    <span className={`flex items-center gap-1 ${hasMixedCase ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle className="w-3 h-3 shrink-0" /> Huruf Besar & Kecil
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle className="w-3 h-3 shrink-0" /> Mengandung Angka
                    </span>
                    <span className={`flex items-center gap-1 ${hasSymbol ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle className="w-3 h-3 shrink-0" /> Mengandung Simbol
                    </span>
                  </div>
                </div>

                {/* Konfirmasi Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="Masukkan kembali password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#561C24] focus:ring-2 focus:ring-[#561C24]/10 transition-all"
                    />
                  </div>
                  {showMatchError && (
                    <span className="text-[10px] font-bold text-rose-600 block mt-1 animate-pulse">
                      * Konfirmasi password tidak cocok dengan password di atas!
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full mt-2 py-3 bg-[#561C24] hover:bg-[#6D2932] text-white text-xs font-black uppercase rounded-xl tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98] select-none text-center"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Mendaftarkan Admin...
                    </>
                  ) : (
                    <>
                      Daftarkan Admin <UserPlus className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Right Column: List Admin Aktif */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="text-left space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> Daftar Admin Aktif</span>
                <span className="text-[10px] font-extrabold text-[#561C24] bg-[#561C24]/10 px-2 py-0.5 rounded-full">{usersList.length} Akun</span>
              </h3>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-xs font-bold gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#561C24]" />
                  <span>Memuat daftar admin...</span>
                </div>
              ) : usersList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider w-8">No</th>
                        <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Nama</th>
                        <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Username</th>
                        <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Role</th>
                        <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right pr-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((user, idx) => (
                        <tr key={user.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 text-xs font-black text-slate-400">{idx + 1}</td>
                          <td className="py-3 pr-2 text-xs font-black text-slate-700 flex items-center gap-2">
                            <div className="w-6.5 h-6.5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-700 border border-slate-200 shadow-inner">
                              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <span>{user.name}</span>
                          </td>
                          <td className="py-3 text-xs font-bold text-slate-500">@{user.username}</td>
                          <td className="py-3 text-xs">
                            {user.role === 'super_admin' ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 shadow-sm inline-flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                                Super Admin
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
                                <User className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                Admin
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-xs text-right pr-2 space-x-1.5 whitespace-nowrap">
                            {user.username !== 'admin' ? (
                              <>
                                {user.role === 'super_admin' ? (
                                  <button
                                    onClick={() => handleUpdateRole(user.id, 'admin')}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border border-slate-300 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm inline-block"
                                  >
                                    Turunkan Jadi Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateRole(user.id, 'super_admin')}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 border border-amber-250 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm inline-block"
                                  >
                                    Jadikan Super Admin
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-250 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm inline-block"
                                >
                                  Hapus
                                </button>
                              </>
                            ) : (
                              <span className="text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider select-none pr-1 inline-block">
                                Super Utama
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 space-y-2">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold">Belum ada akun admin lain terdaftar.</p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Audit Trail Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeIn">
          <div className="text-left space-y-4">
            <h3 className="text-sm font-black text-[#561C24] uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="flex items-center gap-2">
                <Shield className="w-4.5 h-4.5" /> REKAM JEJAK / LOG AKTIVITAS SISTEM
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Audit Trail
              </span>
            </h3>

            {logsLoading ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400 text-xs font-bold gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#561C24]" />
                <span>Memuat log aktivitas...</span>
              </div>
            ) : activityLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider w-40">Waktu/Tanggal</th>
                      <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider w-44">Nama Admin</th>
                      <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider w-36">Aksi</th>
                      <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Keterangan</th>
                      <th className="py-2.5 text-[10px] font-black uppercase text-slate-400 tracking-wider w-32">Alamat IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log, idx) => (
                      <tr key={log.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                          {log.created_at ? new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                        </td>
                        <td className="py-3 text-xs font-black text-slate-700 pr-2">
                          {log.user ? (
                            <div className="flex items-center gap-1.5">
                              <span>{log.user.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold font-mono">@{log.user.username}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-extrabold italic">Sistem</span>
                          )}
                        </td>
                        <td className="py-3 text-xs">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="py-3 text-xs font-semibold text-slate-600 leading-relaxed break-words pr-2">
                          {log.description}
                        </td>
                        <td className="py-3 text-[10px] font-mono font-bold text-slate-500">
                          {log.ip_address || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-14 text-slate-400 space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold">Tidak ada rekam jejak aktivitas tercatat.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
