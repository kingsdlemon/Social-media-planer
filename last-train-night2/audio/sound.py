"""Sound design v2: synthesized SFX bed driven by the same events/curves as the picture.
usage: sound.py events.json curves.json VO_DIR OUT_WAV"""
import json,sys,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,fftconvolve
E=json.load(open(sys.argv[1]));CV=json.load(open(sys.argv[2]));VO=sys.argv[3];OUT=sys.argv[4];SR=48000
T=E['total'];N=int((T+0.5)*SR);t=np.arange(N)/SR;r=np.random.default_rng(3)
def bp(x,lo,hi,o=2):return sosfilt(butter(o,[lo,hi],'band',fs=SR,output='sos'),x)
def lp(x,f,o=2):return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2):return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def curve(name):c=np.array(CV[name],float);return np.interp(t,np.arange(len(c))/CV['fps'],c)
def place(buf,s,at,g=1.0):
    i=int(round(at*SR))
    if i<0:s=s[-i:];i=0
    if i>=len(buf):return
    n=min(len(s),len(buf)-i);buf[i:i+n]+=s[:n]*g
def env(n,a,d):x=np.arange(n)/SR;return np.minimum(1,x/max(a,1e-4))*np.exp(-x/d)
def ir(t60,dur,seed):
    q=np.random.default_rng(seed);n=int(dur*SR);x=np.arange(n)/SR;h=q.standard_normal(n)*np.exp(-6.9*x/t60);h=bp(h,150,7000);return h/np.sqrt(np.sum(h**2))
noise=r.standard_normal(N)
v=curve('speed');vn=np.clip(v/46,0,1);neon=curve('neon')
bed={}  # named layers (kept separate for level checks)
# --- train: rumble / wheel roar / air, all driven by speed ---
bed['rumble']=lp(noise,110,4)*2.4*vn**0.8+bp(noise,140,700)*0.55*vn+hp(bp(noise,1800,6000),1800)*0.07*vn**1.6
# tunnel resonance: slow modulated band noise
bed['rumble']+=bp(r.standard_normal(N),60,240)*0.5*vn*(0.75+0.25*np.sin(2*np.pi*0.37*t))
# --- rail joints (pairs), louder with speed ---
for a in E['rail']:
    k=int(a*SR);s_=vn[min(k,N-1)]
    n=int(0.12*SR);x=np.arange(n)/SR
    clk=bp(r.standard_normal(n),250,3000)*env(n,0.0008,0.012)*1.2+np.sin(2*np.pi*62*x)*env(n,0.001,0.035)*1.4
    place(bed.setdefault('joints',np.zeros(N)),clk,a,0.35+0.65*s_)
# --- station passes: doppler whoosh + platform slap ---
for st in E['stations']:
    n=int(2.0*SR);x=np.arange(n)/SR-1.0;sv=vn[min(int(st['t']*SR),N-1)]
    w=bp(r.standard_normal(n),250,4500)*np.exp(-(x/0.33)**2)*1.5
    fsweep=900*np.exp(-x*1.2)+250;tone=np.sin(2*np.pi*np.cumsum(np.clip(fsweep,150,3000))/SR)*np.exp(-(x/0.25)**2)*0.12
    place(bed.setdefault('whoosh',np.zeros(N)),w+tone,st['t']-1.0,0.5+0.7*sv)
# station 7: roar + wheel screech while sparks fly
n=int(2.6*SR);x=np.arange(n)/SR
scr=(np.sin(2*np.pi*(3100+180*np.sin(2*np.pi*7*x))*x)+0.5*np.sin(2*np.pi*(4650+90*np.sin(2*np.pi*5*x))*x))*np.minimum(1,x/0.25)*np.minimum(1,(2.6-x)/0.6)*0.11
roar=lp(r.standard_normal(n),400,2)*np.sin(np.pi*x/2.6)**2*1.6
place(bed.setdefault('st7',np.zeros(N)),scr+roar,E['st7']-1.1)
# --- neon hum follows light level (stops when lights go out, flickers with them) ---
hum=(np.sin(2*np.pi*100*t)+0.45*np.sin(2*np.pi*200*t)+0.2*np.sin(2*np.pi*300*t)+0.08*np.sin(2*np.pi*400*t))
bed['hum']=hum*np.clip(neon,0,1)*0.045+bp(noise,4000,9000)*0.004*np.clip(neon,0,1)
# --- doors: chime, hiss, thunk ---
for k,f in enumerate([880,698.5]):
    n=int(0.6*SR);x=np.arange(n)/SR;place(bed.setdefault('doors',np.zeros(N)),np.sin(2*np.pi*f*x)*env(n,0.003,0.18)*0.25,E['doors']-0.75+k*0.28)
