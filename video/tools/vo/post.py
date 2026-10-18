import json, os, re, subprocess, sys, numpy as np, soundfile as sf
# Run from tools/vo (reads raw/ and render_log.json there). Writes video/public/vo.
SR=24000; OUT=os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','public','vo'))
log=json.load(open('render_log.json'))
def ff(*a): return subprocess.run(['ffmpeg','-hide_banner','-nostats','-y',*a],capture_output=True,text=True)
CHAIN='highpass=f=80:poles=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=140:knee=6:makeup=1'
only=set(sys.argv[1:]) or set(log)
for i in sorted(only,key=int):
    a,_=sf.read(f'raw/vo{i}.wav',dtype='float32')
    env=np.convolve(np.abs(a),np.ones(120)/120,'same')
    idx=np.where(env>10**(-50/20)*np.abs(a).max())[0]
    s=max(0,idx[0]-int(.06*SR)); e=min(len(a),idx[-1]+int(.15*SR))
    head_pad=max(0,int(.06*SR)-(idx[0]-s)); tail_pad=max(0,int(.15*SR)-(e-idx[-1]))
    b=np.concatenate([np.zeros(head_pad,'float32'),a[s:e],np.zeros(tail_pad,'float32')])
    f=np.ones_like(b); n1,n2=int(.004*SR),int(.03*SR); f[:n1]=np.linspace(0,1,n1); f[-n2:]=np.linspace(1,0,n2); b*=f
    N=len(b); sf.write(f'tmp_{i}.wav',np.concatenate([b,np.zeros(int(3.5*SR),'float32')]),SR,subtype='FLOAT')  # pad: loudnorm linear mode needs >=3s
    r=ff('-i',f'tmp_{i}.wav','-af',CHAIN+',loudnorm=I=-16:TP=-1.5:LRA=20:print_format=json','-f','null','-')
    m=json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr).group(0))
    g=-16-float(m['input_i'])+0.4
    pre=CHAIN+f',volume={g:.2f}dB,aresample=96000,alimiter=limit={10**(-2.4/20):.4f}:attack=2:release=40:level=0,aresample=24000'
    r=ff('-i',f'tmp_{i}.wav','-af',pre+',loudnorm=I=-16:TP=-1.5:LRA=20:print_format=json','-f','null','-')
    m=json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr).group(0))
    ln=f"loudnorm=I=-16:TP=-1.5:LRA=20:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:print_format=json"
    for sr,suf in ((24000,''),(48000,'_48k')):
        r=ff('-i',f'tmp_{i}.wav','-af',pre+','+ln,'-ar',str(sr),'-c:a','pcm_s24le','-t',f'{N/SR:.6f}',f'{OUT}/vo{i}{suf}.wav')
        m2=json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr).group(0))
    L=log[i]; off=s-head_pad
    L['trim_offset']=round(off/SR,3); L['segments_final']=[dict(text=g['text'],start=round(max(0,g['start_raw']-off/SR),3)) for g in L['segments']]
    L['norm_type']=m2['normalization_type']; L['duration']=round(N/SR,3)
    print(i,L['duration'],m2['normalization_type'],'in_I',m['input_i'],'in_TP',m['input_tp'])
    subprocess.run(['rm',f'tmp_{i}.wav'])
json.dump(log,open('render_log.json','w'),indent=1)
