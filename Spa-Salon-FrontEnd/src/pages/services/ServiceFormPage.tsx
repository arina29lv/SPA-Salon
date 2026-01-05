import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { serviceApi, employeeApi } from '../../api';
import type { Employee } from '../../types';
import { LoadingSpinner } from '../../components/common';
import { ArrowLeft } from 'lucide-react';

const serviceSchema = z.object({
  name: z.string().min(1, 'validation.required').max(100, 'validation.maxLength'),
  description: z.string().max(500, 'validation.maxLength').optional(),
  price: z.number().min(0, 'validation.minValue'),
  durationMinutes: z.number().min(1, 'validation.minValue').max(480, 'validation.maxValue'),
  isActive: z.boolean(),
  employeeId: z.string().min(1, 'validation.required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export const ServiceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationMinutes: 30,
      isActive: true,
      employeeId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await employeeApi.getAllList();
        setEmployees(employeesData);

        if (id) {
          const service = await serviceApi.getById(id);
          reset({
            name: service.name,
            description: service.description || '',
            price: service.price,
            durationMinutes: service.durationMinutes,
            isActive: service.isActive,
            employeeId: service.employeeId,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (id) navigate('/services');
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [id, reset, navigate]);

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await serviceApi.update(id!, data);
      } else {
        await serviceApi.create(data);
      }
      navigate('/services');
    } catch (error) {
      console.error('Failed to save service:', error);
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
      <Link to="/services" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? t('service.edit') : t('service.create')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('service.name')} *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="input"
              placeholder={t('service.namePlaceholder')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{t(errors.name.message!)}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('service.description')}
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="input"
              placeholder={t('service.descriptionPlaceholder')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{t(errors.description.message!)}</p>
            )}
          </div>

          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              {t('service.assignedEmployee')} *
            </label>
            <select
              id="employeeId"
              {...register('employeeId')}
              className="input"
            >
              <option value="">{t('common.select')}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - {employee.position}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-600">{t(errors.employeeId.message!)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                {t('service.price')} *
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="input"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{t(errors.price.message!)}</p>
              )}
            </div>

            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                {t('service.duration')} ({t('common.minutes')}) *
              </label>
              <input
                type="number"
                id="durationMinutes"
                {...register('durationMinutes', { valueAsNumber: true })}
                className="input"
              />
              {errors.durationMinutes && (
                <p className="mt-1 text-sm text-red-600">{t(errors.durationMinutes.message!)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              {t('common.active')}
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : (isEditing ? t('common.save') : t('common.create'))}
            </button>
            <Link to="/services" className="btn btn-secondary flex-1 text-center">
              {t('common.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
