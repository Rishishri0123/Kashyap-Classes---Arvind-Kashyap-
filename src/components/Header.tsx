import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Download,
  Check,
  BookOpen,
  Code2,
  Sparkles,
  Layers,
  Calendar,
  Award,
  HelpCircle,
  FileText,
  ChevronRight,
  ChevronDown,
  MapPin,
  Share2,
  Home,
  LogIn,
  LogOut,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { generateAndDownloadBrochure } from '../utils/brochureDownload';
import { useAuth } from '../context/AuthContext';
import { NOTE_SECTIONS } from '../types/notesStore';

interface HeaderProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInquiry }) => {
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notesMenuOpen, setNotesMenuOpen] = useState(false);
  const [mobileNotesExpanded, setMobileNotesExpanded] = useState(false);
  const [drawerTopPx, setDrawerTopPx] = useState(96);
  const headerRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  const navLinks = [
    { label: 'Programs', to: '/programs', icon: Layers },
    { label: 'Schedules', to: '/schedules', icon: Calendar },
    { label: 'NCERT Hub', to: '/ncert', icon: BookOpen },
    { label: 'Concept Lab', to: '/lab', icon: Sparkles },
    { label: 'Center Map', to: '/location', icon: MapPin },
    { label: 'About Sir', to: '/about', icon: Award },
    { label: 'Inquiry', to: '/inquiry', icon: HelpCircle },
  ];

  const isNotesRoute = pathname.startsWith('/notes');

  // Automatically close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotesMenuOpen(false);
    setMobileNotesExpanded(false);
  }, [pathname]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: 'Kashyap Classes - Premier Physics by Arvind Kashyap',
      text: 'Official website of Kashyap Classes (Shastri Nagar, Ghaziabad). Concept · Practice · Success. Physics for JEE, NEET & Boards.',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      //
    }
  };

  const handleBrochureDownload = () => {
    setDownloading(true);
    generateAndDownloadBrochure();
    setTimeout(() => {
      setDownloading(false);
    }, 2500);
  };

  // Track scroll position to elevate sticky header shadow cleanly
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Toggle mobile drawer with exact current header bottom offset so it opens right where the user is
  const handleToggleMobileMenu = () => {
    if (!mobileMenuOpen && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setDrawerTopPx(Math.max(0, Math.round(rect.bottom)));
    }
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-shadow duration-200 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-slate-300 shadow-md'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      {/* Top Announcement Bar - Rich Navy & Electric Orange from Logo */}
      <div className="bg-[#0c2340] text-slate-100 text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#071527]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-[#ff6600] text-white font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 shadow-xs animate-pulse-subtle">
              Session 2026–27
            </span>
            <span className="truncate font-medium text-slate-200">
              Admissions Open · Class 11, Class 12 & JEE Physics Notes Storefront Live
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <Link
                to="/admin"
                className="text-[11px] font-black text-amber-300 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>Admin Panel</span>
              </Link>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-[11px] font-medium">
              <Code2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
              <span>
                Developed by <strong className="text-white font-bold">Rishi Shrivastav</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-18">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
            aria-label="Kashyap Classes Home"
          >
            <img
              src="/assets/aistudio/kashyap_classes_logo.png"
              alt="Kashyap Classes Official Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain border border-slate-200 bg-white p-0.5 shadow-xs group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-black text-base sm:text-lg leading-tight tracking-tight truncate">
                <span className="text-[#0c2340]">Kashyap</span>{' '}
                <span className="text-[#ff6600]">Classes</span>
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[9.5px] font-bold text-slate-600 tracking-wider uppercase leading-none mt-0.5">
                <span className="text-[#0c2340]">Concept</span>
                <span className="text-[#ff6600]">|</span>
                <span className="text-[#0c2340]">Practice</span>
                <span className="text-[#ff6600]">|</span>
                <span className="text-[#0c2340]">Success</span>
              </span>
            </div>
          </Link>

          {/* Zone 2: Desktop Navigation Links */}
          <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center gap-4 xl:gap-6">
            {/* Three-Section Notes Store Dropdown + Direct Link */}
            <div
              className="relative"
              onMouseEnter={() => setNotesMenuOpen(true)}
              onMouseLeave={() => setNotesMenuOpen(false)}
            >
              <Link
                to="/notes"
                className={`text-sm font-extrabold py-1 relative inline-flex items-center gap-1 whitespace-nowrap transition-all ${
                  isNotesRoute ? 'text-[#ff6600]' : 'text-[#ff6600] hover:text-[#ea580c]'
                }`}
              >
                <span>Physics Notes</span>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="absolute bottom-0 left-0 h-0.5 bg-[#ff6600] w-full" />
              </Link>

              {notesMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-2 space-y-1">
                    {NOTE_SECTIONS.map((sec) => (
                      <Link
                        key={sec.id}
                        to={sec.routeSlug}
                        className="block px-3 py-2.5 rounded-xl hover:bg-[#fff7f0] transition-colors group"
                      >
                        <div className="text-xs font-black text-[#0c2340] group-hover:text-[#ff6600]">
                          {sec.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {sec.tagline}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-bold transition-all duration-200 py-1 relative group/link whitespace-nowrap hover:-translate-y-0.5 ${
                    isActive
                      ? 'text-[#ff6600] font-extrabold'
                      : 'text-slate-700 hover:text-[#0c2340]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                        isActive ? 'bg-[#ff6600] w-full' : 'bg-[#ff6600] w-0 group-hover/link:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Action CTAs + Compact Account Login Beside Three-Line Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Download Brochure (Desktop/Tablet) */}
            <button
              onClick={handleBrochureDownload}
              disabled={downloading}
              className="hidden xl:inline-flex px-3 py-2 text-xs font-bold text-[#0c2340] bg-[#f0f5fa] hover:bg-[#e4edf7] border border-blue-200 rounded-xl transition-all items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer shrink-0"
              title="Download Course Brochure PDF"
            >
              {downloading ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <span>Brochure</span>
                </>
              )}
            </button>

            {/* Primary Action Button: Book Free Trial */}
            <button
              onClick={() => onOpenInquiry('Free 2-Hour Live Physics Trial Class')}
              className="hidden md:inline-flex px-3.5 py-2 text-xs font-black text-white bg-[#ff6600] hover:bg-[#ea580c] rounded-xl shadow-kc-orange border border-[#ff771a] transition-all active:scale-95 cursor-pointer shrink-0 items-center gap-1.5 hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white fill-current" />
              <span>Book Trial</span>
            </button>

            {/* Compact Firebase Account Login Button (Placed beside the 3-line menu) */}
            {user ? (
              <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5 shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#0c2340] text-white flex items-center justify-center shrink-0">
                  <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#0c2340] max-w-[68px] sm:max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="p-0.5 sm:p-1 text-slate-500 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('Sign in to access your Physics Notes library.')}
                className="inline-flex px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold text-[#0c2340] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
                title="Account Login"
              >
                <LogIn className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile / Tablet Three-Line Menu Button */}
            <button
              onClick={handleToggleMobileMenu}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#ff6600] hover:bg-[#ea580c] text-white border border-[#e55300] shadow-sm active:scale-90 transition-transform duration-100 cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2.5] text-white" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2.5] text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Drawer Menu — Instant viewport-fixed overlay right below header */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-[60] flex flex-col"
          style={{ top: `${drawerTopPx}px` }}
        >
          {/* Dimmed backdrop to tap-close outside */}
          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative bg-white text-slate-900 border-t-2 border-[#ff6600] px-4 pt-3 pb-7 space-y-3 shadow-2xl max-h-full overflow-y-auto overscroll-contain">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5 pt-0.5">
            <span>Navigation Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-slate-900 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Collapsible "Notes" Section holding all 3 Physics Notes sections */}
            <div className="sm:col-span-2 rounded-xl border border-[#fed7aa] bg-[#fff7f0]/75 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileNotesExpanded((prev) => !prev)}
                aria-expanded={mobileNotesExpanded}
                className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-[#ffedd5]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#fed7aa] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#ff6600]" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#0c2340] block leading-tight">
                      Notes
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Class 11, Class 12 &amp; JEE Physics Notes
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#ff6600] transition-transform duration-200 ${
                    mobileNotesExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileNotesExpanded && (
                <div className="px-2.5 pb-2.5 pt-1 space-y-1.5 border-t border-[#fed7aa]/70 bg-white/80">
                  {NOTE_SECTIONS.map((sec) => (
                    <NavLink
                      key={sec.id}
                      to={sec.routeSlug}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-[#ff6600] text-white border-[#ff6600]'
                            : 'bg-white text-[#0c2340] border-slate-200 hover:border-[#ff6600]'
                        }`
                      }
                    >
                      <span>{sec.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-50 text-[#0c2340] border-blue-300 font-extrabold shadow-2xs'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-900 border-slate-200 font-bold'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-[#0c2340]" />
                </div>
                <span className="text-sm">Home Overview</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                      isActive
                        ? 'bg-[#fff7f0] text-[#ff6600] border-[#fed7aa] font-extrabold shadow-2xs'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-900 border-slate-200 font-bold'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#0c2340]" />
                    </div>
                    <span className="text-sm">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </NavLink>
              );
            })}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'bg-[#0c2340] text-white border-[#0c2340] font-extrabold shadow-2xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-[#0c2340] border-amber-200 font-bold'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-amber-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#ff6600]" />
                  </div>
                  <span className="text-sm">Admin Studio</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            )}
          </div>

          {/* Compact Bottom Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBrochureDownload();
              }}
              className="py-2.5 px-2 bg-[#f0f5fa] hover:bg-[#e4edf7] text-[#0c2340] border border-blue-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
              <span className="truncate">Brochure PDF</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleShare();
              }}
              className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="truncate">Share Page</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5 border-t border-slate-100">
            <Code2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
            <span>
              Engineered & Developed by <strong className="text-slate-800 font-bold">Rishi Shrivastav</strong>
            </span>
          </div>
          </div>
        </div>
      )}
    </>
  );
};
