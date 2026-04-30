import { useState, useCallback } from 'react';

export interface FilterState {
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export interface SortState {
  sortBy: string;
  sortOrder: string;
}

export const INITIAL_FILTERS: FilterState = {
  category: '',
  location: '',
  minPrice: '',
  maxPrice: '',
};

export const INITIAL_SORT: SortState = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const useServiceFilters = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortState>(INITIAL_SORT);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSort(INITIAL_SORT);
  }, []);

  const isFilterActive = Object.values(filters).some((val) => val !== '');

  return {
    filters,
    sort,
    setSort,
    handleFilterChange,
    clearFilters,
    isFilterActive,
  };
};

export default useServiceFilters;
