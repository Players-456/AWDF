import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

function NotFound() {
  return (
    <div className="not-found animate-fade-in delay-1">
      <h1 className="text-gradient" style={{ fontSize: '6rem', margin: '0' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The page you are looking for has drifted into the quantum void.
      </p>
      <Link to="/" className="project-link">
        <Home size={20} /> Return Home
      </Link>
    </div>
  );
}

export default NotFound;
