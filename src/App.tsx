
import React, { useState, useEffect } from 'react';
import './App.css';
import UserProfile from './components/UserProfile';
import RepoList from './components/RepoList';
import RepoFilters from './components/RepoFilters';
import ThemeToggle from './components/ThemeToggle';
import { UserProfileSkeleton, RepoListSkeleton } from './components/SkeletonLoader';
import { ThemeProvider } from './contexts/ThemeContext';
import { GitHubUser, GitHubRepo, UserStats, RepoFilters as RepoFiltersType } from './types';

function AppContent() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filters, setFilters] = useState<RepoFiltersType>({
    language: '',
    sortBy: 'stars',
    sortOrder: 'desc'
  });

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('devprofile-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    if (userParam) {
      setUsername(userParam);
      fetchUserData(userParam);
    }
  }, []);

  // Update URL when user is loaded
  useEffect(() => {
    if (user) {
      const url = new URL(window.location.href);
      url.searchParams.set('user', user.login);
      window.history.replaceState({}, '', url.toString());
    }
  }, [user]);

  // Filter and sort repositories
  useEffect(() => {
    let filtered = [...allRepos];

    // Filter by language
    if (filters.language) {
      filtered = filtered.filter(repo => repo.language === filters.language);
    }

    // Sort repositories
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (filters.sortBy) {
        case 'stars':
          aValue = a.stargazers_count;
          bValue = b.stargazers_count;
          break;
        case 'forks':
          aValue = a.forks_count;
          bValue = b.forks_count;
          break;
        case 'updated':
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }

      return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    setFilteredRepos(filtered.slice(0, 10)); // Show top 10 after filtering
  }, [allRepos, filters]);

  const saveSearchHistory = (searchUsername: string) => {
    const newHistory = [searchUsername, ...searchHistory.filter(h => h !== searchUsername)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('devprofile-search-history', JSON.stringify(newHistory));
  };

  const fetchUserData = async (searchUsername: string) => {
    if (!searchUsername.trim()) return;
    
    setLoading(true);
    setError('');
    setUser(null);
    setAllRepos([]);
    setFilteredRepos([]);
    setUserStats(null);

    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${searchUsername}`);
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error(`User "${searchUsername}" not found. Please check the username and try again.`);
        }
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();

      // Fetch all repositories
      const allReposResponse = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=100`);
      if (!allReposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const allReposData = await allReposResponse.json();

      // Calculate language statistics
      const languageStats: { [key: string]: number } = {};
      allReposData.forEach((repo: GitHubRepo) => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Fetch commit and PR statistics (limited to prevent rate limiting)
      let totalCommits = 0;
      let totalPRs = 0;
      let openPRs = 0;

      const repoPromises = allReposData.slice(0, 10).map(async (repo: GitHubRepo) => {
        try {
          const commitsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?author=${searchUsername}&per_page=100`);
          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            totalCommits += commits.length;
          }

          const prsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=100`);
          if (prsResponse.ok) {
            const prs = await prsResponse.json();
            const userPRs = prs.filter((pr: any) => pr.user.login === searchUsername);
            totalPRs += userPRs.length;
            openPRs += userPRs.filter((pr: any) => pr.state === 'open').length;
          }
        } catch (err) {
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
      setAllRepos(allReposData);
      setUserStats(stats);
      saveSearchHistory(searchUsername);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHistory(false);
    fetchUserData(username);
  };

  const handleHistorySelect = (historyUsername: string) => {
    setUsername(historyUsername);
    setShowHistory(false);
    fetchUserData(historyUsername);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>DevProfile Viewer</h1>
            <p>Discover GitHub profiles and repositories</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <div className="search-input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                placeholder="Enter GitHub username..."
                className="search-input"
                disabled={loading}
              />
              {showHistory && searchHistory.length > 0 && (
                <div className="search-history">
                  {searchHistory.map((historyItem, index) => (
                    <button
                      key={index}
                      type="button"
                      className="history-item"
                      onClick={() => handleHistorySelect(historyItem)}
                    >
                      {historyItem}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="search-button" disabled={loading || !username.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-container">
            <UserProfileSkeleton />
            <RepoListSkeleton />
          </div>
        )}

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
            <div className="repo-section">
              <RepoFilters 
                filters={filters}
                onFiltersChange={setFilters}
                repos={allRepos}
              />
              <RepoList 
                repos={filteredRepos} 
                title={`Top ${filteredRepos.length} Repositories${filters.language ? ` (${filters.language})` : ''}`}
              />
            </div>
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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
