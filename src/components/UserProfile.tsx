
import React from 'react';
import { GitHubUser } from '../types';

interface UserProfileProps {
  user: GitHubUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <h2 className="user-name">{user.name || user.login}</h2>
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
        <p className="user-bio">{user.bio}</p>
      )}

      <div className="user-details">
        {user.company && (
          <div className="detail-item">
            <span className="detail-label">Company:</span>
            <span className="detail-value">{user.company}</span>
          </div>
        )}
        {user.location && (
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{user.location}</span>
          </div>
        )}
        {user.blog && (
          <div className="detail-item">
            <span className="detail-label">Website:</span>
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
        <div className="detail-item">
          <span className="detail-label">Joined:</span>
          <span className="detail-value">{formatDate(user.created_at)}</span>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-number">{user.public_repos}</span>
          <span className="stat-label">Repositories</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.following}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
