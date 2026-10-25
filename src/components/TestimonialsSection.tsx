import React, { useState } from 'react';
import { TESTIMONIALS_DATA, Testimonial } from '../data/testimonials';
import { Quote, Award, Star, GraduationCap, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string>('all');

  const filteredTestimonials = selectedExam === 'all'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter((item) => {
        if (selectedExam === 'jee') return item.exam === 'JEE Advanced' || item.exam === 'JEE Main';
        if (selectedExam === 'neet') return item.exam === 'NEET UG';
        if (selectedExam === 'board') return item.exam === 'CBSE Board';
        return true;
      });

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950">
            <span>Verified Results & Alumni</span>
            <span aria-hidden="true">·</span>
            <span>Hall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance] font-heading">
            How Kashyap Sir Turned Physics Into Their Highest-Scoring Subject
          </h2>
          <p className="text-slate-700 text-base leading-relaxed">
            Real stories from students who entered Kashyap Classes struggling with mechanics or optics numericals, and emerged securing top ranks in IITs, AIIMS, and NITs.
          </p>

          {/* Filter segment control with high contrast */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white rounded-xl mt-4 border border-slate-300 shadow-2xs">
            <button
              onClick={() => setSelectedExam('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedExam === 'all'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              All Achievers
            </button>
            <button
              onClick={() => setSelectedExam('jee')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedExam === 'jee'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              JEE Main & Advanced
            </button>
            <button
              onClick={() => setSelectedExam('neet')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedExam === 'neet'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              NEET Medical Top Ranks
            </button>
            <button
              onClick={() => setSelectedExam('board')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedExam === 'board'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Board 98%+ Toppers
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="card-hover-lift bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-400 transition-all shadow-xs cursor-default"
            >
              <div className="space-y-4">
                
                {/* Clean unboxed student metadata with high contrast */}
                <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-3">
                  <span className="font-extrabold text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{item.rankBadge}</span>
                  <span className="font-bold text-slate-700 font-mono">{item.batchYear}</span>
                </div>

                {/* Score badge & quote */}
                <div className="space-y-3">
                  <div className="text-xs font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-md inline-block">
                    {item.physicsScore}
                  </div>
                  
                  <blockquote className="text-sm text-slate-800 leading-relaxed italic font-normal">
                    "{item.quote}"
                  </blockquote>
                </div>

                {/* Transition story */}
                <p className="text-xs text-slate-700 leading-relaxed border-t border-slate-200 pt-3">
                  <strong className="text-slate-950 font-bold">Mentorship Impact: </strong>
                  {item.story}
                </p>

                {/* Student Credentials */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-950 text-sm font-heading">{item.name}</div>
                    <div className="text-slate-700 font-medium">{item.collegeOrResult}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
