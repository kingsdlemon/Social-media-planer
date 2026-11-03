import * as THREE from 'three';
// Clay stick figure rig. All limb bones extend along local -Y (torso/neck along +Y).
const CYL=new THREE.CylinderGeometry(1,1,1,14,1,true).translate(0,-0.5,0);
const SPH=new THREE.SphereGeometry(1,20,14);
const HEAD=new THREE.SphereGeometry(1,40,28);
const _m=new THREE.Matrix4(),_s=new THREE.Vector3(),_p=new THREE.Vector3(),_q=new THREE.Quaternion();
export class Batch{ // instanced renderer for one material
 constructor(scene,mat,cap){this.items={};for(const [k,g] of [['cyl',CYL],['sph',SPH],['head',HEAD]]){const m=new THREE.InstancedMesh(g,mat,cap*(k==='cyl'?14:k==='sph'?20:1));m.frustumCulled=false;m.count=0;scene.add(m);this.items[k]=m;}this.figs=[];}
 add(f){this.figs.push(f);f.batch=this;}
 update(){const c={cyl:0,sph:0,head:0};for(const f of this.figs){f.root.visible=!!f.visible;if(!f.visible)continue;f.root.updateMatrixWorld(true);
  for(const p of f.parts){_m.multiplyMatrices(p.j.matrixWorld,p.local);this.items[p.g].setMatrixAt(c[p.g]++,_m);}}
  for(const k in c){this.items[k].count=c[k];this.items[k].instanceMatrix.needsUpdate=true;}}}
