// node snap.js OUTDIR t1 t2 ...   -> OUTDIR/f_<t>.jpg (+timing)
const FRAC=process.env.FRAC;const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
require('./serve.js');
(async()=>{const out=process.argv[2];fs.mkdirSync(out,{recursive:true});const ts=process.argv.slice(3).map(Number);
 const b=await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:+(process.env.DPR||1)});
 p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log('[page]',m.text().slice(0,300));});p.on('pageerror',e=>console.log('[pageerror]',e.message));
 await p.goto('http://localhost:'+(process.env.PORT||8123)+'/index.html?rw='+(process.env.RW||540)+'&rh='+(process.env.RH||960));
 await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});const err=await p.evaluate(()=>window.INIT_ERR);if(err){console.log(err);process.exit(1);}
 let T2=ts;if(!ts.length){const fr=(process.env.FRAC||'0.5').split(',').map(Number);T2=[];for(const [a,b] of await p.evaluate(()=>window.shotList()))for(const f of fr)T2.push(+(a+(Math.min(b,87.1)-a)*f).toFixed(2));}
 const DC=process.env.DCAM?JSON.parse(process.env.DCAM):null;
 for(let ii=0;ii<T2.length;ii++){const t=T2[ii];if(DC)await p.evaluate(c=>window.DEBUGCAM=c,DC[ii]);const t0=Date.now();await p.evaluate(t=>window.renderFrame(t),t);const t1=Date.now();
  await p.screenshot({path:path.join(out,`f_${t.toFixed(2)}${DC?'_'+ii:''}.jpg`),type:'jpeg',quality:85,clip:{x:0,y:0,width:1080,height:1920}});
  const sh=await p.evaluate(t=>window.shotAt(t),t);console.log(`t=${t} shot=${sh} render=${t1-t0}ms shot+save=${Date.now()-t1}ms`);}
 if(process.env.EVENTS){fs.writeFileSync(process.env.EVENTS,JSON.stringify(await p.evaluate(()=>window.EVENTS)));}
 await b.close();process.exit(0);})();
