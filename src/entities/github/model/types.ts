export interface GithubUser {
  login: string;
  name: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  location: string | null;
  avatarUrl: string | null;
}

export interface GithubRepo {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  /** YYYY-MM-DD, 마지막 push 날짜 */
  pushedAt: string;
  fork: boolean;
}

export interface GithubProfile {
  user: GithubUser;
  repos: GithubRepo[];
}
