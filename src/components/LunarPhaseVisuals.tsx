import React from "react";

export type MoonPhaseKey =
  | "new_moon"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full_moon"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent"
  | "dark_moon";

export interface MoonPhaseInfo {
  key: MoonPhaseKey;
  greekName: string;
  ancientAtticName: string;
  daySpan: string; // e.g. "1η ημέρα (Νουμηνία)"
  symbol: string;
  svgVisual: string;
  description: string;
  ritualSignificance: string;
  deity: string;
}

export const LUNAR_PHASES_DATA: MoonPhaseInfo[] = [
  {
    key: "new_moon",
    greekName: "Νέα Σελήνη / Νουμηνία",
    ancientAtticName: "Νουμηνία (Ἱσταμένου Μηνός)",
    daySpan: "1η ημέρα εκάστου μηνός",
    symbol: "🌑",
    svgVisual: "new",
    description: "Η πρώτη ορατή λεπτή ημισέληνος στον δυτικό ουρανό μετά τη σύνοδο. Σηματοδοτούσε την επίσημη έναρξη κάθε νέου αρχαίου αττικού μηνός.",
    ritualSignificance: "Ιερή ημέρα ανάπαυσης και οικιακών καθαρμών. Προσφορές λιβανιού και πλακούντων στους προγονικούς θεούς και στον Απόλλωνα Νουμήνιο.",
    deity: "Απόλλων Νουμήνιος, Εκάτη, Ερμής, Ζευς Κτήσιος"
  },
  {
    key: "waxing_crescent",
    greekName: "Αύξων Μηνίσκος",
    ancientAtticName: "Μὴν Ἱστάμενος (Πρώτη Δεκάδα)",
    daySpan: "2η – 6η ημέρα",
    symbol: "🌒",
    svgVisual: "waxing_crescent",
    description: "Η Σελήνη σταδιακά γεμίζει με ηλιακό φως. Η περίοδος της πρώτης δεκάδας («Μὴν Ἱστάμενος») θεωρούνταν η πιο κατάλληλη για την εκκίνηση νέων έργων, γάμων και σποράς.",
    ritualSignificance: "6η ημέρα: Γενέθλια Αρτέμιδος. 7η ημέρα: Γενέθλια Απόλλωνος (ιερά Εβδόμη). 8η ημέρα: Ιερά του Ποσειδώνος και του Θησέως.",
    deity: "Άρτεμις, Απόλλων, Αθηνά"
  },
  {
    key: "first_quarter",
    greekName: "Πρώτο Τέταρτο",
    ancientAtticName: "Διχότομος Αὔξουσα (7η-8η Ἱσταμένου)",
    daySpan: "7η – 8η ημέρα",
    symbol: "🌓",
    svgVisual: "first_quarter",
    description: "Το ακριβές ημισέληνο φως (50% φωτισμός). Σημείο ισορροπίας μεταξύ του αόρατου και του πλήρους φωτός.",
    ritualSignificance: "Τέλεση των ιερών μηνιαίων εορτών του Απόλλωνος και της Αρτέμιδος σε όλες τις ελληνικές πόλεις.",
    deity: "Απόλλων Εβδομαγέτης, Ποσειδών"
  },
  {
    key: "waxing_gibbous",
    greekName: "Αμφίκυρτος Αύξουσα",
    ancientAtticName: "Προ του Πλήθους (9η – 14η)",
    daySpan: "9η – 14η ημέρα",
    symbol: "🌔",
    svgVisual: "waxing_gibbous",
    description: "Η Σελήνη φτάνει σχεδόν στην πλήρη λαμπρότητά της, προετοιμάζοντας την κορύφωση της φυσικής και ψυχικής ενέργειας.",
    ritualSignificance: "Προπαρασκευή για τις μεγάλες νυχτερινές πομπές και τα μυστήρια.",
    deity: "Διόνυσος, Ήρα"
  },
  {
    key: "full_moon",
    greekName: "Πανσέληνος / Διχόμηνις",
    ancientAtticName: "Διχόμηνις / Πλησιφαής (15η-16η Μηνός)",
    daySpan: "15η – 16η ημέρα (Μεσούντος Μηνός)",
    symbol: "🌕",
    svgVisual: "full",
    description: "Το μέγιστο της σεληνιακής ακτινοβολίας. Η Σελήνη βρίσκεται σε ακριβή αντίθεση με τον Ήλιο, φωτίζοντας ολόκληρη τη νύχτα από τη δύση έως την ανατολή.",
    ritualSignificance: "Η κατεξοχήν νύχτα των Μεγάλων Μυστηρίων (Ελευσίνια, Ολυμπιακοί Αγώνες, Μουνίχια, Θεογάμια, Βενδίδεια). Οι αρχαίοι συντόνιζαν όλες τις μεγάλες ιερές πανηγύρεις με την Πανσέληνο.",
    deity: "Άρτεμις, Σελήνη, Εκάτη, Δήμητρα & Κόρη"
  },
  {
    key: "waning_gibbous",
    greekName: "Αμφίκυρτος Φθίνουσα",
    ancientAtticName: "Μὴν Φθίνων (17η – 21η)",
    daySpan: "17η – 21η ημέρα",
    symbol: "🌖",
    svgVisual: "waning_gibbous",
    description: "Το φως αρχίζει να ελαττώνεται. Μετάβαση στην τρίτη δεκάδα του μηνός («Μὴν Φθίνων»), κατάλληλη για ενδοσκόπηση, περισυλλογή και ολοκλήρωση εργασιών.",
    ritualSignificance: "Εορτές ευχαριστίας και προσφορές καρπών.",
    deity: "Κρόνος, Εστία"
  },
  {
    key: "last_quarter",
    greekName: "Τελευταίο Τέταρτο",
    ancientAtticName: "Διχότομος Φθίνουσα (22α-23η)",
    daySpan: "22α – 23η ημέρα",
    symbol: "🌗",
    svgVisual: "last_quarter",
    description: "Το δυτικό ήμισυ της Σελήνης παραμένει φωτισμένο. Σηματοδοτεί την τελευταία εβδομάδα του σεληνιακού μήνα.",
    ritualSignificance: "Τελετές κάθαρσης και εξιλασμού των αμαρτιών και των μολυσμάτων.",
    deity: "Ζευς Μειλίχιος, Πλούτων"
  },
  {
    key: "waning_crescent",
    greekName: "Φθίνων Μηνίσκος",
    ancientAtticName: "Λυκόφως Φθίνοντος (24η – 28η)",
    daySpan: "24η – 28η ημέρα",
    symbol: "🌘",
    svgVisual: "waning_crescent",
    description: "Λεπτή μηνίσκος ορατή μόνο πριν την ανατολή του ηλίου στον ανατολικό ορίζοντα.",
    ritualSignificance: "Προετοιμασία για το τέλος του μηνός. Πλύσιμο ναών και καθαρισμός αγαλμάτων (Πλυντήρια/Καλλυντήρια).",
    deity: "Αθηνά Πολιάς, Ερμής Ψυχοπομπός"
  },
  {
    key: "dark_moon",
    greekName: "Ένη και Νέα / Σύνοδος",
    ancientAtticName: "Ἕνη καὶ Νέα (Τριακάς - 29η/30η)",
    daySpan: "29η / 30η ημέρα (Αφανής Σελήνη)",
    symbol: "🌑",
    svgVisual: "dark",
    description: "Η παλαιά Σελήνη («Ἕνη») πεθαίνει και η νέα («Νέα») κυοφορείται μέσα στο σκοτάδι. Η Σελήνη είναι εντελώς αόρατη στον ουρανό.",
    ritualSignificance: "«Δείπνα της Εκάτης»: Οι Αθηναίοι τοποθετούσαν πιάτα με φαγητό στα τρίστρατα προς τιμήν της Εκάτης και των χθόνιων πνευμάτων για να καθαρίσουν το σπίτι από κάθε κακό.",
    deity: "Εκάτη Τριοδίτις, Περσεφόνη, Άδης"
  }
];

