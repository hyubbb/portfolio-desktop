import type { ReactNode } from "react";
import { getItem, OpenInNewTab, type DesktopItem } from "@/entities/desktop-item";
import { useOpenWindowIds, WindowFrame } from "@/entities/window";
import { useLocalized } from "@/shared/i18n";

interface WindowLayerProps {
  /** 항목 종류별로 창 안에 무엇을 그릴지는 페이지가 정한다 (위젯끼리 직접 의존하지 않도록) */
  renderContent: (item: DesktopItem) => ReactNode;
}

/** 열린 창들을 그린다. 쌓임 순서는 각 창의 z 값으로 정해진다. */
export function WindowLayer({ renderContent }: WindowLayerProps) {
  const ids = useOpenWindowIds();
  const localize = useLocalized();
  return (
    <>
      {ids.map((id) => {
        const item = getItem(id);
        if (!item) return null;
        return (
          <WindowFrame
            key={id}
            id={id}
            title={localize(item.title)}
            titleAccessory={item.kind === "project" ? <OpenInNewTab url={item.url} /> : undefined}
          >
            {renderContent(item)}
          </WindowFrame>
        );
      })}
    </>
  );
}
