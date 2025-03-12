import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, Code, Brain, Check, ChevronRight, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const TeacherWaitlist = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    phone_number: '',
    degree: '',
    subject: '',
    course_price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Animation effect for the icons
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      enqueueSnackbar(t('Please log in to apply as a teacher.'), { variant: 'info' });
      navigate('/login', { state: { from: '/teacher-waitlist' } });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://bagelapi.bagelcademy.org/account/teacher-waiting-list/apply/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        enqueueSnackbar(t('Application submitted successfully! We will contact you soon.'), { variant: 'success' });
      } else {
        enqueueSnackbar(t(data.detail || 'Failed to submit application. Please try again.'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting teacher application:', error);
      enqueueSnackbar(t('Network error. Please check your connection and try again.'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const AnimatedIcon = ({ step, icons }) => {
    const IconComponent = icons[step];
    return (
      <div className="transition-all duration-500 transform hover:scale-110">
        <IconComponent size={32} className="text-white" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Join Our Teaching Team')} | Bagelcademy</title>
        <meta name="description" content={t('Apply to become a teacher at Bagelcademy and share your knowledge with our AI-powered learning platform.')} />
        <meta property="og:title" content={`${t('Become a Teacher')} | Bagelcademy`} />
        <meta property="og:description" content={t('Apply to become a teacher at Bagelcademy and share your knowledge with our AI-powered learning platform.')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('Become a Teacher')} | Bagelcademy`} />
        <meta name="twitter:description" content={t('Apply to become a teacher at Bagelcademy and share your knowledge with our AI-powered learning platform.')} />
        <meta name="keywords" content="teaching, education, online courses, AI learning, technology education" />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            {t('Join Our Teaching Community')}
          </h1>
          
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-white text-xl opacity-90">
              {t('Share your expertise on our AI-powered learning platform and help shape the future of education')}
            </p>
          </div>

        
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gradient-to-b from-blue-500 to-purple-600 p-6 md:w-1/3 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold text-white mb-6">{t('Why Teach With Us?')}</h2>
              <ul className="space-y-4">
                <li className="flex items-center text-white">
                  <Check className="mr-2 flex-shrink-0" />
                  <span>{t('AI-Enhanced Learning Tools')}</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="mr-2 flex-shrink-0" />
                  <span>{t('Global Student Reach')}</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="mr-2 flex-shrink-0" />
                  <span>{t('Flexible Teaching Schedule')}</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="mr-2 flex-shrink-0" />
                  <span>{t('Competitive Compensation')}</span>
                </li>
              </ul>
            </div>

            <div className="p-6 md:p-8 md:w-2/3">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                {t('Apply to Join the Waitlist')}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone_number">
                    {t('Phone Number')}*
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('Your contact number')}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="degree">
                    {t('Highest Degree')}*
                  </label>
                  <select
                    id="degree"
                    name="degree"
                    required
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('Select your degree')}</option>
                    <option value="bachelors">{t('Bachelor\'s Degree')}</option>
                    <option value="masters">{t('Master\'s Degree')}</option>
                    <option value="phd">{t('PhD')}</option>
                    <option value="professional">{t('Professional Certification')}</option>
                    <option value="other">{t('Other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="subject">
                    {t('Subject/Course to Teach')}*
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('e.g., Machine Learning, Web Development, Data Science')}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="course_price">
                    {t('Expected Course Price')}*
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">$</span>
                    <input
                      id="course_price"
                      name="course_price"
                      type="number"
                      min="0"
                      required
                      value={formData.course_price}
                      onChange={handleChange}
                      className="w-full pl-8 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('Suggested price for your course')}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Server className="animate-spin mr-2" />
                        {t('Submitting...')}
                      </>
                    ) : (
                      <>
                        {t('Submit Application')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {t('The Bagelcademy Teaching Experience')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Brain className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('AI-Powered Teaching')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('Leverage our AI tools to create interactive and personalized learning experiences')}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <BookOpen className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('Expert Community')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('Join a network of leading educators and tech professionals from around the world')}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Code className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('Cutting-Edge Platform')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('Teach on a modern platform built with the latest technology to enhance the learning experience')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherWaitlist;