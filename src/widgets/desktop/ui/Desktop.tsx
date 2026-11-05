import { useCallback, useRef, useState, type MouseEvent } from "react";
import { getRootItems, ItemTile, type DesktopItem } from "@/entities/desktop-item";
import { useWindowStore } from "@/entities/window";
import { MarqueeBox, useMarqueeSelect } from "@/features/marquee-select";
import { useT } from "@/shared/i18n";
import { isTouchOnly } from "@/shared/lib";
import "./Desktop.css";

const open = (item: DesktopItem) => useWindowStore.getState().open(item.id, item.size);

/** 바탕화면: 빈 곳(드래그 선택 영역) + 오른쪽 위 아이콘 열 */
export function Desktop() {
  const t = useT();
  const items = getRootItems();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
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

  return (
    <>
      <div
        className="desktop-surface"
        onPointerDown={onPointerDown}
        onClick={() => {
          if (!consumeClick()) setSelected(new Set());
        }}
      />
      <nav className="desktop-icons" aria-label="Desktop">
        {items.map((item) => (
          <ItemTile
            key={item.id}
            ref={(el) => {
              if (el) tileRefs.current.set(item.id, el);
              else tileRefs.current.delete(item.id);
            }}
            item={item}
            selected={selected.has(item.id)}
            onClick={onTileClick(item)}
            onDoubleClick={() => open(item)}
            onKeyDown={(e) => e.key === "Enter" && open(item)}
          />
        ))}
      </nav>
      <MarqueeBox box={box} />
      <p className="desktop-hint">
        {t("hint")}
        <br />
        {t("hintClose")}
      </p>
    </>
  );
}
