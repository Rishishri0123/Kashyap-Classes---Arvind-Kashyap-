import React from 'react';
import { Target, Lightbulb, Compass, Award, CheckCircle, ArrowRight } from 'lucide-react';

interface AboutMentorProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const AboutMentor: React.FC<AboutMentorProps> = ({ onOpenInquiry }) => {
  const pillars = [
    {
      number: '01',
      title: 'Vector & Diagrammatic Visualization',
      description: 'Before writing any equation, students learn to sketch precise free-body diagrams, equipotential lines, and ray geometries. When you see the physics clearly, 80% of the solution is already achieved.',
    },
    {
      number: '02',
      title: 'Principle-First over Formula-Spam',
      description: 'Most students struggle because they memorize 40 formulas for one chapter. Kashyap Sir teaches you to derive entire problem topologies from only 2 fundamental conservation laws: Momentum & Energy.',
    },
    {
      number: '03',
      title: 'Daily Graded Problem Drills (DPP)',
      description: 'Every lecture concludes with a 15-question problem set categorized into Level 1 (School/NCERT), Level 2 (JEE Main/NEET), and Level 3 (JEE Advanced Brain-Benders). No concept remains purely theoretical.',
    },
    {
      number: '04',
      title: 'Direct Teacher Accessibility & Doubt Counters',
      description: 'No question is too simple or silly. Kashyap Sir is physically present at the doubt desk every evening from 5:30 PM to 8:00 PM, analyzing each student’s thought process and rectifying common calculation pitfalls.',
    },
  ];

  return (
    <section id="about-sir" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950">
            <span>Pedagogy & Philosophy</span>
            <span aria-hidden="true">·</span>
            <span>About The Mentor</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance] font-heading">
            "Physics is Not an Abstract Calculation. It is the Architecture of Reality."
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Meet <strong className="text-slate-950 font-bold">Arvind Kashyap (Kashyap Sir)</strong>, a revered physics educator known for demystifying the toughest JEE Advanced and NEET problems with infectious clarity.
          </p>
        </div>

        {/* Mentor Bio & Philosophy Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src="/assets/aistudio/kashyap_sir.jpg"
                  alt="Arvind Kashyap (Kashyap Sir)"
                  className="w-full h-72 sm:h-80 object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/90 text-amber-400 text-xs font-bold px-3 py-1 rounded-lg border border-amber-400/50 shadow-md">
                  Arvind Kashyap (Kashyap Sir)
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    The Educator Behind The Ranks
                  </span>
                  <h3 className="text-2xl font-bold text-slate-950 font-heading">
                    Arvind Kashyap (Kashyap Sir)
                  </h3>
                  <div className="text-xs font-semibold text-slate-700">
                    Senior Physics Master Faculty · 20+ Years Classroom Experience
                  </div>
                </div>

                <blockquote className="text-slate-800 italic border-l-3 border-amber-400 pl-4 py-1 text-sm leading-relaxed font-medium bg-amber-50/50 p-2 rounded-r-lg">
                  "When a student fails to solve a physics numerical, it is almost never because their math is weak. It is because they did not mentally see what was happening to the body at that infinitesimal second. My entire classroom is built around that spark of visualization."
                </blockquote>

              <div className="space-y-2.5 pt-2 text-sm text-slate-800 border-t border-slate-100 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personally trained 140+ students in Top 500 AIR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Author of "Intuitive Physics: Concept Maps for JEE & NEET"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Renowned for making NEET physics non-intimidating</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenInquiry('Counseling with Kashyap Sir')}
                  className="w-full py-3 px-4 text-xs font-bold text-center text-blue-950 bg-blue-100 hover:bg-blue-950 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Request 1-on-1 Academic Counseling with Sir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">
              The Kashyap Method: 4 Non-Negotiable Pillars
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Unlike commercial coaching factories where students sit in 200-person auditoriums with disconnected slide decks, Kashyap Classes operates on an interactive, small-cohort workshop model.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.number}
                  className="card-hover-lift bg-white p-5 rounded-xl border-2 border-slate-200 hover:border-blue-400 transition-all space-y-2 shadow-xs cursor-default"
                >
                  <div className="text-xs font-bold font-mono text-amber-600">
                    PILLAR {pillar.number}
                  </div>
                  <h4 className="text-base font-bold text-slate-950">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
