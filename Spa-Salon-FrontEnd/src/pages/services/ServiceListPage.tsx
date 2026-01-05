import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { serviceApi } from '../../api';
import { Service } from '../../types';
import { LoadingSpinner, Pagination, ConfirmDialog } from '../../components/common';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Clock, User } from 'lucide-react';

const DollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
  </svg>
);
import { UserRole } from '../../types/common';

export const ServiceListPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { page, pageSize, setPage } = usePagination();

  const canManage = user && user.role >= UserRole.Manager;

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await serviceApi.getAll(page, pageSize);
      setServices(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, pageSize]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await serviceApi.delete(deleteId);
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl text-charcoal">{t('service.title')}</h1>
        {canManage && (
          <Link to="/services/new" className="btn btn-primary inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('service.create')}
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <span className={`badge ${service.isActive ? 'badge-success' : 'badge-danger'}`}>
                {service.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {service.description || t('common.noDescription')}
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <User className="h-4 w-4 mr-1" />
              {service.employeeName}
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {service.durationMinutes} {t('common.minutes')}
              </span>
              <span className="flex items-center font-semibold text-gold gap-0">
                <DollarIcon className="h-6 w-6 -mr-1" />
                {service.price.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/services/${service.id}`}
                className="btn btn-secondary flex-1 text-center"
              >
                {t('common.view')}
              </Link>
              {canManage && (
                <>
                  <Link
                    to={`/services/${service.id}/edit`}
                    className="btn btn-secondary p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(service.id)}
                    className="btn btn-danger p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t('common.noData')}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(totalCount / pageSize)}
        onPageChange={setPage}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title={t('common.confirmDelete')}
        message={t('service.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
