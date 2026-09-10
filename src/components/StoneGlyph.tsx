import React from "react";

interface StoneGlyphProps {
  id: string;
  className?: string;
  size?: number; // size in px, default 120
}

/**
 * Custom stone tablet glyph renderer for authentic ancient epigraphic symbols
 * Rendered with carved stone textures, beveled engravings, chiseled gold-sand inner relief
 */
export const StoneGlyph: React.FC<StoneGlyphProps> = ({ id, className = "", size = 120 }) => {
  const renderGlyphPath = () => {
    switch (id) {
      // 1. Δίγαμμα / Βαυ (Ϝ) - Two gammas joined / Archaic F-like
      case "digamma-wau":
        return (
          <g>
            {/* Vertical stem */}
            <line x1="38" y1="24" x2="38" y2="76" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            {/* Top horizontal arm */}
            <line x1="38" y1="27" x2="68" y2="27" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            {/* Middle horizontal arm */}
            <line x1="38" y1="46" x2="63" y2="46" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            {/* Subtle serif marks */}
            <line x1="33" y1="76" x2="43" y2="76" stroke="currentColor" strokeWidth="3" />
            <line x1="68" y1="24" x2="68" y2="30" stroke="currentColor" strokeWidth="3" />
            <line x1="63" y1="43" x2="63" y2="49" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      // 2. Στίγμα (Ϛ) - Byzantine ligature of Sigma + Tau (ϛ / Ϛ)
      case "stigma":
        return (
          <g>
            <path
              d="M 64 28 C 52 24 38 28 38 40 C 38 52 64 48 64 64 C 64 74 52 78 38 74 M 64 54 C 68 64 62 76 46 78 C 36 78 32 72 32 68"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            {/* Top bar crossing */}
            <line x1="42" y1="27" x2="66" y2="27" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
            {/* Lower descending tail */}
            <path d="M 50 68 Q 54 82 46 86" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        );

      // 3. Αρχαϊκό Κόππα (Ϙ) - Circle with central vertical line
      case "archaic-koppa":
        return (
          <g>
            {/* Outer Circle */}
            <circle cx="50" cy="42" r="20" fill="none" stroke="currentColor" strokeWidth="6" />
            {/* Central Vertical Line extending downward */}
            <line x1="50" y1="22" x2="50" y2="78" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            <line x1="44" y1="78" x2="56" y2="78" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      // 4. Αριθμητικό Κόππα (Ϟ) - Numeric Lightning Koppa
      case "numeric-koppa":
        return (
          <g>
            <path
              d="M 38 26 L 62 26 L 44 48 L 62 48 L 44 76"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 5. Αρχαϊκό Σαμπί / Δισίγμα (Ͳ) - T-shape with tilted upright wings
      case "archaic-sampi":
        return (
          <g>
            {/* Central vertical stem */}
            <line x1="50" y1="24" x2="50" y2="76" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            {/* Diagonal left arm */}
            <line x1="50" y1="36" x2="28" y2="26" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Diagonal right arm */}
            <line x1="50" y1="36" x2="72" y2="26" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Base serif */}
            <line x1="42" y1="76" x2="58" y2="76" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      // 6. Κλασικό Σαμπί (Ϡ) - Classic 900 Sampi Pi-form with central stroke
      case "classic-sampi":
        return (
          <g>
            {/* Tilted top bar */}
            <line x1="30" y1="34" x2="70" y2="24" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            {/* Left leg */}
            <line x1="38" y1="32" x2="32" y2="74" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Middle diagonal leg */}
            <line x1="50" y1="29" x2="48" y2="74" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Right leg */}
            <line x1="64" y1="25" x2="62" y2="62" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
          </g>
        );

      // 7. Σαν (Ϻ) - Doric San (looks like M or symmetrical trident)
      case "san":
        return (
          <g>
            <path
              d="M 30 74 L 30 26 L 50 56 L 70 26 L 70 74"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 8. Ήτα Δασύ (Ͱ) - Archaic Closed / Half Heta (Tack/Ladder form)
      case "heta":
        return (
          <g>
            {/* Left vertical */}
            <line x1="34" y1="24" x2="34" y2="76" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            {/* Top horizontal */}
            <line x1="34" y1="24" x2="66" y2="24" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            {/* Middle crossbar */}
            <line x1="34" y1="50" x2="66" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            {/* Right vertical (half or full) */}
            <line x1="66" y1="24" x2="66" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
          </g>
        );

      // 9. Γιωτ (Ϳ) - Archaic Yot / Hooked Iota
      case "yot":
        return (
          <g>
            {/* Straight vertical entering into bottom hook */}
            <path
              d="M 54 24 L 54 62 C 54 74 44 76 34 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="6.5"
              strokeLinecap="square"
            />
            {/* Top serif */}
            <line x1="46" y1="24" x2="62" y2="24" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
          </g>
        );

      // 10. Αρκαδικό Τσε (Ͷ) - Arcadian Tsé (like Cyrillic И / mirrored N with hook)
      case "arcadian-tse":
        return (
          <g>
            <line x1="34" y1="24" x2="34" y2="76" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            <line x1="66" y1="24" x2="66" y2="76" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            <line x1="34" y1="76" x2="66" y2="24" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
          </g>
        );

      // 11. Ακροφωνικό 1 - Μονάς (Ι)
      case "acro-1":
        return (
          <g>
            <line x1="50" y1="22" x2="50" y2="78" stroke="currentColor" strokeWidth="7" strokeLinecap="square" />
            <line x1="42" y1="22" x2="58" y2="22" stroke="currentColor" strokeWidth="3" />
            <line x1="42" y1="78" x2="58" y2="78" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      // 12. Ακροφωνικό 5 - Πέντε (𐅂 / Π με κοντό δεξί σκέλος)
      case "acro-5":
        return (
          <g>
            {/* Top bar */}
            <line x1="32" y1="24" x2="68" y2="24" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            {/* Left long leg */}
            <line x1="34" y1="24" x2="34" y2="76" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            {/* Right short leg (Archaic Attic Pente) */}
            <line x1="66" y1="24" x2="66" y2="50" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
          </g>
        );

      // 13. Ακροφωνικό 10 - Δέκα (Δ)
      case "acro-10":
        return (
          <g>
            <polygon
              points="50,22 26,76 74,76"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 14. Ακροφωνικό 50 - Πεντήκοντα (𐅄 / Π με Δ μέσα)
      case "acro-50":
        return (
          <g>
            {/* Outer Pente */}
            <line x1="28" y1="22" x2="72" y2="22" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="30" y1="22" x2="30" y2="78" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="70" y1="22" x2="70" y2="52" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Inner Delta */}
            <polygon
              points="50,40 38,68 62,68"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 15. Ακροφωνικό 100 - Εκατόν (Η / ͰΕΚΑΤΟΝ)
      case "acro-100":
        return (
          <g>
            <line x1="32" y1="22" x2="32" y2="78" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            <line x1="68" y1="22" x2="68" y2="78" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            <line x1="32" y1="50" x2="68" y2="50" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
          </g>
        );

      // 16. Ακροφωνικό 500 - Πεντακόσια (𐅅 / Π με Η μέσα)
      case "acro-500":
        return (
          <g>
            {/* Outer Pente */}
            <line x1="26" y1="20" x2="74" y2="20" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="28" y1="20" x2="28" y2="80" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="72" y1="20" x2="72" y2="52" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Inner Heta (H) */}
            <line x1="42" y1="38" x2="42" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <line x1="58" y1="38" x2="58" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <line x1="42" y1="53" x2="58" y2="53" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
          </g>
        );

      // 17. Ακροφωνικό 1.000 - Χίλιοι (Χ)
      case "acro-1000":
        return (
          <g>
            <line x1="28" y1="24" x2="72" y2="76" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            <line x1="72" y1="24" x2="28" y2="76" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />
            {/* Serifs */}
            <line x1="24" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="3" />
            <line x1="68" y1="24" x2="76" y2="24" stroke="currentColor" strokeWidth="3" />
            <line x1="24" y1="76" x2="32" y2="76" stroke="currentColor" strokeWidth="3" />
            <line x1="68" y1="76" x2="76" y2="76" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      // 18. Ακροφωνικό 5.000 - Πεντακισχίλιοι (𐅆 / Π με Χ μέσα)
      case "acro-5000":
        return (
          <g>
            {/* Outer Pente */}
            <line x1="26" y1="20" x2="74" y2="20" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="28" y1="20" x2="28" y2="80" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="72" y1="20" x2="72" y2="52" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Inner Chi (X) */}
            <line x1="40" y1="38" x2="60" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <line x1="60" y1="38" x2="40" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
          </g>
        );

      // 19. Ακροφωνικό 10.000 - Μύριοι (Μ)
      case "acro-10000":
        return (
          <g>
            <path
              d="M 28 76 L 28 24 L 50 54 L 72 24 L 72 76"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 20. Ακροφωνικό 50.000 - Πεντακισμύριοι (𐅇 / Π με Μ μέσα)
      case "acro-50000":
        return (
          <g>
            {/* Outer Pente */}
            <line x1="24" y1="18" x2="76" y2="18" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="26" y1="18" x2="26" y2="82" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="74" y1="18" x2="74" y2="52" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            {/* Inner Mu (M) */}
            <path
              d="M 38 68 L 38 38 L 50 56 L 62 38 L 62 68"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 21. Τρισκέλιον / Τρισκελές (Triskelion)
      case "triskelion":
        return (
          <g transform="translate(50,50)">
            {/* Central hub */}
            <circle cx="0" cy="0" r="4" fill="currentColor" />
            {/* 3 bent spiraling legs at 0, 120, 240 deg */}
            {[0, 120, 240].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle})`}>
                <path
                  d="M 0 0 C 8 -12 24 -16 26 -2 C 28 10 16 24 30 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx="30" cy="28" r="3" fill="currentColor" />
              </g>
            ))}
          </g>
        );

      // 22. Κόμπος Ηρακλέους / Λημνίσκος (Herakles Knot - ∞)
      case "herakles-knot":
        return (
          <g>
            {/* Lemniscate / Infinity knot */}
            <path
              d="M 50 50 C 35 30 18 32 18 50 C 18 68 35 70 50 50 C 65 30 82 32 82 50 C 82 68 65 70 50 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            {/* Central interlacing highlight band */}
            <path
              d="M 44 42 L 56 58"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <circle cx="28" cy="50" r="3.5" fill="currentColor" />
            <circle cx="72" cy="50" r="3.5" fill="currentColor" />
          </g>
        );

      // 23. Μαίανδρος / Ελληνική Σπείρα (Meander)
      case "meander":
        return (
          <g>
            <path
              d="M 20 70 L 20 30 L 80 30 L 80 70 L 40 70 L 40 46 L 66 46 L 66 58 L 54 58"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </g>
        );

      // 24. Το Δελφικό «ΕΙ» (Delphic EI)
      case "delphic-ei":
        return (
          <g>
            {/* Letter E (Epsilon) */}
            <line x1="24" y1="26" x2="24" y2="74" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            <line x1="24" y1="26" x2="48" y2="26" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            <line x1="24" y1="50" x2="44" y2="50" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
            <line x1="24" y1="74" x2="48" y2="74" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />

            {/* Letter I (Iota) */}
            <line x1="68" y1="26" x2="68" y2="74" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
            <line x1="60" y1="26" x2="76" y2="26" stroke="currentColor" strokeWidth="3" />
            <line x1="60" y1="74" x2="76" y2="74" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      // 25. Πυθαγόρεια Τετρακτύς (Tetractys - 10 dots in 4 tiers forming equilateral triangle)
      case "tetractys":
        return (
          <g>
            {/* Tier 1: 1 dot */}
            <circle cx="50" cy="22" r="5" fill="currentColor" />
            
            {/* Tier 2: 2 dots */}
            <circle cx="40" cy="38" r="5" fill="currentColor" />
            <circle cx="60" cy="38" r="5" fill="currentColor" />
            
            {/* Tier 3: 3 dots */}
            <circle cx="30" cy="54" r="5" fill="currentColor" />
            <circle cx="50" cy="54" r="5" fill="currentColor" />
            <circle cx="70" cy="54" r="5" fill="currentColor" />
            
            {/* Tier 4: 4 dots */}
            <circle cx="20" cy="70" r="5" fill="currentColor" />
            <circle cx="40" cy="70" r="5" fill="currentColor" />
            <circle cx="60" cy="70" r="5" fill="currentColor" />
            <circle cx="80" cy="70" r="5" fill="currentColor" />

            {/* Faint triangle outline */}
            <polygon points="50,14 10,76 90,76" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          </g>
        );

      // 26. Ουροβόρος Όφις (Ouroboros)
      case "ouroboros":
        return (
          <g transform="translate(50,50)">
            {/* Serpent body forming a circle */}
            <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="6.5" strokeDasharray="5 2" />
            {/* Serpent Head biting tail at top */}
            <path
              d="M -6 -30 C -2 -34 6 -34 10 -30 L 2 -25 Z"
              fill="currentColor"
            />
            {/* Eye */}
            <circle cx="2" cy="-31" r="1.5" fill="#120d09" />
            {/* Tail tapering into mouth */}
            <path d="M -12 -30 C -8 -31 -4 -30 0 -29" stroke="currentColor" strokeWidth="3" />
          </g>
        );

      default:
        return (
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fontSize="42"
            fontFamily="serif"
            fontWeight="bold"
            fill="currentColor"
          >
            ?
          </text>
        );
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Stone Tablet Texture & Bevel Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d2e1e] via-[#241a10] to-[#120d07] border-2 border-[#5a4228] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-3px_6px_rgba(0,0,0,0.8)] rounded-2xl" />

      {/* Rough Chiseled Stone Cracks & Texture Overlay */}
      <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

      {/* Engraved Sunken Bevel Frame */}
      <div className="absolute inset-2 rounded-xl border border-[#1a120b] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.9),inset_-1px_-1px_3px_rgba(200,155,60,0.2)] bg-[#17110a]/90" />

      {/* Deep Incised Glyph SVG with Golden Sand / Shadow Relief */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full p-2.5 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Deep Carved Shadow Filter */}
          <filter id={`carve-shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.95" />
            <feDropShadow dx="-1" dy="-1" stdDeviation="0.8" floodColor="#ffe082" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Primary Incised Chiseled Stroke */}
        <g
          filter={`url(#carve-shadow-${id})`}
          className="text-[#e6c670] group-hover:text-[#ffd700] transition-colors"
        >
          {renderGlyphPath()}
        </g>
      </svg>

      {/* Corner Stone Rivets/Marks */}
      <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#100b07] border border-[#52391e]" />
      <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#100b07] border border-[#52391e]" />
      <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-[#100b07] border border-[#52391e]" />
      <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#100b07] border border-[#52391e]" />
    </div>
  );
};
