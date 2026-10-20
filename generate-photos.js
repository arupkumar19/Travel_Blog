#!/usr/bin/env node
/**
 * generate-photos.js
 *
 * Scans every subfolder inside pics/ and writes a photos.json listing
 * all image filenames found there. Run this after adding new photos:
 *
 *   node generate-photos.js
 *
 * photos.json format — plain array of filenames:
 *   ["IMG_001.jpg", "IMG_002.jpg"]
 *
 * To add captions, change a filename entry to an object:
 *   { "file": "IMG_001.jpg", "caption": "Sunrise at base camp" }
 * The generator will not overwrite hand-edited captions on re-runs —
 * it merges new files in and preserves existing caption objects.
 */

const fs   = require('fs');
const path = require('path');

const PICS_DIR   = path.join(__dirname, 'pics');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp',
                             '.JPG', '.JPEG', '.PNG', '.WEBP']);

const folders = fs.readdirSync(PICS_DIR).filter(f =>
  fs.statSync(path.join(PICS_DIR, f)).isDirectory()
);

if (!folders.length) {
  console.log('No trip folders found under pics/');
  process.exit(0);
}

for (const folder of folders) {
  const folderPath = path.join(PICS_DIR, folder);
  const outPath    = path.join(folderPath, 'photos.json');

  const imageFiles = fs.readdirSync(folderPath)
    .filter(f => IMAGE_EXTS.has(path.extname(f)))
    .sort();

  if (!imageFiles.length) {
    console.log(`  skip  ${folder}/ — no images found`);
    continue;
  }

  // Load existing photos.json to preserve any hand-written captions
  let existing = [];
  if (fs.existsSync(outPath)) {
    try { existing = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch (_) {}
  }

  // Build a map of filename → caption from existing entries
  const captionMap = {};
  for (const entry of existing) {
    if (typeof entry === 'object' && entry.file && entry.caption) {
      captionMap[entry.file] = entry.caption;
    }
  }

  // Merge: keep caption objects for files that have captions, plain strings otherwise
  const merged = imageFiles.map(f =>
    captionMap[f] ? { file: f, caption: captionMap[f] } : f
  );

  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`  wrote ${folder}/photos.json  (${imageFiles.length} images)`);
}

console.log('\nDone. Commit the photos.json files and push.');
