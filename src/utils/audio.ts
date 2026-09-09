// Web Audio API Synthesizer and Frequency Analyzer
// Supports Pythagorean harmonics, custom Hz tone generation, and microphone pitch detection

let audioCtx: AudioContext | null = null;
let currentStopFn: (() => void) | null = null;
let continuousOscillator: OscillatorNode | null = null;
let continuousGain: GainNode | null = null;
let masterLimiter: DynamicsCompressorNode | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Returns a dedicated studio-grade brickwall limiter / compressor
 * to protect mobile speakers and human hearing against clipping, sudden loud spikes, or distortion.
 */
export function getMasterLimiter(ctx: AudioContext): AudioNode {
  if (!masterLimiter || masterLimiter.context !== ctx) {
    try {
      const comp = ctx.createDynamicsCompressor();
      // Studio Limiter parameters
      comp.threshold.setValueAtTime(-12, ctx.currentTime); // dB
      comp.knee.setValueAtTime(24, ctx.currentTime);
      comp.ratio.setValueAtTime(14, ctx.currentTime);
      comp.attack.setValueAtTime(0.003, ctx.currentTime); // fast attack prevents sudden loud pops
      comp.release.setValueAtTime(0.20, ctx.currentTime);
      comp.connect(ctx.destination);
      masterLimiter = comp;
    } catch {
      return ctx.destination;
    }
  }
  return masterLimiter;
}

/**
 * Dynamic acoustic safety curve (Ear & Speaker Limiter).
 * Protects user's hearing, auditory comfort, and smartphone speakers
 * against harsh spikes, digital clipping, resonance peaks, and ultrasound overdrive.
 */
export function calculateSafeVolume(
  freq: number,
  userVol: number,
  waveform: OscillatorType = 'sine'
): number {
  let safetyMultiplier = 1.0;

  // 1. Harmonics dampening for piercing waveforms (Square & Sawtooth have intense harmonics)
  if (waveform === 'square') {
    safetyMultiplier *= 0.35;
  } else if (waveform === 'sawtooth') {
    safetyMultiplier *= 0.40;
  } else if (waveform === 'triangle') {
    safetyMultiplier *= 0.75;
  }

  // 2. Human Ear Canal Resonance & High-Frequency Acoustic Curve
  if (freq >= 15000) {
    // 15 kHz - 20 kHz: Extreme high frequencies / near-ultrasound.
    // Delicate phone tweeters and human ears need gentle, soft amplitude.
    safetyMultiplier *= 0.22;
  } else if (freq >= 10000) {
    // 10 kHz - 15 kHz: High piercing treble
    safetyMultiplier *= 0.38;
  } else if (freq >= 6000) {
    // 6 kHz - 10 kHz: High treble
    safetyMultiplier *= 0.55;
  } else if (freq >= 2500 && freq <= 4800) {
    // 2.5 kHz - 4.8 kHz: Natural human ear canal acoustic resonance (highest sensitivity zone)
    safetyMultiplier *= 0.70;
  } else if (freq < 30) {
    // Infrasonic (< 30 Hz): Protect phone speaker diaphragm from DC excursion
    safetyMultiplier *= 0.60;
  }

  // Absolute hard cap at 0.40 to ensure volume never hurts ears or speakers
  const target = userVol * safetyMultiplier;
  return Math.max(0.0001, Math.min(0.40, target));
}

/**
 * Returns descriptive acoustic zone and safety classification for any Hz value (1 - 20,000 Hz)
 */
