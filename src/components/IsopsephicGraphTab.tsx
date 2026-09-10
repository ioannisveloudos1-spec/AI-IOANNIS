import React, { useState, useMemo, useRef, useEffect } from "react";
import { SavedIsopsephyItem } from "../types";
import {
  Network,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Filter,
  Info,
  Maximize2,
  BookmarkPlus,
  Compass,
} from "lucide-react";
import { calculatePythmen, numberToGreekNumeral } from "../utils/isopsephy";

interface IsopsephicGraphTabProps {
  savedItems: SavedIsopsephyItem[];
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
  onNavigateToCalculator?: () => void;
}

interface GraphNode {
  id: string;
  label: string;
  value: number;
  root: number;
  category: "lavreion" | "theological" | "mythological" | "philosophical" | "custom";
  categoryLabel: string;
  color: string;
  x: number;
  y: number;
  radius: number;
  description: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  type: "sum" | "same_root" | "multiple" | "relation";
  color: string;
}

const CANONICAL_NODES: Omit<GraphNode, "x" | "y">[] = [
  {
    id: "n-ianeus",
    label: "ΙΑΝΕΥΣ",
    value: 666,
    root: 9,
    category: "lavreion",
    categoryLabel: "Αλληγορία Λαυρείου",
    color: "#eab308",
    radius: 36,
    description: "Τέλειος Ιανός, ο αναζητητής της αλήθειας και της αυτογνωσίας.",
  },
  {
    id: "n-telianos",
    label: "ΤΕΛΙΑΝΟΣ",
    value: 666,
    root: 9,
    category: "lavreion",
    categoryLabel: "Αλληγορία Λαυρείου",
    color: "#eab308",
    radius: 36,
    description: "Η ολοκλήρωση και η τελείωση του ανθρώπινου πνεύματος.",
  },
  {
    id: "n-lavreion",
    label: "ΛΑΥΡΕΙΟΝ",
    value: 666,
    root: 9,
    category: "lavreion",
    categoryLabel: "Αλληγορία Λαυρείου",
    color: "#eab308",
    radius: 36,
    description: "Ο υπόγειος τόπος δοκιμασίας, εξαγνισμού και μεταστοιχείωσης.",
  },
  {
    id: "n-nikitis",
    label: "Ο ΝΙΚΗΤΗΣ",
    value: 666,
    root: 9,
    category: "lavreion",
    categoryLabel: "Αλληγορία Λαυρείου",
    color: "#eab308",
    radius: 34,
    description: "Αυτός που υπερβαίνει τη σκιά και κατακτά την εσωτερική αρμονία.",
  },
  {
    id: "n-poros-penia",
    label: "ΠΟΡΟΣ + ΠΕΝΙΑ",
    value: 666,
    root: 9,
    category: "lavreion",
    categoryLabel: "Αλληγορία Λαυρείου",
    color: "#f59e0b",
    radius: 36,
    description: "Οι γονείς του Έρωτος στο Πλατωνικό Συμπόσιο: ΠΟΡΟΣ (420) + ΠΕΝΙΑ (246) = 666.",
  },
  {
    id: "n-combo-1332",
    label: "ΙΑΝΕΥΣ + ΤΕΛΙΑΝΟΣ",
    value: 1332,
    root: 9,
    category: "lavreion",
    categoryLabel: "Αλληγορία Λαυρείου",
    color: "#c084fc",
    radius: 40,
    description: "Διπλό 666 (666 × 2 = 1332) - Η πλήρης ένωση των δύο όψεων.",
  },
  {
    id: "n-ihsous",
    label: "ΙΗΣΟΥΣ",
    value: 888,
    root: 6,
    category: "theological",
    categoryLabel: "Θεία Ονόματα",
    color: "#38bdf8",
    radius: 38,
    description: "Ι(10)+Η(8)+Σ(200)+Ο(70)+Υ(400)+Σ(200) = 888. Η υπέρτατη αρμονία.",
  },
  {
    id: "n-xristos",
    label: "ΧΡΙΣΤΟΣ",
    value: 1480,
    root: 4,
    category: "theological",
    categoryLabel: "Θεία Ονόματα",
    color: "#38bdf8",
    radius: 38,
    description: "Χ(600)+Ρ(100)+Ι(10)+Σ(200)+Τ(300)+Ο(70)+Σ(200) = 1480.",
  },
  {
    id: "n-ihsous-xristos",
    label: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ",
    value: 2368,
    root: 1,
    category: "theological",
    categoryLabel: "Θεία Ονόματα",
    color: "#60a5fa",
    radius: 44,
    description: "888 + 1480 = 2368. Θεμελιώδης ισοψηφικός λίθος της πρωτοχριστιανικής παράδοσης.",
  },
  {
    id: "n-dias",
    label: "ΔΙΑΣ",
    value: 215,
    root: 8,
    category: "mythological",
    categoryLabel: "Μυθολογία",
    color: "#ec4899",
    radius: 32,
    description: "Δ(4)+Ι(10)+Α(1)+Σ(200) = 215. Πατέρας των θεών.",
  },
  {
    id: "n-zeus",
    label: "ΖΕΥΣ",
    value: 612,
    root: 9,
    category: "mythological",
    categoryLabel: "Μυθολογία",
    color: "#ec4899",
    radius: 34,
    description: "Ζ(7)+Ε(5)+Υ(400)+Σ(200) = 612.",
  },
  {
    id: "n-apollon",
    label: "ΑΠΟΛΛΩΝ",
    value: 1061,
    root: 8,
    category: "mythological",
    categoryLabel: "Μυθολογία",
    color: "#f43f5e",
    radius: 34,
    description: "Ο θεός του φωτός, της μουσικής και της αρμονίας.",
  },
  {
    id: "n-o-on",
    label: "Ο ΩΝ",
    value: 920,
    root: 2,
    category: "philosophical",
    categoryLabel: "Φιλοσοφία & Οντολογία",
    color: "#10b981",
    radius: 34,
    description: "Το Αυθύπαρκτο Ον, το Αιώνιο Παρόν.",
  },
  {
    id: "n-aion",
    label: "ΑΙΩΝ",
    value: 861,
    root: 6,
    category: "philosophical",
    categoryLabel: "Φιλοσοφία & Οντολογία",
    color: "#10b981",
    radius: 34,
    description: "Η άπειρη κυκλική ροή του κοσμικού χρόνου.",
  },
];

