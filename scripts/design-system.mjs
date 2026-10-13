import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(root, '.agents/skills/ui-ux-pro-max/scripts/search.py');
const localPython = path.join(root, '.tools/python/python.exe');
const candidates = [
  ...(process.env.UI_UX_PYTHON ? [[process.env.UI_UX_PYTHON, []]] : []),
  ...(existsSync(localPython) ? [[localPython, []]] : []),
  ['python', []], ['python3', []], ['py', ['-3']],
];
const python = candidates.find(([command, prefix]) => spawnSync(command, [...prefix, '--version'], { encoding: 'utf8', windowsHide: true }).status === 0);
if (!python) {
  console.error('Python 3 não encontrado. No Windows, execute npm.cmd run setup:python para preparar o runtime portátil. Em outros sistemas, use Python 3 instalado.');
  process.exit(1);
}
const args = process.argv.slice(2);
if (!args.length) {
  console.error('Uso: npm.cmd run design -- "creative studio portfolio" --design-system -p "Meu projeto"');
  process.exit(1);
}
// Embedded Python isolates sys.path. Explicitly add the skill scripts directory
// so the original search.py can import its sibling modules without OS changes.
const runner = "import runpy,sys; sys.path.insert(0,sys.argv[1]); sys.argv=sys.argv[2:]; runpy.run_path(sys.argv[0],run_name='__main__')";
const result = spawnSync(python[0], [...python[1], '-X', 'utf8', '-c', runner, path.dirname(script), script, ...args], { cwd: root, stdio: 'inherit', windowsHide: true });
process.exit(result.status ?? 1);
