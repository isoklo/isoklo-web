# isoklo-web

The website for [Isoklo](https://github.com/isoklo/isoklo): *Proof before merge.*

Next.js (App Router), TypeScript, Tailwind CSS and Motion. Paper only: there is no dark theme, by design.

```console
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; every route is static
```

## Real data, never retyped
Every diff, terminal output, finding, exit code and doctor result on the page comes from real runs, stored in
`src/data/demo.json`. To refresh it after Isoklo or the demo repository changes, put local clones of
[isoklo-demo](https://github.com/isoklo/isoklo-demo) and [isoklo](https://github.com/isoklo/isoklo) (built with
`npm run build`) next to this folder, then:

```console
npm run data
```

The script never publishes local folder paths: the demo repository appears as `~/isoklo-demo`.

## Design
- **Colour:** the brand's paper roles (`#F7F6F3` paper, white cards, stone hairlines, Ice accent, brand state colours).
- **Type:** Inter and JetBrains Mono, for this website only. The brand's own type is unchanged.
- **Logo intro:** the "construction" intro draws the symbol over its real geometry, then lifts it into the header. It
  plays in full on the first visit in a tab, as a short redraw on refresh, and not at all with reduced motion. A click,
  key, scroll or touch skips it. It is CSS from the first frame, with a small script for the lift.
- **Motion:** snappy (150–200 ms) everywhere, with three signature moments: the intro, the exhibit "running" each
  check, and calm reveals on scroll.

## Licence
The Isoklo name and logo are not licensed for reuse.
