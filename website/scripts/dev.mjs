import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {root,loadPosts,sortPosts,renderHome,renderArticle,escape} from './build.mjs';

const client = `const source=new EventSource('/__preview/events');
source.addEventListener('reload',()=>{sessionStorage.setItem('preview-scroll:'+location.pathname,String(scrollY));location.reload();});
addEventListener('load',()=>{const key='preview-scroll:'+location.pathname;const y=sessionStorage.getItem(key);if(y!==null){scrollTo(0,Number(y));sessionStorage.removeItem(key);}});`;
const decorate = html => html.replace('</body>', '<script src="/__preview/client.js"></script></body>');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.pdf':'application/pdf'};
export function createPreviewServer() {
 const clients=new Set();
 const server=http.createServer((req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  let pathname;
  try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  if(pathname==='/__preview/events'){
   res.writeHead(200,{'Content-Type':'text/event-stream','Connection':'keep-alive'});res.write(': connected\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;
  }
  if(pathname==='/__preview/client.js'){res.setHeader('Content-Type',types['.js']);res.end(client);return;}
  if(pathname==='/'){res.writeHead(302,{Location:'/portfolio/'});res.end();return;}
  const relative=pathname.replace(/^\/portfolio(?=\/|$)/,'').replace(/^\//,'');
  try{
   let html;
   const posts=sortPosts(loadPosts().filter(p=>['published','draft'].includes(p.status)));
   if(relative==='' || relative==='index.html') html=renderHome(posts);
   else if(/^blog\/[a-z0-9-]+\/?$/.test(relative)){
    const slug=relative.split('/')[1];const post=posts.find(p=>p.slug===slug);
    if(!post){res.writeHead(404);res.end('Article not found');return;}
    if(!pathname.endsWith('/')){res.writeHead(302,{Location:pathname+'/'});res.end();return;}
    html=renderArticle(post,{localPreview:true});
   }
   if(html){res.setHeader('Content-Type',types['.html']);res.end(req.method==='HEAD'?undefined:decorate(html));return;}
   let file;
   if(relative==='website/blog.css' || relative==='CV_LLM.pdf' || relative.startsWith('images/') || relative.startsWith('assets/')){
    file=path.resolve(root,relative);
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(relative.startsWith('assets/blog/')){
     const suffix=relative.slice('assets/blog/'.length);
     const publicAsset=path.resolve(root,'website/assets/blog',suffix);
     const privateAsset=path.resolve(root,'content/blog',suffix);
     if(!publicAsset.startsWith(path.resolve(root,'website/assets/blog')+path.sep)||!privateAsset.startsWith(path.resolve(root,'content/blog')+path.sep)){res.writeHead(403);res.end();return;}
     file=fs.existsSync(publicAsset)?publicAsset:privateAsset;
    }
   }
   // Serve only site assets, never repository metadata, draft source or runtime files.
   if(!file || !types[path.extname(file)] || !fs.existsSync(file) || !fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
   res.setHeader('Content-Type',types[path.extname(file)]);res.end(req.method==='HEAD'?undefined:fs.readFileSync(file));
  }catch(error){res.writeHead(500,{'Content-Type':types['.html']});res.end(`<h1>Preview needs attention</h1><pre>${escape(error.message)}</pre><script src="/__preview/client.js"></script>`);console.error(error.message);}
 });
 let timer;
 const reload=()=>{clearTimeout(timer);timer=setTimeout(()=>{for(const res of clients)res.write('event: reload\ndata: changed\n\n');},100);};
 const watchers=[];
 for(const dir of ['content/blog','website/assets','assets','images']){
  const full=path.join(root,dir);if(fs.existsSync(full))watchers.push(fs.watch(full,{recursive:true},reload));
 }
 watchers.push(fs.watch(root,(_,name)=>{if(String(name)==='index.html')reload();}));
 watchers.push(fs.watch(path.join(root,'website'),(_,name)=>{if(String(name)==='blog.css')reload();}));
 const pulse=setInterval(()=>{for(const res of clients)res.write(': keepalive\n\n');},20000);pulse.unref();
 server.on('close',()=>{clearTimeout(timer);clearInterval(pulse);for(const watcher of watchers)watcher.close();for(const res of clients)res.end();});
 return server;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||5173);
 const host=process.env.PREVIEW_HOST||'127.0.0.1';
 const server=createPreviewServer();
 server.on('error',error=>{console.error(error.message);process.exitCode=1;server.close();});
 server.listen(port,host,()=>console.log(`Local preview: http://${host}:${port}/portfolio/#blog\nMarkdown and styles render on request; saves refresh the page. No upload or deployment.`));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit()));
}
