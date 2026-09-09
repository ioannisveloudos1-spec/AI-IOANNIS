import React, { useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  X, 
  FileText, 
  Printer, 
  Loader2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { MathProperties, WordBreakdown } from '../utils/isopsephy';
import emblemLogo from '../assets/images/ego_eimi_logo_1788939371013.jpg';

export interface ExportCardImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  expression: string;
  totalValue: number;
  greekNumeral: string;
  systemName: string;
  mathProps: MathProperties;
  wordBreakdowns: WordBreakdown[];
  stepsExplanation?: string;
}

type CardTheme = 'dark-gold' | 'parchment' | 'solar' | 'cosmic' | 'clean-white';
type CardRatio = 'landscape' | 'square' | 'story' | 'auto';

export const ExportCardImageModal: React.FC<ExportCardImageModalProps> = ({
  isOpen,
  onClose,
  expression,
  totalValue,
  greekNumeral,
  systemName,
  mathProps,
  wordBreakdowns,
  stepsExplanation
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<CardTheme>('parchment');
  const [ratio, setRatio] = useState<CardRatio>('landscape');
  const [showDecomposition, setShowDecomposition] = useState(true);
  const [showMathProps, setShowMathProps] = useState(true);
  const [showNumeral, setShowNumeral] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [customSubtitle, setCustomSubtitle] = useState('Αρχαία Ελληνική Αρίθμηση & Λεξάριθμοι');

  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPngDownloaded, setIsPngDownloaded] = useState(false);
  const [isPdfDownloaded, setIsPdfDownloaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getSafeFileName = (ext: string) => {
    const slug = expression
      .trim()
      .replace(/[^a-zA-Z0-9α-ωΑ-Ωά-ώΆ-Ώ]/g, '_')
      .slice(0, 24) || 'isopsephy';
    return `isopsephy-${slug}-${totalValue}.${ext}`;
  };

  const exportPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    setErrorMessage('');
    try {
      if (document.fonts) {
        try { await document.fonts.ready; } catch {}
      }
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1
      });
      const link = document.createElement('a');
      link.download = getSafeFileName('png');
      link.href = dataUrl;
      link.click();
      setIsPngDownloaded(true);
      setTimeout(() => setIsPngDownloaded(false), 3000);
    } catch (err) {
      console.error('PNG export error:', err);
      setErrorMessage('Παρουσιάστηκε σφάλμα κατά τη δημιουργία της εικόνας PNG.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const exportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);
    setErrorMessage('');
    try {
      if (document.fonts) {
        try { await document.fonts.ready; } catch {}
      }
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 1
      });
      const img = new Image();
      img.src = dataUrl;
      await new Promise(resolve => { img.onload = resolve; });

      const isPortrait = img.naturalHeight > img.naturalWidth;
      const pdf = new jsPDF({
        orientation: isPortrait ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      let renderWidth = maxWidth;
      let renderHeight = (img.naturalHeight * renderWidth) / img.naturalWidth;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = (img.naturalWidth * renderHeight) / img.naturalHeight;
      }

      const posX = (pageWidth - renderWidth) / 2;
      const posY = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');
      pdf.save(getSafeFileName('pdf'));
      setIsPdfDownloaded(true);
      setTimeout(() => setIsPdfDownloaded(false), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
      setErrorMessage('Παρουσιάστηκε σφάλμα κατά τη δημιουργία του αρχείου PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const copyToClipboard = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    setErrorMessage('');
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1
      });
      if (!blob) throw new Error('Blob creation failed');

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        exportPng();
      }
    } catch (err) {
      console.error('Copy image error:', err);
      setErrorMessage('Η απευθείας αντιγραφή δεν υποστηρίζεται. Χρησιμοποιήστε «Λήψη PNG».');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    setErrorMessage('');
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1
      });
      if (!blob) throw new Error('Blob creation failed');

      const file = new File([blob], getSafeFileName('png'), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Ισοψηφία: ${expression} = ${totalValue}`,
          text: `Υπολογισμός Ισοψηφίας: ${expression} = ${totalValue} (Πυθμένας: ${mathProps.pythmen})`,
          files: [file]
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Ισοψηφία: ${expression} = ${totalValue}`,
          text: `Υπολογισμός Ισοψηφίας: ${expression} = ${totalValue}`
        });
      } else {
        exportPng();
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Share error:', err);
        exportPng();
      }
    } finally {
      setIsExportingPng(false);
    }
  };

  const getRatioStyle = () => {
    switch (ratio) {
      case 'square':
        return 'w-full max-w-[540px] min-h-[540px]';
      case 'story':
        return 'w-full max-w-[440px] min-h-[720px]';
      case 'landscape':
        return 'w-full max-w-[660px] min-h-[420px]';
      case 'auto':
      default:
        return 'w-full max-w-[580px] min-h-[400px]';
    }
  };

  const themeStyles = (() => {
    switch (theme) {
      case 'parchment':
        return {
          bg: 'bg-[#fbf7ee]',
          border: 'border-2 border-[#b89758]',
          textPrimary: 'text-[#2a1b0c]',
          textSecondary: 'text-[#73512e]',
          accent: 'text-[#9e6f21]',
          numGrad: 'from-[#6e460e] via-[#9e6f21] to-[#b88628]',
          badgeBg: 'bg-[#f0e4cc] border-[#b89758]/50 text-[#543513]',
          innerCard: 'bg-[#f5ebd7] border-[#d8c5a4]',
          glowColor: 'rgba(184, 151, 88, 0.15)',
          cornerColor: '#9e6f21',
          headerBorder: 'border-[#b89758]/40'
        };
      case 'solar':
        return {
          bg: 'bg-gradient-to-br from-[#fffdf5] via-[#fff5d6] to-[#ffeed0]',
          border: 'border-2 border-[#e69d00]',
          textPrimary: 'text-[#2d1900]',
          textSecondary: 'text-[#874f00]',
          accent: 'text-[#d97706]',
          numGrad: 'from-[#b45309] via-[#d97706] to-[#f59e0b]',
          badgeBg: 'bg-[#fde68a]/60 border-[#f59e0b]/50 text-[#78350f]',
          innerCard: 'bg-[#fffbeb] border-[#fde68a]',
          glowColor: 'rgba(245, 158, 11, 0.2)',
          cornerColor: '#f59e0b',
          headerBorder: 'border-[#f59e0b]/40'
        };
      case 'cosmic':
        return {
          bg: 'bg-gradient-to-b from-[#060b18] via-[#0b1329] to-[#040814]',
          border: 'border-2 border-[#38bdf8]/60',
          textPrimary: 'text-[#f0f9ff]',
          textSecondary: 'text-[#7dd3fc]',
          accent: 'text-[#38bdf8]',
          numGrad: 'from-[#38bdf8] via-[#67e8f9] to-[#a5f3fc]',
          badgeBg: 'bg-[#0c2340] border-[#38bdf8]/40 text-[#bae6fd]',
          innerCard: 'bg-[#09152b] border-[#1e3a5f]',
          glowColor: 'rgba(56, 189, 248, 0.25)',
          cornerColor: '#38bdf8',
          headerBorder: 'border-[#38bdf8]/40'
        };
      case 'clean-white':
        return {
          bg: 'bg-[#ffffff]',
          border: 'border-2 border-[#b89758]',
          textPrimary: 'text-[#1a1510]',
          textSecondary: 'text-[#5a4836]',
          accent: 'text-[#8a6825]',
          numGrad: 'from-[#8a6825] via-[#a87a2a] to-[#c89b3c]',
          badgeBg: 'bg-[#f8f5ee] border-[#b89758]/50 text-[#3d2c18]',
          innerCard: 'bg-[#faf7f0] border-[#e2d5c3]',
          glowColor: 'rgba(184, 151, 88, 0.12)',
          cornerColor: '#b89758',
          headerBorder: 'border-[#b89758]/40'
        };
      case 'dark-gold':
      default:
        return {
          bg: 'bg-gradient-to-b from-[#181410] via-[#120f0c] to-[#0a0806]',
          border: 'border-2 border-[#d4af37]',
          textPrimary: 'text-[#fdfaf2]',
          textSecondary: 'text-[#a89984]',
          accent: 'text-[#e6c670]',
          numGrad: 'from-[#fef0cd] via-[#e6c670] to-[#c89b3c]',
          badgeBg: 'bg-[#251d14] border-[#594223] text-[#f5ebd8]',
          innerCard: 'bg-[#16120e] border-[#332617]',
          glowColor: 'rgba(212, 175, 55, 0.2)',
          cornerColor: '#ffd700',
          headerBorder: 'border-[#d4af37]/40'
        };
    }
  })();

  return (
    <div id="export-card-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div id="export-card-modal-container" className="relative w-full max-w-4xl bg-[#14110e] border border-[#3e3223] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d2419] flex items-center justify-between bg-[#191511] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#292015] border border-[#523e25] text-[#ffd700]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                <span>Εξαγωγή Κάρτας Λεξαρίθμου</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2e2316] text-[#ffd700] border border-[#4d3a22]">
                  PNG &amp; PDF (A4)
                </span>
              </h2>
              <p className="text-xs text-[#a69680]">
                Καθαρή διάταξη χωρίς επικαλύψεις κειμένων με το επίσημο έμβλημα «ΕΓΩ ΕΙΜΙ».
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-export-modal"
            className="p-2 rounded-lg text-[#8c7e6c] hover:text-[#f5ecd8] hover:bg-[#251d16] transition-colors cursor-pointer"
            title="Κλείσιμο"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Theme Selector */}
            <div className="p-3.5 rounded-xl bg-[#1a1511] border border-[#2d2419] space-y-2">
              <label className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Αισθητικό Θέμα Κάρτας</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'parchment', label: 'Αρχαία Περγαμηνή', icon: '📜' },
                  { id: 'dark-gold', label: 'Αρχαιοελληνικό Χρυσό', icon: '🏛️' },
                  { id: 'solar', label: 'Ηλιακόν (Solar)', icon: '☀️' },
                  { id: 'cosmic', label: 'Κοσμικό Αιθέριο', icon: '🌌' },
                  { id: 'clean-white', label: 'Καλλιγραφικό Λευκό', icon: '📄' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTheme(item.id as CardTheme)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-serif transition-all border flex items-center gap-2 cursor-pointer ${
                      theme === item.id
                        ? 'bg-[#2d2216] border-[#ffd700] text-[#f5ecd8] ring-1 ring-[#ffd700]/40 font-bold'
                        : 'bg-[#14110e] border-[#292017] hover:bg-[#1f1913] text-[#a69680]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ratio Selector */}
            <div className="p-3.5 rounded-xl bg-[#1a1511] border border-[#2d2419] space-y-2">
              <label className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Μορφή &amp; Αναλογία</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'landscape', label: 'Τοπίο (1.91:1)', desc: 'X, Facebook' },
                  { id: 'square', label: 'Τετράγωνο (1:1)', desc: 'Instagram' },
                  { id: 'story', label: 'Ιστορία (9:16)', desc: 'Stories, Mobile' },
                  { id: 'auto', label: 'Συμπαγές (Auto)', desc: 'Κλασική' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRatio(item.id as CardRatio)}
                    className={`p-2.5 rounded-xl text-left text-xs font-serif transition-all border cursor-pointer ${
                      ratio === item.id
                        ? 'bg-[#2d2216] border-[#ffd700] text-[#f5ecd8] ring-1 ring-[#ffd700]/40 font-bold'
                        : 'bg-[#14110e] border-[#292017] hover:bg-[#1f1913] text-[#a69680]'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-[#7d7061] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Toggles */}
            <div className="p-3.5 rounded-xl bg-[#1a1511] border border-[#2d2419] space-y-2.5">
              <label className="text-xs font-serif font-bold text-[#e6c670] uppercase tracking-wider block">
                Στοιχεία Προβολής
              </label>
              <div className="space-y-2 text-xs font-serif">
                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDecomposition}
                    onChange={e => setShowDecomposition(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Ανάλυση Γραμμάτων &amp; Αθροίσματος</span>
                </label>
                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMathProps}
                    onChange={e => setShowMathProps(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Μαθηματικές Ιδιότητες (Πυθμένας, Τρίγωνος κ.λπ.)</span>
                </label>
                {greekNumeral && (
                  <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNumeral}
                      onChange={e => setShowNumeral(e.target.checked)}
                      className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                    />
                    <span>Εμφάνιση Ιωνικού Αριθμού ({greekNumeral})</span>
                  </label>
                )}
                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={e => setShowDate(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Ημερομηνία Έκδοσης</span>
                </label>
                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFooter}
                    onChange={e => setShowFooter(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Υποσέλιδο &amp; Ερευνητής</span>
                </label>
              </div>

              <div className="pt-2 border-t border-[#292017]">
                <label className="text-[11px] text-[#8c7e6c] font-serif block mb-1">
                  Κείμενο Επικεφαλίδας / Υπότιτλος:
                </label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={e => setCustomSubtitle(e.target.value)}
                  placeholder="Αρχαία Ελληνική Αρίθμηση & Λεξάριθμοι"
                  className="w-full px-2.5 py-1.5 bg-[#12100e] border border-[#3e3020] rounded-lg text-xs font-serif text-[#f5ecd8] focus:border-[#c89b3c] outline-none"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Card Live Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-serif text-[#8c7e6c] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Ζωντανή Προεπισκόπηση Κάρτας</span>
              </span>
              <span className="text-[10px] font-mono text-[#a69680]">
                Καθαρή εκτύπωση χωρίς επικαλύψεις
              </span>
            </div>

            <div className="w-full bg-[#0b0a08] p-3 sm:p-4 rounded-2xl border border-[#2a2218] flex items-center justify-center overflow-hidden shadow-inner">
              
              {/* THE CARD TO EXPORT */}
              <div
                ref={cardRef}
                id="isopsephy-export-card"
                className={`${getRatioStyle()} ${themeStyles.bg} ${themeStyles.border} rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all select-none`}
                style={{
                  boxShadow: `0 20px 40px -15px ${themeStyles.glowColor}`
                }}
              >
                {/* Decorative corners */}
                <div
                  className="absolute top-2 left-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: themeStyles.cornerColor }}
                >
                  ╔════
                </div>
                <div
                  className="absolute top-2 right-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: themeStyles.cornerColor }}
                >
                  ════╗
                </div>
                <div
                  className="absolute bottom-2 left-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: themeStyles.cornerColor }}
                >
                  ╚════
                </div>
                <div
                  className="absolute bottom-2 right-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: themeStyles.cornerColor }}
                >
                  ════╝
                </div>

                {/* Top Header Row with Official Emblem & Title */}
                <div
                  className={`flex ${ratio === 'story' ? 'flex-col items-center' : 'flex-col sm:flex-row items-center justify-between'} gap-3 sm:gap-4 pb-4 mb-3 border-b ${themeStyles.headerBorder} relative z-10 shrink-0`}
                >
                  {/* Emblem Logo */}
                  <div
                    className={`${ratio === 'story' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'} rounded-xl p-1.5 shrink-0 shadow-2xl relative border`}
                    style={{
                      borderColor: themeStyles.cornerColor,
                      backgroundColor: theme === 'clean-white' || theme === 'parchment' ? 'rgba(255,255,255,0.95)' : 'rgba(16, 13, 9, 0.85)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                    }}
                  >
                    <img
                      src={emblemLogo}
                      alt="Επίσημο Έμβλημα"
                      className="w-full h-full object-contain rounded-lg filter contrast-110"
                    />
                  </div>

                  {/* Header Titles - FIXED: No redundant black text or overlapping phrases! */}
                  <div
                    className={`${ratio === 'story' ? 'text-center items-center' : 'text-center sm:text-right items-center sm:items-end'} flex flex-col justify-center w-full sm:w-auto mt-1 sm:mt-0 shrink-0 space-y-1`}
                  >
                    {/* Official badge */}
                    <div
                      className={`text-[11px] sm:text-xs font-mono uppercase tracking-widest ${themeStyles.accent} font-bold px-3 py-1 rounded-md border ${themeStyles.badgeBg} inline-block whitespace-nowrap shadow-sm mb-1`}
                    >
                      ✦ ΕΠΙΣΗΜΗ ΚΑΡΤΕΛΑ ΙΣΟΨΗΦΙΑΣ ✦
                    </div>

                    {/* Single clear subtitle - As requested by user, eliminating duplicate / overlapping text! */}
                    <div
                      className={`text-xs sm:text-sm font-serif font-bold ${themeStyles.textSecondary} leading-relaxed block tracking-wide`}
                    >
                      {customSubtitle || 'Αρχαία Ελληνική Αρίθμηση & Λεξάριθμοι'}
                    </div>

                    {/* Date */}
                    {showDate && (
                      <div
                        className={`text-[10px] sm:text-[11px] font-mono ${themeStyles.textSecondary} opacity-85 leading-normal block pt-0.5`}
                      >
                        {currentDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="py-2 relative z-10 space-y-4 shrink-0">
                  
                  {/* Expression */}
                  <div className="shrink-0">
                    <div className={`text-[11px] font-mono uppercase tracking-widest ${themeStyles.textSecondary}`}>
                      Ελληνική Έκφραση / Λέξη
                    </div>
                    <div className={`text-xl sm:text-2xl md:text-3xl font-ancient-greek font-black tracking-wide ${themeStyles.textPrimary} mt-1 break-words leading-relaxed`}>
                      «{expression.trim()}»
                    </div>
                  </div>

                  {/* Number & Ionian Badge */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                    <div className="flex items-baseline">
                      <span className={`text-5xl sm:text-6xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${themeStyles.numGrad} drop-shadow-sm leading-none`}>
                        {totalValue.toLocaleString('el-GR')}
                      </span>
                    </div>

                    {showNumeral && greekNumeral && (
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${themeStyles.badgeBg} shadow-sm whitespace-nowrap`}>
                        <span className="text-[11px] font-sans opacity-75">Ιωνικό:</span>
                        <span className="text-base sm:text-lg font-serif font-bold tracking-wider ml-1 leading-normal">
                          {greekNumeral}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mathematical badges */}
                  {showMathProps && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg border text-[11px] font-mono font-semibold whitespace-nowrap ${themeStyles.badgeBg}`}>
                        <span className="opacity-75">Πυθμένας:</span>
                        <span className="font-bold ml-1.5">{mathProps.pythmen}</span>
                      </div>

                      {mathProps.isPrime && (
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-900/30 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono font-bold whitespace-nowrap">
                          Πρώτος Αριθμός
                        </div>
                      )}

                      {mathProps.isTriangular && (
                        <div className="px-2.5 py-1 rounded-lg bg-amber-900/30 border border-amber-500/40 text-amber-600 dark:text-amber-300 text-[10px] font-mono font-bold whitespace-nowrap">
                          Τρίγωνος (T{mathProps.triangularRoot})
                        </div>
                      )}

                      {mathProps.isSquare && (
                        <div className="px-2.5 py-1 rounded-lg bg-indigo-900/30 border border-indigo-500/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-mono font-bold whitespace-nowrap">
                          Τετράγωνος ({mathProps.squareRoot}²)
                        </div>
                      )}

                      <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono whitespace-nowrap ${themeStyles.badgeBg}`}>
                        {mathProps.isEven ? 'Άρτιος' : 'Περιττός'}
                      </div>
                    </div>
                  )}

                  {/* Letter Decomposition */}
                  {showDecomposition && wordBreakdowns.length > 0 && (
                    <div className={`p-3.5 rounded-xl border ${themeStyles.innerCard} text-[11px] font-mono space-y-1.5 shrink-0`}>
                      <div className={`text-[10px] font-serif font-bold uppercase tracking-wider ${themeStyles.textSecondary}`}>
                        Ανάλυση Γραμμάτων &amp; Αθροίσματος:
                      </div>
                      <div className={`${themeStyles.textPrimary} break-words leading-relaxed font-semibold`}>
                        {wordBreakdowns
                          .flatMap(w => w.letters.map(l => `${l.char}(${l.value})`))
                          .join(' + ')}{' '}
                        = <span className={`${themeStyles.accent} font-bold`}>{totalValue}</span>
                      </div>
                    </div>
                  )}

                  {/* Expression steps */}
                  {stepsExplanation && (
                    <div className={`text-[10px] font-mono ${themeStyles.textSecondary} italic break-words leading-relaxed shrink-0`}>
                      {stepsExplanation}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                {showFooter && (
                  <div className={`pt-3 mt-2 border-t ${themeStyles.headerBorder} flex flex-wrap items-center justify-between gap-2 text-[10px] font-serif relative z-10 shrink-0`}>
                    <div className={`${themeStyles.textSecondary} font-semibold flex items-center gap-1.5`}>
                      <span>✨</span>
                      <span>Αρχαία Ελληνική Ισοψηφία &amp; Λεξάριθμοι</span>
                    </div>
                    <div className={`${themeStyles.accent} font-mono text-[9px] whitespace-nowrap`}>
                      #Isopsephy #Lexarithms #{totalValue}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-[#2d2419] bg-[#191511] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#8c7e6c] font-serif hidden md:block">
            Επίσημο έγγραφο με το λογότυπο «ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — ΕΓΩ ΕΙΜΙ» • Υψηλή ανάλυση (PNG 2x Retina &amp; A4 PDF)
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            
            {/* Copy Button */}
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={isExportingPng || isExportingPdf}
              id="btn-copy-card-image"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#251d15] hover:bg-[#34271c] border border-[#443625] text-xs font-serif text-[#d6c7b2] transition-all cursor-pointer disabled:opacity-50"
              title="Αντιγραφή εικόνας στο Πρόχειρο"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Αντιγράφηκε!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#c89b3c]" />
                  <span>Αντιγραφή</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              disabled={isExportingPng || isExportingPdf}
              id="btn-share-card"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#282015] hover:bg-[#382b1c] border border-[#c89b3c]/40 text-xs font-serif text-[#e6c670] transition-all cursor-pointer disabled:opacity-50"
              title="Κοινοποίηση σε άλλες εφαρμογές"
            >
              <Share2 className="w-4 h-4" />
              <span>Κοινοποίηση</span>
            </button>

            {/* PNG Download Button */}
            <button
              type="button"
              onClick={exportPng}
              disabled={isExportingPng || isExportingPdf}
              id="btn-download-png"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2b2114] hover:bg-[#3d2e1b] border border-[#d4af37]/60 text-xs font-bold font-serif text-[#ffd700] transition-all cursor-pointer disabled:opacity-50"
              title="Λήψη της κάρτας ως εικόνα PNG"
            >
              {isExportingPng ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#ffd700]" />
                  <span>PNG...</span>
                </>
              ) : isPngDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 font-bold" />
                  <span className="text-emerald-300">Λήφθηκε PNG!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#ffd700]" />
                  <span>Λήψη PNG</span>
                </>
              )}
            </button>

            {/* PDF Download Button */}
            <button
              type="button"
              onClick={exportPdf}
              disabled={isExportingPng || isExportingPdf}
              id="btn-export-card-pdf"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b38328] via-[#e5b342] to-[#ffd700] hover:from-[#c99532] hover:to-[#ffe033] text-[#1a140b] text-xs sm:text-sm font-black font-serif shadow-lg shadow-[#ffd700]/25 transition-all cursor-pointer disabled:opacity-50"
              title="Εξαγωγή της καρτέλας σε αρχείο PDF (A4)"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1a140b]" />
                  <span>PDF...</span>
                </>
              ) : isPdfDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-[#1a140b] font-bold" />
                  <span>Λήφθηκε PDF!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-[#1a140b]" />
                  <span>Εξαγωγή PDF</span>
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
