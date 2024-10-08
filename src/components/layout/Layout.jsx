import React from 'react';
import Header from './header';
import Footer from './footer';

const Layout = ({ children, isLoggedIn, isDarkTheme, toggleTheme, handleLogout ,changeLanguage}) => {
  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''} bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col`}>
      <Header 
        isLoggedIn={isLoggedIn}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        changeLanguage={changeLanguage} // Pass it here

      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
