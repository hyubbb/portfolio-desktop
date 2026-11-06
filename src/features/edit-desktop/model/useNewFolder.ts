import { useCallback } from "react";
import { useDesktopStore } from "@/entities/desktop-item";
import { useWindowStore } from "@/entities/window";
import { translate } from "@/shared/i18n";

/** 새 폴더를 만들고 바로 연다 */
export function useNewFolder() {
  return useCallback(() => {
    const name = { ko: translate("ko", "newFolderName"), ja: translate("ja", "newFolderName") };
    const id = useDesktopStore.getState().addFolder(name);
    const folder = useDesktopStore.getState().items.find((item) => item.id === id);
    if (folder) useWindowStore.getState().open(folder.id, folder.size);
  }, []);
}
