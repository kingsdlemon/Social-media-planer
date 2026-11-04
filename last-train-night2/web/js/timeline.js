// timing helpers + global deterministic state functions
export let TM=null;
export async function loadTiming(){TM=await (await fetch('timing.json')).json();return TM;}
const norm=w=>w.toLowerCase().replace(/[^a-z0-9']/g,'');
// W(line(1-based), word, occurrence) -> {s,e}
export function W(line,word,occ=0){const ws=TM.words.filter(x=>x.line===line-1&&norm(x.w)===norm(word));if(!ws[occ])throw new Error('word not found '+line+' '+word);return ws[occ];}
export function lineStart(l){return TM.timeline.find(x=>x.line===l-1).start;}
export function lineEnd(l){const a=TM.timeline.filter(x=>x.line===l-1);return a[a.length-1].end;}
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export const lerp=(a,b,t)=>a+(b-a)*t;
export const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export const easeOut=t=>1-Math.pow(1-t,3), easeIn=t=>t*t*t;
// ---- speed profile ----
let VT=null,PT=null;const DT=1/600;
export let ST={}; // station times & positions
export function buildTimeline(){
 const K=[ // [time, speed m/s]
  [0,0],[lineStart(4)+0.15,0],[lineStart(5),14],[lineStart(8),17],[W(9,'one').s-1.4,22],[W(9,'one').s-0.5,46],[W(9,'three').s+0.4,46],
  [W(10,'four').s+0.6,22],[lineStart(11),17],[lineStart(17)-1.2,20],[W(17,'five').s-0.4,46],[W(17,'six').s+0.4,46],[lineStart(18)+0.8,24],
  [W(19,'station').s-1.0,30],[W(19,'seven').s,42],[lineEnd(19),40],[lineStart(20)+1,26],[200,26]];
 const n=Math.ceil(TM.total/DT)+10;VT=new Float32Array(n);PT=new Float32Array(n);let p=0;
 for(let i=0;i<n;i++){const t=i*DT;let k=0;while(k<K.length-2&&K[k+1][0]<=t)k++;const [t0,v0]=K[k],[t1,v1]=K[k+1];
  let u=clamp((t-t0)/(t1-t0));u=k<2?u*u*(3-2*u):(1-Math.cos(Math.PI*u))/2;// accel from rest smooth
  // departure: smooth start (gentle)
  const v=lerp(v0,v1,u);VT[i]=v;PT[i]=p;p+=v*DT;}
 // stations: index -> time when station centre passes car centre
 ST.times={0:0,1:W(9,'one').s+0.05,2:W(9,'two').s+0.05,3:W(9,'three').s+0.05,4:W(10,'four').s+0.05,5:W(17,'five').s+0.05,6:W(17,'six').s+0.05,7:W(19,'seven').s+0.05};
 ST.pos={};for(const k in ST.times)ST.pos[k]=k==0?0:trainPos(ST.times[k]);
 return ST;}
export function trainPos(t){const f=t/DT,i=Math.max(0,Math.floor(f));if(i>=PT.length-1)return PT[PT.length-1];return PT[i]+(PT[i+1]-PT[i])*(f-i);}
export function trainVel(t){const i=clamp(Math.round(t/DT),0,VT.length-1);return VT[i];}
// rail joints: pairs every 1.1s while moving (second hit 0.13s later)
export function railJoints(){const ev=[];for(let t=lineStart(4)+1.2;t<TM.total;t+=1.1){if(trainVel(t)>3){ev.push(t,t+0.13);}}return ev;}
