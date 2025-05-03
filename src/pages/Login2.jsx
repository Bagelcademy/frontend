import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useTranslation } from 'react-i18next';
import { Notify } from 'notiflix';

const Login = ({ setIsLoggedIn }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load the reCAPTCHA v3 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=6Lea3F0qAAAAANYONoP3SokfRw6_uttL5OGhYGqI`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    return loadGoogleScript();
  }, []);

  const initializeGoogleLogin = () => {
    if (window.google && '439027349660-pjtjcs2mm7rdn038doh3hgotal7l0ig2.apps.googleusercontent.com') {
      window.google.accounts.id.initialize({
        client_id: '439027349660-pjtjcs2mm7rdn038doh3hgotal7l0ig2.apps.googleusercontent.com',
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleLoginButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    } else {
      console.error('Google client library not loaded or client ID not set');
    }
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true');
    
    // Update the parent App.jsx state
    setIsLoggedIn(true); 
    
    // Dispatch the custom event
    window.dispatchEvent(new Event('loginStateChanged'));
    Notify.success(t('loginSuccess'));
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Execute reCAPTCHA with the site key
      const token = await executeRecaptcha();
      
      const response = await fetch('https://bagelapi.bagelcademy.org/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, recaptcha_token: token }),
      });
      
      if (!response.ok) {
        throw new Error(t('invalidCredentials'));
      }
      
      const data = await response.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      localStorage.setItem('userRole', data.data.role);
      handleLoginSuccess();
    } catch (error) {
      setError(t('invalidCredentials'));
    }
  };

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Lea3F0qAAAAANYONoP3SokfRw6_uttL5OGhYGqI', { action: 'login' })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
    });
  };

  const handleGoogleLogin = async (response) => {
    try {
      const backendResponse = await fetch('https://bagelapi.bagelcademy.org/account/login/google_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });
      
      if (!backendResponse.ok) {
        throw new Error(t('googleLoginFailed'));
      }
      
      const data = await backendResponse.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      localStorage.setItem('userRole', data.data.role);
      handleLoginSuccess();
    } catch (error) {
      setError(t('googleLoginFailed'));
    }
  };

  return (
    <div className="-mt-20 min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t('login')}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="text-black dark:text-white" htmlFor="username">{t('username')}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label className="text-black dark:text-white" htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="bg-buttonColor w-full text-white" type="submit">
            {t('login')}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-2 text-gray-500 bg-white dark:bg-gray-800">{t('or')}</span>
          <hr className="w-full border-t border-gray-300" />
        </div>
        <div id="googleLoginButton" className="mt-4"></div>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          {t('Signup Prompt')}{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            {t('Signup Link')}
          </a>
        </p> 
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          {t('resetPasswordPrompt')}{' '}
          <a href="/resetpass" className="text-blue-500 hover:underline">
            {t('resetPassword')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;