import React, { useState } from 'react';
import { IsopsephyCalculator } from './components/IsopsephyCalculator';
import emblemLogo from './assets/images/ego_eimi_logo_1788939371013.jpg';
import { Calculator, BookOpen, Shield } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0907] text-[#f5ecd8] flex flex-col justify-between selection:bg-[#ffd700]/30 selection:text-[#ffd700]">
      {/* Top Navbar */}
      <header className="border-b border-[#241d15] bg-[#120f0c]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#ffd700]/60 shadow-sm bg-black shrink-0">
              <img src={emblemLogo} alt="ΕΓΩ ΕΙΜΙ" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#f5ecd8] leading-tight">
                Λεξάριθμος &amp; Ισοψηφία
              </div>
              <div className="text-[10px] font-mono text-[#a69680]">
                ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — ΕΓΩ ΕΙΜΙ
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#201811] border border-[#3e2e1d] text-[#ffd700]">
              Αρχαία Ιωνική Αρίθμηση
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
