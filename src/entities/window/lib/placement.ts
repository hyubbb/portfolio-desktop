import { DOCK_SPACE, MENUBAR_HEIGHT, type Viewport } from "@/shared/lib";
import type { Rect, Size } from "../model/types";

const SIDE_GAP = 20;
const BOTTOM_GAP = 12;
const TOP_GAP = 8;
/** 화면을 거의 다 차지하는 창은 가운데 대신 메뉴 막대 바로 아래에 붙인다 */
const TALL_THRESHOLD = 150;

/**
 * 새 창 위치를 정한다. 여러 창을 열면 offset만큼 계단식으로 비켜 놓는다.
 * 원하는 크기가 화면보다 크면 화면에 맞춰 줄인다.
 */
export function placeWindow(size: Size, viewport: Viewport, offset = 0): Rect {
  const width = Math.min(size.width, viewport.width - SIDE_GAP * 2);
  const height = Math.min(size.height, viewport.height - MENUBAR_HEIGHT - TOP_GAP - BOTTOM_GAP);
  const tall = height > viewport.height - TALL_THRESHOLD;
  const x = Math.max(SIDE_GAP, (viewport.width - width) / 2 + offset);
  const y = tall
    ? MENUBAR_HEIGHT + TOP_GAP + Math.min(offset, 12)
    : Math.max(MENUBAR_HEIGHT + 12, (viewport.height - height) / 2 - 20 + offset);
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
