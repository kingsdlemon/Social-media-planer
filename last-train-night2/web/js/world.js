import * as THREE from 'three';
import {RoundedBoxGeometry} from './../lib/jsm/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from './../lib/jsm/utils/BufferGeometryUtils.js';
import * as TX from './textures.js';
import {Figure,Batch} from './figure.js';
export const C={navy:0x0E1220,steel:0x2B3A55,bench:0x2F4F8F,neon:0xDDE8F5,amber:0xFFB547,red:0xE5322D,clay:0xECE8DF,dark:0x15181F};
export const CAR={L:16,hw:1.35,ow:1.45,wallH:1.95,roofIn:2.35,roofOut:2.52,floorBot:-0.38};
// opening layouts (x center, width, y0, y1)
const DOORS_P=[0,-5,5],DOORS_N=[-5,5];
const WIN_P=[-1.75,1.75,-3.45,3.45,-6.75,6.75],WIN_N=[0,-1.75,1.75,-3.45,3.45,-6.75,6.75];
export const WIN={y0:0.95,y1:1.72,w:1.42},DOOR={w:1.3,h:1.88};
function rrect(path,x0,y0,x1,y1,r){path.moveTo(x0+r,y0);path.lineTo(x1-r,y0);path.quadraticCurveTo(x1,y0,x1,y0+r);path.lineTo(x1,y1-r);path.quadraticCurveTo(x1,y1,x1-r,y1);path.lineTo(x0+r,y1);path.quadraticCurveTo(x0,y1,x0,y1-r);path.lineTo(x0,y0+r);path.quadraticCurveTo(x0,y0,x0+r,y0);}
function wallShape(doors,wins,y0,y1){const s=new THREE.Shape();s.moveTo(-8,y0);s.lineTo(8,y0);s.lineTo(8,y1);s.lineTo(-8,y1);s.lineTo(-8,y0);
 for(const d of doors){const h=new THREE.Path();h.moveTo(d-DOOR.w/2,y0+0.0001);h.lineTo(d-DOOR.w/2,DOOR.h);h.lineTo(d+DOOR.w/2,DOOR.h);h.lineTo(d+DOOR.w/2,y0+0.0001);h.lineTo(d-DOOR.w/2,y0+0.0001);s.holes.push(h);}
 for(const w of wins){const h=new THREE.Path();rrect(h,w-WIN.w/2,WIN.y0,w+WIN.w/2,WIN.y1,0.09);s.holes.push(h);}return s;}
