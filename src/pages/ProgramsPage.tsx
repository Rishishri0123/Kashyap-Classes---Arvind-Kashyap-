import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { CoursesSection } from '../components/CoursesSection';

interface ProgramsPageProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ onOpenInquiry }) => {
  return (
    <>
      <PageBreadcrumb
        current="Course Programs"
        subtitle="Class 11, Class 12, JEE Main & Advanced, and NEET 170+ Offline Programs"
      />
      <CoursesSection onOpenInquiry={onOpenInquiry} />
      <section className="py-10 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs">
          <div>
            <h3 className="text-lg font-black text-slate-950 font-heading">
              Looking for Batch Days & Timings?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              View morning, evening, and weekend in-person class schedules structured around school hours.
            </p>
          </div>
          <Link
            to="/schedules"
            className="w-full sm:w-auto px-5 py-3 bg-[#0c2340] hover:bg-[#071527] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#ff6600]" />
            <span>View Batch Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ProgramsPage;
