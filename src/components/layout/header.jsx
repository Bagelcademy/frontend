import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Moon, Sun, Menu, Bot, Flower } from "lucide-react"; // Added Flower icon from lucide-react
import { Button } from "../ui/button";
import "../../css/Header.css";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import CharacterWelcomePopup from "../ui/CharacterPopup";

// Removed AIIcon import as we'll use the Lucide icon instead

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  isDarkTheme,
  toggleTheme,
  changeLanguage,
}) => {
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

  //const [confirmLogout, setConfirmLogout] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [popupCharacter, setPopupCharacter] = useState(null);

  const handleLoginClick = () => {
    toggleMenu();
    navigate("/login");
  };

  const handleLogoutClick = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
  
    if (!refreshToken || !accessToken) {
      clearAuthData();
      enqueueSnackbar(t("Session expired. Please log in again."), { variant: "info" });
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("https://api.tadrisino.org/account/logout/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (!response.ok) {
        console.error("Logout API failed:", response.status, response.statusText);
        clearAuthData();
        enqueueSnackbar(
          t("Failed to log out properly, but your session has been cleared."),
          { variant: "warning" }
        );
        navigate("/login");
        return;
      }
  
      const data = await response.json();
      console.log("Logout response:", data);
  
      // 1️⃣ ابتدا popup فعلی را unmount کن
      setShowCharacterPopup(false);
      setPopupCharacter([]);
  
      // 2️⃣ کمی تأخیر بده تا React state تغییر را تشخیص دهد
      setTimeout(() => {
        const characterData = {
          character: "A",
          avatar: "/images/characters/default.png",
          new_mood: "sad",
          reaction_message: data.message || t("You have successfully logged out."),
        };
  
        setPopupCharacter([characterData]);
        setShowCharacterPopup(true);
      }, 100); // 50ms delay کافی است
  
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthData();
      enqueueSnackbar(
        t("An error occurred during logout, but your session has been cleared."),
        { variant: "warning" }
      );
      navigate("/login");
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuButton = document.querySelector('[data-menu-button]');
      const mobileMenu = document.querySelector('[data-mobile-menu]');
      
      if (menuOpen && mobileMenu && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleLangChange = (lng) => {
      setCurrentLanguage(lng);
    };

    i18n.on("languageChanged", handleLangChange);

    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      setProfilePicture(null); // ریست کردن قبل از fetch
      const response = await fetch(
        "https://api.tadrisino.org/account/user-info/",
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch user profile:", response.status);
        return;
      }

      const data = await response.json();
      setProfilePicture(data.profile_picture || "/images/profile/default.png");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStateChanged"));
  };

  // const toggleLanguage = () => {
  //   const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
  //   setCurrentLanguage(newLanguage);
  //   changeLanguage(newLanguage);
  // };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", newLanguage); // ⬅️ Save it
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
    <>
      <header
        className={`
        fixed w-full top-0 z-50 transition-all duration-100
        ${scrolled ? "py-2" : "py-4"}
        ${
          isDarkTheme
            ? "bg-gray-800/70 shadow-lg shadow-gray-900/10"
            : "bg-white/30 shadow-lg shadow-gray-200/10"
        }
        backdrop-blur-xl
        border-b
        ${isDarkTheme ? "border-gray-700/30" : "border-gray-200/30"}
      `}
      >
        {/* Logout alert block */}
        {logoutAlert && (
          <div className="fixed mt-20 bg-green-600 text-white font-b7 p-4 text-center shadow-md transition-transform duration-300">
            {t("You have successfully logged out.")}
          </div>
        )}

        <nav className="mx-auto px-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`text-xl font-b6 relative overflow-hidden
              ${isDarkTheme ? "text-white" : "text-gray-900"}
              ${isDarkTheme ? "hover:text-gray-300" : "hover:text-gray-900"}
            `}
            >
              {t("Tadrisino")}
            </Link>
            {/* <Link to="/shop">
              <Button
                className={`
                relative overflow-hidden bg-gradient-to-r
                ${
                  isDarkTheme
                    ? "from-gray-700 to-gray-600"
                    : "from-gray-800 to-gray-700"
                }
                text-white rounded-lg p-2
                hover:scale-105 transform transition-all duration-300
                before:absolute before:inset-0 before:bg-white/10
                before:translate-x-[-100%] hover:before:translate-x-[100%]
                before:transition-transform before:duration-500
                shadow-lg
              `}
              >
                {t("getting PRO")}
              </Button>
            </Link> */}
            <Link
              to="/ask"
              onClick={triggerSparkle}
              className={`
                inline-flex items-center gap-2 px-2 py-1.5 rounded-md
                bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500
                hover:from-indigo-500 hover:to-purple-500
                text-white font-semibold shadow-md hover:shadow-lg
                transition-all duration-300 group
              `}
            >
              <div className="relative flex items-center">
                <Bot
                  size={24}
                  className={`
                    transition-transform duration-300
                    ${sparkleAnimate ? "scale-110" : "group-hover:scale-105"}
                  `}
                />

                {/* Sparkle effects */}
                <div
                  className={`absolute -inset-1 opacity-0 group-hover:opacity-100 ${
                    sparkleAnimate ? "opacity-100" : ""
                  } transition-opacity duration-300`}
                >
                  <div className="absolute top-0 left-0 h-1.5 w-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                  <div className="absolute top-1 right-0 h-1 w-1 bg-blue-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 left-1 h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-1 right-1 h-2 w-2 bg-green-300 rounded-full animate-pulse"></div>
                  <div className="absolute top-3 right-3 h-1 w-1 bg-pink-400 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Text label */}
              <span className="text-base tracking-wide">{t("AI Assistant")}</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-x-4">
            <Link
              to="/"
              className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white after:bg-white"
                  : "text-black hover:text-gray-900 after:bg-gray-900"
              }
            `}
            >
              {t("home")}
            </Link>
            <Link
              to="/courses"
              className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white after:bg-white"
                  : "text-black hover:text-gray-900 after:bg-gray-900"
              }
            `}
            >
              {t("courses")}
            </Link>

            <Link
              to="/learning-paths"
              className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white after:bg-white"
                  : "text-black hover:text-gray-900 after:bg-gray-900"
              }
            `}
            >
              {t("learningPath")}
            </Link>

            <Link
              to="/shop"
              className={`
              relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
              after:w-0 hover:after:w-full after:transition-all after:duration-300
              ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white after:bg-white"
                  : "text-black hover:text-gray-900 after:bg-gray-900"
              }
            `}
            >
              {t("getting PRO")}
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/my-courses"
                  className={`
                  relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                  after:w-0 hover:after:w-full after:transition-all after:duration-300
                  ${
                    isDarkTheme
                      ? "text-gray-300 hover:text-white after:bg-white"
                      : "text-black hover:text-gray-900 after:bg-gray-900"
                  }
                `}
                >
                  {t("myCourses")}
                </Link>
                <Link to="/profile">
                  <img
                    src={profilePicture || "https://via.placeholder.com/40"} // Default placeholder
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-black dark:border-white shadow-md cursor-pointer"
                  />
                </Link>
                <Button
                  onClick={handleLogoutClick}
                  variant="outline"
                >
                  {t("logout")}
                </Button>

              </>
            ) : (
              <Link
                to="/login"
                className={`
                relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:w-0 hover:after:w-full after:transition-all after:duration-300
                ${
                  isDarkTheme
                    ? "text-gray-300 hover:text-white after:bg-white"
                    : "text-black hover:text-gray-900 after:bg-gray-900"
                }
              `}
              >
                {t("login")}
              </Link>
            )}

            <div
              onClick={toggleTheme}
              className={`
              cursor-pointer p-1 rounded-full
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
              cursor-pointer flex items-center p-1 rounded-full
              hover:bg-gray-200/20 transition-colors duration-300
            `}
            >
              <Globe
                className={`h-6 w-6 ${
                  isDarkTheme ? "text-white" : "text-black"
                }`}
              />
              <span
                className={`mx-2 ${
                  isDarkTheme ? "text-gray-300" : "text-black"
                }`}
              >
                {currentLanguage === "en" ? "فا" : "EN"}
              </span>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              data-menu-button
              onClick={toggleMenu}
              className={`
              p-2 rounded-full
              ${isDarkTheme ? "text-white" : "text-gray-700 bg-gray-200"}
              hover:bg-gray-200/20 transition-colors duration-300
            `}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div
            data-mobile-menu
            className={`
            lg:hidden px-4 py-2 gap-y-3
            backdrop-blur-xl
            z-50
            ${isDarkTheme ? "bg-transparent" : "bg-transparent"}
            border-y
            ${isDarkTheme ? "border-gray-700/30" : "border-gray-400"}
          `}
          >
            <div className="flex flex-row justify-between pb-2 mb-1 border-b border-blue-600/40 dark:border-blue-800/90">
              {isLoggedIn ? (
                <div className="flex flex-row mx-2">
                  <Link to="/profile">
                    <img
                      src={profilePicture || "https://via.placeholder.com/40"} // Default placeholder
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer"
                    />
                  </Link>
                  <Button
                    className="mx-3 mt-0.5 text-red-700 dark:text-red-200 border border-red-700 dark:border-red-950 bg-red-200 dark:bg-red-900"
                    onClick={handleLogoutClick}
                    variant="outline"
                  >
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                  <Button
                  className={`mt-0.5 ${
                    isDarkTheme
                      ? "bg-blue-800 text-gray-300 hover:bg-gray-700/50"
                      : "bg-blue-600 text-gray-200 hover:bg-gray-100/50"
                  } transition-colors duration-300`}
                  onClick={handleLoginClick}
                  variant="outline"
                >
                  {t("login")}
                </Button>
              )}
              <div className={`flex flex-row justify-end}`}>
                <div
                  onClick={toggleTheme}
                  className={`
                  block py-2 px-3 rounded-lg cursor-pointer mx-2
                  ${
                    isDarkTheme
                      ? "text-gray-300 bg-gray-400/10 hover:bg-gray-700/50"
                      : "text-black bg-gray-400/30 hover:bg-gray-100/50"
                  }
                  transition-colors duration-300
                `}
                >
                  {isDarkTheme ? (
                    <Moon className="h-6 w-6" />
                  ) : (
                    <Sun className="h-6 w-6" />
                  )}
                </div>

                <div
                  onClick={toggleLanguage}
                  className={`
                  flex items-center py-2 px-1 rounded-lg cursor-pointer
                  ${
                    isDarkTheme
                      ? "text-gray-300 bg-gray-400/10 hover:bg-gray-700/50"
                      : "text-black bg-gray-400/30 hover:bg-gray-100/50 hover"
                  }
                  transition-colors duration-300
                `}
                >
                  <Globe className="h-6 w-6" />
                  <span className="mx-2">
                    {currentLanguage === "en" ? "فا" : "EN"}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/"
              onClick={toggleMenu}
              className={`
              block py-2 px-3 rounded-lg
              ${
                isDarkTheme
                  ? "text-gray-300 hover:bg-gray-700/50"
                  : "text-black hover:bg-gray-100/50 hover:text-gray-600"
              }
              transition-colors duration-300
            `}
            >
              {t("home")}
            </Link>
            <Link
              to="/courses"
              onClick={toggleMenu}
              className={`
              block py-2 px-3 rounded-lg
              ${
                isDarkTheme
                  ? "text-gray-300 hover:bg-gray-700/50"
                  : "text-black hover:bg-gray-100/50 hover:text-gray-600"
              }
              transition-colors duration-300
            `}
            >
              {t("courses")}
            </Link>

            <Link
              to="/learning-paths"
              onClick={toggleMenu}
              className={`
              block py-2 px-3 rounded-lg
              ${
                isDarkTheme
                  ? "text-gray-300 hover:bg-gray-700/50"
                  : "text-black hover:bg-gray-100/50 hover:text-gray-600"
              }
              transition-colors duration-300
            `}
            >
              {t("learningPath")}
            </Link>
            
            <Link
              to="/shop"
              onClick={toggleMenu}
              className={`
              block py-2 px-3 rounded-lg
              ${
                isDarkTheme
                  ? "text-gray-300 hover:bg-gray-700/50"
                  : "text-black hover:bg-gray-100/50 hover:text-gray-600"
              }
              transition-colors duration-300
            `}
            >
              {t("getting PRO")}
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/my-courses"
                  onClick={toggleMenu}
                  className={`
                  block py-2 px-3 rounded-lg
                  ${
                    isDarkTheme
                      ? "text-gray-300 hover:bg-gray-700/50"
                      : "text-black hover:bg-gray-100/50"
                  }
                  transition-colors duration-300
                `}
                >
                  {t("myCourses")}
                </Link>
              </>
            )}
          </div>
        )}
      </header>
      <CharacterWelcomePopup
  characters={popupCharacter}
  isOpen={showCharacterPopup}
  onClose={() => {
    setShowCharacterPopup(false);
    setPopupCharacter([]); // ⬅ پاک کردن کامل state
  }}
  onContinue={() => {
    setShowCharacterPopup(false);
    setPopupCharacter([]); // ⬅ پاک کردن کامل state
    clearAuthData();
    navigate("/login");
    enqueueSnackbar(t("You have successfully logged out."), { variant: "success" });
  }}
/>


    </>
  );
};

export default Header;
