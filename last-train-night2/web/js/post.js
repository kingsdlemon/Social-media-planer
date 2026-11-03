import * as THREE from 'three';
import {EffectComposer} from '../lib/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../lib/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from '../lib/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from '../lib/jsm/postprocessing/OutputPass.js';
import {ShaderPass} from '../lib/jsm/postprocessing/ShaderPass.js';
const FinalShader={uniforms:{tDiffuse:{value:null},tDepth:{value:null},near:{value:0.05},far:{value:200},res:{value:new THREE.Vector2(810,1440)},
 focus:{value:3},aperture:{value:0.0},tilt:{value:0.6},tiltC:{value:0.5},maxBlur:{value:9},ca:{value:0.0015},grain:{value:0.06},seed:{value:0},vig:{value:0.45},
 mblur:{value:new THREE.Vector2(0,0)},mbDepth:{value:new THREE.Vector2(0,1000)},glitch:{value:0},fade:{value:1},red:{value:0},blurAll:{value:0}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse,tDepth;uniform float near,far,focus,aperture,tilt,tiltC,maxBlur,ca,grain,seed,vig,glitch,fade,red,blurAll;uniform vec2 res,mblur,mbDepth;varying vec2 vUv;
 float lin(float d){float z=d*2.-1.;return 2.*near*far/(far+near-z*(far-near));}
 float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+seed*7.13)*43758.5453);}
 vec3 samp(vec2 uv,float caS){vec2 d=(uv-.5)*caS;return vec3(texture2D(tDiffuse,uv+d).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-d).b);}
 void main(){vec2 uv=vUv;
  if(glitch>0.){float row=floor(uv.y*48.);float g=h(vec2(row,floor(seed*3.)));if(g<glitch*0.5)uv.x+=(h(vec2(row,seed))-.5)*0.12*glitch;}
  float D=lin(texture2D(tDepth,uv).x);
  float coc=aperture*abs(D-focus)/max(D,0.01)*12.;
  float ty=abs(uv.y-tiltC);coc+=tilt*smoothstep(0.18,0.5,ty)*1.0;coc=clamp(coc+blurAll,0.,1.);
  float caS=ca*(1.+glitch*8.)*(0.6+length(uv-.5)*1.6);
  vec3 col=vec3(0.);float wsum=0.;float rad=coc*maxBlur;
  if(rad<0.4){col=samp(uv,caS);wsum=1.;}else{
   for(int i=0;i<24;i++){float fi=float(i);float r=sqrt((fi+.5)/24.)*rad;float a=fi*2.39996;vec2 o=vec2(cos(a),sin(a))*r/res;
    vec2 su=uv+o;float sd=lin(texture2D(tDepth,su).x);float sc=clamp(aperture*abs(sd-focus)/max(sd,0.01)*12.+tilt*smoothstep(0.18,0.5,abs(su.y-tiltC))+blurAll,0.,1.)*maxBlur;
    float w=sd<D-0.1?smoothstep(0.,1.,sc/max(r,0.001)):1.;col+=samp(su,caS)*w;wsum+=w;}}
  col/=max(wsum,0.001);
  if(length(mblur)>0.){if(D>mbDepth.x&&D<mbDepth.y){vec3 acc=vec3(0.);for(int i=0;i<12;i++){float f=float(i)/11.-.5;vec2 su=uv+mblur*f;float sd=lin(texture2D(tDepth,su).x);
     acc+=(sd>mbDepth.x&&sd<mbDepth.y)?texture2D(tDiffuse,su).rgb:col;}col=acc/12.;}}
  col=mix(col,col*vec3(1.25,0.55,0.5)+vec3(0.03,0.,0.),red);
  float v=smoothstep(0.95,0.25,length((vUv-.5)*vec2(0.9,1.1)));col*=mix(1.,v,vig);
  float n=h(vUv*res+fract(seed)*91.)-.5;col+=n*grain*(0.5+0.5*(1.-dot(col,vec3(.33))));
  if(glitch>0.){col.r+=texture2D(tDiffuse,uv+vec2(0.012*glitch,0.)).r*0.25*glitch;}
  gl_FragColor=vec4(col*fade,1.);}`};
export class Post{constructor(renderer,scene,camera,W,H){this.r=renderer;const rt=new THREE.WebGLRenderTarget(W,H,{type:THREE.HalfFloatType});rt.depthTexture=new THREE.DepthTexture(W,H);rt.depthTexture.type=THREE.UnsignedIntType;
 this.c=new EffectComposer(renderer,rt);this.c.setPixelRatio(1);this.c.setSize(W,H);this.rp=new RenderPass(scene,camera);this.c.addPass(this.rp);
 this.bloom=new UnrealBloomPass(new THREE.Vector2(W,H),0.45,0.45,1.0);this.c.addPass(this.bloom);this.c.addPass(new OutputPass());
 this.fin=new ShaderPass(FinalShader);this.c.addPass(this.fin);this.U=this.fin.uniforms;this.U.res.value.set(W,H);this.U.tDepth.value=this.c.renderTarget1.depthTexture;}
 render(camera){this.rp.camera=camera;this.U.near.value=camera.near;this.U.far.value=camera.far;this.U.tDepth.value=this.c.renderTarget1.depthTexture;this.c.render();}}
