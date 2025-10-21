import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  FileText, 
  Github, 
  ExternalLink, 
  Upload, 
  Download, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Plus,
  X,
  Eye
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
  const [language, setLanguage] = useState('en');
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state for generated resume
  const [generatedResume, setGeneratedResume] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      enqueueSnackbar(t('Please log in to access this feature.'), { variant: 'info' });
      navigate('/login');
      return;
    }
    
    fetchUserCourses();
    fetchUserCredits();
  }, []);

  const fetchUserCourses = async () => {
    try {
      const response = await fetch('https://api.tadrisino.org/courses/courses/get_user_courses/', {
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
      const response = await fetch('https://api.tadrisino.org/account/user-info/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setUserCredits(data.credit || 0);
    } catch (error) {
      console.error("Error fetching user credits:", error);
      enqueueSnackbar(t('Failed to fetch your credits.'), { variant: 'error' });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Accept more file types including plain text files
      const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setResumeFile(file);
        enqueueSnackbar(t('Resume uploaded successfully!'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('Please upload a PDF, DOCX, DOC, or TXT file.'), { variant: 'error' });
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

  // Calculate progress percentage based on completed lessons
  const calculateProgress = (courseData) => {
    const { course, progress } = courseData;
    const totalLessons = course.lesson_count || 0;
    const completedLessons = progress.completed_lessons ? progress.completed_lessons.length : 0;
    
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const handleGenerateResume = async () => {
    console.log('Generate button clicked!');
    
    // Validate required fields
    if (!jobOfferLink) {
      enqueueSnackbar(t('Job offer link is required.'), { variant: 'error' });
      return;
    }

    if (!resumeFile) {
      enqueueSnackbar(t('Please upload your current CV/resume file.'), { variant: 'error' });
      return;
    }

    if (!githubLink) {
      enqueueSnackbar(t('GitHub profile link is required.'), { variant: 'error' });
      return;
    }

    if (userCredits < 1) {
      enqueueSnackbar(t('Insufficient credits. You need at least 1 credit to enhance your CV.'), { variant: 'error' });
      return;
    }

    console.log('All validations passed, starting generation...');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Add required fields based on the Django API
      formData.append('job_url', jobOfferLink);
      formData.append('github_url', githubLink);
      formData.append('last_resume', resumeFile);
      formData.append('language', language);
      
      // Add selected courses as array (if the API supports it)
      const selectedCourseNames = userCourses
        .filter(courseData => selectedCourses.includes(courseData.course.id))
        .map(courseData => courseData.course.title);
      
      selectedCourseNames.forEach(courseName => {
        formData.append('courses[]', courseName);
      });

      console.log('Form data prepared, making generation API call...');

      const response = await fetch('https://api.tadrisino.org/courses/Resume/generate_resume/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      console.log('Generation API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Generation successful:', data);
        
        setGeneratedResume({
          id: data.resume_id,
          text: data.text,
          message: data.message
        });
        
        enqueueSnackbar(t('Your resume has been generated successfully!'), { variant: 'success' });
        fetchUserCredits(); // Refresh credits
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Generation API Error:', errorData);
        throw new Error(errorData.error || 'Failed to generate resume');
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      enqueueSnackbar(t('Failed to generate resume: ') + error.message, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!generatedResume?.id) {
      enqueueSnackbar(t('No resume available for download.'), { variant: 'error' });
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(`https://api.tadrisino.org/courses/Resume/${generatedResume.id}/get_pdf/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `enhanced_resume.${outputFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        enqueueSnackbar(t('Resume downloaded successfully!'), { variant: 'success' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download resume');
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
      enqueueSnackbar(t('Failed to download resume: ') + error.message, { variant: 'error' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartOver = () => {
    setGeneratedResume(null);
    setResumeFile(null);
    setJobOfferLink('');
    setGithubLink('');
    setSelectedCourses([]);
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
">
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
          <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-4 mb-6">
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
          
          {/* Generated Resume Display */}
          {generatedResume && (
            <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('Resume Generated Successfully')}
                  </h2>
                </div>
                <button
                  onClick={handleStartOver}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('Generated Resume Preview')}
                </h3>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                  {generatedResume.text}
                </pre>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('Downloading...')}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>{t('Download PDF')}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleStartOver}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>{t('Generate Another')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Form - Hide when resume is generated */}
          {!generatedResume && (
            <div className="space-y-8">
              
              {/* Resume Upload - Now Required */}
              <div className="bg-white dark:bg-gradient-to-br dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('Current Resume')} <span className="text-sm text-red-500">*</span>
                  </h2>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
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
                      {resumeFile ? resumeFile.name : t('Click to upload your resume (PDF, DOCX, DOC, or TXT)')}
                    </span>
                  </label>
                </div>
                
                
              </div>

              {/* Job Offer Link */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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

              {/* GitHub Link - Now Required */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('GitHub Profile')} <span className="text-sm text-red-500">*</span>
                  </h2>
                </div>
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder={t('https://github.com/yourusername')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Course Selection */}
              <div className="bg-white dark:bg-gradient-to-br dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('Your Courses')} <span className="text-sm text-gray-500">({t('Optional')})</span>
                  </h2>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {userCourses.map(courseData => {
                    const progress = calculateProgress(courseData);
                    const courseId = courseData.course.id;
                    
                    return (
                      <div
                        key={courseId}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedCourses.includes(courseId)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => toggleCourseSelection(courseId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {courseData.course.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {courseData.course.level} • {courseData.course.language} • {courseData.course.lesson_count} lessons
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(progress)}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {progress}%
                              </span>
                            </div>
                            {courseData.progress.course_completed && (
                              <div className="flex items-center space-x-1 mt-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600 dark:text-green-400">
                                  {t('Completed')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            {selectedCourses.includes(courseId) ? (
                              <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Plus className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {userCourses.length === 0 && (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {t('No courses found. Enroll in courses to include them in your CV.')}
                    </p>
                  </div>
                )}
                
                {selectedCourses.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('Selected {{count}} course(s) to include in your CV', { count: selectedCourses.length })}
                    </p>
                  </div>
                )}
              </div>

              {/* Language Selection */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('Resume Language')}
                </h2>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="en"
                      checked={language === 'en'}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{t('English')}</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="fa"
                      checked={language === 'fa'}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{t('Persian/Farsi')}</span>
                  </label>
                </div>
              </div>

              {/* Output Format */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100
 rounded-lg shadow-md p-6">
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

              {/* Generate Button */}
              <div className="text-center ">
                <button
                  type="button"
                  onClick={handleGenerateResume}
                  disabled={isSubmitting || userCredits < 1 || !resumeFile || !jobOfferLink || !githubLink}
                  className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isSubmitting || userCredits < 1 || !resumeFile || !jobOfferLink || !githubLink
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('Generating Resume...')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>{t('Generate Resume')}</span>
                    </div>
                  )}
                </button>
                
                {userCredits < 1 && (
                  <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                    {t('You need at least 1 credit to generate a resume')}
                  </p>
                )}
                
                {(!resumeFile || !jobOfferLink || !githubLink) && userCredits >= 1 && (
                  <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                    {t('Please upload your resume, provide a job offer link, and GitHub profile')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVEnhancer;