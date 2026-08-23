import React, { useState, useEffect } from "react";
import { Sparkles, X, Copy, Check, RefreshCw, Send, AlertCircle, Key, Cpu, HelpCircle } from "lucide-react";
import { generateLocalOfflineAnalysis, generateClientGeminiAnalysis } from "../utils/offlineAnalysis";

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  number: number;
  words: string[];
  customApiKey?: string;
  onOpenApiKeyModal?: () => void;
}

const PRESET_QUESTIONS = [
  "Ποιες είναι οι πυθαγόρειες ιδιότητες του αριθμού;",
  "Υπάρχουν άλλες γνωστές ισοψηφίες με αυτόν τον αριθμό;",
  "Ποια είναι η ετυμολογική και ιστορική σημασία;",
  "Πώς συσχετίζεται με την αρχαία φιλοσοφία και τα μυστήρια;",
];

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  text,
  number,
  words,
  customApiKey = "",
  onOpenApiKeyModal,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [activeQuestion, setActiveQuestion] = useState<string>("Πλήρης Φιλολογική & Ισοψηφική Ανάλυση");
  const [modelUsed, setModelUsed] = useState<string>("");
  const [isLiveAi, setIsLiveAi] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && text) {
      setActiveQuestion("Πλήρης Φιλολογική & Ισοψηφική Ανάλυση");
      fetchAnalysis("Πλήρης φιλολογική, μαθηματική και ιστορική ανάλυση");
    }
  }, [isOpen, text, number]);

  const fetchAnalysis = async (question?: string) => {
    const queryContext = question || activeQuestion || "Πλήρης φιλολογική, μαθηματική και ιστορική ανάλυση";
    setLoading(true);
    setError(null);
    if (question && question !== "Πλήρης φιλολογική, μαθηματική και ιστορική ανάλυση") {
      setActiveQuestion(question);
    }

    // 1. If user provided their own custom API key, call Gemini directly from the client (works 100% on Netlify/APK!)
    if (customApiKey && customApiKey.trim().length > 10) {
      try {
        const clientRes = await generateClientGeminiAnalysis(
          customApiKey.trim(),
          text,
          number,
          words,
          queryContext
        );
        setAnalysis(clientRes.analysis);
        setModelUsed(clientRes.modelUsed);
        setIsLiveAi(clientRes.success);
        if (!clientRes.success && clientRes.error) {
          setError(clientRes.error);
        }
        setLoading(false);
        return;
      } catch (err: any) {
        console.warn("Client Gemini direct call fallback:", err);
      }
    }

    // 2. Try calling the backend server endpoint if available
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          number,
          words,
          customApiKey: customApiKey || undefined,
          context: queryContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const textOutput = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(textOutput);
      } catch {
        throw new Error("Invalid response format");
      }

      if (data && data.success) {
        setAnalysis(data.analysis);
        setModelUsed(data.modelUsed || "gemini-3.7-flash");
        setIsLiveAi(!data.fallback);
        setLoading(false);
        return;
      } else if (data && data.analysis) {
        setAnalysis(data.analysis);
        setIsLiveAi(false);
        if (data.error) setError(data.error);
        setLoading(false);
        return;
      }
    } catch {
      // 3. Robust Offline Local Engine (Guaranteed zero-crash in APK / Static Netlify)
      const offlineResult = generateLocalOfflineAnalysis(text, number, words, queryContext);
      setAnalysis(offlineResult);
      setModelUsed("Αυτόνομη Φιλολογική Μηχανή");
      setIsLiveAi(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || loading) return;
    const q = customQuestion.trim();
    setCustomQuestion("");
    fetchAnalysis(q);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#14120f] border border-[#3e3223] shadow-2xl shadow-black overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#282119] flex items-center justify-between bg-[#1a1612]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#271f15] border border-[#c89b3c]/40 flex items-center justify-center text-[#e6c670]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                  AI Φιλολογική & Ισοψηφική Ερμηνεία
                </h3>
                {isLiveAi ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-[10px] font-sans font-medium text-emerald-300">
                    <Cpu className="w-2.5 h-2.5" />
                    Live Gemini AI ({modelUsed})
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenApiKeyModal}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/40 text-[10px] font-sans text-amber-300 transition-colors cursor-pointer"
                    title="Πατήστε για να συνδέσετε το Gemini API Key σας"
                  >
                    <Key className="w-2.5 h-2.5" />
                    Offline Λειτουργία (Σύνδεση Gemini API ➔)
                  </button>
                )}
                {customApiKey && isLiveAi && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#332615] border border-[#c89b3c]/40 text-[10px] font-sans text-[#e6c670]">
                    <Key className="w-2.5 h-2.5" />
                    Ενεργό Προσωπικό Key
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a69680] font-serif">
                Ανάλυση για: <strong className="text-[#e6c670]">«{text}»</strong> {number > 0 ? `(Λεξάριθμος: ${number})` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7e6c] hover:text-[#f5ecd8] hover:bg-[#251e17] transition-colors"
            title="Κλείσιμο"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-serif text-xs sm:text-sm text-[#d6c7b2] leading-relaxed">
          
          {/* Active Question Banner */}
          {activeQuestion && activeQuestion !== "Πλήρης φιλολογική, μαθηματική και ιστορική ανάλυση" && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#221c16] border border-[#3d3021] text-xs text-[#e6c670]">
              <HelpCircle className="w-4 h-4 shrink-0 text-[#c89b3c]" />
              <div className="truncate">
                <span className="text-[#8c7e6c]">Ενεργό Ερώτημα:</span>{" "}
                <strong className="text-[#f5ecd8]">{activeQuestion}</strong>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-[#c89b3c]/30 border-t-[#e6c670] rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-serif font-bold text-[#f5ecd8]">
                  Διεξαγωγή Φιλολογικής & Πυθαγόρειας Ανάλυσης...
                </p>
                <p className="text-xs text-[#8c7e6c]">
                  Απάντηση από το Google Gemini AI στα Ελληνικά
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Προσοχή / Σφάλμα Κλειδιού API</span>
              </div>
              <p className="text-xs">{error}</p>
              <div className="flex items-center gap-2 pt-1">
                {onOpenApiKeyModal && (
                  <button
                    onClick={onOpenApiKeyModal}
                    className="px-3 py-1 bg-amber-900/60 hover:bg-amber-800/60 text-xs text-amber-100 rounded-lg transition-colors"
                  >
                    Έλεγχος / Αλλαγή API Key
                  </button>
                )}
                <button
                  onClick={() => fetchAnalysis()}
                  className="px-3 py-1 bg-[#282119] hover:bg-[#382e23] text-xs text-[#f5ecd8] rounded-lg transition-colors border border-[#3e3223]"
                >
                  Επανάληψη
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 whitespace-pre-line leading-relaxed bg-[#0f0e0c] p-4 sm:p-5 rounded-xl border border-[#261f18]">
              {analysis}
            </div>
          )}

          {/* Quick Follow-up Question Chips */}
          {!loading && (
            <div className="space-y-2 pt-3 border-t border-[#231d17]">
              <span className="text-xs font-serif text-[#8c7e6c] font-semibold">
                Εξερευνήστε επιπλέον θεματικές:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {PRESET_QUESTIONS.map((q, idx) => {
                  const isSelected = activeQuestion === q;
                  return (
                    <button
                      key={idx}
                      onClick={() => fetchAnalysis(q)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-serif transition-all text-left ${
                        isSelected
                          ? "bg-[#3d2f1d] border border-[#c89b3c] text-[#f5ecd8] shadow-md shadow-black/40 font-bold"
                          : "bg-[#1a1612] hover:bg-[#282119] border border-[#2d2419] text-[#c4b59f] hover:text-[#f5ecd8]"
                      }`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ask Any Custom Question Form */}
          {!loading && (
            <form onSubmit={handleCustomSubmit} className="pt-2 space-y-1.5">
              <label className="block text-[11px] font-serif text-[#8c7e6c]">
                Ή γράψτε ένα δικό σας ερώτημα προς το Gemini:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="π.χ. Ποια είναι η σχέση του 666 με το ΛΑΥΡΕΙΟΝ ή τον Πλάτωνα;"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0e0d0b] border border-[#33281c] text-xs font-serif text-[#f5ecd8] placeholder-[#5c5144] focus:outline-none focus:border-[#c89b3c] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!customQuestion.trim() || loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2e2316] hover:bg-[#3f301e] border border-[#c89b3c]/50 text-xs font-serif text-[#e6c670] hover:text-[#f5ecd8] disabled:opacity-40 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ερώτηση</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#282119] bg-[#1a1612] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAnalysis("Πλήρης φιλολογική, μαθηματική και ιστορική ανάλυση")}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241e17] hover:bg-[#30261b] text-xs font-serif text-[#d6c7b2] border border-[#382d1f] transition-colors disabled:opacity-50"
              title="Επαναφορά πλήρους ανάλυσης"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Αρχική Ανάλυση</span>
            </button>

            {onOpenApiKeyModal && (
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="text-[11px] font-serif text-[#c89b3c] hover:text-[#f5ecd8] underline underline-offset-2 px-1"
              >
                {customApiKey ? "🔑 Ρύθμιση API Key" : "⚙️ Ορισμός API Key"}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={loading || !analysis}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#251e16] hover:bg-[#33281d] border border-[#3e3223] text-xs font-serif text-[#f5ecd8] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c89b3c]" />}
              <span>{copied ? "Αντιγράφηκε" : "Αντιγραφή"}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#2d2419] hover:bg-[#3c3021] text-xs font-serif font-bold text-[#e6c670] border border-[#c89b3c]/50 transition-colors"
            >
              Κλείσιμο
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

