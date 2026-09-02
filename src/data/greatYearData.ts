export interface ZodiacSignData {
  id: string;
  name: string; // π.χ. "Κριός"
  ancientName: string; // "Κριός (Aries)"
  symbol: string; // ♈
  element: "Πυρ" | "Γη" | "Αήρ" | "Ύδωρ";
  quality: "Παρορμητικό (Κινητό)" | "Σταθερό" | "Μεταβλητό (Δίσωμο)";
  rulingGod: string; // "Άρης / Αθηνά"
  rulingPlanet: string; // "Άρης"
  degrees: string; // "0° – 30°"
  
  // Ετήσιος Ενιαυτός (1 Έτος)
  annualDates: string; // "21 Μαρτίου – 19 Απριλίου"
  annualMeaning: string; // Εαρινή ισημερία, έναρξη ζωής
  atticMonthMatch: string; // "Ελαφηβολιών – Μουνιχιών"

  // Μέγας Ενιαυτός (Πλατωνικό Έτος 25.920 ετών)
  greatAgeYears: string; // "2.160 Έτη"
  greatAgeSpan: string; // π.χ. "2.320 π.Χ. – 160 π.Χ."
  precessionOrder: number; // 1 to 12 in reverse / direct
  greatAgeArchetype: string; // "Η Εποχή του Κριού / Χρυσόμαλλο Δέρας / Σάλπιγγες"
  greatAgeHistory: string; // Ιστορικά & Μυθολογικά γεγονότα
  theologicalConnection: string; // Θεολογική ανάλυση

  // Ετυμολογία «ΖΩ...ΔΙΑ» & Ισοψηφία
  zoDiaEtymology: string; // Πώς εκφράζει το "Ζωή δια του Διός"
  isopsephyWord: string; // "ΚΡΙΟΣ"
  isopsephyValue: number; // 400
  isopsephyBreakdown: string; // "Κ(20) + Ρ(100) + Ι(10) + Ο(70) + Σ(200) = 400"
}

export interface GreatYearCosmology {
  title: string;
  totalYears: number; // 25920
  subPeriodYears: number; // 2160
  degreeYears: number; // 72
  minuteYears: number; // 1.2
  secondYears: number; // 0.02
  decanYears: number; // 720
  halfCycleYears: number; // 12960
  definition: string;
  platoReference: string;
  hipparchusDiscovery: string;
  aquariusEpochInsight: {
    title: string;
    description: string;
    scientificRelativity: {
      title: string;
      summary: string;
      reasons: { title: string; desc: string }[];
      comparisons: { model: string; entryYear: string; notes: string }[];
    };
    piscesStartBCE: number; // 160 BCE
    christBirthYearIntoPisces: number; // 160th year
    aquariusStartCE: number; // 2000 CE
    year2026AquariusYear: number; // 26th year
    year2026Degrees: string; // "0° 21' 40''"
  };
  etymologyZoDia: {
    title: string;
    root: string;
    meaning: string;
    philosophicalDepth: string;
    isopsephicCodes: { term: string; value: number; breakdown: string; meaning: string }[];
  };
}

