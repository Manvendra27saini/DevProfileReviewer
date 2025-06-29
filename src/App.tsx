
import React, { useState } from 'react';
import './App.css';
import UserProfile from './components/UserProfile';
import RepoList from './components/RepoList';
import Loader from './components/Loader';
import { GitHubUser, GitHubRepo } from './types';

export default function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserData = async (searchUsername: string) => {
    if (!searchUsername.trim()) return;
    
    setLoading(true);
    setError('');
    setUser(null);
    setRepos([]);

    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${searchUsername}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData = await userResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=5`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const reposData = await reposResponse.json();

      setUser(userData);
      setRepos(reposData);
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
            <UserProfile user={user} />
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
