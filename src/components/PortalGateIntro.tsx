import React, { useState, useEffect, useRef } from "react";
import portalImage from "../assets/images/lavrion_portal_exact_1787777926189.jpg";
import stoneRockButtonImage from "../assets/images/rock_oudos_cave_light_1788091017852.jpg";
import { Music, Upload, Check, FastForward } from "lucide-react";
import {
  checkServerAudioStatus,
  getLocalAudioBlob,
  uploadAudioToServer,
  createAudioSourceUrl,
} from "../utils/mobileAudioStorage";

interface PortalGateIntroProps {
  onEnter: () => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

export const PortalGateIntro: React.FC<PortalGateIntroProps> = ({ onEnter }) => {
  // Animation phases: 'idle' | 'playing' | 'pressed' | 'metamorphosis' | 'dissolving'
  const [phase, setPhase] = useState<"idle" | "playing" | "pressed" | "metamorphosis" | "dissolving">("idle");
  
  // Audio state
  const [hasCustomAudio, setHasCustomAudio] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<{ current: number; duration: number }>({
    current: 0,
    duration: 0,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check if audio exists on server or local IndexedDB
  useEffect(() => {
    let isMounted = true;
    async function checkAudio() {
      const local = await getLocalAudioBlob();
      if (local && isMounted) {
        setHasCustomAudio(true);
        return;
      }
      const serverExists = await checkServerAudioStatus();
      if (serverExists && isMounted) {
        setHasCustomAudio(true);
      }
    }
    checkAudio();
    return () => {
      isMounted = false;
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
    };
  }, []);

  const triggerEntranceSequence = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    setPhase("pressed");

    // Smooth flight through the tunnel into the radiant threshold
    setTimeout(() => {
      setPhase("metamorphosis");
    }, 150);

    // Ethereal dissolving into the main application
    setTimeout(() => {
      setPhase("dissolving");
    }, 1600);

    // Final transition complete
    setTimeout(() => {
      onEnter();
    }, 2200);
  };

  const handleButtonClick = async () => {
    if (phase !== "idle") return;

    if (hasCustomAudio) {
      setPhase("playing");
      try {
        const audioUrl = await createAudioSourceUrl();
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;
        audio.volume = 1.0;

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration)) {
            setAudioProgress({ current: audio.currentTime, duration: audio.duration });
          }
        };

        audio.onended = () => {
          triggerEntranceSequence();
        };

        audio.onerror = (e) => {
          console.warn("Audio playback error, proceeding:", e);
          triggerEntranceSequence();
        };

        await audio.play();
      } catch (err) {
        console.warn("Audio play blocked or failed:", err);
        triggerEntranceSequence();
      }
    } else {
      // If no audio uploaded, enter smoothly
      triggerEntranceSequence();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const ok = await uploadAudioToServer(file);
      if (ok) {
        setHasCustomAudio(true);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isTransitioning = phase === "metamorphosis" || phase === "dissolving";
  const isPlaying = phase === "playing";

  const progressPercent = audioProgress.duration > 0
    ? Math.min(100, Math.round((audioProgress.current / audioProgress.duration) * 100))
    : 0;

  return (
    <div
      id="portal-gate-overlay"
      className={`fixed inset-0 w-full h-[100vh] h-[100dvh] max-h-[100dvh] z-50 flex flex-col justify-between bg-black text-center overflow-hidden select-none transition-opacity duration-700 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] ${
        phase === "dissolving" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ touchAction: "none" }}
    >
      {/* Hidden File Input for Native Mobile Audio Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Top Floating Utility Controls */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-4 sm:left-4 sm:right-4 z-30 flex items-center justify-between pointer-events-auto">
        {/* Mobile / Desktop Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isTransitioning}
          className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border text-[11px] sm:text-xs font-serif tracking-wider transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
            hasCustomAudio
              ? "bg-black/70 border-[#c89b3c]/50 text-[#e6c670] hover:bg-black/90 hover:border-[#c89b3c]"
              : "bg-[#251b11]/95 border-[#c89b3c] text-[#fff2be] shadow-[0_0_15px_rgba(200,155,60,0.5)] animate-pulse"
          }`}
          title="Επιλέξτε το δικό σας αρχείο MP3"
        >
          {isUploading ? (
            <>
              <div className="w-3 h-3 border-2 border-[#e6c670] border-t-transparent rounded-full animate-spin" />
              <span>Αποθήκευση...</span>
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">Αποθηκεύτηκε!</span>
            </>
          ) : (
            <>
              {hasCustomAudio ? <Music className="w-3.5 h-3.5 text-[#c89b3c]" /> : <Upload className="w-3.5 h-3.5 text-[#f0cf7e]" />}
              <span>{hasCustomAudio ? "Αλλαγή MP3" : "🎵 Φόρτωση MP3"}</span>
            </>
          )}
        </button>

        {/* Skip / Direct Enter Button */}
        <button
          type="button"
          onClick={triggerEntranceSequence}
          className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-[#c89b3c]/40 text-[#e6c670] text-[11px] sm:text-xs font-serif tracking-wider transition-all cursor-pointer backdrop-blur-sm flex items-center gap-1.5"
        >
          <span>{isPlaying ? "Παράλειψη" : "Άμεση Είσοδος"}</span>
          <FastForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Background Fullscreen Tunnel with Rock-Carved ΛΑΥΡΕΙΟΝ, Pillar Inscription ΙΑΝΕΥΣ and Dynamic Metamorphosis Zoom */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center bg-black transition-all ${
          phase === "metamorphosis" || phase === "dissolving"
            ? "duration-[2400ms] ease-[cubic-bezier(0.25,1,0.5,1)] scale-[3.6] blur-[0.5px]"
            : isPlaying
            ? "duration-[10000ms] scale-[1.08] blur-0"
            : "duration-500 scale-100 blur-0"
        }`}
        style={{
          transformOrigin: "50% 51%", // Directly focused on the light portal at the end of the rails
        }}
      >
        <div className="relative h-full w-auto aspect-[9/16] max-w-full flex items-center justify-center">
          <img
            src={portalImage}
            alt="ΛΑΥΡΕΙΟΝ - Χαραγμένο στον Βράχο - Ουδός προς το Φως"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center max-w-full max-h-full"
          />

          {/* Subtle vignette that does NOT darken the top rock-carved ΛΑΥΡΕΙΟΝ */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85 transition-opacity duration-1000 ${
              isTransitioning ? "opacity-10" : isPlaying ? "opacity-40" : "opacity-70"
            }`}
          />
        </div>
      </div>

      {/* Radiant Golden Light Bloom expanding from the cavern threshold */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all ${
          phase === "metamorphosis" || phase === "dissolving"
            ? "duration-[2200ms] opacity-95 scale-125"
            : isPlaying
            ? "duration-1000 opacity-60 scale-105 animate-pulse"
            : "duration-700 opacity-0 scale-50"
        } ease-[cubic-bezier(0.33,1,0.68,1)] flex items-center justify-center`}
        style={{
          background:
            "radial-gradient(circle at 50% 51%, rgba(255,250,225,0.95) 0%, rgba(255,223,128,0.75) 25%, rgba(212,175,55,0.45) 55%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* Top Spacer to leave the carved rock completely clear */}
      <div className="relative z-10 w-full pt-10 sm:pt-16 px-4 flex flex-col items-center pointer-events-none">
        {/* Intentionally left clear so the carved rock inscription ΛΑΥΡΕΙΟΝ is 100% visible */}
      </div>

      {/* Center Audio Visualizer (Active during playback) */}
      {isPlaying && (
        <div className="relative z-20 w-full max-w-sm mx-auto px-4 my-auto flex flex-col items-center gap-3 animate-fadeIn">
          <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-black/85 border border-[#c89b3c]/60 shadow-[0_0_30px_rgba(200,155,60,0.4)] backdrop-blur-md text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#e6c670] text-xs font-serif uppercase tracking-widest">
              <Music className="w-4 h-4 text-[#c89b3c] animate-bounce" />
              <span>ΑΝΑΠΑΡΑΓΩΓΗ ΗΧΟΥ</span>
            </div>

            {/* Audio Waveform Bars */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[40, 75, 55, 90, 100, 60, 85, 45, 95, 70, 50, 80].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#c89b3c] to-[#fff2be]"
                  style={{
                    height: `${Math.max(8, h * 0.35)}px`,
                    animation: `pulse 0.9s infinite ease-in-out ${i * 0.08}s`,
                  }}
                />
              ))}
            </div>

            {/* Timeline Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded-full bg-[#201812] border border-[#3d2b1a] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c89b3c] to-[#fff2be] transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#a69680]">
                <span>{Math.floor(audioProgress.current)}s</span>
                <span className="text-[#e6c670]">Αυθεντικό MP3</span>
                <span>{Math.floor(audioProgress.duration || 0)}s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isPlaying && <div className="flex-1" />}

      {/* Bottom Floating Area: Inscription & 3D Mechanical Button */}
      <div
        className={`relative z-10 w-full max-w-md mx-auto px-3.5 pb-4 sm:pb-8 pt-1 flex flex-col items-center gap-2.5 sm:gap-3.5 transition-all duration-700 ${
          isTransitioning ? "opacity-0 translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Mystical Inscription */}
        {!isPlaying && (
          <p className="text-[11px] sm:text-xs md:text-sm font-serif italic text-[#f0cf7e] tracking-wide max-w-md leading-tight sm:leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)] px-2">
            «ΘΑ ΕΙΣΕΛΘΕΙΣ; Η ΕΙΣΟΔΟΣ ΕΝΤΟΣ ΣΟΥ ΕΊΝΑΙ Η ΕΞΟΔΟΣ ΑΠΟ ΤΟΝ ΚΟΣΜΟ ΤΟΥ ΨΕΥΔΟΥΣ.. ΑΛΗΘΕΙΑ»
          </p>
        )}

        {/* Bedrock Monolith Stone Slab Button: ΒΕΛΟΣ + ΟΥΔΟΣ */}
        <div className="w-full max-w-[420px] sm:max-w-[460px] mx-auto relative group flex justify-center">
          {/* Ambient subterranean torchlight glow matching the portal background */}
          <div className="absolute -inset-2 sm:-inset-3 rounded-2xl bg-gradient-to-r from-[#d4af37]/25 via-[#ff9900]/20 to-[#d4af37]/25 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Heavy Ancient Chiseled Limestone Rock Button */}
          <button
            id="btn-velos-oudos"
            type="button"
            onClick={isPlaying ? triggerEntranceSequence : handleButtonClick}
            disabled={isTransitioning}
            className={`group/btn relative w-full aspect-[4/1.25] sm:aspect-[4.5/1.25] min-h-[70px] sm:min-h-[84px] transition-all duration-200 cursor-pointer select-none flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden
              shadow-[0_16px_36px_rgba(0,0,0,0.95),0_4px_14px_rgba(0,0,0,0.9)]
              hover:scale-[1.02] hover:shadow-[0_20px_44px_rgba(0,0,0,1),0_0_35px_rgba(212,175,55,0.45)]
              active:scale-[0.98] active:translate-y-[3px]
              ${phase === "pressed" ? "scale-[0.98] translate-y-[3px]" : ""}
              ${isPlaying ? "animate-pulse ring-2 ring-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.8)]" : ""}
            `}
          >
            {/* Photorealistic Chiseled Limestone Rock Slab with Embedded Carvings */}
            <img
              src={stoneRockButtonImage}
              alt="ΒΕΛΟΣ - ΟΥΔΟΣ - ΙΑΝΕΥΣ"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover/btn:scale-105"
            />

            {/* Natural warm cave torchlight gradient matching the background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-500/10 pointer-events-none rounded-xl sm:rounded-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,200,100,0.15)_0%,transparent_70%)] pointer-events-none rounded-xl sm:rounded-2xl" />
            
            {/* Glow on audio playing / activation */}
            {isPlaying && (
              <div className="absolute inset-0 bg-[#d4af37]/20 pointer-events-none animate-pulse rounded-xl sm:rounded-2xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
