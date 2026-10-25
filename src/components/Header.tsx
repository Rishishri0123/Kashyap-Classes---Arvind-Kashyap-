import React, { useState } from 'react';
import { Menu, X, Download, Check, BookOpen, Code2, Sparkles, Layers, Calendar, Award, UserCheck, HelpCircle, FileText, ChevronRight, MapPin } from 'lucide-react';
import { generateAndDownloadBrochure } from '../utils/brochureDownload';

interface HeaderProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navLinks = [
    { label: 'Class 12 Notes', href: '#class12-notes', icon: FileText, highlight: true },
    { label: 'Programs', href: '#courses', icon: Layers },
    { label: 'Schedules', href: '#schedules', icon: Calendar },
    { label: 'NCERT Books', href: '#ncert-books', icon: BookOpen },
    { label: 'Class 12 Lab', href: '#concept-lab', icon: Sparkles },
    { label: 'Center Map', href: '#location-map', icon: MapPin },
    { label: 'About Sir', href: '#about-sir', icon: Award },
    { label: 'Inquiry', href: '#enrollment', icon: HelpCircle },
  ];

  const handleBrochureDownload = () => {
    setDownloading(true);
    generateAndDownloadBrochure();
    setTimeout(() => {
      setDownloading(false);
    }, 2500);
  };

  // Lock body scroll when mobile menu is open so users can scroll inside menu smoothly
  React.useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-300 shadow-md">
      {/* Top Announcement Bar - Clean Light Theme */}
      <div className="bg-blue-50/90 text-slate-800 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-blue-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0 shadow-xs">
              Session 2026–27
            </span>
            <span className="truncate text-slate-900 font-bold text-[11px] sm:text-xs">
              Admissions Open for Class 11, 12, JEE & NEET · Shastri Nagar, Ghaziabad
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Developer Credit Tag */}
            <div className="flex items-center gap-1.5 bg-white border border-blue-200 px-2 py-0.5 rounded-md text-[10px] sm:text-xs text-blue-900 font-bold shadow-xs whitespace-nowrap">
              <Code2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Developed by Rishi Shrivastav</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-18">
          
          {/* Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
            aria-label="Kashyap Classes Home"
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-950 text-amber-400 font-black flex items-center justify-center text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform border border-blue-900 shrink-0">
              KC
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-slate-950 tracking-tight font-heading leading-tight text-base sm:text-lg truncate">
                Kashyap Classes
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-amber-700 tracking-wider uppercase leading-none">
                Premier Physics by Arvind Kashyap
              </span>
            </div>
          </a>

          {/* Desktop & Laptop Navigation Links - Clearly Visible Buttons on large screens */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-extrabold shadow-2xs transition-all active:scale-95 whitespace-nowrap ${
                  link.highlight
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 border-2 border-amber-500 shadow-xs'
                    : 'text-slate-900 bg-slate-100 hover:bg-blue-950 hover:text-white border border-slate-300 hover:border-blue-950'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Area: Download Brochure & Highly Visible Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Download Brochure Button */}
            <button
              onClick={handleBrochureDownload}
              disabled={downloading}
              className="px-2.5 sm:px-3 py-2 text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer shrink-0"
              title="Download Syllabus Outline & Brochure"
            >
              {downloading ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline font-bold">Downloading...</span>
                  <span className="sm:hidden font-bold">PDF</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="hidden sm:inline font-bold">Brochure</span>
                  <span className="sm:hidden font-bold">PDF</span>
                </>
              )}
            </button>

            {/* Highly Visible Menu Toggle Button - Prominent Amber/Dark Button with Unmistakable Label & Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-black border-2 ${
                mobileMenuOpen
                  ? 'bg-slate-950 text-amber-400 border-amber-400 ring-2 ring-amber-400/50'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 ring-2 ring-amber-400/60'
              }`}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-4 h-4 stroke-[3] text-amber-400 shrink-0" />
                  <span className="uppercase tracking-wider text-xs font-black">Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 stroke-[3] text-slate-950 shrink-0" />
                  <span className="uppercase tracking-wider text-xs font-black text-slate-950">Menu</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu - Clean Light Theme & Scrollable */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white text-slate-900 border-t-2 border-amber-400 px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-fade-in max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain touch-pan-y">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Navigation Menu</span>
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-900 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between group active:scale-98 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-900 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition-all" />
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBrochureDownload();
              }}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors active:scale-98"
            >
              <Download className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Download Official Course Brochure (PDF)</span>
            </button>

            {/* Developer Attribution in Mobile Menu */}
            <div className="text-center pt-2 text-xs text-slate-600 font-medium flex items-center justify-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Website Developed & Created by <strong className="text-slate-900 font-bold">Rishi Shrivastav</strong></span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
