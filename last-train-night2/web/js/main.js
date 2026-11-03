import * as THREE from 'three';
import {World,C,CAR} from './world.js';
import {Figure} from './figure.js';
import {Post} from './post.js';
import {rng} from './textures.js';
import {loadTiming,buildTimeline,W,lineStart,lineEnd,trainPos,trainVel,railJoints,ST,TM,clamp,sstep,lerp,ease,easeOut,easeIn} from './timeline.js';
import {HUD} from './hud.js';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const RW=432,RH=768;
let renderer,scene,camera,world,post,hud,SH=[],EV={};
const hash=(x)=>{const s=Math.sin(x*127.1+311.7)*43758.5453;return s-Math.floor(s);};
async function init(){await loadTiming();buildTimeline();
 await document.fonts.load('100px "Bebas Neue"');await document.fonts.load('900 60px Montserrat');await document.fonts.ready;
 const cv=document.getElementById('gl');renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance',preserveDrawingBuffer:true});
 renderer.setPixelRatio(1);renderer.setSize(RW,RH,false);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.95;renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene=new THREE.Scene();scene.background=new THREE.Color(0x030407);camera=new THREE.PerspectiveCamera(45,RW/RH,0.03,250);
 world=new World(scene);
 for(let k=0;k<=7;k++){const st=world.makeStation(k,k===0);}
 // three dark figures at station 3 (callback to part 1)
 world.st3figs=[0,1,2].map(i=>{const f=new Figure(scene,{leg:1.05+0.05*i,torso:1.05,head:0.95});world.darkB.add(f);return f;});
 post=new Post(renderer,scene,camera,RW,RH);hud=new HUD(TM);buildShots();buildEvents();
 window.READY=true;}
// ---------------- scene state ----------------
const T_={};
function times(){Object.assign(T_,{
 doorsClose:W(2,'close').s-0.15,stopsWave:W(2,'stops').s,walk0:W(3,'walks').s-0.1,walk1:W(3,'slowly').e+0.3,tilt:W(3,'tilts').s,
 depart:lineStart(4)+0.15,phoneUp:lineStart(5)+0.2,phoneDown:lineStart(8)+0.4,
 lightsOut:W(9,'three').e+0.15,flickerOn:W(10,'flicker').s,lightsOn:W(10,'on').e+0.1,
 headTurn:W(12,'head').s-0.05,lookDown:W(13,'look',1).s,
 tallWalk0:lineStart(14)-0.75,tallStop:W(15,'stop').s,bend0:lineEnd(15)+0.15,bend1:W(16,'get').s,tallGone:W(17,'five').s-0.45,
 redOn:lineStart(18),reverse:W(18,'moving').s,eighth:W(20,'eighth').s,appeared:W(20,'appeared').s,spk0:lineStart(21)-1.2,spk1:lineEnd(21),
 choice:lineStart(23),endcard:lineStart(23)+7.0});}
function neonLevel(t){let L=1;
 if(t>T_.lightsOut&&t<T_.flickerOn){const u=(t-T_.lightsOut);L=u<0.35?(hash(Math.floor(t*30))>0.5?0.6:0.1)*(1-u/0.35):0;}
 if(t>=T_.flickerOn&&t<T_.lightsOn){const f=Math.floor(t*30);const p=(t-T_.flickerOn)/(T_.lightsOn-T_.flickerOn);L=hash(f*1.7)<0.25+0.7*p?1:0.05;}
 if(t>=T_.redOn){L*=lerp(1,0.32,sstep(T_.redOn,T_.redOn+1.5,t));if(hash(Math.floor(t*30)*3.1)<0.06)L*=0.4;}
 if(t>=T_.spk0&&t<T_.spk1+0.6&&hash(Math.floor(t*30)*5.3)<0.18)L*=0.3;
 return L;}
function redLevel(t){let r=0;if(t>T_.lightsOut&&t<T_.lightsOn)r=0.5;r=Math.max(r,sstep(T_.redOn,T_.redOn+1.5,t));return r;}
function doorOpen(t){return 1-ease(sstep(T_.doorsClose,T_.doorsClose+0.95,t));}
// walking helper: sets figure feet + root along straight path (world coords of current frame)
function walk(f,t,t0,t1,A,B,n,yaw0,yaw1,o){const tot=n+1,dur=(t1-t0)/tot;const u=clamp((t-t0)/(t1-t0));
 const k=Math.min(tot-1,Math.floor((t-t0)/dur)),ph=clamp((t-t0)/dur-k);
 const plant=(i)=>{const s=i<0?0:Math.min(1,(i+1.5)/n);return i>=n-1?1:s;};// landing fraction of step i
 const footS={L:[0],R:[0]};// fraction history
 const P=(s)=>[lerp(A[0],B[0],s),lerp(A[1],B[1],s)];
 const yaw=lerp(yaw0,yaw1,sstep(o.turn0??0.6,1,u));const body=P(t<t0?0:t>t1?1:(k+ (o.heavy?easeIn(ph)*0.6+ph*0.4:ph))/tot*1.0);
 f.placeAt(body[0],o.y||0,body[1],yaw);const L=f.L;
 let hipDrop=0;
 for(const [S,sd] of [['L',-1],['R',1]]){// which steps move this foot: L moves on even steps, R on odd
  let last=-1;for(let i=(S==='L'?0:1);i<tot;i+=2){if(i<k||(i===k&&t>=t1))last=i;}
  const fromS=last<0?0:plant(last),moving=(k%2===(S==='L'?0:1))&&t>=t0&&t<t1;const toS=plant(k);
  let s=fromS,lift=0;if(moving){const e=o.heavy?easeIn(ph):ease(ph);s=lerp(fromS,toS,e);lift=Math.sin(Math.PI*ph)*(o.lift||0.12);}
  const w=P(s);// world foot pos
  const lat=sd*(o.stance||0.09);const fx=w[0]+Math.cos(yaw)*lat,fz=w[1]-Math.sin(yaw)*lat;
  // to local
  const dx=fx-body[0],dz=fz-body[1];const lx=dx*Math.cos(yaw)-dz*Math.sin(yaw),lz=dx*Math.sin(yaw)+dz*Math.cos(yaw);
  f.hip.position.set(0,(L.thigh+L.shin+L.ankle)*0.97-(o.bob||0.02)*Math.abs(Math.sin(Math.PI*ph)),0);
  f.legIK(S,lx,L.ankle+lift,lz);}
 return {k,ph,dur};}
