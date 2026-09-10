import React, { useState, useEffect } from "react";
import { Key, Sparkles, X, Check, ExternalLink, ShieldCheck, Eye, EyeOff, Trash2 } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>(currentKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setApiKeyInput(currentKey);
  }, [currentKey, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(apiKeyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKeyInput("");
    onSaveKey("");
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#14120f] border border-[#3e3223] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#282119] flex items-center justify-between bg-[#1a1612]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#271f15] border border-[#c89b3c]/40 flex items-center justify-center text-[#e6c670]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#f5ecd8]">
                Σύνδεση API Key (Τ.Ν. ΙΩΑΝΝΗΣ 1.0)
              </h3>
              <p className="text-[11px] text-[#a69680] font-serif">
                Προσωπικό κλειδί για ζωντανή και βαθιά φιλολογική ανάλυση
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7e6c] hover:text-[#f5ecd8] hover:bg-[#251e17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto font-serif text-xs text-[#d6c7b2]">
          
          <div className="p-3.5 rounded-xl bg-[#1c1813] border border-[#2e251b] space-y-2">
            <div className="flex items-center gap-2 text-[#e6c670] font-bold">
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Γιατί να προσθέσετε δικό σας API Key;</span>
            </div>
            <p className="text-[#a69680] text-[11px] leading-relaxed">
              Εισάγοντας το δικό σας δωρεάν API Key εξασφαλίζετε απεριόριστη και άμεση πρόσβαση στη μηχανή τεχνητής νοημοσύνης <strong>Τ.Ν. ΙΩΑΝΝΗΣ 1.0</strong> για εξατομικευμένες απαντήσεις σε κάθε ερώτημά σας, πυθαγόρειες ερμηνείες και λεξαριθμικές αναλύσεις.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="user-gemini-key-input" className="font-bold text-[#f5ecd8]">
                Το API Key σας:
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#c89b3c] hover:text-[#f5ecd8] flex items-center gap-1 underline underline-offset-2"
              >
                <span>Λήψη δωρεάν κλειδιού στο AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="user-gemini-key-input"
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-[#0e0c0a] border border-[#382e22] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c]/30 rounded-xl font-mono text-xs text-[#f5ecd8] placeholder-[#5c5143] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7e6c] hover:text-[#f5ecd8]"
                title={showKey ? "Απόκρυψη" : "Εμφάνιση"}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <p className="text-[10px] text-[#7d7061] flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Το κλειδί αποθηκεύεται αποκλειστικά τοπικά στη συσκευή σας (localStorage) και χρησιμοποιείται μόνο για τις αναλύσεις σας.</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#261f18]">
            {currentKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Διαγραφή Κλειδιού</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-[#1c1813] hover:bg-[#28221a] text-xs text-[#a69680] hover:text-[#f5ecd8] border border-[#2d2419] transition-colors"
              >
                Ακύρωση
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#282116] hover:bg-[#382d1c] border border-[#c89b3c]/60 text-xs font-bold text-[#e6c670] shadow-md shadow-[#c89b3c]/10 transition-colors"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5" />}
                <span>{saveSuccess ? "Αποθηκεύτηκε!" : "Αποθήκευση Κλειδιού"}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
