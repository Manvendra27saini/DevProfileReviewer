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
    language: null,
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

    setFilteredRepos(filtered.slice(0, 50)); // Show top 50 after filtering
  }, [allRepos, filters]);

  const saveSearchHistory = (searchUsername: string) => {
    const newHistory = [searchUsername, ...searchHistory.filter(h => h !== searchUsername)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('devprofile-search-history', JSON.stringify(newHistory));
  };

  const fetchUserData = async (searchUsername: string) => {
    if (!searchUsername.trim()) return;
    
    // Validate GitHub username format
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernameRegex.test(searchUsername)) {
      setError('Please enter a valid GitHub username (letters, numbers, and hyphens only)');
      return;
    }
    
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
        if (userResponse.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();

      // Fetch repositories with smaller page size to reduce API load
      const allReposResponse = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=30`);
      if (!allReposResponse.ok) {
        if (allReposResponse.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error('Failed to fetch repositories');
      }
      const allReposData = await allReposResponse.json();

      // Calculate language statistics from repositories
      const languageStats: { [key: string]: number } = {};
      allReposData.forEach((repo: GitHubRepo) => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Create simple stats without additional API calls
      const stats: UserStats = {
        totalCommits: 0, // Not fetched to avoid rate limits
        totalPRs: 0,     // Not fetched to avoid rate limits
        openPRs: 0,      // Not fetched to avoid rate limits
        languageStats
      };

      setUser(userData);
      setAllRepos(allReposData);
      setUserStats(stats);
      saveSearchHistory(searchUsername);
      
      console.log(`Successfully fetched ${allReposData.length} repositories for ${searchUsername}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
      setError(errorMessage);
      console.error('Error fetching user data:', {
        error: err,
        username: searchUsername,
        message: errorMessage
      });
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
