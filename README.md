# Aparna Ramesh — personal portfolio

A buildless portfolio for technical project management, software delivery and
quality engineering. Plain HTML, CSS and JavaScript, hosted with GitHub Pages.

## Local preview

From this folder:

    python3 -m http.server 4173 --bind 127.0.0.1

Open http://127.0.0.1:4173/. There is no package installation or build step.

Serving a local preview does not publish changes. GitHub Pages publishes the
repository root from main; pushing that branch triggers the existing Pages build
and deployment workflow. Review local changes before pushing.

## Where to edit

- index.html: introduction, programs, experience, education, skills and contact.
- css/site.css: theme tokens, layout, responsive and print styles.
- js/main.js: mobile navigation, current-section state, theme and email copy.
- assets/Aparna_Ramesh_Resume.pdf: résumé, shared by every résumé link and /resume/.
- assets/fonts/: self-hosted Inter and its SIL Open Font License.
- tools/build-images.py: responsive portrait derivatives and social preview.

The original photography remains in assets/. The professional portrait is an
AI-assisted edit reviewed during the redesign. Its source is
assets/aparna-professional-source.png; no original photo was overwritten.

To regenerate the optimized WebP/JPEG versions and social card:

    python3 -m pip install Pillow
    python3 tools/build-images.py

The source is only resized and encoded by the script; it is not retouched.

## Content decisions

- Preserve formal job titles; distinguish employment dates from program dates.
- Lead with scope: five years, 20+ releases, and 40 engineers coordinated.
- Omit undefined percentage claims until baselines and measurement periods can be
  provided. Do not reinterpret release efficiency as cycle-time reduction.
- Use neutral telecom service wording until the customer segment is confirmed.
- The Syracuse degree is in progress, expected May 2027.
- Search indexing remains intentionally disabled with noindex, nofollow.
  Review that separately if name-search discovery becomes a goal.

## Behavior and accessibility

All sections are visible without JavaScript. Native program disclosures, anchor
links, email links and the résumé work without enhancement. Without JavaScript
the mobile navigation is shown; enhanced navigation collapses only after its
handlers are installed. The theme defaults to light and remembers an explicit
choice in local storage.

JavaScript adds aria-current for section navigation, focuses anchor destinations,
supports Escape/outside-click dismissal for the mobile menu, and offers a copy
email action on secure contexts with clipboard support. There is no analytics,
form submission service or account system.

The site uses local fonts and images; it requires no third-party requests to
render. Print styles remove navigation and show program detail content.
