
import React from 'react';
import { RepoFilters, GitHubRepo } from '../types';

interface RepoFiltersProps {
  filters: RepoFilters;
  onFiltersChange: (filters: RepoFilters) => void;
  repos: GitHubRepo[];
}

const RepoFiltersComponent: React.FC<RepoFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  repos 
}) => {
  
  const languages = Array.from(
    new Set(repos.map(repo => repo.language).filter(Boolean))
  ).sort();

  const handleLanguageChange = (language: string) => {
    onFiltersChange({ ...filters, language });
  };

  const handleSortChange = (sortBy: RepoFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleOrderChange = () => {
    onFiltersChange({ 
      ...filters, 
      sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' 
    });
  };

  return (
    <div className="repo-filters">
      <div className="filter-group">
        <label htmlFor="language-filter">Filter by Language:</label>
        <select
          id="language-filter"
          value={filters.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Languages</option>
          {languages.map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter">Sort by:</label>
        <select
          id="sort-filter"
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as RepoFilters['sortBy'])}
          className="filter-select"
        >
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
          <option value="updated">Last Updated</option>
        </select>
      </div>

      <div className="filter-group">
        <button
          onClick={handleOrderChange}
          className="sort-order-button"
          title={`Sort ${filters.sortOrder === 'desc' ? 'ascending' : 'descending'}`}
        >
          {filters.sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>
    </div>
  );
};

export default RepoFiltersComponent;
