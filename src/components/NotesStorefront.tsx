import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import {
  BookOpen,
  FileText,
  Package,
  ShoppingCart,
  CheckCircle2,
  Lock,
  Loader2,
  Search,
  Sparkles,
  LogIn,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Layers,
  IndianRupee,
} from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import {
  NoteItem,
  BundleItem,
  PurchaseItem,
  NoteSectionId,
  NOTE_SECTIONS,
} from '../types/notesStore';
import { ProtectedPdfModal } from './ProtectedPdfModal';

interface NotesStorefrontProps {
  initialSection?: NoteSectionId;
}

export const NotesStorefront: React.FC<NotesStorefrontProps> = ({ initialSection }) => {
  const { user, isAdmin, openAuthModal, getIdToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramSection = searchParams.get('section') as NoteSectionId | null;
  const resolvedInitialSection: NoteSectionId =
    initialSection ||
    (paramSection && NOTE_SECTIONS.some((s) => s.id === paramSection)
      ? paramSection
      : 'class-12-physics');

  const [activeSection, setActiveSection] = useState<NoteSectionId>(resolvedInitialSection);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Action feedback states
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [openingNoteId, setOpeningNoteId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Protected PDF modal state
  const [pdfModal, setPdfModal] = useState<{
    open: boolean;
    title: string;
    url: string;
    expiresInSeconds: number;
  }>({
    open: false,
    title: '',
    url: '',
    expiresInSeconds: 900,
  });

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    } else if (paramSection && NOTE_SECTIONS.some((s) => s.id === paramSection)) {
      setActiveSection(paramSection);
    }
  }, [initialSection, paramSection]);

  const handleSelectSection = (sectionId: NoteSectionId) => {
    setActiveSection(sectionId);
    setSearchQuery('');
    setStatusBanner(null);
    const meta = NOTE_SECTIONS.find((s) => s.id === sectionId);
    if (meta) {
      navigate(meta.routeSlug, { replace: false });
    } else {
      setSearchParams({ section: sectionId });
    }
  };

  // Subscribe to public notes catalog
  useEffect(() => {
    setLoadingCatalog(true);
    const notesQuery = query(collection(db, 'notes'), orderBy('createdAt', 'asc'));
    const unsubNotes = onSnapshot(
      notesQuery,
      (snapshot) => {
        const list: NoteItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<NoteItem, 'id'>),
        }));
        setNotes(list);
        setLoadingCatalog(false);
      },
      (err) => {
        setLoadingCatalog(false);
        handleFirestoreError(err, OperationType.GET, 'notes');
      }
    );

    const bundlesQuery = query(collection(db, 'bundles'), orderBy('createdAt', 'desc'));
    const unsubBundles = onSnapshot(
      bundlesQuery,
      (snapshot) => {
        const list: BundleItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<BundleItem, 'id'>),
        }));
        setBundles(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'bundles');
      }
    );

    return () => {
      unsubNotes();
      unsubBundles();
    };
  }, []);

  // Subscribe to logged-in student's purchases
  useEffect(() => {
    if (!user) {
      setPurchases([]);
      return;
    }

    const purchasesQuery = query(
      collection(db, 'purchases'),
      where('userId', '==', user.uid)
    );

    const unsubPurchases = onSnapshot(
      purchasesQuery,
      (snapshot) => {
        const list: PurchaseItem[] = snapshot.docs.map((docSnap) => ({
          purchaseId: docSnap.id,
          ...(docSnap.data() as Omit<PurchaseItem, 'purchaseId'>),
        }));
        setPurchases(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'purchases');
      }
    );

    return () => unsubPurchases();
  }, [user]);

  // Compute all owned note IDs for current user
  const ownedNoteIds = useMemo(() => {
    const owned = new Set<string>();
    purchases.forEach((p) => {
      if (Array.isArray(p.unlockedNoteIds)) {
        p.unlockedNoteIds.forEach((id) => owned.add(id));
      }
    });
    return owned;
  }, [purchases]);

  const activeSectionMeta = useMemo(
    () => NOTE_SECTIONS.find((s) => s.id === activeSection) || NOTE_SECTIONS[1],
    [activeSection]
  );

  const sectionNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((note) => {
      if (note.section !== activeSection) return false;
      if (!q) return true;
      return (
        note.title.toLowerCase().includes(q) ||
        note.description.toLowerCase().includes(q)
      );
    });
  }, [notes, activeSection, searchQuery]);

  const allSectionNotesMap = useMemo(() => {
    const map = new Map<string, NoteItem>();
    notes.forEach((n) => map.set(n.id, n));
    return map;
  }, [notes]);

  const sectionBundles = useMemo(
    () => bundles.filter((b) => b.section === activeSection),
    [bundles, activeSection]
  );

  const countsBySection = useMemo(() => {
    const counts: Record<NoteSectionId, { notes: number; bundles: number }> = {
      'class-11-physics': { notes: 0, bundles: 0 },
      'class-12-physics': { notes: 0, bundles: 0 },
      jee: { notes: 0, bundles: 0 },
    };
    notes.forEach((n) => {
      if (counts[n.section]) counts[n.section].notes += 1;
    });
    bundles.forEach((b) => {
      if (counts[b.section]) counts[b.section].bundles += 1;
    });
    return counts;
  }, [notes, bundles]);

  // Dynamically load Razorpay script if async tag hasn't finished yet
  const ensureRazorpayLoaded = async (): Promise<boolean> => {
    if (window.Razorpay) return true;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay Checkout SDK'));
      document.body.appendChild(script);
    });
    return Boolean(window.Razorpay);
  };

  // Razorpay Checkout flow for both Single Notes and Bundles
  const handleCheckout = async (itemType: 'single' | 'bundle', itemId: string) => {
    setStatusBanner(null);

    if (!user) {
      openAuthModal('Sign in to purchase notes and link PDF access permanently to your account.');
      return;
    }

    setProcessingItemId(itemId);
    try {
      const idToken = await getIdToken(true);
      if (!idToken) {
        openAuthModal('Please sign in again to complete checkout.');
        return;
      }

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ itemType, itemId }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData?.error || 'Could not initiate payment order.');
      }

      if (orderData.freeUnlocked) {
        setStatusBanner({
          type: 'success',
          text: 'Notes unlocked for your account! Click "Open PDF" to start reading.',
        });
        return;
      }

      const sdkReady = await ensureRazorpayLoaded();
      if (!sdkReady || !window.Razorpay) {
        throw new Error('Razorpay payment window could not be initialized.');
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Kashyap Classes',
        description: orderData.itemTitle || 'Handwritten Physics Notes PDF',
        order_id: orderData.orderId,
        prefill: {
          name: user.displayName || '',
          email: user.email || '',
        },
        theme: {
          color: '#ff6600',
        },
        handler: async (paymentResponse) => {
          try {
            const freshToken = await getIdToken(true);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${freshToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                itemType,
                itemId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData?.error || 'Payment verification failed.');
            }
            setStatusBanner({
              type: 'success',
              text: `Payment verified! ${verifyData.unlockedNoteIds?.length || 1} PDF note(s) unlocked cleanly.`,
            });
          } catch (verifyErr) {
            setStatusBanner({
              type: 'error',
              text:
                verifyErr instanceof Error
                  ? verifyErr.message
                  : 'Payment completed but verification failed.',
            });
          } finally {
            setProcessingItemId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingItemId(null);
          },
        },
      });

      rzp.on('payment.failed', (resp: unknown) => {
        const errDesc =
          (resp as { error?: { description?: string } })?.error?.description ||
          'Razorpay payment was not completed.';
        setStatusBanner({ type: 'error', text: errDesc });
        setProcessingItemId(null);
      });

      rzp.open();
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Checkout failed. Please try again.',
      });
      setProcessingItemId(null);
    }
  };

  // Protected 15-minute expiring R2 link viewer
  const handleOpenPdf = async (note: NoteItem) => {
    setStatusBanner(null);

    if (!user) {
      openAuthModal('Sign in with the student account that owns this note to open its PDF.');
      return;
    }

    setOpeningNoteId(note.id);
    try {
      const idToken = await getIdToken();
      if (!idToken) {
        openAuthModal('Please sign in again to open your PDF.');
        return;
      }

      const res = await fetch('/api/get-pdf-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ noteId: note.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Could not generate protected PDF link.');
      }

      setPdfModal({
        open: true,
        title: data.title || note.title,
        url: data.url,
        expiresInSeconds: Number(data.expiresInSeconds) || 900,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to open PDF.',
      });
    } finally {
      setOpeningNoteId(null);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Storefront Intro + Student Session Bar */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff6600]">
              <BookOpen className="w-4 h-4" />
              <span>Arvind Kashyap Sir · Handwritten Digital Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0c2340] font-heading tracking-tight">
              Physics Notes Storefront — Single Chapters & Combo Bundles
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Switch between <strong>Class 11 Physics Notes</strong>,{' '}
              <strong>Class 12 Physics Notes</strong>, and <strong>JEE Notes</strong>. Every unlocked note automatically switches to <strong>Open PDF</strong> with 15-minute encrypted access links.
            </p>
          </div>

          {/* Auth / Admin Status Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[270px] flex flex-col gap-2.5 shrink-0">
            {user ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Signed In Student</span>
                    </p>
                    <p className="text-xs font-extrabold text-[#0c2340] truncate">
                      {user.displayName || user.email}
                    </p>
                  </div>
                  <span className="text-[11px] font-black bg-[#0c2340] text-white px-2.5 py-1 rounded-lg shrink-0">
                    {ownedNoteIds.size} Owned
                  </span>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="w-full py-2 px-3 bg-[#ff6600] hover:bg-[#ea580c] text-white text-xs font-black rounded-xl text-center transition-colors"
                  >
                    Open Admin Upload & Bundle Studio →
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-[#0c2340]">
                  Sign in to access purchased PDFs or checkout with Razorpay
                </p>
                <button
                  onClick={() => openAuthModal('Sign in to view your unlocked PDFs or purchase notes.')}
                  className="w-full py-2.5 px-4 bg-[#0c2340] hover:bg-[#13325b] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#ff6600]" />
                  <span>Student Sign In / Register</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Three Dedicated Section Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {NOTE_SECTIONS.map((sec) => {
            const isActive = sec.id === activeSection;
            const secCount = countsBySection[sec.id];
            return (
              <button
                key={sec.id}
                onClick={() => handleSelectSection(sec.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'bg-[#0c2340] text-white border-[#ff6600] shadow-lg'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-[#0c2340] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-1.5 ${
                        isActive
                          ? 'bg-[#ff6600] text-white'
                          : 'bg-slate-100 text-[#0c2340]'
                      }`}
                    >
                      {sec.badge}
                    </span>
                    <h2 className="text-lg font-black font-heading leading-tight">
                      {sec.label}
                    </h2>
                  </div>
                  <Layers
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-[#ff6600]' : 'text-slate-400'
                    }`}
                  />
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    isActive ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {sec.tagline}
                </p>

                <div
                  className={`pt-2.5 border-t flex items-center justify-between text-[11px] font-bold ${
                    isActive
                      ? 'border-white/15 text-amber-300'
                      : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span>{secCount.notes} Single PDFs</span>
                  <span>{secCount.bundles} Bundle Packs</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Notification Banner */}
        {statusBanner && (
          <div
            className={`rounded-2xl border-2 px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs ${
              statusBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusBanner.text}</span>
          </div>
        )}

        {/* Active Section Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0c2340] font-heading">
              {activeSectionMeta.label}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              {activeSectionMeta.description}
            </p>
          </div>
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeSectionMeta.shortLabel}...`}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
            />
          </div>
        </div>

        {loadingCatalog ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#ff6600] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#0c2340]">
              Loading {activeSectionMeta.label} catalog from Firestore...
            </p>
          </div>
        ) : (
          <>
            {/* 1. BUNDLE NOTES SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#ff6600]" />
                  <h3 className="text-lg sm:text-xl font-black text-[#0c2340] font-heading">
                    Bundle Notes (Discounted Combo Packs)
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {sectionBundles.length} Pack{sectionBundles.length === 1 ? '' : 's'}
                </span>
              </div>

              {sectionBundles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs sm:text-sm text-slate-500">
                  No bundle packs published in {activeSectionMeta.label} yet.
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="ml-2 font-bold text-[#ff6600] hover:underline"
                    >
                      Create a Bundle Pack →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {sectionBundles.map((bundle) => {
                    const includedNotes = bundle.includedNoteIds
                      .map((id) => allSectionNotesMap.get(id))
                      .filter((n): n is NoteItem => Boolean(n));
                    const individualTotal = includedNotes.reduce(
                      (sum, n) => sum + (Number(n.singlePriceInINR) || 0),
                      0
                    );
                    const savingsPercent =
                      individualTotal > bundle.bundlePriceInINR && individualTotal > 0
                        ? Math.round(
                            ((individualTotal - bundle.bundlePriceInINR) / individualTotal) * 100
                          )
                        : 0;
                    const allIncludedOwned =
                      bundle.includedNoteIds.length > 0 &&
                      bundle.includedNoteIds.every((id) => ownedNoteIds.has(id));
                    const isProcessing = processingItemId === bundle.id;

                    return (
                      <div
                        key={bundle.id}
                        className="bg-white rounded-2xl border-2 border-[#fed7aa] shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between gap-5"
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-[#fff7f0] text-[#ff6600] border border-[#fed7aa] px-2.5 py-1 rounded-lg">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Complete Section Bundle</span>
                            </span>
                            {savingsPercent > 0 && (
                              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                                Save {savingsPercent}% vs Single Notes
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="text-lg sm:text-xl font-black text-[#0c2340] font-heading">
                              {bundle.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                              {bundle.description}
                            </p>
                          </div>

                          {/* Included Chapters Preview */}
                          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2">
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0c2340]">
                              Includes {bundle.includedNoteIds.length} Handwritten Chapter PDFs:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {bundle.includedNoteIds.map((nid) => {
                                const noteObj = allSectionNotesMap.get(nid);
                                const isOwned = ownedNoteIds.has(nid) || isAdmin;
                                return (
                                  <div
                                    key={nid}
                                    className="flex items-center justify-between gap-2 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                                  >
                                    <span className="truncate font-semibold text-slate-800">
                                      {noteObj ? noteObj.title : nid}
                                    </span>
                                    {isOwned && noteObj ? (
                                      <button
                                        onClick={() => handleOpenPdf(noteObj)}
                                        className="text-[10px] font-black text-emerald-700 hover:underline shrink-0 cursor-pointer"
                                      >
                                        Open
                                      </button>
                                    ) : (
                                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-[#0c2340] font-heading">
                                ₹{bundle.bundlePriceInINR}
                              </span>
                              {individualTotal > bundle.bundlePriceInINR && (
                                <span className="text-xs font-bold text-slate-400 line-through">
                                  ₹{individualTotal}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Instant unlock of all {bundle.includedNoteIds.length} chapters
                            </p>
                          </div>

                          {allIncludedOwned ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>All Bundle Notes Unlocked</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCheckout('bundle', bundle.id)}
                              disabled={isProcessing}
                              className="px-5 py-3 bg-[#ff6600] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-black rounded-xl shadow-kc-orange flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ShoppingCart className="w-4 h-4" />
                              )}
                              <span>
                                {isProcessing
                                  ? 'Preparing Order...'
                                  : `Buy Bundle · ₹${bundle.bundlePriceInINR}`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. SINGLE NOTES SECTION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0c2340]" />
                  <h3 className="text-lg sm:text-xl font-black text-[#0c2340] font-heading">
                    Single Notes (Individual Chapter PDFs)
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {sectionNotes.length} Chapter{sectionNotes.length === 1 ? '' : 's'}
                </span>
              </div>

              {sectionNotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                  <FileText className="w-9 h-9 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-[#0c2340]">
                    {searchQuery
                      ? `No chapter notes matching "${searchQuery}" in ${activeSectionMeta.label}.`
                      : `No single chapter PDFs uploaded in ${activeSectionMeta.label} yet.`}
                  </p>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ff6600] hover:bg-[#ea580c] text-white text-xs font-black rounded-xl shadow-kc-orange"
                    >
                      Upload First PDF Note in Admin Studio →
                    </Link>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Notes uploaded by Arvind Kashyap Sir via the Admin Panel appear here automatically.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionNotes.map((note) => {
                    const isOwned = ownedNoteIds.has(note.id) || isAdmin;
                    const isBuying = processingItemId === note.id;
                    const isOpening = openingNoteId === note.id;

                    return (
                      <div
                        key={note.id}
                        className={`bg-white rounded-2xl border-2 p-5 flex flex-col justify-between gap-4 transition-all shadow-2xs hover:shadow-md ${
                          isOwned ? 'border-emerald-300' : 'border-slate-200 hover:border-[#0c2340]'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-extrabold text-[#0c2340] bg-slate-100 px-2.5 py-0.5 rounded-md">
                              {note.pageCount} Pages · PDF
                            </span>
                            {isOwned ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{ownedNoteIds.has(note.id) ? 'Unlocked' : 'Admin Access'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <Lock className="w-3 h-3" />
                                <span>Protected PDF</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-black text-[#0c2340] font-heading leading-snug">
                            {note.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {note.description}
                          </p>
                        </div>

                        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1 text-lg font-black text-[#0c2340] font-heading">
                              <IndianRupee className="w-4 h-4 text-[#ff6600]" />
                              <span>{note.singlePriceInINR}</span>
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500">
                              Bundle rate: ₹{note.bundlePriceInINR}/chapter
                            </p>
                          </div>

                          {isOwned ? (
                            <button
                              onClick={() => handleOpenPdf(note)}
                              disabled={isOpening}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                            >
                              {isOpening ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ExternalLink className="w-3.5 h-3.5" />
                              )}
                              <span>{isOpening ? 'Opening...' : 'Open PDF'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckout('single', note.id)}
                              disabled={isBuying}
                              className="px-4 py-2.5 bg-[#0c2340] hover:bg-[#ff6600] text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                            >
                              {isBuying ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ShoppingCart className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {isBuying
                                  ? 'Loading...'
                                  : `Buy Single Note`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Protected 15-Minute Expiring PDF Modal */}
      <ProtectedPdfModal
        isOpen={pdfModal.open}
        onClose={() => setPdfModal((prev) => ({ ...prev, open: false }))}
        title={pdfModal.title}
        pdfUrl={pdfModal.url}
        expiresInSeconds={pdfModal.expiresInSeconds}
      />
    </section>
  );
};
