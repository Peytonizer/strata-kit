# strata-kit

The shared identity for the strata family of sites — the palette and type they have in common,
and the slim navigation bar that links them to each other.

Consumed by [strata](https://strata.noradz.io), [lodger](https://lodger.noradz.io) and
[former](https://former.noradz.io) as a git submodule at `vendor/strata-kit`.

## What's in it

| File | What it is |
| --- | --- |
| `theme.css` | The macaron palette — tokens for both themes — plus the family bar's styling and `.visually-hidden`. No page layout: each site owns its own shell. |
| `projects.json` | The manifest. One entry per site in the family; the single source of truth for both the nav bar and the hub's cards. |
| `nav.html` | Generated from `projects.json` by `build.mjs`, and committed. |
| `build.mjs` | Regenerates `nav.html`. No dependencies. |
| `vite-plugin.mjs` | Inlines `nav.html` into a Vite site's `index.html` at build time. |
| `theme-toggle.js` | A standalone light/dark toggle for sites without a bundler. lodger and former have their own and don't use this. |

## Why the nav is generated but committed

The sites that consume it are a Vite build and a Python build. Giving each its own renderer
would mean two implementations of one piece of markup, drifting apart. So the markup is
rendered once, here, and consumers do nothing cleverer than read the file and mark the current
link.

## Why everything is build-time

lodger and former ship a Content-Security-Policy with no `connect-src` — the browser refuses to
make an outbound request at all, which is what makes "nothing leaves your browser" verifiable
rather than a promise. A shared stylesheet served from another subdomain, a webfont from a CDN,
or a nav that fetched its own markup would each break that. Everything in this kit is inlined
or bundled at build time. Navigation between the sites is fine: a CSP restricts what the page
fetches, not where a link goes.

## Using it in a site

```sh
git submodule add https://github.com/Peytonizer/strata-kit.git vendor/strata-kit
```

**A Vite site** — import the tokens at the top of the site's own stylesheet, and add the plugin:

```css
@import '../../vendor/strata-kit/theme.css';
```

```js
import { kitNav } from './vendor/strata-kit/vite-plugin.mjs';
export default defineConfig({ plugins: [kitNav({ current: 'lodger' })] });
```

GitHub Actions checks out submodules only when asked, so the workflow needs:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: true
```

**A static site** — copy `theme.css` into the published tree at build time and read `nav.html`,
replacing `data-kit-id="<id>"` with `data-kit-id="<id>" aria-current="page"` for the current
site. See `scripts/build.py` in the strata repo for the ten lines that do it.

## Adding a project to the family

1. Add an entry to `projects.json`. Every field is required: `id`, `name`, `url`, `summary`
   (one line, for the hub card's heading), `blurb` (a paragraph, for the card body), `status`,
   `nav` and `hub` (booleans — whether it appears in the bar and on the hub).
2. `node build.mjs` and commit both files.
3. In each consuming repo: `git submodule update --remote vendor/strata-kit`, rebuild, commit.

Step 3 is the pin moving deliberately rather than a site picking up a change it didn't ask for.
`node build.mjs --check` fails if `nav.html` is behind `projects.json`.

## Licence

MIT.