const tmpV=new THREE.Vector3();
function setScene(t){const p=trainPos(t);world.p=p;const vel=trainVel(t);
 // tunnel segments wrap around
 const TL=world.tunnelLen;for(let i=0;i<world.tunnel.length;i++){let x=((i*12-p)%TL+TL)%TL-TL/2;const g=world.tunnel[i];g.position.x=x;
  let hide=false;for(const k in ST.pos){if(Math.abs(ST.pos[k]-p-x)<22+6)hide=true;}g.visible=!hide;}
 for(const s of world.stations){const k=s.userData.idx;s.position.x=ST.pos[k]-p;s.visible=Math.abs(s.position.x)<160;}
 for(const g of world.others)g.position.x=g.userData.off;
 for(const w of world.wheels)w.rotation.y=-p/0.42;
 // tunnel lamp lights: nearest lamp each side, cos^2 fade
 {const ph=((p%12)+12)%12;let x=-ph;if(x<-6)x+=12;const near=world.tunnel.some(g=>g.visible&&Math.abs(g.position.x-x)<1);
  const I=near?5.5*Math.pow(Math.cos(Math.PI*x/12),2):0;world.tunL[0].position.set(x,1.7,2.25);world.tunL[1].position.set(x+6>6?x-6:x+6,1.7,-2.25);world.tunL[0].intensity=I*1.2;
  let x2=x+6>6?x-6:x+6;world.tunL[1].intensity=near?6.5*Math.pow(Math.cos(Math.PI*x2/12),2):0;world.lampX=x;}
 // station lights
 let best=null,bd=1e9;for(const s of world.stations){const d=Math.abs(s.position.x);if(d<bd){bd=d;best=s;}}
 world.stL.forEach((l,i)=>{l.position.set(best.position.x+(i-1)*14,4.2,3.2);l.intensity=bd<70?(best.userData.red?9:16):0;});
 world.nearStation=best;world.nearStationD=bd;
 // neon + emergency
 const N=neonLevel(t),R=redLevel(t);world.neonLevel=N;world.neonL.forEach(l=>{l.intensity=5.5*N;l.color.setRGB(lerp(0.87,1,R*0.3),lerp(0.91,0.8,R*0.3),lerp(0.96,0.8,R*0.3));});
 world.neonMeshes.forEach((m,i)=>{const fl=(t>T_.flickerOn&&t<T_.lightsOn)?(hash(Math.floor(t*30)+i*13)<0.5+0.5*((t-T_.flickerOn)/(T_.lightsOn-T_.flickerOn))?1:0.05):1;m.material.color.setRGB(2.2*N*fl+0.02,2.3*N*fl+0.02,2.5*N*fl+0.03);});
 world.emL.intensity=R*(t>T_.redOn?7:3);world.rimL.intensity=(t>T_.tallWalk0-1.5&&t<T_.tallGone)?3.5*(1-sstep(T_.tallStop-0.5,T_.tallStop+0.8,t))+0.8:0;world.emL.position.set(0,2.0,0);
 world.hemi.intensity=0.45+0.35*N;
 // doors
 const o=doorOpen(t);for(const d of world.doorLeaves){const {d:dx,sd,lw}=d.userData;const isMain=true;d.position.x=dx+sd*(lw/2-0.012)+sd*o*(lw-0.02);}
 // speaker cone pump
 const env=TM.env_spk?TM.env_spk[Math.min(TM.env_spk.length-1,Math.floor(t*30))]:0;world.speakerCone.scale.set(1,1-env*0.6,1);world.speakerCone.position.y=-0.01-env*0.02;
 // line map
 const cur=Object.keys(ST.times).filter(k=>k>0&&t>=ST.times[k]).length;const e8=sstep(T_.eighth,T_.appeared,t);const gl=(t>T_.eighth-0.1&&t<T_.appeared+0.8)?(hash(Math.floor(t*15))>0.4?1:0.2):0;
 world.lineMap.draw(cur,t>T_.eighth?(hash(Math.floor(t*20))>0.3||t>T_.appeared?Math.max(0.35,e8):0):0,gl,Math.floor(t*15));
 // scratch visibility: lit by passing lamps
 const lx=world.lampX;world.M.scratch.opacity=0.22+0.9*Math.pow(Math.cos(Math.PI*(lx+1.75)/12),8)+0.15*N;
 // --- figures ---
 const ldn=sstep(T_.lookDown-0.3,T_.lookDown+0.4,t);const H=world.hero;H.rest();H.sit(0.45,lerp(0.16,0.21,ldn),lerp(0.45,0.5,ldn),-0.04);H.placeAt(0,0,-1.17,0);
 let hy=0.03*Math.sin(t*0.7),hp=0.05;
 // phone
 const ph=sstep(T_.phoneUp,T_.phoneUp+0.8,t)*(1-sstep(T_.phoneDown,T_.phoneDown+0.7,t));world.phone.visible=ph>0.02;
 if(ph>0){H.ua.R.rotation.set(lerp(-0.55,-0.35,ph),lerp(0,-0.25,ph),lerp(0.18,0.05,ph));H.fa.R.rotation.set(lerp(-0.85,-1.9,ph),0,0);H.hand.R.rotation.set(lerp(0,0.55,ph),0,lerp(0,0.3,ph));hp=lerp(0.05,0.62,ph);hy=lerp(hy,-0.2,ph);}
 const ld=sstep(T_.lookDown,T_.lookDown+0.7,t);hp=lerp(hp,0.75,ld);
 H.look(hy,hp,0);
 // sister (on station 0 platform, world frame)
 const S=world.sister;const s0=ST.pos[0]-p;S.visible=Math.abs(s0)<50&&t<lineStart(6);world.sisFx.visible=S.visible;
 if(S.visible){S.rest();const A=[s0-0.3,2.55],B=[s0-0.3,1.78];
  if(t<T_.walk0){S.placeAt(A[0],0,A[1],Math.PI);S.legIK('L',-0.06,S.L.ankle,0.0);S.legIK('R',0.06,S.L.ankle,0.0);}
  else walk(S,t,T_.walk0,T_.walk1,A,B,3,Math.PI,Math.PI,{stance:0.06,lift:0.06,bob:0.01});
  // wave
  const waving=1-sstep(T_.stopsWave,T_.stopsWave+0.6,t);const w=Math.sin(t*7)*0.35;
  S.ua.R.rotation.set(0,0,lerp(0.12,2.55,waving));S.fa.R.rotation.set(0,0,lerp(-0.05,0.35+w,waving));S.ua.L.rotation.set(0.05,0,-0.1);
  const tl=sstep(T_.tilt,T_.tilt+0.9,t);S.look(0.0,lerp(-0.12,0.05,tl),lerp(0,1.05,easeOut(tl)));
  S.torso.rotation.z=0.06*tl;world.sisFx.position.set(S.root.position.x,0,S.root.position.z);
  world.fogPlanes.forEach((f,i)=>{const d=f.userData;f.position.x=Math.sin(t*d.sp+d.ph)*0.6;f.rotation.y=Math.sin(t*0.1+d.ph)*0.5+ (camera?Math.atan2(camera.position.x-f.position.x-world.sisFx.position.x,camera.position.z-world.sisFx.position.z):0);f.material.opacity=0.5;});
  world.redL.position.set(S.root.position.x,0.25,S.root.position.z);world.redL.intensity=1.6;}
 else world.redL.intensity=0;
 // passing-window light on sister when train leaves
 if(S.visible&&t>T_.depart){const rear=-24.6+p-s0*0;const along=p;const passing=(rear< (s0+0.3)+p- p + 2)?1:0;
  const L3=world.stL[2];L3.position.set(S.root.position.x,1.3,1.6);const inTrain=(-24.6+p)<0.5;L3.intensity=inTrain?6*Math.pow(Math.max(0,Math.sin(p*Math.PI/1.75)),2)*clamp(vel/6):0;L3.color.setHex(0xcfe0ff);}
 // tall figure
 const TF=world.tall;TF.visible=t>T_.tallWalk0-0.3&&t<T_.tallGone;EV.tallSteps=EV.tallSteps||[];
 if(TF.visible){TF.rest();const A=[-6.7,0.12],B=[0.0,0.15];const st=walk(TF,t,T_.tallWalk0,T_.tallStop,A,B,5,Math.PI/2,Math.PI,{stance:0.12,lift:0.16,bob:0.06,heavy:true,turn0:0.72});
  TF.ua.L.rotation.set(0.05+0.12*Math.sin(t*2),0,-0.06);TF.ua.R.rotation.set(0.05-0.12*Math.sin(t*2),0,0.06);
  const b=ease(sstep(T_.bend0,T_.bend1,t)),bn=ease(sstep(T_.bend0+0.5,T_.bend1+0.5,t));if(b>0){TF.hip.position.y-=0.15*b;TF.hip.position.z=-0.05*b;
   TF.torso.rotation.x=2.3*b;TF.neck.rotation.x=0.75*bn;
   TF.legIK('L',-0.12,TF.L.ankle,0.0);TF.legIK('R',0.12,TF.L.ankle,0.0);TF.ua.L.rotation.set(-1.25*b,0,-0.12-0.2*b);TF.ua.R.rotation.set(-1.25*b,0,0.12+0.2*b);TF.fa.L.rotation.set(-0.5*b,0,0);TF.fa.R.rotation.set(-0.5*b,0,0);
   const wt=sstep(W(16,'why').s,lineEnd(16),t);TF.look(0,0,0.5*wt+0.08*Math.sin(t*3)*wt);}}
 // passengers
 const vis=t>=T_.flickerOn&&!(t<T_.lightsOn&&neonLevel(t)<0.5&&hash(Math.floor(t*30)*7.7)<0.5);
 const hero=V(0,1.28,-1.12);
 for(const f of world.passengers){f.visible=vis;if(!vis)continue;const s=f.seat;f.rest();f.sit(0.45,0.1,0.42,s.lean);const yaw=s.sz<0?0:Math.PI;f.placeAt(s.x,0,s.sz*1.17,yaw);
  const tt=clamp((t-(T_.headTurn+s.dl))/0.32);const e=ease(tt);
  const dx=hero.x-s.x,dz=hero.z-s.sz*1.17,dy=hero.y-1.3;let ya=Math.atan2(dx,dz)-yaw;while(ya>Math.PI)ya-=2*Math.PI;while(ya<-Math.PI)ya+=2*Math.PI;ya=clamp(ya,-1.8,1.8);
  const pi=-Math.atan2(dy,Math.hypot(dx,dz))*0.6;const base=(hash(s.x*3+s.sz)-0.5)*0.12;f.look(lerp(base,ya,e),lerp(0.06,pi,e),0);}
 // station 3 figures
 const s3=ST.pos[3]-p;world.st3figs.forEach((f,i)=>{f.visible=Math.abs(s3)<60&&t<T_.lightsOn+2;if(!f.visible)return;f.rest();f.placeAt(s3-2.2+i*1.6,0,2.35+0.25*(i%2),Math.PI);f.legIK('L',-0.08,f.L.ankle,0);f.legIK('R',0.08,f.L.ankle,0);f.look(0,0.05,0);});
 // phone screen
 const clk=hud.clock(t);world.phoneScreen.draw(clk.hm,clk.ss,clk.red,clk.glitch);
 // sparks (station 7)
 const s7=ST.pos[7]-p;let ns=0;if(Math.abs(s7)<40){const r=rng(Math.floor(t*30));for(const wx of [-5.6-0.9,-5.6+0.9,5.6-0.9,5.6+0.9,-16.6-5.6,-16.6+5.6,16.6-5.6,16.6+5.6])for(let k=0;k<6;k++){if(ns>=120)break;
   const m=new THREE.Matrix4();const age=r();const px=wx-age*1.6,py=-1.02+age*0.5*r(),pz=0.72+0.05+age*0.8*r();const sc=0.04+0.06*(1-age);m.compose(V(px,py,pz),new THREE.Quaternion(),V(sc*4,sc,sc));world.sparks.setMatrixAt(ns++,m);}}
 world.sparks.count=ns;world.sparks.instanceMatrix.needsUpdate=true;
}
function updateFigures(){world.white.update();world.darkB.update();
 // blob shadows under feet
 let n=0;const m=new THREE.Matrix4(),q=new THREE.Quaternion();const add=(x,z,sx,sz,o=1)=>{if(n>=200)return;m.compose(V(x,0.004,z),q,V(sx,1,sz));world.blobs.setMatrixAt(n++,m);};
 for(const f of [...world.white.figs,...world.darkB.figs]){if(!f.visible)continue;for(const S of ['L','R']){f.ft[S].getWorldPosition(tmpV);if(tmpV.y<0.25)add(tmpV.x,tmpV.z+0.0,0.22*f.s.rad*1.3,0.3*Math.max(1,f.s.leg*0.8));}
  if(f!==world.tall&&!f.seat&&f!==world.hero){f.hip.getWorldPosition(tmpV);add(tmpV.x,tmpV.z,0.55,0.55);}}
 world.blobs.count=n;world.blobs.instanceMatrix.needsUpdate=true;}
