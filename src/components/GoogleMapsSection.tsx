import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  Star,
  CheckCircle2,
  ExternalLink,
  Compass,
  Bus,
  Car,
  Lock,
  Crosshair,
  Layers,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary,
  useApiLoadingStatus,
  APILoadingStatus,
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps';
import { useContactUnlock } from '../context/ContactUnlockContext';
import {
  CENTER_NAME,
  CENTER_DIRECTOR,
  CENTER_ADDRESS,
  CENTER_LANDMARK,
  ResolvedCenterLocation,
  buildGoogleMapsSearchUrl,
  buildGoogleMapsDirectionsUrl,
  buildAppleMapsUrl,
} from '../config/centerLocation';

interface GoogleMapsSectionProps {
  onOpenInquiry?: (initialCourse?: string) => void;
}

const ENV_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const DEFAULT_ZOOM = 17;

function matchesCenterArea(text: string): boolean {
  const norm = text.toLowerCase();
  return (
    norm.includes('201002') ||
    norm.includes('ghaziabad') ||
    norm.includes('shastri nagar') ||
    norm.includes('enclave')
  );
}

interface PlacesFallbackResolverProps {
  shouldResolve: boolean;
  onResolved: (loc: ResolvedCenterLocation) => void;
  onFailed: (msg: string) => void;
}

const PlacesFallbackResolver: React.FC<PlacesFallbackResolverProps> = ({
  shouldResolve,
  onResolved,
  onFailed,
}) => {
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!shouldResolve || !placesLib) return;
    let cancelled = false;

    const resolveViaPlacesSdk = async () => {
      const queries = [
        `${CENTER_NAME}, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002`,
        'B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002',
        'M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002',
      ];

      try {
        for (const textQuery of queries) {
          const { places } = await placesLib.Place.searchByText({
            textQuery,
            fields: ['id', 'displayName', 'formattedAddress', 'location', 'googleMapsURI'],
            region: 'IN',
            language: 'en',
            maxResultCount: 5,
          });

          if (cancelled || !places || places.length === 0) continue;

          const validPlaces = places.filter(
            (p) =>
              p.location &&
              matchesCenterArea(`${p.displayName || ''} ${p.formattedAddress || ''}`)
          );

          const best =
            validPlaces.find((p) =>
              String(p.displayName || '').toLowerCase().includes('kashyap')
            ) ||
            validPlaces.find((p) => {
              const addr = String(p.formattedAddress || '').toLowerCase();
              return addr.includes('enclave') || addr.includes('b-1') || addr.includes('b1');
            }) ||
            validPlaces[0];

          if (best?.location) {
            onResolved({
              lat: best.location.lat(),
              lng: best.location.lng(),
              formattedAddress: best.formattedAddress || CENTER_ADDRESS,
              displayName: best.displayName || CENTER_NAME,
              placeId: best.id,
              googleMapsUri: best.googleMapsURI || undefined,
              source: 'places',
            });
            return;
          }
        }

        if (!cancelled) {
          onFailed('Could not resolve coaching center pin from Google Maps.');
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('QuotaExceeded')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onFailed('Unable to load live map location for the coaching center.');
      }
    };

    resolveViaPlacesSdk();

    return () => {
      cancelled = true;
    };
  }, [shouldResolve, placesLib, onResolved, onFailed]);

  return null;
};

interface InteractiveCenterMapProps {
  centerLocation: ResolvedCenterLocation;
  mapType: 'roadmap' | 'hybrid';
  cameraProps: MapCameraProps;
  onCameraChanged: (ev: MapCameraChangedEvent) => void;
  directionsUrl: string;
  searchUrl: string;
}

