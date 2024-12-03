import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // UI states
  const [currentStep, setCurrentStep] = useState('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Load reCAPTCHA script
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
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Lea3F0qAAAAANYONoP3SokfRw6_uttL5OGhYGqI', { action: 'reset_password' })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
    });
  };

  const sendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get reCAPTCHA token
      const token = await executeRecaptcha();

      const response = await fetch('https://bagelapi.bagelcademy.org/account/email_reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          recaptcha_token: token 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('emailVerificationFailed'));
      }

      setCurrentStep('verification');
      setTimer(180); // 3 minutes cooldown

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('https://bagelapi.bagelcademy.org/account/email/verify_code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verification_code: verificationCode
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('verificationFailed'));
      }

      setCurrentStep('newPassword');

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
      const token = await executeRecaptcha();

      const response = await fetch('https://bagelapi.bagelcademy.org/account/reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token: verificationCode,
          password: newPassword,
          recaptcha_token: token
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('passwordResetFailed'));
      }

      navigate('/login');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    switch (currentStep) {
      case 'email':
        await sendVerificationEmail();
        break;
      case 'verification':
        await verifyCode();
        break;
      case 'newPassword':
        await resetPassword();
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {currentStep === 'email' && t('resetPassword')}
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
          {currentStep === 'email' && (
            <div>
              <Label className="text-black dark:text-white" htmlFor="reset-email">{t('email')}</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  className="p-0 h-auto mt-2"
                  onClick={sendVerificationEmail}
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : currentStep === 'email' ? (
              t('sendVerificationCode')
            ) : currentStep === 'verification' ? (
              t('verifyCode')
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

export default ResetPassword;