const CANONICAL_EDGES: GraphEdge[] = [
  { from: "n-ianeus", to: "n-telianos", label: "Ισοψηφία (666)", type: "same_root", color: "#eab308" },
  { from: "n-ianeus", to: "n-lavreion", label: "Ισοψηφία (666)", type: "same_root", color: "#eab308" },
  { from: "n-telianos", to: "n-nikitis", label: "Ισοψηφία (666)", type: "same_root", color: "#eab308" },
  { from: "n-ianeus", to: "n-combo-1332", label: "+ ΤΕΛΙΑΝΟΣ = 1332", type: "sum", color: "#c084fc" },
  { from: "n-telianos", to: "n-combo-1332", label: "+ ΙΑΝΕΥΣ = 1332", type: "sum", color: "#c084fc" },
  { from: "n-poros-penia", to: "n-ianeus", label: "Αλληγορία 666", type: "relation", color: "#f59e0b" },
  { from: "n-ihsous", to: "n-xristos", label: "888 + 1480", type: "sum", color: "#38bdf8" },
  { from: "n-ihsous", to: "n-ihsous-xristos", label: "Σύνθεση = 2368", type: "sum", color: "#60a5fa" },
  { from: "n-xristos", to: "n-ihsous-xristos", label: "Σύνθεση = 2368", type: "sum", color: "#60a5fa" },
  { from: "n-dias", to: "n-zeus", label: "Ολύμπια Σχέση", type: "relation", color: "#ec4899" },
  { from: "n-o-on", to: "n-aion", label: "Οντολογία", type: "relation", color: "#10b981" },
  { from: "n-ihsous", to: "n-aion", label: "Κοινός Πυθμένας (6)", type: "same_root", color: "#38bdf8" },
  { from: "n-ianeus", to: "n-zeus", label: "Κοινός Πυθμένας (9)", type: "same_root", color: "#eab308" },
];

