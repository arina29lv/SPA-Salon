import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const SparklesIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FeatureCard = ({
  icon,
  title,
  description,
  linkText,
  linkTo,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkTo: string;
}) => (
  <div className="bg-white border border-border rounded-sm p-8 md:p-10 text-center h-full flex flex-col transition-all duration-300 hover:border-gold-light hover:shadow-soft">
    <div className="h-1 bg-gold -mt-8 md:-mt-10 -mx-8 md:-mx-10 mb-8" />
    <div className="mb-6 text-gold flex justify-center">
      {icon}
    </div>
    <h3 className="font-serif text-xl md:text-2xl text-charcoal mb-4">
      {title}
    </h3>
    <p className="text-gray-dark leading-relaxed mb-6 flex-grow">
      {description}
    </p>
    <Link
      to={linkTo}
      className="inline-flex items-center justify-center text-gold font-medium
                 hover:text-gold-hover transition-colors duration-300 group"
    >
      {linkText}
      <svg
        className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </Link>
  </div>
);

export const HomePage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const getWelcomeMessage = () => {
    if (!user) return '';

    switch (user.role) {
      case UserRole.Admin:
        return t('home.welcomeAdmin');
      case UserRole.Manager:
        return t('home.welcomeManager');
      case UserRole.Employee:
        return `${t('home.welcomeUser')} ${user.firstName || user.email}`;
      default:
        return `${t('home.welcomeUser')} ${user.firstName || user.email}`;
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-script font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-tight">
            {getWelcomeMessage()}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/30 to-cream" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          <div className="w-16 h-0.5 bg-gold mx-auto mb-8" />
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-tight">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/appointments"
              className="px-8 py-4 bg-gold text-white text-sm tracking-widest uppercase
                         hover:bg-gold-hover transition-all duration-300 rounded-sm"
            >
              {t('home.bookNow')}
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 border border-white/70 text-white text-sm tracking-widest uppercase
                         hover:bg-white hover:text-charcoal transition-all duration-300 rounded-sm"
            >
              {t('home.viewAll')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <svg
            className="w-6 h-6 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="w-12 h-0.5 bg-gold mx-auto mb-6" />
            <h2 className="font-script font-bold text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
              {t('home.welcome')}
            </h2>
            <p className="text-gray-dark text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t('home.welcomeSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard
              icon={<SparklesIcon />}
              title={t('home.card1Title')}
              description={t('home.card1Description')}
              linkText={t('home.card1Link')}
              linkTo="/services"
            />
            <FeatureCard
              icon={<UsersIcon />}
              title={t('home.card2Title')}
              description={t('home.card2Description')}
              linkText={t('home.card2Link')}
              linkTo="/employees"
            />
            <FeatureCard
              icon={<CalendarIcon />}
              title={t('home.card3Title')}
              description={t('home.card3Description')}
              linkText={t('home.card3Link')}
              linkTo="/appointments"
            />
          </div>
        </div>
      </section>

      <section className="pt-6 pb-24 md:pt-8 md:pb-32 bg-cream">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <svg
            className="w-12 h-12 text-gold mx-auto mb-8 opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal leading-relaxed mb-8 italic">
            {t('home.quote')}
          </blockquote>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-burgundy text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-script font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/appointments"
              className="px-10 py-4 bg-gold text-white text-sm tracking-widest uppercase
                         hover:bg-gold-hover transition-all duration-300 rounded-sm"
            >
              {t('home.ctaBookNow')}
            </Link>
            <Link
              to="/services"
              className="px-10 py-4 border border-white/50 text-white text-sm tracking-widest uppercase
                         hover:bg-white hover:text-burgundy transition-all duration-300 rounded-sm"
            >
              {t('home.ctaViewAll')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
