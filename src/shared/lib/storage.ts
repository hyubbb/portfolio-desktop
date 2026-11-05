/** localStorage는 사생활 보호 모드 등에서 예외를 던질 수 있어 항상 감싸서 쓴다. */
export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* 저장 실패는 무시: 기능에 필수가 아님 */
    }
  },
};