// ---------------- shots ----------------
function shot(a,b,cam,fx={}){SH.push({a,b,cam,fx});}
const hero=V(0,1.15,-1.1);
function buildShots(){times();SH=[];const w=W;
 const s0x=()=>ST.pos[0]-world.p;
 const SX=(k)=>ST.pos[k]-world.p;
 // 1 platform OTS around sister
 shot(0,w(2,'so').s,(u)=>{const a=lerp(0.35,-0.95,ease(u));const c=V(s0x()-0.3,0.95,2.55);return {p:V(c.x+Math.sin(a)*1.25,1.12-0.1*u,c.z+Math.cos(a)*1.25),l:V(s0x()-0.1*u,0.85,-0.6),fov:lerp(38,34,u)};},{focus:3.5,aperture:0.25});
 // 2 inside, hero, slow push
 shot(w(2,'so').s,w(2,'the').s,(u)=>({p:V(lerp(2.2,1.5,u),lerp(1.15,1.08,u),lerp(0.75,0.45,u)),l:V(0,1.12,-1.05),fov:40}),{aperture:0.35});
 // 3 floor-level door close
 shot(w(2,'the').s,w(2,'and').s,(u)=>({p:V(lerp(-0.55,-0.3,u),0.16,lerp(0.3,0.42,u)),l:V(0.05,0.85,1.4),fov:62,roll:-0.05}),{aperture:0.3,focus:1.3});
 // 4 through door window: sister lowers arm
 shot(w(2,'and').s,lineStart(3),(u)=>({world:true,p:V(ST.pos[0]+lerp(-1.9,-1.6,u),0.45,lerp(3.6,3.4,u)),l:V(ST.pos[0]-0.2,0.8,2.2),fov:lerp(44,40,u),roll:0.04}),{aperture:0.35});
 // 5 close to glass, she walks up, focus pull glass->her
 shot(lineStart(3),w(3,'and').s,(u)=>({p:V(-0.36,1.13,lerp(1.02,1.1,u)),l:V(s0x()-0.3,0.9,2.0),fov:44}),(u)=>({aperture:1.2,focus:lerp(0.32,0.75,sstep(0.25,0.75,u))}));
 // 6 head tilt close
 shot(w(3,'and').s,lineStart(4),(u)=>({p:V(lerp(-0.42,-0.33,u),lerp(1.02,1.0,u),lerp(1.05,1.15,u)),l:V(s0x()-0.3,0.93,1.78),fov:lerp(40,30,u)}),{aperture:0.9,focus:0.65});
 // 7 fly backwards through glass onto platform (world frame)
 shot(lineStart(4),w(4,'she').s,(u)=>{const e=ease(u);const z=lerp(0.75,3.35,e);const y=lerp(1.28,1.18,e);const x=lerp(0.33,0.42,sstep(0.55,1,u));
  return {world:true,p:V(ST.pos[0]+x,y,z),l:V(ST.pos[0]+lerp(0.1,-0.1,e),lerp(1.05,0.95,e),lerp(-1.2,0.0,e)),fov:lerp(50,44,e)};},(u)=>({aperture:0.3,focus:lerp(1.9,1.7,u)}));
 // 8 platform wide: train accelerates away; she stays
 shot(w(4,'she').s,lineStart(5),(u)=>({world:true,p:V(ST.pos[0]+lerp(-4.6,-4.1,u),lerp(1.05,0.95,u),lerp(3.3,3.1,u)),l:V(ST.pos[0]-0.3,0.7,1.75),fov:lerp(42,38,u)}),(u,t)=>({mblur:V(0.04*clamp(trainVel(t)/12),0),mbDepth:[4.6,30],aperture:0.25,focus:4.3}));
 // 9 phone raise
 shot(lineStart(5),w(5,'one').s,(u)=>({p:V(lerp(1.5,1.2,u),lerp(1.25,1.18,u),lerp(0.25,0.05,u)),l:V(0,1.12,-1.0),fov:42}),{aperture:0.4});
 // 10 phone close-up rotating
 shot(w(5,'one').s,lineStart(6),(u)=>{const ph=world.phone.getWorldPosition(new THREE.Vector3());const hd=world.hero.headC.getWorldPosition(new THREE.Vector3());
  const toH=hd.clone().sub(ph).normalize();const side=new THREE.Vector3(0,1,0).cross(toH).normalize();const a=lerp(0.75,0.35,ease(u));
  const d=toH.clone().multiplyScalar(Math.cos(a)).add(side.multiplyScalar(Math.sin(a))).add(V(0,0.18,0)).normalize();
  return {p:ph.clone().add(d.multiplyScalar(0.24)),l:ph.clone().add(V(0,0.005,0)),fov:38,roll:lerp(0.1,-0.05,u)};},{aperture:1.4,focusAuto:true});
 // 11 top orbit 360 (line 6)
 shot(lineStart(6),lineStart(7),(u)=>{const a=lerp(0,Math.PI*2,u)+Math.PI;const c=V(0,1.95,-0.78);return {p:V(c.x+Math.sin(a)*0.5,c.y,c.z+Math.cos(a)*0.45),l:V(0,1.12,-1.0),fov:70};},{aperture:0.3});
 // 12 front semi-orbit (ten minutes later)
 shot(lineStart(7),w(7,'the').s,(u)=>{const a=lerp(-1.2,1.2,u);return {p:V(Math.sin(a)*1.25,lerp(0.85,1.0,u),-1.05+Math.cos(a)*1.25),l:V(0,1.15,-1.05),fov:46};},{aperture:0.35});
 // 13 exterior: fly alongside train in tunnel
 shot(w(7,'the').s,w(7,'only').s,(u)=>({p:V(lerp(-11.5,-3.6,u),lerp(1.45,1.3,u),1.98),l:V(lerp(-6.5,-1.2,u),1.25,1.2),fov:58,roll:0.05}),{aperture:0.2,tilt:0.75});
 // 14 turn in, fly through window x=-1.75 into the car
 shot(w(7,'only').s,lineStart(8),(u)=>{const e=ease(u);const p=V(lerp(-2.6,-1.75,sstep(0,0.45,u)),1.33,lerp(1.98,0.35,sstep(0.25,1,u)));const l=V(lerp(-0.6,-1.2,e),lerp(1.3,1.0,e),lerp(1.2,-1.0,sstep(0,0.5,u)));return {p,l,fov:lerp(58,44,e)};},{aperture:0.25});
 // 15 macro on scratched window
 shot(lineStart(8),w(8,'rule').s,(u)=>({p:V(lerp(-2.15,-1.55,u),1.47,1.12),l:V(lerp(-2.0,-1.42,u),1.5,1.39),fov:44}),{aperture:1.0,focusAuto:true,tilt:0.5});
 // 16 oblique, RULE #4
 shot(w(8,'rule').s,w(8,'count').s,(u)=>({p:V(lerp(-0.95,-1.1,u),lerp(1.15,1.2,u),lerp(0.75,0.85,u)),l:V(-1.75,1.36,1.39),fov:lerp(46,40,u),roll:0.06}),{aperture:0.8,focusAuto:true});
 // 17 glide along "THERE ARE ONLY 7"
 shot(w(8,'count').s,w(9,'one').s-0.55,(u)=>({p:V(lerp(-2.05,-1.5,u),1.2,1.1),l:V(lerp(-1.95,-1.5,u),1.19,1.39),fov:42,roll:-0.04}),{aperture:1.0,focusAuto:true});
 // 18 station 1 from platform
 shot(w(9,'one').s-0.55,(w(9,'one').s+w(9,'two').s)/2,(u)=>({world:true,p:V(ST.pos[1]+lerp(7,6.4,u),1.6,4.6),l:V(ST.pos[1]-1,0.9,1.0),fov:52}),(u,t)=>({mblur:V(0.07,0),mbDepth:[2.5,9],aperture:0.15}));
 // 19 interior through window, station 2 flashes past
 shot((w(9,'one').s+w(9,'two').s)/2,(w(9,'two').s+w(9,'three').s)/2,(u)=>({p:V(lerp(0.4,0.6,u),1.15,-0.25),l:V(1.9,1.25,1.5),fov:50}),{mblur:V(0.06,0),mbDepth:[2.4,40],aperture:0.3,focus:1.3});
 // 20 top-down above train, station 3 with three figures
 shot((w(9,'two').s+w(9,'three').s)/2,lineStart(10),(u)=>({world:true,p:V(ST.pos[3]+lerp(1.5,-1.5,u),4.35,1.6),l:V(ST.pos[3]+lerp(1.5,-1.5,u)+0.01,0,1.75),up:V(1,0,0),fov:78,roll:0}),{mblur:V(0,0.0),aperture:0.0,tilt:0.9});
 // 21 dark interior, station 4 sweeping
 shot(lineStart(10),w(10,'flicker').s,(u)=>({p:V(lerp(-3.6,-2.9,u),1.3,0.15),l:V(1.5,1.0,-0.4),fov:46}),{aperture:0.3});
 // 22 neon tubes flicker on
 shot(w(10,'flicker').s,lineStart(11),(u)=>({p:V(lerp(-0.8,-1.2,u),1.55,0.25),l:V(-2.9,2.2,0.5),fov:50,roll:0.1}),{aperture:0.3});
 // 23 dolly zoom down the aisle
 shot(lineStart(11),w(11,'is').s,(u)=>{const e=ease(u);const x=lerp(-7.4,-2.6,e);const dist=0-x;const fov=2*Math.atan(1.7/dist)*180/Math.PI;return {p:V(x,1.3,0.05),l:V(0,1.0,-0.45),fov};},{aperture:0.15,tilt:0.55});
 // 24 wide high, every seat taken
 shot(w(11,'is').s,lineStart(12),(u)=>({p:V(lerp(7.5,7.2,u),2.0,lerp(0.6,0.4,u)),l:V(0,0.7,-0.2),fov:56}),{aperture:0.1});
 // 25 no faces: close on head
 shot(lineStart(12),w(12,'no',1).s,(u)=>({p:V(lerp(0.75,1.0,u),1.33,0.45),l:V(1.25,1.33,1.12),fov:36}),{aperture:1.0,focusAuto:true});
 // 26 no breathing: slow dolly past -z row
 shot(w(12,'no',1).s,w(12,'and').s,(u)=>({p:V(lerp(1.4,2.4,u),1.05,0.0),l:V(lerp(2.4,3.4,u),1.1,-1.1),fov:40}),{aperture:0.5,focusAuto:true});
 // 27 heads turn
 shot(w(12,'and').s,w(12,'is').s,(u)=>({p:V(lerp(-0.6,-1.0,u),1.25,-0.45),l:V(-3.0,1.2,1.0),fov:44}),{aperture:0.3});
 // 28 POV: all heads toward you
 shot(w(12,'is').s,lineStart(13),(u)=>({p:V(0.02,1.36,-0.93),l:V(lerp(-3.2,-2.6,u),1.15,lerp(-0.4,0.2,u)),fov:lerp(52,46,u)}),{aperture:0.25});
 // 29 POV rule 5
 shot(lineStart(13),w(13,'look',1).s,(u)=>({p:V(0.0,1.36,-0.93),l:V(lerp(0.8,0.2,u),1.25,1.1),fov:lerp(54,46,u)}),{aperture:0.2});
 // 30 tilt down to floor
 shot(w(13,'look',1).s,lineStart(14),(u)=>{const e=ease(clamp(u*1.3));return {p:V(0.0,1.4,-0.93),l:V(0.0,lerp(1.3,0.0,e),lerp(1.1,-0.38,e)),fov:54};},{aperture:0.2});
 // 31 floor-level, legs coming down aisle
 shot(lineStart(14),w(14,'coming').s,(u)=>({p:V(lerp(1.8,1.65,u),0.16,0.08),l:V(-4,0.55,0.0),fov:50,roll:0.02}),{aperture:0.25,focusAuto:false,focus:4});
 // 32 low diagonal close
 shot(w(14,'coming').s,lineStart(15)-0.65,(u)=>({p:V(1.1,0.22,-0.3),l:V(-1.4,0.7,0.2),fov:46}),{aperture:0.3,focus:2.2});
 // 33 POV down: dark feet stop in front of white feet
 shot(lineStart(15)-0.65,lineStart(16)-0.25,(u)=>({p:V(0.0,1.4,-0.93),l:V(0.0,0.0,-0.3),fov:60}),{aperture:0.15});
 // 34 head lowers upside-down
 shot(lineStart(16)-0.25,w(16,'get').s,(u)=>({p:V(0.0,1.4,-0.93),l:V(0.0,0.1,-0.33),fov:lerp(60,52,u)}),{aperture:0.2});
 shot(w(16,'get').s,w(17,'five').s-0.35,(u)=>({p:V(0.0,1.4,-0.93),l:V(0.0,0.4,-0.36),fov:lerp(38,30,u),roll:lerp(0,0.06,u)}),{aperture:0.35,focusAuto:true});
 // 35 station 5 extreme low
 shot(w(17,'five').s-0.35,(w(17,'five').s+w(17,'six').s)/2,(u)=>({world:true,p:V(ST.pos[5]+9,0.28,1.95),l:V(ST.pos[5]-6,1.0,1.1),fov:72,roll:0.3}),{mblur:V(0.06,0),mbDepth:[0.6,30],aperture:0});
 // 36 station 6 high corner
 shot((w(17,'five').s+w(17,'six').s)/2,lineStart(18),(u)=>({world:true,p:V(ST.pos[6]-14,4.3,6.6),l:V(ST.pos[6]-2,0,1.0),fov:64,roll:-0.25}),{mblur:V(0.05,0),mbDepth:[6,40],aperture:0});
 // 37 roll, red, clock reverses
 shot(lineStart(18),w(18,'backwards').s,(u)=>({p:V(lerp(-4.2,-3.4,u),1.25,0.05),l:V(1,1.0,-0.6),fov:44,roll:lerp(0,0.5,u)}),{aperture:0.3});
 shot(w(18,'backwards').s,lineStart(19),(u)=>({p:V(lerp(1.3,1.1,u),1.12,-0.2),l:V(0,1.05,-1.1),fov:40,roll:lerp(0.5,0.85,u)}),{aperture:0.4});
 // 39 station 7 thunders through
 shot(lineStart(19),w(19,'the').s,(u)=>({world:true,p:V(ST.pos[7]-9,1.6,5.6),l:V(ST.pos[7]+2,0.6,0.8),fov:54}),{mblur:V(0.09,0),mbDepth:[3,9],aperture:0});
 shot(w(19,'the').s,lineStart(20),(u)=>({world:true,p:V(ST.pos[7]+4,0.16,1.78),l:V(ST.pos[7]-3,-0.7,0.9),fov:66,roll:-0.12}),{mblur:V(0.08,0),mbDepth:[0.5,12],aperture:0});
 // 41 line map
 shot(lineStart(20),w(20,'an').s,(u)=>({p:V(lerp(0.55,0.05,u),1.5,0.28),l:V(lerp(0.42,-0.08,u),2.03,1.13),fov:46,roll:-0.03}),{aperture:0.25,tilt:0.3});
 shot(w(20,'an').s,lineStart(21)-1.25,(u)=>{const e=ease(clamp(u*1.4));return {p:V(lerp(-0.1,-0.5,e),1.55,lerp(0.35,0.45,u)),l:V(lerp(-0.18,-0.5,e),2.03,1.13),fov:lerp(42,34,u),roll:0.03};},{aperture:0.3,tilt:0.3});
 // 43 speaker
 shot(lineStart(21)-1.25,lineStart(22),(u)=>({p:V(2.75,1.95,lerp(0.35,0.3,u)),l:V(2.4,2.3,0),fov:lerp(38,30,u),roll:0.1}),{aperture:0.6,focusAuto:true});
 // 44 pull back
 shot(lineStart(22),w(22,'but').s,(u)=>{const e=ease(u);return {p:V(lerp(0.3,-6.9,e),lerp(1.2,1.85,e),lerp(0.35,0.55,e)),l:V(0,lerp(1.0,0.85,e),-1.0),fov:lerp(42,52,e)};},{aperture:0.2});
 shot(w(22,'but').s,lineStart(23),(u)=>({p:V(lerp(7.1,7.6,u),lerp(1.95,2.0,u),lerp(-0.2,-0.3,u)),l:V(0,1.0,-1.0),fov:lerp(30,40,u)}),{aperture:0.15});
 // 46 end: dark blurred
 shot(lineStart(23),TM.total+1,(u)=>({p:V(lerp(1.4,1.1,u),1.15,0.3),l:V(0,1.0,-1.0),fov:38,roll:0.05}),(u,t)=>({blurAll:sstep(lineStart(23),lineStart(23)+0.8,t)*0.85,fade:lerp(1,0.45,sstep(lineStart(23),lineStart(23)+1,t))}));
}
// ---------------- events (shared with audio) ----------------
function buildEvents(){const e=EV;e.rail=railJoints();e.stations=Object.entries(ST.times).filter(([k])=>k>0).map(([k,t])=>({k:+k,t}));
 e.tallSteps=[];const tot=6,dur=(T_.tallStop-T_.tallWalk0)/tot;for(let k=0;k<tot;k++)e.tallSteps.push(T_.tallWalk0+(k+1)*dur);
 e.doors=T_.doorsClose;e.depart=T_.depart;e.lightsOut=T_.lightsOut;e.flickerOn=T_.flickerOn;e.lightsOn=T_.lightsOn;e.headTurn=T_.headTurn;e.reverse=T_.reverse;e.redOn=T_.redOn;
 e.eighth=T_.eighth;e.appeared=T_.appeared;e.cuts=SH.map(s=>s.a);e.total=TM.total;e.choice=T_.choice;e.endcard=T_.endcard;
 e.rules=[W(8,'rule').s,W(13,'rule').s,W(22,'rule').s];e.st7=ST.times[7];e.bend0=T_.bend0;e.ticks=[];
 for(let t=0;t<TM.total;t+=1/30){const a=hud.clock(t),b=hud.clock(t+1/30);if(a.ss!==b.ss)e.ticks.push({t:t+1/30,rev:b.rev?1:0});}
 e.loopResets=[];for(let t=T_.choice-60;t<T_.choice;t+=1/30){}window.EVENTS=e;}
