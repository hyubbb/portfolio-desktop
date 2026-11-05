import { DocIcon, DocTile, FastlaneTile, FolderIcon, GitIcon, PageIcon, ProjectIcon } from "@/shared/ui";
import type { DesktopItem } from "../model/types";

/** 바탕화면·폴더 안에서 쓰는 큰 아이콘 */
export function ItemIcon({ item }: { item: DesktopItem }) {
  switch (item.kind) {
    case "project":
      return <ProjectIcon color={item.color} glyph={item.glyph} />;
    case "folder":
      return <FolderIcon />;
    case "page":
      return <PageIcon />;
    case "github":
      return <GitIcon />;
    case "readme":
      return <DocIcon />;
  }
}

/** 독에 들어가는 정사각형 아이콘 */
export function ItemDockIcon({ item }: { item: DesktopItem }) {
  switch (item.kind) {
    case "folder":
      return <FolderIcon size="dock" />;
    case "page":
      return <FastlaneTile />;
    case "github":
      return <GitIcon size="dock" />;
    default:
      return <DocTile />;
  }
}
