import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, BookOpen, Users, Star, Filter, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import CourseCard from '../components/ui/coursecard'

const Courses = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Create refs for the dropdowns
  const categoryDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Define the language mapping similar to the completion status
  const languageMapping = {
    "English": t("languages.english"),
    "Persian": t("languages.persian"),
    "": t("languages.allLanguages")
  };

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, selectedLanguage, courses, page]);

  // Add event listener for clicks outside the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close category dropdown if click is outside
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Close language dropdown if click is outside
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    // Add event listener when dropdowns are open
    if (isDropdownOpen || isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isLanguageDropdownOpen]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8000/courses/courses/get_all_courses/');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      enqueueSnackbar(t('Failed to fetch courses. Please try again later.'), { variant: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/courses/Category/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      enqueueSnackbar(t('Failed to fetch categories. Please try again later.'), { variant: 'error' });
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(course => course.language === selectedLanguage);
    }

    setDisplayedCourses(filtered.slice(0, page * ITEMS_PER_PAGE));
  };

  const handleAskClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      enqueueSnackbar(t('Please log in to access this feature.'), { variant: 'info' });
      navigate('/login');
    } else {
      navigate('/ask');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('Discover Your Next Learning Journey')} | Tadrisino</title>
        <meta name="description" content={t('Browse through our extensive collection of courses and find your perfect learning path.')} />
        <meta property="og:title" content={`${t('Discover Your Next Learning Journey')} | Tadrisino`} />
        <meta property="og:description" content={t('Browse through our extensive collection of courses and find your perfect learning path.')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('Discover Your Next Learning Journey')} | Tadrisino`} />
        <meta name="twitter:description" content={t('Browse through our extensive collection of courses and find your perfect learning path.')} />
        {selectedCategory && categories.find(c => c.id === selectedCategory)?.name && (
          <meta name="keywords" content={`courses, learning, education, ${t(`categories.${categories.find(c => c.id === selectedCategory)?.name}`)}, ${selectedLanguage || 'all languages'}`} />
        )}
      </Helmet>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            {t('Discover Your Next Learning Journey')}
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder={t('Search courses...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pl-12 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <Filter className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-black dark:text-white">{selectedCategory ? t(`categories.${categories.find(c => c.id === selectedCategory)?.name}`) : t('All Categories')}</span>
                  <ChevronDown className="w-4 h-4 text-black dark:text-white" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 bg-white text-black dark:bg-gray-800 dark:text-white"
                      >
                        {t('All Categories')}
                      </button>
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 bg-white text-black dark:bg-gray-800 dark:text-white"
                        >
                          {t(`categories.${category.name}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-black dark:text-white">
                    {languageMapping[selectedLanguage] || languageMapping[""]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-black dark:text-white" />
                </button>
                
                {isLanguageDropdownOpen && (
                  <div className="absolute mt-2 w-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setSelectedLanguage('');
                          setIsLanguageDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 bg-white text-black dark:bg-gray-800 dark:text-white"
                      >
                        {languageMapping[""]}
                      </button>
                      {Object.entries(languageMapping).map(([key, value]) => {
                        if (key !== "") {
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setSelectedLanguage(key);
                                setIsLanguageDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 bg-white text-black dark:bg-gray-800 dark:text-white"
                            >
                              {value}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAskClick}
                className="bg-white dark:bg-gray-800 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-blue-600 dark:text-blue-400"
              >
                {t("Didn't find what you're looking for?")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {displayedCourses.length < courses.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('Load More Courses')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;