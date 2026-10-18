"""Trace promo score — 'Your day, retraced.'

Original synthesis, 96 BPM, 4/4, D major. 20 bars (50.0 s) + tail to 52.0 s.
Every sound here is generated from scratch (additive / band-limited oscillators,
filtered noise, synthetic reverb IRs). No samples.
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy import signal
from scipy.ndimage import maximum_filter1d

SR = 48000
BPM = 96.0
BEAT = 60.0 / BPM          # 0.625 s
BAR = 4 * BEAT             # 2.5 s
STEP = BEAT / 4            # 16th = 0.15625 s
NBARS = 20
TOTAL = 52.0
N = int(round(TOTAL * SR))
T = np.arange(N) / SR

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "..", "public", "music"))  # video/public/music
STEMS = os.path.join(HERE, "stems")
os.makedirs(ASSETS, exist_ok=True)
os.makedirs(STEMS, exist_ok=True)

rng = np.random.default_rng(20261005)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def bt(bar, step=0.0):
    """Time (s) of a 16th step inside a 1-indexed bar."""
    return (bar - 1) * BAR + step * STEP


def stereo():
    return np.zeros((2, N))


def place(dst, sig, t0, gain=1.0, pan=0.0):
    """Mix mono/stereo `sig` into `dst` at t0 (s). Constant-power pan (-1..1)."""
    if sig.ndim == 1:
        th = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(th), sig * np.sin(th)]) * np.sqrt(2)
    i0 = int(round(t0 * SR))
    s0 = 0
    if i0 < 0:
        s0, i0 = -i0, 0
    n = min(sig.shape[1] - s0, N - i0)
    if n <= 0:
        return
    dst[:, i0:i0 + n] += gain * sig[:, s0:s0 + n]


def auto(points):
    """Piecewise-linear automation curve over the whole timeline."""
    ts, vs = zip(*points)
    return np.interp(T, ts, vs)


def smooth(x):
    return x * x * (3 - 2 * x)


# ---------------------------------------------------------------- filters
def rbj(kind, fc, q):
    fc = float(np.clip(fc, 10, SR * 0.45))
    w = 2 * np.pi * fc / SR
    cw, sw = np.cos(w), np.sin(w)
    al = sw / (2 * q)
    if kind == "lp":
        b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]
    elif kind == "hp":
        b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]
    else:  # band-pass, 0 dB peak
        b = [al, 0.0, -al]
    a = [1 + al, -2 * cw, 1 - al]
    return np.array(b) / a[0], np.array(a) / a[0]


def tv_filter(x, fc, q=0.707, kind="lp", blk=128):
    """Time-varying biquad (coefficients updated per block, state carried)."""
    y = np.empty_like(x)
    zi = np.zeros(2)
    for s in range(0, len(x), blk):
        e = min(s + blk, len(x))
        b, a = rbj(kind, fc[(s + e) // 2], q)
        y[s:e], zi = signal.lfilter(b, a, x[s:e], zi=zi)
    return y


def sos(kind, f, order=2):
    return signal.butter(order, f, btype=kind, fs=SR, output="sos")


def peaking(x, f0, gain_db, q=1.0):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    al = np.sin(w) / (2 * q)
    b = np.array([1 + al * A, -2 * np.cos(w), 1 - al * A])
    a = np.array([1 + al / A, -2 * np.cos(w), 1 - al / A])
    return signal.lfilter(b / a[0], a / a[0], x, axis=-1)


def high_shelf(x, f0, gain_db):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    al = np.sin(w) / 2 * np.sqrt(2)
    cw = np.cos(w)
    b = np.array([A * ((A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * al),
                  -2 * A * ((A - 1) + (A + 1) * cw),
                  A * ((A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * al)])
    a = np.array([(A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * al,
                  2 * ((A - 1) - (A + 1) * cw),
                  (A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * al])
    return signal.lfilter(b / a[0], a / a[0], x, axis=-1)


def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    return signal.lfilter([1 - a], [1, -a], x, axis=-1)


# ------------------------------------------------------------ instruments
_felt_cache = {}


def felt(m, vel, ring=4.0, dur=None, rel=0.22):
    """Felt piano: additive, slightly inharmonic, two detuned strings, soft
    hammer. Brightness tracks velocity (soft = darker, like a felt muted
    upright). Band-limited by construction (partials stop at 14 kHz)."""
    vq = round(vel * 20) / 20
    key = (m, vq, ring)
    if key not in _felt_cache:
        f = mtof(m)
        n = int(ring * SR)
        t = np.arange(n) / SR
        out = np.zeros(n)
        prng = np.random.default_rng(m * 100 + int(vq * 20))
        B = 0.00032
        bright = 0.9 + 2.2 * vq
        tau0 = 3.2 * (220.0 / f) ** 0.5
        for det in (-0.75, 0.8):
            fs = f * 2 ** (det / 1200)
            for k in range(1, 28):
                fk = fs * k * np.sqrt(1 + B * k * k)
                if fk > 14000:
                    break
                a = (1.0 / k ** 1.15) * np.exp(-(k - 1) / bright)
                if a < 1e-4:
                    break
                tau = tau0 / (1 + 0.45 * (k - 1) ** 1.1)
                env = 0.6 * np.exp(-t / (tau * 0.28)) + 0.4 * np.exp(-t / tau)
                out += a * env * np.sin(2 * np.pi * fk * t + prng.uniform(0, 2 * np.pi))
        out *= 0.5
        atk = 0.006 - 0.003 * vq
        out *= 1 - np.exp(-t / atk)
        # felt hammer thump + key noise
        th = prng.standard_normal(int(0.04 * SR))
        th = signal.sosfilt(sos("bandpass", [120, 1400]), th)
        th *= np.exp(-np.arange(len(th)) / SR / 0.007) * 0.05 * vq
        out[: len(th)] += th
        out *= vq ** 1.25
        _felt_cache[key] = out
    out = _felt_cache[key].copy()
    if dur is not None:
        t = np.arange(len(out)) / SR
        g = np.where(t < dur, 1.0, np.exp(-(t - dur) / rel))
        out *= g
        cut = min(len(out), int((dur + rel * 7) * SR))
        out = out[:cut]
    return out


def bell(m, vel, ring=3.2):
    """Soft glass bell / celesta: a few inharmonic sine partials."""
    f = mtof(m)
    n = int(ring * SR)
    t = np.arange(n) / SR
    parts = [(1.0, 1.0, 1.0), (2.0, 0.22, 0.55), (3.0, 0.07, 0.3),
             (4.17, 0.05, 0.16), (5.43, 0.02, 0.09)]
    out = np.zeros(n)
    sc = ring * 0.45 * (660.0 / f) ** 0.25
    prng = np.random.default_rng(m)
    for r, a, d in parts:
        if f * r > 15000:
            continue
        out += a * np.exp(-t / (d * sc)) * np.sin(2 * np.pi * f * r * t + prng.uniform(0, 6.28))
    out *= 1 - np.exp(-t / 0.0015)
    return out * vel


def bass_note(m, dur, vel, sub=0.0, rel=0.09):
    f = mtof(m)
    n = int((dur + rel * 6) * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * f * t
    x = np.sin(ph) + 0.20 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph) + 0.025 * np.sin(4 * ph)
    x = np.tanh(1.25 * x) / np.tanh(1.25)
    if sub:
        x += sub * np.sin(0.5 * ph)
    env = (1 - np.exp(-t / 0.006)) * (0.78 + 0.22 * np.exp(-t / 0.25))
    env *= np.where(t < dur, 1.0, np.exp(-(t - dur) / rel))
    return x * env * vel


def kick(vel):
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    f = 47 + 78 * np.exp(-t / 0.028) + 12 * np.exp(-t / 0.15)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.22) * (1 - np.exp(-t / 0.0009))
    body = np.tanh(1.6 * body) / np.tanh(1.6)
    click = signal.sosfilt(sos("bandpass", [900, 4000]), rng.standard_normal(n))
    click *= np.exp(-t / 0.0025) * 0.06
    x = body + click
    x[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    return x * vel


def _noise_hit(n, band, decay, seed, atk=0.0004):
    t = np.arange(n) / SR
    x = np.random.default_rng(seed).standard_normal(n)
    x = signal.sosfilt(band, x)
    return x * np.exp(-t / decay) * (1 - np.exp(-t / atk))


HAT_SOS = signal.butter(4, 7200, btype="highpass", fs=SR, output="sos")
HATS = [_noise_hit(int(0.25 * SR), HAT_SOS, 0.026, s) for s in range(6)]
SHAKER_SOS = signal.butter(2, [3500, 9500], btype="bandpass", fs=SR, output="sos")
SHAKERS = [_noise_hit(int(0.25 * SR), SHAKER_SOS, 0.045, 100 + s, atk=0.012) for s in range(6)]


def snap(vel, seed):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    x = np.random.default_rng(seed).standard_normal(n)
    x = signal.sosfilt(sos("bandpass", [800, 5200]), x)
    env = np.zeros(n)
    for k, off in enumerate((0.0, 0.0075, 0.016)):
        tt = t - off
        env += np.where(tt >= 0, np.exp(-np.maximum(tt, 0) / 0.0045), 0) * (0.8 ** k)
    env += 0.35 * np.exp(-t / 0.085) * (1 - np.exp(-t / 0.01))
    tone = 0.25 * np.sin(2 * np.pi * 205 * t) * np.exp(-t / 0.04)
    return (x * env + tone) * vel


def saw_blep(f, n, ph0, drift_ph):
    """PolyBLEP saw with slow analogue drift (band-limited)."""
    t = np.arange(n) / SR
    fr = f * 2 ** ((2.5 * np.sin(2 * np.pi * 0.11 * t + drift_ph)) / 1200)
    dt = fr / SR
    ph = (ph0 + np.cumsum(dt)) % 1.0
    y = 2 * ph - 1
    lo = ph < dt
    x = ph[lo] / dt[lo]
    y[lo] -= x + x - x * x - 1
    hi = ph > 1 - dt
    x = (ph[hi] - 1) / dt[hi]
    y[hi] -= x * x + x + x + 1
    return y


# --------------------------------------------------------------- effects
def chorus(x, base=0.014, depth=0.0022, rates=(0.23, 0.29), mix=0.45):
    n = x.shape[1]
    idx = np.arange(n, dtype=float)
    out = np.empty_like(x)
    for c in range(2):
        d = (base + depth * np.sin(2 * np.pi * rates[c] * T[:n] + c * 1.7)) * SR
        wet = np.interp(idx - d, idx, x[c], left=0.0)
        out[c] = x[c] * (1 - mix * 0.4) + wet * mix
    return out


def make_ir(rt60, length, predelay, seed, width=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    bands = [(None, 400, rt60 * 1.15), (400, 2200, rt60), (2200, 6500, rt60 * 0.65),
             (6500, None, rt60 * 0.35)]
    ir = np.zeros((2, n))
    for c in range(2):
        nz = r.standard_normal(n)
        for lo, hi, rt in bands:
            if lo is None:
                b = sos("lowpass", hi, 4)
            elif hi is None:
                b = sos("highpass", lo, 4)
            else:
                b = sos("bandpass", [lo, hi], 4)
            ir[c] += signal.sosfilt(b, nz) * np.exp(-6.91 * t / rt)
    ir *= 1 - np.exp(-t / 0.012)  # soft build-up, no hard onset
    # a handful of early reflections
    for k in range(10):
        d = int((0.006 + 0.0045 * k + r.uniform(0, 0.004)) * SR)
        for c in range(2):
            ir[c, d] += r.uniform(0.2, 0.45) * (0.85 ** k) * r.choice([-1, 1])
    m = ir.mean(axis=0)
    ir = m + width * (ir - m)
    pd = int(predelay * SR)
    ir = np.concatenate([np.zeros((2, pd)), ir], axis=1)
    ir /= np.sqrt((ir ** 2).sum() / 2)
    return ir


def reverb(x, ir):
    mono = x.mean(axis=0)
    wet = np.stack([signal.fftconvolve(mono, ir[c])[:N] for c in range(2)])
    # keep some stereo information from the input
    side = (x[0] - x[1]) * 0.5
    wet[0] += 0.35 * signal.fftconvolve(side, ir[0])[:N]
    wet[1] -= 0.35 * signal.fftconvolve(side, ir[1])[:N]
    return signal.sosfilt(sos("highpass", 180), wet, axis=-1)


def pingpong(x, delay, fb=0.38, taps=7, lp=4500):
    out = np.zeros_like(x)
    d = int(round(delay * SR))
    src = x.mean(axis=0)
    g = 1.0
    cur = src.copy()
    for k in range(1, taps + 1):
        g *= fb
        cur = onepole_lp(cur, lp)
        sh = k * d
        if sh >= N:
            break
        ch = (k + 1) % 2
        out[ch, sh:] += g * cur[: N - sh]
    return out


# ============================================================== arrangement
# One chord per bar (bar 19 splits Asus4 -> A on beat 3).
CHORDS = {1: "D", 2: "G", 3: "D", 4: "G",
          5: "D", 6: "A", 7: "Bm", 8: "G", 9: "D", 10: "A", 11: "Bm", 12: "G", 13: "Em",
          14: "Bm", 15: "G", 16: "Asus",
          17: "G", 18: "Bm", 19: "Asus|A", 20: "Dfin"}
PAD = {"D": [54, 57, 61, 64], "G": [54, 57, 59, 62], "A": [52, 57, 61, 64],
       "Bm": [54, 57, 62, 64], "Em": [55, 59, 62, 66], "Asus": [55, 57, 62, 64],
       "A7": [55, 57, 61, 64], "Dfin": [54, 57, 62, 64, 69]}
FIFTH = {"D": 45, "A": 40, "Bm": 42, "G": 38, "Em": 47}
ROOT = {"D": 38, "G": 31, "A": 37, "Bm": 35, "Em": 40, "Asus": 33, "A7": 33, "Dfin": 38}
CELL = {"D": [78, 76, 69, 74, 76, 69], "G": [78, 74, 71, 74, 76, 69],
        "A": [76, 73, 69, 73, 76, 71], "Bm": [78, 74, 69, 74, 76, 73],
        "Em": [78, 74, 71, 74, 76, 71], "Asus": [76, 74, 69, 74, 76, 71],
        "Asus|A": [76, 74, 69, 73, 76, 73]}
CELL_STEPS = [0, 3, 6, 8, 11, 14]
CELL_ACC = [1.0, 0.82, 0.88, 0.95, 0.8, 0.86]

SECTIONS = [
    ("intro", 1, 2, "Sparse intro: felt-piano motif + pad (S1 hook)"),
    ("enter", 3, 4, "Bass + soft kick enter (S2 reveal)"),
    ("groove", 5, 13, "Full warm groove (S3 today, S4 journey, S5 history, S6 places)"),
    ("breakdown", 14, 16, "Breakdown: filter down, kick out, intimate (S7 privacy/night)"),
    ("lift", 17, 19, "Lift with shimmer into end card (S8)"),
    ("resolve", 20, 20, "Final Dmaj9 chord, rings to silence by 52.0 s"),
]


def section_of(bar):
    for name, a, b, _ in SECTIONS:
        if a <= bar <= b:
            return name


def build():
    hum = np.random.default_rng(42)
    piano = stereo()
    pad_raw = stereo()
    bass = stereo()
    kicks = stereo()
    hats = stereo()
    perc = stereo()
    bells = stereo()
    fx = stereo()
    kick_times = []

    # ---------------- felt piano motif
    for bar in range(1, 20):
        ch = CHORDS[bar]
        sec = section_of(bar)
        cell = CELL[ch]
        if sec == "breakdown":
            # intimate: an octave down, three notes, long and soft
            steps = [0, 6, 11] if bar < 16 else [0, 6]
            for i, s in enumerate(steps):
                m = cell[[0, 2, 3][i]] - 12
                v = 0.36 - 0.04 * i + hum.uniform(-0.02, 0.02)
                place(piano, felt(m, v, ring=5.0, dur=2.2, rel=0.6),
                      bt(bar, s) + hum.uniform(-0.004, 0.006), pan=(m - 64) / 40)
            continue
        if sec == "intro":
            base = 0.40 + 0.04 * (bar - 1)
        elif sec == "enter":
            base = 0.50
        elif sec == "lift":
            base = 0.56 + 0.03 * (bar - 17)
        else:
            base = 0.54
        for i, s in enumerate(CELL_STEPS):
            m = cell[i]
            v = base * CELL_ACC[i] + hum.uniform(-0.03, 0.03)
            dur = 0.9 if sec != "intro" else 1.6
            t0 = bt(bar, s) + (0 if (bar == 1 and s == 0) else hum.uniform(-0.004, 0.006))
            place(piano, felt(m, v, dur=dur, rel=0.3), t0, pan=(m - 72) / 22)
    # intro left hand: a low open fifth to ground the hook
    for bar, notes in ((1, [50, 57]), (2, [43, 50])):
        for k, m in enumerate(notes):
            place(piano, felt(m, 0.34, ring=5.0, dur=2.4, rel=0.5), bt(bar) + 0.012 * k,
                  pan=-0.15)
    # final chord, rolled
    for k, m in enumerate([50, 57, 64, 66, 69, 74, 78]):
        place(piano, felt(m, 0.58 - 0.02 * k, ring=6.0, dur=4.8, rel=1.2),
              bt(20) + 0.014 * k, pan=(m - 64) / 30)

    # ---------------- pad (supersaw-ish, 5-voice unison, polyBLEP)
    detunes = [-11, -5, 0, 5.5, 12]
    pans = [-0.85, -0.4, 0.0, 0.4, 0.85]
    segs = []
    for bar in range(1, 21):
        ch = CHORDS[bar]
        if "|" in ch:
            a, b = ch.split("|")
            segs.append((bt(bar), BAR / 2, a))
            segs.append((bt(bar, 8), BAR / 2, "A7"))
        else:
            segs.append((bt(bar), BAR if bar < 20 else 4.6, ch))
    for t0, dur, ch in segs:
        atk = 1.4 if t0 == 0 else 0.35
        rel = 0.9 if t0 < bt(20) else 1.5
        start = max(0.0, t0 - (0.12 if t0 > 0 else 0))
        n = int((dur + rel * 4 + 0.12) * SR)
        t = np.arange(n) / SR
        env = np.clip(t / atk, 0, 1)
        env = smooth(env)
        off = dur + (t0 - start)
        env *= np.where(t < off, 1.0, np.exp(-(t - off) / rel))
        for m in PAD[ch]:
            f = mtof(m)
            for d, p in zip(detunes, pans):
                y = saw_blep(f * 2 ** (d / 1200), n, rng.uniform(), rng.uniform(0, 6.28))
                y += 0.6 * np.sin(2 * np.pi * f * 2 ** (d / 1200) * t + rng.uniform(0, 6.28))
                place(pad_raw, y * env * 0.06, start, pan=p)

    # ---------------- bass
    for bar in range(3, 21):
        ch = CHORDS[bar]
        sec = section_of(bar)
        if sec == "enter":
            place(bass, bass_note(ROOT[ch], BAR - 0.08, 0.75 if bar == 3 else 0.8), bt(bar))
        elif sec == "groove":
            r = ROOT[ch]
            # pickup on step 14 = the chord's own fifth (never the bass note's fifth)
            pat = [(0, 5, 0, 0.9), (6, 1.6, 0, 0.6), (8, 5, 0, 0.82),
                   (14, 1.6, FIFTH[ch] - r, 0.55)]
            if bar == 13:
                pat = [(0, 5, 0, 0.9), (6, 1.6, 0, 0.6), (8, 7.5, 0, 0.8)]
            for s, ln, iv, v in pat:
                place(bass, bass_note(r + iv, ln * STEP, v), bt(bar, s))
        elif sec == "breakdown":
            place(bass, bass_note(ROOT[ch], BAR - 0.05, 0.36, rel=0.3), bt(bar))
        elif sec == "lift":
            if bar == 19:
                for s in range(0, 16, 2):
                    r = ROOT["Asus"]
                    place(bass, bass_note(r, 1.7 * STEP, 0.62 + 0.012 * s), bt(bar, s))
            else:
                r = ROOT[ch]
                for s in range(0, 16, 2):
                    v = 0.7 if s % 4 == 0 else 0.55
                    place(bass, bass_note(r, 1.7 * STEP, v), bt(bar, s))
        elif sec == "resolve":
            place(bass, bass_note(38, 3.6, 0.85, sub=0.25, rel=0.8), bt(20))

    # ---------------- drums
    def K(bar, s, v):
        t0 = bt(bar, s)
        kick_times.append(t0)
        place(kicks, kick(v), t0)

    for bar in range(3, 21):
        sec = section_of(bar)
        if sec == "enter":
            K(bar, 0, 0.55)
            K(bar, 8, 0.45)
        elif sec == "groove":
            K(bar, 0, 0.8)
            K(bar, 8, 0.72)
            if bar >= 8 and bar != 13:
                K(bar, 11, 0.42)
        elif sec == "lift":
            for s in (0, 4, 8, 12):
                K(bar, s, (0.66 if s % 8 == 0 else 0.56) + 0.03 * (bar - 17))
        elif sec == "resolve":
            K(bar, 0, 0.85)

    hat_i = 0
    for bar in range(5, 20):
        sec = section_of(bar)
        if sec == "groove":
            sixteenths = bar >= 8
            last = 16 if bar != 13 else 8
            for s in range(last):
                if not sixteenths and s % 2 == 0:
                    continue
                acc = {0: 0.30, 1: 0.14, 2: 0.55, 3: 0.18}[s % 4] if sixteenths else 0.5
                sw = 0.11 * STEP if s % 2 == 1 else 0.0
                v = acc * hum.uniform(0.85, 1.1)
                place(hats, HATS[hat_i % 6], bt(bar, s) + sw, gain=v,
                      pan=0.25 + 0.08 * hum.uniform(-1, 1))
                hat_i += 1
                if bar >= 10 and s % 2 == 0:
                    place(perc, SHAKERS[hat_i % 6], bt(bar, s) + 0.004,
                          gain=0.32 * (1.0 if s % 4 == 2 else 0.6), pan=-0.35)
            if bar >= 8:
                for s in (4, 12):
                    if bar == 13 and s == 12:
                        continue
                    place(perc, snap(0.5, bar * 10 + s), bt(bar, s), pan=0.05)
        elif sec == "lift":
            for s in range(16):
                acc = {0: 0.30, 1: 0.15, 2: 0.55, 3: 0.2}[s % 4] * (0.9 + 0.08 * (bar - 17))
                sw = 0.11 * STEP if s % 2 == 1 else 0.0
                place(hats, HATS[hat_i % 6], bt(bar, s) + sw, gain=acc * hum.uniform(0.85, 1.1),
                      pan=0.25)
                hat_i += 1
                if s % 2 == 0:
                    place(perc, SHAKERS[hat_i % 6], bt(bar, s), gain=0.3, pan=-0.35)
            for s in (4, 12):
                place(perc, snap(0.55, bar * 10 + s), bt(bar, s), pan=0.05)

    # ---------------- bells: counter-melody (bars 10-13), shimmer (17-20)
    counter = {10: [(0, 81, 6), (8, 85, 8)], 11: [(0, 86, 6), (8, 85, 8)],
               12: [(0, 83, 6), (8, 81, 8)], 13: [(0, 83, 4), (6, 79, 2), (8, 78, 8)]}
    for bar, notes in counter.items():
        for s, m, _ in notes:
            place(bells, bell(m, 0.30, ring=3.0), bt(bar, s), pan=-0.3)
    for bar in (17, 18, 19):
        ch = CHORDS[bar]
        for i, s in enumerate(CELL_STEPS):
            m = CELL[ch][i] + 12
            place(bells, bell(m, 0.17, ring=2.2), bt(bar, s), pan=0.35)
        # shimmer arpeggio, rising density
        voic = PAD["Asus" if bar == 19 else ch]
        order = [0, 1, 2, 3, 2, 1, 3, 2] * 2
        for s in range(16):
            if bar == 17 and s % 2 == 1:
                continue
            vc = PAD["A7"] if (bar == 19 and s >= 8) else voic
            m = vc[order[s] % len(vc)] + 24
            v = 0.05 + 0.07 * ((bar - 17) * 16 + s) / 48
            place(bells, bell(m, v, ring=1.6), bt(bar, s) + 0.003, pan=0.7 * np.sin(s * 0.9))
    for bar, s, m, v in ((1, 0, 90, 0.10), (1, 8, 88, 0.06), (2, 0, 86, 0.09), (2, 8, 90, 0.06),
                         (3, 0, 90, 0.07), (4, 0, 86, 0.06)):
        place(bells, bell(m, v, ring=3.5), bt(bar, s) + 0.01, pan=0.5 if s else -0.5)
    for m, v in ((78, 0.32), (81, 0.22), (86, 0.12)):
        place(bells, bell(m, v, ring=4.5), bt(20) + 0.02, pan=0.2)

    # ---------------- transition FX (all land exactly on scene boundaries)
    def swell(t_end, length, f0, f1, level, pan=0.0):
        n = int(length * SR)
        t = np.arange(n) / SR
        x = rng.standard_normal(n)
        fc = f0 * (f1 / f0) ** (t / length)
        full = np.zeros(N)
        full[:n] = fc  # tv_filter samples fc by index
        y = tv_filter(x, full[:n], q=1.4, kind="bp")
        env = (t / length) ** 2.2
        env[-int(0.006 * SR):] *= np.linspace(1, 0, int(0.006 * SR))
        place(fx, y * env * level, t_end - length, pan=pan)

    swell(bt(5), BAR, 250, 5500, 0.10)          # into the groove (10.0 s)
    swell(bt(8), BEAT * 2, 600, 7000, 0.045, -0.4)   # S3 -> S4 (17.5 s)
    swell(bt(10), BEAT * 2, 600, 7000, 0.045, 0.4)   # S4 -> S5 (22.5 s)
    swell(bt(12), BEAT * 2, 600, 7000, 0.045, -0.4)  # S5 -> S6 (27.5 s)
    swell(bt(17), BAR, 200, 9000, 0.17)          # into the end card (40.0 s)

    # downlifter at the breakdown (32.5 s)
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    y = tv_filter(rng.standard_normal(n), 5000 * (300 / 5000) ** (t / 1.8), q=1.2, kind="bp")
    y *= np.exp(-t / 0.5) * (1 - np.exp(-t / 0.01)) * 0.12
    place(fx, y, bt(14))

    # soft sub impacts
    def impact(t0, level):
        n = int(2.0 * SR)
        t = np.arange(n) / SR
        f = 38 + 50 * np.exp(-t / 0.08)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.55) * (1 - np.exp(-t / 0.002))
        place(fx, y * level, t0)

    impact(bt(5), 0.20)
    impact(bt(17), 0.30)
    impact(bt(20), 0.26)

    return dict(piano=piano, pad_raw=pad_raw, bass=bass, kicks=kicks, hats=hats, perc=perc,
                bells=bells, fx=fx), sorted(kick_times)


def sidechain(kick_times, depth_curve, rel=0.17):
    g = np.ones(N)
    L = int(0.6 * SR)
    t = np.arange(L) / SR
    shape = np.exp(-t / rel) * (1 - np.exp(-t / 0.006)) / 0.95
    shape = np.clip(shape, 0, 1)
    for tk in kick_times:
        i = int(round(tk * SR))
        d = depth_curve[min(i, N - 1)]
        seg = slice(i, min(N, i + L))
        g[seg] = np.minimum(g[seg], 1 - d * shape[: seg.stop - seg.start])
    return g


# ============================================================ loudness
def lufs(x):
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    y = signal.lfilter(b2, a2, signal.lfilter(b1, a1, x, axis=-1), axis=-1)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    p = y ** 2
    cs = np.concatenate([np.zeros((2, 1)), np.cumsum(p, axis=1)], axis=1)
    starts = np.arange(0, x.shape[1] - blk + 1, hop)
    z = ((cs[:, starts + blk] - cs[:, starts]) / blk).sum(axis=0)
    with np.errstate(divide="ignore"):
        lk = -0.691 + 10 * np.log10(z)
    z = z[lk > -70]
    rel = -0.691 + 10 * np.log10(z.mean()) - 10
    z = z[(-0.691 + 10 * np.log10(z)) > rel]
    return -0.691 + 10 * np.log10(z.mean())


def true_peak_db(x):
    up = signal.resample_poly(x, 4, 1, axis=-1)
    return 20 * np.log10(np.abs(up).max())


def limiter(x, ceiling_db=-1.6, look=0.003, rel=0.12):
    c = 10 ** (ceiling_db / 20)
    up = signal.resample_poly(x, 4, 1, axis=-1)
    pk = np.abs(up).max(axis=0).reshape(-1, 4).max(axis=1)[: x.shape[1]]
    w = int(look * SR)
    pk = maximum_filter1d(pk, size=2 * w + 1)
    need = np.minimum(1.0, c / np.maximum(pk, 1e-9))
    # instant attack (already look-ahead via max filter), smooth release
    a = np.exp(-1 / (rel * SR))
    g = need.copy()
    # release smoothing: one-pole on the gain, but never above `need`
    sm = signal.lfilter([1 - a], [1, -a], need, zi=[need[0] * a])[0]
    g = np.minimum(need, sm)
    g = signal.lfilter([1 - np.exp(-1 / (0.0015 * SR))], [1, -np.exp(-1 / (0.0015 * SR))], g,
                       zi=[g[0] * np.exp(-1 / (0.0015 * SR))])[0]
    g = np.minimum(g, maximum_filter1d(g, 1))
    return x * g


# =================================================================== mix
def main():
    stems, kick_times = build()
    print(f"kicks scheduled: {len(kick_times)}", file=sys.stderr)

    # pad: time-varying filter (the 'breathing' of the film)
    pad_fc = auto([(0, 900), (5, 1300), (9.5, 1500), (10, 2300), (20, 2900), (25, 2500),
                   (32.3, 3100), (33.5, 900), (36, 600), (38.8, 700), (40, 2200),
                   (45, 3800), (47.5, 4200), (49, 2400), (52, 1200)])
    # slow LFO movement on top
    pad_fc *= 2 ** (0.18 * np.sin(2 * np.pi * T / (BAR * 2)))
    pad = np.stack([tv_filter(stems["pad_raw"][c], pad_fc, q=0.9) for c in range(2)])
    pad = chorus(pad, mix=0.35)
    pad = signal.sosfilt(sos("highpass", 140, 2), pad, axis=-1)
    pad = peaking(pad, 300, -2.5, 0.9)
    sc_depth = auto([(0, 0), (5, 0.18), (9.99, 0.18), (10, 0.42), (32.49, 0.42), (32.5, 0),
                     (39.99, 0), (40, 0.48), (47.49, 0.48), (47.5, 0.3), (52, 0.3)])
    sc = sidechain(kick_times, sc_depth)
    pad *= sc
    pad *= auto([(0, 0.8), (5, 0.85), (10, 0.75), (32.5, 0.8), (40, 0.85), (52, 0.95)])

    piano = chorus(stems["piano"], base=0.011, depth=0.0012, mix=0.25)
    # breakdown: dull the piano a touch (felt mute)
    pf = auto([(0, 16000), (32.4, 16000), (33.2, 3800), (39.6, 3800), (40, 16000), (52, 16000)])
    piano = np.stack([tv_filter(piano[c], pf, q=0.6) for c in range(2)])
    piano = peaking(piano, 280, -2.0, 0.9)

    bass = stems["bass"] * (1 - 0.5 * (1 - sc))
    bass = signal.sosfilt(sos("lowpass", 1800), bass, axis=-1)

    G = dict(piano=1.0, pad=1.0, bass=0.45, kicks=0.7, hats=0.42, perc=0.4, bells=0.42,
             fx=1.0)
    piano *= G["piano"]
    pad *= G["pad"]
    bass *= G["bass"]
    kicks = stems["kicks"] * G["kicks"]
    hats = signal.sosfilt(sos("lowpass", 13500), stems["hats"], axis=-1) * G["hats"]
    perc = stems["perc"] * G["perc"]
    bells = stems["bells"] * G["bells"]
    fx = stems["fx"] * G["fx"]

    # sends
    plate = make_ir(1.9, 3.5, 0.018, 1, width=1.0)
    hall = make_ir(4.6, 7.0, 0.035, 2, width=1.0)
    piano_send = auto([(0, 0.40), (5, 0.30), (10, 0.24), (32.5, 0.5), (40, 0.32), (47.5, 0.42),
                       (52, 0.42)])
    plate_in = piano * piano_send + pad * 0.12 + perc * 0.35 + hats * 0.08
    hall_in = (bells * 0.75 + piano * auto([(0, 0.25), (10, 0.10), (32.5, 0.35), (40, 0.22),
                                              (52, 0.35)])
               + fx * 0.5 + pad * 0.1)
    wet_plate = reverb(plate_in, plate) * 0.55
    wet_hall = reverb(hall_in, hall) * 0.5
    delays = pingpong(bells * 0.6 + piano * auto([(0, 0.06), (32.5, 0.14), (40, 0.05),
                                                  (52, 0.05)]),
                      0.75 * BEAT, fb=0.36)

    stems_out = dict(piano=piano, pad=pad, bass=bass, kicks=kicks, hats=hats, perc=perc,
                     bells=bells, fx=fx, plate=wet_plate, hall=wet_hall, delay=delays)
    mix = sum(stems_out.values())

    # master: clean the sub, gentle tilt, fades
    mix = signal.sosfilt(sos("highpass", 30, 2), mix, axis=-1)
    mix = high_shelf(mix, 7500, 2.0)
    fade = np.ones(N)
    a, b = int(48.6 * SR), N
    xx = np.linspace(0, 1, b - a)
    fade[a:b] = np.cos(xx * np.pi / 2) ** 2.4
    fade[:int(0.004 * SR)] = np.linspace(0, 1, int(0.004 * SR))
    mix *= fade
    mix -= mix.mean(axis=1, keepdims=True)  # DC

    # per-stem report (groove section)
    g0, g1 = int(10 * SR), int(32.5 * SR)
    for k, v in stems_out.items():
        seg = v[:, g0:g1]
        print(f"  {k:6s} groove-rms {20*np.log10(np.sqrt((seg**2).mean())+1e-12):7.1f} dBFS",
              file=sys.stderr)

    # loudness: normalise to -18 LUFS, limit true peak below -1 dBTP
    target = -18.0
    for _ in range(4):
        L = lufs(mix)
        mix *= 10 ** ((target - L) / 20)
        tp = true_peak_db(mix)
        if tp <= -1.3:
            break
        mix = limiter(mix, ceiling_db=-1.6)
    mix *= fade  # make sure the end is truly silent
    L = lufs(mix)
    tp = true_peak_db(mix)
    print(f"integrated {L:.2f} LUFS, true peak {tp:.2f} dBTP", file=sys.stderr)

    out = os.path.join(ASSETS, "score.wav")
    sf.write(out, mix.T.astype(np.float32), SR, subtype="PCM_24")
    if "--stems" in sys.argv:
        for k, v in stems_out.items():
            sf.write(os.path.join(STEMS, f"{k}.wav"), v.T.astype(np.float32), SR, subtype="FLOAT")
        sf.write(os.path.join(STEMS, "kick_only.wav"), kicks.T.astype(np.float32), SR,
                 subtype="FLOAT")

    bars = [{"bar": b, "start_s": round(bt(b), 4), "start_frame_60": int(round(bt(b) * 60)),
             "chord": CHORDS[b], "section": section_of(b)} for b in range(1, 21)]
    sections = [{"name": n, "bars": [a, b], "start_s": bt(a), "end_s": bt(b + 1),
                 "start_frame_60": int(round(bt(a) * 60)),
                 "end_frame_60": int(round(bt(b + 1) * 60)), "note": d}
                for n, a, b, d in SECTIONS]
    sections[-1]["tail_end_s"] = TOTAL
    sections[-1]["tail_end_frame_60"] = int(TOTAL * 60)
    cues = {"file": out, "sample_rate": SR, "bit_depth": 24, "channels": 2,
            "duration_s": TOTAL, "bpm": BPM, "meter": "4/4", "key": "D major",
            "bar_s": BAR, "bar_frames_60": int(BAR * 60),
            "integrated_lufs": round(L, 2), "true_peak_dbtp": round(tp, 2),
            "ducking": "none applied (editor ducks under VO)",
            "sections": sections, "bars": bars,
            "kick_times_s": [round(k, 4) for k in kick_times],
            "transition_fx": {"swell_into_s": [10.0, 17.5, 22.5, 27.5, 40.0],
                              "downlifter_at_s": 32.5, "sub_impacts_s": [10.0, 40.0, 47.5]}}
    with open(os.path.join(ASSETS, "score.cues.json"), "w") as fh:
        json.dump(cues, fh, indent=2)
    print(out)


if __name__ == "__main__":
    main()
