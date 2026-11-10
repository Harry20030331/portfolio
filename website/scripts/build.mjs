import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Marked, Renderer} from 'marked';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function readPost(text) {
  const match = text.replace(/\r\n/g,'\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Missing article metadata');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const split = line.indexOf(':');
    if (split < 1) throw new Error('Invalid metadata');
    const value = line.slice(split + 1).trim();
    meta[line.slice(0,split)] = value.startsWith('"') ? JSON.parse(value) : value;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug || '')) throw new Error('Invalid slug');
  if (!meta.title || !meta.summary) throw new Error('Missing article fields');
  if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error('Invalid writing date');
  if (meta.status === 'published' && !meta.date) throw new Error('Published articles require a verified writing date');
  return {...meta, body:match[2]};
}
export function selectPosts(posts, preview) {
  if (preview && !posts.some(p => p.slug === preview && p.status === 'draft')) throw new Error('Preview must name an existing draft');
  return posts.filter(p => p.status === 'published' || (p.status === 'draft' && p.slug === preview));
}
export function renderBody(post, {localPreview = false} = {}) {
  const markdown = new Marked({gfm:true, renderer:{
    html({text}) { return escape(text); },
    image({href,title,text}) {
      const safe = href.replace(/^\.\//,'');
      // Article-local source images must resolve to an explicitly public asset.
      if (/^(?:[a-z]+:|\/|\.\.)/i.test(safe)) throw new Error('Use an approved relative article image');
      let asset = path.resolve(root, 'website/assets/blog', safe);
      const assetsRoot = path.resolve(root, 'website/assets/blog') + path.sep;
      if (!asset.startsWith(assetsRoot)) throw new Error('Invalid image path');
      if (!fs.existsSync(asset) && localPreview) {
        asset=path.resolve(root,'content/blog',safe);
        if (!asset.startsWith(path.resolve(root,'content/blog')+path.sep)) throw new Error('Invalid local image');
      }
      if (!fs.existsSync(asset)) throw new Error('Missing approved image: '+safe);
      return `<figure><img src="../../assets/blog/${escape(safe)}" alt="${escape(text)}"${title ? ` title="${escape(title)}"` : ''} loading="lazy"></figure>`;
    },
    link({href,title,tokens}) {
      if (/^(?:javascript|data|file):/i.test(href)) throw new Error('Unsupported link');
      return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
    },
    table(token) { return `<div class="table-scroll" tabindex="0" role="region" aria-label="Comparison table">${Renderer.prototype.table.call(this,token)}</div>`; }
  }});
  return markdown.parse(post.body);
}
export function loadPosts() {
  return fs.readdirSync(path.join(root,'content/blog')).filter(f => f.endsWith('.md') && f !== 'README.md' && f !== 'editorial-notes.md').map(f => readPost(fs.readFileSync(path.join(root,'content/blog',f),'utf8')));
}
export function sortPosts(posts) {
  return [...posts].sort((a,b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));
}
function formatTitle(post) {
  const book=post.title_book;
  const index=book ? post.title.indexOf(book) : -1;
  if (index < 0) return escape(post.title);
  return escape(post.title.slice(0,index)) + '<cite>' + escape(book) + '</cite>' + escape(post.title.slice(index+book.length));
}
export function renderHome(posts) {
  const bySlug = new Map(posts.map(p => [p.slug,p]));
  const translations = new Set(posts.filter(p => bySlug.has(p.translation_zh)).map(p => p.translation_zh));
  const list = posts.filter(p => !translations.has(p.slug)).map(p => {
    const title = formatTitle(p);
    const review = p.review==='pending' && p.status==='draft' ? '<span class="blog-review-status">Pending review</span>' : '';
    const date = p.date ? `<time datetime="${p.date}">${p.date}</time>` : '';
    const href = `./blog/${p.slug}/`;
    if (!bySlug.has(p.translation_zh)) {
      return `<a class="blog-row" href="${href}"><div><div class="blog-row-title"><h3>${title}</h3>${review}</div><p>${escape(p.summary)}</p></div>${date}</a>`;
    }
    return `<div class="blog-row blog-row-with-language"><div><div class="blog-row-title"><a class="blog-title-link" href="${href}"><h3>${title}</h3></a>${review}<a class="blog-language-link" href="./blog/${p.translation_zh}/" lang="zh-CN" hreflang="zh-CN" aria-label="${escape('Read the Chinese version of '+p.title)}">中文版</a></div><a class="blog-summary-link" href="${href}"><p>${escape(p.summary)}</p></a></div>${date}</div>`;
  }).join('\n') || '<p class="blog-empty">Articles coming soon.</p>';
  return fs.readFileSync(path.join(root,'index.html'),'utf8').replace('<!-- BLOG_POSTS -->',list);
}
function formatWritingDate(date) {
  const [year,month,day]=date.split('-');
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[Number(month)-1]} ${Number(day)}, ${year}`;
}
export function renderArticle(post, options = {}) {
  const body=renderBody(post, options);
  return `<!doctype html><html lang="${escape(post.lang || 'en')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(post.title)} — Yuming Feng</title><meta name="description" content="${escape(post.summary)}">${post.status==='draft'?'<meta name="robots" content="noindex,nofollow">':''}<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="../../assets/css/style.css?v=6"><link rel="stylesheet" href="../../website/blog.css?v=3"></head><body class="blog-reading"><div class="reading-wrap"><nav class="reading-nav"><a href="../../#blog">← All Article</a><a href="../../">Yuming Feng</a></nav><main class="reading-main"><header class="reading-header"><h1>${formatTitle(post)}</h1>${post.date ? `<p class="reading-meta"><time datetime="${post.date}">${escape(formatWritingDate(post.date))}</time></p>` : ''}</header><article class="reading-content">${body}</article></main><footer class="reading-footer"><a href="../../#blog">← All Article</a></footer></div></body></html>`;
}

export function build({preview,output = path.join(root,'dist')} = {}) {
  const selected = sortPosts(selectPosts(loadPosts(), preview));
  if (new Set(selected.map(p=>p.slug)).size !== selected.length) throw new Error('Duplicate article slug');
  // Remove only the known generated output, never arbitrary user paths.
  const resolved=path.resolve(output);
  if (resolved !== path.join(root,'dist') && !resolved.startsWith(path.join(root,'.preview')+path.sep)) throw new Error('Unsafe output directory');
  fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
  for (const item of ['assets','images','CV_LLM.pdf']) fs.cpSync(path.join(root,item),path.join(output,item),{recursive:true});
  fs.mkdirSync(path.join(output,'website'),{recursive:true});
  fs.copyFileSync(path.join(root,'website/blog.css'),path.join(output,'website/blog.css'));
  if (fs.existsSync(path.join(root,'website/assets'))) fs.cpSync(path.join(root,'website/assets'),path.join(output,'assets'),{recursive:true});
  fs.writeFileSync(path.join(output,'index.html'),renderHome(selected));
  for (const post of selected) {
    const dir=path.join(output,'blog',post.slug);fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,'index.html'),renderArticle(post));
  }
  fs.writeFileSync(path.join(output,'.nojekyll'),'');
  console.log(`Built ${selected.length} article(s)${preview ? `; approved draft preview: ${preview}` : ''} → ${output}`);
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=process.argv.slice(2).find(x=>x.startsWith('--preview='));
  build({preview:arg?.slice(10)});
}
