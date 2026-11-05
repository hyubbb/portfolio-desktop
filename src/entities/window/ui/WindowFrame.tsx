import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { getViewport, isMobile } from "@/shared/lib";
import { useT } from "@/shared/i18n";
import { clampPosition, MIN_SIZE } from "../lib/placement";
import { useTopWindowId, useWindow, useWindowStore } from "../model/store";
import "./WindowFrame.css";

interface WindowFrameProps {
  id: string;
  title: string;
  /** 제목 막대 오른쪽에 붙는 요소 (예: 새 탭에서 열기) */
  titleAccessory?: ReactNode;
  children: ReactNode;
}

type DragMode = "move" | "resize";

export function WindowFrame({ id, title, titleAccessory, children }: WindowFrameProps) {
  const t = useT();
  const win = useWindow(id);
  const isFront = useTopWindowId() === id;
  const { close, focus, minimize, toggleMaximize, setRect } = useWindowStore.getState();
  const [opening, setOpening] = useState(true);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLElement>(null);

  // 열릴 때 살짝 커지며 나타나는 애니메이션
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setOpening(false)));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!win) return null;

  const startDrag = (mode: DragMode) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || isMobile()) return;
    if ((e.target as HTMLElement).closest(".win-lights, .win-accessory, .win-back")) return;
    if (mode === "move" && win.maximized) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY, rect: win.rect };
    setDragging(true);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (mode === "resize") {
        setRect(id, {
          ...start.rect,
          width: Math.max(MIN_SIZE.width, start.rect.width + dx),
          height: Math.max(MIN_SIZE.height, start.rect.height + dy),
        });
      } else {
        setRect(id, clampPosition({ ...start.rect, x: start.rect.x + dx, y: start.rect.y + dy }, getViewport()));
      }
    };
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      setDragging(false);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  const className = [
    "win",
    isFront && "is-front",
    opening && "is-opening",
    win.minimized && "is-minimized",
    win.maximized && "is-maximized",
    dragging && "is-dragging",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={frameRef}
      className={className}
      role="dialog"
      aria-label={title}
      style={{ left: win.rect.x, top: win.rect.y, width: win.rect.width, height: win.rect.height, zIndex: 10 + win.z }}
      onPointerDownCapture={() => focus(id)}
    >
      <div
        className="win-titlebar"
        onPointerDown={startDrag("move")}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest(".win-lights, .win-accessory")) toggleMaximize(id);
        }}
      >
        <button type="button" className="win-back" onClick={() => close(id)}>
          <span aria-hidden="true">‹</span>
          {t("close")}
        </button>
        <div className="win-lights">
          <button type="button" className="win-light is-close" aria-label={t("close")} onClick={() => close(id)} />
          <button type="button" className="win-light is-minimize" aria-label={t("minimize")} onClick={() => minimize(id)} />
          <button type="button" className="win-light is-maximize" aria-label={t("maximize")} onClick={() => toggleMaximize(id)} />
        </div>
        <div className="win-title">{title}</div>
        {titleAccessory ? <div className="win-accessory">{titleAccessory}</div> : <div className="win-title-spacer" />}
      </div>
      <div className="win-body">{children}</div>
      <div className="win-resize" onPointerDown={startDrag("resize")} />
    </section>
  );
}
