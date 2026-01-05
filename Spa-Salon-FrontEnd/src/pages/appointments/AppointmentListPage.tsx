import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appointmentApi } from '../../api';
import { Appointment } from '../../types';
import { LoadingSpinner, Pagination, ConfirmDialog } from '../../components/common';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Calendar, Clock, Check, X } from 'lucide-react';
import { UserRole, AppointmentStatus } from '../../types/common';

export const AppointmentListPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { page, pageSize, setPage } = usePagination();

  const canManage = user && user.role >= UserRole.Employee;
  const canApprove = user && user.role >= UserRole.Manager;
  const isAdmin = user && user.role >= UserRole.Admin;

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentApi.getAll(page, pageSize);
      setAppointments(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, pageSize]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await appointmentApi.delete(deleteId);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
    setDeleteId(null);
  };

  const handleApprove = async (id: string) => {
    try {
      await appointmentApi.approve(id);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to approve appointment:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await appointmentApi.reject(id);
      fetchAppointments();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl text-charcoal">{t('appointment.title')}</h1>
        {user && user.role !== UserRole.Employee && (
          <Link to="/appointments/new" className="btn btn-primary inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('appointment.create')}
          </Link>
        )}
      </div>

      {appointments.length > 0 ? (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('appointment.date')}</th>
                  <th>{t('appointment.customer')}</th>
                  <th>{t('appointment.services')}</th>
                  <th>{t('appointment.totalPrice')}</th>
                  <th>{t('appointment.statusLabel')}</th>
                  <th className="text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="text-gray-dark">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gold" />
                        {formatDate(appointment.appointmentDateTime)}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-gold" />
                        {formatTime(appointment.appointmentDateTime)}
                      </div>
                    </td>
                    <td className="font-medium text-charcoal">{appointment.customerName}</td>
                    <td className="text-gray-dark">
                      {appointment.serviceCount} {appointment.serviceCount === 1 ? t('appointment.service') : t('appointment.services')}
                    </td>
                    <td className="text-gray-dark">${appointment.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        {canApprove && appointment.status === AppointmentStatus.Requested && (
                          <>
                            <button
                              onClick={() => handleApprove(appointment.id)}
                              className="btn btn-success p-2"
                              title={t('appointment.approve')}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(appointment.id)}
                              className="btn btn-danger p-2"
                              title={t('appointment.reject')}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          {t('common.view')}
                        </Link>
                        {canManage && (
                          <Link
                            to={`/appointments/${appointment.id}/edit`}
                            className="btn btn-secondary p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(appointment.id)}
                            className="btn btn-danger p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="text-center py-12 text-gray-dark">
          {t('common.noData')}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title={t('common.confirmDelete')}
        message={t('appointment.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
