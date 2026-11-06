import type { DragEvent } from "react";

/** 바탕화면 항목을 끌어 옮길 때 쓰는 데이터 형식 */
const MIME = "application/x-desktop-item";

export function startItemDrag(e: DragEvent, itemId: string) {
  e.dataTransfer.setData(MIME, itemId);
  e.dataTransfer.setData("text/plain", itemId);
  e.dataTransfer.effectAllowed = "move";
}

export function isItemDrag(e: DragEvent) {
  return e.dataTransfer.types.includes(MIME);
}

export function readItemDrag(e: DragEvent): string | null {
  return e.dataTransfer.getData(MIME) || null;
}