function J(parent,x=0,y=0,z=0){const o=new THREE.Object3D();o.position.set(x,y,z);parent.add(o);return o;}
export class Figure{
 constructor(scene,o={}){
  const s=this.s=Object.assign({leg:1,arm:1,torso:1,rad:1,head:1,neck:1},o);
  this.L={thigh:0.42*s.leg,shin:0.40*s.leg,ankle:0.055*Math.min(1.2,s.leg),torso:0.5*s.torso,neck:0.085*s.neck,ua:0.30*s.arm,fa:0.27*s.arm,head:0.17*s.head,r:0.036*s.rad};
  const L=this.L;this.root=new THREE.Object3D();scene.add(this.root);this.visible=true;this.parts=[];
  this.hip=J(this.root,0,L.thigh+L.shin+L.ankle,0);
  this.torso=J(this.hip);this.chest=J(this.torso,0,L.torso,0);this.neck=J(this.chest,0,0,0);this.headJ=J(this.neck,0,L.neck,0);
  this.headC=J(this.headJ,0,L.head*0.92,0);
  this.sh={};this.ua={};this.fa={};this.hand={};this.th={};this.sn={};this.ft={};
  for(const sd of [-1,1]){const S=sd>0?'R':'L';
   this.sh[S]=J(this.chest,0,-0.035*s.torso,0);this.ua[S]=J(this.sh[S]);this.fa[S]=J(this.ua[S],0,-L.ua,0);this.hand[S]=J(this.fa[S],0,-L.fa,0);
   this.th[S]=J(this.hip);this.sn[S]=J(this.th[S],0,-L.thigh,0);this.ft[S]=J(this.sn[S],0,-L.shin,0);}
  const r=L.r,cyl=(j,len,rad=r)=>this.parts.push({j,g:'cyl',local:new THREE.Matrix4().makeScale(rad,len,rad)}),
   sph=(j,sx,sy,sz,ox=0,oy=0,oz=0,g='sph')=>this.parts.push({j,g,local:new THREE.Matrix4().makeTranslation(ox,oy,oz).multiply(new THREE.Matrix4().makeScale(sx,sy,sz))});
  // torso along +Y: use cylinder flipped
  this.parts.push({j:this.torso,g:'cyl',local:new THREE.Matrix4().makeRotationX(Math.PI).multiply(new THREE.Matrix4().makeScale(r*1.25,L.torso,r*1.25))});
  this.parts.push({j:this.neck,g:'cyl',local:new THREE.Matrix4().makeRotationX(Math.PI).multiply(new THREE.Matrix4().makeScale(r*1.1,L.neck+0.02,r*1.1))});
  sph(this.hip,r*1.4,r*1.4,r*1.4);sph(this.chest,r*1.35,r*1.35,r*1.35);
  sph(this.headC,L.head,L.head*1.04,L.head,0,0,0,'head');
  for(const S of ['L','R']){cyl(this.ua[S],L.ua);cyl(this.fa[S],L.fa);sph(this.fa[S],r,r,r);sph(this.hand[S],r*1.45,r*1.6,r*1.45,0,-r*0.6,0);
   cyl(this.th[S],L.thigh,r*1.08);cyl(this.sn[S],L.shin);sph(this.sn[S],r*1.08,r*1.08,r*1.08);
   sph(this.ft[S],0.068*s.rad*1.05,L.ankle,0.115*Math.max(1,s.leg*0.9),0,0,0.045*Math.max(1,s.leg*0.9));}
  this.rest();}
 rest(){for(const o of [this.hip,this.torso,this.neck,this.headJ,...Object.values(this.ua),...Object.values(this.fa),...Object.values(this.th),...Object.values(this.sn),...Object.values(this.ft)])o.rotation.set(0,0,0);
  this.hip.position.set(0,this.L.thigh+this.L.shin+this.L.ankle,0);this.armsDown();}
 armsDown(spread=0.12){this.ua.L.rotation.set(0.05,0,-spread);this.ua.R.rotation.set(0.05,0,spread);this.fa.L.rotation.set(-0.1,0,0);this.fa.R.rotation.set(-0.1,0,0);}
 // 2-bone leg IK in the figure's local frame (hip-relative target, sagittal + lateral)
 legIK(S,tx,ty,tz){const L=this.L,h=this.hip.position;const dx=tx-h.x,dy=ty-h.y,dz=tz-h.z;
  const roll=Math.atan2(dx,-dy);const dyz=-Math.hypot(dx,dy);let d=Math.hypot(dyz,dz);d=Math.min(d,L.thigh+L.shin-1e-4);
  const phT=Math.atan2(dz,-dyz);const a=Math.acos(THREE.MathUtils.clamp((L.thigh*L.thigh+d*d-L.shin*L.shin)/(2*L.thigh*d),-1,1));
  const b=Math.acos(THREE.MathUtils.clamp((L.shin*L.shin+d*d-L.thigh*L.thigh)/(2*L.shin*d),-1,1));
  const p1=phT+a,p2=phT-b;this.th[S].rotation.set(-p1,0,0);this.th[S].rotation.order='ZXY';this.th[S].rotation.z=roll;
  this.sn[S].rotation.set(p1-p2,0,0);this.ft[S].rotation.set(p2,0,-roll);}
 // seated pose: hip on seat (seatY top, hip at seat front-back), knees spread
 sit(seatY=0.45,kneeSpread=0.11,footZ=0.42,lean=-0.05){const L=this.L;this.hip.position.set(0,seatY+L.r*1.2,0);this.torso.rotation.set(lean,0,0);
  for(const [S,sd] of [['L',-1],['R',1]])this.legIK(S,sd*kneeSpread,L.ankle,footZ);
  // hands rest on thighs
  for(const [S,sd] of [['L',-1],['R',1]]){this.ua[S].rotation.set(-0.55,0,sd*0.18);this.fa[S].rotation.set(-0.85,0,0);}}
 // walking: foot plants in local frame; called by world with computed targets
 placeAt(x,y,z,yaw){this.root.position.set(x,y,z);this.root.rotation.set(0,yaw,0);}
 // head look: yaw/pitch/tilt
 look(yaw,pitch=0,tilt=0){this.headJ.rotation.set(pitch,yaw,tilt,'YXZ');}
 worldHead(v=new THREE.Vector3()){this.root.updateMatrixWorld(true);return this.headC.getWorldPosition(v);}
}
