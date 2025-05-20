import React, { useState, useEffect, useRef } from 'react';
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
  const [countdown, setCountdown] = useState(0); // Countdown timer for OTP button
  const navigate = useNavigate();
  
  // Site key for reCAPTCHA v2
  const RECAPTCHA_SITE_KEY = '6LfkvD4rAAAAAPJPSvnKaHCvLej0hRotvj3TOYmA';
  
  // References for reCAPTCHA containers
  const passwordRecaptchaRef = useRef(null);
  const otpVerifyRecaptchaRef = useRef(null);

  useEffect(() => {
    // Load the reCAPTCHA v2 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    // Initialize reCAPTCHA when script is loaded
    script.onload = renderRecaptchas;

    return () => {
      // Clean up script when component unmounts
      const recaptchaScript = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]');
      if (recaptchaScript) {
        document.body.removeChild(recaptchaScript);
      }
    };
  }, []);
  
  // Re-render reCAPTCHAs when tab changes
  useEffect(() => {
    // Short delay to ensure DOM is updated
    const timer = setTimeout(() => {
      renderRecaptchas();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTab, isOtpSent]);
  
  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);
  
  const renderRecaptchas = () => {
    // Only proceed if grecaptcha is available
    if (window.grecaptcha && window.grecaptcha.render) {
      // Clear existing reCAPTCHAs first
      try {
        window.grecaptcha.reset();
      } catch (e) {
        // Ignore if no reCAPTCHAs exist yet
      }
      
      // Render reCAPTCHA for password login if visible
      if (activeTab === 'password' && passwordRecaptchaRef.current) {
        try {
          window.grecaptcha.render(passwordRecaptchaRef.current, {
            sitekey: RECAPTCHA_SITE_KEY
          });
        } catch (e) {
          // Already rendered
        }
      }
      
      // Render reCAPTCHA for OTP verification if visible
      if (activeTab === 'otp' && isOtpSent && otpVerifyRecaptchaRef.current) {
        try {
          window.grecaptcha.render(otpVerifyRecaptchaRef.current, {
            sitekey: RECAPTCHA_SITE_KEY
          });
        } catch (e) {
          // Already rendered
        }
      }
    }
  };

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
    navigate('/my-courses');
  };

  const getRecaptchaToken = (captchaAction) => {
    let token;
    
    // Determine which reCAPTCHA to get token from based on action
    if (activeTab === 'password') {
      token = window.grecaptcha.getResponse();
    } else if (activeTab === 'otp' && isOtpSent && captchaAction === 'verifyOtp') {
      token = window.grecaptcha.getResponse();
    }
    
    if (!token) {
      throw new Error(t('pleaseCompleteRecaptcha'));
    }
    
    return token;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Get reCAPTCHA token
      const token = getRecaptchaToken('passwordLogin');
      
      const response = await fetch('https://api.tadrisino.org/account/login/login/', {
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
      
      // Reset reCAPTCHA after use
      window.grecaptcha.reset();
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
      const response = await fetch('https://api.tadrisino.org/account/login/sendCode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: phoneNumber
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('otpSendFailed'));
      }
      
      setIsOtpSent(true);
      Notify.success(t('otpSent'));
      
      // Start countdown timer (2 minutes = 120 seconds)
      setCountdown(120);
    } catch (error) {
      setError(error.message || t('otpSendFailed'));
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = getRecaptchaToken('verifyOtp');
      
      const response = await fetch('https://api.tadrisino.org/account/login/login/', {
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
      
      // Reset reCAPTCHA after use
      window.grecaptcha.reset();
    } catch (error) {
      setError(error.message || t('invalidCode'));
    }
  };

  return (
    <div className="-mt-20 min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t('login')}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
          {t('we changed our login form. if you register with your phone number you get 7 days free subscription!')}
        </p>
        {/* Custom Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === 'password' 
                ? 'text-buttonColor border-b-2 border-buttonColor' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => {
              setActiveTab('password');
              setError('');
            }}
          >
            {t('password')}
          </button>
          <button
            className={`flex-1 py-2 font-medium text-center ${
              activeTab === 'otp' 
                ? 'text-buttonColor border-b-2 border-buttonColor' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => {
              setActiveTab('otp');
              setError('');
            }}
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
            
            {/* reCAPTCHA v2 for password login */}
            <div className="mb-6 flex justify-center">
              <div ref={passwordRecaptchaRef} className="g-recaptcha"></div>
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
              <Input
                id="otpPhoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>
            
            <div className="mb-4 flex justify-center">
              <Button 
                type="button" 
                onClick={handleSendOtp}
                disabled={countdown > 0}
                className={`w-full text-white ${countdown > 0 ? 'bg-gray-400' : 'bg-buttonColor'}`}
              >
                {countdown > 0 
                  ? `${t('resendIn')} ${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}`
                  : t('sendOtp')}
              </Button>
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
                
                {/* reCAPTCHA v2 for OTP verification */}
                <div className="mb-6 flex justify-center">
                  <div ref={otpVerifyRecaptchaRef} className="g-recaptcha"></div>
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
}

export default Login;