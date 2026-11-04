// tiny static server: node serve.js ROOT PORT
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../web'),port=+(process.env.PORT||8123);
const T={'.html':'text/html','.js':'text/javascript','.json':'application/json','.ttf':'font/ttf','.png':'image/png','.wav':'audio/wav'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';
 const f=path.join(root,p);if(!f.startsWith(root))return r.writeHead(403).end();
 fs.readFile(f,(e,d)=>{if(e)return r.writeHead(404).end('nf');r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});r.end(d);});
}).listen(port);
module.exports={};
