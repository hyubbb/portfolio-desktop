import { beforeEach, describe, expect, it } from "vitest";
import { selectTopWindowId, useWindowStore } from "./store";

const viewport = { width: 1440, height: 900 };
const size = { width: 600, height: 400 };
const store = () => useWindowStore.getState();

describe("window store", () => {
  beforeEach(() => useWindowStore.setState({ windows: {}, topZ: 0, cascade: 0 }));

  it("새 창은 맨 앞에 열리고, 다음 창은 계단식으로 비켜 열린다", () => {
    store().open("a", size, viewport);
    store().open("b", size, viewport);
    const { a, b } = store().windows;
    expect(selectTopWindowId(store())).toBe("b");
    expect(b!.rect.x - a!.rect.x).toBe(26);
  });

  it("이미 열린 창을 다시 열면 새로 만들지 않고 앞으로 가져온다", () => {
    store().open("a", size, viewport);
    store().open("b", size, viewport);
    store().minimize("a");
    store().open("a", size, viewport);
    expect(Object.keys(store().windows)).toHaveLength(2);
    expect(store().windows.a!.minimized).toBe(false);
    expect(selectTopWindowId(store())).toBe("a");
  });

  it("최소화한 창은 맨 앞 창 계산에서 빠진다", () => {
    store().open("a", size, viewport);
    store().open("b", size, viewport);
    store().minimize("b");
    expect(selectTopWindowId(store())).toBe("a");
    store().minimize("a");
    expect(selectTopWindowId(store())).toBeNull();
  });

  it("확대했다가 다시 누르면 원래 위치로 돌아간다", () => {
    store().open("a", size, viewport);
    const before = store().windows.a!.rect;
    store().toggleMaximize("a", viewport);
    expect(store().windows.a!.rect).toEqual({ x: 0, y: 28, width: 1440, height: 900 - 28 - 84 });
    store().toggleMaximize("a", viewport);
    expect(store().windows.a!.rect).toEqual(before);
  });

  it("닫으면 목록에서 사라진다", () => {
    store().open("a", size, viewport);
    store().close("a");
    expect(store().windows).toEqual({});
  });
});
