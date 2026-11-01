# Interactive guide and facilitation app

The app helps humanitarian analysts learn anticipatory analysis, develop a briefing and facilitate a workshop. Its homepage introduces these three jobs, with direct routes into each. A purpose-first link helps new visitors start learning. Existing analytical notes enable a continue action. The fictional Luma case is optional learning material within the method, rather than the subject of the homepage.

## Visual system

Keep white #FFFFFF, deep blue #172D43, cobalt #2862B3, pale blue-grey #EEF3F8, ochre #C79522 and plum #875A7E. Colour has a written label where it carries analytical meaning. Commissioner carries headings and controls; Literata carries sustained reading. Both families are hosted locally.

The homepage uses a clear introduction and three open task rows. Lessons use a comfortable reading measure and contextual notes; worksheets have compact headings and prominent inputs. Avoid decorative hero maps, repetitive boxed cards, tiny uppercase labels and automatic entrance motion.

```text
Home                    An interactive guide to anticipatory analysis
Learn the method        Start here: why anticipation matters
Your working session    Learn the method       → Complete lesson index
Facilitate a workshop   Your working session   → Brief and worksheets
                        Facilitate a workshop  → Agenda and presentation
```

## Information architecture

The four main destinations are Home, Learn the method, Your working session and Facilitate a workshop. The source guide is a persistent reference link.

Learn includes every lesson, grouped as Before you begin (decision and audience), The five-stage method (scan, prioritise, narrative, write, review), Facilitation and collaboration (collaboration, AI, care), and Communicate and continue (communication, networks, follow-through). The complete index shows all twelve lessons. The contextual sidebar expands the current group and preserves deliberate expansion choices. Groups opened automatically do not accumulate as the reader advances.

Working sessions contain the session brief, five worksheets, downloads and print preview. The final checklist lives at the end of the Challenge and refine worksheet, under Before you share the briefing. Final checklist links in navigation, search and the session overview jump to that section; the companion preview shows only the reviewed count. The canonical shortcut is #tool/review/checklist, and existing #checklist bookmarks redirect there. Facilitation contains workshop planning, agenda editing and presentation mode. Facilitation and communication resources link back to their canonical lesson pages in Learn.

One navigation model owns grouping, route ownership, reading order, breadcrumbs and search entries. Breadcrumbs show real ancestors without a repeated product or Home prefix. Lessons have an All lessons link and explicit previous/next labels, including group transitions. Stage views are labelled Lesson, Worked example and Your worksheet.

Existing hashes remain valid. The former audience lesson opens the combined decision and audience lesson; saved completion of either original lesson counts once toward reading progress. New group and utility hashes focus and scroll to their intended section. Search includes lessons, worksheets, examples, facilitation, checklist and source content with section paths; empty search offers common destinations. Mobile uses the same hierarchy in a drawer and retains a clickable parent and readable current page in the header.

## Compatibility

No session schema, storage key or server API changes are needed for navigation. Reading progress, notes, agenda settings, imports and exports keep their existing behaviour. The fictional case stays separate from saved working sessions, and no risk scores or forecasts are generated.

## Worksheet companion

Each of the five worksheets has a companion with **Your preview** and **Luma example** tabs. At 1280px and above it occupies a sticky, independently scrolling 360–420px column; hiding it expands the editor. At narrower widths the same panel moves into a full-screen dialog, reached through Preview and Example controls. Closing returns to the invoking control and page position. Forms stay mounted throughout panel interactions. Per-stage tab, visibility, active trend, scroll and disclosure preferences live only for the current visit.

The previews are derived from existing session fields: the active trend card, a qualitative matrix with unplaced trends and a watch list, a proposed causal pathway, the current briefing, and that briefing with review notes and checklist status. Briefing drafts outside the shortlist remain visibly separate. Empty fields remain empty; previews neither generate analysis nor score its quality. Edit links expand and focus the original field, including navigation from review back to writing. Keyed presentation updates preserve caret position and open assumptions.

The Prioritise preview supports direct placement. Select a trend through the dropdown, its preview button or a worksheet field, then click a matrix cell to assign both likelihood and impact. Trend buttons in the matrix and Not yet placed list also support dragging with mouse, touch or pen. Cell buttons provide keyboard placement with Enter or Space. Placement saves the existing category fields and synchronises the worksheet selects without remounting the editor. Dragging highlights its destination and scrolls the preview at its visible edges; Escape or a drop outside the matrix cancels it. Closing, switching tabs or changing responsive layout also cancels a drag. Selection and drag state remain transient.

Example controls beside writing fields open relevant excerpts from the existing fictional case with a short explanation of the reasoning. The panel heading keeps the fictional label visible even while scrolling. Examples do not populate fields or enter backups and exports. The original full worked-example routes remain available.

## Connected visual thread

The five stage glyphs share a node-and-line vocabulary: scattered observations, selected clusters, a connected pathway, a structured briefing, then an annotated briefing. The sequence appears in the homepage process, the five-stage lesson overview and compact stage headers. Stage names and numbers carry the meaning; the SVGs are decorative and hidden from assistive technology. Current-stage navigation indicates location, never completion or quality. Preserve the existing palette and local fonts, with ochre for assumptions and plum for interpretations where these are explicitly labelled. There is no automatic entrance animation.
