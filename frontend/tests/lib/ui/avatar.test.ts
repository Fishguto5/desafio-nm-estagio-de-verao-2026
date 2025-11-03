import { describe, it, expect } from "vitest";
import { getInitials } from "@/lib/ui/avatar";

describe("getInitials", () => {
  it("returns first letters uppercased for two words", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("returns single initial when only one word is provided", () => {
    expect(getInitials("unicamp")).toBe("U");
  });

  it("limits to two characters even for multiple words", () => {
    expect(getInitials("maria fernanda silva")).toBe("MF");
  });

  it("handles casing by converting to uppercase", () => {
    expect(getInitials("JoSe")).toBe("J");
  });
});
