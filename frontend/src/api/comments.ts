// Comments API endpoints
import { API_CONFIG, getAuthHeaders } from "../config/api";
import { ApiError, handleApiError } from "../utils/errors";

export interface Comment {
  _id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  userVote?: "upvote" | "downvote" | null;
}

export interface CreateCommentRequest {
  content: string;
}

export interface VoteRequest {
  voteType: "upvote" | "downvote";
}

const API_BASE_URL = API_CONFIG.BASE_URL;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Request failed', response.status);
  }
  return response.json();
};

// Get all comments sorted by creation date (recent)
export const fetchComments = async (token?: string): Promise<Comment[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.COMMENTS.LIST}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
        credentials: "include",
      }
    );
    const data = await handleResponse<{ comments: Comment[] }>(response);
    return Array.isArray(data.comments) ? data.comments : [];
  } catch (error) {
    return [];
  }
};

// Get comments sorted by highest votes (top)
export const fetchTopComments = async (token?: string): Promise<Comment[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.COMMENTS.TOP}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
        credentials: "include",
      }
    );
    const data = await handleResponse<{ comments: Comment[] }>(response);
    return Array.isArray(data.comments) ? data.comments : [];
  } catch (error) {
    return [];
  }
};

// Create a new comment
export const createComment = async (
  commentData: CreateCommentRequest,
  token?: string
): Promise<Comment> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_CONFIG.ENDPOINTS.COMMENTS.CREATE}`,
      {
        method: "POST",
        headers: getAuthHeaders(token),
        credentials: "include",
        body: JSON.stringify(commentData),
      }
    );
    return handleResponse<Comment>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to create comment');
  }
};

// Vote on a comment (upvote/downvote with toggle support)
export const voteOnComment = async (
  commentId: string,
  voteData: VoteRequest,
  token: string
): Promise<Comment> => {
  try {
    const voteUrl = `${API_BASE_URL}${API_CONFIG.ENDPOINTS.COMMENTS.VOTE.replace(
      ":id",
      commentId
    )}`;

    const response = await fetch(voteUrl, {
      method: "POST",
      headers: getAuthHeaders(token),
      credentials: "include",
      body: JSON.stringify(voteData),
    });
    return handleResponse<Comment>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to vote on comment');
  }
};

// Seed mock comments (requires authentication)
export const seedComments = async (token: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}${API_CONFIG.ENDPOINTS.COMMENTS.SEED}`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to seed comments");
  }
};
