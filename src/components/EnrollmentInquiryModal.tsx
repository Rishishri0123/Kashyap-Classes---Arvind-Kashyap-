import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageSquare, AlertCircle, Send, Phone } from 'lucide-react';

interface EnrollmentInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: string;
}

export const EnrollmentInquiryModal: React.FC<EnrollmentInquiryModalProps> = ({
  isOpen,
  onClose,
  initialCourse = '',
}) => {
  const phoneNumber = '+91 93507 64376';
  const cleanPhone = '919350764376';
  const phoneTel = 'tel:+919350764376';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentClass, setStudentClass] = useState('11');
  const [targetExam, setTargetExam] = useState('JEE (Main & Advanced)');
  const [course, setCourse] = useState(initialCourse || 'Class 11 Physics Foundation & Primer');
  const [wantsDemo, setWantsDemo] = useState(true);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourse) {
      setCourse(initialCourse);
    }
  }, [initialCourse]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide student full name');
      return;
    }
    const cleanPhoneInput = phone.replace(/[^0-9]/g, '');
    if (!cleanPhoneInput || cleanPhoneInput.length < 10) {
      setError('Please provide a valid 10-digit mobile number');
      return;
    }

    setError(null);
    const inqCode = `KC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedId(inqCode);

    // Persist to server backend for Owner Panel
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        phone: cleanPhoneInput,
        studentClass,
        targetExam,
        course,
        wantsDemo,
        source: 'Quick Modal',
      }),
    }).catch((err) => {
      console.warn('Inquiry background sync warning:', err);
    });
  };

  const handleReset = () => {
    setSubmittedId(null);
    setFullName('');
    setPhone('');
    setError(null);
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Kashyap Sir, I submitted an admission inquiry (#${submittedId || 'NEW'}) for ${course} (Class ${studentClass}th, Target: ${targetExam}). Please share admission details.`
  );

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 flex min-h-full items-center justify-center animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleReset();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 sm:p-6 relative shrink-0 border-b border-blue-900/50">
          {/* Close Button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 pr-8">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-xs tracking-wider">
                Admission Desk
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                Session 2026–27
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight pt-1">
              Enrollment & Trial Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
              Personal mentorship under <strong className="text-amber-300 font-bold">Arvind Kashyap (Kashyap Sir)</strong> · Shastri Nagar Center
            </p>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4 max-h-[calc(100vh-10rem)]">
          {submittedId ? (
            /* Confirmation dialog inside modal */
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                  Seat Reservation Registered
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                  Inquiry Logged for {fullName}
                </h3>
                <div className="text-xs font-mono font-bold text-blue-950 bg-blue-50 px-3 py-1 rounded-md inline-block border border-blue-200">
                  Reference ID: {submittedId}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto pt-1 leading-relaxed">
                  Kashyap Sir’s admission desk will contact you at <strong className="text-slate-900">{phone}</strong> within 2 hours. Need faster confirmation? Tap below:
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Confirm Instantly via WhatsApp</span>
                </a>

                <a
                  href={phoneTel}
                  className="w-full py-3 px-4 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call Center: {phoneNumber}</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Done / Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Modal Form */
            <div className="space-y-4">
              {/* Quick Call Notice */}
              <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs">
                <span className="text-slate-700 font-semibold">Prefer talking directly?</span>
                <a
                  href={phoneTel}
                  className="font-black text-blue-950 hover:underline flex items-center gap-1.5 font-mono bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{phoneNumber}</span>
                </a>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Gupta"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Mobile Number (Calling & WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Current Grade <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
                    >
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                      <option value="12-pass">Dropper / Target</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Target Exam <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
                    >
                      <option value="JEE (Main & Advanced)">JEE Advanced</option>
                      <option value="JEE Main">JEE Main Only</option>
                      <option value="NEET UG">NEET Medical</option>
                      <option value="CBSE Board 95%+">Class 12 Board</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Selected Course / Program
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2.5 text-xs text-amber-950">
                  <input
                    type="checkbox"
                    id="modal-demo"
                    checked={wantsDemo}
                    onChange={(e) => setWantsDemo(e.target.checked)}
                    className="w-4 h-4 accent-blue-900 rounded cursor-pointer"
                  />
                  <label htmlFor="modal-demo" className="cursor-pointer font-bold">
                    Include 1 Free Demo Class with Arvind Kashyap (100% Offline)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-xs sm:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-3 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Submit Seat Inquiry</span>
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
