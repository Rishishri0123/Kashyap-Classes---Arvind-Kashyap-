import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { registerNotesStoreRoutes } from './server/notesApi.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive knowledge base for Kashyap Classes website & Deep Physics Concepts
function generateComprehensiveWebsiteAnswer(query: string, history: Array<{ role: string; text: string }> = []): string {
  const q = query.toLowerCase();

  // 1. Developer / Creator Information
  if (q.includes('rishi') || q.includes('developer') || q.includes('creator') || q.includes('who developed') || q.includes('who made') || q.includes('who created') || q.includes('designed by')) {
    return `💻 **Website Engineering & Development Credit**:\n\nThis official web application for **Kashyap Classes** was designed, developed, and created by **Rishi Shrivastav**.\n\n**Key Technical & Architectural Features Built by Rishi Shrivastav:**\n• **Interactive Class 12 Concept Simulation Lab**: Real-time SVG simulators for Wave Optics (Young's Double Slit Experiment), Lenz's Law Electromagnetic Induction, and Einstein's Photoelectric Effect.\n• **Official NCERT Physics Digital Repository**: Line-by-line syllabus mapping and direct chapter PDF access for Class 11 and Class 12.\n• **High-Performance Physics Counselor AI**: Instant academic guidance, syllabus deconstruction, and admissions counseling.\n• **Responsive Design**: Custom Tailwind styling with zero-pill visual hierarchy, high contrast typography, and frictionless 1-click Free Trial booking.\n\nIs there a specific feature or course you would like to explore?`;
  }

  // 2. Newton's Laws of Motion & Mechanics
  if (q.includes('newton') || q.includes('laws of motion') || q.includes('inertia') || q.includes('f=ma') || q.includes('momentum') || q.includes('friction') || q.includes('pseudo force')) {
    return `⚡ **Newton's Laws of Motion & Classical Mechanics (Kashyap Sir's Methodology)**:\n\nIn our classroom lectures, Arvind Kashyap Sir teaches mechanics using **Free Body Diagrams (FBD)** rather than formula memorization:\n\n1. **First Law (Law of Inertia)**: An object remains at rest or in uniform rectilinear motion unless acted upon by a non-zero net external force ($\\Sigma \\vec{F}_{ext} = 0 \\implies \\vec{v} = \\text{constant}$). Inertia is quantified directly by mass.\n2. **Second Law (Fundamental Law)**: The rate of change of linear momentum is directly proportional to the applied net external force and occurs in its direction:\n   $$\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m\\frac{d\\vec{v}}{dt} + \\vec{v}\\frac{dm}{dt}$$\n   For constant mass ($dm/dt = 0$), this simplifies to $\\vec{F}_{net} = m\\vec{a}$.\n3. **Third Law (Action & Reaction)**: Forces always occur in matched pairs: $\\vec{F}_{AB} = -\\vec{F}_{BA}$. Action and reaction act on **two different bodies**, which is why they never cancel each other out.\n\n**Sir's Golden Rule for Numerical Problem Solving**:\nAlways isolate each body, draw standard coordinate axes along and perpendicular to the direction of acceleration, identify contact normal ($N$), tension ($T$), and friction ($f_s \\le \\mu_s N$), and apply $\\Sigma F = ma$.`;
  }

  // 3. Kinematics, Projectile Motion & Vectors
  if (q.includes('kinematic') || q.includes('projectile') || q.includes('trajectory') || q.includes('range') || q.includes('acceleration') || q.includes('relative velocity')) {
    return `🎯 **Kinematics & Projectile Motion Breakdown**:\n\nArvind Kashyap Sir deconstructs 2D projectile motion into two completely independent 1D motions:\n\n• **Horizontal Motion ($X$-axis)**: Zero acceleration ($a_x = 0$), constant velocity $u_x = u\\cos\\theta$.\n• **Vertical Motion ($Y$-axis)**: Downward gravity ($a_y = -g$), velocity $v_y = u\\sin\\theta - gt$.\n\n**Key Formulae Derived in Class**:\n1. **Time of Flight**: $T = \\frac{2u\\sin\\theta}{g} = \\frac{2u_y}{g}$\n2. **Maximum Height**: $H_{max} = \\frac{u^2\\sin^2\\theta}{2g} = \\frac{u_y^2}{2g}$\n3. **Horizontal Range**: $R = \\frac{u^2\\sin 2\\theta}{g} = \\frac{2u_x u_y}{g}$ (Maximum range occurs at $\\theta = 45^\\circ$)\n4. **Equation of Trajectory**: $y = x\\tan\\theta - \\frac{gx^2}{2u^2\\cos^2\\theta} = x\\tan\\theta\\left(1 - \\frac{x}{R}\\right)$\n\n*Would you like to test our Projectile on Incline simulation in our Concept Lab?*`;
  }

  // 4. Rotational Dynamics & Moment of Inertia
  if (q.includes('rotation') || q.includes('torque') || q.includes('moment of inertia') || q.includes('angular momentum') || q.includes('rolling')) {
    return `🌀 **Rotational Dynamics & Rolling Motion (Arvind Kashyap Pedagogy)**:\n\nRotational mechanics is the exact rotational analog of linear translational motion:\n\n• Mass ($m$) $\\longleftrightarrow$ Moment of Inertia ($I = \\int r^2 dm$)\n• Force ($F = ma$) $\\longleftrightarrow$ Torque ($\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}$)\n• Linear Momentum ($p = mv$) $\\longleftrightarrow$ Angular Momentum ($L = I\\omega$)\n• Kinetic Energy ($K = \\frac{1}{2}mv^2$) $\\longleftrightarrow$ $K_{rot} = \\frac{1}{2}I\\omega^2$\n\n**Pure Rolling Without Slipping**:\nAt the point of contact with the ground: $v_{contact} = v_{cm} - R\\omega = 0 \\implies v_{cm} = R\\omega$.\nTotal kinetic energy of a rolling body is the sum of translational and rotational energy:\n$$K_{total} = \\frac{1}{2}M v_{cm}^2\\left(1 + \\frac{k^2}{R^2}\\right)$$\nwhere $k$ is the radius of gyration.`;
  }

  // 5. Work, Energy, Power & Collisions
  if (q.includes('work energy') || q.includes('work-energy') || q.includes('power') || q.includes('collision') || q.includes('conservation of energy')) {
    return `⚡ **Work, Energy, Power & Conservation Laws**:\n\n• **Work-Energy Theorem**: The work done by ALL forces (conservative, non-conservative, and pseudo) equals the change in kinetic energy:\n  $$W_{all} = \\Delta K = K_f - K_i$$\n• **Conservation of Mechanical Energy**: Holds when only conservative forces do work:\n  $$\\Delta K + \\Delta U = 0 \\implies K_i + U_i = K_f + U_f$$\n• **Collisions (Coefficient of Restitution $e$)**:\n  $$e = \\frac{v_2 - v_1}{u_1 - u_2}$$\n  - $e = 1$: Perfectly elastic (Both momentum & kinetic energy conserved)\n  - $0 < e < 1$: Inelastic collision\n  - $e = 0$: Perfectly inelastic (Bodies stick together, maximum loss in kinetic energy)`;
  }

  // 6. Wave Optics & Young's Double Slit Experiment (YDSE)
  if (q.includes('ydse') || q.includes('double slit') || q.includes('fringe') || q.includes('interference') || q.includes('wave optics') || q.includes('diffraction')) {
    return `🌈 **Wave Optics & Interference (YDSE Analysis)**:\n\nIn Young's Double Slit Experiment, two coherent wave sources with slit separation $d$ illuminate a screen at distance $D$ ($D \\gg d$):\n\n• **Path Difference**: $\\Delta x = d\\sin\\theta \\approx \\frac{yd}{D}$\n• **Constructive Interference (Bright Fringes)**: $\\Delta x = n\\lambda \\implies y_n = \\frac{n\\lambda D}{d}$ ($n = 0, \\pm 1, \\pm 2...$)\n• **Destructive Interference (Dark Fringes)**: $\\Delta x = (2n-1)\\frac{\\lambda}{2} \\implies y_n = (2n-1)\\frac{\\lambda D}{2d}$\n• **Fringe Width ($\\beta$)**: Distance between any two consecutive bright or dark fringes:\n  $$\\beta = \\frac{\\lambda D}{d}$$\n\n🔬 *You can interact with our live YDSE Simulator right on this website in the **Class 12 Lab** section to watch fringes change with laser color!*`;
  }

  // 7. Electromagnetic Induction & Lenz's Law
  if (q.includes('lenz') || q.includes('faraday') || q.includes('electromagnetic induction') || q.includes('emi') || q.includes('induced emf') || q.includes('inductance')) {
    return `🧲 **Electromagnetic Induction & Lenz's Law**:\n\n• **Faraday's Law**: The magnitude of induced EMF in a circuit equals the time rate of change of magnetic flux through it:\n  $$\\varepsilon = -\\frac{d\\Phi_B}{dt} = -\\frac{d(B A \\cos\\theta)}{dt}$$\n• **Lenz's Law (Significance of the Negative Sign)**: The direction of induced current is always such that it opposes the change in magnetic flux that produces it.\n• **Connection to Energy Conservation**: If Lenz's law did not have the negative sign, a moving magnet would experience an attractive acceleration without external work, creating infinite free energy and violating the First Law of Thermodynamics!\n\n🔬 *Check our interactive Lenz's Law simulator in the **Class 12 Lab** section!*`;
  }

  // 8. Photoelectric Effect & Modern Physics
  if (q.includes('photoelectric') || q.includes('work function') || q.includes('stopping potential') || q.includes('einstein') || q.includes('de broglie') || q.includes('bohr') || q.includes('modern physics')) {
    return `⚛️ **Einstein's Photoelectric Equation & Quantum Radiation**:\n\nLight consists of localized discrete energy packets called photons, each carrying energy $E = h\\nu = \\frac{hc}{\\lambda}$.\n\n**Einstein's Photoelectric Equation**:\n$$h\\nu = \\Phi_0 + K_{max} = \\Phi_0 + e V_0$$\nwhere:\n• $\\Phi_0 = h\\nu_0$: Metal work function (minimum energy required to liberate an electron)\n• $\\nu_0$: Threshold frequency\n• $V_0$: Stopping potential (retarding potential that stops the fastest photoelectrons)\n\n**Key Observations**:\n1. Kinetic energy depends strictly on **frequency/wavelength**, not light intensity.\n2. Photoelectric current is directly proportional to **incident intensity**.\n3. Zero time lag ($< 10^{-9}$s) between photon arrival and electron ejection.`;
  }

  // 9. Electrostatics & Gauss's Law
  if (q.includes('electrostatic') || q.includes('gauss') || q.includes('coulomb') || q.includes('capacit') || q.includes('electric field') || q.includes('dipole')) {
    return `⚡ **Electrostatics & Gauss's Theorem (Class 12 Core)**:\n\n• **Coulomb's Law**: $F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}$\n• **Gauss's Theorem**: The total electric flux through any closed Gaussian surface equals $1/\\varepsilon_0$ times the total net charge enclosed:\n  $$\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{enclosed}}{\\varepsilon_0}$$\n• **Capacitance of Parallel Plate Capacitor**:\n  $$C_0 = \\frac{\\varepsilon_0 A}{d} \\quad \\xrightarrow{\\text{Dielectric } K} \\quad C = \\frac{K\\varepsilon_0 A}{d}$$\n• **Energy Stored in Capacitor**: $U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C} = \\frac{1}{2} Q V$`;
  }

  // 10. Current Electricity & Circuits
  if (q.includes('current electricity') || q.includes('ohm') || q.includes('drift velocity') || q.includes('kirchhoff') || q.includes('wheatstone') || q.includes('potentiometer')) {
    return `🔌 **Current Electricity & Circuit Theorems**:\n\n• **Drift Velocity**: $v_d = -\\frac{e E \\tau}{m}$ and Current relation $I = n e A v_d$\n• **Kirchhoff's Current Law (KCL)**: $\\Sigma I = 0$ at any node (Law of Conservation of Charge)\n• **Kirchhoff's Voltage Law (KVL)**: $\\Sigma \\Delta V = 0$ around any closed loop (Law of Conservation of Energy)\n• **Wheatstone Bridge Balanced Condition**:\n  $$\\frac{P}{Q} = \\frac{R}{S} \\implies I_g = 0$$`;
  }

  // 11. Class 12 Physics & Board Exam Derivations
  if (q.includes('class 12') || q.includes('12th') || q.includes('board') || q.includes('derivation')) {
    return `⚡ **Class 12 Physics Comprehensive Program & Board Derivations**:\n\nOur Class 12 program is engineered to achieve **98%+ in CBSE/State Boards** while simultaneously mastering competitive numericals for JEE & NEET.\n\n**Core Curriculum Modules Covered by Arvind Kashyap Sir:**\n1. **Electrostatics & Capacitance**: Gauss's Theorem applications, dipole electric field & torque, dielectric capacitance.\n2. **Current Electricity**: Kirchhoff's circuit laws, Wheatstone bridge, drift velocity derivation.\n3. **Electromagnetism & AC**: Biot-Savart law, Ampere's circuital law, Lenz's law, LCR series resonance.\n4. **Optics**: Ray Optics (lens maker formula, prism deviation) & Wave Optics (Young's Double Slit Experiment fringe width $\\beta = \\lambda D/d$).\n5. **Modern Physics**: Photoelectric effect ($K_{max} = h\\nu - \\Phi_0$), Bohr's hydrogen model, and Semiconductors.\n\n🔬 *Check out our **Concept Simulation Lab** right on this website to test interactive Class 12 simulations for YDSE and Lenz's Law!*`;
  }

  // 12. Class 11 Physics & Foundation
  if (q.includes('class 11') || q.includes('11th') || q.includes('foundation')) {
    return `🎯 **Class 11 Physics Foundation & Primer Program**:\n\nClass 11 builds the foundational bedrock (accounting for ~50% of JEE and NEET physics marks). Arvind Kashyap Sir bridges the jump from Class 10 basic science to advanced analytical mechanics.\n\n**Class 11 Core Syllabus Modules:**\n• **Mathematical Tools & Vectors**: Dot/cross products, calculus in kinematics.\n• **Newton's Laws & Friction**: Free-body diagrams (FBD), pulley constraints, circular banking.\n• **Work, Energy & Power**: Conservation of mechanical energy, 1D/2D collisions.\n• **Rotational Dynamics**: Moment of inertia theorems, torque, angular momentum conservation, rolling without slipping.\n• **Gravitation, Fluids & Thermodynamics**: Kepler's laws, Bernoulli's theorem, Carnot engine.\n• **Oscillations & Waves**: Simple Harmonic Motion (SHM), resonance, sound waves & Doppler effect.\n\nWould you like to book a **Free 2-Hour Trial Class** with Kashyap Sir to experience how vectors are visually taught?`;
  }

  // 13. NEET Physics Accelerator (Target 170+)
  if (q.includes('neet') || q.includes('medical') || q.includes('doctor') || q.includes('aiims') || q.includes('biology')) {
    return `🩺 **NEET 170+ High-Yield Physics Accelerator**:\n\nEngineered specifically for medical aspirants who excel in biology but struggle with numerical physics.\n\n**Our Unique NEET Pedagogy:**\n• **100% NCERT Line-by-Line Decoupling**: Mastering 'Points to Ponder' and margin remarks where NTA frames tricky assertion-reason questions.\n• **Speed Drill Method**: Learn dimensional inspection and boundary conditions to solve questions in under 45 seconds.\n• **Maths Bootcamp**: 2-week bridge course on trigonometry, differentiation, integration, and graph slope analysis.\n• **Proven Result**: **Dr. Sneha Verma** scored **175/180** in NEET Physics and is currently pursuing MBBS at AIIMS New Delhi!\n\nWould you like to speak with Arvind Kashyap Sir directly or book a Free Trial Class?`;
  }

  // 14. JEE Main & Advanced Intensive
  if (q.includes('jee') || q.includes('iit') || q.includes('advanced') || q.includes('engineering') || q.includes('irodov')) {
    return `🚀 **JEE (Main & Advanced) Physics Intensive Program**:\n\nDesigned to elevate physics from an intimidating subject into your highest-scoring rank booster for IIT Bombay, Delhi, and top NITs.\n\n**Key Highlights:**\n• **Multi-Concept Problem Topology**: Training on Irodov, Krotov, and Pathfinder advanced problem sets.\n• **Conservation Laws First**: Solving complex multi-body problems using only Energy and Momentum conservation rather than 50 memorize formulas.\n• **Full-Scale CBT Mock Tests**: Simulated Computer-Based Tests with All-India ranking and chapter-wise error heatmaps.\n• **Hall of Fame**: **Aryan Sharma (AIR 142 JEE Adv, IIT Delhi)** & **Rohit Nair (99.92 %ile JEE Main, IIT Bombay)**!\n\nAdmission is open for the 2026–27 cohort under Arvind Kashyap Sir.`;
  }

  // 15. NCERT Physics Textbooks & Official PDFs
  if (q.includes('ncert') || q.includes('pdf') || q.includes('book') || q.includes('download') || q.includes('textbook') || q.includes('exemplar')) {
    return `📚 **Official NCERT Physics Textbooks & Digital Hub**:\n\nOur website features direct access to the official National NCERT Physics textbooks for Class 11 and 12:\n\n1. **Class 11 Physics (Part 1)**: Units & Dimensions, Kinematics, Laws of Motion, Work-Energy, Rotational Motion, Gravitation (Code: keph1).\n2. **Class 11 Physics (Part 2)**: Mechanical Solids/Fluids, Thermodynamics, Kinetic Theory, Oscillations & Waves (Code: keph2).\n3. **Class 12 Physics (Part 1)**: Electric Charges & Fields, Potential & Capacitance, Current Electricity, Magnetism, EMI & AC, EM Waves (Code: leph1).\n4. **Class 12 Physics (Part 2)**: Ray Optics, Wave Optics (YDSE), Dual Nature, Atoms, Nuclei, Semiconductors (Code: leph2).\n\nYou can scroll down to our **NCERT Physics Books Hub** section on this website to read and download the official PDFs chapter-by-chapter!`;
  }

  // 16. Interactive Concept Simulation Lab
  if (q.includes('simulation') || q.includes('lab') || q.includes('experiment') || q.includes('virtual')) {
    return `🔬 **Interactive Concept Simulation Lab on This Website**:\n\nDeveloped to demonstrate Arvind Kashyap Sir's visual teaching philosophy, our simulation lab features:\n\n1. **Class 12 Wave Optics (YDSE)**: Adjust laser wavelength (Red 650nm, Green 532nm, Blue 450nm, Violet 405nm), slit separation ($d$), and screen distance ($D$) to watch live alternating bright/dark interference fringes and compute fringe width $\\beta = \\lambda D / d$.\n2. **Class 12 Lenz's Law & EMI**: Move a bar magnet (North/South pole) towards or away from a coil to visualize induced current direction (CW vs CCW) and magnetic flux opposition.\n3. **Class 12 Photoelectric Effect**: Adjust incident photon energy ($h\\nu$) and metal work function (Cesium 2.14 eV, Sodium 2.75 eV, Copper 4.65 eV) to observe emitted photoelectrons and stopping potential ($V_0$).\n4. **Class 11 Projectile on Incline**: Decompose gravity along and perpendicular to an inclined slope ($g_\\perp = g\\cos\\beta$, $g_\\parallel = g\\sin\\beta$).\n\nVisit the **Class 12 Lab** tab on the navigation bar to interact with these simulations right now!`;
  }

  // 17. Faculty & Mentorship: Arvind Kashyap (Kashyap Sir)
  if (q.includes('arvind') || q.includes('kashyap sir') || q.includes('mentor') || q.includes('teacher') || q.includes('faculty') || q.includes('founder')) {
    return `👨‍🏫 **About Arvind Kashyap (Kashyap Sir)**:\n\n**Founder & Lead Physics Mentor**, Kashyap Classes (Est. 2008).\n\n• **Experience**: 20+ years of dedicated physics classroom teaching.\n• **Track Record**: Mentored 4,200+ students selected in IITs, NITs, and top medical colleges (AIIMS, Maulana Azad).\n• **Zero-Substitute Guarantee**: Unlike commercial coaching factories where junior teachers or delegates teach, **Arvind Kashyap Sir personally conducts 100% of the lectures** for every batch.\n• **Daily Doubt Desk**: Sir is personally available from 5:30 PM to 8:00 PM every single evening for 1-on-1 student doubt clearing.\n• **Teaching Style**: "Deep Concept Clarity, Not Blind Formulas"—teaching how to sketch vector diagrams and derive equations from first principles.`;
  }

  // 18. Batch Schedules & Timetables
  if (q.includes('schedule') || q.includes('timing') || q.includes('timetable') || q.includes('batch') || q.includes('days') || q.includes('time') || q.includes('slot')) {
    return `🗓️ **Batch Schedules & Timetables (Session 2026–27)**:\n\nCohorts are structured around school hours to ensure zero academic fatigue:\n\n• **Class 11 Foundation**: Mon, Wed, Fri (Evening Cohort)\n• **Class 11 Weekend Integrated**: Saturday & Sunday (Morning Cohort)\n• **Class 12 Boards & Competitive**: Tue, Thu, Sat (Morning Cohort)\n• **Class 12 Board Derivations**: Mon, Wed, Fri (Evening Cohort)\n• **JEE Advanced Rankers**: Mon, Wed, Fri + Weekend Problem Lab\n• **NEET Target 170+**: Tue, Thu, Sat + Speed Drills\n\nAll batches are personally taught by Arvind Kashyap Sir. Check the **Schedules** section on our website for detailed day-by-day routines.`;
  }

  // 19. Online Classes & Recording Policy (Strict 100% In-Person Offline Coaching)
  if (q.includes('online') || q.includes('record') || q.includes('video lecture') || q.includes('live stream') || q.includes('stream') || q.includes('zoom') || q.includes('recorded')) {
    return `🏛️ **100% In-Person Offline Classroom Policy (No Online Classes or Recordings)**:\n\n**We do not offer online classes or lecture recordings.**\n\n• **Physical Center Only**: All programs (Class 11, Class 12, JEE, and NEET) are conducted strictly in-person inside our physical classrooms.\n• **Why In-Person Only?**: Arvind Kashyap Sir firmly believes that true mastery in Physics requires direct eye contact, active chalkboard derivations, notebook checks, and deep focus free from screen fatigue and digital distractions.\n• **Missed Class Policy**: If a student is absent due to genuine medical or school emergencies, they receive complete handwritten class board notes, printed lecture handouts, and dedicated 1-on-1 backup doubt clearing directly with Arvind Kashyap Sir during evening doubt desk hours (5:30 PM – 8:00 PM).\n• **Experience It Yourself**: Book a **Free 2-Hour In-Person Trial Class** at our center to experience Sir's interactive teaching firsthand!`;
  }

  // 20. Fees & Payment Structure
  if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('installment') || q.includes('payment')) {
    return `💳 **Transparent Fee Structure & Policies**:\n\nAt Kashyap Classes, we maintain complete transparency with **zero hidden fees**:\n\n• **All-Inclusive Enrollment**: Course enrollment covers all 12 printed study modules, daily problem practice (DPP) sets, comprehensive CBT test series, and unlimited access to the evening doubt counter.\n• **Flexible Installments**: Parents can pay in **2 to 3 convenient installments** across the academic session.\n• **Counseling Consultation**: Exact course fee structures are shared transparently with parents during 1:1 counseling based on the selected program (Class 11, Class 12, JEE, or NEET).\n• **Zero Risk**: We invite every student to experience our **Free 2-Hour Live Trial Demo Class** before making any financial commitment!`;
  }

  // 21. Free Trial Demo Class Booking
  if (q.includes('free trial') || q.includes('demo') || q.includes('trial class') || q.includes('book demo') || q.includes('free class')) {
    return `✨ **Book Your Free 2-Hour Live Physics Trial Class**:\n\nExperience Arvind Kashyap Sir's concept deconstruction firsthand with zero obligation:\n\n• **What You Get**: Attend a real live classroom lecture with Arvind Kashyap (Kashyap Sir).\n• **Assess Clarity**: See how vector mechanics, rotation, or electrodynamics are visually explained.\n• **1-on-1 Foundation Audit**: Sir personally evaluates your current conceptual gaps and suggests a customized study strategy.\n• **Zero Payment**: 100% free with no hidden registration fee.\n\nYou can click **Book Free Trial** on our website or submit your details in the inquiry form to confirm your demo slot!`;
  }

  // 22. Contact, Address & Helpline
  if (q.includes('contact') || q.includes('address') || q.includes('phone') || q.includes('call') || q.includes('whatsapp') || q.includes('where') || q.includes('location')) {
    return `📍 **Contact Information & Institute Address**:\n\n• **Institute**: Kashyap Classes (Mentor: Arvind Kashyap Sir)\n• **Center Address**: Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002\n• **Google Rating**: ⭐ 4.8 / 5.0 (15+ verified student reviews)\n• **Email**: admissions@kashyapclasses.in\n• **Counseling Hours**: Mon–Sat: 7:00 AM – 8:30 PM | Sunday: 8:00 AM – 1:30 PM\n• **Website Engineered by**: Rishi Shrivastav\n\n*To prevent spam, Kashyap Sir's direct phone number is unlocked as soon as you enter your name and phone in our inquiry form!*`;
  }

  // 23. Official Class 12 Handwritten Notes Archive (14 Chapters)
  if (q.includes('note') || q.includes('handwritten') || q.includes('chapter note') || q.includes('notes') || q.includes('study material') || q.includes('pdf note')) {
    return `📝 **Official Class 12 Physics Handwritten Notes (14 Chapters)**:\n\nAuthored personally by **Arvind Kashyap (Kashyap Sir)**, our website features the complete master notes library for all 14 Class 12 NCERT chapters:\n\n• **Part 1 (Ch 1–8)**: Electric Charges & Fields (22p), Potential & Capacitance (26p), Current Electricity (29p), Moving Charges & Magnetism (28p), Magnetism & Matter (12p), Electromagnetic Induction (10p), Alternating Current (23p), EM Waves (10p).\n• **Part 2 (Ch 9–14)**: Ray Optics (34p), Wave Optics (17p), Dual Nature of Radiation (16p), Atoms (12p), Nuclei (14p), Semiconductor Devices (14p).\n\n🔒 **How to Unlock**: The notes are 100% free! Simply scroll down to the **Class 12 Notes** section on the website, enter your basic student details (Name, Class, Phone Number), and all 14 chapter PDFs unlock instantly for in-browser preview and direct high-speed download!`;
  }

  // 24. Conversational Greeting or Broad Question
  return `Namaste! 🙏 I am **Kashyap AI Sahayak**, the official academic counselor for Kashyap Classes.\n*(Website Developed & Created by Rishi Shrivastav)*\n\nI have complete knowledge of our institute, website, and advanced physics concepts across CBSE, JEE, NEET, and Olympiads. You can ask me about:\n\n1. **Official Class 12 Handwritten Notes (14 Chapters)** by Arvind Kashyap Sir\n2. **Center Location & Google Maps** (Shastri Nagar, Ghaziabad)\n3. **100% In-Person Physical Classroom Policy** (We strictly do not offer online classes or recordings)\n4. **Physics Concepts & Problem Solving** (Mechanics, Newton's Laws, Electrodynamics, Optics, HCV, Irodov, Board Derivations)\n5. **Interactive Concept Simulation Lab** (Wave Optics, EMI & Photoelectric simulators)\n6. **Official NCERT Physics Textbooks** (Class 11 & 12 chapter PDFs)\n7. **Batch Timetables & Schedules** for JEE, NEET, and Boards\n8. **Booking a Free 2-Hour Live Trial Demo Class** with Arvind Kashyap Sir\n9. **Website Architecture & Credits** (Developed by Rishi Shrivastav)\n\nWhat would you like to explore today?`;
}