export function getFrequencyBandInfo(freq: number): {
  bandName: string;
  description: string;
  safetyNotice: string;
  badgeColor: string;
} {
  if (freq < 20) {
    return {
      bandName: 'Υποηχητική Ζώνη (Infrasound < 20 Hz)',
      description: 'Κάτω από το φυσικό όριο ακοής. Γίνεται αντιληπτή κυρίως ως ρυθμικός παλμός ή δόνηση.',
      safetyNotice: 'Ενεργή προστασία διαφράγματος ηχείου κινητού.',
      badgeColor: 'text-purple-400 border-purple-800/60 bg-purple-950/40'
    };
  } else if (freq < 250) {
    return {
      bandName: 'Χαμηλές Συχνότητες / Μπάσα (20 - 250 Hz)',
      description: 'Βαθείς, γήινοι τόνοι. Περιλαμβάνει τις χαμηλότερες οκτάβες πιάνου και θεμέλιες ανδρικής φωνής.',
      safetyNotice: 'Απόλυτα ασφαλής και ευχάριστη ακουστική ζώνη.',
      badgeColor: 'text-amber-400 border-amber-800/60 bg-amber-950/40'
    };
  } else if (freq <= 2000) {
    return {
      bandName: 'Μεσαίο Ακουστικό Φάσμα (250 - 2.000 Hz)',
      description: 'Το κύριο φάσμα της ανθρώπινης ομιλίας και μουσικής (περιλαμβάνει 432 Hz, 440 Hz, 528 Hz).',
      safetyNotice: 'Βέλτιστη ακουστική άνεση και καθαρότητα.',
      badgeColor: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40'
    };
  } else if (freq <= 6000) {
    return {
      bandName: 'Υψηλές Μεσαίες (2.000 - 6.000 Hz)',
      description: 'Ζώνη μέγιστης ευαισθησίας του ακουστικού πόρου (παρουσία & καθαρότητα φωνής).',
      safetyNotice: 'Αυτόματη ήπια απόσβεση για προστασία από κούραση.',
      badgeColor: 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40'
    };
  } else if (freq <= 15000) {
    return {
      bandName: 'Υψηλές Συχνότητες / Πρίμα (6.000 - 15.000 Hz)',
      description: 'Λεπτοί, υψίσυχνοι τόνοι (πρίμα, αρμονικές πιατινιών).',
      safetyNotice: 'Ενεργός περιοριστής (Limiter) χαμηλής έντασης για αποφυγή διαπεραστικού ήχου.',
      badgeColor: 'text-yellow-400 border-yellow-800/60 bg-yellow-950/40'
    };
  } else {
    return {
      bandName: 'Ανώτατο Όριο Ακοής / Υπερηχητική Παρυφή (15.000 - 20.000 Hz)',
      description: 'Το ανώτατο βιολογικό όριο ανθρώπινης ακοής (20 kHz). Ακούγεται συνήθως ως πολύ λεπτός ψίθυρος/σφύριγμα.',
      safetyNotice: 'Ειδική προστασία: αποτρέπει την υπεροδήγηση ηχείων και ακουστική ενόχληση.',
      badgeColor: 'text-orange-400 border-orange-800/60 bg-orange-950/40'
    };
  }
}

/**
 * Plays a Pythagorean harmonic tone at the specified frequency (Hz)
 * with a smooth acoustic bell/lyre envelope and dynamic compressor protection.
 * Returns a function to stop the tone immediately.
 */
export function playHarmonicFrequency(frequency: number, durationSeconds = 2.2): () => void {
  // Stop any currently playing continuous sound or pulse
  stopContinuousTone();

  if (currentStopFn) {
    try {
      currentStopFn();
    } catch {}
    currentStopFn = null;
  }

  if (typeof window === 'undefined' || !frequency || frequency <= 0) {
    return () => {};
  }

  try {
    const ctx = getAudioContext();
    const limiter = getMasterLimiter(ctx);
    const now = ctx.currentTime;

    const clampedFreq = Math.max(1, Math.min(20000, frequency));
    const safePeak = calculateSafeVolume(clampedFreq, 0.32, 'sine');

    // Master Gain Node for volume envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(safePeak, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(safePeak * 0.55, now + 0.6);
    masterGain.gain.exponentialRampToValueAtTime(0.00001, now + durationSeconds);
    masterGain.connect(limiter);

    // Fundamental Tone (Pure Sine Wave)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(clampedFreq, now);
    osc1.connect(masterGain);

    // Soft Upper Harmonic (2nd Harmonic / Octave) for rich ancient lyre resonance if within audible range
    let osc2: OscillatorNode | null = null;
    if (clampedFreq * 2 <= 20000) {
      osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(safePeak * 0.22, now);
      gain2.gain.exponentialRampToValueAtTime(0.00001, now + durationSeconds * 0.7);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(clampedFreq * 2, now);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + durationSeconds);
    }

    osc1.start(now);
    osc1.stop(now + durationSeconds);

    const stop = () => {
      try {
        const stopTime = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(stopTime);
        masterGain.gain.linearRampToValueAtTime(0.00001, stopTime + 0.04);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2?.stop();
          } catch {}
        }, 50);
      } catch {}
    };

    currentStopFn = stop;
    return stop;
  } catch (err) {
    console.warn('Audio playback error:', err);
    return () => {};
  }
}

