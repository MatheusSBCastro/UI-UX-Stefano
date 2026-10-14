import { readFile,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve,dirname } from 'node:path';
const folder=dirname(fileURLToPath(import.meta.url)),dist=resolve(folder,'dist');
let html=await readFile(resolve(dist,'index.html'),'utf8');
for(const match of [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)]){
  const js=await readFile(resolve(dist,match[1]),'utf8');
  html=html.replace(match[0],()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
}
for(const match of [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/g)]){
  const css=await readFile(resolve(dist,match[1]),'utf8');html=html.replace(match[0],()=>`<style>${css}</style>`);
}
html=html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g,'');
if(/<(?:script|link)[^>]+(?:src|href)="\.?\/?assets\//.test(html))throw new Error('Unbundled dependency remains in standalone HTML');
await writeFile(resolve(dist,'atlas-humano.html'),html);
console.log(`Standalone HTML: ${resolve(dist,'atlas-humano.html')} (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MiB)`);
