import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(projectRoot, "dist");
const outputRelative = relative(projectRoot, outputDir);

if (!outputRelative || outputRelative.startsWith(`..${sep}`) || outputRelative === "..") {
  throw new Error(`Unsafe build output path: ${outputDir}`);
}

const staticFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "database.js",
  "db_config.js",
  "manifest.json",
  "version.json"
];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of staticFiles) {
  await cp(join(projectRoot, file), join(outputDir, file));
}

await cp(join(projectRoot, "images"), join(outputDir, "images"), {
  recursive: true
});

console.log(`Cloudflare build ready: ${outputDir}`);
