import api from './api';

export interface BookingData {
  serviceId: string;
  startDate: string;
  endDate: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

export interface PopulatedService {
  _id: string;
  title: string;
  category: string;
  pricePerDay: number;
  location: string;
  description: string;
  contactDetails: string;
}

export interface Booking {
  _id: string;
  userId: string | PopulatedUser;
  serviceId: string | PopulatedService;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

/**
 * Service to handle booking related API calls.
 */
const bookingService = {
  async createBooking(bookingData: BookingData): Promise<Booking> {
    const { data } = await api.post<Booking>('/bookings', bookingData);
    return data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>('/bookings/my');
    return data;
  },

  async getAdminBookings(): Promise<any[]> {
    const { data } = await api.get<any[]>('/bookings/admin');
    return data;
  },
};

export default bookingService;
