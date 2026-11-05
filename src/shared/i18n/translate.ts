import { DICTIONARIES, LANGS, type DictKey, type Lang } from "./dictionaries";

export type TranslateVars = Record<string, string | number>;

/** 사전에서 문장을 찾아 {n} 같은 자리표시자를 채운다. */
export function translate(lang: Lang, key: DictKey, vars?: TranslateVars): string {
  let text = DICTIONARIES[lang][key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

/** 언어별로 다른 값(제목·설명 등)을 가진 데이터 타입 */
export type Localized = string | Record<Lang, string>;

export function pickLocale(value: Localized, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/** 우선순위: URL ?lang= → 저장해 둔 값 → 브라우저 언어 → 한국어 */
export function detectLang(search: string, stored: string | null, browser: string): Lang {
  const fromUrl = new URLSearchParams(search).get("lang");
  if (isLang(fromUrl)) return fromUrl;
  if (isLang(stored)) return stored;
  return /^ja/i.test(browser) ? "ja" : "ko";
}
