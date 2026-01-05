import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(1, 'validation.required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
      navigate('/');
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-start justify-center pt-2 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-0.5 bg-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-charcoal">
            {t('auth.login')}
          </h2>
        </div>

        <div className="bg-white border border-border rounded-sm p-8 shadow-soft">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  {t('auth.email')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{t(errors.email.message!)}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-medium" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-medium" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{t(errors.password.message!)}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary py-3"
            >
              {isSubmitting ? t('common.loading') : t('auth.login')}
            </button>

            <p className="text-center text-sm text-gray-dark">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-gold hover:text-gold-hover font-medium">
                {t('auth.register')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
