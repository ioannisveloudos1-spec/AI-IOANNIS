import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Zap,
  Target,
  Clock,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  Flame,
  Star,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { calculateWordIsopsephy, calculatePythmen, numberToGreekNumeral } from "../utils/isopsephy";
import { NumberingSystem } from "../types";

type GameMode = "quiz" | "time_attack" | "target_puzzle" | "pythmen";

interface Question {
  id: string;
  type: "word_to_value" | "value_to_word" | "isopsephy_pair" | "pythmen";
  prompt: string;
  subPrompt?: string;
  correctAnswer: string | number;
  options: (string | number)[];
  explanation: string;
  hint?: string;
}

interface TargetCard {
  id: string;
  word: string;
  value: number;
}

// Rich pool of classical, philosophical, biblical and mythological Greek words
const GREEK_WORDS_DATABASE = [
  { word: "ΘΕΟΣ", value: 284, category: "Θεολογία" },
  { word: "ΑΓΑΠΗ", value: 93, category: "Αρετή" },
  { word: "ΣΟΦΙΑ", value: 781, category: "Φιλοσοφία" },
  { word: "ΛΟΓΟΣ", value: 373, category: "Φιλοσοφία" },
  { word: "ΦΩΣ", value: 1500, category: "Κοσμολογία" },
  { word: "ΖΩΗ", value: 815, category: "Ύπαρξη" },
  { word: "ΨΥΧΗ", value: 1708, category: "Φιλοσοφία" },
  { word: "ΝΟΥΣ", value: 720, category: "Φιλοσοφία" },
  { word: "ΗΛΙΟΣ", value: 318, category: "Αστρονομία" },
  { word: "ΣΕΛΗΝΗ", value: 301, category: "Αστρονομία" },
  { word: "ΓΗ", value: 11, category: "Κοσμολογία" },
  { word: "ΟΥΡΑΝΟΣ", value: 891, category: "Κοσμολογία" },
  { word: "ΑΡΜΟΝΙΑ", value: 232, category: "Μουσική/Μαθηματικά" },
  { word: "ΚΟΣΜΟΣ", value: 600, category: "Κοσμολογία" },
  { word: "ΑΛΗΘΕΙΑ", value: 64, category: "Φιλοσοφία" },
  { word: "ΔΙΚΑΙΟΣΥΝΗ", value: 749, category: "Αρετή" },
  { word: "ΑΡΕΤΗ", value: 419, category: "Αρετή" },
  { word: "ΕΙΡΗΝΗ", value: 183, category: "Αρετή" },
  { word: "ΧΑΡΑ", value: 702, category: "Συναίσθημα" },
  { word: "ΕΛΠΙΣ", value: 325, category: "Αρετή" },
  { word: "ΠΙΣΤΙΣ", value: 800, category: "Αρετή" },
  { word: "ΔΙΑΣ", value: 215, category: "Μυθολογία" },
  { word: "ΖΕΥΣ", value: 612, category: "Μυθολογία" },
  { word: "ΑΘΗΝΑ", value: 79, category: "Μυθολογία" },
  { word: "ΑΠΟΛΛΩΝ", value: 1061, category: "Μυθολογία" },
  { word: "ΕΡΜΗΣ", value: 353, category: "Μυθολογία" },
  { word: "ΑΡΤΕΜΙΣ", value: 656, category: "Μυθολογία" },
  { word: "ΔΗΜΗΤΗΡ", value: 461, category: "Μυθολογία" },
  { word: "ΗΣΤΙΑ", value: 519, category: "Μυθολογία" },
  { word: "ΠΟΣΕΙΔΩΝ", value: 1219, category: "Μυθολογία" },
  { word: "ΑΙΑΣ", value: 212, category: "Ήρωες" },
  { word: "ΙΩΑΝΝΗΣ", value: 1119, category: "Ονόματα" },
  { word: "ΙΗΣΟΥΣ", value: 888, category: "Θεολογία" },
  { word: "ΧΡΙΣΤΟΣ", value: 1480, category: "Θεολογία" },
  { word: "ΠΑΤΗΡ", value: 489, category: "Θεολογία" },
  { word: "ΥΙΟΣ", value: 680, category: "Θεολογία" },
  { word: "ΠΝΕΥΜΑ", value: 576, category: "Θεολογία" },
  { word: "ΑΓΙΟΣ", value: 284, category: "Θεολογία" },
  { word: "ΝΑΟΣ", value: 321, category: "Αρχιτεκτονική" },
  { word: "ΠΥΡ", value: 580, category: "Στοιχεία" },
  { word: "ΥΔΩΡ", value: 1504, category: "Στοιχεία" },
  { word: "ΑΗΡ", value: 109, category: "Στοιχεία" },
  { word: "ΑΙΘΗΡ", value: 138, category: "Στοιχεία" },
  { word: "ΜΟΝΑΣ", value: 361, category: "Πυθαγόρεια" },
  { word: "ΔΥΑΣ", value: 605, category: "Πυθαγόρεια" },
  { word: "ΤΡΙΑΣ", value: 611, category: "Πυθαγόρεια" },
  { word: "ΤΕΤΡΑΚΤΥΣ", value: 1256, category: "Πυθαγόρεια" },
  { word: "ΔΕΚΑΣ", value: 230, category: "Πυθαγόρεια" },
];

