import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, LayoutDashboard, Settings, Info, MapPin, DollarSign, List, Filter } from 'lucide-react';
import useServices from '../hooks/useServices';
import useBookings from '../hooks/useBookings';
import eventService from '../services/eventService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'venue', pricePerDay: '', description: '', location: '', contactDetails: '' });
  const [modalError, setModalError] = useState('');

  const { services, loading: servicesLoading, fetchServices, setServices } = useServices();
  const { bookings, loading: bookingsLoading, fetchAdminBookings } = useBookings();

  const fetchData = () => {
    fetchServices();
    fetchAdminBookings();
  };

  useEffect(() => {
    fetchData();
  }, [fetchServices, fetchAdminBookings]);

  const loading = servicesLoading || bookingsLoading;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateService = () => {
    if (!formData.title || formData.title.length < 3) {
      setModalError("Title must be at least 3 characters long");
      return false;
    }
    if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) {
      setModalError("Price per day must be a positive number");
      return false;
    }
    if (!formData.description || formData.description.length < 10) {
      setModalError("Description must be at least 10 characters long");
      return false;
    }
    if (!formData.location) {
      setModalError("Location is required");
      return false;
    }
    if (!formData.contactDetails) {
      setModalError("Contact details are required");
      return false;
    }
    return true;
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!validateService()) return;

    try {
      if (editingService) {
        await eventService.updateService(editingService._id, formData);
      } else {
        await eventService.createService(formData);
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({ title: '', category: 'venue', pricePerDay: '', description: '', location: '', contactDetails: '' });
      setModalError('');
      fetchServices();
    } catch (error) {
      setModalError(error.response?.data?.error || 'Error saving service');
      console.error('Error saving service', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await eventService.deleteService(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service', error);
      }
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        category: service.category,
        pricePerDay: service.pricePerDay,
        description: service.description,
        location: service.location,
        contactDetails: service.contactDetails
      });
    } else {
      setEditingService(null);
      setFormData({ title: '', category: 'venue', pricePerDay: '', description: '', location: '', contactDetails: '' });
    }
    setModalError('');
    setShowModal(true);
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="flex justify-between items-end" style={{ marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Admin Console</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your services and oversee business activity.</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '16px', display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('services')} className="btn" style={{ background: activeTab === 'services' ? 'var(--primary)' : 'transparent', color: activeTab === 'services' ? 'white' : 'var(--text-muted)' }}>
            Services
          </button>
          <button onClick={() => setActiveTab('bookings')} className="btn" style={{ background: activeTab === 'bookings' ? 'var(--primary)' : 'transparent', color: activeTab === 'bookings' ? 'white' : 'var(--text-muted)' }}>
            Bookings
          </button>
        </div>
      </div>

      {activeTab === 'services' ? (
        <>
          <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
             <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><List size={22} color="var(--primary)" /> All Services</h3>
             <button onClick={() => openModal()} className="btn btn-primary"><Plus size={18} /> Add New Service</button>
          </div>

          <div className="grid grid-3">
            {services?.map((service) => (
              <div key={service._id} className="glass" style={{ padding: '24px', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontWeight: 'bold' }}>{service.category.toUpperCase()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(service)} style={{ background: 'none', color: 'var(--text-muted)' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(service._id)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{service.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {service.location}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{service.pricePerDay}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}> / day</span></span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="glass" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--background)' }}>
              <tr>
                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Service</th>
                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Date Range</th>
                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Price</th>
                <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '20px' }}>{booking.serviceId?.title}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: '600' }}>{booking.userId?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.userId?.email}</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px', fontWeight: 'bold' }}>₹{booking.totalPrice}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold' }}>{booking.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '40px', background: 'var(--surface)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            
            {modalError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddOrUpdate}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="form-input">
                    <option value="venue">Venue</option>
                    <option value="hotel">Hotel</option>
                    <option value="caterer">Caterer</option>
                    <option value="cameraman">Cameraman</option>
                    <option value="DJ">DJ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Price Per Day (₹)</label>
                  <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input" style={{ minHeight: '100px' }}></textarea>
              </div>
              <div className="form-group">
                <label>Contact Details</label>
                <input type="text" name="contactDetails" value={formData.contactDetails} onChange={handleInputChange} className="form-input" placeholder="e.g. Phone or Email" />
              </div>

              <div className="flex justify-between gap-4" style={{ marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{editingService ? 'Update Service' : 'Create Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
