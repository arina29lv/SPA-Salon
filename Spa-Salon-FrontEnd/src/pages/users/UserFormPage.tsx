import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userApi } from '../../api';
import type { CreateUser, UpdateUser } from '../../types';
import { LoadingSpinner } from '../../components/common';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '../../types/common';

export const UserFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<number>(UserRole.Customer);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; firstName?: string; lastName?: string; position?: string }>({});

  const isStaffRole = role === UserRole.Employee || role === UserRole.Manager || role === UserRole.Admin;

  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const userData = await userApi.getById(id);
          setEmail(userData.email);
          setRole(userData.role);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          navigate('/users');
        } finally {
          setIsFetching(false);
        }
      };
      fetchUser();
    }
  }, [id, navigate]);

  const validate = () => {
    const newErrors: { email?: string; password?: string; firstName?: string; lastName?: string; position?: string } = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('validation.email');
    }

    if (!isEditing && (!password || password.length < 6)) {
      newErrors.password = t('validation.minLength', { min: 6 });
    }

    if (!isEditing && !firstName.trim()) {
      newErrors.firstName = t('validation.required');
    }

    if (!isEditing && !lastName.trim()) {
      newErrors.lastName = t('validation.required');
    }

    if (!isEditing && isStaffRole && !position.trim()) {
      newErrors.position = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        const updatePayload: UpdateUser = {
          email,
          role: role as UserRole,
        };
        await userApi.update(id!, updatePayload);
      } else {
        const createPayload: CreateUser = {
          email,
          password,
          role: role as UserRole,
          firstName,
          lastName,
          phone: phone || undefined,
          position: isStaffRole ? position : undefined,
          hireDate: isStaffRole && hireDate ? hireDate : undefined,
        };
        await userApi.create(createPayload);
      }
      navigate('/users');
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/users" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? t('user.edit') : t('user.create')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.firstName')} *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.lastName')} *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('user.email')} *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {!isEditing && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
              />
            </div>
          )}

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              {t('user.role')} *
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(parseInt(e.target.value))}
              className="input"
            >
              <option value={UserRole.Customer}>{t('role.customer')}</option>
              <option value={UserRole.Employee}>{t('role.employee')}</option>
              <option value={UserRole.Manager}>{t('role.manager')}</option>
              <option value={UserRole.Admin}>{t('role.admin')}</option>
            </select>
          </div>

          {!isEditing && isStaffRole && (
            <>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('employee.position')} *
                </label>
                <input
                  type="text"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="input"
                  required
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('employee.hireDate')}
                </label>
                <input
                  type="date"
                  id="hireDate"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="input"
                />
              </div>
            </>
          )}

          {!isEditing && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('user.password')} *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : (isEditing ? t('common.save') : t('common.create'))}
            </button>
            <Link to="/users" className="btn btn-secondary flex-1 text-center">
              {t('common.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
