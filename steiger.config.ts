import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // 페이지가 하나뿐인 앱이라 모든 위젯·기능이 한 곳에서만 쓰인다.
    // 사용처 개수가 아니라 책임 단위로 슬라이스를 나눴으므로 이 규칙만 끈다.
    rules: { "fsd/insignificant-slice": "off" },
  },
]);
