import { useState } from "react";
import { getChildren, ItemTile, type DesktopItem } from "@/entities/desktop-item";
import { useWindowStore } from "@/entities/window";
import { useLocalized, useT } from "@/shared/i18n";
import { isTouchOnly } from "@/shared/lib";
import "./FolderView.css";

/** Finder처럼 폴더 안 항목을 보여 주고, 더블클릭하면 그 항목의 창을 연다 */
export function FolderView({ folder }: { folder: DesktopItem }) {
  const t = useT();
  const localize = useLocalized();
  const children = getChildren(folder.id);
  const [selected, setSelected] = useState<string | null>(null);
  const open = (item: DesktopItem) => useWindowStore.getState().open(item.id, item.size);

  return (
    <div className="folder-view">
      <div className="folder-view__bar">
        <span className="folder-view__path">{localize(folder.name)}</span>
        <span className="folder-view__count">{t("items", { n: children.length })}</span>
      </div>
      <div className="folder-view__grid" onClick={() => setSelected(null)}>
        {children.map((item) => (
          <ItemTile
            key={item.id}
            item={item}
            tone="window"
            selected={selected === item.id}
            caption={item.kind === "project" ? localize(item.description) : undefined}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(item.id);
              if (isTouchOnly()) open(item);
            }}
            onDoubleClick={() => open(item)}
            onKeyDown={(e) => e.key === "Enter" && open(item)}
          />
        ))}
      </div>
      <div className="folder-view__foot">{t(isTouchOnly() ? "folderHintTouch" : "folderHint")}</div>
    </div>
  );
}
