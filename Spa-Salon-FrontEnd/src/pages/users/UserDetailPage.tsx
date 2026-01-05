import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../api';
import { UserDetail } from '../../types';
import { LoadingSpinner, ConfirmDialog } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Edit, Trash2, UserIcon, Mail, Shield, Calendar, Briefcase, Phone } from 'lucide-react';
import { UserRole } from '../../types/common';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAdmin = user && user.role >= UserRole.Admin;

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await userApi.getById(id);
        setUserDetail(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await userApi.delete(id);
      navigate('/users');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
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

  if (!userDetail) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/users" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-100 rounded-full">
              <UserIcon className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userDetail.email}</h1>
              <span className={`badge ${getRoleBadge(userDetail.role)}`}>
                <Shield className="h-3 w-3 mr-1" />
                {getRoleLabel(userDetail.role)}
              </span>
            </div>
          </div>
          {isAdmin && userDetail.id !== user?.id && (
            <div className="flex gap-2">
              <Link
                to={`/users/${userDetail.id}/edit`}
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

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="h-6 w-6 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">{t('user.email')}</p>
              <p className="font-medium">{userDetail.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-6 w-6 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">{t('user.createdAt')}</p>
              <p className="font-medium">{new Date(userDetail.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {userDetail.customer && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('user.linkedCustomer')}</h2>
            <Link
              to={`/customers/${userDetail.customer.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{userDetail.customer.firstName} {userDetail.customer.lastName}</p>
                  <p className="text-sm text-gray-500">{userDetail.customer.email}</p>
                  {userDetail.customer.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="h-4 w-4" />
                      {userDetail.customer.phone}
                    </p>
                  )}
                </div>
                <span className="badge badge-success">{t('role.customer')}</span>
              </div>
            </Link>
          </div>
        )}

        {userDetail.employee && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('user.linkedEmployee')}</h2>
            <Link
              to={`/employees/${userDetail.employee.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{userDetail.employee.firstName} {userDetail.employee.lastName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {userDetail.employee.position}
                  </p>
                </div>
                <span className="badge badge-primary">{t('role.employee')}</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('common.confirmDelete')}
        message={t('user.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};