// camera shake
function shake(t,interior){let y=0,x=0,r=0;const dec=(dt,tau)=>dt>0?Math.exp(-dt/tau):0;
 if(interior)for(const tj of EV.rail){const dt=t-tj;if(dt>0&&dt<0.4){y+=0.004*Math.sin(dt*70)*dec(dt,0.08);}}
 for(const ts of EV.tallSteps){const dt=t-ts;if(dt>0&&dt<0.6){y+=-0.028*Math.sin(dt*45)*dec(dt,0.09);r+=0.012*Math.sin(dt*37)*dec(dt,0.1);}}
 const shocks=[T_.headTurn,...EV.rules,T_.appeared,T_.lightsOut];for(const s of shocks){const dt=t-s;if(dt>0&&dt<0.5){x+=0.02*Math.sin(dt*55)*dec(dt,0.08);y+=0.012*Math.sin(dt*63)*dec(dt,0.08);r+=0.02*Math.sin(dt*41)*dec(dt,0.1);}}
 // handheld drift
 x+=0.006*Math.sin(t*1.3)+0.003*Math.sin(t*3.1);y+=0.005*Math.sin(t*1.7+1);r+=0.004*Math.sin(t*0.9);
 return {x,y,r};}
function shock(t){let s=0;for(const tt of [T_.headTurn,T_.appeared,T_.lightsOut,...EV.rules]){const dt=t-tt;if(dt>0)s=Math.max(s,Math.exp(-dt/0.18));}
 for(const ts of EV.tallSteps){const dt=t-ts;if(dt>0)s=Math.max(s,0.35*Math.exp(-dt/0.12));}return s;}
