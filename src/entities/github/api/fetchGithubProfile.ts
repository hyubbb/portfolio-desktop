import type { GithubProfile, GithubRepo } from "../model/types";

const API = "https://api.github.com";

interface ApiUser {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  avatar_url: string;
}

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
  fork: boolean;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return (await res.json()) as T;
}

export function toRepo(raw: ApiRepo): GithubRepo {
  return {
    name: raw.name,
    description: raw.description?.trim() ?? "",
    language: raw.language,
    stars: raw.stargazers_count,
    pushedAt: (raw.pushed_at ?? "").slice(0, 10),
    fork: raw.fork,
  };
}

/** 공개 API(인증 없음)로 프로필과 최근 push 순 저장소를 가져온다 */
export async function fetchGithubProfile(user: string, signal?: AbortSignal): Promise<GithubProfile> {
  const [u, repos] = await Promise.all([
    getJson<ApiUser>(`${API}/users/${user}`, signal),
    getJson<ApiRepo[]>(`${API}/users/${user}/repos?sort=pushed&per_page=100`, signal),
  ]);
  return {
    user: {
      login: u.login,
      name: u.name,
      publicRepos: u.public_repos,
      followers: u.followers,
      following: u.following,
      location: u.location,
      avatarUrl: u.avatar_url,
    },
    repos: repos.map(toRepo),
  };
}
