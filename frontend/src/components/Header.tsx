import { memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';

  if (isLoginOrSignup) {
    return (
      <header className="bg-yellow-300 shadow" role="banner">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <span className="font-bold text-2xl text-black bg-blue-100 px-8 py-2 rounded-full border border-blue-200 shadow-sm">
            Comment Voting System
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-yellow-300 shadow" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
            aria-label="Comment Voting - Home"
          >
            Comment Voting
          </Link>

          <nav className="flex items-center space-x-4" aria-label="Main navigation">
            {user && (
              <>
                <span className="font-bold text-black bg-blue-100 px-3 py-1 rounded-lg mr-2 border border-blue-200">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={async () => { await logout(); navigate('/login'); }}
                  className="px-4 py-2 text-sm font-bold bg-red-500 text-black rounded-md transition-transform duration-200 hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
