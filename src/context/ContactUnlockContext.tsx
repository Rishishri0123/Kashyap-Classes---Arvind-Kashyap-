import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lock, Unlock, Phone, MessageSquare, X, CheckCircle, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export interface UnlockedUserData {
  fullName: string;
  phone: string;
  studentClass?: string;
  targetExam?: string;
  email?: string;
  unlockedAt: string;
}

interface ContactUnlockContextType {
  isUnlocked: boolean;
  userData: UnlockedUserData | null;
  phoneNumber: string;
  cleanPhone: string;
  phoneTel: string;
  whatsappUrl: string;
  maskedPhone: string;
  displayPhone: string;
  unlockContact: (data: { fullName: string; phone: string; studentClass?: string; targetExam?: string; email?: string }) => void;
  openUnlockModal: (reason?: string) => void;
  closeUnlockModal: () => void;
  lockContact: () => void;
}

const ContactUnlockContext = createContext<ContactUnlockContextType | undefined>(undefined);

const STORAGE_KEY = 'kashyap_sir_contact_unlocked';

export const ContactUnlockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const rawNumber = '+91 93507 64376';
  const cleanNumber = '919350764376';
  const phoneTel = 'tel:+919350764376';
  const maskedPhone = '+91 93507 •••••';

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [userData, setUserData] = useState<UnlockedUserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalReason, setModalReason] = useState<string>('To connect directly with Arvind Kashyap Sir');

  // Form states inside unlock modal
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [classInput, setClassInput] = useState('11');
  const [examInput, setExamInput] = useState('JEE (Main & Advanced)');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Check localStorage and sessionStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UnlockedUserData = JSON.parse(stored);
        if (parsed.fullName && parsed.phone) {
          setIsUnlocked(true);
          setUserData(parsed);
          return;
        }
      }

      // Also check notes unlocked user in sessionStorage for convenience
      const notesUser = sessionStorage.getItem('kc_unlocked_notes_user');
      if (notesUser) {
        const parsed = JSON.parse(notesUser);
        if (parsed.fullName && parsed.phone) {
          setIsUnlocked(true);
          setUserData({
            fullName: parsed.fullName,
            phone: parsed.phone,
            studentClass: parsed.studentClass,
            email: parsed.email,
            unlockedAt: parsed.unlockedAt || new Date().toISOString(),
          });
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const unlockContact = (data: {
    fullName: string;
    phone: string;
    studentClass?: string;
    targetExam?: string;
    email?: string;
  }) => {
    const payload: UnlockedUserData = {
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      studentClass: data.studentClass || '11',
      targetExam: data.targetExam || 'JEE (Main & Advanced)',
      email: data.email?.trim(),
      unlockedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      // Also sync to notes session storage if not already there
      sessionStorage.setItem('kc_unlocked_notes_user', JSON.stringify(payload));
    } catch {
      // Ignore
    }

    setUserData(payload);
    setIsUnlocked(true);
  };

  const lockContact = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      //
    }
    setIsUnlocked(false);
    setUserData(null);
  };

  const openUnlockModal = (reason?: string) => {
    if (isUnlocked) return;
    if (reason) setModalReason(reason);
    setFormError(null);
    setJustUnlocked(false);
    setIsModalOpen(true);
  };

  const closeUnlockModal = () => {
    setIsModalOpen(false);
    setJustUnlocked(false);
    setFormError(null);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    const cleanDigits = phoneInput.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    // Save lead to backend server
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: nameInput.trim(),
        phone: cleanDigits,
        studentClass: classInput,
        targetExam: examInput,
        course: 'Direct Contact Unlock Form',
        source: 'Contact Unlock Form',
        message: `Unlocked direct contact number: ${modalReason}`,
      }),
    }).catch((err) => {
      console.warn('Failed to sync contact unlock lead:', err);
    });

    unlockContact({
      fullName: nameInput,
      phone: cleanDigits,
      studentClass: classInput,
      targetExam: examInput,
    });

    setIsSubmitting(false);
    setJustUnlocked(true);
  };

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hello Kashyap Sir, I am ${userData?.fullName || 'a student/parent'}. I am contacting you regarding Physics coaching admissions at Kashyap Classes.`
  )}`;

  return (
    <ContactUnlockContext.Provider
      value={{
        isUnlocked,
        userData,
        phoneNumber: rawNumber,
        cleanPhone: cleanNumber,
        phoneTel,
        whatsappUrl,
        maskedPhone,
        displayPhone: isUnlocked ? rawNumber : maskedPhone,
        unlockContact,
        openUnlockModal,
        closeUnlockModal,
        lockContact,
      }}
    >
      {children}

      {/* Quick Unlock Form Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 flex min-h-full items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeUnlockModal();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl my-auto overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 sm:p-6 relative">
              <button
                onClick={closeUnlockModal}
                className="absolute top-4 right-4 p-1.5 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-xs tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Access
                </span>
                <span className="text-xs text-amber-300 font-semibold">Kashyap Classes</span>
              </div>
              <h3 className="text-xl font-black font-heading text-white">
                Unlock Direct Phone Number
              </h3>
              <p className="text-xs text-blue-100 font-normal leading-relaxed mt-1">
                Please enter your details below to reveal <strong>Arvind Kashyap Sir’s</strong> personal phone number and direct WhatsApp line.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {justUnlocked ? (
                /* Success view inside modal */
                <div className="text-center space-y-4 py-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Unlock className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                      Contact Number Unlocked!
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      Welcome, {userData?.fullName}!
                    </h4>
                    <p className="text-xs text-slate-600">
                      Arvind Kashyap Sir’s direct number is now visible across the website:
                    </p>
                  </div>

                  {/* Revealed Number Box */}
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      Direct Personal Helpline:
                    </span>
                    <div className="text-2xl font-black font-mono text-slate-950 tracking-wide">
                      {rawNumber}
                    </div>
                    <span className="text-[11px] text-slate-600 block">
                      Arvind Kashyap (Kashyap Sir) · Shastri Nagar, Ghaziabad
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={phoneTel}
                      className="py-3 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>WhatsApp Sir</span>
                    </a>
                  </div>

                  <button
                    onClick={closeUnlockModal}
                    className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Done & Continue Browsing
                  </button>
                </div>
              ) : (
                /* Form view */
                <form onSubmit={handleModalSubmit} className="space-y-3.5">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-blue-900 shrink-0" />
                    <span>
                      Direct number is currently <strong>locked ({maskedPhone})</strong> to prevent spam.
                    </span>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Student / Parent Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
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
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full pl-11 pr-3 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Current Grade <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={classInput}
                        onChange={(e) => setClassInput(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
                      >
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                        <option value="12-pass">Dropper / Repeater</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Target Exam <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={examInput}
                        onChange={(e) => setExamInput(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-medium"
                      >
                        <option value="JEE (Main & Advanced)">JEE Advanced</option>
                        <option value="JEE Main">JEE Main</option>
                        <option value="NEET UG">NEET UG</option>
                        <option value="CBSE Board 95%+">Class 12 Board</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs sm:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-98 disabled:opacity-50"
                  >
                    <Unlock className="w-4 h-4 text-slate-950" />
                    <span>{isSubmitting ? 'Unlocking...' : 'Unlock Number & Reveal Contact'}</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-500">
                    🔒 We respect your privacy. Details will only be used to answer your inquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </ContactUnlockContext.Provider>
  );
};

export const useContactUnlock = (): ContactUnlockContextType => {
  const context = useContext(ContactUnlockContext);
  if (!context) {
    throw new Error('useContactUnlock must be used within a ContactUnlockProvider');
  }
  return context;
};
