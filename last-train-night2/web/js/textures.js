import * as THREE from 'three';
export function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function cnv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function tex(c,rep=[1,1],srgb=true){const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
// value noise
function vnoise(w,h,cell,r){const gw=Math.ceil(w/cell)+1,gh=Math.ceil(h/cell)+1,g=new Float32Array(gw*gh).map(()=>r());
 const out=new Float32Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const fx=x/cell,fy=y/cell,ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy;
 const sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);const i0=(ix%(gw-1)),j0=(iy%(gh-1));const a=g[j0*gw+i0],b=g[j0*gw+((i0+1)%(gw-1))],c=g[((j0+1)%(gh-1))*gw+i0],d=g[((j0+1)%(gh-1))*gw+((i0+1)%(gw-1))];
 out[y*w+x]=a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;}return out;}
function heightToNormal(hf,w,h,strength){const c=cnv(w,h),ctx=c.getContext('2d'),img=ctx.createImageData(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const l=hf[y*w+((x-1+w)%w)],rr=hf[y*w+((x+1)%w)],u=hf[((y-1+h)%h)*w+x],d=hf[((y+1)%h)*w+x];
  let nx=(l-rr)*strength,ny=(d-u)*strength,nz=1;const L=Math.hypot(nx,ny,nz);const i=(y*w+x)*4;
  img.data[i]=(nx/L*0.5+0.5)*255;img.data[i+1]=(ny/L*0.5+0.5)*255;img.data[i+2]=(nz/L*0.5+0.5)*255;img.data[i+3]=255;}
 ctx.putImageData(img,0,0);return c;}
// clay: lumpy noise + fingerprint ridges + tiny dents
export function clayNormal(){const W=512,r=rng(11);const hf=new Float32Array(W*W);
 const n1=vnoise(W,W,64,r),n2=vnoise(W,W,16,r),n3=vnoise(W,W,5,r);
 for(let i=0;i<W*W;i++)hf[i]=n1[i]*1.0+n2[i]*0.35+n3[i]*0.08;
 for(let k=0;k<26;k++){const cx=r()*W,cy=r()*W,R=30+r()*70,fr=0.55+r()*0.25,ang=r()*6.28;
  for(let y=-R;y<R;y++)for(let x=-R;x<R;x++){const d=Math.hypot(x,y*1.35);if(d>R)continue;
   const xx=((Math.floor(cx+x)%W)+W)%W,yy=((Math.floor(cy+y)%W)+W)%W;const fall=Math.pow(1-d/R,1.5);
   hf[yy*W+xx]+=Math.sin(d*fr+ang)*0.05*fall;}}
 for(let k=0;k<180;k++){const cx=r()*W,cy=r()*W,R=2+r()*5;for(let y=-R;y<R;y++)for(let x=-R;x<R;x++){const d=Math.hypot(x,y);if(d>R)continue;const xx=((Math.floor(cx+x)%W)+W)%W,yy=((Math.floor(cy+y)%W)+W)%W;hf[yy*W+xx]-=0.06*(1-d/R);}}
 return tex(heightToNormal(hf,W,W,9),[2,2],false);}
export function floorTiles(){const W=512,c=cnv(W,W),x=c.getContext('2d'),r=rng(3);
 const n=4,s=W/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const v=78+r()*14;x.fillStyle=`rgb(${v},${v+6},${v+18})`;x.fillRect(i*s,j*s,s,s);
  for(let k=0;k<260;k++){const g=r()*70+50;x.fillStyle=`rgba(${g},${g+5},${g+15},${0.25+r()*0.3})`;x.fillRect(i*s+r()*s,j*s+r()*s,1+r()*2.5,1+r()*2.5);}}
 x.strokeStyle='rgba(20,24,34,0.95)';x.lineWidth=5;for(let i=0;i<=n;i++){x.beginPath();x.moveTo(i*s,0);x.lineTo(i*s,W);x.stroke();x.beginPath();x.moveTo(0,i*s);x.lineTo(W,i*s);x.stroke();}
 // scuffs
 for(let k=0;k<40;k++){x.strokeStyle=`rgba(0,0,0,${0.08+r()*0.1})`;x.lineWidth=2+r()*6;x.beginPath();const a=r()*W,b=r()*W;x.moveTo(a,b);x.lineTo(a+(r()-.5)*120,b+(r()-.5)*40);x.stroke();}
 return tex(c,[1,1]);}
