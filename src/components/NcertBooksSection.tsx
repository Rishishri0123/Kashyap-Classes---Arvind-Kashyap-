import React, { useState } from 'react';
import { NCERT_BOOKS_DATA } from '../data/ncertBooks';
import { BookOpen, Download, ExternalLink, ChevronDown, CheckCircle2, Sparkles, FileText, Layers, Award } from 'lucide-react';

interface NcertBooksSectionProps {
  onOpenInquiry?: (course?: string) => void;
}

export const NcertBooksSection: React.FC<NcertBooksSectionProps> = ({ onOpenInquiry }) => {
  const [filter, setFilter] = useState<'all' | 'Class 11' | 'Class 12'>('all');
  const [expandedBook, setExpandedBook] = useState<string | null>('ncert-11-physics-part1-en');

  const filteredBooks = NCERT_BOOKS_DATA.filter((book) => {
    if (filter === 'all') return true;
    if (filter === 'Class 11') return book.standard === 'Class 11';
    if (filter === 'Class 12') return book.standard === 'Class 12';
    return true;
  });

  const toggleBookChapters = (bookId: string) => {
    setExpandedBook((prev) => (prev === bookId ? null : bookId));
  };

  return (
    <section id="ncert-books" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-blue-900" />
            <span>Official Academic Repository</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight font-heading">
            Official NCERT Physics <span className="text-amber-500">Books & PDF Hub</span>
          </h2>

          <p className="text-base text-slate-700 leading-relaxed font-medium">
            Download complete official NCERT Physics textbooks for Class 11 and Class 12 (Part 1 & Part 2). Essential reading recommended by Arvind Kashyap (Kashyap Sir) for 98%+ in Boards and top ranks in JEE & NEET.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-950 text-white shadow-md'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            All NCERT Textbooks ({NCERT_BOOKS_DATA.length})
          </button>
          <button
            onClick={() => setFilter('Class 11')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'Class 11'
                ? 'bg-blue-950 text-white shadow-md'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            Class 11 Physics (Part 1 & 2)
          </button>
          <button
            onClick={() => setFilter('Class 12')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'Class 12'
                ? 'bg-blue-950 text-white shadow-md'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            Class 12 Physics (Part 1 & 2)
          </button>
        </div>

        {/* Official Portal Notice Banner */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-800">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950">Direct Government NCERT Access: </span>
              All textbooks are provided directly from official NCERT (National Council of Educational Research & Training) repositories. If your mobile device blocks PDF popups, use the <strong>NCERT Portal</strong> or <strong>ePathshala</strong> buttons below.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href="https://ncert.nic.in/textbook.php"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="px-3 py-1.5 bg-blue-950 text-white rounded-lg font-bold text-[11px] hover:bg-blue-900 flex items-center gap-1.5"
            >
              <span>NCERT Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://epathshala.nic.in//process.php?id=students&type=e-textbooks&ln=en"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-[11px] hover:bg-slate-100 flex items-center gap-1.5"
            >
              <span>ePathshala</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Books Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredBooks.map((book) => {
            const isExpanded = expandedBook === book.id;

            return (
              <div
                key={book.id}
                className="card-hover-lift bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 transition-all flex flex-col justify-between shadow-xs"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Top Metadata Strip */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-950 text-xs font-bold font-mono">
                        {book.standard}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs font-bold text-slate-700">
                        {book.part}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        English
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                      NCERT Code: {book.ncertCode}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 font-heading">
                      {book.title}
                    </h3>
                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mt-0.5">
                      {book.edition}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium mt-2">
                      {book.description}
                    </p>
                  </div>

                  {/* Highlight feature points */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-800 font-semibold bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span>{book.chaptersCount} Detailed Chapters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span>Official Rationalised Edition</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span>Points to Ponder Included</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span>NEET/JEE Core Prescribed</span>
                    </div>
                  </div>

                  {/* Chapter-wise breakdown accordion */}
                  {book.chapters && book.chapters.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleBookChapters(book.id)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-blue-50/80 hover:bg-blue-100/80 rounded-xl text-xs font-bold text-blue-950 transition-colors border border-blue-200 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-900" />
                          <span>View Chapter Syllabus & Weightage ({book.chapters.length} Chapters)</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-blue-950 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                          {book.chapters.map((ch) => (
                            <div
                              key={ch.number}
                              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-slate-950">
                                  Ch {ch.number}: {ch.title}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                                  {ch.jeeNeetWeightage}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                                <strong className="text-slate-800">Key Concepts:</strong> {ch.importantConcepts}
                              </p>
                              {ch.directPdfUrl && (
                                <div className="mt-2 flex items-center gap-3">
                                  <a
                                    href={ch.directPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    referrerPolicy="no-referrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-900 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
                                  >
                                    <Download className="w-3 h-3 text-blue-900" />
                                    <span>Open Chapter {ch.number} PDF</span>
                                    <ExternalLink className="w-3 h-3 text-slate-500" />
                                  </a>
                                  <a
                                    href="https://ncert.nic.in/textbook.php"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    referrerPolicy="no-referrer"
                                    className="text-[10px] font-medium text-slate-500 hover:text-slate-800 underline"
                                  >
                                    View on NCERT
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Bottom Action Footer: Direct Links to Official NCERT PDF */}
                <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-600 font-medium">
                    National NCERT Official Publication
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open on NCERT Portal</span>
                      <ExternalLink className="w-3 h-3 text-slate-300" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Kashyap Sir's Guide to NCERT Physics Banner - Clean Light Theme */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-amber-50/60 text-slate-900 border-2 border-blue-200 shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Mentor's Study Strategy by Arvind Kashyap</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-heading">
                How to Master NCERT Physics for 98%+ in Boards & 170+ in NEET
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl font-medium leading-relaxed">
                "90% of students make the mistake of skipping NCERT 'Points to Ponder' and 'Additional Exercises'. Every single NEET statement-based question and JEE Main assertion-reason question is drawn straight from NCERT margins. In our classroom lectures, we decode NCERT line-by-line."
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              {onOpenInquiry && (
                <button
                  onClick={() => onOpenInquiry('Free 2-Hour Live Physics Trial Class')}
                  className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Book Free Trial Demo</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
