import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { boxFromPoints, DRAG_THRESHOLD, intersects, type Box } from "../lib/rect";

interface Options {
  /** 선택 대상과, 히트 판정에 쓸 요소들(아이콘·이름 등) */
  getTargets: () => Array<{ id: string; parts: Element[] }>;
  selected: Set<string>;
  onChange: (ids: Set<string>) => void;
}

/**
 * 바탕화면 빈 곳을 끌어서 여러 아이콘을 고르는 macOS식 드래그 선택.
 * ⌘/Ctrl/Shift를 누른 채 시작하면 기존 선택에 더한다.
 * 드래그가 끝난 직후의 click은 선택 해제로 처리되지 않도록 consumeClick으로 걸러 낸다.
 */
export function useMarqueeSelect({ getTargets, selected, onChange }: Options) {
  const [box, setBox] = useState<Box | null>(null);
  const draggedRef = useRef(false);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      const additive = e.metaKey || e.ctrlKey || e.shiftKey;
      const base = additive ? new Set(selected) : new Set<string>();
      if (!additive) onChange(new Set());
      const sx = e.clientX;
      const sy = e.clientY;
      let active = false;

      const onMove = (ev: PointerEvent) => {
        const next = boxFromPoints(sx, sy, ev.clientX, ev.clientY);
        if (!active && next.right - next.left < DRAG_THRESHOLD && next.bottom - next.top < DRAG_THRESHOLD) return;
        active = true;
        setBox(next);
        const hit = new Set(base);
        for (const target of getTargets()) {
          if (target.parts.some((part) => intersects(next, part.getBoundingClientRect()))) hit.add(target.id);
        }
        onChange(hit);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        if (active) draggedRef.current = true;
        setBox(null);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [getTargets, selected, onChange],
  );

  /** 드래그 직후 발생하는 click 한 번을 무시하기 위해 호출 */
  const consumeClick = useCallback(() => {
    const was = draggedRef.current;
    draggedRef.current = false;
    return was;
  }, []);

  return { box, onPointerDown, consumeClick };
}
