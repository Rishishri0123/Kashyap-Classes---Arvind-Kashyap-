export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Admissions & Batches' | 'Teaching & Doubts' | 'Exams & Material';
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Admissions & Batches',
    question: 'Does Arvind Kashyap (Kashyap Sir) teach all the physics batches personally?',
    answer: 'Yes, absolutely. Unlike mega-franchises that market senior faculty but delegate teaching to junior substitutes, every core lecture at Kashyap Classes is delivered personally by Arvind Kashyap (Kashyap Sir). Personal mentorship is our founding principle.',
  },
  {
    id: 'faq-2',
    category: 'Admissions & Batches',
    question: 'What is the batch size at Kashyap Classes?',
    answer: 'We strictly cap our offline classroom batches at 25 to 30 students. This guarantees that Sir can observe each student’s problem-solving rhythm, check homework notebooks, and conduct interactive dialogue during lectures.',
  },
  {
    id: 'faq-3',
    category: 'Teaching & Doubts',
    question: 'How do students get their doubts resolved outside regular lecture hours?',
    answer: 'We have dedicated physical Doubt Counters every evening from 5:30 PM to 8:00 PM where Kashyap Sir personally assists students one-on-one with numericals, conceptual blocks, and school or competitive exam queries.',
  },
  {
    id: 'faq-4',
    category: 'Teaching & Doubts',
    question: 'Do you offer online classes or lecture recordings?',
    answer: 'No, Kashyap Classes is strictly 100% in-person offline classroom coaching. We do not offer online classes or lecture recordings because real physics intuition develops through direct eye contact, active chalkboard derivations, and distraction-free classroom focus. If a student misses a class due to genuine medical reasons, they are provided with complete handwritten board notes and 1-on-1 backup guidance with Kashyap Sir during evening doubt sessions.',
  },
  {
    id: 'faq-5',
    category: 'Exams & Material',
    question: 'Do we need to purchase external books like H.C. Verma, I.E. Irodov, or DC Pandey?',
    answer: 'Kashyap Classes provides 12-volume exhaustive Physics study modules containing theory, graded exercises, previous 20 years JEE & NEET questions, and NCERT deep dives. While H.C. Verma is recommended and solved in class, all primary materials, worksheets, and DPPs are provided free with admission.',
  },
  {
    id: 'faq-6',
    category: 'Admissions & Batches',
    question: 'What are the course fee payment options and is there a free trial class?',
    answer: 'We maintain a 100% transparent fee structure for all classes with zero hidden examination or lab charges. Parents can pay conveniently in 2 to 3 flexible installments. Before taking formal admission, any student can attend a Free 2-Hour Live Physics Trial Class with Arvind Kashyap (Kashyap Sir) to experience his teaching methodology firsthand.',
  },
  {
    id: 'faq-7',
    category: 'Admissions & Batches',
    question: 'Can parents monitor test scores and student attendance?',
    answer: 'Yes. Attendance is tracked via digital biometric punch-in and sent via automated SMS to parents. Test performance analytics, including accuracy %, time-per-question, and batch rankings, are shared on our parent portal after every weekly test.',
  },
];
