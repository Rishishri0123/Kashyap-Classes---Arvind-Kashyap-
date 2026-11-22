import React, { useState } from 'react';
import { SCHEDULES_DATA, BatchSchedule } from '../data/schedules';
import { Calendar, Clock, MapPin, ArrowRight, Download, Filter, CheckCircle2, Sparkles } from 'lucide-react';
import { useContactUnlock } from '../context/ContactUnlockContext';

interface ScheduleSectionProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onOpenInquiry }) => {
  const { isUnlocked, phoneNumber, maskedPhone } = useContactUnlock();
  const contactText = isUnlocked ? phoneNumber : `${maskedPhone} (Enter details in form on website to unlock)`;
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'class11' | 'class12' | 'jee' | 'neet'>('all');
  const [slotFilter, setSlotFilter] = useState<'all' | 'Morning' | 'Evening' | 'Weekend'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredSchedules = SCHEDULES_DATA.filter((batch) => {
    const matchesCategory = categoryFilter === 'all' || batch.category === categoryFilter;
    const matchesSlot = slotFilter === 'all' || batch.slot === slotFilter;
    return matchesCategory && matchesSlot;
  });

  const handleDownloadTimetable = () => {
    setDownloadSuccess(true);
    const content = `KASHYAP CLASSES - PHYSICS BATCH TIMETABLE
Under Arvind Kashyap (Kashyap Sir) | Call: ${contactText}

${SCHEDULES_DATA.map(
  (b) => `-----------------------------------------
Batch Code: ${b.batchCode}
Course: ${b.courseTitle}
Target: ${b.targetExam}
Weekly Days: ${b.days}
Slot: ${b.timing}
Mode: ${b.mode}
Center Venue: ${b.classroom}
Mentor: ${b.faculty}
`
).join('\n')}

For batch admissions and free trial class bookings, call ${contactText}.
Website Developed by Rishi Shrivastav.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kashyap_Classes_Physics_Batch_Schedules.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  return (
    <section id="schedules" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950">
              <Calendar className="w-4 h-4 text-blue-900" />
              <span>Academic Timetable</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-amber-800 font-extrabold">Active Cohorts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight font-heading">
              Physics Batches & <span className="text-amber-500">Weekly Schedules</span>
            </h2>
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              Flexible Morning, Evening, and Weekend batches designed to integrate seamlessly with school hours and self-study routines. Every class is taught personally by Arvind Kashyap (Kashyap Sir).
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-300 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-950 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-950">100% Sir's Lectures</div>
              <div className="text-[11px] text-slate-700 font-medium">Zero junior substitute teachers</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-2xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pr-2">
              <Filter className="w-3.5 h-3.5 text-blue-900" />
              <span>Filter by Class:</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                All Batches ({SCHEDULES_DATA.length})
              </button>
              <button
                onClick={() => setCategoryFilter('class11')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'class11'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Class 11
              </button>
              <button
                onClick={() => setCategoryFilter('class12')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'class12'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Class 12
              </button>
              <button
                onClick={() => setCategoryFilter('jee')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'jee'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                JEE Batches
              </button>
              <button
                onClick={() => setCategoryFilter('neet')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'neet'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                NEET Batches
              </button>
            </div>

            {/* Time Slot Filter */}
            <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-300 text-xs shadow-2xs">
              <span className="text-slate-700 pl-2 pr-1 font-bold">Slot:</span>
              <button
                onClick={() => setSlotFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                  slotFilter === 'all' ? 'bg-slate-200 text-slate-950' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Any
              </button>
              <button
                onClick={() => setSlotFilter('Morning')}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                  slotFilter === 'Morning' ? 'bg-slate-200 text-slate-950' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Morning
              </button>
              <button
                onClick={() => setSlotFilter('Evening')}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                  slotFilter === 'Evening' ? 'bg-slate-200 text-slate-950' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Evening
              </button>
              <button
                onClick={() => setSlotFilter('Weekend')}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                  slotFilter === 'Weekend' ? 'bg-slate-200 text-slate-950' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Weekend
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Table / Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 pb-1 font-medium">
            <span>
              Showing <strong className="text-slate-950 font-bold">{filteredSchedules.length}</strong> active physics cohorts
            </span>
            <button
              onClick={handleDownloadTimetable}
              className="inline-flex items-center gap-1.5 text-blue-950 hover:text-blue-800 font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>{downloadSuccess ? '✓ Downloaded Timetable!' : 'Download Schedule Timetable'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredSchedules.map((batch) => {
              return (
                <div
                  key={batch.batchCode}
                  className="card-hover-lift bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-blue-400 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    
                    {/* Top unboxed metadata row with high contrast */}
                    <div className="flex items-center justify-between gap-2 text-xs border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2 font-mono text-blue-950 font-bold text-xs">
                        <span className="bg-blue-100 text-blue-950 px-2 py-0.5 rounded font-mono font-bold">{batch.batchCode}</span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span className="font-sans font-semibold text-slate-800">{batch.mode}</span>
                      </div>
                      
                      {/* High-visibility Status indicator badge */}
                      <span className="font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md text-[11px]">
                        {batch.status}
                      </span>
                    </div>

                    {/* Batch Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 font-heading">
                        {batch.courseTitle}
                      </h3>
                      <div className="text-xs font-semibold text-slate-700 mt-1">
                        Target Exam: <span className="text-blue-950 font-bold">{batch.targetExam}</span>
                      </div>
                    </div>

                    {/* Schedule Details Grid - Clean & High Contrast Text */}
                    <div className="grid grid-cols-2 gap-3 py-2 text-xs bg-slate-100/80 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Weekly Days</div>
                        <div className="font-bold text-slate-950 mt-0.5">{batch.days}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Schedule Slot</div>
                        <div className="font-bold text-blue-950 font-sans mt-0.5">{batch.timing}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Learning Mode</div>
                        <div className="font-bold text-slate-950 mt-0.5">{batch.mode}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Center Venue</div>
                        <div className="font-bold text-slate-950 mt-0.5">{batch.classroom}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 pt-1 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Includes daily 1-on-1 evening doubt clinic & full study modules</span>
                    </div>

                  </div>

                  {/* Batch Card Action */}
                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs text-slate-700">
                      Mentor: <strong className="text-slate-950 font-bold">{batch.faculty}</strong>
                    </div>

                    <button
                      onClick={() => onOpenInquiry(`${batch.courseTitle} (${batch.batchCode})`)}
                      className="px-4 py-2 text-xs font-bold text-blue-950 hover:text-white bg-blue-100 hover:bg-blue-950 border border-blue-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Book Free Trial Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredSchedules.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <p className="text-sm font-semibold text-slate-800">No batches match your selected criteria.</p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setSlotFilter('all');
                }}
                className="text-xs font-bold text-blue-950 hover:underline cursor-pointer"
              >
                Reset filters to view all schedules
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
