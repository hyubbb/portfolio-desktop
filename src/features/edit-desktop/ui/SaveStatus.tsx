import { useDesktopStore } from "@/entities/desktop-item";
import { useProfileStore } from "@/entities/profile";
import { useT } from "@/shared/i18n";
import "./SaveStatus.css";

/** 메뉴 막대의 "편집 중 · 저장됨" 표시 */
export function SaveStatus() {
  const t = useT();
  const desktop = useDesktopStore((s) => s.saveStatus);
  const profile = useProfileStore((s) => s.saveStatus);
  const status = desktop === "error" || profile === "error" ? "error" : desktop === "saving" || profile === "saving" ? "saving" : desktop === "saved" || profile === "saved" ? "saved" : "idle";
  return (
    <span className={`save-status is-${status}`} role="status">
      <i aria-hidden="true" />
      {t("editing")}
      {status !== "idle" && ` · ${t(status === "error" ? "saveError" : status)}`}
    </span>
  );
}
