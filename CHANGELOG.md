# Changelog

## Unreleased

- Reworded the forecast entry to match the workbook (Overview sheet, buildings).
- Added forecast to the family (live, in the nav and the hub), listed before legislation.

## 1.0.0 — 2026-11-16

- README lists all five consuming sites. noshow and stencil were missing, and both import
  `theme-toggle.js` as well as the palette.
- `theme-toggle.js` shows an icon per theme: give the button children marked
  `data-theme-icon="light"` and `data-theme-icon="dark"` and the one for the current theme is
  shown, in step with the label. Buttons without them behave as before.
- Initial extraction. The macaron palette moves out of lodger's and former's stylesheets, where
  it existed as two hand-synchronised copies, into `theme.css` as the one canonical version.
  `former`'s `--ground` had drifted to `#faf6f0`; the kit uses lodger's `#fbf7f4`, which is the
  value the specification records.
- `projects.json` and the generated `nav.html` add a family bar across the three sites.
- The bar is pulled back to the hub only: lodger and former no longer render it, so a menu
  change (adding a project, renaming a link) means rebuilding just the hub instead of all
  three sites. They still take the palette from `theme.css`. `vite-plugin.mjs` stays in the
  kit, unused for now, for the day a Vite-built site is the one carrying the bar.
- `noshow` joins the family: `id: noshow`, live, listed last. It takes only the palette, the
  same as every sibling — it doesn't render `nav.html` either.
- `stencil` joins the family: `id: stencil`, live, listed after `noshow` so `legislation` stays
  last. It takes only the palette, the same as every sibling.
