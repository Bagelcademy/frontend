import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';

const Header = ({ isLoggedIn, isDarkTheme, toggleTheme, handleLogout }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-lg sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bagelcademy</h1>
      <nav className="flex items-center space-x-4">
        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</Link>
        <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Courses</Link>
        <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profile</Link>
        {isLoggedIn && (
          <Link to="/my-courses" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">My Courses</Link>
        )}
        {isLoggedIn ? (
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        ) : (
          <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Login</Link>
        )}
        <Button onClick={toggleTheme} variant="ghost" size="icon" className="ml-2">
          {isDarkTheme ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-gray-600" />}
        </Button>
      </nav>
    </header>
  );
};

export default Header;
