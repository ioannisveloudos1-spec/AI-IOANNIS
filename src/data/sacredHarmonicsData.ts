export interface SacredRepdigitMatch {
  number: number;
  wordOrFormula: string;
  letters: string[];
  breakdown: string;
  meaning: string;
  sourcePool: string;
  isExactKnownWord?: boolean;
}

export const SACRED_VOWELS = [
  { letter: "Α", value: 1, name: "Άλφα", planet: "Σελήνη", element: "Αρχή / Πνεύμα", sourceWord: "ΙΩ[Α]ΝΝΗΣ" },
  { letter: "Ε", value: 5, name: "Έψιλον", planet: "Ερμής", element: "Πέμπτη Ουσία / Αιθήρ", sourceWord: "Β[Ε]ΛΟΥΔΟΣ" },
  { letter: "Η", value: 8, name: "Ήτα", planet: "Αφροδίτη", element: "Ηλιακή Αρμονία / Οκτάβα", sourceWord: "ΙΩΑΝΝ[Η]Σ" },
  { letter: "Ι", value: 10, name: "Ιώτα", planet: "Ήλιος", element: "Τετρακτύς / Μονάδα Φωτός", sourceWord: "[Ι]ΩΑΝΝΗΣ" },
  { letter: "Ο", value: 70, name: "Όμικρον", planet: "Άρης", element: "Κύκλος / Ουρανός", sourceWord: "ΒΕΛ[Ο]ΥΔ[Ο]Σ" },
  { letter: "Υ", value: 400, name: "Ύψιλον", planet: "Ζεύς", element: "Ύψος / Πύρινο Ύδωρ", sourceWord: "ΒΕΛΟ[Υ]ΔΟΣ" },
  { letter: "Ω", value: 800, name: "Ωμέγα", planet: "Κρόνος", element: "Τέλος / Αιωνιότητα", sourceWord: "Ι[Ω]ΑΝΝΗΣ" },
];

