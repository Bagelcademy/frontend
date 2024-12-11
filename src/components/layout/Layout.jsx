import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

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

  // Wrap children in a container that starts from top
  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''} bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col`}>
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
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;