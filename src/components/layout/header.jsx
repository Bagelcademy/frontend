import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Moon, Sun, Menu, Bot, Flower } from 'lucide-react'; // Added Flower icon from lucide-react
import { Button } from '../ui/button';
import '../../css/Header.css';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
// Removed AIIcon import as we'll use the Lucide icon instead

const Header = ({ isLoggedIn, setIsLoggedIn, isDarkTheme, toggleTheme, changeLanguage }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [logoutAlert, setLogoutAlert] = useState(false); // State for logout alert
  const [profilePicture, setProfilePicture] = useState(null);
  // Add state for sparkle animation
  const [sparkleAnimate, setSparkleAnimate] = useState(false);
  // Add state for flower animation
  const [flowerAnimate, setFlowerAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  // Add sparkle animation effect
  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setSparkleAnimate(true);
      setTimeout(() => setSparkleAnimate(false), 1000);
    }, 3000);

    return () => clearInterval(sparkleInterval);
  }, []);

  // Add flower animation effect
  useEffect(() => {
    const flowerInterval = setInterval(() => {
      setFlowerAnimate(true);
      setTimeout(() => setFlowerAnimate(false), 1000);
    }, 4000);

    return () => clearInterval(flowerInterval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.tadrisino.org/account/user-info/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profile_picture); // Store the profile picture URL
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('loginStateChanged'));
  };

  const handleLogoutClick = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');

      if (!refreshToken || !accessToken) {
        console.log('No tokens found in local storage.');
        clearAuthData();
        enqueueSnackbar(t('Session expired. Please log in again.'), { variant: 'info' });
        navigate('/login');
        return;
      }

      const response = await fetch('https://api.tadrisino.org/account/logout/logout/', {
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
        clearAuthData();
        enqueueSnackbar(t('You have been logged out.'), { variant: 'success' });
        setLogoutAlert(true); // Show logout alert
        setTimeout(() => setLogoutAlert(false), 5000); // Hide alert after 5 seconds
        setIsLoggedIn(false);
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Logout error:', errorData);
        clearAuthData();
        enqueueSnackbar(t('Failed to log out properly, but your session has been cleared.'), { variant: 'warning' });
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      clearAuthData();
      enqueueSnackbar(t('Failed to log out properly, but your session has been cleared.'), { variant: 'warning' });
      navigate('/login');
    }
  };

  // const toggleLanguage = () => {
  //   const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
  //   setCurrentLanguage(newLanguage);
  //   changeLanguage(newLanguage);
  // };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'fa' : 'en';
    changeLanguage(newLanguage);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to trigger manual sparkle animation
  const triggerSparkle = () => {
    setSparkleAnimate(true);
    setTimeout(() => setSparkleAnimate(false), 1000);
  };

  // Function to trigger manual flower animation
  const triggerFlower = () => {
    setFlowerAnimate(true);
    setTimeout(() => setFlowerAnimate(false), 1000);
  };

  return (
    <header
      className={`
        fixed w-full top-0 z-50 transition-all duration-100
        ${scrolled ? 'py-2' : 'py-4'}
        ${isDarkTheme
          ? 'bg-gray-800/70 shadow-lg shadow-gray-900/10'
          : 'bg-white/30 shadow-lg shadow-gray-200/10'
        }
        backdrop-blur-xl
        border-b
        ${isDarkTheme ? 'border-gray-700/30' : 'border-gray-200/30'}
      `}
    >
      {/* Logout alert block */}
      {logoutAlert && (
        <div className="fixed mt-20 bg-green-600 text-white font-b7 p-4 text-center shadow-md transition-transform duration-300">
          {t('You have successfully logged out.')}
        </div>
      )}

      <nav className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-xl font-b6 relative overflow-hidden
              ${isDarkTheme ? 'text-white' : 'text-gray-900'}
              ${isDarkTheme ? 'hover:text-gray-300' : 'hover:text-gray-900'}
            `}
          >
            {t("Tadrisino")}
          </Link>
          <Link to="/shop">
            <Button
              className={`
                relative overflow-hidden bg-gradient-to-r
                ${isDarkTheme
                  ? 'from-gray-700 to-gray-600'
                  : 'from-gray-800 to-gray-700'
                }
                text-white rounded-lg p-2
                hover:scale-105 transform transition-all duration-300
                before:absolute before:inset-0 before:bg-white/10
                before:translate-x-[-100%] hover:before:translate-x-[100%]
                before:transition-transform before:duration-500
                shadow-lg
              `}
            >
              {t('getting PRO')}
            </Button>
          </Link>
          <Link to="/ask" onClick={triggerSparkle}>
            {/* Replace the image with Lucide React Bot icon */}
            <div className="relative group">
              <Bot
                size={32}
                className={`
                  transition-all duration-300
                  ${isDarkTheme ? 'text-white' : 'text-gray-900'}
                  ${sparkleAnimate ? 'scale-110' : ''}
                  hover:scale-105
                `}
              />
              {/* Add star/sparkle animations around the icon */}
              <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 ${sparkleAnimate ? 'opacity-100' : ''} transition-opacity duration-300`}>
                <div className="absolute top-0 left-0 h-2 w-2 bg-yellow-300 rounded-full animate-pulse"></div>
                <div className="absolute top-1 right-0 h-1 w-1 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 left-1 h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-1 right-1 h-2 w-2 bg-green-300 rounded-full animate-pulse"></div>
                <div className="absolute top-3 right-3 h-1 w-1 bg-pink-400 rounded-full animate-ping"></div>
              </div>
              <span
                className={`
                absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                text-xs whitespace-nowrap px-2 py-1 rounded-md opacity-0 
                group-hover:opacity-100 transition-opacity duration-300
                ${isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}
              `}
              >
                {t('AI Assistant')}
              </span>
            </div>
          </Link>


        </div>

        <div className="hidden md:flex items-center gap-x-4">
          <Link
            to="/"
            className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${isDarkTheme
                ? 'text-gray-300 hover:text-white after:bg-white'
                : 'text-black hover:text-gray-900 after:bg-gray-900'
              }
            `}
          >
            {t('home')}
          </Link>
          <Link
            to="/courses"
            className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${isDarkTheme
                ? 'text-gray-300 hover:text-white after:bg-white'
                : 'text-black hover:text-gray-900 after:bg-gray-900'
              }
            `}
          >
            {t('courses')}
          </Link>

          <Link
            to="/learning-paths"
            className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${isDarkTheme
                ? 'text-gray-300 hover:text-white after:bg-white'
                : 'text-black hover:text-gray-900 after:bg-gray-900'
              }
            `}
          >
            {t('learningPath')}
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/my-courses"
                className={`
                  relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                  after:w-0 hover:after:w-full after:transition-all after:duration-300
                  ${isDarkTheme
                    ? 'text-gray-300 hover:text-white after:bg-white'
                    : 'text-black hover:text-gray-900 after:bg-gray-900'
                  }
                `}
              >


                {t('myCourses')}
              </Link>
              <Link to="/profile">
                <img
                  src={profilePicture || 'https://via.placeholder.com/40'} // Default placeholder
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-black dark:border-white shadow-md cursor-pointer"
                />
              </Link>
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className={`
                  backdrop-blur-sm border
                  ${isDarkTheme
                    ? 'text-white border-gray-600 bg-gray-500 hover:bg-gray-700/50'
                    : 'text-black border-gray-200 bg-gray-300 hover:bg-gray-100/50'
                  }
                  transition-all duration-300
                `}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className={`
                relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:w-0 hover:after:w-full after:transition-all after:duration-300
                ${isDarkTheme
                  ? 'text-gray-300 hover:text-white after:bg-white'
                  : 'text-black hover:text-gray-900 after:bg-gray-900'
                }
              `}
            >
              {t('login')}
            </Link>
          )}

          <div
            onClick={toggleTheme}
            className={`
              cursor-pointer p-2 rounded-full
              hover:bg-gray-200/20 transition-colors duration-300
            `}
          >
            {isDarkTheme ? (
              <Moon className="h-6 w-6 text-white" />
            ) : (
              <Sun className="h-6 w-6 text-black" />
            )}
          </div>

          <div
            onClick={toggleLanguage}
            className={`
              cursor-pointer flex items-center p-2 rounded-full
              hover:bg-gray-200/20 transition-colors duration-300
            `}
          >
            <Globe className={`h-6 w-6 ${isDarkTheme ? 'text-white' : 'text-black'}`} />
            <span className={`mx-2 ${isDarkTheme ? 'text-gray-300' : 'text-black'}`}>
              {currentLanguage === 'en' ? 'فا' : 'EN'}
            </span>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className={`
              p-2 rounded-full
              ${isDarkTheme ? 'text-white' : 'text-gray-700 bg-gray-200'}
              hover:bg-gray-200/20 transition-colors duration-300
            `}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className={`
            md:hidden px-4 py-2 gap-y-3
            backdrop-blur-xl
            ${isDarkTheme
              ? 'bg-transparent'
              : 'bg-transparent'
            }
            border-t
            ${isDarkTheme ? 'border-gray-700/30' : 'border-gray-200/30'}
          `}
        >
          <Link
            to="/"
            onClick={toggleMenu}
            className={`
              block py-2 px-3 rounded-lg
              ${isDarkTheme
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-black hover:bg-gray-100/50'
              }
              transition-colors duration-300
            `}
          >
            {t('home')}
          </Link>
          <Link
            to="/courses"
            onClick={toggleMenu}
            className={`
              block py-2 px-3 rounded-lg
              ${isDarkTheme
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-black hover:bg-gray-100/50'
              }
              transition-colors duration-300
            `}
          >
            {t('courses')}
          </Link>

          <Link
            to="/learning-paths"
            onClick={toggleMenu}
            className={`
              block py-2 px-3 rounded-lg
              ${isDarkTheme
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-black hover:bg-gray-100/50'
              }
              transition-colors duration-300
            `}
          >
            {t('learningPath')}
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/my-courses"
                onClick={toggleMenu}
                className={`
                  block py-2 px-3 rounded-lg
                  ${isDarkTheme
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-black hover:bg-gray-100/50'
                  }
                  transition-colors duration-300
                `}
              >
                {t('myCourses')}
              </Link>
              <Link to="/profile">
                <img
                  src={profilePicture || 'https://via.placeholder.com/40'} // Default placeholder
                  alt="Profile"
                  className="w-10 h-10 mb-4 mt-2 mx-3 rounded-full border-2 border-white shadow-md cursor-pointer"
                />
              </Link>
              <button
                onClick={() => {
                  handleLogoutClick();
                  toggleMenu();
                }}
                className={`
                  block py-2 px-3 rounded-lg mx-3
                  ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}
                  ${isDarkTheme
                    ? 'text-white border-gray-600 bg-gray-500 hover:bg-gray-700/50'
                    : 'text-black border-gray-200 bg-gray-300 hover:bg-gray-100/50'
                  }
                  transition-colors duration-300
                `}
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className={`
                block py-2 px-3 rounded-lg
                ${isDarkTheme
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-black hover:bg-gray-100/50'
                }
                transition-colors duration-300
              `}
            >
              {t('login')}
            </Link>
          )}

          <div
            onClick={toggleTheme}
            className={`
              block py-2 px-3 rounded-lg cursor-pointer
              ${isDarkTheme
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-black hover:bg-gray-100/50'
              }
              transition-colors duration-300
            `}
          >
            {isDarkTheme ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </div>

          <div
            onClick={toggleLanguage}
            className={`
              flex items-center py-2 px-3 rounded-lg cursor-pointer
              ${isDarkTheme
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-black hover:bg-gray-100/50'
              }
              transition-colors duration-300
            `}
          >
            <Globe className="h-6 w-6" />
            <span className="ml-2">{currentLanguage === 'en' ? 'فا' : 'EN'}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;