export const SACRED_REPDIGITS_SERIES: SacredRepdigitMatch[] = [
  {
    number: 111,
    wordOrFormula: "ΟΛΙΑ",
    letters: ["Ο", "Λ", "Ι", "Α"],
    breakdown: "Ο(70) + Λ(30) + Ι(10) + Α(1) = 111",
    meaning: "Η πρώτη τριπλή μονάδα (111). Εναλλακτικά: ΝΑΙΝ = Ν(50)+Α(1)+Ι(10)+Ν(50)=111, ΕΒΔΕΝ = 111.",
    sourcePool: "Ο, Λ από ΒΕΛΟΥΔΟΣ | Ι, Α από ΙΩΑΝΝΗΣ",
    isExactKnownWord: true,
  },
  {
    number: 222,
    wordOrFormula: "ΗΔΙΣ / ΣΙΗΔ",
    letters: ["Η", "Δ", "Ι", "Σ"],
    breakdown: "Η(8) + Δ(4) + Ι(10) + Σ(200) = 222",
    meaning: "Από τη ρίζα «ἡδύς/ἡδίστη» (γλυκύτητα, ευδαιμονία). Εναλλακτικά: ΒΑΣΙΔΕ = Β(2)+Α(1)+Σ(200)+Ι(10)+Δ(4)+Ε(5)=222.",
    sourcePool: "Η, Ι, Σ από ΙΩΑΝΝΗΣ | Δ από ΒΕΛΟΥΔΟΣ",
    isExactKnownWord: true,
  },
  {
    number: 333,
    wordOrFormula: "ΣΟΛΙΕΗ (ΗΛΙΟΣ+Ε)",
    letters: ["Σ", "Ο", "Λ", "Ι", "Ε", "Η"],
    breakdown: "Σ(200) + Ο(70) + Λ(30) + Ι(10) + Ε(5) + Η(8) = 333",
    meaning: "Ηλιακή εκπομπή και φωτεινή τριάδα (3×111). Εναλλακτικά: ΣΟΝΗΕ = Σ(200)+Ο(70)+Ν(50)+Η(8)+Ε(5)=333, ΣΟΝΙΒΑ = 333.",
    sourcePool: "Σ, Ι, Η από ΙΩΑΝΝΗΣ | Ο, Λ, Ε από ΒΕΛΟΥΔΟΣ",
    isExactKnownWord: true,
  },
  {
    number: 444,
    wordOrFormula: "ΥΛΙΔ / ΥΛΕΗΑ",
    letters: ["Υ", "Λ", "Ι", "Δ"],
    breakdown: "Υ(400) + Λ(30) + Ι(10) + Δ(4) = 444",
    meaning: "Η ουσία της πρωταρχικής ύλης (Ύλη + Ιδέα). Εναλλακτικά: Υ(400)+Λ(30)+Ε(5)+Η(8)+Α(1) = 444, ΣΙΛΔΑΣ = 200+10+30+4+200 = 444.",
    sourcePool: "Υ, Λ, Δ από ΒΕΛΟΥΔΟΣ | Ι από ΙΩΑΝΝΗΣ",
    isExactKnownWord: true,
  },
  {
    number: 555,
    wordOrFormula: "ΕΥΛΟΝ / ΝΟΥΛΕ",
    letters: ["Ε", "Υ", "Λ", "Ο", "Ν"],
    breakdown: "Ε(5) + Υ(400) + Λ(30) + Ο(70) + Ν(50) = 555",
    meaning: "Από τη ρίζα «εὐλογέω / εὔλον» (ευλογία, ιερό ξύλο/φως). Εναλλακτικά: Υ(400)+Ο(70)+Ν(50)+Λ(30)+Δ(4)+Α(1) = 555.",
    sourcePool: "Ε, Υ, Λ, Ο από ΒΕΛΟΥΔΟΣ | Ν από ΙΩΑΝΝΗΣ",
    isExactKnownWord: true,
  },
  {
    number: 666,
    wordOrFormula: "ΙΑΝΕΥΣ",
    letters: ["Ι", "Α", "Ν", "Ε", "Υ", "Σ"],
    breakdown: "Ι(10) + Α(1) + Ν(50) + Ε(5) + Υ(400) + Σ(200) = 666",
    meaning: "Ο Ιανεύς (Ιανός), ο Αρχαίος Φύλακας των Πυλών, του Ουδού και του Χρόνου. Ενώνει το παρελθόν με το μέλλον.",
    sourcePool: "Ι, Α, Ν, Σ από ΙΩΑΝΝΗΣ | Ε, Υ από ΒΕΛΟΥΔΟΣ",
    isExactKnownWord: true,
  },
  {
    number: 777,
    wordOrFormula: "ΒΟΥΛΕΥΟΣ / ΥΣΟΝΝΕΒ",
    letters: ["Β", "Ο", "Ο", "Λ", "Ε", "Υ", "Σ"],
    breakdown: "Β(2) + Ο(70) + Ο(70) + Λ(30) + Ε(5) + Υ(400) + Σ(200) = 777",
    meaning: "Η θεϊκή βουλή και η επτάφωτος τελείωση (7×111). Εναλλακτικά: Υ(400)+Σ(200)+Ο(70)+Ν(50)+Ν(50)+Ε(5)+Β(2) = 777.",
    sourcePool: "Β, Ο, Ο, Λ, Ε, Υ, Σ εξ ολοκλήρου από ΒΕΛΟΥΔΟΣ",
    isExactKnownWord: true,
  },
  {
    number: 888,
    wordOrFormula: "ΙΗΣΟΥΣ / ΩΛΗΝ",
    letters: ["Ι", "Η", "Σ", "Ο", "Υ", "Σ", "Ω", "Λ", "Η", "Ν"],
    breakdown: "ΙΗΣΟΥΣ = 10+8+200+70+400+200 = 888 | ΩΛΗΝ = Ω(800)+Λ(30)+Η(8)+Ν(50) = 888",
    meaning: "Ο ΙΗΣΟΥΣ (Ογδοάς, Λόγος του Φωτός) και ο ΩΛΗΝ (ο αρχαιότερος ποιητής & υμνογράφος της ανθρωπότητας, αρχαιότερος του Ορφέα, πρώτος προφήτης & ιδρυτής του Μαντείου των Δελφών κατά τον Παυσανία).",
    sourcePool: "Ω, Λ, Η, Ν & Ι, Η, Σ, Ο, Υ, Σ σχηματίζονται πλήρως από το «ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ»",
    isExactKnownWord: true,
  },
  {
    number: 999,
    wordOrFormula: "ΩΟΟΝΗΑ",
    letters: ["Ω", "Ο", "Ο", "Ν", "Η", "Α"],
    breakdown: "Ω(800) + Ο(70) + Ο(70) + Ν(50) + Η(8) + Α(1) = 999",
    meaning: "Το Κοσμικό Ωόν (Ορφικό Αρχέγονο Αυγό) και η ολοκλήρωση της εννεάδας (9×111). Εναλλακτικά: Ω(800)+Ο(70)+Ν(50)+Λ(30)+Ι(10)+Η(8)+Δ(4)+Β(2)+Α(1)+...=999.",
    sourcePool: "Ω, Ν, Η, Α από ΙΩΑΝΝΗΣ | Ο, Ο από ΒΕΛΟΥΔΟΣ",
    isExactKnownWord: true,
  },
];