/**
 * Plays a single tone pulse for a set duration with safe acoustic ramp
 */
export function playSingleTonePulse(
  freq: number,
  durationSeconds = 2.5,
  waveform: OscillatorType = 'sine',
  volume = 0.28
): () => void {
  stopContinuousTone();
  if (currentStopFn) {
    try { currentStopFn(); } catch {}
    currentStopFn = null;
  }

  try {
    const ctx = getAudioContext();
    const limiter = getMasterLimiter(ctx);
    const now = ctx.currentTime;

    const clampedFreq = Math.max(1, Math.min(20000, freq));
    const safeVol = calculateSafeVolume(clampedFreq, volume, waveform);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(safeVol, now + 0.05);
    gain.gain.setValueAtTime(safeVol, now + Math.max(0.1, durationSeconds - 0.2));
    gain.gain.exponentialRampToValueAtTime(0.00001, now + durationSeconds);
    gain.connect(limiter);

    const osc = ctx.createOscillator();
    osc.type = waveform;
    osc.frequency.setValueAtTime(clampedFreq, now);
    osc.connect(gain);

    osc.start(now);
    osc.stop(now + durationSeconds);

    const stop = () => {
      try {
        const stopTime = ctx.currentTime;
        gain.gain.cancelScheduledValues(stopTime);
        gain.gain.linearRampToValueAtTime(0.00001, stopTime + 0.03);
        setTimeout(() => {
          try {
            osc.stop();
          } catch {}
        }, 40);
      } catch {}
    };

    currentStopFn = stop;
    return stop;
  } catch (err) {
    console.warn('Audio pulse error:', err);
    return () => {};
  }
}

export interface ContinuousToneController {
  setFrequency: (freq: number) => void;
  setVolume: (vol: number) => void;
  setWaveform: (wave: OscillatorType) => void;
  stop: () => void;
}

/**
 * Starts continuous tone generator that can smoothly slide frequencies in real-time
 * with studio-grade dynamics compression and acoustic safety curve.
 */
export function startContinuousTone(
  initialFreq: number,
  initialWaveform: OscillatorType = 'sine',
  initialVolume = 0.28
): ContinuousToneController {
  // Stop previous tones
  stopContinuousTone();
  if (currentStopFn) {
    try { currentStopFn(); } catch {}
    currentStopFn = null;
  }

  const ctx = getAudioContext();
  const limiter = getMasterLimiter(ctx);
  const now = ctx.currentTime;

  let currentFreq = Math.max(1, Math.min(20000, initialFreq));
  let currentVolume = initialVolume;
  let currentWaveform = initialWaveform;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  const safeVol = calculateSafeVolume(currentFreq, currentVolume, currentWaveform);
  // smooth fadeIn (50ms) - completely eliminates any click or pop
  gain.gain.exponentialRampToValueAtTime(safeVol, now + 0.05);
  gain.connect(limiter);

  const osc = ctx.createOscillator();
  osc.type = currentWaveform;
  osc.frequency.setValueAtTime(currentFreq, now);
  osc.connect(gain);
  osc.start(now);

  continuousOscillator = osc;
  continuousGain = gain;

  const controller: ContinuousToneController = {
    setFrequency: (freq: number) => {
      if (!continuousOscillator || !continuousGain) return;
      try {
        currentFreq = Math.max(1, Math.min(20000, freq));
        continuousOscillator.frequency.cancelScheduledValues(ctx.currentTime);
        continuousOscillator.frequency.setTargetAtTime(currentFreq, ctx.currentTime, 0.02);

        // Dynamically recalculate and apply safe volume for the new frequency!
        const updatedSafeVol = calculateSafeVolume(currentFreq, currentVolume, currentWaveform);
        continuousGain.gain.cancelScheduledValues(ctx.currentTime);
        continuousGain.gain.setTargetAtTime(updatedSafeVol, ctx.currentTime, 0.03);
      } catch {}
    },
    setVolume: (vol: number) => {
      if (!continuousGain) return;
      try {
        currentVolume = vol;
        const updatedSafeVol = calculateSafeVolume(currentFreq, currentVolume, currentWaveform);
        continuousGain.gain.cancelScheduledValues(ctx.currentTime);
        continuousGain.gain.setTargetAtTime(updatedSafeVol, ctx.currentTime, 0.03);
      } catch {}
    },
    setWaveform: (wave: OscillatorType) => {
      if (!continuousOscillator || !continuousGain) return;
      try {
        currentWaveform = wave;
        continuousOscillator.type = wave;
        const updatedSafeVol = calculateSafeVolume(currentFreq, currentVolume, currentWaveform);
        continuousGain.gain.cancelScheduledValues(ctx.currentTime);
        continuousGain.gain.setTargetAtTime(updatedSafeVol, ctx.currentTime, 0.03);
      } catch {}
    },
    stop: () => {
      stopContinuousTone();
    }
  };

  return controller;
}

