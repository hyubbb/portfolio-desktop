import { useEffect } from "react";
import { useDesktopStore } from "@/entities/desktop-item";
import { useProfileStore } from "@/entities/profile";
import { useSessionStore } from "@/entities/session";
import { DesktopPage } from "@/pages/desktop";

export function App() {
  // 저장된 바탕화면 구성과 README를 불러오고, 관리자 로그인 상태를 확인한다
  useEffect(() => {
    void useDesktopStore.getState().load();
    void useProfileStore.getState().load();
    return useSessionStore.getState().init();
  }, []);
  return <DesktopPage />;
}
