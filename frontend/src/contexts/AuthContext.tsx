import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, signupUser, logoutUser, refreshToken } from '../api/auth';
import type { AuthResponse } from '../api/auth';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to update auth state
  const updateAuthState = (response: AuthResponse) => {
    setToken(response.accessToken);
    setUser(response.user);
    localStorage.setItem('token', response.accessToken);
  };

  // Function to clear auth state
  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // Initialize auth state and set up refresh token interval
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    const initAuth = async () => {
      try {
        // Always attempt to refresh session on mount
        const response = await refreshToken();
        updateAuthState(response);
        // Set up refresh token interval (every 14 minutes)
        refreshInterval = setInterval(async () => {
          try {
            const response = await refreshToken();
            updateAuthState(response);
          } catch (err) {
            clearAuthState();
            clearInterval(refreshInterval);
          }
        }, 14 * 60 * 1000); // 14 minutes
      } catch (err) {
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await loginUser({ email, password });
      updateAuthState(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      const response = await signupUser({ email, password, username });
      updateAuthState(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } finally {
      clearAuthState();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 