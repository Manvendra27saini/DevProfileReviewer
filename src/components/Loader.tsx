
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
        <p>Fetching GitHub data...</p>
      </div>
    </div>
  );
};

export default Loader;
