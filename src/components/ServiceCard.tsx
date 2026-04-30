import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
import { Service } from '../services/eventService';
import { getCategoryEmoji } from '../constants/categories';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

const ServiceCard = ({ service, onBook }: ServiceCardProps): React.JSX.Element => {
  return (
    <div className="glass animate-fade" style={{ background: 'var(--surface)', transition: 'transform 0.3s ease', padding: '12px' }}>
      <div style={{ height: '200px', background: 'linear-gradient(135deg, #334155, #1e293b)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
          {service.category.toUpperCase()}
        </div>
        <span style={{ fontSize: '3rem' }}>{getCategoryEmoji(service.category)}</span>
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
          <button onClick={() => onBook(service)} className="btn btn-outline" style={{ padding: '8px 16px' }}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default memo(ServiceCard);
