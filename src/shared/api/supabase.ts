import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Supabase 클라이언트. 환경 변수가 없으면 null — 그때는 코드에 들어 있는 기본 데이터로만 동작하고
 * 관리자 기능은 "연결되지 않음"으로 안내한다.
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const isBackendReady = supabase !== null;

/** 사이트 내용을 저장하는 표 (id별 JSON 한 줄) */
export const CONTENT_TABLE = "site_content";

export type ContentKey = "desktop" | "readme";

export async function loadContent<T>(key: ContentKey): Promise<T | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from(CONTENT_TABLE).select("data").eq("id", key).maybeSingle();
  if (error) throw error;
  return (data?.data as T | undefined) ?? null;
}

export async function saveContent<T>(key: ContentKey, value: T): Promise<void> {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다");
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .upsert({ id: key, data: value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
