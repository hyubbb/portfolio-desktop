import { describe, expect, it } from "vitest";
import { applyLayout, createFolder, deleteFolder, EMPTY_LAYOUT, moveItem, normalizeLayout, renameFolder } from "./layout";
import type { DesktopItem } from "./types";

const size = { width: 100, height: 100 };
const base: DesktopItem[] = [
  { id: "about", kind: "readme", name: "README", title: "README", size },
  { id: "work", kind: "folder", name: { ko: "업무", ja: "業務" }, title: "work", size },
  { id: "fastlane", parent: "work", kind: "page", src: "/f.html", name: "fastlane", title: "f", size },
];
const parentOf = (items: DesktopItem[], id: string) => items.find((i) => i.id === id)?.parent ?? null;

describe("desktop layout", () => {
  it("레이아웃이 비어 있으면 코드의 기본 구성을 그대로 쓴다", () => {
    const items = applyLayout(base, EMPTY_LAYOUT);
    expect(parentOf(items, "fastlane")).toBe("work");
    expect(parentOf(items, "about")).toBeNull();
  });

  it("항목을 폴더에서 꺼내고 다른 폴더에 넣을 수 있다", () => {
    let layout = moveItem(EMPTY_LAYOUT, "fastlane", null);
    expect(parentOf(applyLayout(base, layout), "fastlane")).toBeNull();
    const created = createFolder(layout, { ko: "새 폴더", ja: "新規フォルダ" }, "f1");
    layout = moveItem(created.layout, "about", "f1");
    const items = applyLayout(base, layout);
    expect(items.some((i) => i.id === "f1" && i.kind === "folder")).toBe(true);
    expect(parentOf(items, "about")).toBe("f1");
  });

  it("폴더를 지우면 안의 항목은 바탕화면으로 나온다 (기본 폴더도)", () => {
    const layout = deleteFolder(EMPTY_LAYOUT, applyLayout(base, EMPTY_LAYOUT), "work");
    const items = applyLayout(base, layout);
    expect(items.some((i) => i.id === "work")).toBe(false);
    expect(parentOf(items, "fastlane")).toBeNull();
  });

  it("기본 폴더와 직접 만든 폴더 모두 이름을 바꿀 수 있다", () => {
    const { layout } = createFolder(EMPTY_LAYOUT, { ko: "a", ja: "a" }, "f1");
    const next = renameFolder(renameFolder(layout, "work", { ko: "업무 개선", ja: "業務改善" }), "f1", { ko: "b", ja: "b" });
    const items = applyLayout(base, next);
    expect(items.find((i) => i.id === "work")?.name).toEqual({ ko: "업무 개선", ja: "業務改善" });
    expect(items.find((i) => i.id === "f1")?.name).toEqual({ ko: "b", ja: "b" });
  });

  it("없는 폴더를 가리키는 저장값이나 깨진 값은 안전하게 무시한다", () => {
    const items = applyLayout(base, normalizeLayout({ parents: { about: "ghost" }, folders: "oops" }));
    expect(parentOf(items, "about")).toBeNull();
    expect(normalizeLayout(null)).toEqual(EMPTY_LAYOUT);
  });
});
