import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { serviceApi } from '../../api';
import { ServiceDetail } from '../../types';
import { LoadingSpinner, ConfirmDialog } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Edit, Trash2, User, Briefcase } from 'lucide-react';

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
  </svg>
);
import { UserRole } from '../../types/common';

export const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const canManage = user && user.role >= UserRole.Manager;

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const data = await serviceApi.getById(id);
        setService(data);
      } catch (error) {
        console.error('Failed to fetch service:', error);
        navigate('/services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await serviceApi.delete(id);
      navigate('/services');
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/services" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
            <span className={`badge ${service.isActive ? 'badge-success' : 'badge-danger'}`}>
              {service.isActive ? t('common.active') : t('common.inactive')}
            </span>
          </div>
          {canManage && (
            <div className="flex gap-2">
              <Link
                to={`/services/${service.id}/edit`}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </Link>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="btn btn-danger inline-flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('common.delete')}
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6">{service.description || t('common.noDescription')}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3 p-4 bg-cream rounded-lg border border-border">
            <ClockIcon className="h-8 w-8 text-gold" />
            <div>
              <p className="text-sm text-gray-dark">{t('service.duration')}</p>
              <p className="text-lg font-semibold text-charcoal">{service.durationMinutes} {t('common.minutes')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-4 bg-cream rounded-lg border border-border">
            <DollarIcon className="h-12 w-12 text-gold" />
            <div>
              <p className="text-sm text-gray-dark">{t('service.price')}</p>
              <p className="text-lg font-semibold text-charcoal">{service.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('service.assignedEmployee')}
          </h2>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{service.employeeFirstName} {service.employeeLastName}</p>
            </div>
            <span className="badge badge-primary flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {service.employeePosition}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('common.confirmDelete')}
        message={t('service.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};
