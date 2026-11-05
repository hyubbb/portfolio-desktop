type KeyLike = Pick<KeyboardEvent, "key" | "code" | "altKey" | "ctrlKey" | "metaKey">;

/**
 * 맨 앞 창을 닫는 키: Esc, ⌥W, Ctrl+W.
 * ⌘W는 브라우저가 먼저 탭을 닫아 페이지까지 오지 않지만, 받을 수 있는 환경(전체 화면 등)이면 같이 처리한다.
 */
export function isCloseShortcut(e: KeyLike): boolean {
  if (e.key === "Escape") return true;
  return e.code === "KeyW" && (e.altKey || e.ctrlKey || e.metaKey);
}
