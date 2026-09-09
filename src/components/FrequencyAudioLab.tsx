import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Square,
  Music,
  Radio,
  Sparkles,
  Activity,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Info,
  Gauge,
  AudioWaveform,
  Sliders,
  Lock,
  Unlock,
  ShieldCheck,
  Power
} from 'lucide-react';
import {
  startContinuousTone,
  stopContinuousTone,
  ContinuousToneController,
  getAudioContext,
  autoCorrelate,
  getNoteDetailsFromFrequency,
  findClosestSacredFrequency,
  SACRED_SOLFEGGIO_FREQUENCIES,
  PYTHAGOREAN_OCTAVE_NOTES
} from '../utils/audio';

interface FrequencyAudioLabProps {
  currentLexarithmValue?: number;
  currentWordNote?: string;
  currentWordFreq?: number;
  onApplyFrequencyToCalculator?: (freq: number) => void;
}

export const FrequencyAudioLab: React.FC<FrequencyAudioLabProps> = ({
  currentLexarithmValue,
  currentWordNote,
  currentWordFreq,
  onApplyFrequencyToCalculator
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'meter'>('generator');

  // -------------------------------------------------------------
  // 1. TONE GENERATOR STATE
  // -------------------------------------------------------------
  const [generatorFreq, setGeneratorFreq] = useState<number>(() => currentWordFreq || 432);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.28);
  const [isTonePlaying, setIsTonePlaying] = useState<boolean>(false);
  const [freqRangeMode, setFreqRangeMode] = useState<'acoustic' | 'full'>('acoustic');
  const toneControllerRef = useRef<ContinuousToneController | null>(null);

  // Update live tone if playing
  useEffect(() => {
    if (isTonePlaying && toneControllerRef.current) {
      toneControllerRef.current.setFrequency(generatorFreq);
    }
  }, [generatorFreq, isTonePlaying]);

  useEffect(() => {
    if (isTonePlaying && toneControllerRef.current) {
      toneControllerRef.current.setVolume(volume);
    }
  }, [volume, isTonePlaying]);

  useEffect(() => {
    if (isTonePlaying && toneControllerRef.current) {
      toneControllerRef.current.setWaveform(waveform);
    }
  }, [waveform, isTonePlaying]);

  const handleTogglePlay = () => {
    if (isTonePlaying) {
      stopContinuousTone();
      toneControllerRef.current = null;
      setIsTonePlaying(false);
    } else {
      toneControllerRef.current = startContinuousTone(generatorFreq, waveform, volume);
      setIsTonePlaying(true);
    }
  };

  const handleFreqChange = (newFreq: number) => {
    const clamped = Math.max(1, Math.min(20000, Math.round(newFreq * 10) / 10));
    setGeneratorFreq(clamped);
  };

  const handleStepFreq = (delta: number) => {
    handleFreqChange(generatorFreq + delta);
  };

  // Stop tone when component unmounts
  useEffect(() => {
    return () => {
      stopContinuousTone();
    };
  }, []);

  // -------------------------------------------------------------
  // 2. EXTERNAL AUDIO HZ METER (MICROPHONE) STATE
  // -------------------------------------------------------------
  const [isListening, setIsListening] = useState<boolean>(false);
  const [detectedPitch, setDetectedPitch] = useState<number | null>(null);
  const [detectedVolume, setDetectedVolume] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [baseReferenceA, setBaseReferenceA] = useState<number>(432); // 432 Hz vs 440 Hz
  const [smoothedPitch, setSmoothedPitch] = useState<number | null>(null);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pitchHistoryRef = useRef<number[]>([]);

  const drawIdleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#100c08');
    bgGrad.addColorStop(1, '#16100b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid
    ctx.strokeStyle = '#24190e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Center flat dashed line (calm inactive signal)
    ctx.strokeStyle = '#4a3824';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(24, height / 2);
    ctx.lineTo(width - 24, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Clear idle indicator text
    ctx.fillStyle = '#8c765c';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Μικρόφωνο Απενεργοποιημένο (OFF) — Σε αναμονή ενεργοποίησης κατά βούληση', width / 2, height / 2 - 10);
  }, []);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {}
      });
      audioStreamRef.current = null;
    }
    if (micSourceRef.current) {
      try {
        micSourceRef.current.disconnect();
      } catch {}
      micSourceRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
    setDetectedPitch(null);
    setSmoothedPitch(null);
    setDetectedVolume(0);

    // Draw idle state immediately
    setTimeout(() => {
      drawIdleCanvas();
    }, 20);
  }, [drawIdleCanvas]);

  const startListening = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Η συσκευή ή ο περιηγητής δεν υποστηρίζει άμεση πρόσβαση στο μικρόφωνο.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      });

      audioStreamRef.current = stream;
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      micSourceRef.current = source;

      setIsListening(true);
      pitchHistoryRef.current = [];

      const buffer = new Float32Array(analyser.fftSize);
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      const updateAnalysis = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getFloatTimeDomainData(buffer);
        analyserRef.current.getByteFrequencyData(freqData);

        const { pitch, rms } = autoCorrelate(buffer, ctx.sampleRate);
        setDetectedVolume(Math.min(100, Math.round(rms * 400)));

        if (pitch > 20 && pitch < 4500) {
          pitchHistoryRef.current.push(pitch);
          if (pitchHistoryRef.current.length > 5) {
            pitchHistoryRef.current.shift();
          }
          // Median filter to avoid jumpy pitch readouts
          const sorted = [...pitchHistoryRef.current].sort((a, b) => a - b);
          const median = sorted[Math.floor(sorted.length / 2)];
          const rounded = Math.round(median * 10) / 10;
          setDetectedPitch(rounded);
          setSmoothedPitch(curr => (curr ? Math.round((curr * 0.6 + rounded * 0.4) * 10) / 10 : rounded));
        } else if (rms < 0.008) {
          // Silence or weak sound
          if (pitchHistoryRef.current.length > 0) {
            pitchHistoryRef.current.shift();
          }
          if (pitchHistoryRef.current.length === 0) {
            setDetectedPitch(null);
            setSmoothedPitch(null);
          }
        }

        // Draw Canvas oscilloscope and frequency bars
        drawVisualizer(buffer, freqData);

        animationFrameRef.current = requestAnimationFrame(updateAnalysis);
      };

      animationFrameRef.current = requestAnimationFrame(updateAnalysis);
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      console.error('Microphone access error:', err);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMicError('Δεν δόθηκε άδεια πρόσβασης στο μικρόφωνο. Επιτρέψτε την πρόσβαση από τις ρυθμίσεις του περιηγητή.');
      } else {
        setMicError(error.message || 'Αποτυχία εκκίνησης του μετρητή ήχου.');
      }
      stopListening();
    }
  };

  const drawVisualizer = (waveformBuf: Float32Array, freqBuf: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#110c08');
    bgGrad.addColorStop(1, '#1a120b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Grid
    ctx.strokeStyle = '#2b1f13';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw Frequency Bars (background spectrum)
    const barCount = 48;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const index = Math.floor((i / barCount) * (freqBuf.length / 3));
      const val = freqBuf[index] / 255;
      const barHeight = val * (height * 0.7);

      const barGrad = ctx.createLinearGradient(0, height, 0, height - barHeight);
      barGrad.addColorStop(0, 'rgba(200, 155, 60, 0.15)');
      barGrad.addColorStop(1, 'rgba(255, 215, 0, 0.45)');

      ctx.fillStyle = barGrad;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1.5, barHeight);
    }

    // Draw Oscilloscope Waveform Line
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#ffd700';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.beginPath();

    const sliceWidth = width / waveformBuf.length;
    let x = 0;

    for (let i = 0; i < waveformBuf.length; i++) {
      const v = waveformBuf[i];
      const y = (height / 2) + v * (height * 0.42);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // Handle tab switching safely
  const handleSwitchTab = (tab: 'generator' | 'meter') => {
    if (tab === 'generator' && isListening) {
      stopListening();
    }
    setActiveTab(tab);
  };

  // When switching to meter tab and not listening, draw idle canvas
  useEffect(() => {
    if (activeTab === 'meter' && !isListening) {
      const timer = setTimeout(() => {
        drawIdleCanvas();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isListening, drawIdleCanvas]);

  // Clean up listening on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Derived information
  const generatorNoteInfo = getNoteDetailsFromFrequency(generatorFreq, 432);
  const generatorSacred = findClosestSacredFrequency(generatorFreq);

  const detectedNoteInfo = smoothedPitch ? getNoteDetailsFromFrequency(smoothedPitch, baseReferenceA) : null;
  const detectedSacred = smoothedPitch ? findClosestSacredFrequency(smoothedPitch) : null;

  // Max slider range based on mode
  const sliderMax = freqRangeMode === 'acoustic' ? 2000 : 20000;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#120e0a] border border-[#382b1b] space-y-4 shadow-xl text-xs font-serif">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a1e12] pb-3">
        <div className="flex items-center gap-2">
          <AudioWaveform className="w-4 h-4 text-[#ffd700]" />
          <span className="text-xs uppercase tracking-wider text-[#ffd700] font-serif font-bold">
            Εργαστήριο Ακουστικής: Γεννήτρια &amp; Μετρητής Hz
          </span>
        </div>

        <div className="flex items-center bg-[#1c150e] p-1 rounded-lg border border-[#382716]">
          <button
            type="button"
            onClick={() => handleSwitchTab('generator')}
            className={`px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-[#ffd700] text-black font-bold shadow-md'
                : 'text-[#d6c7b2] hover:text-[#ffd700]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Γεννήτρια Ήχου (Ορισμός Hz)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('meter')}
            className={`px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'meter'
                ? 'bg-[#ffd700] text-black font-bold shadow-md'
                : 'text-[#d6c7b2] hover:text-[#ffd700]'
            }`}
          >
            {isListening ? (
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <Mic className="w-3.5 h-3.5 text-red-500" />
              </span>
            ) : (
              <MicOff className="w-3.5 h-3.5 text-[#8c7e6c]" />
            )}
            <span>Μετρητής Hz</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase transition-colors ${
                isListening
                  ? 'bg-red-900 text-red-100 border border-red-700 animate-pulse'
                  : 'bg-[#291e13] text-[#a69680] border border-[#3e2b1b]'
              }`}
            >
              {isListening ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: TONE GENERATOR (ΟΡΙΣΜΟΣ HZ & ΑΠΟΔΟΣΗ ΗΧΟΥ)             */}
      {/* ============================================================= */}
      {activeTab === 'generator' && (
        <div className="space-y-4">
          {/* Main Controls Card */}
          <div className="p-4 rounded-xl bg-[#18120b] border border-[#332415] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Numerical Hz Input & Fine Tuning */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-mono text-[#a69680] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <span>Επιθυμητή Συχνότητα (Hz):</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#c89b3c]">
                    Νότα: <strong className="text-[#ffd700]">{generatorNoteInfo.noteGreek} ({generatorNoteInfo.noteLatin}{generatorNoteInfo.octave})</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="20000"
                      value={generatorFreq}
                      onChange={(e) => handleFreqChange(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#100b07] border border-[#443019] focus:border-[#ffd700] rounded-lg px-3 py-2 text-xl sm:text-2xl font-mono font-bold text-[#ffd700] outline-none transition-all pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#a69680]">
                      Hz
                    </span>
                  </div>

                  {/* Main Play / Stop Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className={`px-5 py-2.5 rounded-lg font-sans font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                      isTonePlaying
                        ? 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/40 animate-pulse'
                        : 'bg-[#ffd700] hover:bg-[#ffe14d] text-black shadow-[#ffd700]/30'
                    }`}
                  >
                    {isTonePlaying ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>Διακοπή Ήχου</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Αναπαραγωγή Ήχου</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Step Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-[#8c7e6c] mr-1">Βήμα:</span>
                  {[
                    { label: '-100', val: -100 },
                    { label: '-10', val: -10 },
                    { label: '-1', val: -1 },
                    { label: '+1', val: 1 },
                    { label: '+10', val: 10 },
                    { label: '+100', val: 100 }
                  ].map(btn => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() => handleStepFreq(btn.val)}
                      className="px-2 py-0.5 rounded bg-[#20170f] hover:bg-[#2e2014] border border-[#382716] hover:border-[#ffd700]/50 font-mono text-[10px] text-[#e0d3be] transition-colors cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleFreqChange(432)}
                    className="px-2 py-0.5 rounded bg-[#2c1d0f] border border-[#ffd700]/40 text-[#ffd700] font-mono text-[10px] hover:bg-[#3d2714] transition-colors cursor-pointer ml-auto"
                  >
                    Επαναφορά 432 Hz
                  </button>
                </div>
              </div>
            </div>

            {/* Slider & Waveform Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#261b11]">
              {/* Interactive Frequency Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#a69680]">
                  <span>Ολισθητής Συχνότητας</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setFreqRangeMode('acoustic')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${freqRangeMode === 'acoustic' ? 'bg-[#382716] text-[#ffd700]' : 'text-[#8c7e6c]'}`}
                    >
                      20 - 2.000 Hz
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => setFreqRangeMode('full')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${freqRangeMode === 'full' ? 'bg-[#382716] text-[#ffd700]' : 'text-[#8c7e6c]'}`}
                    >
                      20 - 20.000 Hz
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="20"
                  max={sliderMax}
                  step={freqRangeMode === 'acoustic' ? '0.5' : '5'}
                  value={Math.min(sliderMax, generatorFreq)}
                  onChange={(e) => handleFreqChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#261a10] rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8c7e6c]">
                  <span>20 Hz</span>
                  <span className="text-[#ffd700] font-bold">{generatorFreq} Hz</span>
                  <span>{sliderMax.toLocaleString()} Hz</span>
                </div>
              </div>

              {/* Waveform & Volume Controls */}
              <div className="grid grid-cols-2 gap-3">
                {/* Waveform Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#a69680] block">Μορφή Κύματος</span>
                  <select
                    value={waveform}
                    onChange={(e) => setWaveform(e.target.value as OscillatorType)}
                    className="w-full bg-[#100b07] border border-[#382716] text-[#f5ecd8] rounded-lg px-2.5 py-1.5 text-xs font-serif outline-none cursor-pointer focus:border-[#ffd700]"
                  >
                    <option value="sine">Ημίτονο (Πυθαγόρειο / Sine)</option>
                    <option value="triangle">Τρίγωνο (Απαλό / Triangle)</option>
                    <option value="sawtooth">Πριονωτό (Sawtooth)</option>
                    <option value="square">Τετραγωνικό (Square)</option>
                  </select>
                </div>

                {/* Volume Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#a69680]">
                    <span>Ένταση Ήχου</span>
                    <span className="text-[#ffd700]">{Math.round(volume * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <input
                      type="range"
                      min="0.01"
                      max="0.8"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#261a10] rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred & Pythagorean Harmonic Match Banner */}
            {generatorSacred && (
              <div className="p-2.5 rounded-lg bg-[#20180f] border border-[#ffd700]/40 flex items-center justify-between text-xs text-[#ffd700]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  <span>
                    Αρμονικός Συντονισμός: <strong>{generatorSacred.name}</strong>
                    {generatorSacred.diff > 0 && ` (Απόκλιση: ${generatorSacred.diff} Hz)`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFreqChange(generatorSacred.freq)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#332212] border border-[#ffd700]/40 text-[#ffd700] hover:bg-[#4a321a] transition-colors cursor-pointer"
                >
                  Κλείδωμα στα {generatorSacred.freq} Hz
                </button>
              </div>
            )}
          </div>

          {/* Quick Frequency Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-serif text-[#a69680]">
              <span className="flex items-center gap-1.5 text-[#ffd700] font-bold uppercase tracking-wider">
                <Music className="w-3.5 h-3.5 text-[#ffd700]" />
                Συχνότητες Πυθαγόρα &amp; Ιερές Συχνότητες Solfeggio:
              </span>
              {currentWordFreq && (
                <button
                  type="button"
                  onClick={() => handleFreqChange(currentWordFreq)}
                  className="px-2 py-0.5 rounded bg-[#2e1d0e] border border-[#ffd700]/50 text-[#ffd700] font-mono text-[10px] hover:bg-[#3e2714] cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#ffd700]" />
                  <span>Χρήση Hz Λεξαρίθμου ({currentWordFreq} Hz)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {[
                { freq: 432, label: '432 Hz', sub: 'Κοσμικό ΛΑ (Πυθαγόρας)' },
                { freq: 528, label: '528 Hz', sub: 'Solfeggio (DNA / Μεταμόρφωση)' },
                { freq: 256, label: '256 Hz', sub: 'Επιστημονικό C (Θεμέλιος)' },
                { freq: 384, label: '384 Hz', sub: 'Πέμπτη Καθαρά (ΣΟΛ)' },
                { freq: 108, label: '108 Hz', sub: 'Ιερός Αριθμός 108' },
                { freq: 7.83, label: '7.83 Hz', sub: 'Συντονισμός Schumann' }
              ].map(preset => {
                const isActive = Math.abs(generatorFreq - preset.freq) < 0.1;
                return (
                  <button
                    key={preset.freq}
                    type="button"
                    onClick={() => handleFreqChange(preset.freq)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#291e12] border-[#ffd700] text-[#ffd700] shadow-md shadow-[#ffd700]/20'
                        : 'bg-[#15100a] border-[#2e2013] text-[#d6c7b2] hover:border-[#ffd700]/50 hover:bg-[#1e150e]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#ffd700]">{preset.label}</span>
                      {isActive && <CheckCircle2 className="w-3 h-3 text-[#ffd700]" />}
                    </div>
                    <span className="text-[10px] font-serif text-[#8c7e6c] truncate mt-0.5">
                      {preset.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: EXTERNAL AUDIO HZ METER (ΜΕΤΡΗΤΗΣ ΕΞΩΤΕΡΙΚΩΝ ΗΧΩΝ)     */}
      {/* ============================================================= */}
      {activeTab === 'meter' && (
        <div className="space-y-4">
          {/* Dedicated Master Microphone Manual Control Card */}
          <div
            className={`p-4 sm:p-5 rounded-xl border transition-all shadow-lg ${
              isListening
                ? 'bg-gradient-to-r from-[#240d0a] via-[#1a0f0a] to-[#240d0a] border-red-700/80 shadow-red-950/40'
                : 'bg-[#15100a] border-[#3a2817]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {isListening ? (
                    <div className="flex items-center gap-2 bg-red-950/80 text-red-200 border border-red-700 px-2.5 py-1 rounded-full font-mono text-xs font-bold">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                      <Mic className="w-3.5 h-3.5 text-red-400" />
                      <span>ΚΑΤΑΣΤΑΣΗ: ΕΝΕΡΓΟΠΟΙΗΜΕΝΟ (ON)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#1f160e] text-[#a69680] border border-[#3d2917] px-2.5 py-1 rounded-full font-mono text-xs font-bold">
                      <Lock className="w-3.5 h-3.5 text-[#8c7e6c]" />
                      <MicOff className="w-3.5 h-3.5 text-[#8c7e6c]" />
                      <span>ΚΑΤΑΣΤΑΣΗ: ΠΛΗΡΩΣ ΑΠΕΝΕΡΓΟΠΟΙΗΜΕΝΟ (OFF)</span>
                    </div>
                  )}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e140c] text-[#ffd700] border border-[#3e2b1b]">
                    Χειροκίνητος Έλεγχος (Κατά Βούληση)
                  </span>
                </div>

                <p className="text-xs font-serif text-[#d6c7b2] max-w-xl leading-relaxed">
                  {isListening
                    ? 'Το μικρόφωνο καταγράφει ενεργά τους εξωτερικούς ήχους για υπολογισμό συχνότητας (Hz). Πατήστε το κουμπί δεξιά για άμεση απενεργοποίηση και πλήρη αποδέσμευση της συσκευής.'
                    : 'Το μικρόφωνο παραμένει 100% κλειστό. Η εφαρμογή ΔΕΝ ακούει ούτε καταγράφει κανέναν ήχο μέχρι να επιλέξετε ρητά να το ανοίξετε.'}
                </p>
              </div>

              {/* Master Manual Activation / Deactivation Button */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`px-6 py-3 rounded-xl font-sans font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer shadow-lg ${
                    isListening
                      ? 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/50 border border-red-500 hover:scale-[1.02]'
                      : 'bg-[#ffd700] hover:bg-[#ffe14d] text-black shadow-[#ffd700]/30 hover:scale-[1.02]'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Power className="w-4 h-4" />
                      <span>Απενεργοποίηση Μικροφώνου (OFF)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Ενεργοποίηση Μικροφώνου (ON)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Meter & Visualizer Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#18120b] border border-[#332415] space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold font-serif text-[#ffd700] flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#ffd700]" />
                  <span>Ανιχνευτής &amp; Μετρητής Συχνότητας Ήχου (Hz)</span>
                </h4>
                <p className="text-[11px] font-mono text-[#a69680]">
                  Μετρά σε πραγματικό χρόνο τη θεμελιώδη συχνότητα (pitch) από φωνή, μουσικά όργανα ή εξωτερικούς ήχους.
                </p>
              </div>
            </div>

            {/* Error Message if Microphone blocked */}
            {micError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            {/* Digital Readout & Pitch Tuner Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Digital Hz Display */}
              <div className="p-4 rounded-xl bg-[#110c08] border border-[#2f2014] flex flex-col justify-between items-center text-center">
                <span className="text-[10px] uppercase font-mono text-[#a69680]">
                  Μετρηθείσα Συχνότητα
                </span>
                <div className="my-2">
                  {smoothedPitch ? (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl sm:text-5xl font-mono font-bold text-[#ffd700] tracking-tight">
                        {smoothedPitch.toFixed(1)}
                      </span>
                      <span className="text-sm font-mono text-[#c89b3c]">Hz</span>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="text-2xl sm:text-3xl font-mono text-[#5c4a35]">
                        --.- Hz
                      </div>
                      <span className="text-[10px] font-mono text-[#8c7e6c] block mt-1">
                        {isListening ? 'Αναμονή εξωτερικού ήχου...' : 'Μικρόφωνο κλειστό (OFF)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Microphone Level bar */}
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-[#8c7e6c]">
                    <span>Στάθμη Ήχου</span>
                    <span>{isListening ? `${detectedVolume}%` : '0%'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#20160d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-[#ffd700] to-red-500 transition-all duration-75"
                      style={{ width: `${isListening ? Math.min(100, detectedVolume) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Musical Note & Tuner Deviation */}
              <div className="p-4 rounded-xl bg-[#110c08] border border-[#2f2014] flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#a69680]">
                  <span>Μουσική Νότα</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setBaseReferenceA(432)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${baseReferenceA === 432 ? 'bg-[#382716] text-[#ffd700]' : 'text-[#8c7e6c]'}`}
                      title="Πυθαγόρειο κούρδισμα A4 = 432 Hz"
                    >
                      432 Hz
                    </button>
                    <span>/</span>
                    <button
                      type="button"
                      onClick={() => setBaseReferenceA(440)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${baseReferenceA === 440 ? 'bg-[#382716] text-[#ffd700]' : 'text-[#8c7e6c]'}`}
                      title="Σύγχρονο πρότυπο A4 = 440 Hz"
                    >
                      440 Hz
                    </button>
                  </div>
                </div>

                <div className="my-1">
                  {detectedNoteInfo && detectedNoteInfo.noteGreek !== '-' ? (
                    <div>
                      <div className="text-3xl sm:text-4xl font-serif font-bold text-[#f5ecd8]">
                        {detectedNoteInfo.noteGreek}
                        <span className="text-xl font-mono text-[#c89b3c] ml-1">
                          {detectedNoteInfo.noteLatin}{detectedNoteInfo.octave}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#a69680] mt-0.5">
                        Στόχος: {detectedNoteInfo.targetFreq} Hz
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-serif text-[#5c4a35] py-2">--</div>
                  )}
                </div>

                {/* Tuner Cent deviation needle */}
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-[#8c7e6c]">
                    <span>-50 cents</span>
                    <span className={detectedNoteInfo?.inTune ? 'text-emerald-400 font-bold' : 'text-[#ffd700]'}>
                      {detectedNoteInfo ? `${detectedNoteInfo.cents > 0 ? '+' : ''}${detectedNoteInfo.cents} cents` : '0'}
                    </span>
                    <span>+50 cents</span>
                  </div>
                  <div className="relative w-full h-2 bg-[#20160d] rounded-full overflow-hidden flex items-center">
                    {/* Center Mark */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-emerald-500/60 z-10" />
                    {detectedNoteInfo && (
                      <div
                        className={`absolute w-3 h-3 rounded-full -translate-x-1/2 transition-all duration-100 ${
                          detectedNoteInfo.inTune ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-[#ffd700]'
                        }`}
                        style={{
                          left: `${Math.max(5, Math.min(95, 50 + (detectedNoteInfo.cents / 50) * 45))}%`
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Pythagorean / Sacred Resonance Indicator & Transfer Action */}
              <div className="p-4 rounded-xl bg-[#110c08] border border-[#2f2014] flex flex-col justify-between space-y-2">
                <span className="text-[10px] uppercase font-mono text-[#a69680] text-center">
                  Κοσμικός &amp; Πυθαγόρειος Συντονισμός
                </span>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  {detectedSacred ? (
                    <div className="p-2 rounded-lg bg-[#24190e] border border-[#ffd700]/50 w-full text-center">
                      <div className="flex items-center justify-center gap-1 text-[#ffd700] font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{detectedSacred.name}</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#c89b3c] mt-0.5">
                        Απόκλιση: μόλις {detectedSacred.diff} Hz!
                      </p>
                    </div>
                  ) : currentWordFreq && smoothedPitch && Math.abs(smoothedPitch - currentWordFreq) <= 10 ? (
                    <div className="p-2 rounded-lg bg-[#1a291e] border border-emerald-500/50 w-full text-center">
                      <div className="flex items-center justify-center gap-1 text-emerald-300 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Συντονισμός με τον Λεξάριθμο!</span>
                      </div>
                      <p className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        Συχνότητα λέξης: {currentWordFreq} Hz
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] font-serif text-[#8c7e6c] text-center">
                      {isListening
                        ? 'Παράγετε φωνή, σφύριγμα, νότα ή ήχο κοντά στο μικρόφωνο για ανίχνευση συχνότητας.'
                        : 'Το μικρόφωνο είναι απενεργοποιημένο. Πατήστε «Ενεργοποίηση Μικροφώνου (ON)» όταν επιθυμείτε.'}
                    </p>
                  )}
                </div>

                {/* Transfer Detected Hz to Generator */}
                {smoothedPitch && (
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratorFreq(smoothedPitch);
                      setActiveTab('generator');
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#271b10] hover:bg-[#382617] border border-[#ffd700]/50 text-[#ffd700] text-xs font-serif flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>Μεταφορά των {smoothedPitch} Hz στη Γεννήτρια</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Visualizer Canvas (Oscilloscope + Spectrum) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#a69680]">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>Παλμογράφος &amp; Φάσμα Συχνοτήτων σε Πραγματικό Χρόνο:</span>
                </span>
                <span className="text-[10px] text-[#8c7e6c]">
                  {isListening ? 'Ενεργή Λήψη 60 FPS' : 'Ανενεργό (Μικρόφωνο OFF)'}
                </span>
              </div>
              <div className="w-full rounded-xl overflow-hidden border border-[#332415] bg-[#110c08] shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={130}
                  className="w-full h-[120px] block"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
