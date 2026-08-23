// Audio manager for the Mystical Suno Voice and Portal Sound

const AUDIO_STORAGE_KEY = "greek_isopsephy_portal_voice_audio_v1";

export const getSavedPortalAudio = (): string | null => {
  try {
    return localStorage.getItem(AUDIO_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const savePortalAudio = (dataUrl: string): boolean => {
  try {
    localStorage.setItem(AUDIO_STORAGE_KEY, dataUrl);
    return true;
  } catch (err) {
    console.error("Failed to save audio to storage:", err);
    return false;
  }
};

export const removePortalAudio = (): void => {
  try {
    localStorage.removeItem(AUDIO_STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const playPortalSound = () => {
  try {
    // 1. Try saved user custom audio (Base64 data URL from Suno)
    const customAudioData = getSavedPortalAudio();
    if (customAudioData) {
      const audio = new Audio();
      audio.src = customAudioData;
      audio.volume = 1.0;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Could not play custom audio:", err);
          playEtherealFallbackAmbient();
        });
      }
      return;
    }

    // 2. Try static public file if available
    const staticAudio = new Audio("/welcome_voice.mp3");
    staticAudio.volume = 1.0;
    const p = staticAudio.play();
    if (p !== undefined) {
      p.catch(() => {
        playEtherealFallbackAmbient();
      });
    }
  } catch {
    playEtherealFallbackAmbient();
  }
};

export const playEtherealFallbackAmbient = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const chords = [216, 432, 528, 648, 864];
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.004, now + 2.5);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3.6);
    });
  } catch (err) {
    console.error("Fallback ambient audio error:", err);
  }
};
