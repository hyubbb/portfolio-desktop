import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { DICTIONARIES, LANGS, useLangStore, useT, type Lang } from "@/shared/i18n";
import { GlobeIcon } from "@/shared/ui";
import "./LanguageMenu.css";

const FLAGS: Record<Lang, string> = { ko: "🇰🇷", ja: "🇯🇵" };

/** 메뉴 막대의 언어 선택 (macOS 메뉴 모양) */
export function LanguageMenu() {
  const t = useT();
  const { lang, setLang } = useLangStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    itemRefs.current[LANGS.indexOf(lang)]?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, lang]);

  const choose = (next: Lang) => {
    setLang(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") items[(i + 1) % items.length]?.focus();
    else if (e.key === "ArrowUp") items[(i - 1 + items.length) % items.length]?.focus();
    else if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    } else return;
    // 메뉴 안에서 처리한 키는 창 닫기 단축키 등 다른 곳으로 넘기지 않는다
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="lang-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="lang-menu__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("langLabel")}
        onClick={() => setOpen((v) => !v)}
      >
        <GlobeIcon />
        <span>{t("code")}</span>
      </button>
      {open && (
        <div className="lang-menu__list" role="menu" onKeyDown={onMenuKey}>
          {LANGS.map((code, i) => (
            <button
              key={code}
              ref={(el) => (itemRefs.current[i] = el)}
              type="button"
              role="menuitemradio"
              aria-checked={code === lang}
              onClick={() => choose(code)}
            >
              <span className="lang-menu__check">✓</span>
              <span className="lang-menu__flag">{FLAGS[code]}</span>
              <span>{DICTIONARIES[code].langName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
