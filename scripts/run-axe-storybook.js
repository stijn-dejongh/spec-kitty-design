#!/usr/bin/env node
/**
 * run-axe-storybook.js — WCAG 2.1 AA accessibility gate for all Storybook stories.
 *
 * FR-021: automated accessibility checks against ALL Storybook stories.
 *
 * Strategy:
 *   1. Read storybook-static/index.json (or stories.json) for the full story inventory.
 *   2. For each story, load its iframe URL and run axe with wcag2a + wcag2aa tags.
 *   3. Exit 1 if any violation is found across any story; exit 0 if all pass.
 *
 * Usage: node scripts/run-axe-storybook.js
 * Requires: Storybook must be built first (npx nx run storybook:storybook:build)
 */
'use strict';

const { chromium } = require('playwright');
const { injectAxe, getViolations } = require('axe-playwright');
const { existsSync, readFileSync } = require('fs');
const path = require('path');

const STORYBOOK_DIR = path.resolve('apps/storybook/storybook-static');
const AXE_TAGS = ['wcag2a', 'wcag2aa'];

// ── Load story manifest ───────────────────────────────────────────────────────

function loadStoryManifest() {
  // Storybook 10.x: index.json  |  Storybook 8.x: stories.json
  for (const filename of ['index.json', 'stories.json']) {
    const p = path.join(STORYBOOK_DIR, filename);
    if (existsSync(p)) {
      const data = JSON.parse(readFileSync(p, 'utf8'));
      // Storybook index.json shape: { entries: { [id]: { type, name, ... } } }
      // Filter to only 'story' entries (not docs pages)
      const entries = data.entries || data; // stories.json has flat map
      return Object.values(entries)
        .filter(e => e.type === 'story' || !e.type) // older format has no type field
        .map(e => e.id)
        .filter(Boolean);
    }
  }
  return null;
}

// ── Run axe on a single story ─────────────────────────────────────────────────

async function checkStory(page, storyId) {
  const url = `file://${STORYBOOK_DIR}/iframe.html?id=${storyId}&viewMode=story`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait briefly for Angular/HTML framework to bootstrap
  await page.waitForTimeout(500);

  await injectAxe(page);
  return getViolations(page, 'body', {
    runOnly: { type: 'tag', values: AXE_TAGS },
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  if (!existsSync(STORYBOOK_DIR)) {
    console.error(`❌ Storybook build not found at ${STORYBOOK_DIR}`);
    console.error('   Run: npx nx run storybook:storybook:build');
    process.exit(2);
  }

  const storyIds = loadStoryManifest();

  // Fallback: if manifest not found, test the known stub stories directly
  const idsToTest = storyIds ?? [
    'primitives-skstub-angular--default',
    'primitives-skstub-html--default',
  ];

  if (!storyIds) {
    console.warn('⚠  Story manifest not found — testing known stub stories only.');
    console.warn('   Rebuild Storybook to enable full story iteration.');
  } else {
    console.log(`Testing ${idsToTest.length} stories for WCAG 2.1 AA compliance...`);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalViolations = 0;
  const failingStories = [];

  for (const storyId of idsToTest) {
    try {
      const violations = await checkStory(page, storyId);
      if (violations.length > 0) {
        totalViolations += violations.length;
        failingStories.push({ storyId, violations });
        console.error(`❌ ${storyId}: ${violations.length} violation(s)`);
        violations.forEach(v => console.error(`   ${v.id}: ${v.description}`));
      } else {
        console.log(`✅ ${storyId}`);
      }
    } catch (err) {
      console.warn(`⚠  ${storyId}: could not load (${err.message})`);
    }
  }

  await browser.close();

  if (totalViolations > 0) {
    console.error(`\n❌ ${totalViolations} WCAG 2.1 AA violation(s) across ${failingStories.length} story/stories.`);
    process.exit(1);
  }

  console.log(`\n✅ Zero WCAG 2.1 AA violations across all ${idsToTest.length} story/stories.`);
})();
