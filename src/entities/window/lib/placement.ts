import { DOCK_SPACE, MENUBAR_HEIGHT, type Viewport } from "@/shared/lib";
import type { Rect, Size } from "../model/types";

const SIDE_GAP = 20;
const TOP_GAP = 8;
/** 독과 창 사이에 남기는 여백 */
const DOCK_GAP = 8;
const MAX_CASCADE_Y = 12;

/**
 * 새 창 위치를 정한다. 여러 창을 열면 offset만큼 계단식으로 비켜 놓는다.
 * 창은 메뉴 막대 아래, 독 위의 영역 안에 들어가도록 크기를 줄이고
 * 그 영역 안에서 가운데에 놓는다 (독에 가려지지 않게).
 */
export function placeWindow(size: Size, viewport: Viewport, offset = 0): Rect {
  const top = MENUBAR_HEIGHT + TOP_GAP;
  const bottom = viewport.height - DOCK_SPACE - DOCK_GAP;
  const cascadeY = Math.min(offset, MAX_CASCADE_Y);
  const available = Math.max(0, bottom - top - cascadeY);

  const width = Math.min(size.width, viewport.width - SIDE_GAP * 2);
  const height = Math.min(size.height, available);
  const x = Math.max(SIDE_GAP, (viewport.width - width) / 2 + offset);
  const y = top + cascadeY + Math.max(0, (available - height) / 2);
  return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
}

/** 확대: 메뉴 막대 아래부터 독 위까지 꽉 채운다 */
export function maximizedRect(viewport: Viewport): Rect {
  return { x: 0, y: MENUBAR_HEIGHT, width: viewport.width, height: viewport.height - MENUBAR_HEIGHT - DOCK_SPACE };
}

export const MIN_SIZE: Size = { width: 320, height: 220 };

/** 끌어서 옮길 때 창이 화면 밖으로 완전히 사라지지 않게 붙잡는다 */
export function clampPosition(rect: Rect, viewport: Viewport): Rect {
  const keep = 80;
  return {
    ...rect,
    x: Math.min(viewport.width - keep, Math.max(-rect.width + keep, rect.x)),
    y: Math.min(viewport.height - 60, Math.max(MENUBAR_HEIGHT, rect.y)),
  };
}
