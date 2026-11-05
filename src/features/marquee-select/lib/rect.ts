export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** 시작점과 현재 포인터 위치로 사각형을 만든다 (어느 방향으로 끌어도 됨) */
export function boxFromPoints(ax: number, ay: number, bx: number, by: number): Box {
  return { left: Math.min(ax, bx), top: Math.min(ay, by), right: Math.max(ax, bx), bottom: Math.max(ay, by) };
}

export function intersects(a: Box, b: Box): boolean {
  return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
}

/** 이 거리보다 적게 움직이면 클릭으로 보고 사각형을 그리지 않는다 */
export const DRAG_THRESHOLD = 4;
