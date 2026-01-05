import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className={`flex-1 ${isHomePage ? '' : 'pt-20'}`}>
        {!isHomePage && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <Outlet />
          </div>
        )}
        {isHomePage && <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
