import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { customerApi } from '../../api';
import { Pagination, LoadingSpinner } from '../../components/common';
import { Plus } from 'lucide-react';

export function CustomerListPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', page, pageSize],
    queryFn: () => customerApi.getAll(page, pageSize),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{t('common.error')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl text-charcoal">{t('customer.title')}</h1>
        <Link
          to="/customers/new"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {t('customer.create')}
        </Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>{t('customer.firstName')} / {t('customer.lastName')}</th>
              <th>{t('customer.email')}</th>
              <th>{t('customer.phone')}</th>
              <th className="text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((customer) => (
              <tr key={customer.id}>
                <td className="font-medium text-charcoal">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="text-gray-dark">{customer.email}</td>
                <td className="text-gray-dark">{customer.phone || '-'}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      {t('common.view')}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.items.length === 0 && (
        <div className="text-center py-12 text-gray-dark">
          {t('common.noData')}
        </div>
      )}

      {data && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
