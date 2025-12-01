import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import DiscountBanner from './DiscountBanner';

const Layout = ({ 
  children, 
  isLoggedIn, 
  setIsLoggedIn,
  isDarkTheme, 
  toggleTheme, 
  handleLogout, 
  changeLanguage 
}) => {
  const location = useLocation();
  const isIntroPage = location.pathname === '/';

  // Force scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply dark mode class to <html> tag when isDarkTheme is true
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col">
      <div className={isIntroPage ? 'hidden' : ''}>
        <Header 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          changeLanguage={changeLanguage}
        />
      </div>

      <main className="flex-grow flex flex-col">
        <div className="w-full flex-grow">
          {!isIntroPage && <DiscountBanner />}
          {children}
        </div>
      </main>

      {!isIntroPage && <Footer />}
    </div>
  );
};

export default Layout;
