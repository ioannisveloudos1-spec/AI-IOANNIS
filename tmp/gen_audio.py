import wave, struct, math, subprocess, os

sample_rate = 44100
duration = 21.0
num_samples = int(sample_rate * duration)

left = bytearray()
bpm = 85
beat_dur = 60.0 / bpm
bar_dur = beat_dur * 4

# Precompute waveforms
samples_l = [0.0] * num_samples
samples_r = [0.0] * num_samples

chord_prog = [
    (0.0, [220.0, 261.63, 329.63, 440.0]),      # Am
    (bar_dur, [174.61, 220.0, 261.63, 329.63]), # F
    (bar_dur * 2, [146.83, 220.0, 261.63, 349.23]), # Dm
    (bar_dur * 3, [164.81, 207.65, 246.94, 329.63]), # E
    (bar_dur * 4, [220.0, 261.63, 329.63, 440.0]), # Am
]

for chord_start, notes in chord_prog:
    start_idx = int(chord_start * sample_rate)
    end_idx = min(num_samples, int((chord_start + bar_dur) * sample_rate))
    for t_i in range(start_idx, end_idx):
        t = (t_i - start_idx) / sample_rate
        env = math.sin(min(1.0, t / 0.4) * (math.pi / 2)) * math.exp(-t / (bar_dur * 1.6))
        chord_val = 0.0
        for idx, freq in enumerate(notes):
            chord_val += math.sin(2 * math.pi * freq * t) * (0.09 / len(notes))
        samples_l[t_i] += chord_val * env
        samples_r[t_i] += chord_val * env

# 808 Bass
bass_notes = [(0.0, 55.0), (bar_dur, 43.65), (bar_dur * 2, 36.71), (bar_dur * 3, 41.20), (bar_dur * 4, 55.0)]
for start_t, b_freq in bass_notes:
    start_idx = int(start_t * sample_rate)
    end_idx = min(num_samples, int((start_t + bar_dur) * sample_rate))
    for t_i in range(start_idx, end_idx):
        t = (t_i - start_idx) / sample_rate
        cur_freq = b_freq + 30.0 * math.exp(-t * 25.0)
        env = min(1.0, t / 0.02) * math.exp(-t / 3.0)
        sat_bass = math.tanh(math.sin(2 * math.pi * cur_freq * t) * 1.5) * 0.32
        samples_l[t_i] += sat_bass * env
        samples_r[t_i] += sat_bass * env

# Bell chime on 1049Hz (Veloudos / Oudos)
bell_times = [0.4, 2.8, 5.6, 8.4, 11.2, 14.0, 16.8, 19.6]
for bt in bell_times:
    b_start = int(bt * sample_rate)
    for i in range(min(num_samples - b_start, int(2.0 * sample_rate))):
        t = i / sample_rate
        b_env = math.exp(-t * 3.0) * min(1.0, t / 0.01)
        b_val = (math.sin(2 * math.pi * 1049.0 * t) + 0.4 * math.sin(2 * math.pi * 524.5 * t)) * b_env * 0.15
        samples_l[b_start + i] += b_val
        samples_r[b_start + i] += b_val

# Convert to 16-bit PCM WAV
os.makedirs("public", exist_ok=True)
raw_frames = bytearray()
for i in range(num_samples):
    l = max(-32767, min(32767, int(math.tanh(samples_l[i]) * 32767 * 0.9)))
    r = max(-32767, min(32767, int(math.tanh(samples_r[i]) * 32767 * 0.9)))
    raw_frames.extend(struct.pack('<hh', l, r))

wav_file = "public/welcome_voice.wav"
with wave.open(wav_file, 'wb') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(sample_rate)
    wf.writeframes(raw_frames)

subprocess.run(["ffmpeg", "-y", "-i", "public/welcome_voice.wav", "-b:a", "192k", "public/welcome_voice.mp3"], check=True)
print("SUCCESS: Audio files ready in public/")
