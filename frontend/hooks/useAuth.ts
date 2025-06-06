// Authentication hook for managing user state
import { useState, useEffect } from "react";
import { AuthService } from "../services/authService";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken && storedUser) {
          try {
            // Try to refresh the token to ensure it's still valid
            const refreshResponse = await AuthService.refreshToken();
            setAuthState({
              user: refreshResponse.user,
              token: refreshResponse.accessToken,
              isLoading: false,
            });
            // Update stored data with new token
            localStorage.setItem("auth_token", refreshResponse.accessToken);
            localStorage.setItem(
              "auth_user",
              JSON.stringify(refreshResponse.user)
            );
          } catch (refreshError) {
            // If refresh fails, clear stored data
            console.warn(
              "Token refresh failed, clearing stored auth:",
              refreshError
            );
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error checking stored auth:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkStoredAuth();
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setAuthState({ user, token, isLoading: false });
  };

  const logout = async () => {
    try {
      if (authState.token) {
        await AuthService.logout(authState.token);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setAuthState({ user: null, token: null, isLoading: false });
    }
  };

  const refreshUserToken = async () => {
    try {
      const response = await AuthService.refreshToken();
      login(response.user, response.accessToken);
      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshUserToken,
  };
};
