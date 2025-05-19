import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  Users,
  Code,
  Palette,
  Coffee,
  User,
  Calendar,
  BookOpen,
  Award,
  Brain,
  Languages,
  Music,
  Database,
  ChartBar,
  HeartPulse,
  PenTool,
  Camera,
  Laptop,
  Sparkles,
  Trophy,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notiflix from 'notiflix';

const Survey = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({
    name: '',
    birthday: '',
    job: '',
    education: '',
    major: '',
    interests: []
  });
  const [explodingOption, setExplodingOption] = useState(null);
  const [points, setPoints] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const accessToken = localStorage.getItem('accessToken');
      
      if (!isLoggedIn || !accessToken) {
        // If not logged in, redirect to login page
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const iconMap = {
    // Job icons
    [t("Developer")]: Code,
    [t("Designer")]: Palette,
    [t("Manager")]: Users,
    [t("Student")]: GraduationCap,
    [t("Entrepreneur")]: Briefcase,
    [t("Other")]: Coffee,
    
    // Education icons
    [t("Bachelor's")]: BookOpen,
    [t("Master's")]: Award,
    [t("PhD")]: GraduationCap,
    [t("Diploma")]: BookOpen,
    [t("High School")]: BookOpen,
    
    // Interest icons
    [t("Programming")]: Code,
    [t("Languages")]: Languages,
    [t("Music")]: Music,
    [t("Data Science")]: Database,
    [t("Business")]: ChartBar,
    [t("Health")]: HeartPulse,
    [t("Art & Design")]: PenTool,
    [t("Photography")]: Camera,
    [t("Technology")]: Laptop
  };

  // Calculate progress when current step changes
  useEffect(() => {
    const totalSteps = 6; // Total number of steps
    const newProgress = ((currentStep) / totalSteps) * 100;
    setProgress(newProgress);
  }, [currentStep]);

  // Award points whenever a selection is made
  const awardPoints = (amount = 10) => {
    setPoints(prev => prev + amount);
    if ((points + amount) % 50 === 0) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 2000);
    }
  };

  const steps = [
    // Step 1: Name
    {
      type: "input",
      title: t("What's your name?"),
      field: "name",
      placeholder: t("Enter your name"),
      icon: User
    },
    // Step 2: Birthday
    {
      type: "date",
      title: t("When's your birthday?"),
      field: "birthday",
      placeholder: t("YYYY-MM-DD"),
      icon: Calendar
    },
    // Step 3: Job
    {
      type: "options",
      title: t("What's your job?"),
      field: "job",
      options: [t("Developer"), t("Designer"), t("Manager"), t("Student"), t("Entrepreneur"), t("Other")]
    },
    // Step 4: Education
    {
      type: "options",
      title: t("What is your education level?"),
      field: "education",
      options: [t("Bachelor's"), t("Master's"), t("PhD"), t("Diploma"), t("High School")]
    },
    // Step 5: Major
    {
      type: "input",
      title: t("What's your major or field of study?"),
      field: "major",
      placeholder: t("e.g. Computer Science, Art, Business"),
      icon: BookOpen
    },
    // Step 6: Interests (Multiple Selection)
    {
      type: "multiOptions",
      title: t("What are you interested in learning? (Select up to 3)"),
      field: "interests",
      options: [
        t("Programming"), 
        t("Languages"), 
        t("Music"), 
        t("Data Science"), 
        t("Business"), 
        t("Health"), 
        t("Art & Design"), 
        t("Photography"), 
        t("Technology")
      ]
    }
  ];

  const handleTextInput = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelect = (field, answer) => {
    setExplodingOption(answer);
    setAnswers(prev => ({
      ...prev,
      [field]: answer
    }));
    awardPoints();

    setTimeout(() => {
      setExplodingOption(null);
      moveToNextStep();
    }, 500);
  };

  const handleMultiSelect = (field, answer) => {
    setAnswers(prev => {
      // Toggle selection
      const currentSelections = prev[field] || [];
      const newSelections = currentSelections.includes(answer)
        ? currentSelections.filter(item => item !== answer)
        : [...currentSelections, answer].slice(0, 3); // Limit to 3 selections
        
      return {
        ...prev,
        [field]: newSelections
      };
    });
    awardPoints(5);
  };

  const moveToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        submitSurvey();
      }, 2000);
    }
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    const field = currentStepData.field;
    
    if (currentStepData.type === "input" || currentStepData.type === "date") {
      return answers[field] && answers[field].trim() !== '';
    }
    
    if (currentStepData.type === "multiOptions") {
      return answers[field] && answers[field].length > 0;
    }
    
    return true;
  };

  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.error('No access token found');
        Notiflix.Notify.failure(t('authenticationError'));
        navigate('/login');
        return;
      }
      
      const response = await fetch('https://api.tadrisino.org/account/user-info/Survey/', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: answers.name,
          birthday: answers.birthday,
          job: answers.job,
          education: answers.education,
          major: answers.major,
          interests: answers.interests,
        }),
      });

      if (response.ok) {
        // Refresh user data in localStorage
        const userData = await response.json();
        // Helper to safely set localStorage items if value is defined
        const safeSet = (key, value) => {
          if (typeof value !== 'undefined' && value !== null) {
            localStorage.setItem(key, value);
          }
        };

        // Set tokens and user info if present
        if (userData.data) {
          safeSet('userRole', userData.data.role);
          safeSet('streak', userData.data.streak);
          safeSet('userName', userData.data.name);
          safeSet('accessToken', userData.data.access);
          safeSet('refreshToken', userData.data.refresh);
        }
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('completedSurvey', 'true');
      
        
        Notiflix.Notify.success(t('surveyCompleted'));
        // Redirect to profile page instead of home
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit survey:', errorData);
        Notiflix.Notify.failure(errorData.error || t('surveySubmissionFailed'));
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      Notiflix.Notify.failure(t('networkError'));
    }
  };

  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.type === "input") {
      return (
        <div className="mb-6 w-full max-w-md mx-auto">
          <div className="flex items-center mb-4">
            {React.createElement(currentStepData.icon, { 
              size: 24, 
              className: "text-blue-500 mr-2" 
            })}
            <label className="text-lg font-medium">{currentStepData.title}</label>
          </div>
          <input
            type="text"
            value={answers[currentStepData.field] || ''}
            onChange={(e) => handleTextInput(currentStepData.field, e.target.value)}
            placeholder={currentStepData.placeholder}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={moveToNextStep}
            disabled={!canProceed()}
            className={`mt-4 w-full p-3 rounded-lg font-medium transition-all
              ${canProceed() 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
          >
            {t("Continue")}
          </button>
        </div>
      );
    }
    
    if (currentStepData.type === "date") {
      return (
        <div className="mb-6 w-full max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <Calendar size={24} className="text-blue-500 mr-2" />
            <label className="text-lg font-medium">{currentStepData.title}</label>
          </div>
          <input
            type="date"
            value={answers[currentStepData.field] || ''}
            onChange={(e) => handleTextInput(currentStepData.field, e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={moveToNextStep}
            disabled={!canProceed()}
            className={`mt-4 w-full p-3 rounded-lg font-medium transition-all
              ${canProceed() 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
          >
            {t("Continue")}
          </button>
        </div>
      );
    }
    
    if (currentStepData.type === "options") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentStepData.options.map((option) => (
            <ExplosiveOption
              key={option}
              option={option}
              onSelect={() => handleSelect(currentStepData.field, option)}
              isExploding={explodingOption === option}
              iconMap={iconMap}
            />
          ))}
        </div>
      );
    }
    
    if (currentStepData.type === "multiOptions") {
      const selectedOptions = answers[currentStepData.field] || [];
      const maxSelectionsReached = selectedOptions.length >= 3;
      
      return (
        <div className="w-full">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Selected")}: {selectedOptions.length}/3
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentStepData.options.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(currentStepData.field, option)}
                  disabled={!isSelected && maxSelectionsReached}
                  className={`p-4 rounded-lg shadow-md transition-all duration-300 relative
                    ${isSelected 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-white dark:bg-gray-800 hover:shadow-lg'}
                    ${!isSelected && maxSelectionsReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center
                    ${isSelected ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
                    {React.createElement(iconMap[option] || Coffee, { 
                      size: 32, 
                      className: isSelected ? "text-white" : "text-white" 
                    })}
                  </div>
                  <p className="text-sm font-medium">{option}</p>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check size={16} className="text-blue-500" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={moveToNextStep}
            disabled={!canProceed()}
            className={`mt-8 w-full p-3 rounded-lg font-medium transition-all
              ${canProceed() 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
          >
            {t("Complete Survey")}
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
      {/* Points display */}
      <div className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg">
        <Star size={18} className="mr-2" />
        <span className="font-bold">{points} XP</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{t("Start")}</span>
          <span>{t("Complete Profile")}</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full relative overflow-hidden">
        {levelUp && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10 animate-fade-in">
            <div className="text-center">
              <Trophy size={64} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold text-white mb-2">{t("Level Up!")}</h3>
              <p className="text-yellow-300">{t("Keep going!")}</p>
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
          {steps[currentStep].title}
        </h2>
        
        {renderCurrentStep()}
      </div>
      
      {/* Confetti effect for completion */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ff6b6b', '#48dbfb', '#feca57', '#1dd1a1', '#5f27cd'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExplosiveOption = ({ option, onSelect, isExploding, iconMap }) => {
  const Icon = iconMap[option] || Coffee;

  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-lg shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transform hover:scale-105
        ${isExploding ? 'animate-[explosion_0.5s_ease-out]' : ''}`}
    >
      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Icon size={32} className="text-white" />
      </div>
      <p className="text-sm font-medium">{option}</p>
    </button>
  );
};

// Check component for multi-selection
const Check = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

// Add these styles to your global CSS or as a styled component
const styles = `
@keyframes explosion {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}

.confetti-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: fall 3s linear forwards;
}

@keyframes fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Survey;