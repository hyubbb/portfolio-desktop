import { useState, type DragEvent, type ReactNode } from "react";
import {
  isItemDrag,
  ItemTile,
  readItemDrag,
  startItemDrag,
  useChildren,
  useDesktopStore,
  type DesktopItem,
} from "@/entities/desktop-item";
import { useIsAdmin } from "@/entities/session";
import { useWindowStore } from "@/entities/window";
import { useLocalized, useT } from "@/shared/i18n";
import { isTouchOnly } from "@/shared/lib";
import "./FolderView.css";

interface FolderViewProps {
  folder: DesktopItem;
  /** 편집 모드에서 폴더 바에 붙는 도구 (이름 바꾸기·삭제) */
  toolbar?: ReactNode;
}

/** Finder처럼 폴더 안 항목을 보여 주고, 더블클릭하면 그 항목의 창을 연다. 편집 모드에서는 끌어 넣고 뺄 수 있다 */
export function FolderView({ folder, toolbar }: FolderViewProps) {
  const t = useT();
  const localize = useLocalized();
  const isAdmin = useIsAdmin();
  const children = useChildren(folder.id);
  const [selected, setSelected] = useState<string | null>(null);
  const [dropping, setDropping] = useState(false);
  const open = (item: DesktopItem) => useWindowStore.getState().open(item.id, item.size);

  const onDragOver = (e: DragEvent) => {
    if (!isAdmin || !isItemDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropping(true);
  };
  const onDrop = (e: DragEvent) => {
    setDropping(false);
    const id = readItemDrag(e);
    if (!isAdmin || !id) return;
    e.preventDefault();
    e.stopPropagation();
    useDesktopStore.getState().move(id, folder.id);
  };

  return (
    <div className="folder-view">
      <div className="folder-view__bar">
        <span className="folder-view__path">{localize(folder.name)}</span>
        {toolbar}
        <span className="folder-view__count">{t("items", { n: children.length })}</span>
      </div>
      <div
        className={dropping ? "folder-view__grid is-dropping" : "folder-view__grid"}
        onClick={() => setSelected(null)}
        onDragOver={onDragOver}
        onDragLeave={() => setDropping(false)}
        onDrop={onDrop}
      >
        {children.length === 0 && isAdmin && <p className="folder-view__empty">{t("emptyFolder")}</p>}
        {children.map((item) => (
          <ItemTile
            key={item.id}
            item={item}
            tone="window"
            selected={selected === item.id}
            draggable={isAdmin}
            onDragStart={(e) => startItemDrag(e, item.id)}
            caption={(item.kind === "project" || item.kind === "page") && item.description ? localize(item.description) : undefined}
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
      <div className="folder-view__foot">{isAdmin ? t("editHint") : t(isTouchOnly() ? "folderHintTouch" : "folderHint")}</div>
    </div>
  );
}
