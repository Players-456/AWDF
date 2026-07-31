import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, FolderGit2, Mail } from 'lucide-react';

function NavBar() {
  const location = useLocation();
  
  const navLinks = [
    { path: '/',         label: 'Home',     icon: <Home size={18} />      },
    { path: '/skills',   label: 'Skills',   icon: <Zap size={18} />       },
    { path: '/projects', label: 'Projects', icon: <FolderGit2 size={18} />},
    { path: '/contact',  label: 'Contact',  icon: <Mail size={18} />      },
  ];

  return (
    <nav className="navbar animate-fade-in">
      <div className="nav-brand">DM.</div>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
