import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import sun from '../../assets/sun.svg'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import '../../css/Header.css'; // Import your new CSS file if you create one
import { useTranslation } from 'react-i18next'; // Import the hook

const Header = ({ isDarkTheme, toggleTheme, handleLogout, changeLanguage }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation(); // Call the useTranslation hook
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language); // Track current language


  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm backdrop-blur-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">Bagelcademy</Link>
          <Link to="/shop" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Button className="bg-gradient-to-r from-red-700 to-red-400 text-white rounded-lg p-2 hover:scale-105 transform transition-all duration-300">
              {t('getting PRO')}
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
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

          {/* Sun and Moon Toggle */}
          <div onClick={toggleTheme} className="mx-2 cursor-pointer">
            {isDarkTheme ? (
              <Moon className="h-6 w-6 bg-white text-black dark:bg-gray-800 dark:text-white" />
            ) : (
              <Sun className="h-6 w-6 bg-white text-black" />
            )}
          </div>

          <div onClick={toggleLanguage} className="mx-2 cursor-pointer flex items-center">
            <Globe className="h-6 w-6 bg-white text-black dark:bg-gray-800 dark:text-white"/>
            <span className="mx-2 text-gray-700 dark:text-gray-300">
              {currentLanguage === 'en' ? 'فا' : 'EN'}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
