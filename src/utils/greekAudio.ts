/**
 * Web Speech API text-to-speech utility for ancient Greek recitation.
 * Converts polytonic ancient Greek verses into phonetically optimized,
 * tonically accurate text for SpeechSynthesis with natural pauses,
 * authentic stress-accents, and hexameter cadence.
 */

/**
 * Converts polytonic ancient Greek text into monotonic accented Greek
 * specifically tailored for modern speech synthesis engines (Web Speech API).
 * 
 * - Preserves exact syllable stress (acute, grave, circumflex -> single clear tonos).
 * - Converts ancient ano teleia (·) into pause-inducing punctuation.
 * - Handles archaic iota adscripts (e.g. τῶι -> τώ, νόμωι -> νόμω) to prevent clumsy extra syllables.
 * - Cleans elision apostrophes for fluid liaison.
 */
export function prepareAncientGreekForSpeech(ancientText: string): string {
  if (!ancientText) return "";

  let text = ancientText;

  // 1. Replace ano teleia (· / ·) and question marks with appropriate pause marks
  text = text.replace(/[··]/g, ", ");
  text = text.replace(/;/g, "; ");

  // 2. Normalize iota adscripts that follow vowels at the end of words (e.g. τῶι -> τῷ, οἵωι -> οἵῳ, νόμωι -> νόμῳ)
  text = text.replace(/([ΩωῶώὣὼὦὢὧὯᾠᾡᾢᾣᾤᾥᾦᾧῲῳῴῶῷῺΏῼ])ι\b/g, "$1");
  text = text.replace(/([ΗηῆήἣὴἦἦἧᾗῃῄῆῇῊΉῌ])ι\b/g, "$1");
  text = text.replace(/([ΑαᾶάἂὰἆἇᾀᾁᾂᾃᾄᾅᾆᾇᾳᾴᾶᾷᾺΆᾼ])ι\b/g, "$1");

  // 3. Decompose unicode (NFD)
  const nfd = text.normalize("NFD");
  let converted = "";

  for (let i = 0; i < nfd.length; i++) {
    const char = nfd[i];
    const code = char.charCodeAt(0);

    // If it's acute (\u0301), grave (\u0300), or perispomene (\u0342 / \u0303)
    if (code === 0x0300 || code === 0x0301 || code === 0x0342 || code === 0x0303) {
      // Standard Greek tonos
      converted += "\u0301";
      continue;
    }

    // Preserve diaeresis (\u0308)
    if (code === 0x0308) {
      converted += "\u0308";
      continue;
    }

    // Strip other combining diacritics:
    // \u0313 (smooth breathing), \u0314 (rough breathing), \u0345 (ypogegrammeni),
    // \u0304 (macron), \u0306 (breve), etc.
    if (
      (code >= 0x0300 && code <= 0x036f) ||
      (code >= 0x1dc0 && code <= 0x1dff) ||
      (code >= 0x20d0 && code <= 0x20ff)
    ) {
      continue;
    }

    converted += char;
  }

  // 4. Re-compose to NFC
  let nfc = converted.normalize("NFC");

  // 5. Clean standalone quotes/apostrophes that break word liaison
  nfc = nfc.replace(/\b([α-ωΑ-ΩΆΈΉΊΌΎΏάέήίόύώ]+)['’`]\s+/g, "$1 ");
  nfc = nfc.replace(/\s+['’`]\s*/g, " ");

  // 6. Normalize multiple spaces
  nfc = nfc.replace(/\s+/g, " ").trim();

  return nfc;
}

/**
 * Checks if SpeechSynthesis is supported in the current environment
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

/**
 * Finds the best available Greek voice in the browser
 */
export function getBestGreekVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Priority 1: Greek language voices (el-GR or el)
  const elVoices = voices.filter(
    (v) => v.lang.toLowerCase().startsWith("el") || v.lang.toLowerCase() === "gre" || v.lang.toLowerCase() === "grc"
  );

  if (elVoices.length > 0) {
    // Prefer higher quality local/natural voices if available
    const naturalVoice = elVoices.find(
      (v) =>
        v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("premium") ||
        v.name.toLowerCase().includes("google") ||
        v.name.toLowerCase().includes("microsoft") ||
        v.name.toLowerCase().includes("apple")
    );
    return naturalVoice || elVoices[0];
  }

  return null;
}

export interface RecitationItem {
  lineNumber: number;
  ancientLine: string;
  modernLine?: string;
}

export interface RecitationController {
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  currentLineIndex: number;
}
