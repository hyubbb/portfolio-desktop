import { useEffect, useRef, useState } from "react";
import { useSessionStore } from "@/entities/session";
import { AdminLoginDialog } from "@/features/admin-login";
import { SaveStatus, useNewFolder } from "@/features/edit-desktop";
import { useT } from "@/shared/i18n";

/** 왼쪽 위 "hyub" 메뉴 (맥의 사과 메뉴 자리). 관리자 로그인과 편집 도구가 들어 있다 */
export function AppMenu() {
  const t = useT();
  const status = useSessionStore((s) => s.status);
  const signOut = useSessionStore((s) => s.signOut);
  const newFolder = useNewFolder();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isAdmin = status === "admin";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey, true);
    rootRef.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  return (
    <div className="app-menu" ref={rootRef}>
      <button
        type="button"
        className="menu-bar__brand"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <i aria-hidden="true" />
        hyub
      </button>
      {isAdmin && <SaveStatus />}
      {open && (
        <div className="app-menu__list" role="menu">
          {isAdmin ? (
            <>
              <button type="button" role="menuitem" onClick={run(newFolder)}>
                {t("appMenuNewFolder")}
              </button>
              <hr />
              <button type="button" role="menuitem" onClick={run(() => void signOut())}>
                {t("appMenuExit")}
              </button>
            </>
          ) : (
            <button type="button" role="menuitem" disabled={status === "checking"} onClick={run(() => setLoginOpen(true))}>
              {t("appMenuAdmin")}
            </button>
          )}
        </div>
      )}
      {loginOpen && <AdminLoginDialog onClose={() => setLoginOpen(false)} />}
    </div>
  );
}