window.renderFrame=function(t){setScene(t);const sh=SH.find(s=>t>=s.a&&t<s.b)||SH[SH.length-1];const u=clamp((t-sh.a)/(sh.b-sh.a));
 const c=window.DEBUGCAM?{p:V(...window.DEBUGCAM.p),l:V(...window.DEBUGCAM.l),fov:window.DEBUGCAM.fov||45,world:window.DEBUGCAM.world}:sh.cam(u,t);let p=c.p.clone(),l=c.l.clone();if(c.world){p.x-=world.p;l.x-=world.p;}
 camera.fov=c.fov||45;camera.updateProjectionMatrix();camera.position.copy(p);camera.up.copy(c.up||V(0,1,0));camera.lookAt(l);
 const interior=Math.abs(p.z)<1.35&&p.y>0&&p.y<2.4&&Math.abs(p.x)<8;const s=shake(t,interior);camera.translateX(s.x);camera.translateY(s.y);camera.rotateZ((c.roll||0)+s.r);
 updateFigures();
 const fx=window.DEBUGCAM?{aperture:0,tilt:0}:(typeof sh.fx==='function'?sh.fx(u,t):sh.fx);const U=post.U;const dist=p.distanceTo(l);
 U.focus.value=fx.focus??dist;U.aperture.value=fx.aperture??0.3;U.tilt.value=(fx.tilt??0.55)*0.6;U.tiltC.value=0.5;U.maxBlur.value=11;
 const sk=shock(t);U.ca.value=0.0012+sk*0.012;U.grain.value=0.075;U.seed.value=(t*30)%1000;U.vig.value=0.55;
 const mb=fx.mblur||V(0,0);U.mblur.value.set(mb.x,mb.y);const md=fx.mbDepth||[0,1000];U.mbDepth.value.set(md[0],md[1]);
 const hg=hud.glitch(t);U.glitch.value=Math.max(hg,sk>0.6?0.5*sk:0);U.fade.value=fx.fade??1;U.red.value=redLevel(t)*0.35;U.blurAll.value=fx.blurAll??0;
 // cut flash at station passes
 for(const k in ST.times){if(k==0)continue;const dt=t-ST.times[k];if(dt>-0.05&&dt<0.25)U.fade.value*=1+0.8*Math.exp(-Math.abs(dt)/0.07);}
 post.render(camera);hud.update(t);renderer.getContext().finish();return true;};
window.shotAt=t=>SH.findIndex(s=>t>=s.a&&t<s.b);window.shotList=()=>SH.map(s=>[s.a,s.b]);
init().catch(e=>{window.INIT_ERR=String(e.stack||e);console.error(e);});