export class World{
 constructor(scene){this.scene=scene;const S=this.S={};this.statics={};
  const T=this.T={clayN:TX.clayNormal(),floor:TX.floorTiles(),conc:TX.concrete(),tiles:TX.wallTiles(),tilesR:TX.wallTiles([200,190,186],0.9,9),tact:TX.tactile(),blob:TX.radial('rgba(0,0,0,0.85)','rgba(0,0,0,0)'),
   glowR:TX.radial('rgba(255,60,40,1)','rgba(255,20,10,0)'),glowW:TX.radial('rgba(255,255,255,1)','rgba(255,255,255,0)'),fog:TX.fogTex(),grille:TX.grille(),smudge:TX.glassSmudge(),scratch:TX.scratchText()};
  const M=this.M={
   clay:new THREE.MeshLambertMaterial({color:C.clay,normalMap:T.clayN,normalScale:new THREE.Vector2(0.55,0.55)}),
   darkClay:new THREE.MeshLambertMaterial({color:C.dark,normalMap:T.clayN,normalScale:new THREE.Vector2(0.7,0.7)}),
   hair:new THREE.MeshLambertMaterial({color:0x17110f,normalMap:T.clayN,normalScale:new THREE.Vector2(1.2,1.2),side:THREE.DoubleSide}),
   dress:new THREE.MeshLambertMaterial({color:0xF1EEE8,normalMap:T.clayN,normalScale:new THREE.Vector2(0.8,0.8),side:THREE.DoubleSide}),
   wallIn:new THREE.MeshLambertMaterial({color:0x1a2338,side:THREE.DoubleSide}),
   wallOut:new THREE.MeshLambertMaterial({color:0xb4bcc6,side:THREE.DoubleSide}),
   doorIn:new THREE.MeshLambertMaterial({color:0x3b4d70,side:THREE.DoubleSide}),
   stripe:new THREE.MeshLambertMaterial({color:C.bench}),
   ceil:new THREE.MeshLambertMaterial({color:0x2B3A55,side:THREE.BackSide}),
   roof:new THREE.MeshLambertMaterial({color:0x8d96a2}),
   floor:new THREE.MeshLambertMaterial({map:T.floor}),
   bench:new THREE.MeshLambertMaterial({color:C.bench}),
   benchBase:new THREE.MeshLambertMaterial({color:0x151c2e}),
   metal:new THREE.MeshStandardMaterial({color:0xaab2bd,metalness:0.6,roughness:0.35}),
   rubber:new THREE.MeshLambertMaterial({color:0x07080b}),
   frame:new THREE.MeshLambertMaterial({color:0x3a4252}),
   glass:new THREE.MeshStandardMaterial({color:0x8fa3b8,transparent:true,opacity:0.10,roughness:0.08,metalness:0.1,depthWrite:false,side:THREE.DoubleSide}),
   smudge:new THREE.MeshBasicMaterial({map:T.smudge,transparent:true,opacity:0.5,depthWrite:false,blending:THREE.AdditiveBlending}),
   neon:new THREE.MeshBasicMaterial({color:new THREE.Color(C.neon).multiplyScalar(2.2)}),
   neonHouse:new THREE.MeshLambertMaterial({color:0x3a4660}),
   winGlow:new THREE.MeshBasicMaterial({color:new THREE.Color(0xc8d8ef).multiplyScalar(1.2)}),
   redGlow:new THREE.MeshBasicMaterial({color:new THREE.Color(C.red).multiplyScalar(2.5)}),
   conc:new THREE.MeshLambertMaterial({map:T.conc}),
   ballast:new THREE.MeshLambertMaterial({color:0x17181b,map:T.conc}),
   rail:new THREE.MeshStandardMaterial({color:0x8a8f96,metalness:0.8,roughness:0.3}),
   lampT:new THREE.MeshBasicMaterial({color:new THREE.Color(C.amber).multiplyScalar(2.5)}),
   cable:new THREE.MeshLambertMaterial({color:0x101114}),
   stFloor:new THREE.MeshLambertMaterial({color:0xb8bcc4,map:T.conc}),
   stWall:new THREE.MeshLambertMaterial({map:T.tiles}),stWallR:new THREE.MeshLambertMaterial({map:T.tilesR}),
   tact:new THREE.MeshLambertMaterial({map:T.tact}),
   stLamp:new THREE.MeshBasicMaterial({color:new THREE.Color(0xeef4ff).multiplyScalar(2.0)}),
   under:new THREE.MeshLambertMaterial({color:0x101216}),
   wheel:new THREE.MeshStandardMaterial({color:0x50545a,metalness:0.7,roughness:0.4}),
   blob:new THREE.MeshBasicMaterial({map:T.blob,transparent:true,depthWrite:false,opacity:0.8}),
   scratch:new THREE.MeshBasicMaterial({map:T.scratch,transparent:true,depthWrite:false,opacity:0.0,blending:THREE.AdditiveBlending}),
   fog:new THREE.MeshBasicMaterial({map:T.fog,transparent:true,depthWrite:false,color:0xff6a5a,blending:THREE.AdditiveBlending,opacity:0.6}),
   glowR:new THREE.MeshBasicMaterial({map:T.glowR,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}),
   spark:new THREE.MeshBasicMaterial({map:T.glowW,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xffc070}),
   map:null,phone:null};
  this.buildCar();this.buildTunnel();this.buildStations();this.buildOtherCars();this.buildLights();this.buildFigures();this.mergeStatics();}
 addS(mat,geo,parent){(this.statics[mat]=this.statics[mat]||[]).push({geo,parent});}
 mergeStatics(){for(const k in this.statics){const byParent=new Map();for(const it of this.statics[k]){const p=it.parent||this.car;if(!byParent.has(p))byParent.set(p,[]);byParent.get(p).push(it.geo);}
  for(const [p,geos] of byParent){const g=mergeGeometries(geos.map(g=>g.index?g.toNonIndexed():g).map(g=>{for(const a of Object.keys(g.attributes))if(!['position','normal','uv'].includes(a))g.deleteAttribute(a);return g;}));const m=new THREE.Mesh(g,this.M[k]);p.add(m);}}}
 box(mat,w,h,d,x,y,z,parent,rx=0,ry=0,rz=0){const g=new THREE.BoxGeometry(w,h,d);g.rotateX(rx);g.rotateY(ry);g.rotateZ(rz);g.translate(x,y,z);this.addS(mat,g,parent);}
 buildCar(){const car=this.car=new THREE.Group();this.scene.add(car);const M=this.M;
  // floor
  const fg=new THREE.PlaneGeometry(16,2.7);fg.rotateX(-Math.PI/2);const uv=fg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*16/1.2,uv.getY(i)*2.7/1.2);this.addS('floor',fg);
  // walls (inner + outer skins), z sides
  for(const side of [1,-1]){const doors=side>0?DOORS_P:DOORS_N,wins=side>0?WIN_P:WIN_N;
   const gi=new THREE.ShapeGeometry(wallShape(doors,wins,0,CAR.wallH),2);gi.translate(0,0,side*CAR.hw);this.addS('wallIn',gi);
   const go=new THREE.ShapeGeometry(wallShape(doors,wins,CAR.floorBot,CAR.wallH+0.12),2);go.translate(0,0,side*CAR.ow);this.addS('wallOut',go);
   // reveals around openings
   for(const d of doors){for(const sx of [-1,1])this.box('frame',0.03,DOOR.h,0.1,d+sx*DOOR.w/2,DOOR.h/2,side*1.4);this.box('frame',DOOR.w,0.03,0.1,d,DOOR.h,side*1.4);
    this.box('rubber',DOOR.w+0.1,0.02,0.12,d,0.005,side*1.4);}
   for(const w of wins){this.box('frame',WIN.w,0.025,0.1,w,WIN.y0,side*1.4);this.box('frame',WIN.w,0.025,0.1,w,WIN.y1,side*1.4);for(const sx of [-1,1])this.box('frame',0.025,WIN.y1-WIN.y0,0.1,w+sx*WIN.w/2,(WIN.y0+WIN.y1)/2,side*1.4);
    const gg=new THREE.PlaneGeometry(WIN.w,WIN.y1-WIN.y0);gg.translate(w,(WIN.y0+WIN.y1)/2,side*1.4);this.addS('glass',gg);}
   // exterior blue stripe segments between door openings (y 0.55-0.7) and top stripe
   const cuts=[-8,...doors.flatMap(d=>[d-DOOR.w/2,d+DOOR.w/2]).sort((a,b)=>a-b),8];for(let i=0;i<cuts.length;i+=2){const a=cuts[i],b=cuts[i+1];if(b-a>0.05){this.box('stripe',b-a,0.16,0.01,(a+b)/2,0.62,side*(CAR.ow+0.006));this.box('stripe',b-a,0.06,0.01,(a+b)/2,1.85,side*(CAR.ow+0.006));}}
   // skirt / underframe
   this.box('under',15.6,0.5,0.1,0,-0.62,side*1.2);}
  // ceiling arc
  const R=2.478,cy=CAR.roofIn-R,ang=Math.asin(CAR.hw/R);  // after rotateZ, cylinder axis along x; arc must face +y: rotate so theta=0 points up
  const cg2=new THREE.CylinderGeometry(R,R,16,40,1,true,Math.PI/2-ang,2*ang);cg2.rotateZ(Math.PI/2);cg2.translate(0,cy,0);this.addS('ceil',cg2);
  const Ro=R+0.17,ango=Math.asin(CAR.ow/Ro);const rg=new THREE.CylinderGeometry(Ro,Ro,16,40,1,true,Math.PI/2-ango,2*ango);rg.rotateZ(Math.PI/2);rg.translate(0,CAR.roofOut-Ro,0);this.addS('roof',rg);
  // fill between wall top and arc on outside
  for(const side of [1,-1])this.box('roof',16,0.12,0.02,0,CAR.wallH+0.06,side*CAR.ow);
  // end walls with connecting doors
  for(const ex of [-8,8]){const s=new THREE.Shape();s.moveTo(-1.35,0);s.lineTo(1.35,0);s.lineTo(1.35,2.0);s.quadraticCurveTo(0,2.75,-1.35,2.0);s.lineTo(-1.35,0);const h=new THREE.Path();h.moveTo(-0.45,0.001);h.lineTo(-0.45,1.9);h.lineTo(0.45,1.9);h.lineTo(0.45,0.001);s.holes.push(h);
   const g=new THREE.ShapeGeometry(s,6);g.rotateY(Math.PI/2);g.translate(ex,0,0);this.addS('wallIn',g);
   const dg=new THREE.BoxGeometry(0.04,1.9,0.9);dg.translate(ex+(ex>0?0.05:-0.05),0.95,0);this.addS('frame',dg);
   const wg=new THREE.PlaneGeometry(0.5,0.6);wg.rotateY(ex>0?-Math.PI/2:Math.PI/2);wg.translate(ex+(ex>0?0.02:-0.02),1.35,0);this.addS('redGlow',wg);}
  // benches
  const bench=(x0,x1,side)=>{const L=x1-x0,cx=(x0+x1)/2,z=side*(CAR.hw-0.24);
   const seat=new RoundedBoxGeometry(L,0.1,0.46,3,0.04);seat.translate(cx,0.4,z);this.addS('bench',seat);
   const back=new RoundedBoxGeometry(L,0.52,0.08,3,0.035);back.rotateX(side*0.12);back.translate(cx,0.74,side*(CAR.hw-0.05));this.addS('bench',back);
   this.box('benchBase',L-0.1,0.35,0.36,cx,0.175,side*(CAR.hw-0.2));
   for(const ex of [x0,x1]){const p=new THREE.CylinderGeometry(0.02,0.02,1.9,10);p.translate(ex,0.95,side*(CAR.hw-0.48));this.addS('metal',p);}};
  bench(-4.25,4.25,-1);bench(-4.25,-0.85,1);bench(0.85,4.25,1);for(const s of [1,-1]){bench(5.75,7.8,s);bench(-7.8,-5.75,s);}
  for(const s of [1,-1]){const r=new THREE.CylinderGeometry(0.018,0.018,15.6,10);r.rotateZ(Math.PI/2);r.translate(0,1.9,s*0.95);this.addS('metal',r);}
  for(const x of [-5,0,5]){const p=new THREE.CylinderGeometry(0.02,0.02,2.3,10);p.translate(x,1.15,0);if(x!==0)this.addS('metal',p);}
  // neon tubes
  for(const z of [-0.55,0.55])for(let x=-7.2;x<7.3;x+=1.6){const h=new RoundedBoxGeometry(1.36,0.05,0.16,2,0.02);h.translate(x,2.255,z);this.addS('neonHouse',h);}
  this.neonMeshes=[];for(const z of [-0.55,0.55])for(let x=-7.2;x<7.3;x+=1.6){const g=new THREE.CylinderGeometry(0.03,0.03,1.24,10);g.rotateZ(Math.PI/2);const m=new THREE.Mesh(g,M.neon.clone());m.position.set(x,2.215,z);this.car.add(m);this.neonMeshes.push(m);}
  // sliding doors (+z side), leaves inside wall cavity
  this.doorLeaves=[];for(const d of DOORS_P)for(const sd of [-1,1]){const g=new THREE.Group();const lw=0.665;
   const s=new THREE.Shape();s.moveTo(-lw/2,0.01);s.lineTo(lw/2,0.01);s.lineTo(lw/2,1.87);s.lineTo(-lw/2,1.87);s.lineTo(-lw/2,0.01);const h=new THREE.Path();rrect(h,-lw/2+0.1,0.92,lw/2-0.1,1.72,0.06);s.holes.push(h);
   const pg=new THREE.ExtrudeGeometry(s,{depth:0.04,bevelEnabled:false});pg.translate(0,0,-0.02);const pm=new THREE.Mesh(pg,[M.wallOut,M.doorIn]);g.add(pm);
   const inner=new THREE.Mesh(new THREE.ShapeGeometry(s),M.doorIn);inner.position.z=-0.021*1;g.add(inner);
   const gl=new THREE.Mesh(new THREE.PlaneGeometry(lw-0.2,0.8),M.glass);gl.position.set(0,1.32,0);g.add(gl);
   const rb=new THREE.Mesh(new THREE.CapsuleGeometry(0.018,1.8,4,8),M.rubber);rb.position.set(-sd*lw/2,0.95,0);g.add(rb);
   g.userData={d,sd,lw};g.position.set(d+sd*lw/2,0,1.4);this.car.add(g);this.doorLeaves.push(g);
   if(d===0&&sd===1){this.sisterGlass=gl;const sm=new THREE.Mesh(new THREE.PlaneGeometry(lw-0.2,0.8),M.smudge);sm.position.set(0,1.32,-0.025);g.add(sm);}}
  // line map above door 0 (+z)
  this.lineMap=new TX.LineMap();M.map=new THREE.MeshBasicMaterial({map:this.lineMap.t,color:0xbfc8d6});
  const mp=new THREE.Mesh(new THREE.PlaneGeometry(1.25,0.31),M.map);mp.position.set(0,2.035,1.13);mp.rotation.set(-1.12,Math.PI,0);this.car.add(mp);this.mapMesh=mp;
  const mf=new THREE.Mesh(new THREE.BoxGeometry(1.33,0.37,0.02),M.frame);mf.position.set(0,2.035+0.9*0.012,1.13+0.44*0.012);mf.rotation.copy(mp.rotation);this.car.add(mf);
  // ceiling speaker
  const spk=this.speaker=new THREE.Group();spk.position.set(2.4,2.33,0);this.car.add(spk);
  const sp1=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.22,0.05,32),M.frame);spk.add(sp1);
  this.speakerCone=new THREE.Mesh(new THREE.SphereGeometry(0.15,32,12,0,Math.PI*2,0,0.9),new THREE.MeshLambertMaterial({color:0x1c2029,side:THREE.DoubleSide}));this.speakerCone.rotation.x=Math.PI;this.speakerCone.position.y=-0.0;spk.add(this.speakerCone);
  const gr=new THREE.Mesh(new THREE.CircleGeometry(0.19,40),new THREE.MeshLambertMaterial({map:this.T.grille,transparent:true,alphaTest:0.5}));gr.rotation.x=Math.PI/2;gr.position.y=-0.035;spk.add(gr);this.speakerGrille=gr;
  // scratched text overlay on window +z x=-1.75
  const sc=new THREE.Mesh(new THREE.PlaneGeometry(1.25,0.62),M.scratch);sc.position.set(-1.75,1.34,1.385);sc.rotation.y=Math.PI;this.car.add(sc);this.scratchMesh=sc;
  // wheels/bogies
  this.addUnder(this.car);}
 addUnder(parent){const wl=[];for(const bx of [-5.6,5.6]){this.box('under',2.6,0.3,2.0,bx,-0.85,0,parent);for(const ax of [-0.9,0.9])for(const z of [-0.72,0.72]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.1,24),this.M.wheel);w.rotation.x=Math.PI/2;w.position.set(bx+ax,-0.63-0.42+0.42,z);parent.add(w);wl.push(w);}}
  (this.wheels=this.wheels||[]).push(...wl);}
 buildOtherCars(){this.others=[];const M=this.M;
  for(const off of [-16.6,16.6,33.2]){const g=new THREE.Group();this.scene.add(g);g.userData.off=off;
   for(const side of [1,-1]){const doors=side>0?DOORS_P:DOORS_N,wins=side>0?WIN_P:WIN_N;const go=new THREE.ShapeGeometry(wallShape(doors,wins,CAR.floorBot,CAR.wallH+0.12),2);go.translate(0,0,side*CAR.ow);this.addS('wallOut',go,g);
    for(const w of wins){const p=new THREE.PlaneGeometry(WIN.w,WIN.y1-WIN.y0);p.translate(w,(WIN.y0+WIN.y1)/2,side*(CAR.ow-0.12));this.addS('winGlow',p,g);}
    for(const d of doors){const p=new THREE.PlaneGeometry(DOOR.w,DOOR.h);p.translate(d,DOOR.h/2,side*(CAR.ow-0.03));this.addS('frame',p,g);const p2=new THREE.PlaneGeometry(0.42,0.75);for(const sx of [-0.33,0.33]){const q=p2.clone();q.translate(d+sx,1.32,side*(CAR.ow-0.02));this.addS('winGlow',q,g);}}
    const cuts=[-8,...doors.flatMap(d=>[d-DOOR.w/2,d+DOOR.w/2]).sort((a,b)=>a-b),8];for(let i=0;i<cuts.length;i+=2){const a=cuts[i],b=cuts[i+1];this.box('stripe',b-a,0.16,0.01,(a+b)/2,0.62,side*(CAR.ow+0.006),g);this.box('stripe',b-a,0.06,0.01,(a+b)/2,1.85,side*(CAR.ow+0.006),g);}
    this.box('under',15.6,0.5,0.1,0,-0.62,side*1.2,g);this.box('roof',16,0.12,0.02,0,CAR.wallH+0.06,side*CAR.ow,g);}
   const R=2.478+0.17,a=Math.asin(CAR.ow/R);const rg=new THREE.CylinderGeometry(R,R,16,30,1,true,Math.PI/2-a,2*a);rg.rotateZ(Math.PI/2);rg.translate(0,CAR.roofOut-R,0);this.addS('roof',rg,g);
   for(const ex of [-8,8]){const eg=new THREE.PlaneGeometry(2.9,2.9);eg.rotateY(Math.PI/2);eg.translate(ex,1.07,0);this.addS('wallOut',eg,g);}
   this.addUnder(g);this.others.push(g);}
  // gangways
  for(const gx of [-8.3,8.3,24.9]){this.box('rubber',0.6,2.2,2.4,gx,1.0,0);}
  // headlight on front car
  const hl=new THREE.Mesh(new THREE.SphereGeometry(0.12,12,8),new THREE.MeshBasicMaterial({color:0xfff2d0}));hl.position.set(8.02,0.5,0.9);this.others[2].add(hl);const hl2=hl.clone();hl2.position.z=-0.9;this.others[2].add(hl2);}
 buildTunnel(){const M=this.M;this.tunnel=[];this.SEG=12;const N=22;
  for(let i=0;i<N;i++){const g=new THREE.Group();this.scene.add(g);const parts={};
   const wall=(side)=>{const geo=new THREE.PlaneGeometry(12,5.2);const uv=geo.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*2,uv.getY(k)*1);const m=new THREE.Mesh(geo,M.conc);m.position.set(0,1.5,side*2.45);m.rotation.y=side>0?Math.PI:0;g.add(m);return m;};
   parts.wP=wall(1);parts.wN=wall(-1);
   const cg=new THREE.CylinderGeometry(2.45,2.45,12,16,1,true,0,Math.PI);cg.rotateZ(Math.PI/2);cg.translate(0,4.1,0);parts.ceil=new THREE.Mesh(cg,new THREE.MeshLambertMaterial({map:this.T.conc,side:THREE.BackSide,color:0x777777}));g.add(parts.ceil);
   const gr=new THREE.Mesh(new THREE.PlaneGeometry(12,4.9),M.ballast);gr.rotation.x=-Math.PI/2;gr.position.y=-1.1;g.add(gr);
   for(const z of [-0.72,0.72]){const r=new THREE.Mesh(new THREE.BoxGeometry(12,0.1,0.07),M.rail);r.position.set(0,-1.05,z);g.add(r);}
   for(let k=0;k<4;k++){const sl=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.08,2.2),M.cable);sl.position.set(-4.5+k*3,-1.08,0);g.add(sl);}
   // cables: sagging tubes on both walls
   for(const side of [1,-1])for(const [y,sag] of [[2.35,0.12],[2.2,0.16],[2.05,0.1]]){const pts=[];for(let k=0;k<=8;k++){const u=k/8;pts.push(new THREE.Vector3(-6+12*u,y-sag*4*u*(1-u),side*2.4));}
    const tg=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),12,0.022,5);const m=new THREE.Mesh(tg,M.cable);g.add(m);(parts.cables=parts.cables||[]).push(m);}
   // lamp
   for(const side of [1,-1]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.14,0.08),M.lampT);l.position.set(0,1.75,side*2.41);g.add(l);(parts.lamps=parts.lamps||[]).push(l);}
   g.userData.parts=parts;this.tunnel.push(g);}
  this.tunnelLen=N*12;}
 buildStations(){this.stations=[];}
 makeStation(idx,red=false){const M=this.M,g=new THREE.Group();this.scene.add(g);const L=44;
  const plat=new THREE.Mesh(new THREE.BoxGeometry(L,1.1,5.6),M.stFloor);plat.position.set(0,-0.55,1.55+2.8);g.add(plat);
  const tc=new THREE.Mesh(new THREE.PlaneGeometry(L,0.32),M.tact);tc.rotation.x=-Math.PI/2;tc.position.set(0,0.003,1.85);g.add(tc);
  const ed=new THREE.Mesh(new THREE.BoxGeometry(L,0.04,0.12),new THREE.MeshLambertMaterial({color:0xdfe3e8}));ed.position.set(0,-0.01,1.6);g.add(ed);
  const wm=red?M.stWallR:M.stWall;const wg=new THREE.PlaneGeometry(L,5);const uv=wg.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*L/2,uv.getY(k)*5/2);
  const w=new THREE.Mesh(wg,wm);w.position.set(0,2.5,7.1);w.rotation.y=Math.PI;g.add(w);
  const cl=new THREE.Mesh(new THREE.PlaneGeometry(L,7),new THREE.MeshLambertMaterial({color:0x1d2026}));cl.rotation.x=Math.PI/2;cl.position.set(0,4.8,3.6);g.add(cl);
  for(const ex of [-L/2,L/2]){const e=new THREE.Mesh(new THREE.PlaneGeometry(6,6),M.conc);e.rotation.y=ex<0?Math.PI/2:-Math.PI/2;e.position.set(ex,2,4.4);g.add(e);}
  for(let x=-18;x<=18;x+=6){const p=new THREE.Mesh(new THREE.BoxGeometry(0.5,4.8,0.5),wm);p.position.set(x,2.4,4.4);g.add(p);}
  this.box;for(let x=-19;x<=19;x+=4.75){const l=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.06,0.22),M.stLamp);l.position.set(x,4.7,2.6);g.add(l);}
  for(const x of [-12,0,12]){const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.4,0.6),new THREE.MeshBasicMaterial({map:TX.stationSign(idx),color:0x9aa2ae}));sg.position.set(x+3,2.6,7.08);sg.rotation.y=Math.PI;g.add(sg);}
  // track bed through station
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(L,3.1),M.ballast);gr.rotation.x=-Math.PI/2;gr.position.set(0,-1.1,0);g.add(gr);
  for(const z of [-0.72,0.72]){const r=new THREE.Mesh(new THREE.BoxGeometry(L,0.1,0.07),M.rail);r.position.set(0,-1.05,z);g.add(r);}
  const back=new THREE.Mesh(new THREE.PlaneGeometry(L,6),M.conc);back.position.set(0,1.8,-2.45);g.add(back);
  g.userData={idx,L,red};this.stations.push(g);return g;}
 buildLights(){const s=this.scene;this.hemi=new THREE.HemisphereLight(0x8090b0,0x101015,0.25);s.add(this.hemi);
  this.neonL=[-5.2,-1.6,1.6,5.2].map(x=>{const l=new THREE.PointLight(C.neon,4,10,1.3);l.position.set(x,2.05,0);this.car.add(l);return l;});
  this.tunL=[0,1].map(()=>{const l=new THREE.PointLight(C.amber,0,9,1.5);s.add(l);return l;});
  this.stL=[0,1,2].map(()=>{const l=new THREE.PointLight(0xe8f0ff,0,22,1.2);s.add(l);return l;});
  this.redL=new THREE.PointLight(C.red,0,6,1.5);s.add(this.redL);
  this.emL=new THREE.PointLight(C.red,0,12,1.2);this.emL.position.set(0,2.1,0);this.car.add(this.emL);
  this.fillL=new THREE.PointLight(0xc0d0ff,0,6,1.5);this.car.add(this.fillL);this.rimL=new THREE.PointLight(C.red,0,12,1.0);this.rimL.position.set(-7.7,1.4,0);this.car.add(this.rimL);}
 buildFigures(){const s=this.scene;this.white=new Batch(s,this.M.clay,6);this.darkB=new Batch(s,this.M.darkClay,40);
  // blob shadows
  this.blobs=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),this.M.blob,200);this.blobs.frustumCulled=false;this.blobs.count=0;this.blobs.renderOrder=1;s.add(this.blobs);
  this.hero=new Figure(s);this.white.add(this.hero);
  this.sister=new Figure(s,{leg:0.6,arm:0.62,torso:0.62,rad:0.85,head:0.85,neck:0.7});this.white.add(this.sister);
  this.tall=new Figure(s,{leg:1.5,arm:1.55,torso:1.38,rad:0.92,head:0.95,neck:1.6});this.darkB.add(this.tall);
  this.passengers=[];const seats=[];for(const x of [0.62,1.24,1.86,2.48,3.1,3.72])for(const sx of [1,-1])seats.push([sx*x,-1]);
  for(const x of [1.25,1.9,2.55,3.2,3.85])for(const sx of [1,-1])seats.push([sx*x,1]);for(const x of [6.1,6.78,7.45])for(const sx of [1,-1])for(const sz of [1,-1])seats.push([sx*x,sz]);
  const r=TX.rng(77);for(const [x,sz] of seats){const f=new Figure(s,{leg:0.95+r()*0.12,torso:0.95+r()*0.12,head:0.9+r()*0.15});f.seat={x,sz,dl:r()*0.12,lean:-0.02-r()*0.08};this.darkB.add(f);this.passengers.push(f);}
  // sister hair + dress
  const sis=this.sister,hr=sis.L.head;
  // crown (full) + back/side shell with an open face window, long back drape, two face-framing locks
  const crown=new THREE.Mesh(new THREE.SphereGeometry(hr*1.06,32,12,0,Math.PI*2,0,Math.PI*0.26),this.M.hair);crown.rotation.x=0.12;sis.headC.add(crown);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(hr*1.065,32,20,Math.PI*0.8,Math.PI*1.4,0,Math.PI*0.62),this.M.hair);sis.headC.add(shell);
  const drapeG=new THREE.CylinderGeometry(hr*1.03,hr*1.12,0.4,28,8,true,Math.PI*0.5+0.75,Math.PI-1.5);drapeG.translate(0,-0.2,0);const pos=drapeG.attributes.position;
  for(let k=0;k<pos.count;k++){const y=pos.getY(k),x=pos.getX(k),z=pos.getZ(k);const w=1+0.06*Math.sin(Math.atan2(z,x)*9+y*8);pos.setX(k,x*w);pos.setZ(k,z*w);}drapeG.computeVertexNormals();
  const drape=new THREE.Mesh(drapeG,this.M.hair);sis.headC.add(drape);
  for(const sd of [-1,1]){const lg=new THREE.CylinderGeometry(hr*0.2,hr*0.32,0.36,12,4,true);lg.translate(0,-0.12,0);const lock=new THREE.Mesh(lg,this.M.hair);lock.position.set(sd*hr*0.86,-0.05,-0.01);lock.rotation.z=sd*0.06;sis.headC.add(lock);}
  const dg=new THREE.CylinderGeometry(0.055,0.2,0.5,28,5,true);const dp=dg.attributes.position;for(let k=0;k<dp.count;k++){const y=dp.getY(k),a=Math.atan2(dp.getZ(k),dp.getX(k));const f=1+(0.25-y)/0.5*0.08*Math.sin(a*7);dp.setX(k,dp.getX(k)*f);dp.setZ(k,dp.getZ(k)*f);}dg.computeVertexNormals();
  const dress=new THREE.Mesh(dg,this.M.dress);dress.position.y=-0.03;sis.torso.add(dress);const top=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.06,0.24,20,1,true),this.M.dress);top.position.y=0.15;sis.torso.add(top);
  // sister fog + glow
  this.sisFx=new THREE.Group();s.add(this.sisFx);const glow=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.5).rotateX(-Math.PI/2),this.M.glowR);glow.position.y=0.02;this.sisGlow=glow;this.sisFx.add(glow);
  this.fogPlanes=[];const fr=TX.rng(9);for(let k=0;k<9;k++){const p=new THREE.Mesh(new THREE.PlaneGeometry(1.6+fr()*1.5,0.7+fr()*0.5),this.M.fog);p.position.set((fr()-.5)*1.6,0.25+fr()*0.3,(fr()-.5)*1.6);p.userData={ph:fr()*6.28,sp:0.2+fr()*0.3};this.sisFx.add(p);this.fogPlanes.push(p);}
  // phone
  this.phoneScreen=new TX.PhoneScreen();const ph=this.phone=new THREE.Group();const body=new THREE.Mesh(new RoundedBoxGeometry(0.075,0.15,0.01,3,0.008),new THREE.MeshStandardMaterial({color:0x111318,roughness:0.3,metalness:0.4}));ph.add(body);
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.066,0.138),new THREE.MeshBasicMaterial({map:this.phoneScreen.t,color:0xffffff}));scr.position.z=0.0055;ph.add(scr);this.hero.hand.R.add(ph);ph.position.set(0,-0.06,0.02);ph.rotation.set(0,0,Math.PI);
  // sparks
  this.sparks=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),this.M.spark,120);this.sparks.frustumCulled=false;this.sparks.count=0;s.add(this.sparks);}
}
