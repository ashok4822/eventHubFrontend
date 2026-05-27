import React from 'react';
import { Booking, PopulatedUser, PopulatedService } from '../services/bookingService';

interface AdminBookingTableProps {
  bookings: Booking[];
}

const AdminBookingTable = ({ bookings }: AdminBookingTableProps): React.JSX.Element => {
  return (
    <div className="glass" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: 'var(--background)' }}>
          <tr>
            {['ID', 'Service', 'Customer', 'Date Range', 'Total Price', 'Status', 'Actions'].map((h) => (
              <th key={h} style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking: Booking) => {
            const service = booking.serviceId as unknown as PopulatedService;
            const user = booking.userId as unknown as PopulatedUser;
            return (
              <tr key={booking._id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{booking._id ? booking._id.slice(-6).toUpperCase() : 'N/A'}</td>
                <td style={{ padding: '20px' }}>{service?.title || 'N/A'}</td>
                <td style={{ padding: '20px' }}>
                  <div style={{ fontWeight: '600' }}>{user?.name || 'N/A'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email || ''}</div>
                </td>
              <td style={{ padding: '20px' }}>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</td>
              <td style={{ padding: '20px', fontWeight: 'bold' }}>₹{booking.totalPrice}</td>
              <td style={{ padding: '20px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  background: booking.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                  color: booking.status === 'confirmed' ? '#10b981' : '#ef4444', 
                  fontWeight: 'bold' 
                }}>
                  {booking.status}
                </span>
              </td>
              <td style={{ padding: '20px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Actions</div>
              </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingTable;
