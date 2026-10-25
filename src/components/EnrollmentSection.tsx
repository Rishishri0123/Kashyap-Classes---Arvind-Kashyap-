import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, MessageSquare, AlertCircle, Download, Check, FileText } from 'lucide-react';
import { generateAndDownloadBrochure } from '../utils/brochureDownload';

interface EnrollmentSectionProps {
  initialCourse?: string;
}

export const EnrollmentSection: React.FC<EnrollmentSectionProps> = ({ initialCourse = '' }) => {
  const phoneNumber = '+91 93507 64376';
  const cleanPhone = '919350764376';
  const phoneTel = 'tel:+919350764376';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('11');
  const [targetExam, setTargetExam] = useState('JEE (Main & Advanced)');
  const [selectedCourse, setSelectedCourse] = useState(initialCourse || 'Class 11 Physics Foundation & Primer');
  const [preferredMode, setPreferredMode] = useState<'Offline Classroom' | 'Hybrid'>('Offline Classroom');
  const [wantsDemoClass, setWantsDemoClass] = useState(true);
  const [message, setMessage] = useState('');
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  const handleBrochureDownload = () => {
    setDownloadingBrochure(true);
    generateAndDownloadBrochure();
    setTimeout(() => {
      setDownloadingBrochure(false);
    }, 2500);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter student’s full name';
    
    const userPhoneClean = phone.replace(/[^0-9]/g, '');
    if (!userPhoneClean || userPhoneClean.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const inqId = `KC-2026-${randomNum}`;
    setSubmittedInquiryId(inqId);

    // Persist to server backend for Owner Panel
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        studentClass,
        targetExam,
        course: selectedCourse,
        source: 'Enrollment Form',
        wantsDemo: wantsDemoClass,
        message: message.trim() || undefined,
      }),
    }).catch((err) => {
      console.warn('Inquiry background sync warning:', err);
    });
  };

  const handleReset = () => {
    setSubmittedInquiryId(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setErrors({});
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Kashyap Sir,\nI would like to inquire about admission for Kashyap Classes (Ref #${submittedInquiryId || 'NEW'}).\nStudent Name: ${fullName || 'Student'}\nClass: ${studentClass}th\nTarget Exam: ${targetExam}\nSelected Course: ${selectedCourse}\nPlease share batch timings & seat availability.`
  );

  return (
    <section id="enrollment" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-950">
            <span>Admission Desk & Demo Class</span>
            <span aria-hidden="true">·</span>
            <span>Session 2026–2027</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
            Easy Enrollment & Academic Counseling Inquiry
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Reserve your seat or register for a <strong>Free Trial Demo Class</strong> with Arvind Kashyap (Kashyap Sir). Need instant assistance or course details? Download our official course brochure or call us at <strong className="text-slate-900">{phoneNumber}</strong>.
          </p>

          {/* Quick Direct Connect and Download Brochure Ribbon */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* Download Course Brochure Button */}
            <button
              onClick={handleBrochureDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all shadow-2xs active:scale-98 cursor-pointer"
            >
              {downloadingBrochure ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Brochure Downloaded (PDF)</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-blue-950" />
                  <span>Download Course Brochure (PDF)</span>
                </>
              )}
            </button>

            <a
              href={phoneTel}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-2xs active:scale-98"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Direct Call: {phoneNumber}</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Kashyap Sir, I want to inquire about admissions at Kashyap Classes.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-2xs active:scale-98"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          {submittedInquiryId ? (
            /* Success confirmation panel */
            <div className="bg-white p-8 rounded-2xl border border-emerald-200 space-y-6 text-center animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Inquiry Received Successfully
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  Thank You, {fullName}!
                </h3>
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-semibold text-slate-700">
                  Reference ID: {submittedInquiryId}
                </div>
                <p className="text-sm text-slate-600 max-w-lg mx-auto pt-1 leading-relaxed">
                  Your seat reservation request for <strong className="text-slate-900">{selectedCourse}</strong> ({targetExam}) has been logged. Kashyap Sir’s admission desk will contact you at <strong className="text-slate-900">{phone}</strong> within 2 hours.
                </p>
              </div>

              {/* Direct call, WhatsApp & Brochure download actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Instantly on WhatsApp</span>
                </a>

                <a
                  href={phoneTel}
                  className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call {phoneNumber}</span>
                </a>

                <button
                  onClick={handleBrochureDownload}
                  className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-900" />
                  <span>Download Course Brochure</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                Center Address: Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002 · Helpline: {phoneNumber}
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Student Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                  {errors.fullName && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    WhatsApp / Calling Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Email Address (For Study Materials & Brochure)
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Student Class / Grade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Current Class / Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="11">Class 11 (Foundation & Core)</option>
                    <option value="12">Class 12 (Board & Numerical Mastery)</option>
                    <option value="12-passed">Class 12 Passed (Dropper / Repeater Batch)</option>
                  </select>
                </div>

                {/* Target Competitive Exam */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Target Exam <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="JEE (Main & Advanced)">JEE (Main & Advanced)</option>
                    <option value="NEET UG Medical">NEET UG Medical</option>
                    <option value="CBSE / ISC Board 95%+ Focus">CBSE / ISC Board 95%+ Focus</option>
                    <option value="Both JEE & Board Integrated">Both JEE & Board Integrated</option>
                    <option value="Physics Olympiad (NSEP / INPhO)">Physics Olympiad (NSEP / INPhO)</option>
                  </select>
                </div>

                {/* Interested Course Program */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Program Interested In <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="Class 11 Physics Foundation & Primer">Class 11 Physics Foundation & Primer</option>
                    <option value="Class 12 Board & Numerical Mastery">Class 12 Board & Numerical Mastery</option>
                    <option value="JEE (Main & Advanced) Physics Intensive">JEE (Main & Advanced) Physics Intensive</option>
                    <option value="NEET Physics High-Yield Accelerator">NEET Physics High-Yield Accelerator</option>
                    <option value="Free 2-Hour Live Physics Trial Class">Free 2-Hour Live Physics Trial Class</option>
                  </select>
                </div>

              </div>

              {/* Mode of Learning */}
              {/* 100% In-Person Physical Classroom Policy */}
              <div className="p-4 bg-blue-50/90 border-2 border-blue-300 rounded-xl flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-black text-sm">
                  🏛️
                </div>
                <div>
                  <div className="text-xs font-black text-blue-950 uppercase tracking-wider">
                    100% In-Person Physical Classroom Only
                  </div>
                  <div className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                    All lectures and evening doubt desks are held strictly in-person at our coaching center with Arvind Kashyap Sir. We do not provide online classes or recordings to ensure high-focus, distraction-free preparation.
                  </div>
                </div>
              </div>

              {/* Demo Class Toggle */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="demo-checkbox"
                  checked={wantsDemoClass}
                  onChange={(e) => setWantsDemoClass(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-blue-900 rounded cursor-pointer"
                />
                <label htmlFor="demo-checkbox" className="text-xs text-amber-950 cursor-pointer">
                  <span className="font-bold text-amber-900 block">Include Free Demo Class Invitation</span>
                  Check this to receive a pass for a 2-hour interactive offline demo lecture with Arvind Kashyap before completing fee payment.
                </label>
              </div>

              {/* Specific query text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Any Specific Question for Kashyap Sir? (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. I struggle with rotational mechanics numericals; will there be special foundation classes?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              {/* Action Buttons: Submit Form & Download Course Brochure */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-4 text-sm font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Enrollment Inquiry / Book Demo</span>
                </button>

                <button
                  type="button"
                  onClick={handleBrochureDownload}
                  className="w-full sm:w-auto px-5 py-4 text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {downloadingBrochure ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-blue-950" />
                      <span>Download Course Brochure</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
                <span>✓ 100% Privacy Protected</span>
                <span aria-hidden="true">·</span>
                <span>✓ Direct Counseling Callback</span>
                <span aria-hidden="true">·</span>
                <span>✓ Detailed Syllabus & Fee Structure in Brochure</span>
                <span aria-hidden="true">·</span>
                <span>✓ Helpline: {phoneNumber}</span>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};
