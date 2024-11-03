import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogDescription } from '../components/ui/alert-dialog';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
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
    // Load Google Sign-in script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignup;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    return loadGoogleScript();
  }, []);

  // Timer effect for resending verification code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const initializeGoogleSignup = () => {
    if (window.google && '59248842872-ii33fubr6b2gap6nebu4dsotrm60lihq.apps.googleusercontent.com') {
      window.google.accounts.id.initialize({
        client_id: '59248842872-ii33fubr6b2gap6nebu4dsotrm60lihq.apps.googleusercontent.com',
        callback: handleGoogleSignup,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignupButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  };

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Lea3F0qAAAAANYONoP3SokfRw6_uttL5OGhYGqI', { action: 'signup' })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
    });
  };

  const sendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('https://bagelapi.artina.org/account/email/email_verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('emailVerificationFailed'));
      }

      setIsEmailSent(true);
      setShowVerification(true);
      setTimer(180); // 3 minutes cooldown

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    try {
      setIsLoading(true);
      setError('');

      // First verify the code
      const verifyResponse = await fetch('https://bagelapi.artina.org/account/email/verify_code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verification_code: verificationCode
        }),
      });

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json();
        throw new Error(data.error || t('verificationFailed'));
      }

      // Get reCAPTCHA token
      const token = await executeRecaptcha();

      // Complete registration
      const registerResponse = await fetch('https://bagelapi.artina.org/account/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          recaptcha_token: token
        }),
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      // Save auth tokens and redirect
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      localStorage.setItem('userRole', data.data.role);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/survey');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showVerification) {
      await sendVerificationEmail();
    } else {
      await verifyAndRegister();
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      setIsLoading(true);
      setError('');

      const backendResponse = await fetch('https://bagelapi.artina.org/account/login/google_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!backendResponse.ok) {
        throw new Error(t('googleSignupFailed'));
      }

      const data = await backendResponse.json();
      localStorage.setItem('accessToken', data.data.access);
      localStorage.setItem('refreshToken', data.data.refresh);
      localStorage.setItem('userRole', data.data.role);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/survey');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {t('signupTitle')}
        </h2>

        {error && (
          <AlertDialog variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialog>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-black dark:text-white" htmlFor="username">
              {t('username')}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading || showVerification}
            />
          </div>

          <div>
            <Label className="text-black dark:text-white" htmlFor="email">
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || showVerification}
            />
          </div>

          <div>
            <Label className="text-black dark:text-white" htmlFor="password">
              {t('password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || showVerification}
            />
          </div>

          {showVerification && (
            <div>
              <Label className="text-black dark:text-white" htmlFor="verificationCode">
                {t('verificationCode')}
              </Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={isLoading}
                placeholder={t('enterVerificationCode')}
              />
              {isEmailSent && (
                <div className="mt-2 text-sm">
                  <p className="text-green-500 dark:text-green-400">
                    {t('verificationEmailSent')}
                  </p>
                  {timer > 0 ? (
                    <p className="text-gray-500">
                      {t('resendCodeIn-1')} {timer} {t('resendCodeIn-2')}
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={sendVerificationEmail}
                        disabled={isLoading}
                        className="hover:underline bg-white text-black dark:text-white dark:bg-gray-800 border-b-2  px-2 py-1 mt-2"
                      >
                        {t('resendCode')}
                      </button>
                    </div>
                  )}
                </div>
              )}
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
            ) : showVerification ? (
              t('verify')
            ) : (
              t('signupButton')
            )}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
            {t('orText')}
          </span>
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