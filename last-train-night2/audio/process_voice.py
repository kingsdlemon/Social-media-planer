"""Build voice stems + timeline + word timestamps.
usage: process_voice.py MODELS WORKDIR OUTDIR"""
import sys, os, json, re, difflib, subprocess, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(__file__))
from script import LINES, EXTRA_GAP
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly
M, W, OUT = sys.argv[1:4]
os.makedirs(W, exist_ok=True); os.makedirs(OUT, exist_ok=True)
SR = 48000
from kokoro_onnx import Kokoro
k = Kokoro(M+'/kokoro-v1.0.onnx', M+'/voices-v1.0.bin')
narr = 0.75*k.get_voice_style('am_onyx') + 0.25*k.get_voice_style('am_michael')
sis = k.get_voice_style('af_nicole')
rng = np.random.default_rng(7)

def tts(txt, style, speed):
    a, sr = k.create(txt, voice=style, speed=speed, lang='en-us')
    return resample_poly(a, SR, sr).astype(np.float32)

def env(a, win=480):
    return np.sqrt(np.convolve(a**2, np.ones(win)/win, 'same'))

def trim_pauses(a, maxp=0.38, thr=0.012, pad=0.04):
    e = env(a); voiced = e > thr
    idx = np.where(voiced)[0]
    if len(idx) == 0: return a
    s0, s1 = max(0, idx[0]-int(pad*SR)), min(len(a), idx[-1]+int(pad*SR))
    a = a[s0:s1]; voiced = voiced[s0:s1]
    out = []; i = 0; n = len(a)
    while i < n:
        if not voiced[i]:
            j = i
            while j < n and not voiced[j]: j += 1
            L = j-i
            keep = min(L, int(maxp*SR))
            seg = a[i:i+keep]
            out.append(seg); i = j
        else:
            j = i
            while j < n and voiced[j]: j += 1
            out.append(a[i:j]); i = j
    return np.concatenate(out)

def rubber(a, tempo=1.0, pitch=1.0):
    fi, fo = W+'/rb_in.wav', W+'/rb_out.wav'
    sf.write(fi, a, SR)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',fi,'-af',
        f'rubberband=tempo={tempo}:pitch={pitch}:formant=preserved:transients=smooth', fo], check=True)
    b, _ = sf.read(fo, dtype='float32'); return b

def compress(a, thr_db=-20, ratio=3.0, att=0.005, rel=0.08):
    e = np.abs(a); g = np.ones_like(a); lv = 0.0
    aa, rr = np.exp(-1/(att*SR)), np.exp(-1/(rel*SR))
    lev = np.empty_like(a)
    for i, x in enumerate(e):
        c = aa if x > lv else rr; lv = c*lv + (1-c)*x; lev[i] = lv
    db = 20*np.log10(lev+1e-9)
    over = np.maximum(0, db-thr_db)
    gdb = -over*(1-1/ratio)
    return a*10**(gdb/20)

def reverb_ir(t60=0.6, dur=1.2, pre=0.012, seed=1):
    r = np.random.default_rng(seed); n = int(dur*SR)
    t = np.arange(n)/SR
    ir = r.standard_normal(n)*np.exp(-6.9*t/t60)
    ir = sosfilt(butter(2, [200, 6000], 'band', fs=SR, output='sos'), ir)
    ir = np.concatenate([np.zeros(int(pre*SR)), ir]); ir /= np.sqrt(np.sum(ir**2))
    return ir

def whisperize(a, n=1024, hop=256):
    win = np.hanning(n); out = np.zeros(len(a)+n); wsum = np.zeros(len(a)+n)
    for i in range(0, len(a)-n, hop):
        X = np.fft.rfft(a[i:i+n]*win)
        ph = np.exp(1j*rng.uniform(0, 2*np.pi, len(X)))
        y = np.fft.irfft(np.abs(X)*ph)*win
        out[i:i+n] += y; wsum[i:i+n] += win**2
    return (out/np.maximum(wsum, 1e-3))[:len(a)]

