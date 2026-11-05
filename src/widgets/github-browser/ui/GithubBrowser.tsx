import { useMemo, useState } from "react";
import {
  countLanguages,
  languageColor,
  languageOf,
  latestRepos,
  OTHER_LANGUAGE,
  SNAPSHOT_DATE,
  timeAgo,
  useGithubProfile,
  type GithubRepo,
} from "@/entities/github";
import { useT } from "@/shared/i18n";
import { RepoIcon } from "@/shared/ui";
import "./GithubBrowser.css";

const LIMIT = 16;
const ALL = "__all";

function RepoRow({ repo, user }: { repo: GithubRepo; user: string }) {
  const t = useT();
  const ago = timeAgo(repo.pushedAt);
  return (
    <a className="gh-row" href={`https://github.com/${user}/${encodeURIComponent(repo.name)}`} target="_blank" rel="noopener noreferrer">
      <span className="gh-row__name">
        <RepoIcon />
        <b>{repo.name}</b>
        {repo.fork && <i>fork</i>}
        {repo.description && <small>{repo.description}</small>}
      </span>
      <span className="gh-row__meta">
        {repo.language ? (
          <>
            <em style={{ background: languageColor(repo.language) }} />
            {repo.language}
          </>
        ) : (
          "—"
        )}
      </span>
      <span className="gh-row__meta gh-row__date">{ago.key === "today" ? t("today") : t(ago.key, { n: ago.n })}</span>
    </a>
  );
}

/** GitHub 프로필과 최근 저장소를 Finder처럼 보여 주는 창 */
export function GithubBrowser({ user }: { user: string }) {
  const t = useT();
  const { profile, source } = useGithubProfile(user);
  const [query, setQuery] = useState("");
  const [hideForks, setHideForks] = useState(true);
  const [language, setLanguage] = useState(ALL);

  const top = useMemo(() => (profile ? latestRepos(profile.repos, { hideForks, limit: LIMIT }) : []), [profile, hideForks]);
  const languages = useMemo(() => countLanguages(top), [top]);
  const activeLanguage = language === ALL || languages.some(([l]) => l === language) ? language : ALL;
  const rows = top.filter((repo) => {
    if (activeLanguage !== ALL && languageOf(repo) !== activeLanguage) return false;
    const q = query.trim().toLowerCase();
    return !q || `${repo.name} ${repo.description}`.toLowerCase().includes(q);
  });
  const languageLabel = (l: string) => (l === ALL ? t("ghAll") : l === OTHER_LANGUAGE ? t("ghOther") : l);

  return (
    <div className="gh">
      <aside className="gh__side">
        <div className="gh__avatar">
          {profile?.user.avatarUrl ? <img src={profile.user.avatarUrl} alt="" /> : (profile?.user.name ?? user).charAt(0).toUpperCase()}
        </div>
        <div className="gh__name">{profile?.user.name ?? user}</div>
        <div className="gh__login">@{user}</div>
        {profile && (
          <div className="gh__stats">
            <span><b>{profile.user.publicRepos}</b> {t("ghRepos")}</span>
            <span><b>{profile.user.followers}</b> {t("ghFollowers")}</span>
            <span><b>{profile.user.following}</b> {t("ghFollowing")}</span>
            {profile.user.location && <span className="gh__location">{profile.user.location}</span>}
          </div>
        )}
        <div className="gh__section">{t("ghLang")}</div>
        <div className="gh__languages">
          {[[ALL, top.length] as [string, number], ...languages].map(([l, n]) => (
            <button key={l} type="button" className={l === activeLanguage ? "is-active" : undefined} onClick={() => setLanguage(l)}>
              {l !== ALL && <em style={{ background: languageColor(l) }} />}
              {languageLabel(l)}
              <span>{n}</span>
            </button>
          ))}
        </div>
        <label className="gh__fork" htmlFor="gh-hide-forks">
          <input id="gh-hide-forks" type="checkbox" checked={hideForks} onChange={(e) => setHideForks(e.target.checked)} />
          {t("ghFork")}
        </label>
        <a className="gh__open" href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">
          {t("ghOpen")}
        </a>
      </aside>
      <div className="gh__main">
        <div className="gh__toolbar">
          <input id="gh-search" type="search" placeholder={t("ghSearch")} aria-label={t("ghSearch")} value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="gh__count">{t("ghCount", { n: rows.length })}</span>
        </div>
        <div className="gh__head">
          <span>{t("ghName")}</span>
          <span>{t("ghLang")}</span>
          <span className="gh-row__date">{t("ghUpdated")}</span>
        </div>
        <div className="gh__list">
          {profile && rows.map((repo) => <RepoRow key={repo.name} repo={repo} user={user} />)}
          {profile && rows.length === 0 && <p className="gh__empty">{t("ghEmpty")}</p>}
        </div>
        <div className="gh__status">
          <span className={`gh__dot is-${source}`} />
          {source === "loading" ? t("ghLoading") : source === "live" ? t("ghLive") : t("ghSaved", { d: SNAPSHOT_DATE })}
        </div>
      </div>
    </div>
  );
}
