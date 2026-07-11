# CSS refactor notes

## Files

- `css/style.css`: import entry only; keep `index.html` linked to this file.
- `css/base.css`: global page defaults.
- `css/sections/header.css`: header, logo, and social/contact icons.
- `css/sections/hero.css`: hero layout, branding, buttons, animation, and mobile rules.
- `css/sections/gallery.css`: gallery section and responsive grid.
- `css/sections/price.css`: price cards and price rows.
- `css/sections/booking.css`: booking week controls and slot states.
- `css/style.original.css`: original stylesheet backup for comparison only.

## Formatting rules

- Indentation uses tabs.
- CSS properties remain grouped by purpose with blank lines.
- `#region` / `#endregion` comments support editor folding.
- Existing class names and JavaScript hooks were not renamed.
- Existing CSS values and cascade order were preserved.
