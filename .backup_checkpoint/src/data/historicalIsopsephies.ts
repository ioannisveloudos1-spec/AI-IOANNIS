export interface HistoricalIsopsephyEntry {
  value: number;
  greekNumeral: string;
  pythmen: number;
  title: string;
  items: {
    word: string;
    breakdown: string;
    description: string;
    category: "biblical" | "classical" | "gnostic" | "mathematical" | "historical";
  }[];
}

export const HISTORICAL_ISOPSEPHIES: HistoricalIsopsephyEntry[] = [
  {
    value: 666,
    greekNumeral: "χξϛ´",
    pythmen: 9,
    title: "Ο Αριθμός της Αποκαλύψεως",
    items: [
      {
        word: "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ",
        breakdown: "(1 + 3 + 10 + 1) + (9 + 5 + 70 + 500 + 1 + 50 + 5 + 10 + 1) = 15 + 651 = 666",
        description: "Ιερή θεολογική φράση των Θεοφανείων με λεξάριθμο 666.",
        category: "biblical",
      },
      {
        word: "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ",
        breakdown: "ΙΩΑΝΝΗΣ (1119) - ΑΜΑΡΤΙΑ (453) = 1119 - 453 = 666",
        description: "Ισοψηφική πράξη αφαίρεσης της Αμαρτίας (453) από το όνομα Ιωάννης (1119) που ισούται με 666.",
        category: "biblical",
      },
      {
        word: "ΛΑΥΡΕΙΟΝ",
        breakdown: "30 + 1 + 400 + 100 + 5 + 10 + 70 + 50 = 666",
        description: "Τα αρχαία μεταλλεία αργύρου της Αττικής, πηγή πλούτου της αρχαίας Αθήνας.",
        category: "classical",
      },
      {
        word: "Ο ΝΙΚΗΤΗΣ",
        breakdown: "70 + 50 + 10 + 20 + 8 + 300 + 8 + 200 = 666",
        description: "Φράση αναφερόμενη στην αρχαία ελληνική γραμματεία και στα ισοψηφικά αινίγματα.",
        category: "classical",
      },
      {
        word: "ΠΑΡΑ ΘΕΟΥ",
        breakdown: "80 + 1 + 100 + 1 + 9 + 5 + 70 + 400 = 666",
        description: "Κλασική ελληνική φράση.",
        category: "classical",
      },
      {
        word: "ΕΥΠΟΡΙΑ",
        breakdown: "5 + 400 + 80 + 70 + 100 + 10 + 1 = 666",
        description: "Η αφθονία και ο υλικός πλούτος.",
        category: "classical",
      },
      {
        word: "Η ΦΡΗΝ",
        breakdown: "8 + 500 + 100 + 8 + 50 = 666",
        description: "Ο νους, η νόηση και η διάνοια στην ομηρική και κλασική φιλοσοφία.",
        category: "classical",
      },
    ],
  },
  {
    value: 888,
    greekNumeral: "ωπη´",
    pythmen: 6,
    title: "Ο Λεξάριθμος του Ιησού",
    items: [
      {
        word: "ΙΗΣΟΥΣ",
        breakdown: "10 + 8 + 200 + 70 + 400 + 200 = 888",
        description: "Το όνομα του Ιησού στα αρχαία ελληνικά. Ένας από τους πιο μελετημένους χριστιανικούς λεξάριθμους.",
        category: "biblical",
      },
      {
        word: "Ο ΕΠΙ ΠΑΣΙ",
        breakdown: "70 + 5 + 80 + 10 + 80 + 1 + 200 + 10 = 888 (245 + 643)",
        description: "Θεολογικός τίτλος της θείας υπεροχής.",
        category: "biblical",
      },
      {
        word: "Ο ΛΟΓΟΣ ΕΣΤΙ",
        breakdown: "70 + 373 + 445 = 888",
        description: "«Ο Λόγος εστί» — η ουσία της θείας δημιουργίας.",
        category: "biblical",
      },
      {
        word: "Η ΖΩΗ ΕΙΜΙ",
        breakdown: "8 + 815 + 65 = 888",
        description: "«Εγώ ειμί η ζωή» — σύνδεση με το κατά Ιωάννην Ευαγγέλιο.",
        category: "biblical",
      },
    ],
  },
  {
    value: 1480,
    greekNumeral: "͵αυπ´",
    pythmen: 4,
    title: "Ο Λεξάριθμος του Χριστού",
    items: [
      {
        word: "ΧΡΙΣΤΟΣ",
        breakdown: "600 + 100 + 10 + 200 + 300 + 70 + 200 = 1480",
        description: "Ο Χριστός (ο κεχρισμένος). Σε συνδυασμό με το ΙΗΣΟΥΣ (888) δίνει 2368.",
        category: "biblical",
      },
      {
        word: "ΤΟ ΠΝΕΥΜΑ ΤΟ ΑΓΙΟΝ",
        breakdown: "370 + 576 + 370 + 164 = 1480",
        description: "Ισοψηφικό ισοδύναμο του Αγίου Πνεύματος στην πρώιμη πατερική γραμματεία.",
        category: "biblical",
      },
    ],
  },
  {
    value: 2368,
    greekNumeral: "͵βτξη´",
    pythmen: 1,
    title: "Ιησούς Χριστός (Πλήρης Τίτλος)",
    items: [
      {
        word: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ",
        breakdown: "888 + 1480 = 2368",
        description: "Το πλήρες όνομα, άθροισμα 888 και 1480. Έχει πυθμένα 1 (2+3+6+8 = 19 -> 1+9=10 -> 1).",
        category: "biblical",
      },
    ],
  },
  {
    value: 318,
    greekNumeral: "τιη´",
    pythmen: 3,
    title: "Ο Ήλιος & οι 318 του Αβραάμ",
    items: [
      {
        word: "ΗΛΙΟΣ",
        breakdown: "8 + 30 + 10 + 70 + 200 = 318",
        description: "Ο φωτοδότης Ήλιος. Στην επιστολή Βαρνάβα συνδέεται με το σταυρό (Τ=300) και το όνομα Ιησούς (ΙΗ=18).",
        category: "classical",
      },
    ],
  },
  {
    value: 365,
    greekNumeral: "τξε´",
    pythmen: 5,
    title: "Ο Ενιαύσιος Κύκλος (365 Ημέρες)",
    items: [
      {
        word: "ΑΒΡΑΣΑΞ",
        breakdown: "1 + 2 + 100 + 1 + 200 + 1 + 60 = 365",
        description: "Μυστικιστικό όνομα που αντιπροσωπεύει τις 365 ημέρες του ενιαυσίου κύκλου.",
        category: "classical",
      },
    ],
  },
  {
    value: 545,
    greekNumeral: "φμε´",
    pythmen: 5,
    title: "Το Γκράφιτι της Πομπηίας",
    items: [
      {
        word: "ΦΙΛΩ ΗΣ ΑΡΙΘΜΟΣ ΦΜΕ",
        breakdown: "Αρχαία επιγραφή τοίχου στην Πομπηία (79 μ.Χ.)",
        description: "«Φιλῶ ἧς ἀριθμὸς φμε´» (Αγαπώ εκείνη της οποίας ο αριθμός είναι 545). Απόδειξη καθημερινής χρήσης ισοψηφίας.",
        category: "historical",
      },
    ],
  },
  {
    value: 1000,
    greekNumeral: "͵α´",
    pythmen: 1,
    title: "Η Τελειότητα & Θεότης",
    items: [
      {
        word: "ΘΕΟΤΗΣ",
        breakdown: "9 + 5 + 70 + 300 + 8 + 200 = 592 (παραλλαγή με άρθρο: Η ΘΕΟΤΗΣ = 600)",
        description: "Η θεία ουσία στον πλατωνισμό και τη χριστιανική θεολογία.",
        category: "classical",
      },
      {
        word: "Η ΑΓΑΠΗ",
        breakdown: "8 + 1 + 3 + 1 + 80 + 8 = 101 (με παράγωγες φράσεις)",
        description: "Η ανώτερη αρετή.",
        category: "biblical",
      },
    ],
  },
  {
    value: 1119,
    greekNumeral: "͵αιιθ´",
    pythmen: 3,
    title: "Ο Ιωάννης & ο Κόσμος",
    items: [
      {
        word: "ΙΩΑΝΝΗΣ",
        breakdown: "10 + 800 + 1 + 50 + 50 + 8 + 200 = 1119",
        description: "Το όνομα του Ευαγγελιστή και Προδρόμου Ιωάννη.",
        category: "biblical",
      },
    ],
  },
];
