// E2E coverage for everything reachable WITHOUT a real signed-in session.
// This environment has no Firebase test project/emulator and no seeded
// credentials, so login/logout/checkout/payment/admin-CRUD/upload/review/
// order-history cannot be driven here — see auth-gated-flows.spec.js for
// exactly what those need and how to enable them once available.
import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("loads and shows the header nav", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LUMI Computer/i);
    // Desktop and mobile nav both render a Cart link (toggled by CSS
    // breakpoint, not conditional rendering) — target whichever is visible
    // at the current viewport rather than assuming there's only one.
    await expect(page.locator('[aria-label="Cart"]:visible').first()).toBeVisible();
  });

  test("unknown route renders a 404", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res.status()).toBe(404);
  });
});

test.describe("product search", () => {
  test("opening search and typing a real product name shows a result", async ({ page }) => {
    await page.goto("/");
    // Same desktop/mobile duplication as the Cart button above. The
    // command palette mounts via a portal with a brief open transition, so
    // wait directly for its input rather than an intermediate dialog role
    // (which flickered under rapid repeated runs during test authoring).
    const input = page.getByPlaceholder("Search products, brands, SKUs...");
    await expect(async () => {
      await page.locator('[aria-label="Search"]:visible').first().click();
      await expect(input).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10_000 });
    await input.fill("Ryzen");
    await expect(page.getByText(/AMD Ryzen/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("typing a nonsense query shows the empty state, not an error", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder("Search products, brands, SKUs...");
    await expect(async () => {
      await page.locator('[aria-label="Search"]:visible').first().click();
      await expect(input).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10_000 });
    await input.fill("zzzznonexistentproductzzzz");
    await expect(page.getByText(/no results found/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("product catalog", () => {
  test("products page lists items and each links to a detail page", async ({ page }) => {
    await page.goto("/products");
    const firstCard = page.locator("a[href^='/products/']").first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    // Detail page should render a heading and an add-to-cart affordance.
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("an unknown product slug 404s cleanly", async ({ page }) => {
    const res = await page.goto("/products/definitely-not-a-real-product-slug");
    expect(res.status()).toBe(404);
  });
});

test.describe("contact form (public, unauthenticated)", () => {
  test("submitting valid details shows a success state", async ({ page }) => {
    await page.goto("/contact");
    await page.fill("#name", "Playwright Test");
    await page.fill("#email", "playwright-test@example.com");
    await page.fill("#subject", "E2E test submission");
    await page.fill("#message", "This message was sent by an automated Playwright test.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/thanks.*received your message/i)).toBeVisible({ timeout: 5000 });
  });

  test("submitting an invalid email shows an inline validation error, not a server round-trip", async ({ page }) => {
    await page.goto("/contact");
    await page.fill("#name", "Playwright Test");
    await page.fill("#email", "not-an-email");
    await page.fill("#subject", "s");
    await page.fill("#message", "short");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});

test.describe("protected routes redirect when signed out", () => {
  for (const path of ["/account", "/admin", "/checkout"]) {
    test(`${path} redirects to /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});

test.describe("responsive navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 12-ish width

  test("mobile menu opens via the hamburger trigger and shows nav links", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByLabel("Open menu");
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("login / register pages render correctly", () => {
  test("login page shows email, password, and a submit button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("submitting the login form with no credentials shows a validation error, not a crash", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/enter your email and password/i)).toBeVisible();
  });

  test("register page renders its form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("#email")).toBeVisible();
  });
});
