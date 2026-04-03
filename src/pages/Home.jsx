import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Filter, Star, Info, MessageSquare, Send, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_FILTERS = {
  category: '',
  location: '',
  minPrice: '',
  maxPrice: ''
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({ startDate: '', endDate: '' });
  const [bookingStatus, setBookingStatus] = useState({ success: '', error: '' });
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useAuth();

  const fetchServices = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/services', { params: filters });
      setServices(data);
    } catch (error) {
      console.error('Error fetching services', error);
    }
    if (showLoading) setLoading(false);
    setIsInitialLoad(false);
  };

  // Handle both initial load and debounced filter updates
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchServices(isInitialLoad);
    }, isInitialLoad ? 0 : 500);

    return () => clearTimeout(handler);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const isFilterActive = Object.values(filters).some(val => val !== '');

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      setBookingStatus({ success: '', error: 'Please login to book services.' });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        serviceId: selectedService._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate
      });
      setBookingStatus({ success: 'Booking confirmed!', error: '' });
      setTimeout(() => setSelectedService(null), 2000);
    } catch (error) {
      setBookingStatus({ success: '', error: error.response?.data?.error || 'Booking failed.' });
    }
  };

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

      <div className="glass" style={{ padding: '24px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
          <label><Search size={14} style={{ marginRight: '4px' }} /> Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="form-input">
            <option value="">All Categories</option>
            <option value="venue">Venue</option>
            <option value="hotel">Hotel</option>
            <option value="caterer">Caterer</option>
            <option value="cameraman">Cameraman</option>
            <option value="DJ">DJ</option>
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
          <button onClick={() => fetchServices(true)} className="btn btn-primary" style={{ height: '48px' }}>
            <Filter size={18} /> Apply
          </button>
          
          {isFilterActive && (
            <button onClick={handleClearFilters} className="btn btn-outline" style={{ height: '48px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
              <RotateCcw size={18} /> Clear
            </button>
          )}
        </div>
      </div>

      <div style={{ minHeight: '600px', position: 'relative' }}>
        {/* Loading overlay for existing content */}
        <div style={{ 
          height: '4px', 
          width: '100%', 
          background: 'transparent', 
          marginBottom: '24px', 
          overflow: 'hidden', 
          borderRadius: '2px',
          visibility: loading ? 'visible' : 'hidden' 
        }}>
          <div className="loading-bar" style={{ 
            height: '100%', 
            width: '30%', 
            background: 'var(--primary)', 
            borderRadius: '2px',
            animation: 'loading-slide 1.5s infinite linear'
          }}></div>
        </div>

        {(loading && services.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="loading-spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Finding top-rated services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-3" style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} onBook={() => setSelectedService(service)} />
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
      </div>

      {selectedService && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', background: 'var(--surface)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3>Book {selectedService.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>₹{selectedService.pricePerDay} per day</p>
            </div>

            {bookingStatus.error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{bookingStatus.error}</div>}
            {bookingStatus.success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{bookingStatus.success}</div>}

            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" className="form-input" value={bookingData.startDate} onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" className="form-input" value={bookingData.endDate} onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })} />
              </div>
              <div className="flex gap-4" style={{ marginTop: '24px' }}>
                <button type="button" onClick={() => setSelectedService(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="glass animate-fade" style={{ background: 'var(--surface)', transition: 'transform 0.3s ease', padding: '12px' }}>
      <div style={{ height: '200px', background: 'linear-gradient(135deg, #334155, #1e293b)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
            {service.category.toUpperCase()}
          </div>
          <span style={{ fontSize: '3rem' }}>{service.category === 'venue' ? '🏰' : service.category === 'hotel' ? '🏨' : service.category === 'caterer' ? '🍽️' : service.category === 'cameraman' ? '📸' : service.category === 'DJ' ? '🎧' : '✨'}</span>
      </div>
      <div style={{ padding: '0 8px 12px' }}>
        <h3 style={{ marginBottom: '4px', fontSize: '1.25rem' }}>{service.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} /> {service.location}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{service.pricePerDay}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> / day</span>
          </div>
          <button onClick={onBook} className="btn btn-outline" style={{ padding: '8px 16px' }}>View Details</button>
        </div>
      </div>
    </div>
  );
};


export default Home;
