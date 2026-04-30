import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useServices from '../hooks/useServices';
import useServiceFilters from '../hooks/useServiceFilters';
import bookingService from '../services/bookingService';
import { Service } from '../services/eventService';
import { SERVICE_CATEGORIES } from '../constants/categories';

// Components
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';

interface BookingFormData {
  startDate: string;
  endDate: string;
}

interface BookingStatus {
  success: string;
  error: string;
}

const Home = (): React.JSX.Element => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({ startDate: '', endDate: '' });
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({ success: '', error: '' });
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  
  const { user } = useAuth();
  const { services, loading, pagination, fetchServices } = useServices();
  const { filters, sort, setSort, handleFilterChange, clearFilters, isFilterActive } = useServiceFilters();

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchServices(filters, pagination.currentPage, sort);
      setIsInitialLoad(false);
    }, isInitialLoad ? 0 : 500);
    return () => clearTimeout(handler);
  }, [filters, sort, pagination.currentPage, fetchServices]);

  const validateBooking = (): boolean => {
    if (!bookingData.startDate || !bookingData.endDate) {
      setBookingStatus({ success: '', error: 'Please select both start and end dates.' });
      return false;
    }
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) { 
      setBookingStatus({ success: '', error: 'Start date cannot be in the past.' }); 
      return false; 
    }
    if (end < start) { 
      setBookingStatus({ success: '', error: 'End date must be after start date.' }); 
      return false; 
    }
    return true;
  };

  const handleBook = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setBookingStatus({ success: '', error: '' });
    
    if (!user) { 
      setBookingStatus({ success: '', error: 'Please login to book services.' }); 
      return; 
    }
    if (!validateBooking()) return;
    
    try {
      await bookingService.createBooking({
        serviceId: selectedService!._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });
      setBookingStatus({ success: 'Booking confirmed!', error: '' });
      setTimeout(() => setSelectedService(null), 2000);
    } catch (error: any) {
      setBookingStatus({ success: '', error: error.response?.data?.error || 'Booking failed.' });
    }
  }, [user, selectedService, bookingData]);

  const handleOnBook = useCallback((service: Service): void => {
    setSelectedService(service);
    setBookingStatus({ success: '', error: '' });
    setBookingData({ startDate: '', endDate: '' });
  }, []);

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Find the Perfect <br /> Service for Your Event
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          From stunning venues to rhythmic DJs, we help you book the best in the industry for your special day.
        </p>
      </header>

      {/* Filters Section */}
      <div className="glass" style={{ padding: '24px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
          <label><Search size={14} style={{ marginRight: '4px' }} /> Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="form-input">
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
          <label><MapPin size={14} style={{ marginRight: '4px' }} /> Location</label>
          <input type="text" name="location" placeholder="e.g. New York" value={filters.location} onChange={handleFilterChange} className="form-input" />
        </div>
        <div className="form-group" style={{ width: '120px', marginBottom: 0 }}>
          <label>Min Price</label>
          <input type="number" name="minPrice" placeholder="0" value={filters.minPrice} onChange={handleFilterChange} className="form-input" />
        </div>
        <div className="form-group" style={{ width: '120px', marginBottom: 0 }}>
          <label>Max Price</label>
          <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className="form-input" />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => fetchServices(filters, 1, sort)} className="btn btn-primary" style={{ height: '48px' }}>
            <Filter size={18} /> Apply
          </button>
          {isFilterActive && (
            <button onClick={clearFilters} className="btn btn-outline" style={{ height: '48px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
              <RotateCcw size={18} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Sort and Info Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Showing {services.length} of {pagination.totalCount} services</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={`${sort.sortBy}-${sort.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setSort({ sortBy, sortOrder });
            }}
            className="form-input"
            style={{ width: '180px', marginBottom: 0, height: '40px' }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="pricePerDay-asc">Price: Low to High</option>
            <option value="pricePerDay-desc">Price: High to Low</option>
            <option value="title-asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ minHeight: '600px', position: 'relative' }}>
        <div style={{ height: '4px', width: '100%', background: 'transparent', marginBottom: '24px', overflow: 'hidden', borderRadius: '2px', visibility: loading ? 'visible' : 'hidden' }}>
          <div className="loading-bar" style={{ height: '100%', width: '30%', background: 'var(--primary)', borderRadius: '2px', animation: 'loading-slide 1.5s infinite linear' }} />
        </div>

        {loading && services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="loading-spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Finding top-rated services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-3" style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} onBook={handleOnBook} />
            ))}
          </div>
        ) : (
          <div className="glass" style={{ textAlign: 'center', padding: '60px', borderRadius: '24px' }}>
            <div style={{ background: 'var(--surface)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
            </div>
            <h3>No services found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
            <button disabled={pagination.currentPage === 1} onClick={() => fetchServices(filters, pagination.currentPage - 1, sort)} className="btn btn-outline" style={{ opacity: pagination.currentPage === 1 ? 0.5 : 1 }}>Previous</button>
            <span style={{ color: 'var(--text-muted)' }}>Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => fetchServices(filters, pagination.currentPage + 1, sort)} className="btn btn-outline" style={{ opacity: pagination.currentPage === pagination.totalPages ? 0.5 : 1 }}>Next</button>
          </div>
        )}
      </div>

      {/* Modal Section */}
      {selectedService && (
        <BookingModal 
          service={selectedService}
          bookingData={bookingData}
          setBookingData={setBookingData}
          bookingStatus={bookingStatus}
          onClose={() => setSelectedService(null)}
          onConfirm={handleBook}
        />
      )}
    </div>
  );
};

export default Home;
