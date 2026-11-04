const {chromium}=require('playwright');require('./serve.js');
(async()=>{const [rw,rh]=[+process.argv[2],+process.argv[3]];const ts=[38.8,22.6,61.3,46.0];
 const b=await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto(`http://localhost:${process.env.PORT}/index.html?rw=${rw}&rh=${rh}`);await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});await p.evaluate(()=>window.SYNC=true);
 for(const prof of JSON.parse(process.env.PROFS)){await p.evaluate(x=>window.PROF=x,prof);await p.evaluate(()=>window.renderFrame(10));
  let R=0;for(const t of ts){const t0=Date.now();await p.evaluate(t=>window.renderFrame(t),t);R+=Date.now()-t0;}console.log(JSON.stringify(prof),Math.round(R/ts.length),'ms');}
 await b.close();process.exit(0);})();
