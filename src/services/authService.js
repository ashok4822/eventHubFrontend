import api, { setAccessToken } from './api';

/**
 * Service to handle authentication related API calls.
 */
const authService = {
  /**
   * Login user and return user data.
   */
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    return data;
  },

  /**
   * Signup new user.
   */
  async signup(userData) {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  /**
   * Logout user by clearing the backend session.
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error (handled):', error);
    }
  },

  /**
   * Silently refresh the access token.
   */
  async refresh() {
    const { data } = await api.post('/auth/refresh');
    setAccessToken(data.accessToken);
    return data;
  }
};

export default authService;
