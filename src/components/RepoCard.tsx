
import React from 'react';
import { GitHubRepo } from '../types';

interface RepoCardProps {
  repo: GitHubRepo;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
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
    return colors[language || ''] || '#6366f1';
  };

  return (
    <div className="repo-card">
      <div className="repo-header">
        <h4 className="repo-name">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="repo-link"
          >
            {repo.name}
          </a>
        </h4>
        <div className="repo-stats">
          <span className="repo-stars">⭐ {repo.stargazers_count}</span>
          <span className="repo-forks">🍴 {repo.forks_count}</span>
        </div>
      </div>

      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      <div className="repo-footer">
        <div className="repo-meta">
          {repo.language && (
            <div className="repo-language">
              <span 
                className="language-dot" 
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              ></span>
              {repo.language}
            </div>
          )}
          <span className="repo-updated">
            Updated {formatDate(repo.updated_at)}
          </span>
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="repo-topics">
            {repo.topics.slice(0, 3).map((topic) => (
              <span key={topic} className="topic-tag">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
