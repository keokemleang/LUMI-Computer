import { describe, test, expect } from "bun:test";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  test("lowercases and hyphenates", () => {
    expect(slugify("AMD Ryzen 7 7800X3D")).toBe("amd-ryzen-7-7800x3d");
  });

  test("strips punctuation and collapses repeated separators", () => {
    expect(slugify("Corsair RM850x -- 850W (80+ Gold)!!")).toBe("corsair-rm850x-850w-80-gold");
  });

  test("trims leading/trailing hyphens", () => {
    expect(slugify("  --Weird Name--  ")).toBe("weird-name");
  });
});
