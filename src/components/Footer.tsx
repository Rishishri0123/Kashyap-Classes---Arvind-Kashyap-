import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageSquare, Code2, Award, BookOpen, ExternalLink, Star, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { useContactUnlock } from '../context/ContactUnlockContext';
import {
  CENTER_ADDRESS,
  CENTER_DIRECTOR,
  CENTER_NAME,
  buildGoogleMapsSearchUrl,
} from '../config/centerLocation';

interface FooterProps {
  onOpenOwnerPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwnerPanel }) => {
  const {
    isUnlocked,
    phoneNumber,
    phoneTel,
    whatsappUrl,
    maskedPhone,
    openUnlockModal,
  } = useContactUnlock();
  const mapsUrl = buildGoogleMapsSearchUrl();

  return (
    <footer className="bg-slate-100 text-slate-700 border-t-2 border-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Institute Branding & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/kashyap_classes_logo.png"
                alt="Kashyap Classes Official Logo"
                className="w-12 h-12 rounded-xl object-contain shadow-xs border border-slate-200 bg-white p-1 shrink-0"
              />
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
                <Link to="/programs" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 11 Physics Primer
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 12 Board Numerical
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-blue-900 hover:underline transition-colors">
                  JEE (Main & Advanced) Cohort
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-blue-900 hover:underline transition-colors">
                  NEET 170+ High-Yield Batch
                </Link>
              </li>
              <li>
                <Link to="/schedules" className="hover:text-blue-900 hover:underline transition-colors">
                  Batch Timetables (100% Offline)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources & Notes Storefront */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-900" />
              <span>Notes Store & NCERT</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link to="/notes/class-11" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 11 Physics Notes
                </Link>
              </li>
              <li>
                <Link to="/notes/class-12" className="hover:text-blue-900 hover:underline transition-colors">
                  Class 12 Physics Notes
                </Link>
              </li>
              <li>
                <Link to="/notes/jee" className="hover:text-blue-900 hover:underline transition-colors">
                  JEE Main & Advanced Notes
                </Link>
              </li>
              <li>
                <Link to="/ncert" className="hover:text-blue-900 hover:underline transition-colors">
                  NCERT Textbooks Hub
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-900 hover:underline transition-colors">
                  Admin Upload Studio
                </Link>
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
                  <div className="font-bold text-slate-900">{CENTER_NAME} ({CENTER_DIRECTOR.split(' (')[0]})</div>
                  <div>{CENTER_ADDRESS}</div>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <Link
                      to="/location"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff6600] hover:underline"
                    >
                      <span>Interactive Center Map</span>
                    </Link>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:underline"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-900 shrink-0" />
                {isUnlocked ? (
                  <a
                    href={phoneTel}
                    className="font-mono font-bold text-slate-900 hover:text-blue-900 transition-colors"
                  >
                    {phoneNumber}
                  </a>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-600">{maskedPhone}</span>
                    <button
                      onClick={() => openUnlockModal('To view Kashyap Sir’s direct telephone number')}
                      className="text-[10px] font-bold text-blue-900 bg-amber-200/90 hover:bg-amber-300 px-2 py-0.5 rounded border border-amber-300 cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Unlock Number</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                {isUnlocked ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-600 font-bold transition-colors"
                  >
                    WhatsApp: {phoneNumber}
                  </a>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-xs">WhatsApp: {maskedPhone}</span>
                    <button
                      onClick={() => openUnlockModal('To unlock direct WhatsApp chat with Arvind Kashyap Sir')}
                      className="text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded border border-emerald-300 cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Unlock</span>
                    </button>
                  </div>
                )}
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
