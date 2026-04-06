import api from './api';

/**
 * Service to handle booking related API calls.
 */
const bookingService = {
  /**
   * Create a new booking.
   */
  async createBooking(bookingData) {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  },

  /**
   * Fetch current user's bookings.
   */
  async getMyBookings() {
    const { data } = await api.get('/bookings/my');
    return data;
  },

  /**
   * Fetch all bookings (Admin only).
   */
  async getAdminBookings() {
    const { data } = await api.get('/bookings/admin');
    return data;
  }
};

export default bookingService;
