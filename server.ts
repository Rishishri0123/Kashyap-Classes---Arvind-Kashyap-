import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive knowledge base for Kashyap Classes website
function generateComprehensiveWebsiteAnswer(query: string, history: Array<{ role: string; text: string }> = []): string {
  const q = query.toLowerCase();

  // 1. Developer / Creator Information
  if (q.includes('rishi') || q.includes('developer') || q.includes('creator') || q.includes('who developed') || q.includes('who made') || q.includes('who created') || q.includes('designed by')) {
    return `💻 **Website Engineering & Development Credit**:\n\nThis official web application for **Kashyap Classes** was designed, developed, and created by **Rishi Shrivastav**.\n\n**Key Technical & Architectural Features Built by Rishi Shrivastav:**\n• **Interactive Class 12 Concept Simulation Lab**: Real-time SVG simulators for Wave Optics (Young's Double Slit Experiment), Lenz's Law Electromagnetic Induction, and Einstein's Photoelectric Effect.\n• **Official NCERT Physics Digital Repository**: Line-by-line syllabus mapping and direct chapter PDF access for Class 11 and Class 12.\n• **High-Performance Physics Counselor AI**: Instant academic guidance, syllabus deconstruction, and admissions counseling.\n• **Responsive Design**: Custom Tailwind styling with zero-pill visual hierarchy, high contrast typography, and frictionless 1-click Free Trial booking.\n\nIs there a specific feature or course you would like to explore?`;
  }

  // 2. Class 12 Physics & Board Exam Derivations
  if (q.includes('class 12') || q.includes('12th') || q.includes('board') || q.includes('derivation') || q.includes('ydse') || q.includes('optics') || q.includes('wave optics') || q.includes('electrostatics')) {
    return `⚡ **Class 12 Physics Comprehensive Program & Board Derivations**:\n\nOur Class 12 program is engineered to achieve **98%+ in CBSE/State Boards** while simultaneously mastering competitive numericals for JEE & NEET.\n\n**Core Curriculum Modules Covered by Arvind Kashyap Sir:**\n1. **Electrostatics & Capacitance**: Gauss's Theorem applications, dipole electric field & torque, dielectric capacitance.\n2. **Current Electricity**: Kirchhoff's circuit laws, Wheatstone bridge, drift velocity derivation.\n3. **Electromagnetism & AC**: Biot-Savart law, Ampere's circuital law, Lenz's law, LCR series resonance.\n4. **Optics**: Ray Optics (lens maker formula, prism deviation) & Wave Optics (Young's Double Slit Experiment fringe width $\\beta = \\lambda D/d$).\n5. **Modern Physics**: Photoelectric effect ($K_{max} = h\\nu - \\Phi_0$), Bohr's hydrogen model, and Semiconductors.\n\n🔬 *Check out our **Concept Simulation Lab** right on this website to test interactive Class 12 simulations for YDSE and Lenz's Law!*`;
  }

  // 3. Class 11 Physics & Foundation
  if (q.includes('class 11') || q.includes('11th') || q.includes('foundation') || q.includes('kinematics') || q.includes('rotation') || q.includes('vectors')) {
    return `🎯 **Class 11 Physics Foundation & Primer Program**:\n\nClass 11 builds the foundational bedrock (accounting for ~50% of JEE and NEET physics marks). Arvind Kashyap Sir bridges the jump from Class 10 basic science to advanced analytical mechanics.\n\n**Class 11 Core Syllabus Modules:**\n• **Mathematical Tools & Vectors**: Dot/cross products, calculus in kinematics.\n• **Newton's Laws & Friction**: Free-body diagrams (FBD), pulley constraints, circular banking.\n• **Work, Energy & Power**: Conservation of mechanical energy, 1D/2D collisions.\n• **Rotational Dynamics**: Moment of inertia theorems, torque, angular momentum conservation, rolling without slipping.\n• **Gravitation, Fluids & Thermodynamics**: Kepler's laws, Bernoulli's theorem, Carnot engine.\n• **Oscillations & Waves**: Simple Harmonic Motion (SHM), resonance, sound waves & Doppler effect.\n\nWould you like to book a **Free 2-Hour Trial Class** with Kashyap Sir to experience how vectors are visually taught?`;
  }

  // 4. NEET Physics Accelerator (Target 170+)
  if (q.includes('neet') || q.includes('medical') || q.includes('doctor') || q.includes('aiims') || q.includes('biology')) {
    return `🩺 **NEET 170+ High-Yield Physics Accelerator**:\n\nEngineered specifically for medical aspirants who excel in biology but struggle with numerical physics.\n\n**Our Unique NEET Pedagogy:**\n• **100% NCERT Line-by-Line Decoupling**: Mastering 'Points to Ponder' and margin remarks where NTA frames tricky assertion-reason questions.\n• **Speed Drill Method**: Learn dimensional inspection and boundary conditions to solve questions in under 45 seconds.\n• **Maths Bootcamp**: 2-week bridge course on trigonometry, differentiation, integration, and graph slope analysis.\n• **Proven Result**: **Dr. Sneha Verma** scored **175/180** in NEET Physics and is currently pursuing MBBS at AIIMS New Delhi!\n\nWould you like to speak with Arvind Kashyap Sir directly at **+91 93507 64376**?`;
  }

  // 5. JEE Main & Advanced Intensive
  if (q.includes('jee') || q.includes('iit') || q.includes('advanced') || q.includes('engineering') || q.includes('irodov')) {
    return `🚀 **JEE (Main & Advanced) Physics Intensive Program**:\n\nDesigned to elevate physics from an intimidating subject into your highest-scoring rank booster for IIT Bombay, Delhi, and top NITs.\n\n**Key Highlights:**\n• **Multi-Concept Problem Topology**: Training on Irodov, Krotov, and Pathfinder advanced problem sets.\n• **Conservation Laws First**: Solving complex multi-body problems using only Energy and Momentum conservation rather than 50 memorize formulas.\n• **Full-Scale CBT Mock Tests**: Simulated Computer-Based Tests with All-India ranking and chapter-wise error heatmaps.\n• **Hall of Fame**: **Aryan Sharma (AIR 142 JEE Adv, IIT Delhi)** & **Rohit Nair (99.92 %ile JEE Main, IIT Bombay)**!\n\nAdmission is open for the 2026–27 cohort under Arvind Kashyap Sir.`;
  }

  // 6. NCERT Physics Textbooks & Official PDFs
  if (q.includes('ncert') || q.includes('pdf') || q.includes('book') || q.includes('download') || q.includes('textbook') || q.includes('exemplar')) {
    return `📚 **Official NCERT Physics Textbooks & Digital Hub**:\n\nOur website features direct access to the official National NCERT Physics textbooks for Class 11 and 12:\n\n1. **Class 11 Physics (Part 1)**: Units & Dimensions, Kinematics, Laws of Motion, Work-Energy, Rotational Motion, Gravitation (Code: keph1).\n2. **Class 11 Physics (Part 2)**: Mechanical Solids/Fluids, Thermodynamics, Kinetic Theory, Oscillations & Waves (Code: keph2).\n3. **Class 12 Physics (Part 1)**: Electric Charges & Fields, Potential & Capacitance, Current Electricity, Magnetism, EMI & AC, EM Waves (Code: leph1).\n4. **Class 12 Physics (Part 2)**: Ray Optics, Wave Optics (YDSE), Dual Nature, Atoms, Nuclei, Semiconductors (Code: leph2).\n\nYou can scroll down to our **NCERT Physics Books Hub** section on this website to read and download the official PDFs chapter-by-chapter!`;
  }

  // 7. Interactive Concept Simulation Lab
  if (q.includes('simulation') || q.includes('lab') || q.includes('experiment') || q.includes('virtual') || q.includes('fringe') || q.includes('lenz') || q.includes('photoelectric')) {
    return `🔬 **Interactive Concept Simulation Lab on This Website**:\n\nDeveloped to demonstrate Arvind Kashyap Sir's visual teaching philosophy, our simulation lab features:\n\n1. **Class 12 Wave Optics (YDSE)**: Adjust laser wavelength (Red 650nm, Green 532nm, Blue 450nm, Violet 405nm), slit separation ($d$), and screen distance ($D$) to watch live alternating bright/dark interference fringes and compute fringe width $\\beta = \\lambda D / d$.\n2. **Class 12 Lenz's Law & EMI**: Move a bar magnet (North/South pole) towards or away from a coil to visualize induced current direction (CW vs CCW) and magnetic flux opposition.\n3. **Class 12 Photoelectric Effect**: Adjust incident photon energy ($h\\nu$) and metal work function (Cesium 2.14 eV, Sodium 2.75 eV, Copper 4.65 eV) to observe emitted photoelectrons and stopping potential ($V_0$).\n4. **Class 11 Projectile on Incline**: Decompose gravity along and perpendicular to an inclined slope ($g_\\perp = g\\cos\\beta$, $g_\\parallel = g\\sin\\beta$).\n\nVisit the **Class 12 Lab** tab on the navigation bar to interact with these simulations right now!`;
  }

  // 8. Faculty & Mentorship: Arvind Kashyap (Kashyap Sir)
  if (q.includes('arvind') || q.includes('kashyap sir') || q.includes('mentor') || q.includes('teacher') || q.includes('faculty') || q.includes('founder')) {
    return `👨‍🏫 **About Arvind Kashyap (Kashyap Sir)**:\n\n**Founder & Lead Physics Mentor**, Kashyap Classes (Est. 2008).\n\n• **Experience**: 20+ years of dedicated physics classroom teaching.\n• **Track Record**: Mentored 4,200+ students selected in IITs, NITs, and top medical colleges (AIIMS, Maulana Azad).\n• **Zero-Substitute Guarantee**: Unlike commercial coaching factories where junior teachers or delegates teach, **Arvind Kashyap Sir personally conducts 100% of the lectures** for every batch.\n• **Daily Doubt Desk**: Sir is personally available from 5:30 PM to 8:00 PM every single evening for 1-on-1 student doubt clearing.\n• **Teaching Style**: "Deep Concept Clarity, Not Blind Formulas"—teaching how to sketch vector diagrams and derive equations from first principles.`;
  }

  // 9. Batch Schedules & Timetables
  if (q.includes('schedule') || q.includes('timing') || q.includes('timetable') || q.includes('batch') || q.includes('days') || q.includes('time') || q.includes('slot')) {
    return `🗓️ **Batch Schedules & Timetables (Session 2026–27)**:\n\nCohorts are structured around school hours to ensure zero academic fatigue:\n\n• **Class 11 Foundation**: Mon, Wed, Fri (Evening Cohort)\n• **Class 11 Weekend Integrated**: Saturday & Sunday (Morning Cohort)\n• **Class 12 Boards & Competitive**: Tue, Thu, Sat (Morning Cohort)\n• **Class 12 Board Derivations**: Mon, Wed, Fri (Evening Cohort)\n• **JEE Advanced Rankers**: Mon, Wed, Fri + Weekend Problem Lab\n• **NEET Target 170+**: Tue, Thu, Sat + Speed Drills\n\nAll batches are personally taught by Arvind Kashyap Sir. Check the **Schedules** section on our website for detailed day-by-day routines.`;
  }

  // 10. Online Classes & Recording Policy (Strict 100% In-Person Offline Coaching)
  if (q.includes('online') || q.includes('record') || q.includes('video lecture') || q.includes('live stream') || q.includes('stream') || q.includes('zoom') || q.includes('recorded')) {
    return `🏛️ **100% In-Person Offline Classroom Policy (No Online Classes or Recordings)**:\n\n**We do not offer online classes or lecture recordings.**\n\n• **Physical Center Only**: All programs (Class 11, Class 12, JEE, and NEET) are conducted strictly in-person inside our physical classrooms.\n• **Why In-Person Only?**: Arvind Kashyap Sir firmly believes that true mastery in Physics requires direct eye contact, active chalkboard derivations, notebook checks, and deep focus free from screen fatigue and digital distractions.\n• **Missed Class Policy**: If a student is absent due to genuine medical or school emergencies, they receive complete handwritten class board notes, printed lecture handouts, and dedicated 1-on-1 backup doubt clearing directly with Arvind Kashyap Sir during evening doubt desk hours (5:30 PM – 8:00 PM).\n• **Experience It Yourself**: Book a **Free 2-Hour In-Person Trial Class** at our center to experience Sir's interactive teaching firsthand!`;
  }

  // 11. Fees & Payment Structure
  if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('installment') || q.includes('payment')) {
    return `💳 **Transparent Fee Structure & Policies**:\n\nAt Kashyap Classes, we maintain complete transparency with **zero hidden fees**:\n\n• **All-Inclusive Enrollment**: Course enrollment covers all 12 printed study modules, daily problem practice (DPP) sets, comprehensive CBT test series, and unlimited access to the evening doubt counter.\n• **Flexible Installments**: Parents can pay in **2 to 3 convenient installments** across the academic session.\n• **Counseling Consultation**: Exact course fee structures are shared transparently with parents during 1:1 counseling based on the selected program (Class 11, Class 12, JEE, or NEET).\n• **Zero Risk**: We invite every student to experience our **Free 2-Hour Live Trial Demo Class** before making any financial commitment!`;
  }

  // 12. Free Trial Demo Class Booking
  if (q.includes('free trial') || q.includes('demo') || q.includes('trial class') || q.includes('book demo') || q.includes('free class')) {
    return `✨ **Book Your Free 2-Hour Live Physics Trial Class**:\n\nExperience Arvind Kashyap Sir's concept deconstruction firsthand with zero obligation:\n\n• **What You Get**: Attend a real live classroom lecture with Arvind Kashyap (Kashyap Sir).\n• **Assess Clarity**: See how vector mechanics, rotation, or electrodynamics are visually explained.\n• **1-on-1 Foundation Audit**: Sir personally evaluates your current conceptual gaps and suggests a customized study strategy.\n• **Zero Payment**: 100% free with no hidden registration fee.\n\nYou can click **Book Free Trial** on our website or call **+91 93507 64376** to confirm your demo slot!`;
  }

  // 13. Contact, Address & Helpline
  if (q.includes('contact') || q.includes('address') || q.includes('phone') || q.includes('call') || q.includes('whatsapp') || q.includes('where') || q.includes('location')) {
    return `📍 **Contact Information & Institute Address**:\n\n• **Institute**: Kashyap Classes (Mentor: Arvind Kashyap Sir)\n• **Admissions Helpline**: +91 93507 64376 (Call & WhatsApp)\n• **Center Address**: Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002\n• **Google Rating**: ⭐ 4.8 / 5.0 (15+ verified student reviews)\n• **Email**: admissions@kashyapclasses.in\n• **Counseling Hours**: Mon–Sat: 7:00 AM – 8:30 PM | Sunday: 8:00 AM – 1:30 PM\n• **Website Engineered by**: Rishi Shrivastav\n\nFeel free to call Arvind Kashyap Sir directly for academic guidance or visit our Shastri Nagar, Ghaziabad center!`;
  }

  // 14. Official Class 12 Handwritten Notes Archive (14 Chapters)
  if (q.includes('note') || q.includes('handwritten') || q.includes('chapter note') || q.includes('notes') || q.includes('study material') || q.includes('pdf note')) {
    return `📝 **Official Class 12 Physics Handwritten Notes (14 Chapters)**:\n\nAuthored personally by **Arvind Kashyap (Kashyap Sir)**, our website now features the complete master notes library for all 14 Class 12 NCERT chapters:\n\n• **Part 1 (Ch 1–8)**: Electric Charges & Fields (22p), Potential & Capacitance (26p), Current Electricity (29p), Moving Charges & Magnetism (28p), Magnetism & Matter (12p), Electromagnetic Induction (10p), Alternating Current (23p), EM Waves (10p).\n• **Part 2 (Ch 9–14)**: Ray Optics (34p), Wave Optics (17p), Dual Nature of Radiation (16p), Atoms (12p), Nuclei (14p), Semiconductor Devices (14p).\n\n🔒 **How to Unlock**: The notes are 100% free! Simply scroll down to the **Class 12 Notes** section on the website, enter your basic student details (Name, Class, Phone Number, Email), and all 14 chapter PDFs unlock instantly for in-browser preview and direct high-speed download!`;
  }

  // 15. Center Location, Google Maps & Campus Visit
  if (q.includes('map') || q.includes('location') || q.includes('directions') || q.includes('shastri nagar') || q.includes('mp enclave') || q.includes('bank enclave') || q.includes('reach') || q.includes('center')) {
    return `🗺️ **Physical Classroom Center & Google Maps Location**:\n\n• **Official Address**: Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002\n• **Landmark**: Near Bank Enclave Market & Shastri Nagar\n• **Direct Helpline**: **+91 93507 64376** (Arvind Kashyap Sir & Admissions Office)\n• **Timings**: Monday to Saturday: 7:00 AM – 8:30 PM | Sunday: 8:00 AM – 1:30 PM\n• **Google Rating**: ⭐ 4.8 / 5.0 (15+ verified student reviews)\n• **Interactive Map**: Scroll down to our **Center Map** section on this website to view the live Google Map and get 1-click driving directions!\n\n*All batches are 100% in-person offline at this Shastri Nagar center.*`;
  }

  // 16. Advanced External Physics Knowledge (Mechanics, Irodov, HCV, Quantum, Relativity, Maxwell)
  if (q.includes('irodov') || q.includes('hcv') || q.includes('hc verma') || q.includes('quantum') || q.includes('relativity') || q.includes('maxwell') || q.includes('thermodynamics') || q.includes('entropy') || q.includes('schrodinger') || q.includes('pathfinder') || q.includes('physics')) {
    return `⚛️ **Advanced Physics Guidance from Kashyap Sir's Pedagogy**:\n\nBeyond basic school memorization, true competitive physics mastery (JEE Advanced / NEET 170+ / Olympiad) is built on deep first principles:\n\n1. **Standard Reference Hierarchy**:\n   • **HC Verma (Vol 1 & 2)**: Gold standard for conceptual intuition and objective questions.\n   • **I.E. Irodov (Problems in General Physics)**: Essential for multi-concept frame transformations, non-inertial frames, and continuous mass systems ($F_{ext} + v_{rel}\\frac{dm}{dt} = m\\frac{dv}{dt}$).\n   • **Pathfinder for Olympiad & JEE Advanced**: Crucial for sharpening rotational constraint topology and electromagnetism.\n\n2. **The 4 Fundamental Pillars**:\n   • **Mechanics**: Never memorize 50 projectile formulas; resolve along natural axes $\\Sigma F = ma$ and apply Work-Energy Theorem $\\Delta K = W_{all}$.\n   • **Electrodynamics**: Unified by Maxwell's 4 equations, Poynting vector $\\vec{S} = \\frac{1}{\\mu_0}(\\vec{E} \\times \\vec{B})$, and boundary conditions.\n   • **Wave-Particle Duality**: de Broglie wavelength $\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2mE_k}}$ and Einstein's photoelectric law $h\\nu = \\Phi_0 + eV_0$.\n   • **Thermodynamics & Statistical Physics**: Entropy $dS = dQ_{rev}/T$, Carnot efficiency $\\eta = 1 - T_C/T_H$, and degrees of freedom $U = \\frac{f}{2}nRT$.\n\nWould you like guidance on a specific physics derivation or problem?`;
  }

  // 17. Specific Physics Conceptual Explanations (Physics Doubt Assistant)
  if (q.includes('formula') || q.includes('lenz') || q.includes('faraday') || q.includes('vector') || q.includes('interference') || q.includes('gauss') || q.includes('bernoulli')) {
    return `⚛️ **Conceptual Physics Insight from Arvind Kashyap Sir**:\n\nPhysics is not a random collection of formulas—it is governed by a few fundamental conservation laws:\n\n• **Conservation of Energy**: Explains Lenz's law (induced EMF $\\varepsilon = -N \\frac{d\\Phi}{dt}$ where the negative sign ensures energy conservation), Bernoulli's fluid equation ($P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}$), and Einstein's photoelectric equation ($K_{max} = h\\nu - \\Phi_0$).\n• **Conservation of Momentum**: Solves complex collisions and rocket propulsion.\n• **Wave Interference (YDSE)**: Two coherent sources with phase difference $\\phi$ yield fringe width $\\beta = \\frac{\\lambda D}{d}$. Bright fringes occur at path difference $\\Delta x = n\\lambda$, dark fringes at $\\Delta x = (2n-1)\\frac{\\lambda}{2}$.\n\nIn our classroom lectures, Sir teaches how to derive all of these without cramming. Would you like to attend a **Free Trial Demo Class**?`;
  }

  // 18. Conversational Greeting or Broad Question
  return `Namaste! 🙏 I am **Kashyap AI Sahayak**, the official academic counselor for Kashyap Classes.\n*(Website Developed & Created by Rishi Shrivastav)*\n\nI have complete knowledge of our institute, website, and advanced physics concepts across CBSE, JEE, NEET, and Olympiads. You can ask me about:\n\n1. **Official Class 12 Handwritten Notes (14 Chapters)** by Arvind Kashyap Sir\n2. **Center Location & Google Maps** (Shastri Nagar, Ghaziabad)\n3. **100% In-Person Physical Classroom Policy** (We strictly do not offer online classes or recordings)\n4. **Physics Concepts & Problem Solving** (Mechanics, Electrodynamics, Optics, HCV, Irodov, Board Derivations)\n5. **Interactive Concept Simulation Lab** (Wave Optics, EMI & Photoelectric simulators)\n6. **Official NCERT Physics Textbooks** (Class 11 & 12 chapter PDFs)\n7. **Batch Timetables & Schedules** for JEE, NEET, and Boards\n8. **Booking a Free 2-Hour Live Trial Demo Class** with Arvind Kashyap Sir\n9. **Website Architecture & Credits** (Developed by Rishi Shrivastav)\n\nWhat would you like to explore today?`;
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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

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

  // Gemini AI endpoint for Kashyap AI Sahayak with rich multi-turn knowledge
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const userMessage = (message || '').trim();

      if (!userMessage) {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // When GEMINI_API_KEY is not set or is placeholder, return our deep contextual engine answer
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        const contextualReply = generateComprehensiveWebsiteAnswer(userMessage, history);
        return res.status(200).json({
          reply: contextualReply,
          source: 'contextual-engine',
        });
      }

      // Initialize official GoogleGenAI SDK
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are "Kashyap AI Sahayak", the official expert virtual academic counselor and master physics mentor for Kashyap Classes (Premier Physics Coaching for Class 11, Class 12, JEE, and NEET).

