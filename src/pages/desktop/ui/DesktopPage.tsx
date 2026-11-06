import { ProjectFrame, type DesktopItem } from "@/entities/desktop-item";
import { ReadmeCard } from "@/entities/profile";
import { useIsAdmin } from "@/entities/session";
import { FolderView } from "@/features/browse-folder";
import { FolderAdminBar } from "@/features/edit-desktop";
import { ReadmeEditor } from "@/features/edit-readme";
import { bindFrameShortcut, useCloseShortcut } from "@/features/close-window-shortcut";
import { useDeepLink } from "@/features/deep-link";
import { useLang, useLocalized } from "@/shared/i18n";
import { Desktop } from "@/widgets/desktop";
import { Dock } from "@/widgets/dock";
import { GithubBrowser } from "@/widgets/github-browser";
import { MenuBar } from "@/widgets/menu-bar";
import { Wallpaper } from "@/widgets/wallpaper";
import { WindowLayer } from "@/widgets/window-layer";

/** 이 사이트 안의 정리 페이지. 언어를 넘기고, 안에 포커스가 있어도 창 닫기 단축키가 먹게 한다 */
function InternalPage({ item }: { item: Extract<DesktopItem, { kind: "page" }> }) {
  const lang = useLang();
  const localize = useLocalized();
  return (
    <iframe
      // 해시로 언어를 넘긴다 (쿼리를 붙이면 일부 개발 서버가 SPA 폴백으로 index.html을 돌려줌)
      // 언어가 바뀌면 key가 달라져 새로 불러온다
      key={lang}
      src={`${item.src}#lang=${lang}`}
      title={localize(item.title)}
      onLoad={(e) => bindFrameShortcut(e.currentTarget)}
    />
  );
}

/** 항목 종류별로 창 안에 그릴 내용. 편집 모드면 편집 도구를 함께 붙인다 */
function WindowContent({ item }: { item: DesktopItem }) {
  const isAdmin = useIsAdmin();
  switch (item.kind) {
    case "readme":
      return isAdmin ? <ReadmeEditor /> : <ReadmeCard />;
    case "github":
      return <GithubBrowser user={item.user} />;
    case "page":
      return <InternalPage item={item} />;
    case "folder":
      return <FolderView folder={item} toolbar={isAdmin ? <FolderAdminBar folder={item} /> : undefined} />;
    case "project":
      return <ProjectFrame item={item} />;
  }
}

export function DesktopPage() {
  useCloseShortcut();
  useDeepLink();
  return (
    <>
      <Wallpaper />
      <MenuBar />
      <Desktop />
      <WindowLayer renderContent={(item) => <WindowContent item={item} />} />
      <Dock />
    </>
  );
}
