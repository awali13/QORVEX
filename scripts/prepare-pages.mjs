import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const searchRoots = [resolve(".output"), resolve("dist")].filter(existsSync);
const pending = [...searchRoots];
let shellPath;

while (pending.length && !shellPath) {
  const current = pending.pop();
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const path = join(current, entry.name);
    if (entry.isDirectory()) pending.push(path);
    else if (entry.name === "_shell.html") {
      shellPath = path;
      break;
    }
  }
}

if (!shellPath) {
  throw new Error("TanStack Start did not produce its GitHub Pages SPA shell (_shell.html).");
}

const outputRoot = dirname(shellPath);
const pagesRoot = resolve("site");
rmSync(pagesRoot, { recursive: true, force: true });
mkdirSync(pagesRoot, { recursive: true });
cpSync(outputRoot, pagesRoot, { recursive: true });
copyFileSync(join(pagesRoot, "_shell.html"), join(pagesRoot, "index.html"));
copyFileSync(join(pagesRoot, "_shell.html"), join(pagesRoot, "404.html"));
writeFileSync(join(pagesRoot, ".nojekyll"), "");

console.log(`Prepared GitHub Pages files from ${outputRoot}.`);
