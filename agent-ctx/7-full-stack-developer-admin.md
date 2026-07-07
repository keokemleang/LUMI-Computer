# Task 7 — Admin CMS

## Scope
Built `/admin` dashboard with sidebar layout and 10 modules:
- Dashboard, Products, Categories, Projects, Courses, Orders, Customers, Downloads, Blog, Settings

## Files created
- `src/app/admin/layout.tsx` — server shell (`lg:grid-cols-[260px_1fr]`, sticky sidebar, top bar, `p-6` content area).
- `src/app/admin/admin-sidebar.tsx` — client sidebar with brand + 5 nav groups (Overview / Catalog / Sales / Content / System), active link = `bg-primary/10 text-primary font-medium` + left accent.
- `src/app/admin/admin-topbar.tsx` — client top bar with mobile Sheet trigger, search, "View store" link, notifications, admin avatar dropdown.
- `src/app/admin/helpers.tsx` — shared badge maps + formatters (ORDER_STATUS, ROLE, DIFFICULTY, DOWNLOAD_CATEGORY, PUBLISH_STATUS, formatCurrency, formatDate, formatDateTime, StatusPill).
- `src/app/admin/add-button.tsx` — shared client Add button that fires a toast (used by categories/projects/courses/downloads/blog).
- `src/app/admin/row-actions.tsx` — shared client DropdownMenu (View link + Edit toast + Delete confirm toast) used by read-only tables.
- `src/app/admin/quick-actions.tsx` — client quick actions row (router-based) for the dashboard bottom CTA.
- `src/app/admin/revenue-chart.tsx` — client AreaChart (recharts) with 12-month mock revenue using `var(--chart-1)` + ChartContainer/ChartTooltip.
- `src/app/admin/page.tsx` — server dashboard: 8 stat cards with trend chips, revenue chart card, quick actions card, recent orders table, top products list, low stock alerts, bottom quick actions.
- `src/app/admin/products/page.tsx` + `products-view.tsx` + `product-form-dialog.tsx` — server list + client view (search, category Select, Export toast, pagination, row DropdownMenu View/Edit/Delete) + controlled Dialog form with create/edit modes (success toast).
- `src/app/admin/categories/page.tsx` — server table with name/slug/description/product count (db.product.groupBy)/featured badge.
- `src/app/admin/projects/page.tsx` — server table with title/difficulty badge/category/rating/featured + RowActions.
- `src/app/admin/courses/page.tsx` — server table with title/instructor/difficulty/price/lessons/rating + RowActions.
- `src/app/admin/orders/page.tsx` + `orders-view.tsx` — server list + client view (status filter Select, 4 stat tiles, table, View opens a Dialog with order items detail).
- `src/app/admin/customers/page.tsx` — server table with avatar initials/name/email/role badge/joined date + RowActions.
- `src/app/admin/downloads/page.tsx` — server table with title/category badge/file type/size/downloads count + RowActions.
- `src/app/admin/blog/page.tsx` — server table with title/category/author/read time/published status + RowActions (View links to /blog/[slug]).
- `src/app/admin/settings/page.tsx` — client Tabs (General / Payments / Shipping / Notifications) with inputs, Selects, Switches, and Save buttons (fake save + toast).

## Key decisions
- Server components for all list pages; client components only where interactivity is needed (sidebar/topbar, charts, dialogs, settings, filter views).
- Admin shell renders inside the public main (SiteHeader still appears above per task spec). Layout uses `lg:grid-cols-[260px_1fr]` with a sticky desktop sidebar (`lg:sticky lg:top-0`) and a Sheet-based mobile drawer.
- All colors use semantic tokens only (bg-primary/10 text-primary, bg-success/15 text-success, bg-warning/15 text-warning, bg-destructive/15 text-destructive, bg-info/15 text-info, bg-muted, text-muted-foreground, border-border) — no indigo/purple, no hardcoded hex.
- Status/role/difficulty/category badges use shared maps in `helpers.tsx` so the same patterns apply across modules.
- Products page is the only fully interactive CRUD page: search + category filter + pagination + create/edit Dialog form (controlled by parent state) + Delete confirm via toast with action button.
- Orders page adds a 4-tile summary, a status Select filter, and a "View" Dialog showing the items list parsed from the order's JSON items column.
- Settings uses a reusable `useFakeSave` hook + `SaveButton` so each tab has a consistent saving → saved flow with sonner toast.
- recharts AreaChart wrapped in shadcn `ChartContainer`/`ChartTooltipContent` using `var(--chart-1)` for stroke and a gradient fill; mock 12-month data.
- RowActions (View/Edit/Delete) is shared across projects/courses/downloads/blog/customers — Edit/Delete are demo toasts per task spec; View links to the public detail page when applicable.
- Admin search in the top bar fires a demo toast (no real admin search index).
- Did NOT modify any foundation files (root layout, globals.css, schema.prisma, data.ts, card/header/footer components).
- Did NOT add a footer (root layout already has one).
- Did NOT write tests.

## Verification
- `bun run lint` — clean (0 errors, 0 warnings) from all new admin files.
- All 10 admin routes return 200 via curl:
  - /admin, /admin/products, /admin/categories, /admin/projects, /admin/courses, /admin/orders, /admin/customers, /admin/downloads, /admin/blog, /admin/settings
- dev.log shows clean compiles for all admin routes (only the pre-existing `legacyBehavior` deprecation warning from foundation site-header.tsx remains, which is out of scope).

## Issues
- The dev server wasn't running when I started (port 3000 had no listener), so I started it once with `bun run dev` in the background to verify the routes. All admin routes compile cleanly and return 200.