def echo(a, delay, fb, n, lp=4000):
    out = np.concatenate([a, np.zeros(int(delay*SR*n)+SR)])
    sos = butter(2, lp, 'low', fs=SR, output='sos')
    tap = a.copy()
    for i in range(1, n+1):
        tap = sosfilt(sos, tap)*fb
        d = int(delay*SR*i); out[d:d+len(tap)] += tap
    return out

def gong():
    t = np.arange(int(1.6*SR))/SR; out = np.zeros(int(2.4*SR))
    for k_, f in enumerate([659.25, 523.25]):  # E5 -> C5
        s = sum(np.sin(2*np.pi*f*m*t)*w for m, w in [(1, 1), (2.0, .35), (3.01, .12), (4.2, .05)])
        s *= np.exp(-t*2.2)*np.minimum(1, t*200)
        o = int(k_*0.55*SR); out[o:o+len(s)] += s*0.45
    return out.astype(np.float32)

def radio(a):
    a = sosfilt(butter(4, [550, 3000], 'band', fs=SR, output='sos'), a)
    a = np.tanh(a*4)/np.tanh(4) * 0.8
    t = np.arange(len(a))/SR; a *= 0.82+0.18*np.sin(2*np.pi*7.5*t)
    a = a + 0.004*rng.standard_normal(len(a))*sosfilt(butter(2,[800,4000],'band',fs=SR,output='sos'),np.ones(len(a)))
    return echo(a, 0.21, 0.42, 5, 3000)

from faster_whisper import WhisperModel
WM = WhisperModel('small.en', device='cpu', compute_type='int8')
# ---------- generate units ----------
units = []  # (line_index, who, audio, text_for_words)
for i, (who, txt) in enumerate(LINES):
    if i in (8, 16):  # counting lines: each number separately
        nums = re.findall(r'[A-Za-z]+', txt)
        if i == 8:
            for j, w in enumerate(nums):
                a = tts(w+'.', narr, 0.95); a = trim_pauses(a); a = rubber(a, 1.05)
                units.append(dict(line=i, who=who, sub=j, audio=a, text=w))
            continue
        full = tts(txt, narr, 0.95)
        a16 = resample_poly(full, 1, 3).astype(np.float32)
        sg, _ = WM.transcribe(a16, word_timestamps=True, language='en')
        ww = [w for x in sg for w in x.words]
        assert len(ww) == len(nums), (txt, [w.word for w in ww])
        ev = env(full, 240); cuts = [0]
        for q in range(len(ww)-1):
            lo, hi = int((ww[q].end-0.12)*SR), int((ww[q+1].start+0.08)*SR)
            cuts.append(lo+int(np.argmin(ev[lo:hi])))
        cuts.append(len(full))
        runs = [[cuts[q], cuts[q+1]] for q in range(len(nums))]
        for j, w in enumerate(nums):
            r0, r1 = runs[j]
            a = trim_pauses(full[r0:r1]); a = rubber(a, 1.05)
            units.append(dict(line=i, who=who, sub=j, audio=a, text=w))
        continue
    if who == 'SIS':
        a = tts(txt, sis, 0.82); a = trim_pauses(a, 0.3)
        a = rubber(a, 1.0, 2**(2.5/12))
    else:
        a = tts(txt, narr, 1.0); a = trim_pauses(a, 0.50); a = rubber(a, 1.1)
    units.append(dict(line=i, who=who, sub=0, audio=a, text=txt))

# ---------- timeline ----------
INTRO = 1.6   # vote card before first line
GAP = 0.45
COUNT_GAP = {8: 0.80, 16: 0.75}
t = INTRO; timeline = []
for u in units:
    if u['who'] == 'SPK':
        t += 1.25  # room for gong
    u['start'] = t; u['dur'] = len(u['audio'])/SR
    t += u['dur']
    nxt_same = any(v['line'] == u['line'] and v['sub'] == u['sub']+1 for v in units)
    if nxt_same: t += COUNT_GAP[u['line']]
    else: t += GAP + EXTRA_GAP.get(u['line'], 0) + (0.4 if u['who']=='SIS' else 0)
VO_END = t
print('voice end %.2f' % VO_END)

