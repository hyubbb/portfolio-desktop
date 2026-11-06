import { create } from "zustand";
import { loadContent, saveContent } from "@/shared/api";
import type { Lang } from "@/shared/i18n";
import { DESKTOP_ITEMS } from "./items";
import {
  applyLayout,
  createFolder,
  deleteFolder,
  EMPTY_LAYOUT,
  moveItem,
  normalizeLayout,
  renameFolder,
  type DesktopLayout,
} from "./layout";
import type { DesktopItem } from "./types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface DesktopStore {
  layout: DesktopLayout;
  items: DesktopItem[];
  saveStatus: SaveStatus;
  /** 서버에서 저장된 구성을 불러온다 (없거나 실패하면 기본 구성 유지) */
  load: () => Promise<void>;
  move: (itemId: string, folderId: string | null) => void;
  addFolder: (name: Record<Lang, string>) => string;
  rename: (folderId: string, name: Record<Lang, string>) => void;
  remove: (folderId: string) => void;
}

const SAVE_DELAY_MS = 400;
let saveTimer: number | undefined;

export const useDesktopStore = create<DesktopStore>((set, get) => {
  /** 화면을 먼저 바꾸고(낙관적 업데이트) 잠시 뒤 한 번에 저장 */
  const commit = (layout: DesktopLayout) => {
    set({ layout, items: applyLayout(DESKTOP_ITEMS, layout), saveStatus: "saving" });
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      saveContent("desktop", get().layout)
        .then(() => set({ saveStatus: "saved" }))
        .catch(() => set({ saveStatus: "error" }));
    }, SAVE_DELAY_MS);
  };

  return {
    layout: EMPTY_LAYOUT,
    items: applyLayout(DESKTOP_ITEMS, EMPTY_LAYOUT),
    saveStatus: "idle",

    load: async () => {
      try {
        const saved = await loadContent<DesktopLayout>("desktop");
        if (!saved) return;
        const layout = normalizeLayout(saved);
        set({ layout, items: applyLayout(DESKTOP_ITEMS, layout) });
      } catch {
        /* 불러오기 실패: 기본 구성으로 계속 */
      }
    },
    move: (itemId, folderId) => {
      const item = get().items.find((i) => i.id === itemId);
      if (!item || item.kind === "folder" || item.id === folderId) return;
      if ((item.parent ?? null) === folderId) return;
      commit(moveItem(get().layout, itemId, folderId));
    },
    addFolder: (name) => {
      const { id, layout } = createFolder(get().layout, name);
      commit(layout);
      return id;
    },
    rename: (folderId, name) => commit(renameFolder(get().layout, folderId, name)),
    remove: (folderId) => commit(deleteFolder(get().layout, get().items, folderId)),
  };
});

export const getItem = (id: string) => useDesktopStore.getState().items.find((item) => item.id === id);

export function useRootItems() {
  return useDesktopStore((s) => s.items).filter((item) => !item.parent);
}

export function useChildren(folderId: string) {
  return useDesktopStore((s) => s.items).filter((item) => item.parent === folderId);
}

export const useItem = (id: string) => useDesktopStore((s) => s.items.find((item) => item.id === id));
