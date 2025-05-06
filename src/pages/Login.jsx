import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useTranslation } from 'react-i18next';
import { Notify } from 'notiflix';

const Login = ({ setIsLoggedIn }) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [activeTab, setActiveTab] = useState('password'); // 'password' or 'otp'
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

  const handleLoginSuccess = (data) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('streak', data.streak);
    
    // Update the parent App.jsx state
    setIsLoggedIn(true); 
    
    // Dispatch the custom event
    window.dispatchEvent(new Event('loginStateChanged'));
    Notify.success(t('loginSuccess'));
    navigate('/');
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

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Execute reCAPTCHA with the site key
      const token = await executeRecaptcha();
      
      const response = await fetch('https://bagelapi.bagelcademy.org/account/login/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: phoneNumber, 
          password, 
          mode: 'password',
          recaptcha_token: token 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('invalidCredentials'));
      }
      
      const data = await response.json();
      handleLoginSuccess(data.data);
    } catch (error) {
      setError(error.message || t('invalidCredentials'));
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError(t('phoneNumberRequired'));
      return;
    }

    setError('');
    try {
      const token = await executeRecaptcha();
      
      const response = await fetch('https://bagelapi.bagelcademy.org/account/login/sendCode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: phoneNumber,
          recaptcha_token: token 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('otpSendFailed'));
      }
      
      setIsOtpSent(true);
      Notify.success(t('otpSent'));
    } catch (error) {
      setError(error.message || t('otpSendFailed'));
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = await executeRecaptcha();
      
      const response = await fetch('https://bagelapi.bagelcademy.org/account/login/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: phoneNumber, 
          code: otpCode, 
          mode: 'otp',
          recaptcha_token: token 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('invalidCode'));
      }
      
      const data = await response.json();
      handleLoginSuccess(data.data);
    } catch (error) {
      setError(error.message || t('invalidCode'));
    }
  };

  return (
    <div className="-mt-20 min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t('login')}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {/* Custom Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === 'password' 
                ? 'text-buttonColor border-b-2 border-buttonColor' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('password')}
          >
            {t('password')}
          </button>
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === 'otp' 
                ? 'text-buttonColor border-b-2 border-buttonColor' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('otp')}
          >
            {t('otp')}
          </button>
        </div>
        
        {/* Password Login Form */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div className="mb-4">
              <Label className="text-black dark:text-white" htmlFor="phoneNumber">{t('phoneNumber')}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
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
        )}
        
        {/* OTP Login Form */}
        {activeTab === 'otp' && (
          <div>
            <div className="mb-4">
              <Label className="text-black dark:text-white" htmlFor="otpPhoneNumber">{t('phoneNumber')}</Label>
              <div className="flex gap-2">
                <Input
                  id="otpPhoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  required
                />
                <Button 
                  type="button" 
                  onClick={handleSendOtp}
                  className="bg-buttonColor text-white"
                >
                  {t('sendOtp')}
                </Button>
              </div>
            </div>
            
            {isOtpSent && (
              <form onSubmit={handleOtpLogin}>
                <div className="mb-6">
                  <Label className="text-black dark:text-white" htmlFor="otpCode">{t('otpCode')}</Label>
                  <Input
                    id="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    required
                  />
                </div>
                <Button className="bg-buttonColor w-full text-white" type="submit">
                  {t('verifyAndLogin')}
                </Button>
              </form>
            )}
          </div>
        )}
        
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