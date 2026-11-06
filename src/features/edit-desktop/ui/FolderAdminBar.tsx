import { useState } from "react";
import { useDesktopStore, type DesktopItem } from "@/entities/desktop-item";
import { pickLocale, useT } from "@/shared/i18n";
import "./FolderAdminBar.css";

type Mode = "idle" | "rename" | "confirm-delete";

/** 편집 모드에서 폴더 창 위쪽에 붙는 도구: 이름 바꾸기, 폴더 삭제 */
export function FolderAdminBar({ folder }: { folder: DesktopItem }) {
  const t = useT();
  const { rename, remove } = useDesktopStore.getState();
  const [mode, setMode] = useState<Mode>("idle");
  const [ko, setKo] = useState(pickLocale(folder.name, "ko"));
  const [ja, setJa] = useState(pickLocale(folder.name, "ja"));

  if (mode === "rename") {
    return (
      <form
        className="folder-admin"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ko.trim()) return;
          rename(folder.id, { ko: ko.trim(), ja: ja.trim() || ko.trim() });
          setMode("idle");
        }}
      >
        <input aria-label={t("nameKo")} placeholder={t("nameKo")} value={ko} onChange={(e) => setKo(e.target.value)} autoFocus />
        <input aria-label={t("nameJa")} placeholder={t("nameJa")} value={ja} onChange={(e) => setJa(e.target.value)} />
        <button type="submit" className="is-primary">
          {t("save")}
        </button>
        <button type="button" onClick={() => setMode("idle")}>
          {t("cancel")}
        </button>
      </form>
    );
  }
  if (mode === "confirm-delete") {
    return (
      <div className="folder-admin is-danger" role="alertdialog" aria-label={t("folderDelete")}>
        <span>{t("folderDeleteConfirm")}</span>
        <button type="button" className="is-danger" onClick={() => remove(folder.id)}>
          {t("folderDelete")}
        </button>
        <button type="button" onClick={() => setMode("idle")}>
          {t("cancel")}
        </button>
      </div>
    );
  }
  return (
    <div className="folder-admin">
      <button type="button" onClick={() => setMode("rename")}>
        {t("folderRename")}
      </button>
      <button type="button" onClick={() => setMode("confirm-delete")}>
        {t("folderDelete")}
      </button>
    </div>
  );
}
