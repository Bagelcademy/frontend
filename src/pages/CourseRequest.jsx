import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,ChevronDown,Loader,Info, 
  Search,X,ChevronsDown,Check,BookOpen,
  ListFilter,Globe,BarChart,Zap,ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Listbox = ({ value, onChange, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full py-3 bg-white bg-opacity-20 rounded-lg text-white font-semibold flex items-center justify-between px-4 hover:bg-opacity-30 transition-all"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2 text-blue-300">{icon}</span>}
          {value.label}
        </div>
        <ChevronDown className={`w-5 h-5 text-blue-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bg-gray-800 bg-opacity-95 backdrop-blur-lg rounded-lg mt-2 z-10 w-full max-h-48 overflow-y-auto border border-blue-500 border-opacity-30"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="block w-full py-2 px-4 hover:bg-blue-500 hover:bg-opacity-30 transition-colors text-left flex items-center justify-between"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.value === value.value && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white bg-opacity-10 rounded-lg p-4 mb-4 border border-blue-500 border-opacity-20 hover:border-opacity-40 transition-all"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-blue-200 mb-2">
        <span className="font-medium text-blue-300">{t("Language")}:</span> {t(course.language)}
      </p>
      <p className="text-blue-200 mb-2">
        <span className="font-medium text-blue-300">{t("Level")}:</span> {t(course.level)}
      </p>
      <button
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
      >
        {t("View Course")} <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </motion.div>
  );
};

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-2 rounded-full ${
            index < currentStep 
              ? 'bg-blue-500' 
              : index === currentStep 
                ? 'bg-blue-300' 
                : 'bg-white bg-opacity-20'
          }`}
          initial={{ width: index === currentStep ? 12 : 20 }}
          animate={{ 
            width: index === currentStep ? 40 : 20,
            backgroundColor: index < currentStep 
              ? '#3b82f6' 
              : index === currentStep 
                ? '#93c5fd' 
                : 'rgba(255, 255, 255, 0.2)'
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

const RequestPage = () => {
  const { t, i18n } = useTranslation();
  const [request, setRequest] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({
    label: t('Persian'),
    value: 'Persian',
  });
  const [selectedLevel, setSelectedLevel] = useState({
    label: t('Beginner'),
    value: 'beginner',
  });
  const [selectedLessonCount, setSelectedLessonCount] = useState({
    label: '10',
    value: 10,
  });
  const [selectedCategory, setSelectedCategory] = useState({
    label: t('General'),
    value: 'general',
  });
  
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userCredits, setUserCredits] = useState(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const navigate = useNavigate();
  
  const guidanceRef = useRef(null);
  const searchTimeout = useRef(null);

  // Fetch user information including credits
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        
        const response = await fetch('https://api.tadrisino.org/account/user-info/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data.credit);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.tadrisino.org/courses/Category/', {
          method: 'GET',
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform data to the format needed for the Listbox
          const formattedCategories = data.map(category => ({
            label: category.name,
            value: category.id.toString(),
          }));
          
          // Add a General category as default
          formattedCategories.unshift({
            label: t('General'),
            value: 'general',
          });
          
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set default categories in case of error
        setCategories([
          { label: t('General'), value: 'general' },
          { label: t('Programming'), value: 'programming' },
          { label: t('Language Learning'), value: 'language' },
          { label: t('Science'), value: 'science' },
          { label: t('Mathematics'), value: 'mathematics' },
          { label: t('Business'), value: 'business' },
        ]);
      }
    };
    
    fetchCategories();
  }, [t]);

  useEffect(() => {
    setSelectedLanguage({
      label: t('Persian'),
      value: selectedLanguage.value,
    });
    setSelectedLevel({
      label: t('Beginner'),
      value: selectedLevel.value,
    });
    if (categories.length > 0) {
      setSelectedCategory({
        label: t('General'),
        value: 'general',
      });
    }
  }, [i18n.language, categories]);







  // Scroll to guidance section when button is clicked
  const scrollToGuidance = () => {
    setShowGuidance(true);
    setTimeout(() => {
      guidanceRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

//delete

  // Search for existing courses as user types
  const searchForExistingCourses = async (prompt) => {
    if (prompt.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const response = await fetch('https://api.tadrisino.org/courses/course-generation/search_for_existence_course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setSearchResults(data);
      } else if (response.status === 404) {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for courses:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change with debounce for search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setRequest(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Set new timeout for search (debounce)
    if (value.length >= 3) {
      searchTimeout.current = setTimeout(() => {
        searchForExistingCourses(value);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If not on the final step, just advance to the next step
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
  
    setIsSubmitting(true);


  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setSubmitStatus('user_not_logged_in');
      return;
    }
    
    const response = await fetch('https://api.tadrisino.org/courses/course-generation/generate_gpt_course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: request,
        language: selectedLanguage.value,
        level: selectedLevel.value,
        lesson_count: selectedLessonCount.value,
        category: selectedCategory.value === 'general' ? 1 : parseInt(selectedCategory.value),
      
      }),
    });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403 && errorData.detail === "you do not have enough credit") {
          setSubmitStatus("no_credit");
        } else {
          throw new Error('Failed to submit request');
        }
        return;
      }

      const data = await response.json();
      setSubmitStatus('success');
      setCourses([...courses, data]);
      setRequest('');
      setSearchResults([]);
      setCurrentStep(0);
      
      // Refresh user credits after successful course generation
      const userInfoResponse = await fetch('https://api.tadrisino.org/account/user-info/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (userInfoResponse.ok) {
        const userData = await userInfoResponse.json();
        setUserCredits(userData.credit);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step content components
  const stepContents = [
    // Step 0: Course Request
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Zap className="mr-2 text-blue-400 w-6 h-6" />
        {t("What would you like to learn?")}
      </h2>
      <div className="relative">
        <textarea
          value={request}
          onChange={handleInputChange}
          placeholder={t('python programming language for 30 days')}
          className="w-full p-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500 border-opacity-30"
          rows="4"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <Loader className="animate-spin w-5 h-5 text-blue-300" />
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-lg p-4 border border-blue-500 border-opacity-30"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold flex items-center">
              <Search className="w-4 h-4 mr-2 text-blue-400" />
              {t('Similar Courses Found')}
            </h3>
            <button
              type="button"
              onClick={() => setSearchResults([])}
              className="text-blue-200 hover:text-white bg-transparent p-1 rounded-full hover:bg-blue-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {searchResults.map((course) => (
              <div key={course.id} className="border-b border-white border-opacity-20 py-2 last:border-0">
                <h4 className="text-white font-medium">{course.title}</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-blue-200 text-sm">
                    {t(course.language)} • {t(course.level)}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    {t('View')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-blue-200 mt-3 text-sm">
            {t('Not what you were looking for? Create a new course by submitting your request.')}
          </p>
        </motion.div>
      )}
    </motion.div>,
    
    // Step 1: Language and Level
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Globe className="mr-2 text-blue-400 w-6 h-6" />
        {t("Select Language and Learning Level")}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-blue-300 mb-2">{t("Course Language")}</label>
          <Listbox
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            options={[
              { label: t('Persian'), value: 'Persian' },
              { label: t('English'), value: 'English' },
              { label: t('Spanish'), value: 'Spanish' },
              { label: t('Mandarin'), value: 'Mandarin Chinese' },
              { label: t('Hindi'), value: 'Hindi' },
              { label: t('Arabic'), value: 'Arabic' },
              { label: t('Bengali'), value: 'Bengali' },
              { label: t('Russian'), value: 'Russian' },
              { label: t('Portuguese'), value: 'Portuguese' },
              { label: t('Japanese'), value: 'Japanese' },
              { label: t('German'), value: 'German' },
              { label: t('French'), value: 'French' },
              { label: t('Korean'), value: 'Korean' },
              { label: t('Turkish'), value: 'Turkish' },
              { label: t('Italian'), value: 'Italian' },
              { label: t('Vietnamese'), value: 'Vietnamese' },
              { label: t('Thai'), value: 'Thai' },
              { label: t('Indonesian'), value: 'Indonesian' },
              { label: t('Dutch'), value: 'Dutch' },
              { label: t('Polish'), value: 'Polish' },
              { label: t('Swedish'), value: 'Swedish' },
              { label: t('Greek'), value: 'Greek' },
              { label: t('Romanian'), value: 'Romanian' },
              { label: t('Czech'), value: 'Czech' },
              { label: t('Finnish'), value: 'Finnish' },
              { label: t('Danish'), value: 'Danish' },
              { label: t('Norwegian'), value: 'Norwegian' },
              { label: t('Hungarian'), value: 'Hungarian' },
              { label: t('Swahili'), value: 'Swahili' },
            ]}
            icon={<Globe className="w-5 h-5" />}
          />
        </div>
        <div>
          <label className="block text-blue-300 mb-2">{t("Learning Level")}</label>
          <Listbox
            value={selectedLevel}
            onChange={setSelectedLevel}
            options={[
              { label: t('Beginner'), value: 'beginner' },
              { label: t('Intermediate'), value: 'intermediate' },
              { label: t('Advanced'), value: 'advanced' },
            ]}
            icon={<BarChart className="w-5 h-5" />}
          />
        </div>
      </div>
    </motion.div>,
    
    // Step 2: Lesson Count and Category
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <ListFilter className="mr-2 text-blue-400 w-6 h-6" />
        {t("Select Course Details")}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-blue-300 mb-2">{t("Number of Lessons")}</label>
          <Listbox
            value={selectedLessonCount}
            onChange={setSelectedLessonCount}
            options={[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '15', value: 15 },
              { label: '20', value: 20 },
              { label: '25', value: 25 },
              { label: '30', value: 30 },
              { label: '35', value: 35 },
              { label: '40', value: 40 },
            ]}
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>
        <div>
          <label className="block text-blue-300 mb-2">{t("Course Category")}</label>
          <Listbox
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            icon={<ListFilter className="w-5 h-5" />}
          />
        </div>
      </div>
    </motion.div>,
    
    // Step 3: Review and Submit
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Zap className="mr-2 text-blue-400 w-6 h-6" />
        {t("Review and Create Course")}
      </h2>
      <div className="bg-white bg-opacity-10 rounded-lg p-4 border border-blue-500 border-opacity-30">
        <h3 className="text-xl font-bold text-blue-300 mb-4">{t("Course Summary")}</h3>
        <div className="space-y-2">
          <p className="text-white"><span className="text-blue-300 font-medium">{t("Topic")}:</span> {request}</p>
          <p className="text-white"><span className="text-blue-300 font-medium">{t("Language")}:</span> {t(selectedLanguage.label)}</p>
          <p className="text-white"><span className="text-blue-300 font-medium">{t("Level")}:</span> {t(selectedLevel.label)}</p>
          <p className="text-white"><span className="text-blue-300 font-medium">{t("Lessons")}:</span> {selectedLessonCount.label}</p>
          <p className="text-white"><span className="text-blue-300 font-medium">{t("Category")}:</span> {t(selectedCategory.label)}</p>
        </div>
        <div className="mt-4">
          <p className="text-blue-200">
            {t("This will use 1 AI credit from your account.")}
            {userCredits !== null && (
              <span className="ml-2 text-yellow-300">
                {t("Your current balance")}: {userCredits} {t("credits")}
              </span>
            )}
          </p>

        </div>

      </div>
    </motion.div>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          {userCredits !== null && (
            <div className="bg-blue-900 bg-opacity-50 px-4 py-2 rounded-lg text-white border border-blue-500 border-opacity-30">
              <span className="font-semibold">{t('AI Credits')}: </span>
              <span className="text-yellow-300">{userCredits}</span>
            </div>
          )}
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToGuidance}
          className="flex items-center space-x-2 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors border border-purple-500"
        >
          <Info className="w-5 h-5" />
          <span>{t('howToUse')}</span>
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl border border-blue-500 border-opacity-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-2"
        >
          {t('AI Course Generator')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-blue-300 text-center mb-8"
        >
          {t("Ask what you can't find, and let AI build your perfect course")}
        </motion.p>
        
        <StepIndicator currentStep={currentStep} totalSteps={4} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {stepContents[currentStep]}
          </AnimatePresence>
          
          <div className="flex justify-between mt-8">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center"
              >
                <ChevronDown className="w-5 h-5 mr-2 rotate-90" />
                {t('Previous')}
              </button>
            ) : (
              <div></div> // Empty div to maintain layout with flex justify-between
            )}
            
            <button
              disabled={isSubmitting || (currentStep === 0 && !request.trim())}
              className={`px-6 py-3 ${
                currentStep === 3 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-blue-600'
              } text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 hover:shadow-lg transition-all`}
              type="submit"
            >
              {isSubmitting ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : currentStep === 3 ? (
                <>
                  <span>{t('Create Course')}</span>
                  <Send className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  <span>{t('Next')}</span>
                  <ChevronDown className="w-5 h-5 ml-2 -rotate-90" />
                </>
              )}
            </button>
          </div>
        </form>
        
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mt-4 p-3 rounded-lg text-center ${
              submitStatus === 'success'
                ? 'bg-green-600 text-white'
                : submitStatus === 'no_credit'
                  ? 'bg-yellow-600 text-white'
                  : submitStatus === 'user_not_logged_in'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-600 text-white'
            }`}
          >
            {submitStatus === 'success' ? (
              <div className="flex flex-col items-center">
                <Check className="w-6 h-6 mb-2" />
                {t('Your quest for knowledge has begun!')}
              </div>
            ) : submitStatus === 'no_credit' ? (
              <>
                {t('You do not have enough credit. Please purchase more.')}{' '}
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-2 bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  {t('Go to Shop')}
                </button>
              </>
            ) : submitStatus === 'user_not_logged_in' ? (
              t('User not found, please log in.')
            ) : (
              t('Oops! There was an error. Please try again.')
            )}
          
          </motion.div>
        )}

        {courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{t("Generated Courses")}</h2>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {showGuidance && (
        <motion.div
          ref={guidanceRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{t("How to Use the AI Course Generator")}</h2>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-white mb-2"> {t("1.Describe Your Learning Goal")}</h3>
              <p className="text-blue-200">
                {t("Enter what you want to learn in the text area. Be specific about the subject and what aspects you want to focus on. For example: 'Learn Python for data science' or 'Understanding quantum physics basics'.")}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-white mb-2"> {t("2.Check for Similar Courses")}</h3>
              <p className="text-blue-200">
                {t("As you type (3+ characters), the system automatically searches for similar existing courses. If you find what you're looking for, you can view that course instead of creating a new one.")}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-white mb-2"> {t("3.Select Language and Level")}</h3>
              <p className="text-blue-200">
                {t("Choose your preferred language for the course content and select the appropriate difficulty level (Beginner, Intermediate, or Advanced).")}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-white mb-2"> {t("4.Create Your Course")}</h3>
              <p className="text-blue-200">
                {t("Click the 'Create your course' button to generate a personalized AI-driven course based on your inputs. Each course generation costs 1 credit.")}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-white mb-2"> {t("5.Access Your Course")}</h3>
              <p className="text-blue-200">
                {t("Once generated, your course will appear in the 'Generated Courses' section. Click 'View Course' to start learning!")}
              </p>
            </div>
            
            <div className="bg-purple-700 bg-opacity-40 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{t("Tips for Best Results")}</h3>
              <ul className="text-blue-200 list-disc pl-5 space-y-2">
                <li>{t("Be specific in your request to get more targeted content")}</li>
                <li>{t("Check your available credits before generating (shown at the top of the page)")}</li>
                <li>{t("Browse similar courses first to save credits")}</li>
                <li>{t("If you need more credits, visit the Shop through the link in your profile")}</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => setShowGuidance(false), 500);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <ChevronsDown className="w-5 h-5 mr-2 rotate-180" />
              {t("Back to Top")}
            </button>
          </div>
        </motion.div>
      )}
      <StarField />
    </div>
  );
};

const StarField = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    />
  ));

  return <div className="fixed inset-0 pointer-events-none">{stars}</div>;
};

export default RequestPage;