// node plan.js QUEUEDIR [maxFramesPerJob] : writes one job per shot (split long shots)
const {chromium}=require('playwright');const fs=require('fs');require('./serve.js');
(async()=>{const q=process.argv[2];fs.mkdirSync(q,{recursive:true});const b=await chromium.launch({args:['--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto(`http://localhost:${process.env.PORT||8123}/index.html`);await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});
 const shots=await p.evaluate(()=>window.shotList());const total=await p.evaluate(()=>window.EVENTS.total);const N=Math.round(total*30);
 fs.writeFileSync(q+'/../events.json',JSON.stringify(await p.evaluate(()=>window.EVENTS)));
 let i=0;for(let k=0;k<shots.length;k++){let f0=Math.ceil(shots[k][0]*30-1e-6),f1=Math.min(N,Math.ceil(shots[k][1]*30-1e-6));if(k===0)f0=0;if(k===shots.length-1)f1=N;
  if(f1<=f0)continue;const MAXF=+(process.env.MAXF||100000);for(let a=f0;a<f1;a+=MAXF){const b=Math.min(f1,a+MAXF);fs.writeFileSync(`${q}/${String(i).padStart(3,'0')}.job`,JSON.stringify({i,f0:a,f1:b,shot:k}));i++;}}
 console.log('jobs',i,'frames',N);await b.close();process.exit(0);})();
