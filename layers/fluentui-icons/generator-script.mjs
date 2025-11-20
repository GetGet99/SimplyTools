// ./layers/fluentui-icons/generator-script.mjs
// @ts-check

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * ESM-friendly __filename / __dirname
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * The filename pattern suffix we care about.
 * @type {string}
 */
const ICON_SUFFIX = "_24_regular.svg";

/**
 * Search upward from `startDir` for the nearest directory containing package.json.
 * Returns the directory path or null if not found.
 *
 * @param {string} startDir
 * @returns {Promise<string|null>}
 */
async function findProjectRoot(startDir) {
  let current = path.resolve(startDir);
  while (true) {
    const pkgPath = path.join(current, "package.json");
    try {
      const stat = await fs.stat(pkgPath);
      if (stat.isFile()) return current;
    } catch (e) {
      // not found here, continue up
    }
    const parent = path.dirname(current);
    if (parent === current) return null; // reached root
    current = parent;
  }
}

/**
 * Check whether a given icons directory exists (and is a directory).
 * @param {string} iconsDir
 * @returns {Promise<boolean>}
 */
async function iconsDirExists(iconsDir) {
  try {
    const stat = await fs.stat(iconsDir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Recursively collect *file names* (not full paths) under `dir` that end with ICON_SUFFIX.
 * We return names relative to `dir` (just the filename; Fluent import path only needs filename).
 *
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collect24RegularSvgFilenames(dir) {
  const results = [];
  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(currentDir, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else if (ent.isFile() && ent.name.endsWith(ICON_SUFFIX)) {
        // We only need the filename (icons live directly in the 'icons' folder in normal layout),
        // but in case there are subfolders, we'll keep the *relative path from dir* (POSIX style)
        const rel = path.relative(dir, full).split(path.sep).join(path.posix.sep);
        results.push(rel);
      }
    }
  }
  await walk(dir);
  return results;
}

/**
 * Generate a Vue wrapper component for a single icon filename (relative path under iconsDir).
 *
 * @param {string} filenameRel - e.g. "copy_24_regular.svg" or "subdir/whatever_24_regular.svg"
 * @param {string} outDir - directory to write .vue into (absolute)
 * @returns {Promise<void>}
 */
async function generateSingleVue(filenameRel, outDir) {
  // derive base name for component file (strip suffix and any path)
  const base = path.basename(filenameRel, ICON_SUFFIX); // snake_case, e.g. "arrow_left"
  const pascal = toPascalCase(base);                    // e.g. "ArrowLeft"
  const componentFileName = `${pascal}.vue`;
  const outPath = path.join(outDir, componentFileName);


  // import path used in Vue file must be package path with POSIX separators
  const importPath = `@fluentui/svg-icons/icons/${filenameRel}?raw`;

  const content = `\
<script setup lang="ts">
import svg from "${importPath}"
defineProps<{
  alt?: string
}>()
</script>

<template>
  <Icon :icon="svg" :alt="alt ?? ''" />
</template>
`;

  await fs.writeFile(outPath, content, "utf8");
}

/**
 * Convert a snake_case or kebab-case string into PascalCase.
 * @param {string} name
 * @returns {string}
 */
function toPascalCase(name) {
  return name
    .replace(/[-_]+/g, " ")       // snake_case → "snake case"
    .replace(/\s+./g, s => s.trim().toUpperCase()) // "s" → "S"
    .replace(/^./, s => s.toUpperCase()); // capitalize first
}

/**
 * Remove all .vue files from the autogen directory.
 * @param {string} dir
 * @returns {Promise<void>}
 */
async function clearAutogenDirectory(dir) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && file.name.endsWith(".vue")) {
        await fs.unlink(path.join(dir, file.name));
      }
    }
  } catch {
    // Directory may not exist yet — ignore
  }
}

/**
 * Generate a barrel file (_barrel.ts) exporting all PascalCase .vue components.
 *
 * @param {string} dir
 * @returns {Promise<void>}
 */
async function generateBarrelFile(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  const vueFiles = files
    .filter(f => f.isFile() && f.name.endsWith(".vue"))
    .map(f => f.name.replace(".vue", "")); // PascalCase names

  let content = "";
  for (const name of vueFiles) {
    content += `export { default as ${name} } from "./${name}.vue";\n`;
  }

  const outPath = path.join(dir, "_barrel.ts");
  await fs.writeFile(outPath, content, "utf8");
}

/**
 * Main generator routine.
 */
async function main() {
  console.log("🛠️  Icon generator starting...");

  // 1) Try to find project root from where the user invoked the command (process.cwd()).
  const cwd = process.cwd();
  const projectRoot = await findProjectRoot(cwd);

  let iconsDir = null;

  if (projectRoot) {
    const candidate = path.join(
      projectRoot,
      "node_modules",
      "@fluentui",
      "svg-icons",
      "icons"
    );
    if (await iconsDirExists(candidate)) {
      iconsDir = candidate;
      console.log("🔎 Found icons under project root node_modules:", candidate);
    } else {
      console.log(
        "ℹ️  project root found at",
        projectRoot,
        "but @fluentui/svg-icons/icons not present there."
      );
    }
  } else {
    console.log(
      "ℹ️  Could not find project root (no package.json upward from cwd)."
    );
  }

  // 2) If not found yet, try from the script directory (this handles running script from layers dir)
  if (!iconsDir) {
    // search upward from script location for node_modules/@fluentui/svg-icons/icons
    let current = __dirname;
    while (true) {
      const candidate = path.join(
        current,
        "node_modules",
        "@fluentui",
        "svg-icons",
        "icons"
      );
      if (await iconsDirExists(candidate)) {
        iconsDir = candidate;
        console.log("🔎 Found icons under script-location node_modules:", candidate);
        break;
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }

  if (!iconsDir) {
    console.error(
      "❌ Could not locate @fluentui/svg-icons/icons in project node_modules or upward from script."
    );
    console.error("   Make sure @fluentui/svg-icons is installed in your repository root node_modules.");
    process.exit(1);
  }

  // 3) Collect filenames
  const filenames = await collect24RegularSvgFilenames(iconsDir);

  if (!filenames.length) {
    console.error("❌ No matching FluentUI icons found (*_24_regular.svg).");
    console.error("   Checked:", iconsDir);
    process.exit(1);
  }

  // 4) Output directory (relative to script location so generated files always land in layers/fluentui-icons/)
  const OUTPUT_DIR = path.resolve(__dirname, "components-autogen");

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Remove previously generated .vue files
  console.log("🧹 Clearing previous generated components...");
  await clearAutogenDirectory(OUTPUT_DIR);

  console.log(`📦 Found ${filenames.length} icons — generating into: ${OUTPUT_DIR}`);

  for (const f of filenames) {
    await generateSingleVue(f, OUTPUT_DIR);
  }

  console.log("✨ Done! Generated components:");
  console.log("➡", OUTPUT_DIR);

  console.log("🧾 Generating _barrel.ts barrel file...");
  await generateBarrelFile(OUTPUT_DIR);
  console.log("✅ All done!");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
