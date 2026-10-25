import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Building,
  Sparkles,
  ExternalLink,
  Compass,
  Bus,
  Car
} from 'lucide-react';

interface GoogleMapsSectionProps {
  onOpenInquiry?: (initialCourse?: string) => void;
}

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ onOpenInquiry }) => {
  const address = 'Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Flat+No.+202,+B-1,+M+P+Enclave,+Bank+Enclave,+Shastri+Nagar,+Ghaziabad,+Uttar+Pradesh+201002';
  const mapsSearchUrl = 'https://www.google.com/maps/search/?api=1&query=Flat+No.+202,+B-1,+M+P+Enclave,+Bank+Enclave,+Shastri+Nagar,+Ghaziabad,+Uttar+Pradesh+201002';
  const appleMapsUrl = 'https://maps.apple.com/?q=Flat+No.+202,+B-1,+M+P+Enclave,+Bank+Enclave,+Shastri+Nagar,+Ghaziabad,+Uttar+Pradesh+201002';
  const phone = '+91 93507 64376';
  const phoneHref = 'tel:+919350764376';
  const whatsappHref = 'https://wa.me/919350764376?text=Hello%20Kashyap%20Classes,%20I%20would%20like%20to%20visit%20the%20Shastri%20Nagar%20center%20for%20admission.';

  return (
    <section id="location-map" className="py-16 sm:py-24 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-950 border border-blue-300 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-xs mb-4">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Physical Classroom Center · Shastri Nagar, Ghaziabad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-heading tracking-tight mb-4">
            Visit Our Physics Learning Center
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            Step inside our dedicated 100% in-person offline center. Experience immersive chalkboard derivations, live apparatus demonstrations, and personal 1-on-1 doubt sessions directly with <strong className="text-blue-950 font-bold">Arvind Kashyap (Kashyap Sir)</strong>.
          </p>
        </div>

        {/* Main Grid: Details Card + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Center Location Info & Facilities (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address & Quick Contacts Card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 font-black flex items-center justify-center text-sm shadow-xs border border-blue-900">
                    KC
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950 font-heading">
                      Kashyap Classes
                    </h3>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Arvind Kashyap (Kashyap Sir)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-black text-slate-950">4.8</span>
                  <span className="text-[10px] text-slate-600 font-semibold">(15+ Reviews)</span>
                </div>
              </div>

              {/* Exact Address */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 block text-xs uppercase tracking-wider mb-0.5">
                      Coaching Center Location
                    </span>
                    <p className="font-semibold text-slate-900 leading-snug">
                      Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-blue-950 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      Landmark: Near Bank Enclave Market & Shastri Nagar
                    </span>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-900" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 block text-xs uppercase tracking-wider mb-0.5">
                      Visiting & Counseling Timings
                    </span>
                    <p className="font-medium text-slate-800">
                      <strong>Monday – Saturday:</strong> 7:00 AM – 8:30 PM
                    </p>
                    <p className="font-medium text-slate-600 text-xs mt-0.5">
                      <strong>Sunday:</strong> 8:00 AM – 1:30 PM (Doubt Desks & CBT Mock Tests)
                    </p>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 block text-xs uppercase tracking-wider mb-0.5">
                      Direct Student & Parent Helpline
                    </span>
                    <a
                      href={phoneHref}
                      className="font-mono font-bold text-slate-950 hover:text-blue-900 transition-colors text-sm"
                    >
                      {phone}
                    </a>
                    <span className="block text-[11px] text-slate-500 font-medium">
                      Direct line to Arvind Kashyap Sir & Admissions Office
                    </span>
                  </div>
                </div>

                {/* Commute & Transit Highlights */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-950 block text-[11px] uppercase tracking-wider">
                    How to Reach Us:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span>Shastri Nagar Bus Stop</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Free Center Parking</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Get Driving Directions</span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Admission</span>
                </a>
              </div>
            </div>

            {/* Offline Classroom Advantages */}
            <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-blue-900">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                  100% Offline Pedagogy
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  Why In-Person at Shastri Nagar?
                </span>
              </div>
              <h4 className="text-base font-black font-heading text-white mb-3">
                Real Classroom Focus, Zero Digital Distraction
              </h4>
              <ul className="space-y-2 text-xs text-blue-100 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Interactive high-resolution digital boards with real-time derivations.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hands-on apparatus: prisms, solenoids, lenses, and circuit kits.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Daily 5:30 PM to 8:00 PM 1-on-1 evening doubt desk with Kashyap Sir.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Embed (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-slate-100 border-2 border-slate-300 rounded-3xl overflow-hidden shadow-md flex-1 flex flex-col min-h-[440px] lg:min-h-full">
              
              {/* Map Bar Header */}
              <div className="bg-slate-200/90 px-5 py-3 border-b border-slate-300 flex items-center justify-between gap-3 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2 truncate">
                  <Compass className="w-4 h-4 text-blue-900 shrink-0" />
                  <span className="truncate">Google Maps Live Location · Shastri Nagar, Ghaziabad</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-900 hover:text-blue-950 font-black hover:underline"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-slate-950 font-bold hover:underline"
                  >
                    <span>Apple Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Map Iframe with Exact Shastri Nagar, Ghaziabad Query */}
              <div className="relative flex-1 w-full bg-slate-200">
                <iframe
                  title="Kashyap Classes Location Map - Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad"
                  src="https://maps.google.com/maps?q=Flat+No.+202,+B-1,+M+P+Enclave,+Bank+Enclave,+Shastri+Nagar,+Ghaziabad,+Uttar+Pradesh+201002&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full min-h-[400px] lg:min-h-[520px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {/* Map Footer Bar */}
              <div className="bg-white p-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold">Center is open for offline admissions & parent counseling</span>
                </div>
                {onOpenInquiry && (
                  <button
                    onClick={() => onOpenInquiry('Center Visit & Admission Counseling')}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Schedule Center Visit
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
