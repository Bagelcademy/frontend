import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import i18next hook
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Signup = () => {
  const { t } = useTranslation(); // Use translation hook
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://bagelapi.artina.org/account/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      navigate('/survey');
    } catch (error) {
      setError(t('registrationFailed')); // Use translation for error message
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      const backendResponse = await fetch('https://bagelapi.artina.org/account/login/google_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });
      
      if (!backendResponse.ok) {
        throw new Error('Google signup failed');
      }
      
      const data = await backendResponse.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      navigate('/survey');
    } catch (error) {
      setError(t('googleSignupFailed')); // Use translation for error message
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "59248842872-ii33fubr6b2gap6nebu4dsotrm60lihq.apps.googleusercontent.com",
        callback: handleGoogleSignup,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignupButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t('signupTitle')}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="dark:text-white" htmlFor="username">{t('username')}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label className="dark:text-white" htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label className="dark:text-white" htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="bg-buttonColor w-full text-white">
            {t('signupButton')}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-2 text-gray-500 bg-white dark:bg-gray-800">{t('orText')}</span>
          <hr className="w-full border-t border-gray-300" />
        </div>
        <div id="googleSignupButton" className="mt-4"></div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('alreadyHaveAccount')}{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            {t('login')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
