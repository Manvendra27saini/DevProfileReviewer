
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  open_issues_count: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  html_url: string;
  user: {
    login: string;
  };
}

export interface LanguageStats {
  [language: string]: number;
}

export interface UserStats {
  totalCommits: number;
  totalPRs: number;
  openPRs: number;
  languageStats: LanguageStats;
}

export interface RepoFilters {
  language: string;
  sortBy: 'stars' | 'forks' | 'updated';
  sortOrder: 'desc' | 'asc';
}

export type Theme = 'light' | 'dark';
