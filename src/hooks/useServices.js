import { useState, useEffect, useCallback } from 'react';
import eventService from '../services/eventService';

/**
 * Hook to manage services data fetching, filtering, and pagination.
 */
const useServices = (initialFilters = {}, initialPage = 1) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });

  const fetchServices = useCallback(async (filters = {}, page = pagination.currentPage, sort = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit,
        ...sort
      };
      const data = await eventService.getServices(params);
      setServices(data.services || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch services');
      console.error('Error in useServices:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  return {
    services,
    loading,
    error,
    pagination,
    fetchServices,
    setServices // Useful for immediate UI updates (delete)
  };
};

export default useServices;