const RANKS = [
  { level: 1, title: "Μαθητευόμενος", minXp: 0, icon: BookMarkedIcon },
  { level: 2, title: "Ισοψηφιστής", minXp: 100, icon: Zap },
  { level: 3, title: "Αριθμογνώστης", minXp: 300, icon: Brain },
  { level: 4, title: "Πυθαγόρειος", minXp: 600, icon: Shield },
  { level: 5, title: "Μύστης Δελφών", minXp: 1000, icon: Star },
  { level: 6, title: "Μέγας Αρχιτέκτων 2368", minXp: 1800, icon: Trophy },
];

function BookMarkedIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Award className="w-5 h-5" {...(props as Record<string, unknown>)} />;
}

export const GameTab: React.FC = () => {
  const [mode, setMode] = useState<GameMode>("quiz");
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Time Attack State
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimeAttackActive, setIsTimeAttackActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Current Question State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const totalQuizQuestions = 10;

  // Target Puzzle State
  const [targetNumber, setTargetNumber] = useState<number>(666);
  const [puzzleCards, setPuzzleCards] = useState<TargetCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);

  // Web Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load Saved Stats
  useEffect(() => {
    try {
      const saved = localStorage.getItem("isopsephy_game_stats_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        setXp(parsed.xp || 0);
        setHighScore(parsed.highScore || 0);
        setBestStreak(parsed.bestStreak || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save Stats
  const saveStats = (newXp: number, newHighScore: number, newBestStreak: number) => {
    try {
      localStorage.setItem(
        "isopsephy_game_stats_v1",
        JSON.stringify({
          xp: newXp,
          highScore: newHighScore,
          bestStreak: newBestStreak,
        })
      );
    } catch {
      // ignore
    }
  };

  // Sound Synthesizer via Web Audio API (Chimes, Beeps, 432 Hz Pure)
  const playAudioFeedback = (type: "correct" | "wrong" | "levelup" | "click") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "correct") {
        // Celestial Chord: 432 Hz -> 540 Hz -> 648 Hz
        osc.type = "sine";
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(864, now + 0.3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === "wrong") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "levelup") {
        // Harp Arpeggio (432, 540, 648, 864 Hz)
        const freqs = [432, 540, 648, 864, 1080];
        freqs.forEach((f, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(f, now + idx * 0.08);
          g.gain.setValueAtTime(0.18, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.3);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // ignore audio errors
    }
  };

  // Generate Questions for Quiz, Time Attack, Pythmen
  const generateQuestion = (currentMode: GameMode): Question => {
    const randType = Math.random();
    const wordObj = GREEK_WORDS_DATABASE[Math.floor(Math.random() * GREEK_WORDS_DATABASE.length)];
    const wordIso = calculateWordIsopsephy(wordObj.word, 0, NumberingSystem.IONIAN);

    if (currentMode === "pythmen" || (currentMode === "quiz" && randType < 0.25)) {
      // Pythmen Question
      const correctRoot = wordIso.root;
      const opts = [correctRoot];
      while (opts.length < 4) {
        const fake = Math.floor(Math.random() * 9) + 1;
        if (!opts.includes(fake)) opts.push(fake);
      }
      opts.sort(() => Math.random() - 0.5);

      return {
        id: Math.random().toString(),
        type: "pythmen",
        prompt: `Ποιος είναι ο Πυθμένας (μονοψήφιος 1-9) της λέξης:`,
        subPrompt: `«${wordObj.word}» (Λεξάριθμος = ${wordIso.value})`,
        correctAnswer: correctRoot,
        options: opts,
        explanation: `Ο λεξάριθμος της λέξης ${wordObj.word} είναι ${wordIso.value}. Το άθροισμα των ψηφίων του ανάγεται στο: ${correctRoot}.`,
        hint: `Αθροίστε τα ψηφία του αριθμού ${wordIso.value} μέχρι να μείνει μονοψήφιος.`,
      };
    } else if (randType < 0.6) {
      // Word to Value Question
      const correctVal = wordIso.value;
      const opts: number[] = [correctVal];
      while (opts.length < 4) {
        // Generate realistic nearby distractors
        const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 10 : -10) + (Math.floor(Math.random() * 5) - 2);
        const fake = Math.max(10, correctVal + offset);
        if (!opts.includes(fake)) opts.push(fake);
      }
      opts.sort(() => Math.random() - 0.5);

      const formulaStr = wordIso.letters.map((l) => `${l.char}(${l.value})`).join(" + ");

      return {
        id: Math.random().toString(),
        type: "word_to_value",
        prompt: `Ποιος είναι ο Ιωνικός Λεξάριθμος της λέξης:`,
        subPrompt: `«${wordObj.word}»`,
        correctAnswer: correctVal,
        options: opts,
        explanation: `${formulaStr} = ${correctVal} (${numberToGreekNumeral(correctVal)}). Κατηγορία: ${wordObj.category}.`,
        hint: `Το πρώτο γράμμα είναι το ${wordObj.word[0]} (${wordIso.letters[0]?.value || 1}).`,
      };
    } else {
      // Value to Word Question
      const correctWord = wordObj.word;
      const opts: string[] = [correctWord];
      while (opts.length < 4) {
        const fakeObj = GREEK_WORDS_DATABASE[Math.floor(Math.random() * GREEK_WORDS_DATABASE.length)];
        if (!opts.includes(fakeObj.word)) opts.push(fakeObj.word);
      }
      opts.sort(() => Math.random() - 0.5);

      return {
        id: Math.random().toString(),
        type: "value_to_word",
        prompt: `Ποια ιερή λέξη αντιστοιχεί στον λεξάριθμο:`,
        subPrompt: `${wordIso.value} (${numberToGreekNumeral(wordIso.value)})`,
        correctAnswer: correctWord,
        options: opts,
        explanation: `Η λέξη ${correctWord} ισούται ακριβώς με ${wordIso.value}. Πυθμένας: ${wordIso.root}.`,
        hint: `Είναι λέξη με ${correctWord.length} γράμματα από την κατηγορία: ${wordObj.category}.`,
      };
    }
  };

  // Generate Target Puzzle
  const generateTargetPuzzle = () => {
    const targets = [666, 777, 888, 1000, 1119, 1200, 1480, 1500, 2000, 2368];
    const chosenTarget = targets[Math.floor(Math.random() * targets.length)];
    setTargetNumber(chosenTarget);

    // Pick 2-3 words that exactly sum to a sub-total or near target, and fill with other words
    const shuffled = [...GREEK_WORDS_DATABASE].sort(() => Math.random() - 0.5);
    const selected: TargetCard[] = [];

    // Let's create an exact or solvable subset
    for (let i = 0; i < 6; i++) {
      const item = shuffled[i];
      selected.push({
        id: `card-${i}-${Math.random()}`,
        word: item.word,
        value: item.value,
      });
    }

    setPuzzleCards(selected);
    setSelectedCards([]);
    setPuzzleSolved(false);
  };

  // Start new round / game
  const startNewGame = (selectedMode: GameMode = mode) => {
    setMode(selectedMode);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setQuestionCount(1);

    if (selectedMode === "target_puzzle") {
      generateTargetPuzzle();
    } else if (selectedMode === "time_attack") {
      setTimeLeft(60);
      setIsTimeAttackActive(true);
      setCurrentQuestion(generateQuestion("time_attack"));
    } else {
      setIsTimeAttackActive(false);
      setCurrentQuestion(generateQuestion(selectedMode));
    }
  };

  // Time Attack Timer Effect
  useEffect(() => {
    if (isTimeAttackActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeAttackActive(false);
            playAudioFeedback("wrong");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimeAttackActive, timeLeft]);

  // Initial Load
  useEffect(() => {
    setCurrentQuestion(generateQuestion("quiz"));
  }, []);

  // Check Answer Handler
  const handleSelectOption = (option: string | number) => {
    if (isAnswerChecked && mode !== "time_attack") return;
    setSelectedAnswer(option);

    if (!currentQuestion) return;

    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      playAudioFeedback("correct");
      const multiplier = Math.min(4, Math.floor(streak / 3) + 1);
      const points = (mode === "time_attack" ? 150 : 100) * multiplier;
      const newScore = score + points;
      const newStreak = streak + 1;
      const newXp = xp + 25 * multiplier;
      const newBestStreak = Math.max(bestStreak, newStreak);
      const newHighScore = Math.max(highScore, newScore);

      setScore(newScore);
      setStreak(newStreak);
      setXp(newXp);
      setBestStreak(newBestStreak);
      setHighScore(newHighScore);
      saveStats(newXp, newHighScore, newBestStreak);

      if (mode === "time_attack") {
        // Quick auto-advance in time attack
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsAnswerChecked(false);
          setIsCorrect(null);
          setCurrentQuestion(generateQuestion("time_attack"));
        }, 400);
      }
    } else {
      playAudioFeedback("wrong");
      setStreak(0);
      if (mode === "time_attack") {
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsAnswerChecked(false);
          setIsCorrect(null);
          setCurrentQuestion(generateQuestion("time_attack"));
        }, 600);
      }
    }
  };

  // Advance to Next Question
  const handleNextQuestion = () => {
    playAudioFeedback("click");
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setQuestionCount((prev) => prev + 1);
    setCurrentQuestion(generateQuestion(mode));
  };

  // Target Puzzle Card Toggle
  const handleToggleCard = (cardId: string) => {
    playAudioFeedback("click");
    setSelectedCards((prev) => {
      const next = prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId];
      const sum = next.reduce((acc, id) => {
        const found = puzzleCards.find((c) => c.id === id);
        return acc + (found ? found.value : 0);
      }, 0);

      if (sum === targetNumber) {
        setPuzzleSolved(true);
        playAudioFeedback("levelup");
        const newScore = score + 500;
        const newXp = xp + 150;
        const newHighScore = Math.max(highScore, newScore);
        setScore(newScore);
        setXp(newXp);
        setHighScore(newHighScore);
        saveStats(newXp, newHighScore, bestStreak);
      } else {
        setPuzzleSolved(false);
      }

      return next;
    });
  };

  const puzzleCurrentSum = selectedCards.reduce((acc, id) => {
    const found = puzzleCards.find((c) => c.id === id);
    return acc + (found ? found.value : 0);
  }, 0);

  // Compute Current Rank
  const currentRank = [...RANKS].reverse().find((r) => xp >= r.minXp) || RANKS[0];
  const nextRank = RANKS.find((r) => r.minXp > xp);
  const xpProgressPercent = nextRank
    ? Math.min(100, Math.round(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100))
    : 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Top Header & Gamification Bar */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-[#17120e] via-[#241a12] to-[#17120e] border border-[#c89b3c]/50 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Title and Rank */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c89b3c] to-[#6e4e1b] p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#14100c] rounded-[14px] flex items-center justify-center">
                <Trophy className="w-7 h-7 text-[#ffd700] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#f5ecd8]">
                  Αρένα Ισοψηφίας & Παιχνίδι Γνώσεων
                </h2>
              </div>
              <p className="text-xs text-[#a89984] font-serif mt-0.5">
                Εξασκηθείτε στον ταχύ υπολογισμό λεξαρίθμων, κερδίστε XP και ανεβείτε στις βαθμίδες της ελληνικής σοφίας.
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            {/* Rank Badge */}
            <div className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#1f1811] border border-[#c89b3c]/40 flex items-center gap-2.5 shadow-md min-h-[44px]">
              <Star className="w-4 h-4 text-[#ffd700]" />
              <div className="text-left">
                <span className="text-[10px] text-[#8c7e6c] uppercase tracking-wider font-bold block">
                  Βαθμιδα
                </span>
                <span className="text-xs font-serif font-bold text-[#e6c670]">
                  {currentRank.title}
                </span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#1f1811] border border-[#c89b3c]/40 flex items-center gap-2.5 shadow-md min-h-[44px]">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <div className="flex items-center justify-between gap-3 text-[10px] text-[#8c7e6c] font-bold">
                  <span>{xp} XP</span>
                  {nextRank && <span>Επόμενο: {nextRank.minXp} XP</span>}
                </div>
                <div className="w-24 h-1.5 bg-[#2f2418] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="px-3.5 py-2 rounded-xl bg-[#1f1811] border border-[#c89b3c]/40 flex items-center gap-2 shadow-md min-h-[44px]">
              <Flame className={`w-4 h-4 ${streak > 0 ? "text-orange-400 animate-bounce" : "text-gray-500"}`} />
              <div className="text-left">
                <span className="text-[10px] text-[#8c7e6c] uppercase font-bold block">Σερι</span>
                <span className="text-xs font-mono font-bold text-[#f5ecd8]">{streak}x</span>
              </div>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playAudioFeedback("click");
              }}
              className="p-2.5 rounded-xl bg-[#1f1811] border border-[#c89b3c]/40 text-[#c89b3c] hover:text-[#ffd700] transition-all cursor-pointer shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={soundEnabled ? "Σίγαση Ήχων" : "Ενεργοποίηση Ήχων (432 Hz)"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#14100c] p-1.5 rounded-2xl border border-[#2a2016]">
        {[
          { id: "quiz" as GameMode, label: "🎯 Κλασικό Κουίζ", desc: "10 Ερωτήσεις με αναλυτική εξήγηση" },
          { id: "time_attack" as GameMode, label: "⚡ Μάχη 60s", desc: "Ταχύτητα & Combo multipliers" },
          { id: "target_puzzle" as GameMode, label: "🧩 Ισοψηφικός Στόχος", desc: "Συνδυασμός λέξεων για ακριβές άθροισμα" },
          { id: "pythmen" as GameMode, label: "🔮 Πυθμένας (1-9)", desc: "Μονοψήφια αναγωγή & ιεροί αριθμοί" },
        ].map((tab) => {
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => startNewGame(tab.id)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-serif text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] touch-manipulation text-center ${
                isActive
                  ? "bg-gradient-to-r from-[#382b1b] via-[#4a3a24] to-[#382b1b] text-[#ffd700] border border-[#c89b3c] shadow-lg shadow-[#c89b3c]/10"
                  : "text-[#a69680] hover:text-[#f5ecd8] hover:bg-[#1d1610]"
              }`}
            >
              <div>{tab.label}</div>
              <div className="text-[10px] font-sans font-normal opacity-70 mt-0.5 hidden sm:block">
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Game Mode 1, 2, 4: Questions Based (Quiz, Time Attack, Pythmen) */}
      {mode !== "target_puzzle" && currentQuestion && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#15110d] border border-[#33261a] shadow-2xl space-y-6 relative overflow-hidden">
          {/* Mode Specific Bar */}
          <div className="flex items-center justify-between border-b border-[#2a2016] pb-4">
            <div className="flex items-center gap-2">
              {mode === "time_attack" ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-600/50 text-red-300 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>ΧΡΟΝΟΣ: {timeLeft}s</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-serif text-[#c89b3c]">
                  <Layers className="w-4 h-4" />
                  <span>Ερώτηση {questionCount} από {totalQuizQuestions}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-serif text-[#a89984]">
                Σκορ: <strong className="text-[#ffd700] font-mono">{score}</strong>
              </div>
              <div className="text-xs font-serif text-[#a89984]">
                High Score: <strong className="text-[#e6c670] font-mono">{highScore}</strong>
              </div>
            </div>
          </div>

          {/* Time Attack Finished Overlay */}
          {mode === "time_attack" && !isTimeAttackActive && timeLeft === 0 && (
            <div className="p-8 rounded-xl bg-[#1c140d] border border-[#ffd700]/50 text-center space-y-4 animate-fadeIn">
              <Trophy className="w-12 h-12 text-[#ffd700] mx-auto animate-bounce" />
              <h3 className="text-xl font-serif font-bold text-[#f5ecd8]">
                Ο Χρόνος Τελείωσε!
              </h3>
              <p className="text-sm font-serif text-[#c89b3c]">
                Τελικό Σκορ: <strong className="text-2xl text-white font-mono">{score}</strong> | Καλύτερο Σερί: <strong className="text-white font-mono">{streak}x</strong>
              </p>
              <button
                onClick={() => startNewGame("time_attack")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b36a18] to-[#8a2216] text-white font-serif font-bold hover:scale-105 transition-all shadow-xl cursor-pointer min-h-[44px]"
              >
                ⚡ Παίξτε Ξανά (60s)
              </button>
            </div>
          )}

          {/* Question Prompt Area */}
          {(mode !== "time_attack" || isTimeAttackActive) && (
            <>
              <div className="text-center space-y-2 py-4">
                <span className="text-xs font-serif uppercase tracking-widest text-[#a89984]">
                  {currentQuestion.prompt}
                </span>
                <div className="text-2xl md:text-4xl font-serif font-extrabold text-[#ffd700] tracking-wide drop-shadow-md">
                  {currentQuestion.subPrompt}
                </div>
                {currentQuestion.hint && !isAnswerChecked && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#8c7e6c] font-serif pt-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <span>Υπόδειξη: {currentQuestion.hint}</span>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectOpt = option === currentQuestion.correctAnswer;

                  let btnStyle = "bg-[#1f1812] border-[#382b1d] text-[#e8dfd1] hover:bg-[#2c2219] hover:border-[#c89b3c]";

                  if (isAnswerChecked) {
                    if (isCorrectOpt) {
                      btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-900/30";
                    } else if (isSelected && !isCorrectOpt) {
                      btnStyle = "bg-red-950/80 border-red-500 text-red-200";
                    } else {
                      btnStyle = "bg-[#18130f] border-[#292016] text-[#6b5d4e] opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      disabled={isAnswerChecked && mode !== "time_attack"}
                      className={`p-4 rounded-xl border text-base font-serif font-bold transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[56px] touch-manipulation ${btnStyle}`}
                    >
                      <span className="text-left font-mono text-lg">{option}</span>
                      {isAnswerChecked && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Step (Quiz & Pythmen Mode) */}
              {isAnswerChecked && mode !== "time_attack" && (
                <div className="p-4 rounded-xl bg-[#1c1611] border border-[#c89b3c]/40 space-y-3 animate-fadeIn max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Εξαιρετικά! Σωστή Απάντηση (+100 XP)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 font-serif font-bold text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>Λανθασμένη επιλογή</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-serif text-[#d6c7b2] leading-relaxed">
                    {currentQuestion.explanation}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b36a18] to-[#8a2216] text-[#fff6e6] font-serif text-xs font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2 cursor-pointer min-h-[44px]"
                    >
                      <span>Επόμενη Ερώτηση</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Game Mode 3: Target Number Puzzle */}
      {mode === "target_puzzle" && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#15110d] border border-[#33261a] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-serif uppercase tracking-widest text-[#a89984]">
              Ισοψηφικός Στόχος
            </span>
            <div className="text-3xl md:text-5xl font-serif font-extrabold text-[#ffd700] tracking-wide">
              Στόχος = {targetNumber} ({numberToGreekNumeral(targetNumber)})
            </div>
            <p className="text-xs font-serif text-[#d6c7b2] max-w-xl mx-auto">
              Επιλέξτε κάρτες λέξεων για να φτάσετε <strong>ακριβώς</strong> το άθροισμα του στόχου.
            </p>
          </div>

          {/* Current Sum Status Display */}
          <div className="p-4 rounded-xl bg-[#1b1510] border border-[#3e3020] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-[#8c7e6c] uppercase font-bold block">
                  Τρεχον Αθροισμα
                </span>
                <span className="text-xl font-mono font-bold text-white">
                  {puzzleCurrentSum} / {targetNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-serif font-bold px-3 py-1.5 rounded-lg ${
                puzzleCurrentSum === targetNumber
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500"
                  : puzzleCurrentSum > targetNumber
                  ? "bg-red-950 text-red-300 border border-red-500"
                  : "bg-[#291f15] text-[#c89b3c]"
              }`}>
                {puzzleCurrentSum === targetNumber
                  ? "🎉 ΕΠΙΤΥΧΙΑ! ΑΚΡΙΒΕΣ ΑΘΡΟΙΣΜΑ!"
                  : puzzleCurrentSum > targetNumber
                  ? `Υπέρβαση κατά ${puzzleCurrentSum - targetNumber}`
                  : `Απομένουν ${targetNumber - puzzleCurrentSum}`}
              </span>

              <button
                onClick={() => setSelectedCards([])}
                className="p-2 rounded-lg bg-[#291f15] text-[#a89984] hover:text-white transition-all text-xs font-serif cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Καθαρισμός Επιλογών"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Puzzle Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto">
            {puzzleCards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              return (
                <button
                  key={card.id}
                  onClick={() => handleToggleCard(card.id)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer min-h-[70px] touch-manipulation flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-gradient-to-br from-[#4a371c] to-[#2c2010] border-[#ffd700] text-[#ffd700] shadow-lg shadow-amber-900/30 scale-105 ring-2 ring-yellow-400/30"
                      : "bg-[#1a140f] border-[#312519] text-[#e8dfd1] hover:bg-[#231a13] hover:border-[#c89b3c]"
                  }`}
                >
                  <span className="font-serif font-bold text-base">{card.word}</span>
                  <span className="font-mono text-xs text-[#a89984]">+{card.value}</span>
                </button>
              );
            })}
          </div>

          {/* Solved Banner */}
          {puzzleSolved && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-center space-y-2 animate-bounce max-w-md mx-auto">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-serif font-bold text-emerald-200 text-sm">
                Μπράβο! Λύσατε τον Ισοψηφικό Στόχο (+500 XP)!
              </div>
              <button
                onClick={generateTargetPuzzle}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-serif font-bold hover:bg-emerald-600 transition-all cursor-pointer min-h-[44px]"
              >
                Επόμενος Στόχος
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ranks & Achievements Overview Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#14100c] border border-[#2e2318] space-y-4">
        <h3 className="font-serif font-bold text-sm text-[#e6c670] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#c89b3c]" />
          Βαθμίδες Μύησης & Επιτεύγματα
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {RANKS.map((r) => {
            const isUnlocked = xp >= r.minXp;
            const Icon = r.icon;
            return (
              <div
                key={r.level}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isUnlocked
                    ? "bg-[#1f1710] border-[#c89b3c] text-[#f5ecd8]"
                    : "bg-[#110e0b] border-[#221a12] text-[#5e5142] opacity-50"
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${isUnlocked ? "text-[#ffd700]" : "text-[#4a3e30]"}`} />
                <div className="text-xs font-serif font-bold">{r.title}</div>
                <div className="text-[10px] font-mono text-[#8c7e6c]">{r.minXp} XP</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
