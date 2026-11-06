import { create } from "zustand";
import { loadContent, saveContent } from "@/shared/api";
import { DEFAULT_PROFILE, normalizeProfile, type ProfileContent } from "./content";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface ProfileStore {
  content: ProfileContent;
  saveStatus: SaveStatus;
  load: () => Promise<void>;
  save: (next: ProfileContent) => Promise<boolean>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  content: DEFAULT_PROFILE,
  saveStatus: "idle",
  load: async () => {
    try {
      const saved = await loadContent<ProfileContent>("readme");
      if (saved) set({ content: normalizeProfile(saved) });
    } catch {
      /* 불러오기 실패: 기본 내용으로 계속 */
    }
  },
  save: async (next) => {
    set({ saveStatus: "saving" });
    try {
      await saveContent("readme", next);
      set({ content: next, saveStatus: "saved" });
      return true;
    } catch {
      set({ saveStatus: "error" });
      return false;
    }
  },
}));
