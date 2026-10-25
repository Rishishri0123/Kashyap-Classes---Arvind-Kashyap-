import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Code2, Award, BookOpen, ExternalLink, Star, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onOpenOwnerPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwnerPanel }) => {
  const phoneNumber = '+91 93507 64376';
  const phoneTel = 'tel:+919350764376';
  const whatsappUrl = 'https://wa.me/919350764376?text=Hello%20Kashyap%20Classes,%20I%20would%20like%20to%20inquire%20about%20Physics%20batches.';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Flat+No.+202+B-1+MP+Enclave+Bank+Enclave+Shastri+Nagar+Ghaziabad+Uttar+Pradesh+201002';

  return (
    <footer className="bg-slate-100 text-slate-700 border-t-2 border-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Institute Branding & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 font-black flex items-center justify-center text-lg shadow-sm border border-blue-900">
                KC
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-950 tracking-tight font-heading leading-tight">
                  Kashyap Classes
                </span>
                <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
                  Physics by Arvind Kashyap (Kashyap Sir)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm font-normal">
              Premier physics coaching institute dedicated to building intuitive conceptual foundations in Mechanics, Electrodynamics, and Modern Physics for CBSE Boards, JEE Main/Advanced, and NEET.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-white border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>20+ Years Mentorship</span>
              </span>
              <span className="bg-white border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-semibold shadow-2xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>4.8 Rating on Google (15+ Reviews)</span>
              </span>
            </div>

            {/* Prominent Developer Recognition Box */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-300 px-3.5 py-1.5 rounded-full shadow-xs">
                <Code2 className="w-4 h-4 text-blue-900" />
                <span className="text-xs font-semibold text-slate-700">
                  Website Created & Developed by <strong className="text-slate-950 font-bold">Rishi Shrivastav</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Course Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Course Programs
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <a href="#courses" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 11 Physics Primer
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 12 Board Numerical
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-blue-900 hover:underline transition-colors">
                  JEE (Main & Advanced) Cohort
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-blue-900 hover:underline transition-colors">
                  NEET 170+ High-Yield Batch
                </a>
              </li>
              <li>
                <a href="#schedules" className="hover:text-blue-900 hover:underline transition-colors">
                  Batch Timetables (100% Offline)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources & NCERT Textbooks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-900" />
              <span>NCERT Physics Hub</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <a href="#ncert-books" className="hover:text-blue-900 hover:underline transition-colors">
                  NCERT Class 11 Part 1 & 2
                </a>
              </li>
              <li>
                <a href="#ncert-books" className="hover:text-blue-900 hover:underline transition-colors">
                  NCERT Class 12 Part 1 & 2
                </a>
              </li>
              <li>
                <a href="#concept-lab" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 12 Wave Optics & YDSE Lab
                </a>
              </li>
              <li>
                <a href="#concept-lab" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 12 Lenz's Law Simulation
                </a>
              </li>
              <li>
                <a href="#concept-lab" className="hover:text-blue-900 hover:underline transition-colors">
                  Interactive Physics Lab
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Address & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Admissions & Center Location
            </h4>
            <div className="space-y-3 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <div className="font-bold text-slate-900">Kashyap Classes (Arvind Kashyap)</div>
                  <div>Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002</div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:underline mt-1"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-900 shrink-0" />
                <a
                  href={phoneTel}
                  className="font-mono font-bold text-slate-900 hover:text-blue-900 transition-colors"
                >
                  {phoneNumber}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-600 font-bold transition-colors"
                >
                  WhatsApp: +91 93507 64376
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="text-slate-600 font-mono">admissions@kashyapclasses.in</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <span>Mon–Sat: 7:00 AM – 8:30 PM (Sun: 8:00 AM – 1:30 PM)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Clean Light Theme & Developer Credit */}
        <div className="mt-12 pt-8 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Discreet Owner Access via subtle copyright lock */}
            <button
              onClick={() => onOpenOwnerPanel && onOpenOwnerPanel()}
              title="Owner Secure Portal"
              className="hover:text-blue-950 transition-colors cursor-pointer text-slate-500 flex items-center gap-1 group"
              aria-label="Owner Access"
            >
              <Lock className="w-3 h-3 opacity-30 group-hover:opacity-80 transition-opacity" />
              <span>© {new Date().getFullYear()} Kashyap Classes.</span>
            </button>
            <span>All rights reserved. Directed by Arvind Kashyap (Kashyap Sir) · Shastri Nagar, Ghaziabad.</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-700">
            <span>Website Designed & Developed by</span>
            <button
              onClick={() => onOpenOwnerPanel && onOpenOwnerPanel()}
              title="Developer Credit (Owner Shortcut: Click to open panel)"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2 py-0.5 rounded-md shadow-2xs transition-colors cursor-pointer"
            >
              Rishi Shrivastav
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
