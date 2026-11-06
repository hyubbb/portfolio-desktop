import type { Lang } from "@/shared/i18n";

/** README 창 내용. 관리자 모드에서 바로 고칠 수 있다 */
export interface ProfileContent {
  name: Record<Lang, string>;
  body: Record<Lang, string>;
  email: string;
  phone: string;
}

export const DEFAULT_PROFILE: ProfileContent = {
  name: { ko: "이창협", ja: "イ・チャンヒョップ" },
  body: {
    ko: "React · Next.js 프론트엔드 개발자입니다. 사용자가 불편해서 멈추는 지점을 찾아 고치고, 반복되는 일은 도구로 바꾸는 걸 좋아합니다.",
    ja: "React・Next.js のフロントエンドエンジニアです。ユーザーが不便で手を止めてしまうところを見つけて直し、繰り返しの作業はツールに置き換えるのが好きです。",
  },
  email: "dlckdguq1011@naver.com",
  phone: "010-4533-9426",
};

export function normalizeProfile(raw: unknown): ProfileContent {
  if (!raw || typeof raw !== "object") return DEFAULT_PROFILE;
  const v = raw as Partial<ProfileContent>;
  return {
    name: { ...DEFAULT_PROFILE.name, ...(v.name ?? {}) },
    body: { ...DEFAULT_PROFILE.body, ...(v.body ?? {}) },
    email: typeof v.email === "string" ? v.email : DEFAULT_PROFILE.email,
    phone: typeof v.phone === "string" ? v.phone : DEFAULT_PROFILE.phone,
  };
}
