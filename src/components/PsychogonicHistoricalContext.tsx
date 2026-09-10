import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import {
  BookOpen,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Share2,
  Layers,
  Box,
  Compass,
  Sun,
  Shield,
  HelpCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

// Generated classical illustrations for the historical context
import imgPlatoCosmology from "../assets/images/psychogonic_plato_cosmology_1788192736962.jpg";
import imgPythagoreanTriad from "../assets/images/pythagorean_triple_cubes_1788192751596.jpg";
import imgOrphicSolar from "../assets/images/orphic_solar_transmigration_1788192768260.jpg";

export type HistoricalTheme =
  | "all"
  | "plato_nuptial"
  | "pythagorean_triad"
  | "orphic_cosmology"
  | "isopsephy_theology";

interface HistoricalThemeOption {
  id: HistoricalTheme;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  primaryAuthor: string;
}

const HISTORICAL_THEMES: HistoricalThemeOption[] = [
  {
    id: "all",
    title: "Πλήρης Κοσμολογική & Φιλοσοφική Μελέτη (216 = 6³)",
    shortTitle: "Πλήρης Σύνθεση",
    description: "Ολοκληρωμένη επισκόπηση του Ψυχογονικού Κύβου στην Πλατωνική, Πυθαγόρεια και Ορφική παράδοση.",
    icon: "📜",
    primaryAuthor: "Πλάτων & Πυθαγόρειοι",
  },
  {
    id: "plato_nuptial",
    title: "Πλάτων & Γαμήλιος Αριθμός (Πολιτεία 546c - Μετενσάρκωση 216 Ετών)",
    shortTitle: "Πλατωνικός Αριθμός 546c",
    description: "Ο γεωμετρικός αριθμός της ευγονίας των ψυχών, η τριμερής ψυχή και η περίοδος μετεμψύχωσης 216 ετών κατά τον Πρόκλο.",
    icon: "🏛️",
    primaryAuthor: "Πλάτων (Πολιτεία 546c, Τίμαιος)",
  },
  {
    id: "pythagorean_triad",
    title: "Πυθαγόρεια Αρμονία: 3³ + 4³ + 5³ = 6³ = 216",
    shortTitle: "Πυθαγόρεια Τριάδα (3-4-5)",
    description: "Η τρισδιάστατη σύνθεση των κύβων του Ιερού Τριγώνου στον πρώτο τέλειο κύβο του 6 (27 + 64 + 125 = 216).",
    icon: "📐",
    primaryAuthor: "Πυθαγόρειοι & Νικόμαχος",
  },
  {
    id: "orphic_cosmology",
    title: "Ορφική & Ηλιακή Κοσμολογία (Mensa Solis 6×6, 216 Μοίρες & 666)",
    shortTitle: "Ηλιακή Κοσμολογία & 666",
    description: "Η δομή του Ήλιου (6 επίπεδα × 36 κελιά = 216), το άθροισμα 666 (Τ_36) και ο κοσμικός συντονισμός 216 Hz.",
    icon: "☀️",
    primaryAuthor: "Ορφικά & Απόλλων",
  },
  {
    id: "isopsephy_theology",
    title: "Ισοψηφικές Συσχετίσεις: ΖΕΥΣ (612), ΔΙΑΣ (215), ΑΛΗΘΕΙΑ (64)",
    shortTitle: "Ισοψηφία & Θεογονία",
    description: "Ο αναγραμματισμός 216 ➔ 612 (ΖΕΥΣ), το 216 - 1 = 215 (ΔΙΑΣ) και ο εσωτερικός συμβολισμός των αριθμών.",
    icon: "⚖️",
    primaryAuthor: "Ελληνική Ισοψηφία",
  },
];

interface GalleryImage {
  src: string;
  title: string;
  caption: string;
  themeRef: string;
  historicalQuote: string;
}

const HISTORICAL_GALLERY: GalleryImage[] = [
  {
    src: imgPlatoCosmology,
    title: "Πλατωνική Κοσμολογία & ο Ψυχογονικός Κύβος 6³",
    caption: "Ο Πλάτων και οι Πυθαγόρειοι στοχαστές μελετούν τον ακτινοβόλο γεωμετρικό κύβο 6×6×6 (216) κάτω από τις ουράνιες σφαίρες της Αθηναϊκής Ακαδημίας.",
    themeRef: "Πλάτων, Πολιτεία 546b-c & Τίμαιος 35b",
    historicalQuote: "«Ἔστι δὲ θείῳ μὲν γεννητῷ περίοδος ἣν ἀριθμὸς περιλαμβάνει τέλειος...»",
  },
  {
    src: imgPythagoreanTriad,
    title: "Πυθαγόρεια Αρμονία: 3³ + 4³ + 5³ = 6³ = 216",
    caption: "Οι τρεις κρυσταλλικοί κύβοι των πλευρών του Ιερού Τριγώνου (27 + 64 + 125) ενώνονται αρμονικά στον μέγα Ψυχογονικό Κύβο των 216 voxels.",
    themeRef: "Πυθαγόρειοι Αριθμοί & Νικόμαχος Γερασηνός",
    historicalQuote: "«27 (Νους) + 64 (Αλήθεια) + 125 (Ζωή) = 216 (Ψυχογονικός Κύβος)»",
  },
  {
    src: imgOrphicSolar,
    title: "Η Περιοδικότητα των 216 Ετών & η Ηλιακή Μετενσάρκωση",
    caption: "Ο κυκλικός τροχός της μετενσάρκωσης των ψυχών (ψυχογονική περίοδος 216 ετών) συντονισμένος με το ηλιακό άρμα του Φοίβου Απόλλωνος.",
    themeRef: "Πρόκλος, Υπόμνημα εις την Πολιτείαν & Ορφικά Μυστήρια",
    historicalQuote: "«Ἑπτάκις διακόσια δέκα ἕξ ἔτη καθαίρουσι τὴν ψυχὴν εἰς τὰς ἑπτὰ σφαίρας.»",
  },
];

interface PrimarySource {
  author: string;
  work: string;
  citation: string;
  greekSnippet: string;
  translation: string;
  commentary: string;
}

const PRIMARY_SOURCES: PrimarySource[] = [
  {
    author: "Πλάτων",
    work: "Πολιτεία (Βιβλίο Η΄)",
    citation: "546b – 546c",
    greekSnippet: "«Ἔστι δὲ θείῳ μὲν γεννητῷ περίοδος ἣν ἀριθμὸς περιλαμβάνει τέλειος, ἀνθρωπείῳ δὲ ἐν ᾧ πρώτῳ αὐξήσεις δυνάμεναι τε καὶ δυναστευόμεναι...»",
    translation: "Για το θείο γέννημα υπάρχει μια περίοδος που την περιλαμβάνει ένας τέλειος αριθμός, ενώ για το ανθρώπινο υπάρχει εκείνος στον οποίο οι αυξήσεις συντελούνται στις τρεις διαστάσεις...",
    commentary: "Πρόκειται για το θεμελιώδες χωρίο του «Γαμήλιου Αριθμού». Ο αριθμός 6 είναι ο πρώτος τέλειος αριθμός (1+2+3=6), και ο κύβος του 6³ = 216 είναι ο ελάχιστος στερεός αριθμός που συγκροτεί την ανθρώπινη ψυχή.",
  },
  {
    author: "Πρόκλος ο Διάδοχος",
    work: "Υπόμνημα εις την Πολιτείαν Πλάτωνος",
    citation: "Τομ. Β΄, σ. 398",
    greekSnippet: "«Ὁ δὲ τῶν διακοσίων δεκαέξ ἀριθμὸς ψυχογονικὸς ὤν, τὴν τῆς ψυχῆς περίοδον ἀνακυκλεῖ...»",
    translation: "Ο δε αριθμός 216 όντας ψυχογονικός, ανακυκλώνει την περίοδο της ψυχής...",
    commentary: "Ο Πρόκλος εξηγεί ρητά ότι το 216 είναι ο χρόνος σε έτη που απαιτείται για να ολοκληρώσει η ψυχή έναν πλήρη κύκλο επιστροφής και αναγέννησης, ενώ 7 τέτοιοι κύκλοι (1512 έτη) οδηγούν στην πλήρη πλανητική αποκατάσταση.",
  },
  {
    author: "Πλούταρχος",
    work: "Περί Ίσιδος και Οσίριδος",
    citation: "Κεφ. 56 (373e)",
    greekSnippet: "«Τὸ δὲ τρίγωνον τὸ κάλλιστον, οὗ ἡ μὲν κάθετος τριῶν, ἡ δὲ βάσις τεσσάρων, ἡ δὲ ὑποτείνουσα πέντε...»",
    translation: "Το ωραιότερο ορθογώνιο τρίγωνο, του οποίου η κάθετος είναι 3, η βάση 4 και η υποτείνουσα 5...",
    commentary: "Ο Πλούταρχος αναλύει τις αναλογίες του ιερού τριγώνου 3-4-5. Στον τρισδιάστατο χώρο, οι κύβοι 3³ + 4³ + 5³ = 27 + 64 + 125 = 216 συνθέτουν τον Ψυχογονικό Κύβο.",
  },
  {
    author: "Ιάμβλιχος",
    work: "Τα Θεολογούμενα της Αριθμητικής",
    citation: "Περί Εξάδος (σ. 39-44)",
    greekSnippet: "«Ἡ ἑξὰς μόνη τῶν ἐντὸς τῆς δεκάδος ἀριθμῶν τέλειος, ἐξ ὧν συντέθηκε τοῖς ἰδίοις μέρεσιν ἰσουμένη...»",
    translation: "Η εξάδα είναι ο μόνος τέλειος αριθμός εντός της δεκάδας, καθώς ισούται με τα δικά της μέρη...",
    commentary: "Η εξάδα ονομάζεται «Γάμος» και «Ψυχογονία». Ο κύβος της 6³ = 216 ενσαρκώνει τη στερεή ισορροπία ύλης και πνεύματος.",
  },
];

export const PsychogonicHistoricalContext: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<HistoricalTheme>("all");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>("Τ.Ν. ΙΩΑΝΝΗΣ 1.0");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryImage | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [expandedSources, setExpandedSources] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Fetch or synthesize context from Gemini API
  const fetchHistoricalAnalysis = async (theme: HistoricalTheme) => {
    setIsLoading(true);
    try {
      const userApiKey = localStorage.getItem("GEMINI_USER_API_KEY") || undefined;
      const res = await fetch("/api/gemini/psychogonic-historical-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          customApiKey: userApiKey,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch historical context");
      }

      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
      if (data.modelUsed) {
        setModelUsed(data.modelUsed);
      }
    } catch (err) {
      console.error("Historical context fetch failed, falling back:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load on mount or when theme changes
  useEffect(() => {
    fetchHistoricalAnalysis(selectedTheme);
  }, [selectedTheme]);

  // Audio tone synthesizer (216 Hz pure tone)
  const toggle216HzTone = () => {
    if (isPlayingAudio) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
        oscRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = audioCtxRef.current || new AudioCtx();
        audioCtxRef.current = ctx;

        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 216 Hz Pythagorean pure harmonic frequency (A=432 Hz / 2)
        osc.type = "sine";
        osc.frequency.setValueAtTime(216, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        setIsPlayingAudio(true);
      } catch (err) {
        console.error("Audio failed:", err);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="historical-context-section" className="mt-8 pt-8 border-t-2 border-[#3b2917] space-y-8">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c120a] via-[#140c06] to-[#0d0703] border-2 border-[#ffd700]/40 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Background Light */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#c89b3c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] text-xs font-serif font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Αρχαιοελληνική Κοσμολογία & Φιλοσοφία
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#f5ecd8] tracking-tight">
              Ιστορικό Πλαίσιο: Ο Ψυχογονικός Κύβος (216 = 6³)
            </h3>
            <p className="text-sm text-[#ebd8c5] leading-relaxed">
              Επιστημονική, φιλολογική και γεωμετρική ανάλυση της επίδρασης του αριθμού <strong>216</strong> στην
              Πλατωνική κοσμογονία (<em>Πολιτεία 546c</em>), την Πυθαγόρεια θεωρία των αριθμών (<em>3³ + 4³ + 5³ = 6³</em>),
              την περίοδο μετενσάρκωσης των ψυχών (<em>216 έτη</em>) και το Ηλιακό Τετράγωνο (<em>6×6=36 & 666</em>), συντεθειμένη με τη βοήθεια του Gemini (Τ.Ν. ΙΩΑΝΝΗΣ 1.0).
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5">
            <button
              type="button"
              onClick={toggle216HzTone}
              className={`px-4 py-2.5 rounded-2xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                isPlayingAudio
                  ? "bg-[#ffd700] text-[#120d07] ring-2 ring-[#ffd700]/50 animate-pulse"
                  : "bg-[#25170c] text-[#ffd700] border border-[#ffd700]/40 hover:bg-[#332010]"
              }`}
              title="Αναπαραγωγή καθαρού αρμονικού τόνου 216 Hz"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isPlayingAudio ? "Παλμός 216 Hz Ενεργός" : "Ήχος 216 Hz (Πυθαγόρειος Παλμός)"}</span>
            </button>

            <button
              type="button"
              onClick={() => fetchHistoricalAnalysis(selectedTheme)}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl text-xs font-serif font-bold bg-[#1e1309] hover:bg-[#2c1b0d] text-[#ebd8c5] border border-[#3b2713] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#ffd700] ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Σύνθεση σε εξέλιξη..." : "Ανανέωση με Gemini"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#ffd700]" />
            Εικαστική & Κοσμολογική Πινακοθήκη του 216
          </h4>
          <span className="text-xs text-[#a69680] font-serif">3 Θεματικές Παραστάσεις (Κάντε κλικ για μεγέθυνση)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HISTORICAL_GALLERY.map((img, idx) => (
            <div
              key={`gallery-img-${idx}`}
              onClick={() => setActiveLightboxImage(img)}
              className="group relative rounded-2xl overflow-hidden bg-[#140e08] border-2 border-[#3b2917] hover:border-[#ffd700] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={img.src}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140e08] via-transparent to-transparent opacity-80" />
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#120d07]/80 text-[#ffd700] border border-[#ffd700]/40 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#120d07]/90 text-[11px] font-mono text-[#ffd700] border border-[#ffd700]/30">
                  {img.themeRef}
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h5 className="text-sm font-serif font-bold text-[#f5ecd8] group-hover:text-[#ffd700] transition-colors line-clamp-1">
                    {img.title}
                  </h5>
                  <p className="text-xs text-[#a69680] line-clamp-2 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#2b1d10] text-[11px] font-serif italic text-[#c89b3c]">
                  {img.historicalQuote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-serif font-bold text-[#a69680] uppercase tracking-wider">
            Επιλέξτε Θεματική Εστίαση για Ανάλυση:
          </label>
          <span className="text-xs font-mono text-[#ffd700]">
            Μοντέλο: {modelUsed}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {HISTORICAL_THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? "bg-[#2b1b0d] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.2)] text-[#f5ecd8]"
                    : "bg-[#140e08] border-[#3b2713] hover:border-[#ffd700]/50 hover:bg-[#1a120a] text-[#ebd8c5]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{theme.icon}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-[#ffd700] text-[#120d07] font-bold" : "bg-[#25170c] text-[#a69680]"
                  }`}>
                    {theme.primaryAuthor.split(" ")[0]}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-serif font-bold leading-tight">
                    {theme.shortTitle}
                  </div>
                  <div className="text-[10px] text-[#8c7a68] line-clamp-1 mt-0.5">
                    {theme.primaryAuthor}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Markdown Reader Card */}
      <div className="relative rounded-3xl bg-[#120c07] border-2 border-[#3b2917] p-6 sm:p-8 shadow-xl space-y-6">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#2d1e10] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#24170c] border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#f5ecd8]">
                {HISTORICAL_THEMES.find((t) => t.id === selectedTheme)?.title}
              </h4>
              <p className="text-xs text-[#a69680]">
                Σύνθεση περιεχομένου με ανάλυση αρχαίων πηγών
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl text-xs font-serif bg-[#1c130b] hover:bg-[#281c10] text-[#ebd8c5] border border-[#3b2713] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#ffd700]" />}
              <span>{copied ? "Αντιγράφηκε!" : "Αντιγραφή Μελέτης"}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#ffd700]/30 border-t-[#ffd700] animate-spin" />
              <Sparkles className="w-5 h-5 text-[#ffd700] absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-serif font-bold text-[#ffd700]">
                Η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0» συνθέτει την ιστορική ανάλυση...
              </p>
              <p className="text-xs text-[#8c7a68]">
                Ανασκόπηση πλατωνικών διαλόγων, πυθαγόρειων θραυσμάτων και νεοπλατωνικών σχολίων
              </p>
            </div>
          </div>
        ) : (
          <div className="markdown-body prose prose-invert max-w-none text-[#ebd8c5] text-sm sm:text-base leading-relaxed space-y-4 font-serif">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>

      {/* Primary Historical Classical Sources Accordion */}
      <div className="rounded-3xl bg-[#140e08] border border-[#3b2917] overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedSources(!expandedSources)}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1a120a] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#24170c] border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-serif font-bold text-[#f5ecd8]">
                Αυθεντικές Αρχαίες Πηγές & Αποσπάσματα (Πλάτων, Πρόκλος, Πλούταρχος, Ιάμβλιχος)
              </h4>
              <p className="text-xs text-[#a69680]">
                4 θεμελιώδη χωρία της κλασικής γραμματείας για τον αριθμό 216
              </p>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#1f150c] text-[#ffd700]">
            {expandedSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {expandedSources && (
          <div className="p-5 sm:p-6 pt-0 space-y-4 border-t border-[#2b1d10]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRIMARY_SOURCES.map((source, idx) => (
                <div
                  key={`source-${idx}`}
                  className="p-4 rounded-2xl bg-[#0e0905] border border-[#3b2713] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#25180d] pb-2">
                      <span className="text-xs font-serif font-bold text-[#ffd700]">
                        {source.author} — <em>{source.work}</em>
                      </span>
                      <span className="text-[11px] font-mono text-[#a69680] bg-[#1a1108] px-2 py-0.5 rounded-full border border-[#3b2713]">
                        {source.citation}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#140e08] border-l-2 border-[#ffd700] text-xs font-serif italic text-[#f5ecd8] leading-relaxed">
                      {source.greekSnippet}
                    </div>

                    <p className="text-xs text-[#ebd8c5] font-serif leading-relaxed">
                      <strong>Μετάφραση:</strong> {source.translation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#25180d] text-[11px] text-[#a69680] leading-relaxed">
                    <strong className="text-[#c89b3c]">Σχολιασμός:</strong> {source.commentary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for High-Resolution Visual Inspection */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-[#140e08] border-2 border-[#ffd700] overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#3b2917] pb-3">
              <div>
                <h4 className="text-lg font-serif font-bold text-[#ffd700]">
                  {activeLightboxImage.title}
                </h4>
                <p className="text-xs text-[#a69680]">
                  {activeLightboxImage.themeRef}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                className="p-2 rounded-xl bg-[#24170c] text-[#ffd700] hover:bg-[#382312] transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-[#3b2917]">
              <img
                src={activeLightboxImage.src}
                alt={activeLightboxImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0e0905] border border-[#3b2713] space-y-2">
              <p className="text-sm font-serif text-[#ebd8c5] leading-relaxed">
                {activeLightboxImage.caption}
              </p>
              <p className="text-xs font-serif italic text-[#ffd700]">
                {activeLightboxImage.historicalQuote}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
