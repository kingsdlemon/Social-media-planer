import * as THREE from 'three';
import {EffectComposer} from '../lib/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../lib/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from '../lib/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from '../lib/jsm/postprocessing/OutputPass.js';
import {Pass,FullScreenQuad} from '../lib/jsm/postprocessing/Pass.js';
// shared CoC logic (aperture DOF from depth + tilt-shift band + global blur)
const COMMON=`uniform sampler2D tDiffuse,tDepth;uniform float near,far,focus,aperture,tilt,tiltC,blurAll;
 float lin(float d){float z=d*2.-1.;return 2.*near*far/(far+near-z*(far-near));}
 float cocAt(vec2 uv,float D){float c=aperture*abs(D-focus)/max(D,0.01)*12.;c+=tilt*smoothstep(0.18,0.5,abs(uv.y-tiltC));return clamp(c+blurAll,0.,1.);}`;
const BlurShader={uniforms:{tDiffuse:{value:null},tDepth:{value:null},near:{value:.05},far:{value:200},focus:{value:3},aperture:{value:0},tilt:{value:.5},tiltC:{value:.5},blurAll:{value:0},
  hres:{value:new THREE.Vector2(405,720)},maxBlur:{value:6},mblur:{value:new THREE.Vector2(0,0)},mbDepth:{value:new THREE.Vector2(0,1000)}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
 fragmentShader:COMMON+`uniform vec2 hres,mblur,mbDepth;uniform float maxBlur;varying vec2 vUv;
 void main(){vec2 uv=vUv;float D=lin(texture2D(tDepth,uv).x);float coc=cocAt(uv,D);float rad=coc*maxBlur;vec3 col=vec3(0.);float ws=0.;
  if(rad<0.5){col=texture2D(tDiffuse,uv).rgb;ws=1.;}else{
   for(int i=0;i<20;i++){float fi=float(i);float r=sqrt((fi+.5)/20.)*rad;float a=fi*2.39996;vec2 su=uv+vec2(cos(a),sin(a))*r/hres;
    float sd=lin(texture2D(tDepth,su).x);float sc=cocAt(su,sd)*maxBlur;float w=sd<D-0.1?smoothstep(0.,1.,sc/max(r,0.001)):1.;col+=texture2D(tDiffuse,su).rgb*w;ws+=w;}}
  col/=max(ws,1e-3);float mb=0.;
  if(length(mblur)>0.&&D>mbDepth.x&&D<mbDepth.y){vec3 acc=vec3(0.);float n=0.;for(int i=0;i<16;i++){float f=float(i)/15.-.5;vec2 su=uv+mblur*f;float sd=lin(texture2D(tDepth,su).x);
     if(sd>mbDepth.x&&sd<mbDepth.y){acc+=texture2D(tDiffuse,su).rgb;n+=1.;}}if(n>0.){col=acc/n;mb=1.;}}
  gl_FragColor=vec4(col,max(coc,mb));}`};
const CompShader={uniforms:{tDiffuse:{value:null},tDepth:{value:null},tBlur:{value:null},near:{value:.05},far:{value:200},focus:{value:3},aperture:{value:0},tilt:{value:.5},tiltC:{value:.5},blurAll:{value:0},
  res:{value:new THREE.Vector2(810,1440)},ca:{value:.0015},grain:{value:.06},seed:{value:0},vig:{value:.45},glitch:{value:0},fade:{value:1},red:{value:0},grainScale:{value:1}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
 fragmentShader:COMMON+`uniform sampler2D tBlur;uniform vec2 res;uniform float ca,grain,seed,vig,glitch,fade,red,grainScale;varying vec2 vUv;
 float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+seed*7.13)*43758.5453);}
 void main(){vec2 uv=vUv;
  if(glitch>0.){float row=floor(uv.y*48.);float g=h(vec2(row,floor(seed*3.)));if(g<glitch*0.5)uv.x+=(h(vec2(row,seed))-.5)*0.12*glitch;}
  float D=lin(texture2D(tDepth,uv).x);float caS=ca*(1.+glitch*8.)*(0.6+length(uv-.5)*1.6);vec2 d=(uv-.5)*caS;
  vec3 sharp=vec3(texture2D(tDiffuse,uv+d).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-d).b);
  vec4 bl=texture2D(tBlur,uv);vec3 blur=vec3(texture2D(tBlur,uv+d).r,bl.g,texture2D(tBlur,uv-d).b);
  float coc=max(cocAt(uv,D),bl.a);vec3 col=mix(sharp,blur,smoothstep(0.04,0.3,coc));
  col=mix(col,col*vec3(1.25,0.55,0.5)+vec3(0.03,0.,0.),red);
  float v=smoothstep(0.95,0.25,length((vUv-.5)*vec2(0.9,1.1)));col*=mix(1.,v,vig);
  float n=h(floor(vUv*res/grainScale)+fract(seed)*91.)-.5;col+=n*grain*(0.5+0.5*(1.-dot(col,vec3(.33))));
  if(glitch>0.){col.r+=texture2D(tDiffuse,uv+vec2(0.012*glitch,0.)).r*0.25*glitch;}
  gl_FragColor=vec4(col*fade,1.);}`};
class DofPass extends Pass{constructor(W,H){super();this.hw=Math.round(W/2);this.hh=Math.round(H/2);this.rt=new THREE.WebGLRenderTarget(this.hw,this.hh,{type:THREE.HalfFloatType});
  this.bm=new THREE.ShaderMaterial(BlurShader);this.cm=new THREE.ShaderMaterial(CompShader);this.q=new FullScreenQuad(null);this.bm.uniforms.hres.value.set(this.hw,this.hh);this.cm.uniforms.res.value.set(W,H);}
 render(r,wb,rb){this.bm.uniforms.tDiffuse.value=rb.texture;this.q.material=this.bm;r.setRenderTarget(this.rt);this.q.render(r);
  this.cm.uniforms.tDiffuse.value=rb.texture;this.cm.uniforms.tBlur.value=this.rt.texture;this.q.material=this.cm;r.setRenderTarget(this.renderToScreen?null:wb);this.q.render(r);}}
export class Post{constructor(renderer,scene,camera,W,H){this.r=renderer;this.W=W;this.H=H;const rt=new THREE.WebGLRenderTarget(W,H,{type:THREE.HalfFloatType});rt.depthTexture=new THREE.DepthTexture(W,H);rt.depthTexture.type=THREE.UnsignedIntType;
 this.c=new EffectComposer(renderer,rt);this.c.setPixelRatio(1);this.c.setSize(W,H);this.rp=new RenderPass(scene,camera);this.c.addPass(this.rp);
 this.bloom=new UnrealBloomPass(new THREE.Vector2(Math.round(W/2),Math.round(H/2)),0.45,0.45,1.0);this.c.addPass(this.bloom);this.c.addPass(new OutputPass());
 this.dof=new DofPass(W,H);this.c.addPass(this.dof);this.bloom.setSize(Math.round(W/2),Math.round(H/2));
 // unified uniform facade (old names)
 const B=this.dof.bm.uniforms,Cu=this.dof.cm.uniforms,S=W/810;this.scale=S;
 const both=['near','far','focus','aperture','tilt','tiltC','blurAll','tDepth'];this.U={};
 for(const k of both){const o={_v:B[k].value};Object.defineProperty(o,'value',{get(){return B[k].value;},set(v){B[k].value=v;Cu[k].value=v;}});this.U[k]=o;}
 for(const k of ['ca','grain','seed','vig','glitch','fade','red'])this.U[k]=Cu[k];
 this.U.mblur=B.mblur;this.U.mbDepth=B.mbDepth;const self=this;this.U.maxBlur={set value(v){B.maxBlur.value=v*S*0.5;},get value(){return B.maxBlur.value;}};
 Cu.grainScale.value=Math.max(1,W/810);}
 render(camera){const P=window.PROF||{};this.bloom.enabled=!P.noBloom;
  if(P.scene){const sc=this.rp.scene;const om=sc.overrideMaterial;if(P.basic)sc.overrideMaterial=window.__BM||(window.__BM=new THREE.MeshBasicMaterial({color:0x888888}));this.r.setRenderTarget(null);this.r.render(sc,camera);sc.overrideMaterial=om;return;}
  this.rp.camera=camera;this.U.near.value=camera.near;this.U.far.value=camera.far;this.U.tDepth.value=this.c.renderTarget1.depthTexture;
  // bloom resize gets called by composer.setSize with full size; keep quarter internally
  this.c.render();}}
