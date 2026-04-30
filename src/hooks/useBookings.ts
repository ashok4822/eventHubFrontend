import { useState, useCallback } from 'react';
import bookingService, { Booking } from '../services/bookingService';

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchMyBookings: () => Promise<void>;
  fetchAdminBookings: () => Promise<void>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

/**
 * Hook to manage bookings data and its lifecycle.
 */
const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyBookings = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch your bookings');
      console.error('Error in fetchMyBookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminBookings = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAdminBookings();
      setBookings(data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch admin bookings');
      console.error('Error in fetchAdminBookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchMyBookings,
    fetchAdminBookings,
    setBookings,
  };
};

export default useBookings;
