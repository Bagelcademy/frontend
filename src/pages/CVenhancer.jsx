import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  FileText, 
  Github, 
  Link as LinkIcon, 
  Upload, 
  Download, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Plus,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const CVEnhancer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Form state
  const [githubLink, setGithubLink] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobOfferLink, setJobOfferLink] = useState('');
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    // if (!accessToken) {
    //   enqueueSnackbar(t('Please log in to access this feature.'), { variant: 'info' });
    //   navigate('/login');
    //   return;
    // }
    
    fetchUserCourses();
    fetchUserCredits();
  }, []);

  const fetchUserCourses = async () => {
    try {
      const response = await fetch('https://api.tadrisino.org/user/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setUserCourses(data);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      enqueueSnackbar(t('Failed to fetch your courses. Please try again later.'), { variant: 'error' });
    }
  };

  const fetchUserCredits = async () => {
    try {
      const response = await fetch('https://api.tadrisino.org/user/credit', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setUserCredits(data.credits || 0);
    } catch (error) {
      console.error("Error fetching user credits:", error);
      enqueueSnackbar(t('Failed to fetch your credits.'), { variant: 'error' });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setResumeFile(file);
        enqueueSnackbar(t('Resume uploaded successfully!'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('Please upload a PDF or DOCX file.'), { variant: 'error' });
      }
    }
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobOfferLink) {
      enqueueSnackbar(t('Job offer link is required.'), { variant: 'error' });
      return;
    }

    if (userCredits < 1) {
      enqueueSnackbar(t('Insufficient credits. You need at least 1 credit to enhance your CV.'), { variant: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('github_link', githubLink);
      formData.append('job_offer_link', jobOfferLink);
      formData.append('output_format', outputFormat);
      formData.append('selected_courses', JSON.stringify(selectedCourses));
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await fetch('https://api.tadrisino.org/CVenhancer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `enhanced_cv.${outputFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        enqueueSnackbar(t('Your enhanced CV has been generated successfully!'), { variant: 'success' });
        fetchUserCredits(); // Refresh credits
      } else {
        throw new Error('Failed to generate CV');
      }
    } catch (error) {
      console.error("Error generating CV:", error);
      enqueueSnackbar(t('Failed to generate CV. Please try again later.'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('CV Enhancer')} | Tadrisino</title>
        <meta name="description" content={t('Enhance your CV with AI-powered recommendations based on your courses and job requirements.')} />
        <meta property="og:title" content={`${t('CV Enhancer')} | Tadrisino`} />
        <meta property="og:description" content={t('Enhance your CV with AI-powered recommendations based on your courses and job requirements.')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('CV Enhancer')} | Tadrisino`} />
        <meta name="twitter:description" content={t('Enhance your CV with AI-powered recommendations based on your courses and job requirements.')} />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            {t('AI-Powered CV Enhancer')}
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            {t('Transform your resume with intelligent recommendations based on your learning journey and target job requirements.')}
          </p>
        </div>
      </div>

      {/* Credits Display */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{t('Available Credits')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userCredits}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({t('1 credit per enhancement')})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* GitHub Link */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('GitHub Profile')} <span className="text-sm text-gray-500">({t('Optional')})</span>
                </h2>
              </div>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder={t('https://github.com/yourusername')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('Current Resume')} <span className="text-sm text-gray-500">({t('Optional')})</span>
                </h2>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {resumeFile ? resumeFile.name : t('Click to upload your resume (PDF or DOCX)')}
                  </span>
                </label>
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/create-resume"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("Don't have a resume? Create one here")}
                </Link>
              </div>
            </div>

            {/* Job Offer Link */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('Job Offer Link')} <span className="text-sm text-red-500">*</span>
                </h2>
              </div>
              <input
                type="url"
                value={jobOfferLink}
                onChange={(e) => setJobOfferLink(e.target.value)}
                placeholder={t('https://company.com/job-posting')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Course Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('Your Courses')}
                </h2>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {userCourses.map(course => (
                  <div
                    key={course.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCourses.includes(course.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => toggleCourseSelection(course.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedCourses.includes(course.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCourses.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t('Selected {{count}} course(s) to include in your CV', { count: selectedCourses.length })}
                  </p>
                </div>
              )}
            </div>

            {/* Output Format */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('Output Format')}
              </h2>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="pdf"
                    checked={outputFormat === 'pdf'}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">PDF</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="docx"
                    checked={outputFormat === 'docx'}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">DOCX</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || userCredits < 1}
                className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isSubmitting || userCredits < 1
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('Enhancing CV...')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>{t('Enhance My CV')}</span>
                  </div>
                )}
              </button>
              
              {userCredits < 1 && (
                <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                  {t('You need at least 1 credit to enhance your CV')}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVEnhancer;