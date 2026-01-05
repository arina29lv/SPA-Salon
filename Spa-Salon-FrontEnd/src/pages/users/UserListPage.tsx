import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../api';
import { User } from '../../types';
import { LoadingSpinner, Pagination, ConfirmDialog } from '../../components/common';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, UserIcon, Mail, Shield } from 'lucide-react';
import { UserRole } from '../../types/common';

export const UserListPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { page, pageSize, setPage } = usePagination();

  const isAdmin = user && user.role >= UserRole.Admin;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getAll(page, pageSize);
      setUsers(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await userApi.delete(deleteId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
    setDeleteId(null);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.Guest:
        return t('role.guest');
      case UserRole.Customer:
        return t('role.customer');
      case UserRole.Employee:
        return t('role.employee');
      case UserRole.Manager:
        return t('role.manager');
      case UserRole.Admin:
        return t('role.admin');
      default:
        return '';
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return 'badge-danger';
      case UserRole.Manager:
        return 'badge-warning';
      case UserRole.Employee:
        return 'badge-primary';
      case UserRole.Customer:
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
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
        <h1 className="font-serif text-2xl text-charcoal">{t('user.title')}</h1>
        {isAdmin && (
          <Link to="/users/new" className="btn btn-primary inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('user.create')}
          </Link>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>{t('user.email')}</th>
              <th>{t('user.role')}</th>
              <th>{t('user.createdAt')}</th>
              <th className="text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cream rounded-full">
                      <UserIcon className="h-5 w-5 text-gray-dark" />
                    </div>
                    <div className="flex items-center gap-1 text-charcoal">
                      <Mail className="h-4 w-4 text-gray-medium" />
                      {u.email}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getRoleBadge(u.role)}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(u.role)}
                  </span>
                </td>
                <td className="text-gray-dark">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/users/${u.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      {t('common.view')}
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          to={`/users/${u.id}/edit`}
                          className="btn btn-secondary p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(u.id)}
                          className="btn btn-danger p-2"
                          disabled={u.id === user?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-dark">
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
        message={t('user.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