n=int(1.1*SR);place(bed['doors'],hp(r.standard_normal(n),2400)*env(n,0.03,0.35)*0.55,E['doors'])
n=int(0.35*SR);x=np.arange(n)/SR;place(bed['doors'],(np.sin(2*np.pi*58*x)*env(n,0.001,0.07)*1.2+bp(r.standard_normal(n),200,1500)*env(n,0.001,0.03)*0.6),E['doors']+0.93)
# departure: motor whine rising
dep=E['depart'];n=int(4.0*SR);x=np.arange(n)/SR;f=180+520*(x/4.0)**1.4
place(bed.setdefault('motor',np.zeros(N)),(np.sin(2*np.pi*np.cumsum(f)/SR)+0.3*np.sin(2*np.pi*np.cumsum(f*2)/SR))*np.minimum(1,x/0.6)*np.minimum(1,(4-x)/1.5)*0.05,dep)
# brake squeal on the deceleration after station 3
n=int(1.6*SR);x=np.arange(n)/SR
place(bed.setdefault('squeal',np.zeros(N)),np.sin(2*np.pi*(2750+140*np.sin(2*np.pi*6*x))*x)*np.minimum(1,x/0.2)*np.minimum(1,(1.6-x)/0.4)*0.07,E['lightsOut']+0.5)
# power-down / power-up (lights)
n=int(0.8*SR);x=np.arange(n)/SR;place(bed.setdefault('power',np.zeros(N)),np.sin(2*np.pi*np.cumsum(120*np.exp(-x*3)+30)/SR)*np.exp(-x*2.5)*0.5,E['lightsOut'])
nc=np.array(CV['neon']);nt=np.arange(len(nc))/CV['fps']
edges=[nt[i] for i in range(1,len(nc)) if nc[i-1]<0.4<=nc[i] and E['lightsOut']-0.1<nt[i]<E['lightsOn']+0.2]
print('light on-edges',[round(x,2) for x in edges])
for tt in edges:
    n=int(0.12*SR);x=np.arange(n)/SR
    place(bed['power'],bp(r.standard_normal(n),1200,7000)*env(n,0.0008,0.012)*0.5+np.sin(2*np.pi*120*x)*env(n,0.002,0.05)*0.35,tt)
# --- drone, rising, with risers into shocks ---
f0=40+12*(t/T)
drone=np.sin(2*np.pi*np.cumsum(f0)/SR)+0.55*np.sin(2*np.pi*np.cumsum(f0*1.5)/SR+1)+0.3*np.sin(2*np.pi*np.cumsum(f0*2.01)/SR)+0.15*np.sin(2*np.pi*np.cumsum(f0*3.02)/SR)
bed['drone']=drone*(0.05+0.17*(t/T))*(0.85+0.15*np.sin(2*np.pi*0.11*t))
for hit in [E['headTurn'],E['appeared']]:
    n=int(1.4*SR);x=np.arange(n)/SR;cut=np.clip(200*np.exp(x*2.6),200,8000)
    ris=np.zeros(n);bl=r.standard_normal(n)
    for i0 in range(0,n,2400):ris[i0:i0+2400]=lp(bl[i0:i0+2400],cut[i0])
    place(bed.setdefault('riser',np.zeros(N)),ris*(x/1.4)**2*0.6,hit-1.4)
# --- impacts ---
def boom(d=1.8):
    n=int(d*SR);x=np.arange(n)/SR;f=34+70*np.exp(-x/0.1)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,0.002,0.5)*1.1+lp(r.standard_normal(n),1800)*env(n,0.001,0.07)*0.7
for a in E['rules']+[E['headTurn'],E['appeared'],E['choice']]:place(bed.setdefault('impacts',np.zeros(N)),boom(),a,0.9)
place(bed['impacts'],boom(2.2),E['lightsOut'],1.5)
n=int(0.25*SR);x=np.arange(n)/SR;relay=bp(r.standard_normal(n),400,3500)*env(n,0.0005,0.02)*1.4+np.sin(2*np.pi*140*x)*env(n,0.001,0.05)*0.8
place(bed['impacts'],relay,E['lightsOut'],1.2);place(bed['impacts'],relay,E['flickerOn'],0.9)
# --- clock ticks (reverse = reversed tick) + glitches at loop resets / 8th station ---
tk=bp(r.standard_normal(int(0.035*SR)),1600,7000)*env(int(0.035*SR),0.0004,0.006)+np.sin(2*np.pi*2400*np.arange(int(0.035*SR))/SR)*env(int(0.035*SR),0.0004,0.004)*0.4
for k in E['ticks']:place(bed.setdefault('ticks',np.zeros(N)),tk[::-1] if k['rev'] else tk,k['t'],0.3)
def glitch(d=0.18,seed=0):
    q=np.random.default_rng(seed);n=int(d*SR);x=q.standard_normal(n);x=np.round(x*3)/3;hold=np.repeat(x[::40],40)[:n];return bp(hold,300,6000)*env(n,0.002,d/2.5)
