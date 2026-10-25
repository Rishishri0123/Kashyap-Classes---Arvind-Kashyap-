import React from 'react';
import { CheckCircle2, Award, BookOpen, Clock, Users, Shield, Sparkles, FileText, Video, HelpCircle } from 'lucide-react';

interface AcademicFeaturesProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const AcademicFeatures: React.FC<AcademicFeaturesProps> = ({ onOpenInquiry }) => {
  const features = [
    {
      title: 'Daily 1:1 Doubt Counters',
      desc: 'No student leaves with an unresolved concept. Dedicated evening sessions (5:30 PM - 8:00 PM) directly with Arvind Kashyap.',
      icon: HelpCircle,
      badge: 'Personal Attention',
    },
    {
      title: 'Strict 25–30 Batch Cap',
      desc: 'Small cohorts enable Kashyap Sir to personally check homework notebooks, identify calculation errors, and track individual progress.',
      icon: Users,
      badge: 'Zero Crowd Policy',
    },
    {
      title: 'Exhaustive Study Modules',
      desc: '12-volume physics study kits combining NCERT deep dives, graded Daily Problem Practice (DPP), and 20 years of JEE & NEET papers.',
      icon: BookOpen,
      badge: '100% Free with Admission',
    },
    {
      title: 'Weekly CBT & OMR Tests',
      desc: 'Chapter-wise and full-length simulated mock tests mimicking exact NTA JEE Computer-Based and NEET OMR exam environments.',
      icon: FileText,
      badge: 'Instant Rank Analytics',
    },
    {
      title: 'Board Step-Marking Mastery',
      desc: 'Dual preparation ensures Class 11 & 12 students master NCERT derivations and presentation style for 95%+ school board scores.',
      icon: Award,
      badge: 'Board & Entrance Dual Focus',
    },
    {
      title: '100% In-Person Physical Coaching',
      desc: 'No impersonal screens or recorded videos. Pure, immersive offline classroom lectures with direct eye contact, active chalkboard derivations, and real-time guidance.',
      icon: Shield,
      badge: 'Strictly In-Person',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950">
            <span>The Academic Advantage</span>
            <span aria-hidden="true">·</span>
            <span>Why Serious Students Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading [text-wrap:balance]">
            Coaching Built for Results, Not Commercial Crowds
          </h2>
          <p className="text-slate-700 text-base leading-relaxed font-normal">
            Unlike commercial factories where hundreds of students sit in auditorium halls listening to junior tutors, Kashyap Classes operates on an intensive, mentorship-driven academy model.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-hover-lift bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:bg-white transition-all flex flex-col justify-between group shadow-xs cursor-default"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-950 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-950 transition-colors font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1.5 font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center text-xs font-bold text-blue-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                  <span>Verified Classroom Facility</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Facility Banner - Clean Light Theme */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-amber-50/60 rounded-3xl text-slate-900 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md border-2 border-blue-200">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
              Experience the Class Before Enrolling
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-950">
              Attend a 2-Hour Live Physics Trial Class with Kashyap Sir
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl font-medium leading-relaxed">
              Witness how vectors, rotational mechanics, and electrostatics are deconstructed into intuitive mental models. Zero admission fees required for trial class.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => onOpenInquiry('Free 2-Hour Live Trial Class')}
              className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer ring-2 ring-amber-400/40"
            >
              Book Free Trial Seat
            </button>
            <a
              href="tel:+919350764376"
              className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl transition-all active:scale-98 shadow-xs"
            >
              Call Helpline: +91 93507 64376
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
