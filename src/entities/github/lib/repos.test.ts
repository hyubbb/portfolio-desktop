import { describe, expect, it } from "vitest";
import type { GithubRepo } from "../model/types";
import { countLanguages, latestRepos, OTHER_LANGUAGE } from "./repos";
import { timeAgo } from "./timeAgo";

const repo = (name: string, pushedAt: string, language: string | null = "TypeScript", fork = false): GithubRepo => ({
  name,
  description: "",
  language,
  stars: 0,
  pushedAt,
  fork,
});

describe("github repos", () => {
  const repos = [repo("old", "2024-01-01"), repo("forked", "2026-11-01", null, true), repo("new", "2026-11-05", "Swift")];

  it("fork를 빼고 최근 push 순으로 자른다", () => {
    expect(latestRepos(repos, { hideForks: true, limit: 1 }).map((r) => r.name)).toEqual(["new"]);
    expect(latestRepos(repos, { hideForks: false, limit: 2 }).map((r) => r.name)).toEqual(["new", "forked"]);
  });

  it("언어가 없는 저장소는 기타로 센다", () => {
    expect(countLanguages(repos)).toEqual([
      ["TypeScript", 1],
      [OTHER_LANGUAGE, 1],
      ["Swift", 1],
    ]);
  });

  it("지난 기간을 번역 키로 돌려준다", () => {
    const now = new Date("2026-11-05T12:00:00");
    expect(timeAgo("2026-11-05", now)).toEqual({ key: "today" });
    expect(timeAgo("2026-11-01", now)).toEqual({ key: "daysAgo", n: 4 });
    expect(timeAgo("2026-07-26", now)).toEqual({ key: "monthsAgo", n: 3 });
    expect(timeAgo("2024-03-21", now)).toEqual({ key: "yearsAgo", n: 2 });
  });
});
