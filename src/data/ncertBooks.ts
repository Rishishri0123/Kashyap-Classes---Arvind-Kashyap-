export interface NcertChapter {
  number: number;
  title: string;
  importantConcepts: string;
  jeeNeetWeightage: string;
  directPdfUrl?: string;
}

export interface NcertBook {
  id: string;
  title: string;
  standard: 'Class 11' | 'Class 12';
  part: 'Part 1' | 'Part 2';
  language: 'English';
  edition: string;
  description: string;
  pdfUrl: string;
  ncertCode: string;
  coverAccent: string;
  chaptersCount: number;
  chapters: NcertChapter[];
}

export const NCERT_BOOKS_DATA: NcertBook[] = [
  {
    id: 'ncert-11-physics-part1-en',
    title: 'NCERT Class 11 Physics (Part 1)',
    standard: 'Class 11',
    part: 'Part 1',
    language: 'English',
    edition: 'Official NCERT National Rationalised Edition',
    description: 'Foundational textbook covering Physical World, Vectors, Kinematics, Laws of Motion, Work-Energy-Power, Rotational Dynamics, and Gravitation.',
    pdfUrl: 'https://ncert.nic.in/textbook.php',
    ncertCode: 'keph1',
    coverAccent: 'from-blue-900 to-indigo-950',
    chaptersCount: 7,
    chapters: [
      {
        number: 1,
        title: 'Units and Measurements',
        importantConcepts: 'SI Units, Dimensional Analysis, Error Estimation & Propagation, Significant Figures',
        jeeNeetWeightage: '4–8 Marks (High Yield in NEET & JEE Main)',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph101.pdf',
      },
      {
        number: 2,
        title: 'Motion in a Straight Line',
        importantConcepts: 'Displacement-Time & Velocity-Time Graphs, Kinematic Equations via Calculus, Relative Velocity 1D',
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
      },
      {
        number: 3,
        title: 'Motion in a Plane',
        importantConcepts: 'Vectors Resolution, Dot & Cross Product, Projectile Motion Range/Trajectory, Uniform Circular Motion',
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph103.pdf',
      },
      {
        number: 4,
        title: 'Laws of Motion',
        importantConcepts: "Newton's 3 Laws, Free Body Diagrams (FBD), Static/Kinetic Friction, Banking of Roads, Pulley Systems",
        jeeNeetWeightage: '8–12 Marks (Crucial Foundation)',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph104.pdf',
      },
      {
        number: 5,
        title: 'Work, Energy and Power',
        importantConcepts: 'Work-Energy Theorem, Conservative Forces, Potential Energy Curve, 1D & 2D Elastic/Inelastic Collisions',
        jeeNeetWeightage: '8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph105.pdf',
      },
      {
        number: 6,
        title: 'System of Particles and Rotational Motion',
        importantConcepts: 'Center of Mass, Torque, Angular Momentum Conservation, Moment of Inertia Theorems, Rolling without Slipping',
        jeeNeetWeightage: '8–12 Marks (Top JEE Advanced Chapter)',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph106.pdf',
      },
      {
        number: 7,
        title: 'Gravitation',
        importantConcepts: "Kepler's Laws, Gravitational Potential & Field, Escape Velocity, Orbital Motion of Satellites",
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph107.pdf',
      },
    ],
  },
  {
    id: 'ncert-11-physics-part2-en',
    title: 'NCERT Class 11 Physics (Part 2)',
    standard: 'Class 11',
    part: 'Part 2',
    language: 'English',
    edition: 'Official NCERT National Rationalised Edition',
    description: 'Mechanics of solids & fluids, thermal properties of matter, thermodynamics cycles, kinetic theory, oscillations and waves.',
    pdfUrl: 'https://ncert.nic.in/textbook.php',
    ncertCode: 'keph2',
    coverAccent: 'from-cyan-900 to-blue-950',
    chaptersCount: 7,
    chapters: [
      {
        number: 8,
        title: 'Mechanical Properties of Solids',
        importantConcepts: "Hooke's Law, Stress-Strain Curve, Young's Modulus, Bulk & Shear Modulus, Elastic Potential Energy",
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph201.pdf',
      },
      {
        number: 9,
        title: 'Mechanical Properties of Fluids',
        importantConcepts: "Pascal's Law, Archimedes Principle, Bernoulli's Theorem, Surface Tension, Capillarity, Viscosity",
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph202.pdf',
      },
      {
        number: 10,
        title: 'Thermal Properties of Matter',
        importantConcepts: "Thermal Expansion, Specific Heat Capacity, Calorimetry, Newton's Law of Cooling, Stefan's Law, Wien's Displacement",
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph203.pdf',
      },
      {
        number: 11,
        title: 'Thermodynamics',
        importantConcepts: 'First & Second Laws of Thermodynamics, Isothermal & Adiabatic Processes, Heat Engines & Efficiency',
        jeeNeetWeightage: '8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph204.pdf',
      },
      {
        number: 12,
        title: 'Kinetic Theory of Gases',
        importantConcepts: 'Ideal Gas Equation, RMS/Average Speed, Degrees of Freedom, Law of Equipartition of Energy',
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph205.pdf',
      },
      {
        number: 13,
        title: 'Oscillations',
        importantConcepts: 'Simple Harmonic Motion (SHM), Energy in SHM, Simple Pendulum, Spring-Mass Combinations',
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph206.pdf',
      },
      {
        number: 14,
        title: 'Waves',
        importantConcepts: 'Transverse & Longitudinal Waves, Speed of Sound (Laplace Correction), Standing Waves in Pipes & Strings, Beats',
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph207.pdf',
      },
    ],
  },
  {
    id: 'ncert-12-physics-part1-en',
    title: 'NCERT Class 12 Physics (Part 1)',
    standard: 'Class 12',
    part: 'Part 1',
    language: 'English',
    edition: 'Official NCERT National Rationalised Edition',
    description: 'Core electrodynamics curriculum: Electric Charges & Fields, Gauss Law, Capacitance, Current Electricity, Magnetism, EMI & Alternating Current.',
    pdfUrl: 'https://ncert.nic.in/textbook.php',
    ncertCode: 'leph1',
    coverAccent: 'from-amber-900 to-slate-950',
    chaptersCount: 8,
    chapters: [
      {
        number: 1,
        title: 'Electric Charges and Fields',
        importantConcepts: "Coulomb's Law, Electric Dipole Field & Torque, Gauss's Law Applications, Flux Calculation",
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph101.pdf',
      },
      {
        number: 2,
        title: 'Electrostatic Potential and Capacitance',
        importantConcepts: 'Electric Potential due to Dipole/System, Equipotential Surfaces, Parallel Plate Capacitor, Dielectric Insertion',
        jeeNeetWeightage: '8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph102.pdf',
      },
      {
        number: 3,
        title: 'Current Electricity',
        importantConcepts: "Ohm's Law, Drift Velocity, Kirchhoff's Rules, Wheatstone Bridge, Meter Bridge & Potentiometer Basics",
        jeeNeetWeightage: '8–12 Marks (High Frequency)',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph103.pdf',
      },
      {
        number: 4,
        title: 'Moving Charges and Magnetism',
        importantConcepts: 'Biot-Savart Law, Ampere Circuital Law, Force on Current Wire, Moving Coil Galvanometer Sensitivity',
        jeeNeetWeightage: '8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph104.pdf',
      },
      {
        number: 5,
        title: 'Magnetism and Matter',
        importantConcepts: 'Magnetic Dipole Moment, Earth Magnetic Elements, Diamagnetic, Paramagnetic, Ferromagnetic Properties',
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph105.pdf',
      },
      {
        number: 6,
        title: 'Electromagnetic Induction (EMI)',
        importantConcepts: "Faraday's Laws, Lenz's Law Direction, Motional EMF, Self and Mutual Inductance, Eddy Currents",
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph106.pdf',
      },
      {
        number: 7,
        title: 'Alternating Current (AC)',
        importantConcepts: 'Peak vs RMS Voltage, LCR Series Circuit Resonance, Phasor Diagrams, Power Factor & Wattless Current, Transformers',
        jeeNeetWeightage: '8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph107.pdf',
      },
      {
        number: 8,
        title: 'Electromagnetic Waves',
        importantConcepts: 'Displacement Current (Maxwell), EM Wave Characteristics, Electromagnetic Spectrum & Applications',
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph108.pdf',
      },
    ],
  },
  {
    id: 'ncert-12-physics-part2-en',
    title: 'NCERT Class 12 Physics (Part 2)',
    standard: 'Class 12',
    part: 'Part 2',
    language: 'English',
    edition: 'Official NCERT National Rationalised Edition',
    description: 'Optics and Modern Physics: Ray Optics, Wave Optics (YDSE), Dual Nature of Radiation & Matter, Atoms, Nuclei, and Semiconductor Electronics.',
    pdfUrl: 'https://ncert.nic.in/textbook.php',
    ncertCode: 'leph2',
    coverAccent: 'from-emerald-900 to-slate-950',
    chaptersCount: 6,
    chapters: [
      {
        number: 9,
        title: 'Ray Optics and Optical Instruments',
        importantConcepts: 'Total Internal Reflection, Lens Maker Formula, Prism Deviation, Compound Microscope & Astronomical Telescope',
        jeeNeetWeightage: '8–12 Marks (Major High Weightage)',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph201.pdf',
      },
      {
        number: 10,
        title: 'Wave Optics',
        importantConcepts: "Huygens' Principle, Young's Double Slit Experiment (YDSE) Fringe Width, Single Slit Diffraction, Brewster Law",
        jeeNeetWeightage: '8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph202.pdf',
      },
      {
        number: 11,
        title: 'Dual Nature of Radiation and Matter',
        importantConcepts: "Photoelectric Effect (Einstein's Equation), Stopping Potential Graphs, de Broglie Wavelength of Particles",
        jeeNeetWeightage: '4–8 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph203.pdf',
      },
      {
        number: 12,
        title: 'Atoms',
        importantConcepts: 'Rutherford Alpha Scattering, Bohr Model Postulates, Hydrogen Emission Spectral Series (Lyman, Balmer, Paschen)',
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph204.pdf',
      },
      {
        number: 13,
        title: 'Nuclei',
        importantConcepts: 'Nuclear Density, Mass Defect & Binding Energy per Nucleon, Nuclear Fission & Fusion, Q-Value Calculations',
        jeeNeetWeightage: '4 Marks',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph205.pdf',
      },
      {
        number: 14,
        title: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
        importantConcepts: 'Intrinsics vs Extrinsics (p & n type), p-n Junction Diode Forward/Reverse Bias, Half/Full Wave Rectifier, Energy Bands',
        jeeNeetWeightage: '8–12 Marks (High Scoring Topic)',
        directPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph206.pdf',
      },
    ],
  },
];
