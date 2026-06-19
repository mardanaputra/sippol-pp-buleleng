import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Shield, Globe, MessageCircle } from 'lucide-react';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.1a4.85 4.85 0 0 1-1.01-.41z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);

const socialLinks = [
  {
    icon: <FacebookIcon />,
    label: 'Facebook',
    href: 'https://www.facebook.com/satpolppbuleleng',
    hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
  {
    icon: <InstagramIcon />,
    label: 'Instagram',
    href: 'https://www.instagram.com/satpolppbuleleng',
    hoverClass: 'hover:bg-[#E1306C] hover:border-[#E1306C]',
  },
  {
    icon: <TikTokIcon />,
    label: 'TikTok',
    href: 'https://www.tiktok.com/@satpolppbuleleng',
    hoverClass: 'hover:bg-black hover:border-black',
  },
  {
    icon: <YouTubeIcon />,
    label: 'YouTube',
    href: 'https://www.youtube.com/@satpolppbuleleng',
    hoverClass: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#561C24] mt-12 relative z-10 text-white shadow-inner border-t border-[#3d1015]">

      {/* Molded Orange Accent Line at Top */}
      <div className="w-full h-1.5 bg-[#C7B7A3] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">

          {/* Column 1: SATPOL PP BRANDING + SOCIAL MEDIA */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100/50 p-1 overflow-hidden">
                <img src="/logo-satpolpp.png" alt="Logo Satpol PP" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-black text-base md:text-lg tracking-wider text-white leading-none">
                  SATPOL PP
                </h4>
                <p className="text-[10px] text-[#E8D8C4]/80 font-bold uppercase tracking-widest mt-1.5">
                  KABUPATEN BULELENG
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-200/90 font-medium leading-relaxed">
              Pusat layanan informasi dan pengaduan masyarakat terpadu untuk mewujudkan ketertiban umum dan ketenteraman masyarakat di wilayah Buleleng.
            </p>

            {/* Social Media */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E8D8C4]/80 mb-3">
                Ikuti Kami
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white transition-all duration-300 ${social.hoverClass} hover:scale-110 hover:shadow-md cursor-pointer`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: MENU LAYANAN */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-white mb-5 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-[2px] after:bg-[#C7B7A3] after:rounded-full">
              MENU LAYANAN
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pengaduan"
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3] shrink-0" />
                  Form Pengaduan Publik
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3] shrink-0" />
                  Lacak Status Tiket
                </Link>
              </li>
              <li>
                <Link
                  href="/#pustaka"
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3] shrink-0" />
                  Regulasi Perda &amp; Perkada
                </Link>
              </li>
              <li>
                <a
                  href="https://satpolpp.bulelengkab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7B7A3] shrink-0" />
                  Website Resmi Satpol PP
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: KONTAK KAMI */}
          <div className="md:col-span-5 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-widest text-white mb-5 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-[2px] after:bg-[#C7B7A3] after:rounded-full">
              KONTAK KAMI
            </h5>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <div className="p-2 bg-slate-800/40 rounded-xl border border-white/10 mt-0.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-slate-200 font-bold leading-relaxed">
                  Jalan Pahlawan No. 1, Singaraja<br />
                  Kabupaten Buleleng, Bali
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-slate-800/40 rounded-xl border border-white/10 shrink-0">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-slate-200 font-bold">(0362) 21146</span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-slate-800/40 rounded-xl border border-white/10 shrink-0">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <a
                  href="mailto:satpolpp@bulelengkab.go.id"
                  className="text-xs text-slate-200 hover:text-white font-bold transition-all cursor-pointer"
                >
                  satpolpp@bulelengkab.go.id
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-[#25D366]/20 rounded-xl border border-[#25D366]/30 shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
                <a
                  href="https://wa.me/6285100000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:text-white font-bold transition-all cursor-pointer"
                >
                  WhatsApp Satpol PP
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <div className="p-2 bg-slate-800/40 rounded-xl border border-white/10 shrink-0">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                <a
                  href="https://satpolpp.bulelengkab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-200 hover:text-white font-bold transition-all cursor-pointer"
                >
                  satpolpp.bulelengkab.go.id
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10 my-8" />

        {/* Bottom copyright section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-medium text-center sm:text-left leading-normal">
            &copy; {new Date().getFullYear()} Pemerintah Kabupaten Buleleng - Satuan Polisi Pamong Praja. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors cursor-pointer">
              Kebijakan Privasi
            </span>
            <span className="text-[10px] text-slate-400 hover:text-white font-bold transition-colors cursor-pointer">
              Syarat Ketentuan
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
}
