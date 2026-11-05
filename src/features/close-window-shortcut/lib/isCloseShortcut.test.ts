import { describe, expect, it } from "vitest";
import { isCloseShortcut } from "./isCloseShortcut";

const key = (k: Partial<KeyboardEvent>) => ({ key: "", code: "", altKey: false, ctrlKey: false, metaKey: false, ...k });

describe("isCloseShortcut", () => {
  it("Esc, ⌥W, Ctrl+W, ⌘W는 창 닫기", () => {
    expect(isCloseShortcut(key({ key: "Escape" }))).toBe(true);
    // ⌥W는 맥에서 key가 "∑"로 오므로 code로 판단한다
    expect(isCloseShortcut(key({ key: "∑", code: "KeyW", altKey: true }))).toBe(true);
    expect(isCloseShortcut(key({ key: "w", code: "KeyW", ctrlKey: true }))).toBe(true);
    expect(isCloseShortcut(key({ key: "w", code: "KeyW", metaKey: true }))).toBe(true);
  });

  it("그냥 W는 무시", () => {
    expect(isCloseShortcut(key({ key: "w", code: "KeyW" }))).toBe(false);
  });
});
