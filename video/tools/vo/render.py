import kfix, json, sys, numpy as np, soundfile as sf
from kokoro import KPipeline
SR=24000; VOICE='af_heart'
# id, segments (rendered separately, joined with gaps after the segment), scene window, speed
LINES=[
 (1,[("Every day takes you somewhere.",0)],(0,5),0.92),
 (2,[("Trace records the places you go, and the routes you take.",0)],(5,10),0.95),
 (3,[("The train to work.",0.42),("An evening across town.",0.42),("The drive home.",0)],(10,17.5),0.92),
 (4,[("Play back any journey, moment by moment.",0)],(17.5,22.5),0.92),
 (5,[("Look back on a week, a month, or a year.",0)],(22.5,27.5),0.92),
 (6,[("And see the places that matter most.",0)],(27.5,32.5),0.92),
 (7,[("Your journal stays on your iPhone.",0.45),("Encrypted.",0.4),("No account.",0.3),("No streaks.",0)],(32.5,40),0.9),
 (8,[("Trace.",0.45,0.95),("Your day, retraced.",0)],(41,47.5),0.88),
]
def trim(a, head=0.0, tail=0.0, thr_db=-45):
    env=np.convolve(np.abs(a),np.ones(240)/240,'same')  # 10ms envelope
    idx=np.where(env>10**(thr_db/20)*np.abs(a).max())[0]
    s=max(0,idx[0]-int(head*SR)); e=min(len(a),idx[-1]+int(tail*SR))
    return a[s:e]
if __name__=='__main__':
    only=set(map(int,sys.argv[1:])) if len(sys.argv)>1 else None
    p=KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
    log={}
    try: log=json.load(open('render_log.json'))
    except Exception: pass
    for i,segs,w,sp in LINES:
        if only and i not in only: continue
        parts=[]; marks=[]; phon=[]; t=0.0
        for k,seg in enumerate(segs):
            txt,gap=seg[:2]; ssp=seg[2] if len(seg)>2 else sp
            aud=[]
            for g,ps,a in p(txt, voice=VOICE, speed=ssp, split_pattern=None):
                aud.append(a.numpy()); phon.append(ps)
            a=np.concatenate(aud)
            if len(segs)>1:  # tighten inner joins; keep 20ms natural edge
                a=trim(a, head=0.02 if k else 0.3, tail=0.04 if k<len(segs)-1 else 0.3)
            marks.append(dict(text=txt,speed=ssp,start_raw=round(t,3))); parts.append(a); t+=len(a)/SR
            if gap: parts.append(np.zeros(int(gap*SR),dtype=a.dtype)); t+=gap
        a=np.concatenate(parts)
        sf.write(f'raw/vo{i}.wav',a,SR,subtype='FLOAT')
        log[str(i)]=dict(text=' '.join(g[0] for g in segs),segments=marks,window=w,speed=sp,voice=VOICE,phonemes=' | '.join(phon),raw=round(len(a)/SR,3))
        print(i,sp,round(len(a)/SR,3),' | '.join(phon),flush=True)
    json.dump(log,open('render_log.json','w'),indent=1)
