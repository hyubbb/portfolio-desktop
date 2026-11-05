export interface Viewport {
  width: number;
  height: number;
}

export const MENUBAR_HEIGHT = 28;
export const DOCK_SPACE = 84;
export const MOBILE_QUERY = "(max-width: 700px)";

export function getViewport(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function isMobile(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function isTouchOnly(): boolean {
  return window.matchMedia("(hover: none)").matches;
}
