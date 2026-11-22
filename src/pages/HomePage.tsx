import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Calendar,
  BookOpen,
  Sparkles,
  MapPin,
  Award,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { AcademicFeatures } from '../components/AcademicFeatures';
import { TestimonialsSection } from '../components/TestimonialsSection';

interface HomePageProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

const PORTAL_SECTIONS = [
  {
    title: 'Courses & Programs',
    description: 'Class 11 Foundation, Class 12 Boards, JEE Main/Adv & NEET 170+ batches.',
    to: '/programs',
    icon: Layers,
    badge: 'Core Batches',
    accent: 'border-[#fed7aa] bg-[#fff7f0]/70 hover:border-[#ff6600]',
  },
  {
    title: 'Batch Schedules',
    description: 'Morning, evening, and weekend offline batch timings around school hours.',
    to: '/schedules',
    icon: Calendar,
    accent: 'border-slate-200 bg-white hover:border-[#0c2340]',
  },
  {
    title: 'NCERT Physics Hub',
    description: 'Direct chapter-by-chapter official NCERT Part 1 & Part 2 PDF access.',
    to: '/ncert',
    icon: BookOpen,
    accent: 'border-slate-200 bg-white hover:border-[#0c2340]',
  },
  {
    title: 'Concept Simulation Lab',
    description: "Interactive Wave Optics (YDSE), Lenz's Law, and Photoelectric Effect labs.",
    to: '/lab',
    icon: Sparkles,
    accent: 'border-slate-200 bg-white hover:border-[#0c2340]',
  },
  {
    title: 'Center Location & Map',
    description: 'Exact Shastri Nagar, Ghaziabad center pin, directions, and timings.',
    to: '/location',
    icon: MapPin,
    accent: 'border-slate-200 bg-white hover:border-[#0c2340]',
  },
  {
    title: 'About Kashyap Sir',
    description: '20+ years experience, zero-substitute guarantee, and 4,200+ selections.',
    to: '/about',
    icon: Award,
    accent: 'border-slate-200 bg-white hover:border-[#0c2340]',
  },
  {
    title: 'Admissions & FAQs',
    description: 'Register for a Free 2-Hour Trial Demo or explore parent FAQs.',
    to: '/inquiry',
    icon: HelpCircle,
    accent: 'border-slate-200 bg-white hover:border-[#0c2340]',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onOpenInquiry }) => {
  return (
    <>
      <Hero onOpenInquiry={onOpenInquiry} />

      {/* Dedicated Resource Portals Directory */}
      <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#ff6600]">
              Dedicated Student & Parent Portals
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight mt-1 mb-3">
              Explore All Institute Pages
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Each section loads on its own fast, dedicated page so students and parents can access programs, schedules, labs, or center directions right away.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {PORTAL_SECTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] rounded-2xl border-2 p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${item.accent}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shrink-0 group-hover:bg-[#ff6600] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#ff6600] text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-950 font-heading mb-1.5 group-hover:text-[#0c2340]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-extrabold text-[#0c2340] group-hover:text-[#ff6600]">
                    <span>Open Page</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <AcademicFeatures onOpenInquiry={onOpenInquiry} />

      <TestimonialsSection />
    </>
  );
};

export default HomePage;
