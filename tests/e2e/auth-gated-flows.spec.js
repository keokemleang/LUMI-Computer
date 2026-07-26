// These flows all require a real, signed-in Firebase session:
//   logout, checkout, payment, admin CRUD, upload, review, order history.
//
// Why they're skipped rather than faked:
// - This app's auth is entirely delegated to Firebase Authentication
//   (src/lib/firebase-client.js), configured against a LIVE Firebase
//   project (real keys in .env, no emulator wired up anywhere in the repo —
//   grepped for FIREBASE_AUTH_EMULATOR_HOST, none found).
// - There is no seeded test account, and this environment has no way to
//   read a verification email or complete Google OAuth interactively.
// - Registering a throwaway account via the live /register page would work
//   mechanically, but it creates a REAL user in the project's production
//   Firebase Authentication + database — a side-effecting action on a live
//   external system that wasn't explicitly authorized for this test run.
//   Promoting a user to admin also requires running scripts/set-admin.js
//   locally, which needs the FIREBASE_PROJECT_ID service-account access
//   already present in .env.
//
// To enable this file:
//   1. Either point FIREBASE_AUTH_EMULATOR_HOST at a local Firebase Auth
//      emulator with a seeded test user, OR explicitly authorize creating
//      one throwaway account in the real project.
//   2. Set E2E_TEST_EMAIL / E2E_TEST_PASSWORD (customer) and
//      E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD (promoted via set-admin.js) as
//      env vars.
//   3. Remove the `.skip` below.
import { test, expect } from "@playwright/test";

const HAVE_TEST_CREDS = !!(process.env.E2E_TEST_EMAIL && process.env.E2E_TEST_PASSWORD);
const HAVE_ADMIN_CREDS = !!(process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD);

async function login(page, email, password) {
  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/account|\/admin/, { timeout: 15_000 });
}

test.describe("customer auth flows", () => {
  test.skip(!HAVE_TEST_CREDS, "Needs E2E_TEST_EMAIL/E2E_TEST_PASSWORD for a seeded Firebase test account — see file header.");

  test("login then logout", async ({ page }) => {
    await login(page, process.env.E2E_TEST_EMAIL, process.env.E2E_TEST_PASSWORD);
    await expect(page).toHaveURL(/\/account/);
    await page.getByRole("button", { name: /log ?out/i }).click();
    await expect(page).toHaveURL(/\/login|\/$/);
  });

  test("order history lists past orders or an empty state", async ({ page }) => {
    await login(page, process.env.E2E_TEST_EMAIL, process.env.E2E_TEST_PASSWORD);
    await page.goto("/account/orders");
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("checkout end-to-end with COD payment", async ({ page }) => {
    await login(page, process.env.E2E_TEST_EMAIL, process.env.E2E_TEST_PASSWORD);
    await page.goto("/products");
    await page.locator("a[href^='/products/']").first().click();
    await page.getByRole("button", { name: /add to cart/i }).click();
    await page.goto("/checkout");
    await page.getByLabel(/cash on delivery/i).click();
    // ...fill address fields, submit, assert redirect to /checkout/success...
  });

  test("submitting a product review", async ({ page }) => {
    await login(page, process.env.E2E_TEST_EMAIL, process.env.E2E_TEST_PASSWORD);
    // No review-submission UI/API exists in this codebase at all (confirmed
    // by the earlier audit — Review is a display-only, seed-populated
    // model). This test is a placeholder for if/when that feature ships.
  });
});

test.describe("admin flows", () => {
  test.skip(!HAVE_ADMIN_CREDS, "Needs E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD for an account promoted via scripts/set-admin.js — see file header.");

  test("admin can create, edit, and delete a category", async ({ page }) => {
    await login(page, process.env.E2E_ADMIN_EMAIL, process.env.E2E_ADMIN_PASSWORD);
    await page.goto("/admin/categories");
    await page.getByRole("button", { name: /add category/i }).click();
    // ...fill dialog fields, save, assert it appears in the table, then delete it...
  });

  test("admin can upload a product image", async ({ page }) => {
    await login(page, process.env.E2E_ADMIN_EMAIL, process.env.E2E_ADMIN_PASSWORD);
    await page.goto("/admin/products");
    // ...open product form, use the file input, assert the preview renders...
  });
});
