import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import '../../css/Header.css';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const Header = ({ isDarkTheme, toggleTheme, changeLanguage }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedInStatus === 'true');
    };

    checkLoginStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);

    // Custom event listener for login state changes
    window.addEventListener('loginStateChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChanged', checkLoginStatus);
    };
  }, []);

const handleLogoutClick = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (!refreshToken) {
      setError(t('Refresh token not found. Please log in.'));
      return;
    }

    const response = await fetch('https://bagelapi.artina.org/account/logout/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (response.ok) {
      handleLogoutClick();  // Custom logout handler (clear state)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);

      window.dispatchEvent(new Event('loginStateChanged'));
      enqueueSnackbar(t('You have been logged out.'), { variant: 'success' });
      navigate('/login');
    } else {
      const errorData = await response.json();
      enqueueSnackbar(t('Failed to log out. Please try again later.'), { variant: 'error' });
      console.error('Logout error:', errorData);
    }
  } catch (error) {
    enqueueSnackbar(t('Failed to log out. Please try again later.'), { variant: 'error' });
    console.error('Logout error:', error);
  }
};

  
  

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    
    <header className="bg-white dark:bg-gray-800 shadow-sm backdrop-blur-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-b7 text-gray-900 dark:text-white">Bagelcademy</Link>
          <Link to="/shop" className="md:flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Button className="bg-gradient-to-r from-red-700 to-red-400 text-white rounded-lg p-2 hover:scale-105 transform transition-all duration-300">
              {t('getting PRO')}
            </Button>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="mx-2 text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">{t('home')}</Link>
          <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">{t('courses')}</Link>

          {isLoggedIn ? (
            <>
              <Link to="/my-courses" className="text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">{t('myCourses')}</Link>
              <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">{t('profile')}</Link>
              <Button onClick={handleLogoutClick} variant="outline">{t('logout')}</Button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">{t('login')}</Link>
          )}

          <div onClick={toggleTheme} className="mx-2 cursor-pointer">
            {isDarkTheme ? (
              <Moon className="h-6 w-6 bg-white text-black dark:bg-gray-800 dark:text-white" />
            ) : (
              <Sun className="h-6 w-6 bg-white text-black" />
            )}
          </div>

          <div onClick={toggleLanguage} className="mx-2 cursor-pointer flex items-center">
            <Globe className="h-6 w-6 bg-white text-black dark:bg-gray-800 dark:text-white" />
            <span className="mx-2 text-gray-700 dark:text-gray-300">
              {currentLanguage === 'en' ? 'فا' : 'EN'}
            </span>
          </div>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="bg-white text-gray-700 dark:text-gray-300">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-2 space-y-3">
          <Link to="/" onClick={toggleMenu} className="block text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">
            {t('home')}
          </Link>
          <Link to="/courses" onClick={toggleMenu} className="block text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">
            {t('courses')}
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/my-courses" onClick={toggleMenu} className="block text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">
                {t('myCourses')}
              </Link>
              <Link to="/profile" onClick={toggleMenu} className="block text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">
                {t('profile')}
              </Link>
              <button onClick={() => {handleLogoutClick(); toggleMenu();}} className="block text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/login" onClick={toggleMenu} className="block text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">
              {t('login')}
            </Link>
          )}

          {/* Theme Toggle for Mobile */}
          <div onClick={toggleTheme} className="block text-gray-700 dark:text-gray-300 cursor-pointer">
            {isDarkTheme ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </div>

          {/* Language Toggle for Mobile */}
          <div onClick={toggleLanguage} className="text-gray-700 dark:text-gray-300 cursor-pointer flex gap-1">
            <Globe className="h-6 w-6" />
            <span className="ml-2">{currentLanguage === 'en' ? 'فا' : 'EN'}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
