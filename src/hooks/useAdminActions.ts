import { useState, useCallback } from 'react';
import eventService, { Service, ServiceFormData } from '../services/eventService';
import { getErrorMessage } from '../utils/error';

/**
 * Custom hook to handle admin actions for services.
 * Follows SRP by separating business logic/state from the UI component.
 */
const useAdminActions = (onSuccess: () => void) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    category: 'venue',
    pricePerDay: '',
    description: '',
    location: '',
    contactDetails: '',
  });
  const [modalError, setModalError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      category: 'venue',
      pricePerDay: '',
      description: '',
      location: '',
      contactDetails: '',
    });
    setEditingService(null);
    setModalError('');
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateService = (): boolean => {
    if (!formData.title || String(formData.title).length < 3) {
      setModalError('Title must be at least 3 characters long');
      return false;
    }
    if (!formData.pricePerDay || parseFloat(String(formData.pricePerDay)) <= 0) {
      setModalError('Price per day must be a positive number');
      return false;
    }
    if (!formData.description || String(formData.description).length < 10) {
      setModalError('Description must be at least 10 characters long');
      return false;
    }
    if (!formData.location) {
      setModalError('Location is required');
      return false;
    }
    if (!formData.contactDetails) {
      setModalError('Contact details are required');
      return false;
    }
    return true;
  };

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setModalError('');
    if (!validateService()) return;

    setIsSubmitting(true);
    try {
      if (editingService) {
        await eventService.updateService(editingService._id, formData);
      } else {
        await eventService.createService(formData);
      }
      setShowModal(false);
      resetForm();
      onSuccess();
    } catch (error: unknown) {
      setModalError(getErrorMessage(error, 'Error saving service'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await eventService.deleteService(id);
        onSuccess();
      } catch (error) {
        console.error('Error deleting service', error);
        alert('Failed to delete service');
      }
    }
  };

  const openModal = (service: Service | null = null): void => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        category: service.category,
        pricePerDay: service.pricePerDay,
        description: service.description,
        location: service.location,
        contactDetails: service.contactDetails,
      });
    } else {
      resetForm();
    }
    setModalError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return {
    showModal,
    editingService,
    formData,
    modalError,
    isSubmitting,
    handleInputChange,
    handleAddOrUpdate,
    handleDelete,
    openModal,
    closeModal,
  };
};

export default useAdminActions;
