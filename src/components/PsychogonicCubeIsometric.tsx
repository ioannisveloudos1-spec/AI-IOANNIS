import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Layers,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Eye,
  Sliders,
  Maximize2,
  Volume2,
  VolumeX,
  Compass,
  Hash,
  Columns,
  Scale,
  CheckCircle2,
  ArrowRightLeft,
  BookOpen,
} from "lucide-react";
import { PsychogonicHistoricalContext } from "./PsychogonicHistoricalContext";

export type PsychogonicViewMode =
  | "solid"
  | "pythagorean_triple" // 3^3 (27) + 4^3 (64) + 5^3 (125) = 216
  | "layers" // 6 layers of 36
  | "shells" // 2^3 (8) nucleus, 4^3-2^3 (56), 6^3-4^3 (152)
  | "core" // only the 2x2x2 core
  | "solar_mapping"; // 1..36 corresponding solar square values

interface Voxel {
  x: number; // 0..N-1
  y: number; // 0..N-1
  z: number; // 0..N-1 (layer)
  id: string;
  linearIndex: number; // 1..N^3
  solarVal: number; // 1..36 (or N^2)
  pythagoreanGroup: "3cube" | "4cube" | "5cube" | "other";
  shellGroup: "core" | "middle" | "outer";
}

interface CubePreset {
  n: number;
  name: string;
  isopsephyNote: string;
  pythagoreanMeaning: string;
  color: string;
}

const COMPARISON_PRESETS: CubePreset[] = [
  {
    n: 1,
    name: "Μονάς (1³ = 1)",
    isopsephyNote: "ΜΟΝΑΣ = 361 | Α = 1",
    pythagoreanMeaning: "Η αδιαίρετη Αρχή και ρίζα πάντων των αριθμών και των διαστάσεων.",
    color: "#e2e8f0",
  },
  {
    n: 2,
    name: "Δυάς / Οκτάς (2³ = 8)",
    isopsephyNote: "ΟΚΤΑΣ = 591 | ΑΘΗΝΑ = 69 / 79",
    pythagoreanMeaning: "Ο πρώτος στερεός κύβος της γεωμετρίας. Ιερός αριθμός της Αθηνάς και της δικαιοσύνης.",
    color: "#38bdf8",
  },
  {
    n: 3,
    name: "Τριάς / Νους (3³ = 27)",
    isopsephyNote: "ΝΟΥΣ = 720 | ΑΡΜΟΝΙΑ = 232",
    pythagoreanMeaning: "Ο κύβος του πρώτου περιττού αριθμού. Αντιπροσωπεύει τη νόηση, το πνεύμα και την αρμονία.",
    color: "#fbbf24",
  },
  {
    n: 4,
    name: "Τετράς / Αλήθεια (4³ = 64)",
    isopsephyNote: "ΑΛΗΘΕΙΑ = 64 | 8² = 4³ = 64",
    pythagoreanMeaning: "Ο κύβος της Τετράδος και ταυτόχρονα το τετράγωνο της Οκτάδος (8²=64). Συμβολίζει την ακλόνητη Αλήθεια.",
    color: "#34d399",
  },
  {
    n: 5,
    name: "Πεντάς / Ζωή (5³ = 125)",
    isopsephyNote: "ΖΩΗ = 815 | Σφαιρικός αριθμός (5 × 5 × 5 = 125)",
    pythagoreanMeaning: "Ο κύβος της Πεντάδος (Γάμος περιττού και αρτίου: 2+3=5). Αναπαράγει πάντοτε το 5 στην τελευταία θέση.",
    color: "#f43f5e",
  },
  {
    n: 6,
    name: "Ψυχογονικός (6³ = 216)",
    isopsephyNote: "3³ + 4³ + 5³ = 216 | 6 × 36 = 216",
    pythagoreanMeaning: "Ο Ψυχογονικός Κύβος: Το μοναδικό στερεό όπου Εμβαδόν Εδρών (6×36) = Όγκος (216). Περίοδος 7μηνης κυήσεως.",
    color: "#ffd700",
  },
  {
    n: 7,
    name: "Επτάς / Παρθένος (7³ = 343)",
    isopsephyNote: "ΕΒΔΟΜΑΣ = 320 | ΠΑΡΘΕΝΟΣ = 445",
    pythagoreanMeaning: "Ο κύβος της ιεράς Επτάδος («Αμήτωρ και Παρθένος», καθώς δεν γεννάται εντός της δεκάδος).",
    color: "#c084fc",
  },
  {
    n: 8,
    name: "Οκτάς (8³ = 512)",
    isopsephyNote: "2⁹ = 512 | Δυαδική αρμονία",
    pythagoreanMeaning: "Ο κύβος του πρώτου κύβου (2³)³ = 512. Απόλυτη δυαδική γεωμετρική συμμετρία.",
    color: "#f59e0b",
  },
  {
    n: 9,
    name: "Εννεάς / Πλάτων (9³ = 729)",
    isopsephyNote: "Ημέρες & Νύκτες ενιαυτού (Πλάτων, Πολιτεία 587e)",
    pythagoreanMeaning: "Ο μέγας Πλατωνικός αριθμός: 729 = 27² = 9³ = 3⁶. Οι ημέρες (364.5) και νύχτες (364.5) του ηλιακού έτους.",
    color: "#ec4899",
  },
  {
    n: 10,
    name: "Δεκάς / Τετρακτύς (10³ = 1000)",
    isopsephyNote: "ΤΕΤΡΑΚΤΥΣ = 1111 | ΧΙΛΙΑΣ = 851",
    pythagoreanMeaning: "Ο κύβος της τέλειας Δεκάδος (1+2+3+4=10). Η πλήρης κοσμική χιλιάδα.",
    color: "#a855f7",
  },
  {
    n: 11,
    name: "Κύβος Απόλλωνος (11³ = 1331)",
    isopsephyNote: "1331 = (10+1)³ | 11² = 121",
    pythagoreanMeaning: "Ο υπερβατικός κύβος της ενδεκάδος, που εμπεριέχει τα παλινδρομικά ηλιακά μοτίβα (1, 3, 3, 1).",
    color: "#ffd700",
  },
  {
    n: 12,
    name: "Δωδεκάς / Ζωδιακός (12³ = 1728)",
    isopsephyNote: "12 Ζώδια | ΔΩΔΕΚΑΕΔΡΟΝ = 1070",
    pythagoreanMeaning: "Ο κοσμικός κύβος της Δωδεκάδος (12 μήνες, 12 ζώδια, 12 Ολύμπιοι). Το πλήρες αρμονικό στερεό.",
    color: "#38bdf8",
  },
];

