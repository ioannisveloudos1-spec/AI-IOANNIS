// Pythagorean Monochord & Symbolic Isopsephy Audio Frequency Engine
// Maps isopsephic numbers and letter values to acoustic frequencies, Pythagorean ratios, and harmonic chords.

export interface AudioNoteInfo {
  char?: string;
  value: number;
  frequency: number;
  octaveFold: number;
  noteName: string;
  ratioName: string;
}

export interface PythagoreanFrequencyAnalysis {
  rawValue: number;
  fundamentalHz: number;
  exactUnfoldedHz: number;
  octaveDivisions: number;
  noteName: string;
  centsDeviation: number;
  
  // Monochord String division
  monochordStringFraction: string; // e.g. "2/3 (Πέμπτη / Διοξεία)"
  monochordRatioValue: number;
  monochordBridgePositionPercent: number; // 0-100% on the monochord string

  // Sacred intervals based on Fundamental
  harmonics: {
    unison: number;
    fourth: number;   // 4/3
    fifth: number;    // 3/2
    octave: number;   // 2/1
    golden: number;   // * 1.618034
    pythmenHz: number;
  };

  // Solfeggio & Pythmen
  pythmen: number;
  solfeggioHz: number;
  solfeggioName: string;
  
  // Melodic letter sequence
  letterNotes: AudioNoteInfo[];
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const GREEK_NOTE_NAMES = ["Ντο", "Ντο#", "Ρε", "Ρε#", "Μι", "Φα", "Φα#", "Σολ", "Σολ#", "Λα", "Λα#", "Σι"];

// 9 Sacred Solfeggio / Root Pythmen Frequencies
export const SOLFEGGIO_MAP: Record<number, { hz: number; name: string; meaning: string }> = {
  1: { hz: 174, name: "174 Hz - Θεμέλιο", meaning: "Αρχέγονη φυσική ισορροπία και σταθερότητα (Μονάς)" },
  2: { hz: 285, name: "285 Hz - Γεωμετρική Επαγωγή", meaning: "Αναγέννηση και ενεργειακή δομή (Δυάς)" },
  3: { hz: 396, name: "396 Hz - Απελευθέρωση", meaning: "Λύτρωση από φόβο, Τριάς και δημιουργική εκδήλωση" },
  4: { hz: 417, name: "417 Hz - Μεταβολή", meaning: "Διευκόλυνση θετικών αλλαγών, Τετρακτύς" },
  5: { hz: 528, name: "528 Hz - Χρυσή Μεταμόρφωση", meaning: "Συχνότητα της Αγάπης και Φυσικής Αρμονίας (Πεντάς / DNA)" },
  6: { hz: 639, name: "639 Hz - Σύνδεση & Ψυχογονία", meaning: "Αρμονία σχέσεων και ψυχική σύμπνοια (Εξάς / 216)" },
  7: { hz: 741, name: "741 Hz - Διαίσθηση & Αφύπνιση", meaning: "Πνευματική καθαρότητα και έκφραση (Επτάς / Παρθένος)" },
  8: { hz: 852, name: "852 Hz - Πνευματική Τάξη", meaning: "Επαναφορά στην κοσμική τάξη (Οκτάς / Αθηνά)" },
  9: { hz: 963, name: "963 Hz - Θεϊκό Φως & Τελείωση", meaning: "Σύνδεση με το Πρωταρχικό Φως και το Όλον (Εννεάς)" },
};

/**
 * Folds any number into the comfortable human auditory spectrum [110 Hz - 880 Hz]
 * using Pythagorean octave doublings / halvings (power of 2).
 */
export function foldToAudibleSpectrum(value: number, targetMin: number = 130, targetMax: number = 600): {
  foldedHz: number;
  octaveShift: number;
} {
  if (value <= 0) return { foldedHz: 432, octaveShift: 0 };

  let hz = value;
  let octaveShift = 0;

  // If too high, divide by 2
  while (hz > targetMax) {
    hz /= 2;
    octaveShift -= 1;
  }

  // If too low, multiply by 2
  while (hz < targetMin) {
    hz *= 2;
    octaveShift += 1;
  }

  return {
    foldedHz: Math.round(hz * 100) / 100,
    octaveShift,
  };
}

/**
 * Calculates MIDI note, Note name and cents deviation based on A4 reference (e.g. 432Hz or 440Hz)
 */
export function getMusicalNoteInfo(frequency: number, a4Reference: number = 432): {
  noteName: string;
  greekNoteName: string;
  octave: number;
  cents: number;
} {
  if (frequency <= 0) return { noteName: "A", greekNoteName: "Λα", octave: 4, cents: 0 };

  // MIDI number: 69 + 12 * log2(freq / a4Reference)
  const midi = 69 + 12 * (Math.log(frequency / a4Reference) / Math.log(2));
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);

  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;

