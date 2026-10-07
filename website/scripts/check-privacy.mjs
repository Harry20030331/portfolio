import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const env={...process.env};
if (process.platform === 'darwin' && fs.existsSync('/Library/Developer/CommandLineTools')) env.DEVELOPER_DIR='/Library/Developer/CommandLineTools';
const git = args => execFileSync('git',args,{cwd:root,env,encoding:'utf8'});
const files=git(['ls-files','-z','content/blog','content/x']).split('\0').filter(Boolean);
let failed=false;
for (const file of files) {
  if (file === 'content/blog/README.md' || file === 'content/x/README.md') continue;
  // Inspect both staged and working-tree versions for excluded editorial material.
  for (const [label,text] of [['index',git(['show',':'+file])],['working tree',fs.existsSync(file)?fs.readFileSync(file,'utf8'):'']]) {
    const article = /^content\/blog\/[^/]+\.md$/.test(file) && /^---\n[\s\S]*?\nstatus: (draft|published)\n[\s\S]*?---(?:\n|$)/.test(text.replace(/\r\n/g,'\n'));
    const asset = file.startsWith('content/blog/') && /\.(svg|png|jpe?g|webp|gif)$/.test(file);
    if (!article && !asset) {
      console.error(`Refusing public source: ${file} (${label}). Only authorized Blog articles and image assets may be tracked.`);failed=true;
    }
  }
}
if (failed) process.exit(1);
console.log('Content check passed: Blog drafts/assets may be tracked; editorial notes and X copy are excluded.');
