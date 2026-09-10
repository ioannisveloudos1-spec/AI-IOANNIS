import React, { useState, useMemo } from "react";
import { TabType } from "../types";
import { AppTheme } from "../utils/theme";
import {
  Calculator,
  Search,
  ScrollText,
  Sun,
  Globe,
  Calendar,
  Sparkles,
  GitCompare,
  Grid,
  SpellCheck,
  Network,
  Binary,
  Box,
  Shield,
  Gamepad2,
  BarChart3,
  BookMarked,
  BookOpen,
  LayoutGrid,
  ArrowRight,
  BookOpenCheck,
  Flame,
  CheckCircle2,
  ExternalLink,
  Waves,
} from "lucide-react";

interface AllTabsPortalTabProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedCount?: number;
  theme?: AppTheme;
}

export interface TabPortalItem {
  id: TabType;
  title: string;
  subtitle: string;
  category: "calc" | "myth" | "geometry" | "tools";
  categoryName: string;
  icon: React.ComponentType<{ className?: string }>;
  bgImage: string;
  accentColor: string;
  badge?: string | number;
  highlight?: boolean;
}

export const ALL_TAB_ITEMS: TabPortalItem[] = [
  {
    id: "europe",
    title: "Η Μυθική Ευρώπη",
    subtitle: "Το μυθιστόρημα του Ιωάννη Βελούδου, ο Ταύρος του Διός, η Κρήτη & τα Ιερά Σύμβολα",
    category: "myth",
    categoryName: "Μύθος & Λογοτεχνία",
    icon: BookOpenCheck,
    bgImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    accentColor: "#ffd700",
    badge: "ΝΕΟ ΜΥΘΙΣΤΟΡΗΜΑ",
    highlight: true,
  },
  {
    id: "calculator",
    title: "Υπολογισμός Λεξαρίθμων",
    subtitle: "Μεμονωμένες λέξεις, πράξεις, 27 Ιωνικά γράμματα & Πυθαγόρειος Πυθμήν",
    category: "calc",
    categoryName: "Βασικά & Υπολογισμοί",
    icon: Calculator,
    bgImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    accentColor: "#f59e0b",
  },
  {
    id: "acoustic-synth",
    title: "Ακουστικός Συνθέτης & Εργαστήριο Hz",
    subtitle: "Πυθαγόρειες συχνότητες, Web Audio API, μετρητής μικροφώνου, κύματα & Cymatics Chladni",
    category: "tools",
    categoryName: "Εργαλεία & Ακουστική",
    icon: Waves,
    bgImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    accentColor: "#ffd700",
    badge: "WEB AUDIO",
    highlight: true,
  },
  {
    id: "search",
    title: "Αναζήτηση & Συνδυασμοί",
    subtitle: "Ανάλυση κειμένων, εντοπισμός λέξεων με την ίδια ισοψηφία & λεξαριθμικές ταυτότητες",
    category: "calc",
    categoryName: "Βασικά & Υπολογισμοί",
    icon: Search,
    bgImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    accentColor: "#38bdf8",
  },
  {
    id: "golden-verses",
    title: "Τα Χρυσά Έπη",
    subtitle: "Τα Χρυσά Έπη του Πυθαγόρα σε αρχαίο πρωτότυπο & νεοελληνική απόδοση",
    category: "myth",
    categoryName: "Μυστικισμός & Μύθοι",
    icon: ScrollText,
    bgImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80",
    accentColor: "#eab308",
  },
  {
    id: "solar-iota-danaos",
    title: "Ι & ΔΑ-ΝΑΟΣ",
    subtitle: "Το Ηλιακόν Ι (1111), ο ΔΑ-ΝΑΟΣ, η Ιερά Τετρακτύς, Infernus, Beatrice (666=666) & Μακάρια",
    category: "myth",
    categoryName: "Μυστικισμός & Μύθοι",
    icon: Sun,
    bgImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    accentColor: "#fbbf24",
    highlight: true,
  },
  {
    id: "calendar",
    title: "Αρχαιοελληνικό Ημερολόγιο",
    subtitle: "Αττικοί & Σύγχρονοι Μήνες, Θεότητες, Σεληνιακοί κύκλοι & Ισημερίες",
    category: "tools",
    categoryName: "Εργαλεία & Χρόνος",
    icon: Calendar,
    bgImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    accentColor: "#a78bfa",
  },
  {
    id: "cosmic-journey",
    title: "Κοσμική Ανάταση",
    subtitle: "Διαδραστικό μυθολογικό ταξίδι 4 Πράξεων & Μύησης προς την κοσμική επίγνωση",
    category: "myth",
    categoryName: "Μυστικισμός & Μύθοι",
    icon: Sparkles,
    bgImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
    accentColor: "#c084fc",
  },
  {
    id: "online-finder",
    title: "Ανιχνευτής Web & 1119",
    subtitle: "Online λεξικά, ιστοσελίδες, URL & το μυστικό του αριθμού 1119 (ΙΩΑΝΝΗΣ)",
    category: "calc",
    categoryName: "Βασικά & Υπολογισμοί",
    icon: Globe,
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    accentColor: "#60a5fa",
  },
  {
    id: "bridges",
    title: "Γέφυρες Ισοψηφίας",
    subtitle: "Σύγκριση & μαθηματικές σχέσεις μεταξύ διαφορετικών ονομάτων και φράσεων",
    category: "calc",
    categoryName: "Βασικά & Υπολογισμοί",
    icon: GitCompare,
    bgImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    accentColor: "#34d399",
  },
  {
    id: "anagrams",
    title: "Matrix 3×3 & Αναγραμματισμοί",
    subtitle: "Πυθαγόρειο Matrix 3×3, αναγραμματισμοί γραμμάτων & γεωμετρικές ισορροπίες",
    category: "geometry",
    categoryName: "Γεωμετρία & Τετράγωνα",
    icon: Grid,
    bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    accentColor: "#2dd4bf",
  },
  {
    id: "grammatari",
    title: "ΓΡΑΜΜΑΤΑΡΙ",
    subtitle: "Υπο-Αναγραμματισμοί 4-9 γραμμάτων & αυτόματη δημιουργία λεξιλογίου",
    category: "calc",
    categoryName: "Βασικά & Υπολογισμοί",
    icon: SpellCheck,
    bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    accentColor: "#f472b6",
  },
  {
    id: "graph",
    title: "Χάρτης Σταθμών & Δίκτυο",
    subtitle: "Δίκτυο οπτικοποίησης κόμβων, διασυνδέσεων & λεξαριθμικών συσχετίσεων",
    category: "tools",
    categoryName: "Εργαλεία & Οπτικοποίηση",
    icon: Network,
    bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    accentColor: "#818cf8",
  },
  {
    id: "veloudion",
    title: "ΒΕΛΟΥΔΙΟΝ",
    subtitle: "Τριαδική κρυπτογραφία & 8 Συστήματα αρίθμησης του Ιωάννη Βελούδου",
    category: "calc",
    categoryName: "Βασικά & Υπολογισμοί",
    icon: Binary,
    bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    accentColor: "#10b981",
    highlight: true,
  },
  {
    id: "cube-apollo",
    title: "3D Κύβος Απόλλωνος (1331)",
    subtitle: "Τρισδιάστατος Κύβος 11³ = 1331, ακμές, κορυφές & αρμονικές αναλογίες",
    category: "geometry",
    categoryName: "Γεωμετρία & Τετράγωνα",
    icon: Box,
    bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    accentColor: "#f59e0b",
  },
  {
    id: "solar-square",
    title: "Μαγικό Τετράγωνο Ηλίου (6×6)",
    subtitle: "Το Μαγικό Τετράγωνο 6×6, σταθερά γραμμών 111 & άθροισμα 666",
    category: "geometry",
    categoryName: "Γεωμετρία & Τετράγωνα",
    icon: Sun,
    bgImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    accentColor: "#d97706",
  },
  {
    id: "seed-of-light",
    title: "A SEED OF LIGHT (666)",
    subtitle: "A SEED OF LIGHT = 666, 1331 & ο Ήλιος του Πυθαγόρα",
    category: "myth",
    categoryName: "Μυστικισμός & Μύθοι",
    icon: Sparkles,
    bgImage: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    accentColor: "#fbbf24",
  },
  {
    id: "enotheism",
    title: "Ενοθεϊσμός & Το Εν",
    subtitle: "Ζευς, Άδης, Ποσειδών, Απόλλων, Διόνυσος, Ηρακλής & η συμπαντική ενότης",
    category: "myth",
    categoryName: "Μυστικισμός & Μύθοι",
    icon: Shield,
    bgImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    accentColor: "#38bdf8",
  },
  {
    id: "game",
    title: "Αρένα & Παιχνίδι 60s",
    subtitle: "Κουίζ λεξαρίθμων, ταχύτητα υπολογισμών & μάχη γνώσεων ενάντια στον χρόνο",
    category: "tools",
    categoryName: "Εργαλεία & Ψυχαγωγία",
    icon: Gamepad2,
    bgImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    accentColor: "#ec4899",
  },
  {
    id: "stats",
    title: "Στατιστική & Γραφήματα",
    subtitle: "Οπτικοποίηση συχνοτήτων, πυθμένες 1-9, κατανομές & εξαγωγή δεδομένων CSV",
    category: "tools",
    categoryName: "Εργαλεία & Οπτικοποίηση",
    icon: BarChart3,
    bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    accentColor: "#10b981",
  },
  {
    id: "archive",
    title: "Θησαυρός Λεξαρίθμων",
    subtitle: "Αποθηκευμένες λέξεις & φράσεις, εξαγωγή PDF με μαίανδρο, φάκελοι & ιστορικό",
    category: "tools",
    categoryName: "Εργαλεία & Αρχείο",
    icon: BookMarked,
    bgImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
    accentColor: "#f59e0b",
  },
  {
    id: "guide",
    title: "Οδηγός & 666",
    subtitle: "Πλήρης κανόνας Ιωνικής αρίθμησης, ιστορικές αναφορές, 666 & μαθηματικά κλειδιά",
    category: "tools",
    categoryName: "Εργαλεία & Γνώση",
    icon: BookOpen,
    bgImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    accentColor: "#c084fc",
  },
];

