import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import {
  UploadCloud,
  PackagePlus,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
  ArrowLeft,
  CheckSquare,
  Square,
  LogIn,
} from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import {
  NoteItem,
  BundleItem,
  NoteSectionId,
  NOTE_SECTIONS,
  SECTION_LABEL_MAP,
} from '../types/notesStore';

function generateSafeDocId(prefix: string, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${slug || 'item'}-${rand}`;
}

export const AdminPage: React.FC = () => {
  const { user, loading, isAdmin, openAuthModal, getIdToken, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'bundle'>('upload');

  // Existing Firestore catalog state
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bundles, setBundles] = useState<BundleItem[]>([]);

  // Tab 1: Upload Single PDF form state
  const [noteSection, setNoteSection] = useState<NoteSectionId>('class-12-physics');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [singlePriceInINR, setSinglePriceInINR] = useState('49');
  const [bundlePriceInINR, setBundlePriceInINR] = useState('29');
  const [pageCount, setPageCount] = useState('20');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingNote, setUploadingNote] = useState(false);

  // Tab 2: Create Bundle Pack form state
  const [bundleSection, setBundleSection] = useState<NoteSectionId>('class-12-physics');
  const [bundleTitle, setBundleTitle] = useState('');
  const [bundleDescription, setBundleDescription] = useState('');
  const [packPriceInINR, setPackPriceInINR] = useState('299');
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [creatingBundle, setCreatingBundle] = useState(false);

  // Global status banner
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const unsubNotes = onSnapshot(
      query(collection(db, 'notes'), orderBy('createdAt', 'desc')),
      (snap) => {
        setNotes(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<NoteItem, 'id'>),
          }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'notes')
    );

    const unsubBundles = onSnapshot(
      query(collection(db, 'bundles'), orderBy('createdAt', 'desc')),
      (snap) => {
        setBundles(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<BundleItem, 'id'>),
          }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'bundles')
    );

    return () => {
      unsubNotes();
      unsubBundles();
    };
  }, [user, isAdmin]);

  // Clear checked bundle note IDs when section switches
  useEffect(() => {
    setSelectedNoteIds([]);
  }, [bundleSection]);

  const notesInUploadSection = useMemo(
    () => notes.filter((n) => n.section === noteSection),
    [notes, noteSection]
  );

  const notesInBundleSection = useMemo(
    () => notes.filter((n) => n.section === bundleSection),
    [notes, bundleSection]
  );

  const bundlesInBundleSection = useMemo(
    () => bundles.filter((b) => b.section === bundleSection),
    [bundles, bundleSection]
  );

  const selectedSingleTotal = useMemo(() => {
    return notesInBundleSection
      .filter((n) => selectedNoteIds.includes(n.id))
      .reduce((sum, n) => sum + (Number(n.singlePriceInINR) || 0), 0);
  }, [notesInBundleSection, selectedNoteIds]);

  const uploadFileToR2WithProgress = (
    uploadUrl: string,
    file: File
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/pdf');

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.min(100, Math.round((evt.loaded / evt.total) * 100));
          setUploadProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(100);
          resolve();
        } else {
          reject(
            new Error(
              `Cloudflare R2 upload returned HTTP ${xhr.status}. Verify bucket CORS policy allows PUT from this origin.`
            )
          );
        }
      };

      xhr.onerror = () => {
        reject(
          new Error(
            'Network or CORS error uploading PDF to Cloudflare R2. Ensure your R2 bucket CORS policy permits PUT requests.'
          )
        );
      };

      xhr.send(file);
    });
  };

  const handleUploadNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedFile) {
      setFeedback({ type: 'error', text: 'Please select a .pdf file to upload.' });
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setFeedback({ type: 'error', text: 'Only .pdf files are supported.' });
      return;
    }

    const cleanTitle = noteTitle.trim();
    const cleanDesc = noteDescription.trim();
    const sPrice = Number(singlePriceInINR);
    const bPrice = Number(bundlePriceInINR);
    const pages = parseInt(pageCount, 10);

    if (cleanTitle.length < 2 || cleanTitle.length > 160) {
      setFeedback({ type: 'error', text: 'Title must be between 2 and 160 characters.' });
      return;
    }
    if (cleanDesc.length < 2 || cleanDesc.length > 2000) {
      setFeedback({ type: 'error', text: 'Description must be between 2 and 2000 characters.' });
      return;
    }
    if (!Number.isFinite(sPrice) || sPrice < 0 || !Number.isFinite(bPrice) || bPrice < 0) {
      setFeedback({ type: 'error', text: 'Prices must be valid non-negative numbers in INR.' });
      return;
    }
    if (!Number.isInteger(pages) || pages < 1 || pages > 5000) {
      setFeedback({ type: 'error', text: 'Page count must be an integer between 1 and 5000.' });
      return;
    }

    setUploadingNote(true);
    setUploadProgress(0);
    try {
      const idToken = await getIdToken(true);
      if (!idToken) {
        throw new Error('Authentication expired. Please sign in again.');
      }

      // Step 1: Obtain presigned PUT URL from backend
      const presignRes = await fetch('/api/admin/r2-presign-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          section: noteSection,
          fileName: selectedFile.name,
          contentType: 'application/pdf',
          fileSizeBytes: selectedFile.size,
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presignData?.error || 'Could not generate Cloudflare R2 upload URL.');
      }

      // Step 2: Direct browser -> R2 PUT upload with progress bar
      await uploadFileToR2WithProgress(presignData.uploadUrl, selectedFile);

      // Step 3: Atomically save public note metadata + locked private R2 key doc
      const noteId = generateSafeDocId('note', cleanTitle);
      const batch = writeBatch(db);

      batch.set(doc(db, 'notes', noteId), {
        id: noteId,
        title: cleanTitle,
        description: cleanDesc,
        section: noteSection,
        singlePriceInINR: sPrice,
        bundlePriceInINR: bPrice,
        pageCount: pages,
        createdAt: serverTimestamp(),
      });

      batch.set(doc(db, 'notes', noteId, 'private', 'storage'), {
        r2FileKey: presignData.r2FileKey,
        originalFileName: selectedFile.name.slice(0, 255),
        fileSizeBytes: selectedFile.size,
        contentType: 'application/pdf',
        updatedAt: serverTimestamp(),
      });

      try {
        await batch.commit();
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.WRITE, `notes/${noteId}`);
      }

      setFeedback({
        type: 'success',
        text: `"${cleanTitle}" uploaded privately to Cloudflare R2 and published to ${SECTION_LABEL_MAP[noteSection]}!`,
      });
      setNoteTitle('');
      setNoteDescription('');
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to upload note PDF.',
      });
    } finally {
      setUploadingNote(false);
    }
  };

  const handleToggleBundleNote = (noteId: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  const handleCreateBundleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanTitle = bundleTitle.trim();
    const cleanDesc =
      bundleDescription.trim() ||
      `Complete ${SECTION_LABEL_MAP[bundleSection]} handwritten bundle pack including ${selectedNoteIds.length} chapter PDFs.`;
    const bPrice = Number(packPriceInINR);

    if (cleanTitle.length < 2 || cleanTitle.length > 160) {
      setFeedback({ type: 'error', text: 'Bundle title must be between 2 and 160 characters.' });
      return;
    }
    if (!Number.isFinite(bPrice) || bPrice < 0) {
      setFeedback({ type: 'error', text: 'Bundle price must be a valid non-negative number in INR.' });
      return;
    }
    if (selectedNoteIds.length === 0) {
      setFeedback({
        type: 'error',
        text: 'Select at least one uploaded note to include in this bundle pack.',
      });
      return;
    }

    setCreatingBundle(true);
    try {
      const bundleId = generateSafeDocId('bundle', cleanTitle);
      try {
        await setDoc(doc(db, 'bundles', bundleId), {
          id: bundleId,
          title: cleanTitle,
          description: cleanDesc.slice(0, 2000),
          section: bundleSection,
          includedNoteIds: selectedNoteIds,
          bundlePriceInINR: bPrice,
          createdAt: serverTimestamp(),
        });
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.WRITE, `bundles/${bundleId}`);
      }

      setFeedback({
        type: 'success',
        text: `Bundle Pack "${cleanTitle}" (${selectedNoteIds.length} chapters · ₹${bPrice}) published to ${SECTION_LABEL_MAP[bundleSection]}!`,
      });
      setBundleTitle('');
      setBundleDescription('');
      setSelectedNoteIds([]);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to create bundle pack.',
      });
    } finally {
      setCreatingBundle(false);
    }
  };

  const handleDeleteNote = async (noteId: string, title: string) => {
    setFeedback(null);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'notes', noteId, 'private', 'storage'));
      batch.delete(doc(db, 'notes', noteId));
      try {
        await batch.commit();
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.DELETE, `notes/${noteId}`);
      }
      setFeedback({ type: 'success', text: `Deleted note "${title}" from catalog.` });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete note.',
      });
    }
  };

  const handleDeleteBundle = async (bundleId: string, title: string) => {
    setFeedback(null);
    try {
      try {
        await deleteDoc(doc(db, 'bundles', bundleId));
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.DELETE, `bundles/${bundleId}`);
      }
      setFeedback({ type: 'success', text: `Deleted bundle "${title}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete bundle.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#ff6600] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#0c2340]">Verifying Admin Session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="py-16 px-4 bg-slate-50 min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-7 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0c2340] text-[#ff6600] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-[#0c2340] font-heading">
              Kashyap Classes Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Sign in with your authorized Admin Google or Email account to upload R2 note PDFs and create bundle packs.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('Sign in with your authorized Admin account.')}
            className="w-full py-3 px-4 bg-[#ff6600] hover:bg-[#ea580c] text-white text-sm font-black rounded-xl shadow-kc-orange flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In as Admin</span>
          </button>
          <Link
            to="/notes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0c2340]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Notes Storefront</span>
          </Link>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="py-16 px-4 bg-slate-50 min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-red-200 shadow-lg p-7 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-[#0c2340] font-heading">
              Admin Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              You are currently signed in as <strong>{user.email}</strong>, which is not in the authorized admin allowlist.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={logout}
              className="flex-1 py-2.5 px-4 bg-[#0c2340] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Sign Out & Switch Account
            </button>
            <Link
              to="/notes"
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center"
            >
              Back to Notes Store
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14 bg-slate-50 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Top Bar */}
        <div className="bg-[#0c2340] text-white rounded-2xl p-6 border-b-4 border-[#ff6600] shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#ff6600]">
              Protected Admin Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading mt-0.5">
              R2 PDF Notes Upload & Bundle Studio
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Signed in as <strong>{user.email}</strong> · Direct private Cloudflare R2 uploads
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/notes"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </Link>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setActiveTab('upload');
              setFeedback(null);
            }}
            className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white border-[#ff6600] shadow-md'
                : 'bg-slate-100/80 border-slate-200 hover:bg-white text-slate-700'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'upload' ? 'bg-[#ff6600] text-white' : 'bg-white text-[#0c2340]'
              }`}
            >
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#0c2340]">
                1. Upload Single PDF Note
              </h2>
              <p className="text-xs text-slate-500">
                Direct browser-to-R2 presigned upload + Firestore metadata
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('bundle');
              setFeedback(null);
            }}
            className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer ${
              activeTab === 'bundle'
                ? 'bg-white border-[#ff6600] shadow-md'
                : 'bg-slate-100/80 border-slate-200 hover:bg-white text-slate-700'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'bundle' ? 'bg-[#ff6600] text-white' : 'bg-white text-[#0c2340]'
              }`}
            >
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#0c2340]">
                2. Create Bundle Pack
              </h2>
              <p className="text-xs text-slate-500">
                Group uploaded notes per section at a discounted combo price
              </p>
            </div>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-2xl border-2 px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* TAB 1: UPLOAD SINGLE PDF */}
        {activeTab === 'upload' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleUploadNoteSubmit}
              className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4 shadow-xs"
            >
              <h3 className="text-lg font-black text-[#0c2340] font-heading border-b border-slate-100 pb-3">
                Upload New Chapter PDF Note
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Storefront Section
                </label>
                <select
                  value={noteSection}
                  onChange={(e) => setNoteSection(e.target.value as NoteSectionId)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                >
                  {NOTE_SECTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chapter / Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Ch 1: Electric Charges & Fields (Handwritten)"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Syllabus Highlights
                </label>
                <textarea
                  rows={3}
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  placeholder="Includes Gauss's theorem derivations, electric dipole formulas, and 18 solved JEE/CBSE numericals..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Single Price (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={singlePriceInINR}
                    onChange={(e) => setSinglePriceInINR(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bundle Unit Price (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={bundlePriceInINR}
                    onChange={(e) => setBundlePriceInINR(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    step="1"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Handwritten PDF File (.pdf)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center space-y-2">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0c2340] file:text-white hover:file:bg-[#13325b] cursor-pointer"
                    required
                  />
                  {selectedFile && (
                    <p className="text-xs font-semibold text-emerald-700">
                      Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {uploadingNote && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0c2340]">
                    <span>Uploading PDF directly to Cloudflare R2...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ff6600] transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploadingNote}
                className="w-full py-3 px-4 bg-[#ff6600] hover:bg-[#ea580c] text-white text-sm font-black rounded-xl shadow-kc-orange flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {uploadingNote ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>
                  {uploadingNote
                    ? `Uploading (${uploadProgress}%)...`
                    : 'Upload to Private R2 & Publish Note'}
                </span>
              </button>
            </form>

            {/* Uploaded Notes List in Section */}
            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-200 p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#0c2340]">
                  Published in {SECTION_LABEL_MAP[noteSection]}
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {notesInUploadSection.length}
                </span>
              </div>

              {notesInUploadSection.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No notes uploaded in this section yet.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {notesInUploadSection.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#0c2340] truncate flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                          <span className="truncate">{n.title}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Single: ₹{n.singlePriceInINR} · Bundle Rate: ₹{n.bundlePriceInINR} · {n.pageCount}p
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(n.id, n.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* TAB 2: CREATE BUNDLE PACK */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleCreateBundleSubmit}
              className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4 shadow-xs"
            >
              <h3 className="text-lg font-black text-[#0c2340] font-heading border-b border-slate-100 pb-3">
                Create Discounted Bundle Pack
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Section
                </label>
                <select
                  value={bundleSection}
                  onChange={(e) => setBundleSection(e.target.value as NoteSectionId)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                >
                  {NOTE_SECTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bundle Pack Title
                </label>
                <input
                  type="text"
                  value={bundleTitle}
                  onChange={(e) => setBundleTitle(e.target.value)}
                  placeholder="e.g. Complete Class 12 Physics All 14 Chapters Bundle"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bundle Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  placeholder="Full syllabus combo pack with handwritten derivations and solved boards/JEE questions..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bundle Combo Price (INR)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={packPriceInINR}
                    onChange={(e) => setPackPriceInINR(e.target.value)}
                    className="w-44 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                    required
                  />
                  {selectedNoteIds.length > 0 && (
                    <span className="text-xs font-bold text-slate-600">
                      Single notes sum: <strong>₹{selectedSingleTotal}</strong> ({selectedNoteIds.length} selected)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Check Uploaded Notes to Include ({notesInBundleSection.length} available)
                  </label>
                  {notesInBundleSection.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedNoteIds(
                          selectedNoteIds.length === notesInBundleSection.length
                            ? []
                            : notesInBundleSection.map((n) => n.id)
                        )
                      }
                      className="text-[11px] font-bold text-[#ff6600] hover:underline cursor-pointer"
                    >
                      {selectedNoteIds.length === notesInBundleSection.length
                        ? 'Clear All'
                        : 'Select All Chapters'}
                    </button>
                  )}
                </div>

                {notesInBundleSection.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 text-center">
                    Upload at least one Single PDF Note in {SECTION_LABEL_MAP[bundleSection]} first before creating a bundle.
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                    {notesInBundleSection.map((n) => {
                      const checked = selectedNoteIds.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => handleToggleBundleNote(n.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            checked
                              ? 'bg-[#fff7f0] border-[#ff6600] text-[#0c2340] font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {checked ? (
                              <CheckSquare className="w-4 h-4 text-[#ff6600] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{n.title}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 shrink-0">
                            ₹{n.singlePriceInINR}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={creatingBundle || selectedNoteIds.length === 0}
                className="w-full py-3 px-4 bg-[#0c2340] hover:bg-[#ff6600] text-white text-sm font-black rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {creatingBundle ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PackagePlus className="w-4 h-4" />
                )}
                <span>
                  {creatingBundle
                    ? 'Saving Bundle Pack...'
                    : `Save Bundle Pack (${selectedNoteIds.length} Chapters)`}
                </span>
              </button>
            </form>

            {/* Existing Bundles List */}
            <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-200 p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#0c2340]">
                  Bundles in {SECTION_LABEL_MAP[bundleSection]}
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {bundlesInBundleSection.length}
                </span>
              </div>

              {bundlesInBundleSection.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No bundle packs created in this section yet.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {bundlesInBundleSection.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border border-[#fed7aa] bg-[#fff7f0]/50 flex items-start justify-between gap-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#0c2340] truncate">{b.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          ₹{b.bundlePriceInINR} · Includes {b.includedNoteIds.length} chapters
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBundle(b.id, b.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete bundle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPage;
