import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSessionStore } from "@/entities/session";
import { isBackendReady } from "@/shared/api";
import { useT } from "@/shared/i18n";
import "./AdminLoginDialog.css";

/** 메뉴의 "관리자 모드…"에서 여는 로그인 창. 로그인하면 편집 모드가 켜진다 */
export function AdminLoginDialog({ onClose }: { onClose: () => void }) {
  const t = useT();
  const signIn = useSessionStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(isBackendReady ? null : t("loginNotConfigured"));
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isBackendReady || pending) return;
    setPending(true);
    setError(null);
    const result = await signIn(email.trim(), password);
    setPending(false);
    if (result.ok) {
      onClose();
      return;
    }
    setError(t(result.reason === "invalid" ? "loginInvalid" : result.reason === "network" ? "loginNetwork" : "loginNotConfigured"));
    setPassword("");
  };

  return (
    <div className="login-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title" onSubmit={submit}>
        <div className="login-dialog__icon" aria-hidden="true">🔒</div>
        <h2 id="login-title">{t("loginTitle")}</h2>
        <p>{t("loginDesc")}</p>
        <label htmlFor="admin-email">{t("loginId")}</label>
        <input
          ref={firstRef}
          id="admin-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isBackendReady}
          required
        />
        <label htmlFor="admin-password">{t("loginPw")}</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isBackendReady}
          required
        />
        {error && (
          <p className="login-dialog__error" role="alert">
            {error}
          </p>
        )}
        <div className="login-dialog__actions">
          <button type="button" onClick={onClose}>
            {t("cancel")}
          </button>
          <button type="submit" className="is-primary" disabled={!isBackendReady || pending}>
            {pending ? t("loginChecking") : t("loginSubmit")}
          </button>
        </div>
      </form>
    </div>
  );
}
