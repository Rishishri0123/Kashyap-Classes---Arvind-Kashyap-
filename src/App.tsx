import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EnrollmentInquiryModal } from './components/EnrollmentInquiryModal';
import { FloatingContactBar } from './components/FloatingContactBar';
import { AiCounselorBot } from './components/AiCounselorBot';
import { OwnerPanel } from './components/OwnerPanel';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateAndDownloadBrochure } from './utils/brochureDownload';
import { ContactUnlockProvider } from './context/ContactUnlockContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';

// Code-split dedicated pages so traffic & bundle weight stay distributed across routes
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SchedulesPage = lazy(() => import('./pages/SchedulesPage'));
const NcertPage = lazy(() => import('./pages/NcertPage'));
const ConceptLabPage = lazy(() => import('./pages/ConceptLabPage'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const InquiryPage = lazy(() => import('./pages/InquiryPage'));

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Kashyap Classes - Premier Physics by Arvind Kashyap',
  '/programs': 'Course Programs (Class 11, 12, JEE & NEET) | Kashyap Classes',
  '/courses': 'Course Programs (Class 11, 12, JEE & NEET) | Kashyap Classes',
  '/notes': 'Physics Notes Storefront (Class 11, 12 & JEE) | Kashyap Classes',
  '/notes/class-11': 'Class 11 Physics Notes | Kashyap Classes',
  '/notes/class-12': 'Class 12 Physics Notes | Kashyap Classes',
  '/notes/jee': 'JEE Physics Notes | Kashyap Classes',
  '/class-12-notes': 'Class 12 Physics Notes | Kashyap Classes',
  '/admin': 'Admin Upload & Bundle Studio | Kashyap Classes',
  '/schedules': 'Batch Schedules & Timetables | Kashyap Classes',
  '/ncert': 'Official NCERT Physics Books Hub | Kashyap Classes',
  '/ncert-hub': 'Official NCERT Physics Books Hub | Kashyap Classes',
  '/lab': 'Interactive Physics Concept Simulation Lab | Kashyap Classes',
  '/concept-lab': 'Interactive Physics Concept Simulation Lab | Kashyap Classes',
  '/location': 'Center Location & Google Maps (Shastri Nagar) | Kashyap Classes',
  '/map': 'Center Location & Google Maps (Shastri Nagar) | Kashyap Classes',
  '/center': 'Center Location & Google Maps (Shastri Nagar) | Kashyap Classes',
  '/about': 'About Arvind Kashyap (Kashyap Sir) | Kashyap Classes',
  '/mentor': 'About Arvind Kashyap (Kashyap Sir) | Kashyap Classes',
  '/inquiry': 'Admissions Inquiry & FAQs | Kashyap Classes',
  '/enroll': 'Admissions Inquiry & FAQs | Kashyap Classes',
};

function ScrollAndTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const title = ROUTE_TITLES[pathname.toLowerCase()] || ROUTE_TITLES['/'];
    document.title = title;
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <Loader2 className="w-8 h-8 text-[#ff6600] animate-spin mb-3" />
      <p className="text-sm font-bold text-[#0c2340]">Loading page...</p>
      <p className="text-xs text-slate-500 mt-1">Kashyap Classes · Shastri Nagar, Ghaziabad</p>
    </div>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState('Free 2-Hour Live Physics Trial Class');
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Listen for Google Maps Platform quota exhaustion events across child components
  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Check URL hash (#owner or ?owner=true) and listen for changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#owner' || search.includes('owner=true')) {
        setOwnerPanelOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Keyboard shortcut: Ctrl + Shift + K or Ctrl + Shift + O
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'K' || e.key === 'k' || e.key === 'O' || e.key === 'o') {
          e.preventDefault();
          setOwnerPanelOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenInquiry = (initialCourse?: string) => {
    if (initialCourse) {
      setModalCourse(initialCourse);
    }
    setModalOpen(true);
  };

  const handleCloseInquiry = () => {
    setModalOpen(false);
  };

  const handleCloseOwnerPanel = () => {
    setOwnerPanelOpen(false);
    if (window.location.hash.toLowerCase() === '#owner') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ContactUnlockProvider>
          <BrowserRouter>
            <ScrollAndTitleManager />
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
              {quotaExceeded && (
                <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center z-50 shadow-sm">
                  <span>
                    Google Maps Platform quota reached. If you are the app owner, visit{' '}
                    <a
                      href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-amber-950 hover:text-amber-800"
                    >
                      maps developer site
                    </a>{' '}
                    for instructions to update your account.
                  </span>
                </div>
              )}

              {/* Pinned Top Bar Navigation */}
              <Header onOpenInquiry={handleOpenInquiry} />

              {/* Dedicated Page Routes */}
              <main className="flex-1 pb-16 sm:pb-12">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage onOpenInquiry={handleOpenInquiry} />} />

                    <Route path="/programs" element={<ProgramsPage onOpenInquiry={handleOpenInquiry} />} />
                    <Route path="/courses" element={<Navigate to="/programs" replace />} />

                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/notes/class-11" element={<NotesPage section="class-11-physics" />} />
                    <Route path="/notes/class-12" element={<NotesPage section="class-12-physics" />} />
                    <Route path="/notes/jee" element={<NotesPage section="jee" />} />
                    <Route path="/class-12-notes" element={<Navigate to="/notes/class-12" replace />} />

                    <Route path="/admin" element={<AdminPage />} />

                    <Route path="/schedules" element={<SchedulesPage onOpenInquiry={handleOpenInquiry} />} />

                    <Route path="/ncert" element={<NcertPage onOpenInquiry={handleOpenInquiry} />} />
                    <Route path="/ncert-hub" element={<Navigate to="/ncert" replace />} />

                    <Route path="/lab" element={<ConceptLabPage />} />
                    <Route path="/concept-lab" element={<Navigate to="/lab" replace />} />

                    <Route path="/location" element={<LocationPage onOpenInquiry={handleOpenInquiry} />} />
                    <Route path="/map" element={<Navigate to="/location" replace />} />
                    <Route path="/center" element={<Navigate to="/location" replace />} />

                    <Route path="/about" element={<AboutPage onOpenInquiry={handleOpenInquiry} />} />
                    <Route path="/mentor" element={<Navigate to="/about" replace />} />

                    <Route path="/inquiry" element={<InquiryPage initialCourse={modalCourse} />} />
                    <Route path="/enroll" element={<Navigate to="/inquiry" replace />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Footer with Discreet Owner Access Trigger */}
              <Footer onOpenOwnerPanel={() => setOwnerPanelOpen(true)} />

              {/* Kashyap AI Sahayak Virtual Counselor Bot */}
              <AiCounselorBot
                onOpenInquiry={handleOpenInquiry}
                onDownloadBrochure={generateAndDownloadBrochure}
              />

              {/* Floating Action Bar: Direct Call, WhatsApp & Free Trial */}
              <FloatingContactBar onOpenInquiry={handleOpenInquiry} />

              {/* Interactive Quick Enrollment / Free Trial Modal */}
              <EnrollmentInquiryModal
                isOpen={modalOpen}
                onClose={handleCloseInquiry}
                initialCourse={modalCourse}
              />

              {/* Firebase Auth Modal (Google Sign-In + Email/Password) */}
              <AuthModal />

              {/* Owner Admin Panel (Hidden from public; accessed via #owner, Ctrl+Shift+K, or discreet footer trigger) */}
              <OwnerPanel
                isOpen={ownerPanelOpen}
                onClose={handleCloseOwnerPanel}
              />
            </div>
          </BrowserRouter>
        </ContactUnlockProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
