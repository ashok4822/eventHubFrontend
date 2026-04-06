import { useState, useCallback } from 'react';
import bookingService from '../services/bookingService';

/**
 * Hook to manage bookings data and its lifecycle.
 */
const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch your bookings');
      console.error('Error in fetchMyBookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAdminBookings();
      setBookings(data || []);
    } catch (err) {
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
    setBookings
  };
};

export default useBookings;
