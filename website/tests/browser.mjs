import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {build,root,loadPosts} from '../scripts/build.mjs';
const output=path.join(root,'.preview/browser');build({preview:loadPosts().some(p=>p.slug==='community'&&p.status==='draft')?'community':undefined,output});
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=path.resolve(output,'.'+pathname);
 if (!file.startsWith(output+path.sep)&&file!==output){res.writeHead(403);res.end();return;}
 try {if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}
 catch {res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
let browser;
try {
 browser=await chromium.launch({headless:true, ...(process.env.TEST_BROWSER_CHANNEL ? {channel:process.env.TEST_BROWSER_CHANNEL} : {})});
 fs.mkdirSync(path.join(root,'.preview/screenshots'),{recursive:true});
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(base+'/#blog');
  await page.locator('a.blog-row[href="./blog/community/"]').waitFor();
  await page.screenshot({path:path.join(root,'.preview/screenshots',name+'-list.png'),fullPage:true});
  assert.equal(await page.locator('[aria-label="Google Scholar"]').getAttribute('href'),'https://scholar.google.com/citations?user=eaoj2WsAAAAJ&hl=en');
  await page.locator('a.blog-row[href="./blog/community/"]').click();
  await page.getByRole('heading',{level:1}).waitFor();
  await page.locator('img').waitFor();
  assert.equal(await page.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'article page must not overflow');
  assert.equal(await page.locator('.sidebar').count(),0);
  await page.screenshot({path:path.join(root,'.preview/screenshots',name+'-article.png'),fullPage:true});
  await page.getByRole('navigation').getByRole('link',{name:'← All Article',exact:true}).click();
  await page.locator('a.blog-row[href="./blog/community/"]').waitFor();
  if (fs.existsSync(path.join(root,'content/blog/ideaweave-llm-systems.md'))) {
    await page.getByRole('link',{name:/IdeaWeave, Part I:/}).click();
    await page.getByRole('heading',{level:1,name:/Part I:/}).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    await page.screenshot({path:path.join(root,'.preview/screenshots',name+'-ideaweave-part-1.png')});
    await page.getByRole('link',{name:'Part II: Building with LLMs',exact:true}).first().click();
    await page.getByRole('heading',{level:1,name:/Part II:/}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    await page.screenshot({path:path.join(root,'.preview/screenshots',name+'-ideaweave-part-2.png')});
    await page.getByRole('link',{name:'Part I: Product and Engineering Judgment',exact:true}).click();
    await page.getByRole('heading',{level:1,name:/Part I:/}).waitFor();
  }
  for (const slug of ['silicon-valley-journal','silicon-valley-journal-part-2','silicon-valley-journal-zh','silicon-valley-journal-part-2-zh']) {
    if (!fs.existsSync(path.join(output,'blog',slug))) continue;
    await page.goto(base+'/blog/'+slug+'/');
    assert.equal(await page.locator('.reading-content h2').count(),4);
    assert.equal(await page.locator('time').getAttribute('datetime'),'2026-06-19');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    assert.equal(await page.locator('body').innerText().then(text=>text.includes('Pending review')),false);
    for (const href of await page.locator('.reading-content a').evaluateAll(links=>links.map(a=>a.href))) {
      assert.equal((await page.request.get(href)).status(),200,'journal language and part links must resolve');
    }
  }
  await page.close();
 }
 console.log('Desktop and mobile navigation, assets, social links and article layout passed.');
} finally {await browser?.close();server.close();}