const InteractiveCenterMap: React.FC<InteractiveCenterMapProps> = ({
  centerLocation,
  mapType,
  cameraProps,
  onCameraChanged,
  directionsUrl,
  searchUrl,
}) => {
  const apiStatus = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);

  useEffect(() => {
    if (apiStatus === APILoadingStatus.AUTH_FAILURE) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  }, [apiStatus]);

  useEffect(() => {
    if (marker) {
      setInfoWindowOpen(true);
    }
  }, [marker]);

  if (apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
        <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
        <p className="text-sm font-bold text-slate-900 mb-1">
          Interactive map could not be displayed right now
        </p>
        <p className="text-xs text-slate-600 max-w-md mb-4">{CENTER_ADDRESS}</p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-950 text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors"
        >
          Open Location on Google Maps
        </a>
      </div>
    );
  }

  return (
    <Map
      {...cameraProps}
      mapId="DEMO_MAP_ID"
      mapTypeId={mapType}
      gestureHandling="greedy"
      streetViewControl={true}
      mapTypeControl={false}
      fullscreenControl={true}
      onCameraChanged={onCameraChanged}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: centerLocation.lat, lng: centerLocation.lng }}
        onClick={() => setInfoWindowOpen((prev) => !prev)}
        title={`${CENTER_NAME} — ${CENTER_ADDRESS}`}
      >
        <Pin
          background="#172554"
          borderColor="#f59e0b"
          glyphColor="#fbbf24"
          scale={1.25}
        />
      </AdvancedMarker>

      {infoWindowOpen && marker && (
        <InfoWindow
          anchor={marker}
          pixelOffset={[0, -4]}
          maxWidth={290}
          onCloseClick={() => setInfoWindowOpen(false)}
        >
          <div className="p-1 text-slate-900 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-950 text-amber-400 font-black text-[10px]">
                KC
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-950 leading-tight">
                  {CENTER_NAME}
                </h4>
                <p className="text-[11px] font-semibold text-amber-700 leading-tight">
                  {CENTER_DIRECTOR}
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {CENTER_ADDRESS}
            </p>

            {centerLocation.formattedAddress &&
              centerLocation.formattedAddress !== CENTER_ADDRESS && (
                <p className="text-[11px] text-slate-500 leading-snug">
                  Google Maps Area: {centerLocation.formattedAddress}
                </p>
              )}

            <div className="pt-1 flex items-center gap-3 text-xs font-bold">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 hover:underline inline-flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Directions</span>
              </a>
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-950 hover:underline inline-flex items-center gap-1"
              >
                <span>View on Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

export const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ onOpenInquiry }) => {
  const { isUnlocked, phoneNumber: phone, phoneTel: phoneHref, maskedPhone, openUnlockModal } = useContactUnlock();
  const [mapsApiKey, setMapsApiKey] = useState<string>(ENV_MAPS_API_KEY);
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedCenterLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [needsClientPlacesFallback, setNeedsClientPlacesFallback] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [cameraProps, setCameraProps] = useState<MapCameraProps | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCenterLocation = async () => {
      setIsLoadingLocation(true);
      setLocationError(null);

      try {
        const res = await fetch('/api/location/center');
        const data = await res.json().catch(() => ({}));

        if (res.status === 429 || data?.error?.status === 'RESOURCE_EXHAUSTED') {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          if (!cancelled) {
            setLocationError('Map service quota temporarily reached.');
            setIsLoadingLocation(false);
          }
          return;
        }

        if (!cancelled && !mapsApiKey && data?.clientMapKey) {
          setMapsApiKey(String(data.clientMapKey));
        }

        if (res.ok && data?.success && data?.location) {
          const loc = data.location as ResolvedCenterLocation;
          if (!cancelled) {
            setResolvedLocation(loc);
            setCameraProps({
              center: { lat: loc.lat, lng: loc.lng },
              zoom: DEFAULT_ZOOM,
            });
            setNeedsClientPlacesFallback(false);
            setIsLoadingLocation(false);
          }
          return;
        }

        // If server proxy couldn't geocode (e.g. key restricted to HTTP referrers), try Places JS SDK inside APIProvider
        if (!cancelled) {
          const effectiveKey = mapsApiKey || data?.clientMapKey;
          if (effectiveKey) {
            setNeedsClientPlacesFallback(true);
          } else {
            setLocationError('Unable to load live map coordinates.');
            setIsLoadingLocation(false);
          }
        }
      } catch {
        if (!cancelled) {
          if (mapsApiKey) {
            setNeedsClientPlacesFallback(true);
          } else {
            setLocationError('Unable to contact location service.');
            setIsLoadingLocation(false);
          }
        }
      }
    };

    fetchCenterLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlacesSdkResolved = useCallback((loc: ResolvedCenterLocation) => {
    setResolvedLocation(loc);
    setCameraProps({
      center: { lat: loc.lat, lng: loc.lng },
      zoom: DEFAULT_ZOOM,
    });
    setNeedsClientPlacesFallback(false);
    setLocationError(null);
    setIsLoadingLocation(false);
  }, []);

  const handlePlacesSdkFailed = useCallback((msg: string) => {
    setNeedsClientPlacesFallback(false);
    setLocationError(msg);
    setIsLoadingLocation(false);
  }, []);

  const handleCameraChanged = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
  }, []);

  const handleRecenter = useCallback(() => {
    if (!resolvedLocation) return;
    setCameraProps({
      center: { lat: resolvedLocation.lat, lng: resolvedLocation.lng },
      zoom: DEFAULT_ZOOM,
    });
  }, [resolvedLocation]);

  const directionsUrl = buildGoogleMapsDirectionsUrl(resolvedLocation);
  const mapsSearchUrl = buildGoogleMapsSearchUrl(resolvedLocation);
  const appleMapsUrl = buildAppleMapsUrl(resolvedLocation);
  const whatsappHref =
    'https://wa.me/919350764376?text=Hello%20Kashyap%20Classes,%20I%20would%20like%20to%20visit%20the%20Shastri%20Nagar%20center%20for%20admission.';

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
            Step inside our dedicated 100% in-person offline center. Experience immersive chalkboard derivations, live apparatus demonstrations, and personal 1-on-1 doubt sessions directly with <strong className="text-blue-950 font-bold">{CENTER_DIRECTOR}</strong>.
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
                      {CENTER_NAME}
                    </h3>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      {CENTER_DIRECTOR}
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
                      {CENTER_ADDRESS}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-blue-950 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      Landmark: {CENTER_LANDMARK}
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
                    {isUnlocked ? (
                      <>
                        <a
                          href={phoneHref}
                          className="font-mono font-bold text-slate-950 hover:text-blue-900 transition-colors text-sm"
                        >
                          {phone}
                        </a>
                        <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                          ✓ Direct line to Arvind Kashyap Sir & Admissions Office
                        </span>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700 text-sm">
                            {maskedPhone}
                          </span>
                          <button
                            onClick={() => openUnlockModal('To reveal Arvind Kashyap Sir’s direct telephone number')}
                            className="text-[10px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            <span>Unlock Number</span>
                          </button>
                        </div>
                        <span className="block text-[11px] text-slate-500 font-medium">
                          Enter your details in the form to reveal Kashyap Sir’s personal number
                        </span>
                      </div>
                    )}
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

                {isUnlocked ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Admission</span>
                  </a>
                ) : (
                  <button
                    onClick={() => openUnlockModal('To message admissions on WhatsApp')}
                    className="py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    title="Enter details to unlock WhatsApp"
                  >
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Unlock WhatsApp Chat</span>
                  </button>
                )}
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

          {/* Right Column: Interactive Google Maps SDK Embed (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-slate-100 border-2 border-slate-300 rounded-3xl overflow-hidden shadow-md flex-1 flex flex-col">
              {/* Map Bar Header */}
              <div className="bg-slate-200/90 px-5 py-3 border-b border-slate-300 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <Compass className="w-4 h-4 text-blue-900 shrink-0" />
                  <span className="truncate">
                    {CENTER_NAME} · B-1, M P Enclave, Shastri Nagar, Ghaziabad
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {resolvedLocation && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setMapType((prev) => (prev === 'roadmap' ? 'hybrid' : 'roadmap'))
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-[11px] font-bold cursor-pointer"
                        title="Toggle Street / Satellite View"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-900" />
                        <span>{mapType === 'roadmap' ? 'Satellite' : 'Map'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRecenter}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-blue-950 hover:bg-blue-50 text-[11px] font-bold cursor-pointer"
                        title="Center map on Kashyap Classes pin"
                      >
                        <Crosshair className="w-3.5 h-3.5 text-red-600" />
                        <span>Center Pin</span>
                      </button>
                    </>
                  )}
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

              {/* Explicit Height Map Viewport (CF2) */}
              <div className="relative w-full h-[420px] sm:h-[470px] lg:h-[520px] bg-slate-200">
                {mapsApiKey ? (
                  <APIProvider
                    apiKey={mapsApiKey}
                    language="en"
                    region="IN"
                    libraries={['marker', 'places']}
                  >
                    <PlacesFallbackResolver
                      shouldResolve={needsClientPlacesFallback}
                      onResolved={handlePlacesSdkResolved}
                      onFailed={handlePlacesSdkFailed}
                    />
                    {resolvedLocation && cameraProps ? (
                      <InteractiveCenterMap
                        centerLocation={resolvedLocation}
                        mapType={mapType}
                        cameraProps={cameraProps}
                        onCameraChanged={handleCameraChanged}
                        directionsUrl={directionsUrl}
                        searchUrl={mapsSearchUrl}
                      />
                    ) : isLoadingLocation ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                        <Loader2 className="w-7 h-7 text-blue-900 animate-spin mb-2" />
                        <p className="text-xs font-bold text-slate-800">
                          Locating {CENTER_NAME} at Shastri Nagar, Ghaziabad...
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-md">
                          {CENTER_ADDRESS}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                        <AlertCircle className="w-7 h-7 text-amber-600 mb-2" />
                        <p className="text-xs font-bold text-slate-900 mb-1">
                          {locationError || 'Unable to display map pin'}
                        </p>
                        <p className="text-[11px] text-slate-600 max-w-md mb-4">
                          {CENTER_ADDRESS}
                        </p>
                        <a
                          href={mapsSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-950 text-white text-xs font-bold rounded-xl hover:bg-blue-900"
                        >
                          Open Address in Google Maps
                        </a>
                      </div>
                    )}
                  </APIProvider>
                ) : isLoadingLocation ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                    <Loader2 className="w-7 h-7 text-blue-900 animate-spin mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Loading Google Maps for {CENTER_NAME}...
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                    <AlertCircle className="w-7 h-7 text-amber-600 mb-2" />
                    <p className="text-xs font-bold text-slate-900 mb-1">
                      {locationError || 'Google Maps API key unavailable'}
                    </p>
                    <p className="text-[11px] text-slate-600 max-w-md mb-4">
                      {CENTER_ADDRESS}
                    </p>
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-950 text-white text-xs font-bold rounded-xl hover:bg-blue-900"
                    >
                      Open Address in Google Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Map Footer Bar */}
              <div className="bg-white p-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2 text-xs text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 mt-1 sm:mt-0"></span>
                  <span className="font-semibold">
                    Pinned at {CENTER_ADDRESS}
                  </span>
                </div>
                {onOpenInquiry && (
                  <button
                    onClick={() => onOpenInquiry('Center Visit & Admission Counseling')}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
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
