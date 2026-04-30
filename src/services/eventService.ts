import api from './api';

export interface Service {
  _id: string;
  title: string;
  category: string;
  pricePerDay: number;
  description: string;
  availabilityDates: string[];
  contactDetails: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  services: Service[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ServiceQueryParams {
  category?: string;
  location?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface ServiceFormData {
  title: string;
  category: string;
  pricePerDay: string | number;
  description: string;
  location: string;
  contactDetails: string;
}

/**
 * Service to handle service/event related API calls.
 */
const eventService = {
  async getServices(params: ServiceQueryParams = {}): Promise<ServicesResponse> {
    const { data } = await api.get<ServicesResponse>('/services', { params });
    return data;
  },

  async createService(serviceData: ServiceFormData): Promise<Service> {
    const { data } = await api.post<Service>('/services', serviceData);
    return data;
  },

  async updateService(id: string, serviceData: ServiceFormData): Promise<Service> {
    const { data } = await api.put<Service>(`/services/${id}`, serviceData);
    return data;
  },

  async deleteService(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/services/${id}`);
    return data;
  },
};

export default eventService;
