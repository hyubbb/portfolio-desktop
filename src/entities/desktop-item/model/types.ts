import type { Localized } from "@/shared/i18n";
import type { ProjectGlyph } from "@/shared/ui";

interface ItemBase {
  id: string;
  name: Localized;
  title: Localized;
  /** 처음 열 때 원하는 창 크기 (화면이 작으면 줄어든다) */
  size: { width: number; height: number };
  /** 폴더 안에 들어 있는 항목이면 폴더 id */
  parent?: string;
}

export type DesktopItem =
  | (ItemBase & { kind: "readme" })
  | (ItemBase & { kind: "github"; user: string })
  /** 이 사이트 안의 정적 페이지 (public/ 아래) */
  | (ItemBase & { kind: "page"; src: string })
  | (ItemBase & { kind: "folder" })
  /** 따로 배포된 프로젝트 사이트 */
  | (ItemBase & { kind: "project"; url: string; color: string; glyph: ProjectGlyph; description: Localized });

export type DesktopItemKind = DesktopItem["kind"];
