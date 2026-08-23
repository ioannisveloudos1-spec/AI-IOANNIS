import React, { useState } from "react";
import portalImage from "../assets/images/lavrion_gate_portal_1787490335273.jpg";
import { Sparkles, ArrowRight } from "lucide-react";

interface PortalGateIntroProps {
  onEnter: () => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

export const PortalGateIntro: React.FC<PortalGateIntroProps> = ({
  onEnter,
}) => {
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const handleEnterClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  return (
    <div
      id="portal-gate-overlay"
      onClick={handleEnterClick}
      className={`fixed inset-0 z-50 flex flex-col justify-end bg-black text-center overflow-hidden transition-all duration-500 select-none cursor-pointer ${
        isOpening ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Fullscreen Adaptive Image */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
        <img
          src={portalImage}
          alt="ΛΑΥΡΕΙΟΝ - Ακολουθα το Φως Διασχιζοντας το Σκοτος"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover sm:object-contain object-center"
        />
        {/* Subtle Bottom Gradient to seamlessly blend with text and button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Floating Area: Inscription & Ancient Stone Button */}
      <div 
        className="relative z-10 w-full max-w-lg mx-auto px-4 pb-8 sm:pb-10 pt-12 flex flex-col items-center gap-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mystical Inscription */}
        <p className="text-xs sm:text-sm font-serif italic text-[#f0cf7e] tracking-wide max-w-md leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          «ΘΑ ΕΙΣΕΛΘΕΙΣ; Η ΕΙΣΟΔΟΣ ΕΝΤΟΣ ΣΟΥ ΕΊΝΑΙ Η ΕΞΟΔΟΣ ΑΠΟ ΤΟΝ ΚΟΣΜΟ ΤΟΥ ΨΕΥΔΟΥΣ.. ΑΛΗΘΕΙΑ»
        </p>

        {/* Ancient Stone Button: ΒΕΛΟΣ + ΟΥΔΟΣ */}
        <button
          id="btn-velos-oudos"
          type="button"
          onClick={handleEnterClick}
          className="group relative w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-gradient-to-b from-[#2a2015] via-[#1a140d] to-[#0d0a07] border-2 border-[#c89b3c] hover:border-[#f3d38c] text-[#f5ecd8] shadow-[0_0_30px_rgba(200,155,60,0.5)] hover:shadow-[0_0_50px_rgba(200,155,60,0.8)] transition-all transform active:scale-95 flex items-center justify-center gap-3"
        >
          <Sparkles className="w-4 h-4 text-[#e6c670] animate-pulse shrink-0" />
          <span className="text-lg sm:text-xl font-serif font-black tracking-[0.2em] text-[#fff3d1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            ΒΕΛΟΣ + ΟΥΔΟΣ
          </span>
          <ArrowRight className="w-4 h-4 text-[#e6c670] group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
};

