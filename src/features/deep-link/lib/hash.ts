/** "#fastlane" → "fastlane" */
export function readHash(hash: string): string | null {
  const id = decodeURIComponent(hash.replace(/^#/, "")).trim();
  return id || null;
}

/** 주소창의 해시만 바꾼다 (기록을 쌓지 않음) */
export function writeHash(id: string | null) {
  const url = id ? `#${encodeURIComponent(id)}` : window.location.pathname + window.location.search;
  try {
    window.history.replaceState(null, "", url);
  } catch {
    /* 일부 샌드박스 환경에서는 막혀 있음 */
  }
}
