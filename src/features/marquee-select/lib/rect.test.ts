import { describe, expect, it } from "vitest";
import { boxFromPoints, intersects } from "./rect";

describe("marquee rect", () => {
  it("어느 방향으로 끌어도 같은 사각형", () => {
    expect(boxFromPoints(100, 100, 10, 20)).toEqual({ left: 10, top: 20, right: 100, bottom: 100 });
  });

  it("겹치면 선택, 맞닿기만 하면 선택 안 함", () => {
    const icon = { left: 50, top: 50, right: 100, bottom: 100 };
    expect(intersects({ left: 90, top: 90, right: 200, bottom: 200 }, icon)).toBe(true);
    expect(intersects({ left: 100, top: 0, right: 200, bottom: 200 }, icon)).toBe(false);
  });
});
