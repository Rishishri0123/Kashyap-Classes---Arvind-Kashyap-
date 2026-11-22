import React, { useState } from 'react';
import { FAQS_DATA } from '../data/faqs';
import { ChevronDown, HelpCircle, MessageCircle, Lock, Phone } from 'lucide-react';
import { useContactUnlock } from '../context/ContactUnlockContext';

export const FaqSection: React.FC = () => {
  const { isUnlocked, phoneNumber, phoneTel, whatsappUrl, maskedPhone, openUnlockModal } = useContactUnlock();
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950">
            <span>Clear Answers</span>
            <span aria-hidden="true">·</span>
            <span>Parent & Student FAQs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight [text-wrap:balance] font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-700 text-base leading-relaxed font-normal">
            Everything you need to know about our teaching methodology, batch allocations, doubt clearance, and study modules.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS_DATA.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden transition-colors shadow-2xs hover:border-blue-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-950 font-heading">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-950 font-bold' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-800 leading-relaxed border-t border-slate-200 pt-3 animate-fade-in font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-10 p-6 bg-white border-2 border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-950 font-heading">
              Have a specific question not covered here?
            </h4>
            <p className="text-xs text-slate-700 font-medium">
              Speak directly with Arvind Kashyap's academic counselor or visit the center.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isUnlocked ? (
              <a
                href={phoneTel}
                className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Call {phoneNumber}</span>
              </a>
            ) : (
              <button
                onClick={() => openUnlockModal('To call Arvind Kashyap Sir directly')}
                className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                title="Enter details to unlock Kashyap Sir's direct phone number"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Call {maskedPhone} (Unlock)</span>
              </button>
            )}

            {isUnlocked ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Chat</span>
              </a>
            ) : (
              <button
                onClick={() => openUnlockModal('To chat on WhatsApp with Arvind Kashyap Sir')}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                title="Enter details to unlock direct WhatsApp"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>WhatsApp (Unlock)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
