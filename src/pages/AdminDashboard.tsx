import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, List } from 'lucide-react';
import useServices from '../hooks/useServices';
import useBookings from '../hooks/useBookings';
import useAdminActions from '../hooks/useAdminActions';

// Components
import ServiceFormModal from '../components/ServiceFormModal';
import AdminBookingTable from '../components/AdminBookingTable';
import AdminServiceTable from '../components/AdminServiceTable';

type ActiveTab = 'services' | 'bookings';

/**
 * Admin Dashboard Page.
 * Refactored to follow SOLID principles:
 * - SRP: Logic moved to useAdminActions hook.
 * - Clean UI: Focused on rendering and event delegation.
 */
const AdminDashboard = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  
  const { services, fetchServices } = useServices();
  const { bookings, fetchAdminBookings } = useBookings();

  const {
    showModal,
    editingService,
    formData,
    modalError,
    handleInputChange,
    handleAddOrUpdate,
    handleDelete,
    openModal,
    closeModal
  } = useAdminActions(fetchServices);

  useEffect(() => {
    fetchServices();
    fetchAdminBookings();
  }, [fetchServices, fetchAdminBookings]);

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="flex justify-between items-end" style={{ marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Admin Console</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your services and oversee business activity.</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '16px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('services')} 
            className="btn" 
            style={{ 
              background: activeTab === 'services' ? 'var(--primary)' : 'transparent', 
              color: activeTab === 'services' ? 'white' : 'var(--text-muted)' 
            }}
          >
            Services
          </button>
          <button 
            onClick={() => setActiveTab('bookings')} 
            className="btn" 
            style={{ 
              background: activeTab === 'bookings' ? 'var(--primary)' : 'transparent', 
              color: activeTab === 'bookings' ? 'white' : 'var(--text-muted)' 
            }}
          >
            Bookings
          </button>
        </div>
      </div>

      {activeTab === 'services' ? (
        <>
          <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <List size={22} color="var(--primary)" /> All Services
            </h3>
            <button onClick={() => openModal()} className="btn btn-primary">
              <Plus size={18} /> Add New Service
            </button>
          </div>
          <AdminServiceTable 
            services={services} 
            onEdit={openModal} 
            onDelete={handleDelete} 
          />
        </>
      ) : (
        <AdminBookingTable bookings={bookings} />
      )}

      {showModal && (
        <ServiceFormModal 
          editing={!!editingService}
          formData={formData}
          modalError={modalError}
          onInputChange={handleInputChange}
          onClose={closeModal}
          onSave={handleAddOrUpdate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
