export interface Testimonial {
  id: string;
  name: string;
  rankBadge: string;
  exam: 'JEE Advanced' | 'NEET UG' | 'JEE Main' | 'CBSE Board';
  collegeOrResult: string;
  batchYear: string;
  quote: string;
  story: string;
  physicsScore: string;
  avatarInitials: string;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-aryan-sharma',
    name: 'Aryan Sharma',
    rankBadge: 'AIR 142 · JEE Advanced',
    exam: 'JEE Advanced',
    collegeOrResult: 'IIT Delhi (Computer Science & Engineering)',
    batchYear: 'Batch 2024–2025',
    quote: 'Before Kashyap Classes, Mechanics felt like a nightmare of endless formulas. Kashyap Sir taught me to draw clean free-body diagrams and trust conservation laws. His handwritten notes and rotational motion workshops were the single biggest reason I scored 112/120 in Physics alone in JEE Advanced.',
    story: 'Aryan joined in Class 11 with average problem-solving speed. Under Kashyap Sir’s daily 15-question problem drill, he consistently topped test series across North India.',
    physicsScore: '112/120 in JEE Adv Physics',
    avatarInitials: 'AS',
  },
  {
    id: 't-sneha-verma',
    name: 'Dr. Sneha Verma',
    rankBadge: 'AIR 380 · NEET UG',
    exam: 'NEET UG',
    collegeOrResult: 'AIIMS New Delhi (MBBS)',
    batchYear: 'Batch 2024–2025',
    quote: 'As a biology student, I had a psychological barrier with physics numericals and calculus. Kashyap Sir never made me feel small for asking basic questions. His speed hacks for Ray Optics, Circuits, and Modern Physics made me finish the entire 45-question physics section in NEET in 38 minutes flat!',
    story: 'Sneha improved her physics score from 92/180 in her school pre-boards to a remarkable 175/180 in NEET UG, securing her dream seat at AIIMS New Delhi.',
    physicsScore: '175/180 in NEET Physics',
    avatarInitials: 'SV',
  },
  {
    id: 't-rohit-nair',
    name: 'Rohit Nair',
    rankBadge: '99.92 %ile · JEE Main',
    exam: 'JEE Main',
    collegeOrResult: 'IIT Bombay (Electrical Engineering)',
    batchYear: 'Batch 2023–2024',
    quote: 'The difference at Kashyap Classes is the personal accessibility of Kashyap Sir. In large commercial institutes, you are just a roll number. Here, Sir personally checked my test papers, identified why I made silly calculation errors in Electrodynamics, and fixed my exam temperament.',
    story: 'Rohit cleared both JEE Main with 99.92 percentile in Physics and qualified JEE Advanced with top honors.',
    physicsScore: '100 Percentile in Physics',
    avatarInitials: 'RN',
  },
  {
    id: 't-ananya-joshi',
    name: 'Ananya Joshi',
    rankBadge: '99/100 · CBSE Class 12 Boards',
    exam: 'CBSE Board',
    collegeOrResult: 'BITS Pilani (Mechanical Engineering)',
    batchYear: 'Batch 2024–2025',
    quote: 'Kashyap Sir doesn’t just teach competitive shortcuts; he is a master of NCERT step derivations. He taught us how to write answers that CBSE examiners love, with crisp diagrams and units. Scoring 99/100 in Physics while easily clearing BITSAT was completely because of this dual-track guidance.',
    story: 'Ananya balanced school board exams effortlessly with entrance exams, maintaining top grades throughout.',
    physicsScore: '99/100 in CBSE 12th Board',
    avatarInitials: 'AJ',
  },
  {
    id: 't-kartik-agarwal',
    name: 'Kartik Agarwal',
    rankBadge: 'AIR 612 · JEE Advanced',
    exam: 'JEE Advanced',
    collegeOrResult: 'IIT Roorkee (Data Science & AI)',
    batchYear: 'Batch 2023–2024',
    quote: 'I used to get stuck on multi-concept questions combining SHM with Electrostatics. Kashyap Sir has this signature technique where he breaks complex questions into 3 intuitive physical steps. Once you get his thought process, physics turns from your weakest subject to your highest rank booster.',
    story: 'Kartik jumped from a rank beyond 5,000 in early mock tests to AIR 612 in JEE Advanced.',
    physicsScore: '104/120 in JEE Adv Physics',
    avatarInitials: 'KA',
  },
  {
    id: 't-priya-patel',
    name: 'Priya Patel',
    rankBadge: '685/720 · NEET UG',
    exam: 'NEET UG',
    collegeOrResult: 'Maulana Azad Medical College (MAMC), Delhi',
    batchYear: 'Batch 2024–2025',
    quote: 'Every Sunday test at Kashyap Classes was tougher than the actual NEET exam, which made the real exam feel like a breeze. The daily doubt counters between 6 PM to 8 PM with Sir cleared every single ambiguity I ever had.',
    story: 'Priya consistently scored in top 5% of her batch and qualified for one of India’s top medical colleges.',
    physicsScore: '172/180 in NEET Physics',
    avatarInitials: 'PP',
  },
];
