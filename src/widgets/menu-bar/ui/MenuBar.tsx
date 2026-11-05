import { LanguageMenu } from "@/features/switch-language";
import { useLang, useT, translate } from "@/shared/i18n";
import { useNow } from "@/shared/lib";
import "./MenuBar.css";

function Clock() {
  const lang = useLang();
  const now = useNow();
  const weekday = translate(lang, "weekdays")[now.getDay()];
  const h = now.getHours();
  const mm = String(now.getMinutes()).padStart(2, "0");
  const text =
    lang === "ja"
      ? `${now.getMonth() + 1}月${now.getDate()}日(${weekday}) ${h}:${mm}`
      : `${now.getMonth() + 1}월 ${now.getDate()}일 (${weekday}) ${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${mm}`;
  return <time dateTime={now.toISOString()}>{text}</time>;
}

export function MenuBar() {
  const t = useT();
  return (
    <header className="menu-bar">
      <span className="menu-bar__brand">
        <i aria-hidden="true" />
        hyub
      </span>
      <span className="menu-bar__right">
        <span className="menu-bar__who">{t("who")}</span>
        <LanguageMenu />
        <Clock />
      </span>
    </header>
  );
}
