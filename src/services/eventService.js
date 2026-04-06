import api from './api';

/**
 * Service to handle service/event related API calls.
 */
const eventService = {
  /**
   * Fetch all services with optional parameters (category, location, price, page, limit, sortBy, sortOrder).
   */
  async getServices(params = {}) {
    const { data } = await api.get('/services', { params });
    return data;
  },

  /**
   * Create a new service (Admin only).
   */
  async createService(serviceData) {
    const { data } = await api.post('/services', serviceData);
    return data;
  },

  /**
   * Update an existing service (Admin only).
   */
  async updateService(id, serviceData) {
    const { data } = await api.put(`/services/${id}`, serviceData);
    return data;
  },

  /**
   * Delete a service (Admin only).
   */
  async deleteService(id) {
    const { data } = await api.delete(`/services/${id}`);
    return data;
  }
};

export default eventService;
