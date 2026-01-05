import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { employeeApi } from '../../api';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/common';
import { Plus } from 'lucide-react';

export function EmployeeListPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user && user.role >= UserRole.Admin;

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees-list'],
    queryFn: () => employeeApi.getAllList(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{t('common.error')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl text-charcoal">{t('employee.title')}</h1>
        {isAdmin && (
          <Link
            to="/employees/new"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            {t('employee.create')}
          </Link>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>{t('employee.firstName')} / {t('employee.lastName')}</th>
              <th>{t('employee.position')}</th>
              <th>{t('employee.email')}</th>
              <th className="text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee.id}>
                <td className="font-medium text-charcoal">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="text-gray-dark">{employee.position}</td>
                <td className="text-gray-dark">{employee.email}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/employees/${employee.id}`}
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

      {employees?.length === 0 && (
        <div className="text-center py-12 text-gray-dark">
          {t('common.noData')}
        </div>
      )}
    </div>
  );
}
