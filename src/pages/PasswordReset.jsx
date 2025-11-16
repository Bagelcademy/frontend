import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

const ResetPasswordByPhone = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  
  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // UI states
  const [currentStep, setCurrentStep] = useState('phone');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // reCAPTCHA site key
  const RECAPTCHA_SITE_KEY = '6LfkvD4rAAAAAPJPSvnKaHCvLej0hRotvj3TOYmA';

  useEffect(() => {
    // Load reCAPTCHA v2 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getRecaptchaToken = () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && recaptchaRef.current) {
        const token = window.grecaptcha.getResponse();
        if (token) {
          resolve(token);
        } else {
          reject(new Error(t('pleaseCompleteRecaptcha')));
        }
      } else {
        reject(new Error(t('recaptchaNotLoaded')));
      }
    });
  };

  const resetRecaptcha = () => {
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
  };

  const sendVerificationSMS = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get reCAPTCHA token
      const token = await getRecaptchaToken();

      const response = await fetch('https://api.tadrisino.org/account/phone/send_verification_code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber,
          recaptcha_token: token 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('phoneVerificationFailed'));
      }

      setCurrentStep('verification');
      setTimer(180); // 3 minutes cooldown
      resetRecaptcha();

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get reCAPTCHA token
      const token = await getRecaptchaToken();

      const response = await fetch('https://api.tadrisino.org/account/phone/reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: verificationCode,
          password: newPassword,
          recaptcha_token: token
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('passwordResetFailed'));
      }

      // On success, redirect to login page
      navigate('/login');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      switch (currentStep) {
        case 'phone':
          await sendVerificationSMS();
          break;
        case 'verification':
          setCurrentStep('newPassword');
          resetRecaptcha();
          break;
        case 'newPassword':
          await resetPassword();
          break;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {currentStep === 'phone' && t('resetPassword')}
          {currentStep === 'verification' && t('enterVerificationCode')}
          {currentStep === 'newPassword' && t('createNewPassword')}
        </h2>

        {error && (
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 'phone' && (
            <div>
              <Label className="text-black dark:text-white" htmlFor="reset-phone">{t('phoneNumber')}</Label>
              <Input
                id="reset-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t("Reset Password-Signup-Signup02 Phone-placeholder")}
                required
                disabled={isLoading}
              />
            </div>
          )}

          {currentStep === 'verification' && (
            <div>
              <Label htmlFor="verification-code">{t('verificationCode')}</Label>
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={isLoading}
              />
              {timer > 0 ? (
                <p className="text-sm text-gray-500 mt-2">
                  {t('resendCodeIn-1')} {timer} {t('resendCodeIn-2')}
                </p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto mt-2 text-black dark:text-white "
                  onClick={sendVerificationSMS}
                  disabled={isLoading}
                >
                  {t('resendCode')}
                </Button>
              )}
            </div>
          )}

          {currentStep === 'newPassword' && (
            <div>
              <Label className="text-black dark:text-white" htmlFor="new-password">{t('newPassword')}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          
          {/* reCAPTCHA v2 widget */}
          <div className="flex justify-center mb-4">
            <div ref={recaptchaRef} className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY}></div>
          </div>

          <Button 
            type="submit" 
            className="w-full text-gray-200" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : currentStep === 'phone' ? (
              t('sendVerificationCode')
            ) : currentStep === 'verification' ? (
              t('continueReset')
            ) : (
              t('resetPassword')
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <a 
            href="/login" 
            className="text-blue-500 hover:underline"
          >
            {t('backToLogin')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordByPhone;