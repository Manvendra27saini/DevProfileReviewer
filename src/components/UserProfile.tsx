import React from 'react';
import { GitHubUser, UserStats } from '../types';

interface UserProfileProps {
  user: GitHubUser;
  userStats: UserStats | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, userStats }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTopLanguages = () => {
    if (!userStats?.languageStats) return [];

    return Object.entries(userStats.languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051',
      Vue: '#4FC08D',
      React: '#61DAFB'
    };
    return colors[language] || '#6366f1';
  };

  return (
    <div className="user-profile">
      <div className="user-header">
        <img 
          src={user.avatar_url} 
          alt={`${user.login}'s avatar`}
          className="user-avatar"
        />
        <div className="user-info">
          <h2>{user.name || user.login}</h2>
          <p className="user-username">@{user.login}</p>
          <a 
            href={user.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {user.bio && (
        <div className="user-bio">
          <p>{user.bio}</p>
        </div>
      )}

      <div className="user-details">
        {user.company && (
          <div className="detail-item">
            <span className="detail-label">🏢 Company:</span>
            <span className="detail-value">{user.company}</span>
          </div>
        )}
        {user.location && (
          <div className="detail-item">
            <span className="detail-label">📍 Location:</span>
            <span className="detail-value">{user.location}</span>
          </div>
        )}
        {user.blog && (
          <div className="detail-item">
            <span className="detail-label">🌐 Website:</span>
            <a 
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-link"
            >
              {user.blog}
            </a>
          </div>
        )}
        {user.email && (
          <div className="detail-item">
            <span className="detail-label">📧 Email:</span>
            <a href={`mailto:${user.email}`} className="detail-link">
              {user.email}
            </a>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">📅 Joined:</span>
          <span className="detail-value">{formatDate(user.created_at)}</span>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-label">Public Repos</span>
          <span className="stat-number">{user.public_repos}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Followers</span>
          <span className="stat-number">{user.followers}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Following</span>
          <span className="stat-number">{user.following}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Joined</span>
          <span className="stat-number">{new Date(user.created_at).getFullYear()}</span>
        </div>
      </div>

      {userStats && getTopLanguages().length > 0 && (
        <div className="languages-section">
          <h4>Top Languages</h4>
          <div className="languages-grid">
            {getTopLanguages().map(([language, count]) => (
              <div key={language} className="language-item">
                <div className="language-info">
                  <span 
                    className="language-dot" 
                    style={{ backgroundColor: getLanguageColor(language) }}
                  ></span>
                  <span className="language-name">{language}</span>
                </div>
                <span className="language-count">{count} repos</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;