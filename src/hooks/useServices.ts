import { useState, useCallback } from 'react';
import eventService, { Service, ServiceQueryParams } from '../services/eventService';
import { getErrorMessage } from '../utils/error';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

interface SortOptions {
  sortBy?: string;
  sortOrder?: string;
}

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  fetchServices: (filters?: Partial<ServiceQueryParams>, page?: number, sort?: SortOptions) => Promise<void>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

/**
 * Hook to manage services data fetching, filtering, and pagination.
 */
const useServices = (initialPage: number = 1): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const fetchServices = useCallback(
    async (
      filters: Partial<ServiceQueryParams> = {},
      page: number = pagination.currentPage,
      sort: SortOptions = {}
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const params: ServiceQueryParams = {
          ...filters,
          page,
          limit: pagination.limit,
          ...sort,
        };
        const data = await eventService.getServices(params);
        setServices(data.services || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages: data.totalPages || 1,
          totalCount: data.totalCount || 0,
        }));
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Failed to fetch services'));
        console.error('Error in useServices:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, pagination.currentPage]
  );

  return {
    services,
    loading,
    error,
    pagination,
    fetchServices,
    setServices,
  };
};

export default useServices;
