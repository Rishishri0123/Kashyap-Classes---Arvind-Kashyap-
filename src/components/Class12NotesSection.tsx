import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  User,
  Phone,
  Mail,
  GraduationCap,
  Target,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CLASS_12_NOTES_DATA, Class12Note } from '../data/class12Notes';

interface UserUnlockData {
  fullName: string;
  studentClass: string;
  phone: string;
  email: string;
  targetExam: string;
  unlockedAt: string;
}

export const Class12NotesSection: React.FC = () => {
  const [unlockedUser, setUnlockedUser] = useState<UserUnlockData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoteForAction, setSelectedNoteForAction] = useState<Class12Note | null>(null);
  const [previewNote, setPreviewNote] = useState<Class12Note | null>(null);

  // Form fields for unlocking notes
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('Class 12');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetExam, setTargetExam] = useState('CBSE Class 12 Board 95%+ Focus');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Part 1' | 'Part 2'>('All');

  // Load unlocked user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kc_unlocked_notes_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.fullName && parsed?.phone) {
          setUnlockedUser(parsed);
          setFullName(parsed.fullName);
          setPhone(parsed.phone);
          setEmail(parsed.email || '');
          setStudentClass(parsed.studentClass || 'Class 12');
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Prevent background body scroll when any modal is open
  useEffect(() => {
    if (modalOpen || previewNote) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [modalOpen, previewNote]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    const userProfile: UserUnlockData = {
      fullName: fullName.trim(),
      studentClass,
      phone: cleanPhone,
      email: email.trim(),
      targetExam,
      unlockedAt: new Date().toISOString(),
    };

    try {
      // Save locally so user never has to enter again
      localStorage.setItem('kc_unlocked_notes_user', JSON.stringify(userProfile));
      setUnlockedUser(userProfile);

      // Send lead to server
      await fetch('/api/notes-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userProfile,
          chapterRequested: selectedNoteForAction ? selectedNoteForAction.title : 'All Class 12 Notes',
        }),
      }).catch(() => {
        // Fallback silently if offline or server endpoint is busy
      });

      setModalOpen(false);
      setIsSubmitting(false);

      // If user had clicked a specific note to download or preview, fulfill that action
      if (selectedNoteForAction) {
        handleDownloadPdf(selectedNoteForAction);
        setSelectedNoteForAction(null);
      }
    } catch {
      setIsSubmitting(false);
      setModalOpen(false);
      setUnlockedUser(userProfile);
    }
  };

  const handleNoteAction = (note: Class12Note, action: 'preview' | 'download') => {
    if (!unlockedUser) {
      setSelectedNoteForAction(note);
      setModalOpen(true);
      return;
    }

    if (action === 'preview') {
      setPreviewNote(note);
    } else {
      handleDownloadPdf(note);
    }
  };

  const handleDownloadPdf = (note: Class12Note) => {
    const link = document.createElement('a');
    link.href = note.pdfPath;
    link.download = `Class_12_Physics_Ch_${note.chapterNumber}_${note.title.replace(/\s+/g, '_')}_Kashyap_Sir.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessToast(`Downloading Chapter ${note.chapterNumber}: ${note.title}`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  const handleDownloadAll = () => {
    if (!unlockedUser) {
      setSelectedNoteForAction(null);
      setModalOpen(true);
      return;
    }

    // Trigger sequential download of the files
    CLASS_12_NOTES_DATA.slice(0, 3).forEach((note, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = note.pdfPath;
        link.download = `Class_12_Physics_Ch_${note.chapterNumber}_${note.title.replace(/\s+/g, '_')}_Kashyap_Sir.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 800);
    });

    setDownloadSuccessToast('Downloading first 3 chapters. Click individual chapters below to download any specific note.');
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 5000);
  };

  // Filter notes based on tab and search
  const filteredNotes = CLASS_12_NOTES_DATA.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topicsCovered.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      note.keyDerivations.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'Part 1') {
      return note.chapterNumber <= 8;
    }
    if (activeTab === 'Part 2') {
      return note.chapterNumber >= 9;
    }
    return true;
  });

  return (
    <section id="class12-notes" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Class 12 Physics · 100% Free Master Study Notes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-heading tracking-tight mb-4">
            Official Class 12 Physics Handwritten Notes
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            Authored personally by <strong className="text-blue-950 font-bold">Arvind Kashyap (Kashyap Sir)</strong>. All 14 complete NCERT chapters featuring exhaustive step-by-step derivations, crystal-clear conceptual diagrams, formulae cheatsheets, and CBSE Board PYQ archives.
          </p>
        </div>

        {/* Unlocked / Locked Status Banner */}
        <div className="mb-8">
          {unlockedUser ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Unlock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                      VIP Access Active
                    </span>
                    <span className="text-xs text-emerald-800 font-bold">
                      Unlocked for {unlockedUser.fullName} ({unlockedUser.studentClass})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                    All 14 Class 12 Physics PDFs are ready for instant high-speed download and in-browser reading.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDownloadAll}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Notes Pack</span>
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  title="Update your details"
                >
                  Edit Info
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-blue-800">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded shadow-xs tracking-wider">
                    Instant Free Unlock
                  </span>
                  <span className="text-xs text-blue-200 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    Enter student details to unlock all 14 chapters
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                  Get Unlimited Access to Arvind Kashyap Sir’s Handwritten Notes
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
                  Provide your name, class, and contact number once to unlock direct PDF downloads for all 14 Class 12 Physics chapters (over 280+ pages of high-yield exam material).
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedNoteForAction(null);
                  setModalOpen(true);
                }}
                className="w-full md:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Unlock className="w-4 h-4 text-slate-950" />
                <span>Unlock All 14 Chapter Notes</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Part Filter Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-8">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-300 shadow-2xs overflow-x-auto">
            {(['All', 'Part 1', 'Part 2'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {tab === 'All'
                  ? 'All 14 Chapters'
                  : tab === 'Part 1'
                  ? 'Part 1: Electromagnetism (Ch 1-8)'
                  : 'Part 2: Optics & Modern Physics (Ch 9-14)'}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chapter, derivation (e.g. Gauss, Optics, AC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => {
            const isUnlocked = !!unlockedUser;

            return (
              <div
                key={note.id}
                className="card-hover-lift bg-white border-2 border-slate-200 hover:border-blue-900/60 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-950 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                      Ch {note.chapterNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      {note.pageCount} Pages · {note.part.split(':')[0]}
                    </span>
                  </div>

                  {/* Title & Unit */}
                  <h3 className="text-lg font-black text-slate-950 font-heading group-hover:text-blue-950 transition-colors leading-snug mb-1">
                    {note.title}
                  </h3>
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
                    {note.unit}
                  </div>

                  {/* High-yield badge */}
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold mb-3.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{note.badge}</span>
                  </div>

                  {/* Key Derivations preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 space-y-1.5">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Core Derivations & Topics:
                    </div>
                    <ul className="text-xs text-slate-700 font-medium space-y-1">
                      {note.keyDerivations.slice(0, 3).map((d, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-mono text-[11px] text-blue-950">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span className="truncate">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Author tag */}
                  <div className="text-[11px] text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Prepared by <strong>{note.author}</strong></span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNoteAction(note, 'preview')}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleNoteAction(note, 'download')}
                    className={`py-2.5 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                      isUnlocked
                        ? 'bg-blue-950 hover:bg-blue-900 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-950" />
                        <span>Unlock & Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200 p-8 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">No matching chapter notes found</h4>
            <p className="text-xs text-slate-600 mb-4">
              Try adjusting your search query or switch back to the "All 14 Chapters" view.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('All');
              }}
              className="px-4 py-2 bg-blue-950 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Unlock Details Modal (Lead Gating Barrier) - Guaranteed Scrollable */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm flex min-h-full items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-slate-300 animate-scale-in my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 sm:p-6 relative shrink-0 border-b border-blue-900/50">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 pr-8">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
                  Class 12 Physics Notes
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  100% Free · No Payment Required
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white pr-6">
                Unlock Complete 14-Chapter Master Notes
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 font-normal leading-relaxed pr-6">
                Enter your student details once to unlock instant PDF downloads and in-browser preview for all 14 Class 12 chapters by Arvind Kashyap Sir.
              </p>
            </div>

            {/* Modal Form with Dedicated Vertical Scrollbar */}
            <form onSubmit={handleUnlockSubmit} className="overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4 max-h-[calc(100vh-11rem)]">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Student Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  <span>Student Full Name <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Malhotra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
                />
              </div>

              {/* Class Selection - Strictly Class 12 & Droppers/Class 11 (NO Class 10) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-900" />
                  <span>Current Class / Grade <span className="text-red-500">*</span></span>
                </label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
                >
                  <option value="Class 12">Class 12 (Board Exam 2026 Aspirant)</option>
                  <option value="Class 12 Passed (Dropper / Repeater)">Class 12 Passed (Dropper / Repeater for JEE/NEET)</option>
                  <option value="Class 11">Class 11 (Early Advanced Preparation)</option>
                </select>
              </div>

              {/* Contact Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-900" />
                  <span>Contact Mobile Number (WhatsApp) <span className="text-red-500">*</span></span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-mono font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-900" />
                  <span>Email Address <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
                />
              </div>

              {/* Target Exam */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-900" />
                  <span>Target Exam Focus</span>
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
                >
                  <option value="CBSE Class 12 Board 95%+ Focus">CBSE Class 12 Board 95%+ Focus</option>
                  <option value="JEE Main & Advanced Integrated">JEE Main & Advanced Integrated</option>
                  <option value="NEET UG Medical Focus">NEET UG Medical Focus</option>
                  <option value="Physics Olympiad (NSEP/INPhO)">Physics Olympiad (NSEP/INPhO)</option>
                </select>
              </div>

              {/* Security & Privacy note */}
              <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Private:</strong> Your details are sent directly and exclusively to <strong>Arvind Kashyap Sir (Owner Admin Desk)</strong> for student verification and notes dispatch. Your data is never shared with third parties.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'Unlocking Notes Archive...' : 'Unlock All 14 Notes Instantly'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Browser PDF Preview Modal - Guaranteed Scrollable & Responsive */}
      {previewNote && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm flex min-h-full items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewNote(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[88vh] sm:h-[90vh] my-auto flex flex-col overflow-hidden shadow-2xl border-2 border-slate-300 animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 border-b border-blue-900/50">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                  Ch {previewNote.chapterNumber}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black truncate text-white">
                    {previewNote.title}
                  </h4>
                  <p className="text-[11px] text-blue-200 truncate">
                    {previewNote.pageCount} Pages · Arvind Kashyap Sir’s Handwritten Notes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadPdf(previewNote)}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 w-full bg-slate-100 relative overflow-hidden">
              <iframe
                src={`${previewNote.pdfPath}#toolbar=1&view=FitH`}
                title={previewNote.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Download Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-800 flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{downloadSuccessToast}</span>
        </div>
      )}

    </section>
  );
};