export const GREAT_YEAR_COSMOLOGY: GreatYearCosmology = {
  title: "Ὁ Μέγας Ἐνιαυτὸς & Ὁ Ζωοφόρος Κύκλος (25.920 & 2.160 Ἔτη)",
  totalYears: 25920,
  subPeriodYears: 2160,
  degreeYears: 72,
  minuteYears: 1.2,
  secondYears: 0.02,
  decanYears: 720,
  halfCycleYears: 12960,
  definition: "Ο Μέγας Ενιαυτός (Πλατωνικός Ενιαυτός) είναι ο πλήρης αστρονομικός κύκλος διάρκειας 25.920 ετών, κατά τον οποίο ο άξονας περιστροφής της Γης διαγράφει έναν πλήρη κώνο 360° στον ουράνιο θόλο (Μετάπτωση των Ισημεριών). Ο κύκλος αυτός υποδιαιρείται ακριβώς σε 12 Μεγάλους Μήνες (Αστρολογικές Εποχές) των 2.160 ετών έκαστος (25.920 ÷ 12 = 2.160), όπου κάθε μία μοίρα (1°) της εκλειπτικής ισούται με ακριβώς 72 γήινα έτη (72 × 30° = 2.160), κάθε πρώτο λεπτό (1') ισούται με 1,2 έτη και κάθε δεύτερο λεπτό (1'') ισούται με ~7,3 ημέρες (0,02 έτη).",
  platoReference: "Στον διάλογο «Τίμαιος» (39d), ο Πλάτων ορίζει τον Τέλειο / Μέγα Ενιαυτό: «Τότε δ' ὅμως κατανοῆσαι δυνατὸν ὡς ὅ γε τέλεος ἀριθμὸς χρόνου τὸν τέλεον ἐνιαυτὸν πληροῖ τότε, ὅταν ἁπασῶν τῶν ὀκτὼ περιόδων τὰ πρὸς ἄλληλα συμπερανθέντα τάχη σχῇ κεφαλὴν τῷ τοῦ ταὐτοῦ καὶ ὁμοίως ἰόντος ἀναμετρηθέντα κύκλῳ» (Όταν όλοι οι πλανήτες και οι ουράνιες σφαίρες επανέλθουν ταυτόχρονα στο αρχικό τους σημείο εκκίνησης).",
  hipparchusDiscovery: "Ο μέγιστος αρχαίος Έλληνας αστρονόμος Ίππαρχος ο Ρόδιος (190–120 π.κ.χ. [π.Χ.]) ανακάλυψε και μέτρησε μαθηματικά τη Μετάπτωση των Ισημεριών (Προπόρευσιν), συγκρίνοντας τις δικές του αστρονομικές παρατηρήσεις με εκείνες του Τιμοχάριδος και του Αριστύλλου (300 π.κ.χ. [π.Χ.]), διαπιστώνοντας τη μετατόπιση του εαρινού ισημερινού σημείου κατά 1° κάθε ~72 έτη.",
  aquariusEpochInsight: {
    title: "Η Μετάβαση στον Υδροχόο (2000 μ.κ.χ. [μ.Χ.]) & η Έλευση του Χριστού (160 Μετά Ιχθύος)",
    description: "Με δεδομένη τη μετάβαση στην Εποχή του Υδροχόου στο Millennium (2000 μ.κ.χ. [μ.Χ.]), η Εποχή των Ιχθύων (διάρκειας 2.160 ετών) ξεκίνησε το 160 π.κ.χ. [π.Χ.] (160 π.κ.χ. + 2000 μ.κ.χ. = 2.160 έτη). Κατά συνέπεια, η γέννηση του Ιησού Χριστού (1 μ.κ.χ. [μ.Χ.]) έλαβε χώρα ακριβώς στο 160ό έτος της Εποχής των Ιχθύων (160 Μετά Ιχθύος, δηλαδή στην 2° 13' 20'' των Ιχθύων). Σήμερα, εν έτει 2026 μ.κ.χ. [μ.Χ.], διανύουμε το 26ο έτος της Εποχής του Υδροχόου (2026 - 2000 = 26 έτη), το οποίο αντιστοιχεί ακριβώς στην 0° 21' 40'' του Υδροχόου (26 ÷ 72 = 0,36111°).",
    scientificRelativity: {
      title: "Επιστημονική & Αστρονομική Σχετικότητα της Μετάβασης (Μαθηματικό Μοντέλο vs Πραγματικός Ουρανός)",
      summary: "Δεν υφίσταται μία ενιαία, αδιαμφισβήτητη ημερομηνία εισόδου της Γης στον Υδροχόο. Το έτος 2000 μ.κ.χ. (μ.Χ.) αποτελεί ένα συμβατικό, αυστηρά ισομεγέθες μαθηματικό ορόσημο (12 × 30° = 360° / 12 × 2.160 = 25.920 έτη). Στην πραγματική αστρονομική παρατήρηση, η αλλαγή εποχής είναι μια μακρά μεταβατική ζώνη αιώνων.",
      reasons: [
        {
          title: "Απουσία Φυσικών Συνόρων & Τεχνητά Όρια (IAU)",
          desc: "Στον ουρανό δεν υπάρχουν χαραγμένες διαχωριστικές γραμμές. Τα επίσημα όρια της Διεθνούς Αστρονομικής Ένωσης (IAU, 1928) είναι συμβατικά. Επειδή ο αστερισμός των Ιχθύων είναι αστρονομικά τεράστιος (~37°), με βάση τα σύνορα της IAU η εαρινή ισημερία θα περάσει στον Υδροχόο περί το 2600 μ.κ.χ. (μ.Χ.)."
        },
        {
          title: "Η Εξαιρετικά Αργή Μετάπτωση (1° ανά 72 έτη)",
          desc: "Η μετατόπιση του γήινου άξονα είναι ανεπαίσθητη σε ανθρώπινη κλίμακα. Ακόμη και ο ηλιακός δίσκος (0,5°) χρειάζεται 36 έτη μόνο για να διασχίσει μια διαχωριστική γραμμή. Η μετάβαση είναι μια «Κοσμική Αυγή / Λυκόφως» που εκτείνεται σε 150–300 έτη αλληλεπικάλυψης."
        },
        {
          title: "Διαφορετικά Συστήματα Μέτρησης & Σχολές",
          desc: "Ο Τροπικός Ζωδιακός, ο Αστρικός (Sidereal / Lahiri, Fagan-Bradley) και οι διάφορες φιλοσοφικές παραδόσεις τοποθετούν την έναρξη μεταξύ 1950, 2000, 2060, 2150 ή και 2600 μ.κ.χ. (μ.Χ.). Το παρόν ημερολόγιο υιοθετεί το κλασικό Πυθαγόρειο-Πλατωνικό αρμονικό μοντέλο των 2.160 ετών ανά εποχή με αφετηρία τη χιλιετία."
        }
      ],
      comparisons: [
        { model: "Πυθαγόρειο / Μαθηματικό Μοντέλο (Ισομεγέθης Ζωδιακός)", entryYear: "2000 μ.κ.χ. (μ.Χ.)", notes: "12 εποχές × 2.160 έτη = 25.920 έτη (Αφετηρία 2000 μ.κ.χ. [μ.Χ.])" },
        { model: "Αστρικό Σύστημα (Lahiri Ayanamsha)", entryYear: "~2080 – 2150 μ.κ.χ. (μ.Χ.)", notes: "Βασισμένο στην αστέρα Spica (Chitra) στις 0° Ζυγού" },
        { model: "Όρια Διεθνούς Αστρονομικής Ένωσης (IAU)", entryYear: "~2600 μ.κ.χ. (μ.Χ.)", notes: "Ανισομεγέθη όρια αστερισμών (Ιχθύες ~37° εκλειπτικής)" },
        { model: "Ζώνη Κοσμικής Αυγής / Μετάβασης", entryYear: "1950 – 2150 μ.κ.χ. (μ.Χ.)", notes: "Μεταβατικό λυκόφως επικάλυψης των αρχετύπων Ιχθύων & Υδροχόου" }
      ]
    },
    piscesStartBCE: 160,
    christBirthYearIntoPisces: 160,
    aquariusStartCE: 2000,
    year2026AquariusYear: 26,
    year2026Degrees: "0° 21' 40''"
  },
  etymologyZoDia: {
    title: "Μυστική Ετυμολογία «ΖΩ...ΔΙΑ» (Ζωὴ διὰ τοῦ Διός)",
    root: "ΖΩΗ + ΔΙΑΣ (ΖΩ-ΔΙΑ) / ΖΩΟΝ + ΕΙΔΟΣ (ΖΩΟΦΟΡΟΣ)",
    meaning: "Τα 12 Ζώδια δεν είναι απλώς τυχαία σχήματα αστέρων, αλλά οι 12 πρωταρχικές «Ζώσες Δυνάμεις» που απορρέουν από τον Δημιουργικό Νου (Δία).",
    philosophicalDepth: "Στην ελληνική θεογονική και πυθαγόρεια παράδοση, η λέξη «Ζῴδιον» ετυμολογείται διττά: αφενός από το «Ζῷον» (ζωντανή οντότητα, έμψυχο ενεργειακό πεδίο) και αφετέρου από τη σύνθεση «ΖΩ-ΔΙΑ» (Ζωή δια του Διός, δηλαδή η εκδήλωση της ζωικής πνοής μέσω της ακτινοβολίας του Ανώτατου Φωτός). Ο Ζωοφόρος Κύκλος (360°) είναι ο κοσμικός καθρέφτης όπου ο Δίας-Ήλιος διαχέει τη ζωοποιό του δύναμη στις 12 πύλες της ψυχής.",
    isopsephicCodes: [
      {
        term: "ΖΩΔΙΑ",
        value: 822,
        breakdown: "Ζ(7) + Ω(800) + Δ(4) + Ι(10) + Α(1) = 822",
        meaning: "Ο πληθυντικός των 12 κοσμικών ζώντων πυλών. Ισοψηφεί με φράσεις θείας αρμονίας."
      },
      {
        term: "ΖΩΔΙΟΝ",
        value: 941,
        breakdown: "Ζ(7) + Ω(800) + Δ(4) + Ι(10) + Ο(70) + Ν(50) = 941",
        meaning: "Η μονάδα του ζωδιακού (30°). Ισόψηφο με το «ΚΟΣΜΙΚΟΝ ΕΙΔΟΣ»."
      },
      {
        term: "ΖΩΗ",
        value: 815,
        breakdown: "Ζ(7) + Ω(800) + Η(8) = 815",
        meaning: "Η πρωταρχική θεία δύναμη που τροφοδοτεί τα όντα."
      },
      {
        term: "ΔΙΑΣ",
        value: 215,
        breakdown: "Δ(4) + Ι(10) + Α(1) + Σ(200) = 215",
        meaning: "Ο Ζωοδότης Πατήρ, η πηγή της ουράνιας διάταξης (ΔΙ' ΟΝ ΤΑ ΠΑΝΤΑ ΖΩΣΙΝ)."
      },
      {
        term: "ΕΝΙΑΥΤΟΣ",
        value: 1036,
        breakdown: "Ε(5) + Ν(50) + Ι(10) + Α(1) + Υ(400) + Τ(300) + Ο(70) + Σ(200) = 1036",
        meaning: "«Ἐν ἑαυτῷ ἰών» (αυτός που επιστρέφει στον εαυτό του) - ο ετήσιος κύκλος του Χρόνου."
      },
      {
        term: "ΜΕΓΑΣ ΕΝΙΑΥΤΟΣ",
        value: 1280,
        breakdown: "ΜΕΓΑΣ(244) + ΕΝΙΑΥΤΟΣ(1036) = 1280",
        meaning: "Ο Πλατωνικός Κύκλος των 25.920 ετών. Ισόψηφο με «Η ΘΕΙΑ ΠΕΡΙΦΟΡΑ»."
      }
    ]
  }
};

