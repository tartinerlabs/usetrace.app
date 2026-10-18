# Bake the ducked music bed with sample-accurate gain (Remotion evaluates a
# volume callback once per video frame, which steps ~1.3 dB per frame on a
# ramp). Cue list is read from src/timing.ts so the bed always matches the VO.
#   duck -4.5 dB (-6.5 dB under VO6 and VO8, which sat at the low edge of
#   the target), attack 12 frames (ends on the VO start), release 36 frames,
#   both sine in-out; 8 ms fade-in at 0; 30-frame safety ramp at the end;
#   x0.9 bed trim (the old constant in Soundtrack.tsx).
# usage: duck.py [video dir]  (defaults to the video/ folder this script lives in)
import os, re, sys, numpy as np, soundfile as sf

root = sys.argv[1] if len(sys.argv) > 1 else os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
ts = open(f"{root}/src/timing.ts").read()
cues = [(int(n), int(a), int(b)) for n, a, b in re.findall(r'id: "vo(\d)",\s*from: (\d+),\s*maxFrames: (\d+)', ts)]
assert len(cues) == 8, cues
DURATION = int(re.search(r"export const DURATION = (\d+)", ts).group(1))

x, sr = sf.read(f"{root}/public/music/score.wav", dtype="float64", always_2d=True)
FPS = 60
t = np.arange(len(x)) / sr * FPS  # time in frames, per sample
DUCK_DB = {6: -6.5, 8: -6.5}  # per VO line; the rest use -4.5 dB
ATTACK, RELEASE = 12, 36


def ease(u):  # Easing.inOut(Easing.sin)
    u = np.clip(u, 0, 1)
    e = lambda v: 1 - np.cos(v * np.pi / 2)
    return np.where(u < 0.5, e(2 * u) / 2, 1 - e(2 * (1 - u)) / 2)


g = np.ones(len(x))
for n, start, length in cues:
    DUCK = 10 ** (DUCK_DB.get(n, -4.5) / 20)
    a, b = start - ATTACK, start + length
    d = np.ones(len(x))
    d = np.where((t >= a) & (t < start), 1 + (DUCK - 1) * ease((t - a) / ATTACK), d)
    d = np.where((t >= start) & (t < b), DUCK, d)
    d = np.where((t >= b) & (t < b + RELEASE), DUCK + (1 - DUCK) * ease((t - b) / RELEASE), d)
    g = np.minimum(g, d)
g *= np.clip((DURATION - t) / 30, 0, 1)  # safety ramp, as before
g *= np.clip(np.arange(len(x)) / (0.008 * sr), 0, 1)  # 8 ms fade-in: no click on the first note
y = x * (0.9 * g)[:, None]
sf.write(f"{root}/public/music/score_ducked.wav", y, sr, subtype="PCM_24")
print("cues", cues, "peak dBFS", round(20 * np.log10(np.abs(y).max()), 2))
