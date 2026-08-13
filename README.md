# aparnaramesh-mem.github.io

Personal site for **Aparna Ramesh** — Technical Project Manager, five years in telecom and
automotive software delivery, currently M.S. Engineering Management at Syracuse University.

Plain HTML, CSS and vanilla JavaScript. **No build step, no npm, no CI.** Edit a file, push,
and GitHub Pages serves it.

---

## Publishing it (one-time)

The site is built and committed locally but has never been pushed. The remote is already
configured. To go live:

1. **Create a new public repository** on the `aparnaramesh-mem` account, named exactly
   **`aparnaramesh-mem.github.io`**. The name has to match the username — a GitHub Pages user
   site is only served from `<username>.github.io`. Don't add a README, .gitignore or licence;
   this folder already has commits.
2. **Push** from this folder:

```bash
git push -u origin main
```

   Git will prompt for credentials. On Windows, Git Credential Manager opens a browser sign-in —
   that's the cleanest route and needs no token. If it asks for a username and password instead,
   the "password" is a personal access token with `repo` scope, entered at that prompt.

3. **Turn Pages on**: repo **Settings ▸ Pages ▸ Build and deployment**, set Source to
   *Deploy from a branch*, branch `main`, folder `/ (root)`, then Save.
4. Wait a minute or two. The site is live at **https://aparnaramesh-mem.github.io/**

After that, every `git push` republishes.

> **If the account is ever renamed to `aparnaramesh`** (the username was free as of Aug 2026),
> the site URL changes with it. Rename the repo to match, then update the five absolute URLs in
> `index.html` — the canonical tag, `og:url`, `og:image`, `twitter:image`, and the JSON-LD
> `url` — plus the links in this file.

> The commits are authored as `Aparna Ramesh <contact.aparnaramesh@gmail.com>` via a repo-local
> git config, so the history isn't attributed to whoever's machine built it.

---

## Editing the content

Everything is in [`index.html`](index.html) — there's no CMS and no data file. Each section is
marked with a comment banner (`<!-- ===== EXPERIENCE ===== -->`) so it's easy to find what you
want. Some common edits:

| Change | Where |
|---|---|
| Job title / tagline | `.hero-eyebrow`, `.hero-tagline` in the HERO section |
| Roles being targeted | `.hero-badge-tag` list, and the CONTACT paragraph |
| Availability line | `.hero-badge-timeline` |
| Add a job | copy an `<article class="exp-card glass-card">` block |
| Add a skill | copy a `<span class="skill-tag">` into the right group |
| Add an award | copy an `<div class="award-card glass-card">` block |
| Email address | search for `contact.aparnaramesh@gmail.com` (appears 5×) |

If you take the availability badge down when the search ends, delete the whole
`<div class="hero-badge-wrap">` block — nothing else depends on it.

### Replacing the resume PDF

Overwrite `assets/Aparna_Ramesh_Resume.pdf` with the new file, keeping the same filename. Both
the nav button, the hero link, the contact row and `/resume/` point at that path.

---

## Photos

Two are used, both processed from the originals in `../pics/`:

| Slot | Source file | Why |
|---|---|---|
| About portrait | `IMG-20260626-WA0020.jpg` | The only shot with direct eye contact and a clean read — and the orange top happens to sit almost exactly on Syracuse Orange `#F76900`, so it needs no colour grading. |
| Contact band | `eb0b3639-…JPG` | Natively wide, subject centred, muted grey-green tones that let the orange accents stay the loudest thing on the page. |

Considered and not used:

- `IMG-20260626-WA0021.jpg` — ivy door, looking away. The most editorial of the set and the
  runner-up for the About slot; it loses only because eye contact matters more in the one photo
  that introduces her.
- `IMG-20251230-WA0026/27.jpg` — MIT Great Dome. Good photo, but a recognisable MIT landmark on
  a page that says "Syracuse University" invites the wrong conclusion about where she studies.
- `IMG-20260222-WA0000.jpg` — aviary. Wire mesh and a service door read as a zoo snapshot.
- `IMG-20251231-WA0063/0075.jpg` — Bunker Hill. Highest resolution available (2252×4000), but
  she's small in a very tall frame; any crop big enough to see her throws away the monument.

### Swapping a photo

Edit the relevant entry in [`tools/build-images.py`](tools/build-images.py) — change `source`
and, if needed, the `crop` box — then:

```bash
python tools/build-images.py
```

That regenerates the WebP + JPEG derivatives at both sizes, strips all metadata, and rebuilds
`favicon.ico`. It needs only Pillow (`pip install Pillow`). The `<picture>` markup in
`index.html` doesn't change unless you rename the outputs.

---

## Running it locally

No build. Either open `index.html` directly, or — better, because it makes `/resume/` work —
serve the folder:

```bash
python -m http.server 4173
```

Then visit http://127.0.0.1:4173/

---

## Layout

```
index.html            # the whole page
css/
  variables.css       # design tokens, dark + light
  base.css            # reset, typography, .glass-card
  background.css      # gradient orbs + grid
  navbar.css  hero.css  blocks.css  photos.css  footer.css
  responsive.css      # 1024 / 900 / 640 / 380 breakpoints
js/main.js            # theme, nav, scroll-spy, reveals, badge
assets/               # photos, resume PDF, favicon.svg
tools/build-images.py # regenerates the image derivatives
resume/index.html     # /resume → redirects to the PDF
```

## Notes on how it's built

- **Theme** follows the OS by default, remembers a manual choice in `localStorage`, and is
  applied by a tiny inline script in `<head>` so the page never flashes the wrong one.
- **Contrast** was measured, not eyeballed: every distinct text style clears WCAG AA in both
  themes. Filled buttons use `--accent-fill` (`#BF5100`) rather than Syracuse Orange, because
  white on `#F76900` is only 3.0:1. The true orange is still used for every accent and label.
- **No third-party requests** except Google Fonts. Icons are inline SVG and company marks are
  CSS monograms, so nothing breaks on a locked-down corporate network.
- **Motion** (orb drift, scroll reveals, smooth scrolling) is disabled under
  `prefers-reduced-motion`.
- **Not on the page, deliberately:** phone number, street address, and visa/work-authorisation
  status. All three are on the resume or the application forms where they belong; none of them
  belong on a page search engines index.

---

© 2026 Aparna Ramesh
