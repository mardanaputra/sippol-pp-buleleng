'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, Shield, LogOut, ClipboardList, Users, MapPin, AlertTriangle, FileText } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';

// Create Context to bridge sub-page states with global layouts
export const AdminLayoutContext = createContext({
  activePortal: '',
  setActivePortal: () => {},
  onRefresh: null,
  setOnRefresh: () => {},
  loading: false,
  setLoading: () => {},
  refreshText: 'Refresh Portal',
  setRefreshText: () => {},
  currentSubTab: 'dashboard',
  setCurrentSubTab: () => {},
});

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Layout states to be populated dynamically by page.jsx components
  const [activePortal, setActivePortal] = useState('');
  const [onRefresh, setOnRefresh] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshText, setRefreshText] = useState('Refresh Portal');
  const [currentSubTab, setCurrentSubTab] = useState('dashboard');

  useEffect(() => {
    // If it's the login page, bypass authorization check
    if (pathname === '/admin/login') {
      setAuthorized(true);
      return;
    }

    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari portal admin?")) {
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('rememberAdmin');
      document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'isAdminLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/admin/login';
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#1A0608] flex items-center justify-center text-white font-sans select-none">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-black tracking-widest uppercase text-rose-450">Memeriksa Otorisasi...</span>
        </div>
      </div>
    );
  }

  // Render children raw on Login page without layout structures
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminLayoutContext.Provider
      value={{
        activePortal,
        setActivePortal,
        onRefresh,
        setOnRefresh,
        loading,
        setLoading,
        refreshText,
        setRefreshText,
        currentSubTab,
        setCurrentSubTab,
      }}
    >
      <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden flex flex-col justify-between">
        
        {/* Top Navigation Bar */}
        <AdminNavbar
          activePortal={activePortal}
          onSubTabChange={(subTab) => {
            setCurrentSubTab(subTab);
            if (pathname !== '/admin/dashboard') {
              router.push(`/admin/dashboard?tab=${subTab}`);
            } else {
              window.history.pushState(null, '', `/admin/dashboard?tab=${subTab}`);
              // Dispatch popstate event manually to trigger listeners inside page
              window.dispatchEvent(new Event('popstate'));
            }
          }}
          onRefresh={onRefresh}
          loading={loading}
          refreshText={refreshText}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />

        {/* Sidebar Navigation Panel & Backdrop Overlay */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Drawer */}
          <aside className={`absolute top-0 left-0 h-full w-72 bg-[#561C24] text-white shadow-2xl border-r border-[#6D2932] flex flex-col transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            
            {/* Sidebar Header */}
            <div className="p-5 border-b border-[#6D2932] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white border border-[#C7B7A3] p-0.5 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
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
                  <span className="text-[8px] text-[#E8D8C4] tracking-widest font-black uppercase mt-0.5 block">
                    KAB. BULELENG
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-white/80 hover:text-white"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Options */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-none">
              <Link
                href="/"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider"
              >
                <Shield className="w-4 h-4 text-[#E8D8C4]" /> Portal Warga
              </Link>

              <hr className="border-[#6D2932] my-2" />

              <Link
                href="/admin/dashboard?tab=dashboard"
                onClick={() => {
                  setIsSidebarOpen(false);
                  setCurrentSubTab('dashboard');
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'dashboard'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-[#E8D8C4]" /> Dashboard
              </Link>

              <Link
                href="/admin/dashboard?tab=disposisi"
                onClick={() => {
                  setIsSidebarOpen(false);
                  setCurrentSubTab('disposisi');
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'disposisi'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-[#E8D8C4]" /> Disposisi
              </Link>

              <Link
                href="/admin/trantib"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'trantib'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-[#E8D8C4]" /> Portal Trantib
              </Link>

              <Link
                href="/admin/perada"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'perada'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-[#E8D8C4]" /> Portal Perada
              </Link>

              <Link
                href="/admin/linmas"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'linmas'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-[#E8D8C4]" /> Portal Linmas
              </Link>

              <Link
                href="/admin/sda"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'sda'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#E8D8C4]" /> Portal SDA
              </Link>

              <Link
                href="/admin/kegiatan"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'kegiatan'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-[#E8D8C4]" /> Portal Kegiatan
              </Link>

              <Link
                href="/admin/manajemen-user"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activePortal === 'manajemen-user'
                    ? 'bg-white/10 text-white font-black border-l-4 border-[#E8D8C4]'
                    : 'text-[#E8D8C4]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-[#E8D8C4]" /> Manajemen User
              </Link>
            </nav>

            {/* Sidebar Footer Log Out Button */}
            <div className="p-4 border-t border-[#6D2932] bg-[#431319]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-700/80 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </aside>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col pt-[57px] print:pt-0">
          {children}
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
