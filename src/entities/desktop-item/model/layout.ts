import type { Lang } from "@/shared/i18n";
import type { DesktopItem } from "./types";

/**
 * 관리자가 바꾼 바탕화면 구성. 코드에 있는 기본 항목(DESKTOP_ITEMS) 위에 덮어쓴다.
 * 페이지·프로젝트 같은 실제 내용은 코드에 두고, "어디에 놓이는지"만 데이터로 관리한다.
 */
export interface DesktopLayout {
  version: 1;
  /** 관리자가 만든 폴더 */
  folders: Array<{ id: string; name: Record<Lang, string> }>;
  /** 이름을 바꾼 폴더 (기본 폴더 포함) */
  names: Record<string, Record<Lang, string>>;
  /** 항목별 위치: 폴더 id, 또는 null이면 바탕화면 */
  parents: Record<string, string | null>;
  /** 지운 폴더 (기본 폴더를 지운 경우) */
  removed: string[];
}

export const EMPTY_LAYOUT: DesktopLayout = { version: 1, folders: [], names: {}, parents: {}, removed: [] };

const FOLDER_SIZE = { width: 720, height: 400 };

/** 저장된 값이 깨져 있어도 앱이 멈추지 않게 모양을 맞춘다 */
export function normalizeLayout(raw: unknown): DesktopLayout {
  if (!raw || typeof raw !== "object") return EMPTY_LAYOUT;
  const v = raw as Partial<DesktopLayout>;
  return {
    version: 1,
    folders: Array.isArray(v.folders) ? v.folders.filter((f) => f && typeof f.id === "string" && f.name) : [],
    names: v.names && typeof v.names === "object" ? v.names : {},
    parents: v.parents && typeof v.parents === "object" ? v.parents : {},
    removed: Array.isArray(v.removed) ? v.removed.filter((id) => typeof id === "string") : [],
  };
}

/** 기본 항목 + 레이아웃 → 화면에 그릴 항목 목록 */
export function applyLayout(base: DesktopItem[], layout: DesktopLayout): DesktopItem[] {
  const removed = new Set(layout.removed);
  const custom: DesktopItem[] = layout.folders.map((f) => ({
    id: f.id,
    kind: "folder",
    name: f.name,
    title: f.name,
    size: FOLDER_SIZE,
  }));
  const all = [...base, ...custom].filter((item) => !removed.has(item.id));
  const folderIds = new Set(all.filter((item) => item.kind === "folder").map((item) => item.id));

  return all.map((item) => {
    const renamed = layout.names[item.id];
    const next: DesktopItem = renamed && item.kind === "folder" ? { ...item, name: renamed, title: renamed } : { ...item };
    // 폴더는 항상 바탕화면에 둔다 (한 단계만)
    if (item.kind === "folder") return { ...next, parent: undefined };
    const override = layout.parents[item.id];
    const parent = override === undefined ? item.parent : override ?? undefined;
    // 들어 있던 폴더가 사라졌으면 바탕화면으로 꺼낸다
    return { ...next, parent: parent && folderIds.has(parent) ? parent : undefined };
  });
}

export function moveItem(layout: DesktopLayout, itemId: string, folderId: string | null): DesktopLayout {
  return { ...layout, parents: { ...layout.parents, [itemId]: folderId } };
}

export function createFolder(layout: DesktopLayout, name: Record<Lang, string>, id = `folder-${Date.now().toString(36)}`) {
  return { id, layout: { ...layout, folders: [...layout.folders, { id, name }] } };
}

export function renameFolder(layout: DesktopLayout, folderId: string, name: Record<Lang, string>): DesktopLayout {
  const isCustom = layout.folders.some((f) => f.id === folderId);
  if (isCustom) return { ...layout, folders: layout.folders.map((f) => (f.id === folderId ? { ...f, name } : f)) };
  return { ...layout, names: { ...layout.names, [folderId]: name } };
}

/** 폴더를 지우면 안에 있던 항목은 바탕화면으로 나온다 */
export function deleteFolder(layout: DesktopLayout, items: DesktopItem[], folderId: string): DesktopLayout {
  const parents = { ...layout.parents };
  for (const item of items) if (item.parent === folderId) parents[item.id] = null;
  const isCustom = layout.folders.some((f) => f.id === folderId);
  const { [folderId]: _renamed, ...names } = layout.names;
  return {
    ...layout,
    parents,
    names,
    folders: layout.folders.filter((f) => f.id !== folderId),
    removed: isCustom ? layout.removed : [...new Set([...layout.removed, folderId])],
  };
}
