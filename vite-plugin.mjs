/**
 * The Vite half of the kit: inlines nav.html into a site's index.html at build time.
 *
 * Build time, not run time, and inline, not fetched — lodger and former ship a
 * Content-Security-Policy with no connect-src, so a nav that fetched its own markup or
 * stylesheet would be blocked by the browser and would break the privacy guarantee those
 * sites are built on. The markup arrives as part of the HTML; the styling arrives through
 * theme.css, which each site imports into its own stylesheet and Vite bundles.
 *
 * Usage in vite.config.js:
 *
 *   import { kitNav } from './vendor/strata-kit/vite-plugin.mjs';
 *   export default defineConfig({ plugins: [kitNav({ current: 'lodger' })] });
 *
 * `current` is the project's id in projects.json; the matching link gets aria-current="page".
 * Applied in dev as well as build, so the bar is visible while working on the site.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { readManifest } from './build.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

export function kitNav({ current } = {}) {
  return {
    name: 'strata-kit-nav',
    transformIndexHtml: {
      // Runs before the site's own index transforms so the injected markup is in place for
      // anything downstream that rewrites the document.
      order: 'pre',
      handler(html) {
        const ids = readManifest().projects.map((project) => project.id);
        if (current && !ids.includes(current)) {
          throw new Error(
            `strata-kit: current "${current}" is not in projects.json (have: ${ids.join(', ')})`,
          );
        }

        let nav = readFileSync(join(HERE, 'nav.html'), 'utf8').trimEnd();
        if (current) {
          const marker = `data-kit-id="${current}"`;
          nav = nav.replace(marker, `${marker} aria-current="page"`);
        }

        return html.replace('<body>', `<body>\n${nav}\n`);
      },
    },
  };
}
