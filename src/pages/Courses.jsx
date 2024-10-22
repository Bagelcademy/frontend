// Courses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import CourseCard from '../components/ui/coursecard';
import '../css/courses.css';
import { useTranslation } from 'react-i18next'; 
import { useSnackbar } from 'notistack';

const ITEMS_PER_PAGE = 20;

const Courses = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, courses, page]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://bagelapi.artina.org//courses/courses/get_all_courses/');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      enqueueSnackbar(t('Failed to fetch courses. Please try again later.'), { variant: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://bagelapi.artina.org/courses/Category/');
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

    setDisplayedCourses(filtered.slice(0, page * ITEMS_PER_PAGE));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
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
  const selectRef = useRef(null);

  return (
     <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in-down">{t('Courses')}</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="md:w-1/4 relative z-[1000]">
            <Select onValueChange={handleCategoryChange} value={selectedCategory}>
              <SelectTrigger className="w-full border border-borderColor dark:border-gray-700">
                <SelectValue placeholder={t('Select Category')} />
              </SelectTrigger>
              <SelectContent 
                className="absolute bg-lightBackground dark:bg-darkBackground shadow-lg rounded-md overflow-hidden"
                style={{
                  zIndex: 1001,
                  minWidth: '100%',
                  top: 'calc(100% + 5px)',
                  left: 0,
                }}
              >
                <SelectItem value="">{t('All Categories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="text"
            placeholder={t('Search courses...')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="md:w-1/2 border border-borderColor dark:border-gray-700"
          />
          <Button 
            onClick={handleAskClick} 
            className="md:w-1/4 bg-buttonColor text-white py-2 px-4 rounded relative overflow-hidden animate-light-effect"
          >
            {t("Didn't you find what you were looking for?")}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-light-move"></span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {displayedCourses.length < courses.length && (
          <div className="mt-8 text-center">
            <Button onClick={handleLoadMore} className="bg-buttonColor text-white py-2 px-4 rounded">
              {t('Load More')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;