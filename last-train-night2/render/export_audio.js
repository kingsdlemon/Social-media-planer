const {chromium}=require('playwright');const fs=require('fs');require('./serve.js');
(async()=>{const b=await chromium.launch({args:['--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto(`http://localhost:${process.env.PORT}/index.html?rw=216&rh=384`);await p.waitForFunction(()=>window.READY||window.INIT_ERR,null,{timeout:180000});
 fs.writeFileSync(process.argv[2],JSON.stringify(await p.evaluate(()=>window.exportAudio())));await b.close();process.exit(0);})();
