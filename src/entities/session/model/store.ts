import { create } from "zustand";
import { supabase } from "@/shared/api";

type SessionStatus = "checking" | "guest" | "admin";

interface SessionStore {
  status: SessionStatus;
  email: string | null;
  /** 저장된 로그인 상태를 확인하고, 이후 변화를 구독한다 */
  init: () => () => void;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; reason: "not-configured" | "invalid" | "network" }>;
  signOut: () => Promise<void>;
}

/**
 * 관리자 로그인 상태. 회원가입은 막아 두고 관리자 계정 하나만 Supabase에 만들어 쓴다.
 * 실제 수정 권한은 서버(RLS 정책)가 관리자 이메일로 한 번 더 검사한다.
 */
export const useSessionStore = create<SessionStore>((set) => ({
  status: supabase ? "checking" : "guest",
  email: null,

  init: () => {
    if (!supabase) return () => {};
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? null;
      set({ status: email ? "admin" : "guest", email });
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user.email ?? null;
      set({ status: email ? "admin" : "guest", email });
    });
    return () => data.subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    if (!supabase) return { ok: false, reason: "not-configured" };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) return { ok: false, reason: "invalid" };
      set({ status: "admin", email: data.session.user.email ?? email });
      return { ok: true };
    } catch {
      return { ok: false, reason: "network" };
    }
  },

  signOut: async () => {
    await supabase?.auth.signOut();
    set({ status: "guest", email: null });
  },
}));

export const useIsAdmin = () => useSessionStore((s) => s.status === "admin");
