import sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M=sys.argv[1]
k=Kokoro(M+'/kokoro-v1.0.onnx', M+'/voices-v1.0.bin')
txt="Most of you said... stay seated. And every single head... is turned toward you."
for v in ['am_onyx','bm_george','am_michael','am_fenrir','bm_lewis']:
    for sp in [0.9,1.0]:
        a,sr=k.create(txt,voice=v,speed=sp,lang='en-us' if v.startswith('a') else 'en-gb')
        sf.write(f'/tmp/vt_{v}_{sp}.wav',a,sr)
        # f0 estimate via autocorr on voiced frames
        f0s=[]
        for i in range(0,len(a)-2048,1024):
            x=a[i:i+2048]; 
            if np.sqrt(np.mean(x**2))<0.02: continue
            c=np.correlate(x,x,'full')[2047:]
            lo,hi=int(sr/300),int(sr/60)
            p=lo+np.argmax(c[lo:hi]); 
            if c[p]>0.3*c[0]: f0s.append(sr/p)
        print(v,sp,'dur %.2f'%(len(a)/sr),'f0 med %.0f'%np.median(f0s),'f0 std %.0f'%np.std(f0s))
