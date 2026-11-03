import json,sys,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt
E=json.load(open(sys.argv[1]));VO=sys.argv[2];OUT=sys.argv[3];SR=48000
T=E['total'];N=int(T*SR)+SR;t=np.arange(N)/SR;r=np.random.default_rng(3)
def bp(x,lo,hi,o=2):return sosfilt(butter(o,[lo,hi],'band',fs=SR,output='sos'),x)
def lp(x,f,o=2):return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2):return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def place(buf,s,at,g=1.0):
    i=int(at*SR)
    if i<0 or i>=len(buf):return
    n=min(len(s),len(buf)-i);buf[i:i+n]+=s[:n]*g
def env(n,a,d):x=np.arange(n)/SR;return np.minimum(1,x/max(a,1e-4))*np.exp(-x/d)
atmo=np.zeros(N);fx=np.zeros(N)
noise=r.standard_normal(N)
# rumble (moving after depart), louder during fast sections around stations
mov=np.clip((t-E['depart'])/3,0,1)
fast=np.zeros(N)
for s in E['stations']:fast+=np.exp(-((t-s['t'])/1.6)**2)
rumble=lp(noise,90,4)*3.0*(0.6+0.6*np.clip(fast,0,1))+bp(noise,90,400)*0.5*(0.5+np.clip(fast,0,1))
atmo+=rumble*mov*0.5
# rail joints (pairs)
clk=bp(r.standard_normal(int(0.08*SR)),200,2500)*env(int(0.08*SR),0.001,0.015)+np.sin(2*np.pi*70*np.arange(int(0.08*SR))/SR)*env(int(0.08*SR),0.001,0.03)
for a in E['rail']:place(fx,clk,a,0.35)
# whoosh per station
for s in E['stations']:
    n=int(1.6*SR);x=np.arange(n)/SR;w=bp(r.standard_normal(n),300,3000)*np.exp(-((x-0.8)/0.28)**2)*1.2
    place(fx,w,s['t']-0.8,1.0)
# neon hum
hum=(np.sin(2*np.pi*100*t)+0.5*np.sin(2*np.pi*200*t)+0.25*np.sin(2*np.pi*300*t))*0.03
on=np.ones(N);on[(t>E['lightsOut'])&(t<E['flickerOn'])]=0
fl=(t>=E['flickerOn'])&(t<E['lightsOn']);on[fl]=(np.floor(t[fl]*30)%3!=0).astype(float)
atmo+=hum*on
# door hiss + thunk
n=int(1.1*SR);place(fx,hp(r.standard_normal(n),2500)*env(n,0.02,0.4)*0.5,E['doors'])
n=int(0.3*SR);x=np.arange(n)/SR;place(fx,np.sin(2*np.pi*55*x)*env(n,0.001,0.06)*0.9,E['doors']+0.95)
# brake squeal at deceleration (station four) and at station seven
for a,d in [(E['lightsOut']+0.6,1.8),(E['st7']-0.8,1.6)]:
    n=int(d*SR);x=np.arange(n)/SR;sq=np.sin(2*np.pi*(2900+120*np.sin(2*np.pi*6*x))*x)*np.minimum(1,x/0.2)*np.minimum(1,(d-x)/0.4)*0.07
    place(fx,sq,a)
# drone rising
f0=42+10*(t/T);drone=(np.sin(2*np.pi*np.cumsum(f0)/SR)+0.6*np.sin(2*np.pi*np.cumsum(f0*1.5)/SR+1)+0.3*np.sin(2*np.pi*np.cumsum(f0*2.02)/SR))
drone*=(0.05+0.12*(t/T))*(0.8+0.2*np.sin(2*np.pi*0.13*t))
atmo+=drone
# impacts
def boom(d=1.6):
    n=int(d*SR);x=np.arange(n)/SR;f=35+60*np.exp(-x/0.12);return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,0.002,0.45)*1.0+lp(r.standard_normal(n),1500)*env(n,0.001,0.08)*0.6
for a in E['rules']+[E['headTurn'],E['appeared'],E['lightsOut'],E['choice']]:place(fx,boom(),a,0.9)
# ticks
tk=bp(r.standard_normal(int(0.03*SR)),1500,6000)*env(int(0.03*SR),0.0005,0.006)
for k in E['ticks']:place(fx,tk[::-1] if k['rev'] else tk,k['t'],0.25)
# footsteps
for a in E['tallSteps']:
    n=int(0.7*SR);x=np.arange(n)/SR;st=np.sin(2*np.pi*(48+40*np.exp(-x/0.05))*x)*env(n,0.002,0.18)*1.3+lp(r.standard_normal(n),900)*env(n,0.001,0.05)*0.7
    place(fx,st,a,1.0)
# platform wind (until train gone)
wind=bp(noise,150,900)*(0.5+0.5*np.sin(2*np.pi*0.21*t))*0.25*np.clip((E['depart']+4-t)/2,0,1)
atmo+=wind
# voices
def ld(f):
    a,sr=sf.read(f);a=a if a.ndim==1 else a.mean(1);b=np.zeros(N);b[:min(N,len(a))]=a[:N];return b
narr,sis,spk=ld(VO+'/vo_narr.wav'),ld(VO+'/vo_sis.wav'),ld(VO+'/vo_spk.wav')
voice=narr*1.0+sis*0.9+spk*0.8
# ducking: atmo/fx down when voice present
ve=np.sqrt(lp(voice**2,8,1).clip(0));ve=ve/ (ve.max()+1e-9)
duck=1-0.55*np.clip(ve*6,0,1)
bed=(atmo*0.16+fx*0.22)*duck
mix=voice+bed
mix=mix/np.max(np.abs(mix))*0.9
sf.write(OUT,np.stack([mix,mix],1).astype(np.float32),SR)
print('ok',T)
