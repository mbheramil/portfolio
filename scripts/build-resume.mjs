// Renders resume/index.html to public/resume.pdf.
//
// The source is a gitignored HTML file (it holds employment history that has no
// business sitting in a public repo as plain text). Only the rendered PDF ships.
// Run this after editing it: npm run resume
//
// Requires a local Chrome or Edge. No npm dependency, so the CI build never
// needs a browser, since the PDF is committed as an artifact.

import { execFileSync } from 'node:child_process';
import { existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'resume/index.html');
const out = resolve(root, 'public/resume.pdf');

if (!existsSync(src)) {
  console.error(`No source at ${src}\nThe résumé HTML is gitignored, so a fresh clone won't have it.`);
  process.exit(1);
}

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome or Edge found. Set CHROME_PATH to the executable.');
  process.exit(1);
}

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${out}`,
  pathToFileURL(src).href,
], { stdio: ['ignore', 'ignore', 'ignore'] });

if (!existsSync(out)) {
  console.error('Render produced no file.');
  process.exit(1);
}

// Chrome writes its full user-agent into /Creator and its Skia version into
// /Producer, both of which show up in any PDF reader's document properties.
// Swap them for something that reads like a document rather than a build log.
// Byte-length is preserved by padding, so the xref offsets stay valid.
const buf = readFileSync(out);
const AUTHOR = '/Author (Michael Bryan Heramil)';
// The UA string contains escaped parens, so the string body has to be matched
// as "escape pair or non-paren", not as "anything up to the next )".
const pdfString = String.raw`\((?:\\.|[^()\\])*\)`;
const swaps = [
  [new RegExp(String.raw`/Creator ${pdfString}`), '/Creator (mbheramil.com)'],
  [new RegExp(String.raw`/Producer ${pdfString}`), '/Producer (mbheramil.com)'],
];
let text = buf.toString('latin1');
let changed = false;
for (const [pattern, replacement] of swaps) {
  const hit = text.match(pattern);
  if (!hit) continue;
  const pad = hit[0].length - replacement.length;
  if (pad < 0) continue;
  // /Author is worth having for résumé parsers and Chrome never sets it. The
  // spare bytes freed by shortening the UA string are enough to hold it.
  const extra = replacement.startsWith('/Creator') && pad > AUTHOR.length + 1
    ? `\n${AUTHOR}`
    : '';
  text = text.replace(pattern, replacement + extra + ' '.repeat(pad - extra.length));
  changed = true;
}
if (changed) writeFileSync(out, Buffer.from(text, 'latin1'));

console.log(`public/resume.pdf  ${(statSync(out).size / 1024).toFixed(0)} KB`);
console.log('Check the page count before committing. Print styles are tuned for two pages.');
