import { useState, type FormEvent } from "react";
import { useProfileStore, type ProfileContent } from "@/entities/profile";
import { LANGS, DICTIONARIES, useLang, useT, type Lang } from "@/shared/i18n";
import "./ReadmeEditor.css";

/** 편집 모드의 README 창: 이름·소개(한/일)와 연락처를 바로 고치고 저장한다 */
export function ReadmeEditor() {
  const t = useT();
  const current = useProfileStore((s) => s.content);
  const save = useProfileStore((s) => s.save);
  const [draft, setDraft] = useState<ProfileContent>(current);
  const [tab, setTab] = useState<Lang>(useLang());
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(current);

  const setLocalized = (field: "name" | "body", value: string) =>
    setDraft((d) => ({ ...d, [field]: { ...d[field], [tab]: value } }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    const ok = await save(draft);
    setPending(false);
    setMessage({ ok, text: t(ok ? "readmeSaved" : "readmeSaveError") });
  };

  return (
    <form className="readme-editor" onSubmit={submit}>
      <div className="readme-editor__tabs" role="tablist">
        {LANGS.map((code) => (
          <button key={code} type="button" role="tab" aria-selected={tab === code} onClick={() => setTab(code)}>
            {DICTIONARIES[code].langName}
          </button>
        ))}
      </div>
      <label htmlFor="readme-name">{t("readmeName")}</label>
      <input id="readme-name" value={draft.name[tab]} onChange={(e) => setLocalized("name", e.target.value)} />
      <label htmlFor="readme-body">{t("readmeBody")}</label>
      <textarea id="readme-body" rows={6} value={draft.body[tab]} onChange={(e) => setLocalized("body", e.target.value)} />
      <div className="readme-editor__row">
        <div>
          <label htmlFor="readme-email">{t("contactEmail")}</label>
          <input id="readme-email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="readme-phone">{t("contactPhone")}</label>
          <input id="readme-phone" type="tel" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
        </div>
      </div>
      <div className="readme-editor__actions">
        {message && <span className={message.ok ? "is-ok" : "is-error"}>{message.text}</span>}
        <button type="button" onClick={() => setDraft(current)} disabled={!dirty || pending}>
          {t("cancel")}
        </button>
        <button type="submit" className="is-primary" disabled={!dirty || pending}>
          {pending ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
