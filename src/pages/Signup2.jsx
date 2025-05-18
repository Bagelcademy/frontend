import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';
import { 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Info 
} from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogDescription, 
  AlertDialogTitle, 
  AlertDialogContent 
} from '../components/ui/alert-dialog';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import * as Yup from 'yup';
import Notiflix from 'notiflix';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const usernameInputRef = useRef(null);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [signupStep, setSignupStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touchedFields, setTouchedFields] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Debounce timer ids
  const usernameTimerId = useRef(null);
  const emailTimerId = useRef(null);

  // Auto-focus on first input
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // Restore form data from localStorage
  useEffect(() => {
    const savedFormData = localStorage.getItem('signupFormData');
    if (savedFormData) {
      const { username, email, referralCode, subscribeToNewsletter } = JSON.parse(savedFormData);
      setUsername(username || '');
      setEmail(email || '');
      setReferralCode(referralCode || '');
      setSubscribeToNewsletter(subscribeToNewsletter || false);
    }
  }, []);

  // Save non-sensitive form data to localStorage
  useEffect(() => {
    const formData = {
      username,
      email,
      referralCode,
      subscribeToNewsletter
    };
    localStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [username, email, referralCode, subscribeToNewsletter]);

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=6LfAXDcrAAAAAKGP7OFfXy27UTg2LEteUahzULYj`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load Google Sign-in script
  useEffect(() => {
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

  // Track password strength
  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  // Validate on field change
  useEffect(() => {
    validateField('username', username);
  }, [username]);
  
  useEffect(() => {
    validateField('email', email);
  }, [email]);
  
  useEffect(() => {
    validateField('password', password);
  }, [password]);
  
  useEffect(() => {
    validateField('confirmPassword', confirmPassword);
  }, [confirmPassword, password]);

  const initializeGoogleSignup = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '439027349660-pjtjcs2mm7rdn038doh3hgotal7l0ig2.apps.googleusercontent.com';
    
    if (window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSignup,
        ux_mode: 'popup',
        context: 'signup'
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignupButton'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: '100%',
          text: 'signup_with'
        }
      );
    }
  };

  const executeRecaptcha = () => {
    const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfAXDcrAAAAAKGP7OFfXy27UTg2LEteUahzULYj';
    
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error(t('recaptchaNotLoaded')));
        return;
      }
      
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(recaptchaSiteKey, { action: 'signup' })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
    });
  };

  const sendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage(t('sendingVerificationEmail'));
      setError('');

      const response = await fetch('https://api.tadrisino.org/account/email/email_verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('emailVerificationFailed'));
      }

      setIsEmailSent(true);
      setShowVerification(true);
      setTimer(180); // 3 minutes cooldown
      setSignupStep(3);
      
      // Analytics
      trackEvent('verification_email_sent', { email_domain: email.split('@')[1] });

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const verifyAndRegister = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage(t('verifyingAndRegistering'));
      setError('');

      // First verify the code
      const verifyResponse = await fetch('https://api.tadrisino.org/account/email/verify_code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verification_code: verificationCode
        }),
        credentials: 'include'
      });

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json();
        throw new Error(data.error || t('verificationFailed'));
      }

      // Get reCAPTCHA token
      const token = await executeRecaptcha();

      // Complete registration
      const registerResponse = await fetch('https://api.tadrisino.org/account/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          recaptcha_token: token,
          agree_to_terms: agreeToTerms,
          subscribe_to_newsletter: subscribeToNewsletter,
          referral_code: referralCode || undefined
        }),
        credentials: 'include'
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      // Clear saved form data
      localStorage.removeItem('signupFormData');
      
      // Analytics
      trackEvent('user_registered', { 
        has_referral: !!referralCode,
        subscribed_to_newsletter: subscribeToNewsletter 
      });

      // Redirect to onboarding or login page after successful registration
      Notiflix.Notify.success(t('registrationSuccessful'));
      navigate('/onboarding');

    } catch (error) {
      setError(error.message);
      
      // Analytics for failed registration
      trackEvent('registration_failed', { 
        reason: error.message,
        step: 'verification' 
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) return;
    
    try {
      setCheckingUsername(true);
      
      const response = await fetch(`https://api.tadrisino.org/account/check_username/${username}/`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      setUsernameAvailable(data.available);
      
      if (!data.available) {
        setFieldErrors(prev => ({
          ...prev,
          username: t('usernameNotAvailable')
        }));
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return;
    
    try {
      setCheckingEmail(true);
      
      const response = await fetch(`https://api.tadrisino.org/account/check_email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      const data = await response.json();
      setEmailAvailable(data.available);
      
      if (!data.available) {
        setFieldErrors(prev => ({
          ...prev,
          email: t('emailAlreadyRegistered')
        }));
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Update the field value
    switch (field) {
      case 'username':
        setUsername(value);
        // Debounce the username check
        if (usernameTimerId.current) {
          clearTimeout(usernameTimerId.current);
        }
        usernameTimerId.current = setTimeout(() => {
          checkUsernameAvailability(value);
        }, 500);
        break;
      case 'email':
        setEmail(value);
        // Debounce the email check
        if (emailTimerId.current) {
          clearTimeout(emailTimerId.current);
        }
        emailTimerId.current = setTimeout(() => {
          checkEmailAvailability(value);
        }, 500);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'verificationCode':
        setVerificationCode(value);
        break;
      case 'referralCode':
        setReferralCode(value);
        break;
      default:
        break;
    }

    // Mark the field as touched
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Get the current step validation schema
      const currentStepSchema = getStepValidationSchema(signupStep);
      
      // Build form data for the current step
      const formData = getFormDataForStep(signupStep);
      
      // Validate form values for the current step
      await currentStepSchema.validate(formData, { abortEarly: false });
      
      // If all fields are valid, proceed to the next step or submit
      if (signupStep === 1) {
        setSignupStep(2);
        trackEvent('signup_step_completed', { step: 1 });
      } else if (signupStep === 2) {
        if (!agreeToTerms) {
          setError(t('mustAgreeToTerms'));
          return;
        }
        await sendVerificationEmail();
        trackEvent('signup_step_completed', { step: 2 });
      } else if (signupStep === 3) {
        await verifyAndRegister();
      }
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        // Process all validation errors
        const errors = {};
        validationErrors.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        setFieldErrors(errors);
        setError(validationErrors.errors[0]);
        // Track validation errors
        trackEvent('validation_error', { 
          step: signupStep,
          errors: validationErrors.errors
        });
      } else {
        setError(validationErrors.message);
      }
    }
  };

  const getFormDataForStep = (step) => {
    switch (step) {
      case 1:
        return { username, email };
      case 2:
        return { password, confirmPassword, agreeToTerms };
      case 3:
        return { verificationCode };
      default:
        return {};
    }
  };

  const getStepValidationSchema = (step) => {
    switch (step) {
      case 1:
        return Yup.object().shape({
          username: Yup.string()
            .matches(/^[a-zA-Z0-9_]+$/, t("usernameInvalid")) // Only letters, numbers, and underscores
            .min(3, t("usernameTooShort"))
            .max(30, t("usernameTooLong"))
            .required(t("usernameRequired")),
          email: Yup.string()
            .email(t("emailInvalid"))
            .required(t("emailRequired"))
        });
      case 2:
        return Yup.object().shape({
          password: Yup.string()
            .min(8, t("passwordTooShort")) // At least 8 characters
            .matches(/[A-Z]/, t("passwordNoUpperCase")) // At least one uppercase letter
            .matches(/[a-z]/, t("passwordNoLowerCase")) // At least one lowercase letter
            .matches(/[0-9]/, t("passwordNoNumber")) // At least one number
            .matches(/[^A-Za-z0-9]/, t("passwordNoSpecial")) // At least one special character
            .notOneOf(commonPasswords, t("passwordTooCommon")) // Not a common password
            .required(t("passwordRequired")),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], t("passwordsDoNotMatch"))
            .required(t("confirmPasswordRequired")),
          agreeToTerms: Yup.boolean()
            .oneOf([true], t("mustAgreeToTerms"))
        });
      case 3:
        return Yup.object().shape({
          verificationCode: Yup.string()
            .matches(/^[0-9]{6}$/, t("verificationCodeInvalid"))
            .required(t("verificationCodeRequired"))
        });
      default:
        return Yup.object();
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      setIsLoading(true);
      setLoadingMessage(t('processingGoogleSignup'));
      setError('');

      const backendResponse = await fetch('https://api.tadrisino.org/account/login/google_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: response.credential,
          agree_to_terms: true, // Required for new accounts
          subscribe_to_newsletter: subscribeToNewsletter,
          referral_code: referralCode || undefined
        }),
        credentials: 'include'
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || t('googleSignupFailed'));
      }

      const data = await backendResponse.json();
      
      // Store auth data securely
      securelyStoreAuthData(data.data);
      
      // Clear saved form data
      localStorage.removeItem('signupFormData');
      
      // Analytics
      trackEvent('google_signup_success', { 
        new_user: data.data.is_new_user,
        has_referral: !!referralCode
      });

      // Redirect based on whether it's a new user or existing user
      if (data.data.is_new_user) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      setError(error.message);
      
      // Analytics
      trackEvent('google_signup_failed', { 
        reason: error.message 
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Complexity
    if (/[A-Z]/.test(password)) strength += 15; // Uppercase
    if (/[a-z]/.test(password)) strength += 15; // Lowercase
    if (/[0-9]/.test(password)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // Special characters
    
    // Variety
    const uniqueChars = new Set(password).size;
    strength += Math.min(10, uniqueChars / password.length * 10);
    
    // Common password check
    if (commonPasswords.includes(password.toLowerCase())) {
      strength = 10;
    }
    
    setPasswordStrength(Math.min(100, strength));
  };

  const validateField = (field, value) => {
    if (!touchedFields[field]) return;
    
    try {
      switch (field) {
        case 'username':
          Yup.string()
            .matches(/^[a-zA-Z0-9_]+$/, t("usernameInvalid"))
            .min(3, t("usernameTooShort"))
            .max(30, t("usernameTooLong"))
            .required(t("usernameRequired"))
            .validateSync(value);
          
          if (usernameAvailable === false) {
            throw new Error(t("usernameNotAvailable"));
          }
          
          setFieldErrors(prev => ({
            ...prev,
            username: undefined
          }));
          break;
          
        case 'email':
          Yup.string()
            .email(t("emailInvalid"))
            .required(t("emailRequired"))
            .validateSync(value);
          
          if (emailAvailable === false) {
            throw new Error(t("emailAlreadyRegistered"));
          }
          
          setFieldErrors(prev => ({
            ...prev,
            email: undefined
          }));
          break;
          
        case 'password':
          Yup.string()
            .min(8, t("passwordTooShort"))
            .matches(/[A-Z]/, t("passwordNoUpperCase"))
            .matches(/[a-z]/, t("passwordNoLowerCase"))
            .matches(/[0-9]/, t("passwordNoNumber"))
            .matches(/[^A-Za-z0-9]/, t("passwordNoSpecial"))
            .notOneOf(commonPasswords, t("passwordTooCommon"))
            .required(t("passwordRequired"))
            .validateSync(value);
            
          setFieldErrors(prev => ({
            ...prev,
            password: undefined
          }));
          break;
          
        case 'confirmPassword':
          if (value !== password) {
            throw new Error(t("passwordsDoNotMatch"));
          }
          
          setFieldErrors(prev => ({
            ...prev,
            confirmPassword: undefined
          }));
          break;
          
        default:
          break;
      }
    } catch (error) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: error.message
      }));
    }
  };

  const securelyStoreAuthData = (data) => {
    // In a real-world scenario, consider using more secure storage methods
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', data.user_id);
  };

  const trackEvent = (eventName, eventData = {}) => {
    // Implement your analytics tracking here
    // Example: Google Analytics, Mixpanel, etc.
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    // Log event for development
    console.log('Analytics Event:', eventName, eventData);
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 30) return t('passwordStrengthWeak');
    if (passwordStrength < 60) return t('passwordStrengthMedium');
    if (passwordStrength < 80) return t('passwordStrengthStrong');
    return t('passwordStrengthVeryStrong');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-green-500';
    return 'bg-green-700';
  };

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-between">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step < signupStep
                ? 'bg-green-500 text-white'
                : step === signupStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {step < signupStep ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              step
            )}
          </div>
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
            {step === 1 ? t('accountDetails') : step === 2 ? t('securitySetup') : t('verification')}
          </span>
        </div>
      ))}
      <div className="absolute left-0 right-0 h-1 top-4 -z-10">
        <div className="mx-auto w-2/3 bg-gray-300 dark:bg-gray-700 h-0.5">
          <div
            className="bg-blue-500 h-0.5"
            style={{ width: `${(signupStep - 1) * 50}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // List of common passwords to check against
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'admin', 'welcome',
    'password123', 'abc123', 'letmein', 'monkey', '1234567', 'sunshine',
    'iloveyou', 'trustno1', 'princess', 'admin123', 'welcome123', 'login',
    'qwerty123', 'dragon', 'passw0rd', 'master', 'hello', 'freedom', 'whatever'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md mx-4 relative">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          {t('signupTitle')}
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {signupStep === 1
            ? t('createAccountSubtitle')
            : signupStep === 2
            ? t('secureAccountSubtitle')
            : t('verifyEmailSubtitle')}
        </p>

        {renderStepIndicator()}

        {error && (
          <AlertDialog variant="destructive" className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <AlertDialogDescription className="text-red-600 dark:text-red-400">{error}</AlertDialogDescription>
            </div>
          </AlertDialog>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {signupStep === 1 && (
            <>
              <div>
                <Label 
                  className="text-black dark:text-white flex items-center justify-between" 
                  htmlFor="username"
                >
                  <span>{t('username')}</span>
                  {checkingUsername && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                  {usernameAvailable === true && username.length >= 3 && (
                    <span className="text-xs text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> {t('usernameAvailable')}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    ref={usernameInputRef}
                    type="text"
                    value={username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder={t('usernamePlaceholder')}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={fieldErrors.username ? "username-error" : undefined}
                    className={fieldErrors.username ? "border-red-500 pr-10" : ""}
                  />
                  {fieldErrors.username && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {fieldErrors.username && (
                  <p className="mt-1 text-sm text-red-600" id="username-error">
                    {fieldErrors.username}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('usernameRequirements')}
                </p>
              </div>

              <div>
                <Label 
                  className="text-black dark:text-white flex items-center justify-between" 
                  htmlFor="email"
                >
                  <span>{t('email')}</span>
                  {checkingEmail && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                  {emailAvailable === true && email.includes('@') && (
                    <span className="text-xs text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> {t('emailAvailable')}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder={t('emailPlaceholder')}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    className={fieldErrors.email ? "border-red-500 pr-10" : ""}
                  />
                  {fieldErrors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600" id="email-error">
                    {fieldErrors.email}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('emailRequirements')}
                </p>
              </div>

              <div>
                <Label
                  className="text-black dark:text-white flex items-center justify-start gap-2"
                  htmlFor="referralCode"
                >
                  <span>{t('referralCode')}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{t('referralCodeInfo')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => handleInputChange('referralCode', e.target.value)}
                  disabled={isLoading}
                  placeholder={t('referralCodePlaceholder')}
                />
              </div>
            </>
          )}

          {signupStep === 2 && (
            <>
              <div>
                <Label 
                  className="text-black dark:text-white flex items-center justify-between" 
                  htmlFor="password"
                >
                  <span>{t('password')}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder={t('passwordPlaceholder')}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    className={fieldErrors.password ? "border-red-500 pr-10" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600" id="password-error">
                    {fieldErrors.password}
                  </p>
                )}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className="h-1.5"
                    indicatorClassName={getPasswordStrengthColor()}
                  />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-4 h-4 mr-1 flex items-center justify-center rounded-full ${password.length >= 8 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      {password.length >= 8 && <CheckCircle className="h-3 w-3" />}
                    </div>
                    {t('passwordReqLength')}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-4 h-4 mr-1 flex items-center justify-center rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      {/[A-Z]/.test(password) && <CheckCircle className="h-3 w-3" />}
                    </div>
                    {t('passwordReqUppercase')}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-4 h-4 mr-1 flex items-center justify-center rounded-full ${/[0-9]/.test(password) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      {/[0-9]/.test(password) && <CheckCircle className="h-3 w-3" />}
                    </div>
                    {t('passwordReqNumber')}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-4 h-4 mr-1 flex items-center justify-center rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      {/[^A-Za-z0-9]/.test(password) && <CheckCircle className="h-3 w-3" />}
                    </div>
                    {t('passwordReqSpecial')}
                  </div>
                </div>
              </div>

              <div>
                <Label 
                  className="text-black dark:text-white" 
                  htmlFor="confirmPassword"
                >
                  {t('confirmPassword')}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder={t('confirmPasswordPlaceholder')}
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                    className={fieldErrors.confirmPassword ? "border-red-500 pr-10" : ""}
                  />
                  {fieldErrors.confirmPassword && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600" id="confirmPassword-error">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox 
                  id="agreeToTerms" 
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  disabled={isLoading}
                />
                <Label 
                  htmlFor="agreeToTerms"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {t('termsAgreement')} <a href="/terms" target="_blank" className="text-blue-600 hover:underline">{t('termsOfService')}</a> {t('and')} <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">{t('privacyPolicy')}</a>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="subscribeToNewsletter" 
                  checked={subscribeToNewsletter}
                  onCheckedChange={(checked) => setSubscribeToNewsletter(checked === true)}
                  disabled={isLoading}
                />
                <Label 
                  htmlFor="subscribeToNewsletter"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {t('subscribeToNewsletter')}
                </Label>
              </div>
            </>
          )}

          {signupStep === 3 && (
            <div>
              <Label 
                className="text-black dark:text-white" 
                htmlFor="verificationCode"
              >
                {t('verificationCode')}
              </Label>
              <div className="relative">
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder={t('enterVerificationCode')}
                  maxLength={6}
                  className="text-center text-xl tracking-wider"
                />
              </div>
              {isEmailSent && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                    {t('verificationEmailSent')} <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('verificationCodeInstructions')}
                  </p>
                  {timer > 0 ? (
                    <p className="text-sm text-gray-500 mt-4">
                      {t('resendCodeIn-1')} <span className="font-medium">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span> {t('resendCodeIn-2')}
                    </p>
                  ) : (
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={sendVerificationEmail}
                        disabled={isLoading}
                        className="hover:underline text-blue-600 dark:text-blue-400 text-sm font-medium"
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
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingMessage || t('loading')}
              </div>
            ) : signupStep === 1 ? (
              t('continue')
            ) : signupStep === 2 ? (
              t('createAccount')
            ) : (
              t('verify')
            )}
          </Button>

          {signupStep > 1 && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setSignupStep(signupStep - 1)}
              disabled={isLoading}
            >
              {t('back')}
            </Button>
          )}
        </form>

        {signupStep === 1 && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <hr className="w-full border-t border-gray-300" />
              <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
                {t('orText')}
              </span>
              <hr className="w-full border-t border-gray-300" />
            </div>

            <div id="googleSignupButton" className="mt-4"></div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('alreadyHaveAccount')}{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            {t('login')}
          </a>
        </p>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('needHelp')}{' '}
            <a href="/help" className="text-blue-600 hover:underline">
              {t('contactSupport')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;