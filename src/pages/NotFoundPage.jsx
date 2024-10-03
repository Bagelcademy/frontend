import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCcw } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4 animate-pulse">404</h1>
        <p className="text-2xl text-white mb-8">Oops! Page not found</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="bg-white text-purple-500 px-6 py-3 rounded-full font-semibold inline-flex items-center hover:bg-purple-100 transition duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent text-white px-6 py-3 rounded-full font-semibold inline-flex items-center border border-white hover:bg-white hover:text-purple-500 transition duration-300 ml-4"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;