CRITICAL REQUIREMENT - EXPANSIVE PHYSICS KNOWLEDGE BEYOND THE WEBSITE:
You must NEVER restrict yourself to only what is published on the website. You possess deep, universal, graduate-level mastery of all Physics domains:
- Classical Mechanics, Rotational Dynamics, Fluid Mechanics, Thermodynamics, Waves & Oscillations.
- Electrodynamics, Gauss's Law, Biot-Savart, Ampere's Law, Faraday & Lenz's Law, Maxwell's Equations, AC circuits & Phasors.
- Optics: Ray Optics (lenses, mirrors, prisms, optical instruments) and Wave Optics (Huygens principle, Young's Double Slit Experiment, Diffraction, Polarization, Brewster's Law).
- Modern Physics: Photoelectric Effect, Compton Scattering, Bohr Model, de Broglie Duality, Nuclear Physics (Q-value, binding energy, mass defect), Semiconductor Devices (diodes, rectifiers, energy bands).
- Reference Literature & Strategies: Expert advice on HC Verma (Concepts of Physics), I.E. Irodov, S.S. Krotov, Halliday-Resnick, Pathfinder.
- CBSE Class 12 Board Exam Strategy: 5-mark derivations checklist, numerical presentation, step-marking tips, PYQ trends.
- NEET Physics Strategy: Targeting 170+/180 via NCERT margins, points to ponder, and 45-second elimination techniques.
- JEE Main & Advanced Strategy: Multi-concept problem decomposition, dimensional analysis, conservation laws first approach.

