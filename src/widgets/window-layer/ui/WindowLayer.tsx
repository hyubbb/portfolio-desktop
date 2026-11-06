import { useEffect, type ReactNode } from "react";
import { OpenInNewTab, useDesktopStore, type DesktopItem } from "@/entities/desktop-item";
import { useOpenWindowIds, useWindowStore, WindowFrame } from "@/entities/window";
import { useLocalized } from "@/shared/i18n";

interface WindowLayerProps {
  /** 항목 종류별로 창 안에 무엇을 그릴지는 페이지가 정한다 (위젯끼리 직접 의존하지 않도록) */
  renderContent: (item: DesktopItem) => ReactNode;
}

/** 열린 창들을 그린다. 쌓임 순서는 각 창의 z 값으로 정해진다. */
export function WindowLayer({ renderContent }: WindowLayerProps) {
  const ids = useOpenWindowIds();
  const items = useDesktopStore((s) => s.items);
  const localize = useLocalized();

  // 지운 폴더처럼 항목이 사라지면 그 창도 닫는다
  useEffect(() => {
    for (const id of ids) if (!items.some((item) => item.id === id)) useWindowStore.getState().close(id);
  }, [ids, items]);

  return (
    <>
      {ids.map((id) => {
        const item = items.find((i) => i.id === id);
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