  return {
    noteName: `${NOTE_NAMES[noteIndex]}${octave}`,
    greekNoteName: `${GREEK_NOTE_NAMES[noteIndex]}${octave}`,
    octave,
    cents,
  };
}

/**
 * Maps a frequency / number to Pythagorean Monochord string ratios (e.g. 1:1, 9:8, 4:3, 3:2, 2:1)
 */
export function getMonochordStringRatio(frequency: number, baseRef: number = 432): {
  fraction: string;
  ratioValue: number;
  bridgePercent: number;
} {
  if (frequency <= 0 || baseRef <= 0) {
    return { fraction: "1:1 (Τόνος / Ισοκράτημα)", ratioValue: 1.0, bridgePercent: 50 };
  }

  // Relative ratio normalized to [1, 2)
  let ratio = frequency / baseRef;
  while (ratio < 1) ratio *= 2;
  while (ratio >= 2) ratio /= 2;

  // Compare to classic Pythagorean ratios
  const pythRatios = [
    { ratio: 1.0, name: "1:1 (Ισοκράτημα - Unison)" },
    { ratio: 9 / 8, name: "9:8 (Μείζων Τόνος - Epogdoon)" },
    { ratio: 81 / 64, name: "81:64 (Πυθαγόρειος Δίτονος / Τρίτη)" },
    { ratio: 4 / 3, name: "4:3 (Διατεσσάρων / Τετάρτη)" },
    { ratio: 3 / 2, name: "3:2 (Διοξεία / Πέμπτη)" },
    { ratio: 27 / 16, name: "27:16 (Έκτη)" },
    { ratio: 243 / 128, name: "243:128 (Έβδομη)" },
    { ratio: 2.0, name: "2:1 (Διά Πασών - Οκτάβα)" },
  ];

  let closest = pythRatios[0];
  let minDiff = Infinity;

  for (const item of pythRatios) {
    const diff = Math.abs(ratio - item.ratio);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  // String bridge position: string length is inversely proportional to frequency
  // L = 1 / ratio, scaled to 0-100%
  const bridgePercent = Math.round((1 / ratio) * 1000) / 10;

  return {
    fraction: closest.name,
    ratioValue: Math.round(ratio * 10000) / 10000,
    bridgePercent,
  };
}

/**
 * Calculates complete Pythagorean Audio Analysis for an isopsephy number and its letters
 */
export function analyzePythagoreanFrequencies(
  totalValue: number,
  wordBreakdowns: {
    rawWord: string;
    value: number;
    letters: { char: string; originalChar?: string; value: number }[];
  }[],
  a4Base: number = 432
): PythagoreanFrequencyAnalysis {
  const { foldedHz, octaveShift } = foldToAudibleSpectrum(totalValue);
  const noteInfo = getMusicalNoteInfo(foldedHz, a4Base);
  const monochordInfo = getMonochordStringRatio(foldedHz, a4Base);

  // Pythmen root (1 to 9)
  let pythmen = 0;
  if (totalValue > 0) {
    let temp = totalValue;
    while (temp > 9) {
      temp = temp
        .toString()
        .split("")
        .reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    pythmen = temp;
  }
  if (pythmen < 1 || pythmen > 9) pythmen = 9;

  const solfeggio = SOLFEGGIO_MAP[pythmen] || SOLFEGGIO_MAP[9];

  // Harmonics
  const harmonics = {
    unison: foldedHz,
    fourth: Math.round((foldedHz * (4 / 3)) * 100) / 100,
    fifth: Math.round((foldedHz * (3 / 2)) * 100) / 100,
    octave: Math.round((foldedHz * 2) * 100) / 100,
    golden: Math.round((foldedHz * 1.6180339887) * 100) / 100,
    pythmenHz: solfeggio.hz,
  };

  // Letter by letter notes
  const letterNotes: AudioNoteInfo[] = [];
  for (const word of wordBreakdowns) {
    for (const l of word.letters) {
      if (l.value > 0) {
        const letterFold = foldToAudibleSpectrum(l.value, 180, 560);
        const lNote = getMusicalNoteInfo(letterFold.foldedHz, a4Base);
        const lRatio = getMonochordStringRatio(letterFold.foldedHz, a4Base);

        letterNotes.push({
          char: l.originalChar || l.char,
          value: l.value,
          frequency: letterFold.foldedHz,
          octaveFold: letterFold.octaveShift,
          noteName: `${lNote.greekNoteName} (${lNote.noteName})`,
          ratioName: lRatio.fraction,
        });
      }
    }
  }

  return {
    rawValue: totalValue,
    fundamentalHz: foldedHz,
    exactUnfoldedHz: totalValue,
    octaveDivisions: octaveShift,
    noteName: `${noteInfo.greekNoteName} (${noteInfo.noteName})`,
    centsDeviation: noteInfo.cents,
    monochordStringFraction: monochordInfo.fraction,
    monochordRatioValue: monochordInfo.ratioValue,
    monochordBridgePositionPercent: monochordInfo.bridgePercent,
    harmonics,
    pythmen,
    solfeggioHz: solfeggio.hz,
    solfeggioName: solfeggio.name,
    letterNotes,
  };
}

// ---------------------------------------------------------------------------------
// WEB AUDIO SYNTHESIZER CLASS
// ---------------------------------------------------------------------------------

export type SynthTimbre = "PURE_SINE" | "GOLDEN_BOWL" | "MONOCHORD_PLUCK" | "CELESTIAL_PAD" | "ANCIENT_LYRE";

export interface PythagoreanScaleNote {
  name: string;
  greekName: string;
  hz: number;
  ratio: string;
  ratioFraction: string;
  isokrati: string;
  mysticMeaning: string;
}

export const PYTHAGOREAN_OCTAVE: PythagoreanScaleNote[] = [
  { name: "C4", greekName: "ΝΤΟ", hz: 256, ratio: "1:1", ratioFraction: "1/1", isokrati: "Βασική / Τόνος", mysticMeaning: "Επιστημονικό C - Θεμέλιος Μονάς & Φυσική Αρμονία" },
  { name: "D4", greekName: "ΡΕ", hz: 288, ratio: "9:8", ratioFraction: "9/8", isokrati: "Επόγδοον (Τόνος)", mysticMeaning: "Μείζων Τόνος - Δυάς & Κίνηση" },
  { name: "E4", greekName: "ΜΙ", hz: 324, ratio: "81:64", ratioFraction: "81/64", isokrati: "Δίτονος (Τρίτη)", mysticMeaning: "Πυθαγόρειος Τρίτη - Τριάς & Δημιουργία" },
  { name: "F4", greekName: "ΦΑ", hz: 341.33, ratio: "4:3", ratioFraction: "4/3", isokrati: "Διατεσσάρων (Τετάρτη)", mysticMeaning: "Τετρακτύς - Η Ιερά Τετράς των στοιχείων" },
  { name: "G4", greekName: "ΣΟΛ", hz: 384, ratio: "3:2", ratioFraction: "3/2", isokrati: "Διοξεία (Πέμπτη)", mysticMeaning: "Χρυσή Πέμπτη - Ουράνιος Συντονισμός & Απόλλων" },
  { name: "A4", greekName: "ΛΑ", hz: 432, ratio: "27:16", ratioFraction: "27:16", isokrati: "Έκτη / Κοσμικό ΛΑ", mysticMeaning: "Κοσμικό ΛΑ 432 Hz - Συμπαντικός Κώδικας & Φυσικό Κούρδισμα" },
  { name: "B4", greekName: "ΣΙ", hz: 486, ratio: "243:128", ratioFraction: "243:128", isokrati: "Έβδομη", mysticMeaning: "Επτάς - Ιερά Μύηση & Πνευματική Ανάταση" },
  { name: "C5", greekName: "ΝΤΟ²", hz: 512, ratio: "2:1", ratioFraction: "2/1", isokrati: "Διά Πασών (Οκτάβα)", mysticMeaning: "Οκτάβα 512 Hz (Αντίστροφη ανάγνωση 215 = ΔΙΑΣ!)" },
];

class PythagoreanSynthesizer {
  private ctx: AudioContext | null = null;
  private activeNodes: { oscs: OscillatorNode[]; gains: GainNode[] }[] = [];
  private sequenceTimer: number | null = null;

  // Continuous generator nodes
  private continuousOsc: OscillatorNode | null = null;
  private continuousGain: GainNode | null = null;
  private continuousLimiter: DynamicsCompressorNode | null = null;

  // Binaural beats nodes
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Safe limiter to protect hearing and speakers
   */
  private createLimiter(ctx: AudioContext): DynamicsCompressorNode {
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, ctx.currentTime); // dB
    compressor.knee.setValueAtTime(6, ctx.currentTime);
    compressor.ratio.setValueAtTime(16, ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.currentTime);
    return compressor;
  }

  public stopAll() {
    this.stopContinuous();
    this.stopBinaural();
    if (this.sequenceTimer) {
      window.clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    if (this.ctx) {
      try {
        this.activeNodes.forEach(({ oscs, gains }) => {
          gains.forEach((g) => {
            try {
              g.gain.cancelScheduledValues(this.ctx!.currentTime);
              g.gain.linearRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.05);
            } catch {}
          });
          setTimeout(() => {
            oscs.forEach((o) => {
              try {
                o.stop();
                o.disconnect();
              } catch {}
            });
          }, 80);
        });
      } catch {}
      this.activeNodes = [];
    }
  }

  /**
   * Starts continuous real-time oscillator with safe acoustic limiter
   */
  public startContinuous(
    freq: number,
    waveType: OscillatorType = "sine",
    volume: number = 0.5
  ) {
    this.stopContinuous();
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const limiter = this.createLimiter(ctx);

    osc.type = waveType;
    osc.frequency.setValueAtTime(Math.max(10, Math.min(20000, freq)), now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), now + 0.05);

    osc.connect(gain);
    gain.connect(limiter);
    limiter.connect(ctx.destination);

    osc.start(now);

    this.continuousOsc = osc;
    this.continuousGain = gain;
    this.continuousLimiter = limiter;
  }

  /**
   * Updates frequency, waveform or volume of continuous generator smoothly without audio clicks
   */
  public updateContinuous(
    freq: number,
    waveType?: OscillatorType,
    volume?: number
  ) {
    if (!this.continuousOsc || !this.ctx) return;
    const now = this.ctx.currentTime;
    const clampedFreq = Math.max(10, Math.min(20000, freq));

    try {
      this.continuousOsc.frequency.cancelScheduledValues(now);
      this.continuousOsc.frequency.setValueAtTime(this.continuousOsc.frequency.value, now);
      this.continuousOsc.frequency.exponentialRampToValueAtTime(clampedFreq, now + 0.04);
    } catch {
      this.continuousOsc.frequency.setValueAtTime(clampedFreq, now);
    }

    if (waveType && this.continuousOsc.type !== waveType) {
      this.continuousOsc.type = waveType;
    }

    if (volume !== undefined && this.continuousGain) {
      const clampedVol = Math.max(0, Math.min(1, volume));
      try {
        this.continuousGain.gain.cancelScheduledValues(now);
        this.continuousGain.gain.setValueAtTime(this.continuousGain.gain.value, now);
        this.continuousGain.gain.linearRampToValueAtTime(clampedVol, now + 0.04);
      } catch {
        this.continuousGain.gain.setValueAtTime(clampedVol, now);
      }
    }
  }

  /**
   * Stops continuous generator smoothly
   */
  public stopContinuous() {
    if (this.continuousGain && this.continuousOsc && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.continuousGain.gain.cancelScheduledValues(now);
        this.continuousGain.gain.setValueAtTime(this.continuousGain.gain.value, now);
        this.continuousGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch {}
      const oldOsc = this.continuousOsc;
      setTimeout(() => {
        try {
          oldOsc.stop();
          oldOsc.disconnect();
        } catch {}
      }, 70);
    }
    this.continuousOsc = null;
    this.continuousGain = null;
    this.continuousLimiter = null;
  }

  /**
   * Starts Binaural Beats (Stereo separation: L = baseHz, R = baseHz + deltaHz)
   */
  public startBinaural(baseHz: number, deltaHz: number, volume: number = 0.5) {
    this.stopBinaural();
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();

    leftOsc.type = "sine";
    rightOsc.type = "sine";

    leftOsc.frequency.setValueAtTime(baseHz, now);
    rightOsc.frequency.setValueAtTime(baseHz + deltaHz, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(volume, now + 0.08);

    const merger = ctx.createChannelMerger(2);

    leftOsc.connect(merger, 0, 0); // Left ear
    rightOsc.connect(merger, 0, 1); // Right ear

    merger.connect(masterGain);
    masterGain.connect(ctx.destination);

    leftOsc.start(now);
    rightOsc.start(now);

    this.binauralLeftOsc = leftOsc;
    this.binauralRightOsc = rightOsc;
    this.binauralGain = masterGain;
  }

  public stopBinaural() {
    if (this.binauralGain && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.binauralGain.gain.cancelScheduledValues(now);
        this.binauralGain.gain.linearRampToValueAtTime(0.0001, now + 0.06);
      } catch {}
      const l = this.binauralLeftOsc;
      const r = this.binauralRightOsc;
      setTimeout(() => {
        try {
          l?.stop();
          l?.disconnect();
          r?.stop();
          r?.disconnect();
        } catch {}
      }, 80);
    }
    this.binauralLeftOsc = null;
    this.binauralRightOsc = null;
    this.binauralGain = null;
  }

  /**
   * Play a single tone with selected timbre
   */
  public playTone(
    freq: number,
    duration: number = 2.5,
    timbre: SynthTimbre = "PURE_SINE",
    volume: number = 0.6
  ) {
    if (freq <= 10) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);
    gains.push(masterGain);

    if (timbre === "PURE_SINE") {
      // Clean Pythagorean Sine Wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // ADSR envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.08); // attack
      gain.gain.linearRampToValueAtTime(0.3, now + 0.4);  // decay
      gain.gain.setValueAtTime(0.3, now + duration - 0.4); // sustain
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // release

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.05);
      oscs.push(osc);
      gains.push(gain);
    } else if (timbre === "GOLDEN_BOWL") {
      // Singing Bowl / Bell Harmonic Overtones (Fundamental, 2.76x, 5.4x, Φ x)
      const partials = [
        { mult: 1.0, gain: 0.35, decay: duration },
        { mult: 1.618, gain: 0.18, decay: duration * 0.8 },
        { mult: 2.0, gain: 0.12, decay: duration * 0.7 },
        { mult: 2.76, gain: 0.09, decay: duration * 0.5 },
      ];

      partials.forEach((p) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * p.mult, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(p.gain, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + p.decay + 0.05);
        oscs.push(osc);
        gains.push(gain);
      });
    } else if (timbre === "MONOCHORD_PLUCK") {
      // Plucked String Simulation (Karplus/Filtered triangle + sine with sharp transient)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(freq * 5, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.8);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.45, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
      oscs.push(osc);
      gains.push(gain);
    } else if (timbre === "CELESTIAL_PAD") {
      // Ethereal Pythagorean Choir Pad (Sub-octave, detuned sines)
      [-0.003, 0, 0.003].forEach((detune) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * (1 + detune), now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.4);
        gain.gain.setValueAtTime(0.15, now + duration - 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + duration + 0.05);
        oscs.push(osc);
        gains.push(gain);
      });
    } else if (timbre === "ANCIENT_LYRE") {
      // Ancient Greek Chelys Lyre (Homeric plucked gut string with resonant tortoise-shell body)
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const bodyFilter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(freq * 2, now);

      bodyFilter.type = "bandpass";
      bodyFilter.frequency.setValueAtTime(freq * 1.5, now);
      bodyFilter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.008); // rapid pluck transient
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(bodyFilter);
      subOsc.connect(bodyFilter);
      bodyFilter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + duration + 0.05);
      subOsc.stop(now + duration + 0.05);
      oscs.push(osc, subOsc);
      gains.push(gain);
    }

    this.activeNodes.push({ oscs, gains });
  }

  /**
   * Plays a Pythagorean Harmonic Triad/Tetrad (Fundamental + 4/3 Fourth + 3/2 Fifth + Octave + Golden Φ)
   */
  public playPythagoreanChord(
    fundamentalHz: number,
    duration: number = 3.5,
    timbre: SynthTimbre = "CELESTIAL_PAD",
    volume: number = 0.55
  ) {
    this.stopAll();
    const chordFrequencies = [
      fundamentalHz,                         // 1:1 Root
      fundamentalHz * (4 / 3),              // 4:3 Fourth (Διατεσσάρων)
      fundamentalHz * (3 / 2),              // 3:2 Fifth (Διοξεία)
      fundamentalHz * 2,                    // 2:1 Octave (Διά Πασών)
      fundamentalHz * 1.6180339887,         // Golden Harmonic Φ
    ];

    chordFrequencies.forEach((f, idx) => {
      setTimeout(() => {
        this.playTone(f, duration, timbre, volume / 1.6);
      }, idx * 120); // slight stagger for rich shimmer
    });
  }

  /**
   * Plays a melodic arpeggiation of letters step by step
   */
  public playLetterArpeggio(
    letters: AudioNoteInfo[],
    noteDurationMs: number = 320,
    timbre: SynthTimbre = "MONOCHORD_PLUCK",
    volume: number = 0.6,
    onStepChange?: (index: number) => void,
    onComplete?: () => void
  ) {
    this.stopAll();
    if (!letters.length) return;

    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= letters.length) {
        if (onStepChange) onStepChange(-1);
        if (onComplete) onComplete();
        return;
      }

      if (onStepChange) onStepChange(currentIndex);
      const currentNote = letters[currentIndex];
      this.playTone(currentNote.frequency, noteDurationMs / 800, timbre, volume);

      currentIndex++;
      this.sequenceTimer = window.setTimeout(playNext, noteDurationMs);
    };

    playNext();
  }
}