export function concrete(){const W=512,c=cnv(W,W),x=c.getContext('2d'),r=rng(5),img=x.createImageData(W,W);
 const n1=vnoise(W,W,96,r),n2=vnoise(W,W,24,r),n3=vnoise(W,W,4,r);
 for(let i=0;i<W*W;i++){const v=50+n1[i]*40+n2[i]*22+n3[i]*16;img.data[i*4]=v*0.92;img.data[i*4+1]=v*0.96;img.data[i*4+2]=v*1.05;img.data[i*4+3]=255;}
 x.putImageData(img,0,0);for(let k=0;k<30;k++){x.fillStyle=`rgba(10,10,12,${0.05+r()*0.12})`;const a=r()*W;x.fillRect(a,r()*W*0.3,2+r()*8,80+r()*300);}
 x.strokeStyle='rgba(15,15,18,0.6)';x.lineWidth=3;x.beginPath();x.moveTo(0,W*0.5);x.lineTo(W,W*0.5);x.stroke();return tex(c,[1,1]);}
export function wallTiles(tint=[220,226,224],dirty=0.5,seed=8){const W=512,c=cnv(W,W),x=c.getContext('2d'),r=rng(seed);
 x.fillStyle='#3a3d40';x.fillRect(0,0,W,W);const tw=64,th=32;
 for(let j=0;j<W/th;j++)for(let i=-1;i<W/tw+1;i++){const ox=(j%2)*tw/2;const k=0.75+r()*0.2;
  x.fillStyle=`rgb(${tint[0]*k|0},${tint[1]*k|0},${tint[2]*k|0})`;x.fillRect(i*tw+ox+2,j*th+2,tw-4,th-4);
  const g=x.createLinearGradient(0,j*th,0,j*th+th);g.addColorStop(0,'rgba(255,255,255,0.18)');g.addColorStop(1,'rgba(0,0,0,0.12)');x.fillStyle=g;x.fillRect(i*tw+ox+2,j*th+2,tw-4,th-4);}
 for(let k=0;k<60*dirty;k++){const a=r()*W;const g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'rgba(40,30,20,0)');g.addColorStop(1,`rgba(40,32,22,${0.25*r()})`);x.fillStyle=g;x.fillRect(a,r()*W*0.5,4+r()*20,W);}
 return tex(c,[1,1]);}
export function tactile(){const W=256,c=cnv(W,W),x=c.getContext('2d');x.fillStyle='#d9a21b';x.fillRect(0,0,W,W);
 for(let i=0;i<W;i+=16){x.fillStyle='rgba(255,230,120,0.6)';x.fillRect(i,0,6,W);x.fillStyle='rgba(80,50,0,0.5)';x.fillRect(i+7,0,3,W);}return tex(c,[1,1]);}
