import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ChevronDown, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { label: 'English', value: 'English' },
  { label: 'Persian (Farsi)', value: 'Persian' },
  { label: 'Mandarin Chinese', value: 'Mandarin Chinese' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Arabic', value: 'Arabic' },
  { label: 'Bengali', value: 'Bengali' },
  { label: 'Russian', value: 'Russian' },
  { label: 'Portuguese', value: 'Portuguese' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'German', value: 'German' },
  { label: 'French', value: 'French' },
  { label: 'Korean', value: 'Korean' },
  { label: 'Turkish', value: 'Turkish' },
  { label: 'Italian', value: 'Italian' },
  { label: 'Vietnamese', value: 'Vietnamese' },
  { label: 'Thai', value: 'Thai' },
  { label: 'Indonesian', value: 'Indonesian' },
  { label: 'Dutch', value: 'Dutch' },
  { label: 'Polish', value: 'Polish' },
  { label: 'Swedish', value: 'Swedish' },
  { label: 'Greek', value: 'Greek' },
  { label: 'Romanian', value: 'Romanian' },
  { label: 'Czech', value: 'Czech' },
  { label: 'Finnish', value: 'Finnish' },
  { label: 'Danish', value: 'Danish' },
  { label: 'Norwegian', value: 'Norwegian' },
  // { label: 'Hebrew', value: 'he' },
  { label: 'Hungarian', value: 'Hungarian' },
  { label: 'Swahili', value: 'Swahili' },
];

const levels = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const Listbox = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full py-3 bg-white bg-opacity-20 rounded-lg text-white font-semibold flex items-center justify-between px-4"
        onClick={toggleOpen}
      >
        {value.label}
        <ChevronDown className={`w-5 h-5 text-yellow-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bg-white bg-opacity-20 backdrop-blur-lg rounded-lg mt-2 z-10 w-full max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="block w-full py-2 px-4 hover:bg-white hover:bg-opacity-30 transition-colors text-left"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-blue-200 mb-2">{t("Language")} : {course.language}</p>
      <p className="text-blue-200 mb-2">{t("Level")} : {course.level}</p>
      <button
        onClick={() => navigate(`/course/${course.id}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        View Course
      </button>
    </div>
  );
};

const RequestPage = () => {
  const [request, setRequest] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [courses, setCourses] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=6Lea3F0qAAAAANYONoP3SokfRw6_uttL5OGhYGqI`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Lea3F0qAAAAANYONoP3SokfRw6_uttL5OGhYGqI', { action: 'generate_gpt_course' })
          .then(token => resolve(token))
          .catch(error => reject(error));
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha();
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(t('User not found, please log in.'));
        return;
      }      
      const response = await fetch('https://bagelapi.bagelcademy.org/courses/course-generation/generate_gpt_course/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: request,
          language: selectedLanguage.value,
          level: selectedLevel.value,
          recaptcha_token: recaptchaToken,
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
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-6"
        >
          {t('Explore the Universe of Knowledge')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-blue-200 text-center mb-8"
        >
          {t("Ask what you can't find, and let curiosity be your guide!")}
        </motion.p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.textarea
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder={t('What knowledge are you seeking?')}
            className="w-full p-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          />

          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex-1"
            >
              <Listbox value={selectedLanguage} onChange={setSelectedLanguage} options={languages} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex-1"
            >
              <Listbox value={selectedLevel} onChange={setSelectedLevel} options={levels} />
            </motion.div>
          </div>
          <button
            disabled={isSubmitting || !request.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            type="submit"
          >
            {isSubmitting ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              <>
                <span>{t('Launch Your Question')}</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mt-4 p-3 rounded-lg text-center ${
              submitStatus === 'success'
                ? 'bg-green-500 text-white'
                : submitStatus === 'no_credit'
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {submitStatus === 'success' ? (
              t('Your quest for knowledge has begun!')
            ) : submitStatus === 'no_credit' ? (
              <>
                {t('You do not have enough credit. Please purchase more.')}{' '}
                <button
                  onClick={() => navigate('/shop')}
                  className="no-underline text-blue-200 hover:text-blue-400"
                >
                  {t('Go to Shop')}
                </button>
              </>
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