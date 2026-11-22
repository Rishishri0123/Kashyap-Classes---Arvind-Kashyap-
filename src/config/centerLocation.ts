export const CENTER_NAME = 'Kashyap Classes';
export const CENTER_DIRECTOR = 'Arvind Kashyap (Kashyap Sir)';
export const CENTER_ADDRESS =
  'Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002';
export const CENTER_LANDMARK = 'Near Bank Enclave Market & Shastri Nagar';

export interface ResolvedCenterLocation {
  lat: number;
  lng: number;
  formattedAddress: string;
  displayName?: string;
  placeId?: string;
  googleMapsUri?: string;
  directionsUri?: string;
  granularity?: string;
  source: 'places' | 'geocoding';
}

export function buildGoogleMapsSearchUrl(resolved?: ResolvedCenterLocation | null): string {
  if (resolved?.googleMapsUri) {
    return resolved.googleMapsUri;
  }
  const params = new URLSearchParams({
    api: '1',
    query: `${CENTER_NAME}, ${CENTER_ADDRESS}`,
  });
  if (resolved?.placeId) {
    params.set('query_place_id', resolved.placeId);
  }
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function buildGoogleMapsDirectionsUrl(resolved?: ResolvedCenterLocation | null): string {
  if (resolved?.directionsUri) {
    return resolved.directionsUri;
  }
  const params = new URLSearchParams({
    api: '1',
    destination: resolved ? `${resolved.lat},${resolved.lng}` : CENTER_ADDRESS,
  });
  if (resolved?.placeId) {
    params.set('destination_place_id', resolved.placeId);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildAppleMapsUrl(resolved?: ResolvedCenterLocation | null): string {
  const params = new URLSearchParams({
    q: CENTER_ADDRESS,
  });
  if (resolved) {
    params.set('ll', `${resolved.lat},${resolved.lng}`);
  }
  return `https://maps.apple.com/?${params.toString()}`;
}
