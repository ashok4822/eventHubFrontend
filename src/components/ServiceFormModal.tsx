import React from 'react';
import { ServiceFormData } from '../services/eventService';
import { SERVICE_CATEGORIES } from '../constants/categories';

interface ServiceFormModalProps {
  editing: boolean;
  formData: ServiceFormData;
  modalError: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const ServiceFormModal = ({
  editing,
  formData,
  modalError,
  onInputChange,
  onClose,
  onSave,
}: ServiceFormModalProps): React.JSX.Element => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '40px', background: 'var(--surface)', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>{editing ? 'Edit Service' : 'Add New Service'}</h3>
        {modalError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {modalError}
          </div>
        )}
        <form onSubmit={onSave}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={String(formData.title)} onChange={onInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={String(formData.category)} onChange={onInputChange} className="form-input">
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Price Per Day (₹)</label>
              <input type="number" name="pricePerDay" value={String(formData.pricePerDay)} onChange={onInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={String(formData.location)} onChange={onInputChange} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={String(formData.description)} onChange={onInputChange} className="form-input" style={{ minHeight: '100px' }} />
          </div>
          <div className="form-group">
            <label>Contact Details</label>
            <input type="text" name="contactDetails" value={String(formData.contactDetails)} onChange={onInputChange} className="form-input" placeholder="e.g. Phone or Email" />
          </div>
          <div className="flex justify-between gap-4" style={{ marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{editing ? 'Update Service' : 'Create Service'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;
