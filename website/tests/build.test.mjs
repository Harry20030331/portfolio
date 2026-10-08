import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root,readPost,selectPosts,renderBody,build} from '../scripts/build.mjs';
test('only published posts or the explicitly named draft are selected',()=>{
 const posts=[{slug:'a',status:'published'},{slug:'community',status:'draft'},{slug:'secret',status:'unknown'}];
 assert.deepEqual(selectPosts(posts).map(p=>p.slug),['a']);
 assert.deepEqual(selectPosts(posts,'community').map(p=>p.slug),['a','community']);
 assert.throws(()=>selectPosts(posts,'secret'));
});
test('raw HTML cannot execute and unsafe article image paths fail',()=>{
 assert.match(renderBody({body:'<script>alert(1)</script>'}),/&lt;script&gt;/);
 assert.throws(()=>renderBody({body:'![private](../../../private.png)'}));
});
test('build packages approved public content and preserves article status',()=>{
 const source=fs.readFileSync(path.join(root,'content/blog/community.md'),'utf8');
 const output=path.join(root,'.preview/test-build');build({preview:'community',output});
 assert.match(fs.readFileSync(path.join(output,'index.html'),'utf8'),/blog\/community/);
 const article=fs.readFileSync(path.join(output,'blog/community/index.html'),'utf8');
 assert.match(article,/<meta name="robots" content="noindex,nofollow">/);assert.match(article,/table-scroll/);
 assert.match(article,/assets\/blog\/community\/community-path.svg/);
 for(const file of ['content','AGENTS.md','package.json','.git']) assert.equal(fs.existsSync(path.join(output,file)),false);
 assert.equal(fs.readFileSync(path.join(root,'content/blog/community.md'),'utf8'),source);
 build({output});assert.equal(fs.existsSync(path.join(output,'blog/community')),false);
});