export const PsychogonicCubeIsometric: React.FC = () => {
  // View & Interactive State
  const [viewMode, setViewMode] = useState<PsychogonicViewMode>("pythagorean_triple");
  const [explosion, setExplosion] = useState<number>(12); // layer separation distance
  const [activeLayerFilter, setActiveLayerFilter] = useState<number | "all">("all");
  const [hoveredVoxel, setHoveredVoxel] = useState<Voxel | null>(null);
  const [selectedVoxel, setSelectedVoxel] = useState<Voxel | null>(null);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCoordinateGuides, setShowCoordinateGuides] = useState<boolean>(true);

  // Side-by-Side Comparison State
  const [isSideBySide, setIsSideBySide] = useState<boolean>(false);
  const [compareN, setCompareN] = useState<number>(3); // default comparison with 3³=27 or 4³=64
  const [compareExplosion, setCompareExplosion] = useState<number>(8);
  const [hoveredCompareVoxel, setHoveredCompareVoxel] = useState<Voxel | null>(null);

  // 3D Angles (in degrees)
  const [rotY, setRotY] = useState<number>(35); // rotation around vertical axis
  const [rotX, setRotX] = useState<number>(30); // tilt elevation
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);

  // Generate 216 Voxels for Psychogonic Cube (6x6x6)
  const psychogonicVoxels = useMemo<Voxel[]>(() => {
    const list: Voxel[] = [];
    for (let z = 0; z < 6; z++) {
      for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
          const linearIndex = z * 36 + y * 6 + x + 1; // 1..216
          const solarVal = y * 6 + x + 1; // 1..36

          // Pythagorean Triple Partition: 3^3 (27) + 4^3 (64) + 5^3 (125) = 216
          let pythagoreanGroup: "3cube" | "4cube" | "5cube" = "5cube";
          if (linearIndex <= 27) {
            pythagoreanGroup = "3cube"; // 3³ = 27 voxels
          } else if (linearIndex <= 27 + 64) {
            pythagoreanGroup = "4cube"; // 4³ = 64 voxels
          } else {
            pythagoreanGroup = "5cube"; // 5³ = 125 voxels
          }

          // Shell group:
          let shellGroup: "core" | "middle" | "outer" = "outer";
          if (x >= 2 && x <= 3 && y >= 2 && y <= 3 && z >= 2 && z <= 3) {
            shellGroup = "core";
          } else if (x >= 1 && x <= 4 && y >= 1 && y <= 4 && z >= 1 && z <= 4) {
            shellGroup = "middle";
          } else {
            shellGroup = "outer";
          }

          list.push({
            x,
            y,
            z,
            id: `psycho-v-${x}-${y}-${z}`,
            linearIndex,
            solarVal,
            pythagoreanGroup,
            shellGroup,
          });
        }
      }
    }
    return list;
  }, []);

  // Generate Voxels for Comparison Cube (N x N x N)
  const compareVoxels = useMemo<Voxel[]>(() => {
    const list: Voxel[] = [];
    const n = Math.min(12, Math.max(1, compareN));
    for (let z = 0; z < n; z++) {
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const linearIndex = z * n * n + y * n + x + 1;
          const solarVal = y * n + x + 1;

          list.push({
            x,
            y,
            z,
            id: `comp-v-${x}-${y}-${z}`,
            linearIndex,
            solarVal,
            pythagoreanGroup: "other",
            shellGroup: "outer",
          });
        }
      }
    }
    return list;
  }, [compareN]);

  // Filter voxels based on active layer or view mode
  const filteredPsychogonicVoxels = useMemo(() => {
    return psychogonicVoxels.filter((v) => {
      if (activeLayerFilter !== "all" && v.z !== activeLayerFilter) {
        return false;
      }
      if (viewMode === "core" && v.shellGroup !== "core") {
        return false;
      }
      return true;
    });
  }, [psychogonicVoxels, activeLayerFilter, viewMode]);

  // Audio tone generator for 216Hz or proportional frequency
  const playFrequencyTone = (freq = 216) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not supported
    }
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.8) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Mouse drag to rotate
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    setRotY((prev) => (prev + deltaX * 0.6) % 360);
    setRotX((prev) => Math.max(10, Math.min(80, prev - deltaY * 0.4)));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Isometric 3D Projection Math
  const cubeSize = isSideBySide ? 18 : 24;
  const baseSpacing = isSideBySide ? 1.5 : 2;

  const radY = (rotY * Math.PI) / 180;
  const radX = (rotX * Math.PI) / 180;

  // Generic 3D projection function for any cube of size N centered at origin
  const projectVoxelPoint = (
    x: number,
    y: number,
    z: number,
    n: number,
    currentExplosion: number,
    customZoom = zoom
  ) => {
    const centerOffset = (n - 1) / 2;
    const cx = (x - centerOffset) * (cubeSize + baseSpacing);
    const cy = (y - centerOffset) * (cubeSize + baseSpacing);
    const cz = (z - centerOffset) * (cubeSize + baseSpacing + currentExplosion);

    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const x1 = cx * cosY + cy * sinY;
    const y1 = -cx * sinY + cy * cosY;
    const z1 = cz;

    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    return {
      screenX: x2 * customZoom,
      screenY: y2 * customZoom,
      depth: z2,
    };
  };

  // Projected Psychogonic Voxels (6x6x6)
  const projectedPsychogonicVoxels = useMemo(() => {
    return filteredPsychogonicVoxels.map((v) => {
      const proj = projectVoxelPoint(v.x, v.y, v.z, 6, explosion, zoom);
      return {
        voxel: v,
        screenX: proj.screenX,
        screenY: proj.screenY,
        depth: proj.depth,
      };
    }).sort((a, b) => a.depth - b.depth);
  }, [filteredPsychogonicVoxels, explosion, radY, radX, zoom, isSideBySide]);

  // Projected Comparison Voxels (NxNxN)
  const projectedCompareVoxels = useMemo(() => {
    const n = Math.min(12, Math.max(1, compareN));
    // Scale zoom dynamically based on N so large cubes fit into viewport
    const compScale = n > 9 ? 0.65 : n > 7 ? 0.75 : n > 5 ? 0.88 : 1.0;
    return compareVoxels.map((v) => {
      const proj = projectVoxelPoint(v.x, v.y, v.z, n, compareExplosion, zoom * compScale);
      return {
        voxel: v,
        screenX: proj.screenX,
        screenY: proj.screenY,
        depth: proj.depth,
      };
    }).sort((a, b) => a.depth - b.depth);
  }, [compareVoxels, compareN, compareExplosion, radY, radX, zoom, isSideBySide]);

  // Color mapping for 6x6x6 Psychogonic Cube
  const getPsychogonicColors = (v: Voxel, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return { top: "#ffe066", left: "#ffd700", right: "#d4af37", stroke: "#ffffff", text: "#120d07" };
    }
    if (isHovered) {
      return { top: "#ffec99", left: "#ffd43b", right: "#f59f00", stroke: "#ffd700", text: "#120d07" };
    }

    if (viewMode === "solid") {
      return { top: "#a67c38", left: "#7a5621", right: "#543912", stroke: "#c89b3c", text: "#f5ecd8" };
    }

    if (viewMode === "pythagorean_triple") {
      if (v.pythagoreanGroup === "3cube") {
        return { top: "#fbbf24", left: "#d97706", right: "#92400e", stroke: "#fef3c7", text: "#120d07" };
      } else if (v.pythagoreanGroup === "4cube") {
        return { top: "#38bdf8", left: "#0284c7", right: "#0369a1", stroke: "#bae6fd", text: "#082f49" };
      } else {
        return { top: "#f43f5e", left: "#be123c", right: "#881337", stroke: "#fecdd3", text: "#4c0519" };
      }
    }

    if (viewMode === "layers") {
      const layerPalettes = [
        { top: "#ef4444", left: "#b91c1c", right: "#7f1d1d", stroke: "#fca5a5" },
        { top: "#f97316", left: "#c2410c", right: "#7c2d12", stroke: "#fdba74" },
        { top: "#eab308", left: "#a16207", right: "#713f12", stroke: "#fde047" },
        { top: "#10b981", left: "#047857", right: "#064e3b", stroke: "#6ee7b7" },
        { top: "#06b6d4", left: "#0e7490", right: "#155e75", stroke: "#67e8f9" },
        { top: "#8b5cf6", left: "#6d28d9", right: "#4c1d95", stroke: "#c4b5fd" },
      ];
      const p = layerPalettes[v.z] || layerPalettes[0];
      return { ...p, text: "#ffffff" };
    }

    if (viewMode === "shells") {
      if (v.shellGroup === "core") {
        return { top: "#ffd700", left: "#eab308", right: "#a16207", stroke: "#ffffff", text: "#120d07" };
      } else if (v.shellGroup === "middle") {
        return { top: "#38bdf8", left: "#0284c7", right: "#0369a1", stroke: "#7dd3fc", text: "#ffffff" };
      } else {
        return { top: "#64748b", left: "#475569", right: "#334155", stroke: "#94a3b8", text: "#f8fafc" };
      }
    }

    if (viewMode === "core") {
      return { top: "#ffd700", left: "#eab308", right: "#a16207", stroke: "#fff2a8", text: "#120d07" };
    }

    // Solar Mapping
    return { top: "#e2b866", left: "#a67c38", right: "#6d4e1c", stroke: "#ffd700", text: "#1c130b" };
  };

  // Color mapping for Comparison Cube (NxNxN)
  const getCompareColors = (v: Voxel, isHovered: boolean) => {
    if (isHovered) {
      return { top: "#a7f3d0", left: "#34d399", right: "#059669", stroke: "#ffffff", text: "#064e3b" };
    }
    // Color themed by active preset or value N
    if (compareN === 1) {
      return { top: "#cbd5e1", left: "#94a3b8", right: "#64748b", stroke: "#f1f5f9", text: "#0f172a" };
    }
    if (compareN === 2) {
      return { top: "#38bdf8", left: "#0284c7", right: "#0369a1", stroke: "#bae6fd", text: "#082f49" };
    }
    if (compareN === 3) {
      return { top: "#fbbf24", left: "#d97706", right: "#92400e", stroke: "#fef3c7", text: "#120d07" };
    }
    if (compareN === 4) {
      return { top: "#34d399", left: "#059669", right: "#065f46", stroke: "#a7f3d0", text: "#022c22" };
    }
    if (compareN === 5) {
      return { top: "#f43f5e", left: "#be123c", right: "#881337", stroke: "#fecdd3", text: "#4c0519" };
    }
    if (compareN === 6) {
      return { top: "#ffd700", left: "#ca8a04", right: "#854d0e", stroke: "#fef08a", text: "#422006" };
    }
    if (compareN === 7) {
      return { top: "#c084fc", left: "#9333ea", right: "#6b21a8", stroke: "#e9d5ff", text: "#3b0764" };
    }
    if (compareN === 8) {
      return { top: "#f59e0b", left: "#d97706", right: "#b45309", stroke: "#fde68a", text: "#451a03" };
    }
    if (compareN === 9) {
      return { top: "#ec4899", left: "#db2777", right: "#9d174d", stroke: "#fbcfe8", text: "#500724" };
    }
    if (compareN === 10) {
      return { top: "#a855f7", left: "#7e22ce", right: "#581c87", stroke: "#f3e8ff", text: "#2e1065" };
    }
    if (compareN === 11) {
      return { top: "#fbbf24", left: "#b45309", right: "#78350f", stroke: "#fef08a", text: "#451a03" };
    }
    if (compareN === 12) {
      return { top: "#38bdf8", left: "#0284c7", right: "#0c4a6e", stroke: "#e0f2fe", text: "#082f49" };
    }
    return { top: "#2dd4bf", left: "#0d9488", right: "#115e59", stroke: "#99f6e4", text: "#042f2e" };
  };

  // Helper to render an isometric voxel
  const renderVoxelSVG = (
    v: Voxel,
    screenX: number,
    screenY: number,
    colors: { top: string; left: string; right: string; stroke: string; text: string },
    isHovered: boolean,
    isSelected: boolean,
    onHover: () => void,
    onLeave: () => void,
    onClick: () => void
  ) => {
    const s = (cubeSize / 2) * zoom;
    const h = s * Math.sin(radX);
    const w = s * Math.cos(radX) * 1.732; // sqrt(3)

    const topV = `${screenX},${screenY - h * 2} ${screenX + w},${screenY - h} ${screenX},${screenY} ${screenX - w},${screenY - h}`;
    const leftV = `${screenX - w},${screenY - h} ${screenX},${screenY} ${screenX},${screenY + h * 2} ${screenX - w},${screenY + h}`;
    const rightV = `${screenX},${screenY} ${screenX + w},${screenY - h} ${screenX + w},${screenY + h} ${screenX},${screenY + h * 2}`;

    return (
      <g
        key={v.id}
        className="cursor-pointer transition-opacity duration-150"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {/* Top Face */}
        <polygon
          points={topV}
          fill={colors.top}
          stroke={colors.stroke}
          strokeWidth={isHovered || isSelected ? 1.8 : 0.5}
          strokeOpacity={isHovered || isSelected ? 1 : 0.8}
        />
        {/* Left Face */}
        <polygon
          points={leftV}
          fill={colors.left}
          stroke={colors.stroke}
          strokeWidth={isHovered || isSelected ? 1.8 : 0.5}
          strokeOpacity={isHovered || isSelected ? 1 : 0.8}
        />
        {/* Right Face */}
        <polygon
          points={rightV}
          fill={colors.right}
          stroke={colors.stroke}
          strokeWidth={isHovered || isSelected ? 1.8 : 0.5}
          strokeOpacity={isHovered || isSelected ? 1 : 0.8}
        />

        {/* Mini Label */}
        {((!isSideBySide && zoom >= 1.2) || isHovered || isSelected) && (
          <text
            x={screenX}
            y={screenY - h + 3}
            textAnchor="middle"
            fill={colors.text}
            fontSize={Math.max(7, 9 * zoom)}
            fontFamily="monospace"
            fontWeight="bold"
            pointerEvents="none"
          >
            {v.linearIndex}
          </text>
        )}
      </g>
    );
  };

  // Dimensions & Selected Preset
  const currentComparePreset = useMemo(() => {
    return COMPARISON_PRESETS.find((p) => p.n === compareN) || {
      n: compareN,
      name: `Κύβος (${compareN}³ = ${Math.pow(compareN, 3)})`,
      isopsephyNote: `N = ${compareN}`,
      pythagoreanMeaning: `Στερεός κύβος πλευράς ${compareN}.`,
      color: "#2dd4bf",
    };
  }, [compareN]);

  // Active focus voxel for 6x6x6 Psychogonic Cube
  const activeFocusVoxel = hoveredVoxel || selectedVoxel;
  const activeFocusProj = activeFocusVoxel
    ? projectVoxelPoint(activeFocusVoxel.x, activeFocusVoxel.y, activeFocusVoxel.z, 6, explosion, zoom)
    : null;

  // Active focus voxel for Comparison Cube
  const activeCompareFocusVoxel = hoveredCompareVoxel;
  const activeCompareProj = activeCompareFocusVoxel
    ? projectVoxelPoint(
        activeCompareFocusVoxel.x,
        activeCompareFocusVoxel.y,
        activeCompareFocusVoxel.z,
        compareN,
        compareExplosion,
        zoom * (compareN > 7 ? 0.75 : compareN > 5 ? 0.9 : 1.0)
      )
    : null;

  // Comparison Math Values
  const psychoVolume = 216; // 6^3
  const psychoSurface = 6 * (6 * 6); // 216
  const compVolume = Math.pow(compareN, 3);
  const compSurface = 6 * (compareN * compareN);
  const volumeRatio = (psychoVolume / compVolume).toFixed(2);

  return (
    <div className="space-y-6">
      {/* HEADER WITH CONTROLS BAR */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#0e0a06] border-2 border-[#8c672b] shadow-2xl relative overflow-hidden">
        
        {/* Main Title Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#3b2917] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24170c] border border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-md">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8] flex items-center gap-2 flex-wrap">
                <span>Τρισδιάστατος Ισομετρικός Ψυχογονικός Κύβος</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2a1a0c] text-[#ffd700] border border-[#ffd700]/50 font-mono">
                  6³ = 216
                </span>
                {isSideBySide && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0d2818] text-[#34d399] border border-[#34d399]/50 font-serif flex items-center gap-1">
                    <Columns className="w-3 h-3" />
                    <span>Side-by-Side Σύγκριση (6³ vs {compareN}³)</span>
                  </span>
                )}
              </h3>
              <p className="text-xs font-serif text-[#a69680]">
                {isSideBySide
                  ? `Σύγκριση Πυθαγόρειας Δομής: Ψυχογονικός (6³ = 216) έναντι ${currentComparePreset.name}`
                  : "Πυθαγόρεια Δομή: 6 × 6 × 6 = 216 | 3³ (27) + 4³ (64) + 5³ (125) = 216"}
              </p>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Side-by-Side Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSideBySide(!isSideBySide)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isSideBySide
                  ? "bg-gradient-to-r from-[#059669] to-[#34d399] text-[#022c22] font-bold border border-[#6ee7b7]"
                  : "bg-[#1c130b] text-[#ebd8c5] hover:text-[#ffd700] border border-[#ffd700]/60 hover:bg-[#2d1e11]"
              }`}
              title="Ενεργοποίηση/Απενεργοποίηση Σύγκρισης Side-by-Side"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{isSideBySide ? "Ενιαία Προβολή (6³)" : "🔄 Σύγκριση Side-by-Side"}</span>
            </button>

            {!isSideBySide && (
              <>
                <button
                  type="button"
                  onClick={() => setShowDimensions(!showDimensions)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                    showDimensions
                      ? "bg-[#3d2a13] text-[#ffd700] border border-[#ffd700]"
                      : "bg-[#1c130b] text-[#8c7a68] border border-[#4a341a]"
                  }`}
                  title="Εμφάνιση Διαστάσεων 6x6x6"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Διαστάσεις 6×6×6</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCoordinateGuides(!showCoordinateGuides)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                    showCoordinateGuides
                      ? "bg-[#3d2a13] text-[#ffd700] border border-[#ffd700]"
                      : "bg-[#1c130b] text-[#8c7a68] border border-[#4a341a]"
                  }`}
                  title="Οδηγοί Αξόνων X,Y,Z"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Οδηγοί X,Y,Z</span>
                </button>
              </>
            )}

            {/* Scroll to Historical Context Button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("historical-context-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer bg-[#24170c] text-[#ffd700] border border-[#ffd700]/50 hover:bg-[#382312] shadow-sm"
              title="Μετάβαση στο Ιστορικό Πλαίσιο & Πλατωνική Κοσμολογία"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📜 Ιστορικό Πλαίσιο</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoRotating
                  ? "bg-[#c89b3c] text-[#120d07] font-bold shadow-md shadow-[#ffd700]/30"
                  : "bg-[#1c130b] text-[#ebd8c5] hover:text-[#ffd700] border border-[#4a341a]"
              }`}
              title="Αυτόματη Περιστροφή"
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoRotating ? "Παύση" : "Περιστροφή"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRotX(30);
                setRotY(35);
                setZoom(1);
                setExplosion(12);
                setCompareExplosion(8);
              }}
              className="p-2 rounded-xl bg-[#1c130b] text-[#ebd8c5] hover:text-[#ffd700] border border-[#4a341a] transition-all cursor-pointer"
              title="Επαναφορά Κάμερας"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-2 rounded-xl bg-[#1c130b] text-[#ebd8c5] hover:text-[#ffd700] border border-[#4a341a] transition-all cursor-pointer"
              title="Σμίκρυνση"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
              className="p-2 rounded-xl bg-[#1c130b] text-[#ebd8c5] hover:text-[#ffd700] border border-[#4a341a] transition-all cursor-pointer"
              title="Μεγέθυνση"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) playFrequencyTone(216);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                !isMuted
                  ? "bg-[#3d2a13] text-[#ffd700] border-[#ffd700]"
                  : "bg-[#1c130b] text-[#8c7a68] border-[#4a341a]"
              }`}
              title={!isMuted ? "Σίγαση 216Hz" : "Ήχος 216Hz"}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* SIDE-BY-SIDE PRESET SELECTOR BAR (Visible when Side-by-Side is Active) */}
        {isSideBySide ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#140e08] border-2 border-[#059669]/60 shadow-lg mb-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d1e10] pb-2.5">
              <span className="text-xs font-serif font-bold text-[#34d399] flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                Επιλογή Συγκριτικού Πυθαγόρειου Κύβου (N³):
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#a69680]">
                  Σύγκριση <strong>216 (6³)</strong> με <strong>{compVolume} ({compareN}³)</strong>
                </span>
                <span className="text-xs font-mono font-bold text-[#34d399] px-2 py-0.5 rounded bg-[#0a1a10] border border-[#34d399]/40">
                  Αναλογία: {volumeRatio}x
                </span>
              </div>
            </div>

            {/* Presets Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {COMPARISON_PRESETS.map((preset) => (
                <button
                  key={`preset-${preset.n}`}
                  type="button"
                  onClick={() => {
                    setCompareN(preset.n);
                    playFrequencyTone(100 + preset.n * 25);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
                    compareN === preset.n
                      ? "bg-gradient-to-r from-[#059669] to-[#34d399] text-[#022c22] font-bold shadow-lg scale-105"
                      : "bg-[#1c130b] text-[#ebd8c5] hover:text-[#34d399] border border-[#3b2713] hover:border-[#34d399]/60"
                  }`}
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Interactive Number Slider & Stepper Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif text-[#a69680] whitespace-nowrap">Μέγεθος N:</span>
                <button
                  type="button"
                  onClick={() => setCompareN((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-[#1c130b] border border-[#3b2713] text-[#34d399] hover:bg-[#2a1a10] flex items-center justify-center font-bold text-xs cursor-pointer"
                  title="Μείωση N"
                >
                  -
                </button>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={compareN}
                  onChange={(e) => setCompareN(Number(e.target.value))}
                  className="w-32 sm:w-40 accent-[#34d399] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setCompareN((prev) => Math.min(12, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-[#1c130b] border border-[#3b2713] text-[#34d399] hover:bg-[#2a1a10] flex items-center justify-center font-bold text-xs cursor-pointer"
                  title="Αύξηση N"
                >
                  +
                </button>
                <span className="text-xs font-mono font-bold text-[#34d399] px-2 py-0.5 rounded bg-[#0a1a10] border border-[#34d399]/40">
                  N={compareN} ({compVolume})
                </span>
              </div>

              {/* Slider for Left 6x6x6 Explosion */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif text-[#ffd700] whitespace-nowrap">Διαχωρισμός 6³:</span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={explosion}
                  onChange={(e) => setExplosion(Number(e.target.value))}
                  className="w-28 sm:w-32 accent-[#ffd700] cursor-pointer"
                />
                <span className="text-[11px] font-mono text-[#ffd700]">{explosion}px</span>
              </div>

              {/* Slider for Right NxNxN Explosion */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif text-[#34d399] whitespace-nowrap">Διαχωρισμός {compareN}³:</span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={compareExplosion}
                  onChange={(e) => setCompareExplosion(Number(e.target.value))}
                  className="w-28 sm:w-32 accent-[#34d399] cursor-pointer"
                />
                <span className="text-[11px] font-mono text-[#34d399]">{compareExplosion}px</span>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD VIEW MODE BUTTONS */
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-serif text-[#a69680] font-bold">Προβολή:</span>
            {[
              { id: "pythagorean_triple", label: "📐 Πυθαγόρεια 3³ + 4³ + 5³ (216)", icon: Sparkles },
              { id: "layers", label: "📚 6 Επίπεδα (6 × 36 = 216)", icon: Layers },
              { id: "shells", label: "🎯 Ομόκεντρα Κελύφη (8/56/152)", icon: Maximize2 },
              { id: "core", label: "💎 Πυρήνας 2×2×2 (8 Voxels)", icon: Eye },
              { id: "solar_mapping", label: "☀️ Ηλιακή Αρίθμηση (1..36)", icon: Box },
              { id: "solid", label: "🏛️ Συμπαγής Χρυσός", icon: Box },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id as PsychogonicViewMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === mode.id
                    ? "bg-gradient-to-r from-[#c89b3c] to-[#ffd700] text-[#120d07] font-bold shadow-md shadow-[#ffd700]/30 scale-105"
                    : "bg-[#1c130b] text-[#ebd8c5] hover:text-[#ffd700] border border-[#3b2713] hover:border-[#ffd700]"
                }`}
              >
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* INTERACTIVE STAGE & CANVAS */}
        {isSideBySide ? (
          /* ================= SIDE-BY-SIDE DUAL VIEW ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* LEFT VIEWPORT: 6x6x6 PSYCHOGONIC CUBE (216) */}
              <div
                className="h-[460px] rounded-2xl bg-gradient-to-b from-[#080503] to-[#120c07] border-2 border-[#ffd700]/60 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)]" />

                {/* Left Header Tag */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-[#140e08]/95 border border-[#ffd700] text-xs font-serif text-[#ffd700] pointer-events-none shadow-lg flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" />
                  <span><strong>Ψυχογονικός Κύβος (6³ = 216)</strong></span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#140e08]/90 border border-[#4a341a] text-[10px] font-mono text-[#ffd700] pointer-events-none">
                  Όγκος: 216 | Επιφάνεια: 216
                </div>

                {/* SVG Canvas Left */}
                <svg className="w-full h-full" viewBox="-240 -200 480 400" preserveAspectRatio="xMidYMid meet">
                  <g id="side-left-cube">
                    {projectedPsychogonicVoxels.map((p) => {
                      const isHovered = hoveredVoxel?.id === p.voxel.id;
                      const isSelected = selectedVoxel?.id === p.voxel.id;
                      const colors = getPsychogonicColors(p.voxel, isHovered, isSelected);
                      return renderVoxelSVG(
                        p.voxel,
                        p.screenX,
                        p.screenY,
                        colors,
                        isHovered,
                        isSelected,
                        () => {
                          setHoveredVoxel(p.voxel);
                          playFrequencyTone(216 + p.voxel.z * 15);
                        },
                        () => setHoveredVoxel(null),
                        () => setSelectedVoxel(p.voxel === selectedVoxel ? null : p.voxel)
                      );
                    })}
                  </g>
                </svg>

                {/* Left Footer Badge */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-[#140e08]/90 border border-[#3b2917] text-[11px] font-serif text-[#ebd8c5] flex justify-between items-center pointer-events-none">
                  <span>6 επίπεδα × 36 κελιά</span>
                  <span className="text-[#ffd700] font-mono font-bold">3³ + 4³ + 5³ = 216</span>
                </div>
              </div>

              {/* RIGHT VIEWPORT: NxNxN COMPARISON CUBE */}
              <div
                className="h-[460px] rounded-2xl bg-gradient-to-b from-[#040d08] to-[#0a1710] border-2 border-[#34d399]/60 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0%,transparent_70%)]" />

                {/* Right Header Tag */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-[#0a1710]/95 border border-[#34d399] text-xs font-serif text-[#34d399] pointer-events-none shadow-lg flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" />
                  <span><strong>{currentComparePreset.name}</strong></span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0a1710]/90 border border-[#1b3d2b] text-[10px] font-mono text-[#34d399] pointer-events-none">
                  Όγκος: {compVolume} | Επιφάνεια: {compSurface}
                </div>

                {/* SVG Canvas Right */}
                <svg className="w-full h-full" viewBox="-240 -200 480 400" preserveAspectRatio="xMidYMid meet">
                  <g id="side-right-cube">
                    {projectedCompareVoxels.map((p) => {
                      const isHovered = hoveredCompareVoxel?.id === p.voxel.id;
                      const colors = getCompareColors(p.voxel, isHovered);
                      return renderVoxelSVG(
                        p.voxel,
                        p.screenX,
                        p.screenY,
                        colors,
                        isHovered,
                        false,
                        () => {
                          setHoveredCompareVoxel(p.voxel);
                          playFrequencyTone(100 + compareN * 30 + p.voxel.z * 10);
                        },
                        () => setHoveredCompareVoxel(null),
                        () => {}
                      );
                    })}
                  </g>
                </svg>

                {/* Right Footer Badge */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-[#0a1710]/90 border border-[#1b3d2b] text-[11px] font-serif text-[#a7f3d0] flex justify-between items-center pointer-events-none">
                  <span>{compareN} επίπεδα × {compareN * compareN} κελιά</span>
                  <span className="text-[#34d399] font-mono font-bold">{currentComparePreset.isopsephyNote}</span>
                </div>
              </div>

            </div>

            {/* COMPARISON MATHEMATICAL MATRIX */}
            <div className="p-5 rounded-2xl bg-[#140e08] border-2 border-[#8c672b] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3b2917] pb-3">
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#ffd700]" />
                    Πυθαγόρειος Συγκριτικός Πίνακας: 6³ (216) έναντι {compareN}³ ({compVolume})
                  </h4>
                  <p className="text-[11px] font-serif text-[#a69680]">
                    Ανάλυση γεωμετρικής, αρμονικής και κοσμολογικής δομής των δύο στερεών
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#ffd700]">
                    Αναλογία Όγκου: 216 / {compVolume} = {volumeRatio}x
                  </span>
                </div>
              </div>

              {/* Visual Proportion Bar */}
              <div className="p-3 rounded-xl bg-[#0c0804] border border-[#2d1e10] space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#ffd700]">Ψυχογονικός (216 voxels): {((216 / (216 + compVolume)) * 100).toFixed(1)}%</span>
                  <span className="text-[#34d399]">Κύβος {compareN}³ ({compVolume} voxels): {((compVolume / (216 + compVolume)) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#1a120a] rounded-full overflow-hidden flex border border-[#3b2713]">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] transition-all duration-300"
                    style={{ width: `${(216 / (216 + compVolume)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-[#059669] to-[#34d399] transition-all duration-300"
                    style={{ width: `${(compVolume / (216 + compVolume)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Volume & 3-4-5 Decomposition */}
                <div className="p-4 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-serif text-[#ffd700] font-bold block mb-1">
                      1. Όγκος & Τριμερής Σύνθεση
                    </span>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-[#ffd700]">6³: <strong>216</strong></span>
                      <span className="text-[#34d399]">{compareN}³: <strong>{compVolume}</strong></span>
                    </div>
                    <p className="text-[11px] font-serif text-[#ebd8c5] leading-relaxed">
                      <strong>Μοναδικότητα 216:</strong> 3³ (27) + 4³ (64) + 5³ (125) = 216. Αποτελεί το άθροισμα των κύβων των πλευρών του Ιερού Τριγώνου 3-4-5.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-[#a69680] pt-2 border-t border-[#1f150b]">
                    {compareN === 6 ? "Απόλυτη ταύτιση όγκου" : compareN < 6 ? `Υπολείπεται κατά ${216 - compVolume} κελιά` : `Υπερβαίνει κατά ${compVolume - 216} κελιά`}
                  </div>
                </div>

                {/* Metric 2: Surface Area vs Volume (Unique to 6!) */}
                <div className="p-4 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-serif text-[#34d399] font-bold block mb-1">
                      2. Εμβαδόν vs Όγκος (6/N)
                    </span>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-[#ffd700]">6×6² = <strong>216</strong> (1.000)</span>
                      <span className="text-[#34d399]">6×{compareN}² = <strong>{compSurface}</strong> ({(6 / compareN).toFixed(2)})</span>
                    </div>
                    <p className="text-[11px] font-serif text-[#ebd8c5] leading-relaxed">
                      <strong>Ισορροπία:</strong> Στο N=6, η αναλογία Εμβαδού προς Όγκο είναι ακριβώς <strong>1.000</strong>.
                      {compareN < 6
                        ? " Στο N < 6, το εξωτερικό εμβαδόν υπερτερεί του όγκου."
                        : compareN > 6
                        ? " Στο N > 6, η εσωτερική μάζα υπερτερεί του εμβαδού."
                        : " Απόλυτη ισότητα εδρών και όγκου."}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-[#a69680] pt-2 border-t border-[#1f150b]">
                    Αναλογία Ε/V = 6 / {compareN} = {(6 / compareN).toFixed(3)}
                  </div>
                </div>

                {/* Metric 3: Concentric Shells (Gnomons) */}
                <div className="p-4 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-serif text-[#38bdf8] font-bold block mb-1">
                      3. Ομόκεντρα Κελύφη & Γνώμονες
                    </span>
                    <div className="text-xs font-mono text-[#38bdf8] font-bold mb-1">
                      {compareN >= 3
                        ? `Περίβλημα: ${compVolume - Math.pow(compareN - 2, 3)} voxels`
                        : `Συμπαγής πυρήνας: ${compVolume} voxels`}
                    </div>
                    <p className="text-[11px] font-serif text-[#ebd8c5] leading-relaxed">
                      Στον Ψυχογονικό Κύβο (6³): Πυρήνας 2³ (8) ➔ Μέσο Κέλυφος 4³-2³ (56) ➔ Εξωτερικό Κέλυφος 6³-4³ (152).
                      Στον κύβο {compareN}³, ο εσωτερικός πυρήνας είναι {compareN >= 2 ? Math.pow(Math.max(1, compareN - 2), 3) : 1} voxels.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-[#a69680] pt-2 border-t border-[#1f150b]">
                    Γνώμων N³ - (N-2)³ = {compVolume - (compareN >= 2 ? Math.pow(compareN - 2, 3) : 0)}
                  </div>
                </div>

                {/* Metric 4: Pythagorean Meaning & Isopsephy */}
                <div className="p-4 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-serif text-[#c084fc] font-bold block mb-1">
                      4. Ηλιακή Βάση & Ισοψηφία
                    </span>
                    <div className="text-xs font-mono text-[#34d399] font-bold mb-1">
                      {currentComparePreset.isopsephyNote}
                    </div>
                    <p className="text-[11px] font-serif text-[#ebd8c5] leading-relaxed">
                      {currentComparePreset.pythagoreanMeaning}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-[#a69680] pt-2 border-t border-[#1f150b]">
                    Μαγική Σταθερά N: {Math.round((compareN * (compareN * compareN + 1)) / 2)}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* ================= SINGLE 6x6x6 ISOMETRIC VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            
            {/* Main 3D Isometric SVG Container */}
            <div
              ref={containerRef}
              className="lg:col-span-3 h-[520px] sm:h-[580px] rounded-2xl bg-gradient-to-b from-[#080503] to-[#120c07] border-2 border-[#52391b] relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Ambient Background Glow */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)]" />

              {/* Educational Instruction Badge Top-Left */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-[#140e08]/95 border border-[#ffd700]/50 text-xs font-serif text-[#ebd8c5] pointer-events-none flex items-center gap-2 shadow-lg backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] animate-pulse" />
                <span>
                  Περάστε το ποντίκι πάνω από τα κελιά για ανάλυση της σχέσης <strong className="text-[#ffd700]">6 × 6 × 6 = 216</strong>
                </span>
              </div>

              {/* Dynamic Educational Headline Badge Top-Right */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-[#140e08]/95 border border-[#ffd700]/40 text-xs font-mono text-[#ffd700] pointer-events-none shadow-lg hidden sm:flex items-center gap-2">
                <span className="text-[#38bdf8]">6³ = 216</span>
                <span className="text-[#a69680]">|</span>
                <span>Ψυχογονικός Κύβος</span>
              </div>

              {/* Isometric SVG Canvas */}
              <svg
                className="w-full h-full"
                viewBox="-300 -260 600 520"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="cubeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
                  </filter>
                  <linearGradient id="labelGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#24170c" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#120c07" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* 3D Coordinate Axis Guides on Hover */}
                {showCoordinateGuides && activeFocusVoxel && (
                  <g id="coordinate-guides" pointerEvents="none">
                    {(() => {
                      const pX0 = projectVoxelPoint(-0.5, activeFocusVoxel.y, activeFocusVoxel.z, 6, explosion, zoom);
                      const pX1 = projectVoxelPoint(5.5, activeFocusVoxel.y, activeFocusVoxel.z, 6, explosion, zoom);
                      const pY0 = projectVoxelPoint(activeFocusVoxel.x, -0.5, activeFocusVoxel.z, 6, explosion, zoom);
                      const pY1 = projectVoxelPoint(activeFocusVoxel.x, 5.5, activeFocusVoxel.z, 6, explosion, zoom);
                      const pZ0 = projectVoxelPoint(activeFocusVoxel.x, activeFocusVoxel.y, -0.5, 6, explosion, zoom);
                      const pZ1 = projectVoxelPoint(activeFocusVoxel.x, activeFocusVoxel.y, 5.5, 6, explosion, zoom);
                      return (
                        <>
                          <line
                            x1={pX0.screenX}
                            y1={pX0.screenY}
                            x2={pX1.screenX}
                            y2={pX1.screenY}
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            strokeOpacity="0.7"
                          />
                          <line
                            x1={pY0.screenX}
                            y1={pY0.screenY}
                            x2={pY1.screenX}
                            y2={pY1.screenY}
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            strokeOpacity="0.7"
                          />
                          <line
                            x1={pZ0.screenX}
                            y1={pZ0.screenY}
                            x2={pZ1.screenX}
                            y2={pZ1.screenY}
                            stroke="#f43f5e"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            strokeOpacity="0.7"
                          />
                        </>
                      );
                    })()}
                  </g>
                )}

                {/* 3D Dimension Annotations (6x6x6) */}
                {showDimensions && (
                  <g id="dimension-labels" pointerEvents="none">
                    {(() => {
                      const dX0 = projectVoxelPoint(-0.5, -0.5, -0.5, 6, explosion, zoom);
                      const dX1 = projectVoxelPoint(5.5, -0.5, -0.5, 6, explosion, zoom);
                      const dY1 = projectVoxelPoint(-0.5, 5.5, -0.5, 6, explosion, zoom);
                      const dZ1 = projectVoxelPoint(-0.5, -0.5, 5.5, 6, explosion, zoom);
                      return (
                        <>
                          <line
                            x1={dX0.screenX}
                            y1={dX0.screenY + 12}
                            x2={dX1.screenX}
                            y2={dX1.screenY + 12}
                            stroke="#ffd700"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                            strokeOpacity="0.6"
                          />
                          <text
                            x={(dX0.screenX + dX1.screenX) / 2}
                            y={(dX0.screenY + dX1.screenY) / 2 + 24}
                            textAnchor="middle"
                            fill="#ffd700"
                            fontSize="10"
                            fontFamily="serif"
                            fontWeight="bold"
                          >
                            Μήκος: 6 Voxels
                          </text>

                          <line
                            x1={dX0.screenX - 12}
                            y1={dX0.screenY}
                            x2={dY1.screenX - 12}
                            y2={dY1.screenY}
                            stroke="#38bdf8"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                            strokeOpacity="0.6"
                          />
                          <text
                            x={(dX0.screenX + dY1.screenX) / 2 - 20}
                            y={(dX0.screenY + dY1.screenY) / 2}
                            textAnchor="end"
                            fill="#38bdf8"
                            fontSize="10"
                            fontFamily="serif"
                            fontWeight="bold"
                          >
                            Πλάτος: 6 Voxels
                          </text>

                          <line
                            x1={dX0.screenX}
                            y1={dX0.screenY}
                            x2={dZ1.screenX}
                            y2={dZ1.screenY}
                            stroke="#f43f5e"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                            strokeOpacity="0.6"
                          />
                          <text
                            x={(dX0.screenX + dZ1.screenX) / 2 - 24}
                            y={(dX0.screenY + dZ1.screenY) / 2 - 10}
                            textAnchor="end"
                            fill="#f43f5e"
                            fontSize="10"
                            fontFamily="serif"
                            fontWeight="bold"
                          >
                            Ύψος: 6 Επίπεδα (6 × 36 = 216)
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}

                {/* Render all projected voxels in depth order */}
                <g id="isometric-cube-group">
                  {projectedPsychogonicVoxels.map((p) => {
                    const isHovered = hoveredVoxel?.id === p.voxel.id;
                    const isSelected = selectedVoxel?.id === p.voxel.id;
                    const colors = getPsychogonicColors(p.voxel, isHovered, isSelected);
                    return renderVoxelSVG(
                      p.voxel,
                      p.screenX,
                      p.screenY,
                      colors,
                      isHovered,
                      isSelected,
                      () => {
                        setHoveredVoxel(p.voxel);
                        playFrequencyTone(216 + p.voxel.z * 18);
                      },
                      () => setHoveredVoxel(null),
                      () => setSelectedVoxel(p.voxel === selectedVoxel ? null : p.voxel)
                    );
                  })}
                </g>

                {/* Dynamic Interactive SVG Floating Callout / Label attached to Hovered Voxel */}
                {activeFocusVoxel && activeFocusProj && (
                  <g
                    id="interactive-hover-callout"
                    transform={`translate(${activeFocusProj.screenX}, ${activeFocusProj.screenY})`}
                    pointerEvents="none"
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="8"
                      fill="none"
                      stroke="#ffd700"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                      className="animate-spin"
                    />
                    <circle cx="0" cy="0" r="3" fill="#ffffff" />

                    {(() => {
                      const cardOnRight = activeFocusProj.screenX < 80;
                      const cardX = cardOnRight ? 40 : -220;
                      const cardY = activeFocusProj.screenY > 0 ? -120 : 30;

                      const pythagoreanTitle =
                        activeFocusVoxel.pythagoreanGroup === "3cube"
                          ? "Τμήμα 3³ (27/216) • Νους"
                          : activeFocusVoxel.pythagoreanGroup === "4cube"
                          ? "Τμήμα 4³ (64/216) • Τετράς"
                          : "Τμήμα 5³ (125/216) • Πεντάς";

                      return (
                        <g>
                          <path
                            d={`M 0,0 C ${cardX * 0.4},${cardY * 0.5} ${cardX * 0.8},${cardY} ${cardX + (cardOnRight ? 0 : 180)},${cardY + 30}`}
                            fill="none"
                            stroke="#ffd700"
                            strokeWidth="1.5"
                            strokeDasharray="3,2"
                          />

                          <g transform={`translate(${cardX}, ${cardY})`}>
                            <rect
                              x="0"
                              y="0"
                              width="190"
                              height="110"
                              rx="10"
                              fill="url(#labelGrad)"
                              stroke="#ffd700"
                              strokeWidth="1.2"
                              filter="url(#cardShadow)"
                            />

                            <rect
                              x="0"
                              y="0"
                              width="190"
                              height="24"
                              rx="10"
                              fill="#3d2914"
                            />
                            <text
                              x="10"
                              y="16"
                              fill="#ffd700"
                              fontSize="11"
                              fontFamily="serif"
                              fontWeight="bold"
                            >
                              Ψυχογονικός Κύβος (6³ = 216)
                            </text>

                            <text
                              x="10"
                              y="42"
                              fill="#f5ecd8"
                              fontSize="10"
                              fontFamily="monospace"
                            >
                              Θέση: <tspan fill="#38bdf8">X:{activeFocusVoxel.x + 1}/6</tspan> |{" "}
                              <tspan fill="#fbbf24">Y:{activeFocusVoxel.y + 1}/6</tspan> |{" "}
                              <tspan fill="#f43f5e">Z:{activeFocusVoxel.z + 1}/6</tspan>
                            </text>

                            <text
                              x="10"
                              y="60"
                              fill="#ebd8c5"
                              fontSize="10"
                              fontFamily="serif"
                            >
                              Κελί: <tspan fill="#ffd700" fontWeight="bold">#{activeFocusVoxel.linearIndex} από 216</tspan>
                              <tspan fill="#a69680" fontSize="9"> ({( (activeFocusVoxel.linearIndex / 216) * 100 ).toFixed(1)}%)</tspan>
                            </text>

                            <text
                              x="10"
                              y="78"
                              fill="#a69680"
                              fontSize="9"
                              fontFamily="serif"
                            >
                              Στρώμα Z={activeFocusVoxel.z + 1}: Κελί {activeFocusVoxel.solarVal}/36
                            </text>

                            <text
                              x="10"
                              y="96"
                              fill="#ffd700"
                              fontSize="9"
                              fontFamily="serif"
                              fontWeight="bold"
                            >
                              {pythagoreanTitle}
                            </text>
                          </g>
                        </g>
                      );
                    })()}
                  </g>
                )}
              </svg>

              {/* Bottom-left Detailed Floating Card */}
              {activeFocusVoxel && (
                <div className="absolute bottom-3 left-3 p-3 rounded-2xl bg-[#140e08]/95 border-2 border-[#ffd700] shadow-2xl text-xs font-serif text-[#f5ecd8] pointer-events-none space-y-1.5 backdrop-blur-md max-w-sm">
                  <div className="flex items-center justify-between border-b border-[#3b2917] pb-1">
                    <div className="flex items-center gap-2 font-bold text-[#ffd700]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Στοιχείο {activeFocusVoxel.linearIndex} / 216</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2d1e10] text-[#38bdf8] border border-[#38bdf8]/40">
                      6³ = 216
                    </span>
                  </div>
                  <div className="text-[11px] text-[#ebd8c5] leading-relaxed">
                    Ανήκει στο <strong>Επίπεδο Z={activeFocusVoxel.z + 1}</strong> (6 επίπεδα × 36 κελιά = 216).
                    Συντεταγμένες: <span className="font-mono text-[#ffd700]">({activeFocusVoxel.x + 1}, {activeFocusVoxel.y + 1}, {activeFocusVoxel.z + 1})</span>.
                    {activeFocusVoxel.pythagoreanGroup === "3cube" && " Μέρος της τριάδας 3³ (27 voxels)."}
                    {activeFocusVoxel.pythagoreanGroup === "4cube" && " Μέρος της τετράδας 4³ (64 voxels)."}
                    {activeFocusVoxel.pythagoreanGroup === "5cube" && " Μέρος της πεντάδας 5³ (125 voxels)."}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Controls & Mathematical Inspector */}
            <div className="space-y-4">
              
              {/* Layer Explosion Slider */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#f5ecd8] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#ffd700]" />
                    Διαχωρισμός Επιπέδων (Z)
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ffd700]">
                    {explosion}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={explosion}
                  onChange={(e) => setExplosion(Number(e.target.value))}
                  className="w-full accent-[#ffd700] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8c7a68]">
                  <span>Συμπαγής (0)</span>
                  <span>Ανοικτός (40px)</span>
                </div>
              </div>

              {/* Filter Single Layer */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-2">
                <span className="text-xs font-serif font-bold text-[#f5ecd8] block">
                  Επιλογή Μεμονωμένου Επιπέδου:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveLayerFilter("all")}
                    className={`py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                      activeLayerFilter === "all"
                        ? "bg-[#c89b3c] text-[#120d07] font-bold"
                        : "bg-[#1c130b] text-[#a69680] border border-[#3b2713]"
                    }`}
                  >
                    Όλα (216)
                  </button>
                  {[0, 1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={`layer-btn-${lvl}`}
                      type="button"
                      onClick={() => setActiveLayerFilter(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        activeLayerFilter === lvl
                          ? "bg-[#c89b3c] text-[#120d07] font-bold"
                          : "bg-[#1c130b] text-[#a69680] border border-[#3b2713] hover:text-[#ffd700]"
                      }`}
                    >
                      Z={lvl + 1} (36)
                    </button>
                  ))}
                </div>
              </div>

              {/* Pythagorean Theorem Breakdown Card */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#ffd700]/40 space-y-3 shadow-lg">
                <h4 className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Πυθαγόρεια Ανάλυση 216
                </h4>
                <div className="space-y-2 text-xs font-serif text-[#ebd8c5]">
                  <div className="p-2 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-1">
                    <div className="flex justify-between items-center text-[#fbbf24] font-mono font-bold">
                      <span>3³ = 3 × 3 × 3</span>
                      <span>27 Voxels</span>
                    </div>
                    <p className="text-[10px] text-[#a69680]">
                      Κύβος της πρώτης περιττής τριάδος (Νους / Αρμονία)
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-1">
                    <div className="flex justify-between items-center text-[#38bdf8] font-mono font-bold">
                      <span>4³ = 4 × 4 × 4</span>
                      <span>64 Voxels</span>
                    </div>
                    <p className="text-[10px] text-[#a69680]">
                      Κύβος της Τετράδος (Αλήθεια = 64 / 8²)
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0c0804] border border-[#3b2713] space-y-1">
                    <div className="flex justify-between items-center text-[#f43f5e] font-mono font-bold">
                      <span>5³ = 5 × 5 × 5</span>
                      <span>125 Voxels</span>
                    </div>
                    <p className="text-[10px] text-[#a69680]">
                      Κύβος της Πεντάδος (Ζωή / Κοσμική Δύναμη)
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#24170c] to-[#3d2914] border-2 border-[#ffd700] text-center font-mono font-bold text-[#ffd700]">
                    27 + 64 + 125 = 216 = 6³
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 6 MINI LAYER SLICES FOOTER (Always visible to explore slices) */}
        <div className="mt-6 pt-5 border-t border-[#3b2917]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ffd700]" />
              Ανατομία των 6 Επιπέδων (6 Οριζόντιες Τομές × 36 Κελιά = 216)
            </h4>
            <span className="text-xs font-mono text-[#ffd700]">
              Σύνολο = 216 Στοιχεία
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[0, 1, 2, 3, 4, 5].map((zIdx) => {
              const isActive = activeLayerFilter === zIdx;
              return (
                <div
                  key={`slice-box-${zIdx}`}
                  onClick={() => setActiveLayerFilter(isActive ? "all" : zIdx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-2 ${
                    isActive
                      ? "bg-[#2d1e11] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105"
                      : "bg-[#140e08] border-[#3b2713] hover:border-[#ffd700]/60 hover:bg-[#1a120a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#ffd700]">
                      Επίπεδο Z={zIdx + 1}
                    </span>
                    <span className="text-[9px] font-mono text-[#8c7a68]">
                      36 Voxels
                    </span>
                  </div>

                  {/* 6x6 Grid of the Layer */}
                  <div className="grid grid-cols-6 gap-0.5 p-1 bg-[#0a0704] rounded-lg border border-[#2d1e10] aspect-square">
                    {Array.from({ length: 36 }).map((_, cellIdx) => {
                      const v = psychogonicVoxels[zIdx * 36 + cellIdx];
                      const isCellHovered = activeFocusVoxel?.id === v?.id;
                      const colors = v ? getPsychogonicColors(v, isCellHovered, false) : { top: "#52391b" };
                      return (
                        <div
                          key={`mini-cell-${zIdx}-${cellIdx}`}
                          className={`rounded-[1px] transition-all hover:scale-125 hover:z-10 ${
                            isCellHovered ? "ring-1 ring-white scale-125 z-10" : ""
                          }`}
                          style={{ backgroundColor: colors.top }}
                          title={`Z=${zIdx + 1}, Voxel #${cellIdx + 1}`}
                          onMouseEnter={() => v && setHoveredVoxel(v)}
                          onMouseLeave={() => setHoveredVoxel(null)}
                        />
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-mono text-[#a69680] block">
                    {zIdx === 0 && "Βάση (Z=1)"}
                    {zIdx === 1 && "Στρώμα 2"}
                    {zIdx === 2 && "Πυρήνας (Z=3)"}
                    {zIdx === 3 && "Πυρήνας (Z=4)"}
                    {zIdx === 4 && "Στρώμα 5"}
                    {zIdx === 5 && "Κορυφή (Z=6)"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* HISTORICAL CONTEXT & COSMOLOGY (GEMINI SYNTHESIS & CLASSICAL SOURCES) */}
        <PsychogonicHistoricalContext />

      </div>
    </div>
  );
};
