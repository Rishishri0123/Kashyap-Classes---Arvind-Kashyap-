export type NoteSectionId = 'class-11-physics' | 'class-12-physics' | 'jee';

export interface NoteSectionMeta {
  id: NoteSectionId;
  label: string;
  shortLabel: string;
  badge: string;
  tagline: string;
  description: string;
  routeSlug: string;
}

export const NOTE_SECTIONS: NoteSectionMeta[] = [
  {
    id: 'class-11-physics',
    label: 'Class 11 Physics Notes',
    shortLabel: 'Class 11 Notes',
    badge: 'Foundation & CBSE',
    tagline: 'Vectors, Kinematics, NLM, Rotation, Fluids & Thermodynamics',
    description:
      'Master Class 11 handwritten derivations, Free-Body Diagram techniques, and solved numericals personally written by Arvind Kashyap Sir.',
    routeSlug: '/notes/class-11',
  },
  {
    id: 'class-12-physics',
    label: 'Class 12 Physics Notes',
    shortLabel: 'Class 12 Notes',
    badge: 'Boards + 98%+ Target',
    tagline: 'Electrostatics, Current, Magnetism, EMI, Optics & Modern Physics',
    description:
      'Complete NCERT Class 12 chapter handwritten PDFs with board-exam derivations, circuit laws, ray diagrams, and crisp formula sheets.',
    routeSlug: '/notes/class-12',
  },
  {
    id: 'jee',
    label: 'JEE Notes',
    shortLabel: 'JEE Notes',
    badge: 'Main + Advanced',
    tagline: 'Multi-Concept Mechanics, Electrodynamics & Rank-Booster Archives',
    description:
      'High-yield JEE Main & Advanced handwritten problem-solving notes, rotational & electrodynamic insights, and Olympiad/Irodov topologies.',
    routeSlug: '/notes/jee',
  },
];

export const SECTION_LABEL_MAP: Record<NoteSectionId, string> = {
  'class-11-physics': 'Class 11 Physics Notes',
  'class-12-physics': 'Class 12 Physics Notes',
  jee: 'JEE Notes',
};

export interface NoteItem {
  id: string;
  title: string;
  description: string;
  section: NoteSectionId;
  singlePriceInINR: number;
  bundlePriceInINR: number;
  pageCount: number;
  createdAt?: unknown;
}

export interface BundleItem {
  id: string;
  title: string;
  description: string;
  section: NoteSectionId;
  includedNoteIds: string[];
  bundlePriceInINR: number;
  createdAt?: unknown;
}

export interface PurchaseItem {
  purchaseId: string;
  userId: string;
  unlockedNoteIds: string[];
  section: NoteSectionId;
  purchaseType: 'single' | 'bundle';
  itemId?: string;
  itemTitle?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountPaid: number;
  purchasedAt?: unknown;
}

const DEFAULT_ADMIN_EMAILS = ['rishishrivastav16@gmail.com'];

export function getAllowedAdminEmails(): string[] {
  const raw =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAILS) ||
    '';
  const parsed = raw
    .split(',')
    .map((s: string) => s.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...parsed]));
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}
