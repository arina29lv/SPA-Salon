import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { customerApi } from '../../api';
import { LoadingSpinner } from '../../components/common';
import { ArrowLeft } from 'lucide-react';
import type { CreateCustomer, UpdateCustomer } from '../../types';

export function CustomerFormPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id!),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCustomer>();

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        dateOfBirth: customer.dateOfBirth?.split('T')[0],
      });
    }
  }, [customer, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CreateCustomer) => customerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCustomer) => customerApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      navigate(`/customers/${id}`);
    },
  });

  const onSubmit = async (data: CreateCustomer) => {
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
      <Link to="/customers" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? t('customer.edit') : t('customer.create')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('customer.firstName')} *
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
                {t('customer.lastName')} *
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
              {t('customer.email')} *
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
              {t('customer.phone')}
            </label>
            <input
              {...register('phone')}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('customer.dateOfBirth')}
            </label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="input"
            />
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
            <Link to="/customers" className="btn btn-secondary flex-1 text-center">
              {t('common.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
