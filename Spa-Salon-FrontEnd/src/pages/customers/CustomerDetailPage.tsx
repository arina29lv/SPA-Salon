import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { customerApi } from '../../api';
import { LoadingSpinner, ConfirmDialog } from '../../components/common';
import { useState } from 'react';
import { AppointmentStatusLabels } from '../../types';

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => customerApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !customer) return <div className="text-red-500">{t('common.error')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {customer.firstName} {customer.lastName}
          </h1>
          <div className="space-x-2">
            <Link
              to={`/customers/${id}/edit`}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {t('common.edit')}
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">{t('customer.email')}</p>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('customer.phone')}</p>
            <p className="font-medium">{customer.phone || '-'}</p>
          </div>
          {customer.dateOfBirth && (
            <div>
              <p className="text-sm text-gray-500">{t('customer.dateOfBirth')}</p>
              <p className="font-medium">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">{t('customer.recentAppointments')}</h2>
        {customer.appointments.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.date')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.statusLabel')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('appointment.totalPrice')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customer.appointments.map((apt) => (
                <tr key={apt.id}>
                  <td className="px-4 py-2">{new Date(apt.appointmentDateTime).toLocaleString()}</td>
                  <td className="px-4 py-2">{t(`appointment.status.${AppointmentStatusLabels[apt.status]}`)}</td>
                  <td className="px-4 py-2">${apt.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">{t('customer.noAppointments')}</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('common.confirmDelete')}
        message={t('customer.deleteConfirm')}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