export const IsopsephicGraphTab: React.FC<IsopsephicGraphTabProps> = ({
  savedItems,
  onSaveItem,
  onOpenAiModal,
  onNavigateToCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  // Position nodes in a harmonic circle/cluster layout
  const nodes: GraphNode[] = useMemo(() => {
    const total = CANONICAL_NODES.length;
    const centerX = 450;
    const centerY = 320;
    const radius = 230;

    return CANONICAL_NODES.map((n, i) => {
      let angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      let dist = radius;

      // Special cluster positioning for 666 group and 888 group
      if (n.category === "lavreion") {
        dist = radius * 0.85;
      } else if (n.category === "theological") {
        dist = radius * 1.1;
      }

      const x = centerX + dist * Math.cos(angle);
      const y = centerY + dist * Math.sin(angle);

      return {
        ...n,
        x,
        y,
      };
    });
  }, []);

  const filteredNodes = useMemo(() => {
    if (selectedCategory === "all") return nodes;
    return nodes.filter((n) => n.category === selectedCategory);
  }, [nodes, selectedCategory]);

  const activeNodeIds = useMemo(() => {
    return new Set(filteredNodes.map((n) => n.id));
  }, [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return CANONICAL_EDGES.filter(
      (e) => activeNodeIds.has(e.from) && activeNodeIds.has(e.to)
    );
  }, [activeNodeIds]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17140e] via-[#211a12] to-[#17140e] border border-[#3a2e20] shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#c89b3c]/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[#2a2217] border border-[#c89b3c]/40 text-[#e6c670]">
                <Network className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                Διαδραστικός Χάρτης Ισοψηφικών Σταθμών
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#a69680] font-serif">
              Οπτικοποίηση του δικτύου θεμελιωδών λεξαρίθμων (666 Λαύρειον, 888 Ιησούς, 1480 Χριστός, 2368, 1332) και των μαθηματικών συνδέσεών τους.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetView}
              className="px-3 py-2 rounded-xl bg-[#1e1913] hover:bg-[#2c2217] border border-[#3e3020] text-xs font-serif text-[#d6c7b2] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Επαναφορά Κεντραρίσματος"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Κεντράρισμα</span>
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
              className="p-2 rounded-xl bg-[#1e1913] hover:bg-[#2c2217] border border-[#3e3020] text-xs text-[#d6c7b2] transition-all cursor-pointer"
              title="Μεγέθυνση"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
              className="p-2 rounded-xl bg-[#1e1913] hover:bg-[#2c2217] border border-[#3e3020] text-xs text-[#d6c7b2] transition-all cursor-pointer"
              title="Σμίκρυνση"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 pt-3 border-t border-[#2a2217] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-serif text-[#8c7e6c] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Κατηγορίες:
          </span>
          {[
            { id: "all", label: "Όλοι οι Σταθμοί" },
            { id: "lavreion", label: "🏛️ 666 Αλληγορία Λαυρείου" },
            { id: "theological", label: "✨ 888 & 1480 Θεία Ονόματα" },
            { id: "mythological", label: "⚡ Μυθολογία (Δίας, Απόλλων)" },
            { id: "philosophical", label: "📜 Φιλοσοφία (Ο Ων, Αιών)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-serif transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-[#c89b3c] text-black font-bold shadow-md shadow-[#c89b3c]/20"
                  : "bg-[#18140f] text-[#a69680] hover:text-[#f5ecd8] border border-[#2d241a]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Graph Canvas */}
        <div className="lg:col-span-8 p-2 rounded-2xl bg-[#0b0a08] border border-[#2d241a] shadow-inner relative overflow-hidden min-h-[520px] flex items-center justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 900 640"
            className="w-full h-[520px] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c89b3c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#c89b3c" stopOpacity="0" />
              </radialGradient>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#221a12" strokeWidth="0.75" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Central Harmonic Circles */}
              <circle cx="450" cy="320" r="195" fill="none" stroke="#2b2116" strokeDasharray="4 6" strokeWidth="1" />
              <circle cx="450" cy="320" r="255" fill="none" stroke="#231a11" strokeDasharray="6 8" strokeWidth="1" />

              {/* Edge Links */}
              {filteredEdges.map((edge, idx) => {
                const source = nodes.find((n) => n.id === edge.from);
                const target = nodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                const isSelected = selectedNode?.id === source.id || selectedNode?.id === target.id;

                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={edge.color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                      strokeDasharray={edge.type === "same_root" ? "4 4" : undefined}
                    />
                    {/* Edge Midpoint Label */}
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 4}
                      fill="#a69680"
                      fontSize="9"
                      fontFamily="serif"
                      textAnchor="middle"
                      className="bg-[#0b0a08]"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Graph Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Outer Glow */}
                    <circle
                      r={node.radius + (isSelected ? 14 : 6)}
                      fill={node.color}
                      opacity={isSelected ? 0.35 : 0.12}
                      className="transition-all"
                    />

                    {/* Main Node Body */}
                    <circle
                      r={node.radius}
                      fill="#14110d"
                      stroke={node.color}
                      strokeWidth={isSelected ? 3 : 1.75}
                      className="transition-all hover:scale-105"
                    />

                    {/* Node Text Content */}
                    <text
                      y="-4"
                      textAnchor="middle"
                      fill="#f5ecd8"
                      fontSize={node.radius > 36 ? "11" : "10"}
                      fontFamily="serif"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>

                    {/* Value Badge */}
                    <text
                      y="14"
                      textAnchor="middle"
                      fill={node.color}
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="extrabold"
                    >
                      {node.value}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-serif uppercase tracking-wider px-2.5 py-0.5 rounded font-bold border"
                  style={{
                    backgroundColor: `${selectedNode.color}15`,
                    color: selectedNode.color,
                    borderColor: `${selectedNode.color}40`,
                  }}
                >
                  {selectedNode.categoryLabel}
                </span>
                <span className="text-xs font-mono text-[#8c7e6c]">
                  Πυθμένας: <strong className="text-[#f5ecd8]">{selectedNode.root}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-extrabold text-[#f5ecd8]">
                  {selectedNode.label}
                </h3>
                <div className="text-xs font-serif text-[#8c7e6c]">
                  Ιωνικά ψηφία: {numberToGreekNumeral(selectedNode.value)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-xs font-serif text-[#8c7e6c]">Ισοψηφικός Λεξάριθμος:</div>
                <div className="text-3xl font-serif font-extrabold" style={{ color: selectedNode.color }}>
                  {selectedNode.value}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-serif text-[#8c7e6c]">Περιγραφή & Ερμηνεία:</div>
                <p className="text-xs sm:text-sm font-serif text-[#d6c7b2] leading-relaxed p-3 rounded-xl bg-[#0e0c0a] border border-[#261e15]">
                  {selectedNode.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() =>
                    onOpenAiModal(selectedNode.label, selectedNode.value, [selectedNode.label])
                  }
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#9c762b] hover:to-[#dbaa45] text-black font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Ερμηνεία Κόμβου</span>
                </button>

                <button
                  onClick={() =>
                    onSaveItem({
                      text: selectedNode.label,
                      normalized: selectedNode.label,
                      value: selectedNode.value,
                      root: selectedNode.root,
                      greekNumeral: numberToGreekNumeral(selectedNode.value),
                      isPhrase: selectedNode.label.includes(" "),
                      wordCount: selectedNode.label.split(/\s+/).filter(Boolean).length,
                      notes: selectedNode.description,
                      category: selectedNode.categoryLabel,
                    })
                  }
                  className="w-full py-2 rounded-xl bg-[#1e1913] hover:bg-[#2a2219] border border-[#3e3020] text-xs font-serif text-[#e6c670] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Αποθήκευση στο Αρχείο</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 my-auto">
              <Compass className="w-10 h-10 text-[#5a4c3a] mx-auto animate-spin-slow" />
              <h4 className="text-sm font-serif font-bold text-[#f5ecd8]">
                Επιλέξτε έναν Ισοψηφικό Κόμβο
              </h4>
              <p className="text-xs font-serif text-[#a69680] leading-relaxed">
                Κάντε κλικ σε οποιονδήποτε κύκλο του χάρτη για να δείτε την ανάλυση, τον πυθμένα και τις συνδέσεις του με άλλες έννοιες.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
