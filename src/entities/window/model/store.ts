import { create } from "zustand";
import { getViewport, type Viewport } from "@/shared/lib";
import { maximizedRect, placeWindow } from "../lib/placement";
import type { Rect, Size, WindowState } from "./types";

const CASCADE_STEP = 26;
const CASCADE_LOOP = 104;

interface WindowStore {
  windows: Record<string, WindowState>;
  topZ: number;
  cascade: number;
  /** 이미 열려 있으면 앞으로 가져오고, 없으면 새로 연다 */
  open: (id: string, size: Size, viewport?: Viewport) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string, viewport?: Viewport) => void;
  setRect: (id: string, rect: Rect) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  topZ: 0,
  cascade: 0,

  open: (id, size, viewport = getViewport()) => {
    const { windows, topZ, cascade } = get();
    const existing = windows[id];
    const z = topZ + 1;
    if (existing) {
      set({ topZ: z, windows: { ...windows, [id]: { ...existing, minimized: false, z } } });
      return;
    }
    const rect = placeWindow(size, viewport, cascade);
    set({
      topZ: z,
      cascade: (cascade + CASCADE_STEP) % CASCADE_LOOP,
      windows: { ...windows, [id]: { id, z, rect, minimized: false, maximized: false, prevRect: null } },
    });
  },

  close: (id) => {
    const { [id]: _removed, ...rest } = get().windows;
    set({ windows: rest });
  },

  focus: (id) => {
    const { windows, topZ } = get();
    const win = windows[id];
    if (!win || win.z === topZ) return;
    set({ topZ: topZ + 1, windows: { ...windows, [id]: { ...win, z: topZ + 1 } } });
  },

  minimize: (id) => {
    const win = get().windows[id];
    if (!win) return;
    set({ windows: { ...get().windows, [id]: { ...win, minimized: true } } });
  },

  toggleMaximize: (id, viewport = getViewport()) => {
    const win = get().windows[id];
    if (!win) return;
    const next: WindowState = win.maximized
      ? { ...win, maximized: false, rect: win.prevRect ?? win.rect, prevRect: null }
      : { ...win, maximized: true, prevRect: win.rect, rect: maximizedRect(viewport) };
    set({ windows: { ...get().windows, [id]: next } });
  },

  setRect: (id, rect) => {
    const win = get().windows[id];
    if (!win) return;
    set({ windows: { ...get().windows, [id]: { ...win, rect } } });
  },
}));

/** 화면에 보이는 창 중 가장 앞에 있는 창 */
export function selectTopWindowId(state: Pick<WindowStore, "windows">): string | null {
  let top: WindowState | null = null;
  for (const win of Object.values(state.windows)) {
    if (win.minimized) continue;
    if (!top || win.z > top.z) top = win;
  }
  return top?.id ?? null;
}

export const useTopWindowId = () => useWindowStore(selectTopWindowId);
export const useWindow = (id: string) => useWindowStore((s) => s.windows[id]);
export const useIsWindowOpen = (id: string) => useWindowStore((s) => id in s.windows);
/** 열린 창 id 목록 (렌더 순서 고정을 위해 정렬) */
export const useOpenWindowIds = () =>
  useWindowStore((s) => Object.keys(s.windows).sort().join("|")).split("|").filter(Boolean);
