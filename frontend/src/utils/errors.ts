// Custom API Error class
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Utility to handle API errors
export function handleApiError(error: any): never {
  if (error instanceof ApiError) {
    throw error;
  }
  throw new ApiError('An unexpected error occurred');
} 