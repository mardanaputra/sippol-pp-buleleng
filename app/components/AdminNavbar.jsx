import React from 'react';
import Link from 'next/link';
import { RefreshCw, Moon, LogOut } from 'lucide-react';


export default function AdminNavbar({
  activePortal,
  onSubTabChange,
  onRefresh,
  loading,
  refreshText = "Refresh Portal"
}) {
  const handleDashboardClick = (e) => {
    if (activePortal === 'dashboard' || activePortal === 'disposisi') {
      e.preventDefault();
      if (onSubTabChange) onSubTabChange('dashboard');
    }
  };

  const handleDisposisiClick = (e) => {
    if (activePortal === 'dashboard' || activePortal === 'disposisi') {
      e.preventDefault();
      if (onSubTabChange) onSubTabChange('disposisi');
    }
  };

  const getLinkClass = (portalName) => {
    const isActive = activePortal === portalName;
    return `px-3.5 py-3.5 text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all outline-none border-b-2 ${isActive
        ? 'text-white border-[#E8D8C4] bg-white/10 font-black'
        : 'text-[#E8D8C4]/70 border-transparent hover:text-white hover:bg-white/5 font-bold'
      }`;
  };

  return (
    <nav className="bg-gradient-to-r from-[#561C24] via-[#6D2932] to-[#80424a] text-white shadow-lg fixed top-0 left-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">

        {/* Left Side: Brand Logo & Title & Links */}
        <div className="flex items-center space-x-1 shrink-0">
          <div className="flex items-center gap-2.5 pr-4 border-r border-white/15 mr-2 shrink-0 py-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-[#C7B7A3] p-0.5 flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src="/logo-satpolpp.png"
                alt="Logo Satpol PP"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left leading-none">
              <span className="font-black text-xs tracking-wider text-white block">
                SIPPOL PP
              </span>
              <span className="text-[8px] text-[#E8D8C4] tracking-widest font-bold uppercase mt-0.5 block">
                KAB. BULELENG
              </span>
            </div>
          </div>

          {/* Portal Warga */}
          <Link
            href="/"
            className="px-3 py-3.5 text-[11px] font-bold text-[#E8D8C4]/70 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider flex items-center gap-1.5 border-b-2 border-transparent"
            title="Kembali ke halaman utama warga"
          >
            Portal Warga
          </Link>

          {/* Dashboard */}
          <Link
            href="/admin/dashboard?tab=dashboard"
            onClick={handleDashboardClick}
            className={getLinkClass('dashboard')}
          >
            Dashboard
          </Link>

          {/* Disposisi */}
          <Link
            href="/admin/dashboard?tab=disposisi"
            onClick={handleDisposisiClick}
            className={getLinkClass('disposisi')}
          >
            Disposisi
          </Link>

          {/* Portal Trantib */}
          <Link
            href="/admin/trantib"
            className={getLinkClass('trantib')}
          >
            Portal Trantib
          </Link>

          {/* Portal Perada */}
          <Link
            href="/admin/perada"
            className={getLinkClass('perada')}
          >
            Portal Perada
          </Link>

          {/* Portal Linmas */}
          <Link
            href="/admin/linmas"
            className={getLinkClass('linmas')}
          >
            Portal Linmas
          </Link>

          {/* Portal SDA */}
          <Link
            href="/admin/sda"
            className={getLinkClass('sda')}
          >
            Portal SDA
          </Link>

          {/* Portal Kegiatan */}
          <Link
            href="/admin/kegiatan"
            className={getLinkClass('kegiatan')}
          >
            Portal Kegiatan
          </Link>
        </div>

        {/* Right Side: Refresh, Night Mode & Profile */}
        <div className="flex items-center gap-3 shrink-0 py-2.5">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-bold cursor-pointer active:scale-95 shadow-sm"
              type="button"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> {refreshText}
            </button>
          )}

          {/* Night Mode Button */}
          <button
            onClick={() => alert("Fitur Mode Malam akan segera hadir!")}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white border border-white/10 active:scale-95 cursor-pointer shadow-sm"
            title="Toggle Night Mode"
            type="button"
          >
            <Moon className="w-3.5 h-3.5 fill-white/10" />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin keluar dari portal admin?")) {
                localStorage.removeItem('isAdminLoggedIn');
                window.location.href = '/admin/login';
              }
            }}
            className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 rounded-xl transition-all text-rose-200 border border-rose-900/40 active:scale-95 cursor-pointer shadow-sm"
            title="Keluar (Logout)"
            type="button"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>


          {/* Mini Profile Card */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl border border-white/10 shadow-sm select-none">
            <div className="w-6 h-6 rounded-full bg-slate-200 border border-white/40 flex items-center justify-center text-slate-700 font-extrabold text-[9px] shadow-inner shrink-0">
              KB
            </div>
            <div className="text-left leading-none">
              <h4 className="text-[10px] font-black text-white tracking-wide">Buleleng</h4>
              <span className="text-[7px] text-[#E8D8C4] font-black uppercase tracking-wider mt-0.5 block">
                Admin
              </span>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
