import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Award, Sparkles, Star, Layers } from 'lucide-react';

interface HeroProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-b from-[#f0f5fa] via-white to-[#fffaf5] text-slate-900 pt-8 sm:pt-12 lg:pt-14 pb-14 sm:pb-20 border-b border-slate-200"
    >
      {/* Subtle Light Physics Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(12, 35, 64, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(12, 35, 64, 0.05) 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
        aria-hidden="true"
      />

      {/* Ambient Depth Radial Spotlights (Navy + Logo Orange Aura) */}
      <div
        className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-blue-100/60 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-orange-100/60 rounded-full blur-[110px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Discrete Physics Formula Watermarks in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-5 hidden xl:block" aria-hidden="true">
        <div className="absolute top-16 left-[6%] bg-white/85 border border-blue-200 px-3 py-1 rounded-full text-xs font-mono font-medium text-[#0c2340] shadow-2xs">
          ∮ B · dl = μ₀ I
        </div>
        <div className="absolute top-28 right-[10%] bg-white/85 border border-orange-200 px-3 py-1 rounded-full text-xs font-mono font-medium text-[#ff6600] shadow-2xs">
          λ = h / mv (de Broglie)
        </div>
        <div className="absolute bottom-20 left-[12%] bg-white/85 border border-blue-200 px-3 py-1 rounded-full text-xs font-mono font-medium text-[#0c2340] shadow-2xs">
          ε = -dΦ/dt (Faraday)
        </div>
        <div className="absolute bottom-28 right-[18%] bg-white/85 border border-orange-200 px-3 py-1 rounded-full text-xs font-mono font-medium text-[#ff6600] shadow-2xs">
          E_max = hν - Φ₀
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero 2-column split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6 animate-slide-up">
            
            {/* Elegant Editorial Kicker with Logo Orange & Navy */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <span className="font-extrabold text-[#ff6600] flex items-center gap-1.5 bg-[#fff7f0] border border-[#fed7aa] px-2.5 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 fill-[#ff6600] text-[#ff6600]" />
                <span>Premier Physics Institute</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Session 2026–27 Open</span>
              </span>
            </div>

            {/* Main Headline - Balanced Typography with Logo Accent Colors */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-950 tracking-tight leading-[1.14] font-heading">
              Master Physics with <span className="text-[#0c2340]">Deep Concept</span> <span className="text-[#ff6600] underline decoration-[#ff6600]/40 decoration-wavy decoration-3">Clarity</span>, Not Blind Formulas.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
              Struggling with multi-concept numericals or abstract formulas? <strong className="text-[#0c2340] font-bold">Arvind Kashyap (Kashyap Sir)</strong> deconstructs mechanics, rotation, and electrodynamics into visual mental models—enabling students to dominate CBSE Boards, JEE, and NEET.
            </p>

            {/* Core Mastery Highlights - Styled with Logo Colors */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Specialization:</span>
              <span className="px-2.5 py-1 rounded-md bg-[#fff7f0] border border-[#fed7aa] text-[#0c2340] font-bold text-xs hover:border-[#ff6600] transition-all duration-200 cursor-default">Mechanics & Rotation</span>
              <span className="px-2.5 py-1 rounded-md bg-[#fff7f0] border border-[#fed7aa] text-[#0c2340] font-bold text-xs hover:border-[#ff6600] transition-all duration-200 cursor-default">Electrodynamics</span>
              <span className="px-2.5 py-1 rounded-md bg-[#fff7f0] border border-[#fed7aa] text-[#0c2340] font-bold text-xs hover:border-[#ff6600] transition-all duration-200 cursor-default">Wave & Ray Optics</span>
              <span className="px-2.5 py-1 rounded-md bg-[#fff7f0] border border-[#fed7aa] text-[#0c2340] font-bold text-xs hover:border-[#ff6600] transition-all duration-200 cursor-default">Modern Physics</span>
            </div>

            {/* Key Academic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-xs sm:text-sm text-slate-800 font-medium">
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-slate-900 font-bold">100% In-Person Classes with Kashyap Sir</span>
              </div>
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-slate-900 font-bold">Strict 25-Student Batches for Personal Focus</span>
              </div>
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-slate-900 font-bold">Daily In-Person Doubt Desk (5:30 – 8 PM)</span>
              </div>
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-slate-900 font-bold">Complete NCERT & Derivations Mastery</span>
              </div>
            </div>

            {/* Primary Action Buttons - Logo Orange & Navy */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => onOpenInquiry('Free 2-Hour Live Physics Trial Class')}
                className="shimmer-button-wrap px-6 py-3.5 text-xs sm:text-sm font-black text-white bg-[#ff6600] hover:bg-[#ea580c] rounded-xl shadow-kc-orange transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#ff771a] hover:-translate-y-1"
              >
                <Sparkles className="w-4 h-4 text-white fill-current animate-pulse-subtle" />
                <span>Book Free Trial Demo Class</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <Link
                to="/programs"
                className="px-5 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#0c2340] hover:bg-[#071527] border border-[#0c2340] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 hover:-translate-y-1 hover:shadow-md"
              >
                <Layers className="w-4 h-4 text-[#ff6600]" />
                <span>Explore Course Programs</span>
              </Link>

              <Link
                to="/ncert"
                className="px-4 py-3.5 text-xs sm:text-sm font-bold text-[#0c2340] hover:text-[#ff6600] bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#ff6600] rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 hover:-translate-y-1 hover:shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-[#0c2340]" />
                <span>NCERT Hub</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Kashyap Sir Faculty Showcase Card with Logo Accents */}
          <div className="lg:col-span-5 flex flex-col justify-center animate-slide-up">
            <div className="card-hover-lift rounded-3xl overflow-hidden border-2 border-[#0c2340]/15 bg-white shadow-xl ring-2 ring-[#ff6600]/20">
              
              {/* Sir's Enhanced Studio Portrait */}
              <div className="relative bg-[#071527] overflow-hidden group">
                <img
                  src="/assets/aistudio/kashyap_sir.jpg"
                  alt="Arvind Kashyap (Kashyap Sir) - Lead Physics Mentor"
                  className="w-full h-80 sm:h-96 lg:h-[430px] object-cover object-top transition-transform duration-500 ease-out group-hover:scale-102"
                />

                {/* Subtle Gradient Vignette at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071527] via-transparent to-transparent pointer-events-none" />

                {/* Prestige Floating Badges in Logo Orange */}
                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs border border-[#ff6600]/80 text-[#0c2340] px-3 py-1 rounded-xl shadow-md text-xs font-black flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#ff6600] fill-current" />
                  <span>20+ Years Mentorship</span>
                </div>

                <div className="absolute top-3.5 left-3.5 bg-[#0c2340]/90 backdrop-blur-xs text-white border border-[#14325c] px-2.5 py-1 rounded-xl shadow-md text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#ff6600] fill-current" />
                  <span>4.8 / 5.0 Google</span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-[#ff6600] font-black block">Lead Physics Mentor</span>
                  <span className="text-xl sm:text-2xl font-black font-heading tracking-tight block">Arvind Kashyap</span>
                </div>
              </div>

              {/* Dedicated High-Contrast Info Card Below Photo */}
              <div className="p-5 bg-white text-slate-900 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0c2340]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Founder & Lead Physics Mentor · Kashyap Classes</span>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-[#ff6600] pl-3 leading-relaxed font-medium">
                  "Physics is intuitive when taught through diagrams and first principles. Every student can score 95%+ once fear is replaced with clarity."
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free 2-Hour Trial Available</span>
                  </span>
                  <button
                    onClick={() => onOpenInquiry('Free 2-Hour Live Physics Trial Class')}
                    className="text-[#ff6600] hover:text-[#ea580c] font-black underline cursor-pointer"
                  >
                    Reserve Demo Slot →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4-Column KPI proof strip with Logo Colors */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div className="card-hover-lift p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6600] shadow-2xs transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0c2340] to-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] tabular-nums font-heading">
                20+ Years
              </div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">
                Dedicated Classroom Physics Mentorship
              </div>
            </div>

            <div className="card-hover-lift p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6600] shadow-2xs transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0c2340] to-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] tabular-nums font-heading">
                4,200+
              </div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">
                IIT, NIT & Govt Medical Selections
              </div>
            </div>

            <div className="card-hover-lift p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6600] shadow-2xs transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0c2340] to-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl sm:text-3xl font-black text-[#ff6600] tabular-nums font-heading">
                4.8 ★ Rating
              </div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">
                Verified Student Reviews on Google
              </div>
            </div>

            <div className="card-hover-lift p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6600] shadow-2xs transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0c2340] to-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl sm:text-3xl font-black text-[#0c2340] tabular-nums font-heading">
                1-on-1 Care
              </div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">
                Daily In-Person Doubt Desk (5:30 – 8 PM)
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
