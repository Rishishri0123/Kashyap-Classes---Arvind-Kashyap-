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
  ArrowRight,
  Book,
  Printer,
  FolderOpen,
  Maximize2,
  FileDown,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { CLASS_12_NOTES_DATA, Class12Note, GOOGLE_DRIVE_NOTES_FOLDER } from '../data/class12Notes';
import { downloadChapterNote, getChapterNotePdfBlobUrl, openChapterNotePdfInNewTab } from '../utils/pdfGenerator';
import { useContactUnlock } from '../context/ContactUnlockContext';

interface UserUnlockData {
  fullName: string;
  studentClass: string;
  phone: string;
  email: string;
  targetExam: string;
  unlockedAt: string;
}

export const Class12NotesSection: React.FC = () => {
  const { isUnlocked, phoneNumber, maskedPhone, unlockContact } = useContactUnlock();
  const [unlockedUser, setUnlockedUser] = useState<UserUnlockData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoteForAction, setSelectedNoteForAction] = useState<Class12Note | null>(null);
  const [pendingActionType, setPendingActionType] = useState<'preview' | 'download' | 'drive'>('preview');
  const [previewNote, setPreviewNote] = useState<Class12Note | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'reader' | 'pdf'>('reader');
  const [pdfPage, setPdfPage] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [pdfViewMode, setPdfViewMode] = useState<'document' | 'embed'>('document');

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

  // Auto-lock when user is not accessing notes (30 seconds security timer)
  const AUTO_LOCK_SECONDS = 30;
  const [autoLockCountdown, setAutoLockCountdown] = useState<number>(AUTO_LOCK_SECONDS);

  const handleManualLock = () => {
    sessionStorage.removeItem('kc_unlocked_notes_user');
    localStorage.removeItem('kc_unlocked_notes_user');
    setUnlockedUser(null);
    setPreviewNote(null);
    setAutoLockCountdown(AUTO_LOCK_SECONDS);
    setDownloadSuccessToast('🔒 Notes automatically locked. Please enter details to access again.');
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  // Check saved session on mount and auto-lock if expired (> 30s)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('kc_unlocked_notes_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.fullName && parsed?.phone && parsed?.unlockedAt) {
          const elapsed = Date.now() - new Date(parsed.unlockedAt).getTime();
          if (elapsed < AUTO_LOCK_SECONDS * 1000) {
            setUnlockedUser(parsed);
            setFullName(parsed.fullName);
            setPhone(parsed.phone);
            setEmail(parsed.email || '');
            setStudentClass(parsed.studentClass || 'Class 12');
            setAutoLockCountdown(Math.max(1, Math.round((AUTO_LOCK_SECONDS * 1000 - elapsed) / 1000)));
          } else {
            sessionStorage.removeItem('kc_unlocked_notes_user');
            setUnlockedUser(null);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Live countdown timer: automatically locks after 30 seconds
  useEffect(() => {
    if (!unlockedUser) return;

    const interval = setInterval(() => {
      setAutoLockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleManualLock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockedUser]);

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

  // Auto-generate fresh PDF blob URL whenever preview note or unlocked user changes
  useEffect(() => {
    if (previewNote && unlockedUser) {
      try {
        const url = getChapterNotePdfBlobUrl(previewNote, unlockedUser.fullName);
        if (url) setPreviewBlobUrl(url);
      } catch (err) {
        console.warn('Auto-generate blob URL error:', err);
      }
    }
  }, [previewNote, unlockedUser]);

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
      sessionStorage.setItem('kc_unlocked_notes_user', JSON.stringify(userProfile));
      setUnlockedUser(userProfile);

      // Also unlock Kashyap Sir's personal number across website
      unlockContact({
        fullName: userProfile.fullName,
        phone: userProfile.phone,
        studentClass: userProfile.studentClass,
        targetExam: userProfile.targetExam,
        email: userProfile.email,
      });

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

      // Redirect to Google Drive link for this specific document
      const targetUrl = selectedNoteForAction?.driveUrl || GOOGLE_DRIVE_NOTES_FOLDER;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setDownloadSuccessToast(`🎉 Unlocked! Redirecting to ${selectedNoteForAction?.uploadedFileName || "Arvind Kashyap Sir's Drive Notes"} (Auto-locks in ${AUTO_LOCK_SECONDS}s)...`);
      setTimeout(() => setDownloadSuccessToast(null), 5000);
      setSelectedNoteForAction(null);
    } catch {
      setIsSubmitting(false);
      setModalOpen(false);
      setUnlockedUser(userProfile);
      setAutoLockCountdown(AUTO_LOCK_SECONDS);
      const targetUrl = selectedNoteForAction?.driveUrl || GOOGLE_DRIVE_NOTES_FOLDER;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setDownloadSuccessToast(`🎉 Unlocked! Redirecting to ${selectedNoteForAction?.uploadedFileName || 'Drive Notes'} (Auto-locks in ${AUTO_LOCK_SECONDS}s)...`);
      setTimeout(() => setDownloadSuccessToast(null), 5000);
      setSelectedNoteForAction(null);
    }
  };

  const handleNoteAction = (note: Class12Note, action: 'preview' | 'download' | 'drive') => {
    // STRICT GATING: Block both preview and download until user fills details!
    if (!unlockedUser) {
      setSelectedNoteForAction(note);
      setPendingActionType(action);
      setModalOpen(true);
      return;
    }

    // Both preview option and download button redirect to the Google Drive link as requested
    const targetUrl = note.driveUrl || GOOGLE_DRIVE_NOTES_FOLDER;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setDownloadSuccessToast(`Opening ${note.uploadedFileName || note.title} in Google Drive...`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 3500);
  };

  const handleDownloadPdf = (note: Class12Note) => {
    if (!unlockedUser) {
      setSelectedNoteForAction(note);
      setPendingActionType('download');
      setModalOpen(true);
      return;
    }

    window.open(GOOGLE_DRIVE_NOTES_FOLDER, '_blank', 'noopener,noreferrer');
    setDownloadSuccessToast(`Opening Chapter ${note.chapterNumber}: ${note.title} in Google Drive...`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 3500);
  };

  const handleDownloadAll = () => {
    if (!unlockedUser) {
      setSelectedNoteForAction(null);
      setPendingActionType('download');
      setModalOpen(true);
      return;
    }

    window.open(GOOGLE_DRIVE_NOTES_FOLDER, '_blank', 'noopener,noreferrer');
    setDownloadSuccessToast("Opening all 14 Class 12 Notes in Arvind Kashyap Sir's Google Drive...");
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
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
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
              {/* Live countdown progress line */}
              <div
                className="absolute top-0 left-0 h-1 bg-amber-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(autoLockCountdown / AUTO_LOCK_SECONDS) * 100}%` }}
              />

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Unlock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                      VIP Access Active
                    </span>
                    <span className="text-xs text-emerald-800 font-bold">
                      Unlocked for {unlockedUser.fullName} ({unlockedUser.studentClass})
                    </span>
                    <span className="text-xs text-amber-950 bg-amber-200 border border-amber-400 px-2.5 py-0.5 rounded-md font-mono font-black flex items-center gap-1.5 animate-pulse">
                      <Clock className="w-3.5 h-3.5 text-amber-800" />
                      <span>Auto-locks in: {autoLockCountdown}s</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                    Both <strong>Preview</strong> and <strong>Download</strong> buttons redirect directly to Arvind Kashyap Sir's official Google Drive folder.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={GOOGLE_DRIVE_NOTES_FOLDER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <FolderOpen className="w-4 h-4 text-amber-400" />
                  <span>Google Drive Folder</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
                </a>

                <button
                  onClick={handleManualLock}
                  className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                  title="Lock access immediately"
                >
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  <span>Lock Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-blue-800">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-xs tracking-wider">
                    Protected Drive Notes
                  </span>
                  <span className="text-xs text-blue-200 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    Fill your details below to unlock Google Drive access
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                  Arvind Kashyap Sir’s Class 12 Master Notes & Google Drive Access
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
                  To protect our academic material, all chapter notes remain locked. Enter your student name and contact once to instantly open the official Google Drive repository. Notes automatically lock after a few seconds for privacy.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedNoteForAction(null);
                  setPendingActionType('preview');
                  setModalOpen(true);
                }}
                className="w-full md:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Unlock className="w-4 h-4 text-slate-950" />
                <span>Fill Details to Unlock (100% Free)</span>
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

                  {/* Exact Uploaded Document Name Badge */}
                  {note.uploadedFileName && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-900 bg-blue-50 border border-blue-200/90 px-2.5 py-1.5 rounded-lg mb-2.5 shadow-2xs">
                      <FileText className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span className="truncate font-semibold tracking-tight">{note.uploadedFileName}</span>
                    </div>
                  )}

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

                {/* Bottom Action Buttons: Lock when not unlocked, full access when unlocked */}
                <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNoteAction(note, 'preview')}
                      className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        unlockedUser
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                          : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-200'
                      }`}
                      title={unlockedUser ? 'Preview in Google Drive' : 'Fill details to unlock preview'}
                    >
                      {unlockedUser ? (
                        <>
                          <ExternalLink className="w-3.5 h-3.5 text-blue-950" />
                          <span>Preview (Drive)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Unlock Preview</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleNoteAction(note, 'download')}
                      className={`py-2.5 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                        unlockedUser
                          ? 'bg-blue-950 hover:bg-blue-900 text-white'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500'
                      }`}
                      title={unlockedUser ? `Download Chapter ${note.chapterNumber} from Google Drive` : 'Fill details to unlock download'}
                    >
                      {unlockedUser ? (
                        <>
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download (Drive)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-950" />
                          <span>Unlock Download</span>
                        </>
                      )}
                    </button>
                  </div>

                  {unlockedUser && (
                    <button
                      onClick={() => handleNoteAction(note, 'drive')}
                      className="w-full py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Open in Official Google Drive</span>
                      <ExternalLink className="w-3 h-3 text-amber-700 shrink-0" />
                    </button>
                  )}
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
                Unlock Google Drive Notes Archive
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 font-normal leading-relaxed pr-6">
                Enter your details to instantly open Arvind Kashyap Sir's official Google Drive handwritten notes repository. Access automatically locks after 30 seconds for academic security.
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
                  <FolderOpen className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'Verifying Details...' : 'Unlock & Open Google Drive Notes'}</span>
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
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] my-auto flex flex-col overflow-hidden shadow-2xl border-2 border-slate-300 animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 border-b border-blue-900/50">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                  Ch {previewNote.chapterNumber}
                </span>
                <div className="min-w-0">
                  {previewNote.uploadedFileName && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 truncate mb-0.5">
                      <FileText className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{previewNote.uploadedFileName}</span>
                    </div>
                  )}
                  <h4 className="text-sm sm:text-base font-black truncate text-white">
                    {previewNote.title}
                  </h4>
                  <p className="text-[11px] text-blue-200 truncate">
                    {previewNote.pageCount} Pages · Authored personally by Arvind Kashyap (Kashyap Sir)
                  </p>
                </div>
              </div>

              {/* Action Controls & Tab Switcher */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <div className="flex items-center bg-blue-900/60 p-1 rounded-xl border border-blue-800">
                  <button
                    onClick={() => setPreviewTab('reader')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewTab === 'reader'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Study Reader
                  </button>
                  <button
                    onClick={() => setPreviewTab('pdf')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewTab === 'pdf'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    PDF View
                  </button>
                </div>

                <a
                  href={previewNote.driveUrl || GOOGLE_DRIVE_NOTES_FOLDER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-900/90 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 border border-blue-700"
                  title="Open Official Google Drive Document"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Open in Drive</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>

                <button
                  onClick={() => handleDownloadPdf(previewNote)}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  title="Download PDF File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Reader View OR PDF View */}
            {previewTab === 'reader' ? (
              <div className="flex-1 w-full bg-slate-50 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-6">
                
                {/* Academic Header Banner */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-950 text-xs font-black uppercase tracking-wider">
                      {previewNote.unit}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                      {previewNote.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-950 font-heading">
                    {previewNote.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    Authored personally by <strong>{previewNote.author}</strong> · Senior Physics Mentor (20+ Years Experience)
                  </p>

                  {unlockedUser && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified VIP Copy Unlocked for: {unlockedUser.fullName} ({unlockedUser.studentClass})</span>
                    </div>
                  )}
                </div>

                {/* Section 1: Topics & Syllabus Covered */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-950 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
                    <span>Complete Topics & Syllabus Breakdown</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700">
                    {previewNote.topicsCovered.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Key Derivations & Mathematical Proofs */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-950 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
                    <span>Essential Step-by-Step Board Derivations & Formulas</span>
                  </h4>

                  <div className="space-y-2.5">
                    {previewNote.keyDerivations.map((derivation, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner flex items-center justify-between gap-3"
                      >
                        <span className="text-slate-400 font-sans text-xs font-bold uppercase shrink-0">
                          Step {i + 1}:
                        </span>
                        <span className="font-bold tracking-wide truncate">{derivation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Arvind Kashyap Sir's Board & Exam Strategy */}
                <div className="bg-amber-50/80 p-5 sm:p-6 rounded-2xl border-2 border-amber-300 shadow-xs space-y-3 text-slate-900">
                  <h4 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Arvind Kashyap Sir’s Golden Rules for Scoring 95%+ in this Chapter</span>
                  </h4>
                  <ul className="text-xs text-slate-800 space-y-2 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>State physical definitions clearly:</strong> In CBSE evaluation, writing the final equation without defining the variables results in immediate 1-mark loss.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>Draw clean ray/circuit diagrams:</strong> Draw arrows for current direction and light propagation with pencil before starting the mathematical derivation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                      <span><strong>Review NCERT 'Points to Ponder':</strong> NTA draws 100% of tricky assertion-reasoning questions directly from the chapter summary margins.</span>
                    </li>
                  </ul>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200">
                    <span className="text-[11px] text-slate-600">
                      Center: Shastri Nagar, Ghaziabad · Helpline: <strong>{isUnlocked ? phoneNumber : maskedPhone}</strong>
                    </span>
                    <button
                      onClick={() => handleDownloadPdf(previewNote)}
                      className="px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Download Printable PDF Document</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* PDF View: Publication-Grade Document Viewer & Browser Embed */
              <div className="flex-1 w-full bg-slate-200/90 relative overflow-y-auto overscroll-contain flex flex-col">
                
                {/* PDF Sub-Header Control Toolbar (Sticky at top of viewer) */}
                <div className="sticky top-0 z-20 bg-slate-900 text-white px-3 sm:px-6 py-2.5 border-b border-slate-700 shadow-md flex flex-wrap items-center justify-between gap-2">
                  {/* Left: View Mode Toggle & Page Selector */}
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-bold">
                      <button
                        onClick={() => setPdfViewMode('document')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          pdfViewMode === 'document'
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        title="View high-resolution multi-page document (works on all mobile & desktop browsers)"
                      >
                        Document Pages
                      </button>
                      <button
                        onClick={() => setPdfViewMode('embed')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          pdfViewMode === 'embed'
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        title="View in native browser iframe"
                      >
                        Browser Frame
                      </button>
                    </div>

                    {pdfViewMode === 'document' && (
                      <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-[11px] font-bold text-slate-300">
                        <span className="text-slate-400 mr-1">Page:</span>
                        {(['all', 1, 2, 3, 4, 5] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPdfPage(p)}
                            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                              pdfPage === p
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {p === 'all' ? 'All' : p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Direct Drive & Native Open Controls */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <a
                      href={GOOGLE_DRIVE_NOTES_FOLDER}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      title="Open Kashyap Sir's Original Notes Folder in Google Drive"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Drive Notes</span>
                      <ExternalLink className="w-3 h-3 text-slate-900" />
                    </a>

                    <button
                      onClick={() => openChapterNotePdfInNewTab(previewNote, unlockedUser?.fullName)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all border border-slate-600 flex items-center gap-1 cursor-pointer"
                      title="Open PDF in Full Screen New Window"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-blue-300" />
                      <span className="hidden sm:inline">New Tab</span>
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(previewNote)}
                      className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      title="Download PDF File directly to device"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>

                {/* Main PDF Content Area */}
                {pdfViewMode === 'document' ? (
                  <div className="p-3 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">

                    {/* Page 1: Official Master Title & Syllabus Sheet */}
                    {(pdfPage === 'all' || pdfPage === 1) && (
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6 sm:p-10 space-y-6 relative overflow-hidden">
                        {/* Page Running Header */}
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 text-[11px] font-bold text-slate-600">
                          <span className="text-slate-900 font-black tracking-wider uppercase">KASHYAP CLASSES · PHYSICS COACHING</span>
                          <span className="text-slate-700">Author: Arvind Kashyap (Kashyap Sir)</span>
                        </div>

                        {/* Top Official Navy Header Box */}
                        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-xl border border-blue-900 shadow-sm space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                              OFFICIAL CLASS 12 PHYSICS STUDY MODULE
                            </span>
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                              CBSE 95%+ & JEE/NEET
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
                            Chapter {previewNote.chapterNumber}: {previewNote.title}
                          </h2>
                          <p className="text-xs text-blue-200">
                            {previewNote.unit} · {previewNote.part} · {previewNote.pageCount} Pages Theory, PYQs & Derivations
                          </p>
                          <div className="text-[11px] text-slate-300 pt-1 border-t border-blue-900/60 flex items-center justify-between flex-wrap gap-2">
                            <span>Center: Flat No. 202, B-1, M P Enclave, Shastri Nagar, Ghaziabad</span>
                            <span>Helpline: {isUnlocked ? phoneNumber : maskedPhone}</span>
                          </div>
                        </div>

                        {/* Verified Student Watermark Bar */}
                        {unlockedUser && (
                          <div className="bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-emerald-900">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Verified Student Copy: <strong>{unlockedUser.fullName}</strong> ({unlockedUser.studentClass})</span>
                            </span>
                            <span className="text-emerald-700 text-[11px]">Exam: {unlockedUser.targetExam}</span>
                          </div>
                        )}

                        {/* Syllabus & Core Topics */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-blue-950 text-amber-400 flex items-center justify-center text-xs">§</span>
                            <span>Official Syllabus & Topics Breakdown (CBSE / NCERT Alignment)</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-800">
                            {previewNote.topicsCovered.map((topic, i) => (
                              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Page Running Footer */}
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-500 font-medium">
                          <span>Kashyap Classes · Ghaziabad · arvindkashyap2008@gmail.com</span>
                          <span className="font-bold text-slate-700">Page 1 of 5</span>
                        </div>
                      </div>
                    )}

                    {/* Page 2: Core Concepts, Physical Laws & Fundamental Equations */}
                    {(pdfPage === 'all' || pdfPage === 2) && (
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6 sm:p-10 space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 text-[11px] font-bold text-slate-600">
                          <span className="text-slate-900 font-black tracking-wider uppercase">KASHYAP CLASSES · SECTION 1: PHYSICAL LAWS & THEORY</span>
                          <span className="text-slate-700">Ch {previewNote.chapterNumber}: {previewNote.title}</span>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-950" />
                            <span>Fundamental Physical Principles & Microscopic Formulations</span>
                          </h3>

                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-800 space-y-3 font-medium leading-relaxed">
                            <p>
                              <strong>1. First Principles & Axiomatic Basis:</strong> Every physical interaction in {previewNote.title} is governed by conservation laws (charge, energy, and linear/angular momentum). Under CBSE assessment guidelines, derivations must start explicitly from fundamental axioms before substituting particular geometric boundaries.
                            </p>
                            <p>
                              <strong>2. Vector Rigour & Coordinate Sign Conventions:</strong> Field quantities and forces require vector notation throughout. Writing scalar equivalents without specifying field direction or unit vector (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">r̂</code>) leads to automatic step mark penalties.
                            </p>
                            <p>
                              <strong>3. Dimensional Consistency:</strong> Verify the dimensional equivalence of LHS and RHS for all derived expressions. Ensure proper SI units (e.g., N/C, V/m, T, Wb, F, H, Ω) are explicitly suffixed in final calculations.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
                              <span className="text-xs font-black text-blue-950 uppercase tracking-wide block">
                                Critical Physical Constants
                              </span>
                              <ul className="text-xs text-slate-700 space-y-1 font-mono">
                                <li>• ε₀ = 8.854 × 10⁻¹² C² N⁻¹ m⁻²</li>
                                <li>• 1 / (4πε₀) = 9 × 10⁹ N m² C⁻²</li>
                                <li>• μ₀ = 4π × 10⁻⁷ T m A⁻¹</li>
                                <li>• e = 1.602 × 10⁻¹⁹ C</li>
                              </ul>
                            </div>

                            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                              <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                                CBSE Examiner Scoring Checklist
                              </span>
                              <ul className="text-xs text-slate-700 space-y-1 font-medium">
                                <li>✓ Define all variables before derivation</li>
                                <li>✓ Draw complete diagram with labeled arrows</li>
                                <li>✓ Write intermediate integration limits</li>
                                <li>✓ Highlight final boxed formula with SI unit</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-500 font-medium">
                          <span>Kashyap Classes · Ghaziabad · {isUnlocked ? phoneNumber : maskedPhone}</span>
                          <span className="font-bold text-slate-700">Page 2 of 5</span>
                        </div>
                      </div>
                    )}

                    {/* Page 3: Step-by-Step Mathematical Derivations & Diagrams */}
                    {(pdfPage === 'all' || pdfPage === 3) && (
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6 sm:p-10 space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 text-[11px] font-bold text-slate-600">
                          <span className="text-slate-900 font-black tracking-wider uppercase">KASHYAP CLASSES · SECTION 2: STEP-BY-STEP BOARD DERIVATIONS</span>
                          <span className="text-slate-700">Ch {previewNote.chapterNumber}: {previewNote.title}</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span>Master Step-by-Step Mathematical Derivations</span>
                            </h3>
                            <span className="text-[11px] bg-blue-100 text-blue-900 font-black px-2 py-0.5 rounded">
                              {previewNote.keyDerivations.length} Core Derivations
                            </span>
                          </div>

                          <div className="space-y-3">
                            {previewNote.keyDerivations.map((derivation, i) => (
                              <div
                                key={i}
                                className="p-4 rounded-xl bg-slate-900 text-amber-300 border border-slate-800 shadow-md space-y-2"
                              >
                                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                                  <span className="font-bold text-amber-400 uppercase tracking-wider font-sans">
                                    Derivation {i + 1} of {previewNote.keyDerivations.length}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-sans">
                                    CBSE Board 3/5 Marks Standard
                                  </span>
                                </div>
                                <div className="font-mono text-sm sm:text-base font-black tracking-wide text-amber-200 py-1">
                                  {derivation}
                                </div>
                                <p className="text-[11px] text-slate-400 font-sans">
                                  Proven in Kashyap Classes Classroom Batches: State the hypothesis, sketch the standard ray/field line diagram, integrate between limits, and box the result.
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-500 font-medium">
                          <span>Kashyap Classes · Ghaziabad · {isUnlocked ? phoneNumber : maskedPhone}</span>
                          <span className="font-bold text-slate-700">Page 3 of 5</span>
                        </div>
                      </div>
                    )}

                    {/* Page 4: Arvind Kashyap Sir's Board Scoring Strategies & Common Traps */}
                    {(pdfPage === 'all' || pdfPage === 4) && (
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6 sm:p-10 space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 text-[11px] font-bold text-slate-600">
                          <span className="text-slate-900 font-black tracking-wider uppercase">KASHYAP CLASSES · SECTION 3: EXAM STRATEGY & COMMON TRAPS</span>
                          <span className="text-slate-700">Arvind Kashyap (Kashyap Sir)</span>
                        </div>

                        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-5 space-y-4">
                          <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                            <span>Arvind Kashyap Sir’s Golden Rules for Scoring 95%+ in this Chapter</span>
                          </h3>

                          <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-medium">
                            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1">
                              <span className="font-bold text-slate-950 block">1. State physical definitions before mathematical formulas:</span>
                              <span>In CBSE board checking, an unstated symbol in an otherwise perfect derivation causes an immediate 1-mark loss. Always define variables explicitly.</span>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1">
                              <span className="font-bold text-slate-950 block">2. Draw clean ray and field-line diagrams with pencil:</span>
                              <span>Every diagram must show directional arrows (current, light ray, field line). Missing arrows result in 0.5-mark deductions under CBSE marking schemes.</span>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1">
                              <span className="font-bold text-slate-950 block">3. Memorize NCERT 'Points to Ponder':</span>
                              <span>NTA and CBSE draw 100% of assertion-reasoning questions directly from the summary margins of the NCERT textbook.</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 text-xs text-slate-700">
                          <span className="font-black text-slate-950 uppercase tracking-wide block">
                            Quick-Recall Formula Matrix
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                            {previewNote.keyDerivations.map((d, i) => (
                              <div key={i} className="p-2 bg-white rounded border border-slate-200 text-blue-950 font-bold truncate">
                                Eq {i + 1}: {d}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-500 font-medium">
                          <span>Kashyap Classes · Ghaziabad · {isUnlocked ? phoneNumber : maskedPhone}</span>
                          <span className="font-bold text-slate-700">Page 4 of 5</span>
                        </div>
                      </div>
                    )}

                    {/* Page 5: CBSE 15+ Years PYQ Archive */}
                    {(pdfPage === 'all' || pdfPage === 5) && (
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6 sm:p-10 space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 text-[11px] font-bold text-slate-600">
                          <span className="text-slate-900 font-black tracking-wider uppercase">KASHYAP CLASSES · SECTION 4: CBSE PREVIOUS YEARS QUESTIONS (PYQs)</span>
                          <span className="text-slate-700">Ch {previewNote.chapterNumber}: {previewNote.title}</span>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                            <Book className="w-4 h-4 text-indigo-900" />
                            <span>15+ Years CBSE PYQ Blueprint & Trend Analysis</span>
                          </h3>

                          <div className="space-y-3 text-xs text-slate-800">
                            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                              <span className="font-black text-blue-950 uppercase tracking-wide block">
                                • 1 Mark & MCQs (CBSE 2018–2024 Trends):
                              </span>
                              <p className="text-slate-700">
                                Focuses heavily on ratio changes (e.g., doubling distance, inserting dielectrics, varying frequency), dimensional analysis, and vector dot/cross products.
                              </p>
                            </div>

                            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                              <span className="font-black text-emerald-950 uppercase tracking-wide block">
                                • 2 & 3 Marks Questions (Derivations & Conceptual Proofs):
                              </span>
                              <p className="text-slate-700">
                                Requires clear derivation steps with ray/field diagrams, stating boundary conditions, and writing the final algebraic expression with standard SI units.
                              </p>
                            </div>

                            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                              <span className="font-black text-purple-950 uppercase tracking-wide block">
                                • 5 Marks Case-Based & Long Derivations:
                              </span>
                              <p className="text-slate-700">
                                Combines theory with a 2-mark numerical application. Always calculate the numerical part with complete steps and final unit box.
                              </p>
                            </div>
                          </div>

                          {/* Action Footer on Page 5 */}
                          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                            <div className="text-xs text-slate-300">
                              <span className="font-bold text-white block">Download or Open Original Scans:</span>
                              <span>Access complete handwritten archives directly via Google Drive or offline PDF.</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={GOOGLE_DRIVE_NOTES_FOLDER}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black transition-all flex items-center gap-1"
                              >
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span>Drive Archive</span>
                              </a>
                              <button
                                onClick={() => handleDownloadPdf(previewNote)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Save PDF</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] text-slate-500 font-medium">
                          <span>Kashyap Classes · Ghaziabad · {isUnlocked ? phoneNumber : maskedPhone}</span>
                          <span className="font-bold text-slate-700">Page 5 of 5</span>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  /* Browser Frame / Iframe View with Mobile Fallback */
                  <div className="flex-1 w-full h-full min-h-[500px] flex flex-col bg-slate-900 relative">
                    {/* Notice for mobile users */}
                    <div className="p-3 bg-amber-400/90 text-slate-950 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
                      <span>💡 <strong>Mobile / Tablet Notice:</strong> If your browser blocks embedded PDF frames, use the <strong>Document Pages</strong> view above or tap <strong>Open in Drive</strong>.</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPdfViewMode('document')}
                          className="px-2.5 py-1 bg-slate-950 text-white rounded font-black text-[11px] cursor-pointer"
                        >
                          Switch to Document Pages
                        </button>
                        <a
                          href={GOOGLE_DRIVE_NOTES_FOLDER}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-blue-950 text-amber-300 rounded font-black text-[11px] flex items-center gap-1"
                        >
                          <FolderOpen className="w-3 h-3" />
                          <span>Google Drive</span>
                        </a>
                      </div>
                    </div>

                    {previewBlobUrl ? (
                      <iframe
                        src={`${previewBlobUrl}#toolbar=1&view=FitH`}
                        title={previewNote.title}
                        className="w-full flex-1 border-0 bg-white"
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
                        <Book className="w-12 h-12 text-amber-400 mb-3" />
                        <h4 className="font-bold text-base mb-1">Generating PDF Stream...</h4>
                        <p className="text-xs text-slate-300 max-w-sm mb-4">
                          Your official Kashyap Classes PDF module is being rendered. Tap below to switch to the instant Document Pages view or open directly in Google Drive.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPdfViewMode('document')}
                            className="px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
                          >
                            View Document Pages
                          </button>
                          <a
                            href={GOOGLE_DRIVE_NOTES_FOLDER}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>Open Drive Folder</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
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
