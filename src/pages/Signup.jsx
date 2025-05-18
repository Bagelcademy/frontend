import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Loader2, Check, X, Phone, ShieldCheck, KeyRound } from 'lucide-react';
import { AlertDialog, AlertDialogDescription } from '../components/ui/alert-dialog';
import { Progress } from '../components/ui/progress';
import Notiflix from 'notiflix';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Phone, 2: Code, 3: Password
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // Password validation states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=6LfAXDcrAAAAAKGP7OFfXy27UTg2LEteUahzULYj`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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

  // Password strength checker
  useEffect(() => {
    if (password) {
      // Check minimum requirements
      const minLength = password.length >= 8; // Increased minimum length for better security
      const hasNum = /\d/.test(password);
      const hasLet = /[a-zA-Z]/.test(password);
      
      setHasMinLength(minLength);
      setHasNumber(hasNum);
      setHasLetter(hasLet);
      
      // Calculate strength score (0-100)
      let score = 0;
      if (minLength) score += 30;
      if (hasNum) score += 20;
      if (hasLet) score += 20;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 10; // Bonus for mixed case
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
      
      setPasswordStrength(score);
      
      // Set feedback message
      if (score < 60) {
        setPasswordFeedback(t('passwordWeak'));
      } else if (score < 90) {
        setPasswordFeedback(t('passwordMedium'));
      } else {
        setPasswordFeedback(t('passwordStrong'));
      }
    } else {
      setHasMinLength(false);
      setHasNumber(false);
      setHasLetter(false);
      setPasswordStrength(0);
      setPasswordFeedback('');
    }
  }, [password, t]);

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }
      
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6LfAXDcrAAAAAKGP7OFfXy27UTg2LEteUahzULYj', { action: 'signup' })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
    });
  };

  const validatePhoneNumber = (phone) => {
    // Iranian phone number validation (11 digits, starting with 09)
    const regex = /^09\d{9}$/;
    return regex.test(phone);
  };

  const sendVerificationSMS = async () => {
    try {
      // Validation
      if (!validatePhoneNumber(phoneNumber)) {
        setError(t('invalidIranianPhone'));
        return;
      }

      setIsLoading(true);
      setError('');

      // Get reCAPTCHA token
      const token = await executeRecaptcha();

      // Send phone number to sendCode API
      const response = await fetch('https://api.tadrisino.org/account/register/sendCode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: phoneNumber,
          recaptcha_token: token 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('phoneVerificationFailed'));
      }

      setIsSmsSent(true);
      setCurrentStep(2);
      setTimer(120); // 2 minutes cooldown as per backend
      Notiflix.Notify.success(data.message || t('verificationSMSSent'));

    } catch (error) {
      setError(error.message || t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      if (!verificationCode || verificationCode.length < 4) {
        setError(t('invalidVerificationCode'));
        return;
      }

      setIsLoading(true);
      setError('');

      // Send verification code to verify API
      const response = await fetch('https://api.tadrisino.org/account/register/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: phoneNumber,
          code: verificationCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('verificationFailed'));
      }

      // Verification successful, proceed to password setup
      setCurrentStep(3);
      Notiflix.Notify.success(data.message || t('verificationSuccessful'));

    } catch (error) {
      setError(error.message || t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const completeRegistration = async () => {
    try {
      if (password.length < 8) {
        setError(t('passwordTooShort'));
        return;
      }

      // Ensure password meets minimum requirements
      if (!hasMinLength || !hasNumber || !hasLetter) {
        setError(t('passwordRequirementsNotMet'));
        return;
      }

      setIsLoading(true);
      setError('');

      // Send registration data to register API
      const response = await fetch('https://api.tadrisino.org/account/register/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: phoneNumber,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      // Store tokens if provided in response
      if (data.data && data.data.access) {
        localStorage.setItem('accessToken', data.data.access);
        localStorage.setItem('refreshToken', data.data.refresh);
        localStorage.setItem('userRole', data.data.role || 'student');
        localStorage.setItem('streak', data.data.streak || '0');
        localStorage.setItem('isLoggedIn', 'true');
      }

      // Redirect to survey page after successful registration
      Notiflix.Notify.success(t('registrationSuccessful'));
      navigate('/survey');

    } catch (error) {
      setError(error.message || t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    switch (currentStep) {
      case 1:
        await sendVerificationSMS();
        break;
      case 2:
        await verifyCode();
        break;
      case 3:
        await completeRegistration();
        break;
      default:
        break;
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 60) return 'bg-red-500';
    if (passwordStrength < 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-500 text-white' : currentStep > 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            {currentStep > 1 ? <Check className="h-5 w-5" /> : <Phone className="h-4 w-4" />}
          </div>
          <span className="text-xs mt-1">{t('phoneNumber')}</span>
        </div>
        
        <div className={`h-1 flex-1 mx-2 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-500 text-white' : currentStep > 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            {currentStep > 2 ? <Check className="h-5 w-5" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
          <span className="text-xs mt-1">{t('verification')}</span>
        </div>
        
        <div className={`h-1 flex-1 mx-2 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-blue-500 text-white' : currentStep > 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            <KeyRound className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">{t('password')}</span>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
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
              disabled={isLoading}
              placeholder="09123456789"
              className="mb-1"
              autoComplete="tel"
            />
            {/* <p className="text-xs text-gray-500 mb-4">
              {t('phoneNumberFormat')}
            </p> */}
            <Button
              type="submit"
              className="w-full text-black dark:text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('sendVerificationCode')
              )}
            </Button>
          </div>
        );
      
      case 2:
        return (
          <div>
            <Label className="text-black dark:text-white" htmlFor="verificationCode">
              {t('verificationCode')}
            </Label>
            <Input
              id="verificationCode"
              type="text"
              inputMode="numeric"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              disabled={isLoading}
              placeholder={t('enterVerificationCode')}
              className="mb-1"
              autoComplete="one-time-code"
            />
            
            {isSmsSent && (
              <div className="mt-2 mb-4 text-sm">
                <p className="text-green-500 dark:text-green-400">
                  {t('verificationSMSSent')} {phoneNumber}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 mr-2">
                    {timer > 0 ? (
                      `${t('resendCodeIn')} ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
                    ) : (
                      t('didntReceiveCode')
                    )}
                  </span>
                  {timer <= 0 && (
                    <button
                      type="button"
                      onClick={sendVerificationSMS}
                      disabled={isLoading || timer > 0}
                      className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                    >
                      {t('resendCode')}
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                disabled={isLoading}
              >
                {t('back')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  t('verify')
                )}
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <Label className="text-black dark:text-white" htmlFor="password">
              {t('setPassword')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mb-1"
              autoComplete="new-password"
            />
            
            {/* Password strength indicator */}
            <div className="mt-2 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">{passwordFeedback}</span>
              </div>
              <Progress value={passwordStrength} className={`h-1 ${getPasswordStrengthColor()}`} />
              
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs">
                  {hasMinLength ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {t('passwordMinLength')}
                </div>
                <div className="flex items-center text-xs">
                  {hasNumber ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {t('passwordHasNumber')}
                </div>
                <div className="flex items-center text-xs">
                  {hasLetter ? (
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {t('passwordHasLetter')}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                disabled={isLoading}
              >
                {t('back')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || passwordStrength < 60}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  t('completeRegistration')
                )}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="-mt-20 min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {t('signupTitle')}
        </h2>
        
        {renderProgressSteps()}

        {error && (
          <AlertDialog variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDialogDescription className="text-red-600">{error}</AlertDialogDescription>
          </AlertDialog>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
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