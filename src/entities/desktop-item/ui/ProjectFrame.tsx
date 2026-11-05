import { useLocalized, useT } from "@/shared/i18n";
import { canEmbedExternal } from "@/shared/lib";
import type { DesktopItem } from "../model/types";
import { ItemIcon } from "./ItemIcon";
import "./ProjectFrame.css";

type ProjectItem = Extract<DesktopItem, { kind: "project" }>;

/** 배포된 프로젝트를 창 안에 띄운다. 외부 사이트를 막는 환경이면 새 탭 안내를 보여 준다. */
export function ProjectFrame({ item }: { item: ProjectItem }) {
  const t = useT();
  const localize = useLocalized();
  if (canEmbedExternal()) {
    return <iframe src={item.url} title={localize(item.title)} allow="clipboard-write; fullscreen" />;
  }
  return (
    <div className="project-fallback">
      <span className="project-fallback__icon">
        <ItemIcon item={item} />
      </span>
      <b>{localize(item.name)}</b>
      <p>{localize(item.description)}</p>
      <a className="project-fallback__button" href={item.url} target="_blank" rel="noopener noreferrer">
        {t("newTab")}
      </a>
      <small>{t("noEmbed")}</small>
    </div>
  );
}

/** 제목 막대 오른쪽에 붙는 "새 탭에서 열기" 링크 */
export function OpenInNewTab({ url }: { url: string }) {
  const t = useT();
  return (
    <a className="open-new-tab" href={url} target="_blank" rel="noopener noreferrer">
      {t("newTab")}
    </a>
  );
}
