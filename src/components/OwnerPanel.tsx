import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Search,
  Filter,
  Download,
  RefreshCw,
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Calendar,
  AlertCircle,
  X,
  Trash2,
  Edit3,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Building,
  FileSpreadsheet,
  FolderOpen
} from 'lucide-react';
import { InquiryRecord } from '../types/inquiry';
import { GOOGLE_DRIVE_NOTES_FOLDER } from '../data/class12Notes';

interface OwnerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerPanel: React.FC<OwnerPanelProps> = ({ isOpen, onClose }) => {
  // Authentication states (Credentials: KC2026 / Rishi@kc)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Inquiries data states
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled' | 'Closed'>('All');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Enrollment Form' | 'Quick Modal' | 'Class 12 Notes Unlock'>('All');

  // Editing notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [currentNotesText, setCurrentNotesText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('kc_owner_session_token');
    const savedId = localStorage.getItem('kc_owner_id');
    if (savedToken && savedId === 'KC2026') {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch inquiries when authenticated
  const fetchInquiries = useCallback(async (tokenToUse?: string) => {
    const activeToken = tokenToUse || authToken || localStorage.getItem('kc_owner_session_token');
    if (!activeToken) return;

    setIsLoadingInquiries(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthToken(null);
        localStorage.removeItem('kc_owner_session_token');
        localStorage.removeItem('kc_owner_id');
        setAuthError('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      } else {
        setFetchError(data.error || 'Failed to fetch inquiries');
      }
    } catch (err) {
      console.error('Error fetching admin inquiries:', err);
      setFetchError('Unable to connect to server backend.');
    } finally {
      setIsLoadingInquiries(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchInquiries();
      // Auto-poll inquiries every 25 seconds while panel is active
      const interval = setInterval(() => {
        fetchInquiries();
      }, 25000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAuthenticated, fetchInquiries]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ownerId.trim(),
          password: ownerPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('kc_owner_session_token', data.token);
        localStorage.setItem('kc_owner_id', 'KC2026');
        setOwnerPassword('');
        setAuthError(null);
        fetchInquiries(data.token);
        showToast('Welcome, Arvind Kashyap Sir! Owner session activated.');
      } else {
        setAuthError(data.error || 'Invalid credentials. ID or Password did not match.');
      }
    } catch {
      setAuthError('Server unreachable. Please verify server status.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('kc_owner_session_token');
    localStorage.removeItem('kc_owner_id');
    setOwnerId('');
    setOwnerPassword('');
    setInquiries([]);
    showToast('Logged out of Owner Panel.');
  };

  // Update Status
  const handleStatusChange = async (inquiryId: string, newStatus: InquiryRecord['status']) => {
    const activeToken = authToken || localStorage.getItem('kc_owner_session_token');
    if (!activeToken) return;

    setIsUpdatingStatus(inquiryId);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
        );
        showToast(`Inquiry #${inquiryId} updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Save Owner Note
  const handleSaveNotes = async (inquiryId: string) => {
    const activeToken = authToken || localStorage.getItem('kc_owner_session_token');
    if (!activeToken) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ ownerNotes: currentNotesText }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, ownerNotes: currentNotesText } : item))
        );
        setEditingNotesId(null);
        showToast('Private owner notes saved.');
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inquiryId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete inquiry from "${studentName}" (${inquiryId})?`)) {
      return;
    }

    const activeToken = authToken || localStorage.getItem('kc_owner_session_token');
    if (!activeToken) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
        showToast(`Inquiry from ${studentName} deleted.`);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export');
      return;
    }

    const headers = [
      'Inquiry ID',
      'Date & Time',
      'Student Name',
      'Phone Number',
      'Email',
      'Class / Grade',
      'Target Exam',
      'Interested Course',
      'Source',
      'Wants Free Demo',
      'Student Message / Notes',
      'Status',
      'Owner Internal Notes',
    ];

    const rows = inquiries.map((inq) => [
      `"${inq.id}"`,
      `"${new Date(inq.timestamp).toLocaleString('en-IN')}"`,
      `"${(inq.fullName || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.studentClass || '').replace(/"/g, '""')}"`,
      `"${(inq.targetExam || '').replace(/"/g, '""')}"`,
      `"${(inq.course || inq.chapterRequested || '').replace(/"/g, '""')}"`,
      `"${(inq.source || '').replace(/"/g, '""')}"`,
      `"${inq.wantsDemo ? 'YES' : 'NO'}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      `"${inq.status}"`,
      `"${(inq.ownerNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kashyap_Classes_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported inquiries to CSV spreadsheet.');
  };

  if (!isOpen) return null;

  // Filtered inquiries calculation
  const filteredInquiries = inquiries.filter((item) => {
    // Status filter
    if (statusFilter !== 'All' && item.status !== statusFilter) {
      return false;
    }
    // Source filter
    if (sourceFilter !== 'All' && item.source !== sourceFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.fullName?.toLowerCase().includes(q);
      const matchPhone = item.phone?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchCourse = item.course?.toLowerCase().includes(q);
      const matchId = item.id?.toLowerCase().includes(q);
      const matchMsg = item.message?.toLowerCase().includes(q);
      const matchNotes = item.ownerNotes?.toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchCourse || matchId || matchMsg || matchNotes;
    }
    return true;
  });

  // KPI Calculations
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'New').length;
  const contactedCount = inquiries.filter((i) => i.status === 'Contacted').length;
  const enrolledCount = inquiries.filter((i) => i.status === 'Enrolled').length;
  const demoCount = inquiries.filter((i) => i.wantsDemo).length;
  const notesCount = inquiries.filter((i) => i.source === 'Class 12 Notes Unlock').length;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-blue-950 text-white border border-amber-400/60 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-down text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: OWNER LOGIN CARD (COMPACT, FULLY VISIBLE, NO PRESET ID IN BOX)    */}
      {/* ========================================================================= */}
      {!isAuthenticated ? (
        <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden my-auto animate-scale-in">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 relative border-b border-blue-900/40">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-w-md mx-auto text-center space-y-2">
              <div className="inline-flex items-center justify-center mb-2">
                <img
                  src="/assets/aistudio/kashyap_classes_logo.png"
                  alt="Kashyap Classes Logo"
                  className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border-2 border-amber-400 shadow-md mx-auto"
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-amber-400/40 tracking-wider">
                  Restricted Area
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Authorized Personnel Only
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                Kashyap Classes Owner Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal">
                Enter your Owner Credentials to review all student admissions, inquiries, and handwritten notes downloads.
              </p>
            </div>
          </div>

          {/* Login Form Body */}
          <div className="p-6 sm:p-8 w-full space-y-5 bg-slate-50">
            {authError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Owner ID / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter Owner ID"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full pl-3.5 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Security Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter Owner Password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full pl-3.5 pr-11 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 px-4 text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Unlock className="w-4 h-4 text-slate-950" />
                )}
                <span>Access Owner Panel</span>
              </button>
            </form>

            <div className="pt-1 text-center">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer underline underline-offset-4"
              >
                Cancel and Return to Website
              </button>
            </div>

            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-center">
              <p className="text-[11px] text-slate-600 font-medium">
                🔒 Strictly confidential. Authorized for Arvind Kashyap Sir & Institute Administrators.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: AUTHENTICATED OWNER DASHBOARD (COMPACT, FULLY VISIBLE & SCROLLABLE)*/
        /* ========================================================================= */
        <div className="relative w-full max-w-6xl h-full sm:h-[92vh] max-h-full sm:max-h-[92vh] bg-white rounded-xl sm:rounded-3xl border border-slate-300 shadow-2xl flex flex-col min-h-0 overflow-hidden my-auto animate-scale-in">
          
          {/* Top Navigation Bar (Compact) */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white px-3 sm:px-6 py-2.5 shrink-0 flex items-center justify-between gap-2 border-b border-blue-900/40">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/kashyap_classes_logo.png"
                alt="KC Logo"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-amber-400 shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-base font-extrabold font-heading text-white tracking-tight truncate">
                    Owner Dashboard
                  </h2>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  Logged in as <strong className="text-amber-400 font-semibold">Owner</strong>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => fetchInquiries()}
                title="Refresh Leads"
                className="p-1.5 sm:px-3 sm:py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExportCSV}
                title="Download all leads as an Excel CSV file"
                className="p-1.5 sm:px-3 sm:py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-900" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <a
                href={GOOGLE_DRIVE_NOTES_FOLDER}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Kashyap Sir's Class 12 Notes Google Drive Folder"
                className="p-1.5 sm:px-3 sm:py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Drive Notes</span>
              </a>

              <button
                onClick={handleLogout}
                title="Logout"
                className="px-2.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Logout</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KPI Metric Summary Strip (Small & Compact: saves 200px vertical space) */}
          <div className="px-3 py-2 sm:px-6 sm:py-2.5 border-b border-slate-200 bg-white shrink-0">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2.5">
              <div className="bg-slate-50 border border-slate-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Total</span>
                <span className="text-sm sm:text-xl font-black text-slate-950 font-mono mt-0.5 leading-none">{totalCount}</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800 uppercase tracking-wider truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>New</span>
                </span>
                <span className="text-sm sm:text-xl font-black text-emerald-900 font-mono mt-0.5 leading-none">{newCount}</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-800 uppercase tracking-wider truncate">Contacted</span>
                <span className="text-sm sm:text-xl font-black text-blue-950 font-mono mt-0.5 leading-none">{contactedCount}</span>
              </div>

              <div className="bg-purple-50 border border-purple-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-purple-800 uppercase tracking-wider truncate">Enrolled</span>
                <span className="text-sm sm:text-xl font-black text-purple-950 font-mono mt-0.5 leading-none">{enrolledCount}</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 uppercase tracking-wider truncate">Demos</span>
                <span className="text-sm sm:text-xl font-black text-amber-950 font-mono mt-0.5 leading-none">{demoCount}</span>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-bold text-indigo-800 uppercase tracking-wider truncate">Notes</span>
                <span className="text-sm sm:text-xl font-black text-indigo-950 font-mono mt-0.5 leading-none">{notesCount}</span>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar (Compact & Sleek) */}
          <div className="px-3 py-2 sm:px-6 sm:py-2.5 border-b border-slate-200 bg-slate-50 shrink-0 space-y-1.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student name, phone, course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-950 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-[11px] font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter Tabs & Source Dropdown */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold py-0.5">
              {(['All', 'New', 'Contacted', 'Enrolled', 'Closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-950 text-white shadow-2xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 shrink-0 focus:outline-none"
              >
                <option value="All">All Sources</option>
                <option value="Enrollment Form">Enrollment Form</option>
                <option value="Quick Modal">Quick Modal</option>
                <option value="Class 12 Notes Unlock">Notes Unlock</option>
              </select>
            </div>
          </div>

          {/* Scrollable Inquiry List Body - Fully Visible & Fluid Scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-3 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            {fetchError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{fetchError}</span>
                </div>
                <button
                  onClick={() => fetchInquiries()}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-red-900 font-bold text-xs"
                >
                  Retry
                </button>
              </div>
            )}

            {filteredInquiries.length === 0 ? (
              <div className="text-center py-6 sm:py-12 px-3 bg-white rounded-2xl border border-slate-200 space-y-2 my-auto">
                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  No matching inquiries found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {searchQuery || statusFilter !== 'All' || sourceFilter !== 'All'
                    ? 'No inquiries match your current search or category filters. Try clearing filters.'
                    : 'No student inquiries received yet. All new queries submitted through the website enrollment form, quick modal, or Class 12 notes unlocks will appear here in real time.'}
                </p>
                {(searchQuery || statusFilter !== 'All' || sourceFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setSourceFilter('All');
                    }}
                    className="text-xs font-bold text-blue-950 underline cursor-pointer mt-1"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                  {filteredInquiries.map((inq) => {
                    const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                    const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                      `Hello ${inq.fullName}, this is Arvind Kashyap / Kashyap Classes admissions office regarding your inquiry (#${inq.id}) for ${inq.course || 'Physics Batches'}.`
                    )}`;
                    const telUrl = `tel:${inq.phone.replace(/\s+/g, '')}`;

                    return (
                      <div
                        key={inq.id}
                        className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs ${
                          inq.status === 'New'
                            ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/20'
                            : inq.status === 'Contacted'
                            ? 'border-blue-200'
                            : inq.status === 'Enrolled'
                            ? 'border-purple-200 bg-purple-50/20'
                            : 'border-slate-200 opacity-90'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
                          {/* Col 1: Student Core Info */}
                          <div className="space-y-1.5 flex-1 min-w-[280px]">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                                {inq.id}
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                  inq.status === 'New'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : inq.status === 'Enrolled'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                                }`}
                              >
                                {inq.status}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(inq.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {inq.source}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                              <h3 className="text-base sm:text-lg font-bold text-slate-950 font-heading">
                                {inq.fullName}
                              </h3>
                              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                Class {inq.studentClass}
                              </span>
                              {inq.wantsDemo && (
                                <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                                  ★ Free Demo Requested
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 font-medium">
                              <strong>Target:</strong> {inq.targetExam} · <strong>Program:</strong> {inq.course || inq.chapterRequested || 'General Inquiry'}
                            </div>

                            {inq.message && (
                              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic mt-1">
                                "{inq.message}"
                              </div>
                            )}

                            {inq.chapterRequested && inq.source === 'Class 12 Notes Unlock' && (
                              <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 inline-block">
                                📖 Unlocked Note: {inq.chapterRequested}
                              </div>
                            )}
                          </div>

                          {/* Col 2: Direct Contact Actions */}
                          <div className="flex flex-wrap lg:flex-col items-center gap-2 shrink-0">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </a>

                            <a
                              href={telUrl}
                              className="px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer font-mono"
                            >
                              <Phone className="w-3.5 h-3.5 fill-current text-amber-400" />
                              <span>{inq.phone}</span>
                            </a>

                            {inq.email && (
                              <a
                                href={`mailto:${inq.email}`}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 font-mono"
                              >
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{inq.email}</span>
                              </a>
                            )}
                          </div>

                          {/* Col 3: Status Selector & Management */}
                          <div className="flex lg:flex-col items-center justify-between lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-left lg:text-right">
                                Change Status
                              </label>
                              <select
                                value={inq.status}
                                disabled={isUpdatingStatus === inq.id}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryRecord['status'])}
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer shadow-2xs"
                              >
                                <option value="New">🟢 New</option>
                                <option value="Contacted">🔵 Contacted</option>
                                <option value="Enrolled">🟣 Enrolled</option>
                                <option value="Closed">⚪ Closed</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingNotesId(inq.id);
                                  setCurrentNotesText(inq.ownerNotes || '');
                                }}
                                className="p-2 text-slate-600 hover:text-blue-950 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="Add/Edit Owner Remarks"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Notes</span>
                              </button>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id, inq.fullName)}
                                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl text-xs transition-colors cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Owner Private Remarks Banner or Inline Editor */}
                        {editingNotesId === inq.id ? (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              value={currentNotesText}
                              onChange={(e) => setCurrentNotesText(e.target.value)}
                              placeholder="Add private note (e.g. Called parent on 23rd Oct, trial confirmed for Sunday 11am)..."
                              className="flex-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950"
                            />
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => handleSaveNotes(inq.id)}
                                className="px-3 py-2 bg-blue-950 text-white rounded-xl text-xs font-bold hover:bg-blue-900 cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-amber-400" />
                                <span>Save Note</span>
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-3 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : inq.ownerNotes ? (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-900 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200/70">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span className="font-bold">Owner Note:</span>
                              <span>{inq.ownerNotes}</span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingNotesId(inq.id);
                                setCurrentNotesText(inq.ownerNotes || '');
                              }}
                              className="text-[11px] font-bold text-amber-800 hover:underline ml-2 shrink-0 cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        ) : null}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="p-3 sm:px-6 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 font-medium flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Owner Portal Active</span>
                <span className="text-slate-400">·</span>
                <span>Showing {filteredInquiries.length} of {totalCount} total inquiries</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">Ctrl+Shift+K</kbd> anywhere on website to open
              </div>
            </div>

          </div>
        )}

    </div>
  );
};
