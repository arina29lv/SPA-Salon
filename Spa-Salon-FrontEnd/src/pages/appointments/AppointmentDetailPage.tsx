import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appointmentApi } from '../../api';
import { AppointmentDetail } from '../../types';
import { LoadingSpinner, ConfirmDialog } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, DollarSign, FileText, Scissors, Check, X } from 'lucide-react';
import { UserRole, AppointmentStatus } from '../../types/common';

export const AppointmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const canManage = user && user.role >= UserRole.Employee;
  const canApprove = user && user.role >= UserRole.Manager;
  const isAdmin = user && user.role >= UserRole.Admin;

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return;
      try {
        const data = await appointmentApi.getById(id);
        setAppointment(data);
      } catch (error) {
        console.error('Failed to fetch appointment:', error);
        navigate('/appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await appointmentApi.delete(id);
      navigate('/appointments');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const fetchAppointmentData = async () => {
    if (!id) return;
    try {
      const data = await appointmentApi.getById(id);
      setAppointment(data);
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    try {
      await appointmentApi.approve(id);
      fetchAppointmentData();
    } catch (error) {
      console.error('Failed to approve appointment:', error);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await appointmentApi.reject(id);
      fetchAppointmentData();
    } catch (error) {
      console.error('Failed to reject appointment:', error);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Requested:
        return 'badge-info';
      case AppointmentStatus.Scheduled:
        return 'badge-primary';
      case AppointmentStatus.Completed:
        return 'badge-success';
      case AppointmentStatus.InProgress:
        return 'badge-warning';
      case AppointmentStatus.Cancelled:
        return 'badge-danger';
      case AppointmentStatus.NoShow:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Requested:
        return t('appointment.status.requested');
      case AppointmentStatus.Scheduled:
        return t('appointment.status.scheduled');
      case AppointmentStatus.Completed:
        return t('appointment.status.completed');
      case AppointmentStatus.InProgress:
        return t('appointment.status.inProgress');
      case AppointmentStatus.Cancelled:
        return t('appointment.status.cancelled');
      case AppointmentStatus.NoShow:
        return t('appointment.status.noShow');
      default:
        return '';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTotalDuration = () => {
    if (!appointment?.services) return 0;
    return appointment.services.reduce((sum, s) => sum + s.durationMinutes, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/appointments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('appointment.detail')}</h1>
            <span className={`badge ${getStatusBadge(appointment.status)}`}>
              {getStatusLabel(appointment.status)}
            </span>
          </div>
          <div className="flex gap-2">
            {canApprove && appointment.status === AppointmentStatus.Requested && (
              <>
                <button
                  onClick={handleApprove}
                  className="btn btn-success inline-flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('appointment.approve')}
                </button>
                <button
                  onClick={handleReject}
                  className="btn btn-danger inline-flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {t('appointment.reject')}
                </button>
              </>
            )}
            {canManage && (
              <Link
                to={`/appointments/${appointment.id}/edit`}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="btn btn-danger inline-flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('common.delete')}
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">{t('appointment.date')}</p>
              <p className="text-lg font-semibold">{formatDateTime(appointment.appointmentDateTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">{t('appointment.totalDuration')}</p>
              <p className="text-lg font-semibold">{getTotalDuration()} {t('common.minutes')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <User className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">{t('appointment.customer')}</p>
              <p className="text-lg font-semibold">{appointment.customerName}</p>
              <p className="text-sm text-gray-500">{appointment.customerEmail}</p>
              {appointment.customerPhone && (
                <p className="text-sm text-gray-500">{appointment.customerPhone}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">{t('appointment.totalPrice')}</p>
              <p className="text-lg font-semibold">${appointment.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg mb-6">
            <FileText className="h-6 w-6 text-primary-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">{t('appointment.notes')}</p>
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          </div>
        )}

        {appointment.services && appointment.services.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              {t('appointment.services')}
            </h2>
            <div className="space-y-3">
              {appointment.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{service.serviceName}</p>
                    <p className="text-sm text-gray-500">
                      {t('appointment.employee')}: {service.employeeName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {service.durationMinutes} {t('common.minutes')}
                    </p>
                  </div>
                  <span className="font-semibold text-primary-600">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('common.confirmDelete')}
        message={t('appointment.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};
