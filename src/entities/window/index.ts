export { WindowFrame } from "./ui/WindowFrame";
export {
  useWindowStore,
  useWindow,
  useTopWindowId,
  useIsWindowOpen,
  useOpenWindowIds,
  selectTopWindowId,
} from "./model/store";
export { placeWindow, maximizedRect, clampPosition } from "./lib/placement";
export type { Rect, Size, WindowState } from "./model/types";
