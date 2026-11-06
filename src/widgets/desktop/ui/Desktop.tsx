import { useCallback, useRef, useState, type DragEvent, type MouseEvent } from "react";
import {
  isItemDrag,
  ItemTile,
  readItemDrag,
  startItemDrag,
  useDesktopStore,
  useRootItems,
  type DesktopItem,
} from "@/entities/desktop-item";
import { useIsAdmin } from "@/entities/session";
import { useWindowStore } from "@/entities/window";
import { MarqueeBox, useMarqueeSelect } from "@/features/marquee-select";
import { useT } from "@/shared/i18n";
import { isTouchOnly } from "@/shared/lib";
import "./Desktop.css";

const open = (item: DesktopItem) => useWindowStore.getState().open(item.id, item.size);

/** 바탕화면: 빈 곳(드래그 선택·내려놓기 영역) + 오른쪽 위 아이콘 열 */
export function Desktop() {
  const t = useT();
  const isAdmin = useIsAdmin();
  const items = useRootItems();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const tileRefs = useRef(new Map<string, HTMLButtonElement>());

  const getTargets = useCallback(
    () =>
      [...tileRefs.current.entries()].map(([id, el]) => ({
        id,
        parts: [...el.querySelectorAll(".item-tile__icon, .item-tile__label")],
      })),
    [],
  );
  const { box, onPointerDown, consumeClick } = useMarqueeSelect({ getTargets, selected, onChange: setSelected });

  const onTileClick = (item: DesktopItem) => (e: MouseEvent) => {
    e.stopPropagation();
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
      return;
    }
    setSelected(new Set([item.id]));
    if (isTouchOnly()) open(item);
  };

  /* ── 편집 모드: 끌어서 폴더에 넣기 / 바탕화면으로 꺼내기 ── */
  const allowDrop = (e: DragEvent) => {
    if (!isAdmin || !isItemDrag(e)) return false;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return true;
  };
  const dropTo = (folderId: string | null) => (e: DragEvent) => {
    setDropTarget(null);
    const id = readItemDrag(e);
    if (!isAdmin || !id) return;
    e.preventDefault();
    e.stopPropagation();
    useDesktopStore.getState().move(id, folderId);
  };

  return (
    <>
      <div
        className="desktop-surface"
        onPointerDown={onPointerDown}
        onClick={() => {
          if (!consumeClick()) setSelected(new Set());
        }}
        onDragOver={allowDrop}
        onDrop={dropTo(null)}
      />
      <nav className="desktop-icons" aria-label="Desktop" onDragOver={allowDrop} onDrop={dropTo(null)}>
        {items.map((item) => {
          const isFolder = item.kind === "folder";
          return (
            <ItemTile
              key={item.id}
              ref={(el) => {
                if (el) tileRefs.current.set(item.id, el);
                else tileRefs.current.delete(item.id);
              }}
              item={item}
              selected={selected.has(item.id)}
              className={dropTarget === item.id ? "is-drop-target" : undefined}
              draggable={isAdmin && !isFolder}
              onDragStart={(e) => startItemDrag(e, item.id)}
              onDragOver={(e) => {
                if (isFolder && allowDrop(e)) setDropTarget(item.id);
              }}
              onDragLeave={() => setDropTarget((cur) => (cur === item.id ? null : cur))}
              onDrop={isFolder ? dropTo(item.id) : undefined}
              onClick={onTileClick(item)}
              onDoubleClick={() => open(item)}
              onKeyDown={(e) => e.key === "Enter" && open(item)}
            />
          );
        })}
      </nav>
      <MarqueeBox box={box} />
      <p className="desktop-hint">
        {isAdmin ? (
          t("editHint")
        ) : (
          <>
            {t("hint")}
            <br />
            {t("hintClose")}
          </>
        )}
      </p>
    </>
  );
}
