import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Eye,
  Zap,
  Palette,
  Box,
  Layers,
  Compass,
  Flame,
  Expand,
  Shrink,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sun,
  Radio,
  CheckCircle2,
  Target,
  Hash,
  Crosshair,
  Scan,
  Activity,
  ShieldAlert,
  Disc,
  Grid,
} from "lucide-react";
import { StoneSolarSquare } from "./StoneSolarSquare";

interface CubeApolloTabProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

// 6 Sacred Inscribed Faces of the Central Cube (666)
interface SacredFace666 {
  id: string;
  faceName: string;
  axis: string;
  phrase: string;
  meaning: string;
  sum: number;
  letters: string;
  cameraPos: [number, number, number];
}

const CORE_666_FACES: SacredFace666[] = [
  {
    id: "front",
    faceName: "Πρόσθια Πλευρά (+Z)",
    axis: "+Z",
    phrase: "Η ΚΑΤΑΝΟΗΣΗ",
    meaning: "Η Θεία Ενόραση, Σοφία & Γνώση",
    sum: 666,
    letters: "Η(8) + Κ(20) + Α(1) + Τ(300) + Α(1) + Ν(50) + Ο(70) + Η(8) + Σ(200) + Η(8) = 666",
    cameraPos: [0, 0, 8.5],
  },
  {
    id: "right",
    faceName: "Δεξιά Πλευρά (+X)",
    axis: "+X",
    phrase: "ΛΑΥΡΕΙΟΝ",
    meaning: "Ο Αρχέγονος Θησαυρός, Φως & Μεταλλείο Πνεύματος",
    sum: 666,
    letters: "Λ(30) + Α(1) + Υ(400) + Ρ(100) + Ε(5) + Ι(10) + Ο(70) + Ν(50) = 666",
    cameraPos: [8.5, 0, 0],
  },
  {
    id: "left",
    faceName: "Αριστερά Πλευρά (-X)",
    axis: "-X",
    phrase: "ΙΑΝΕΥΣ",
    meaning: "Ο Αιώνιος Θυρωρός & Πύλη των Διαστάσεων",
    sum: 666,
    letters: "Ι(10) + Α(1) + Ν(50) + Ε(5) + Υ(400) + Σ(200) = 666",
    cameraPos: [-8.5, 0, 0],
  },
  {
    id: "top",
    faceName: "Άνω Πλευρά (+Y)",
    axis: "+Y",
    phrase: "ΤΕΛΙΑΝΟΣ",
    meaning: "Η Τελείωση, Αρμονία & Ολοκλήρωση",
    sum: 666,
    letters: "Τ(300) + Ε(5) + Λ(30) + Ι(10) + Α(1) + Ν(50) + Ο(70) + Σ(200) = 666",
    cameraPos: [0, 8.5, 0],
  },
  {
    id: "bottom",
    faceName: "Κάτω Πλευρά (-Y)",
    axis: "-Y",
    phrase: "Ο ΝΙΚΗΤΗΣ",
    meaning: "Ο Θρίαμβος του Ηλιακού Φωτός επί του Σκότους",
    sum: 666,
    letters: "Ο(70) + Ν(50) + Ι(10) + Κ(20) + Η(8) + Τ(300) + Η(8) + Σ(200) = 666",
    cameraPos: [0, -8.5, 0],
  },
  {
    id: "back",
    faceName: "Οπίσθια Πλευρά (-Z)",
    axis: "-Z",
    phrase: "Η ΑΓΑΠΗ ΕΣΤΙΝ",
    meaning: "Η Ύψιστη Οντολογική & Συμπαντική Αρχή",
    sum: 666,
    letters: "Η(8) + Α(1) + Γ(3) + Α(1) + Π(80) + Η(8) + Ε(5) + Σ(200) + Τ(300) + Ι(10) + Ν(50) = 666",
    cameraPos: [0, 0, -8.5],
  },
];

type ViewStyle = "solid" | "translucent" | "cross_section" | "core_only";
type RayStyle = "axes_666" | "axes_laser" | "axes_corners" | "none";

