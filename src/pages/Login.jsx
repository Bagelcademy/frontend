import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Login = ({ setIsLoggedIn }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigate = useNavigate();

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
    if (window.google && '59248842872-ii33fubr6b2gap6nebu4dsotrm60lihq.apps.googleusercontent.com') {
      window.google.accounts.id.initialize({
        client_id: '59248842872-ii33fubr6b2gap6nebu4dsotrm60lihq.apps.googleusercontent.com',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!recaptchaToken) {
      setError(t('recaptchaError')); // Use translation for error message
      return;
    }
    try {
      const response = await fetch('https://bagelapi.artina.org/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, recaptcha_token: recaptchaToken }),
      });
      if (!response.ok) {
        throw new Error(t('invalidCredentials')); // Use translation for error message
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      localStorage.setItem('userRole', data.data.role);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } catch (error) {
      setError(t('invalidCredentials')); // Use translation for error message
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const backendResponse = await fetch('https://bagelapi.artina.org/account/login/google_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });
      
      if (!backendResponse.ok) {
        throw new Error(t('googleLoginFailed')); // Use translation for error message
      }
      
      const data = await backendResponse.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      localStorage.setItem('userRole', data.data.role);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } catch (error) {
      setError(t('googleLoginFailed')); // Use translation for error message
    }
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t('login')}</h2>
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
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6Lffcl0qAAAAAAvWf8DvfCrpteArawryjhlE3Gli"
              onChange={onRecaptchaChange}
            />
          </div>
          <Button className="bg-buttonColor w-full text-white" type="submit">
            {t('login')} {/* Use translation for button text */}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-2 text-gray-500 bg-white dark:bg-gray-800">{t('or')}</span>
          <hr className="w-full border-t border-gray-300" />
        </div>
        <div id="googleLoginButton" className="mt-4"></div>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          {t('signupPrompt')}{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            {t('signupLink')} {/* Use translation for signup link */}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
