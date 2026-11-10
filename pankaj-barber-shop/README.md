# Pankaj Barber Shop — Website

A single-page, professional website for **Pankaj Barber Shop**, Mumtaz Area, Ruwi, Muscat, Oman.

Static HTML/CSS/JS — no build step, no dependencies. Open `index.html` or drop the folder on any host.

```
pankaj-barber-shop/
├── index.html          # page + SEO structured data
├── css/styles.css      # all styling
├── js/main.js          # opening-hours badge, nav, scroll effects
└── img/                # emblem + favicon (SVG)
```

---

## Preview locally

```powershell
cd "pankaj-barber-shop"
python -m http.server 8777
# then open http://127.0.0.1:8777
```

(Opening `index.html` directly also works.)

---

## Business data used on the site

All of this was taken from the shop's public Google listing:

| Item | Value |
|---|---|
| Name | Pankaj Barber Shop |
| Address | Building #1407, Way 3318, Block 133, Mumtaz Area, Ruwi — behind Hotel Al Burj, Muscat, Oman |
| Plus code | `JG3M+2R` Muscat |
| Coordinates | `23.6025773, 58.5345923` |
| Opening hours | **Every day** 8:30 AM – 1:00 PM and 4:00 PM – 11:00 PM (closed 1–4 PM) |
| Mobile number | +968 7981 2438 |
| Google rating | 4.5 ★ from 4 reviews |
| Google Maps link | <https://maps.app.goo.gl/YVuALALM1w35sD3P8> |

---

## Editing the site

### Opening hours / status badge

Everything lives in the `SITE` object at the top of `js/main.js`:

```js
const SITE = {
  timeZone: 'Asia/Muscat',
  sessions: [
    { open: 8 * 60 + 30, close: 13 * 60 },   // 8:30 AM – 1:00 PM
    { open: 16 * 60,     close: 23 * 60 }    // 4:00 PM – 11:00 PM
  ],
  mapUrl: '...'
};
```

Times are minutes from midnight. The badge always shows **Muscat time** (`Asia/Muscat`,
UTC+4) no matter where the visitor is browsing from, so it stays correct for
international travellers. It re-checks every minute.

If you change the hours, also update the rows in `#hoursTable` in `index.html` and the
`openingHoursSpecification` block in the JSON-LD so search engines agree.

### Google Maps

Two places in `index.html`:

- **"Get directions" / "Open in Google Maps" buttons** → `https://maps.app.goo.gl/YVuALALM1w35sD3P8`
- **Embedded map iframe** → `https://www.google.com/maps?q=23.6025773%2C58.5345923&z=17&output=embed`

To swap in a new embed, open the place on Google Maps → *Share* → *Embed a map* → paste
the `src`. To update the buttons, replace the short link everywhere (search for
`maps.app.goo.gl`).

### Mobile number

Shown in the **Contact** card in the "Visit us" section, in the footer, and as
`telephone` in the JSON-LD. The number appears in three places in `index.html`:

- `<a href="tel:+96879812438">+968 7981 2438</a>` — the Contact card
- `<a href="tel:+96879812438">+968 7981 2438</a>` — the footer
- `"telephone": "+96879812438",` — the JSON-LD block

To change it, search for `7981` and replace all three. Keep the `tel:` form without
spaces or `+` (`tel:+96879812438`) so it dials correctly on mobile.

### Services

The four service cards are in the `#services` section of `index.html` — Haircut,
Beard trim & shape, Kids' haircut, Styling & finish. **Prices are deliberately not
listed** — none were available from the listing. If you want a price list, add it to
each card.

### Leftover files

The "Inside the shop" gallery was removed from the site. The six original
`img/gallery-*.svg` line-art files are still on disk but are no longer referenced —
delete them if you don't plan to bring a gallery back.

### Social share image

`og:image` is commented out in `<head>` because there is no PNG/JPG yet. Create a
**1200 × 630** image, save it as `img/og.png`, then uncomment the meta tag.

---

## What's built in

- **Live "Open now / Closed" badge** driven by the real hours, in Muscat time
- **Sticky header** that gains a blurred background on scroll
- **Mobile menu** with animated burger, closes on link click or `Escape`
- **Scroll-reveal animations** with a gentle stagger; fully disabled under
  `prefers-reduced-motion`
- **Active-section highlighting** in the nav
- **Back-to-top button**, appears after scrolling
- **Today's row highlighted** in the opening-hours table
- **SEO**: `<title>`, meta description, Open Graph/Twitter tags, and
  `BarberShop` **JSON-LD structured data** (address, geo, opening hours, rating)
- **Accessibility**: skip link, visible focus rings, semantic landmarks, `alt` text on
  every image, `aria` labels on controls
- Responsive from 320 px up; no horizontal overflow; print stylesheet included

## Checks already run

- HTML: well-formed, no unclosed/mismatched tags, no duplicate `id`s, every `#anchor`
  resolves, every image has `alt`
- CSS: braces/parentheses balanced, no malformed declarations, all `@keyframes` referenced
- All SVGs parse as valid XML
- JSON-LD parses; hours and coordinates correct
- All local assets return HTTP 200 with the right content type
- Loaded in a browser: **zero console errors**, fonts load, live badge and
  "today" highlight both working
