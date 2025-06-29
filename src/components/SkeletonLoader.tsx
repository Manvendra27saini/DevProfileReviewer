
import React from 'react';

export const UserProfileSkeleton: React.FC = () => (
  <div className="user-profile skeleton">
    <div className="user-header">
      <div className="skeleton-avatar"></div>
      <div className="user-info">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-subtitle"></div>
        <div className="skeleton-text skeleton-link"></div>
      </div>
    </div>
    <div className="skeleton-text skeleton-bio"></div>
    <div className="user-stats">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="stat-item">
          <div className="skeleton-text skeleton-stat"></div>
        </div>
      ))}
    </div>
  </div>
);

export const RepoCardSkeleton: React.FC = () => (
  <div className="repo-card skeleton">
    <div className="repo-header">
      <div className="skeleton-text skeleton-repo-title"></div>
      <div className="skeleton-text skeleton-repo-stats"></div>
    </div>
    <div className="skeleton-text skeleton-description"></div>
    <div className="skeleton-text skeleton-description short"></div>
    <div className="repo-footer">
      <div className="skeleton-text skeleton-meta"></div>
    </div>
  </div>
);

export const RepoListSkeleton: React.FC = () => (
  <div className="repo-list skeleton">
    <div className="skeleton-text skeleton-title"></div>
    <div className="repo-grid">
      {[...Array(5)].map((_, i) => (
        <RepoCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
