import axios from 'axios';

export interface ApiErrorResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Safely extracts an error message from an unknown error object,
 * specifically handling Axios errors with a predictable structure.
 */
export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message || 
      error.response?.data?.error || 
      defaultMessage
    );
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultMessage;
};
