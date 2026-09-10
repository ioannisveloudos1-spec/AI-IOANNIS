import React, { useState } from "react";
import { ANCIENT_GREEK_FONTS, AncientGreekFont, getFontScope, saveFontScope } from "../utils/greekFonts";
import { Type, Check, Sparkles, X, Globe, Feather, BookOpen, Layers } from "lucide-react";

interface GreekFontSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFontId: string;
  onSelectFont: (fontId: string) => void;
}

export const GreekFontSelectorModal: React.FC<GreekFontSelectorModalProps> = ({
  isOpen,
  onClose,
  currentFontId,
  onSelectFont,
}) => {
  const [scope, setScope] = useState<"global" | "selective">(() => getFontScope());
  const [filterCategory, setFilterCategory] = useState<string>("all");

  if (!isOpen) return null;

  const currentFont = ANCIENT_GREEK_FONTS.find((f) => f.id === currentFontId) || ANCIENT_GREEK_FONTS[0];

  const handleScopeChange = (newScope: "global" | "selective") => {
    setScope(newScope);
    saveFontScope(newScope);
  };

  const filteredFonts = ANCIENT_GREEK_FONTS.filter((font) => {
    if (filterCategory === "calligraphy") {
      return font.category.includes("Καλλιγραφ") || font.era.includes("Καλλιγραφ") || font.id === "alegreya" || font.id === "philosopher" || font.id === "playfair";
    }
    if (filterCategory === "epigraphic") {
      return font.category.includes("Επιγραφ") || font.id === "cinzel" || font.id === "alegreya-sc" || font.id === "gfs-neohellenic";
    }
    if (filterCategory === "classical") {
      return font.category.includes("Κλασικ") || font.id === "gfs-didot" || font.id === "cardo" || font.id === "cormorant" || font.id === "eb-garamond" || font.id === "old-standard";
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#16130f] border border-[#3e3020] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2d2419] bg-gradient-to-r from-[#1c1712] via-[#241c14] to-[#1c1712]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8a6825] to-[#c89b3c] p-[1.5px] shadow-md shadow-[#c89b3c]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#18130e] rounded-[10px] flex items-center justify-center">
                <Type className="w-5 h-5 text-[#e6c670]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#f5ecd8]">
                  Ελληνικές & Καλλιγραφικές Γραμματοσειρές
                </h3>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2a2116] text-[#c89b3c] border border-[#4a3925] whitespace-nowrap">
                  {ANCIENT_GREEK_FONTS.length} Στυλ
                </span>
              </div>
              <p className="text-xs text-[#a69680] font-sans">
                Επιλέξτε γραμματοσειρά και εύρος εφαρμογής σε όλες τις καρτέλες της εφαρμογής
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-[#221b14] hover:bg-[#33281c] border border-[#3e3020] text-[#a69680] hover:text-[#f5ecd8] transition-colors cursor-pointer"
            aria-label="Κλείσιμο"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global vs Selective Scope Control */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#1a140e] border-b border-[#2d2419] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-[#c89b3c]">
            <Globe className="w-4 h-4 text-[#ffd700]" />
            <span className="font-semibold text-[#f5ecd8]">Εμβέλεια Εφαρμογής:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#120e0a] p-1 rounded-xl border border-[#2d2216]">
            <button
              type="button"
              onClick={() => handleScopeChange("global")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                scope === "global"
                  ? "bg-[#c89b3c] text-[#14100c] font-bold shadow"
                  : "text-[#a69680] hover:text-[#f5ecd8]"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Σε Όλες τις Καρτέλες (Καθολικά)</span>
            </button>
            <button
              type="button"
              onClick={() => handleScopeChange("selective")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                scope === "selective"
                  ? "bg-[#c89b3c] text-[#14100c] font-bold shadow"
                  : "text-[#a69680] hover:text-[#f5ecd8]"
              }`}
            >
              <span>Ελληνικές Λέξεις &amp; Τίτλοι</span>
            </button>
          </div>
        </div>

        {/* Filter Categories Ribbon */}
        <div className="px-4 sm:px-6 py-2 bg-[#120f0c] border-b border-[#2d2419] flex items-center gap-1.5 overflow-x-auto gold-scrollbar">
          <span className="text-[11px] text-[#8a7b69] font-sans shrink-0 mr-1">Φίλτρο:</span>
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
              filterCategory === "all"
                ? "bg-[#2d2215] text-[#ffd700] border border-[#c89b3c]"
                : "bg-[#18130e] text-[#a69680] hover:text-[#f5ecd8] border border-transparent"
            }`}
          >
            Όλες ({ANCIENT_GREEK_FONTS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("calligraphy")}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              filterCategory === "calligraphy"
                ? "bg-[#2d2215] text-[#ffd700] border border-[#c89b3c]"
                : "bg-[#18130e] text-[#a69680] hover:text-[#f5ecd8] border border-transparent"
            }`}
          >
            <Feather className="w-3 h-3 text-[#c89b3c]" />
            <span>Καλλιγραφικές &amp; Χειρόγραφες</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("epigraphic")}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
              filterCategory === "epigraphic"
                ? "bg-[#2d2215] text-[#ffd700] border border-[#c89b3c]"
                : "bg-[#18130e] text-[#a69680] hover:text-[#f5ecd8] border border-transparent"
            }`}
          >
            Επιγραφικές &amp; Μνημειακές
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("classical")}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
              filterCategory === "classical"
                ? "bg-[#2d2215] text-[#ffd700] border border-[#c89b3c]"
                : "bg-[#18130e] text-[#a69680] hover:text-[#f5ecd8] border border-transparent"
            }`}
          >
            Κλασικές &amp; Φιλολογικές
          </button>
        </div>

        {/* Active Font Showcase / Hero Banner */}
        <div className="px-4 sm:px-6 py-3 bg-[#14100c] border-b border-[#2d2419]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#1b1611] border border-[#3a2d1d]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c89b3c]">
                Ενεργη Επιλογη:
              </span>
              <div className="text-sm sm:text-base font-bold text-[#f5ecd8] font-sans">
                {currentFont.name} <span className="text-xs font-normal text-[#9c8b74]">({currentFont.category})</span>
              </div>
            </div>
            <div
              className="text-lg sm:text-xl font-bold tracking-wider text-[#ffd700] px-3 py-1 rounded-lg bg-[#14100c] border border-[#2d2216]"
              style={{ fontFamily: currentFont.fontFamily }}
            >
              ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ • ΟΥΔΟΣ = 744
            </div>
          </div>
        </div>

        {/* Scrollable Font Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 gold-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFonts.map((font) => {
              const isSelected = font.id === currentFontId;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onSelectFont(font.id)}
                  className={`group relative text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? "bg-gradient-to-br from-[#241c13] via-[#2d2215] to-[#1f1710] border-[#c89b3c] shadow-lg shadow-[#c89b3c]/15 ring-1 ring-[#c89b3c]"
                      : "bg-[#18130e] hover:bg-[#201912] border-[#2d2317] hover:border-[#4d3b26]"
                  }`}
                >
                  {/* Top row: Name & Era & Selection Badge */}
                  <div className="flex items-center justify-between w-full gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-sm text-[#f5ecd8] group-hover:text-[#fff]">
                          {font.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2a2016] text-[#c89b3c] border border-[#443321] whitespace-nowrap">
                          {font.era}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#91816d] font-sans">
                        {font.category}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? "bg-[#c89b3c] border-[#e6c670] text-[#14100c]"
                          : "border-[#3d2f1f] bg-[#120e0a] text-transparent group-hover:border-[#c89b3c]"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Font Live Sample Rendering */}
                  <div className="w-full py-2 px-3 rounded-lg bg-[#120e0a] border border-[#261d13] overflow-hidden">
                    <div
                      className="text-base sm:text-lg font-bold text-[#e6c670] tracking-wide truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.sampleText}
                    </div>
                    <div
                      className="text-xs text-[#a69680] tracking-wider mt-0.5 truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ • ͵αιιθ´
                    </div>
                  </div>

                  {/* Font Description */}
                  <p className="text-[11px] text-[#8a7b69] font-sans leading-snug line-clamp-2">
                    {font.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-[#2d2419] bg-[#14100c] flex items-center justify-between gap-3">
          <span className="text-xs text-[#8c7d6b] font-sans hidden sm:inline">
            {scope === "global"
              ? "✓ Ενεργή καθολική εφαρμογή σε όλες τις καρτέλες"
              : "✓ Εφαρμογή στις ελληνικές λέξεις & λεξαρίθμους"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-[#8a6825] via-[#c89b3c] to-[#e6c670] text-[#14100c] font-sans font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#c89b3c]/20 cursor-pointer"
          >
            Εφαρμογή &amp; Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
};

interface QuickFontBarProps {
  currentFontId: string;
  onSelectFont: (fontId: string) => void;
  onOpenModal: () => void;
  className?: string;
}

export const QuickFontBar: React.FC<QuickFontBarProps> = ({
  currentFontId,
  onSelectFont,
  onOpenModal,
  className = "",
}) => {
  const currentFont = ANCIENT_GREEK_FONTS.find((f) => f.id === currentFontId) || ANCIENT_GREEK_FONTS[0];

  return (
    <div className={`flex items-center gap-1.5 p-1.5 rounded-xl bg-[#16120d] border border-[#2f2417] text-xs ${className}`}>
      <button
        onClick={onOpenModal}
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#201810] hover:bg-[#2c2014] border border-[#3e2e1c] text-[#c89b3c] hover:text-[#e6c670] font-sans font-medium transition-colors shrink-0 cursor-pointer"
        title="Άνοιγμα πλήρους πίνακα αρχαιοελληνικών γραμματοσειρών"
      >
        <Type className="w-3.5 h-3.5 text-[#e6c670]" />
        <span className="hidden sm:inline">Γραμματοσειρά:</span>
      </button>

      {/* Horizontal mini pill selector */}
      <div className="flex items-center gap-1 overflow-x-auto gold-scrollbar py-0.5">
        {ANCIENT_GREEK_FONTS.slice(0, 5).map((font) => (
          <button
            key={font.id}
            type="button"
            onClick={() => onSelectFont(font.id)}
            className={`px-2 py-1 rounded-lg font-sans text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              font.id === currentFontId
                ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-sm"
                : "bg-[#1c1610] hover:bg-[#251d15] text-[#a69680] hover:text-[#f5ecd8] border border-[#2d2216]"
            }`}
          >
            {font.name.replace("Ancient", "").replace("Epigraphic", "").trim()}
          </button>
        ))}
        <button
          type="button"
          onClick={onOpenModal}
          className="px-1.5 py-1 rounded-lg text-[10px] text-[#c89b3c] hover:text-[#f5ecd8] underline shrink-0 cursor-pointer"
        >
          +όλες ({ANCIENT_GREEK_FONTS.length})
        </button>
      </div>
    </div>
  );
};
