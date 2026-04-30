import api, { setAccessToken } from './api';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

/**
 * Service to handle authentication related API calls.
 */
const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    return data;
  },

  async signup(userData: SignupData): Promise<{ message: string; user: any }> {
    const { data } = await api.post<{ message: string; user: any }>('/auth/register', userData);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error (handled):', error);
    }
  },

  async refresh(): Promise<{ accessToken: string }> {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
    setAccessToken(data.accessToken);
    return data;
  },
  
  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(`/auth/reset-password/${token}`, { password });
    return data;
  },
};

export default authService;
