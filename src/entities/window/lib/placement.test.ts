import { describe, expect, it } from "vitest";
import { clampPosition, placeWindow } from "./placement";

describe("placeWindow", () => {
  it("작은 창은 화면 가운데쯤 놓는다", () => {
    const rect = placeWindow({ width: 400, height: 300 }, { width: 1200, height: 800 });
    expect(rect.x).toBe(400);
    expect(rect.width).toBe(400);
  });

  it("화면보다 큰 창은 화면에 맞춰 줄이고 메뉴 막대 바로 아래에 붙인다", () => {
    const rect = placeWindow({ width: 1180, height: 1100 }, { width: 1280, height: 800 });
    expect(rect.height).toBe(800 - 28 - 8 - 12);
    expect(rect.y).toBe(28 + 8);
  });
});

describe("clampPosition", () => {
  it("창을 화면 밖으로 끝까지 밀어도 일부는 남긴다", () => {
    const rect = clampPosition({ x: 5000, y: -300, width: 400, height: 300 }, { width: 1200, height: 800 });
    expect(rect.x).toBe(1200 - 80);
    expect(rect.y).toBe(28);
  });
});
