import { useLang, useT } from "@/shared/i18n";
import { useProfileStore } from "../model/store";
import "./ReadmeCard.css";

export function ReadmeCard() {
  const t = useT();
  const lang = useLang();
  const { name, body, email, phone } = useProfileStore((s) => s.content);
  return (
    <article className="readme-card">
      <h2>{name[lang]}</h2>
      <p>{body[lang]}</p>
      <dl className="readme-card__contact">
        <dt>{t("contactEmail")}</dt>
        <dd>
          <a href={`mailto:${email}`}>{email}</a>
        </dd>
        <dt>{t("contactPhone")}</dt>
        <dd>
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
        </dd>
      </dl>
    </article>
  );
}