export function radial(inner='rgba(0,0,0,0.8)',outer='rgba(0,0,0,0)',S=128){const c=cnv(S,S),x=c.getContext('2d');const g=x.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);g.addColorStop(0,inner);g.addColorStop(1,outer);x.fillStyle=g;x.fillRect(0,0,S,S);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export function fogTex(seed=4){const S=256,c=cnv(S,S),x=c.getContext('2d'),r=rng(seed);
 for(let k=0;k<40;k++){const px=S*(0.2+r()*0.6),py=S*(0.3+r()*0.4),R=S*(0.1+r()*0.25);const g=x.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,'rgba(255,255,255,0.10)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,S,S);}
 const t=new THREE.CanvasTexture(c);return t;}
export function grille(){const S=256,c=cnv(S,S),x=c.getContext('2d');x.fillStyle='#c9ced6';x.beginPath();x.arc(S/2,S/2,S/2,0,7);x.fill();
 x.fillStyle='#14171d';for(let j=-8;j<=8;j++)for(let i=-8;i<=8;i++){const px=S/2+i*13+(j%2)*6,py=S/2+j*12;if(Math.hypot(px-S/2,py-S/2)<S*0.4){x.beginPath();x.arc(px,py,3.6,0,7);x.fill();}}
 x.strokeStyle='#8b919b';x.lineWidth=8;x.beginPath();x.arc(S/2,S/2,S/2-5,0,7);x.stroke();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export function glassSmudge(){const S=512,c=cnv(S,S),x=c.getContext('2d'),r=rng(21);x.clearRect(0,0,S,S);
 for(let k=0;k<70;k++){const px=r()*S,py=r()*S,R=6+r()*30;const g=x.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,`rgba(255,255,255,${0.05+r()*0.08})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(px-R,py-R,2*R,2*R);}
 for(let k=0;k<14;k++){x.strokeStyle=`rgba(255,255,255,${0.04+r()*0.05})`;x.lineWidth=1;x.beginPath();let a=r()*S,b=r()*S;x.moveTo(a,b);for(let q=0;q<6;q++){a+=(r()-.5)*60;b+=r()*40;x.lineTo(a,b);}x.stroke();}
 // handprint
 x.fillStyle='rgba(255,255,255,0.07)';x.beginPath();x.ellipse(S*0.62,S*0.62,40,52,0,0,7);x.fill();for(let f=0;f<5;f++){x.beginPath();x.ellipse(S*0.62+(f-2)*20,S*0.62-70-(f==2?14:f%2?6:0),8,26,(f-2)*0.12,0,7);x.fill();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
// scratched text on window
export function scratchText(){const W=1024,H=512,c=cnv(W,H),x=c.getContext('2d'),r=rng(44);x.clearRect(0,0,W,H);
 const lines=[['COUNT THE',95],['STATIONS',215],['THERE ARE',330],['ONLY 7',445]];
 x.lineCap='round';x.lineJoin='round';
 for(const [s,y] of lines){let px=70+r()*30;for(const ch of s){if(ch===' '){px+=46;continue;}
  const size=96+r()*16,rot=(r()-.5)*0.2;x.font=`${size}px "Bebas Neue"`;const adv=x.measureText(ch).width;x.save();x.translate(px,y+(r()-.5)*10);x.rotate(rot);x.font=`${size}px "Bebas Neue"`;
  for(let p=0;p<4;p++){x.strokeStyle=`rgba(235,240,255,${0.35+r()*0.35})`;x.lineWidth=0.8+r()*1.6;x.strokeText(ch,(r()-.5)*4,(r()-.5)*4);}
  x.restore();px+=adv+6+r()*8;}}
 for(let k=0;k<40;k++){x.strokeStyle=`rgba(235,240,255,${0.1+r()*0.25})`;x.lineWidth=0.6+r();x.beginPath();const a=r()*W,b=r()*H;x.moveTo(a,b);x.lineTo(a+(r()-.5)*90,b+(r()-.5)*30);x.stroke();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}
export const STATION_NAMES=['MERIDIAN','ASH LANE','GREY PARK','COLDWELL','VESPER','NINE ELMS','HOLLOWAY','BLACKMOOR'];
export function stationSign(i){const W=512,H=128,c=cnv(W,H),x=c.getContext('2d');x.fillStyle='#0E1220';x.fillRect(0,0,W,H);x.strokeStyle='#DDE8F5';x.lineWidth=6;x.strokeRect(6,6,W-12,H-12);
 x.fillStyle='#E5322D';x.beginPath();x.arc(70,64,38,0,7);x.fill();x.fillStyle='#fff';x.font='bold 54px "Bebas Neue"';x.textAlign='center';x.textBaseline='middle';x.fillText(String(i),70,67);
 x.textAlign='left';x.font='68px "Bebas Neue"';x.fillText(STATION_NAMES[i],130,68);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}
// dynamic canvases
export class LineMap{constructor(){this.c=cnv(1024,256);this.t=new THREE.CanvasTexture(this.c);this.t.colorSpace=THREE.SRGBColorSpace;this.t.anisotropy=8;this.key='';}
 draw(cur,eighth,glitch,seed){const key=cur+'|'+eighth.toFixed(2)+'|'+glitch.toFixed(2)+'|'+(glitch>0?seed:0);if(key===this.key)return;this.key=key;
  const x=this.c.getContext('2d'),W=1024,H=256,r=rng(seed);x.fillStyle='#0b0f1a';x.fillRect(0,0,W,H);x.fillStyle='#2F4F8F';x.fillRect(0,0,W,40);
  x.fillStyle='#DDE8F5';x.font='30px "Bebas Neue"';x.fillText('LINE 0  ·  NIGHT SERVICE',20,30);x.fillStyle='#FFB547';x.fillText('◀ DIRECTION',860,30);
  const x0=80,dx=(W-170)/7,y=140;x.strokeStyle='#FFB547';x.lineWidth=10;x.beginPath();x.moveTo(x0,y);x.lineTo(x0+dx*6,y);x.stroke();
  if(eighth>0){x.strokeStyle=`rgba(229,50,45,${eighth})`;x.beginPath();x.moveTo(x0+dx*6,y);x.lineTo(x0+dx*7,y);x.stroke();}
  x.font='36px "Bebas Neue"';x.textAlign='center';
  for(let i=0;i<7;i++){const px=x0+dx*i;const passed=i+1<=cur;x.fillStyle=passed?'#5d6577':'#DDE8F5';x.beginPath();x.arc(px,y,22,0,7);x.fill();
   if(i+1===cur){x.strokeStyle='#FFB547';x.lineWidth=5;x.beginPath();x.arc(px,y,22,0,7);x.stroke();}
   x.fillStyle=passed?'#6a7284':'#DDE8F5';x.fillText(STATION_NAMES[i+1],px,y+(i%2?-40:62));x.fillStyle='#0b0f1a';x.fillText(String(i+1),px,y+13);}
  if(eighth>0){const px=x0+dx*7;x.globalAlpha=eighth;x.fillStyle='#E5322D';x.shadowColor='#E5322D';x.shadowBlur=30;x.beginPath();x.arc(px,y,27,0,7);x.fill();x.shadowBlur=0;
   x.fillStyle='#fff';x.fillText('8',px,y+13);x.fillStyle='#E5322D';x.font='38px "Bebas Neue"';x.fillText('YOUR STOP',px-20,y+68);x.globalAlpha=1;}
  if(glitch>0){for(let k=0;k<10*glitch;k++){const yy=r()*H,hh=4+r()*20,sh=(r()-.5)*80*glitch;const d=x.getImageData(0,yy,W,hh);x.putImageData(d,sh,yy);}
   x.fillStyle=`rgba(229,50,45,${0.25*glitch})`;x.fillRect(0,r()*H,W,6);}
  x.textAlign='left';this.t.needsUpdate=true;}}
export class PhoneScreen{constructor(){this.c=cnv(256,512);this.t=new THREE.CanvasTexture(this.c);this.t.colorSpace=THREE.SRGBColorSpace;this.key='';}
 draw(hm,ss,red,glitch){const key=hm+ss+red.toFixed(2)+glitch.toFixed(1);if(key===this.key)return;this.key=key;const x=this.c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#1b2540');g.addColorStop(1,'#070912');x.fillStyle=g;x.fillRect(0,0,256,512);
  x.fillStyle='rgba(221,232,245,0.7)';x.font='22px Montserrat';x.textAlign='center';x.fillText('TUESDAY, NOV 4',128,110);
  x.fillStyle=red>0.5?'#ff6a5e':'#DDE8F5';x.font='120px "Bebas Neue"';x.fillText(hm,128,230);x.font='44px "Bebas Neue"';x.fillText(':'+ss+' AM',128,280);
  x.fillStyle='rgba(221,232,245,0.5)';x.font='18px Montserrat';x.fillText('NO SERVICE',128,40);x.fillRect(78,470,100,6);
  if(glitch>0){x.fillStyle='rgba(229,50,45,0.4)';x.fillRect(0,180+glitch*40,256,20);}this.t.needsUpdate=true;}}
