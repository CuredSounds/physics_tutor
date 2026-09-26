/*
 * Physics Tutor content data.
 *
 * Structure:
 *   domains: [ { id, name, icon, blurb, topics: [
 *      { id, name, summary, lessons: [
 *          { id, title, level, definition, explanation,
 *            formulas: [{ latex/plain, name, desc }],
 *            keyPoints: [..], viz: "<visualization id>" }
 *      ]}
 *   ]}]
 *
 * `viz` maps to an animation registered in js/visualizations.js.
 */
window.PHYSICS_DATA = {
  domains: [
    {
      id: "mechanics",
      name: "Classical Mechanics",
      icon: "🏹",
      blurb:
        "Motion, forces, energy and momentum — the foundation of physics from Galileo and Newton.",
      topics: [
        {
          id: "kinematics",
          name: "Kinematics",
          summary: "Describing motion with position, velocity and acceleration.",
          lessons: [
            {
              id: "kin-1d",
              title: "Motion in One Dimension",
              level: "Foundations",
              definition:
                "Kinematics describes how objects move without asking why. Position (x), velocity (v = dx/dt) and acceleration (a = dv/dt) fully characterise 1‑D motion.",
              explanation:
                "For constant acceleration the SUVAT equations relate displacement, velocity, acceleration and time. Velocity is the slope of a position–time graph; acceleration is the slope of a velocity–time graph, and the area under a v–t graph is displacement.",
              formulas: [
                { name: "Velocity", plain: "v = u + a·t", desc: "Final velocity from initial velocity u." },
                { name: "Displacement", plain: "s = u·t + ½·a·t²", desc: "Distance travelled under constant a." },
                { name: "Torricelli", plain: "v² = u² + 2·a·s", desc: "Velocity without time." },
              ],
              keyPoints: [
                "Velocity is a vector: it has direction; speed is its magnitude.",
                "Acceleration can be negative (deceleration) or change direction.",
                "SUVAT only applies when acceleration is constant.",
              ],
            },
            {
              id: "projectile",
              title: "Projectile Motion",
              level: "Core",
              definition:
                "A projectile moves under gravity alone after launch. Horizontal and vertical motion are independent: constant horizontal velocity, constant downward acceleration g.",
              explanation:
                "The horizontal and vertical components evolve separately and are stitched together by shared time. The trajectory is a parabola. Range is maximised at a 45° launch angle (on level ground, no air resistance).",
              formulas: [
                { name: "Range", plain: "R = v₀²·sin(2θ) / g", desc: "Horizontal range on level ground." },
                { name: "Max height", plain: "H = v₀²·sin²(θ) / (2g)", desc: "Peak of the arc." },
                { name: "Time of flight", plain: "T = 2·v₀·sin(θ) / g", desc: "Total airborne time." },
              ],
              keyPoints: [
                "Horizontal velocity is constant (ignoring drag).",
                "Vertical motion is symmetric about the peak.",
                "Launch angle sets the trade-off between range and height.",
              ],
              viz: "projectile",
            },
          ],
        },
        {
          id: "dynamics",
          name: "Dynamics & Newton's Laws",
          summary: "How forces change motion.",
          lessons: [
            {
              id: "newton-laws",
              title: "Newton's Three Laws",
              level: "Core",
              definition:
                "Newton's laws connect force and motion: (1) inertia, (2) F = ma, (3) action–reaction.",
              explanation:
                "An object keeps its velocity unless a net force acts (1st law). The net force equals mass times acceleration (2nd law). Every force has an equal and opposite reaction on another body (3rd law).",
              formulas: [
                { name: "Second law", plain: "F_net = m·a", desc: "Net force sets acceleration." },
                { name: "Weight", plain: "W = m·g", desc: "Gravitational force near Earth." },
                { name: "Friction", plain: "f ≤ μ·N", desc: "Contact resistance up to a limit." },
              ],
              keyPoints: [
                "Forces are vectors; add them to find the net force.",
                "Mass measures inertia — resistance to acceleration.",
                "Action–reaction pairs act on different objects.",
              ],
            },
          ],
        },
        {
          id: "energy",
          name: "Work, Energy & Power",
          summary: "The currency of physics: conserved and transferable.",
          lessons: [
            {
              id: "work-energy",
              title: "Work–Energy Theorem",
              level: "Core",
              definition:
                "Work is force applied over a distance; it transfers energy. The net work done on a body equals its change in kinetic energy.",
              explanation:
                "Energy is conserved in an isolated system. It converts between kinetic (motion) and potential (stored) forms. Power is the rate of doing work.",
              formulas: [
                { name: "Work", plain: "W = F·d·cos(θ)", desc: "Force times displacement." },
                { name: "Kinetic energy", plain: "KE = ½·m·v²", desc: "Energy of motion." },
                { name: "Grav. PE", plain: "PE = m·g·h", desc: "Stored by height." },
                { name: "Power", plain: "P = W / t = F·v", desc: "Rate of energy transfer." },
              ],
              keyPoints: [
                "Only the force component along motion does work.",
                "In conservative fields, total mechanical energy is constant.",
                "Power measures how fast energy is delivered.",
              ],
            },
          ],
        },
        {
          id: "oscillations",
          name: "Oscillations",
          summary: "Repetitive motion and simple harmonic motion.",
          lessons: [
            {
              id: "shm",
              title: "Simple Harmonic Motion",
              level: "Core",
              definition:
                "SHM occurs when the restoring force is proportional to displacement and directed toward equilibrium, producing sinusoidal motion.",
              explanation:
                "Pendulums (small angles) and masses on springs are classic examples. The period depends on system properties, not amplitude. Energy sloshes between kinetic and potential twice per cycle.",
              formulas: [
                { name: "Spring period", plain: "T = 2π·√(m/k)", desc: "Mass–spring oscillator." },
                { name: "Pendulum period", plain: "T = 2π·√(L/g)", desc: "Small-angle pendulum." },
                { name: "Displacement", plain: "x(t) = A·cos(ω·t + φ)", desc: "ω = 2π/T." },
              ],
              keyPoints: [
                "Restoring force F = −k·x defines SHM.",
                "Period is independent of amplitude (for ideal SHM).",
                "Energy oscillates between KE and PE.",
              ],
              viz: "pendulum",
            },
          ],
        },
        {
          id: "gravitation",
          name: "Gravitation",
          summary: "The universal attractive force between masses.",
          lessons: [
            {
              id: "universal-grav",
              title: "Newton's Law of Gravitation",
              level: "Core",
              definition:
                "Every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them.",
              explanation:
                "This single law explains falling apples and orbiting planets. Combined with circular motion it yields Kepler's laws of planetary motion.",
              formulas: [
                { name: "Gravitation", plain: "F = G·m₁·m₂ / r²", desc: "G = 6.674×10⁻¹¹ N·m²/kg²." },
                { name: "Orbital speed", plain: "v = √(G·M / r)", desc: "Circular orbit." },
                { name: "Kepler III", plain: "T² ∝ r³", desc: "Period vs orbital radius." },
              ],
              keyPoints: [
                "Inverse-square: double the distance, quarter the force.",
                "Orbits are ellipses (Kepler's first law).",
                "g at a surface = G·M / R².",
              ],
              viz: "orbit",
            },
          ],
        },
      ],
    },
    {
      id: "waves",
      name: "Waves & Sound",
      icon: "〰️",
      blurb: "Oscillations that carry energy through space and matter.",
      topics: [
        {
          id: "wave-basics",
          name: "Wave Properties",
          summary: "Amplitude, wavelength, frequency and speed.",
          lessons: [
            {
              id: "wave-anatomy",
              title: "Anatomy of a Wave",
              level: "Foundations",
              definition:
                "A wave is a disturbance that transfers energy without transferring matter. Transverse waves oscillate perpendicular to travel; longitudinal waves oscillate along it.",
              explanation:
                "Wavelength (λ) is the distance between repeats, frequency (f) the repeats per second, and their product is the wave speed. Amplitude sets the energy carried.",
              formulas: [
                { name: "Wave speed", plain: "v = f·λ", desc: "Speed from frequency and wavelength." },
                { name: "Period", plain: "T = 1 / f", desc: "Time for one cycle." },
                { name: "Angular freq.", plain: "ω = 2π·f", desc: "Radians per second." },
              ],
              keyPoints: [
                "Energy travels; the medium does not.",
                "Speed depends on the medium, not the source.",
                "Amplitude relates to energy/intensity.",
              ],
              viz: "wave",
            },
          ],
        },
        {
          id: "wave-behavior",
          name: "Superposition & Doppler",
          summary: "Interference, standing waves and frequency shift.",
          lessons: [
            {
              id: "doppler",
              title: "The Doppler Effect",
              level: "Core",
              definition:
                "The observed frequency of a wave changes when the source and observer move relative to each other.",
              explanation:
                "Approaching sources sound higher-pitched (compressed wavefronts); receding sources sound lower. The same effect redshifts light from receding galaxies.",
              formulas: [
                { name: "Doppler (sound)", plain: "f' = f·(v ± v_o)/(v ∓ v_s)", desc: "Signs depend on direction." },
              ],
              keyPoints: [
                "Wavefronts bunch ahead of a moving source.",
                "Explains sirens changing pitch as they pass.",
                "Redshift is cosmological evidence for expansion.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "thermodynamics",
      name: "Thermodynamics",
      icon: "🔥",
      blurb: "Heat, temperature, energy flow and entropy.",
      topics: [
        {
          id: "laws-thermo",
          name: "The Laws of Thermodynamics",
          summary: "Energy conservation and the arrow of time.",
          lessons: [
            {
              id: "thermo-laws",
              title: "The Four Laws",
              level: "Core",
              definition:
                "Thermodynamics governs energy exchange as heat and work. Its laws constrain what processes are possible.",
              explanation:
                "0th: thermal equilibrium defines temperature. 1st: energy is conserved (ΔU = Q − W). 2nd: entropy of an isolated system never decreases. 3rd: entropy approaches a constant as T → 0 K.",
              formulas: [
                { name: "First law", plain: "ΔU = Q − W", desc: "Internal energy change." },
                { name: "Entropy", plain: "ΔS = Q_rev / T", desc: "Reversible heat over temperature." },
                { name: "Efficiency", plain: "η = 1 − T_c/T_h", desc: "Carnot (ideal) engine." },
              ],
              keyPoints: [
                "Energy is conserved but degrades in quality.",
                "Entropy sets the arrow of time.",
                "No engine beats the Carnot efficiency.",
              ],
            },
            {
              id: "ideal-gas",
              title: "The Ideal Gas Law",
              level: "Foundations",
              definition:
                "An ideal gas obeys PV = nRT, linking pressure, volume, amount and temperature.",
              explanation:
                "Kinetic theory models gas as tiny elastic particles. Temperature is proportional to average molecular kinetic energy.",
              formulas: [
                { name: "Ideal gas", plain: "P·V = n·R·T", desc: "R = 8.314 J/(mol·K)." },
                { name: "Kinetic theory", plain: "½·m·v̄² = (3/2)·k_B·T", desc: "Mean molecular energy." },
              ],
              keyPoints: [
                "Temperature ↔ average kinetic energy.",
                "Valid at low pressure / high temperature.",
                "Boltzmann constant links micro and macro scales.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "electricity",
      name: "Electricity",
      icon: "⚡",
      blurb: "Charges, fields, potential and the flow of current.",
      topics: [
        {
          id: "electrostatics",
          name: "Electrostatics",
          summary: "Charges at rest and the fields they create.",
          lessons: [
            {
              id: "coulomb",
              title: "Coulomb's Law & Electric Fields",
              level: "Core",
              definition:
                "Charges exert forces on each other: like charges repel, opposites attract. The electric field is the force per unit charge in the surrounding space.",
              explanation:
                "Field lines point away from positive charges and toward negative charges. Their density represents field strength. A dipole (two opposite charges) produces the familiar looping pattern.",
              formulas: [
                { name: "Coulomb", plain: "F = k·q₁·q₂ / r²", desc: "k = 8.99×10⁹ N·m²/C²." },
                { name: "Electric field", plain: "E = F / q = k·Q / r²", desc: "Field of a point charge." },
                { name: "Potential", plain: "V = k·Q / r", desc: "Electric potential energy per charge." },
              ],
              keyPoints: [
                "Inverse-square law, like gravity — but can repel.",
                "Field lines never cross.",
                "Potential difference drives current in circuits.",
              ],
              viz: "efield",
            },
          ],
        },
        {
          id: "circuits",
          name: "Circuits",
          summary: "Current, voltage, resistance and Ohm's law.",
          lessons: [
            {
              id: "ohms-law",
              title: "Ohm's Law & Circuits",
              level: "Foundations",
              definition:
                "Current is the flow of charge. Voltage is the energy per charge that drives it. Resistance opposes the flow.",
              explanation:
                "Ohm's law relates the three: V = I·R. In series, resistances add; in parallel, conductances add. Power dissipated is P = I·V.",
              formulas: [
                { name: "Ohm's law", plain: "V = I·R", desc: "Voltage, current, resistance." },
                { name: "Power", plain: "P = I·V = I²·R", desc: "Energy dissipated per second." },
                { name: "Series R", plain: "R = R₁ + R₂ + …", desc: "Resistors in series." },
              ],
              keyPoints: [
                "Current is conserved at junctions (Kirchhoff).",
                "Voltage drops sum around a loop.",
                "Resistors convert electrical energy to heat.",
              ],
              viz: "circuit",
            },
          ],
        },
      ],
    },
    {
      id: "magnetism",
      name: "Magnetism & EM",
      icon: "🧲",
      blurb: "Magnetic fields, forces on charges, and electromagnetism.",
      topics: [
        {
          id: "magnetic-force",
          name: "Magnetic Force & Induction",
          summary: "Forces on moving charges and induced currents.",
          lessons: [
            {
              id: "lorentz",
              title: "The Lorentz Force & Induction",
              level: "Core",
              definition:
                "A magnetic field exerts a force on moving charges, perpendicular to both velocity and field. Changing magnetic flux induces a voltage (Faraday's law).",
              explanation:
                "Moving charges feel F = q·v×B, curving into circles or helices. Faraday's law of induction underlies generators and transformers; Lenz's law fixes the direction to oppose the change.",
              formulas: [
                { name: "Lorentz force", plain: "F = q·(E + v×B)", desc: "Total EM force on a charge." },
                { name: "Faraday", plain: "ε = −dΦ_B/dt", desc: "Induced EMF from flux change." },
                { name: "Wire force", plain: "F = B·I·L", desc: "Force on a current-carrying wire." },
              ],
              keyPoints: [
                "Magnetic force does no work (⊥ to motion).",
                "Changing flux induces current (generators).",
                "Lenz's law: induced effects oppose the change.",
              ],
            },
            {
              id: "maxwell",
              title: "Maxwell's Equations",
              level: "Advanced",
              definition:
                "Four equations unify electricity and magnetism and predict electromagnetic waves travelling at the speed of light.",
              explanation:
                "Gauss's laws describe how charges source electric fields and that magnetic monopoles don't exist. Faraday's and Ampère–Maxwell's laws describe how changing fields create each other — self-propagating as light.",
              formulas: [
                { name: "Gauss (E)", plain: "∮E·dA = Q/ε₀", desc: "Charges source E fields." },
                { name: "Gauss (B)", plain: "∮B·dA = 0", desc: "No magnetic monopoles." },
                { name: "Ampère–Maxwell", plain: "∮B·dl = μ₀(I + ε₀ dΦ_E/dt)", desc: "Currents & changing E make B." },
                { name: "Speed of light", plain: "c = 1/√(μ₀·ε₀)", desc: "EM wave speed." },
              ],
              keyPoints: [
                "Light is an electromagnetic wave.",
                "Electric and magnetic fields are two faces of one field.",
                "Foundation of all classical electromagnetism.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "optics",
      name: "Optics & Light",
      icon: "🔦",
      blurb: "Reflection, refraction, lenses and the wave nature of light.",
      topics: [
        {
          id: "geometric-optics",
          name: "Geometric Optics",
          summary: "Rays, reflection, refraction and lenses.",
          lessons: [
            {
              id: "refraction",
              title: "Reflection & Refraction",
              level: "Foundations",
              definition:
                "Light reflects off surfaces at equal angles and bends (refracts) when it changes medium due to a change in speed.",
              explanation:
                "Snell's law quantifies bending via refractive index. Lenses use refraction to converge or diverge rays and form images; the lens equation locates them.",
              formulas: [
                { name: "Reflection", plain: "θ_i = θ_r", desc: "Angle in equals angle out." },
                { name: "Snell's law", plain: "n₁·sin(θ₁) = n₂·sin(θ₂)", desc: "Refraction at a boundary." },
                { name: "Lens equation", plain: "1/f = 1/d_o + 1/d_i", desc: "Object/image distances." },
              ],
              keyPoints: [
                "Higher index → slower light → more bending.",
                "Total internal reflection enables fibre optics.",
                "Converging lenses form real, inverted images.",
              ],
              viz: "lens",
            },
          ],
        },
        {
          id: "wave-optics",
          name: "Wave Optics",
          summary: "Interference and diffraction of light.",
          lessons: [
            {
              id: "double-slit",
              title: "Interference & the Double Slit",
              level: "Core",
              definition:
                "When coherent light passes through two slits, the waves overlap and interfere, producing bright and dark fringes.",
              explanation:
                "Constructive interference (peaks aligned) gives bright bands; destructive interference cancels to dark bands. This proved light behaves as a wave — and later, so does matter.",
              formulas: [
                { name: "Bright fringes", plain: "d·sin(θ) = m·λ", desc: "m = 0, 1, 2, …" },
                { name: "Fringe spacing", plain: "Δy = λ·L / d", desc: "On a distant screen." },
              ],
              keyPoints: [
                "Interference is direct evidence of wave behaviour.",
                "Fringe spacing grows with wavelength.",
                "Single particles build the pattern one hit at a time (quantum).",
              ],
              viz: "interference",
            },
          ],
        },
      ],
    },
    {
      id: "quantum",
      name: "Quantum Physics",
      icon: "⚛️",
      blurb: "The strange, probabilistic rules governing the very small.",
      topics: [
        {
          id: "quantum-foundations",
          name: "Foundations",
          summary: "Quantisation, photons and wave–particle duality.",
          lessons: [
            {
              id: "photoelectric",
              title: "Photons & the Photoelectric Effect",
              level: "Core",
              definition:
                "Light comes in discrete packets called photons with energy proportional to frequency. Above a threshold frequency, photons eject electrons from metal.",
              explanation:
                "Einstein explained that light energy is quantised. Increasing intensity adds more photons (more electrons) but only higher frequency gives each electron more energy — evidence energy is quantised, not continuous.",
              formulas: [
                { name: "Photon energy", plain: "E = h·f", desc: "h = 6.626×10⁻³⁴ J·s." },
                { name: "Photoelectric", plain: "KE_max = h·f − φ", desc: "φ = work function." },
                { name: "de Broglie", plain: "λ = h / p", desc: "Matter has a wavelength." },
              ],
              keyPoints: [
                "Energy is quantised in packets of h·f.",
                "Below the threshold frequency, no electrons escape.",
                "Matter also has a wavelength (de Broglie).",
              ],
            },
            {
              id: "duality",
              title: "Wave–Particle Duality",
              level: "Core",
              definition:
                "Quantum objects behave as both waves and particles depending on how they are measured.",
              explanation:
                "Electrons fired one at a time through a double slit still build an interference pattern — each travels as a probability wave, yet lands as a single particle. Observing which slit destroys the pattern.",
              formulas: [
                { name: "de Broglie", plain: "λ = h / (m·v)", desc: "Wavelength of matter." },
              ],
              keyPoints: [
                "Particles interfere with themselves.",
                "Measurement collapses the wave behaviour.",
                "Duality is fundamental, not a limit of our tools.",
              ],
              viz: "interference",
            },
          ],
        },
        {
          id: "quantum-mechanics",
          name: "Quantum Mechanics",
          summary: "Wavefunctions, uncertainty and quantised energy.",
          lessons: [
            {
              id: "uncertainty",
              title: "Heisenberg's Uncertainty Principle",
              level: "Core",
              definition:
                "You cannot simultaneously know a particle's exact position and momentum; the more precisely one is known, the less precisely the other can be.",
              explanation:
                "This is not a measurement flaw but a fundamental property of quantum systems described by wavefunctions. A localised particle requires a broad spread of momenta.",
              formulas: [
                { name: "Position–momentum", plain: "Δx·Δp ≥ ℏ/2", desc: "ℏ = h/2π." },
                { name: "Energy–time", plain: "ΔE·Δt ≥ ℏ/2", desc: "Energy uncertainty over time." },
              ],
              keyPoints: [
                "A fundamental trade-off, not experimental error.",
                "Explains zero-point energy and tunnelling.",
                "Position and momentum are complementary.",
              ],
            },
            {
              id: "schrodinger",
              title: "The Schrödinger Equation & Particle in a Box",
              level: "Advanced",
              definition:
                "The Schrödinger equation governs how a quantum wavefunction evolves. |ψ|² gives the probability of finding a particle.",
              explanation:
                "Confining a particle (a 'box') forces standing-wave solutions with quantised, discrete energy levels — just like a guitar string. This quantisation underlies atomic energy levels and chemistry.",
              formulas: [
                { name: "Time-dependent", plain: "iℏ ∂ψ/∂t = Ĥψ", desc: "Evolution of the wavefunction." },
                { name: "Box energies", plain: "Eₙ = n²·h² / (8·m·L²)", desc: "Quantised levels, n = 1, 2, …" },
                { name: "Probability", plain: "P = ∫|ψ|² dx", desc: "Born rule." },
              ],
              keyPoints: [
                "Confinement quantises energy.",
                "|ψ|² is a probability density.",
                "Foundation of atomic and molecular structure.",
              ],
              viz: "quantumbox",
            },
          ],
        },
      ],
    },
    {
      id: "relativity",
      name: "Relativity",
      icon: "🌌",
      blurb: "Einstein's reshaping of space, time, mass and gravity.",
      topics: [
        {
          id: "special-relativity",
          name: "Special Relativity",
          summary: "Constant light speed, time dilation and E = mc².",
          lessons: [
            {
              id: "special-rel",
              title: "Special Relativity",
              level: "Advanced",
              definition:
                "The laws of physics are the same in all inertial frames and the speed of light is constant for all observers. Consequences: moving clocks run slow and moving lengths contract.",
              explanation:
                "Because light speed is invariant, simultaneity, time and length become relative. Mass and energy are equivalent, unified in E = mc².",
              formulas: [
                { name: "Lorentz factor", plain: "γ = 1/√(1 − v²/c²)", desc: "Grows as v → c." },
                { name: "Time dilation", plain: "Δt' = γ·Δt", desc: "Moving clocks run slow." },
                { name: "Mass–energy", plain: "E = m·c²", desc: "Energy of mass at rest." },
              ],
              keyPoints: [
                "Nothing with mass reaches light speed.",
                "Time and space are observer-dependent.",
                "Mass is a form of energy.",
              ],
            },
          ],
        },
        {
          id: "general-relativity",
          name: "General Relativity",
          summary: "Gravity as the curvature of spacetime.",
          lessons: [
            {
              id: "general-rel",
              title: "General Relativity",
              level: "Advanced",
              definition:
                "Gravity is not a force but the curvature of spacetime caused by mass and energy. Objects follow the straightest possible paths (geodesics) through curved spacetime.",
              explanation:
                "Mass tells spacetime how to curve; spacetime tells matter how to move. Predictions include gravitational lensing, black holes, time running slower in gravity, and gravitational waves.",
              formulas: [
                { name: "Field equation", plain: "Gμν = 8πG/c⁴ · Tμν", desc: "Curvature ↔ energy." },
                { name: "Schwarzschild radius", plain: "r_s = 2GM/c²", desc: "Event horizon size." },
              ],
              keyPoints: [
                "Free fall is motion along geodesics.",
                "Confirmed by lensing and gravitational waves.",
                "Predicts black holes and cosmic expansion.",
              ],
            },
          ],
        },
      ],
    },
  ],
};