Institute & Faculty Profile:
- Founder & Lead Mentor: Arvind Kashyap (known as Kashyap Sir). 20+ years experience, mentored 4,200+ students selected into IITs, AIIMS, NITs, and top universities.
- Pedagogy: "Deep Concept Clarity, Not Blind Formulas". Focuses on first principles, free body diagrams, vector geometry, and visual concept derivations.
- Strict Policy: Arvind Kashyap Sir personally conducts 100% of the lectures. Zero substitute or junior teachers.
- 1-on-1 Evening Doubt Counter: Sir sits personally with students daily from 5:30 PM to 8:00 PM.
- Strictly 100% In-Person Offline Coaching: We do NOT offer online classes or recordings. Real physics intuition requires physical classroom eye contact, blackboard derivations, and hands-on interaction.
- Address & Center: Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002 (⭐ 4.8 Google Rating). Helpline: +91 93507 64376 (Call & WhatsApp).
- Free Trial: Free 2-Hour Live In-Person Trial Class at our Shastri Nagar center.
- Class 12 Handwritten Notes: The website provides all 14 official Class 12 NCERT chapter handwritten notes by Arvind Kashyap Sir (100% free; students simply enter their Name, Class, Phone, and Email to unlock immediate PDF downloads).
- Interactive Concept Simulation Lab: Available on this site with interactive Wave Optics (YDSE), Lenz's Law EMI, and Photoelectric Effect simulators.
- Website Developer & Creator: The website was designed, engineered, and created by Rishi Shrivastav.

Instructions:
1. When answering physics problems, provide step-by-step mathematical derivations, formulas in clean markdown/LaTeX, and intuitive physical explanations.
2. If asked about syllabus, courses, notes, or center location, provide accurate institute details with warmth and encouragement.
3. If asked about the website developer, give full credit to Rishi Shrivastav.
4. Encourage interested students to book a Free 2-Hour Trial Class with Kashyap Sir or visit the Shastri Nagar center.`;

      // Build conversation contents including history if available
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      // Query Gemini 3.8 Flash with thinkingLevel LOW for ultra-fast, intelligent response
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const reply = response.text || generateComprehensiveWebsiteAnswer(userMessage, history);
      return res.status(200).json({ reply, source: 'gemini' });
    } catch (error) {
      console.warn('Gemini API call failed, falling back to comprehensive contextual engine:', error);
      const contextualReply = generateComprehensiveWebsiteAnswer(req.body.message || '', req.body.history || []);
      return res.status(200).json({
        reply: contextualReply,
        source: 'contextual-engine',
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
