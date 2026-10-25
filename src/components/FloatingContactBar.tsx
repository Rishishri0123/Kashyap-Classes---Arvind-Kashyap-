import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Sparkles, ArrowUp } from 'lucide-react';

interface FloatingContactBarProps {
  onOpenInquiry?: (course?: string) => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onOpenInquiry }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const cleanPhone = '919350764376';
  const phoneNumber = '+91 93507 64376';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20Kashyap%20Sir,%20I%20would%20like%20to%20inquire%20about%20Physics%20classes%20and%20Free%20Trial%20Demo%20at%20Kashyap%20Classes.`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Speed Actions & Navigation"
      className="fixed bottom-4 right-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2"
    >
      {/* 1. Go to Top Button (Smooth scroll to top with high contrast) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-blue-950 hover:bg-slate-900 text-amber-400 rounded-full shadow-xl border-2 border-amber-400/80 transition-all duration-200 active:scale-90 cursor-pointer animate-fade-in hover:scale-105"
          title="Scroll to Top"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* 2. Direct Phone Call Button - Small & Compact */}
      <a
        href={`tel:+${cleanPhone}`}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-blue-950 hover:bg-blue-900 text-white rounded-full shadow-lg border border-blue-800 transition-all duration-200 active:scale-90 hover:scale-110"
        title={`Call directly: ${phoneNumber}`}
        aria-label="Call admissions helpline"
      >
        <Phone className="w-3.5 h-3.5 text-amber-400 fill-current" />
      </a>

      {/* 3. Direct WhatsApp Chat Button - Small & Compact with Pulse Ring */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg border border-emerald-500 transition-all duration-200 active:scale-90 hover:scale-110 relative"
        title="Chat on WhatsApp (+91 93507 64376)"
        aria-label="WhatsApp admissions chat"
      >
        <MessageSquare className="w-3.5 h-3.5 fill-current" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
      </a>

      {/* 4. Free Trial Button - Small & Compact Pill with Shimmer */}
      <button
        onClick={() => {
          if (onOpenInquiry) {
            onOpenInquiry('Free 2-Hour Live Physics Trial Class');
          } else {
            const el = document.getElementById('enrollment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="shimmer-button-wrap h-8 sm:h-9 px-3 flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-lg transition-all duration-200 active:scale-95 border border-amber-300 cursor-pointer ring-2 ring-amber-400/50 hover:scale-105"
        title="Book Free 2-Hour Live Physics Trial Class"
      >
        <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
        <span className="font-extrabold text-[11px] sm:text-xs">Free Trial</span>
      </button>
    </aside>
  );
};
