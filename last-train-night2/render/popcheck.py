# flag sudden frame-to-frame changes inside clips (possible pops/glitches)
import sys,glob,json,subprocess,numpy as np
clips=sorted(f for f in glob.glob(sys.argv[1]+'/shot_*.mp4') if 'tmp' not in f)
seen=set(json.load(open(sys.argv[2]))) if len(sys.argv)>2 else set()
out={}
for c in clips:
    if c in seen:continue
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',c,'-vf','scale=108:192,format=gray','-f','rawvideo','-'],capture_output=True).stdout
    fr=np.frombuffer(raw,np.uint8).reshape(-1,192,108).astype(float)
    d=np.abs(np.diff(fr,axis=0)).mean(axis=(1,2))
    med=np.median(d)+1e-6;spikes=[(i+1,round(x,1)) for i,x in enumerate(d) if x>max(6*med,8)]
    job=json.load(open(glob.glob('q4k/%s.job.done'%c.split('_')[-1][:3])[0]))
    out[c]={'f0':job['f0'],'shot':job['shot'],'median':round(med,2),'spikes':[(job['f0']+i,v) for i,v in spikes]}
    print(c.split('/')[-1],'shot',job['shot'],'t0=%.2f'%(job['f0']/30),'median diff',round(med,2),'spikes(frame,diff):',out[c]['spikes'][:8])
