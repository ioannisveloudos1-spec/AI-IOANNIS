// Synthesize an ethereal ambient pad and speak with a mystical female voice:
// "Χαίρομαι που επιστρέφεις. Δεν θα το μετανιώσεις."

export const playMysticalWelcomeVoice = () => {
  // 1. Play gentle ethereal ambient chords & crystal bowl background
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Soft mystical singing bowl (432Hz / 528Hz Solfeggio harmony)
      const celestialPads = [216, 432, 528, 648, 864];
      celestialPads.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.004, now + 2.5);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3.9);
      });
    }
  } catch (e) {
    console.error("Ambient audio error:", e);
  }

  // 2. Mystical Ethereal Female Voice Speech Synthesis
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const text = "Χαίρομαι που επιστρέφεις. Δεν θα το μετανιώσεις.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "el-GR";
      utterance.rate = 0.88; // Calm, mystical slow pace
      utterance.pitch = 1.15; // Soft ethereal female pitch
      utterance.volume = 1.0;

      // Select female Greek voice if available
      const voices = window.speechSynthesis.getVoices();
      const greekVoice = voices.find(
        (v) =>
          (v.lang.startsWith("el") || v.lang.includes("GR")) &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("γυναικ") ||
            v.name.toLowerCase().includes("athina") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("elena"))
      ) || voices.find((v) => v.lang.startsWith("el") || v.lang.includes("GR"));

      if (greekVoice) {
        utterance.voice = greekVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.error("Speech synthesis error:", err);
  }
};

// Also keep alias for compatibility
export const playAncientMechanismSound = playMysticalWelcomeVoice;

