import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import DiscountBanner from './DiscountBanner';
import DownloadAppBanner from './DownloadAppBanner';

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
      <Header 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        changeLanguage={changeLanguage}
      />

      <main className="flex-grow flex flex-col">
        <div className="w-full flex-grow">
          <DiscountBanner />
          {children}
        </div>
      </main>

      <DownloadAppBanner />
      <Footer />
    </div>
  );
};

export default Layout;
