// worker: node render.js PORT QUEUEFILE OUTDIR  -- pulls shot jobs [{i,f0,f1}] from queue (atomic rename locks)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {spawn}=require('child_process');
require('./serve.js');
const FPS=30;
(async()=>{const port=process.env.PORT,qdir=process.argv[2],out=process.argv[3];fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const DPR=+(process.env.DPR||1);const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:DPR});
 p.on('pageerror',e=>console.log('[pageerror]',e.message));
 await p.goto(`http://localhost:${port}/index.html?rw=${process.env.RW||432}&rh=${process.env.RH||768}`);await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});
 const err=await p.evaluate(()=>window.INIT_ERR);if(err){console.log(err);process.exit(1);}
 while(true){const jobs=fs.readdirSync(qdir).filter(f=>f.endsWith('.job')).sort();if(!jobs.length)break;let mine=null;
  for(const j of jobs){try{fs.renameSync(path.join(qdir,j),path.join(qdir,j+'.'+port));mine=j;break;}catch(e){}}if(!mine)break;
  const job=JSON.parse(fs.readFileSync(path.join(qdir,mine+'.'+port)));const tmp=path.join(out,`shot_${String(job.i).padStart(3,'0')}.tmp.mp4`),fin=tmp.replace('.tmp','');
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset',process.env.PRESET||'medium','-crf',process.env.CRF||'15','-pix_fmt','yuv420p','-r',String(FPS),'-video_track_timescale','15360',tmp],{stdio:['pipe','inherit','inherit']});
  const t0=Date.now();
  let buf=null;for(let f=job.f0;f<job.f1;f++){if((f-job.f0)%(+process.env.STEP||2)===0){const t=f/FPS;await p.evaluate(t=>window.renderFrame(t),t);
   buf=await p.screenshot({type:'jpeg',quality:+(process.env.JQ||92),clip:{x:0,y:0,width:1080,height:1920}});}if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));fs.renameSync(tmp,fin);fs.renameSync(path.join(qdir,mine+'.'+port),path.join(qdir,mine+'.done'));
  console.log(`[${port}] shot ${job.i} frames ${job.f1-job.f0} in ${((Date.now()-t0)/1000).toFixed(0)}s (${((Date.now()-t0)/(job.f1-job.f0)).toFixed(0)}ms/f)`);}
 await b.close();process.exit(0);})();