// Global Singleton Instance
export const pythagoreanSynth = new PythagoreanSynthesizer();

/**
 * High-accuracy autocorrelation algorithm for pitch detection (f0 in Hz)
 * Used by the external microphone acoustic meter
 */
export function detectPitchAutocorrelation(
  buf: Float32Array,
  sampleRate: number
): { pitch: number | null; rms: number } {
  let sumSquares = 0;
  for (let i = 0; i < buf.length; i++) {
    sumSquares += buf[i] * buf[i];
  }
  const rms = Math.sqrt(sumSquares / buf.length);

  // Background noise threshold
  if (rms < 0.015) {
    return { pitch: null, rms };
  }

  // Edge trimming to improve pitch detection
  let r1 = 0;
  let r2 = buf.length - 1;
  const thres = 0.04;
  for (let i = 0; i < buf.length / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < buf.length / 2; i++) {
    if (Math.abs(buf[buf.length - i]) < thres) {
      r2 = buf.length - i;
      break;
    }
  }

  const trimmed = buf.slice(r1, r2);
  const len = trimmed.length;
  if (len < 64) {
    return { pitch: null, rms };
  }

  const c = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      c[i] = c[i] + trimmed[j] * trimmed[j + i];
    }
  }

  let d = 0;
  while (d < len - 1 && c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < len; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  if (maxpos === -1 || maxval / c[0] < 0.75) {
    return { pitch: null, rms };
  }

  let T0 = maxpos;
  // Parabolic interpolation for sub-cent 0.1 Hz precision
  if (T0 > 0 && T0 < len - 1) {
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) {
      T0 = T0 - b / (2 * a);
    }
  }

  const pitch = sampleRate / T0;
  if (pitch >= 35 && pitch <= 2500) {
    return { pitch: Math.round(pitch * 10) / 10, rms };
  }

  return { pitch: null, rms };
}

