import { describe, expect, it } from "vitest";
import { clampPosition, placeWindow } from "./placement";

describe("placeWindow", () => {
  it("작은 창은 메뉴 막대와 독 사이 영역의 가운데에 놓는다", () => {
    const rect = placeWindow({ width: 400, height: 300 }, { width: 1200, height: 800 });
    expect(rect.x).toBe(400);
    expect(rect.width).toBe(400);
    expect(rect.y).toBe(36 + Math.round((800 - 84 - 8 - 36 - 300) / 2));
  });

  it("화면보다 큰 창은 메뉴 막대 아래부터 독 위까지만 차지한다", () => {
    const rect = placeWindow({ width: 1180, height: 1100 }, { width: 1280, height: 800 });
    expect(rect.y).toBe(28 + 8);
    expect(rect.y + rect.height).toBe(800 - 84 - 8);
  });

  it("아주 큰 화면에서도 창 아래쪽이 독에 가려지지 않는다", () => {
    const viewport = { width: 1966, height: 1982 };
    for (const offset of [0, 26, 52, 78]) {
      const rect = placeWindow({ width: 1180, height: 2400 }, viewport, offset);
      expect(rect.y + rect.height).toBeLessThanOrEqual(1982 - 84);
    }
  });
});

describe("clampPosition", () => {
  it("창을 화면 밖으로 끝까지 밀어도 일부는 남긴다", () => {
    const rect = clampPosition({ x: 5000, y: -300, width: 400, height: 300 }, { width: 1200, height: 800 });
    expect(rect.x).toBe(1200 - 80);
    expect(rect.y).toBe(28);
  });
});