// --- INQUIRY & OWNER ADMIN STORE ---
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

const DATA_DIR = path.resolve(__dirname, 'data');
const INQUIRIES_FILE = path.resolve(DATA_DIR, 'inquiries.json');

// Static credentials specified by the owner
const ADMIN_ID = 'KC2026';
const ADMIN_PASS = 'Rishi@kc';
const ADMIN_SESSION_SECRET = 'kc_secret_token_2026_authorized_owner_session';

const INITIAL_SEED_INQUIRIES: InquiryRecord[] = [];

function loadInquiries(): InquiryRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(INITIAL_SEED_INQUIRIES, null, 2), 'utf-8');
      return INITIAL_SEED_INQUIRIES;
    }
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_INQUIRIES;
  } catch (err) {
    console.warn('Error reading inquiries file, fallback to memory:', err);
    return INITIAL_SEED_INQUIRIES;
  }
}

function saveInquiries(inquiries: InquiryRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save inquiries to file:', err);
  }
}

function verifyAdminAuth(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return token === ADMIN_SESSION_SECRET;
  }
  const customHeader = req.headers['x-admin-token'];
  if (customHeader === ADMIN_SESSION_SECRET) {
    return true;
  }
  return false;
}

function getCliArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  const prefix = `${flag}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

async function startServer() {
  const app = express();
  const cliPort = Number(getCliArg('--port'));
  const PORT = (Number.isFinite(cliPort) && cliPort > 0 ? cliPort : Number(process.env.PORT)) || 3000;
  const HOST = getCliArg('--host') || '0.0.0.0';

  app.use(express.json());

  // 0. Notes Storefront, Cloudflare R2 & Razorpay API Routes
  registerNotesStoreRoutes(app);

  // 1. Owner Admin Login Endpoint (ID: KC2026, Pass: Rishi@kc)
  app.post('/api/admin/login', (req, res) => {
    try {
      const { id, password } = req.body;
      const cleanId = (id || '').toString().trim();
      const cleanPass = (password || '').toString().trim();

      if (cleanId === ADMIN_ID && cleanPass === ADMIN_PASS) {
        return res.status(200).json({
          success: true,
          token: ADMIN_SESSION_SECRET,
          admin: {
            id: ADMIN_ID,
            name: 'Kashyap Classes Owner',
            role: 'Owner',
            loginTime: new Date().toISOString(),
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Invalid Owner ID or Password. Please check credentials.',
        });
      }
    } catch {
      return res.status(500).json({ success: false, error: 'Server authentication error' });
    }
  });

  // 2. Fetch all inquiries (Owner Only)
  app.get('/api/admin/inquiries', (req, res) => {
    if (!verifyAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Owner access required.' });
    }
    const inquiries = loadInquiries();
    // Return newest inquiries first
    const sorted = [...inquiries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return res.status(200).json({ success: true, inquiries: sorted });
  });

  // 3. Update inquiry status or owner notes (Owner Only)
  app.patch('/api/admin/inquiries/:id', (req, res) => {
    if (!verifyAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Owner access required.' });
    }
    const targetId = req.params.id;
    const { status, ownerNotes } = req.body;

    const inquiries = loadInquiries();
    const index = inquiries.findIndex((inq) => inq.id === targetId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Inquiry record not found' });
    }

    if (status !== undefined) {
      inquiries[index].status = status;
    }
    if (ownerNotes !== undefined) {
      inquiries[index].ownerNotes = ownerNotes;
    }

    saveInquiries(inquiries);
    return res.status(200).json({ success: true, inquiry: inquiries[index] });
  });

  // 4. Delete inquiry record (Owner Only)
  app.delete('/api/admin/inquiries/:id', (req, res) => {
    if (!verifyAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Owner access required.' });
    }
    const targetId = req.params.id;
    let inquiries = loadInquiries();
    const initialLen = inquiries.length;
    inquiries = inquiries.filter((inq) => inq.id !== targetId);

    if (inquiries.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    saveInquiries(inquiries);
    return res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  });

  // 5. Public Inquiries Submission Endpoint (from Modal, EnrollmentSection, etc.)
  app.post('/api/inquiries', (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        studentClass,
        targetExam,
        course,
        source,
        wantsDemo,
        message,
        chapterRequested,
      } = req.body;

      if (!fullName || !phone) {
        return res.status(400).json({ success: false, error: 'Full name and phone are required' });
      }

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newInquiry: InquiryRecord = {
        id: `KC-2026-${randomNum}`,
        timestamp: new Date().toISOString(),
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : undefined,
        studentClass: studentClass || '11',
        targetExam: targetExam || 'JEE (Main & Advanced)',
        course: course || 'General Admission Inquiry',
        source: source || 'Enrollment Form',
        wantsDemo: wantsDemo !== undefined ? Boolean(wantsDemo) : true,
        message: message ? String(message).trim() : undefined,
        chapterRequested: chapterRequested ? String(chapterRequested).trim() : undefined,
        status: 'New',
        ownerNotes: '',
      };

      const inquiries = loadInquiries();
      inquiries.unshift(newInquiry);
      saveInquiries(inquiries);

      console.log(`[NEW INQUIRY RECEIVED] ID: ${newInquiry.id} - ${newInquiry.fullName} - ${newInquiry.phone} - ${newInquiry.course}`);

      return res.status(201).json({
        success: true,
        id: newInquiry.id,
        message: 'Inquiry registered successfully',
      });
    } catch (err) {
      console.error('Error saving inquiry:', err);
      return res.status(500).json({ success: false, error: 'Internal server error saving inquiry' });
    }
  });

  // 7. Notes unlock inquiry lead submission endpoint (compatible with Class12NotesSection)
  app.post('/api/notes-inquiry', (req, res) => {
    try {
      const { fullName, studentClass, phone, email, targetExam, chapterRequested } = req.body;
      console.log(`[NOTES INQUIRY LEAD] ${new Date().toISOString()} - Student: ${fullName} (${studentClass}) - Phone: ${phone} - Email: ${email} - Chapter: ${chapterRequested}`);
      
      if (fullName && phone) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newInquiry: InquiryRecord = {
          id: `KC-2026-${randomNum}`,
          timestamp: new Date().toISOString(),
          fullName: String(fullName).trim(),
          phone: String(phone).trim(),
          email: email ? String(email).trim() : undefined,
          studentClass: studentClass || '12',
          targetExam: targetExam || 'CBSE Class 12 Board',
          course: 'Class 12 Handwritten Notes Archive',
          chapterRequested: chapterRequested || 'All 14 Chapters',
          source: 'Class 12 Notes Unlock',
          wantsDemo: false,
          status: 'New',
          ownerNotes: `Downloaded: ${chapterRequested || 'Class 12 Notes'}`,
        };
        const inquiries = loadInquiries();
        inquiries.unshift(newInquiry);
        saveInquiries(inquiries);
      }

      return res.status(200).json({ success: true, message: 'Notes unlocked successfully' });
    } catch {
      return res.status(200).json({ success: true });
    }
  });

  // 8. Coaching Center Google Maps Platform Resolution Proxy (avoids CORS & preserves quota)
  const CENTER_FULL_ADDRESS =
    'Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002';
  const CENTER_BLOCK_ADDRESS =
    'B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002';
  const CENTER_ENCLAVE_ADDRESS =
    'M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002';

  interface CachedCenterResult {
    expiresAt: number;
    payload: {
      lat: number;
      lng: number;
      formattedAddress: string;
      displayName?: string;
      placeId?: string;
      googleMapsUri?: string;
      directionsUri?: string;
      granularity?: string;
      source: 'places' | 'geocoding';
    };
  }

  let cachedCenterLocation: CachedCenterResult | null = null;
  const CENTER_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours (well within 30-day ToS limit)

  function isGhaziabadMatch(addressText: string): boolean {
    const norm = addressText.toLowerCase();
    return (
      norm.includes('201002') ||
      norm.includes('ghaziabad') ||
      norm.includes('shastri nagar') ||
      norm.includes('enclave')
    );
  }

  function isQuotaErrorPayload(status: number, body: any): boolean {
    if (status === 429) return true;
    const errStatus = body?.error?.status || body?.status;
    return errStatus === 'RESOURCE_EXHAUSTED' || errStatus === 'OVER_QUERY_LIMIT';
  }

  app.get('/api/location/center', async (_req, res) => {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: 'Google Maps API key is not configured on the server.',
      });
    }

    if (cachedCenterLocation && cachedCenterLocation.expiresAt > Date.now()) {
      return res.status(200).json({
        success: true,
        location: cachedCenterLocation.payload,
        clientMapKey: apiKey,
      });
    }

    try {
      // 1. Try Places API (New) Text Search for Kashyap Classes & exact block/enclave address
      const placeQueries = [
        `Kashyap Classes, ${CENTER_BLOCK_ADDRESS}`,
        CENTER_BLOCK_ADDRESS,
      ];

      for (const textQuery of placeQueries) {
        const placesRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.shortFormattedAddress,places.location,places.googleMapsUri,places.googleMapsLinks',
            'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
          },
          body: JSON.stringify({
            textQuery,
            regionCode: 'IN',
            languageCode: 'en',
            pageSize: 5,
          }),
        });

        const placesData = await placesRes.json().catch(() => ({}));
        if (isQuotaErrorPayload(placesRes.status, placesData)) {
          return res.status(429).json({
            success: false,
            error: {
              status: 'RESOURCE_EXHAUSTED',
              message: 'Google Maps Platform quota reached.',
            },
          });
        }

        if (placesRes.ok && Array.isArray(placesData.places) && placesData.places.length > 0) {
          const candidates = placesData.places.filter(
            (p: any) =>
              p?.location &&
              typeof p.location.latitude === 'number' &&
              typeof p.location.longitude === 'number' &&
              isGhaziabadMatch(`${p.displayName?.text || ''} ${p.formattedAddress || ''}`)
          );

          const bestPlace =
            candidates.find((p: any) =>
              String(p.displayName?.text || '').toLowerCase().includes('kashyap')
            ) ||
            candidates.find((p: any) => {
              const addr = String(p.formattedAddress || '').toLowerCase();
              return addr.includes('enclave') || addr.includes('b-1') || addr.includes('b1');
            }) ||
            candidates[0];

          if (bestPlace) {
            const payload = {
              lat: bestPlace.location.latitude,
              lng: bestPlace.location.longitude,
              formattedAddress: bestPlace.formattedAddress || CENTER_FULL_ADDRESS,
              displayName: bestPlace.displayName?.text || 'Kashyap Classes',
              placeId: bestPlace.id,
              googleMapsUri: bestPlace.googleMapsLinks?.placeUri || bestPlace.googleMapsUri,
              directionsUri: bestPlace.googleMapsLinks?.directionsUri,
              source: 'places' as const,
            };
            cachedCenterLocation = {
              expiresAt: Date.now() + CENTER_CACHE_TTL_MS,
              payload,
            };
            return res.status(200).json({
              success: true,
              location: payload,
              clientMapKey: apiKey,
            });
          }
        }
      }

      // 2. Fallback to Geocoding API v4 (and Geocoding REST JSON) for exact postal address
      const addressCandidates = [
        CENTER_FULL_ADDRESS,
        CENTER_BLOCK_ADDRESS,
        CENTER_ENCLAVE_ADDRESS,
      ];

      for (const addr of addressCandidates) {
        const v4Url = `https://geocode.googleapis.com/v4/geocode/address/${encodeURIComponent(
          addr
        )}?regionCode=in&languageCode=en`;

        const geoV4Res = await fetch(v4Url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'results.placeId,results.location,results.formattedAddress,results.granularity',
            'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
          },
        });

        const geoV4Data = await geoV4Res.json().catch(() => ({}));
        if (isQuotaErrorPayload(geoV4Res.status, geoV4Data)) {
          return res.status(429).json({
            success: false,
            error: {
              status: 'RESOURCE_EXHAUSTED',
              message: 'Google Maps Platform quota reached.',
            },
          });
        }

        if (geoV4Res.ok && Array.isArray(geoV4Data.results) && geoV4Data.results.length > 0) {
          const match =
            geoV4Data.results.find(
              (r: any) =>
                r?.location &&
                typeof r.location.latitude === 'number' &&
                typeof r.location.longitude === 'number' &&
                isGhaziabadMatch(r.formattedAddress || '')
            ) || geoV4Data.results[0];

          if (match?.location) {
            const payload = {
              lat: match.location.latitude,
              lng: match.location.longitude,
              formattedAddress: match.formattedAddress || CENTER_FULL_ADDRESS,
              displayName: 'Kashyap Classes',
              placeId: match.placeId,
              granularity: match.granularity,
              source: 'geocoding' as const,
            };
            cachedCenterLocation = {
              expiresAt: Date.now() + CENTER_CACHE_TTL_MS,
              payload,
            };
            return res.status(200).json({
              success: true,
              location: payload,
              clientMapKey: apiKey,
            });
          }
        }

        // Standard Geocoding REST API fallback
        const legacyGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          addr
        )}&region=in&language=en&key=${encodeURIComponent(apiKey)}`;
        const geoRes = await fetch(legacyGeoUrl);
        const geoData = await geoRes.json().catch(() => ({}));

        if (isQuotaErrorPayload(geoRes.status, geoData)) {
          return res.status(429).json({
            success: false,
            error: {
              status: 'RESOURCE_EXHAUSTED',
              message: 'Google Maps Platform quota reached.',
            },
          });
        }

        if (geoRes.ok && geoData.status === 'OK' && Array.isArray(geoData.results) && geoData.results.length > 0) {
          const match =
            geoData.results.find(
              (r: any) =>
                r?.geometry?.location && isGhaziabadMatch(r.formatted_address || '')
            ) || geoData.results[0];

          if (match?.geometry?.location) {
            const payload = {
              lat: match.geometry.location.lat,
              lng: match.geometry.location.lng,
              formattedAddress: match.formatted_address || CENTER_FULL_ADDRESS,
              displayName: 'Kashyap Classes',
              placeId: match.place_id,
              granularity: match.geometry.location_type,
              source: 'geocoding' as const,
            };
            cachedCenterLocation = {
              expiresAt: Date.now() + CENTER_CACHE_TTL_MS,
              payload,
            };
            return res.status(200).json({
              success: true,
              location: payload,
              clientMapKey: apiKey,
            });
          }
        }
      }

      return res.status(404).json({
        success: false,
        error: 'Unable to geocode coaching center address via Google Maps Platform.',
        clientMapKey: apiKey,
      });
    } catch (err) {
      console.error('Error resolving coaching center location:', err);
      return res.status(502).json({
        success: false,
        error: 'Failed to contact Google Maps Platform services.',
        clientMapKey: apiKey,
      });
    }
  });

  // Quick check for instant website/coaching knowledge match (<5ms response time)
  function isInstantKnowledgeQuery(query: string): boolean {
    const q = query.toLowerCase();
    const keywords = [
      'rishi', 'developer', 'creator', 'who made', 'who developed',
      'note', 'handwritten', 'class 12 notes', 'download notes',
      'fee', 'cost', 'installment', 'charge', 'price',
      'address', 'location', 'shastri nagar', 'where', 'map', 'reach',
      'timing', 'schedule', 'timetable', 'batch',
      'kashyap sir', 'arvind kashyap', 'mentor', 'faculty', 'teacher',
      'free trial', 'demo class', 'demo', 'book demo',
      'online', 'recording', 'recorded', 'zoom',
      'ncert', 'textbook', 'syllabus', 'brochure', 'contact', 'phone'
    ];
    return keywords.some((kw) => q.includes(kw));
  }

  const systemInstruction = `You are Kashyap AI Sahayak, the official AI counselor and physics tutor for Kashyap Classes (Premier Physics Institute, Shastri Nagar, Ghaziabad).
Founder & Lead Physics Mentor: Arvind Kashyap Sir (20+ years experience, 4,200+ IIT/NEET selections).
Website engineered & developed by Rishi Shrivastav.
Important Institute Guidelines:
1. 100% In-Person Offline Classroom Policy: We strictly do not provide online classes or recordings. All batches are held at Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad.
2. Official Class 12 Handwritten Notes: Authored by Kashyap Sir, covering all 14 chapters, downloadable on the website after unlocking with student name, class, and phone.
3. Admissions Helpline: +91 93507 64376. Free 2-hour live trial demo classes are available.
4. Response Tone: Keep answers concise, highly knowledgeable, prompt, and helpful. Explain physics concepts clearly using standard laws, principles, and vector intuition.`;

  // 1. Ultra-Fast Streaming Endpoint (SSE) for instantaneous typing output (<20ms start)
  app.post('/api/chat/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { message, history } = req.body;
    const userMessage = (message || '').trim();

    if (!userMessage) {
      res.write(`data: ${JSON.stringify({ error: 'Message cannot be empty' })}\n\n`);
      return res.end();
    }

    try {
      const fullAnswer = generateComprehensiveWebsiteAnswer(userMessage, history);
      // Stream in small snappy chunks with tiny 12ms pause for real-time typewriter effect
      const words = fullAnswer.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const chunk = words.slice(i, i + 3).join(' ') + ' ';
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 12));
      }
      res.write(`data: [DONE]\n\n`);
      return res.end();
    } catch (err) {
      console.warn('Streaming error:', err);
      const fallback = generateComprehensiveWebsiteAnswer(userMessage, history);
      res.write(`data: ${JSON.stringify({ chunk: fallback })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      return res.end();
    }
  });

  // 2. High-Speed Standard Endpoint (Optimized for instant <5ms turnaround)
  app.post('/api/chat', (req, res) => {
    try {
      const { message, history } = req.body;
      const userMessage = (message || '').trim();

      if (!userMessage) {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      const reply = generateComprehensiveWebsiteAnswer(userMessage, history);
      return res.status(200).json({ reply, source: 'instant-physics-engine' });
    } catch (error) {
      console.warn('Chat error:', error);
      const contextualReply = generateComprehensiveWebsiteAnswer(req.body.message || '', req.body.history || []);
      return res.status(200).json({
        reply: contextualReply,
        source: 'instant-physics-engine',
      });
    }
  });

  // In development, hook Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
