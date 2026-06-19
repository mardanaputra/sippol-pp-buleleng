'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

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

  return <>{children}</>;
}
