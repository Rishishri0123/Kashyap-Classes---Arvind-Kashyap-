export interface InquiryRecord {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email?: string;
  studentClass: string;
  targetExam: string;
  course?: string;
  source: 'Enrollment Form' | 'Quick Modal' | 'Class 12 Notes Unlock' | 'Brochure Request' | 'Website Direct';
  wantsDemo?: boolean;
  message?: string;
  chapterRequested?: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed';
  ownerNotes?: string;
}
