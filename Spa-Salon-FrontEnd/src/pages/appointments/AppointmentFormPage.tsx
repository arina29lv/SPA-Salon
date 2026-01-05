import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appointmentApi, serviceApi, customerApi } from '../../api';
import type { Service, Customer, CreateAppointmentService, UpdateAppointment } from '../../types';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { AppointmentStatus, UserRole } from '../../types/common';

interface ServiceEntry {
  serviceId: string;
  employeeId: string;
  price: number;
}

export const AppointmentFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const canSelectCustomer = user && user.role >= UserRole.Manager;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [customerId, setCustomerId] = useState<string>('');
  const [appointmentDateTime, setAppointmentDateTime] = useState<string>('');
  const [status, setStatus] = useState<number>(AppointmentStatus.Scheduled);
  const [notes, setNotes] = useState<string>('');
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([
    { serviceId: '', employeeId: '', price: 0 }
  ]);

  const isEditing = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await serviceApi.getActive();
        setServices(servicesData);

        if (canSelectCustomer) {
          const customersData = await customerApi.getAll(1, 100);
          setCustomers(customersData.items);
        }

        if (id) {
          const appointment = await appointmentApi.getById(id);
          const dateStr = new Date(appointment.appointmentDateTime).toISOString().slice(0, 16);
          setCustomerId(appointment.customerId);
          setAppointmentDateTime(dateStr);
          setStatus(appointment.status);
          setNotes(appointment.notes || '');

          if (appointment.services && appointment.services.length > 0) {
            setServiceEntries(appointment.services.map(s => ({
              serviceId: s.serviceId,
              employeeId: s.employeeId,
              price: s.price,
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [id, canSelectCustomer]);

  const handleServiceChange = (index: number, field: keyof ServiceEntry, value: string | number) => {
    const newEntries = [...serviceEntries];
    if (field === 'serviceId') {
      const service = services.find(s => s.id === value);
      console.log('Service selected:', service);
      console.log('EmployeeId from service:', service?.employeeId);
      newEntries[index] = {
        ...newEntries[index],
        serviceId: value as string,
        employeeId: service?.employeeId || '',
        price: service?.price || 0,
      };
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value };
    }
    setServiceEntries(newEntries);
    setError('');
  };

  const addServiceEntry = () => {
    setServiceEntries([...serviceEntries, { serviceId: '', employeeId: '', price: 0 }]);
  };

  const removeServiceEntry = (index: number) => {
    if (serviceEntries.length > 1) {
      setServiceEntries(serviceEntries.filter((_, i) => i !== index));
    }
  };

  const getTotalPrice = () => {
    return serviceEntries.reduce((sum, entry) => sum + (entry.price || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if ((canSelectCustomer && !customerId) || !appointmentDateTime) {
      setError(t('validation.required'));
      return;
    }

    const validServices = serviceEntries.filter(s => s.serviceId && s.employeeId);
    console.log('Service entries:', serviceEntries);
    console.log('Valid services:', validServices);
    if (validServices.length === 0) {
      setError(t('appointment.selectServiceFirst'));
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        const updateData: UpdateAppointment = {
          appointmentDateTime,
          status: status as AppointmentStatus,
          notes: notes || undefined,
        };
        await appointmentApi.update(id!, updateData);
      } else {
        const servicesData: CreateAppointmentService[] = validServices.map(s => ({
          serviceId: s.serviceId,
          employeeId: s.employeeId,
          price: s.price,
        }));
        await appointmentApi.create({
          customerId: customerId || undefined,
          appointmentDateTime,
          notes: notes || undefined,
          services: servicesData,
        });
      }
      navigate('/appointments');
    } catch (err: any) {
      console.error('Failed to save appointment:', err);
      console.log('Error response:', err.response?.data);
      const errorMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || t('messages.errorOccurred');
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/appointments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? t('appointment.edit') : t('appointment.create')}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {canSelectCustomer && (
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                {t('appointment.customer')} *
              </label>
              <select
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="input"
                disabled={isEditing}
                required
              >
                <option value="">{t('common.select')}</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="appointmentDateTime" className="block text-sm font-medium text-gray-700 mb-1">
              {t('appointment.date')} *
            </label>
            <input
              type="datetime-local"
              id="appointmentDateTime"
              value={appointmentDateTime}
              onChange={(e) => setAppointmentDateTime(e.target.value)}
              className="input"
              required
            />
          </div>

          {!isEditing && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  {t('appointment.services')} *
                </label>
                <button
                  type="button"
                  onClick={addServiceEntry}
                  className="btn btn-secondary btn-sm inline-flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t('appointment.addService')}
                </button>
              </div>

              <div className="space-y-4">
                {serviceEntries.map((entry, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          {t('appointment.service')}
                        </label>
                        <select
                          value={entry.serviceId}
                          onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                          className="input"
                          required
                        >
                          <option value="">{t('common.select')}</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name} - ${service.price.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          {t('appointment.employee')}
                        </label>
                        <div className="input bg-gray-100 text-gray-700">
                          {entry.serviceId ? (
                            services.find(s => s.id === entry.serviceId)?.employeeName || t('common.select')
                          ) : (
                            <span className="text-gray-400">{t('appointment.selectServiceFirst')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-600">
                        {t('service.price')}: ${entry.price.toFixed(2)}
                      </span>
                      {serviceEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeServiceEntry(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <span className="font-semibold text-primary-700">
                  {t('appointment.totalPrice')}: ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {isEditing && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                {t('appointment.statusLabel')}
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(parseInt(e.target.value))}
                className="input"
              >
                <option value={AppointmentStatus.Scheduled}>{t('appointment.status.scheduled')}</option>
                <option value={AppointmentStatus.InProgress}>{t('appointment.status.inProgress')}</option>
                <option value={AppointmentStatus.Completed}>{t('appointment.status.completed')}</option>
                <option value={AppointmentStatus.Cancelled}>{t('appointment.status.cancelled')}</option>
                <option value={AppointmentStatus.NoShow}>{t('appointment.status.noShow')}</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              {t('appointment.notes')}
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              placeholder={t('appointment.notesPlaceholder')}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : (isEditing ? t('common.save') : t('common.create'))}
            </button>
            <Link to="/appointments" className="btn btn-secondary flex-1 text-center">
              {t('common.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
