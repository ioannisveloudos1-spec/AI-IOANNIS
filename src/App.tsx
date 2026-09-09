import React from 'react';
import { IsopsephyCalculator } from './components/IsopsephyCalculator';
import emblemLogo from './assets/images/ego_eimi_logo_1788939371013.jpg';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0907] text-[#f5ecd8] flex flex-col justify-between selection:bg-[#ffd700]/30 selection:text-[#ffd700]">
      {/* Top Dominant Logo Header - Centered & Wide across screen */}
      <header className="border-b border-[#2e2316] bg-gradient-to-b from-[#140f0a] via-[#100c08] to-[#0b0907] relative overflow-hidden py-4 sm:py-6 px-2 sm:px-4 shadow-2xl">
        {/* Ambient golden aura behind logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 sm:h-80 bg-[#ffd700]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-10 space-y-3 sm:space-y-4">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b150f] border border-[#ffd700]/40 text-[#ffd700] text-[11px] sm:text-xs font-mono uppercase tracking-widest shadow-md">
            <span>✦</span>
            <span>ΑΡΧΑΙΑ ΕΛΛΗΝΙΚΗ ΙΣΟΨΗΦΙΑ &amp; ΛΕΞΑΡΙΘΜΟΙ</span>
            <span>✦</span>
          </div>

          {/* Large, centered, prominent logo - spans wide on mobile & PC */}
          <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-1 sm:px-2">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-[0_0_45px_rgba(212,175,55,0.22)] bg-[#0c0907] p-2 sm:p-4">
              <img
                src={emblemLogo}
                alt="ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — ΕΓΩ ΕΙΜΙ"
                className="w-full h-auto max-h-[360px] sm:max-h-[460px] md:max-h-[540px] object-contain mx-auto rounded-xl"
              />
            </div>
          </div>

          {/* Under Logo Classical Titles */}
          <div className="space-y-1.5 pt-1 max-w-2xl mx-auto px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#f8f1e3] tracking-wide uppercase">
              ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ
            </h1>
            <div className="text-lg sm:text-xl md:text-2xl font-serif font-black text-[#ffd700] tracking-widest">
              ΕΓΩ ΕΙΜΙ
            </div>
            <div className="space-y-1 pt-1 font-serif text-[#b8a791]">
              <p className="text-xs sm:text-sm font-medium tracking-wide">
                Αρχαία Ιωνική Αρίθμηση (27 Ιερά Σύμβολα)
              </p>
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#a69680]">
                Πυθαγόρεια Αριθμητική Παράδοση
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-4 sm:py-6">
        <IsopsephyCalculator />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#221a13] bg-[#0e0c09] py-4 px-4 text-center text-xs font-serif text-[#786b5b]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — «ΕΓΩ ΕΙΜΙ» • Αρχαία Ελληνική Ισοψηφία</span>
          <span className="font-mono text-[11px] text-[#9c8b74]">Αρχαία Ιωνική &amp; Πυθαγόρεια Αριθμητική Παράδοση</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
