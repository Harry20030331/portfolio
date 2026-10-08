import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {root,build} from './build.mjs';
export function parseRelease(text) {
 const data=JSON.parse(text);
 if(!/^[a-f0-9]{40}$/.test(data.sourceSha||''))throw new Error('Release must identify an approved source commit');
 if(typeof data.includeCommunityPreview!=='boolean')throw new Error('Release must explicitly choose whether to retain the Community draft preview');
 return data;
}
if(process.argv.includes('--build') && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const config=parseRelease(fs.readFileSync(path.join(root,'.github/release.json'),'utf8'));
 const parent=execFileSync('git',['rev-parse','HEAD^'],{cwd:root,encoding:'utf8'}).trim();
 const changed=execFileSync('git',['diff','--name-only',config.sourceSha,'HEAD'],{cwd:root,encoding:'utf8'}).trim();
 if(parent!==config.sourceSha || changed!=='.github/release.json')throw new Error('Release marker must immediately follow the approved source commit, changing only the marker');
 // Build the reviewed revision, rather than whatever else arrived on main later.
 execFileSync('git',['checkout','--detach',config.sourceSha],{cwd:root,stdio:'inherit'});
 build({preview:config.includeCommunityPreview?'community':undefined});
}
