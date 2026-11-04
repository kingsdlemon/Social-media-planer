import {W,lineStart,lineEnd,clamp,sstep,lerp,ease,easeOut} from './timeline.js';
const STOP=new Set(['the','a','an','to','your','of','in','at','on','and','is','but','my','her','his','their','its','if','that','so','into','than','for','with','every','no','one','are','there','where','toward','above','down','up','just','still','doesn\'t','didn\'t','you']);
const KEY=new Set(['seated','stay','sister','waving','glass','slowly','tilts','head','train','watches','phone','one','thirty-one','a.m.','still','looping','time','moving','scratched','window','rule','four','count','stations','seven','two','three','lights','flicker','every','seat','taken','faces','breathing','single','turned','five','floor','footsteps','heavy','stop','six','clock','backwards','map','eighth','appeared','never','answer','announcements','voice','live','comments','aisle','stops','follow','minutes','minute','ten','look']);
const norm=w=>w.toLowerCase().replace(/[^a-z0-9'.-]/g,'').replace(/\.+$/,'').replace(/^\.+/,'');
const $=id=>document.getElementById(id);
export class HUD{constructor(TM){this.TM=TM;this.build();this.chunks=this.makeChunks();
  this.t={loop0:lineStart(6),loop1:lineEnd(7),rev:W(18,'moving').s,frozen0:lineStart(6),choice:lineStart(23),end:lineStart(23)+7.0,
   r4:W(8,'rule').s,r4e:lineStart(10)-0.2,r5:W(13,'rule').s,r5e:lineStart(14)+0.3,r2:W(22,'rule').s,r2e:W(22,'but').s,eighth:W(20,'eighth').s,appeared:W(20,'appeared').s};
  this.st=[W(9,'one').s,W(9,'two').s,W(9,'three').s,W(10,'four').s,W(17,'five').s,W(17,'six').s,W(19,'seven').s].map(x=>x+0.05);}
 build(){}
 makeChunks(){const out=[];const lines={};for(const w of this.TM.words){(lines[w.line]=lines[w.line]||[]).push(w);}
  for(const li in lines){const ws=lines[li];if(+li===22)continue;// last line handled by choice screen
   const phrases=[];let cur=[];for(const w of ws){cur.push(w);if(/[.,?!]$|\.\.\.$/.test(w.w)||+li===8||+li===16){phrases.push(cur);cur=[];}}if(cur.length)phrases.push(cur);
   for(const ph of phrases){const n=ph.length,k=Math.ceil(n/3);let sizes=[];let rem=n;for(let i=0;i<k;i++){const s=Math.ceil(rem/(k-i));sizes.push(s);rem-=s;}
    // fix stopword endings by shifting boundaries
    let idx=0;const bounds=[];for(const s of sizes){idx+=s;bounds.push(idx);}
    for(let b=0;b<bounds.length-1;b++){const last=norm(ph[bounds[b]-1].w);if(STOP.has(last)){const prevB=b?bounds[b-1]:0;if(bounds[b]+1-prevB<=3&&bounds[b+1]-bounds[b]>1)bounds[b]++;else if(bounds[b]-1>prevB&&bounds[b+1]-bounds[b]+1<=3)bounds[b]--;}}
    let a=0;for(const b of bounds){out.push({ws:ph.slice(a,b),who:ws[0].who,line:+li});a=b;}}}
  out.sort((a,b)=>a.ws[0].s-b.ws[0].s);for(let i=0;i<out.length;i++){const c=out[i],nx=out[i+1];c.s=c.ws[0].s-0.06;c.e=Math.min(nx?nx.ws[0].s-0.03:1e9,c.ws[c.ws.length-1].e+0.55);}
  return out;}
 clock(t){// returns hm, ss, mode
  let hm='1:31',ss,red=0,glitch=0,rev=false,label='',mf=31;
  if(t<this.t.loop0){ss=12+Math.floor(t);}
  else if(t<this.t.loop1){const per=1.15;const u=(t-this.t.loop0)/per;const start=(12+Math.floor(this.t.loop0))/60;const v=(start+u)%1;ss=Math.floor(v*60);const since=(v*per);glitch=since<0.12?1-since/0.12:0;label='TIME: FROZEN';}
  else if(t<this.t.rev){ss=(Math.floor(t-this.t.loop1)+0)%60;}
  else{rev=true;red=1;label='TIME: REVERSING';const d=t-this.t.rev;const minutes=d*0.9+d*d*0.012;mf=31-minutes;const m=Math.floor(mf);hm='1:'+String(Math.max(0,m)).padStart(2,'0');ss=String(59-Math.floor((d*45)%60)).padStart(2,'0');}
  ss=String(ss).padStart(2,'0');return {hm,ss,red,glitch,rev,label,mf};}
 glitch(t){const c=this.clock(t);let g=c.glitch*0.6;if(t>this.t.eighth&&t<this.t.appeared+0.4&&Math.sin(t*90)>0.6)g=Math.max(g,0.5);return g;}
 update(t){const c=this.clock(t);
  // clock digits: odometer columns for minutes
  const hmEl=$('hm');
  if(c.rev){const mf=c.mf;const d=mf;// continuous
   const ones=((d%10)+10)%10,tens=Math.floor(d/10);const frac=d-Math.floor(d);const roll=sstep(0.0,0.3,frac); // roll happens near integer boundary
   const onesPos=Math.floor(d)%10+(1-roll)*0; // integer
   const ip=Math.floor(d),f=d-ip;const k=1-sstep(0.0,0.28,f);// k:0..1 transition into ip from ip+1
   const onesV=(ip%10)+k*1;const tensV=Math.floor(ip/10)+((ip%10)===9?k:0);
   $('m1').style.transform=`translateY(${-(tensV)*1}em)`;$('m2').style.transform=`translateY(${-(onesV)*1}em)`;}
  else{$('m1').style.transform=`translateY(-3em)`;$('m2').style.transform=`translateY(-1em)`;}
  $('ss').textContent=':'+c.ss;$('clock').classList.toggle('red',!!c.red);
  const gl=c.glitch>0||(c.rev&&Math.sin(t*37)>0.93);$('clock').style.textShadow=gl?`${-6*(c.glitch||0.5)}px 0 rgba(255,0,60,.9), ${6*(c.glitch||0.5)}px 0 rgba(0,240,255,.9)`:'';
  $('clock').style.transform=`translateX(-50%) ${gl?`translateX(${(Math.sin(t*300)*6)|0}px)`:''}`;
  const lab=$('clabel');lab.textContent=c.label;const blink=c.label?(Math.floor(t*2.2)%2===0?1:0.25):0;lab.style.opacity=blink;lab.classList.toggle('rev',c.rev);
  // station counter
  let n=this.st.filter(x=>t>=x).length,eighth=t>=this.t.eighth;let disp=eighth?8:n;
  $('stn').textContent=disp;const last=eighth?this.t.eighth:(n?this.st[n-1]:-9);const pop=1+0.45*Math.exp(-Math.max(0,t-last)/0.12)*(t-last<0.6?1:0);
  $('stn').style.transform=`scale(${pop})`;$('tr').classList.toggle('bad',eighth);
  const dots=$('dots').children;for(let i=0;i<8;i++){const d=dots[i];d.className=i<n?'on':'';if(i===7){d.style.display=eighth?'inline-block':'none';d.className='red';}
   const pl=i<n?this.st[i]:(i===7?this.t.eighth:-9);d.style.transform=`scale(${1+0.8*Math.exp(-Math.max(0,t-pl)/0.1)*(t>=pl&&t-pl<0.5?1:0)})`;}
  if(eighth){$('stn').style.textShadow=Math.sin(t*50)>0.3?'-4px 0 #0ff, 4px 0 #f03':'0 0 18px #E5322D';}
  // rule badge
  const rb=$('rule');let rule=null;if(t>=this.t.r4&&t<this.t.r4e)rule=['RULE #4','COUNT THE STATIONS. ONLY 7.',this.t.r4];else if(t>=this.t.r5&&t<this.t.r5e)rule=['RULE #5','LOOK AT THE FLOOR',this.t.r5];else if(t>=this.t.r2&&t<this.t.r2e)rule=['RULE #2','NEVER ANSWER THE ANNOUNCEMENTS',this.t.r2];
  if(rule){rb.style.display='block';$('rtag').textContent=rule[0];$('rhead').textContent=rule[1];const dt=t-rule[2];const s=dt<0.18?lerp(1.6,1,easeOut(dt/0.18)):1;rb.style.transform=`translateX(-50%) scale(${s})`;rb.style.opacity=clamp(dt/0.1);}else rb.style.display='none';
  // captions
  const cap=$('cap');const ch=this.chunks.find(c=>t>=c.s&&t<c.e);
  if(ch&&t<this.t.choice){const key=ch.ws[0].s;if(cap.dataset.k!=String(key)){cap.dataset.k=key;cap.innerHTML='';
     if(ch.who!=='N'){const lb=document.createElement('div');lb.className='who';lb.textContent=ch.who==='SIS'?'YOUR SISTER?':'SPEAKER · CAR 3';cap.appendChild(lb);}
     const row=document.createElement('div');row.className='row';cap.appendChild(row);
     for(const w of ch.ws){const sp=document.createElement('span');const raw=w.w.replace(/\.\.\.$/,'…');sp.textContent=raw.toUpperCase().replace(/[.,]$/,'');sp.className='w'+(ch.who!=='N'?' char':KEY.has(norm(w.w))?' key':'');row.appendChild(sp);}}
   const spans=cap.querySelectorAll('span.w');ch.ws.forEach((w,i)=>{const dt=t-w.s+0.04;const sp=spans[i];if(dt<0){sp.style.opacity=0;sp.style.transform='scale(0.6)';}else{const e=clamp(dt/0.13);sp.style.opacity=1;sp.style.transform=`scale(${lerp(1.09,1,easeOut(e))}) translateY(${lerp(-10,0,easeOut(e))}px)`;}});
   cap.style.display='block';cap.classList.toggle('charcap',ch.who!=='N');}
  else{cap.style.display='none';}
  // vote card
  const v=$('vote');const vo=t<lineStart(2)-0.15?1:clamp(1-(t-(lineStart(2)-0.15))/0.25);v.style.opacity=vo;v.style.display=vo>0?'block':'none';
  const vs=t<0.25?lerp(0.7,1,easeOut(t/0.25)):1;v.style.transform=`translateX(-50%) scale(${vs})`;$('vote2').style.opacity=t<0.35?0:(Math.sin(t*25)>-0.8||t>1?1:0.3);
  // choice + end
  const chE=$('choice'),endE=$('endcard');const tc=t-this.t.choice,te=t-this.t.end;
  if(tc>0&&te<0){chE.style.display='block';chE.style.opacity=clamp(tc/0.25)*clamp(1-(te+0.35)/0.35);const q=$('q');q.style.transform=`scale(${tc<0.25?lerp(1.5,1,easeOut(tc/0.25)):1})`;
   [$('b1'),$('b2'),$('cb')].forEach((b,i)=>{const d=tc-(0.6+i*0.35);b.style.opacity=clamp(d/0.15);b.style.transform=`scale(${d<0?0.6:d<0.18?lerp(1.25,1,easeOut(d/0.18)):1+0.025*Math.sin((t+i)*5)})`;});}
  else chE.style.display='none';
  if(te>0){endE.style.display='block';endE.style.opacity=clamp(te/0.4);$('e3').style.opacity=clamp((te-0.8)/0.3);}else endE.style.display='none';
  // top hud fade during end card
  $('top').style.opacity=te>0?clamp(1-te/0.4):1;}}
