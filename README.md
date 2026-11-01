# Anticipatory analysis field guide

An interactive guide and facilitation app for anticipatory humanitarian analysis.

The app contains three main sections, alongside a homepage:

- **Learn the method**, containing 12 lessons for conducting and facilitating anticipatory analysis.
- **Your working session:** a place to work on an anticipatory analysis from start to finish (which can be saved and downloaded), as well as a fictional example.
- **Facilitate a workshop**, which gives users everything they need to run a collaborative analytical workshop themselves.

This guide is based on a method developed by Madeleine Lyons and Barbara Devlieger.

## Run locally

Run `node scripts/serve.mjs` from this directory and open the printed local URL. No installation or build step is needed. Production assets are in `dist/`.

## App structure

- `dist/navigation.js`: shared learning groups, route ownership, breadcrumbs, reading order and search entries.
- `dist/atlas.js`: fictional map, evidence explorer, five case exhibits and connected stage illustrations.
- `dist/content.js`: lessons, stage instructions, fictional examples, checklist and default agenda.
- `dist/app.js` and `dist/styles.css`: navigation, interfaces and responsive/print presentation.
- `dist/session.js`: versioned session model, import validation, browser storage and exports.
- `dist/work-preview.js`: pure worksheet previews, edit targets and contextual fictional excerpts.
- `dist/worksheet-companion.js`: responsive preview/example panel, focus management and transient display preferences.
- `dist/interactions.js`: reduced-motion-aware feedback and transient stage reading positions and disclosures.

`dist/full-guide.json` contains the original full guidance for anticipatory analyses. It's based on a Word document I wrote; regenerate it from the source DOCX with `scripts/extract-guide.ps1 -InputDocument <absolute-path>` while this directory is the working directory. The original document is not bundled.

## Data and hosting

This is a buildless app. There is no server, analytics, collaboration service or AI integration.

The site uses relative asset paths and hash-based navigation. Session data is stored per browser origin; changing the site's domain does not transfer existing sessions, so export a JSON backup before moving if needed. One working session is stored in the visitor's browser. Users can export JSON backups and later restore their session, as well as export or print their analyses in Markdown.

Commissioner and Literata font are hosted locally in `dist/fonts/`, with their Open Font Licenses. The visual direction is recorded in `DESIGN.md`.

## Verification

Run `npm test` for navigation coverage, route ancestry and focus targets, reading order, search, resume behaviour, session round-trips, export retention, invalid imports, unavailable storage, empty states and source coverage. Browser QA covers form entry, matrix placement, watch lists, shortlisting, briefing, review, search, persistence, downloads/restoration, facilitator timer and responsive layouts.

Preview tests also cover all five stages, partial assessments, retained drafts, assumptions, escaping and model purity. Check companion panels at 1440px, 1280px, 1024px and 390px, including keyboard tabs, dialog focus, Escape, scrolling, contextual examples and Edit links. Panel interactions must preserve form inputs and keep fictional content out of saved work and exports.

In the Prioritise preview, select a trend and click a cell, or drag a placed or unplaced trend into the matrix. Keyboard users can select a trend and activate a cell with Enter or Space. Browser QA should check mouse and touch placement, occupied cells, same-cell drops, cancellation, edge scrolling, selection/focus retention and category persistence after reload.

Fictional examples remain separate from user sessions. Qualitative labels and votes support discussion; the site does not compute risk scores or select priorities automatically.

Stage views remember their scroll position and open sections during the current visit. Explicit checklist links and companion Edit links take precedence over remembered positions. Switching views uses a short content fade; adding a trend settles only its new editor without rebuilding existing inputs. In the narrative example, opening a connection shows its assumption and dated evidence, including coverage limits and the gap between livelihood observations and food-access consequences. Check these interactions with keyboard input and reduced motion, including changing the preference during an effect.
