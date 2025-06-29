import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import styled, { ThemeProvider } from 'styled-components';

// Define types
interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

interface User {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  html_url: string;
}

// Theme context
interface Theme {
  body: string;
  text: string;
  toggleBorder: string;
  background: string;
  repoCardBg: string;
  skeletonBg: string;
  skeletonHighlight: string;
}

const lightTheme: Theme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#FFF',
  background: '#F0F0F0',
  repoCardBg: '#FFF',
  skeletonBg: '#F0F0F0',
  skeletonHighlight: '#FFFFFF',
};

const darkTheme: Theme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  background: '#363537',
  repoCardBg: '#444444',
  skeletonBg: '#333333',
  skeletonHighlight: '#444444',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

// Theme Toggle Component
const Toggle = styled.button`
  background: ${({ theme }) => theme.background};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 30px;
  cursor: pointer;
  font-size:0.8rem;
  padding: 0.6rem;

  &:focus {
    outline: none;
  }
`;

// Styled Components
const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  transition: background-color 0.3s ease;
`;

const SearchBar = styled.input`
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const RepoListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const RepoCard = styled.div`
  background-color: ${({ theme }) => theme.repoCardBg};
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  color: ${({ theme }) => theme.text};

  &:hover {
    transform: translateY(-5px);
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const SkeletonRepoCard = styled.div`
  background-color: ${({ theme }) => theme.skeletonBg};
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 150px;
  animation: skeleton-loading 1s linear infinite alternate;
  color: ${({ theme }) => theme.text};

  @keyframes skeleton-loading {
    0% {
      background-color: ${({ theme }) => theme.skeletonBg};
    }
    100% {
      background-color: ${({ theme }) => theme.skeletonHighlight};
    }
  }
`;

const LanguageFilter = styled.select`
  padding: 8px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const SortBy = styled.select`
  padding: 8px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

// Components
interface RepoListProps {
    repos: Repo[];
    title?: string;
}

function RepoList({ repos, title }: RepoListProps) {
    return (
        <div>
            {title && <h2>{title}</h2>}
            <RepoListContainer>
                {repos.map((repo) => (
                    <RepoCard key={repo.id}>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            <h3>{repo.name}</h3>
                            <p>{repo.description}</p>
                            <p>Language: {repo.language}</p>
                            <p>Stars: {repo.stargazers_count} | Forks: {repo.forks_count}</p>
                            <p>Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                        </a>
                    </RepoCard>
                ))}
            </RepoListContainer>
        </div>
    );
}

function SkeletonRepoList() {
  const { theme } = useTheme();
    return (
        <RepoListContainer>
            {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonRepoCard key={index} theme={theme} />
            ))}
        </RepoListContainer>
    );
}

function Profile({ username }: { username: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('stars');
  const [pinnedRepos, setPinnedRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            setError('User not found');
          } else {
            setError('Failed to fetch user');
          }
          setLoading(false);
          return;
        }
        const userData: User = await userResponse.json();
        setUser(userData);

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repos');
        }
        const reposData: Repo[] = await reposResponse.json();
        setRepos(reposData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  useEffect(() => {
    // Sort Repos
    let sortedRepos = [...repos];
    switch (sortBy) {
      case 'stars':
        sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'forks':
        sortedRepos.sort((a, b) => b.forks_count - a.forks_count);
        break;
      case 'updated':
        sortedRepos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      default:
        break;
    }

    // Filter Repos
    let filteredRepos = [...sortedRepos];
    if (languageFilter !== 'all') {
      filteredRepos = filteredRepos.filter(repo => repo.language === languageFilter);
    }

    // Pin Repos (Top 3 by stars)
    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3);
    setPinnedRepos(topRepos);
    setRepos(filteredRepos); // Update repos state with the filtered repos

  }, [repos, languageFilter, sortBy]); // Effect runs when repos, languageFilter, or sortBy changes

  const availableLanguages = ['all', ...new Set(repos.map(repo => repo.language).filter(Boolean))];

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {loading ? (
        <>
          <ProfileContainer>
            <SkeletonRepoList />
          </ProfileContainer>
        </>
      ) : user ? (
        <>
          <ProfileContainer>
            <Avatar src={user.avatar_url} alt="User Avatar" />
            <h2>
              <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                {user.name || user.login}
              </a>
            </h2>
            <p>{user.bio}</p>
            <p>Location: {user.location}</p>
          </ProfileContainer>
          <LanguageFilter
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </LanguageFilter>
          <SortBy value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="stars">Sort by Stars</option>
            <option value="forks">Sort by Forks</option>
            <option value="updated">Sort by Updated Date</option>
          </SortBy>
          <RepoList repos={pinnedRepos} title="Pinned Repositories" />
          <RepoList repos={repos} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('manvendra17');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = (newUsername: string) => {
    if (newUsername && !searchHistory.includes(newUsername)) {
      setSearchHistory(prevHistory => [newUsername, ...prevHistory.slice(0, 4)]);
    }
    setUsername(newUsername);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <AppContainer>
      <h1>DevProfile Viewer</h1>
      <SearchBar
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(username);
          }
        }}
      />
       <Profile username={username} />
    </AppContainer>
  );
}

function Root() {
    const [theme, setTheme] = useState<Theme>(lightTheme);

    const toggleTheme = () => {
        setTheme(theme === lightTheme ? darkTheme : lightTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <React.StrictMode>
                    <Toggle onClick={toggleTheme}>Switch Theme</Toggle>
                    <App />
                </React.StrictMode>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<Root />);