import React from 'react';
import { Edit, Trash2, MapPin } from 'lucide-react';

interface AdminServiceTableProps {
  services: any[];
  onEdit: (service: any) => void;
  onDelete: (id: string) => void;
}

const AdminServiceTable = ({ services, onEdit, onDelete }: AdminServiceTableProps): React.JSX.Element => {
  return (
    <div className="glass" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: 'var(--background)' }}>
          <tr>
            {['Service', 'Category', 'Location', 'Price', 'Actions'].map((h) => (
              <th key={h} style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((service: any) => (
            <tr key={service._id} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '20px' }}>
                <div style={{ fontWeight: '600' }}>{service.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.description}</div>
              </td>
              <td style={{ padding: '20px' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '8px', 
                  fontSize: '0.75rem', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  color: 'var(--primary)', 
                  fontWeight: 'bold' 
                }}>
                  {service.category.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                  <MapPin size={14} color="var(--text-muted)" /> {service.location}
                </div>
              </td>
              <td style={{ padding: '20px', fontWeight: 'bold' }}>₹{service.pricePerDay}/day</td>
              <td style={{ padding: '20px' }}>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(service)} style={{ background: 'none', color: 'var(--text-muted)' }} title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(service._id)} style={{ background: 'none', color: '#ef4444' }} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminServiceTable;
