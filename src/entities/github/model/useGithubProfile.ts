import { useEffect, useState } from "react";
import { fetchGithubProfile } from "../api/fetchGithubProfile";
import { GITHUB_SNAPSHOT } from "./snapshot";
import type { GithubProfile } from "./types";

export type GithubSource = "loading" | "live" | "snapshot";

const TIMEOUT_MS = 6000;

/**
 * 실시간 데이터를 먼저 시도하고, 6초 안에 못 받거나 실패하면 저장본으로 대신한다.
 * 창을 닫으면(언마운트) 요청을 취소한다.
 */
export function useGithubProfile(user: string): { profile: GithubProfile | null; source: GithubSource } {
  const [state, setState] = useState<{ profile: GithubProfile | null; source: GithubSource }>({
    profile: null,
    source: "loading",
  });

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetchGithubProfile(user, controller.signal)
      .then((profile) => {
        if (!unmounted) setState({ profile, source: "live" });
      })
      .catch(() => {
        if (!unmounted) setState({ profile: GITHUB_SNAPSHOT, source: "snapshot" });
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      unmounted = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [user]);

  return state;
}