export const CubeApolloTab: React.FC<CubeApolloTabProps> = ({ onOpenAiModal }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [aktinaVisible, setAktinaVisible] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [is3DCollapsed, setIs3DCollapsed] = useState<boolean>(false);
  const [mainSubView, setMainSubView] = useState<"both" | "cube3d" | "solarSquare">("both");
  const [viewStyle, setViewStyle] = useState<ViewStyle>("solid");
  const [rayStyle, setRayStyle] = useState<RayStyle>("axes_666");
  const [rayThickness, setRayThickness] = useState<number>(0.008);
  const [selectedFaceIdx, setSelectedFaceIdx] = useState<number | null>(0);
  const [isPurifyingToneActive, setIsPurifyingToneActive] = useState<boolean>(false);
  const [purifyingCountdown, setPurifyingCountdown] = useState<number>(0);
  const purifyingOscRef = useRef<{ stop: () => void } | null>(null);

  // 11x11x11 Coordinate Numbering & Inspection States
  const [showNumbersOnAxes, setShowNumbersOnAxes] = useState<boolean>(true);
  const [selectedCoords, setSelectedCoords] = useState<{ col: number; row: number; depth: number }>({
    col: 6,
    row: 6,
    depth: 6,
  });
  const [hoveredCubeInfo, setHoveredCubeInfo] = useState<{
    col: number;
    row: number;
    depth: number;
    index: number;
    isCentral: boolean;
    layer: number;
  } | null>(null);

  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const showNumbersOnAxesRef = useRef<boolean>(true);
  showNumbersOnAxesRef.current = showNumbersOnAxes;

  const selectedCoordsRef = useRef<{ col: number; row: number; depth: number }>({ col: 6, row: 6, depth: 6 });
  selectedCoordsRef.current = selectedCoords;

  // Radial Expansion / Dispersion State (0 = Compact Solid, 1 = Fully Dispersed Exploded Matrix)
  const [expansion, setExpansion] = useState<number>(0.65);
  const targetExpansionRef = useRef<number>(0.65);
  const currentExpansionRef = useRef<number>(0.65);

  // Audio Context Ref for Pythagorean Harmonics Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const worldGroupRef = useRef<THREE.Group | null>(null);
  const centralCubeRef = useRef<THREE.Mesh | null>(null);
  const outerCubesGroupRef = useRef<THREE.Group | null>(null);
  const raysGroupRef = useRef<THREE.Group | null>(null);
  const axesNumbersGroupRef = useRef<THREE.Group | null>(null);
  const highlightMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const centralPulseLightRef = useRef<THREE.PointLight | null>(null);
  const outerMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // High-Resolution 3D Number Badge Sprite Generator for the 11 Rows, 11 Columns, and 11 Depths
  const createAxisNumberBadgeSprite = (
    num: number,
    axisType: "X" | "Y" | "Z",
    isCenter: boolean
  ): THREE.Sprite => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Sprite();

    ctx.save();
    ctx.translate(128, 128);

    if (isCenter) {
      // Radiant Golden Badge for Center (6) - The Sacred Nexus (6-6-6)
      ctx.shadowColor = "#ffd700";
      ctx.shadowBlur = 22;

      ctx.fillStyle = "rgba(18, 14, 8, 0.95)";
      ctx.beginPath();
      ctx.arc(0, 0, 108, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 104, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 92, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffd700";
      ctx.font = "900 114px 'Times New Roman', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("6", 0, -18);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("ΚΕΝΤΡΟ", 0, 52);
    } else {
      // Distinct, High-Contrast Color Theme for X (Columns), Y (Rows), Z (Depths)
      const colorMap = {
        X: { bg: "rgba(26, 18, 8, 0.90)", border: "#d4af37", text: "#f5ecd8", tag: "ΣΤΗΛΗ" },
        Y: { bg: "rgba(6, 24, 28, 0.90)", border: "#00d4ff", text: "#e0f7ff", tag: "ΣΕΙΡΑ" },
        Z: { bg: "rgba(24, 10, 28, 0.90)", border: "#e0a0ff", text: "#fae8ff", tag: "ΒΑΘΟΣ" },
      }[axisType];

      ctx.fillStyle = colorMap.bg;
      ctx.beginPath();
      ctx.arc(0, 0, 102, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = colorMap.border;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 98, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = colorMap.text;
      ctx.font = "bold 96px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(num.toString(), 0, -12);

      ctx.fillStyle = colorMap.border;
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(`${axisType}:${num}`, 0, 52);
    }

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.68, 0.68, 1);
    return sprite;
  };

  // High-Resolution 3D Axis Title Label Sprite
  const createAxisTitleSprite = (title: string, color: string): THREE.Sprite => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Sprite();

    ctx.fillStyle = "rgba(12, 9, 6, 0.92)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(8, 8, 496, 112, 24);
    } else {
      ctx.rect(8, 8, 496, 112);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = "bold 42px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  };

  // High-Resolution Procedural Metallic & Phosphorescent Texture Generator for outer 1330 cubes
  const createMetallicPhosphorTexture = (
    baseHex: string,
    metalSheenHex: string,
    phosphorHex: string
  ): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Brushed Metallic Base Gradient
    const metalGrad = ctx.createLinearGradient(0, 0, 512, 512);
    metalGrad.addColorStop(0, baseHex);
    metalGrad.addColorStop(0.3, metalSheenHex);
    metalGrad.addColorStop(0.5, baseHex);
    metalGrad.addColorStop(0.7, metalSheenHex);
    metalGrad.addColorStop(1, baseHex);
    ctx.fillStyle = metalGrad;
    ctx.fillRect(0, 0, 512, 512);

    // 2. Anisotropic brushed metallic micro-lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 512; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, i + (Math.random() - 0.5) * 2);
      ctx.lineTo(512, i + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }

    // 3. Phosphorescent Sacred Runes & Geometric Borders
    ctx.strokeStyle = phosphorHex;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;
    ctx.strokeRect(36, 36, 440, 440);

    // Corner optical nodes
    const node = (x: number, y: number) => {
      ctx.fillStyle = phosphorHex;
      ctx.fillRect(x - 6, y - 6, 12, 12);
    };
    node(36, 36);
    node(476, 36);
    node(36, 476);
    node(476, 476);

    // Central Subtle Sacred Diamond
    ctx.beginPath();
    ctx.moveTo(256, 120);
    ctx.lineTo(392, 256);
    ctx.lineTo(256, 392);
    ctx.lineTo(120, 256);
    ctx.closePath();
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.45;
    ctx.stroke();

    // 4. Luminous Chamfered Metallic Outer Bevel
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 14;
    ctx.globalAlpha = 0.95;
    ctx.strokeRect(7, 7, 498, 498);

    ctx.strokeStyle = phosphorHex;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1.0;
    ctx.strokeRect(16, 16, 480, 480);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Helper to create the Sacred Pure White Marble / Alabaster Face Texture for Central 666 Cube
  // High resolution (1024x1024), maximum contrast, gold embossed chiseling, and clear typography
  const createPureWhiteFaceTexture = (phrase: string, faceName: string, axisTag: string): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Pure Sacred White Alabaster / Pentelic Marble Background
    const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 620);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.65, "#fbfaf7");
    grad.addColorStop(1, "#f3efe6");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Subtle, Fine Golden Marble Veining (Alabaster Elegance)
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2.0;
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      let cx = Math.random() * 1024;
      let cy = Math.random() * 1024;
      ctx.moveTo(cx, cy);
      for (let j = 0; j < 5; j++) {
        cx += (Math.random() - 0.5) * 260;
        cy += (Math.random() - 0.5) * 260;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 3. Ornate Ancient Greek Meander Gold Frame (Sharp & High Contrast)
    ctx.strokeStyle = "#c89b3c";
    ctx.lineWidth = 16;
    ctx.strokeRect(36, 36, 952, 952);

    ctx.strokeStyle = "#7a591a";
    ctx.lineWidth = 4;
    ctx.strokeRect(58, 58, 908, 908);

    // Corner Ornaments (Classic Greek Stelae Palmettes)
    const drawCornerOrnament = (x: number, y: number) => {
      ctx.strokeStyle = "#c89b3c";
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 22, y - 22, 44, 44);
      ctx.fillStyle = "#e6c670";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCornerOrnament(58, 58);
    drawCornerOrnament(966, 58);
    drawCornerOrnament(58, 966);
    drawCornerOrnament(966, 966);

    // 4. Header: Face Axis / Dimension & 6th-Row/Column Matrix Label (Crisp bronze)
    ctx.fillStyle = "#3e2912";
    ctx.font = "bold 32px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`— ${faceName.toUpperCase()} • 6η ΣΕΙΡΑ / 6η ΣΤΗΛΗ —`, 512, 135);

    // 5. Center Main Inscribed Phrase (Positioned at y=320 above central ray node so it's 100% visible & unobstructed)
    // Deep carved dark drop-shadow for 3D depth
    ctx.fillStyle = "#1a1005";
    ctx.font = "900 82px 'Times New Roman', Georgia, serif";
    ctx.fillText(phrase, 515, 325);
    ctx.fillText(phrase, 509, 325);

    // Sculpted Gold Gradient Inlay
    const goldGrad = ctx.createLinearGradient(0, 270, 0, 390);
    goldGrad.addColorStop(0, "#f7df8b");
    goldGrad.addColorStop(0.35, "#d4af37");
    goldGrad.addColorStop(0.7, "#966f1e");
    goldGrad.addColorStop(1, "#543b0c");
    ctx.fillStyle = goldGrad;
    ctx.fillText(phrase, 512, 320);

    // 6. Central Axis Ray Intersection Emblem (at exact center 512, 512 where the thin ray exits)
    // Subtle golden solar rosette framing the ray point
    ctx.save();
    ctx.strokeStyle = "#c89b3c";
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(512, 512, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#a17822";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(512, 512, 22, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Subtle Greek crosshairs marking the 6-6-6 axis
    ctx.beginPath();
    ctx.moveTo(512, 455);
    ctx.lineTo(512, 475);
    ctx.moveTo(512, 549);
    ctx.lineTo(512, 569);
    ctx.moveTo(455, 512);
    ctx.lineTo(475, 512);
    ctx.moveTo(549, 512);
    ctx.lineTo(569, 512);
    ctx.stroke();

    ctx.fillStyle = "#8a5e0d";
    ctx.font = "bold 18px monospace";
    ctx.fillText(axisTag, 512, 512);
    ctx.restore();

    // 7. Sacred Isopsephic Numeral: ΧΞϚ (Positioned below central ray node at y=660)
    ctx.fillStyle = "#1a1005";
    ctx.font = "900 148px Georgia, serif";
    ctx.fillText("ΧΞϚ", 516, 665);
    ctx.fillText("ΧΞϚ", 508, 665);

    const numeralGrad = ctx.createLinearGradient(0, 580, 0, 750);
    numeralGrad.addColorStop(0, "#fff0a8");
    numeralGrad.addColorStop(0.3, "#e6c670");
    numeralGrad.addColorStop(0.7, "#c89b3c");
    numeralGrad.addColorStop(1, "#734e0a");
    ctx.fillStyle = numeralGrad;
    ctx.fillText("ΧΞϚ", 512, 660);

    // 8. Value Subtitle: = 666 (ΙΣΟΨΗΦΙΑ)
    ctx.fillStyle = "#8a5e0d";
    ctx.font = "bold 48px monospace";
    ctx.fillText("= 666", 512, 785);

    ctx.fillStyle = "#4a3b2b";
    ctx.font = "italic bold 28px Georgia, serif";
    ctx.fillText("ΛΕΥΚΟΣ ΠΥΡΗΝΑΣ • 6-6-6 ΑΞΟΝΑΣ ΑΠΟΛΛΩΝΟΣ", 512, 875);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  };

  // Play Pure Authentic 432 Hz Pythagorean Sound Synthesis (ΑΚΤΙΝΑ ΔΙΟΣ = 666)
  const playAktinaSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;

      // Pure 432.0 Hz Harmonic Architecture
      // Fundamental 432.00 Hz dominates with natural Pythagorean harmonics (216 Hz, 864 Hz, 1296 Hz)
      const harmonics = [
        { freq: 432.0, gainVal: 0.28, type: "sine" as OscillatorType, decay: 3.6 }, // Pure 432 Hz fundamental master tone
        { freq: 216.0, gainVal: 0.08, type: "sine" as OscillatorType, decay: 3.2 }, // Sub-octave warm resonance
        { freq: 864.0, gainVal: 0.06, type: "sine" as OscillatorType, decay: 2.4 }, // 2nd harmonic octave
        { freq: 1296.0, gainVal: 0.02, type: "sine" as OscillatorType, decay: 1.8 }, // 3rd harmonic brilliance
      ];

      harmonics.forEach(({ freq, gainVal, type, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        // Pristine acoustic chime envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gainVal, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch {
      // ignore
    }
  };

  // Dedicated 5-Second Pure 432 Hz "Aktina Dios" Tone Generator for Space Harmonization
  const triggerPurifying432HzTone = () => {
    // If already active, cancel/stop early
    if (isPurifyingToneActive && purifyingOscRef.current) {
      purifyingOscRef.current.stop();
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const DURATION = 5.0; // 5 Seconds exact

      // Pure Master 432.0 Hz Sine Wave Oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Subtle warm subharmonic (216 Hz) for fullness
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(432.0, now);

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(216.0, now);

      // Smooth 0.25s Fade-In and 0.5s Fade-Out over 5.0 seconds
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.25);
      gain.gain.setValueAtTime(0.35, now + DURATION - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + DURATION);

      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      subGain.gain.setValueAtTime(0.08, now + DURATION - 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.00001, now + DURATION);

      osc.connect(gain);
      gain.connect(ctx.destination);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      osc.start(now);
      subOsc.start(now);

      osc.stop(now + DURATION + 0.1);
      subOsc.stop(now + DURATION + 0.1);

      setIsPurifyingToneActive(true);
      setPurifyingCountdown(5);
      setAktinaVisible(true);

      const countdownInterval = setInterval(() => {
        setPurifyingCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsPurifyingToneActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const stopHandler = () => {
        try {
          const stopTime = ctx.currentTime;
          gain.gain.cancelScheduledValues(stopTime);
          gain.gain.linearRampToValueAtTime(0.00001, stopTime + 0.05);
          subGain.gain.cancelScheduledValues(stopTime);
          subGain.gain.linearRampToValueAtTime(0.00001, stopTime + 0.05);
          setTimeout(() => {
            try {
              osc.stop();
              subOsc.stop();
            } catch {
              // ignore
            }
          }, 60);
        } catch {
          // ignore
        }
        clearInterval(countdownInterval);
        setIsPurifyingToneActive(false);
        setPurifyingCountdown(0);
      };

      purifyingOscRef.current = { stop: stopHandler };

      setTimeout(() => {
        setIsPurifyingToneActive(false);
        setPurifyingCountdown(0);
      }, DURATION * 1000);
    } catch {
      setIsPurifyingToneActive(false);
      setPurifyingCountdown(0);
    }
  };

  // Play Harmonic Expansion / Collapse Chime
  const playChimeSound = (type: "expand" | "collapse" = "expand") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const freqs = type === "collapse" ? [864, 648, 528, 432] : [432, 528, 648, 864];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.7);
      });
    } catch {
      // ignore
    }
  };

  const handleSetExpansion = (val: number) => {
    const isExpanding = val > expansion;
    setExpansion(val);
    targetExpansionRef.current = val;
    playChimeSound(isExpanding ? "expand" : "collapse");
  };

  const handleToggleExpansion = () => {
    if (expansion > 0.15) {
      handleSetExpansion(0);
    } else {
      handleSetExpansion(0.65);
    }
  };

  useEffect(() => {
    if (is3DCollapsed) return;
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 640;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060403, 0.012);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(16, 14, 18);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.setClearColor(0x050403, 1);
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.minDistance = 2.0;
    controls.maxDistance = 75;
    controls.zoomSpeed = 1.3;
    controlsRef.current = controls;

    // 5. WORLD GROUP
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    worldGroupRef.current = worldGroup;

    // 6. SACRED RAYS & AURA GROUP
    // 6 Principal Intersecting Rays through the 6th Row (Y=0), 6th Column (X=0), and 6th Depth (Z=0)
    // Connecting through the exact centers of the 6 faces (+X, -X, +Y, -Y, +Z, -Z)
    // Designed with ultra-thin, razor-sharp laser filament geometry so all inscribed phrases are 100% visible!
    const raysGroup = new THREE.Group();
    worldGroup.add(raysGroup);
    raysGroupRef.current = raysGroup;

    if (rayStyle === "axes_666" || rayStyle === "axes_laser") {
      const actualThickness = rayStyle === "axes_laser" ? 0.0035 : rayThickness;
      const rayLen = 9.8;

      // Radiant Gold-Amber Laser Beam for X & Z axes, and Electric Cyan for Y axis
      const beamMatGold = new THREE.MeshStandardMaterial({
        color: 0xffdf66,
        emissive: 0xffaa00,
        emissiveIntensity: 2.2,
        metalness: 0.95,
        roughness: 0.1,
        transparent: true,
        opacity: 0.92,
      });

      const beamMatCyan = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x0099cc,
        emissiveIntensity: 2.2,
        metalness: 0.95,
        roughness: 0.1,
        transparent: true,
        opacity: 0.92,
      });

      // 6 Principal Axis Beams extending from the 6 center faces outward
      // (+X: Right, -X: Left, +Y: Top, -Y: Bottom, +Z: Front, -Z: Back)
      const axisDirections: { dir: [number, number, number]; mat: THREE.MeshStandardMaterial; name: string }[] = [
        { dir: [1, 0, 0], mat: beamMatGold, name: "6η Στήλη (+X)" },
        { dir: [-1, 0, 0], mat: beamMatGold, name: "6η Στήλη (-X)" },
        { dir: [0, 1, 0], mat: beamMatCyan, name: "6η Σειρά (+Y)" },
        { dir: [0, -1, 0], mat: beamMatCyan, name: "6η Σειρά (-Y)" },
        { dir: [0, 0, 1], mat: beamMatGold, name: "6ο Βάθος (+Z)" },
        { dir: [0, 0, -1], mat: beamMatGold, name: "6ο Βάθος (-Z)" },
      ];

      axisDirections.forEach(({ dir, mat }) => {
        const v = new THREE.Vector3(...dir).normalize();
        // Thin cylinder with radius actualThickness
        const geo = new THREE.CylinderGeometry(actualThickness, actualThickness, rayLen, 16);
        const mesh = new THREE.Mesh(geo, mat);

        // Position from center outward
        const midPoint = v.clone().multiplyScalar(rayLen / 2);
        mesh.position.copy(midPoint);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
        raysGroup.add(mesh);

        // Delicate luminous outer aura cylinder for soft glowing halo
        const auraGeo = new THREE.CylinderGeometry(actualThickness * 2.2, actualThickness * 2.2, rayLen, 12);
        const auraMat = new THREE.MeshBasicMaterial({
          color: mat.color,
          transparent: true,
          opacity: 0.25,
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.position.copy(midPoint);
        auraMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
        raysGroup.add(auraMesh);
      });

      // Central Luminous Nexus Node at (0, 0, 0)
      const nexusGeo = new THREE.SphereGeometry(actualThickness * 3.5, 16, 16);
      const nexusMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const nexus = new THREE.Mesh(nexusGeo, nexusMat);
      raysGroup.add(nexus);
    } else if (rayStyle === "axes_corners") {
      // 8 Sacred Diagonal Corner Rays radiating from (±0.5, ±0.5, ±0.5) outward
      const cornerMatGold = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 0.9,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
      });

      const cornerMatCyan = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x0088cc,
        emissiveIntensity: 0.9,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
      });

      const cornerVectors = [
        [1, 1, 1],
        [-1, 1, 1],
        [1, -1, 1],
        [-1, -1, 1],
        [1, 1, -1],
        [-1, 1, -1],
        [1, -1, -1],
        [-1, -1, -1],
      ];

      cornerVectors.forEach(([cx, cy, cz], idx) => {
        const rayLen = 6.8;
        const geo = new THREE.CylinderGeometry(0.016, 0.03, rayLen, 12);
        const mat = idx % 2 === 0 ? cornerMatGold : cornerMatCyan;
        const rayMesh = new THREE.Mesh(geo, mat);

        const v = new THREE.Vector3(cx, cy, cz).normalize();
        const midPos = v.clone().multiplyScalar(0.72 + rayLen / 2);

        rayMesh.position.copy(midPos);
        rayMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
        raysGroup.add(rayMesh);
      });
    }
    // If rayStyle === "none", raysGroup is empty!

    // 7. PREPARE 6 SACRED PURE WHITE INSCRIBED TEXTURES FOR CENTRAL 666 CUBE (Order: +X, -X, +Y, -Y, +Z, -Z)
    const whiteCoreMaterials: THREE.MeshStandardMaterial[] = [
      new THREE.MeshStandardMaterial({
        map: createPureWhiteFaceTexture("ΛΑΥΡΕΙΟΝ", "Δεξιά (+X)", "+X"),
        roughness: 0.15,
        metalness: 0.05,
        color: 0xffffff,
        emissive: 0x332818,
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        map: createPureWhiteFaceTexture("ΙΑΝΕΥΣ", "Αριστερά (-X)", "-X"),
        roughness: 0.15,
        metalness: 0.05,
        color: 0xffffff,
        emissive: 0x332818,
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        map: createPureWhiteFaceTexture("ΤΕΛΙΑΝΟΣ", "Άνω (+Y)", "+Y"),
        roughness: 0.15,
        metalness: 0.05,
        color: 0xffffff,
        emissive: 0x332818,
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        map: createPureWhiteFaceTexture("Ο ΝΙΚΗΤΗΣ", "Κάτω (-Y)", "-Y"),
        roughness: 0.15,
        metalness: 0.05,
        color: 0xffffff,
        emissive: 0x332818,
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        map: createPureWhiteFaceTexture("Η ΚΑΤΑΝΟΗΣΗ", "Εμπρός (+Z)", "+Z"),
        roughness: 0.15,
        metalness: 0.05,
        color: 0xffffff,
        emissive: 0x332818,
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        map: createPureWhiteFaceTexture("Η ΑΓΑΠΗ ΕΣΤΙΝ", "Όπισθεν (-Z)", "-Z"),
        roughness: 0.15,
        metalness: 0.05,
        color: 0xffffff,
        emissive: 0x332818,
        emissiveIntensity: 0.4,
      }),
    ];

    // Central Core 666 Mesh (Pure Luminous White Alabaster Cube: 0.98 x 0.98 x 0.98)
    const centralCube = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.98, 0.98), whiteCoreMaterials);
    centralCube.userData = { isCentral: true };
    worldGroup.add(centralCube);
    centralCubeRef.current = centralCube;

    // Central Radiant Aura Light
    const pulseLight = new THREE.PointLight(0xfff5e0, 4.2, 18);
    pulseLight.position.set(0, 0, 0);
    worldGroup.add(pulseLight);
    centralPulseLightRef.current = pulseLight;

    // 8. PROCEDURAL METALLIC & PHOSPHORESCENT TEXTURES FOR THE 1.330 OUTER CUBES
    // Layer 1 (Nearest to Core): Radiant Gold-Titanium with Amber Phosphor
    const texGoldTitanium = createMetallicPhosphorTexture("#1c160e", "#5e4822", "#ffd700");
    // Layer 2: Electric Emerald Phosphor (Cyber-Malachite Metal)
    const texEmeraldPhosphor = createMetallicPhosphorTexture("#061f14", "#145237", "#00ff88");
    // Layer 3: Solar Fire / Ruby Metallic with Neon Coral Phosphor
    const texRubyMetallic = createMetallicPhosphorTexture("#26090c", "#63161c", "#ff3366");
    // Layer 4: Celestial Cobalt & Lapis Metallic with Electric Cyan Glow
    const texCobaltCyan = createMetallicPhosphorTexture("#061828", "#153d61", "#00d4ff");
    // Layer 5 (Outer Shell): Platinum-Silver Chrome with Royal Golden-Violet Phosphor
    const texPlatinumSilver = createMetallicPhosphorTexture("#20202a", "#5f5f75", "#e0b0ff");

    const metallicPhosphorMaterials = [
      // Layer 1: Radiant Gold-Titanium
      new THREE.MeshStandardMaterial({
        map: texGoldTitanium,
        color: 0xffcc33,
        roughness: 0.2,
        metalness: 0.94,
        emissive: 0x775500,
        emissiveIntensity: 0.45,
      }),
      // Layer 2: Phosphorescent Emerald
      new THREE.MeshStandardMaterial({
        map: texEmeraldPhosphor,
        color: 0x00ff88,
        roughness: 0.22,
        metalness: 0.9,
        emissive: 0x006633,
        emissiveIntensity: 0.42,
      }),
      // Layer 3: Radiant Ruby Fire
      new THREE.MeshStandardMaterial({
        map: texRubyMetallic,
        color: 0xff2a5f,
        roughness: 0.24,
        metalness: 0.92,
        emissive: 0x66001a,
        emissiveIntensity: 0.4,
      }),
      // Layer 4: Electric Cobalt Cyan
      new THREE.MeshStandardMaterial({
        map: texCobaltCyan,
        color: 0x00d4ff,
        roughness: 0.18,
        metalness: 0.95,
        emissive: 0x004466,
        emissiveIntensity: 0.46,
      }),
      // Layer 5 (Outer Shell): Platinum-Silver Phosphor
      new THREE.MeshStandardMaterial({
        map: texPlatinumSilver,
        color: 0xf0e6ff,
        roughness: 0.16,
        metalness: 0.96,
        emissive: 0x442266,
        emissiveIntensity: 0.4,
      }),
    ];
    outerMaterialsRef.current = metallicPhosphorMaterials;

    // Translucent crystal/hologram material for translucent view
    const translucentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.3,
      transmission: 0.8,
      ior: 1.6,
      emissive: 0x003366,
      emissiveIntensity: 0.2,
    });

    const outerCubesGroup = new THREE.Group();
    worldGroup.add(outerCubesGroup);
    outerCubesGroupRef.current = outerCubesGroup;

    // Cube size: 0.56
    const cubeGeo = new THREE.BoxGeometry(0.56, 0.56, 0.56);
    const initialSpacing = 1.0 + currentExpansionRef.current * 1.75;

    for (let x = 0; x < 11; x++) {
      for (let y = 0; y < 11; y++) {
        for (let z = 0; z < 11; z++) {
          const dx = Math.abs(x - 5);
          const dy = Math.abs(y - 5);
          const dz = Math.abs(z - 5);
          const dist = Math.max(dx, dy, dz);

          // Central cube is rendered separately as the Sacred White Cube
          if (dist === 0) continue;

          // Cross-section cut logic
          const inCutCorner = x > 5 && y > 5 && z > 5;

          const layerIndex = Math.min(dist - 1, metallicPhosphorMaterials.length - 1);
          let chosenMat = metallicPhosphorMaterials[layerIndex];

          if (viewStyle === "translucent") {
            chosenMat = translucentMaterial;
          } else if (viewStyle === "cross_section") {
            if (inCutCorner) {
              continue;
            }
          } else if (viewStyle === "core_only") {
            continue;
          }

          const cube = new THREE.Mesh(cubeGeo, chosenMat);
          const baseX = x - 5;
          const baseY = y - 5;
          const baseZ = z - 5;
          cube.position.set(baseX * initialSpacing, baseY * initialSpacing, baseZ * initialSpacing);
          cube.userData = { dist, x, y, z, baseX, baseY, baseZ };
          outerCubesGroup.add(cube);
        }
      }
    }

    // 9. 3D AXIS NUMBER BADGES & GRID RULERS (1..11 for Columns, Rows, Depths)
    const axesNumbersGroup = new THREE.Group();
    worldGroup.add(axesNumbersGroup);
    axesNumbersGroupRef.current = axesNumbersGroup;

    const xSprites: THREE.Sprite[] = [];
    const ySprites: THREE.Sprite[] = [];
    const zSprites: THREE.Sprite[] = [];

    for (let i = 1; i <= 11; i++) {
      const isCenter = i === 6;
      // X Axis (Columns: 1..11)
      const spX = createAxisNumberBadgeSprite(i, "X", isCenter);
      axesNumbersGroup.add(spX);
      xSprites.push(spX);

      // Y Axis (Rows: 1..11)
      const spY = createAxisNumberBadgeSprite(i, "Y", isCenter);
      axesNumbersGroup.add(spY);
      ySprites.push(spY);

      // Z Axis (Depths: 1..11)
      const spZ = createAxisNumberBadgeSprite(i, "Z", isCenter);
      axesNumbersGroup.add(spZ);
      zSprites.push(spZ);
    }

    const titleX = createAxisTitleSprite("ΣΤΗΛΕΣ (X: 1 - 11)", "#d4af37");
    const titleY = createAxisTitleSprite("ΣΕΙΡΕΣ (Y: 1 - 11)", "#00d4ff");
    const titleZ = createAxisTitleSprite("ΒΑΘΗ (Z: 1 - 11)", "#e0a0ff");
    axesNumbersGroup.add(titleX, titleY, titleZ);

    // 10. SELECTION & HOVER 3D HIGHLIGHT BOX
    const highlightGeo = new THREE.BoxGeometry(0.72, 0.72, 0.72);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0xffea00,
      wireframe: true,
      transparent: true,
      opacity: 0.95,
    });
    const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
    worldGroup.add(highlightMesh);
    highlightMeshRef.current = highlightMesh;

    // 11. LIGHTS (Crisp multi-spectrum lighting for magnificent metallic reflections)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.8);
    dirLight1.position.set(30, 40, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffd700, 1.9);
    dirLight2.position.set(-30, -25, -30);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0x00d4ff, 1.5);
    dirLight3.position.set(0, 35, -35);
    scene.add(dirLight3);

    // 12. RAYCASTER FOR 3D HOVER & CLICK COORDINATE INSPECTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const testObjects: THREE.Object3D[] = [];
      if (centralCubeRef.current) testObjects.push(centralCubeRef.current);
      if (outerCubesGroupRef.current) testObjects.push(...outerCubesGroupRef.current.children);

      const intersects = raycaster.intersectObjects(testObjects, false);
      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        if (obj.userData?.isCentral) {
          setHoveredCubeInfo({
            col: 6,
            row: 6,
            depth: 6,
            index: 666,
            isCentral: true,
            layer: 0,
          });
        } else if (typeof obj.userData?.x === "number") {
          const { x, y, z, dist } = obj.userData;
          const col = x + 1;
          const row = y + 1;
          const depth = z + 1;
          const index = z * 121 + y * 11 + x + 1;
          setHoveredCubeInfo({
            col,
            row,
            depth,
            index,
            isCentral: false,
            layer: dist,
          });
        }
      } else {
        setHoveredCubeInfo(null);
      }
    };

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const testObjects: THREE.Object3D[] = [];
      if (centralCubeRef.current) testObjects.push(centralCubeRef.current);
      if (outerCubesGroupRef.current) testObjects.push(...outerCubesGroupRef.current.children);

      const intersects = raycaster.intersectObjects(testObjects, false);
      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        if (obj.userData?.isCentral) {
          setSelectedCoords({ col: 6, row: 6, depth: 6 });
          triggerAktinaDios();
        } else if (typeof obj.userData?.x === "number") {
          const { x, y, z } = obj.userData;
          setSelectedCoords({ col: x + 1, row: y + 1, depth: z + 1 });
          playChimeSound("collapse");
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", handleCanvasMouseMove);
    renderer.domElement.addEventListener("click", handleCanvasClick);

    // 13. RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 14. ANIMATION LOOP (Smooth Delta Rotation with Instant Seamless Pause)
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth Lerp Expansion of outer cubes radially
      const targetExp = targetExpansionRef.current;
      currentExpansionRef.current += (targetExp - currentExpansionRef.current) * 0.08;
      const spacing = 1.0 + currentExpansionRef.current * 1.75;

      if (outerCubesGroupRef.current) {
        const children = outerCubesGroupRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const mesh = children[i] as THREE.Mesh;
          if (mesh.userData && typeof mesh.userData.baseX === "number") {
            mesh.position.set(
              mesh.userData.baseX * spacing,
              mesh.userData.baseY * spacing,
              mesh.userData.baseZ * spacing
            );
          }
        }
      }

      if (raysGroupRef.current) {
        raysGroupRef.current.scale.set(spacing, spacing, spacing);
      }

      // Update 3D Axis Number Badges and Title Positions
      if (axesNumbersGroupRef.current) {
        axesNumbersGroupRef.current.visible = showNumbersOnAxesRef.current;
        const offset = 6.0 * spacing;
        for (let i = 0; i < 11; i++) {
          const coord = (i - 5) * spacing;
          // X: Columns 1..11
          xSprites[i]?.position.set(coord, -offset, offset);
          // Y: Rows 1..11
          ySprites[i]?.position.set(-offset, coord, offset);
          // Z: Depths 1..11
          zSprites[i]?.position.set(-offset, -offset, coord);
        }

        titleX.position.set(0, -offset - 0.9, offset);
        titleY.position.set(-offset - 0.9, 0, offset);
        titleZ.position.set(-offset, -offset - 0.9, 0);
      }

      // Update Highlight Mesh Box Position based on Selected / Target Coordinates
      if (highlightMeshRef.current) {
        const sel = selectedCoordsRef.current;
        const bx = (sel.col - 6) * spacing;
        const by = (sel.row - 6) * spacing;
        const bz = (sel.depth - 6) * spacing;

        if (sel.col === 6 && sel.row === 6 && sel.depth === 6) {
          highlightMeshRef.current.position.set(0, 0, 0);
          highlightMeshRef.current.scale.set(1.5, 1.5, 1.5);
          (highlightMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xffdf66);
        } else {
          highlightMeshRef.current.position.set(bx, by, bz);
          highlightMeshRef.current.scale.set(1.0, 1.0, 1.0);
          (highlightMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x00f0ff);
        }
      }

      // Smooth Rotation: halts instantly when isPaused is true
      if (worldGroupRef.current && !isPausedRef.current) {
        worldGroupRef.current.rotation.y += delta * 0.18;
      }

      // Phosphorescent breathing pulse
      if (centralPulseLightRef.current) {
        centralPulseLightRef.current.intensity = 3.8 + Math.sin(elapsed * 2.8) * 1.4;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("mousemove", handleCanvasMouseMove);
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      renderer.dispose();
    };
  }, [viewStyle, rayStyle, rayThickness, is3DCollapsed]);

  // Trigger Flash of Zeus
  const triggerAktinaDios = () => {
    setAktinaVisible(true);
    playAktinaSound();

    if (centralPulseLightRef.current) {
      centralPulseLightRef.current.intensity = 22;
      centralPulseLightRef.current.color.setHex(0xffffff);
      setTimeout(() => {
        if (centralPulseLightRef.current) {
          centralPulseLightRef.current.intensity = 3.8;
          centralPulseLightRef.current.color.setHex(0xfff5e0);
        }
      }, 900);
    }

    setTimeout(() => {
      setAktinaVisible(false);
    }, 3800);
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const target = controlsRef.current.target;
    if (direction === "in") {
      camera.position.lerp(target, 0.25);
    } else {
      const dir = camera.position.clone().sub(target).normalize();
      camera.position.addScaledVector(dir, 3.5);
    }
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(16, 14, 18);
    controlsRef.current.target.set(0, 0, 0);
  };

  // Inspect a specific face of the 666 Core Cube directly
  const handleInspectFace = (faceIdx: number) => {
    if (is3DCollapsed) {
      setIs3DCollapsed(false);
    }

    setSelectedFaceIdx(faceIdx);
    setIsPaused(true);

    if (targetExpansionRef.current < 0.4) {
      handleSetExpansion(0.65);
    }

    if (!cameraRef.current || !controlsRef.current) return;

    const targetPos = CORE_666_FACES[faceIdx].cameraPos;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    controls.target.set(0, 0, 0);

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...targetPos);
    let progress = 0;

    const moveCamera = () => {
      progress += 0.05;
      camera.position.lerpVectors(startPos, endPos, progress);
      controls.update();
      if (progress < 1) {
        requestAnimationFrame(moveCamera);
      }
    };
    moveCamera();
  };

  // Focus and contemplate on Central Core 666 directly
  const focusOnCenter = () => {
    if (is3DCollapsed) {
      setIs3DCollapsed(false);
    }
    setIsPaused(true);
    setSelectedCoords({ col: 6, row: 6, depth: 6 });
    setSelectedFaceIdx(0);

    if (targetExpansionRef.current < 0.4) {
      handleSetExpansion(0.65);
    }

    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    controls.target.set(0, 0, 0);

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(0, 0, 8.5);
    let progress = 0;

    const moveCam = () => {
      progress += 0.06;
      camera.position.lerpVectors(startPos, endPos, progress);
      controls.update();
      if (progress < 1) {
        requestAnimationFrame(moveCam);
      }
    };
    moveCam();
  };

  // Keyboard shortcut listener: Spacebar toggles Pause/Play, 'C' or '6' focuses Center 666
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.code === "KeyC" || e.key === "6") {
        e.preventDefault();
        focusOnCenter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute Active Coordinate & Cube Index Data
  const currentCoord = hoveredCubeInfo || {
    col: selectedCoords.col,
    row: selectedCoords.row,
    depth: selectedCoords.depth,
    index: (selectedCoords.depth - 1) * 121 + (selectedCoords.row - 1) * 11 + selectedCoords.col,
    isCentral: selectedCoords.col === 6 && selectedCoords.row === 6 && selectedCoords.depth === 6,
    layer: Math.max(
      Math.abs(selectedCoords.col - 6),
      Math.abs(selectedCoords.row - 6),
      Math.abs(selectedCoords.depth - 6)
    ),
  };

  const getLayerName = (layer: number) => {
    switch (layer) {
      case 0:
        return "Λευκός Αλαβάστρινος Πυρήνας 666 (ΧΞϚ)";
      case 1:
        return "Στρώμα 1: Χρυσός Τιτανίου & Κεχριμπάρι";
      case 2:
        return "Στρώμα 2: Σμαράγδι & Πράσινος Φωσφόρος";
      case 3:
        return "Στρώμα 3: Ρουμπίνι & Ηλιακό Πύρινο Μέταλλο";
      case 4:
        return "Στρώμα 4: Κοβάλτιο & Ηλεκτρικό Κυανό";
      case 5:
        return "Στρώμα 5: Πλατίνα & Βιολετί Φωσφόρισμα";
      default:
        return `Στρώμα ${layer}`;
    }
  };

  const activeFace = selectedFaceIdx !== null ? CORE_666_FACES[selectedFaceIdx] : CORE_666_FACES[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner Overview & View Mode Switcher */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17120e] via-[#201811] to-[#140f0c] border border-[#3e3020] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffd700]" />
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#e6c670]">
              Ο Μέγας Κύβος του Απόλλωνος (11³ = 1331) & Το Ηλιακό Τετράγωνο 666
            </h2>
          </div>
          <p className="text-xs text-[#a89984] font-serif leading-relaxed max-w-3xl">
            Πλήρης τρισδιάστατη αρίθμηση των <strong>1.331 κυβιδίων</strong> σε <strong>11 Στήλες</strong> (X), <strong>11 Σειρές</strong> (Y) και <strong>11 Βάθη</strong> (Z).
            Το κέντρο <strong>(6, 6, 6)</strong> είναι ο <strong>666ος Λευκός Πυρήνας (ΧΞϚ)</strong>, συνδεδεμένος με το <strong>Πέτρινο Ηλιακό Τετράγωνο 36 Κελλιών</strong> και τον <strong>Ψυχογονικό Κύβο (6³ = 216)</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Main Subview Switcher Pills */}
          <div className="flex items-center gap-1 bg-[#0f0b08] p-1 rounded-xl border border-[#3e3020]">
            <button
              onClick={() => setMainSubView("both")}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                mainSubView === "both"
                  ? "bg-[#c89b3c] text-black shadow"
                  : "text-[#a69680] hover:text-[#f5ecd8]"
              }`}
            >
              🌟 Πλήρης Όψη
            </button>
            <button
              onClick={() => setMainSubView("solarSquare")}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1 ${
                mainSubView === "solarSquare"
                  ? "bg-[#c89b3c] text-black shadow"
                  : "text-[#a69680] hover:text-[#f5ecd8]"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Πέτρινο 6×6 (666)</span>
            </button>
            <button
              onClick={() => setMainSubView("cube3d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1 ${
                mainSubView === "cube3d"
                  ? "bg-[#c89b3c] text-black shadow"
                  : "text-[#a69680] hover:text-[#f5ecd8]"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Κύβος 11³</span>
            </button>
          </div>

          {/* Quick Global Pause Button for Study */}
          {mainSubView !== "solarSquare" && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3.5 py-1.5 rounded-xl font-serif text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isPaused
                  ? "bg-[#c89b3c] text-black border border-[#ffd700] ring-2 ring-[#c89b3c]/40 animate-pulse"
                  : "bg-[#251d14] hover:bg-[#34271c] text-[#f5ebd7] border border-[#3e3020]"
              }`}
              title="Παύση / Συνέχιση Περιστροφής (Πλήκτρο Space)"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? "Συνέχιση" : "⏸️ Παύση"}</span>
            </button>
          )}

          <button
            onClick={() => onOpenAiModal?.("ΑΠΟΛΛΩΝΟΣ", 1331, ["ΑΠΟΛΛΩΝΟΣ", "ΚΥΒΟΣ", "ΧΞϚ", "666"])}
            className="px-3.5 py-1.5 rounded-xl bg-[#2a1f14] hover:bg-[#382b1c] border border-[#c89b3c]/50 text-[#e6c670] font-serif text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c89b3c]" />
            <span>Oracle</span>
          </button>
        </div>
      </div>

      {/* If only Stone Solar Square is selected, render it immediately */}
      {mainSubView === "solarSquare" && (
        <StoneSolarSquare onOpenAiModal={onOpenAiModal} />
      )}

      {/* 3D Apollo Cube Workspace (rendered when 'both' or 'cube3d') */}
      {mainSubView !== "solarSquare" && (
        <>
          {/* 3D Radial Dispersion / Expansion Controller */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17120e] via-[#1c1510] to-[#120e0b] border border-[#c89b3c]/40 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleExpansion}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-serif text-sm font-bold transition-all shadow-md cursor-pointer ${
                expansion > 0.15
                  ? "bg-gradient-to-r from-[#c89b3c] to-[#e6c670] text-[#0d0a08] shadow-[#c89b3c]/20 hover:brightness-110"
                  : "bg-[#251d14] text-[#e6c670] border border-[#c89b3c]/50 hover:bg-[#32271c]"
              }`}
            >
              {expansion > 0.15 ? (
                <>
                  <Shrink className="w-4 h-4" />
                  <span>Σύμπτυξη σε Συμπαγή</span>
                </>
              ) : (
                <>
                  <Expand className="w-4 h-4" />
                  <span>Ανάλυση & Αραίωση 11³ (3D Έκρηξη)</span>
                </>
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-[#e6c670]">
                  Αραίωση 1331 Κυβιδίων:
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0c0907] border border-[#3e3020] text-emerald-400 font-bold">
                  {Math.round(expansion * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-[#a89984] font-serif hidden sm:block">
                Ανοίγει τα 1.330 μεταλλικά κυβάκια ομοιόμορφα στο χώρο για απόλυτα καθαρή θέαση
              </p>
            </div>
          </div>

          {/* Quick Presets & Slider */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-[#0e0b08] p-1 rounded-xl border border-[#2a2016]">
              {[
                { label: "0% (Συμπαγής)", val: 0 },
                { label: "35% (Ήπια)", val: 0.35 },
                { label: "65% (Ιδανική)", val: 0.65 },
                { label: "100% (Μέγιστη)", val: 1.0 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => handleSetExpansion(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    Math.abs(expansion - p.val) < 0.05
                      ? "bg-[#c89b3c] text-black font-bold shadow"
                      : "text-[#8c7e6c] hover:text-[#f5ebd7]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 min-w-[130px] sm:min-w-[170px]">
              <Sliders className="w-3.5 h-3.5 text-[#c89b3c]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={expansion}
                onChange={(e) => handleSetExpansion(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#251d14] rounded-lg appearance-none cursor-pointer accent-[#c89b3c]"
                title="Αραίωση Κύβου"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Sacred Faces Interactive Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#14100c] border border-[#2e2318] shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#c89b3c]" />
            <h3 className="font-serif font-bold text-sm text-[#e6c670]">
              Οι 6 Ιερές Πλευρές του Λευκού Πυρήνα 666 (Ανεμπόδιστη Θέαση)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#8c7e6c]">
            Κλικ σε πλευρά για αυτόματη εστίαση κάμερας και άμεση ανάγνωση
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CORE_666_FACES.map((f, idx) => {
            const isSelected = selectedFaceIdx === idx;
            return (
              <button
                key={f.id}
                onClick={() => handleInspectFace(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#281f14] border-[#c89b3c] shadow-md ring-1 ring-[#c89b3c]/50"
                    : "bg-[#100d0a] border-[#292016] hover:border-[#c89b3c]/60 hover:bg-[#18130e]"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1710] text-[#c89b3c] border border-[#382b1d]">
                    {f.axis}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">= 666</span>
                </div>
                <div className="font-serif font-bold text-xs sm:text-sm text-[#f5ecd8] leading-tight">
                  {f.phrase}
                </div>
                <div className="text-[10px] text-[#8c7e6c] truncate mt-1">{f.faceName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D WebGL Canvas Section with Collapsible / Minimizable Screen Container */}
      <div className="space-y-2">
        {/* Compact Header Bar Above Canvas with Open/Close Minimize Toggle & Ray Mode Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#120e0b] border border-[#2e2318] text-xs font-serif shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            {/* Collapse / Minimize Screen Toggle Button */}
            <button
              onClick={() => setIs3DCollapsed(!is3DCollapsed)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251d14] hover:bg-[#34271c] border border-[#c89b3c]/50 text-[#e6c670] font-bold transition-all cursor-pointer shadow-sm"
              title={is3DCollapsed ? "Άνοιγμα / Μεγιστοποίηση 3D Οθόνης" : "Κλείσιμο / Ελαχιστοποίηση 3D Οθόνης"}
            >
              {is3DCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4 text-[#e6c670]" />
                  <span>Άνοιγμα 3D Οθόνης Κύβου</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 text-[#e6c670]" />
                  <span>Ελαχιστοποίηση Οθόνης</span>
                </>
              )}
            </button>

            {/* Pause Status Indicator */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                isPaused
                  ? "bg-[#c89b3c] text-black border-[#ffd700] shadow-sm"
                  : "bg-[#18130e] hover:bg-[#281f16] text-[#e6c670] border-[#3e3020]"
              }`}
              title="Παύση / Συνέχιση Περιστροφής (Space)"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5 text-[#ffd700]" />}
              <span>{isPaused ? "Συνέχιση" : "Παύση (Space)"}</span>
            </button>

            {/* 3D Axis Numbers Toggle */}
            <button
              onClick={() => setShowNumbersOnAxes(!showNumbersOnAxes)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                showNumbersOnAxes
                  ? "bg-[#251d14] text-[#e6c670] border-[#c89b3c]/60 font-bold"
                  : "bg-[#100d0a] text-[#8c7e6c] border-[#292016]"
              }`}
              title="Εμφάνιση / Απόκρυψη 3D αρίθμησης 1-11 στους άξονες"
            >
              <Hash className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Αρίθμηση 11³ {showNumbersOnAxes ? "On" : "Off"}</span>
            </button>

            <div className="hidden xl:flex items-center gap-2">
              <span className="font-bold text-[#e6c670]">ΑΠΟΛΛΩΝΟΣ = 1331 (11³)</span>
              <span className="text-[#8c7e6c]">•</span>
              <span className="text-white font-semibold">Λευκός Πυρήνας = ΧΞϚ (666)</span>
            </div>
          </div>

          {!is3DCollapsed && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Ray Modes Selector (6th Row / Column / Depth Symbolism) */}
              <div className="flex items-center gap-1 bg-[#090705] p-1 rounded-lg border border-[#251b12]">
                <span className="text-[11px] text-[#8c7e6c] px-1.5 font-sans hidden md:inline">Ακτίνες:</span>
                {[
                  {
                    key: "axes_666" as RayStyle,
                    label: "Ακτίνες 666 (6-6-6)",
                    icon: Sparkles,
                    desc: "Διασταυρούμενες λεπτές ακτίνες στα κέντρα των 6 πλευρών (6-6-6)",
                  },
                  {
                    key: "axes_laser" as RayStyle,
                    label: "Laser 666",
                    icon: Zap,
                    desc: "Υπερ-λεπτές laser ακτίνες (0.0035) για μέγιστη διαύγεια κειμένου",
                  },
                  {
                    key: "axes_corners" as RayStyle,
                    label: "Κορυφών (8)",
                    icon: Radio,
                    desc: "Ακτίνες από τις 8 εξωτερικές γωνίες",
                  },
                  {
                    key: "none" as RayStyle,
                    label: "Χωρίς Ακτίνες",
                    icon: Eye,
                    desc: "Πλήρως καθαρός λευκός πυρήνας",
                  },
                ].map((rMode) => {
                  const Icon = rMode.icon;
                  return (
                    <button
                      key={rMode.key}
                      onClick={() => setRayStyle(rMode.key)}
                      className={`px-2 py-1 rounded text-xs font-serif flex items-center gap-1 transition-all cursor-pointer ${
                        rayStyle === rMode.key
                          ? "bg-[#281f15] text-[#e6c670] font-bold border border-[#c89b3c]/50 shadow-sm"
                          : "text-[#8c7e6c] hover:text-[#f5ebd7]"
                      }`}
                      title={rMode.desc}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#c89b3c]" />
                      <span className="hidden sm:inline">{rMode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* View Modes Selector */}
              <div className="flex items-center gap-1 bg-[#090705] p-1 rounded-lg border border-[#251b12]">
                {[
                  { key: "cross_section" as ViewStyle, label: "Τομή", icon: Layers },
                  { key: "core_only" as ViewStyle, label: "Μόνο Πυρήνας", icon: Flame },
                  { key: "translucent" as ViewStyle, label: "Διαφανής", icon: Eye },
                  { key: "solid" as ViewStyle, label: "Συμπαγής", icon: Box },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => setViewStyle(mode.key)}
                      className={`px-2 py-1 rounded text-xs font-serif flex items-center gap-1 transition-all cursor-pointer ${
                        viewStyle === mode.key
                          ? "bg-[#281f15] text-[#e6c670] font-bold border border-[#c89b3c]/50 shadow-sm"
                          : "text-[#8c7e6c] hover:text-[#f5ebd7]"
                      }`}
                      title={`Προβολή: ${mode.label}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Minimized View Placeholder Banner */}
        {is3DCollapsed ? (
          <div
            onClick={() => setIs3DCollapsed(false)}
            className="p-8 rounded-2xl bg-gradient-to-r from-[#140f0c] via-[#1c1510] to-[#140f0c] border border-dashed border-[#c89b3c]/60 text-center cursor-pointer hover:border-[#c89b3c] transition-all group shadow-lg flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#251d14] border border-[#c89b3c]/50 flex items-center justify-center text-[#e6c670] group-hover:scale-110 transition-transform">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#e6c670]">
                Η 3D Οθόνη του Κύβου είναι Ελαχιστοποιημένη
              </h4>
              <p className="text-xs text-[#a89984] font-serif mt-1">
                Κάντε κλικ εδώ ή στο κουμπί «Άνοιγμα 3D Οθόνης Κύβου» για να εμφανιστεί η διαδραστική προβολή των 1.331 κυβιδίων.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIs3DCollapsed(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#c89b3c] hover:bg-[#dfb04d] text-black font-serif font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Expand className="w-4 h-4" />
              <span>Άνοιγμα 3D Προβολής</span>
            </button>
          </div>
        ) : (
          /* Active 3D WebGL Canvas Container */
          <div
            className={`relative w-full rounded-2xl overflow-hidden border border-[#3e3020] bg-[#050403] shadow-2xl transition-all ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none border-none h-screen" : "h-[640px]"
            }`}
          >
            {/* Ray of Zeus Banner */}
            <div
              className={`absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-6 py-2.5 rounded-full bg-red-600/90 text-white border-2 border-red-400 shadow-2xl font-serif font-bold text-sm md:text-base tracking-widest transition-all duration-500 flex items-center gap-2 ${
                aktinaVisible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
              }`}
            >
              <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span>⚡ ΑΚΤΙΝΑ ΔΙΟΣ = 666 (432 Hz) ⚡</span>
            </div>

            {/* Top-Left Live Coordinate HUD & Pause Status Badge */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-xs sm:max-w-sm font-serif pointer-events-none">
              {/* Pause Study Status Pill */}
              {isPaused && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#c89b3c]/90 text-black font-bold text-xs shadow-lg backdrop-blur-sm border border-[#ffd700] pointer-events-auto">
                  <Pause className="w-3.5 h-3.5" />
                  <span>ΠΑΥΣΗ ΕΝΕΡΓΗ — Ελεύθερη Μελέτη</span>
                </div>
              )}

              {/* Dynamic Hover/Selected Coordinate Card with Glassmorphism */}
              <div className="p-3 rounded-xl bg-[#120e0b]/80 hover:bg-[#120e0b]/95 backdrop-blur-md border border-[#c89b3c]/40 text-xs shadow-xl space-y-1.5 transition-all pointer-events-auto">
                <div className="flex items-center justify-between gap-2 border-b border-[#2e2318] pb-1">
                  <div className="flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span className="font-bold text-[#e6c670]">
                      {currentCoord.isCentral ? "ΚΕΝΤΡΙΚΟΣ ΠΥΡΗΝΑΣ" : `ΚΥΒΙΔΙΟ #${currentCoord.index}`}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#090705] text-emerald-400 border border-emerald-900/60 font-bold">
                    {currentCoord.index} / 1331
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
                  <div className="p-1 rounded bg-[#1c140a] border border-[#d4af37]/40 text-[#f5ecd8]">
                    <div className="text-[9px] text-[#d4af37]">ΣΤΗΛΗ X</div>
                    <div className="font-bold text-sm">{currentCoord.col}</div>
                  </div>
                  <div className="p-1 rounded bg-[#0a181c] border border-[#00d4ff]/40 text-[#e0f7ff]">
                    <div className="text-[9px] text-[#00d4ff]">ΣΕΙΡΑ Y</div>
                    <div className="font-bold text-sm">{currentCoord.row}</div>
                  </div>
                  <div className="p-1 rounded bg-[#180a1c] border border-[#e0a0ff]/40 text-[#fae8ff]">
                    <div className="text-[9px] text-[#e0a0ff]">ΒΑΘΟΣ Z</div>
                    <div className="font-bold text-sm">{currentCoord.depth}</div>
                  </div>
                </div>

                <div className="text-[10px] text-[#a89984] pt-0.5">
                  {currentCoord.isCentral ? (
                    <span className="text-[#ffd700] font-bold">
                      🌟 Σημείο (6, 6, 6) = 666ος Κύβος (ΧΞϚ)
                    </span>
                  ) : (
                    <span>{getLayerName(currentCoord.layer)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Minimalist Floating Quick-Controls Dock (Discreet & Non-Intrusive) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#120e0b]/85 backdrop-blur-md border border-[#3e3020]/80 p-1.5 rounded-xl shadow-lg">
              {/* Pause Toggle Button in Dock */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isPaused
                    ? "bg-[#c89b3c] text-black border-[#ffd700]"
                    : "bg-[#221a12]/80 hover:bg-[#32261b] text-[#ffd700] border-[#3e3020]"
                }`}
                title={isPaused ? "Συνέχιση Περιστροφής (Space)" : "Παύση για Μελέτη (Space)"}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              {/* Focus Center Button in Dock */}
              <button
                onClick={focusOnCenter}
                className="p-2 rounded-lg bg-[#221a12]/80 hover:bg-[#32261b] text-[#ffd700] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title="Εστίαση στον Κεντρικό Πυρήνα 666"
              >
                <Target className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom("in")}
                className="p-2 rounded-lg bg-[#221a12]/80 hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title="Μεγέθυνση (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom("out")}
                className="p-2 rounded-lg bg-[#221a12]/80 hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title="Σμίκρυνση (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetCamera}
                className="p-2 rounded-lg bg-[#221a12]/80 hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title="Επαναφορά Κάμερας"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-[#221a12]/80 hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title={isFullscreen ? "Έξοδος Πλήρους Οθόνης" : "Πλήρης Οθόνη"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIs3DCollapsed(true)}
                className="p-2 rounded-lg bg-[#221a12]/80 hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title="Ελαχιστοποίηση Οθόνης"
              >
                <ChevronUp className="w-4 h-4 text-[#e6c670]" />
              </button>
            </div>

            {/* Bottom-Left Live Inscription HUD / Tablet Preview */}
            <div className="absolute bottom-4 left-4 z-20 max-w-xs md:max-w-sm rounded-xl bg-[#120e0b]/90 backdrop-blur-md border border-[#c89b3c]/50 p-3.5 shadow-xl font-serif">
              <div className="flex items-center justify-between gap-2 border-b border-[#2e2318] pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span className="text-[11px] font-bold text-[#e6c670] uppercase tracking-wider">
                    {activeFace.faceName}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-[#090705] px-1.5 py-0.5 rounded border border-emerald-900/60">
                  {activeFace.axis} • 666
                </span>
              </div>
              <div className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>«{activeFace.phrase}»</span>
                <span className="text-xs text-[#c89b3c] font-normal">(ΧΞϚ)</span>
              </div>
              <p className="text-[11px] text-[#a89984] mt-1 leading-snug">
                {activeFace.meaning}
              </p>
              <div className="mt-2 text-[10px] font-mono text-[#c89b3c]/90 bg-[#0c0907] px-2 py-1 rounded border border-[#2a2016]">
                {activeFace.letters}
              </div>
            </div>

            {/* 3D Canvas Mount */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Color & Material Legend Drawer Overlay */}
            {showLegend && (
              <div className="absolute bottom-4 right-4 z-30 w-80 rounded-xl bg-[#14100c]/95 backdrop-blur-md border border-[#3e3020] p-4 shadow-2xl text-xs font-serif animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#2e2318]">
                  <span className="font-bold text-[#e6c670] uppercase tracking-wider">
                    Μεταλλική & Φωσφορίζουσα Δομή
                  </span>
                  <button
                    onClick={() => setShowLegend(false)}
                    className="text-[#8c7e6c] hover:text-[#f5ebd7] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#f0e6ff] border border-violet-400 shrink-0 shadow-sm" />
                    <span className="text-[#d6c7b2]">Στρώμα 5: Πλατίνα & Βιολετί Φωσφόρισμα</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#00d4ff] border border-cyan-400 shrink-0 shadow-sm" />
                    <span className="text-[#d6c7b2]">Στρώμα 4: Κοβάλτιο & Ηλεκτρικό Κυανό</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#ff2a5f] border border-pink-400 shrink-0 shadow-sm" />
                    <span className="text-[#d6c7b2]">Στρώμα 3: Ρουμπίνι & Ηλιακό Πύρινο Μέταλλο</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#00ff88] border border-emerald-400 shrink-0 shadow-sm" />
                    <span className="text-[#d6c7b2]">Στρώμα 2: Σμαράγδι & Πράσινος Φωσφόρος</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#ffd700] border border-amber-400 shrink-0 shadow-sm" />
                    <span className="text-[#d6c7b2]">Στρώμα 1: Χρυσός Τιτανίου & Κεχριμπάρι</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#221a12] flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#ffffff] border-2 border-amber-400 shrink-0 shadow-md ring-2 ring-white/50" />
                    <span className="text-white font-bold">Λευκός Κεντρικός Πυρήνας 666 (ΧΞϚ)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions Modal */}
            {showHelp && (
              <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#14100c] border border-[#c89b3c]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl font-serif text-[#f5ebd7]">
                  <h3 className="text-lg font-bold text-[#e6c670] flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-[#c89b3c]" />
                    Οδηγίες Εξερεύνησης & Μελέτης Κύβου Απόλλωνος
                  </h3>
                  <div className="text-xs text-[#d6c7b2] space-y-2.5 leading-relaxed">
                    <p>
                      • <strong>⏸️ Κουμπί Παύσης (Space):</strong> Πατήστε το κουμπί Παύσης ή το πλήκτρο <code>Space</code> για να παγώσετε την περιστροφή και να μελετήσετε κάθε κυβίδιο και όψη με απόλυτη ηρεμία.
                    </p>
                    <p>
                      • <strong>🔢 Αρίθμηση 11³ (1 έως 11):</strong> Κάθε κυβίδιο ορίζεται από τη Στήλη X (1-11), τη Σειρά Y (1-11) και το Βάθος Z (1-11). Το σημείο (6, 6, 6) είναι ακριβώς ο 666ος Λευκός Πυρήνας!
                    </p>
                    <p>
                      • <strong>🎯 Εστίαση Κέντρου (666):</strong> Πατήστε το πλήκτρο <code>C</code> ή <code>6</code> ή το κουμπί «Εστίαση 666» για άμεση μετάβαση στον κεντρικό πυρήνα.
                    </p>
                    <p>
                      • <strong>Περιστροφή & Εξερεύνηση:</strong> Σύρετε με το ποντίκι ή το δάκτυλο για να περιστρέψετε ελεύθερα τον 3D κύβο.
                    </p>
                    <p>
                      • <strong>Αραίωση (3D Explosion):</strong> Χρησιμοποιήστε το ρυθμιστικό ή το κουμπί Αραίωσης για να απομακρύνετε τα 1.330 μεταλλικά κυβάκια.
                    </p>
                    <p>
                      • <strong>⚡ ΑΚΤΙΝΑ ΔΙΟΣ = 666 (432 Hz):</strong> Πατήστε το κουμπί ή κάντε κλικ <strong>ακριβώς στον κεντρικό λευκό πυρήνα</strong> για να ενεργοποιήσετε την Ακτίνα Διός (ΑΚΤΙΝΑ = 382 + ΔΙΟΣ = 284 = 666) και να ακούσετε τον αυθεντικό, καθαρό φυσικό τόνο των 432 Hz.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="w-full mt-5 py-2.5 rounded-xl bg-[#c89b3c] hover:bg-[#dfb04d] text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Κατάλαβα
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dedicated Bottom Controls Bar Outside the Canvas */}
        {!is3DCollapsed && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#14100c] border border-[#2e2318] shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPaused
                    ? "bg-[#c89b3c] text-black border-[#ffd700] shadow-sm font-bold"
                    : "bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border-[#3e3020]"
                }`}
                title="Παύση / Συνέχιση Περιστροφής (Space)"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5 text-[#ffd700]" />}
                <span>{isPaused ? "Συνέχεια Περιστροφής" : "Παύση (Space)"}</span>
              </button>

              <button
                onClick={focusOnCenter}
                className="px-3.5 py-2 rounded-xl bg-[#251d14] hover:bg-[#34271c] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Εστίαση στον Κεντρικό Πυρήνα 666"
              >
                <Target className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>Μελέτη Κέντρου (6, 6, 6)</span>
              </button>

              <button
                onClick={triggerAktinaDios}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-900/80 via-amber-900/80 to-red-900/80 hover:from-red-800 hover:to-amber-800 border border-red-500/60 text-[#f5ebd7] text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                title="Ενεργοποίηση: ΑΚΤΙΝΑ ΔΙΟΣ = 666 (ΑΚΤΙΝΑ=382 + ΔΙΟΣ=284 = 666) • Αυθεντικός Ήχος 432 Hz"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>ΑΚΤΙΝΑ ΔΙΟΣ = 666 (432 Hz)</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-2 rounded-xl border text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-[#221a12] text-[#e6c670] border-[#c89b3c]/50"
                    : "bg-[#14100c] text-[#8c7e6c] border-[#3e3020]"
                }`}
                title={soundEnabled ? "Ήχος Ενεργός" : "Ήχος Ανενεργός"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? "Ήχος On" : "Ήχος Off"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className={`px-3 py-2 rounded-xl border text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showLegend
                    ? "bg-[#281f15] text-[#e6c670] border-[#c89b3c]"
                    : "bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border-[#3e3020]"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Υπόμνημα Υλικών</span>
              </button>

              <button
                onClick={() => setShowHelp(true)}
                className="p-2 rounded-xl bg-[#221a12] hover:bg-[#32261b] text-[#f5ebd7] border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title="Οδηγίες Χρήσης"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NEW: DEDICATED INTERACTIVE 11x11x11 COORDINATE EXPLORER & STUDY CONSOLE */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17120e] via-[#1e1610] to-[#140f0c] border border-[#c89b3c]/50 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2e2318] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-[#ffd700]" />
              <h3 className="font-serif font-bold text-base md:text-lg text-[#e6c670]">
                🏛️ Διαδραστικός Πίνακας Αρίθμησης & Μελέτης (11 × 11 × 11 = 1.331 Κυβίδια)
              </h3>
            </div>
            <p className="text-xs text-[#a89984] font-serif">
              Πλοηγηθείτε σε οποιαδήποτε <strong>Στήλη (X: 1..11)</strong>, <strong>Σειρά (Y: 1..11)</strong> και <strong>Βάθος (Z: 1..11)</strong>.
              Ο μαθηματικός υπολογισμός παράγει ακριβώς το <strong>666ο κυβίδιο</strong> στο κέντρο <strong>(6, 6, 6)</strong>!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={focusOnCenter}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#e6c670] hover:brightness-110 text-black font-serif font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Κέντρο (6, 6, 6) = 666</span>
            </button>
          </div>
        </div>

        {/* 3 Coordinate Sliders & Direct 1..11 Number Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-serif">
          {/* Column X (Στήλη: 1..11) */}
          <div className="p-4 rounded-xl bg-[#120e0a] border border-[#d4af37]/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                Στήλη (X: 1 έως 11)
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#20170d] text-[#f5ecd8] font-bold border border-[#d4af37]/40">
                {selectedCoords.col} {selectedCoords.col === 6 ? "★ (Κέντρο)" : ""}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="11"
              step="1"
              value={selectedCoords.col}
              onChange={(e) =>
                setSelectedCoords({ ...selectedCoords, col: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-[#251d14] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />

            <div className="grid grid-cols-11 gap-1 pt-1">
              {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedCoords({ ...selectedCoords, col: n })}
                  className={`py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    selectedCoords.col === n
                      ? n === 6
                        ? "bg-[#ffd700] text-black ring-2 ring-white/60 shadow"
                        : "bg-[#d4af37] text-black shadow"
                      : n === 6
                      ? "bg-[#251b0f] text-[#ffd700] border border-[#ffd700]/50 hover:bg-[#342414]"
                      : "bg-[#17120c] text-[#8c7e6c] hover:text-[#f5ecd8] hover:bg-[#221a12]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Row Y (Σειρά: 1..11) */}
          <div className="p-4 rounded-xl bg-[#091316] border border-[#00d4ff]/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00d4ff] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff]" />
                Σειρά (Y: 1 έως 11)
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0d2228] text-[#e0f7ff] font-bold border border-[#00d4ff]/40">
                {selectedCoords.row} {selectedCoords.row === 6 ? "★ (Κέντρο)" : ""}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="11"
              step="1"
              value={selectedCoords.row}
              onChange={(e) =>
                setSelectedCoords({ ...selectedCoords, row: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-[#122830] rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
            />

            <div className="grid grid-cols-11 gap-1 pt-1">
              {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedCoords({ ...selectedCoords, row: n })}
                  className={`py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    selectedCoords.row === n
                      ? n === 6
                        ? "bg-[#00d4ff] text-black ring-2 ring-white/60 shadow"
                        : "bg-[#00b0d8] text-black shadow"
                      : n === 6
                      ? "bg-[#0c242c] text-[#00d4ff] border border-[#00d4ff]/50 hover:bg-[#12303a]"
                      : "bg-[#0d181c] text-[#6c878c] hover:text-[#e0f7ff] hover:bg-[#15252c]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Depth Z (Βάθος: 1..11) */}
          <div className="p-4 rounded-xl bg-[#140b17] border border-[#e0a0ff]/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e0a0ff] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e0a0ff]" />
                Βάθος (Z: 1 έως 11)
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#231228] text-[#fae8ff] font-bold border border-[#e0a0ff]/40">
                {selectedCoords.depth} {selectedCoords.depth === 6 ? "★ (Κέντρο)" : ""}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="11"
              step="1"
              value={selectedCoords.depth}
              onChange={(e) =>
                setSelectedCoords({ ...selectedCoords, depth: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-[#281530] rounded-lg appearance-none cursor-pointer accent-[#e0a0ff]"
            />

            <div className="grid grid-cols-11 gap-1 pt-1">
              {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedCoords({ ...selectedCoords, depth: n })}
                  className={`py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    selectedCoords.depth === n
                      ? n === 6
                        ? "bg-[#e0a0ff] text-black ring-2 ring-white/60 shadow"
                        : "bg-[#c880e6] text-black shadow"
                      : n === 6
                      ? "bg-[#24102c] text-[#e0a0ff] border border-[#e0a0ff]/50 hover:bg-[#32163d]"
                      : "bg-[#180e1c] text-[#8c6c8c] hover:text-[#fae8ff] hover:bg-[#25152c]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Mathematical Formula & Isopsephic Apollo Verification Banner */}
        <div className="p-4 rounded-xl bg-[#100d0a] border border-[#3e3020] flex flex-col md:flex-row md:items-center justify-between gap-4 font-serif">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e6c670]">Μαθηματική Σχέση Θέσης:</span>
              <span className="font-mono text-xs text-white bg-[#1c150e] px-2 py-0.5 rounded border border-[#382b1d]">
                Αριθμός = (Z - 1) × 121 + (Y - 1) × 11 + X
              </span>
            </div>
            <div className="text-xs text-[#a89984]">
              Συντεταγμένες: <strong className="text-[#f5ecd8]">({selectedCoords.col}, {selectedCoords.row}, {selectedCoords.depth})</strong>
              {" ➔ "}
              Υπολογισμός: <span className="font-mono text-[#c89b3c]">({selectedCoords.depth - 1} × 121) + ({selectedCoords.row - 1} × 11) + {selectedCoords.col}</span>
              {" = "}
              <strong className="text-emerald-400 font-mono text-sm">
                {(selectedCoords.depth - 1) * 121 + (selectedCoords.row - 1) * 11 + selectedCoords.col}
              </strong>
              {" "}από 1.331 κυβίδια
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedCoords.col === 6 && selectedCoords.row === 6 && selectedCoords.depth === 6 ? (
              <div className="px-4 py-2 rounded-xl bg-[#281e10] border border-[#ffd700] text-[#ffd700] font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>ΛΕΥΚΟΣ ΠΥΡΗΝΑΣ (666) - ΧΞϚ</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-[#18130e] border border-[#2a2016] text-[#a89984] text-xs">
                {getLayerName(
                  Math.max(
                    Math.abs(selectedCoords.col - 6),
                    Math.abs(selectedCoords.row - 6),
                    Math.abs(selectedCoords.depth - 6)
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6 Sacred Core Inscriptions Detailed Cards */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-base text-[#e6c670] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c89b3c]" />
          <span>Ανάλυση των 6 Λαξευμένων Πλευρών του Λευκού Πυρήνα (666)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORE_666_FACES.map((face, fIdx) => (
            <div
              key={face.id}
              onClick={() => handleInspectFace(fIdx)}
              className="p-4 rounded-xl bg-[#14100c] border border-[#2e2318] hover:border-[#c89b3c] transition-all cursor-pointer space-y-2 group shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif text-[#c89b3c] font-bold bg-[#1e1710] px-2 py-0.5 rounded border border-[#382b1d]">
                  {face.faceName}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                  {face.sum} (ΧΞϚ)
                </span>
              </div>

              <div className="text-lg font-serif font-bold text-[#f5ecd8] group-hover:text-[#e6c670] transition-colors">
                «{face.phrase}»
              </div>

              <p className="text-xs font-serif text-[#a89984]">{face.meaning}</p>

              <div className="text-[11px] font-mono text-[#736655] pt-1.5 border-t border-[#221a12] break-words">
                {face.letters}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Section: Pure 432 Hz Space Harmonization & Aktina Dios */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17120e] via-[#241910] to-[#17120e] border border-[#c89b3c]/60 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffd700] animate-pulse" />
              <h3 className="font-serif font-bold text-base md:text-lg text-[#e6c670]">
                Ψηφιακή «Ακτίνα Διός» — Καθαρός Τόνος 432 Hz (5 Δευτερόλεπτα)
              </h3>
            </div>
            <p className="text-xs text-[#d6c7b2] font-serif leading-relaxed max-w-3xl">
              Εκπομπή καθαρού συνεχούς ημιτονοειδούς τόνου στα <strong>432,00 Hz</strong> με φυσικό υπόβαθρο 216 Hz για 5 δευτερόλεπτα.
              Συνδέεται με τη λεξαριθμική τιμή <strong>«ΑΚΤΙΝΑ ΔΙΟΣ = 666»</strong> και τις αρμονικές συχνότητες του πυθαγόρειου κουρδίσματος για τον καθαρισμό και την αρμονία του χώρου.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={triggerPurifying432HzTone}
              className={`px-5 py-3 rounded-xl font-serif text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer shadow-lg touch-manipulation min-h-[48px] ${
                isPurifyingToneActive
                  ? "bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black ring-4 ring-yellow-400/40 shadow-yellow-500/30 scale-105 animate-pulse"
                  : "bg-gradient-to-r from-[#8a2216] via-[#b36a18] to-[#8a2216] hover:from-[#a62b1c] hover:to-[#c9781c] text-[#fff6e6] border border-[#ffd700]/70 hover:shadow-amber-900/50"
              }`}
              title="Ενεργοποίηση καθαρού τόνου 432 Hz για 5 δευτερόλεπτα"
            >
              <Zap className={`w-5 h-5 ${isPurifyingToneActive ? "text-black animate-spin" : "text-yellow-300"}`} />
              <span>
                {isPurifyingToneActive
                  ? `ΕΚΠΟΜΠΗ 432 Hz (${purifyingCountdown}s) — Διακοπή`
                  : "⚡ Ενεργοποίηση Ακτίνας Διός (432 Hz • 5s)"}
              </span>
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer / Status Bar when tone is active */}
        {isPurifyingToneActive && (
          <div className="p-5 rounded-xl bg-[#0c0907] border border-amber-500/50 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-serif text-[#f5ecd8]">
                  Κυματομορφή & Ήχος: <strong className="text-[#ffd700] font-mono">432.00 Hz</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-full sm:w-48 h-2 bg-[#22180e] rounded-full overflow-hidden border border-[#3e3020]">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${(purifyingCountdown / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                  {purifyingCountdown}s
                </span>
              </div>
            </div>

            {/* Chladni Cymatics & Apollo Sun Harmony Visualizer */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-[#140e0a] border border-[#2a1e12] relative overflow-hidden space-y-4">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                {/* Chladni Geometric Standing Wave Sand Plate Simulation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-orange-500/20 blur-xl animate-pulse" />

                {/* Chladni Nodal Geometry Patterns (Concentric nodal lines) */}
                <div className="absolute inset-2 rounded-full border border-amber-400/30 animate-spin" style={{ animationDuration: "30s" }} />
                <div className="absolute inset-6 rounded-full border-2 border-dashed border-amber-400/60 animate-spin" style={{ animationDuration: "18s" }} />
                <div className="absolute inset-12 rounded-full border border-yellow-300/50 animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
                <div className="absolute inset-20 rounded-full border border-amber-500/60 animate-pulse" />
                
                {/* Chladni Harmonics Crosshairs & Diagonals (Standing Wave Nodes) */}
                <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                <div className="absolute h-full w-[1.5px] bg-gradient-to-b from-transparent via-amber-400/60 to-transparent" />
                <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent rotate-45" />
                <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent -rotate-45" />
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-amber-200/30 to-transparent rotate-[22.5deg]" />
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-amber-200/30 to-transparent -rotate-[22.5deg]" />

                {/* Central Apollo Sun Icon & Solar Disc */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-200 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.8)] border-2 border-yellow-200 animate-pulse">
                  <Sun className="w-16 h-16 sm:w-18 sm:h-18 text-[#1a1005] animate-spin" style={{ animationDuration: "20s" }} />
                  <span className="text-[9px] font-serif font-black text-[#1a1005] uppercase tracking-wider mt-0.5">
                    ΑΠΟΛΛΩΝ 432Hz
                  </span>
                </div>
              </div>

              {/* Apollo Sun Harmony Badge Card */}
              <div className="p-3 rounded-xl bg-[#1d1610] border border-[#c89b3c]/50 flex items-center gap-3 shadow-lg max-w-sm w-full">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shrink-0 shadow-md">
                  <Sun className="w-6 h-6 text-[#140e0a]" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#ffd700]">
                      Αρμονία 432 Hz & Ήλιος Απόλλωνος
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      666 / 1331
                    </span>
                  </div>
                  <p className="text-[11px] text-[#d6c7b2] font-serif truncate mt-0.5">
                    Κυματικό πρότυπο Chladni & 3D Κύβος 11³
                  </p>
                </div>
              </div>

              {/* Dynamic Waveform Frequency Bars */}
              <div className="flex items-center justify-center gap-1 w-full max-w-xs h-7">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-amber-600 via-yellow-400 to-yellow-200 rounded-t transition-all duration-150 animate-pulse"
                    style={{
                      height: `${25 + Math.sin((i / 28) * Math.PI * 4 + Date.now() / 200) * 45 + (i % 4) * 10}%`,
                      animationDelay: `${i * 35}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-[#14100c] border border-[#2e2318]">
          <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#c89b3c]" />
            11³ = 1.331 = ΑΠΟΛΛΩΝΟΣ
          </h3>
          <p className="text-xs text-[#a89984] leading-relaxed font-serif">
            Ο αριθμός 1.331 αποτελεί τον τέλειο κύβο της ενδεκάδος (11 × 11 × 11 = 1.331).
            Στην ιωνική ισοψηφία, <strong>ΑΠΟΛΛΩΝΟΣ = 1.331</strong> (1 + 80 + 70 + 30 + 30 + 800 + 50 + 70 + 200 = 1.331).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#14100c] border border-[#2e2318]">
          <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#c89b3c]" />
            ΑΚΤΙΝΑ ΔΙΟΣ = 666 (432 Hz)
          </h3>
          <p className="text-xs text-[#a89984] leading-relaxed font-serif">
            Η ιερή ισοψηφία <strong>«ΑΚΤΙΝΑ ΔΙΟΣ» ισούται με 666</strong> (ΑΚΤΙΝΑ = 382 + ΔΙΟΣ = 284 = 666).
            Οι διασταυρούμενες ακτίνες διέρχονται από την <strong>6η σειρά</strong>, <strong>6η στήλη</strong> και <strong>6ο βάθος</strong> του κύβου, ενώ η ενεργοποίηση εκπέμπει τον αυθεντικό αρμονικό τόνο των <strong>432 Hz</strong>.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#14100c] border border-[#2e2318]">
          <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#c89b3c]" />
            Μεταλλική & Φωσφορίζουσα Δομή
          </h3>
          <p className="text-xs text-[#a89984] leading-relaxed font-serif">
            Τα 1.330 εξωτερικά κυβίδια είναι διαμορφωμένα με μεταλλικές ανακλάσεις (χρυσό τιτανίου, σμαράγδι, ρουμπίνι, κυανό κοβάλτιο, πλατίνα)
            και φωσφορίζουσες ακμές που πάλλονται αρμονικά.
          </p>
        </div>
      </div>
    </>
  )}

  {/* In 'both' mode, render the full stone-carved solar square and sacred geometry section */}
  {mainSubView === "both" && (
    <div className="pt-6 border-t border-[#3e3020]">
      <StoneSolarSquare onOpenAiModal={onOpenAiModal} />
    </div>
  )}
</div>
  );
};
