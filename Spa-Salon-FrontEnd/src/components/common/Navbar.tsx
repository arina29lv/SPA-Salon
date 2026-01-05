import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const isAdmin = user?.role === UserRole.Admin;
  const canAccessManagement = user && (user.role >= UserRole.Manager);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-sm tracking-wide transition-colors duration-300
     ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}
     after:content-[''] after:absolute after:bottom-0 after:left-0
     after:h-px after:bg-gold after:transition-all after:duration-300
     ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 text-lg tracking-wide border-b border-border transition-colors duration-300
     ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`;

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return t('role.admin');
      case UserRole.Manager:
        return t('role.manager');
      case UserRole.Employee:
        return t('role.employee');
      case UserRole.Customer:
        return t('role.customer');
      default:
        return t('role.guest');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-cream/95 backdrop-blur-sm shadow-soft' : 'bg-cream'}
        border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="font-script font-bold text-4xl md:text-5xl text-charcoal hover:text-gold transition-colors duration-300"
          >
            Spa Salon
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" end className={navLinkClass}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              {t('nav.services')}
            </NavLink>
            {(!user || user.role <= UserRole.Customer) && (
              <NavLink to="/employees" className={navLinkClass}>
                {t('nav.team')}
              </NavLink>
            )}
            <NavLink to="/appointments" className={navLinkClass}>
              {t('nav.appointments')}
            </NavLink>
            {canAccessManagement && (
              <>
                <NavLink to="/customers" className={navLinkClass}>
                  {t('nav.customers')}
                </NavLink>
                <NavLink to="/employees" className={navLinkClass}>
                  {t('nav.employees')}
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/users" className={navLinkClass}>
                {t('nav.users')}
              </NavLink>
            )}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium">
              <button
                onClick={() => i18n.changeLanguage('pl')}
                className={`px-1 transition-colors duration-200 ${
                  i18n.language === 'pl' ? 'text-gold' : 'text-gray-dark hover:text-gold'
                }`}
              >
                PL
              </button>
              <span className="text-gray-400 mx-1">|</span>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-1 transition-colors duration-200 ${
                  i18n.language === 'en' ? 'text-gold' : 'text-gray-dark hover:text-gold'
                }`}
              >
                EN
              </button>
            </div>
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-dark">
                  <span className="text-charcoal font-medium">{user?.firstName || user?.email}</span>
                  <span className="ml-2 text-xs text-gold">({getRoleName(user?.role ?? UserRole.Guest)})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm tracking-wide text-charcoal hover:text-gold transition-colors duration-300"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm tracking-wide text-charcoal hover:text-gold transition-colors duration-300"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm tracking-wide border border-gold text-gold
                             hover:bg-gold hover:text-white transition-all duration-300 rounded-sm"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-[600px] pb-6' : 'max-h-0'}`}
        >
          <nav className="pt-4">
            <NavLink
              to="/"
              end
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/services"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.services')}
            </NavLink>
            {(!user || user.role <= UserRole.Customer) && (
              <NavLink
                to="/employees"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.team')}
              </NavLink>
            )}
            <NavLink
              to="/appointments"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.appointments')}
            </NavLink>
            {canAccessManagement && (
              <>
                <NavLink
                  to="/customers"
                  className={mobileNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.customers')}
                </NavLink>
                <NavLink
                  to="/employees"
                  className={mobileNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.employees')}
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink
                to="/users"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.users')}
              </NavLink>
            )}
          </nav>

          <div className="flex flex-col space-y-3 pt-6">
            <div className="flex justify-center items-center py-2 border-b border-border text-sm font-medium">
              <button
                onClick={() => i18n.changeLanguage('pl')}
                className={`px-2 transition-colors duration-200 ${
                  i18n.language === 'pl' ? 'text-gold' : 'text-gray-dark hover:text-gold'
                }`}
              >
                PL
              </button>
              <span className="text-gray-400 mx-1">|</span>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 transition-colors duration-200 ${
                  i18n.language === 'en' ? 'text-gold' : 'text-gray-dark hover:text-gold'
                }`}
              >
                EN
              </button>
            </div>
            {isAuthenticated ? (
              <>
                <div className="text-center py-2 text-gray-dark border-b border-border">
                  <span className="text-charcoal font-medium">{user?.firstName || user?.email}</span>
                  <span className="ml-2 text-xs text-gold">({getRoleName(user?.role ?? UserRole.Guest)})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-center py-3 text-charcoal hover:text-gold transition-colors duration-300"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-center py-3 text-charcoal hover:text-gold transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-center py-3 border border-gold text-gold
                             hover:bg-gold hover:text-white transition-all duration-300 rounded-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
export default Navbar;
