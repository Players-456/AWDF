import { useState, useEffect } from 'react';
import { ExternalLink, Code, AlertTriangle, Loader2, Star } from 'lucide-react';

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // You can change 'octocat' to your actual GitHub username
  const GITHUB_USERNAME = 'dharmit-dev';

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch repositories');
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="projects-state-container animate-fade-in delay-2">
        <Loader2 className="spinner" size={48} />
        <p>Loading projects from GitHub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-state-container error animate-fade-in delay-2">
        <AlertTriangle size={48} className="error-icon" />
        <h3>Oops! Something went wrong.</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="submit-btn" style={{ marginTop: '1rem', width: 'auto' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="projects animate-fade-in delay-2">
      <h2 className="section-title">GitHub Projects</h2>
      <div className="projects-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="glass-card project-card">
            <div className="project-header">
              <h3 className="project-title">{repo.name}</h3>
              {repo.stargazers_count > 0 && (
                <span className="stars-badge">
                  <Star size={14} fill="currentColor" /> {repo.stargazers_count}
                </span>
              )}
            </div>
            <p className="project-desc">
              {repo.description || 'No description provided.'}
            </p>
            <div className="project-links">
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="project-link">
                <Code size={20} /> View Source
              </a>
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noreferrer" className="project-link">
                  <ExternalLink size={20} /> Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
