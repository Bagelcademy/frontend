import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {  Globe ,Moon} from 'lucide-react';
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
  const { t } = useTranslation(); // Call the useTranslation hook

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm backdrop-blur-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">Bagelcademy</Link>
          <Link to="/shop" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Button className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full p-2 hover:scale-105 transform transition-all duration-300">
              {t('getting PRO')}
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-buttonColor dark:hover:text-buttonColor transition-colors">{t('home')}</Link>
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
<Button onClick={toggleTheme}  size="icon" className="bg-black text-white ml-2 text-yellow-400">
  <img src={sun} className="w-6 h-6 mr-2" alt="Sun Icon" />
</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-6 w-6 bg-white text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fa')}>
                فارسی
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
