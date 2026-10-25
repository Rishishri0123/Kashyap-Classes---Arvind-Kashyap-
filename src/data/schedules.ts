export interface BatchSchedule {
  batchCode: string;
  courseId: string;
  courseTitle: string;
  category: 'class11' | 'class12' | 'jee' | 'neet';
  targetExam: string;
  days: string;
  timing: string;
  slot: 'Morning' | 'Evening' | 'Weekend';
  mode: '100% Offline Classroom';
  faculty: string;
  classroom: string;
  status: string;
}

export const SCHEDULES_DATA: BatchSchedule[] = [
  {
    batchCode: 'KC-11-ALPHA',
    courseId: 'class-11-physics',
    courseTitle: 'Class 11 Physics Foundation (Evening Regular)',
    category: 'class11',
    targetExam: 'CBSE / ICSE Board + JEE/NEET Foundation',
    days: 'Monday, Wednesday, Friday',
    timing: 'Evening Batch Slot',
    slot: 'Evening',
    mode: '100% Offline Classroom',
    faculty: 'Arvind Kashyap (Kashyap Sir)',
    classroom: 'Hall 1 (Main Campus)',
    status: 'Admissions Active',
  },
  {
    batchCode: 'KC-11-WEEKEND',
    courseId: 'class-11-physics',
    courseTitle: 'Class 11 Physics Weekend Integrated',
    category: 'class11',
    targetExam: 'Class 11 School Exams + Olympiad / Early JEE',
    days: 'Saturday & Sunday',
    timing: 'Weekend Morning Slot',
    slot: 'Weekend',
    mode: '100% Offline Classroom',
    faculty: 'Arvind Kashyap (Kashyap Sir)',
    classroom: 'Hall 2 (Interactive Lab)',
    status: 'Admissions Active',
  },
  {
    batchCode: 'KC-12-ZENITH',
    courseId: 'class-12-physics',
    courseTitle: 'Class 12 Boards & Competitive (Morning Regular)',
    category: 'class12',
    targetExam: 'CBSE 12th Board + JEE Main / NEET',
    days: 'Tuesday, Thursday, Saturday',
    timing: 'Morning Batch Slot',
    slot: 'Morning',
    mode: '100% Offline Classroom',
    faculty: 'Arvind Kashyap (Kashyap Sir)',
    classroom: 'Hall 1 (Main Campus)',
    status: 'Admissions Active',
  },
  {
    batchCode: 'KC-12-PRIME',
    courseId: 'class-12-physics',
    courseTitle: 'Class 12 Board Numerical & Derivations (Evening)',
    category: 'class12',
    targetExam: 'CBSE / ISC Board 95%+ Target',
    days: 'Monday, Wednesday, Friday',
    timing: 'Evening Batch Slot',
    slot: 'Evening',
    mode: '100% Offline Classroom',
    faculty: 'Arvind Kashyap (Kashyap Sir)',
    classroom: 'Hall 3 (Derivation Studio)',
    status: 'Admissions Active',
  },
  {
    batchCode: 'KC-JEE-OLYMPUS',
    courseId: 'jee-physics-intensive',
    courseTitle: 'JEE Advanced Rankers Cohort',
    category: 'jee',
    targetExam: 'JEE Advanced & JEE Main Physics 99.5%ile+',
    days: 'Mon, Wed, Fri + Weekend Problem Lab',
    timing: 'Intensive Problem Solving Slot',
    slot: 'Evening',
    mode: '100% Offline Classroom',
    faculty: 'Arvind Kashyap (Kashyap Sir)',
    classroom: 'Advanced Seminar Hall',
    status: 'Admissions Active',
  },
  {
    batchCode: 'KC-NEET-PINNACLE',
    courseId: 'neet-physics-accelerator',
    courseTitle: 'NEET Target 170+ High-Yield Batch',
    category: 'neet',
    targetExam: 'NEET UG Medical (100% NCERT Deconstruction)',
    days: 'Tuesday, Thursday, Saturday + Speed Drills',
    timing: 'Morning Intensive Slot',
    slot: 'Morning',
    mode: '100% Offline Classroom',
    faculty: 'Arvind Kashyap (Kashyap Sir)',
    classroom: 'Hall 2 (Interactive Lab)',
    status: 'Admissions Active',
  },
];
