import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogDescription } from '../components/ui/alert-dialog';
import * as Yup from 'yup';
import Notiflix from 'notiflix';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isSmsSent, setIsSmsSent] = useState(false);
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
    if (window.google && '439027349660-pjtjcs2mm7rdn038doh3hgotal7l0ig2.apps.googleusercontent.com') {
      window.google.accounts.id.initialize({
        client_id: '439027349660-pjtjcs2mm7rdn038doh3hgotal7l0ig2.apps.googleusercontent.com',
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

  const sendVerificationSMS = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('https://bagelapi.bagelcademy.org/account/phone/phone_verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('phoneVerificationFailed'));
      }

      setIsSmsSent(true);
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
    const verifyResponse = await fetch('https://bagelapi.bagelcademy.org/account/phone/verify_code/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
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
    const registerResponse = await fetch('https://bagelapi.bagelcademy.org/account/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        phone: phoneNumber,
        password,
        recaptcha_token: token
      }),
    });

    const data = await registerResponse.json();

    if (!registerResponse.ok) {
      throw new Error(data.error || t('registrationFailed'));
    }

    // Redirect to login page after successful registration
    Notiflix.Notify.success(t('registrationSuccessful'));
    navigate('/login');

  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Validate form values
      await validationSchema.validate({ username, phone: phoneNumber, password }, { abortEarly: false });
  
      if (!showVerification) {
        await sendVerificationSMS();
      } else {
        await verifyAndRegister();
      }
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        // Show the first error
        setError(validationErrors.errors[0]);
      }
    }
  };
  

  const handleGoogleSignup = async (response) => {
    try {
      setIsLoading(true);
      setError('');

      const backendResponse = await fetch('https://bagelapi.bagelcademy.org/account/login/google_login/', {
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


const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-zA-Z0-9_]+$/, t("usernameInvalid")) // Only letters, numbers, and underscores
    .required(t("usernameRequired")),
  phone: Yup.string()
    .matches(/^(\+98|0)?9\d{9}$/, t("phoneInvalid")) // Iran phone number format
    .required(t("phoneRequired")),
  password: Yup.string()
    .min(8, t("passwordTooShort")) // At least 8 characters
    .matches(/[A-Z]/, t("passwordNoUpperCase")) // At least one uppercase letter
    .required(t("passwordRequired")),
});

  return (
    <div className="-mt-20 min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {t('signupTitle')}
        </h2>

        {error && (
          <AlertDialog variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDialogDescription className="text-red-600">{error}</AlertDialogDescription>
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
            <Label className="text-black dark:text-white" htmlFor="phoneNumber">
              {t('phoneNumber')}
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading || showVerification}
              placeholder="09123456789"
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
              {isSmsSent && (
                <div className="mt-2 text-sm">
                  <p className="text-green-500 dark:text-green-400">
                    {t('verificationSMSSent')}
                  </p>
                  {timer > 0 ? (
                    <p className="text-gray-500">
                      {t('resendCodeIn-1')} {timer} {t('resendCodeIn-2')}
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={sendVerificationSMS}
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