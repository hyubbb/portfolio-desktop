import type { GithubRepo } from "../model/types";

export const OTHER_LANGUAGE = "__other";

/** fork 숨김 여부를 반영해 최근 push 순으로 limit개 */
export function latestRepos(repos: GithubRepo[], { hideForks, limit }: { hideForks: boolean; limit: number }) {
  return repos
    .filter((repo) => !hideForks || !repo.fork)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, limit);
}

export function languageOf(repo: GithubRepo) {
  return repo.language ?? OTHER_LANGUAGE;
}

/** 언어별 저장소 수, 많은 순 */
export function countLanguages(repos: GithubRepo[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const repo of repos) counts.set(languageOf(repo), (counts.get(languageOf(repo)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#e2c541",
  HTML: "#e34c26",
  Swift: "#f05138",
  CSS: "#663399",
  Python: "#3572a5",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
};

export const languageColor = (language: string) => LANGUAGE_COLORS[language] ?? "#8b8f9c";
