import React, { useEffect, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import useBookings from '../hooks/useBookings';
import { Booking } from '../services/bookingService';

const UserDashboard = (): React.JSX.Element => {
  const { user } = useAuth();
  const { bookings, loading, fetchMyBookings } = useBookings();

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Your Bookings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Manage your upcoming and past events.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading your events...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-2">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="glass" style={{ textAlign: 'center', padding: '80px', borderRadius: '32px' }}>
          <div style={{ background: 'var(--surface)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Calendar size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No bookings found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>You haven't booked any services yet. Start planning your event!</p>
          <a href="/" className="btn btn-primary">Browse Services <ArrowRight size={18} /></a>
        </div>
      )}
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = memo(({ booking }: BookingCardProps): React.JSX.Element => {
  const service = booking.serviceId;
  
  if (typeof service === 'string') {
    return <div className="glass">Loading service details...</div>;
  }

  const startDate = new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const endDate = new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getCategoryEmoji = (category: string): string => {
    const map: Record<string, string> = {
      venue: '🏰', hotel: '🏨', caterer: '🍽️', cameraman: '📸', DJ: '🎧',
    };
    return map[category] || '✨';
  };

  return (
    <div className="glass animate-fade" style={{ background: 'var(--surface)', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ width: '100px', height: '100px', background: 'var(--background)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          {getCategoryEmoji(service.category)}
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <h3 style={{ marginBottom: '4px' }}>{service.title}</h3>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              {booking.status.toUpperCase()}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            <MapPin size={14} /> {service.location}
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Date Range</p>
          <p style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> {startDate} - {endDate}
          </p>
        </div>
        <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Total Paid</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{booking.totalPrice}</p>
        </div>
      </div>
    </div>
  );
});

export default UserDashboard;
