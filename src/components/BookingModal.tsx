import React, { useMemo } from 'react';
import { Service } from '../services/eventService';

interface BookingFormData {
  startDate: string;
  endDate: string;
}

interface BookingStatus {
  success: string;
  error: string;
}

interface BookingModalProps {
  service: Service;
  bookingData: BookingFormData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  bookingStatus: BookingStatus;
  onClose: () => void;
  onConfirm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const BookingModal = ({
  service,
  bookingData,
  setBookingData,
  bookingStatus,
  onClose,
  onConfirm,
}: BookingModalProps): React.JSX.Element => {
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / MS_PER_DAY) + 1;
    return diff > 0 ? diff : 0;
  };

  const estimatedDays = useMemo(
    () => calculateDays(bookingData.startDate, bookingData.endDate),
    [bookingData.startDate, bookingData.endDate]
  );
  
  const estimatedTotal = useMemo(
    () => (service ? service.pricePerDay * estimatedDays : 0),
    [service, estimatedDays]
  );

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', background: 'var(--surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3>Book {service.title}</h3>
          <p style={{ color: 'var(--text-muted)' }}>₹{service.pricePerDay} per day</p>
        </div>
        {bookingStatus.error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{bookingStatus.error}</div>}
        {bookingStatus.success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{bookingStatus.success}</div>}
        <form onSubmit={onConfirm}>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="form-input" value={bookingData.startDate} onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" className="form-input" value={bookingData.endDate} onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })} />
          </div>
          {estimatedDays > 0 && (
            <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '12px', padding: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Duration</span>
                <span style={{ fontWeight: '600' }}>{estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Price per day</span>
                <span style={{ fontWeight: '600' }}>₹{service.pricePerDay}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(139, 92, 246, 0.2)', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '700' }}>Estimated Total</span>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.2rem' }}>₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
          <div className="flex gap-4" style={{ marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
