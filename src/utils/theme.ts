export type AppTheme =
  | "dark-ancient"          // 1. Κλασική / Νυχτερινή (Η αρχική)
  | "parchment"             // 2. Αρχαιοελληνική Περγαμηνή & Πάπυρος (Ανοιχτόχρωμο/Λευκό)
  | "ancient-calligraphy"   // 3. Αρχαιοελληνική Καλλιγραφία (GFS Didot & Περγαμηνή)
  | "solar"                 // 4. Ηλιακή (Solar Apollo - Ζεστό Χρυσό & Ήλιος)
  | "ethereal"              // 5. Αιθέρικη (Ethereal Cosmic - Μυστικιστικό Ίασπις/Κυανό/Ουράνιο)
  | "cyber-tech";           // 6. Τεχνολογίας (Cyber Quantum - Φουτουριστική Νέον/Κβαντική)

export interface ThemeMeta {
  id: AppTheme;
  name: string;
  subtitle: string;
  description: string;
  isLight: boolean;
  bgPreview: string;
  borderPreview: string;
  accentPreview: string;
  textPreview: string;
  badgeLabel: string;
  iconName: "moon" | "scroll" | "feather" | "sun" | "sparkles" | "cpu";
}

export const APP_THEMES: ThemeMeta[] = [
  {
    id: "dark-ancient",
    name: "1. Κλασική / Νυχτερινή",
    subtitle: "Αρχαιοελληνικό Σκοτεινό",
    description: "Το αυθεντικό μυστηριακό σκοτεινό φόντο οψιδιανού με χρυσές και χάλκινες αρχαιοελληνικές ανταύγειες.",
    isLight: false,
    bgPreview: "#0d0c0a",
    borderPreview: "#ffd700",
    accentPreview: "#c89b3c",
    textPreview: "#f5ecd8",
    badgeLabel: "Κλασικό",
    iconName: "moon",
  },
  {
    id: "parchment",
    name: "2. Αρχαιοελληνική Περγαμηνή",
    subtitle: "Φωτεινός Πάπυρος & Μάρμαρο (Χωρίς Μαύρα)",
    description: "Πλήρως φωτεινό φόντο παπύρου/μαρμάρου χωρίς καθόλου μαύρα πεδία. Τα γράμματα που πληκτρολογείτε εμφανίζονται σε κομψές καλλιγραφικές αποχρώσεις του καφέ.",
    isLight: true,
    bgPreview: "#f8f4ec",
    borderPreview: "#bfa37c",
    accentPreview: "#8c5307",
    textPreview: "#4a2808",
    badgeLabel: "Καφέ Γραφή",
    iconName: "scroll",
  },
  {
    id: "ancient-calligraphy",
    name: "3. Αρχαιοελληνική Καλλιγραφία",
    subtitle: "GFS Didot & Περγαμηνή (Ανοιχτό Καφέ Μελάνι)",
    description: "Αντικαθιστά όλες τις γραμματοσειρές της εφαρμογής με την κλασική 'GFS Didot' και εφαρμόζει αυστηρά την παλέτα της Περγαμηνής (ανοιχτό καφέ μελάνι σε φόντο ιβουάρ) για όλα τα κείμενα και τα πλαίσια εισαγωγής.",
    isLight: true,
    bgPreview: "#faf5eb",
    borderPreview: "#b59263",
    accentPreview: "#7a491e",
    textPreview: "#543216",
    badgeLabel: "GFS Didot",
    iconName: "feather",
  },
  {
    id: "solar",
    name: "4. Ηλιακή (Solar)",
    subtitle: "Φως του Απόλλωνα & Ήλιος 666",
    description: "Λαμπερό ηλιακό θέμα με ζεστούς τόνους ιβουάρ, λαμπερό κεχριμπάρι, χρυσάφι και φωτεινά ανάγλυφα πλαίσια.",
    isLight: true,
    bgPreview: "#fffcf0",
    borderPreview: "#d97706",
    accentPreview: "#f59e0b",
    textPreview: "#3b1e00",
    badgeLabel: "Ηλιακό",
    iconName: "sun",
  },
  {
    id: "ethereal",
    name: "5. Αιθέρικη (Ethereal)",
    subtitle: "Ουράνιος Αιθέρας & Αστρικό Φως",
    description: "Μυστικιστικό βαθύ ουράνιο μπλε/ιώδες με λαμπερό αστρικό κυανό, κρυστάλλινο φως και αιθέρια αρμονία.",
    isLight: false,
    bgPreview: "#060913",
    borderPreview: "#38bdf8",
    accentPreview: "#818cf8",
    textPreview: "#e0f2fe",
    badgeLabel: "Αιθέρας",
    iconName: "sparkles",
  },
  {
    id: "cyber-tech",
    name: "6. Τεχνολογίας (Cyber-Tech)",
    subtitle: "Κβαντική & Φουτουριστική",
    description: "Σύγχρονη τεχνολογική όψη υψηλής ευκρίνειας με βαθύ slate/carbon, νέον matrix σμαράγδι και κυβερνο-κυανές γραμμές.",
    isLight: false,
    bgPreview: "#090d14",
    borderPreview: "#10b981",
    accentPreview: "#06b6d4",
    textPreview: "#ecfeff",
    badgeLabel: "High-Tech",
    iconName: "cpu",
  },
];

export const THEME_STORAGE_KEY = "greek_isopsephy_app_theme_v2";

export function getInitialTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (
      saved === "dark-ancient" ||
      saved === "parchment" ||
      saved === "ancient-calligraphy" ||
      saved === "solar" ||
      saved === "ethereal" ||
      saved === "cyber-tech"
    ) {
      return saved as AppTheme;
    }
  } catch (e) {
    console.error("Failed to read theme preference", e);
  }
  return "dark-ancient";
}

export function saveThemePreference(theme: AppTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error("Failed to save theme preference", e);
  }
}
