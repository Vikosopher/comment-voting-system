// Authentication API endpoints
import { API_CONFIG, getAuthHeaders } from "../config/api";
import { ApiError, handleApiError } from "../utils/errors";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  accessToken: string;
}

const API_BASE_URL = API_CONFIG.BASE_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Request failed', response.status);
  }
  return response.json();
};

export const loginUser = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include", // For refresh token cookies
        body: JSON.stringify(credentials),
      }
    );
    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred');
  }
};

export const signupUser = async (
  userData: SignupRequest
): Promise<AuthResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNUP}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(userData),
      }
    );
    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred');
  }
};

export const logoutUser = async (token: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
      {
        method: "POST",
        headers: getAuthHeaders(token),
        credentials: "include",
      }
    );
    await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred');
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
};
