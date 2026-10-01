/**
 * Makes dist a package to publish, after tsc compiled the components into
 * it (npm run build): copies theme.css and the README, and writes its
 * package.json, with the compiled exports, as @graphnous/theme on npm.
 * This folder's package.json stays as it is, so the workspace keeps using
 * the TypeScript source.
 *
 * PACKAGE_NAME and REPOSITORY override the name and the repository, which
 * the package's page on npm links to.
 */
import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const dist = path.join(root, "dist");

const source = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const repository = process.env.REPOSITORY ?? "graphnous/graphnous-theme";

const manifest = {
  name: process.env.PACKAGE_NAME ?? "@graphnous/theme",
  version: source.version,
  description: source.description,
  license: source.license,
  repository: { type: "git", url: `git+https://github.com/${repository}.git` },
  type: "module",
  sideEffects: source.sideEffects,
  exports: {
    ".": { types: "./index.d.ts", default: "./index.js" },
    "./theme.css": "./theme.css",
  },
  peerDependencies: source.peerDependencies,
  dependencies: source.dependencies,
  // Scoped packages are private on npm unless published as public
  publishConfig: { access: "public" },
};

await copyFile(path.join(root, "src", "theme.css"), path.join(dist, "theme.css"));
await copyFile(path.join(root, "README.md"), path.join(dist, "README.md"));
await writeFile(path.join(dist, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`${manifest.name}@${manifest.version} in dist`);
