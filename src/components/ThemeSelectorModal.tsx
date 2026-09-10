import React from "react";
import { AppTheme, APP_THEMES, ThemeMeta } from "../utils/theme";
import { X, Moon, Scroll, Feather, Sun, Sparkles, Cpu, Check, Palette } from "lucide-react";

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: ThemeMeta["iconName"], isSelected: boolean) => {
    const className = `w-5 h-5 ${isSelected ? "text-[#ffd700]" : "text-[#c89b3c]"}`;
    switch (iconName) {
      case "moon":
        return <Moon className={className} />;
      case "scroll":
        return <Scroll className={className} />;
      case "feather":
        return <Feather className={className} />;
      case "sun":
        return <Sun className={className} />;
      case "sparkles":
        return <Sparkles className={className} />;
      case "cpu":
        return <Cpu className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#14120f] border-2 border-[#c89b3c] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3b2917] bg-[#1a1510]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#241c14] border border-[#c89b3c] flex items-center justify-center text-[#ffd700] shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#f5ecd8]">
                Επιλογή Εμφάνισης
              </h2>
              <p className="text-xs font-serif text-[#a69680]">
                Προσαρμόστε πλήρως τα χρώματα, τα πεδία, τις γραμματοσειρές και το φόντο
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a69680] hover:text-[#f5ecd8] hover:bg-[#251d15] transition-all cursor-pointer"
            title="Κλείσιμο"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 gold-scrollbar">
          {APP_THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onSelectTheme(theme.id);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#2a1e12] via-[#352516] to-[#2a1e12] border-[#ffd700] ring-2 ring-[#ffd700]/50 shadow-[0_0_20px_rgba(200,155,60,0.3)] scale-[1.01]"
                    : "bg-[#181410] hover:bg-[#201a14] border-[#382a1b] hover:border-[#8c672b]"
                }`}
              >
                {/* Left Side: Icon & Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-inner"
                    style={{
                      backgroundColor: theme.bgPreview,
                      borderColor: theme.borderPreview,
                    }}
                  >
                    {renderIcon(theme.iconName, isSelected)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-base text-[#f5ecd8]">
                        {theme.name}
                      </span>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold"
                        style={{
                          backgroundColor: isSelected ? "#ffd700" : "#2a2016",
                          color: isSelected ? "#120d07" : "#c89b3c",
                          border: `1px solid ${theme.borderPreview}`,
                        }}
                      >
                        {theme.badgeLabel}
                      </span>
                    </div>
                    <p className="text-xs font-serif text-[#c5b59e] mt-0.5">
                      {theme.subtitle}
                    </p>
                    <p className="text-[11px] text-[#a69680] mt-1 leading-relaxed max-w-md">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Right Side: Palette Preview & Checkmark */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Mini Palette Dots */}
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#100d0a] border border-[#2d2217]">
                    <div
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: theme.bgPreview }}
                      title="Χρώμα Φόντου"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: theme.accentPreview }}
                      title="Κύριο Χρώμα Στοιχείων"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: theme.borderPreview }}
                      title="Χρώμα Πλαισίων"
                    />
                  </div>

                  {/* Selection Status */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-[#ffd700] border-[#ffd700] text-[#120d07] shadow-md shadow-[#ffd700]/40"
                        : "border-[#4a3724] bg-[#1a140e] text-transparent"
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#3b2917] bg-[#1a1510] flex items-center justify-between">
          <span className="text-xs font-serif text-[#a69680]">
            Η προτίμησή σας αποθηκεύεται αυτόματα
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8c672b] to-[#c89b3c] hover:from-[#a07733] hover:to-[#ffd700] text-[#120d07] font-serif font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Εφαρμογή & Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
};
