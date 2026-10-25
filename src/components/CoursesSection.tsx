import React, { useState } from 'react';
import { COURSES_DATA, Course } from '../data/courses';
import { Clock, Calendar, Check, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';

interface CoursesSectionProps {
  onOpenInquiry: (courseTitle: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onOpenInquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'class11' | 'class12' | 'jee' | 'neet'>('all');
  const [expandedTopics, setExpandedTopics] = useState<string | null>(null);

  const filteredCourses = COURSES_DATA.filter((course) => {
    if (selectedCategory === 'all') return true;
    return course.category === selectedCategory;
  });

  const toggleTopics = (id: string) => {
    setExpandedTopics((prev) => (prev === id ? null : id));
  };

  return (
    <section id="courses" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <span>Targeted Physics Curricula</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-amber-800 font-extrabold">Session 2026–2027</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight font-heading">
              Structured Physics <span className="text-amber-500">Course Programs</span>
            </h2>
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              Every course is structured around concept mastery from first principles, followed by systematic graduated problem-solving from Board level up to JEE Advanced and NEET.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              All Programs ({COURSES_DATA.length})
            </button>
            <button
              onClick={() => setSelectedCategory('class11')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'class11'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Class 11
            </button>
            <button
              onClick={() => setSelectedCategory('class12')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'class12'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Class 12
            </button>
            <button
              onClick={() => setSelectedCategory('jee')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'jee'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              JEE (Main/Adv)
            </button>
            <button
              onClick={() => setSelectedCategory('neet')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'neet'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              NEET Medical
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => {
            const isTopicsOpen = expandedTopics === course.id;

            return (
              <div
                key={course.id}
                className="card-hover-lift bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-400 transition-all shadow-xs"
              >
                <div className="space-y-4">
                  
                  {/* Clean unboxed category & audience metadata with high contrast */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-950">
                      <span className="bg-blue-100 text-blue-950 px-2 py-0.5 rounded font-bold">{course.badge}</span>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-slate-800">Faculty: Arvind Kashyap</span>
                    </div>
                    <div className="text-emerald-900 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      <span>Free Demo Available</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight font-heading">
                    {course.title}
                  </h3>

                  {/* Target audience */}
                  <p className="text-xs font-semibold text-slate-700">
                    Target: <strong className="text-slate-950">{course.targetAudience}</strong>
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {course.description}
                  </p>

                  {/* Time commitment with high contrast */}
                  <div className="flex flex-wrap items-center gap-4 py-2.5 border-y border-slate-200 text-xs text-slate-800 font-semibold bg-white px-3 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-950 shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-950 shrink-0" />
                      <span>{course.hoursPerWeek}</span>
                    </div>
                  </div>

                  {/* Program Highlights */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                      Pedagogical Highlights
                    </h4>
                    <div className="space-y-1.5">
                      {course.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Syllabus Accordion */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleTopics(course.id)}
                      className="text-xs font-bold text-blue-950 hover:text-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isTopicsOpen ? 'Hide Detailed Syllabus Chapters' : 'View Syllabus Chapter Breakdown'}</span>
                    </button>

                    {isTopicsOpen && (
                      <div className="mt-3 p-4 bg-white rounded-xl border border-slate-300 space-y-2 text-xs text-slate-800 shadow-2xs">
                        <div className="font-bold text-slate-950 mb-1">Chapters Mastered with Kashyap Sir:</div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc list-inside font-medium">
                          {course.keyTopics.map((topic, i) => (
                            <li key={i} className="leading-snug">{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Card Action Footer (Zero Fees Mentioned) */}
                <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    <div className="font-bold text-slate-950 text-sm">Direct Mentorship by Arvind Kashyap</div>
                    <span className="text-slate-600 font-medium">{course.inclusionInfo}</span>
                  </div>

                  <button
                    onClick={() => onOpenInquiry(course.title)}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs cursor-pointer active:scale-98"
                  >
                    <span>Inquire / Book Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
