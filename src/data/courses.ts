export interface Course {
  id: string;
  category: 'class11' | 'class12' | 'jee' | 'neet';
  title: string;
  badge: string;
  targetAudience: string;
  duration: string;
  hoursPerWeek: string;
  description: string;
  highlights: string[];
  keyTopics: string[];
  features: string[];
  inclusionInfo: string;
}

export const COURSES_DATA: Course[] = [
  {
    id: 'class-11-physics',
    category: 'class11',
    title: 'Class 11 Physics Foundation & Primer',
    badge: 'Foundation & Core',
    targetAudience: 'Class 11 students (CBSE / ISC / State Board + Early JEE/NEET aspirants)',
    duration: '1-Year Comprehensive Program',
    hoursPerWeek: '6 Hours (3 Lectures + 1 Doubt Clearance Session)',
    description: 'Transition smoothly from high school science into advanced vector mathematics, kinematics, and Newtonian mechanics. Build rock-solid conceptual visualization before starting competitive problem-solving.',
    highlights: [
      'Zero-assumptions approach to Vectors & Calculus for Physics',
      'Daily Problem Practice (DPP) with 15 graded questions per class',
      'Weekly 45-minute Speed & Concept Diagnostic Tests',
      'Special focus on HC Verma (Concepts of Physics Vol 1) deconstruction',
    ],
    keyTopics: [
      'Units & Measurements & Dimensional Analysis',
      'Kinematics (1D, 2D, Projectile Motion & Relative Velocity)',
      'Laws of Motion & Friction Dynamics',
      'Work, Energy & Power & Conservation Principles',
      'Rotational Motion & Rigid Body Dynamics',
      'Gravitation, Fluid Mechanics & Thermal Physics',
      'Oscillations (SHM) & Mechanical Waves',
    ],
    features: [
      'Printed Kashyap Classes Physics Modules & Formula Handbooks',
      'Weekly Subjective & Objective Assessments with rank analytics',
      '100% In-Person Physical Classroom lectures with handwritten board notes',
      'Daily evening doubt counter & in-person revision with Kashyap Sir',
    ],
    inclusionInfo: 'All 6 printed module sets, DPP booklets & test series included. Free Trial Class available.',
  },
  {
    id: 'class-12-physics',
    category: 'class12',
    title: 'Class 12 Board & Numerical Mastery',
    badge: 'Board Excellence + Entrance',
    targetAudience: 'Class 12 students aiming for 95%+ in Board Exams alongside rigorous JEE/NEET preparation',
    duration: '10-Month Rigorous Program + Fast-track Board Revision',
    hoursPerWeek: '7.5 Hours (3 Lectures + 1 Problem Solving Lab)',
    description: 'Master electrodynamics, electromagnetism, ray & wave optics, and modern physics with zero rote learning. Rigorous focus on CBSE derivation step-marking combined with speed numerical techniques.',
    highlights: [
      'Complete derivation compendium with step-marking guidelines for 70/70 in Board Theory',
      'Deep dive into Electromagnetism & Gauss Law surface integrations',
      'Optics ray-tracing and wave interference problem clinics',
      '15-year past board papers solved with model answer keys',
    ],
    keyTopics: [
      'Electric Charges, Fields & Gauss Theorem',
      'Electrostatic Potential & Capacitance Circuits',
      'Current Electricity, Kirchhoff Rules & Measuring Instruments',
      'Magnetic Effects of Current & Matter Magnetism',
      'Electromagnetic Induction & Alternating Current (LCR circuits)',
      'Wave Optics, Interference, Diffraction & Polarization',
      'Modern Physics (Photoelectric, Atoms, Nuclei, Semiconductors)',
    ],
    features: [
      'NCERT 100% line-by-line derivation blueprint handbook',
      'Exclusive Board Answer Sheet presentation workshops',
      'Simulated 3-hour Board Pre-Board Mock Exams with Sir’s evaluation',
      'Personal mentorship on eliminating calculation errors',
    ],
    inclusionInfo: 'Includes complete Board Derivation Kits, NCERT archives & CBT tests. Free Trial Class available.',
  },
  {
    id: 'jee-physics-intensive',
    category: 'jee',
    title: 'JEE (Main & Advanced) Physics Intensive',
    badge: 'Flagship Entrance Program',
    targetAudience: 'Class 12 & Dropper aspirants targeting 99+ percentile in JEE Main and Top 1000 AIR in JEE Advanced',
    duration: 'Year-Long Intensive + All India Test Series (AITS)',
    hoursPerWeek: '9 Hours (4 Lectures + 2 Advanced Numerical Workshops)',
    description: 'Engineered for students who want to conquer multi-concept, non-routine problems. We break down the hardest mechanics, rotational dynamics, and electrodynamics questions from Irodov, Pathfinder, and Krotov.',
    highlights: [
      'Multi-concept linking across disparate physics chapters',
      'Deconstruction of 200+ previous year JEE Advanced multi-correct & integer questions',
      'Graph analysis and extreme-case dimensional elimination shortcuts',
      'Rigorous Computer-Based Test (CBT) interface mirroring NTA JEE Main & IIT JEE Advanced',
    ],
    keyTopics: [
      'Advanced Rigid Body Dynamics, Rolling & Gyroscopic Precession',
      'Non-inertial Frames, Pseudo Forces & Variable Mass Mechanics',
      'Non-uniform Electric & Magnetic Field Topologies',
      'RLC Transient Responses & Complex AC Impedances',
      'Wave-Particle Duality & Relativistic Mechanics Basics',
      'Thermodynamic Cycles & Statistical Entropy Concept Models',
    ],
    features: [
      'Full Computer-Based Test (CBT) portal access with national percentile ranking',
      'Weekly 1-on-1 performance review with Arvind Kashyap',
      'Special "Pathfinder" problem sets for IIT aspirant batch',
      'Archive of 45 years JEE Advanced solved papers with conceptual keys',
    ],
    inclusionInfo: 'Full National CBT Test Series & advanced question banks included. Free Trial Class available.',
  },
  {
    id: 'neet-physics-accelerator',
    category: 'neet',
    title: 'NEET Physics High-Yield Accelerator',
    badge: 'Medical Physics Mastery',
    targetAudience: 'NEET aspirants aiming to convert Physics from their weakest subject into their rank-defining score (160+ out of 180)',
    duration: '8-Month Comprehensive + 60 Mock Drills',
    hoursPerWeek: '7.5 Hours (3 Lectures + 2 Speed Drills)',
    description: 'Eliminates the fear of calculations for biology students. We emphasize intuitive dimensional shortcuts, rapid formula mappings, and 100% NCERT statement-based questions.',
    highlights: [
      'Target 170+ out of 180 in NEET Physics through systematic speed drills',
      'Special mathematical tools boot camp (calculus, trigonometry, logarithmic approximations)',
      '38-minute time-management drill: solve 45 physics numericals accurately under exam pressure',
      'Every single NCERT example and back-exercise decoded in class',
    ],
    keyTopics: [
      'Units, Error Analysis & Dimensional Shortcuts',
      'Mechanics & Work-Power-Energy High-Yield Numericals',
      'Thermal Physics & Calorimetry Quick-Solve Methods',
      'Current Electricity & Circuit Reduction Hacks',
      'Optics & Optical Instruments High-Frequency Questions',
      'Modern Physics & Semiconductor Logic Gates (Guaranteed 35+ Marks)',
    ],
    features: [
      'OMR-based simulated full-length NEET mock tests every Sunday',
      'Error analysis logbook to permanently stamp out silly mistakes',
      'Formula mind-maps and pocket revision flashcards',
      'Direct motivation and doubt clinics with Kashyap Sir',
    ],
    inclusionInfo: 'OMR Mock Drills & complete NCERT high-yield booklets included. Free Trial Class available.',
  },
];
