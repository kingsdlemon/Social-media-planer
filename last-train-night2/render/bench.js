const {chromium}=require('playwright');require('./serve.js');
(async()=>{const cfgs=JSON.parse(process.argv[2]);const ts=[38.8,22.6,61.3];
 for(const c of cfgs){const b=await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:c.dpr});
  await p.goto(`http://localhost:${process.env.PORT}/index.html?rw=${c.rw}&rh=${c.rh}`);await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});
  await p.evaluate(()=>window.SYNC=true);let R=0,S=0;
  for(const t of [10,...ts]){const t0=Date.now();await p.evaluate(t=>window.renderFrame(t),t);const t1=Date.now();await p.screenshot({type:'jpeg',quality:92,clip:{x:0,y:0,width:1080,height:1920}});const t2=Date.now();if(t!==10){R+=t1-t0;S+=t2-t1;}}
  console.log(JSON.stringify(c),'render+sync',Math.round(R/3),'ms  screenshot',Math.round(S/3),'ms');await b.close();}
 process.exit(0);})();
