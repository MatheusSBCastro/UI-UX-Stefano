import { createHash } from 'node:crypto';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
if (process.platform !== 'win32' || process.arch !== 'x64') {
  console.error('O runtime portátil deste script é para Windows x64. Use Python 3 do seu sistema ou configure UI_UX_PYTHON.');
  process.exit(1);
}
const executable = path.join(root, '.tools/python/python.exe');
if (existsSync(executable)) {
  const check = spawnSync(executable, ['--version'], { stdio: 'inherit', windowsHide: true });
  process.exit(check.status ?? 1);
}
const url = 'https://www.python.org/ftp/python/3.13.16/python-3.13.16-embed-amd64.zip';
const expected = '97dae5274cc54867065e8d5a3226e48c35017ed332a0fdb0e27d5b5821961297';
console.log('Preparando Python portátil em .tools/python (sem alterar o PATH ou o registro).');
const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
if (!response.ok) throw new Error(`Download falhou: HTTP ${response.status}`);
const bytes = Buffer.from(await response.arrayBuffer());
if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error('SHA-256 diferente da publicação oficial; extração cancelada.');
mkdirSync(path.join(root, '.tools'), { recursive: true });
writeFileSync(path.join(root, '.tools/python.zip'), bytes);
const extracted = spawnSync('powershell.exe', ['-NoProfile', '-Command', "Expand-Archive -LiteralPath '.tools\\python.zip' -DestinationPath '.tools\\python'"], { cwd: root, stdio: 'inherit', windowsHide: true });
if (extracted.status !== 0) process.exit(extracted.status ?? 1);
console.log('Runtime pronto. Execute npm.cmd run design -- "creative studio portfolio" --design-system');
