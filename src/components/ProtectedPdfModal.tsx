import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Clock, FileText, ShieldCheck } from 'lucide-react';

interface ProtectedPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  expiresInSeconds: number;
}

export const ProtectedPdfModal: React.FC<ProtectedPdfModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  expiresInSeconds,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(expiresInSeconds);

  useEffect(() => {
    setSecondsLeft(expiresInSeconds);
  }, [expiresInSeconds, pdfUrl]);

  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, secondsLeft]);

  if (!isOpen || !pdfUrl) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedCountdown = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <div className="bg-white rounded-2xl border-2 border-slate-700 shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#0c2340] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#ff6600] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#ff6600] text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="pdf-viewer-title"
                className="text-sm sm:text-base font-black font-heading truncate"
              >
                {title}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-0.5">
                <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Student Access
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-amber-300 font-bold">
                  <Clock className="w-3 h-3" />
                  Link expires in {formattedCountdown}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Full Tab</span>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#ff6600] text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close PDF viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          {secondsLeft === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Clock className="w-10 h-10 text-[#ff6600]" />
              <p className="text-base font-bold text-[#0c2340]">
                Temporary 15-Minute PDF Session Expired
              </p>
              <p className="text-xs text-slate-600 max-w-md">
                For security, signed PDF links expire after 15 minutes. Close this window and click &ldquo;Open PDF&rdquo; again to generate a fresh link.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#0c2340] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              title={title}
              className="w-full h-full border-0 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};
