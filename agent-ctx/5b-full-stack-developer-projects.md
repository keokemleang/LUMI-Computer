# Task 5b — full-stack-developer (projects)

View previous agents' work records in `/home/z/my-project/worklog.md`
(this directory is shared context for all subagents).

## Scope
Build the `/projects` listing page and the `/projects/[slug]` detail page
for **KBSCircuit**, a Next.js 16 (App Router) + TypeScript + Tailwind 4 +
shadcn/ui engineering learning platform.

## Files created
- `src/app/projects/page.tsx` — server component, listing page.
- `src/app/projects/projects-view.tsx` — client wrapper (filters + search + grid).
- `src/app/projects/[slug]/page.tsx` — server component, project detail page.
- `src/app/projects/[slug]/gallery.tsx` — client component (image gallery).
- `src/app/projects/[slug]/kit-buy.tsx` — client component (Add to Cart for the linked kit).

## Key decisions
- Server components by default; `'use client'` only for `projects-view`,
  `gallery`, and `kit-buy` (interactive pieces co-located next to their page).
- The data helper `getProjectBySlug` returns `kitProductId` which stores the
  product **slug** (e.g. `"smart-home-kit"`), so the detail page calls
  `getProductBySlug(project.kitProductId)` to fetch the kit product.
- Difficulty badge colors: Beginner=`bg-success`, Intermediate=`bg-warning`,
  Advanced=`bg-danger` (semantic tokens only — no hardcoded hex).
- "Related Course" is mapped from the project's category:
  IoT→`esp32-iot-bootcamp`, STM32→`embedded-c-stm32`,
  Sensors/Robotics→`arduino-fundamentals`, Raspberry Pi→`esp32-iot-bootcamp`,
  default→`/courses`.
- Code preview tab uses `<pre>` with `bg-muted p-4 rounded-lg overflow-x-auto
  text-sm font-mono` and a project-titled Arduino-ish snippet.
- Video tutorial embed uses a `aspect-video` container with a YouTube iframe.
- Sticky sidebar (`lg:sticky lg:top-20`) holds the kit card, required
  components checklist, resources list, and related course link.
- Pass only the `Pick<>` subset of `ProjectParsed` (no Date fields) from the
  server listing page to the client `ProjectsView` to keep serialization
  predictable across the RSC boundary.

## Verification
- `bun run lint` — only the pre-existing out-of-scope error remains in
  `src/lib/data.ts` (empty interface re-export). My new files are clean.
- `curl` results:
  - `GET /projects` → 200
  - `GET /projects/smart-home-automation` → 200 (kit present, full sidebar)
  - `GET /projects/weather-station` → 200
  - `GET /projects/raspberry-pi-media-center` → 200 (no pcbFilesUrl/slidesUrl —
    resources list gracefully omits those entries)
  - `GET /projects/stm32-data-logger` → 200 (no kitProductId — renders
    "Buy Components Separately" fallback card)
  - `GET /projects/does-not-exist` → 404 (via `notFound()`)
- No new errors or warnings in `/home/z/my-project/dev.log`.

## Out of scope
- Did not modify foundation files (layout, globals.css, schema, data.ts,
  card components, header/footer).
- Did not add a footer (already handled in root layout).
- Did not write tests.
