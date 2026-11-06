import { useT } from "@/shared/i18n";
import { CONTACT } from "../model";
import "./ReadmeCard.css";

export function ReadmeCard() {
  const t = useT();
  return (
    <article className="readme-card">
      <h2>{t("aboutName")}</h2>
      <p>{t("aboutBody")}</p>
      <dl className="readme-card__contact">
        <dt>{t("contactEmail")}</dt>
        <dd>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </dd>
        <dt>{t("contactPhone")}</dt>
        <dd>
          <a href={`tel:${CONTACT.phone.replaceAll("-", "")}`}>{CONTACT.phone}</a>
        </dd>
      </dl>
    </article>
  );
}
