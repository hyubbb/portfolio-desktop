export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  /** 쌓이는 순서. 클수록 앞 */
  z: number;
  rect: Rect;
  minimized: boolean;
  maximized: boolean;
  /** 확대 전 위치, 확대를 풀 때 되돌린다 */
  prevRect: Rect | null;
}
