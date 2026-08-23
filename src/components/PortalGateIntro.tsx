import React, { useState, useRef } from "react";
import portalImage from "../assets/images/lavrion_oudos_gate_1787492688641.jpg";
import { ArrowRight, Music, Check, Upload } from "lucide-react";
import { playPortalSound, getSavedPortalAudio, savePortalAudio } from "../utils/portalAudio";

interface PortalGateIntroProps {
  onEnter: () => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

export const PortalGateIntro: React.FC<PortalGateIntroProps> = ({
  onEnter,
}) => {
  // Animation phases: 'idle' | 'pressed' | 'metamorphosis' | 'dissolving'
  const [phase, setPhase] = useState<"idle" | "pressed" | "metamorphosis" | "dissolving">("idle");
  const [hasCustomAudio, setHasCustomAudio] = useState<boolean>(() => !!getSavedPortalAudio());
  const [audioStatusMsg, setAudioStatusMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnterClick = () => {
    if (phase !== "idle") return;

    // 1. Play real Suno audio immediately on click
    playPortalSound();

    // 2. Soft mechanical 3D button press
    setPhase("pressed");

    // 3. Smooth, gradual dreamlike flight into the tunnel and light bloom
    setTimeout(() => {
      setPhase("metamorphosis");
    }, 180);

    // 4. Soft ethereal dissolving into the main application
    setTimeout(() => {
      setPhase("dissolving");
    }, 2400);

    // 5. Final transition complete
    setTimeout(() => {
      onEnter();
    }, 3100);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        savePortalAudio(dataUrl);
        setHasCustomAudio(true);
        setAudioStatusMsg("Ο ήχος Suno αποθηκεύτηκε επιτυχώς!");
        setTimeout(() => setAudioStatusMsg(""), 3500);
        // Play short preview
        const preview = new Audio(dataUrl);
        preview.volume = 0.9;
        preview.play().catch(() => {});
      }
    };
    reader.readAsDataURL(file);
  };

  const isTransitioning = phase !== "idle";

