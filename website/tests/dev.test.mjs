import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPreviewServer} from '../scripts/dev.mjs';
import {loadPosts,renderArticle} from '../scripts/build.mjs';
import {parseRelease} from '../scripts/release.mjs';
test('local preview follows article status without exposing source',async()=>{
 const server=createPreviewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  const home=await (await fetch(base+'/portfolio/')).text();assert.match(home,/blog\/community\//);assert.match(home,/__preview\/client.js/);
  const post=loadPosts().find(p=>p.slug==='community');
  const article=await (await fetch(base+'/portfolio/blog/community/')).text();assert.equal(article.includes('<meta name="robots" content="noindex,nofollow">'),post.status==='draft');assert.match(article,/__preview\/client.js/);
  assert.match(renderArticle({...post,status:'draft'}),/<meta name="robots" content="noindex,nofollow">/);
  for(const route of ['content/blog/community.md','.git/config','AGENTS.md','package.json'])assert.equal((await fetch(base+'/portfolio/'+route)).status,404);
  assert.equal((await fetch(base+'/portfolio/assets/blog/community/community-path.svg')).status,200);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
test('release marker requires an exact commit and an explicit preview choice',()=>{
 assert.deepEqual(parseRelease(JSON.stringify({sourceSha:'a'.repeat(40),includeCommunityPreview:true})),{sourceSha:'a'.repeat(40),includeCommunityPreview:true});
 assert.throws(()=>parseRelease('{"sourceSha":"main","includeCommunityPreview":true}'));
 assert.throws(()=>parseRelease(JSON.stringify({sourceSha:'a'.repeat(40),includeCommunityPreview:'true'})));
});