export const ZODIAC_SIGNS_DATA: ZodiacSignData[] = [
  {
    id: "aries",
    name: "Κριός",
    ancientName: "Κριός (Aries)",
    symbol: "♈",
    element: "Πυρ",
    quality: "Παρορμητικό (Κινητό)",
    rulingGod: "Άρης & Αθηνά Παλλάς",
    rulingPlanet: "Άρης",
    degrees: "0° – 30°",
    annualDates: "21 Μαρτίου – 19 Απριλίου",
    annualMeaning: "Εαρινή Ισημερία. Η αφύπνιση της φύσης, η πρωτογενής έκρηξη της ζωής και η εκκίνηση του ετήσιου φωτός.",
    atticMonthMatch: "Ελαφηβολιών – Μουνιχιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "2.320 π.κ.χ. (π.Χ.) – 160 π.κ.χ. (π.Χ.)",
    precessionOrder: 1,
    greatAgeArchetype: "Εποχή του Κριού / Χρυσόμαλλο Δέρας / Ήρωες & Νόμος",
    greatAgeHistory: "Η εποχή της ανόδου του Ελληνικού Κλασικού Πολιτισμού, της Αργοναυτικής Εκστρατείας (Χρυσόμαλλο Δέρας), της λατρείας του Άμμωνος-Διός με κέρατα κριού στην Αίγυπτο, των νόμων του Μωυσέως (σάλπιγγα από κέρατο κριού/Shofar) και της αντικατάστασης των θυσιών ταύρου με αμνό.",
    theologicalConnection: "Ο Κριός αντιπροσωπεύει την αρχέγονη σπίθα του Νου που διαπερνά το χάος. Ως κεφαλή του Ζωδιακού, εγκαινιάζει τη δράση και τη διάκριση του πνεύματος από τη νωθρή ύλη.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΟΥ ΠΥΡΟΣ: Η πρώτη ώθηση της ζωής του Διός, η ηλιακή σφραγίδα της έναρξης.",
    isopsephyWord: "ΚΡΙΟΣ",
    isopsephyValue: 400,
    isopsephyBreakdown: "Κ(20) + Ρ(100) + Ι(10) + Ο(70) + Σ(200) = 400"
  },
  {
    id: "taurus",
    name: "Ταύρος",
    ancientName: "Ταύρος (Taurus)",
    symbol: "♉",
    element: "Γη",
    quality: "Σταθερό",
    rulingGod: "Αφροδίτη & Ήρα",
    rulingPlanet: "Αφροδίτη",
    degrees: "30° – 60°",
    annualDates: "20 Απριλίου – 20 Μαΐου",
    annualMeaning: "Στερέωση της γονιμότητας, άνθιση της γης, σταθεροποίηση της ύλης και απόλαυση των καρπών.",
    atticMonthMatch: "Μουνιχιών – Θαργηλιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "4.480 π.κ.χ. (π.Χ.) – 2.320 π.κ.χ. (π.Χ.)",
    precessionOrder: 2,
    greatAgeArchetype: "Εποχή του Ταύρου / Μινωικός Πολιτισμός / Ιερός Άπις",
    greatAgeHistory: "Η εποχή του Μινωικού Πολιτισμού στην Κρήτη (Ταυροκαθάψια, Μινώταυρος, Λαβύρινθος), της λατρείας του ιερού Ταύρου Άπιδος στην Αίγυπτο και των μεγαλιθικών μνημείων. Ανάπτυξη της γεωργίας, της οικοδομικής και της λατρείας της Μεγάλης Μητέρας Γης.",
    theologicalConnection: "Ο Ταύρος ενσαρκώνει τη γόνιμη σταθερότητα, την υλοποίηση των αρχετυπικών ιδεών σε απτή μορφή και τη συμπύκνωση του φωτός σε γόνιμη γη.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΓΗΣ: Η στερέωση της θείας ζωής στην ύλη, ο χρυσός ταύρος της αφθονίας του Διός.",
    isopsephyWord: "ΤΑΥΡΟΣ",
    isopsephyValue: 1071,
    isopsephyBreakdown: "Τ(300) + Α(1) + Υ(400) + Ρ(100) + Ο(70) + Σ(200) = 1071"
  },
  {
    id: "gemini",
    name: "Δίδυμοι",
    ancientName: "Δίδυμοι (Gemini)",
    symbol: "♊",
    element: "Αήρ",
    quality: "Μεταβλητό (Δίσωμο)",
    rulingGod: "Ερμής & Διόσκουροι (Κάστωρ & Πολυδεύκης)",
    rulingPlanet: "Ερμής",
    degrees: "60° – 90°",
    annualDates: "21 Μαΐου – 20 Ιουνίου",
    annualMeaning: "Διάδοση της γύρης, επικοινωνία, άνεμοι, ανταλλαγή ιδεών και διανοητική περιέργεια.",
    atticMonthMatch: "Θαργηλιών – Σκιροφοριών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "6.640 π.κ.χ. (π.Χ.) – 4.480 π.κ.χ. (π.Χ.)",
    precessionOrder: 3,
    greatAgeArchetype: "Εποχή των Διδύμων / Διόσκουροι / Εφεύρεση Γραφής & Εμπορίου",
    greatAgeHistory: "Η εποχή της εμφάνισης των πρώτων συστημάτων γραφής (σφηνοειδής, πρωτο-ιερογλυφικά), των πρώτων εμπορικών οδών, της επικοινωνίας μεταξύ φυλών και της φιλοσοφικής συνειδητοποίησης του δυϊσμού (Θνητός Κάστωρ - Αθάνατος Πολυδεύκης).",
    theologicalConnection: "Οι Δίδυμοι φανερώνουν τη γέφυρα μεταξύ θνητού και αθάνατου κόσμου, τη διαλεκτική του Ερμή και την αέναη σύνδεση ουρανού και γης μέσω του Λόγου.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΟΥ ΛΟΓΟΥ: Η διακίνηση της θείας νοημοσύνης μέσω της ομιλίας, των γραμμάτων και της διάνοιας.",
    isopsephyWord: "ΔΙΔΥΜΟΙ",
    isopsephyValue: 538,
    isopsephyBreakdown: "Δ(4) + Ι(10) + Δ(4) + Υ(400) + Μ(40) + Ο(70) + Ι(10) = 538"
  },
  {
    id: "cancer",
    name: "Καρκίνος",
    ancientName: "Καρκίνος (Cancer)",
    symbol: "♋",
    element: "Ύδωρ",
    quality: "Παρορμητικό (Κινητό)",
    rulingGod: "Σελήνη & Άρτεμις",
    rulingPlanet: "Σελήνη",
    degrees: "90° – 120°",
    annualDates: "21 Ιουνίου – 22 Ιουλίου",
    annualMeaning: "Θερινό Ηλιοστάσιο. Το απόγειο του φωτός και η έναρξη της καθόδου. Η «Πύλη των Ανθρώπων» (κάθοδος ψυχών στη γέννηση).",
    atticMonthMatch: "Σκιροφοριών – Εκατομβαιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "8.800 π.κ.χ. (π.Χ.) – 6.640 π.κ.χ. (π.Χ.)",
    precessionOrder: 4,
    greatAgeArchetype: "Εποχή του Καρκίνου / Μεγάλοι Κατακλυσμοί / Μητριαρχία & Ύδατα",
    greatAgeHistory: "Η εποχή του τέλους των Παγετώνων, της ανόδου της στάθμης των θαλασσών (μύθοι κατακλυσμού Δευκαλίωνος, Ατλαντίδος), της πρωταρχικής μητριαρχικής οργάνωσης και της ίδρυσης των πρώτων παραποτάμιων και παράκτιων οικισμών.",
    theologicalConnection: "Στον πλατωνικό νεοπλατωνισμό (Πορφύριος, «Περί του εν Οδυσσεία των Νυμφών Άντρου»), ο Καρκίνος είναι η Βόρεια Πύλη δια της οποίας οι ψυχές κατέρχονται στον υλικό κόσμο της γενέσεως.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΜΗΤΡΑΣ: Η αρχέγονη υδάτινη μήτρα που κυοφορεί την ενσάρκωση των ψυχών.",
    isopsephyWord: "ΚΑΡΚΙΝΟΣ",
    isopsephyValue: 411,
    isopsephyBreakdown: "Κ(20) + Α(1) + Ρ(100) + Κ(20) + Ι(10) + Ν(50) + Ο(70) + Σ(200) = 411"
  },
  {
    id: "leo",
    name: "Λέων",
    ancientName: "Λέων (Leo)",
    symbol: "♌",
    element: "Πυρ",
    quality: "Σταθερό",
    rulingGod: "Ήλιος & Απόλλων",
    rulingPlanet: "Ήλιος",
    degrees: "120° – 150°",
    annualDates: "23 Ιουλίου – 22 Αυγούστου",
    annualMeaning: "Μέγιστη ηλιακή θερμότητα, ωρίμανση καρπών, βασιλική ισχύς και ακτινοβολία της καρδιάς.",
    atticMonthMatch: "Εκατομβαιών – Μεταγειτνιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "10.960 π.κ.χ. (π.Χ.) – 8.800 π.κ.χ. (π.Χ.)",
    precessionOrder: 5,
    greatAgeArchetype: "Εποχή του Λέοντος / Χρυσή Ηλιακή Εποχή / Μεγάλη Σφίγγα & Κατακλυσμός",
    greatAgeHistory: "Η εποχή της κατασκευής των πρωταρχικών ηλιακών μνημείων (όπως η Μεγάλη Σφίγγα με σώμα λέοντος στραμμένη στην ανατολή του Λέοντος το ~10.500 π.κ.χ. [π.Χ.], Γκιομπεκλί Τεπέ). Ηλιακές λατρείες του Απόλλωνος και του αρχέγονου φωτός.",
    theologicalConnection: "Ο Λέων είναι ο θρόνος του Ήλιου, η πνευματική καρδιά του σύμπαντος και το σύμβολο της βασιλικής κυριαρχίας του πνεύματος πάνω στα κατώτερα πάθη (Λέων της Νεμέας - Ηρακλής).",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΟΥ ΦΩΤΟΣ: Η απευθείας ηλιακή ακτινοβολία του Διός-Ηλίου, το αιώνιο βασίλειο της καρδιάς.",
    isopsephyWord: "ΛΕΩΝ",
    isopsephyValue: 885,
    isopsephyBreakdown: "Λ(30) + Ε(5) + Ω(800) + Ν(50) = 885"
  },
  {
    id: "virgo",
    name: "Παρθένος",
    ancientName: "Παρθένος (Virgo)",
    symbol: "♍",
    element: "Γη",
    quality: "Μεταβλητό (Δίσωμο)",
    rulingGod: "Δήμητρα & Αστραία (Δίκη)",
    rulingPlanet: "Ερμής",
    degrees: "150° – 180°",
    annualDates: "23 Αυγούστου – 22 Σεπτεμβρίου",
    annualMeaning: "Συγκομιδή σιτηρών, Ελευσίνια Μυστήρια, εξαγνισμός, ανάλυση, αποθήκευση και μέτρο.",
    atticMonthMatch: "Μεταγειτνιών – Βοηδρομιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "13.120 π.κ.χ. (π.Χ.) – 10.960 π.κ.χ. (π.Χ.)",
    precessionOrder: 6,
    greatAgeArchetype: "Εποχή της Παρθένου / Αστραία & Χρυσό Γένος / Θερισμός & Μυστήρια",
    greatAgeHistory: "Η εποχή του μύθου του Χρυσού Γένους των ανθρώπων, όταν η θεά Δίκη/Αστραία ζούσε ακόμη ανάμεσα στους ανθρώπους πριν αποσυρθεί στους ουρανούς. Ανάπτυξη της επιλογής σπόρων και των αρχέγονων μυστηρίων της γονιμότητας.",
    theologicalConnection: "Η Παρθένος κρατά τον φωτεινό αστέρα Στάχυ (Spica) και συμβολίζει την αμόλυντη ψυχή, τη θεία τάξη (Δίκη) και τη μύηση στα Ελευσίνια Μυστήρια της αναγέννησης.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΑΓΝΟΤΗΤΟΣ: Η διατήρηση του θείου σπέρματος και της ουράνιας δικαιοσύνης στη γη.",
    isopsephyWord: "ΠΑΡΘΕΝΟΣ",
    isopsephyValue: 515,
    isopsephyBreakdown: "Π(80) + Α(1) + Ρ(100) + Θ(9) + Ε(5) + Ν(50) + Ο(70) + Σ(200) = 515"
  },
  {
    id: "libra",
    name: "Ζυγός",
    ancientName: "Ζυγός (Libra)",
    symbol: "♎",
    element: "Αήρ",
    quality: "Παρορμητικό (Κινητό)",
    rulingGod: "Θέμις & Αφροδίτη Ουρανία",
    rulingPlanet: "Αφροδίτη",
    degrees: "180° – 210°",
    annualDates: "23 Σεπτεμβρίου – 22 Οκτωβρίου",
    annualMeaning: "Φθινοπωρινή Ισημερία. Απόλυτη ισορροπία ημέρας και νύχτας, κοινωνική αρμονία, δικαιοσύνη και γάμος.",
    atticMonthMatch: "Βοηδρομιών – Πυανεψιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "15.280 π.κ.χ. (π.Χ.) – 13.120 π.κ.χ. (π.Χ.)",
    precessionOrder: 7,
    greatAgeArchetype: "Εποχή του Ζυγού / Θέμις & Κοσμική Ισορροπία / Πρώτοι Νόμοι",
    greatAgeHistory: "Η εποχή της αναζήτησης της ισορροπίας μετά από μεγάλες κλιματικές μεταβολές. Ανάπτυξη των πρώτων κοινωνικών συμβάσεων, αναγνώριση των νόμων της φύσης και της αμοιβαίας συνεργασίας.",
    theologicalConnection: "Ο Ζυγός είναι ο κοσμικός γνώμονας της Θέμιδος. Αντιπροσωπεύει το σημείο ισορροπίας μεταξύ πνεύματος και ύλης, φωτός και σκότους, όπου η ψυχή ζυγίζεται στην πλάστιγγα της αλήθειας.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΑΡΜΟΝΙΑΣ: Η τέλεια ισορροπία των αντιθέτων υπό την εποπτεία της θείας δικαιοσύνης του Διός.",
    isopsephyWord: "ΖΥΓΟΣ",
    isopsephyValue: 680,
    isopsephyBreakdown: "Ζ(7) + Υ(400) + Γ(3) + Ο(70) + Σ(200) = 680"
  },
  {
    id: "scorpio",
    name: "Σκορπιός",
    ancientName: "Σκορπιός (Scorpio)",
    symbol: "♏",
    element: "Ύδωρ",
    quality: "Σταθερό",
    rulingGod: "Πλούτων & Άρης",
    rulingPlanet: "Πλούτων / Άρης",
    degrees: "210° – 240°",
    annualDates: "23 Οκτωβρίου – 21 Νοεμβρίου",
    annualMeaning: "Νέκρωση της εξωτερικής φύσης, εσωστρέφεια, κάθοδος στον Άδη, μεταμόρφωση και αναγέννηση.",
    atticMonthMatch: "Πυανεψιών – Μαιμακτηριών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "17.440 π.κ.χ. (π.Χ.) – 15.280 π.κ.χ. (π.Χ.)",
    precessionOrder: 8,
    greatAgeArchetype: "Εποχή του Σκορπιού / Μεταμόρφωση & Φοίνιξ / Μυστήρια του Θανάτου",
    greatAgeHistory: "Η εποχή των μεγάλων ταφικών τελετουργιών των παλαιολιθικών ανθρώπων, των πρώτων σαμανικών μυήσεων, της αναγνώρισης της συνέχειας της ζωής μετά τον σωματικό θάνατο.",
    theologicalConnection: "Ο Σκορπιός συνδέεται με τον Φοίνικα και τον Αετό του Διός: αποτελεί το στάδιο της βαθιάς εσωτερικής αλχημείας, όπου το δηλητήριο των παθών μετατρέπεται σε φως αθανασίας.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΜΕΤΑΜΟΡΦΩΣΕΩΣ: Η αθάνατη δύναμη της ψυχής που νικά τον θάνατο και αναγεννάται εκ της τέφρας.",
    isopsephyWord: "ΣΚΟΡΠΙΟΣ",
    isopsephyValue: 660,
    isopsephyBreakdown: "Σ(200) + Κ(20) + Ο(70) + Ρ(100) + Π(80) + Ι(10) + Ο(70) + Σ(200) = 660"
  },
  {
    id: "sagittarius",
    name: "Τοξότης",
    ancientName: "Τοξότης (Sagittarius)",
    symbol: "♐",
    element: "Πυρ",
    quality: "Μεταβλητό (Δίσωμο)",
    rulingGod: "Ζευς (Δίας) & Χείρων Κένταυρος",
    rulingPlanet: "Δίας",
    degrees: "240° – 270°",
    annualDates: "22 Νοεμβρίου – 21 Δεκεμβρίου",
    annualMeaning: "Στόχευση προς το ανώτερο φως, φιλοσοφία, ιερά ταξίδια, ανώτερη παιδεία και προετοιμασία για το ηλιοστάσιο.",
    atticMonthMatch: "Μαιμακτηριών – Ποσειδεών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "19.600 π.κ.χ. (π.Χ.) – 17.440 π.κ.χ. (π.Χ.)",
    precessionOrder: 9,
    greatAgeArchetype: "Εποχή του Τοξότη / Χείρων & Ιεροί Κένταυροι / Ύψωση του Βέλους",
    greatAgeHistory: "Η εποχή της ανάπτυξης της αστροπαρατήρησης, των πρώτων συμβολικών τοιχογραφιών σε σπήλαια (Lascaux), της αναζήτησης του θείου νοήματος και της διδασκαλίας της ιατρικής και μουσικής.",
    theologicalConnection: "Ο Τοξότης είναι ο κατοικητήριος οίκος του Διός. Ο Κένταυρος Χείρων ενώνει την έλλογη ανθρώπινη φύση με τη ζωική ενέργεια, στρέφοντας το βέλος της συνείδησης κατευθείαν στον πυρήνα του Γαλαξία.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΣΟΦΙΑΣ: Η άμεση ακτινοβολία του Διός Πατρός προς την ανώτερη φιλοσοφική γνώση.",
    isopsephyWord: "ΤΟΞΟΤΗΣ",
    isopsephyValue: 1008,
    isopsephyBreakdown: "Τ(300) + Ο(70) + Ξ(60) + Ο(70) + Τ(300) + Η(8) + Σ(200) = 1008"
  },
  {
    id: "capricorn",
    name: "Αιγόκερως",
    ancientName: "Αἰγόκερως (Capricorn)",
    symbol: "♑",
    element: "Γη",
    quality: "Παρορμητικό (Κινητό)",
    rulingGod: "Κρόνος & Παν",
    rulingPlanet: "Κρόνος",
    degrees: "270° – 300°",
    annualDates: "22 Δεκεμβρίου – 19 Ιανουαρίου",
    annualMeaning: "Χειμερινό Ηλιοστάσιο. Η «Πύλη των Θεών». Γέννηση του Αήττητου Ηλίου, ανάβαση της ψυχής στην κορυφή του όρους.",
    atticMonthMatch: "Ποσειδεών – Γαμηλιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "4.160 μ.κ.χ. (μ.Χ.) – 6.320 μ.κ.χ. (μ.Χ.) [ή 21.760 π.κ.χ. (π.Χ.) – 19.600 π.κ.χ. (π.Χ.)]",
    precessionOrder: 10,
    greatAgeArchetype: "Εποχή του Αιγοκέρωτος / Πύλη των Θεών / Κρόνος & Χρυσή Τάξη",
    greatAgeHistory: "Η εποχή της μέγιστης παγετώδους περιόδου, όπου η επιβίωση απαιτούσε απόλυτη πειθαρχία, οργάνωση, ιεραρχία και αντοχή. Ιεροί χοροί του Πανός και μύηση στα μυστήρια του βράχου και του όρους.",
    theologicalConnection: "Στον Πλάτωνα και τον Πορφύριο, ο Αιγόκερως είναι η Νότια Πύλη του Ουρανού, από την οποία οι ελευθερωμένες ψυχές ανεβαίνουν στον τόπο των Αθανάτων Θεών.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΚΥΡΙΑΡΧΙΑΣ: Η κατάκτηση της ύλης και η ανάβαση της ψυχής στον ύψιστο θρόνο της αιωνιότητας.",
    isopsephyWord: "ΑΙΓΟΚΕΡΩΣ",
    isopsephyValue: 1209,
    isopsephyBreakdown: "Α(1) + Ι(10) + Γ(3) + Ο(70) + Κ(20) + Ε(5) + Ρ(100) + Ω(800) + Σ(200) = 1209"
  },
  {
    id: "aquarius",
    name: "Υδροχόος",
    ancientName: "Ὑδροχόος (Aquarius)",
    symbol: "♒",
    element: "Αήρ",
    quality: "Σταθερό",
    rulingGod: "Ουρανός, Κρόνος & Προμηθεύς (Γανυμήδης)",
    rulingPlanet: "Ουρανός / Κρόνος",
    degrees: "300° – 330°",
    annualDates: "20 Ιανουαρίου – 18 Φεβρουαρίου",
    annualMeaning: "Χειμερινές βροχές, έκχυση του ουράνιου νέκταρος, πνευματική ανανέωση, καθαρμοί Θεογαμίων.",
    atticMonthMatch: "Γαμηλιών – Ανθεστηριών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "2.000 μ.κ.χ. (μ.Χ.) – 4.160 μ.κ.χ. (μ.Χ.)",
    precessionOrder: 11,
    greatAgeArchetype: "Εποχή του Υδροχόου / Προμηθεύς & Γανυμήδης / Έκχυση της Γνώσεως & Ενότης",
    greatAgeHistory: "Η ΤΡΕΧΟΥΣΑ ΝΕΑ ΕΠΟΧΗ του Μέγα Ενιαυτού, με εκκίνηση το Millennium (2000 μ.κ.χ. [μ.Χ.]). Χαρακτηρίζεται από την κατάργηση των τυφλών δογμάτων, την έκχυση της γνώσης (Ύδωρ της Σοφίας) σε όλη την ανθρωπότητα, την τεχνολογική και πνευματική ένωση, την κατανόηση των συμπαντικών κυμάτων και του Αιθέρα.",
    theologicalConnection: "Ο Υδροχόος είναι ο Γανυμήδης που προσφέρει το νέκταρ των Θεών στους ανθρώπους ή ο Προμηθέας που φέρνει το ουράνιο πυρ της νόησης. Συμβολίζει την αδελφοσύνη και την απελευθέρωση της ανθρωπότητας.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΟΥ ΠΝΕΥΜΑΤΙΚΟΥ ΥΔΑΤΟΣ: Η απεριόριστη ροή της θείας γνώσεως του Διός προς όλα τα όντα.",
    isopsephyWord: "ΥΔΡΟΧΟΟΣ",
    isopsephyValue: 1514,
    isopsephyBreakdown: "Υ(400) + Δ(4) + Ρ(100) + Ο(70) + Χ(600) + Ο(70) + Ο(70) + Σ(200) = 1514"
  },
  {
    id: "pisces",
    name: "Ιχθύες",
    ancientName: "Ἰχθύες (Pisces)",
    symbol: "♓",
    element: "Ύδωρ",
    quality: "Μεταβλητό (Δίσωμο)",
    rulingGod: "Ποσειδών & Ζευς",
    rulingPlanet: "Ποσειδών / Δίας",
    degrees: "330° – 360°",
    annualDates: "19 Φεβρουαρίου – 20 Μαρτίου",
    annualMeaning: "Τέλος του χειμώνα, προετοιμασία για την άνοιξη, Ανθεστήρια (γιορτή λουλουδιών και ψυχών), διάλυση παλαιών μορφών.",
    atticMonthMatch: "Ανθεστηριών – Ελαφηβολιών",
    greatAgeYears: "2.160 Έτη",
    greatAgeSpan: "160 π.κ.χ. (π.Χ.) – 2.000 μ.κ.χ. (μ.Χ.)",
    precessionOrder: 12,
    greatAgeArchetype: "Εποχή των Ιχθύων / Πίστις, Αυταπάρνηση, Ωκεάνιος Συγχώνευση & ΙΧΘΥΣ",
    greatAgeHistory: "Η ιστορική εποχή από το 160 π.κ.χ. (π.Χ.) έως το 2000 μ.κ.χ. (μ.Χ.). Ο Ιησούς Χριστός γεννήθηκε στο 1 μ.κ.χ. (μ.Χ.), δηλαδή στο 160ό έτος Μετά Ιχθύος (2° 13' 20'' των Ιχθύων). Κυριαρχία του συμβόλου του Ιχθύος (ΙΧΘΥΣ = Ιησούς Χριστός Θεού Υιός Σωτήρ = 1219), διάδοση των παγκόσμιων θρησκειών πίστεως, ωκεάνιες εξερευνήσεις, άνοδος του μυστικισμού.",
    theologicalConnection: "Οι δύο Ιχθύες συνδέονται με χρυσό δεσμό: ο ένας κολυμπά προς τον ουρανό και ο άλλος προς την ύλη. Συμβολίζουν τη λύτρωση, τη συμπόνια και την ολοκλήρωση ενός πλήρους κύκλου 25.920 ετών.",
    zoDiaEtymology: "ΖΩΗ ΔΙΑ ΤΗΣ ΣΥΜΠΟΝΙΑΣ: Η διάλυση των ορίων του εγώ μέσα στον ωκεανό της θείας αγάπης του Διός.",
    isopsephyWord: "ΙΧΘΥΕΣ",
    isopsephyValue: 1224,
    isopsephyBreakdown: "Ι(10) + Χ(600) + Θ(9) + Υ(400) + Ε(5) + Σ(200) = 1224"
  }
];

