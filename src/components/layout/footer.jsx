import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">&copy; 2024 Bagelcademy. All rights reserved.</p>
        <nav className="space-x-4">
          <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link>
          <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;