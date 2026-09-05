/**
 * Regenerates nav.html from projects.json.
 *
 * projects.json is the single source of truth for the family: adding a strata project means
 * adding an entry here and rebuilding, and every site picks the new link up on its next build.
 *
 * nav.html is generated but committed, deliberately. The consuming sites are a Vite build and
 * a Python build; giving each of them its own renderer would mean two implementations of one
 * piece of markup, drifting apart. Instead the markup is rendered once, here, and consumers do
 * nothing cleverer than read the file and mark the current link.
 *
 *   node build.mjs          write nav.html
 *   node build.mjs --check  exit non-zero if nav.html is out of date (for CI)
 *
 * No dependencies, by design — this has to run anywhere with a Node binary.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Attribute- and text-safe. The manifest is hand-written, but blurbs contain apostrophes. */
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const REQUIRED_PROJECT_FIELDS = ['id', 'name', 'url', 'summary', 'blurb', 'status', 'nav', 'hub'];

export function readManifest() {
  const manifest = JSON.parse(readFileSync(join(HERE, 'projects.json'), 'utf8'));
  const seen = new Set();
  for (const project of manifest.projects) {
    for (const field of REQUIRED_PROJECT_FIELDS) {
      if (!(field in project)) {
        throw new Error(`projects.json: entry "${project.id ?? '?'}" is missing "${field}"`);
      }
    }
    if (seen.has(project.id)) throw new Error(`projects.json: duplicate id "${project.id}"`);
    seen.add(project.id);
  }
  return manifest;
}

export function renderNav(manifest) {
  const { family, projects } = manifest;
  const links = projects
    .filter((project) => project.nav)
    .map(
      (project) =>
        `    <li><a data-kit-id="${esc(project.id)}" href="${esc(project.url)}">${esc(project.name)}</a></li>`,
    )
    .join('\n');

  // The wordmark's full stop is the family's one piece of ornament, carried over from lodger's
  // and former's own mastheads so the bar reads as the same product line.
  return `<nav class="kit-nav" aria-label="${esc(family.name)} family">
  <a class="kit-nav-home" href="${esc(family.url)}">${esc(family.name)}<span class="dot">.</span></a>
  <ul class="kit-nav-links">
${links}
  </ul>
</nav>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = join(HERE, 'nav.html');
  const rendered = renderNav(readManifest());
  if (process.argv.includes('--check')) {
    const current = readFileSync(target, 'utf8');
    if (current !== rendered) {
      console.error('nav.html is out of date — run `node build.mjs` and commit the result.');
      process.exit(1);
    }
    console.log('nav.html is up to date.');
  } else {
    writeFileSync(target, rendered);
    console.log(`Wrote ${target}`);
  }
}