export const AllTabsPortalTab: React.FC<AllTabsPortalTabProps> = ({
  currentTab,
  onSelectTab,
  savedCount = 0,
  theme = "dark-ancient",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTabs = useMemo(() => {
    return ALL_TAB_ITEMS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div id="all-tabs-portal-container" className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Portal Hero Header */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl relative overflow-hidden ${
          theme === "parchment" || theme === "ancient-calligraphy"
            ? "bg-gradient-to-br from-[#f8f2e6] via-[#efe3cf] to-[#e4d2b9] border-[#bca07a] text-[#3d240e]"
            : theme === "solar"
            ? "bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fde68a] border-[#d97706] text-[#78350f]"
            : theme === "ethereal"
            ? "bg-gradient-to-br from-[#0a1228] via-[#0f1d40] to-[#162a5c] border-[#38bdf8] text-[#e0f2fe]"
            : theme === "cyber-tech"
            ? "bg-gradient-to-br from-[#061814] via-[#0b2922] to-[#123830] border-[#10b981] text-[#ecfdf5]"
            : "bg-gradient-to-br from-[#18130e] via-[#241a12] to-[#1a130d] border-amber-600/50 text-[#f5ecd8]"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/40 shadow-sm">
                <LayoutGrid className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                ✦ ΠΥΛΗ ΣΥΝΤΟΜΕΥΣΕΩΝ ΚΑΡΤΕΛΩΝ ✦
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Όλες οι Καρτέλες της Εφαρμογής
            </h1>
            <p className="text-xs sm:text-sm font-serif opacity-85 max-w-2xl leading-relaxed">
              Επιλέξτε με ένα κλικ οποιαδήποτε ενότητα επιθυμείτε να ανοίξετε. Κάθε κάρτα προσφέρει άμεση πρόσβαση στα εργαλεία υπολογισμού, στα μυστικά τετράγωνα, στο νέο μυθιστόρημα «Η Μυθική Ευρώπη» και στον Θησαυρό.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-black/20 border border-inherit/20 font-bold">
              {ALL_TAB_ITEMS.length} Διαθέσιμες Ενότητες
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-inherit/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: `Όλες (${ALL_TAB_ITEMS.length})` },
              { id: "myth", label: "Μύθος & Μυστικισμός" },
              { id: "calc", label: "Υπολογισμοί & Έρευνα" },
              { id: "geometry", label: "Γεωμετρία & Τετράγωνα" },
              { id: "tools", label: "Εργαλεία & Αρχείο" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                    : "bg-black/15 hover:bg-black/30 border border-inherit/20 opacity-80 hover:opacity-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Αναζήτηση καρτέλας..."
              className={`w-full px-3 py-1.5 rounded-xl text-xs font-serif border outline-none ${
                theme === "parchment" || theme === "ancient-calligraphy"
                  ? "bg-white border-[#bca07a] text-[#3d240e]"
                  : theme === "solar"
                  ? "bg-white border-[#fcd34d] text-[#78350f]"
                  : theme === "ethereal"
                  ? "bg-[#0b142c] border-[#1e3a8a] text-[#e0f2fe]"
                  : theme === "cyber-tech"
                  ? "bg-[#081b17] border-[#065f46] text-[#ecfdf5]"
                  : "bg-[#120e0a] border-amber-900/60 text-[#f5ecd8]"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Grid of Large Card Buttons with Thematic Background Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTabs.map((item) => {
          const Icon = item.icon;
          const isCurrentActive = currentTab === item.id;
          const badgeValue = item.id === "archive" ? savedCount : item.badge;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between min-h-[220px] ${
                isCurrentActive
                  ? "ring-2 ring-amber-400 border-amber-400 shadow-xl shadow-amber-500/20"
                  : "border-[#382b1d] hover:border-amber-500/60"
              }`}
            >
              {/* Background Image with Dark/Tone Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${item.bgImage})` }}
              />

              {/* Gradient Dark/Theme Overlays for maximum text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 group-hover:via-black/70 transition-colors" />

              {/* Card Top: Category & Badge */}
              <div className="relative z-10 p-4 sm:p-5 flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white/90 backdrop-blur-md uppercase font-bold tracking-wider">
                  {item.categoryName}
                </span>

                {badgeValue ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#140e08] shadow-md border border-amber-300/50">
                    {badgeValue}
                  </span>
                ) : isCurrentActive ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600/80 text-white border border-emerald-400/60">
                    ΕΝΕΡΓΗ
                  </span>
                ) : null}
              </div>

              {/* Card Bottom: Icon, Title, Description, Action Arrow */}
              <div className="relative z-10 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className="p-2.5 rounded-xl border backdrop-blur-md shrink-0 transition-transform group-hover:scale-110 shadow-md"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderColor: item.accentColor,
                      color: item.accentColor,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-white/80 font-serif leading-relaxed line-clamp-2">
                  {item.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-serif text-amber-400 group-hover:text-amber-300">
                  <span className="font-bold flex items-center gap-1">
                    <span>Άνοιγμα Καρτέλας</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  {isCurrentActive && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Τρέχουσα
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
