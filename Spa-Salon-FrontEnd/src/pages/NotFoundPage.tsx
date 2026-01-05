import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page not found</p>
        <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
          <Home className="h-5 w-5" />
          {t('nav.home')}
        </Link>
      </div>
    </div>
  );
};