  return (
    <div
      id="portal-gate-overlay"
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-black text-center overflow-hidden select-none transition-opacity duration-700 ${
        phase === "dissolving" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Fullscreen 9:16 Tunnel with Dynamic Dreamlike Metamorphosis Zoom */}
      <div 
        className={`absolute inset-0 w-full h-full flex items-center justify-center bg-black transition-all ${
          phase === "metamorphosis" || phase === "dissolving"
            ? "duration-[2600ms] ease-[cubic-bezier(0.25,1,0.5,1)] scale-[3.6] blur-[0.6px]"
            : "duration-500 scale-100 blur-0"
        }`}
        style={{
          transformOrigin: "50% 52%", // Centered directly into the radiant temple portal doorway
        }}
      >
        <img
          src={portalImage}
          alt="ΛΑΥΡΕΙΟΝ - ΟΥΔΟΣ: ΑΠΟ ΤΟ ΣΚΟΤΟΣ ΣΤΟ ΦΩΣ"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Top and Bottom atmospheric vignettes */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-black/95 transition-opacity duration-1000 ${
            isTransitioning ? "opacity-20" : "opacity-100"
          }`} 
        />
      </div>

      {/* Dreamlike Radiant Golden Light Bloom - Expands softly like a celestial dawn */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-[2400ms] ease-[cubic-bezier(0.33,1,0.68,1)] flex items-center justify-center ${
          phase === "metamorphosis" || phase === "dissolving"
            ? "opacity-90 scale-125"
            : "opacity-0 scale-50"
        }`}
        style={{
          background: "radial-gradient(circle at 50% 52%, rgba(255,250,225,0.95) 0%, rgba(255,223,128,0.75) 25%, rgba(212,175,55,0.45) 55%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* Top Header: Deeply Carved Inscription ΛΑΥΡΕΙΟΝ */}
      <div 
        className={`relative z-10 w-full pt-8 sm:pt-10 px-4 flex flex-col items-center transition-all duration-700 ${
          isTransitioning ? "opacity-0 -translate-y-6 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.25em] text-[#e6c670] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] uppercase"
          style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(200,155,60,0.4), 0 -1px 2px rgba(255,255,255,0.2)"
          }}
        >
          ΛΑΥΡΕΙΟΝ
        </h1>
        <div className="mt-1 text-[11px] sm:text-xs font-mono tracking-[0.2em] text-[#c89b3c] drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
          ΟΥΔΟΣ • ΑΠΟ ΤΟ ΣΚΟΤΟΣ ΠΡΟΣ ΤΟ ΦΩΣ
        </div>
      </div>

      {/* Bottom Floating Area: Inscription & 3D Mechanical Button */}
      <div 
        className={`relative z-10 w-full max-w-lg mx-auto px-4 pb-8 sm:pb-10 pt-4 flex flex-col items-center gap-3 transition-all duration-700 ${
          isTransitioning ? "opacity-0 translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Mystical Inscription */}
        <p className="text-xs sm:text-sm font-serif italic text-[#f0cf7e] tracking-wide max-w-md leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
          «ΘΑ ΕΙΣΕΛΘΕΙΣ; Η ΕΙΣΟΔΟΣ ΕΝΤΟΣ ΣΟΥ ΕΊΝΑΙ Η ΕΞΟΔΟΣ ΑΠΟ ΤΟΝ ΚΟΣΜΟ ΤΟΥ ΨΕΥΔΟΥΣ.. ΑΛΗΘΕΙΑ»
        </p>

        {/* Outer 3D Stone Recess / Socket for Mechanism */}
        <div className="w-full sm:w-auto p-1.5 rounded-2xl bg-gradient-to-b from-[#120e0a] to-[#251b11] border border-[#423321] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_8px_20px_rgba(0,0,0,0.8)]">
          {/* 3D Embossed Mechanical Push Button */}
          <button
            id="btn-velos-oudos"
            type="button"
            onClick={handleEnterClick}
            disabled={isTransitioning}
            className={`group relative w-full sm:w-auto px-8 sm:px-14 py-4 rounded-xl font-serif font-black transition-all cursor-pointer select-none flex items-center justify-center gap-3.5
              bg-gradient-to-b from-[#3a2c1b] via-[#241a10] to-[#120c07]
              border-t-2 border-l-2 border-r-2 border-[#d6a94f]
              border-b-[6px] border-b-[#523b1e]
              shadow-[0_12px_28px_rgba(0,0,0,0.9),0_0_30px_rgba(200,155,60,0.4)]
              hover:shadow-[0_14px_35px_rgba(0,0,0,0.95),0_0_45px_rgba(230,198,112,0.6)]
              hover:border-t-[#ffe082]
              active:translate-y-[4px] active:border-b-[2px] active:shadow-[0_2px_8px_rgba(0,0,0,0.9),inset_0_4px_12px_rgba(0,0,0,0.8)]
              ${phase === "pressed" ? "translate-y-[5px] border-b-[2px] shadow-[inset_0_6px_16px_rgba(0,0,0,0.95)]" : ""}
            `}
          >
            {/* Top metallic reflection bevel */}
            <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#fff3d1]/80 to-transparent rounded-t" />

            {/* Embossed Diamond Relief Text: ΒΕΛΟΣ + ΟΥΔΟΣ */}
            <span 
              className="text-lg sm:text-2xl font-serif font-black tracking-[0.22em] text-transparent bg-clip-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)] transition-all"
              style={{
                backgroundImage: "linear-gradient(135deg, #ffffff 0%, #d8ecf8 22%, #fff3b0 45%, #ffffff 60%, #e2d9f3 78%, #fff8db 100%)",
                filter: "drop-shadow(1px 1px 0px rgba(255,255,255,0.7)) drop-shadow(-1px -1px 0px rgba(60,40,15,0.9)) drop-shadow(0px 0px 10px rgba(255,240,180,0.8))",
                WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.4)",
              }}
            >
              ΒΕΛΟΣ + ΟΥΔΟΣ
            </span>

            {/* Diamond Crystal Arrow */}
            <ArrowRight 
              className="w-5 h-5 text-[#fff2be] group-hover:translate-x-1.5 transition-transform shrink-0" 
              style={{
                filter: "drop-shadow(0 0 6px rgba(255,240,170,0.9))"
              }}
            />
          </button>
        </div>

        {/* Audio File Input with direct test button */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="audio/*,.mp3,.wav,.m4a,.ogg" 
          onChange={handleAudioUpload} 
          className="hidden" 
        />

        {/* Audio Status & Controls */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-sans text-[#f0cf7e] hover:text-white transition-colors py-1.5 px-3.5 rounded-full bg-[#1e150d] hover:bg-[#2e2114] border border-[#8a6828] shadow-md cursor-pointer active:scale-95"
            >
              {hasCustomAudio ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ήχος Suno ενεργός (αλλαγή αρχείου)</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-[#e6c670] shrink-0" />
                  <span>Φόρτωση αρχείου ήχου Suno (.mp3)</span>
                </>
              )}
            </button>

            {hasCustomAudio && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playPortalSound();
                }}
                className="flex items-center gap-1 text-xs font-sans text-[#e6c670] hover:text-white transition-colors py-1.5 px-3 rounded-full bg-black/60 hover:bg-black/90 border border-[#8a6828]/70 cursor-pointer active:scale-95"
                title="Δοκιμή ήχου"
              >
                <Music className="w-3 h-3 text-emerald-400" />
                <span>Δοκιμή</span>
              </button>
            )}
          </div>

          {audioStatusMsg && (
            <p className="text-xs text-emerald-400 font-sans font-medium animate-fade-in bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30">
              {audioStatusMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};



