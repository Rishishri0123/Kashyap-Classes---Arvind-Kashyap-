import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AcademicFeatures } from './components/AcademicFeatures';
import { CoursesSection } from './components/CoursesSection';
import { ScheduleSection } from './components/ScheduleSection';
import { NcertBooksSection } from './components/NcertBooksSection';
import { Class12NotesSection } from './components/Class12NotesSection';
import { GoogleMapsSection } from './components/GoogleMapsSection';
import { AboutMentor } from './components/AboutMentor';
import { InteractiveConceptResolver } from './components/InteractiveConceptResolver';
import { TestimonialsSection } from './components/TestimonialsSection';
import { EnrollmentSection } from './components/EnrollmentSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { EnrollmentInquiryModal } from './components/EnrollmentInquiryModal';
import { FloatingContactBar } from './components/FloatingContactBar';
import { AiCounselorBot } from './components/AiCounselorBot';
import { OwnerPanel } from './components/OwnerPanel';
import { generateAndDownloadBrochure } from './utils/brochureDownload';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState('Free 2-Hour Live Physics Trial Class');
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);

  // Check URL hash (#owner or #admin or ?owner=true) and listen for changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#owner' || hash === '#admin' || search.includes('owner=true')) {
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
    if (window.location.hash.toLowerCase() === '#owner' || window.location.hash.toLowerCase() === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Header onOpenInquiry={handleOpenInquiry} />

      {/* Main Page Flow with bottom spacing so floating buttons never obstruct content */}
      <main className="flex-1 pb-16 sm:pb-12">
        {/* Hero Section */}
        <Hero onOpenInquiry={handleOpenInquiry} />

        {/* Academic Advantage: 6 Pillars of Excellence */}
        <AcademicFeatures onOpenInquiry={handleOpenInquiry} />

        {/* Courses Offered: Class 11, Class 12, JEE, NEET */}
        <CoursesSection onOpenInquiry={handleOpenInquiry} />

        {/* Course Schedules & Batch Timetables (No seats counter, no dates/times) */}
        <ScheduleSection onOpenInquiry={handleOpenInquiry} />

        {/* Official Class 12 Handwritten Physics Notes Archive (14 Chapters) */}
        <Class12NotesSection />

        {/* Official NCERT Physics Books & PDF Hub */}
        <NcertBooksSection onOpenInquiry={handleOpenInquiry} />

        {/* Arvind Kashyap (Kashyap Sir) Pedagogy & Methodology */}
        <AboutMentor onOpenInquiry={handleOpenInquiry} />

        {/* Interactive Physics Concept Resolver / Simulation Sandbox */}
        <InteractiveConceptResolver />

        {/* Dedicated Physical Center & Google Maps Location */}
        <GoogleMapsSection onOpenInquiry={handleOpenInquiry} />

        {/* Student Testimonials & Hall of Fame Ranks */}
        <TestimonialsSection />

        {/* Easy Enrollment Inquiry Form (In-page) */}
        <EnrollmentSection initialCourse={modalCourse} />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer with Discreet Owner Access Trigger */}
      <Footer onOpenOwnerPanel={() => setOwnerPanelOpen(true)} />

      {/* Kashyap AI Sahayak Virtual Counselor Bot */}
      <AiCounselorBot
        onOpenInquiry={handleOpenInquiry}
        onDownloadBrochure={generateAndDownloadBrochure}
      />

      {/* Floating Action Bar: Direct Call, WhatsApp & Free Trial (No ? sign) */}
      <FloatingContactBar onOpenInquiry={handleOpenInquiry} />

      {/* Interactive Quick Enrollment / Free Trial Modal */}
      <EnrollmentInquiryModal
        isOpen={modalOpen}
        onClose={handleCloseInquiry}
        initialCourse={modalCourse}
      />

      {/* Owner Admin Panel (Hidden from public; accessed via #owner, Ctrl+Shift+K, or discreet footer trigger) */}
      <OwnerPanel
        isOpen={ownerPanelOpen}
        onClose={handleCloseOwnerPanel}
      />
    </div>
  );
}