loop0=[x['t'] for x in E['ticks'] if not x['rev']]
ss=[]  # loop resets: where tick spacing jumps (seconds wrap); approximate from HUD rule: every 1.15 s inside loop window
TMJ=json.load(open(sys.argv[3]+'/timing.json'));ls_=lambda L:[x for x in TMJ['timeline'] if x['line']==L-1]
loop0=ls_(6)[0]['start'];loop1=ls_(7)[-1]['end'];st0=(12+int(loop0))/60
le=[];k=1
while True:
    a=loop0+1.15*(k-st0);k+=1
    if a>=loop1:break
    le.append(a)
print('loop resets',len(le))
for i,a in enumerate(le):place(bed.setdefault('glitch',np.zeros(N)),glitch(seed=i),a,0.35)
for i,a in enumerate([E['eighth'],E['eighth']+0.25,E['appeared']]):place(bed.setdefault('glitch',np.zeros(N)),glitch(0.3,seed=50+i),a,0.5)
# --- heavy footsteps ---
for a in E['tallSteps']:
    n=int(0.8*SR);x=np.arange(n)/SR
    st_=np.sin(2*np.pi*(45+45*np.exp(-x/0.04))*x)*env(n,0.002,0.2)*1.6+lp(r.standard_normal(n),900)*env(n,0.001,0.05)*0.8+bp(r.standard_normal(n),1500,5000)*env(n,0.005,0.12)*0.12
    place(bed.setdefault('steps',np.zeros(N)),st_,a,1.0)
# --- platform wind (until the train is gone) ---
bed['wind']=bp(noise,140,850)*(0.55+0.45*np.sin(2*np.pi*0.19*t+1))*0.32*np.clip((E['depart']+4-t)/2,0,1)
# --- room: short tunnel/car reverb on the whole bed ---
B=sum(bed.values())
B=B+0.25*fftconvolve(B,ir(0.9,1.5,7))[:N]
B=hp(B,32)
# --- voices ---
def ld(f):
    a,sr=sf.read(f);a=a if a.ndim==1 else a.mean(1);b=np.zeros(N);b[:min(N,len(a))]=a[:N];return b
narr,sis,spk=ld(VO+'/vo_narr.wav'),ld(VO+'/vo_sis.wav'),ld(VO+'/vo_spk.wav')
voice=narr*1.0+sis*0.95+spk*0.85
# --- ducking (sidechain, 30 ms attack / 450 ms release) ---
e=np.abs(voice);g=np.empty(N);lv=0.0;aa,rr=np.exp(-1/(0.03*SR)),np.exp(-1/(0.45*SR))
for i in range(0,N,48):  # 1 ms blocks
    x=e[i:i+48].max();c=aa if x>lv else rr;lv=c*lv+(1-c)*x;g[i:i+48]=lv
act=np.clip(g/0.06,0,1)
duck=10**(-9*act/20)  # up to -9 dB under speech
# level: bed ~18 dB under the voice while speaking
vm=act>0.5
v_rms=np.sqrt(np.mean(voice[vm]**2));b_rms=np.sqrt(np.mean((B*duck)[vm]**2))
gain=v_rms/b_rms*10**(-17/20)
bedf=B*duck*gain
mix=voice+bedf
print('bed under voice: %.1f dB'%(20*np.log10(np.sqrt(np.mean(bedf[vm]**2))/v_rms)),'| bed between lines vs voice: %.1f dB'%(20*np.log10(np.sqrt(np.mean(bedf[~vm&(t>1)&(t<T-1)]**2))/v_rms)))
for lo,hi in [(20,60),(60,250),(250,2000),(2000,8000),(8000,20000)]:
    print('band %5d-%5d Hz: %.1f dB'%(lo,hi,10*np.log10(np.mean(bp(mix,lo,min(hi,23000),4)**2)+1e-12)))
mix=mix/np.max(np.abs(mix))*0.95
sf.write(OUT,np.stack([mix,mix],1).astype(np.float32),SR)
print('ok %.2fs'%(N/SR))
