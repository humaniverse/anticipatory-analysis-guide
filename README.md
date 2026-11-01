# Anticipatory analysis field guide

A buildless interactive guide and facilitation app for anticipatory humanitarian analysis. The four main destinations are Home, Learn the method, Your working session and Facilitate a workshop. All twelve lessons are grouped in Learn; five worksheets and downloads sit in the working session. The final checklist appears once, at the end of Challenge and refine; Final checklist links jump directly to that section. An optional fictional Luma case and the complete source text support the guide. The case includes selectable observations, qualitative prioritisation, assumptions attached to causal links, an annotated briefing and a visible revision after review.

## Run locally

Run `node scripts/serve.mjs` from this directory and open the printed local URL. No installation or build step is needed. Production assets are in `dist/`.

## Edit

- `dist/navigation.js`: shared learning groups, route ownership, breadcrumbs, reading order and search entries.
- `dist/atlas.js`: fictional map, evidence explorer, five case exhibits and connected stage illustrations.
- `dist/content.js`: lessons, stage instructions, fictional examples, checklist and default agenda.
- `dist/app.js` and `dist/styles.css`: navigation, interfaces and responsive/print presentation.
- `dist/session.js`: versioned session model, import validation, browser storage and exports.
- `dist/work-preview.js`: pure worksheet previews, edit targets and contextual fictional excerpts.
- `dist/worksheet-companion.js`: responsive preview/example panel, focus management and transient display preferences.
- `dist/interactions.js`: reduced-motion-aware feedback and transient stage reading positions and disclosures.

`dist/full-guide.json` contains the original document body and hyperlinks, excluding Word comments. Regenerate from the source DOCX with `scripts/extract-guide.ps1 -InputDocument <absolute-path>` while this directory is the working directory. Review adaptations if the source changes.

## Data and hosting

One working session is stored in the visitor's browser. JSON backups restore the session; Markdown and print export readable worksheets. Nothing in the toolkit uploads workshop notes, and there is no server, analytics, collaboration service or AI integration. Reading progress, agenda settings, causal assumptions and alternative interpretations are part of the backup. Existing version-one backups remain compatible; the new narrative fields default to empty when absent.

This checkout has no hosting identity attached. The original document is not bundled; its extracted body text is included. Commissioner and Literata are hosted locally in `dist/fonts/`, with their Open Font Licenses. The visual direction is recorded in `DESIGN.md`.

## Verification

Run `npm test` for navigation coverage, route ancestry and focus targets, reading order, search, resume behaviour, session round-trips, export retention, invalid imports, unavailable storage, empty states and source coverage. Browser QA covers form entry, matrix placement, watch lists, shortlisting, briefing, review, search, persistence, downloads/restoration, facilitator timer and responsive layouts.

Preview tests also cover all five stages, partial assessments, retained drafts, assumptions, escaping and model purity. Check companion panels at 1440px, 1280px, 1024px and 390px, including keyboard tabs, dialog focus, Escape, scrolling, contextual examples and Edit links. Panel interactions must preserve form inputs and keep fictional content out of saved work and exports.

In the Prioritise preview, select a trend and click a cell, or drag a placed or unplaced trend into the matrix. Keyboard users can select a trend and activate a cell with Enter or Space. Browser QA should check mouse and touch placement, occupied cells, same-cell drops, cancellation, edge scrolling, selection/focus retention and category persistence after reload.

Fictional examples remain separate from user sessions. Qualitative labels and votes support discussion; the site does not compute risk scores or select priorities automatically.

Stage views remember their scroll position and open sections during the current visit. Explicit checklist links and companion Edit links take precedence over remembered positions. Switching views uses a short content fade; adding a trend settles only its new editor without rebuilding existing inputs. In the narrative example, opening a connection shows its assumption and dated evidence, including coverage limits and the gap between livelihood observations and food-access consequences. Check these interactions with keyboard input and reduced motion, including changing the preference during an effect.
