import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useLocalized } from "@/shared/i18n";
import type { DesktopItem } from "../model/types";
import { ItemIcon } from "./ItemIcon";
import "./ItemTile.css";

interface ItemTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  item: DesktopItem;
  selected: boolean;
  /** 이름 아래에 붙는 설명 (폴더 안에서 사용) */
  caption?: ReactNode;
  tone?: "desktop" | "window";
}

/** 아이콘 + 이름. 선택되면 아이콘 둘레에 박스, 이름에 파란 배경이 생긴다 (macOS Finder 방식) */
export const ItemTile = forwardRef<HTMLButtonElement, ItemTileProps>(function ItemTile(
  { item, selected, caption, tone = "desktop", className, ...rest },
  ref,
) {
  const localize = useLocalized();
  return (
    <button
      ref={ref}
      type="button"
      className={["item-tile", `is-${tone}`, selected && "is-selected", className].filter(Boolean).join(" ")}
      aria-pressed={selected}
      data-item-id={item.id}
      {...rest}
    >
      <span className="item-tile__icon">
        <ItemIcon item={item} />
      </span>
      <span className="item-tile__label">{localize(item.name)}</span>
      {caption ? <span className="item-tile__caption">{caption}</span> : null}
    </button>
  );
});