/**
 * Generates an in-memory 16-bit PCM WAV audio file of the pure frequency with golden envelope
 * and triggers immediate browser download
 */
export function exportFrequencyToWav(
  freq: number,
  durationSeconds: number = 4.0,
  waveType: "sine" | "triangle" = "sine",
  volume: number = 0.7,
  fileName: string = "pythagorean-harmonic.wav"
) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true);  // NumChannels (1 mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(view, 36, "data");
  view.setUint32(40, numSamples * 2, true);

  const attackSamples = Math.floor(sampleRate * 0.1);
  const decaySamples = Math.floor(sampleRate * 0.3);
  const releaseSamples = Math.floor(sampleRate * 0.8);
  const sustainLevel = 0.65;

  let offset = 44;
  for (let i = 0; i < numSamples; i++, offset += 2) {
    const t = i / sampleRate;

    // ADSR Envelope
    let env = 1.0;
    if (i < attackSamples) {
      env = i / attackSamples;
    } else if (i < attackSamples + decaySamples) {
      const k = (i - attackSamples) / decaySamples;
      env = 1.0 - (1.0 - sustainLevel) * k;
    } else if (i > numSamples - releaseSamples) {
      const k = (numSamples - i) / releaseSamples;
      env = sustainLevel * Math.max(0, k);
    } else {
      env = sustainLevel;
    }

    // Wave sample
    let sample = 0;
    if (waveType === "sine") {
      // Fundamental + subtle 1.618 golden overtone
      sample = Math.sin(2 * Math.PI * freq * t) * 0.85 +
               Math.sin(2 * Math.PI * freq * 1.618034 * t) * 0.15;
    } else {
      // Triangle
      sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t));
    }

    const finalVal = Math.max(-1, Math.min(1, sample * env * volume));
    view.setInt16(offset, finalVal < 0 ? finalVal * 0x8000 : finalVal * 0x7FFF, true);
  }

  const blob = new Blob([view], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 300);
}

/**
 * Calculates Chladni nodal vibration value at position (x, y) on a square plate [-1, 1]
 * w(x,y) = a*sin(n*pi*x)*sin(m*pi*y) - b*sin(m*pi*x)*sin(n*pi*y)
 */
export function calculateChladniVibration(
  x: number,
  y: number,
  freq: number
): number {
  // Derive n and m modal integers from frequency
  const base = Math.max(1, Math.floor(Math.sqrt(Math.max(20, freq)) / 3.8));
  const n = Math.max(1, (base % 6) + 1);
  const m = Math.max(1, ((base * 2 + 1) % 7) + 1);
  const a = 1.0;
  const b = 0.85;

  const val =
    a * Math.sin(n * Math.PI * x) * Math.sin(m * Math.PI * y) -
    b * Math.sin(m * Math.PI * x) * Math.sin(n * Math.PI * y);

  return Math.abs(val);
}

