/**
 * 외부 사이트를 iframe으로 넣을 수 있는 환경인지.
 * Claude 미리보기처럼 frame-src를 막는 호스트에서는 빈 창 대신 새 탭 안내를 보여 준다.
 */
export function canEmbedExternal(hostname: string = window.location.hostname): boolean {
  return !/claude|anthropic/i.test(hostname);
}