export const MoonPhaseVisual: React.FC<{ phase: string; size?: number; className?: string }> = ({
  phase,
  size = 28,
  className = ""
}) => {
  // SVG rendering of Moon Phase with accurate lighting
  switch (phase) {
    case "new":
    case "dark":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#181512" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      );
    case "waxing_crescent":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#181512" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 16,2 A 14,14 0 0,1 16,30 A 8,14 0 0,0 16,2" fill="#ffd700" />
        </svg>
      );
    case "first_quarter":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#181512" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 16,2 A 14,14 0 0,1 16,30 Z" fill="#ffd700" />
        </svg>
      );
    case "waxing_gibbous":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#ffd700" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 16,2 A 14,14 0 0,0 16,30 A 7,14 0 0,1 16,2" fill="#181512" />
        </svg>
      );
    case "full":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#ffd700" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill="#fef08a" fillOpacity="0.4" />
          <circle cx="19" cy="18" r="3.5" fill="#fef08a" fillOpacity="0.3" />
          <circle cx="10" cy="20" r="1.8" fill="#fef08a" fillOpacity="0.4" />
        </svg>
      );
    case "waning_gibbous":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#ffd700" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 16,2 A 14,14 0 0,1 16,30 A 7,14 0 0,0 16,2" fill="#181512" />
        </svg>
      );
    case "last_quarter":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#181512" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 16,2 A 14,14 0 0,0 16,30 Z" fill="#ffd700" />
        </svg>
      );
    case "waning_crescent":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#181512" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 16,2 A 14,14 0 0,0 16,30 A 8,14 0 0,1 16,2" fill="#ffd700" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#ffd700" />
        </svg>
      );
  }
};
