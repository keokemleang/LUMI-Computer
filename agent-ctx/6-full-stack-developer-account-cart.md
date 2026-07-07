# Task 6 — full-stack-developer (account + cart)

## Summary

Built `/cart` and the `/account` dashboard shell + all sub-routes (orders, courses, downloads, projects, wishlist, addresses, settings) for KBSCircuit.

## Files created

- `src/app/cart/page.tsx` — client cart page (hydration-guarded) with qty stepper, line totals, sticky order summary (subtotal, free-shipping progress, shipping, tax, total), Proceed-to-checkout (toast demo), Clear cart, and trust badges. Empty state with shopping-cart illustration and "Browse products" CTA.
- `src/app/account/layout.tsx` — server account shell. Breadcrumb Home / Account, h1, two-col `lg:grid-cols-[240px_1fr]` with sticky sidebar + content area.
- `src/app/account/account-sidebar.tsx` — client sidebar. Profile card (Avatar initials "SS", "Sam Student", email, Sign out button → toast). Desktop nav with active link highlight via `usePathname`. Mobile: profile row + horizontal-scrollable nav pill row.
- `src/app/account/page.tsx` — server dashboard. Welcome heading, 4 stat cards (Total Orders from `getOrders()`, Active Courses, Downloads count from `getDownloads()`, Wishlist hint), Recent Orders table (last 3) with color-coded status badges, Continue Learning section (2 courses with mock progress bar), Quick links cards (Browse Products / Explore Projects / View Downloads).
- `src/app/account/orders/page.tsx` — server orders list. Full `<Table>` with orderNo, date, items (first item + "+N more" + count), total, status badge, View action. Empty state.
- `src/app/account/courses/page.tsx` — server My Courses. Grid of 4 enrolled courses with thumbnail, difficulty badge, lessons/duration meta, mock progress bar, Continue button.
- `src/app/account/downloads/page.tsx` — server My Downloads. Table of 6 downloads with color-coded category icon, category badge, file type, size, Download anchor.
- `src/app/account/projects/page.tsx` — server My Projects. Grid of 3 projects using `<ProjectCard>` (with Pick<> subset serialization).
- `src/app/account/wishlist/page.tsx` — client wishlist. Hydration-guarded. Grid of items with image, name, price, Add-to-cart (with transient "Added" state + toast), Remove. "Move all to cart" + "Clear all" buttons. Empty state.
- `src/app/account/addresses/page.tsx` — client addresses. Default address card (Sam Student, 123 Maker Lane, Phnom Penh, Cambodia). Add new address button (or dashed card slot) opens Dialog with a real form (name, street, city, zip, country, phone, label toggle). Edit button → toast "Editing coming soon". Set-default / remove on non-default addresses.
- `src/app/account/settings/page.tsx` — client settings. Tabs: Profile (name/email inputs + Save with toast + transient Saved state), Notifications (Switch toggles for Order updates / Newsletter / Course announcements / Price drop alerts with toasts), Security (change password form with client validation + 2FA demo card), Appearance (theme note pointing to header toggle).

## Key decisions

- Server components by default; client only where interactivity required (cart, wishlist, addresses, settings, account-sidebar).
- All persisted-store pages (cart, wishlist) guard against hydration mismatch with a `mounted` flag + skeleton fallback so SSR markup matches the first client render.
- Status badge color mapping: `processing→bg-info`, `shipped→bg-warning`, `delivered→bg-success`, `cancelled→bg-destructive` (semantic tokens only — no indigo/purple, no hardcoded hex).
- Mock course progress is deterministic per-slug via a simple hash → stable 20–94% range across renders.
- Cart summary: free shipping over $50, otherwise $5.99; estimated tax 8%; free-shipping progress nudge shown when below threshold.
- Account sidebar is its own client component (uses `usePathname`) inside an otherwise-server layout. Mobile renders the nav as a horizontal scrollable pill row instead of the sidebar.
- Addresses: Edit button is decorative (toast), but Add-address is a real Dialog form with validation, controlled inputs, and an async-on-save state for nicer UX.
- Settings uses `<Tabs defaultValue="profile">` with icon triggers; notifications Switches are controlled with toast feedback per toggle.
- All links use `next/link` (no `legacyBehavior`); images use `next/image` with proper `sizes`.

## Issues

- Initial `/account/addresses` returned 500 because the `labelIcon` map used object shorthand `{ Home, Work, Other: MapPin }` but the icon I imported from lucide-react was `Briefcase`, not `Work`. Fixed by mapping `Work: Briefcase` explicitly. All 9 routes now return 200.
- Pre-existing `legacyBehavior` deprecation warning remains from foundation `site-header.tsx` (out of scope — not modified).
- `bun run lint` passes cleanly on my files (no new errors or warnings).

## Verification

- `bun run lint` — clean.
- curl all routes → 200: `/cart`, `/account`, `/account/orders`, `/account/courses`, `/account/downloads`, `/account/projects`, `/account/wishlist`, `/account/addresses`, `/account/settings`.
- Dev log shows successful compiles for all 9 routes.