export function stopContinuousTone(): void {
  if (continuousGain && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      continuousGain.gain.cancelScheduledValues(now);
      continuousGain.gain.linearRampToValueAtTime(0.00001, now + 0.04);
      const osc = continuousOscillator;
      setTimeout(() => {
        try {
          osc?.stop();
          osc?.disconnect();
        } catch {}
      }, 50);
    } catch {}
  }
  continuousOscillator = null;
  continuousGain = null;
}

/**
 * Standard Pythagorean Octave Scale (Base A = 432 Hz)
 */
export const PYTHAGOREAN_OCTAVE_NOTES = [
  { name: 'ΝΤΟ', latin: 'C', freq: 256, interval: '1:1', desc: 'Θεμέλιος Φθόγγος' },
  { name: 'ΡΕ', latin: 'D', freq: 288, interval: '9:8', desc: 'Μείζων Τόνος' },
  { name: 'ΜΙ', latin: 'E', freq: 324, interval: '81:64', desc: 'Πυθαγόρεια Τρίτη' },
  { name: 'ΦΑ', latin: 'F', freq: 341.3, interval: '4:3', desc: 'Τέταρτη Καθαρά (Συλλαβά)' },
  { name: 'ΣΟΛ', latin: 'G', freq: 384, interval: '3:2', desc: 'Πέμπτη Καθαρά (Διοξεία)' },
  { name: 'ΛΑ', latin: 'A', freq: 432, interval: '27:16', desc: 'Κοσμικός Συντονισμός 432 Hz' },
  { name: 'ΣΙ', latin: 'B', freq: 486, interval: '243:128', desc: 'Έβδομη Πυθαγόρεια' },
  { name: 'ΝΤΟ²', latin: "C'", freq: 512, interval: '2:1', desc: 'Οκτάβα (Διά Πασών)' }
];

export const SACRED_SOLFEGGIO_FREQUENCIES = [
  { freq: 174, desc: 'Ανακούφιση & Θεμέλιο' },
  { freq: 285, desc: 'Κυτταρική Ανανέωση' },
  { freq: 396, desc: 'Απελευθέρωση & Γείωση' },
  { freq: 417, desc: 'Μετουσίωση & Αλλαγή' },
  { freq: 432, desc: 'Κοσμική Αρμονία Πυθαγόρα' },
  { freq: 528, desc: 'Συχνότητα Μεταμόρφωσης (DNA)' },
  { freq: 639, desc: 'Αρμονία Σχέσεων & Σύνδεση' },
  { freq: 741, desc: 'Διαίσθηση & Αυτοέκφραση' },
  { freq: 852, desc: 'Πνευματική Επίγνωση' },
  { freq: 963, desc: 'Συμπαντική Ενότητα' }
];

export interface NoteMatchResult {
  noteGreek: string;
  noteLatin: string;
  octave: number;
  targetFreq: number;
  cents: number;
  inTune: boolean;
}

const GREEK_NOTES = ['ΝΤΟ', 'ΝΤΟ♯', 'ΡΕ', 'ΡΕ♯', 'ΜΙ', 'ΦΑ', 'ΦΑ♯', 'ΣΟΛ', 'ΣΟΛ♯', 'ΛΑ', 'ΛΑ♯', 'ΣΙ'];
const LATIN_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Determines closest musical note and tuning deviation (cents) for a given frequency
 */
