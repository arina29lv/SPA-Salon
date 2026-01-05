import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { employeeApi } from '../../api';
import { LoadingSpinner, ConfirmDialog } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/common';
import { useState } from 'react';
import { AppointmentStatusLabels } from '../../types';

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const canManage = user && user.role >= UserRole.Manager;
  const isAdmin = user && user.role >= UserRole.Admin;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => employeeApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !employee) return <div className="text-red-500">{t('common.error')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {employee.firstName} {employee.lastName}
          </h1>
          {canManage && (
            <div className="space-x-2">
              <Link
                to={`/employees/${id}/edit`}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {t('common.edit')}
              </Link>
              {isAdmin && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  {t('common.delete')}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">{t('employee.position')}</p>
            <p className="font-medium">{employee.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('employee.email')}</p>
            <p className="font-medium">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('employee.phone')}</p>
            <p className="font-medium">{employee.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('employee.hireDate')}</p>
            <p className="font-medium">{new Date(employee.hireDate).toLocaleDateString()}</p>
          </div>
        </div>

        {canManage && (
          <>
            <h2 className="text-xl font-semibold mb-4">{t('employee.recentAppointments')}</h2>
            {employee.appointmentServices.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.service')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.customer')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.date')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.statusLabel')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employee.appointmentServices.map((apt) => (
                    <tr key={apt.id}>
                      <td className="px-4 py-2">{apt.serviceName}</td>
                      <td className="px-4 py-2">{apt.customerName}</td>
                      <td className="px-4 py-2">{new Date(apt.appointmentDateTime).toLocaleString()}</td>
                      <td className="px-4 py-2">{t(`appointment.status.${AppointmentStatusLabels[apt.status]}`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">{t('common.noData')}</p>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('common.confirmDelete')}
        message={t('employee.deleteConfirm')}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
