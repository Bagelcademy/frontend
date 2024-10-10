import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { BookOpen, Award, Zap } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const MyCourses = () => {
  const { t } = useTranslation(); // Use translation hook
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, courses, page]);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://bagelapi.artina.org//courses/courses/get_user_courses/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.course.category === parseInt(selectedCategory));
    }

    setDisplayedCourses(filtered.slice(0, page * ITEMS_PER_PAGE));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleExploreClick = () => {
    navigate('/courses');
  };

  const CourseCard = ({ item }) => {
    const { course, progress } = item;
    const completionPercentage = (progress.completed_lessons.length / course.total_lessons) * 100;

    return (
      <Card className="w-full border border-borderColor dark:border-gray-700 bg-lightBackground dark:bg-gray-800 transition-transform transform hover:scale-105">
        <CardHeader>
          <img src={course.image_url} alt={course.title} className="w-full h-32 object-cover rounded-t-md" />
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mt-2">
            <BookOpen className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{course.level} • {course.language}</span>
          </div>
          <div className="mt-4">
            <Progress value={completionPercentage} className="w-full" />
            <p className="text-sm mt-2">{t('complete', { percentage: completionPercentage.toFixed(0) })}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-sm">{t('points', { points: progress.total_score })}</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-sm">{t('streak', { streak: progress.streak })}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate(`/course/${course.id}`)}
            className="w-full bg-buttonColor text-white py-2 px-4 rounded"
          >
            {t('continueLearning')}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in-down">{t('myCourses')}</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="md:w-1/2 border border-borderColor dark:border-gray-700"
          />
          <Select onValueChange={handleCategoryChange} value={selectedCategory} className="md:w-1/4">
            <SelectTrigger className="border border-borderColor dark:border-gray-700">
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent className="bg-lightBackground dark:bg-darkBackground">
              <SelectItem value="">{t('allCategories')}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExploreClick} 
            className="md:w-1/4 bg-buttonColor text-white py-2 px-4 rounded relative overflow-hidden animate-light-effect"
          >
            {t('exploreCourses')}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-light-move"></span>
          </Button>
        </div>

        {displayedCourses.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">{t('noCourses')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCourses.map(item => (
              <CourseCard key={item.course.id} item={item} />
            ))}
          </div>
        )}

        {displayedCourses.length < courses.length && (
          <div className="mt-8 text-center">
            <Button onClick={handleLoadMore} className="bg-buttonColor text-white py-2 px-4 rounded">
              {t('loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
