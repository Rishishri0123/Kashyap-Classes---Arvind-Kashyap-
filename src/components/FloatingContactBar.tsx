import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, Sparkles, ArrowUp, Lock, Check } from 'lucide-react';
import { useContactUnlock } from '../context/ContactUnlockContext';

interface FloatingContactBarProps {
  onOpenInquiry?: (course?: string) => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onOpenInquiry }) => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isUnlocked, phoneNumber, phoneTel, whatsappUrl, openUnlockModal } = useContactUnlock();

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

      {/* 2. Direct Phone Call Button - Unlocks upon details entry */}
      {isUnlocked ? (
        <a
          href={phoneTel}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-blue-950 hover:bg-blue-900 text-white rounded-full shadow-lg border border-blue-800 transition-all duration-200 active:scale-90 hover:scale-110 relative"
          title={`Call Arvind Kashyap directly: ${phoneNumber}`}
          aria-label={`Call admissions helpline: ${phoneNumber}`}
        >
          <Phone className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
            <Check className="w-2 h-2 text-white stroke-[3]" />
          </span>
        </a>
      ) : (
        <button
          onClick={() => openUnlockModal('To call Arvind Kashyap Sir directly')}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-blue-950 hover:bg-blue-900 text-white rounded-full shadow-lg border border-blue-800 transition-all duration-200 active:scale-90 hover:scale-110 relative cursor-pointer"
          title="Unlock Arvind Kashyap Sir's Direct Phone Number (Enter Details)"
          aria-label="Unlock Kashyap Sir's direct phone number"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400 fill-current opacity-80" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black shadow-xs ring-1 ring-white">
            <Lock className="w-2 h-2 stroke-[3]" />
          </span>
        </button>
      )}

      {/* 3. Direct WhatsApp Chat Button - Unlocks upon details entry */}
      {isUnlocked ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg border border-emerald-500 transition-all duration-200 active:scale-90 hover:scale-110 relative"
          title={`Chat on WhatsApp with Kashyap Sir (${phoneNumber})`}
          aria-label="WhatsApp admissions chat"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
        </a>
      ) : (
        <button
          onClick={() => openUnlockModal('To chat directly on WhatsApp with Arvind Kashyap Sir')}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-full shadow-lg border border-emerald-500 transition-all duration-200 active:scale-90 hover:scale-110 relative cursor-pointer"
          title="Unlock Direct WhatsApp Chat with Kashyap Sir (Enter Details)"
          aria-label="Unlock direct WhatsApp chat with Kashyap Sir"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current opacity-80" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff6600] text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-xs ring-1 ring-white">
            <Lock className="w-2 h-2 stroke-[3]" />
          </span>
        </button>
      )}

      {/* 4. Free Trial Button - Small & Compact Pill with Logo Orange & Shimmer */}
      <button
        onClick={() => {
          if (onOpenInquiry) {
            onOpenInquiry('Free 2-Hour Live Physics Trial Class');
          } else {
            navigate('/inquiry');
          }
        }}
        className="shimmer-button-wrap h-8 sm:h-9 px-3.5 flex items-center gap-1.5 text-xs font-black text-white bg-[#ff6600] hover:bg-[#ea580c] rounded-full shadow-kc-orange transition-all duration-200 active:scale-95 border border-[#ff771a] cursor-pointer hover:scale-105"
        title="Book Free 2-Hour Live Physics Trial Class"
      >
        <Sparkles className="w-3.5 h-3.5 text-white fill-current animate-pulse-subtle" />
        <span className="font-extrabold text-[11px] sm:text-xs tracking-tight">Free Trial</span>
      </button>
    </aside>
  );
};
