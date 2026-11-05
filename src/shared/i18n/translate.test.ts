import { describe, expect, it } from "vitest";
import { DICTIONARIES } from "./dictionaries";
import { detectLang, pickLocale, translate } from "./translate";

describe("i18n", () => {
  it("자리표시자를 채운다", () => {
    expect(translate("ko", "items", { n: 3 })).toBe("항목 3개");
    expect(translate("ja", "items", { n: 3 })).toBe("3 項目");
  });

  it("언어 우선순위: URL > 저장값 > 브라우저", () => {
    expect(detectLang("?lang=ja", "ko", "ko-KR")).toBe("ja");
    expect(detectLang("", "ja", "ko-KR")).toBe("ja");
    expect(detectLang("", null, "ja-JP")).toBe("ja");
    expect(detectLang("?lang=fr", "xx", "en-US")).toBe("ko");
  });

  it("언어별 값을 고른다", () => {
    expect(pickLocale({ ko: "실험실", ja: "実験室" }, "ja")).toBe("実験室");
    expect(pickLocale("README", "ja")).toBe("README");
  });

  it("일본어 사전에 빠진 키가 없다", () => {
    expect(Object.keys(DICTIONARIES.ja).sort()).toEqual(Object.keys(DICTIONARIES.ko).sort());
  });
});
