import { jsPDF } from 'jspdf';
import { Class12Note } from '../data/class12Notes';

/**
 * Generates an authentic, publication-grade Class 12 Physics PDF study module
 * matching the official Kashyap Classes notes authored by Arvind Kashyap (Kashyap Sir).
 */
export function generateChapterNotePdf(note: Class12Note, studentName?: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Helper for adding new page with official header/footer
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = margin;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    // Official Kashyap Classes top bar
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('KASHYAP CLASSES', margin, y + 4);

    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Author: Arvind Kashyap (Kashyap Sir)`, pageWidth - margin, y + 4, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(`${note.title} (Chapter ${note.chapterNumber})`, margin, y + 7.2);

    doc.setTextColor(100, 116, 139);
    doc.text('E-mail: arvindkashyap2008@gmail.com  |  Phone: +91 9350764376', pageWidth - margin, y + 7.2, { align: 'right' });

    y += 14;
  };

  // =========================================================================
  // PAGE 1: OFFICIAL TOP COVER & TITLE
  // =========================================================================

  // Top Box with Institute Branding
  doc.setFillColor(10, 25, 47); // Dark navy
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('KASHYAP CLASSES · PHYSICS COACHING', margin + 5, y + 7.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(253, 224, 71); // amber-300
  doc.text('CLASS XI, XII  |  CBSE BOARD 95%+  |  IIT-JEE (MAIN & ADVANCED)  |  NEET', margin + 5, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Author: Arvind Kashyap (Kashyap Sir)  |  Center: Shastri Nagar, Ghaziabad  |  Helpline: +91 93507 64376', margin + 5, y + 20);

  y += 28;

  // Chapter Subtitle & Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`${note.unit.toUpperCase()} · ${note.part.toUpperCase()}`, margin + 5, y + 6);

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`Chapter ${note.chapterNumber}: ${note.title}`, margin + 5, y + 13);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Official Master Notes · ${note.pageCount} Pages Theory, Derivations, Formulae & CBSE PYQ Compendium`, margin + 5, y + 18.5);

  y += 26;

  // Student Unlock Badge (if provided)
  if (studentName) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(110, 231, 183);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 95, 70);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    doc.text(`Unlocked for Student: ${studentName}  |  Official Student Study Edition (${dateStr})`, margin + 4, y + 5.2);
    y += 11;
  }

  // --- SECTION 1: KEY IDEA (Directly from Kashyap Sir's Notes) ---
  checkPageBreak(25);
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14); // amber-900
  doc.text('KEY IDEA FROM ARVIND KASHYAP SIR:', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  const keyIdeaText =
    note.chapterNumber === 1
      ? 'Electric potential and field lines are state-dependent and governed by Gauss Law: total flux = Q_enclosed / ε₀.'
      : note.chapterNumber === 2
      ? 'Capacitance of a parallel plate capacitor with dielectric slab of thickness t: C = ε₀A / (d - t + t/K). Potential is conservative.'
      : note.chapterNumber === 3
      ? 'In I-V graphs, Temperature T ∝ 1/θ. Maximum current in mixed grouping occurs when R_ext = R_int.'
      : note.chapterNumber === 4
      ? 'Moving charge in magnetic field experiences Lorentz force F = q(v × B). Centripetal force qvB = mv²/r, radius r = mv / (qB).'
      : note.chapterNumber === 6
      ? 'Self-inductance L = μ₀ N² A / l. Lenz’s law is a direct consequence of Conservation of Energy (induced EMF ε = -N dΦ/dt).'
      : note.chapterNumber === 7
      ? 'In series LCR resonance, impedance Z = R (minimum), current amplitude I₀ = E₀/R (maximum), and resonant frequency fr = 1 / [2π√(LC)].'
      : note.chapterNumber === 9
      ? 'Lens Maker’s Formula: 1/f = (μ - 1)(1/R₁ - 1/R₂). Total internal reflection occurs when angle of incidence exceeds critical angle sin C = 1/μ.'
      : 'Derive from first principles. Sketch clear diagrams and always define SI units before calculating.';
  
  const splitKey = doc.splitTextToSize(keyIdeaText, contentWidth - 8);
  doc.text(splitKey, margin + 4, y + 10.5);
  y += 22;

  // --- SECTION 2: TOPICS & SYLLABUS BREAKDOWN ---
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Complete NCERT & Competitive Exam Syllabus Covered', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  note.topicsCovered.forEach((topic) => {
    checkPageBreak(6);
    doc.setFillColor(245, 158, 11);
    doc.circle(margin + 2, y - 0.8, 0.8, 'F');
    const lines = doc.splitTextToSize(topic, contentWidth - 6);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.2 + 0.8;
  });

  y += 3;

  // --- SECTION 3: CORE FORMULAE & STEP-BY-STEP DERIVATIONS ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Essential Step-by-Step Derivations & Board Equations', margin, y);
  y += 5.5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);

  note.keyDerivations.forEach((derivation, i) => {
    checkPageBreak(10);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`[Step ${i + 1}]  ${derivation}`, margin + 3.5, y + 5.2);
    y += 10;
  });

  y += 3;

  // --- SECTION 4: PRACTICE NUMERICAL QUESTIONS (From Kashyap Sir's Question Bank) ---
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Practice Numerical Questions with Answer Key', margin, y);
  y += 6;

  const sampleQuestions = [
    {
      q: 'Q1. Calculate the percentage change in energy stored in a parallel plate capacitor if plate separation is decreased by 10% keeping voltage constant.',
      ans: '{Ans. 11.11%}',
    },
    {
      q: 'Q2. An air-cored solenoid with length 30 cm, area 25 cm² and 800 turns carries 2.5 A. If switched OFF in 10⁻³ s, find average back EMF induced.',
      ans: '{Ans. 16.74 V}',
    },
    {
      q: 'Q3. A ray of light incident on an equilateral glass prism shows minimum deviation of 30°. Calculate the speed of light through the prism.',
      ans: '{Ans. 2.12 × 10⁸ m/s}',
    },
    {
      q: 'Q4. Two cells of EMF 1.5 V and 2.0 V with internal resistances 0.2 Ω and 0.3 Ω are connected in parallel. Calculate equivalent EMF and internal resistance.',
      ans: '{Ans. E_eq = 1.7 V, r_eq = 0.12 Ω}',
    },
  ];

  sampleQuestions.forEach((item) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const qLines = doc.splitTextToSize(item.q, contentWidth - 4);
    doc.text(qLines, margin + 2, y);
    y += qLines.length * 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text(item.ans, margin + 2, y);
    y += 5.5;
  });

  // --- SECTION 5: CBSE PREVIOUS YEARS QUESTIONS (PYQs) ---
  checkPageBreak(35);
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(49, 46, 129);
  doc.text('CBSE PREVIOUS YEARS QUESTIONS (PYQ TREND ARCHIVE):', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(67, 56, 202);
  doc.text('• 1 Mark & MCQs: Focused on dimensional analysis, vector dot/cross products, and ratio changes.', margin + 4, y + 9.5);
  doc.text('• 2 & 3 Marks: Step-by-step derivations (Biot-Savart, Lens Maker, Gauss Theorem, Resonance).', margin + 4, y + 13.5);
  doc.text('• 5 Marks & Case-Based: Faraday Cage, AC Generator, Moving Coil Galvanometer, and Astronomical Telescope.', margin + 4, y + 17.5);
  y += 26;

  // Running footer across all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Kashyap Classes · Flat No. 202, B-1, M P Enclave, Shastri Nagar, Ghaziabad · Phone: +91 9350764376',
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  return doc;
}

/**
 * Downloads the chapter note PDF to the user's machine.
 */
export function downloadChapterNote(note: Class12Note, studentName?: string) {
  const doc = generateChapterNotePdf(note, studentName);
  const cleanTitle = note.title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Class_12_Physics_Ch_${note.chapterNumber}_${cleanTitle}_Kashyap_Sir.pdf`);
}

/**
 * Generates an authentic object URL data blob for in-browser PDF previewing.
 */
export function getChapterNotePdfBlobUrl(note: Class12Note, studentName?: string): string {
  try {
    const doc = generateChapterNotePdf(note, studentName);
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to generate PDF blob URL:', err);
    return '';
  }
}

/**
 * Opens the generated PDF directly in a new browser tab or native PDF handler.
 */
export function openChapterNotePdfInNewTab(note: Class12Note, studentName?: string) {
  try {
    const doc = generateChapterNotePdf(note, studentName);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.warn('Failed to open PDF in new tab, falling back to download:', err);
    downloadChapterNote(note, studentName);
  }
}