export interface GreatYearCalculationResult {
  year: number;
  isBCE: boolean;
  greatAge: ZodiacSignData;
  yearInCurrentAge: number; // e.g. 26 for 2026 AD in Aquarius
  yearsRemainingInAge: number; // e.g. 2134 for 2026 AD
  progressPercent: number; // 0 to 100% within the 2160-year age
  degreeInAgeExact: number; // 0 to 30 degrees decimal (e.g. 0.36111)
  degrees: number; // 0..29
  minutes: number; // 0..59
  seconds: number; // 0..59
  formattedDegrees: string; // e.g. "0° 21' 40''"
  decanNumber: 1 | 2 | 3;
  decanDescription: string; // "1ος Δεκανός (0° – 10°)"
  precessionalDegreeTotal: number; // 0 to 360 total Great Year
  historicalChristRelationship: string;
  astronomicalEraNotes: string;
}

export function calculateGreatYearEra(inputYear: number): GreatYearCalculationResult {
  // BASELINE SYNCHRONIZATION:
  // Age of Aquarius begins at 2000 CE (Millennium).
  // Age of Pisces begins at 160 BCE (-160) and ends at 2000 CE (2160 years duration).
  // Year 1 CE is the 160th year into Pisces (160 Μετά Ιχθύος).
  // Year 2026 CE is the 26th year into Aquarius (2026 - 2000 = 26 έτος Υδροχόου).
  
  // Precession moves retrograde:
  // Index 0: Aquarius (2000 CE to 4160 CE)
  // Index 1: Capricorn (4160 CE to 6320 CE)
  // Index 2: Sagittarius (6320 CE to 8480 CE)
  // Index 3: Scorpio (8480 CE to 10640 CE)
  // Index 4: Libra (10640 CE to 12800 CE)
  // Index 5: Virgo (12800 CE to 14960 CE)
  // Index 6: Leo (14960 CE to 17120 CE)
  // Index 7: Cancer (17120 CE to 19280 CE)
  // Index 8: Gemini (19280 CE to 21440 CE)
  // Index 9: Taurus (21440 CE to 23600 CE)
  // Index 10: Aries (23600 CE to 25760 CE)
  // Index 11: Pisces (25760 CE to 27920 CE / 160 BCE to 2000 CE)

  const signOrderFromAquarius = [
    "aquarius",   // 0: 2000 to 4160
    "capricorn",  // 1: 4160 to 6320
    "sagittarius",// 2: 6320 to 8480
    "scorpio",    // 3: 8480 to 10640
    "libra",      // 4: 10640 to 12800
    "virgo",      // 5: 12800 to 14960
    "leo",        // 6: 14960 to 17120
    "cancer",     // 7: 17120 to 19280
    "gemini",     // 8: 19280 to 21440
    "taurus",     // 9: 21440 to 23600
    "aries",      // 10: 23600 to 25760 (or -2320 to -160)
    "pisces"      // 11: -160 to 2000
  ];

  const cycleLength = 25920;
  const ageLength = 2160;

  // Offset from 2000 CE (Age of Aquarius start)
  const offsetFrom2000 = inputYear - 2000;
  const normalizedCyclePos = ((offsetFrom2000 % cycleLength) + cycleLength) % cycleLength;

  const ageIndex = Math.floor(normalizedCyclePos / ageLength);
  const yearsIntoAge = normalizedCyclePos % ageLength;
  const yearInCurrentAge = yearsIntoAge; // 0-based or 1-based display
  const yearsRemainingInAge = ageLength - yearsIntoAge;
  const progressPercent = (yearsIntoAge / ageLength) * 100;

  const signId = signOrderFromAquarius[ageIndex % 12];
  const foundSign = ZODIAC_SIGNS_DATA.find((s) => s.id === signId) || ZODIAC_SIGNS_DATA[0];

  // Exact Degree Calculation: 2160 years = 30 degrees => 1 degree = 72 years
  const degreeInAgeExact = (yearsIntoAge / ageLength) * 30; // 0 to 30
  const degInt = Math.floor(degreeInAgeExact);
  const remainderMinutes = (degreeInAgeExact - degInt) * 60;
  const minInt = Math.floor(remainderMinutes);
  const secInt = Math.round((remainderMinutes - minInt) * 60);

  // Decan (10 degrees each, 720 years)
  const decanNum: 1 | 2 | 3 = degInt < 10 ? 1 : degInt < 20 ? 2 : 3;
  const decanDescription = `${decanNum}ος Δεκανός (${(decanNum - 1) * 10}° – ${decanNum * 10}°)`;

  const formattedDegrees = `${degInt}° ${minInt.toString().padStart(2, "0")}' ${secInt.toString().padStart(2, "0")}''`;
  const precessionalDegreeTotal = +((normalizedCyclePos / cycleLength) * 360).toFixed(2);

  // Historical insight regarding Jesus & Pisces
  let christRel = "";
  if (inputYear === 2026) {
    christRel = "Στο έτος 2026 μ.κ.χ. (μ.Χ.) διανύουμε το 26ο έτος της Εποχής του Υδροχόου. Επειδή η μετάβαση στον Υδροχόο έγινε το 2000 μ.κ.χ. (μ.Χ.), η Εποχή των Ιχθύων (2.160 έτη) διήρκεσε από το 160 π.κ.χ. (π.Χ.) έως το 2000 μ.κ.χ. (μ.Χ.). Άρα ο Ιησούς Χριστός (1 μ.κ.χ. [μ.Χ.]) γεννήθηκε στο 160ό έτος της Εποχής των Ιχθύων (160 Μετά Ιχθύος / 2° 13' 20'' Ιχθύων).";
  } else if (inputYear >= 2000) {
    christRel = `Εποχή Υδροχόου (${inputYear - 2000}ο έτος Υδροχόου). Ο Ιησούς Χριστός γεννήθηκε στο 160ό έτος της προηγούμενης Εποχής των Ιχθύων (160 Μετά Ιχθύος).`;
  } else if (inputYear >= -160 && inputYear < 2000) {
    const yearPisces = inputYear - (-160);
    christRel = `Εποχή των Ιχθύων (${yearPisces}ο έτος Ιχθύων). Ο Ιησούς Χριστός (1 μ.κ.χ. [μ.Χ.]) αντιστοιχεί στο 160ό έτος της Εποχής αυτής.`;
  } else {
    christRel = `Προγενέστερη Εποχή του Μεγάλου Ενιαυτού: ${foundSign.name} (${foundSign.greatAgeSpan}).`;
  }

  let notes = "";
  if (inputYear >= 2000 && inputYear <= 2050) {
    notes = `Βρισκόμαστε στην αυγή του Υδροχόου (${yearsIntoAge}ο έτος). Ακριβής θέση: ${formattedDegrees} του Υδροχόου στον 1ο Δεκανό (0°–10°).`;
  } else if (inputYear > 2050 && inputYear <= 4160) {
    notes = `Πλήρης άνθηση της Εποχής του Υδροχόου. Απομένουν ${yearsRemainingInAge} έτη έως την Εποχή του Αιγοκέρωτος (4.160 μ.κ.χ. [μ.Χ.]).`;
  } else if (inputYear >= -160 && inputYear < 2000) {
    notes = `Εποχή των Ιχθύων (160 π.κ.χ. [π.Χ.] – 2000 μ.κ.χ. [μ.Χ.]). Σημείο εαρινής ισημερίας στον αστερισμό των Ιχθύων.`;
  } else {
    notes = `Ιστορικός/Αρχετυπικός Κύκλος της Εποχής: ${foundSign.greatAgeArchetype} (${foundSign.greatAgeSpan}).`;
  }

  return {
    year: inputYear,
    isBCE: inputYear < 0,
    greatAge: foundSign,
    yearInCurrentAge: yearsIntoAge,
    yearsRemainingInAge,
    progressPercent: +progressPercent.toFixed(2),
    degreeInAgeExact: +degreeInAgeExact.toFixed(4),
    degrees: degInt,
    minutes: minInt,
    seconds: secInt,
    formattedDegrees,
    decanNumber: decanNum,
    decanDescription,
    precessionalDegreeTotal,
    historicalChristRelationship: christRel,
    astronomicalEraNotes: notes
  };
}
