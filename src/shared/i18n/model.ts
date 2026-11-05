import { create } from "zustand";
import { useCallback } from "react";
import type { DictKey, Lang } from "./dictionaries";
import { detectLang, pickLocale, translate, type Localized, type TranslateVars } from "./translate";
import { storage } from "../lib/storage";

const STORAGE_KEY = "lang";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const initialLang =
  typeof window === "undefined"
    ? "ko"
    : detectLang(window.location.search, storage.get(STORAGE_KEY), navigator.language ?? "");

export const useLangStore = create<LangState>((set) => ({
  lang: initialLang,
  setLang: (lang) => {
    storage.set(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    set({ lang });
  },
}));

export const useLang = () => useLangStore((s) => s.lang);

/** 컴포넌트에서 쓰는 번역 함수. 언어가 바뀌면 다시 그려진다. */
export function useT() {
  const lang = useLang();
  return useCallback((key: DictKey, vars?: TranslateVars) => translate(lang, key, vars), [lang]);
}

export function useLocalized() {
  const lang = useLang();
  return useCallback((value: Localized) => pickLocale(value, lang), [lang]);
}
