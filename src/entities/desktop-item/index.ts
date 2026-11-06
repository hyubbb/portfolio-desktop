export type { DesktopItem, DesktopItemKind } from "./model/types";
export { DESKTOP_ITEMS } from "./model/items";
export { useDesktopStore, useRootItems, useChildren, useItem, getItem, type SaveStatus } from "./model/store";
export {
  applyLayout,
  moveItem,
  createFolder,
  renameFolder,
  deleteFolder,
  normalizeLayout,
  EMPTY_LAYOUT,
  type DesktopLayout,
} from "./model/layout";
export { startItemDrag, isItemDrag, readItemDrag } from "./lib/dnd";
export { ItemIcon, ItemDockIcon } from "./ui/ItemIcon";
export { ItemTile } from "./ui/ItemTile";
export { ProjectFrame, OpenInNewTab } from "./ui/ProjectFrame";
