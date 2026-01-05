import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { employeeApi } from '../../api';
import { LoadingSpinner } from '../../components/common';
import { ArrowLeft } from 'lucide-react';
import type { CreateEmployee, UpdateEmployee } from '../../types';

export function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getById(id!),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateEmployee>();

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        hireDate: employee.hireDate.split('T')[0],
      });
    }
  }, [employee, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CreateEmployee) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateEmployee) => employeeApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      navigate(`/employees/${id}`);
    },
  });

  const onSubmit = async (data: CreateEmployee) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/employees" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? t('employee.edit') : t('employee.create')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('employee.firstName')} *
              </label>
              <input
                {...register('firstName', { required: t('validation.required') })}
                className="input"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('employee.lastName')} *
              </label>
              <input
                {...register('lastName', { required: t('validation.required') })}
                className="input"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('employee.email')} *
            </label>
            <input
              type="email"
              {...register('email', { required: t('validation.required') })}
              className="input"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('employee.phone')}
            </label>
            <input
              {...register('phone')}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('employee.position')} *
            </label>
            <input
              {...register('position', { required: t('validation.required') })}
              className="input"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('employee.hireDate')} *
            </label>
            <input
              type="date"
              {...register('hireDate', { required: t('validation.required') })}
              className="input"
            />
            {errors.hireDate && (
              <p className="mt-1 text-sm text-red-600">{errors.hireDate.message}</p>
            )}
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.password')} *
              </label>
              <input
                type="password"
                {...register('password', { required: !isEdit ? t('validation.required') : false })}
                className="input"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : (isEdit ? t('common.save') : t('common.create'))}
            </button>
            <Link to="/employees" className="btn btn-secondary flex-1 text-center">
              {t('common.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
