import { useEffect } from "react";
import { selectTopWindowId, useWindowStore } from "@/entities/window";
import { isCloseShortcut } from "../lib/isCloseShortcut";

function handleKey(e: KeyboardEvent) {
  if (e.defaultPrevented || !isCloseShortcut(e)) return;
  const top = selectTopWindowId(useWindowStore.getState());
  if (!top) return;
  e.preventDefault();
  useWindowStore.getState().close(top);
}

/** 페이지 전체에 창 닫기 단축키를 건다 */
export function useCloseShortcut() {
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
}

/**
 * 같은 출처 iframe(정리 페이지) 안에 포커스가 있어도 단축키가 동작하도록 이어 준다.
 * 다른 출처(외부 프로젝트)는 브라우저 보안상 접근할 수 없어 조용히 건너뛴다.
 */
export function bindFrameShortcut(frame: HTMLIFrameElement) {
  try {
    frame.contentWindow?.document.addEventListener("keydown", handleKey);
  } catch {
    /* cross-origin */
  }
}