# ---------- whisper word timestamps per unit ----------
wm = WM
def norm(w): return re.sub(r"[^a-z0-9']", '', w.lower())
words_all = []
for u in units:
    a16 = resample_poly(u['audio'], 1, 3).astype(np.float32)
    segs, _ = wm.transcribe(a16, word_timestamps=True, language='en', beam_size=5)
    ww = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    script_words = u['text'].split()
    sw = [norm(x) for x in script_words]; hw = [norm(x[0]) for x in ww]
    times = [None]*len(sw)
    sm = difflib.SequenceMatcher(None, sw, hw, autojunk=False)
    for a0, b0, n in sm.get_matching_blocks():
        for q in range(n): times[a0+q] = (ww[b0+q][1], ww[b0+q][2])
    # replace-blocks with equal length -> map 1:1; else spread
    for tag, a0, a1, b0, b1 in sm.get_opcodes():
        if tag == 'replace' and b1 > b0:
            s0, e0 = ww[b0][1], ww[b1-1][2]
            L = a1-a0
            for q in range(L):
                times[a0+q] = (s0+(e0-s0)*q/L, s0+(e0-s0)*(q+1)/L)
    # interpolate remaining
    dur = u['dur']
    for q in range(len(times)):
        if times[q] is None:
            prev = times[q-1][1] if q > 0 and times[q-1] else 0.0
            nx = next((times[r][0] for r in range(q+1, len(times)) if times[r]), dur)
            times[q] = (prev, prev+(nx-prev)*0.5)
    hyp = ' '.join(x[0] for x in ww)
    if sm.ratio() < 0.9: print('  ! line', u['line'], 'heard:', hyp)
    for q, w in enumerate(script_words):
        words_all.append(dict(line=u['line'], who=u['who'], w=w,
            s=round(u['start']+times[q][0], 3), e=round(u['start']+times[q][1], 3)))
    timeline.append(dict(line=u['line'], sub=u['sub'], who=u['who'], start=round(u['start'], 3),
                         end=round(u['start']+u['dur'], 3), text=u['text']))

# ---------- stems ----------
TOTAL = VO_END + 9.5
N = int(TOTAL*SR)
narr_st = np.zeros(N); sis_st = np.zeros(N); spk_st = np.zeros(N)
for u in units:
    o = int(u['start']*SR); a = u['audio']
    if u['who'] == 'N': narr_st[o:o+len(a)] += a
    elif u['who'] == 'SIS':
        wsp = whisperize(a); x = 0.55*wsp/np.max(np.abs(wsp))*np.max(np.abs(a)) + 0.6*a
        x = sosfilt(butter(2, 300, 'high', fs=SR, output='sos'), x)
        x = echo(x, 0.33, 0.55, 8, 3500)
        x = fftconvolve(x, reverb_ir(2.2, 3.0, 0.03, 5))[:len(x)+SR]*0.9 + np.pad(x,(0,SR))*0.7
        sis_st[o:o+len(x)] += x[:N-o]
    else:
        g = gong(); go = o-int(1.2*SR); spk_st[go:go+len(g)] += g
        x = radio(a); spk_st[o:o+len(x)] += x[:N-o]*1.2
# narrator: compression + small room
narr_st = sosfilt(butter(2, 70, 'high', fs=SR, output='sos'), narr_st)
narr_st = compress(narr_st, -22, 3.0)
narr_st = narr_st + 0.12*fftconvolve(narr_st, reverb_ir(0.45, 0.8, 0.01, 2))[:N]
def peak(x, p=0.9): return x/np.max(np.abs(x))*p
sf.write(OUT+'/vo_narr.wav', peak(narr_st).astype(np.float32), SR)
sf.write(OUT+'/vo_sis.wav', peak(sis_st, 0.8).astype(np.float32), SR)
sf.write(OUT+'/vo_spk.wav', peak(spk_st, 0.85).astype(np.float32), SR)
json.dump(dict(total=TOTAL, vo_end=VO_END, intro=INTRO, timeline=timeline, words=words_all),
          open(OUT+'/timing.json', 'w'), indent=1)
print('total %.2f, words %d' % (TOTAL, len(words_all)))
