# Changelog

## Unreleased

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
