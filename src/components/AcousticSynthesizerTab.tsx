import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AppTheme } from "../utils/theme";
import {
  pythagoreanSynth,
  PYTHAGOREAN_OCTAVE,
  SOLFEGGIO_MAP,
  detectPitchAutocorrelation,
  getMusicalNoteInfo,
  foldToAudibleSpectrum,
  exportFrequencyToWav,
  calculateChladniVibration,
  PythagoreanScaleNote,
  SynthTimbre,
} from "../utils/pythagoreanAudio";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Radio,
  Sliders,
  Sparkles,
  Mic,
  MicOff,
  Trash2,
  Download,
  Headphones,
  Compass,
  Activity,
  ShieldCheck,
  Music,
  Waves,
  RefreshCw,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface AcousticSynthesizerTabProps {
  theme?: AppTheme;
  initialFrequency?: number;
  initialWord?: string;
  onNavigateToCalculator?: (word: string) => void;
}

export const AcousticSynthesizerTab: React.FC<AcousticSynthesizerTabProps> = ({
  theme = "dark-ancient",
  initialFrequency = 432,
  initialWord = "ΕΓΩ ΕΙΜΙ",
  onNavigateToCalculator,
}) => {
  const isLight = theme === "parchment" || theme === "solar" || theme === "ancient-calligraphy";
  const isSolar = theme === "solar";
  const isEthereal = theme === "ethereal";
  const isCyberTech = theme === "cyber-tech";

  // Active sub-mode: "generator" | "mic-meter" | "chladni" | "binaural" | "monochord"
  const [activeSection, setActiveSection] = useState<"generator" | "mic-meter" | "chladni" | "binaural" | "monochord">("generator");

  // Generator state
  const [freqInput, setFreqInput] = useState<string>("432");
  const [currentFreq, setCurrentFreq] = useState<number>(432);
  const [sliderMax, setSliderMax] = useState<number>(2000); // 2000 or 20000 Hz
  const [waveType, setWaveType] = useState<OscillatorType>("sine");
  const [timbre, setTimbre] = useState<SynthTimbre>("PURE_SINE");
  const [volume, setVolume] = useState<number>(0.65);
  const [isPlayingContinuous, setIsPlayingContinuous] = useState<boolean>(false);
  const [nowPlayingInfo, setNowPlayingInfo] = useState<{ label: string; hz: number } | null>(null);

  // Reference Pitch for note detection: 432 vs 440 Hz
  const [tuningReference, setTuningReference] = useState<number>(432);

  // Microphone Acoustic Meter state
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micPitch, setMicPitch] = useState<number | null>(null);
  const [micRms, setMicRms] = useState<number>(0);
  const [micStatusMsg, setMicStatusMsg] = useState<string>("Το μικρόφωνο είναι απενεργοποιημένο (OFF).");
  const micStreamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const micAnimFrameRef = useRef<number | null>(null);
  const micCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chladni Canvas state
  const chladniCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chladniAnimRef = useRef<number | null>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  // Binaural state
  const [binauralBase, setBinauralBase] = useState<number>(432);
  const [binauralBeatDelta, setBinauralBeatDelta] = useState<number>(8); // 8 Hz Alpha
  const [isBinauralPlaying, setIsBinauralPlaying] = useState<boolean>(false);

  // Monochord bridge position percent (0 - 100)
  const [monochordBridge, setMonochordBridge] = useState<number>(50); // 1:1

  // Isopsephy context
  const currentIsopsephyHz = useMemo(() => {
    if (initialFrequency > 0) {
      const folded = foldToAudibleSpectrum(initialFrequency);
      return folded.foldedHz;
    }
    return 432;
  }, [initialFrequency]);

  // Derived note information for current frequency
  const currentNoteInfo = useMemo(() => {
    return getMusicalNoteInfo(currentFreq, tuningReference);
  }, [currentFreq, tuningReference]);

  // Derived note for microphone detected pitch
  const micNoteInfo = useMemo(() => {
    if (!micPitch) return null;
    return getMusicalNoteInfo(micPitch, tuningReference);
  }, [micPitch, tuningReference]);

  // Safety clean up audio & microphone on unmount or tab switch
  useEffect(() => {
    return () => {
      pythagoreanSynth.stopAll();
      stopMicrophone();
      if (chladniAnimRef.current) cancelAnimationFrame(chladniAnimRef.current);
    };
  }, []);

  // When switching away from microphone section, auto-stop mic for strict privacy!
  useEffect(() => {
    if (activeSection !== "mic-meter" && isMicActive) {
      stopMicrophone();
    }
  }, [activeSection]);

  // Handle continuous audio updates when playing
  useEffect(() => {
    if (isPlayingContinuous) {
      pythagoreanSynth.updateContinuous(currentFreq, waveType, volume);
    }
  }, [currentFreq, waveType, volume, isPlayingContinuous]);

  // ---------------------------------------------------------------------------------
  // GENERATOR HANDLERS
  // ---------------------------------------------------------------------------------
  const handleFreqChange = (newHz: number) => {
    const clamped = Math.max(1, Math.min(20000, Math.round(newHz * 10) / 10));
    setCurrentFreq(clamped);
    setFreqInput(clamped.toString());
    if (isPlayingContinuous) {
      setNowPlayingInfo({ label: `Συνεχής Τόνος (${waveType})`, hz: clamped });
    }
  };

  const handleStepFreq = (delta: number) => {
    handleFreqChange(currentFreq + delta);
  };

  const handleClearFreq = () => {
    handleFreqChange(432);
  };

  const handleToggleContinuous = () => {
    if (isPlayingContinuous) {
      pythagoreanSynth.stopContinuous();
      setIsPlayingContinuous(false);
      setNowPlayingInfo(null);
    } else {
      pythagoreanSynth.stopAll();
      setIsBinauralPlaying(false);
      pythagoreanSynth.startContinuous(currentFreq, waveType, volume);
      setIsPlayingContinuous(true);
      setNowPlayingInfo({ label: `Συνεχής Τόνος (${waveType})`, hz: currentFreq });
    }
  };

  const handleStopAllSound = () => {
    pythagoreanSynth.stopAll();
    setIsPlayingContinuous(false);
    setIsBinauralPlaying(false);
    setNowPlayingInfo(null);
  };

  const handlePlayOneShot = (hz: number, label: string, selectedTimbre: SynthTimbre = timbre) => {
    handleStopAllSound();
    handleFreqChange(hz);
    setNowPlayingInfo({ label, hz });
    pythagoreanSynth.playTone(hz, 3.2, selectedTimbre, volume);
    setTimeout(() => {
      setNowPlayingInfo((prev) => (prev?.hz === hz ? null : prev));
    }, 3200);
  };

  const handleExportWav = () => {
    exportFrequencyToWav(
      currentFreq,
      4.5,
      waveType === "triangle" ? "triangle" : "sine",
      volume,
      `pythagorean_${Math.round(currentFreq)}hz.wav`
    );
  };

  // ---------------------------------------------------------------------------------
  // MICROPHONE PITCH DETECTOR & OSCILLOSCOPE
  // ---------------------------------------------------------------------------------
  const startMicrophone = async () => {
    try {
      setMicStatusMsg("Αίτημα πρόσβασης στο μικρόφωνο...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") await ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      micStreamRef.current = stream;
      micCtxRef.current = ctx;
      micAnalyserRef.current = analyser;
      setIsMicActive(true);
      setMicStatusMsg("Μικρόφωνο ενεργό (ON) • Ζωντανή μέτρηση σε εξέλιξη.");

      // Run real-time detection & drawing loop
      const buffer = new Float32Array(analyser.fftSize);
      const freqBuffer = new Uint8Array(analyser.frequencyBinCount);

      const updateLoop = () => {
        if (!analyser) return;
        analyser.getFloatTimeDomainData(buffer);
        analyser.getByteFrequencyData(freqBuffer);

        // Autocorrelation pitch calculation
        const { pitch, rms } = detectPitchAutocorrelation(buffer, ctx.sampleRate);
        setMicPitch(pitch);
        setMicRms(Math.min(1, rms * 5));

        // Draw Oscilloscope & Frequency bars on canvas
        const canvas = micCanvasRef.current;
        if (canvas) {
          const cCtx = canvas.getContext("2d");
          if (cCtx) {
            const width = canvas.width;
            const height = canvas.height;
            cCtx.clearRect(0, 0, width, height);

            // Background subtle grid
            cCtx.strokeStyle = "rgba(200, 155, 60, 0.1)";
            cCtx.lineWidth = 1;
            cCtx.beginPath();
            cCtx.moveTo(0, height / 2);
            cCtx.lineTo(width, height / 2);
            cCtx.stroke();

            // Draw Frequency Spectrum Bars (golden-amber)
            const barWidth = (width / freqBuffer.length) * 2.5;
            for (let i = 0; i < freqBuffer.length / 2; i++) {
              const barHeight = (freqBuffer[i] / 255) * (height / 2);
              cCtx.fillStyle = `rgba(200, 155, 60, ${0.15 + (freqBuffer[i] / 255) * 0.4})`;
              cCtx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
            }

            // Draw Waveform line
            cCtx.lineWidth = 2.5;
            cCtx.strokeStyle = pitch ? "#34d399" : "#ffd700"; // Green if pitch locked, gold otherwise
            cCtx.beginPath();
            const sliceWidth = width / buffer.length;
            let x = 0;
            for (let i = 0; i < buffer.length; i++) {
              const v = buffer[i];
              const y = (v * height) / 2 + height / 2;
              if (i === 0) cCtx.moveTo(x, y);
              else cCtx.lineTo(x, y);
              x += sliceWidth;
            }
            cCtx.stroke();
          }
        }

        micAnimFrameRef.current = requestAnimationFrame(updateLoop);
      };

      micAnimFrameRef.current = requestAnimationFrame(updateLoop);
    } catch (err) {
      console.error("Microphone access error:", err);
      setIsMicActive(false);
      setMicStatusMsg("Δεν δόθηκε άδεια χρήσης μικροφώνου ή η συσκευή δεν υποστηρίζεται.");
    }
  };

  const stopMicrophone = () => {
    if (micAnimFrameRef.current) {
      cancelAnimationFrame(micAnimFrameRef.current);
      micAnimFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (micCtxRef.current && micCtxRef.current.state !== "closed") {
      micCtxRef.current.close().catch(() => {});
      micCtxRef.current = null;
    }
    micAnalyserRef.current = null;
    setIsMicActive(false);
    setMicPitch(null);
    setMicRms(0);
    setMicStatusMsg("Το μικρόφωνο είναι απενεργοποιημένο (OFF).");
  };

  const handleCopyMicToGenerator = () => {
    if (micPitch) {
      handleFreqChange(micPitch);
      setActiveSection("generator");
    }
  };

  // ---------------------------------------------------------------------------------
  // CHLADNI PLATE CYMATICS SIMULATION
  // ---------------------------------------------------------------------------------
  useEffect(() => {
    if (activeSection !== "chladni") return;

    // Initialize 1200 sand particles
    const count = 1200;
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        vx: 0,
        vy: 0,
      });
    }

    const canvas = chladniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const halfW = w / 2;
      const halfH = h / 2;

      ctx.fillStyle = "rgba(10, 8, 6, 0.25)";
      ctx.fillRect(0, 0, w, h);

      // Plate border
      ctx.strokeStyle = "rgba(200, 155, 60, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, w - 12, h - 12);

      const targetFreq = currentFreq;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const vib = calculateChladniVibration(p.x, p.y, targetFreq);

        // Gradient of vibration (force away from antinodes toward nodal lines where vib = 0)
        const eps = 0.02;
        const dx = (calculateChladniVibration(p.x + eps, p.y, targetFreq) - calculateChladniVibration(p.x - eps, p.y, targetFreq)) / (2 * eps);
        const dy = (calculateChladniVibration(p.x, p.y + eps, targetFreq) - calculateChladniVibration(p.x, p.y - eps, targetFreq)) / (2 * eps);

        // Repelled by high vibration amplitude + slight random thermal jitter
        p.vx = p.vx * 0.88 - dx * vib * 0.035 + (Math.random() - 0.5) * 0.003;
        p.vy = p.vy * 0.88 - dy * vib * 0.035 + (Math.random() - 0.5) * 0.003;

        p.x += p.vx;
        p.y += p.vy;

        // Boundary reflection
        if (p.x < -0.96) { p.x = -0.96; p.vx *= -0.5; }
        if (p.x > 0.96) { p.x = 0.96; p.vx *= -0.5; }
        if (p.y < -0.96) { p.y = -0.96; p.vy *= -0.5; }
        if (p.y > 0.96) { p.y = 0.96; p.vy *= -0.5; }

        // Render sand grain
        const screenX = halfW + p.x * (halfW - 14);
        const screenY = halfH + p.y * (halfH - 14);

        ctx.fillStyle = vib < 0.25 ? "#ffd700" : "#d4af37";
        ctx.fillRect(screenX, screenY, 1.8, 1.8);
      }

      chladniAnimRef.current = requestAnimationFrame(render);
    };

    chladniAnimRef.current = requestAnimationFrame(render);
    return () => {
      if (chladniAnimRef.current) cancelAnimationFrame(chladniAnimRef.current);
    };
  }, [activeSection, currentFreq]);

  // ---------------------------------------------------------------------------------
  // BINAURAL BEATS
  // ---------------------------------------------------------------------------------
  const handleToggleBinaural = () => {
    if (isBinauralPlaying) {
      pythagoreanSynth.stopBinaural();
      setIsBinauralPlaying(false);
      setNowPlayingInfo(null);
    } else {
      pythagoreanSynth.stopAll();
      setIsPlayingContinuous(false);
      pythagoreanSynth.startBinaural(binauralBase, binauralBeatDelta, volume);
      setIsBinauralPlaying(true);
      setNowPlayingInfo({
        label: `Διφωνικός Τόνος (L: ${binauralBase}Hz, R: ${binauralBase + binauralBeatDelta}Hz, Δ: ${binauralBeatDelta}Hz)`,
        hz: binauralBase,
      });
    }
  };

  // ---------------------------------------------------------------------------------
  // MONOCHORD SIMULATION
  // ---------------------------------------------------------------------------------
  const handlePluckMonochord = (bridgeRatio: number, label: string) => {
    handleStopAllSound();
    const freq = 256 / bridgeRatio; // Base C4 256Hz divided by length fraction
    setMonochordBridge(Math.round(bridgeRatio * 100));
    setNowPlayingInfo({ label: `Πυθαγόρειο Μονόχορδο (${label})`, hz: Math.round(freq * 10) / 10 });
    pythagoreanSynth.playTone(freq, 3.0, "MONOCHORD_PLUCK", volume);
  };

  // Card & Container classes per theme
  const containerClass = isLight
    ? "bg-[#fcfaf5] border-[#d8c39d] text-[#2b1704]"
    : isSolar
    ? "bg-[#fffef8] border-[#e6cb95] text-[#2b1400]"
    : isEthereal
    ? "bg-[#0a0f1d] border-[#1e293b] text-[#f1f5f9]"
    : isCyberTech
    ? "bg-[#0a1215] border-[#134e4a] text-[#ecfeff]"
    : "bg-[#140e08] border-[#3b2713] text-[#f5ecd8]";

  const cardClass = isLight
    ? "bg-white/80 border-[#d8c39d] shadow-sm"
    : isSolar
    ? "bg-[#fffbf0] border-[#deb673] shadow-sm"
    : isEthereal
    ? "bg-[#0f172a]/70 border-[#334155] shadow-md"
    : isCyberTech
    ? "bg-[#091b1a]/70 border-[#115e59] shadow-md"
    : "bg-[#1c140c]/80 border-[#3b2713] shadow-md";

  return (
    <div className="w-full space-y-6">
      {/* Grand Top Banner */}
      <div className={`p-4 sm:p-6 rounded-2xl border-2 shadow-xl ${containerClass} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#c89b3c]/30 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c89b3c] to-[#784e1b] flex items-center justify-center text-white shadow-lg shrink-0">
              <Waves className="w-6 h-6 animate-pulse text-[#ffd700]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-serif font-black tracking-wide">
                  Ακουστικός Συνθέτης &amp; Εργαστήριο Hz
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-sans font-bold bg-[#c89b3c]/20 text-[#c89b3c] border border-[#c89b3c]/40">
                  WEB AUDIO API
                </span>
              </div>
              <p className="text-xs sm:text-sm font-serif opacity-80 mt-0.5">
                Πυθαγόρειες συχνότητες, καθαρά ημιτονοειδή κύματα, ζωντανός μετρητής μικροφώνου &amp; κυματική (Cymatics)
              </p>
            </div>
          </div>

          {/* Quick Header Action Bar: 432 Hz Button & Live Status */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => handlePlayOneShot(432, "Βάση 432 Hz (Κοσμικό ΛΑ)", "GOLDEN_BOWL")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif font-bold text-xs bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#1c1204] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Άμεση Ακρόαση της θεμελιώδους συχνότητας 432 Hz (Κοσμικό ΛΑ)"
            >
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span>Βάση 432 Hz</span>
            </button>

            {nowPlayingInfo && (
              <button
                type="button"
                onClick={handleStopAllSound}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md animate-pulse cursor-pointer transition-all"
                title="Άμεση Διακοπή Ήχου"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Διακοπή ({nowPlayingInfo.hz} Hz)</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Status Bar (Pulsing wave & information when audio is playing) */}
        {nowPlayingInfo && (
          <div className="mt-3.5 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-[#c89b3c]/20 via-[#ffd700]/10 to-transparent border border-[#c89b3c]/50 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="w-1 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:450ms]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider block">
                  Ζωντανή Αναπαραγωγή
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold">
                  {nowPlayingInfo.label} • {nowPlayingInfo.hz} Hz
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStopAllSound}
              className="px-2.5 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-serif flex items-center gap-1 border border-red-500/50"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Σιγή</span>
            </button>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-4 pt-3 border-t border-[#c89b3c]/20">
          <button
            type="button"
            onClick={() => setActiveSection("generator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
              activeSection === "generator"
                ? "bg-[#c89b3c] text-black shadow-md font-bold"
                : "bg-black/20 hover:bg-black/30 border border-[#c89b3c]/30"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Γεννήτρια Ήχου (Ορισμός Hz)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("mic-meter")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
              activeSection === "mic-meter"
                ? "bg-emerald-600 text-white shadow-md font-bold"
                : "bg-black/20 hover:bg-black/30 border border-[#c89b3c]/30"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>2. Μετρητής Μικροφώνου (Hz)</span>
            {isMicActive && (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("chladni")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
              activeSection === "chladni"
                ? "bg-[#c89b3c] text-black shadow-md font-bold"
                : "bg-black/20 hover:bg-black/30 border border-[#c89b3c]/30"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Κυματική Chladni</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("binaural")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
              activeSection === "binaural"
                ? "bg-[#c89b3c] text-black shadow-md font-bold"
                : "bg-black/20 hover:bg-black/30 border border-[#c89b3c]/30"
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>4. Διφωνικοί Τόνοι</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("monochord")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
              activeSection === "monochord"
                ? "bg-[#c89b3c] text-black shadow-md font-bold"
                : "bg-black/20 hover:bg-black/30 border border-[#c89b3c]/30"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>5. Πυθαγόρειο Μονόχορδο</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ΓΕΝΝΗΤΡΙΑ ΗΧΟΥ (ΟΡΙΣΜΟΣ HZ & ΖΩΝΤΑΝΗ ΑΠΟΔΟΣΗ)                  */}
      {/* ========================================================================= */}
      {activeSection === "generator" && (
        <div className="space-y-6">
          {/* Main Control Panel */}
          <div className={`p-4 sm:p-6 rounded-2xl border ${cardClass} space-y-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c89b3c]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>Ελεύθερος Ορισμός Συχνότητας (Hz)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#ffd700]">
                    20 - {sliderMax} Hz
                  </span>
                </h3>
                <p className="text-xs font-serif opacity-75">
                  Πληκτρολογήστε οποιονδήποτε αριθμό Hz, χρησιμοποιήστε τα βήματα ή σύρετε τον ολισθητή
                </p>
              </div>

              {/* Safety Limiter Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Limiter Προστασίας Ενεργός</span>
              </div>
            </div>

            {/* Numeric Input with External Trash Bin & Step Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left: Direct Input with External Clear Trash Icon */}
              <div className="lg:col-span-6 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    max="20000"
                    step="0.1"
                    value={freqInput}
                    onChange={(e) => {
                      setFreqInput(e.target.value);
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val > 0) {
                        setCurrentFreq(Math.round(val * 10) / 10);
                        if (isPlayingContinuous) {
                          setNowPlayingInfo({ label: `Συνεχής Τόνος (${waveType})`, hz: Math.round(val * 10) / 10 });
                        }
                      }
                    }}
                    className="w-full text-2xl sm:text-3xl font-mono font-black text-center py-2.5 px-4 rounded-xl border-2 border-[#c89b3c] bg-black/40 text-[#ffd700] focus:ring-2 focus:ring-[#ffd700] outline-none shadow-inner"
                    placeholder="432"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#c89b3c]">
                    Hz
                  </span>
                </div>

                {/* External Trash Bin Button (as explicitly requested) */}
                <button
                  type="button"
                  onClick={handleClearFreq}
                  className="p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-all cursor-pointer shrink-0 shadow-sm"
                  title="Καθαρισμός & Επαναφορά στα 432 Hz"
                  id="generator-trash-clear-btn"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Right: Step Buttons (-100, -10, -1, +1, +10, +100) */}
              <div className="lg:col-span-6 flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 flex-wrap">
                {[-100, -10, -1, 1, 10, 100].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleStepFreq(step)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#c89b3c]/40 bg-[#c89b3c]/10 hover:bg-[#c89b3c]/30 text-xs font-mono font-bold transition-all cursor-pointer text-[#ffd700] active:scale-95"
                  >
                    {step > 0 ? `+${step}` : step} Hz
                  </button>
                ))}
              </div>
            </div>

            {/* Continuous Real-Time Frequency Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-serif opacity-80">
                <span>Ολισθητής Συχνότητας (20 Hz - {sliderMax} Hz)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSliderMax(sliderMax === 2000 ? 20000 : 2000)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#c89b3c]/40 hover:bg-[#c89b3c]/20 text-[#ffd700]"
                  >
                    Εύρος: {sliderMax === 2000 ? "20–2.000 Hz" : "20–20.000 Hz"}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max={sliderMax}
                step="0.5"
                value={currentFreq}
                onChange={(e) => handleFreqChange(parseFloat(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-black/40 accent-[#ffd700]"
              />
            </div>

            {/* Note Detection & Pitch Meter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-black/30 border border-[#c89b3c]/30 text-center">
              <div>
                <span className="text-[11px] font-serif opacity-75 block">Αναγνώριση Νότας</span>
                <span className="text-base sm:text-lg font-mono font-bold text-[#34d399]">
                  {currentNoteInfo.greekNoteName} ({currentNoteInfo.noteName})
                </span>
              </div>
              <div>
                <span className="text-[11px] font-serif opacity-75 block">Οκτάβα</span>
                <span className="text-base sm:text-lg font-mono font-bold text-[#ffd700]">
                  Οκτάβα {currentNoteInfo.octave}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-serif opacity-75 block">Απόκλιση Cents</span>
                <span className={`text-base sm:text-lg font-mono font-bold ${Math.abs(currentNoteInfo.cents) <= 5 ? "text-emerald-400" : "text-amber-400"}`}>
                  {currentNoteInfo.cents > 0 ? `+${currentNoteInfo.cents}` : currentNoteInfo.cents} ¢
                </span>
              </div>
              <div>
                <span className="text-[11px] font-serif opacity-75 block">Βάση Αναφοράς</span>
                <button
                  type="button"
                  onClick={() => setTuningReference(tuningReference === 432 ? 440 : 432)}
                  className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#c89b3c]/20 hover:bg-[#c89b3c]/40 text-[#ffd700] border border-[#c89b3c]/40 mt-0.5"
                >
                  A = {tuningReference} Hz
                </button>
              </div>
            </div>

            {/* Waveform, Timbre, Volume & Play Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
              {/* Waveform & Timbre */}
              <div className="md:col-span-5 space-y-2">
                <span className="text-xs font-serif opacity-80 block">Μορφή Κύματος</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(["sine", "triangle", "sawtooth", "square"] as OscillatorType[]).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWaveType(w)}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                        waveType === w
                          ? "bg-[#ffd700] text-black border-[#ffd700] shadow-sm"
                          : "bg-black/30 border-[#c89b3c]/30 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {w === "sine" ? "Ημίτονο" : w === "triangle" ? "Τρίγωνο" : w === "sawtooth" ? "Πριόνι" : "Τετράγωνο"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="md:col-span-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-serif opacity-80">
                  <span>Ένταση (Volume)</span>
                  <span className="font-mono">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black/40 accent-[#ffd700] mt-2"
                />
              </div>

              {/* Play / Stop Continuous & Export WAV */}
              <div className="md:col-span-4 flex items-center gap-2 justify-end pt-4 md:pt-0">
                <button
                  type="button"
                  onClick={handleToggleContinuous}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-serif font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer ${
                    isPlayingContinuous
                      ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                      : "bg-gradient-to-r from-[#ffd700] to-[#c89b3c] text-black hover:scale-105 active:scale-95"
                  }`}
                >
                  {isPlayingContinuous ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>Διακοπή</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Συνεχής Ήχος</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExportWav}
                  className="px-3 py-2.5 rounded-xl border border-[#c89b3c]/40 bg-black/30 hover:bg-[#c89b3c]/20 text-[#ffd700] font-serif text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  title="Εξαγωγή αρχείου ήχου (.WAV 44.1kHz)"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">WAV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pythagorean Octave Scale - Full 8 Pythagorean Tones (ΝΤΟ έως ΝΤΟ²) */}
          <div className={`p-4 sm:p-6 rounded-2xl border ${cardClass} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c89b3c]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>Πυθαγόρειο Επτάχορδο &amp; Πλήκτρα Οκτάβας (ΝΤΟ έως ΝΤΟ²)</span>
                </h3>
                <p className="text-xs font-serif opacity-75">
                  Η πλήρης κλίμακα των 8 πυθαγορείων φθόγγων. Πατήστε οποιοδήποτε πλήκτρο για άμεση ακρόαση.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#ffd700] px-2.5 py-1 rounded-full bg-[#c89b3c]/20 border border-[#c89b3c]/40 shrink-0">
                512 Hz ↔ 215 = ΔΙΑΣ!
              </span>
            </div>

            {/* 8 Piano/Harp Keys */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {PYTHAGOREAN_OCTAVE.map((note) => {
                const isSelected = Math.abs(currentFreq - note.hz) < 2;
                return (
                  <button
                    key={note.name}
                    type="button"
                    onClick={() => handlePlayOneShot(note.hz, `${note.greekName} (${note.name}) - ${note.hz} Hz`, "ANCIENT_LYRE")}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer group active:scale-95 ${
                      isSelected
                        ? "border-[#ffd700] bg-gradient-to-b from-[#ffd700]/30 to-[#c89b3c]/20 shadow-lg ring-2 ring-[#ffd700]/70"
                        : "border-[#c89b3c]/40 bg-black/30 hover:border-[#ffd700]/70 hover:bg-[#c89b3c]/10"
                    }`}
                  >
                    <span className="text-xs font-mono opacity-70 block">{note.name}</span>
                    <span className="text-xl font-serif font-black text-[#ffd700] my-1 group-hover:scale-110 transition-transform">
                      {note.greekName}
                    </span>
                    <span className="text-sm font-mono font-bold block">{note.hz} <span className="text-[10px]">Hz</span></span>
                    <span className="text-[10px] font-mono opacity-80 mt-1 px-1.5 py-0.5 rounded bg-black/40">
                      {note.ratio}
                    </span>
                    <span className="text-[9px] font-serif opacity-60 mt-1 line-clamp-1" title={note.mysticMeaning}>
                      {note.isokrati}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Sacred Presets Matrix & Current Word Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Word Isopsephy Frequency Card */}
            <div className={`md:col-span-5 p-4 sm:p-5 rounded-2xl border ${cardClass} flex flex-col justify-between space-y-3`}>
              <div>
                <div className="flex items-center justify-between text-xs font-serif opacity-75">
                  <span>Πυθαγόρεια Νότα Λεξαρίθμου</span>
                  <span className="font-mono font-bold text-[#c89b3c]">{initialWord}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-black text-[#ffd700] mt-1">
                  {currentIsopsephyHz} <span className="text-base text-stone-400 font-mono">Hz</span>
                </div>
                <p className="text-xs font-serif opacity-80 mt-1">
                  Ακουστική συχνότητα προκύπτουσα από την οκταβική αναγωγή του λεξαρίθμου ({initialFrequency}).
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handlePlayOneShot(currentIsopsephyHz, `Λεξάριθμος ${initialWord} (${currentIsopsephyHz} Hz)`, "GOLDEN_BOWL")}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#c89b3c] hover:bg-[#d4af37] text-black font-serif font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ακρόαση Λεξαρίθμου</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFreqChange(currentIsopsephyHz)}
                  className="px-3 py-2 rounded-xl border border-[#c89b3c]/50 hover:bg-[#c89b3c]/20 text-[#ffd700] font-serif text-xs"
                  title="Φόρτωση στη Γεννήτρια"
                >
                  Χρήση Hz
                </button>
              </div>
            </div>

            {/* Right: Sacred Solfeggio & Cosmic Presets */}
            <div className={`md:col-span-7 p-4 sm:p-5 rounded-2xl border ${cardClass} space-y-3`}>
              <span className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider block">
                Ιερές Συχνότητες Solfeggio &amp; Κοσμικού Συντονισμού
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { hz: 432, name: "432 Hz", desc: "Κοσμικό ΛΑ" },
                  { hz: 528, name: "528 Hz", desc: "Solfeggio DNA" },
                  { hz: 256, name: "256 Hz", desc: "Επιστημονικό C" },
                  { hz: 384, name: "384 Hz", desc: "Πέμπτη G" },
                  { hz: 108, name: "108 Hz", desc: "Ιερό 108" },
                  { hz: 7.83, name: "7.83 Hz", desc: "Schumann Γη" },
                  { hz: 111, name: "111 Hz", desc: "Τετράγωνο Ηλίου" },
                  { hz: 666, name: "666 Hz", desc: "Ηλιακόν 666" },
                  { hz: 888, name: "888 Hz", desc: "ΙΗΣΟΥΣ" },
                ].map((item) => (
                  <button
                    key={item.hz}
                    type="button"
                    onClick={() => handlePlayOneShot(item.hz === 7.83 ? 125.28 : item.hz, `${item.name} (${item.desc})`, "GOLDEN_BOWL")}
                    className="p-2 rounded-xl border border-[#c89b3c]/30 bg-black/30 hover:bg-[#c89b3c]/20 hover:border-[#ffd700]/60 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#ffd700] group-hover:scale-105 transition-transform">
                        {item.name}
                      </span>
                      <Play className="w-2.5 h-2.5 text-[#c89b3c] opacity-0 group-hover:opacity-100 transition-opacity fill-current" />
                    </div>
                    <span className="text-[10px] font-serif opacity-70 block truncate">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ΜΕΤΡΗΤΗΣ HZ ΕΞΩΤΕΡΙΚΩΝ ΗΧΩΝ (ΜΙΚΡΟΦΩΝΟ)                        */}
      {/* ========================================================================= */}
      {activeSection === "mic-meter" && (
        <div className="space-y-6">
          <div className={`p-4 sm:p-6 rounded-2xl border ${cardClass} space-y-5`}>
            {/* Header & Status Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c89b3c]/20 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>Μετρητής Hz Εξωτερικών Ήχων (Μικρόφωνο)</span>
                  {isMicActive ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/50 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      ON (ΖΩΝΤΑΝΗ ΜΕΤΡΗΣΗ)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-900 text-stone-400 border border-stone-700">
                      <Lock className="w-3 h-3" />
                      OFF (ΚΛΕΙΔΩΜΕΝΟ)
                    </span>
                  )}
                </h3>
                <p className="text-xs font-serif opacity-75 mt-0.5">
                  {micStatusMsg}
                </p>
              </div>

              {/* Master Microphone ON / OFF Toggle */}
              <div>
                {isMicActive ? (
                  <button
                    type="button"
                    onClick={stopMicrophone}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-serif font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>Απενεργοποίηση Μικροφώνου (OFF)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startMicrophone}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer active:scale-95 hover:scale-105"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Ενεργοποίηση Μικροφώνου (ON)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Visual Displays: Big Hz, Tuner Needle & Waveform Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Big Digital Frequency & Tuner Gauge */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-black/40 border border-[#c89b3c]/30 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-serif opacity-75 uppercase tracking-wider block">
                    Θεμελιώδης Συχνότητα (f₀)
                  </span>
                  <div className="text-4xl sm:text-5xl font-mono font-black text-[#ffd700] my-2">
                    {micPitch !== null ? (
                      <>
                        {micPitch.toFixed(1)} <span className="text-lg text-stone-400">Hz</span>
                      </>
                    ) : (
                      <span className="text-stone-600">---.- Hz</span>
                    )}
                  </div>

                  {/* Volume Level / VU Meter */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
                      <span>Ένταση Σήματος (VU)</span>
                      <span>{Math.round(micRms * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-75"
                        style={{ width: `${Math.min(100, micRms * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tuner / Note Detection */}
                {micNoteInfo && (
                  <div className="p-3 rounded-lg bg-black/30 border border-[#c89b3c]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif opacity-75">Πλησιέστερη Νότα:</span>
                      <span className="text-lg font-mono font-bold text-[#34d399]">
                        {micNoteInfo.greekNoteName} ({micNoteInfo.noteName})
                      </span>
                    </div>

                    {/* Cents Needle Indicator (-50 to +50 cents) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-stone-400">
                        <span>-50¢</span>
                        <span className={Math.abs(micNoteInfo.cents) <= 5 ? "text-emerald-400 font-bold" : ""}>
                          {micNoteInfo.cents > 0 ? `+${micNoteInfo.cents}¢` : `${micNoteInfo.cents}¢`}
                        </span>
                        <span>+50¢</span>
                      </div>
                      <div className="relative w-full h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-700">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-500" />
                        <div
                          className={`absolute top-0 bottom-0 w-2 rounded-full -translate-x-1/2 transition-all duration-75 ${
                            Math.abs(micNoteInfo.cents) <= 5 ? "bg-emerald-400 shadow-md shadow-emerald-400/50" : "bg-amber-400"
                          }`}
                          style={{ left: `${Math.max(5, Math.min(95, ((micNoteInfo.cents + 50) / 100) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Transfer Detected Pitch to Generator Button */}
                <button
                  type="button"
                  disabled={!micPitch}
                  onClick={handleCopyMicToGenerator}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#c89b3c]/20 hover:bg-[#c89b3c]/40 text-[#ffd700] border border-[#c89b3c]/50 text-xs font-serif font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <span>Μεταφορά στη Γεννήτρια ({micPitch ? `${micPitch} Hz` : ""})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: Real-Time Oscilloscope Canvas */}
              <div className="lg:col-span-7 space-y-2">
                <span className="text-xs font-serif opacity-75 uppercase tracking-wider block">
                  Ζωντανός Παλμογράφος &amp; Φάσμα Συχνοτήτων
                </span>
                <div className="w-full h-56 rounded-xl bg-black/60 border border-[#c89b3c]/30 overflow-hidden relative shadow-inner">
                  <canvas
                    ref={micCanvasRef}
                    width={560}
                    height={224}
                    className="w-full h-full block"
                  />
                  {!isMicActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-center p-4">
                      <Lock className="w-8 h-8 text-stone-500 mb-2" />
                      <span className="text-xs font-serif text-stone-300">
                        Το μικρόφωνο είναι απενεργοποιημένο
                      </span>
                      <span className="text-[11px] font-sans text-stone-500 mt-1">
                        Πατήστε «Ενεργοποίηση Μικροφώνου (ON)» για εκκίνηση
                      </span>
                    </div>
                  )}
                </div>

                {/* Resonance Detector */}
                {micPitch && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-serif flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {Math.abs(micPitch - 432) < 3
                        ? "Κοσμικός Συντονισμός 432 Hz εντοπίστηκε!"
                        : Math.abs(micPitch - 528) < 3
                        ? "Συντονισμός Solfeggio 528 Hz εντοπίστηκε!"
                        : Math.abs(micPitch - currentIsopsephyHz) < 3
                        ? `Συντονισμός με τον τρέχοντα λεξάριθμο (${currentIsopsephyHz} Hz)!`
                        : `Ανίχνευση συχνότητας: ${micPitch} Hz`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ΔΙΑΔΡΑΣΤΙΚΑ ΣΧΗΜΑΤΑ CHLADNI (CYMATICS)                        */}
      {/* ========================================================================= */}
      {activeSection === "chladni" && (
        <div className="space-y-6">
          <div className={`p-4 sm:p-6 rounded-2xl border ${cardClass} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c89b3c]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#ffd700]" />
                  <span>Διαδραστικά Σχήματα Chladni (Cymatics)</span>
                </h3>
                <p className="text-xs font-serif opacity-75">
                  Οπτικοποίηση εικονικής μεταλλικής πλάκας με κόκκους άμμου που οργανώνονται αυτόματα στα φυσικά γεωμετρικά μοτίβα της συχνότητας {currentFreq} Hz.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStepFreq(-20)}
                  className="px-2.5 py-1 rounded-lg border border-[#c89b3c]/30 text-xs font-mono"
                >
                  -20 Hz
                </button>
                <span className="text-xs font-mono font-bold text-[#ffd700]">
                  {currentFreq} Hz
                </span>
                <button
                  type="button"
                  onClick={() => handleStepFreq(20)}
                  className="px-2.5 py-1 rounded-lg border border-[#c89b3c]/30 text-xs font-mono"
                >
                  +20 Hz
                </button>
              </div>
            </div>

            {/* Chladni Canvas Display */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl bg-black border-4 border-[#c89b3c]/60 shadow-2xl relative overflow-hidden">
                <canvas
                  ref={chladniCanvasRef}
                  width={384}
                  height={384}
                  className="w-full h-full block"
                />
              </div>
              <span className="text-xs font-serif opacity-70 mt-3 text-center max-w-md">
                Οι κόκκοι άμμου μεταναστεύουν μακριά από τις κορυφές των κυμάτων και συγκεντρώνονται στις κομβικές γραμμές (Nodal Lines), αποκαλύπτοντας την ιερή γεωμετρία του ήχου.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ΔΙΦΩΝΙΚΟΙ ΤΟΝΟΙ (BINAURAL BEATS)                              */}
      {/* ========================================================================= */}
      {activeSection === "binaural" && (
        <div className="space-y-6">
          <div className={`p-4 sm:p-6 rounded-2xl border ${cardClass} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c89b3c]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-[#ffd700]" />
                  <span>Διφωνικοί Τόνοι (Binaural Beats) για Διαλογισμό</span>
                </h3>
                <p className="text-xs font-serif opacity-75">
                  Απαιτούνται στερεοφωνικά ακουστικά (L/R) για την αντίληψη του παλμού συχνότητας στον εγκέφαλο
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleBinaural}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-serif font-bold text-xs transition-all ${
                  isBinauralPlaying
                    ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                    : "bg-[#ffd700] hover:bg-[#d4af37] text-black"
                }`}
              >
                {isBinauralPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isBinauralPlaying ? "Διακοπή" : "Αναπαραγωγή Διφωνικού"}</span>
              </button>
            </div>

            {/* Presets for Brainwave States */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Delta (Δέλτα)", delta: 2, desc: "Βαθύς Ύπνος & Ανάρρωση (1-4 Hz)" },
                { name: "Theta (Θήτα)", delta: 5, desc: "Διαλογισμός & Διαίσθηση (4-8 Hz)" },
                { name: "Alpha (Άλφα)", delta: 8, desc: "Ηρεμία & Χαλάρωση (8-13 Hz)" },
                { name: "Beta (Βήτα)", delta: 14, desc: "Εγρήγορση & Εστίαση (13-30 Hz)" },
              ].map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => {
                    setBinauralBeatDelta(b.delta);
                    if (isBinauralPlaying) {
                      pythagoreanSynth.startBinaural(binauralBase, b.delta, volume);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    binauralBeatDelta === b.delta
                      ? "border-[#ffd700] bg-[#c89b3c]/20"
                      : "border-[#c89b3c]/30 bg-black/30 hover:border-[#ffd700]/50"
                  }`}
                >
                  <span className="text-xs font-serif font-bold text-[#ffd700] block">{b.name}</span>
                  <span className="text-lg font-mono font-black my-1 block">Δ = {b.delta} Hz</span>
                  <span className="text-[10px] opacity-70 block">{b.desc}</span>
                </button>
              ))}
            </div>

            {/* Base Tone & Delta Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-serif opacity-80">
                  <span>Βασική Συχνότητα (Carrier Hz):</span>
                  <span className="font-mono font-bold text-[#ffd700]">{binauralBase} Hz</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="1"
                  value={binauralBase}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBinauralBase(val);
                    if (isBinauralPlaying) pythagoreanSynth.startBinaural(val, binauralBeatDelta, volume);
                  }}
                  className="w-full h-2 bg-black/40 rounded-lg accent-[#ffd700]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-serif opacity-80">
                  <span>Διαφορά Καναλιών (Beat Δf):</span>
                  <span className="font-mono font-bold text-[#ffd700]">{binauralBeatDelta} Hz</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={binauralBeatDelta}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBinauralBeatDelta(val);
                    if (isBinauralPlaying) pythagoreanSynth.startBinaural(binauralBase, val, volume);
                  }}
                  className="w-full h-2 bg-black/40 rounded-lg accent-[#ffd700]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: ΠΥΘΑΓΟΡΕΙΟ ΜΟΝΟΧΟΡΔΟ                                          */}
      {/* ========================================================================= */}
      {activeSection === "monochord" && (
        <div className="space-y-6">
          <div className={`p-4 sm:p-6 rounded-2xl border ${cardClass} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c89b3c]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#ffd700]" />
                  <span>Πυθαγόρειο Μονόχορδο (Monochord Simulation)</span>
                </h3>
                <p className="text-xs font-serif opacity-75">
                  Το όργανο με το οποίο ο Πυθαγόρας απέδειξε τη μαθηματική φύση των μουσικών διαστημάτων
                </p>
              </div>
            </div>

            {/* Visual String & Movable Bridge */}
            <div className="p-5 rounded-2xl bg-black/50 border border-[#c89b3c]/40 space-y-4">
              <div className="relative w-full h-20 flex items-center">
                {/* Wood resonance base */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#3e2712] via-[#241608] to-[#3e2712] rounded-xl border border-[#784e1b] shadow-inner" />

                {/* The Golden String */}
                <div className="absolute left-6 right-6 h-1 bg-gradient-to-r from-[#ffd700] via-[#fff5c0] to-[#ffd700] shadow-[0_0_8px_rgba(255,215,0,0.8)]" />

                {/* Movable Bridge (Καβαλάρης) */}
                <div
                  className="absolute top-2 bottom-2 w-3 bg-[#c89b3c] rounded border border-amber-200 shadow-xl -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${Math.max(8, Math.min(92, monochordBridge))}%` }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-between py-1">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                </div>
              </div>

              {/* Ratios quick buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  { ratio: 1.0, fraction: "1:1", name: "Ισοκράτημα (Unison)" },
                  { ratio: 4 / 3, fraction: "4:3", name: "Διατεσσάρων (Τετάρτη)" },
                  { ratio: 3 / 2, fraction: "3:2", name: "Διοξεία (Πέμπτη)" },
                  { ratio: 2.0, fraction: "2:1", name: "Διά Πασών (Οκτάβα)" },
                ].map((item) => (
                  <button
                    key={item.fraction}
                    type="button"
                    onClick={() => handlePluckMonochord(1 / item.ratio, item.name)}
                    className="p-2.5 rounded-xl border border-[#c89b3c]/40 bg-black/40 hover:bg-[#c89b3c]/20 text-center transition-all cursor-pointer group"
                  >
                    <span className="text-sm font-mono font-bold text-[#ffd700] block group-hover:scale-105 transition-transform">
                      {item.fraction}
                    </span>
                    <span className="text-xs font-serif opacity-80 block truncate">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
