# strata-kit

The shared identity for the strata family of sites — the palette and type they have in common
— plus the family navigation bar and project manifest that back the hub.

Consumed by [strata](https://strata.noradz.io), [lodger](https://lodger.noradz.io) and
[former](https://former.noradz.io) as a git submodule at `vendor/strata-kit`. Only the hub
renders the nav bar; lodger and former take the palette and nothing else — see "Who renders
the nav" below.

## What's in it

| File | What it is |
| --- | --- |
| `theme.css` | The macaron palette — tokens for both themes — plus the family bar's styling and `.visually-hidden`. No page layout: each site owns its own shell. |
| `projects.json` | The manifest. One entry per site in the family; the single source of truth for both the nav bar and the hub's cards. |
| `nav.html` | Generated from `projects.json` by `build.mjs`, and committed. Rendered only by the hub. |
| `build.mjs` | Regenerates `nav.html`. No dependencies. |
| `vite-plugin.mjs` | Inlines `nav.html` into a Vite site's `index.html` at build time. Not currently used by any site — see "Who renders the nav" — kept for the day a Vite-built site is the one carrying the bar. |
| `theme-toggle.js` | A standalone light/dark toggle for sites without a bundler. lodger and former have their own and don't use this. |

## Who renders the nav

Only the strata hub shows the family bar. lodger and former briefly carried it too, then
dropped it: every menu change — adding a project, renaming a link — meant moving the submodule
pin and rebuilding *three* repos before it was consistent again, when only one of them needed
to change for the user to see it (the hub is where someone arrives cold; the bar's job is
onward discovery from there). A site imports `theme.css` for the palette regardless; rendering
`nav.html` is opt-in and, for now, exclusive to the hub.

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

**Every site takes the palette.** Import the tokens at the top of the site's own stylesheet:

```css
@import '../../vendor/strata-kit/theme.css';
```

GitHub Actions checks out submodules only when asked, so the workflow needs:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: true
```

**Only the hub also renders the nav.** A new project does not add the bar to its own pages —
see "Who renders the nav" above. If a future hub-like site needs to render it and is a Vite
build, add the plugin:

```js
import { kitNav } from './vendor/strata-kit/vite-plugin.mjs';
export default defineConfig({ plugins: [kitNav({ current: 'strata' })] });
```

A static site instead copies `theme.css` into the published tree at build time and reads
`nav.html`, replacing `data-kit-id="<id>"` with `data-kit-id="<id>" aria-current="page"` for the
current site. `scripts/build.py` in the strata repo is the worked example — the hub uses this
path today.

## Adding a project to the family

1. Add an entry to `projects.json`. Every field is required: `id`, `name`, `url`, `summary`
   (one line, for the hub card's heading), `blurb` (a paragraph, for the card body), `status`,
   `nav` and `hub` (booleans — whether it appears in the bar and on the hub).
2. `node build.mjs` and commit both files.
3. In the hub repo (the only nav renderer): `git submodule update --remote vendor/strata-kit`,
   rebuild, commit.

If the new project itself only takes the palette — the default, per "Who renders the nav" —
it needs no pin move for this change at all; it isn't showing the bar to begin with. Step 3 is
the pin moving deliberately rather than a site picking up a change it didn't ask for.
`node build.mjs --check` fails if `nav.html` is behind `projects.json`.

## Licence

MIT.
