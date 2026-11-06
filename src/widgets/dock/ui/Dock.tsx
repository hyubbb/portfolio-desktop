import { ItemDockIcon, useRootItems } from "@/entities/desktop-item";
import { useTopWindowId, useWindowStore } from "@/entities/window";
import { useLocalized, useT } from "@/shared/i18n";
import { TrashIcon } from "@/shared/ui";
import "./Dock.css";

export function Dock() {
  const t = useT();
  const localize = useLocalized();
  const openIds = useWindowStore((s) => s.windows);
  const hasWindow = useTopWindowId() !== null;
  const items = useRootItems();
  return (
    <div className={hasWindow ? "dock has-window" : "dock"} role="toolbar" aria-label="Dock">
      {items.map((item) => {
        const label = localize(item.name);
        return (
          <button
            key={item.id}
            type="button"
            className={item.id in openIds ? "is-running" : undefined}
            aria-label={label}
            onClick={() => useWindowStore.getState().open(item.id, item.size)}
          >
            <ItemDockIcon item={item} />
            <span className="dock__dot" />
            <span className="dock__tip">{label}</span>
          </button>
        );
      })}
      <span className="dock__separator" />
      <button type="button" aria-label={t("trash")}>
        <TrashIcon />
        <span className="dock__tip">{t("trash")}</span>
      </button>
    </div>
  );
}
