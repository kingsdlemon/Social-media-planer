const {chromium}=require('playwright');require('./serve.js');
(async()=>{const b=await chromium.launch({args:['--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto(`http://localhost:${process.env.PORT}/index.html?rw=108&rh=192`);await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});
 let mn=99,mt=0;for(let f=Math.round(46.3*30);f<Math.round(55.3*30);f++){const d=await p.evaluate(t=>window.headCamDist(t),f/30);if(d<mn){mn=d;mt=f/30;}}
 console.log('min head-camera distance',mn.toFixed(3),'m at t=',mt.toFixed(2));await b.close();process.exit(0);})();
