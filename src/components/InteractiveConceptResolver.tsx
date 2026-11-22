import React, { useState } from 'react';
import { Sparkles, Eye, Waves, Zap, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const InteractiveConceptResolver: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ydse' | 'induction' | 'photoelectric' | 'projectile'>('ydse');

  // --- Class 12: Young's Double Slit Experiment (YDSE) State ---
  const [wavelengthNm, setWavelengthNm] = useState<number>(532); // nm (Green default)
  const [slitSeparationMm, setSlitSeparationMm] = useState<number>(0.25); // mm
  const [screenDistanceM, setScreenDistanceM] = useState<number>(1.2); // m

  // YDSE calculations: beta = lambda * D / d
  const lambdaM = wavelengthNm * 1e-9;
  const dM = slitSeparationMm * 1e-3;
  const DM = screenDistanceM;
  const fringeWidthM = (lambdaM * DM) / dM; // in meters
  const fringeWidthMm = Number((fringeWidthM * 1e3).toFixed(2)); // in mm
  const angularWidthMrad = Number(((lambdaM / dM) * 1e3).toFixed(2)); // in milliradian

  // Color mapping based on wavelength
  const getLaserColor = (nm: number) => {
    if (nm <= 420) return { name: 'Violet', hex: '#8b5cf6', rgb: '139, 92, 246', border: 'border-purple-400' };
    if (nm <= 490) return { name: 'Blue', hex: '#38bdf8', rgb: '56, 189, 248', border: 'border-sky-400' };
    if (nm <= 560) return { name: 'Green', hex: '#10b981', rgb: '16, 185, 129', border: 'border-emerald-400' };
    if (nm <= 600) return { name: 'Yellow', hex: '#f59e0b', rgb: '245, 158, 11', border: 'border-amber-400' };
    return { name: 'Red', hex: '#ef4444', rgb: '239, 68, 68', border: 'border-red-400' };
  };
  const currentColor = getLaserColor(wavelengthNm);

  // --- Class 12: Electromagnetic Induction (Lenz's Law) State ---
  const [pole, setPole] = useState<'North' | 'South'>('North');
  const [motion, setMotion] = useState<'Approaching' | 'Receding'>('Approaching');

  // Lenz Law logic
  const inducedFace = pole === 'North'
    ? (motion === 'Approaching' ? 'North (Repels)' : 'South (Attracts)')
    : (motion === 'Approaching' ? 'South (Repels)' : 'North (Attracts)');
  
  const currentDirection = inducedFace.startsWith('North') ? 'Counter-Clockwise (CCW)' : 'Clockwise (CW)';

  // --- Class 12: Photoelectric Effect State ---
  const [metalWorkFunction, setMetalWorkFunction] = useState<number>(2.14); // Cesium 2.14 eV
  const [incidentEnergyEv, setIncidentEnergyEv] = useState<number>(3.10); // eV
  const maxKineticEnergy = Math.max(0, Number((incidentEnergyEv - metalWorkFunction).toFixed(2)));
  const stoppingPotentialV = maxKineticEnergy; // V0 in Volts
  const emissionOccurs = incidentEnergyEv >= metalWorkFunction;

  // --- Class 11: Projectile on Incline State ---
  const [velocity, setVelocity] = useState<number>(30); // m/s
  const [theta, setTheta] = useState<number>(45); // deg
  const [beta, setBeta] = useState<number>(20); // incline angle
  const g = 9.8;
  const radTheta = (theta * Math.PI) / 180;
  const radBeta = (beta * Math.PI) / 180;
  const gPerp = g * Math.cos(radBeta);
  const gPar = g * Math.sin(radBeta);
  const timeOfFlight = Number(((2 * velocity * Math.sin(radTheta)) / gPerp).toFixed(2));
  const maxPerpHeight = Number(((Math.pow(velocity * Math.sin(radTheta), 2)) / (2 * gPerp)).toFixed(2));
  const rangeOnIncline = Number(
    ((velocity * Math.cos(radTheta) * timeOfFlight) - (0.5 * gPar * Math.pow(timeOfFlight, 2))).toFixed(1)
  );

  return (
    <section id="concept-lab" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Developer Attribution */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>Interactive Concept Simulation Lab</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance] font-heading">
            Class 12 & 11 Physics <span className="text-amber-500">Visual Simulation Lab</span>
          </h2>
          
          <p className="text-slate-700 text-base leading-relaxed font-medium">
            See how Arvind Kashyap (Kashyap Sir) deconstructs high-weightage Class 12 Board derivations and JEE/NEET numerical traps into intuitive interactive physics simulations.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl mt-4 border border-slate-300 shadow-2xs">
            <button
              onClick={() => setActiveTab('ydse')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ydse'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-amber-400" />
              <span>[Class 12] Wave Optics: YDSE Fringes</span>
            </button>

            <button
              onClick={() => setActiveTab('induction')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'induction'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>[Class 12] Lenz's Law & EMI</span>
            </button>

            <button
              onClick={() => setActiveTab('photoelectric')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'photoelectric'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>[Class 12] Photoelectric Effect</span>
            </button>

            <button
              onClick={() => setActiveTab('projectile')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'projectile'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>[Class 11] Projectile on Incline</span>
            </button>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl overflow-hidden p-6 sm:p-8 shadow-xs">
          
          {/* TAB 1: CLASS 12 YOUNG'S DOUBLE SLIT EXPERIMENT (YDSE) */}
          {activeTab === 'ydse' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              
              {/* Left Controls */}
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 font-mono">
                      Class 12 Board & NEET Core
                    </span>
                    <span className="text-xs font-bold text-blue-950 font-mono">Ch 10: Wave Optics</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 font-heading">
                    Young's Double Slit Experiment (YDSE)
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Adjust laser wavelength (λ), slit separation (d), and screen distance (D) to observe interference fringe width (β = λD/d).
                  </p>
                </div>

                {/* Controls */}
                <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-300">
                  {/* Wavelength Slider & Laser Presets */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Light Wavelength (λ)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">
                        {wavelengthNm} nm ({currentColor.name})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={400}
                      max={700}
                      step={10}
                      value={wavelengthNm}
                      onChange={(e) => setWavelengthNm(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 mt-2">
                      {[
                        { nm: 650, label: 'Red (650nm)' },
                        { nm: 532, label: 'Green (532nm)' },
                        { nm: 450, label: 'Blue (450nm)' },
                        { nm: 405, label: 'Violet (405nm)' },
                      ].map((item) => (
                        <button
                          key={item.nm}
                          onClick={() => setWavelengthNm(item.nm)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            wavelengthNm === item.nm
                              ? 'bg-blue-950 text-white border-blue-950'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slit separation d */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Slit Separation (d)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">{slitSeparationMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min={0.10}
                      max={0.60}
                      step={0.05}
                      value={slitSeparationMm}
                      onChange={(e) => setSlitSeparationMm(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                  </div>

                  {/* Screen Distance D */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Screen Distance (D)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">{screenDistanceM} m</span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={2.0}
                      step={0.1}
                      value={screenDistanceM}
                      onChange={(e) => setScreenDistanceM(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Computed Physics Values */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-300">
                    <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Fringe Width (β)</div>
                    <div className="text-sm font-extrabold text-blue-950 font-mono tabular-nums">{fringeWidthMm} mm</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-300">
                    <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Angular Width (θ)</div>
                    <div className="text-sm font-extrabold text-blue-950 font-mono tabular-nums">{angularWidthMrad} mrad</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-300">
                    <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Center Maxima</div>
                    <div className="text-sm font-extrabold text-emerald-700 font-mono">Intensity = 4I₀</div>
                  </div>
                </div>

                {/* Kashyap Sir's Derivation Note */}
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Arvind Kashyap Sir's Board & NEET Derivation Key</span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    "In Class 12 Boards (5-mark guaranteed question): Path difference <span className="font-mono font-bold">Δx = S₂P - S₁P = d·sin(θ) ≈ yd/D</span>. For Constructive interference (Bright fringe): <span className="font-mono font-bold">Δx = nλ</span>. For Destructive interference (Dark fringe): <span className="font-mono font-bold">Δx = (2n-1)λ/2</span>. Notice that <span className="font-mono font-bold">β ∝ λ</span>; red light always produces wider fringes than violet!"
                  </p>
                </div>
              </div>

              {/* Right Visual Simulation Canvas */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 text-white flex flex-col justify-between min-h-[380px] border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColor.hex }} />
                    <span>Live Wave Optics Interference Pattern</span>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    β = {fringeWidthMm} mm | λ = {wavelengthNm}nm
                  </span>
                </div>

                {/* Visual Ray & Screen Schematic */}
                <div className="py-4 space-y-4">
                  {/* Schematic Representation */}
                  <svg viewBox="0 0 460 170" className="w-full max-w-lg mx-auto h-auto">
                    {/* Laser Source */}
                    <rect x="10" y="70" width="35" height="30" rx="4" fill="#334155" stroke="#64748b" />
                    <circle cx="27" cy="85" r="4" fill={currentColor.hex} />
                    <text x="8" y="115" fill="#94a3b8" fontSize="9" fontWeight="bold">Laser Source</text>

                    {/* Laser Beam with Glow */}
                    <line x1="45" y1="85" x2="110" y2="85" stroke={currentColor.hex} strokeWidth="3" className="animate-pulse" />

                    {/* Double Slit Obstacle Plane */}
                    <line x1="110" y1="20" x2="110" y2="72" stroke="#e2e8f0" strokeWidth="4" />
                    <line x1="110" y1="78" x2="110" y2="92" stroke="#e2e8f0" strokeWidth="4" />
                    <line x1="110" y1="98" x2="110" y2="150" stroke="#e2e8f0" strokeWidth="4" />

                    <text x="95" y="162" fill="#94a3b8" fontSize="9" fontWeight="bold">Slits S₁, S₂ (d)</text>

                    {/* Animated Circular Wavefronts emanating from S1 and S2 */}
                    <path d="M 115,75 A 25 25 0 0 1 135,85" fill="none" stroke={currentColor.hex} strokeWidth="1.5" strokeDasharray="3 2" className="animate-pulse" opacity="0.8" />
                    <path d="M 115,95 A 25 25 0 0 0 135,85" fill="none" stroke={currentColor.hex} strokeWidth="1.5" strokeDasharray="3 2" className="animate-pulse" opacity="0.8" />
                    <path d="M 125,75 A 50 50 0 0 1 165,85" fill="none" stroke={currentColor.hex} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
                    <path d="M 125,95 A 50 50 0 0 0 165,85" fill="none" stroke={currentColor.hex} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />

                    {/* Rays from S1 and S2 to screen center and point P */}
                    <line x1="110" y1="75" x2="420" y2="85" stroke={currentColor.hex} strokeWidth="2" strokeOpacity="0.9" />
                    <line x1="110" y1="95" x2="420" y2="85" stroke={currentColor.hex} strokeWidth="2" strokeOpacity="0.9" />

                    <line x1="110" y1="75" x2="420" y2="40" stroke={currentColor.hex} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.75" />
                    <line x1="110" y1="95" x2="420" y2="40" stroke={currentColor.hex} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.75" />

                    {/* Screen Plane */}
                    <line x1="420" y1="15" x2="420" y2="155" stroke="#f8fafc" strokeWidth="4" />
                    <text x="375" y="165" fill="#f8fafc" fontSize="9" fontWeight="bold">Screen (D = {screenDistanceM}m)</text>

                    {/* Central Bright Spot Indicator */}
                    <circle cx="420" cy="85" r="6" fill={currentColor.hex} className="animate-ping" opacity="0.6" />
                    <circle cx="420" cy="85" r="5" fill={currentColor.hex} className="animate-pulse" />
                    <text x="428" y="88" fill={currentColor.hex} fontSize="9" fontWeight="bold">Central Maxima</text>
                  </svg>

                  {/* Simulated Interference Fringes Pattern */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                      <span>Interference Fringes on Screen:</span>
                      <span className="text-slate-300">Dark Fringes (I=0) ↔ Bright Fringes (I=4I₀)</span>
                    </div>

                    <div
                      className="h-14 w-full rounded-xl overflow-hidden border border-slate-700 flex shadow-inner"
                      style={{
                        background: `repeating-linear-gradient(
                          to right,
                          rgba(${currentColor.rgb}, 0.95) 0px,
                          rgba(${currentColor.rgb}, 0.95) ${Math.max(4, fringeWidthMm * 4)}px,
                          #020617 ${Math.max(4, fringeWidthMm * 4)}px,
                          #020617 ${Math.max(8, fringeWidthMm * 8)}px
                        )`,
                      }}
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                      <span>-3β</span>
                      <span>-2β</span>
                      <span>-1β</span>
                      <span className="text-amber-400 font-bold">Central (0)</span>
                      <span>+1β</span>
                      <span>+2β</span>
                      <span>+3β</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span>Class 12 NCERT Formula: <strong className="text-amber-400 font-mono">β = λD / d</strong></span>
                  <span className="text-emerald-400 font-semibold">Taught personally by Arvind Kashyap</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CLASS 12 ELECTROMAGNETIC INDUCTION (LENZ'S LAW) */}
          {activeTab === 'induction' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 font-mono">
                      Class 12 Chapter 6 (EMI)
                    </span>
                    <span className="text-xs font-bold text-blue-950 font-mono">Faraday & Lenz</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 font-heading">
                    Lenz's Law & Induced EMF Direction
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Test the direction of induced current when a bar magnet approaches or recedes from a conducting coil.
                  </p>
                </div>

                {/* Selectors */}
                <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-300">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">Magnet Pole Facing Coil</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPole('North')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          pole === 'North'
                            ? 'bg-red-600 text-white border-red-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        North Pole (N)
                      </button>
                      <button
                        onClick={() => setPole('South')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          pole === 'South'
                            ? 'bg-blue-700 text-white border-blue-800 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        South Pole (S)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">Magnet Relative Motion</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMotion('Approaching')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          motion === 'Approaching'
                            ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Moving Towards Coil (→)
                      </button>
                      <button
                        onClick={() => setMotion('Receding')}
                        className={`py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          motion === 'Receding'
                            ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Moving Away (←)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Physics Outcome */}
                <div className="bg-white p-4 rounded-2xl border border-slate-300 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Induced Polarity on Coil Face:</span>
                    <span className="font-extrabold text-blue-950 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {inducedFace}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Induced Current Direction:</span>
                    <span className="font-extrabold text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {currentDirection}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Governing Law:</span>
                    <span className="font-mono text-slate-900 font-bold">ε = -N (dΦ_B / dt)</span>
                  </div>
                </div>

                {/* Kashyap Sir's Note */}
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950">
                  <strong className="text-amber-900 font-bold block mb-1">Kashyap Sir's Golden Principle:</strong>
                  "Lenz's Law is nothing but the Law of Conservation of Energy! If the North pole approaches, the coil MUST develop a North pole to repel it. You do mechanical work against this repulsion, which transforms into electrical energy in the coil."
                </div>
              </div>

              {/* Right Visual Simulation Canvas */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 text-white flex flex-col justify-between min-h-[360px] border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2 font-medium">
                  <span>Class 12 Electromagnetic Induction Dynamic Rig</span>
                  <span className="font-mono text-emerald-400 font-bold">{currentDirection}</span>
                </div>

                <div className="py-8 flex items-center justify-center">
                  <svg viewBox="0 0 460 180" className="w-full max-w-md h-auto">
                    {/* Bar Magnet with Smooth Motion Transition */}
                    <g 
                      className="transition-transform duration-700 ease-out"
                      transform={`translate(${motion === 'Approaching' ? '100' : '20'}, 55)`}
                    >
                      {/* North section */}
                      <rect x="0" y="0" width="55" height="40" rx="4" fill="#dc2626" filter="drop-shadow(0 0 6px rgba(220, 38, 38, 0.4))" />
                      <text x="22" y="25" fill="#ffffff" fontWeight="bold" fontSize="16">N</text>
                      {/* South section */}
                      <rect x="55" y="0" width="55" height="40" rx="4" fill="#2563eb" filter="drop-shadow(0 0 6px rgba(37, 99, 235, 0.4))" />
                      <text x="77" y="25" fill="#ffffff" fontWeight="bold" fontSize="16">S</text>
                      
                      {/* Animated Motion Arrow */}
                      {motion === 'Approaching' ? (
                        <path d="M 120,20 L 150,20 M 142,13 L 150,20 L 142,27" stroke="#fbbf24" strokeWidth="3.5" fill="none" className="animate-pulse" />
                      ) : (
                        <path d="M -10,20 L -40,20 M -32,13 L -40,20 L -32,27" stroke="#fbbf24" strokeWidth="3.5" fill="none" className="animate-pulse" />
                      )}
                    </g>

                    {/* Circular Wire Coil Loop with Amber Glow */}
                    <ellipse cx="320" cy="75" rx="30" ry="60" fill="none" stroke="#f59e0b" strokeWidth="6" filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))" />
                    <ellipse cx="320" cy="75" rx="20" ry="45" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="6 4" />

                    {/* Coil Label */}
                    <text x="260" y="155" fill="#cbd5e1" fontSize="11" fontWeight="bold">Conducting Coil (Face {inducedFace.split(' ')[0]})</text>
                    
                    {/* Animated Induced magnetic field lines */}
                    <path
                      d="M 315,40 C 260,35 260,115 315,110"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      className="animate-pulse"
                    />
                    <path
                      d="M 320,25 C 240,20 240,130 320,125"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                    <text x="195" y="78" fill="#38bdf8" fontSize="10" fontWeight="bold">Induced B-field</text>
                  </svg>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>Class 12 Chapter 6: Lenz’s Law</span>
                  <span className="font-bold text-amber-400">Mastered at Kashyap Classes</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLASS 12 PHOTOELECTRIC EFFECT */}
          {activeTab === 'photoelectric' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900 font-mono">
                      Class 12 Chapter 11 (Modern Physics)
                    </span>
                    <span className="text-xs font-bold text-blue-950 font-mono">Einstein's Equation</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 font-heading">
                    Photoelectric Effect & Stopping Potential
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Einstein's Nobel Prize equation: K_max = hν - Φ₀ = e·V₀. Adjust incident photon energy and target metal.
                  </p>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-300">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Target Metal Work Function (Φ₀)</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { name: 'Cesium (Cs)', wf: 2.14 },
                        { name: 'Sodium (Na)', wf: 2.75 },
                        { name: 'Copper (Cu)', wf: 4.65 },
                      ].map((m) => (
                        <button
                          key={m.name}
                          onClick={() => setMetalWorkFunction(m.wf)}
                          className={`p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                            metalWorkFunction === m.wf
                              ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <div>{m.name}</div>
                          <div className="text-[10px] font-mono opacity-80">{m.wf} eV</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Incident Photon Energy (hν)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">{incidentEnergyEv} eV</span>
                    </div>
                    <input
                      type="range"
                      min={1.5}
                      max={6.0}
                      step={0.1}
                      value={incidentEnergyEv}
                      onChange={(e) => setIncidentEnergyEv(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Outputs */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <div className="text-[11px] font-bold text-slate-600 uppercase">Max Kinetic Energy (K_max)</div>
                    <div className="text-base font-extrabold text-blue-950 font-mono">{maxKineticEnergy} eV</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-300">
                    <div className="text-[11px] font-bold text-slate-600 uppercase">Stopping Potential (V₀)</div>
                    <div className="text-base font-extrabold text-emerald-800 font-mono">{stoppingPotentialV} V</div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-xs font-medium ${
                  emissionOccurs ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
                }`}>
                  {emissionOccurs ? (
                    <span className="font-bold">✓ Photoelectrons Emitted with velocity v = √(2K_max/m)</span>
                  ) : (
                    <span className="font-bold">✗ No Emission! hν &lt; Φ₀ (Energy below threshold frequency ν₀)</span>
                  )}
                </div>
              </div>

              {/* Simulation Canvas */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 text-white flex flex-col justify-between min-h-[360px] border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                  <span>Photoelectric Vacuum Phototube Rig</span>
                  <span className="font-mono text-amber-400 font-bold">V₀ = {stoppingPotentialV} V</span>
                </div>

                <div className="py-6 flex items-center justify-center">
                  <svg viewBox="0 0 440 180" className="w-full max-w-md h-auto">
                    {/* Metal Cathode Plate */}
                    <rect x="50" y="30" width="16" height="120" rx="3" fill="#94a3b8" />
                    <text x="30" y="165" fill="#94a3b8" fontSize="10" fontWeight="bold">Target Metal (Φ₀ = {metalWorkFunction}eV)</text>

                    {/* Anode Collector Plate */}
                    <rect x="370" y="30" width="16" height="120" rx="3" fill="#475569" />
                    <text x="350" y="165" fill="#94a3b8" fontSize="10" fontWeight="bold">Collector Plate</text>

                    {/* Incident Photons */}
                    <line x1="10" y1="50" x2="50" y2="70" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="10" y1="80" x2="50" y2="90" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="10" y1="110" x2="50" y2="120" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="5" y="40" fill="#f59e0b" fontSize="10" fontWeight="bold">Photons (hν = {incidentEnergyEv}eV)</text>

                    {/* Ejected Photoelectrons */}
                    {emissionOccurs && (
                      <g className="animate-pulse">
                        <circle cx="120" cy="70" r="5" fill="#38bdf8" />
                        <line x1="125" y1="70" x2="160" y2="70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />

                        <circle cx="210" cy="90" r="5" fill="#38bdf8" />
                        <line x1="215" y1="90" x2="250" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />

                        <circle cx="160" cy="115" r="5" fill="#38bdf8" />
                        <line x1="165" y1="115" x2="200" y2="115" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                      </g>
                    )}
                  </svg>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>Einstein: K_max = hν - Φ₀</span>
                  <span className="font-bold text-amber-400">Class 12 High Scoring Topic</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLASS 11 PROJECTILE ON INCLINE */}
          {activeTab === 'projectile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-950 uppercase tracking-wider font-mono">
                    Class 11 Mechanics · JEE Advanced
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 font-heading">
                    Projectile Fired up an Inclined Plane
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Adjust initial velocity, launch angle relative to the slope, and slope inclination.
                  </p>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-300">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Launch Velocity (u)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">{velocity} m/s</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={60}
                      step={5}
                      value={velocity}
                      onChange={(e) => setVelocity(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Launch Angle (θ)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">{theta}°</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={75}
                      step={5}
                      value={theta}
                      onChange={(e) => setTheta(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Incline Slope (β)</span>
                      <span className="font-mono text-blue-950 tabular-nums font-extrabold">{beta}°</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={45}
                      step={5}
                      value={beta}
                      onChange={(e) => setBeta(Number(e.target.value))}
                      className="w-full accent-blue-950 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-300">
                    <div className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">Time of Flight</div>
                    <div className="text-sm font-extrabold text-blue-950 font-mono tabular-nums">{timeOfFlight}s</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-300">
                    <div className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">Max Height (H⊥)</div>
                    <div className="text-sm font-extrabold text-blue-950 font-mono tabular-nums">{maxPerpHeight}m</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-300">
                    <div className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">Range on Slope</div>
                    <div className="text-sm font-extrabold text-blue-950 font-mono tabular-nums">{Math.max(0, rangeOnIncline)}m</div>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between min-h-[340px] border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-200 border-b border-slate-800 pb-2 font-medium">
                  <span>Vector Decomposition Canvas</span>
                  <span className="font-mono text-emerald-300 tabular-nums font-bold">θ = {theta}° | β = {beta}°</span>
                </div>

                <div className="py-6 flex items-center justify-center">
                  <svg viewBox="0 0 460 200" className="w-full max-w-lg h-auto">
                    <line x1="20" y1="180" x2="440" y2="180" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                    <polygon points={`40,180 400,${Math.max(40, 180 - 360 * Math.tan(radBeta))} 400,180`} fill="#1e293b" />
                    <line x1="40" y1="180" x2="400" y2={Math.max(40, 180 - 360 * Math.tan(radBeta))} stroke="#38bdf8" strokeWidth="3.5" />
                    <path
                      d={`M 40,180 Q 180,30 ${Math.min(390, 40 + rangeOnIncline * 3.5)},${Math.max(40, 180 - (rangeOnIncline * 3.5) * Math.tan(radBeta))}`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                    />
                  </svg>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span>Gravity axes: <span className="font-mono font-bold text-amber-400">g_perp = g·cos(β)</span> & <span className="font-mono font-bold text-amber-400">g_par = g·sin(β)</span></span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Class 12 High-Yield Physics Formula & Derivation Reference Cards - Clean Light Theme */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 text-slate-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Class 12 Core Derivations & Board Formula Key</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading mt-1">
                High-Yield Board & Entrance Formulas Mastered with Kashyap Sir
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-100 text-blue-950 border border-blue-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              CBSE Boards · JEE · NEET
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Card 1: Wave Optics YDSE */}
            <div className="card-hover-lift bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-400 transition-all shadow-xs cursor-default">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950">Wave Optics (YDSE)</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ch 10</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <p>• Fringe Width: <strong className="text-blue-900 font-bold">β = λD / d</strong></p>
                <p>• Angular Width: <strong className="text-blue-900 font-bold">θ = λ / d</strong></p>
                <p>• Path Diff: <strong className="text-emerald-700 font-bold">Δx = yd / D</strong></p>
                <p>• Bright Fringe: <strong className="text-amber-800 font-bold">Δx = nλ</strong></p>
                <p>• Dark Fringe: <strong className="text-amber-800 font-bold">Δx = (2n-1)λ / 2</strong></p>
              </div>
            </div>

            {/* Card 2: Electromagnetic Induction */}
            <div className="card-hover-lift bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-400 transition-all shadow-xs cursor-default">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950">EMI & Alternating Current</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ch 6 & 7</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <p>• Faraday's Law: <strong className="text-blue-900 font-bold">ε = -N(dΦ / dt)</strong></p>
                <p>• Motional EMF: <strong className="text-blue-900 font-bold">ε = B·v·l</strong></p>
                <p>• LCR Resonance: <strong className="text-emerald-700 font-bold">f_r = 1 / (2π√LC)</strong></p>
                <p>• Quality Factor: <strong className="text-amber-800 font-bold">Q = (1/R)·√(L/C)</strong></p>
                <p>• Power Factor: <strong className="text-amber-800 font-bold">cos(φ) = R / Z</strong></p>
              </div>
            </div>

            {/* Card 3: Electrostatics & Capacitance */}
            <div className="card-hover-lift bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-400 transition-all shadow-xs cursor-default">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950">Electrostatics & Gauss</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ch 1 & 2</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <p>• Gauss Flux: <strong className="text-blue-900 font-bold">Φ = ∮E·dA = q_in / ε₀</strong></p>
                <p>• Axial Dipole: <strong className="text-blue-900 font-bold">E = 2kp / r³</strong></p>
                <p>• Capacitance: <strong className="text-emerald-700 font-bold">C = κ·ε₀·A / d</strong></p>
                <p>• Stored Energy: <strong className="text-amber-800 font-bold">U = ½CV² = Q² / 2C</strong></p>
                <p>• Energy Density: <strong className="text-amber-800 font-bold">u = ½ε₀E²</strong></p>
              </div>
            </div>

            {/* Card 4: Modern Physics */}
            <div className="card-hover-lift bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-400 transition-all shadow-xs cursor-default">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950">Modern Physics & Photons</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ch 11 & 12</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <p>• Einstein Eqn: <strong className="text-blue-900 font-bold">K_max = hν - Φ₀ = eV₀</strong></p>
                <p>• de Broglie: <strong className="text-blue-900 font-bold">λ = h / p = h / √(2mE)</strong></p>
                <p>• Bohr Radius: <strong className="text-emerald-700 font-bold">r_n = 0.529 · (n² / Z) Å</strong></p>
                <p>• Rydberg: <strong className="text-amber-800 font-bold">1/λ = R·Z²·(1/n₁² - 1/n₂²)</strong></p>
                <p>• Binding Energy: <strong className="text-amber-800 font-bold">ΔE = Δm · c²</strong></p>
              </div>
            </div>

            {/* Card 5: Magnetism & Biot-Savart */}
            <div className="card-hover-lift bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-400 transition-all shadow-xs cursor-default">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950">Moving Charges & Magnetism</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ch 4 & 5</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <p>• Lorentz Force: <strong className="text-blue-900 font-bold">F = q(E + v × B)</strong></p>
                <p>• Circular Radius: <strong className="text-blue-900 font-bold">r = mv / (qB)</strong></p>
                <p>• Wire Force: <strong className="text-emerald-700 font-bold">F = I(L × B)</strong></p>
                <p>• Solenoid: <strong className="text-amber-800 font-bold">B = μ₀·n·I</strong></p>
                <p>• Galvanometer: <strong className="text-amber-800 font-bold">I = (C / NAB) · θ</strong></p>
              </div>
            </div>

            {/* Card 6: Ray Optics */}
            <div className="card-hover-lift bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-400 transition-all shadow-xs cursor-default">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950">Ray Optics & Instruments</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ch 9</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <p>• Lens Maker: <strong className="text-blue-900 font-bold">1/f = (μ-1)(1/R₁ - 1/R₂)</strong></p>
                <p>• Critical Angle: <strong className="text-blue-900 font-bold">sin(i_c) = 1 / μ</strong></p>
                <p>• Prism Formula: <strong className="text-emerald-700 font-bold">μ = sin((A+δ_m)/2) / sin(A/2)</strong></p>
                <p>• Telescope Mag: <strong className="text-amber-800 font-bold">m = f_o / f_e</strong></p>
                <p>• Microscope Mag: <strong className="text-amber-800 font-bold">m = (L/f_o) · (D/f_e)</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Footer Note with Developer Attribution */}
        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          Simulations & Formula Hub crafted for conceptual clarity · Website Developed & Created by <strong className="text-slate-800">Rishi Shrivastav</strong>
        </div>

      </div>
    </section>
  );
};
