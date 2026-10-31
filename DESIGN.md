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

Learn includes every lesson, grouped as Before you begin (purpose, audience), The five-stage method (scan, prioritise, narrative, write, review), Facilitation and collaboration (collaboration, AI, care), and Communicate and continue (communication, networks, follow-through). The complete index shows all thirteen lessons. The contextual sidebar expands the current group and preserves deliberate expansion choices. Groups opened automatically do not accumulate as the reader advances.

Working sessions contain the session brief, five worksheets, final checklist, downloads and print preview. Facilitation contains workshop planning, agenda editing and presentation mode. Facilitation and communication resources link back to their canonical lesson pages in Learn.

One navigation model owns grouping, route ownership, reading order, breadcrumbs and search entries. Breadcrumbs show real ancestors without a repeated product or Home prefix. Lessons have an All lessons link and explicit previous/next labels, including group transitions. Stage views are labelled Lesson, Worked example and Your worksheet.

Existing hashes remain valid. New group and utility hashes focus and scroll to their intended section. Search includes lessons, worksheets, examples, facilitation, checklist and source content with section paths; empty search offers common destinations. Mobile uses the same hierarchy in a drawer and retains a clickable parent and readable current page in the header.

## Compatibility

No session schema, storage key or server API changes are needed for navigation. Reading progress, notes, agenda settings, imports and exports keep their existing behaviour. The fictional case stays separate from saved working sessions, and no risk scores or forecasts are generated.
