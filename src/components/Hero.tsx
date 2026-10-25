import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Award, Sparkles, Star, Code2, FileText, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  const physicsTopics = [
    { label: 'Mechanics & Vectors' },
    { label: 'Rotational Dynamics' },
    { label: 'Electrodynamics' },
    { label: 'Wave & Ray Optics' },
    { label: 'Modern Physics' },
  ];

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 text-slate-900 pt-6 sm:pt-10 lg:pt-12 pb-14 sm:pb-16 border-b border-slate-200"
    >
      {/* Subtle Light Physics Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      {/* Soft radiant ambient glow blobs for depth */}
      <div
        className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-subtle"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-6 left-10 w-[300px] h-[300px] bg-amber-100/60 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-subtle"
        aria-hidden="true"
      />

      {/* Floating Animated Physics Formula Badges in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-5 hidden md:block" aria-hidden="true">
        <div className="absolute top-14 left-[8%] bg-white/85 backdrop-blur-xs border border-blue-200/80 px-3 py-1.5 rounded-full shadow-sm text-xs font-mono font-bold text-blue-900 animate-float-slow">
          ⚡ ∮ B · dl = μ₀ I
        </div>
        <div className="absolute top-28 right-[12%] bg-white/85 backdrop-blur-xs border border-amber-200/80 px-3 py-1.5 rounded-full shadow-sm text-xs font-mono font-bold text-amber-900 animate-float-slow-reverse">
          ✨ λ = h / mv (de Broglie)
        </div>
        <div className="absolute bottom-20 left-[18%] bg-white/85 backdrop-blur-xs border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-sm text-xs font-mono font-bold text-emerald-900 animate-float-slow">
          🧲 ε = -dΦ/dt (Faraday)
        </div>
        <div className="absolute bottom-28 right-[24%] bg-white/85 backdrop-blur-xs border border-indigo-200/80 px-3 py-1.5 rounded-full shadow-sm text-xs font-mono font-bold text-indigo-900 animate-float-slow-reverse">
          ⚛ E_max = hν - Φ₀
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero 2-column split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
            
            {/* Top Prestige Kicker with High-Contrast Solid Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <span className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 font-black animate-pulse-subtle">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Premier Physics Institute</span>
              </span>
              <span className="bg-blue-100 text-blue-950 border border-blue-300 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                <span>⭐ 4.8 Google Rating</span>
              </span>
              <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Shastri Nagar, Ghaziabad</span>
              </span>
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded font-bold flex items-center gap-1.5 shadow-2xs">
                <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Developed by Rishi Shrivastav</span>
              </span>
            </div>

            {/* Live Admission Status Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100/90 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 shadow-2xs w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>2025–26 Batches Open · Strictly Limited 25 Seats per Batch</span>
            </div>

            {/* Main Headline - Crisp Dark Slate with Royal Blue & Amber Accent */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-950 tracking-tight leading-[1.16] font-heading">
              Master Physics with <span className="text-blue-900 underline decoration-amber-400 decoration-wavy decoration-3 font-black">Deep Concept Clarity</span>, Not Blind Formulas.
            </h1>

            {/* Subtitle - High-Contrast Dark Slate Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
              Struggling with multi-concept numericals or fear of physics? <strong className="text-slate-950 font-bold">Arvind Kashyap (Kashyap Sir)</strong> transforms abstract physical mechanics and electromagnetic fields into intuitive visual mental models—enabling students to dominate competitive entrance exams.
            </p>

            {/* Core Mastery Topics Pill Ribbon */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-blue-950 font-extrabold uppercase tracking-wider text-[11px]">Core Syllabus:</span>
              {physicsTopics.map((topic) => (
                <span
                  key={topic.label}
                  className="bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-[11px] shadow-2xs hover:border-blue-400 hover:text-blue-900 transition-all hover:scale-105"
                >
                  {topic.label}
                </span>
              ))}
            </div>

            {/* Key Academic Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-xs sm:text-sm text-slate-800 font-medium">
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-900 font-bold">100% In-Person Classes with Arvind Kashyap</span>
              </div>
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-900 font-bold">Strict 25–30 Small Batches for Individual Care</span>
              </div>
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-900 font-bold">Daily Problem Practice (DPP) & Doubt Desk</span>
              </div>
              <div className="flex items-start gap-2.5 group">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-900 font-bold">Board 98%+ Derivations + Top JEE/NEET Ranks</span>
              </div>
            </div>

            {/* Action Buttons: Responsive for Mobile & Desktop */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => onOpenInquiry('Free 2-Hour Live Physics Trial Class')}
                className="shimmer-button-wrap px-6 py-3.5 text-xs sm:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98 ring-2 ring-amber-400/60 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>Book Free Trial Demo Class</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="#class12-notes"
                className="px-5 py-3.5 text-xs sm:text-sm font-bold text-white bg-blue-950 hover:bg-blue-900 border border-blue-900 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-98 hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Class 12 Notes (All 14 Ch)</span>
              </a>

              <a
                href="#ncert-books"
                className="px-4 py-3.5 text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-950 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-slate-400 active:scale-98 hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-blue-900" />
                <span>NCERT Books & Hub</span>
              </a>
            </div>

          </div>

          {/* Right Column: Kashyap Sir Featured Photo & Solid Light Info Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="card-hover-lift rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-xl ring-4 ring-blue-50/80">
              
              <div className="relative bg-slate-100 overflow-hidden group">
                <img
                  src="/assets/aistudio/kashyap_sir.jpg"
                  alt="Arvind Kashyap (Kashyap Sir) - Lead Physics Mentor"
                  className="w-full h-72 sm:h-96 lg:h-[420px] object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                />

                {/* Floating Top Badges */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-amber-400/80 text-slate-950 px-3 py-1 rounded-xl shadow-md text-xs font-black flex items-center gap-1.5 animate-pulse-subtle">
                  <Award className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>20+ Years Mentorship</span>
                </div>

                <div className="absolute top-3 left-3 bg-blue-950 text-white px-2.5 py-1 rounded-xl shadow-md text-[11px] font-bold flex items-center gap-1">
                  <span>⭐ 4.8 / 5.0 Google</span>
                </div>
              </div>

              {/* Dedicated High-Contrast Info Card Below Photo */}
              <div className="p-5 bg-white text-slate-900 space-y-2.5 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Founder & Lead Physics Mentor · Kashyap Classes</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-heading">
                  Arvind Kashyap (Kashyap Sir)
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-amber-400 pl-3 leading-relaxed font-medium">
                  "Physics is intuitive when taught through diagrams and first principles. Every student can score 95%+ once fear is replaced with clarity."
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free 2-Hour Trial Available</span>
                  </span>
                  <button
                    onClick={() => onOpenInquiry('Free 2-Hour Live Physics Trial Class')}
                    className="text-blue-900 hover:text-blue-700 font-bold underline cursor-pointer"
                  >
                    Reserve Demo Slot →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4-Column KPI proof strip with Crisp Light Theme Cards & Hover Lift */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div className="card-hover-lift space-y-1 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs hover:border-blue-400 cursor-default">
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tabular-nums font-heading">
                20+ Years
              </div>
              <div className="text-xs font-bold text-slate-700">
                Of Dedicated Physics Mentorship
              </div>
            </div>

            <div className="card-hover-lift space-y-1 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs hover:border-blue-400 cursor-default">
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tabular-nums font-heading">
                4,200+
              </div>
              <div className="text-xs font-bold text-slate-700">
                IIT, NIT & Govt Medical Selections
              </div>
            </div>

            <div className="card-hover-lift space-y-1 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs hover:border-blue-400 cursor-default">
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tabular-nums font-heading">
                4.8 ★ Rating
              </div>
              <div className="text-xs font-bold text-slate-700">
                Verified Student Reviews on Google
              </div>
            </div>

            <div className="card-hover-lift space-y-1 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs hover:border-blue-400 cursor-default">
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tabular-nums font-heading">
                1-on-1 Care
              </div>
              <div className="text-xs font-bold text-slate-700">
                Daily In-Person Doubt Desk
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
