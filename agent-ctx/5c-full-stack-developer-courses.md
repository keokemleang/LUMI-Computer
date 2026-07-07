# Task 5c — Courses pages

Agent: full-stack-developer (courses)
Task: Build `/courses` listing + `/courses/[slug]` detail pages for KBSCircuit.

## Files created
- `src/app/courses/page.tsx` — server component; breadcrumb + heading + subtitle + `CoursesView`.
- `src/app/courses/courses-view.tsx` — `'use client'` filter wrapper (difficulty button-group, price button-group, search input, result count, grid, empty state, Clear-filters helper).
- `src/app/courses/[slug]/page.tsx` — server component; `generateMetadata`, `notFound()` on missing slug, two-column hero (thumbnail w/ play overlay, h1, description, badges, rating, instructor avatar) + sticky enrollment card; full-width sections (What you'll learn, Course curriculum accordion, Requirements, Projects included, Components required, Instructor, Student reviews).
- `src/app/courses/[slug]/enroll-button.tsx` — `'use client'` Enroll Now button. Free → toast "Enrolled successfully!" + transient "Enrolled" state. Paid → toast "Proceed to checkout".
- `src/app/courses/[slug]/add-to-cart.tsx` — `'use client'` Add to Cart button (uses `useCart.add`, sonner toast, transient "Added" state).

## Key decisions
- Server components by default; only the filter view + 2 action buttons are `'use client'`.
- Pass a `Pick<CourseParsed, …>` subset (no Date fields) to the client view, matching the projects/products pattern, so RSC serialization is predictable.
- Difficulty button-group reuses the same semantic-color pattern from `projects-view.tsx` (success/warning/danger). Price filter is a separate button-group (All / Free / Paid), active = primary.
- Sticky enrollment card at `lg:sticky lg:top-20` to match prior art.
- Instructor avatar = colored circle (semantic palette: primary/success/warning/danger) with initials derived by stripping titles (Dr./Eng./Prof./Mr./Mrs./Ms.) and taking the last two word initials. Same palette + hash helper reused for review-author avatars.
- Curriculum uses `<Accordion type="single" collapsible>` with one `<AccordionItem>` per lesson, numbered `01..N`, showing lesson title (trigger) and a video/duration row (content).
- "What you'll learn" combines the `overview` field (lead paragraph in a card) + a grid of `projectsIncluded[]` items rendered as "Build a {X} project" check items.
- "Projects included" links each card to `/projects` (since `projectsIncluded[]` stores display titles, not slugs). "Components required" links to `/products`.
- All colors are semantic tokens (`bg-card`, `bg-muted`, `text-primary`, `bg-success`, `bg-warning`, `bg-danger`, `border-border`, etc.). No indigo/purple, no hardcoded hex.
- `next/image` with proper `sizes` everywhere; thumbnail uses `priority`.

## Verification
- `bun run lint` — only the pre-existing out-of-scope error in `src/lib/data.ts` (`AdminProduct` empty interface re-export) remains. All 5 new files pass cleanly.
- curl tests (all expected status codes):
  - `/courses` → 200
  - `/courses/arduino-fundamentals` → 200 (free, featured)
  - `/courses/esp32-iot-bootcamp` → 200 (paid, featured)
  - `/courses/pcb-design-kicad` → 200 (paid)
  - `/courses/embedded-c-stm32` → 200 (paid, Advanced)
  - `/courses/does-not-exist` → 404 via `notFound()`
- `tail -40 dev.log` — no new errors or warnings; routes compiled cleanly (the only warning is the pre-existing `legacyBehavior` deprecation from the products stage).

## Issues
None. Foundation files (layout, globals.css, schema, data.ts, card components, site-header/footer) were not modified. No footer added (handled by root layout). No tests written.
