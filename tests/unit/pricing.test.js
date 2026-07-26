import { describe, test, expect } from "bun:test";
import { computeOrderTotals } from "@/lib/pricing";

describe("computeOrderTotals", () => {
  test("charges shipping below the free-shipping threshold", () => {
    const { shipping, total } = computeOrderTotals(20);
    expect(shipping).toBe(5.99);
    expect(total).toBeCloseTo(20 + 5.99 + 20 * 0.08, 5);
  });

  test("waives shipping at/above the free-shipping threshold", () => {
    const { shipping } = computeOrderTotals(50);
    expect(shipping).toBe(0);
  });

  test("waives shipping on an empty cart regardless of threshold", () => {
    const { shipping, tax, total } = computeOrderTotals(0);
    expect(shipping).toBe(0);
    expect(tax).toBe(0);
    expect(total).toBe(0);
  });

  test("respects admin-configured overrides", () => {
    const { shipping } = computeOrderTotals(10, {
      freeShippingThreshold: 5,
      shippingFee: 9.99,
      enableFreeShipping: true
    });
    expect(shipping).toBe(0);
  });

  test("charges the configured flat rate when free shipping is disabled", () => {
    const { shipping } = computeOrderTotals(1000, {
      enableFreeShipping: false,
      shippingFee: 12
    });
    expect(shipping).toBe(12);
  });
});
