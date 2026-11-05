import { useT } from "@/shared/i18n";
import "./ReadmeCard.css";

export function ReadmeCard() {
  const t = useT();
  return (
    <article className="readme-card">
      <h2>{t("aboutName")}</h2>
      <p>{t("aboutBody")}</p>
    </article>
  );
}
