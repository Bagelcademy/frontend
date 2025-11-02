import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Award, Zap, Search, Users,
  Download, ChevronRight, Star, Filter, Globe2, Briefcase, ChevronLeft, ChevronDown, X
} from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import CertificateModal from '../components/ui/CertificateModal';
import CourseCard from '../components/ui/MyCourses_CourseCard';
// import RecommendedCourseCard from '../components/ui/RecommendedCourseCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LearningPathCard from '../components/ui/MyCourses_LearningPathCard';

const COURSES_PER_SECTION = 4;

const MyCourses = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [paths, setPaths] = useState([]);
  const [displayedPaths, setDisplayedPaths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategoryId, setFilteredCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [certificateModal, setCertificateModal] = useState({
    isOpen: false,
    courseId: null,
    courseName: '',
    isLoading: false,
    certificateUrl: null
    ,alreadyGenerated: false
  });
  
  // Pagination states
  const [completedCoursesPage, setCompletedCoursesPage] = useState(1);
  const [inProgressCoursesPage, setInProgressCoursesPage] = useState(1);
  const [recommendedCoursesPage, setRecommendedCoursesPage] = useState(1);
  
  const isRtl = i18n.language === 'fa';
  const categoryDropdownRef = useRef(null);

  const motivationalQuotes = [
    { quote: t('motivationalQuotes.quote1'), author: t('motivationalQuotes.author1') },
    { quote: t('motivationalQuotes.quote2'), author: t('motivationalQuotes.author2') },
    { quote: t('motivationalQuotes.quote3'), author: t('motivationalQuotes.author3') },
    { quote: t('motivationalQuotes.quote4'), author: t('motivationalQuotes.author4') },
    { quote: t('motivationalQuotes.quote5'), author: t('motivationalQuotes.author5') }
  ];
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    fetchMyCourses();
    fetchRecommendedCourses();
    fetchCategories();
    fetchUserProfile();
    fetchPaths();
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current && 
        !categoryDropdownRef.current.contains(event.target) &&
        isCategoryDropdownOpen
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.tadrisino.org/account/user-info/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.tadrisino.org/courses/courses/get_user_courses/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCourses(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

const fetchRecommendedCourses = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('https://api.tadrisino.org/courses/Recommend/shuffled_by_user_interests/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    console.log('API Response:', data); // Debug log to see the actual structure
    
    // Handle the nested structure from the API dynamically
    let allRecommendations = [];
    
    // Extract courses from all categories dynamically
    Object.keys(data).forEach(categoryKey => {
      if (Array.isArray(data[categoryKey]) && data[categoryKey].length > 0) {
        allRecommendations = [...allRecommendations, ...data[categoryKey]];
      }
    });
    
    console.log('All recommendations:', allRecommendations); // Debug log
    
    // Remove duplicates based on course ID
    const uniqueRecommendations = allRecommendations.filter((course, index, self) => 
      index === self.findIndex((c) => c.id === course.id)
    );
    
    // Sort by enroll_count in descending order
    const sortedRecommendations = uniqueRecommendations.sort((a, b) => (b.enroll_count || 0) - (a.enroll_count || 0));
    
    console.log('Final recommendations:', sortedRecommendations); // Debug log
    
    setRecommendedCourses(sortedRecommendations);
  } catch (error) {
    console.error('Failed to fetch recommended courses:', error);
  }
};

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.tadrisino.org/courses/Category/');
      const data = await response.json();
      const translatedCategories = data.map(category => ({
        ...category,
        translatedName: t(`categories.${category.name}`)
      }));
      setCategories(translatedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

const fetchPaths = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`https://api.tadrisino.org/courses/paths/my-enrollments/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch paths');

    const data = await response.json();
    console.log("Fetched paths data:", data);
    const detailPromises = data.map(p => 
      fetch(`https://api.tadrisino.org/courses/learning-paths/${p.learning_path_id}/`
      ).then(res => res.json())
    );
    const details = await Promise.all(detailPromises);
    const merged = data.map((p, idx) =>({
      ...p,
      ...details[idx],
    }));
    setPaths(merged);
    setDisplayedPaths(merged);
  } catch (error) {
    console.error("Error fetching paths:", error);
    console.error(t('Failed to fetch paths. Please try again later.'));
  } finally {
    setIsLoading(false);
  }
};

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilteredCategoryId(categoryId);
    // Reset pagination when filter changes
    setCompletedCoursesPage(1);
    setInProgressCoursesPage(1);
  };

  const handleDownloadNotes = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.tadrisino.org/courses/user-notes/export-notes-pdf/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download notes');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'course-notes.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading notes:', error);
    }
  };

  const handleCertificateRequest = (courseId, courseName, gotCertificate, certificateUrl) => {
    setCertificateModal({
      isOpen: true,
      courseId,
      courseName,
      isLoading: false,
      certificateUrl: certificateUrl || null,
      alreadyGenerated: !!gotCertificate
    });
  };

  const handleCertificateSubmit = async (name) => {
    setCertificateModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.tadrisino.org/courses/Certificate/generate_certificate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: certificateModal.courseId,
          name: name
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        setCertificateModal(prev => ({ 
          ...prev, 
          isLoading: false,
          certificateUrl: responseData.url || responseData.certificate_url
        }));
      } else {
        const errorData = await response.json();
        alert(t('Failed to request certificate: ') + (errorData.message || t('Unknown error')));
        setCertificateModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error requesting certificate:', error);
      alert(t('Failed to request certificate. Please try again.'));
      setCertificateModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCertificateModalClose = () => {
    if (!certificateModal.isLoading) {
      setCertificateModal({ 
        isOpen: false, 
        courseId: null, 
        courseName: '', 
        isLoading: false,
        certificateUrl: null 
      });
    }
  };

  // Filter courses based on search and category
  const getFilteredCourses = () => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filteredCategoryId) {
      filtered = filtered.filter(item => {
        return item.course.category === parseInt(filteredCategoryId, 10) || 
               item.course.category === filteredCategoryId;
      });
    }

    return filtered;
  };

  // Separate completed and in-progress courses
  const getCompletedCourses = () => {
    return getFilteredCourses().filter(item => item.progress.course_completed);
  };

  const getInProgressCourses = () => {
    return getFilteredCourses().filter(item => !item.progress.course_completed);
  };

  const getFilteredRecommendedCourses = () => {
    if (!searchTerm && !filteredCategoryId) {
      return recommendedCourses;
    }

    let filtered = [...recommendedCourses];

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filteredCategoryId) {
      filtered = filtered.filter(course => {
        return course.category === parseInt(filteredCategoryId, 10) || 
               course.category === filteredCategoryId;
      });
    }

    return filtered;
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const completedCourses = getCompletedCourses();
  const inProgressCourses = getInProgressCourses();
  const filteredRecommendedCourses = getFilteredRecommendedCourses();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateModal.isOpen}
        onClose={handleCertificateModalClose}
        onSubmit={handleCertificateSubmit}
        courseName={certificateModal.courseName}
        isLoading={certificateModal.isLoading}
        certificateUrl={certificateModal.certificateUrl}
        alreadyGenerated={certificateModal.alreadyGenerated}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={userProfile?.profile_picture}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-white mt-4 text-xl font-semibold">{t('welcomeBack', { username: userProfile?.first_name })}</h2>

            <div className="mt-4 text-center max-w-2xl">
              <p className="text-white/90 italic">"{t(quote.quote)}"</p>
              <p className="text-white/70 text-sm mt-2">- {t(quote.author)}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pl-12 rounded-lg bg-white dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className={`text-sm flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : 'text-left'}`}
                >
                  <Filter className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-black dark:text-white">
                    {filteredCategoryId ? 
                      t(`categories.${categories.find(c => c.id === parseInt(filteredCategoryId, 10) || c.id === filteredCategoryId)?.name}`) : 
                      t('All Categories')}
                  </span>
                  <ChevronDown className="w-4 h-4 text-black dark:text-white" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className={`absolute mt-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          handleCategoryChange('');
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white text-black dark:bg-gray-800 dark:text-white"
                      >
                        {t('All Categories')}
                      </button>
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategoryChange(category.id);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white text-black dark:bg-gray-800 dark:text-white"
                        >
                          {t(`categories.${category.name}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => navigate('/courses')}
                className="w-full md:w-auto bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-white/90"
              >
                {t('Explore More Courses')}
              </Button>
              <Button
                onClick={handleDownloadNotes}
                className="w-full md:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-white/90"
              >
                {t('Download Notes')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Completed Courses Section */}
        {completedCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('Finished Courses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.slice(0, completedCoursesPage * COURSES_PER_SECTION).map((item, index) => (
                <CourseCard key={`completed-${item.course.id}-${index}`} item={item} onRequestCertificate={handleCertificateRequest} />
              ))}
            </div>
            
            {completedCourses.length > completedCoursesPage * COURSES_PER_SECTION && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setCompletedCoursesPage(p => p + 1)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* In Progress Courses Section */}
        {inProgressCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('Unfinished Courses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.slice(0, inProgressCoursesPage * COURSES_PER_SECTION).map((item, index) => (
                <CourseCard key={`progress-${item.course.id}-${index}`} item={item} onRequestCertificate={handleCertificateRequest} />
              ))}
            </div>
            
            {inProgressCourses.length > inProgressCoursesPage * COURSES_PER_SECTION && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setInProgressCoursesPage(p => p + 1)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Courses Message */}
        {completedCourses.length === 0 && inProgressCourses.length === 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('My Courses')}</h2>
            <div className="text-center py-12">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 inline-flex mb-4">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('no Courses')}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('Try adjusting your search or filters')}
              </p>
            </div>
          </div>
        )}

        {/* Recommended Courses Section */}
        {/* {filteredRecommendedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('Recommended for You')}</h2>
              <div className="flex items-center text-orange-600 dark:text-orange-400">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{t('Based on your interests')}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendedCourses.slice(0, recommendedCoursesPage * COURSES_PER_SECTION).map((course) => (
                <RecommendedCourseCard key={`recommended-${course.id}`} course={course} />
              ))}
            </div>
            
            {filteredRecommendedCourses.length > recommendedCoursesPage * COURSES_PER_SECTION && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setRecommendedCoursesPage(p => p + 1)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </div>
        )} */}
        {/* LearningPaths */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('learningPath')}</h2>
          {displayedPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPaths.map(path => (
                <LearningPathCard key={path.learning_path_id} path={path} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 inline-flex mb-4">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('No Learning Paths')}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('-')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;