export function getNoteDetailsFromFrequency(freq: number, baseA = 432): NoteMatchResult {
  if (freq <= 0) {
    return {
      noteGreek: '-',
      noteLatin: '-',
      octave: 0,
      targetFreq: 0,
      cents: 0,
      inTune: false
    };
  }

  // 12 * log2(freq / baseA) + 69 (A4 is MIDI 69)
  const midiNote = 12 * (Math.log(freq / baseA) / Math.LN2) + 69;
  const roundedMidi = Math.round(midiNote);
  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;
  const targetFreq = baseA * Math.pow(2, (roundedMidi - 69) / 12);
  const cents = Math.round(1200 * (Math.log(freq / targetFreq) / Math.LN2));

  return {
    noteGreek: GREEK_NOTES[noteIndex],
    noteLatin: LATIN_NOTES[noteIndex],
    octave,
    targetFreq: Math.round(targetFreq * 10) / 10,
    cents,
    inTune: Math.abs(cents) <= 5
  };
}

export interface SacredMatch {
  freq: number;
  name: string;
  diff: number;
}

/**
 * Finds if detected frequency is near any sacred Pythagorean or Solfeggio frequency (within 6 Hz)
 */
export function findClosestSacredFrequency(freq: number): SacredMatch | null {
  if (freq <= 0) return null;

  const candidates: { freq: number; name: string }[] = [
    { freq: 432, name: 'Κοσμικός Συντονισμός 432 Hz (Πυθαγόρας)' },
    { freq: 528, name: 'Συχνότητα Solfeggio 528 Hz (Μεταμόρφωση & DNA)' },
    { freq: 256, name: 'Επιστημονικό / Πυθαγόρειο C (256 Hz)' },
    { freq: 288, name: 'Πυθαγόρειο D (288 Hz)' },
    { freq: 324, name: 'Πυθαγόρειο E (324 Hz)' },
    { freq: 384, name: 'Πυθαγόρειο G (384 Hz)' },
    { freq: 108, name: 'Ιερός Αριθμός 108 Hz' },
    { freq: 396, name: 'Solfeggio 396 Hz (Απελευθέρωση)' },
    { freq: 639, name: 'Solfeggio 639 Hz (Αρμονία Σχέσεων)' },
    { freq: 741, name: 'Solfeggio 741 Hz (Διαίσθηση)' },
    { freq: 852, name: 'Solfeggio 852 Hz (Πνευματικότητα)' },
    { freq: 963, name: 'Solfeggio 963 Hz (Συμπαντική Ενότητα)' },
    { freq: 7.83, name: 'Συντονισμός Schumann 7.83 Hz (Γη)' }
  ];

  let best: SacredMatch | null = null;
  let minDiff = 8; // threshold in Hz

  for (const c of candidates) {
    const diff = Math.abs(freq - c.freq);
    if (diff < minDiff) {
      minDiff = diff;
      best = {
        freq: c.freq,
        name: c.name,
        diff: Math.round(diff * 10) / 10
      };
    }
  }

  return best;
}

/**
 * High precision autocorrelation pitch detector for real-time external sound input
 */
export function autoCorrelate(buf: Float32Array, sampleRate: number): { pitch: number; rms: number } {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);

  // If signal is too weak (silence/ambient noise), return -1
  if (rms < 0.008) {
    return { pitch: -1, rms };
  }

  // Find boundaries where signal crosses threshold
  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmedBuf = buf.slice(r1, r2);
  const trimmedSize = trimmedBuf.length;
  if (trimmedSize < 64) {
    return { pitch: -1, rms };
  }

  const c = new Float32Array(trimmedSize);
  for (let i = 0; i < trimmedSize; i++) {
    let sum = 0;
    for (let j = 0; j < trimmedSize - i; j++) {
      sum += trimmedBuf[j] * trimmedBuf[j + i];
    }
    c[i] = sum;
  }

  let d = 0;
  while (d < trimmedSize - 1 && c[d] > c[d + 1]) {
    d++;
  }

  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < trimmedSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;
  if (T0 <= 0 || T0 >= trimmedSize - 1) {
    return { pitch: -1, rms };
  }

  // Parabolic interpolation for sub-bin precision (0.1 Hz accuracy)
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a !== 0) {
    T0 = T0 - b / (2 * a);
  }

  const pitch = sampleRate / T0;

  // Filter out non-audible / invalid frequencies
  if (pitch < 20 || pitch > 5000) {
    return { pitch: -1, rms };
  }

  return { pitch, rms };
}
