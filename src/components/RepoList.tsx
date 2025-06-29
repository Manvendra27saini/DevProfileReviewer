
import React from 'react';
import { GitHubRepo } from '../types';
import RepoCard from './RepoCard';

interface RepoListProps {
  repos: GitHubRepo[];
  title?: string;
}

const RepoList: React.FC<RepoListProps> = ({ repos, title }) => {
  if (repos.length === 0) {
    return (
      <div className="repo-list">
        <h3>Repositories</h3>
        <p className="no-repos">No repositories found with current filters.</p>
      </div>
    );
  }

  return (
    <div className="repo-list">
      <h3>{title || `Top ${repos.length} Repositories`}</h3>
      <div className="repo-grid">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default RepoList;
