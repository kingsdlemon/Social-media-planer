import sys, os, numpy as np, soundfile as sf, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from script import LINES
from kokoro_onnx import Kokoro
M=sys.argv[1]; OUT=sys.argv[2]; os.makedirs(OUT,exist_ok=True)
k=Kokoro(M+'/kokoro-v1.0.onnx', M+'/voices-v1.0.bin')
narr = 0.75*k.get_voice_style('am_onyx') + 0.25*k.get_voice_style('am_michael')
sis = k.get_voice_style('af_nicole')
for i,(who,txt) in enumerate(LINES):
    if who=='SIS':
        a,sr=k.create(txt,voice=sis,speed=0.85,lang='en-us')
    else:
        a,sr=k.create(txt,voice=narr,speed=1.0,lang='en-us')
    sf.write(f'{OUT}/raw_{i:02d}.wav',a,sr)
    print(i,who,'%.2f'%(len(a)/sr))
