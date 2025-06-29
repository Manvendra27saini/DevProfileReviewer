
import React, { useState } from 'react';
import './App.css';
import UserProfile from './components/UserProfile';
import RepoList from './components/RepoList';
import Loader from './components/Loader';
import { GitHubUser, GitHubRepo, UserStats } from './types';

export default function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserData = async (searchUsername: string) => {
    if (!searchUsername.trim()) return;
    
    setLoading(true);
    setError('');
    setUser(null);
    setRepos([]);
    setUserStats(null);

    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${searchUsername}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData = await userResponse.json();

      // Fetch all repositories (not just top 5)
      const allReposResponse = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=100`);
      if (!allReposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const allReposData = await allReposResponse.json();

      // Fetch top 5 repositories for display
      const topRepos = allReposData.slice(0, 5);

      // Calculate language statistics
      const languageStats: { [key: string]: number } = {};
      allReposData.forEach((repo: GitHubRepo) => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Fetch commit and PR statistics
      let totalCommits = 0;
      let totalPRs = 0;
      let openPRs = 0;

      // Use Promise.all for parallel requests (limited to prevent rate limiting)
      const repoPromises = allReposData.slice(0, 10).map(async (repo: GitHubRepo) => {
        try {
          // Fetch commits for each repo
          const commitsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?author=${searchUsername}&per_page=100`);
          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            totalCommits += commits.length;
          }

          // Fetch PRs for each repo
          const prsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=100`);
          if (prsResponse.ok) {
            const prs = await prsResponse.json();
            const userPRs = prs.filter((pr: any) => pr.user.login === searchUsername);
            totalPRs += userPRs.length;
            openPRs += userPRs.filter((pr: any) => pr.state === 'open').length;
          }
        } catch (err) {
          // Silently handle individual repo errors
          console.warn(`Failed to fetch data for repo ${repo.name}:`, err);
        }
      });

      await Promise.all(repoPromises);

      const stats: UserStats = {
        totalCommits,
        totalPRs,
        openPRs,
        languageStats
      };

      setUser(userData);
      setRepos(topRepos);
      setUserStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData(username);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>DevProfile Viewer</h1>
        <p>Discover GitHub profiles and repositories</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading || !username.trim()}>
              Search
            </button>
          </div>
        </form>

        {loading && <Loader />}

        {error && (
          <div className="error-container">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => setError('')} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {user && !loading && !error && (
          <div className="results-container">
            <UserProfile user={user} userStats={userStats} />
            <RepoList repos={repos} />
          </div>
        )}

        {!user && !loading && !error && username && (
          <div className="empty-state">
            <h3>No results found</h3>
            <p>Try searching for a different GitHub username</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React & GitHub API</p>
      </footer>
    </div>
  );
}
